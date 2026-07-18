import React, { useState } from "react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Trash2, Edit3, Key, AlertCircle, Save, ArrowLeft, Settings, Image, Eye, HelpCircle, LayoutGrid, Monitor, PlaySquare, VolumeX, Database, Sliders, RefreshCw, BarChart2, X, MessageSquare, MessageCircle, Sparkles } from "lucide-react";
import { CrmState, MenuItem, Translations, Ad, FaqItem } from "../types";

interface AdminPanelProps {
  state: CrmState;
  t: Translations;
  onUpdateState: (newState: Partial<CrmState>) => Promise<void>;
  onBackToMenu: () => void;
}

export default function AdminPanel({
  state,
  t,
  onUpdateState,
  onBackToMenu,
}: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'design' | 'booklet' | 'ads' | 'languages' | 'about' | 'navbar' | 'faq'>('dashboard');
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'month' | 'year'>('day');

  // Navbar state managers
  const [navbarLinksList, setNavbarLinksList] = useState<any[]>(() => {
    const defaultNavbarLinks = [
      { id: "1", name: "🏠 Cafe haqida", url: "#Restaran/Cafe haqida", order: 1, visible: true },
      { id: "2", name: "⚙️ Sozlamalar", url: "#Sozlamalar", order: 2, visible: true },
      { id: "3", name: "👨‍🍳 Xodimlar", url: "#Oshpaz & Afitsiant", order: 3, visible: true },
      { id: "4", name: "🔑 Admin", url: "#Admin paneli", order: 4, visible: true },
      { id: "5", name: "📔 Bloknot", url: "#Ma'lumot", order: 5, visible: true },
      { id: "6", name: "❓ Savol-Javob", url: "#faq", order: 6, visible: true },
    ];
    return state.navbarLinks || defaultNavbarLinks;
  });

  const [editingNavbarLink, setEditingNavbarLink] = useState<any | null>(null);
  const [isAddingNavbarLink, setIsAddingNavbarLink] = useState(false);
  const [navLinkName, setNavLinkName] = useState("");
  const [navLinkUrl, setNavLinkUrl] = useState("");
  const [navLinkOrder, setNavLinkOrder] = useState(1);
  const [navLinkVisible, setNavLinkVisible] = useState(true);

  const resetNavbarLinkFields = () => {
    setNavLinkName("");
    setNavLinkUrl("");
    setNavLinkOrder(navbarLinksList.length + 1);
    setNavLinkVisible(true);
  };

  const handleSaveNavbarLink = async () => {
    if (!navLinkName.trim() || !navLinkUrl.trim()) {
      showFeedback("Havola nomi va manzili to'ldirilishi shart!", "error");
      return;
    }

    let updatedLinks = [...navbarLinksList];
    if (editingNavbarLink) {
      updatedLinks = updatedLinks.map((link) =>
        link.id === editingNavbarLink.id
          ? { ...link, name: navLinkName, url: navLinkUrl, order: Number(navLinkOrder), visible: navLinkVisible }
          : link
      );
      showFeedback("Havola muvaffaqiyatli tahrirlandi! ✅", "success");
    } else {
      const newLink = {
        id: Date.now().toString(),
        name: navLinkName,
        url: navLinkUrl,
        order: Number(navLinkOrder),
        visible: navLinkVisible,
      };
      updatedLinks.push(newLink);
      showFeedback("Yangi havola muvaffaqiyatli qo'shildi! ✅", "success");
    }

    updatedLinks.sort((a, b) => a.order - b.order);
    setNavbarLinksList(updatedLinks);
    setEditingNavbarLink(null);
    setIsAddingNavbarLink(false);
    resetNavbarLinkFields();

    await onUpdateState({ navbarLinks: updatedLinks } as any);
  };

  const handleDeleteNavbarLink = async (id: string) => {
    const updatedLinks = navbarLinksList.filter((link) => link.id !== id);
    setNavbarLinksList(updatedLinks);
    showFeedback("Havola muvaffaqiyatli o'chirildi! 🗑️", "success");
    await onUpdateState({ navbarLinks: updatedLinks } as any);
  };

  // Food Management State
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [editingFood, setEditingFood] = useState<MenuItem | null>(null);
  
  // Fields for Add/Edit Food
  const [foodName, setFoodName] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [foodDesc, setFoodDesc] = useState("");
  const [foodPrice, setFoodPrice] = useState(0);
  const [foodImage, setFoodImage] = useState("");
  const [foodStock, setFoodStock] = useState(0);
  const [foodRating, setFoodRating] = useState(4.8);
  const [foodVoiceText, setFoodVoiceText] = useState("");
  const [foodDiscount, setFoodDiscount] = useState(false);

  // Helper for file uploads to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Design/Background configurations
  const [themeInput, setThemeInput] = useState<'light' | 'dark'>(state.config.theme);
  const [bgType, setBgType] = useState<'color' | 'image' | 'gif' | 'video'>(state.config.backgroundType);
  const [bgValue, setBgValue] = useState(state.config.backgroundValue);
  const [logoUrlInput, setLogoUrlInput] = useState(state.config.logoUrl);
  const [logoWidthInput, setLogoWidthInput] = useState(state.config.logoWidth);
  const [effectsInput, setEffectsInput] = useState(state.config.effectsEnabled);

  // Brand / App Customizations
  const [logoText, setLogoText] = useState((state.config as any).logoText || "EVOS Fast Food");
  const [primaryColor, setPrimaryColor] = useState((state.config as any).primaryColor || "#f59e0b");
  const [appDownloadUrl, setAppDownloadUrl] = useState((state.config as any).appDownloadUrl || "https://play.google.com/store/apps/details?id=uz.evos");
  const [appDownloadText, setAppDownloadText] = useState((state.config as any).appDownloadText || "Bizning Ilova");

  // Footer and Section Background configurations
  const [footerName, setFooterName] = useState(state.footer?.restaurantName || "EVOS Fast Food Restaurant");
  const [footerDesc, setFooterDesc] = useState(state.footer?.restaurantDesc || "Our mission to help provides fresh and tasty food cooked fresh with fresh and tasty food.");
  const [footerLogo, setFooterLogo] = useState(state.footer?.logoUrl || state.config.logoUrl);
  const [footerPhone, setFooterPhone] = useState(state.footer?.phone || "+998 71 200 05 05");
  const [footerEmail, setFooterEmail] = useState(state.footer?.email || "@evos_uz");
  const [footerAddress, setFooterAddress] = useState(state.footer?.address || "main office address, Tashkent 123, Uzbekistan");
  const [footerCopyright, setFooterCopyright] = useState(state.footer?.copyrightText || "© 2024 EVOS. Barcha huquqlar himoyalangan.");
  const [showFooterInput, setShowFooterInput] = useState(state.footer?.showFooter !== false);
  
  const [footerLinks, setFooterLinks] = useState(state.footer?.links || [
    { id: "1", name: "Menyu", url: "#menu" },
    { id: "2", name: "Aksiyalar", url: "#ads" },
    { id: "3", name: "Filiallarimiz", url: "#branches" },
    { id: "4", name: "Biz haqimizda", url: "#about" },
    { id: "5", name: "Karyera", url: "#careers" }
  ]);
  const [footerSocials, setFooterSocials] = useState(state.footer?.socials || [
    { id: "1", platform: "instagram", url: "https://instagram.com/evos_uz" },
    { id: "2", platform: "facebook", url: "https://facebook.com/evos" },
    { id: "3", platform: "telegram", url: "https://t.me/evos_uz" },
    { id: "4", platform: "youtube", url: "https://youtube.com/evos" }
  ]);
  const [footerApps, setFooterApps] = useState(state.footer?.apps || [
    { id: "1", platform: "appstore", url: "https://apps.apple.com/uz/app/evos" },
    { id: "2", platform: "googleplay", url: "https://play.google.com/store/apps/details?id=uz.evos" }
  ]);

  const [footerBgType, setFooterBgType] = useState<'color' | 'gradient' | 'image'>(state.footer?.bgType || 'gradient');
  const [footerBgValue, setFooterBgValue] = useState(state.footer?.bgValue || "linear-gradient(to right, #451a03, #1e1b4b)");

  const [heroBgType, setHeroBgType] = useState<'color' | 'gradient' | 'image' | 'gif' | 'video'>(state.sectionBackgrounds?.hero?.bgType || 'gradient');
  const [heroBgValue, setHeroBgValue] = useState(state.sectionBackgrounds?.hero?.bgValue || "linear-gradient(to bottom, #18181b, #09090b)");

  const [menuBgType, setMenuBgType] = useState<'color' | 'gradient' | 'image' | 'gif' | 'video'>(state.sectionBackgrounds?.menu?.bgType || 'color');
  const [menuBgValue, setMenuBgValue] = useState(state.sectionBackgrounds?.menu?.bgValue || "transparent");

  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [newAppUrl, setNewAppUrl] = useState("");
  const [newAppPlatform, setNewAppPlatform] = useState("appstore");

  // Security password managers
  const [staffPass, setStaffPass] = useState((state.config as any).staffPassword || "1234");
  const [adminPass, setAdminPass] = useState((state.config as any).adminPassword || "9999");

  // Booklet State Managers
  const [bookletTitle, setBookletTitle] = useState(state.booklet.title);
  const [bookletActive, setBookletActive] = useState(state.booklet.active);
  const [bookletPagesList, setBookletPagesList] = useState<string[]>([...state.booklet.pages]);
  const [newBookletPageText, setNewBookletPageText] = useState("");

  // Ads state managers
  const [adsList, setAdsList] = useState<Ad[]>([...state.ads]);

  // Restaran/Cafe haqida state managers
  const [aboutText, setAboutText] = useState(state.about?.text || "");
  const [aboutImage, setAboutImage] = useState(state.about?.imageUrl || "");
  const [aboutGif, setAboutGif] = useState(state.about?.gifUrl || "");
  const [aboutVideo, setAboutVideo] = useState(state.about?.videoUrl || "");
  const [aboutAddress, setAboutAddress] = useState(state.about?.address || state.footer?.address || "");
  const [aboutPhone, setAboutPhone] = useState(state.about?.phone || state.footer?.phone || "");
  const [aboutEmail, setAboutEmail] = useState(state.about?.email || state.footer?.email || "");
  const [aboutLat, setAboutLat] = useState(state.about?.latitude || "41.3111");
  const [aboutLng, setAboutLng] = useState(state.about?.longitude || "69.2797");
  const [aboutGallery, setAboutGallery] = useState<string[]>(state.about?.gallery || []);

  // Language management
  const [newLangCode, setNewLangCode] = useState("");

  // FAQ (Savol-Javob) state managers
  const [faqList, setFaqList] = useState<FaqItem[]>(() => state.faq || []);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [faqFormLang, setFaqFormLang] = useState<string>("uz");
  const [faqQuestion, setFaqQuestion] = useState<Record<string, string>>({
    uz: "", uz_cyr: "", ru: "", en: "", de: "", fr: "", it: ""
  });
  const [faqAnswer, setFaqAnswer] = useState<Record<string, string>>({
    uz: "", uz_cyr: "", ru: "", en: "", de: "", fr: "", it: ""
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const resetFaqFields = () => {
    setFaqQuestion({ uz: "", uz_cyr: "", ru: "", en: "", de: "", fr: "", it: "" });
    setFaqAnswer({ uz: "", uz_cyr: "", ru: "", en: "", de: "", fr: "", it: "" });
    setFaqFormLang("uz");
  };

  const handleSaveFaq = async () => {
    if (!faqQuestion.uz.trim() || !faqAnswer.uz.trim()) {
      showFeedback("O'zbekcha savol va javob matni kiritilishi shart! ⚠️", "error");
      return;
    }

    let updatedList = [...faqList];

    if (editingFaq) {
      updatedList = updatedList.map(item => {
        if (item.id === editingFaq.id) {
          return {
            ...item,
            question: { ...faqQuestion },
            answer: { ...faqAnswer }
          };
        }
        return item;
      });
      showFeedback("Savol-Javob muvaffaqiyatli tahrirlandi! ✅", "success");
    } else {
      const newFaq: FaqItem = {
        id: Date.now().toString(),
        question: { ...faqQuestion },
        answer: { ...faqAnswer },
        order: faqList.length > 0 ? Math.max(...faqList.map(f => f.order)) + 1 : 1
      };
      updatedList.push(newFaq);
      showFeedback("Yangi Savol-Javob muvaffaqiyatli qo'shildi! ✅", "success");
    }

    updatedList.sort((a, b) => a.order - b.order);
    setFaqList(updatedList);
    setIsAddingFaq(false);
    setEditingFaq(null);
    resetFaqFields();

    await onUpdateState({
      faq: updatedList
    });
  };

  const handleDeleteFaq = async (id: string) => {
    const updatedList = faqList.filter(f => f.id !== id);
    setFaqList(updatedList);
    showFeedback("Savol-Javob muvaffaqiyatli o'chirildi! 🗑️", "success");
    await onUpdateState({
      faq: updatedList
    });
  };

  const handleMoveFaq = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqList.length) return;

    const result = [...faqList];
    const [removed] = result.splice(index, 1);
    result.splice(newIndex, 0, removed);

    const updatedList = result.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setFaqList(updatedList);
    await onUpdateState({
      faq: updatedList
    });
  };

  const handleAutoTranslateFaq = async () => {
    // Find first non-empty question and answer to use as source
    const sourceQ = (Object.values(faqQuestion) as string[]).find(q => q.trim() !== "");
    const sourceA = (Object.values(faqAnswer) as string[]).find(a => a.trim() !== "");

    if (!sourceQ && !sourceA) {
      showFeedback("Iltimos, avval biror tilda savol yoki javob matnini kiriting! ⚠️", "error");
      return;
    }

    setIsTranslating(true);
    showFeedback("Tarjima jarayoni boshlandi... ⏳", "info");

    try {
      // Find languages to translate
      const langs = ["uz", "uz_cyr", "ru", "en", "de", "fr", "it"];
      const updatedQ = { ...faqQuestion };
      const updatedA = { ...faqAnswer };

      // Determine source texts and their language code
      const qSourceLang = Object.keys(faqQuestion).find(lang => faqQuestion[lang].trim() !== "") || "uz";
      const aSourceLang = Object.keys(faqAnswer).find(lang => faqAnswer[lang].trim() !== "") || "uz";

      const qText = faqQuestion[qSourceLang];
      const aText = faqAnswer[aSourceLang];

      await Promise.all(langs.map(async (lang) => {
        // Translate question
        if (qText && lang !== qSourceLang && !faqQuestion[lang].trim()) {
          try {
            const res = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ texts: [qText], targetLang: lang })
            });
            const data = await res.json();
            if (data.success && data.translations && data.translations[qText]) {
              updatedQ[lang] = data.translations[qText];
            }
          } catch (e) {
            console.error(`Failed to translate question to ${lang}:`, e);
          }
        }

        // Translate answer
        if (aText && lang !== aSourceLang && !faqAnswer[lang].trim()) {
          try {
            const res = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ texts: [aText], targetLang: lang })
            });
            const data = await res.json();
            if (data.success && data.translations && data.translations[aText]) {
              updatedA[lang] = data.translations[aText];
            }
          } catch (e) {
            console.error(`Failed to translate answer to ${lang}:`, e);
          }
        }
      }));

      setFaqQuestion(updatedQ);
      setFaqAnswer(updatedA);
      showFeedback("Savol va javoblar barcha tillarga muvaffaqiyatli tarjima qilindi! ✨", "success");
    } catch (err) {
      console.error("Auto translate error:", err);
      showFeedback("Tarjimada xatolik yuz berdi. ❌", "error");
    } finally {
      setIsTranslating(false);
    }
  };

  // Non-blocking iframe-friendly feedback toast and inline delete states
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [selectedFoodForComments, setSelectedFoodForComments] = useState<MenuItem | null>(null);
  const [foodComments, setFoodComments] = useState<{ id: string; author: string; text: string; date: string }[]>([]);

  const getCommentCount = (foodId: string) => {
    try {
      const commentsRaw = localStorage.getItem(`comments_${foodId}`);
      if (commentsRaw) {
        const arr = JSON.parse(commentsRaw);
        return Array.isArray(arr) ? arr.length : 0;
      }
    } catch (e) {}
    return 0;
  };

  const loadCommentsForFood = (food: MenuItem) => {
    setSelectedFoodForComments(food);
    try {
      const commentsRaw = localStorage.getItem(`comments_${food.id}`);
      if (commentsRaw) {
        setFoodComments(JSON.parse(commentsRaw));
      } else {
        setFoodComments([]);
      }
    } catch (e) {
      setFoodComments([]);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedFoodForComments) return;
    const updated = foodComments.filter((c) => c.id !== commentId);
    setFoodComments(updated);
    localStorage.setItem(`comments_${selectedFoodForComments.id}`, JSON.stringify(updated));
    showFeedback("Izoh muvaffaqiyatli o'chirildi! 🗑️", "success");
  };

  const showFeedback = (message: string, type: "success" | "error" | "info" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = (state.config as any).adminPassword || "9999";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Xato admin paroli! Qayta urinib ko'ring.");
    }
  };

  // Update Config on Save
  const handleSaveConfig = async () => {
    const updatedConfig = {
      ...state.config,
      theme: themeInput,
      backgroundType: bgType,
      backgroundValue: bgValue,
      logoUrl: logoUrlInput,
      logoWidth: logoWidthInput,
      effectsEnabled: effectsInput,
      staffPassword: staffPass,
      adminPassword: adminPass,
      logoText: logoText,
      primaryColor: primaryColor,
      appDownloadUrl: appDownloadUrl,
      appDownloadText: appDownloadText,
    };

    const updatedFooter = {
      restaurantName: footerName,
      restaurantDesc: footerDesc,
      logoUrl: footerLogo || logoUrlInput,
      phone: footerPhone,
      email: footerEmail,
      address: footerAddress,
      links: footerLinks,
      socials: footerSocials,
      apps: footerApps,
      copyrightText: footerCopyright,
      bgType: footerBgType,
      bgValue: footerBgValue,
      showFooter: showFooterInput,
    };

    const updatedSectionBackgrounds = {
      hero: {
        bgType: heroBgType,
        bgValue: heroBgValue,
      },
      menu: {
        bgType: menuBgType,
        bgValue: menuBgValue,
      }
    };

    await onUpdateState({ 
      config: updatedConfig as any,
      footer: updatedFooter,
      sectionBackgrounds: updatedSectionBackgrounds
    });
    showFeedback("Dizayn, footer va bo'lim fonlari muvaffaqiyatli saqlandi! ✅", "success");
  };

  // Link helpers
  const handleAddLink = () => {
    if (!newLinkName || !newLinkUrl) return;
    setFooterLinks([
      ...footerLinks,
      { id: Date.now().toString(), name: newLinkName, url: newLinkUrl }
    ]);
    setNewLinkName("");
    setNewLinkUrl("");
  };

  const handleDeleteLink = (id: string) => {
    setFooterLinks(footerLinks.filter(l => l.id !== id));
  };

  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= footerLinks.length) return;
    const result = [...footerLinks];
    const [removed] = result.splice(index, 1);
    result.splice(newIndex, 0, removed);
    setFooterLinks(result);
  };

  // Social helpers
  const handleAddSocial = () => {
    if (!newSocialUrl) return;
    setFooterSocials([
      ...footerSocials,
      { id: Date.now().toString(), platform: "website", url: newSocialUrl }
    ]);
    setNewSocialUrl("");
  };

  const handleDeleteSocial = (id: string) => {
    setFooterSocials(footerSocials.filter(s => s.id !== id));
  };

  // App Store helpers
  const handleAddApp = () => {
    if (!newAppUrl) return;
    setFooterApps([
      ...footerApps,
      { id: Date.now().toString(), platform: newAppPlatform as any, url: newAppUrl }
    ]);
    setNewAppUrl("");
  };

  const handleDeleteApp = (id: string) => {
    setFooterApps(footerApps.filter(a => a.id !== id));
  };

  // Add/Edit Food item
  const handleSaveFood = async () => {
    if (!foodName || !foodCategory) {
      showFeedback("Iltimos, taom nomi va toifasini kiriting.", "error");
      return;
    }

    const defaultImages = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60"
    ];

    const finalImage = foodImage.trim() || defaultImages[Math.floor(Math.random() * defaultImages.length)];
    const cleanVoice = foodVoiceText.trim() || `${foodName}. Narxi ${foodPrice.toLocaleString()} so'm.`;

    if (editingFood) {
      // Edit food
      const updatedMenu = state.menu.map((item) => {
        if (item.id === editingFood.id) {
          return {
            ...item,
            name: foodName,
            category: foodCategory,
            description: foodDesc,
            price: Number(foodPrice),
            image: finalImage,
            stock: Number(foodStock),
            rating: Number(foodRating),
            voiceText: cleanVoice,
            hasDiscount: foodDiscount,
          };
        }
        return item;
      });
      await onUpdateState({ menu: updatedMenu });
      setEditingFood(null);
      showFeedback("Taom muvaffaqiyatli tahrirlandi! 🖊️", "success");
    } else {
      // Add new food
      const newFood: MenuItem = {
        id: Math.random().toString(),
        name: foodName,
        category: foodCategory,
        description: foodDesc,
        price: Number(foodPrice),
        image: finalImage,
        stock: Number(foodStock),
        rating: Number(foodRating),
        voiceText: cleanVoice,
        hasDiscount: foodDiscount,
      };
      await onUpdateState({ menu: [newFood, ...state.menu] });
      setIsAddingFood(false);
      showFeedback("Yangi taom muvaffaqiyatli qo'shildi! ✨", "success");
    }

    // Reset fields
    resetFoodFields();
  };

  const resetFoodFields = () => {
    setFoodName("");
    setFoodCategory("");
    setFoodDesc("");
    setFoodPrice(0);
    setFoodImage("");
    setFoodStock(0);
    setFoodRating(4.8);
    setFoodVoiceText("");
    setFoodDiscount(false);
  };

  const handleDeleteFood = async (id: string) => {
    // Falls back to direct state delete if confirm is skipped (handled inline in render now)
    const updatedMenu = state.menu.filter((item) => item.id !== id);
    await onUpdateState({ menu: updatedMenu });
    showFeedback("Taom muvaffaqiyatli o'chirildi! 🗑️", "success");
  };

  // Welcome Booklet Controllers
  const handleSaveBooklet = async () => {
    const updatedBooklet = {
      active: bookletActive,
      title: bookletTitle,
      pages: bookletPagesList,
    };
    await onUpdateState({ booklet: updatedBooklet });
    showFeedback("Ma'lumot bloknoti sozlamalari yangilandi! ✅", "success");
  };

  const handleAddBookletPage = () => {
    if (newBookletPageText.trim()) {
      setBookletPagesList([...bookletPagesList, newBookletPageText.trim()]);
      setNewBookletPageText("");
    }
  };

  const handleDeleteBookletPage = (index: number) => {
    const updated = bookletPagesList.filter((_, i) => i !== index);
    setBookletPagesList(updated);
  };

  // Ads manager
  const handleSaveAds = async () => {
    await onUpdateState({ ads: adsList });
    showFeedback("Reklama sozlamalari muvaffaqiyatli saqlandi! ✅", "success");
  };

  const handleUpdateAdField = (id: string, field: keyof Ad, value: any) => {
    const updated = adsList.map((ad) => {
      if (ad.id === id) {
        return { ...ad, [field]: value };
      }
      return ad;
    });
    setAdsList(updated);
  };

  const handleAddAd = () => {
    const newAd: Ad = {
      id: Math.random().toString(),
      active: true,
      position: 'bottom',
      type: 'image',
      contentUrl: '',
      linkUrl: '',
      title: ''
    };
    setAdsList([...adsList, newAd]);
  };

  const handleDeleteAd = (id: string) => {
    setAdsList(adsList.filter((ad) => ad.id !== id));
  };

  const handleMoveAdUp = (index: number) => {
    if (index === 0) return;
    const updated = [...adsList];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setAdsList(updated);
  };

  const handleMoveAdDown = (index: number) => {
    if (index === adsList.length - 1) return;
    const updated = [...adsList];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setAdsList(updated);
  };

  // Language translation logic
  const handleAddLanguage = async () => {
    const code = newLangCode.toLowerCase().trim();
    if (!code || state.languages.includes(code)) {
      showFeedback("Bu til allaqachon mavjud yoki noto'g'ri til kodi kiritildi.", "error");
      return;
    }

    const newTranslations = { ...state.translations };
    // Clone Uzbek as default template for translations
    newTranslations[code] = { ...state.translations["uz"] };

    const updatedLangs = [...state.languages, code];
    await onUpdateState({
      languages: updatedLangs,
      translations: newTranslations as any,
    });
    setNewLangCode("");
    showFeedback(`"${code}" tili qo'shildi! Endi bu tilni tahrirlashingiz mumkin. ✅`, "success");
  };

  const handleSaveAbout = async () => {
    const updatedAbout = {
      text: aboutText,
      imageUrl: aboutImage,
      gifUrl: aboutGif,
      videoUrl: aboutVideo,
      address: aboutAddress,
      phone: aboutPhone,
      email: aboutEmail,
      latitude: String(aboutLat),
      longitude: String(aboutLng),
      gallery: aboutGallery,
    };
    await onUpdateState({ about: updatedAbout as any });
    showFeedback("Restaran/Cafe haqida ma'lumotlari muvaffaqiyatli saqlandi! 🏠✅", "success");
  };

  // Map charts data dynamically based on timeframe
  const getChartData = () => {
    if (timeframe === "hour") {
      return state.stats.hourlyVisits.map((val, idx) => ({ name: `${idx * 2}:00`, 'Kirishlar': val }));
    } else if (timeframe === "day") {
      const days = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan", "Yak"];
      return state.stats.dailyVisits.map((val, idx) => ({ name: days[idx % 7], 'Kirishlar': val }));
    } else if (timeframe === "month") {
      const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"];
      return state.stats.monthlyVisits.map((val, idx) => ({ name: months[idx % 6], 'Kirishlar': val }));
    } else {
      return state.stats.yearlyVisits.map((val, idx) => ({ name: `${2024 + idx}-Yil`, 'Kirishlar': val }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4 text-white">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-950 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-zinc-800"
        >
          <div className="flex flex-col items-center mb-6">
            <span className="p-4 bg-amber-500/10 rounded-full text-amber-500 mb-3 border border-amber-500/20">
              <Database className="w-10 h-10" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-center">
              {(state.config as any).logoText || state.footer?.restaurantName || "EVOS"} Admin Panel
            </h1>
            <p className="text-xs text-zinc-500 text-center mt-1">
              Butun tizimni to'liq boshqarish va tahlillar oynasi
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1.5 uppercase tracking-wider">
                Xavfsiz Kirish Paroli (Admin)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="Admin parolini kiriting (masalan: 9999)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/20 p-3 rounded-xl text-xs border border-red-500/20">
                <AlertCircle className="w-4 h-4" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm shadow-md transition-colors"
            >
              Tizimga Kirish
            </button>
          </form>

          <button
            onClick={onBackToMenu}
            className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mijoz Oynasiga Qaytish</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
              <Database className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-black text-white">{(state.config as any).logoText || state.footer?.restaurantName || "EVOS"} Admin Control</h1>
              <p className="text-xs text-zinc-400">100% Saytni boshqarish va tahrirlash oynasi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMenu}
              className="px-4 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Menyuga qaytish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-fit space-y-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-3 mb-2">CRM bo'limlari</span>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'dashboard' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Analitika va Statistika
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'menu' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Taomlar va Menyuni Boshqarish
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'design' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Monitor className="w-4 h-4" />
            Logo va Dizayn (Background)
          </button>

          <button
            onClick={() => setActiveTab('booklet')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'booklet' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
            Ma'lumot Qog'ozi (Booklet)
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'ads' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <PlaySquare className="w-4 h-4" />
            Reklama Bannerlari
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'about' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Restaran/Cafe Haqida
          </button>

          <button
            onClick={() => {
              setActiveTab('navbar');
              setEditingNavbarLink(null);
              setIsAddingNavbarLink(false);
              resetNavbarLinkFields();
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'navbar' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Sliders className="w-4 h-4" />
            Navbar Menyu Boshqaruvi
          </button>

          <button
            onClick={() => {
              setActiveTab('faq');
              setEditingFaq(null);
              setIsAddingFaq(false);
              resetFaqFields();
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2.5 ${
              activeTab === 'faq' ? "bg-amber-500 text-black shadow-md" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            Savol-Javob Boshqaruvi
          </button>
        </div>

        {/* Content Container (Right Columns) */}
        <div className="lg:col-span-3 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 min-h-[500px]">
          
          {/* TAB 1: ANALYTICS & STATS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats highlights card row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">Jami Tashriflar</span>
                  <span className="text-2xl font-black text-white mt-1 block">{state.stats.totalVisits || 0} ta</span>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">Faol Foydalanuvchilar</span>
                  <span className="text-2xl font-black text-green-400 mt-1 block">{state.stats.activeUsers || 0} ta</span>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">Sotilgan Mahsulotlar</span>
                  <span className="text-2xl font-black text-amber-500 mt-1 block">
                    {state.stats.productsSold || 0} ta
                  </span>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">Menyu Taomlari</span>
                  <span className="text-2xl font-black text-blue-400 mt-1 block">{state.menu.length} ta</span>
                </div>
              </div>

              {/* Chart Visualizer */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide">📉 Tashriflar Dinamikasi Grafigi</h2>
                    <p className="text-[10px] text-zinc-500 font-mono">Real-vaqtda foydalanuvchilar kirish va chiqish soni tahlili</p>
                  </div>
                  {/* Timeframe switch */}
                  <div className="flex bg-zinc-800 rounded-lg p-0.5 border border-zinc-700 self-start sm:self-auto">
                    {['hour', 'day', 'month', 'year'].map((tFrame) => (
                      <button
                        key={tFrame}
                        onClick={() => setTimeframe(tFrame as any)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                          timeframe === tFrame ? "bg-amber-500 text-black shadow-xs" : "text-zinc-400"
                        }`}
                      >
                        {tFrame === "hour" ? "1 Soat" : tFrame === "day" ? "1 Kun" : tFrame === "month" ? "1 Oy" : "1 Yil"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={10} fontFamily="monospace" />
                      <YAxis stroke="#71717a" fontSize={10} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a" }} />
                      <Area type="monotone" dataKey="Kirishlar" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Logs history */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orders historical log */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-3">🛒 Afitsiant va Oshpaz jurnali</h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {state.stats.ordersLog?.map((log) => (
                      <div key={log.id} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs">
                        <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                          <span>Buyurtma amali</span>
                          <span>{log.time}</span>
                        </div>
                        <p className="text-zinc-300">{log.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visit action logs */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-3">👤 Tashrifchilar Kirish jurnali</h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {state.stats.visitsLog?.map((log, idx) => (
                      <div key={idx} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-green-400 mr-2">● {log.type}</span>
                          <span className="text-zinc-300">{log.user}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product views activity log (Mijozlar Mahsulot Ko'rish Tarixi) */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>👤 Mijozlar Mahsulot Ko'rish Tarixi</span>
                </h3>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {state.stats.productViews && state.stats.productViews.length > 0 ? (
                    state.stats.productViews.map((view: any, idx: number) => (
                      <div key={view.id || idx} className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs flex justify-between items-center hover:border-zinc-700 transition-colors">
                        <div>
                          <span className="font-extrabold text-amber-500 mr-2">📞 {view.phone}</span>
                          <span className="text-zinc-400 mr-1">ko'rdi:</span>
                          <span className="font-black text-white">{view.productName}</span>
                          <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase tracking-widest font-black">
                            {view.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">{view.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-center py-6 text-xs">Hozircha mahsulot ko'rishlar jurnali bo'sh.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MENU & DISHES MANAGEMENT */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wide">🍔 Taomlar Ro'yxati va Menyuni boshqarish</h2>
                  <p className="text-[10px] text-zinc-500">Bu yerdan yangi taom qo'shish, o'chirish va narxlarni tahrirlash mumkin.</p>
                </div>
                <button
                  onClick={() => {
                    resetFoodFields();
                    setEditingFood(null);
                    setIsAddingFood(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Yangi Taom Qo'shish
                </button>
              </div>

              {/* Form Block for Adding/Editing Food */}
              {(isAddingFood || editingFood) && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-extrabold text-amber-500">
                    {editingFood ? "🖊️ Taom ma'lumotlarini tahrirlash" : "✨ Yangi taom qo'shish formasi"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Taom Nomi</label>
                      <input
                        type="text"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        placeholder="Masalan: Tandir Somsa"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Kategoriya (Toifa)</label>
                      <input
                        type="text"
                        value={foodCategory}
                        onChange={(e) => setFoodCategory(e.target.value)}
                        placeholder="Masalan: Taomlar, Ichimliklar, Shirinliklar"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/60 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setFoodDiscount(!foodDiscount)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                        foodDiscount ? "bg-amber-500" : "bg-zinc-800"
                      }`}
                      aria-label="Chegirmalar"
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                          foodDiscount ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <div>
                      <span className="text-xs font-bold text-zinc-300 block">Chegirmalar</span>
                      <span className="text-[9px] text-zinc-500 block">Ushbu taom chegirmali ekanligini ko'rsatish</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Taom Ta'rifi (Description)</label>
                    <textarea
                      rows={2}
                      value={foodDesc}
                      onChange={(e) => setFoodDesc(e.target.value)}
                      placeholder="Taom tarkibi va lazzati haqida batafsil ma'lumot kiriting."
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Narxi (So'm)</label>
                      <input
                        type="number"
                        value={foodPrice}
                        onChange={(e) => setFoodPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Dastlabki Zaxira Soni</label>
                      <input
                        type="number"
                        value={foodStock}
                        onChange={(e) => setFoodStock(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Reyting (Yulduzlar)</label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        value={foodRating}
                        onChange={(e) => setFoodRating(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Taom Rasmi (Fayl yuklash yoki URL link)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* File Upload Zone with Drag & Drop */}
                        <div 
                          className="border border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl p-3 bg-zinc-950 text-center flex flex-col items-center justify-center cursor-pointer transition-all relative group"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") setFoodImage(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            id="food-file-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setFoodImage)}
                          />
                          <label htmlFor="food-file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <Image className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition-colors mb-1 pointer-events-none" />
                            <span className="text-[10px] text-zinc-300 font-bold block pointer-events-none">Sudrab keling yoki bosing</span>
                            <span className="text-[8px] text-zinc-500 block pointer-events-none">Rasm (.png, .jpg)</span>
                          </label>
                        </div>

                        {/* Fallback Text Input & Preview */}
                        <div className="flex flex-col justify-between gap-2">
                          <input
                            type="text"
                            value={foodImage}
                            onChange={(e) => setFoodImage(e.target.value)}
                            placeholder="Yoki rasm URL manzilini yozing..."
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-mono"
                          />
                          {foodImage && (
                            <div className="flex items-center gap-2 p-1.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                              <img src={foodImage} alt="Preview" className="w-8 h-8 object-cover rounded-lg border border-zinc-800 shrink-0" />
                              <div className="overflow-hidden max-w-[120px]">
                                <span className="text-[9px] text-green-400 font-bold block">Tanlandi!</span>
                                <span className="text-[7px] text-zinc-500 block truncate font-mono">{foodImage.substring(0, 15)}...</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setFoodImage("")} 
                                className="text-red-400 hover:text-red-500 text-[10px] font-bold ml-auto px-1.5 py-0.5 rounded bg-red-500/10"
                              >
                                O'chirish
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Ovozli Ta'rif (TTS text)</label>
                    <textarea
                      rows={2}
                      value={foodVoiceText}
                      onChange={(e) => setFoodVoiceText(e.target.value)}
                      placeholder="Qariyalarga ovozli o'qiladigan matn (bo'sh qolsa avtomatik generatsiya qilinadi)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsAddingFood(false);
                        setEditingFood(null);
                      }}
                      className="px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Bekor qilish
                    </button>
                    <button
                      onClick={handleSaveFood}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      Saqlash
                    </button>
                  </div>
                </div>
              )}

              {/* Menu items table list */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-800 border-b border-zinc-700 text-zinc-400 font-extrabold uppercase">
                      <th className="p-4">Rasm & Nomi</th>
                      <th className="p-4">Kategoriya</th>
                      <th className="p-4">Narxi</th>
                      <th className="p-4 text-center">Zaxira</th>
                      <th className="p-4 text-center">Reyting</th>
                      <th className="p-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300">
                    {state.menu.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 object-cover rounded-lg border border-zinc-800"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-extrabold text-white text-sm">{item.name}</span>
                        </td>
                        <td className="p-4 font-semibold text-zinc-400">{item.category}</td>
                        <td className="p-4 font-bold text-white font-mono">{item.price.toLocaleString()} so'm</td>
                        <td className="p-4 text-center font-mono">{item.stock} ta</td>
                        <td className="p-4 text-center font-mono">⭐ {item.rating}</td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => loadCommentsForFood(item)}
                            className="p-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors inline-flex relative cursor-pointer"
                            title="Izohlarni boshqarish"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {getCommentCount(item.id) > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-zinc-900">
                                {getCommentCount(item.id)}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingFood(item);
                              setFoodName(item.name);
                              setFoodCategory(item.category);
                              setFoodDesc(item.description);
                              setFoodPrice(item.price);
                              setFoodImage(item.image);
                              setFoodStock(item.stock);
                              setFoodRating(item.rating);
                              setFoodVoiceText(item.voiceText);
                              setFoodDiscount(!!item.hasDiscount);
                            }}
                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors inline-flex cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {deleteConfirmId === item.id ? (
                            <div className="inline-flex items-center gap-1.5 bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                              <span className="text-[10px] text-red-400 font-bold px-1 select-none">Ishonchingiz komilmi?</span>
                              <button
                                onClick={() => handleDeleteFood(item.id)}
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-[10px] font-extrabold transition-all"
                              >
                                Ha
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-md text-[10px] font-extrabold transition-all"
                              >
                                Yo'q
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors inline-flex"
                              title="Taomni o'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN, LOGO & BACKGROUND (with video background customizer!) */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wide">🎨 Logo va Tizim Orqa foni (Background)</h2>
                <p className="text-[10px] text-zinc-500">Mijozlar menyusining dizayni, foni, logosi va uning o'lchamini sozlashingiz mumkin.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-5">
                {/* Logo URL & dynamic Width Slider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Logo Fayli (Yuklash yoki URL link)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div 
                        className="border border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl p-2 bg-zinc-950 text-center flex flex-col items-center justify-center cursor-pointer transition-all relative group"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === "string") setLogoUrlInput(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          id="logo-file-upload"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setLogoUrlInput)}
                        />
                        <label htmlFor="logo-file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                          <Image className="w-4 h-4 text-zinc-500 group-hover:text-amber-500 transition-colors mb-1 pointer-events-none" />
                          <span className="text-[9px] text-zinc-300 font-bold block pointer-events-none">Faylni bosing yoki sudrang</span>
                        </label>
                      </div>

                      <div className="flex flex-col justify-between gap-1.5">
                        <input
                          type="text"
                          value={logoUrlInput}
                          onChange={(e) => setLogoUrlInput(e.target.value)}
                          placeholder="Yoki logo URL manzilini yozing..."
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] focus:ring-2 focus:ring-amber-500 text-white font-mono"
                        />
                        {logoUrlInput && (
                          <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                            <img src={logoUrlInput} alt="Preview" className="w-6 h-6 object-cover rounded-full border border-zinc-800 shrink-0" />
                            <span className="text-[8px] text-green-400 font-bold block truncate max-w-[80px]">Logo yuklandi!</span>
                            <button 
                              type="button"
                              onClick={() => setLogoUrlInput("")} 
                              className="text-red-400 hover:text-red-500 text-[8px] font-bold ml-auto px-1 py-0.5 rounded bg-red-500/10"
                            >
                              X
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                      Logo Kattaligi (Width): {logoWidthInput}px
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="180"
                      value={logoWidthInput}
                      onChange={(e) => setLogoWidthInput(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-3"
                    />
                  </div>
                </div>

                {/* BRAND NEW DETAILED BRANDING CONTROLLER */}
                <div className="border-t border-zinc-800/70 pt-4 space-y-4">
                  <span className="text-[11px] font-extrabold text-amber-500 block uppercase tracking-wider">
                    🏷️ Brend va Mobil Ilova Sozlamalari (App & Branding)
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                        Logo oldidagi matn (Brand Name next to Logo)
                      </label>
                      <input
                        type="text"
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder="Masalan: EVOS Fast Food"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                        Bizning Ilova tugmasi rangi (App Primary Theme Color)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-8 rounded-lg bg-transparent border border-zinc-800 cursor-pointer p-0 shrink-0"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                        Ilova Nomi (App Link Text)
                      </label>
                      <input
                        type="text"
                        value={appDownloadText}
                        onChange={(e) => setAppDownloadText(e.target.value)}
                        placeholder="Masalan: Bizning Ilova"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">
                        Ilova Yuklab olish URL manzili (App Download Link URL)
                      </label>
                      <input
                        type="text"
                        value={appDownloadUrl}
                        onChange={(e) => setAppDownloadUrl(e.target.value)}
                        placeholder="Masalan: https://play.google.com/store/apps/details?id=uz.evos"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Background selector (Video, Gif, Image, Color supported!) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Mavzu Fon Turi</label>
                    <select
                      value={bgType}
                      onChange={(e) => setBgType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-bold"
                    >
                      <option value="color">Oddiy Rang (Hex)</option>
                      <option value="image">Statik Rasm</option>
                      <option value="gif">GIF Harakatli Fon</option>
                      <option value="video">Harakatli Video Loop</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Orqa Fon Qiymati (Fayl yuklash yoki URL/Rang)</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {bgType !== "color" && (
                        <div className="border border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl p-2 bg-zinc-950 text-center flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 w-full sm:w-1/3">
                          <input
                            type="file"
                            accept={bgType === "video" ? "video/*" : "image/*"}
                            id="bg-file-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setBgValue)}
                          />
                          <label htmlFor="bg-file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <Image className="w-4 h-4 text-zinc-500 mb-1" />
                            <span className="text-[9px] text-zinc-300 font-bold block">Fon yuklash</span>
                          </label>
                        </div>
                      )}
                      <input
                        type="text"
                        value={bgValue}
                        onChange={(e) => setBgValue(e.target.value)}
                        placeholder={bgType === "color" ? "Masalan: #f3f4f6" : "URL yoki yuklangan Base64 kodi..."}
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Highly Crafted Quick Background Presets - Req #6 */}
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                  <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider">
                    ⚡ Tayyor Yuqori Sifatli Fonlar (Quick Presets)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Colors */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 font-bold block uppercase">Ranglar</span>
                      <button
                        onClick={() => { setBgType("color"); setBgValue("#f3f4f6"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left flex items-center gap-1.5"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f3f4f6] border border-zinc-700 inline-block shrink-0" />
                        Milliy Och Kulrang
                      </button>
                      <button
                        onClick={() => { setBgType("color"); setBgValue("#09090b"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left flex items-center gap-1.5"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#09090b] border border-zinc-700 inline-block shrink-0" />
                        Tungi Ko'mir
                      </button>
                    </div>

                    {/* Images */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 font-bold block uppercase">Premium Rasmlar</span>
                      <button
                        onClick={() => { setBgType("image"); setBgValue("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left truncate"
                        title="Shinam Restoran"
                      >
                        🍽️ Shinam Restoran
                      </button>
                      <button
                        onClick={() => { setBgType("image"); setBgValue("https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left truncate"
                        title="Shinam Oshxona"
                      >
                        🍳 Oshxona Interyeri
                      </button>
                    </div>

                    {/* Gifs */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 font-bold block uppercase">Harakatli GIFlar</span>
                      <button
                        onClick={() => { setBgType("gif"); setBgValue("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWw0bW0zcjZnaDZ6bmRkczRsc3JjOHoyMHpxMDByZnp1bm4zOTBkMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o85xGocUH8TCQDDry/giphy.gif"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left truncate"
                        title="Qaynoq Choy"
                      >
                        ☕ Qaynoq Choy
                      </button>
                      <button
                        onClick={() => { setBgType("gif"); setBgValue("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZpcTcyb2x3dThxMXhjeHFzNXJhbDhsZHpkeGJ5MTZ3ZnI4enEydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L3WeV25UAxsN00C6v1/giphy.gif"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left truncate"
                        title="Oshpazlik San'ati"
                      >
                        🔥 Oshpazlik San'ati
                      </button>
                    </div>

                    {/* Videos */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-zinc-500 font-bold block uppercase">Video Looplar</span>
                      <button
                        onClick={() => { setBgType("video"); setBgValue("https://assets.mixkit.co/videos/preview/mixkit-fire-burning-in-a-stove-close-up-43103-large.mp4"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left truncate"
                        title="Tandir Olovi"
                      >
                        🔥 Tandir Olovi Loop
                      </button>
                      <button
                        onClick={() => { setBgType("video"); setBgValue("https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-fresh-vegetable-salad-41617-large.mp4"); }}
                        className="w-full p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] text-zinc-300 font-medium text-left truncate"
                        title="Osh pishirish"
                      >
                        🥗 Salat Tayyorlash
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* Floating animations particle option */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Uchar effektlar animatsiyasi (Falling elements)</span>
                    <span className="text-[10px] text-zinc-500">Mijozlar panelida ovqat va choy barglari kabi kichik harakatli detallar uchib yurishi</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={effectsInput}
                    onChange={(e) => setEffectsInput(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                  />
                </div>

                <hr className="border-zinc-800" />

                {/* Passwords Management */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-red-400 block mb-1">👨‍🍳 Oshpaz & Afitsiant Paroli (2-Panel)</label>
                    <input
                      type="text"
                      value={staffPass}
                      onChange={(e) => setStaffPass(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-red-500 block mb-1">🔑 Admin Tizim Paroli (3-Panel)</label>
                    <input
                      type="text"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleSaveConfig}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Dizaynni Saqlash
                  </button>
                </div>
              </div>

              {/* BRAND NEW DETAILED FOOTER & SECTION BACKGROUNDS EDITOR (Requirements 1-9) */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 mt-6">
                <div>
                  <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    Barcha Bo'limlar Orqa Fonlari va Footer Boshqaruvi
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Bu yerdan Hero/Bosh sahifa, Menu orqa fonlari hamda Footerdagi barcha ma'lumotlar, rasm/logo, sahifalar va ijtimoiy tarmoqlarni to'liq boshqara olasiz.
                  </p>
                </div>

                <hr className="border-zinc-800" />

                {/* REQUIREMENT 9: Section Backgrounds */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-300 block">🖼️ Bo'limlar Orqa Fonlari (Section Backgrounds)</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hero section bg */}
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                      <span className="text-[11px] font-bold text-amber-500 block uppercase">1. Bosh Sahifa (Hero Section) Foni</span>
                      <div>
                        <label className="text-[9px] text-zinc-400 font-bold block mb-1">Fon turi</label>
                        <select
                          value={heroBgType}
                          onChange={(e) => setHeroBgType(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-bold"
                        >
                          <option value="color">Oddiy Rang (Solid Color)</option>
                          <option value="gradient">Gradient Fon</option>
                          <option value="image">Statik Rasm (Image URL)</option>
                          <option value="gif">Harakatli GIF</option>
                          <option value="video">Loop Video (MP4)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-400 font-bold block mb-1">Fon qiymati (URL, gradient kodi yoki rang)</label>
                        <input
                          type="text"
                          value={heroBgValue}
                          onChange={(e) => setHeroBgValue(e.target.value)}
                          placeholder="Qiymat..."
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button 
                          onClick={() => { setHeroBgType("gradient"); setHeroBgValue("linear-gradient(to bottom, #18181b, #09090b)"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Tungi Gradient
                        </button>
                        <button 
                          onClick={() => { setHeroBgType("gradient"); setHeroBgValue("linear-gradient(135deg, #7c2d12, #0c4a6e)"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Olov & Suv
                        </button>
                        <button 
                          onClick={() => { setHeroBgType("image"); setHeroBgValue("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Premium Hall
                        </button>
                        <button 
                          onClick={() => { setHeroBgType("video"); setHeroBgValue("https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-falling-vegetables-and-fruits-in-water-39875-large.mp4"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Salat Video
                        </button>
                      </div>
                    </div>

                    {/* Menu section bg */}
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                      <span className="text-[11px] font-bold text-amber-500 block uppercase">2. Menyu Ro'yxati (Menu Section) Foni</span>
                      <div>
                        <label className="text-[9px] text-zinc-400 font-bold block mb-1">Fon turi</label>
                        <select
                          value={menuBgType}
                          onChange={(e) => setMenuBgType(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-bold"
                        >
                          <option value="color">Oddiy Rang (Solid Color)</option>
                          <option value="gradient">Gradient Fon</option>
                          <option value="image">Statik Rasm (Image URL)</option>
                          <option value="gif">Harakatli GIF</option>
                          <option value="video">Loop Video (MP4)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-400 font-bold block mb-1">Fon qiymati (URL, gradient kodi yoki rang)</label>
                        <input
                          type="text"
                          value={menuBgValue}
                          onChange={(e) => setMenuBgValue(e.target.value)}
                          placeholder="Qiymat..."
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button 
                          onClick={() => { setMenuBgType("color"); setMenuBgValue("transparent"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Shaffof (transparent)
                        </button>
                        <button 
                          onClick={() => { setMenuBgType("color"); setMenuBgValue("#121214"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Qora Fon
                        </button>
                        <button 
                          onClick={() => { setMenuBgType("gradient"); setMenuBgValue("linear-gradient(to right, #09090b, #18181b)"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Slate Gradient
                        </button>
                        <button 
                          onClick={() => { setMenuBgType("image"); setMenuBgValue("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"); }}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 rounded text-[8px] text-zinc-400 border border-zinc-800"
                        >
                          Oshxona fon rasm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* REQUIREMENT 1 & 2: Restaurant Name, Description and Logo */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/50 pb-2">
                    <span className="text-xs font-bold text-zinc-300 block">🏢 Restoran Ma'lumotlari & Logo</span>
                    <label className="inline-flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-all select-none">
                      <input
                        type="checkbox"
                        checked={showFooterInput}
                        onChange={(e) => setShowFooterInput(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-700 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">Footer qismini mijozlarga ko'rsatish (Active)</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Restoran Nomi (Header & Footerda ko'rinadi)</label>
                      <input
                        type="text"
                        value={footerName}
                        onChange={(e) => setFooterName(e.target.value)}
                        placeholder="Masalan: EVOS Fast Food Restaurant"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-bold focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Tavsif / Missiya matni (Footer uchun)</label>
                      <textarea
                        rows={2}
                        value={footerDesc}
                        onChange={(e) => setFooterDesc(e.target.value)}
                        placeholder="Our mission to provide fresh and tasty food..."
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Footer Logo Fayli (Yuklash yoki URL)</label>
                      <div className="flex gap-2">
                        <div className="border border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl p-2 bg-zinc-950 text-center flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 w-1/3">
                          <input
                            type="file"
                            accept="image/*"
                            id="footer-logo-file-upload"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setFooterLogo)}
                          />
                          <label htmlFor="footer-logo-file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <Image className="w-4 h-4 text-zinc-500 mb-1" />
                            <span className="text-[9px] text-zinc-300 font-bold block">Fayl yuklash</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          value={footerLogo}
                          onChange={(e) => setFooterLogo(e.target.value)}
                          placeholder="URL..."
                          className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Copyright Matni</label>
                      <input
                        type="text"
                        value={footerCopyright}
                        onChange={(e) => setFooterCopyright(e.target.value)}
                        placeholder="© 2024 EVOS. Barcha huquqlar himoyalangan."
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* REQUIREMENT 4: Contact Info */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-300 block">📞 Bog'lanish Ma'lumotlari (Contact Information)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Telefon raqam</label>
                      <input
                        type="text"
                        value={footerPhone}
                        onChange={(e) => setFooterPhone(e.target.value)}
                        placeholder="+998 71 200 05 05"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Email / Telegram username</label>
                      <input
                        type="text"
                        value={footerEmail}
                        onChange={(e) => setFooterEmail(e.target.value)}
                        placeholder="info@evos.uz"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Manzil</label>
                      <input
                        type="text"
                        value={footerAddress}
                        onChange={(e) => setFooterAddress(e.target.value)}
                        placeholder="Toshkent shahri, Yunusobod..."
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* REQUIREMENT 3: "Sahifalar" (Pages Link List Management) */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-300 block">🔗 Footer "Sahifalar" Dinamik Ro'yxati</span>
                  
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3.5">
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {footerLinks.map((link, index) => (
                        <div key={link.id} className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-white">{link.name}</span>
                            <span className="text-[9px] font-mono text-zinc-500">{link.url}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveLink(index, 'up')}
                              disabled={index === 0}
                              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[9px] font-bold"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLink(index, 'down')}
                              disabled={index === footerLinks.length - 1}
                              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[9px] font-bold"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id)}
                              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[9px] font-bold"
                            >
                              O'chirish
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
                      <div>
                        <input
                          type="text"
                          value={newLinkName}
                          onChange={(e) => setNewLinkName(e.target.value)}
                          placeholder="Sahifa nomi (Masalan: Menyu)"
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder="Link URL (Masalan: #menu)"
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLink}
                        className="w-full px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-lg text-xs"
                      >
                        Yangi Sahifa Qo'shish
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* REQUIREMENT 5 & 6: Social Media and Mobil Apps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Social media */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-zinc-300 block">📱 Ijtimoiy Tarmoq Linklari</span>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                      <div className="space-y-2 max-h-[160px] overflow-y-auto">
                        {footerSocials.map((social) => (
                          <div key={social.id} className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                            <span className="font-bold text-zinc-300 truncate max-w-[180px]">{social.url}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSocial(social.id)}
                              className="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[9px] font-bold"
                            >
                              O'chirish
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-zinc-800">
                        <input
                          type="text"
                          value={newSocialUrl}
                          onChange={(e) => setNewSocialUrl(e.target.value)}
                          placeholder="Instagram, Telegram yoki YouTube URL..."
                          className="flex-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddSocial}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-lg text-[11px]"
                        >
                          Qo'shish
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobil Apps */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-zinc-300 block">📲 Mobil Ilova Linklari (App Store & Google Play)</span>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                      <div className="space-y-2 max-h-[160px] overflow-y-auto">
                        {footerApps.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-amber-500 text-[10px] uppercase">{app.platform}</span>
                              <span className="text-[9px] text-zinc-400 truncate max-w-[180px]">{app.url}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteApp(app.id)}
                              className="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-[9px] font-bold"
                            >
                              O'chirish
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                        <select
                          value={newAppPlatform}
                          onChange={(e) => setNewAppPlatform(e.target.value)}
                          className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                        >
                          <option value="appstore">App Store</option>
                          <option value="googleplay">Google Play</option>
                          <option value="telegram">Telegram Bot</option>
                          <option value="website">Custom Website Link</option>
                        </select>
                        <input
                          type="text"
                          value={newAppUrl}
                          onChange={(e) => setNewAppUrl(e.target.value)}
                          placeholder="Ilova URL manzili..."
                          className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-white font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddApp}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-lg text-xs"
                      >
                        Ilova Qo'shish
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                {/* REQUIREMENT 8: Footer Background Options */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-300 block">🎨 Footer Orqa Foni (Footer Background Options)</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Footer Fon turi</label>
                      <select
                        value={footerBgType}
                        onChange={(e) => setFooterBgType(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-bold"
                      >
                        <option value="color">Oddiy Rang (Hex)</option>
                        <option value="gradient">Gradient Fon</option>
                        <option value="image">Orqa fon rasm URL</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Fon qiymati (Kod, Rang yoki Rasm URL)</label>
                      <input
                        type="text"
                        value={footerBgValue}
                        onChange={(e) => setFooterBgValue(e.target.value)}
                        placeholder="Masalan: linear-gradient(to right, #451a03, #1e1b4b)"
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-zinc-800" />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveConfig}
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Footer va Barcha Fonlarni Saqlash
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKLET HANDLER */}
          {activeTab === 'booklet' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wide">📖 Ma'lumot qog'ozi (Yo'riqnoma bloknoti)</h2>
                <p className="text-[10px] text-zinc-500">Mijozlar birinchi kirganda chiqadigan bloknot qog'ozi dizayni va uning varoqlaridagi matnlar.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block">Bloknotni Mijozlarga Ko'rsatish (Active)</span>
                  <input
                    type="checkbox"
                    checked={bookletActive}
                    onChange={(e) => setBookletActive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Bloknot Sarlavhasi (Title)</label>
                  <input
                    type="text"
                    value={bookletTitle}
                    onChange={(e) => setBookletTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1.5">Mavjud Varaqlar Matnlari (Pages)</label>
                  <div className="space-y-2">
                    {bookletPagesList.map((page, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                        <span className="text-[10px] font-mono font-bold text-amber-500 shrink-0 mt-0.5">Varaq {idx + 1}:</span>
                        <p className="text-xs text-zinc-300 flex-1">{page}</p>
                        <button
                          onClick={() => handleDeleteBookletPage(idx)}
                          className="text-red-400 hover:text-red-600 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Yangi Varaq Qo'shish Matni</label>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={newBookletPageText}
                      onChange={(e) => setNewBookletPageText(e.target.value)}
                      placeholder="Yangi varoq matnini yozing..."
                      className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white"
                    />
                    <button
                      onClick={handleAddBookletPage}
                      className="px-4 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Qo'shish
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleSaveBooklet}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Bloknotni Saqlash
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADVERTISEMENTS CONTROLLER */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wide">📣 Reklama Bannerlari va Tizimi</h2>
                  <p className="text-[10px] text-zinc-500">Mijozlar menyusida ko'rinadigan karusel (slider) reklama bannerlarini boshqarish.</p>
                </div>
                <button
                  onClick={handleAddAd}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Yangi Reklama Qo'shish
                </button>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
                {adsList.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <p className="text-sm font-medium">Hozircha hech qanday reklama yo'q.</p>
                    <p className="text-[10px] mt-1">Yangi reklama yaratish uchun yuqoridagi tugmani bosing.</p>
                  </div>
                ) : (
                  adsList.map((ad, index) => (
                    <div key={ad.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 relative">
                      <div className="flex flex-wrap justify-between items-center border-b border-zinc-800 pb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-500 font-mono">Reklama #{index + 1}</span>
                          {ad.title && (
                            <span className="text-[10px] text-zinc-400 font-medium max-w-[150px] truncate">({ad.title})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Ordering Controls */}
                          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                            <button
                              onClick={() => handleMoveAdUp(index)}
                              disabled={index === 0}
                              className="px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold"
                              title="Yuqoriga surish"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => handleMoveAdDown(index)}
                              disabled={index === adsList.length - 1}
                              className="px-2 py-1 rounded hover:bg-zinc-800 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-bold"
                              title="Pastga surish"
                            >
                              ▼
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500">Faollik:</span>
                            <input
                              type="checkbox"
                              checked={ad.active}
                              onChange={(e) => handleUpdateAdField(ad.id, "active", e.target.checked)}
                              className="w-4 h-4 rounded text-amber-500 bg-zinc-950 border-zinc-800 focus:ring-amber-500"
                            />
                          </div>

                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="px-2 py-1 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors text-[10px] font-bold flex items-center gap-1"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> O'chirish
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Sarlavha matni</label>
                          <input
                            type="text"
                            value={ad.title || ""}
                            onChange={(e) => handleUpdateAdField(ad.id, "title", e.target.value)}
                            placeholder="Masalan: Maxsus Taklif!"
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Reklama turi</label>
                          <select
                            value={ad.type}
                            onChange={(e) => handleUpdateAdField(ad.id, "type", e.target.value as any)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-amber-500"
                          >
                            <option value="image">Statik Rasm</option>
                            <option value="video">Harakatli Video</option>
                            <option value="gif">GIF Animatsiya</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Joylashuv O'rni</label>
                          <select
                            value={ad.position}
                            onChange={(e) => handleUpdateAdField(ad.id, "position", e.target.value as any)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-amber-500 font-bold"
                          >
                            <option value="top">Tepa Banner (Header)</option>
                            <option value="sidebar">Yon Karusel (Hero Slider)</option>
                            <option value="bottom">Pastki Banner (Footer)</option>
                            <option value="popup">Qalqib chiquvchi oyna (Popup)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 block mb-1">Nishon URL Manzil (Havola)</label>
                          <input
                            type="text"
                            value={ad.linkUrl}
                            onChange={(e) => handleUpdateAdField(ad.id, "linkUrl", e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 block mb-1">Reklama Banner Fayli (Yuklash yoki URL link)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Drag and Drop Zone */}
                          <div 
                            className="border border-dashed border-zinc-700 hover:border-amber-500/50 rounded-xl p-3 bg-zinc-950 text-center flex flex-col items-center justify-center cursor-pointer transition-all relative group"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === "string") handleUpdateAdField(ad.id, "contentUrl", reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*,video/*"
                              id={`ad-file-upload-${ad.id}`}
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === "string") handleUpdateAdField(ad.id, "contentUrl", reader.result);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                            <label htmlFor={`ad-file-upload-${ad.id}`} className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                              <Image className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition-colors mb-1 pointer-events-none" />
                              <span className="text-[10px] text-zinc-300 font-bold block pointer-events-none">Faylni bosing yoki sudrang</span>
                              <span className="text-[8px] text-zinc-500 block pointer-events-none">Rasm, Video yoki GIF (.png, .mp4, .gif)</span>
                            </label>
                          </div>

                          {/* Fallback Text Input & Preview */}
                          <div className="flex flex-col justify-between gap-2">
                            <input
                              type="text"
                              value={ad.contentUrl}
                              onChange={(e) => handleUpdateAdField(ad.id, "contentUrl", e.target.value)}
                              placeholder="Yoki banner URL manzilini kiriting..."
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                            />
                            {ad.contentUrl && (
                              <div className="flex items-center gap-2 p-1.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                                {ad.type === "video" ? (
                                  <video src={ad.contentUrl} className="w-8 h-8 object-cover rounded-lg border border-zinc-800 shrink-0" muted />
                                ) : (
                                  <img src={ad.contentUrl} alt="Preview" className="w-8 h-8 object-cover rounded-lg border border-zinc-800 shrink-0" referrerPolicy="no-referrer" />
                                )}
                                <div className="overflow-hidden max-w-[120px]">
                                  <span className="text-[9px] text-green-400 font-bold block">Tanlandi!</span>
                                  <span className="text-[7px] text-zinc-500 block truncate font-mono">{ad.contentUrl.substring(0, 15)}...</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => handleUpdateAdField(ad.id, "contentUrl", "")} 
                                  className="text-red-400 hover:text-red-500 text-[10px] font-bold ml-auto px-1.5 py-0.5 rounded bg-red-500/10"
                                >
                                  X
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div className="flex justify-end pt-3 border-t border-zinc-800">
                  <button
                    onClick={handleSaveAds}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Reklamani Saqlash
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LANGUAGES MANAGER */}
          {activeTab === 'languages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wide">🌐 Tillar va Tarjimalar Boshqaruvi</h2>
                <p className="text-[10px] text-zinc-500">Mijozlar menyusi tepadagi translate tizimiga real tillar qo'shish va ularni sozlash.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-2">Mavjud Tillari Ro'yxati</label>
                  <div className="flex flex-wrap gap-2">
                    {state.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 text-white rounded-lg text-xs font-extrabold uppercase font-mono"
                      >
                        {lang === "uz" ? "🇺🇿 O'zbekcha" : lang === "uz_cyr" ? "🇺🇿 Ўзбекча" : lang === "ru" ? "🇷🇺 Русский" : lang === "en" ? "🇬🇧 English" : lang === "fr" ? "🇫🇷 Français" : lang === "it" ? "🇮🇹 Italiano" : `🌍 ${lang.toUpperCase()}`}
                      </span>
                    ))}
                  </div>
                </div>

                <hr className="border-zinc-800" />

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 block mb-1">Yangi til kodi qo'shish (e.g. de, fr, tr, uz)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masalan: tr"
                      value={newLangCode}
                      onChange={(e) => setNewLangCode(e.target.value)}
                      maxLength={3}
                      className="w-32 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white font-bold"
                    />
                    <button
                      onClick={handleAddLanguage}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-bold transition-all flex items-center justify-center whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Yangi til qo'shish
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                    Yangi til qo'shilganda O'zbekcha til tarjimalari unga shablon sifatida ko'chiriladi. Har qanday til avtomatik ravishda mijozlar interfeysida translate paneli orqali faollashadi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ABOUT CAFE MANAGER */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wide">🏠 Restaran/Cafe Haqida Sozlamalari</h2>
                <p className="text-[10px] text-zinc-500">
                  Mijozlar menyusining tepadagi yoki carousel qismidagi "Restaran/Cafe haqida" tugmasi bosilganda chiqadigan ma'lumotlarni tahrirlash.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
                
                {/* Text description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 block">📝 Batafsil Ma'lumot va Tavsif</label>
                  <textarea
                    rows={4}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Kafemiz va uning tarixi, mazali taomlari haqida batafsil yozing..."
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 text-white leading-relaxed"
                  />
                </div>

                {/* REQUIREMENT: Contact & Address Settings */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-300 block">📞 Aloqa va Bog'lanish Ma'lumotlari</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Telefon Raqami</label>
                      <input
                        type="text"
                        value={aboutPhone}
                        onChange={(e) => setAboutPhone(e.target.value)}
                        placeholder="+998 71 200 05 05"
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Email Manzili</label>
                      <input
                        type="text"
                        value={aboutEmail}
                        onChange={(e) => setAboutEmail(e.target.value)}
                        placeholder="info@lazzat.uz"
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Kafening To'liq Manzili</label>
                      <input
                        type="text"
                        value={aboutAddress}
                        onChange={(e) => setAboutAddress(e.target.value)}
                        placeholder="Toshkent shahri, Amir Temur ko'chasi, 12-uy"
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* REQUIREMENT: Map coordinates setting */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-zinc-300 block">📍 Geolokatsiya Koordinatalari (Map Coordinates)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800/80">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Kenglik (Latitude)</label>
                      <input
                        type="number"
                        step="any"
                        value={aboutLat}
                        onChange={(e) => setAboutLat(Number(e.target.value))}
                        placeholder="41.3111"
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1">Uzunlik (Longitude)</label>
                      <input
                        type="number"
                        step="any"
                        value={aboutLng}
                        onChange={(e) => setAboutLng(Number(e.target.value))}
                        placeholder="69.2797"
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-500 block leading-tight">
                    * Ushbu koordinatalar haqimizda sahifasidagi interaktiv xaritani ko'rsatish uchun foydalaniladi (Google/OpenStreetMap o'rnida).
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Photo Section */}
                  <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800/60">
                    <label className="text-xs font-bold text-amber-500 block">📸 Rasm (Photo)</label>
                    <input
                      type="text"
                      placeholder="Rasm URL manzili..."
                      value={aboutImage}
                      onChange={(e) => setAboutImage(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-white focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">Yoki rasm yuklang:</span>
                      <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors">
                        Yuklash
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setAboutImage(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {aboutImage && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                        <img src={aboutImage} alt="About preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setAboutImage("")}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GIF Section */}
                  <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800/60">
                    <label className="text-xs font-bold text-amber-500 block">✨ GIF Animatsiya</label>
                    <input
                      type="text"
                      placeholder="GIF URL manzili..."
                      value={aboutGif}
                      onChange={(e) => setAboutGif(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-white focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">Yoki GIF yuklang:</span>
                      <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors">
                        Yuklash
                        <input
                          type="file"
                          accept="image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setAboutGif(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {aboutGif && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                        <img src={aboutGif} alt="GIF preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setAboutGif("")}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Video Section */}
                  <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800/60">
                    <label className="text-xs font-bold text-amber-500 block">🎥 Video Lavha</label>
                    <input
                      type="text"
                      placeholder="Video URL manzili..."
                      value={aboutVideo}
                      onChange={(e) => setAboutVideo(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-white focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500">Yoki video yuklang:</span>
                      <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors">
                        Yuklash
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setAboutVideo(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {aboutVideo && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                        <video src={aboutVideo} className="w-full h-full object-cover" controls />
                        <button
                          type="button"
                          onClick={() => setAboutVideo("")}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* REQUIREMENT: Photo Gallery Section */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <span className="text-xs font-bold text-zinc-300 block">🖼️ Rasm Galereyasi (Photo Gallery Collection)</span>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">Galereyaga yangi rasmlar yuklang (Multi-Upload base64):</span>
                      <label className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-black text-xs font-extrabold px-3.5 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-amber-500/10">
                        <Plus className="w-4 h-4" />
                        Rasm Qo'shish
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                  setAboutGallery((prev) => [...prev, reader.result as string]);
                                }
                              };
                              reader.readAsDataURL(file as any);
                            });
                          }}
                        />
                      </label>
                    </div>

                    {aboutGallery.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                        {aboutGallery.map((imgUrl, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 group">
                            <img src={imgUrl} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setAboutGallery((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-mono px-1 rounded">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-xs">
                        Hozircha galereyaga hech qanday rasm qo'shilmagan.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-800/60">
                  <button
                    onClick={handleSaveAbout}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Ma'lumotlarni Saqlash
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB: NAVBAR MANAGEMENT */}
          {activeTab === 'navbar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wide">🧭 Navbar Menyu Boshqaruvi</h2>
                  <p className="text-[10px] text-zinc-500">Mijoz sahifasining yuqori qismidagi tezkor havolalar va menyularni boshqarish.</p>
                </div>
                <button
                  onClick={() => {
                    resetNavbarLinkFields();
                    setEditingNavbarLink(null);
                    setIsAddingNavbarLink(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Yangi Havola Qo'shish
                </button>
              </div>

              {/* Form Block for Adding/Editing Navbar Link */}
              {(isAddingNavbarLink || editingNavbarLink) && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-extrabold text-amber-500">
                    {editingNavbarLink ? "🖊️ Havola ma'lumotlarini tahrirlash" : "✨ Yangi havola qo'shish formasi"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase tracking-wider">Havola Nomi</label>
                      <input
                        type="text"
                        placeholder="Masalan: 🏠 Aksiyalar, Menyu va h.k."
                        value={navLinkName}
                        onChange={(e) => setNavLinkName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase tracking-wider">Havola Manzili (URL / Anchor)</label>
                      <input
                        type="text"
                        placeholder="Masalan: #menu, #about, #ads yoki to'liq url"
                        value={navLinkUrl}
                        onChange={(e) => setNavLinkUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                      <span className="text-[9px] text-zinc-500 mt-1 block">Silliq scroll qilish uchun # bilan boshlanadigan ID larni yozing (masalan #menu)</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase tracking-wider">Tartib raqami</label>
                      <input
                        type="number"
                        min="1"
                        value={navLinkOrder}
                        onChange={(e) => setNavLinkOrder(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex flex-col justify-center">
                      <label className="text-[10px] font-bold text-zinc-400 block mb-2 uppercase tracking-wider">Ko'rinish Holati (ON / OFF)</label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setNavLinkVisible(true)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            navLinkVisible ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-zinc-800 text-zinc-500 border border-zinc-700/50"
                          }`}
                        >
                          Ko'rsatilsin (ON)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNavLinkVisible(false)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            !navLinkVisible ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-zinc-800 text-zinc-500 border border-zinc-700/50"
                          }`}
                        >
                          Yashirilsin (OFF)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNavbarLink(false);
                        setEditingNavbarLink(null);
                        resetNavbarLinkFields();
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Bekor Qilish
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNavbarLink}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-extrabold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Havolani Saqlash
                    </button>
                  </div>
                </div>
              )}

              {/* Navbar Links List Grid */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">Havolalar ro'yxati</span>
                  <span className="text-[10px] font-mono text-zinc-500">{navbarLinksList.length} ta element</span>
                </div>

                {navbarLinksList.length > 0 ? (
                  <div className="divide-y divide-zinc-800">
                    {navbarLinksList.map((link) => (
                      <div key={link.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-850/30 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{link.name}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              link.visible 
                                ? "bg-green-500/10 text-green-400 border border-green-500/25" 
                                : "bg-red-500/10 text-red-400 border border-red-500/25"
                            }`}>
                              {link.visible ? "Faol (ON)" : "Yashirin (OFF)"}
                            </span>
                            <span className="text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md font-mono">
                              Tartib: #{link.order}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                            <span className="text-zinc-600">Manzil:</span> {link.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setEditingNavbarLink(link);
                              setIsAddingNavbarLink(false);
                              setNavLinkName(link.name);
                              setNavLinkUrl(link.url);
                              setNavLinkOrder(link.order);
                              setNavLinkVisible(link.visible);
                            }}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded-lg transition-colors text-zinc-300"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNavbarLink(link.id)}
                            className="p-2 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/10"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-zinc-500 text-xs border-b border-zinc-850">
                    Hozircha hech qanday tezkor havola mavjud emas. Yangi havola qo'shing.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: FAQ MANAGEMENT */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wide">❓ Savol-Javob Boshqaruvi</h2>
                  <p className="text-[10px] text-zinc-500">Mijozlarga yordam beruvchi savol-javoblar (FAQ) ro'yxatini boshqarish oynasi.</p>
                </div>
                <button
                  onClick={() => {
                    resetFaqFields();
                    setEditingFaq(null);
                    setIsAddingFaq(true);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Yangi Savol-Javob Qo'shish
                </button>
              </div>

              {/* Form Block for Adding/Editing FAQ */}
              {(isAddingFaq || editingFaq) && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-5">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <h3 className="text-sm font-extrabold text-amber-500">
                      {editingFaq ? "🖊️ Savol-javobni tahrirlash" : "✨ Yangi savol-javob qo'shish formasi"}
                    </h3>
                    <button
                      type="button"
                      onClick={handleAutoTranslateFaq}
                      disabled={isTranslating}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 disabled:opacity-50 text-white text-[11px] font-bold rounded-lg border border-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {isTranslating ? "Tarjima qilinmoqda..." : "Avto-tarjima (barcha tillarga)"}
                    </button>
                  </div>

                  {/* Language Selector Tabs for Form */}
                  <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                    {[
                      { code: "uz", label: "O'zbekcha 🇺🇿" },
                      { code: "uz_cyr", label: "Ўзбекcha 🇺🇿" },
                      { code: "ru", label: "Русский 🇷🇺" },
                      { code: "en", label: "English 🇬🇧" },
                      { code: "de", label: "Deutsch 🇩🇪" },
                      { code: "fr", label: "Français 🇫🇷" },
                      { code: "it", label: "Italiano 🇮🇹" }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setFaqFormLang(lang.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          faqFormLang === lang.code
                            ? "bg-amber-500 text-black font-extrabold"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase tracking-wider">
                        Savol ({faqFormLang === 'uz' ? "O'zbekcha" : faqFormLang === 'uz_cyr' ? "Ўзбекча" : faqFormLang.toUpperCase()})
                      </label>
                      <input
                        type="text"
                        placeholder="Masalan: Kafe qachondan boshlab ishlaydi?"
                        value={faqQuestion[faqFormLang] || ""}
                        onChange={(e) => {
                          setFaqQuestion({
                            ...faqQuestion,
                            [faqFormLang]: e.target.value
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase tracking-wider">
                        Javob ({faqFormLang === 'uz' ? "O'zbekcha" : faqFormLang === 'uz_cyr' ? "Ўзбекча" : faqFormLang.toUpperCase()})
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Masalan: Kafemiz har kuni 09:00 dan 23:00 gacha xizmat ko'rsatadi."
                        value={faqAnswer[faqFormLang] || ""}
                        onChange={(e) => {
                          setFaqAnswer({
                            ...faqAnswer,
                            [faqFormLang]: e.target.value
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 italic">
                    💡 Tavsiya: Istalgan bir tilda (masalan, O'zbekcha) savol va javobni to'ldirib, yuqoridagi <strong>"Avto-tarjima"</strong> tugmasini bossangiz, boshqa tillarga avtomatik tarjima qilinadi!
                  </p>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        setIsAddingFaq(false);
                        setEditingFaq(null);
                        resetFaqFields();
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Bekor Qilish
                    </button>
                    <button
                      onClick={handleSaveFaq}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {editingFaq ? "Tahrirni Saqlash" : "Qo'shish"}
                    </button>
                  </div>
                </div>
              )}

              {/* FAQ List Table / Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">Mavjud Savol-Javoblar</h3>

                {faqList.length > 0 ? (
                  <div className="space-y-3">
                    {faqList.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-4 bg-zinc-900 border border-zinc-850 hover:border-zinc-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-xs font-extrabold text-zinc-200 truncate block">
                              {item.question.uz || "(Savol kiritilmagan)"}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 pl-7 leading-relaxed line-clamp-2">
                            {item.answer.uz || "(Javob kiritilmagan)"}
                          </p>
                        </div>

                        {/* Actions & Sorting */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pl-7 sm:pl-0">
                          {/* Order Control Buttons */}
                          <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                            <button
                              disabled={index === 0}
                              onClick={() => handleMoveFaq(index, 'up')}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                              title="Yuqoriga surish"
                            >
                              ▲
                            </button>
                            <button
                              disabled={index === faqList.length - 1}
                              onClick={() => handleMoveFaq(index, 'down')}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                              title="Pastga surish"
                            >
                              ▼
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setEditingFaq(item);
                              setIsAddingFaq(false);
                              setFaqQuestion({ ...item.question });
                              setFaqAnswer({ ...item.answer });
                              setFaqFormLang("uz");
                            }}
                            className="p-2 bg-zinc-800 hover:bg-zinc-750 hover:text-white rounded-lg transition-colors text-zinc-300 cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteFaq(item.id)}
                            className="p-2 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all border border-red-500/10 cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-zinc-500 text-xs border border-zinc-850 rounded-2xl bg-zinc-900/10">
                    Hozircha hech qanday savol-javob mavjud emas. Yangi savol-javob qo'shing.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Beautiful Admin Comments Overlay Modal */}
        {selectedFoodForComments && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">"{selectedFoodForComments.name}" - Izohlari</h3>
                    <p className="text-[10px] text-zinc-500">Mijozlar tomonidan qoldirilgan izohlarni ko'rish va o'chirish.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFoodForComments(null)}
                  className="p-1.5 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {foodComments.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 italic">
                    <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs">Ushbu taom uchun hozircha hech qanday izoh yozilmagan.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {foodComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-white truncate">{comment.author}</span>
                            <span className="text-[9px] text-zinc-500 font-mono shrink-0">{comment.date}</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed break-words">{comment.text}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                          title="Izohni o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-zinc-950/50 border-t border-zinc-850 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedFoodForComments(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Beautiful Floating Iframe-Friendly Toast Notification */}
        {feedback && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-zinc-950/95 border border-zinc-800 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 hover:border-amber-500/30">
            <div className={`p-1.5 rounded-xl shrink-0 ${feedback.type === "error" ? "bg-red-500/15 text-red-400 border border-red-500/20" : "bg-green-500/15 text-green-400 border border-green-500/20"}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-extrabold text-white leading-normal">{feedback.message}</p>
            </div>
            <button 
              onClick={() => setFeedback(null)} 
              className="text-zinc-500 hover:text-white text-xs font-extrabold px-1.5 py-0.5 rounded-md hover:bg-zinc-800/50 transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
