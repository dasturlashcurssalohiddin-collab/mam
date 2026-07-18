import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Image as ImageIcon, Sparkles, Film, Eye, X } from "lucide-react";
import { CrmState, Translations } from "../types";

interface AboutPageProps {
  state: CrmState;
  t: Translations;
  onBackToMenu: () => void;
}

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=60"
];

const LOCAL_LABELS: Record<string, Record<string, string>> = {
  uz: {
    back: "Menyuga Qaytish",
    galleryTitle: "Rasmlar Galereyasi",
    galleryDesc: "Kafemizning shinam interyeri, jamoamiz va shirin pishiriqlarimiz jarayoni",
    locationTitle: "Bizning Manzil",
    locationDesc: "Kelib ko'ring yoki buyurtma bering",
    mediaTitle: "Media Lavhalar",
    mapHeading: "Xaritadagi joylashuvimiz",
    photos: "Rasmlar",
    noGallery: "Hozircha rasmlar yuklanmagan.",
    info: "Kafemiz Haqida",
  },
  uz_cyr: {
    back: "Менюга Қайтиш",
    galleryTitle: "Расмлар Галереяси",
    galleryDesc: "Кафемизнинг шинам интерьери, жамоамиз ва ширин пишириқларимиз жараёни",
    locationTitle: "Бизнинг Манзил",
    locationDesc: "Келиб кўринг ёки буюртма беринг",
    mediaTitle: "Медиа Лавҳалар",
    mapHeading: "Харитадаги жойлашувимиз",
    photos: "Расмлар",
    noGallery: "Ҳозирча расмлар юкланмаган.",
    info: "Кафемиз Ҳақида",
  },
  ru: {
    back: "Назад в меню",
    galleryTitle: "Галерея изображений",
    galleryDesc: "Наш уютный интерьер, дружная команда и процесс приготовления вкусных блюд",
    locationTitle: "Наш адрес",
    locationDesc: "Приходите к нам или делайте заказ",
    mediaTitle: "Медиа материалы",
    mapHeading: "Наше расположение на карте",
    photos: "Фотографии",
    noGallery: "Фотографии пока не загружены.",
    info: "О нашем кафе",
  },
  en: {
    back: "Back to Menu",
    galleryTitle: "Image Gallery",
    galleryDesc: "Our cozy interior, wonderful staff, and the culinary creation process",
    locationTitle: "Our Location",
    locationDesc: "Come visit us or place an order",
    mediaTitle: "Media Showcases",
    mapHeading: "Our Location on the Map",
    photos: "Photos",
    noGallery: "No gallery photos uploaded yet.",
    info: "About Our Cafe",
  },
  fr: {
    back: "Retour au Menu",
    galleryTitle: "Galerie d'images",
    galleryDesc: "Notre intérieur chaleureux, notre équipe et notre processus de préparation",
    locationTitle: "Notre emplacement",
    locationDesc: "Venez nous rendre visite ou commandez",
    mediaTitle: "Présentation multimédia",
    mapHeading: "Notre position sur la carte",
    photos: "Photos",
    noGallery: "Aucune photo de galerie téléchargée pour le moment.",
    info: "À propos de notre café",
  },
  it: {
    back: "Torna al Menu",
    galleryTitle: "Galleria Immagini",
    galleryDesc: "Il nostro interno accogliente, lo staff e il processo di creazione culinaria",
    locationTitle: "La nostra posizione",
    locationDesc: "Vieni a trovarci o effettua un ordine",
    mediaTitle: "Vetrina multimediale",
    mapHeading: "La nostra posizione sulla mappa",
    photos: "Foto",
    noGallery: "Ancora nessuna foto caricata nella galleria.",
    info: "Informazioni sul nostro bar",
  }
};

export default function AboutPage({ state, t, onBackToMenu }: AboutPageProps) {
  const activeLang = state.config.activeLang || "uz";
  const about = state.about;
  const footer = state.footer;

  const label = (key: string) => {
    const dict = LOCAL_LABELS[activeLang] || LOCAL_LABELS["uz"];
    return dict[key] || LOCAL_LABELS["uz"][key] || "";
  };

  const [translatedText, setTranslatedText] = useState(about?.text || "");
  const [translatedAddress, setTranslatedAddress] = useState(about?.address || footer?.address || "");
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  // Auto-translate dynamic description and address when activeLang shifts
  useEffect(() => {
    const fetchTranslations = async () => {
      const targetText = (about?.text || "").trim();
      const targetAddress = (about?.address || footer?.address || "").trim();

      if (activeLang === "uz" || (!targetText && !targetAddress)) {
        setTranslatedText(targetText);
        setTranslatedAddress(targetAddress);
        return;
      }

      // Load client-side translation cache
      let localCache: Record<string, Record<string, string>> = {};
      try {
        const stored = localStorage.getItem("lazzat_translations_cache");
        if (stored) {
          localCache = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Failed to parse local translations cache in AboutPage:", err);
      }

      const results: Record<string, string> = {};
      const missingTexts: string[] = [];

      [targetText, targetAddress].forEach((text) => {
        if (!text) return;
        if (localCache[text] && localCache[text][activeLang]) {
          results[text] = localCache[text][activeLang];
        } else {
          missingTexts.push(text);
        }
      });

      if (missingTexts.length > 0) {
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texts: missingTexts,
              targetLang: activeLang
            })
          });
          const data = await res.json();
          if (data.success && data.translations) {
            // Save newly fetched translations to local cache
            Object.entries(data.translations).forEach(([original, translated]) => {
              if (original && typeof translated === "string") {
                if (!localCache[original]) {
                  localCache[original] = {};
                }
                localCache[original][activeLang] = translated;
                results[original] = translated;
              }
            });
            try {
              localStorage.setItem("lazzat_translations_cache", JSON.stringify(localCache));
            } catch (err) {
              console.error("Failed to save local translations cache in AboutPage:", err);
            }
          } else {
            console.warn("Translation API fallback in AboutPage:", data.message || "Unknown error");
            missingTexts.forEach((t) => {
              results[t] = t;
            });
          }
        } catch (err) {
          console.error("Failed loading translated texts in AboutPage from /api/translate:", err);
          missingTexts.forEach((t) => {
            results[t] = t;
          });
        }
      }

      setTranslatedText(results[targetText] || targetText);
      setTranslatedAddress(results[targetAddress] || targetAddress);
    };

    fetchTranslations();
  }, [activeLang, about?.text, about?.address, footer?.address]);

  // Gallery calculation
  const gallery = about?.gallery && about.gallery.length > 0 ? about.gallery : DEFAULT_GALLERY;

  // Determine Google Maps Embed URL
  const mapType = about?.mapType || "address";
  const lat = about?.latitude || "41.311081";
  const lng = about?.longitude || "69.240562";
  const mapEmbedLink = about?.mapEmbedLink || "";

  let mapUrl = "";
  if (mapType === "embed" && mapEmbedLink) {
    // If embedding a raw Google Maps embed url, return it directly
    mapUrl = mapEmbedLink;
  } else if (mapType === "coordinates" && lat && lng) {
    mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  } else {
    // Falls back to address query
    const queryAddress = about?.address || footer?.address || "Tashkent, Uzbekistan";
    mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(queryAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16 relative">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{label("back")}</span>
          </button>
          
          <div className="flex items-center gap-2.5">
            <img
              src={state.config.logoUrl}
              alt="Logo"
              className="w-8 h-8 rounded-full shadow-md object-cover border border-amber-500/20"
            />
            <span className="font-black text-xs md:text-sm tracking-wider uppercase text-zinc-900 dark:text-white">
              {footer?.restaurantName || "EVOS"}
            </span>
          </div>

          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* 2. COVER HERO HEADER */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${about?.imageUrl || DEFAULT_GALLERY[0]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-zinc-50 dark:to-zinc-950" />
        </div>

        <div className="relative z-10 text-center px-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <img
              src={footer?.logoUrl || state.config.logoUrl}
              alt="Cafe Logo"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-amber-500 shadow-2xl object-cover mb-4"
            />
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              {label("info")}
            </h1>
            <p className="text-amber-400 text-xs font-extrabold uppercase tracking-widest mt-1 font-mono">
              {footer?.restaurantName}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. MAIN STORY AND PROFILE */}
      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 relative z-10">
        
        {/* Story Text Card */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-white">
                {state.config.activeLang === "uz" ? "Kafemiz Haqida Batafsil" : state.config.activeLang === "ru" ? "Подробнее о нашем кафе" : "More About Our Cafe"}
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-8 whitespace-pre-line font-medium">
              {translatedText || "Kafemizga xush kelibsiz! Biz sizga eng sara va mazali milliy hamda yevropa taomlarini taqdim etamiz. Har bir taomimiz malakali oshpazlar tomonidan mehr va e'tibor bilan tayyorlanadi. Bizning shinam interyerimiz va olijanob xodimlarimiz sizning tashrifingizni unutilmas qilishga harakat qilishadi."}
            </p>
          </motion.div>

          {/* GALLERY GRID */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-white">
                  {label("galleryTitle")}
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {label("galleryDesc")}
              </p>
            </div>

            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((imgUrl, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveLightboxImage(imgUrl)}
                    className="aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/40 dark:border-zinc-700/40 relative group cursor-pointer shadow-xs"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic py-4">{label("noGallery")}</p>
            )}
          </motion.div>
        </div>

        {/* Contact info, GIF/Video and Google Maps Location Map */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* MAP AND GEOLOCATION CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4 overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                  {label("locationTitle")}
                </h3>
                <p className="text-[10px] text-zinc-400">
                  {label("locationDesc")}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>{translatedAddress}</span>
              </p>
              {footer?.phone && (
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{footer.phone}</span>
                </p>
              )}
              {footer?.email && (
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{footer.email}</span>
                </p>
              )}
            </div>

            {/* Google Maps Embed Iframe */}
            <div className="rounded-2xl overflow-hidden h-48 border border-zinc-200 dark:border-zinc-800 relative bg-zinc-100 dark:bg-zinc-900 shadow-inner mt-4">
              <iframe
                title={label("mapHeading")}
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* GIF & VIDEO SHOWCASE PORTLET */}
          {(about?.gifUrl || about?.videoUrl) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5"
            >
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                  {label("mediaTitle")}
                </h3>
              </div>

              {about?.gifUrl && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-zinc-400 block uppercase">GIF Animatsiya</span>
                  <div className="rounded-2xl overflow-hidden aspect-video border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                    <img src={about.gifUrl} alt="GIF" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}

              {about?.videoUrl && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-zinc-400 block uppercase">Video Lavha</span>
                  <div className="rounded-2xl overflow-hidden aspect-video border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
                    <video src={about.videoUrl} className="w-full h-full object-cover" controls playsInline muted />
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>

      {/* LIGHTBOX POPUP FOR IMAGE GALLERY */}
      <AnimatePresence>
        {activeLightboxImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full max-h-[85vh] relative flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute -top-12 right-0 bg-white/15 hover:bg-white/30 text-white rounded-full p-2.5 transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <img
                src={activeLightboxImage}
                alt="Enlarged gallery view"
                className="max-w-full max-h-[80vh] rounded-3xl object-contain shadow-2xl border border-zinc-800 bg-zinc-900"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
