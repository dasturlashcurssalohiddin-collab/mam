import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const dbPath = path.join(process.cwd(), "src", "data", "db.json");
const cachePath = path.join(process.cwd(), "src", "data", "translation_cache.json");

// Ensure db directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// SSE Active Clients
let sseClients: any[] = [];

// Broadcast updated state to all connected panels
function broadcastState(state: any) {
  const data = JSON.stringify({ type: "state_update", state });
  sseClients.forEach((client) => {
    try {
      client.write(`data: ${data}\n\n`);
    } catch (err) {
      // Benign write error when a client disconnects unexpectedly
    }
  });
}

// Helper: load translation cache
async function getTranslationCache() {
  try {
    if (!fs.existsSync(cachePath)) return {};
    const data = await fs.promises.readFile(cachePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

// Helper: save translation cache
async function saveTranslationCache(cache: any) {
  try {
    await fs.promises.writeFile(cachePath, JSON.stringify(cache, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing translation cache:", err);
  }
}

// Function to read state from file
async function getState() {
  try {
    if (!fs.existsSync(dbPath)) {
      throw new Error("db.json not found");
    }
    const data = await fs.promises.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database", error);
    return null;
  }
}

// Function to write state to file
async function saveState(state: any) {
  try {
    await fs.promises.writeFile(dbPath, JSON.stringify(state, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving database", error);
    return false;
  }
}

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API: Get Current state
app.get("/api/state", async (req, res) => {
  const state = await getState();
  if (state) {
    res.json({ success: true, state });
  } else {
    res.status(500).json({ success: false, message: "State could not be read" });
  }
});

// API: Update full or partial state
app.post("/api/state/update", async (req, res) => {
  const currentState = await getState();
  if (!currentState) {
    return res.status(500).json({ success: false, message: "Database read error" });
  }

  const updatedState = { ...currentState, ...req.body };
  const success = await saveState(updatedState);

  if (success) {
    broadcastState(updatedState);
    res.json({ success: true, state: updatedState });
  } else {
    res.status(500).json({ success: false, message: "Database write error" });
  }
});

// API: Log a visit (for charts & stats)
app.post("/api/visit", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const { type, user } = req.body; // e.g. type="Kirish", user="Mehmon"
  const now = new Date();
  const timeStr = now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

  // Update visit list log
  if (!state.stats.visitsLog) {
    state.stats.visitsLog = [];
  }
  
  // To avoid duplicate guest visits on reload
  const isDuplicate = state.stats.visitsLog.slice(0, 5).some((log: any) => log.time === timeStr && log.user === user && log.type === type);
  if (!isDuplicate) {
    state.stats.visitsLog.unshift({ time: timeStr, type, user });
    if (state.stats.visitsLog.length > 50) state.stats.visitsLog.pop();
    
    // Increment metrics
    state.stats.totalVisits = (state.stats.totalVisits || 0) + 1;
    
    // Add real activity to visits hourly/daily/monthly charts to show dynamics
    const lastHourIdx = state.stats.hourlyVisits.length - 1;
    state.stats.hourlyVisits[lastHourIdx] = (state.stats.hourlyVisits[lastHourIdx] || 0) + 1;
  }

  state.stats.activeUsers = Math.max(1, sseClients.length);

  await saveState(state);
  broadcastState(state);
  res.json({ success: true, totalVisits: state.stats.totalVisits, activeUsers: state.stats.activeUsers });
});

// API: Auto-Login by IP address
app.get("/api/profile/auto-login", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
  
  if (!state.userProfiles) {
    state.userProfiles = {};
  }

  const phone = state.userProfiles[clientIp];
  if (phone) {
    const profile = (state.profiles && state.profiles[phone]) || {};
    res.json({
      success: true,
      phone,
      name: profile.name || "",
      hasPassword: !!profile.password
    });
  } else {
    res.json({ success: false });
  }
});

// API: Check if a phone has password set
app.get("/api/profile/check-auth", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const phone = (req.query.phone || "").toString().trim();
  if (!phone) {
    return res.status(400).json({ success: false, message: "Telefon raqami kiritilmagan" });
  }

  const profile = (state.profiles && state.profiles[phone]) || {};
  res.json({
    success: true,
    hasPassword: !!profile.password,
    name: profile.name || "",
    password: profile.password || ""
  });
});

// API: Login with password
app.post("/api/profile/login-with-password", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const { phone, password } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: "Telefon raqami kiritilmagan" });
  }

  const profile = (state.profiles && state.profiles[phone]) || {};
  if (!profile.password) {
    return res.status(400).json({ success: false, message: "Profil paroli kiritilmagan" });
  }

  if (profile.password !== password) {
    return res.status(401).json({ success: false, message: "Noto'g'ri parol!" });
  }

  const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();

  if (!state.userProfiles) {
    state.userProfiles = {};
  }
  state.userProfiles[clientIp] = phone;

  // Log as real user visit
  const now = new Date();
  const timeStr = now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

  if (!state.stats.visitsLog) {
    state.stats.visitsLog = [];
  }
  state.stats.visitsLog.unshift({ time: timeStr, type: "Kirish", user: `👤 ${phone}` });
  if (state.stats.visitsLog.length > 50) state.stats.visitsLog.pop();

  state.stats.totalVisits = (state.stats.totalVisits || 0) + 1;

  await saveState(state);
  broadcastState(state);

  res.json({ success: true, phone, name: profile.name || "" });
});

// API: Update or Create Profile Info (Name/Password)
app.post("/api/profile/update", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const { phone, name, password } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: "Telefon raqami kiritilmagan" });
  }

  if (!state.profiles) {
    state.profiles = {};
  }

  state.profiles[phone] = {
    ...state.profiles[phone],
    name: name || "",
    password: password || "" // Empty password means no password set
  };

  await saveState(state);
  broadcastState(state);
  res.json({ success: true });
});

// API: Save Profile IP -> Phone mapping
app.post("/api/profile/save", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: "Telefon raqami kiritilmagan" });
  }

  const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();

  if (!state.userProfiles) {
    state.userProfiles = {};
  }

  state.userProfiles[clientIp] = phone;

  // Log as a real user visit
  const now = new Date();
  const timeStr = now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

  if (!state.stats.visitsLog) {
    state.stats.visitsLog = [];
  }
  
  state.stats.visitsLog.unshift({ time: timeStr, type: "Kirish", user: `👤 ${phone}` });
  if (state.stats.visitsLog.length > 50) state.stats.visitsLog.pop();

  state.stats.totalVisits = (state.stats.totalVisits || 0) + 1;

  await saveState(state);
  broadcastState(state);
  res.json({ success: true, phone });
});

// API: Delete Profile IP -> Phone mapping (Complete Profile Deletion)
app.post("/api/profile/delete", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();

  let phoneDeleted = "";
  if (state.userProfiles && state.userProfiles[clientIp]) {
    phoneDeleted = state.userProfiles[clientIp];
    delete state.userProfiles[clientIp];
  }

  if (phoneDeleted && state.profiles && state.profiles[phoneDeleted]) {
    delete state.profiles[phoneDeleted];
  }

  await saveState(state);
  broadcastState(state);
  res.json({ success: true, message: "Profil muvaffaqiyatli o'chirildi" });
});

// API: Track product views
app.post("/api/analytics/product-view", async (req, res) => {
  const state = await getState();
  if (!state) return res.status(500).json({ success: false });

  const { phone, productName, category } = req.body;
  if (!state.stats.productViews) {
    state.stats.productViews = [];
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

  // Prevent spamming the same product view by the same user within 2 seconds
  const isSpam = state.stats.productViews.slice(0, 3).some((view: any) => 
    view.phone === phone && view.productName === productName && view.time === timeStr
  );

  if (!isSpam) {
    state.stats.productViews.unshift({
      id: Date.now().toString() + "-" + Math.random().toString().substring(2, 6),
      phone: phone || "Mehmon",
      productName,
      category,
      time: timeStr
    });

    if (state.stats.productViews.length > 100) {
      state.stats.productViews.pop();
    }

    await saveState(state);
    broadcastState(state);
  }

  res.json({ success: true });
});

// API: Server Side Text-to-Speech (using gemini-3.1-flash-tts-preview)
app.post("/api/tts", async (req, res) => {
  const { text, voice = "Kore" } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: "Matn taqdim etilmadi (Text required)" });
  }

  try {
    const ai = getAi();
    // Prebuilt voices supported by model: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const cleanVoice = ["Puck", "Charon", "Kore", "Fenrir", "Zephyr"].includes(voice) ? voice : "Kore";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Read this naturally and conversationally, like a real waiter describing a delicious dish to a customer in a warm, friendly restaurant — not robotic, not overly formal, with natural intonation, rhythm, and normal human speed. Speak at a completely natural, fluent talking pace. Do not stretch, drag out, or over-emphasize any single syllable or word. Read with a warm, conversational, friendly human tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: cleanVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ success: true, audio: base64Audio });
    } else {
      res.status(500).json({ success: false, message: "Ovozli ma'lumot generatsiya qilinmadi (TTS generation empty)" });
    }
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    res.status(500).json({ success: false, message: error.message || "Gemini TTS error" });
  }
});

// Helper: update active user count dynamically based on sse connections
async function updateActiveUsersCount() {
  const state = await getState();
  if (state) {
    state.stats.activeUsers = Math.max(1, sseClients.length);
    await saveState(state);
    broadcastState(state);
  }
}

// API: Server-Sent Events (SSE) for Real-Time synchronization across multiple panels/devices
app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.push(res);
  updateActiveUsersCount();

  // Keep connection alive with simple heartbeat comment every 30 seconds
  const heartbeat = setInterval(() => {
    res.write(": keepalive\n\n");
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients = sseClients.filter((client) => client !== res);
    updateActiveUsersCount();
  });
});

// Helper: Google Cloud Translation API implementation
async function translateWithGoogle(texts: string[], targetLang: string, apiKey: string): Promise<string[]> {
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: texts,
        target: targetLang,
        source: "uz",
        format: "text"
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Translate API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const googleTranslations = data?.data?.translations;
    if (!googleTranslations || !Array.isArray(googleTranslations)) {
      throw new Error("Invalid response format from Google Translate API");
    }

    return googleTranslations.map((t: any) => t.translatedText);
  } catch (err: any) {
    console.error("Google Cloud Translation API call failed:", err.message);
    throw err;
  }
}

// Helper: Gemini API Translation implementation as fallback
async function translateWithGemini(texts: string[], targetLang: string): Promise<string[]> {
  const ai = getAi();
  const prompt = `You are an expert restaurant digital menu and localization specialist. Translate the following list of Uzbek words, names, and descriptions into "${targetLang}".
Keep any technical markup, emojis, or punctuation intact. Return the translations as a raw JSON array of strings in the exact same index order.
Do NOT wrap the response in markdown backticks, and do NOT include any explanations or conversational chatter.

Input Uzbek Strings:
${JSON.stringify(texts)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
  });

  const responseText = response.text?.trim() || "";
  const cleanedResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleanedResponse);
  if (!Array.isArray(parsed)) {
    throw new Error("Gemini translation did not return a valid array of strings");
  }
  return parsed;
}

function latinToCyrillic(text: string): string {
  if (!text) return text;
  let result = text;
  
  // 1. First, replace the apostrophe-based O' and G'
  result = result.replace(/O['’‘`ʼ]/g, "Ў");
  result = result.replace(/o['’‘`ʼ]/g, "ў");
  result = result.replace(/G['’‘`ʼ]/g, "Ғ");
  result = result.replace(/g['’‘`ʼ]/g, "ғ");
  
  // 2. Next, handle compound letters/combinations
  result = result.replace(/Sh/g, "Ш").replace(/SH/g, "Ш").replace(/sh/g, "ш");
  result = result.replace(/Ch/g, "Ч").replace(/CH/g, "Ч").replace(/ch/g, "ч");
  result = result.replace(/Yo/g, "Ё").replace(/YO/g, "Ё").replace(/yo/g, "ё");
  result = result.replace(/Yu/g, "Ю").replace(/YU/g, "Ю").replace(/yu/g, "ю");
  result = result.replace(/Ya/g, "Я").replace(/YA/g, "Я").replace(/ya/g, "я");
  result = result.replace(/Ye/g, "Е").replace(/YE/g, "Е").replace(/ye/g, "е");

  // 3. Word-initial "E" -> "Э" and after vowels
  result = result.replace(/\bE/g, "Э");
  result = result.replace(/\be/g, "э");

  // 4. Single letter mappings
  const mapping: { [key: string]: string } = {
    "A": "А", "a": "а",
    "B": "Б", "b": "б",
    "D": "Д", "d": "д",
    "E": "Е", "e": "е",
    "F": "Ф", "f": "ф",
    "G": "Г", "g": "г",
    "H": "Ҳ", "h": "ҳ",
    "I": "И", "i": "и",
    "J": "Ж", "j": "ж",
    "K": "К", "k": "к",
    "L": "Л", "l": "л",
    "M": "М", "m": "м",
    "N": "Н", "n": "н",
    "O": "О", "o": "о",
    "P": "П", "p": "п",
    "Q": "Қ", "q": "қ",
    "R": "Р", "r": "р",
    "S": "С", "s": "с",
    "T": "Т", "t": "т",
    "U": "У", "u": "у",
    "V": "В", "v": "в",
    "X": "Х", "x": "х",
    "Y": "Й", "y": "й",
    "Z": "З", "z": "з",
    "ʼ": "ъ", "'": "ъ", "’": "ъ"
  };

  let finalResult = "";
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    finalResult += mapping[char] !== undefined ? mapping[char] : char;
  }
  
  return finalResult;
}

// API: Batch Translation (using Google Cloud Translation API with Gemini fallback)
const handleTranslationRequest = async (req: any, res: any) => {
  const { texts, targetLang } = req.body;
  if (!texts || !Array.isArray(texts) || !targetLang) {
    return res.status(400).json({ success: false, message: "Invalid request payload (texts array and targetLang are required)" });
  }

  // Uzbek (default) needs no translation
  if (targetLang === "uz") {
    const identity: Record<string, string> = {};
    texts.forEach((text) => {
      identity[text] = text;
    });
    return res.json({ success: true, translations: identity });
  }

  // Uzbek Cyrillic (uz_cyr) translation can be performed using local transliteration
  if (targetLang === "uz_cyr") {
    const cyrillicTranslations: Record<string, string> = {};
    texts.forEach((text) => {
      cyrillicTranslations[text] = latinToCyrillic(text);
    });
    return res.json({ success: true, translations: cyrillicTranslations });
  }

  try {
    const cache = await getTranslationCache();
    const result: Record<string, string> = {};
    const toTranslate: string[] = [];

    // Filter texts: retrieve from cache or queue for translation
    texts.forEach((rawText) => {
      const text = rawText ? rawText.toString().trim() : "";
      if (!text) {
        result[rawText] = "";
        return;
      }
      if (cache[text] && cache[text][targetLang]) {
        result[rawText] = cache[text][targetLang];
      } else {
        toTranslate.push(text);
      }
    });

    if (toTranslate.length > 0) {
      const uniqueToTranslate = Array.from(new Set(toTranslate));
      let translatedArray: string[] = [];
      let usedService = "none";

      const apiKey = process.env.TRANSLATE_API_KEY;
      if (apiKey) {
        try {
          console.log(`Translating ${uniqueToTranslate.length} items to '${targetLang}' using Google Cloud Translation API...`);
          translatedArray = await translateWithGoogle(uniqueToTranslate, targetLang, apiKey);
          usedService = "Google Cloud Translation API";
        } catch (googleErr: any) {
          console.warn("Google Cloud Translation API failed, trying Gemini API fallback:", googleErr.message);
          try {
            translatedArray = await translateWithGemini(uniqueToTranslate, targetLang);
            usedService = "Gemini API (Fallback)";
          } catch (geminiErr: any) {
            console.error("Gemini translation fallback also failed:", geminiErr.message);
            translatedArray = uniqueToTranslate; // Fallback to original text
            usedService = "None (Error Fallback)";
          }
        }
      } else {
        console.warn("TRANSLATE_API_KEY environment variable is not defined. Using Gemini API for translation...");
        try {
          translatedArray = await translateWithGemini(uniqueToTranslate, targetLang);
          usedService = "Gemini API (No TRANSLATE_API_KEY defined)";
        } catch (geminiErr: any) {
          console.error("Gemini translation failed:", geminiErr.message);
          translatedArray = uniqueToTranslate; // Fallback to original text
          usedService = "None (Error Fallback)";
        }
      }

      // Map unique translations back to cache and result
      uniqueToTranslate.forEach((originalText, index) => {
        const translatedVal = translatedArray[index] || originalText;
        if (!cache[originalText]) cache[originalText] = {};
        cache[originalText][targetLang] = translatedVal;
      });

      // Write updated cache to db path
      await saveTranslationCache(cache);

      // Populate output results from the newly-updated cache
      texts.forEach((rawText) => {
        const text = rawText ? rawText.toString().trim() : "";
        if (!text) {
          result[rawText] = "";
        } else {
          result[rawText] = cache[text]?.[targetLang] || text;
        }
      });

      console.log(`Successfully translated ${uniqueToTranslate.length} items to '${targetLang}' using [${usedService}]`);
    }

    res.json({ success: true, translations: result });
  } catch (err: any) {
    console.error("Translation general endpoint failure:", err);
    // Graceful fallback to original text if the translation service has an issue
    const fallback: Record<string, string> = {};
    texts.forEach((text) => {
      fallback[text] = text;
    });
    res.json({ success: false, translations: fallback, message: err.message || "Translation error occurred" });
  }
};

app.post("/api/translate", handleTranslationRequest);
app.post("/api/translate-content", handleTranslationRequest);

// Vite Setup / Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Oshxona CRM server listening on port ${PORT}`);
  });
}

startServer();
