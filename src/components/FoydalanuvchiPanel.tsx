import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Globe, Volume2, Loader2, X, ChevronLeft, ChevronRight, Star, Settings, Key, AlertCircle, Menu, Phone, Lock, Mail, MapPin, Send, Instagram, Facebook, Youtube, Music, Clipboard, Trash2, MessageSquare, MessageCircle, UserX, ShoppingCart, Truck, CreditCard, BookOpen, ShieldAlert, Languages, Sparkles } from "lucide-react";
import { CrmState, MenuItem, Translations } from "../types";

const LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  uz: {
    som: "so'm",
    stockIn: "ta bor",
    outOfStock: "Tugagan 🛑",
    narxi: "Narxi:",
    voiceListen: "Ovozli eshitish",
    reading: "O'qilmoqda...",
    noFood: "Qidiruv bo'yicha hech qanday taom topilmadi.",
    chefRating: "Oshpaz bahosi",
    seniorAlert: "Kattalar va qariyalarga taom ta'rifini ovozli tushuntirib berish tizimi.",
    page: "Varaq",
    prev: "Oldingi",
    next: "Keyingi",
    goToMenu: "Menyuga o'tish ✅",
    adSpace: "REKLAMA",
    outofstockSimple: "Tugadi",
    ta: "ta",
    all: "Barchasi",
    googleTranslator: "Google Tarjimon",
    info: "Ma'lumot",
    day: "Kunduz",
    night: "Tungi",
    autoTranslateDesc: "Istagan tilga avtomat tarzda butun sahifani tarjima qilish imkoniyati",
    systemSections: "Tizim bo'limlari",
    aboutCafe: "Restaran/Cafe haqida",
    aboutFood: "Ovqat haqida",
    stopAudio: "Ovozni to'xtatish 🛑",
    profile: "👤 Profil",
    logout: "Chiqish",
    deleteProfile: "Profilni o'chirish 🗑️",
    yourPhone: "Telefon raqamingiz",
    continueBtn: "Davom etish",
    enterPhoneTitle: "Iltimos, telefon raqamingizni kiriting",
    enterPhonePlaceholder: "Masalan: +998 90 123 45 67",
    reklamaTitle: "Reklama",
    phoneRequiredAlert: "Iltimos, telefon raqamingizni kiriting!"
  },
  uz_cyr: {
    som: "сўм",
    stockIn: "та бор",
    outOfStock: "Тугаган 🛑",
    narxi: "Нархи:",
    voiceListen: "Овозли эшитиш",
    reading: "Ўқилмоқда...",
    noFood: "Қидирув бўйича ҳеч қандай таом топилмади.",
    chefRating: "Ошпаз баҳоси",
    seniorAlert: "Катталар ва қарияларга таом таърифини овозли тушунтириб бериш тизими.",
    page: "Варақ",
    prev: "Олдинги",
    next: "Кейинги",
    goToMenu: "Менюга ўтиш ✅",
    adSpace: "РЕКЛАМА",
    outofstockSimple: "Тугади",
    ta: "та",
    all: "Барчаси",
    googleTranslator: "Google Таржимон",
    info: "Маълумот",
    day: "Кундуз",
    night: "Тунги",
    autoTranslateDesc: "Истаган тилга автомат тарзда бутун саҳифани таржима қилиш имконияти",
    systemSections: "Тизим бўлимлари",
    aboutCafe: "Рестаран/Кафе ҳақида",
    aboutFood: "Овқат ҳақида",
    stopAudio: "Овозни тўхтатиш 🛑",
    profile: "👤 Профил",
    logout: "Чиқиш",
    deleteProfile: "Профилни ўчириш 🗑️",
    yourPhone: "Телефон рақамингиз",
    continueBtn: "Давом этиш",
    enterPhoneTitle: "Илтимос, телефон рақамингизни киритинг",
    enterPhonePlaceholder: "Масалан: +998 90 123 45 67",
    reklamaTitle: "Реклама",
    phoneRequiredAlert: "Илтимос, телефон рақамингизни киритинг!"
  },
  ru: {
    som: "сум",
    stockIn: "в наличии",
    outOfStock: "Закончилось 🛑",
    narxi: "Цена:",
    voiceListen: "Прослушать описание",
    reading: "Чтение...",
    noFood: "Блюда не найдены по вашему запросу.",
    chefRating: "Оценка шеф-повара",
    seniorAlert: "Система голосового объяснения описания блюд для пожилых людей.",
    page: "Страница",
    prev: "Назад",
    next: "Вперед",
    goToMenu: "Перейти к меню ✅",
    adSpace: "РЕКЛАМА",
    outofstockSimple: "Нет",
    ta: "шт",
    all: "Все",
    googleTranslator: "Google Переводчик",
    info: "Информация",
    day: "День",
    night: "Ночь",
    autoTranslateDesc: "Возможность автоматического перевода всей страницы на любой язык",
    systemSections: "Разделы системы",
    aboutCafe: "О ресторане/кафе",
    aboutFood: "О блюде",
    stopAudio: "Остановить 🛑",
    profile: "👤 Профиль",
    logout: "Выйти",
    deleteProfile: "Удалить профиль 🗑️",
    yourPhone: "Ваш номер телефона",
    continueBtn: "Продолжить",
    enterPhoneTitle: "Пожалуйста, введите ваш номер телефона",
    enterPhonePlaceholder: "Например: +998 90 123 45 67",
    reklamaTitle: "Реклама",
    phoneRequiredAlert: "Пожалуйста, введите ваш номер телефона!"
  },
  en: {
    som: "soum",
    stockIn: "in stock",
    outOfStock: "Out of Stock 🛑",
    narxi: "Price:",
    voiceListen: "Listen to Voice-Over",
    reading: "Reading...",
    noFood: "No dishes found for your search query.",
    chefRating: "Chef's Rating",
    seniorAlert: "Voice-over system to explain the dish description to seniors and adults.",
    page: "Page",
    prev: "Previous",
    next: "Next",
    goToMenu: "Go to Menu ✅",
    adSpace: "ADVERTISEMENT",
    outofstockSimple: "Ended",
    ta: "pcs",
    all: "All",
    googleTranslator: "Google Translate",
    info: "Information",
    day: "Day",
    night: "Night",
    autoTranslateDesc: "Ability to automatically translate the entire page into any language",
    systemSections: "System Sections",
    aboutCafe: "About Restaurant/Cafe",
    aboutFood: "About the dish",
    stopAudio: "Stop voice 🛑",
    profile: "👤 Profile",
    logout: "Logout",
    deleteProfile: "Delete Profile 🗑️",
    yourPhone: "Your phone number",
    continueBtn: "Continue",
    enterPhoneTitle: "Please enter your phone number",
    enterPhonePlaceholder: "Example: +998 90 123 45 67",
    reklamaTitle: "Advertisement",
    phoneRequiredAlert: "Please enter your phone number!"
  },
  de: {
    som: "Som",
    stockIn: "Stück auf Lager",
    outOfStock: "Ausverkauft 🛑",
    narxi: "Preis:",
    voiceListen: "Beschreibung anhören",
    reading: "Lesen...",
    noFood: "Keine Gerichte für Ihre Suche gefunden.",
    chefRating: "Sterne des Chefs",
    seniorAlert: "Sprachausgabe zur Erklärung der Gerichtsbeschreibung für Senioren und Erwachsene.",
    page: "Seite",
    prev: "Zurück",
    next: "Weiter",
    goToMenu: "Zum Menü gehen ✅",
    adSpace: "WERBUNG",
    outofstockSimple: "Beendet",
    ta: "Stk",
    all: "Alle",
    googleTranslator: "Google Übersetzer",
    info: "Information",
    day: "Tag",
    night: "Nacht",
    autoTranslateDesc: "Möglichkeit, die gesamte Seite automatisch in eine beliebige Sprache zu übersetzen",
    systemSections: "Systembereiche",
    aboutCafe: "Über Restaurant/Café",
    aboutFood: "Über das Gericht",
    stopAudio: "Stoppen 🛑",
    profile: "👤 Profil",
    logout: "Abmelden",
    deleteProfile: "Profil löschen 🗑️",
    yourPhone: "Ihre Telefonnummer",
    continueBtn: "Weiter",
    enterPhoneTitle: "Bitte geben Sie Ihre Telefonnummer ein",
    enterPhonePlaceholder: "Z.B.: +998 90 123 45 67",
    reklamaTitle: "Werbung",
    phoneRequiredAlert: "Bitte geben Sie Ihre Telefonnummer ein!"
  },
  fr: {
    som: "soum",
    stockIn: "en stock",
    outOfStock: "Épuisé 🛑",
    narxi: "Prix:",
    voiceListen: "Écouter la description",
    reading: "Lecture...",
    noFood: "Aucun plat trouvé pour votre recherche.",
    chefRating: "Note du chef",
    seniorAlert: "Système de description audio des plats pour seniors et adultes.",
    page: "Page",
    prev: "Précédent",
    next: "Suivant",
    goToMenu: "Aller au menu ✅",
    adSpace: "PUBLICITÉ",
    outofstockSimple: "Épuisé",
    ta: "pcs",
    all: "Tout",
    googleTranslator: "Google Traduction",
    info: "Informations",
    day: "Jour",
    night: "Nuit",
    autoTranslateDesc: "Possibilité de traduire automatiquement toute la page dans n'importe quelle langue",
    systemSections: "Sections du système",
    aboutCafe: "À propos du restaurant/café",
    aboutFood: "À propos du plat",
    stopAudio: "Arrêter l'audio 🛑",
    profile: "👤 Profil",
    logout: "Déconnexion",
    deleteProfile: "Supprimer le profil 🗑️",
    yourPhone: "Votre numéro de téléphone",
    continueBtn: "Continuer",
    enterPhoneTitle: "Veuillez entrer votre numéro de téléphone",
    enterPhonePlaceholder: "Par exemple: +998 90 123 45 67",
    reklamaTitle: "Publicité",
    phoneRequiredAlert: "Veuillez entrer votre numéro de téléphone!"
  },
  it: {
    som: "soum",
    stockIn: "disponibile",
    outOfStock: "Terminato 🛑",
    narxi: "Prezzo:",
    voiceListen: "Ascolta la descrizione",
    reading: "Lettura...",
    noFood: "Nessun piatto trovato per la tua ricerca.",
    chefRating: "Valutazione dello chef",
    seniorAlert: "Sistema di spiegazione vocale dei piatti per anziani e adulti.",
    page: "Pagina",
    prev: "Precedente",
    next: "Successivo",
    goToMenu: "Vai al menu ✅",
    adSpace: "PUBBLICITÀ",
    outofstockSimple: "Finito",
    ta: "pz",
    all: "Tutto",
    googleTranslator: "Google Traduttore",
    info: "Informazioni",
    day: "Giorno",
    night: "Notte",
    autoTranslateDesc: "Möglichkeit, die gesamte Seite automatisch in eine beliebige Sprache zu übersetzen",
    systemSections: "Sezioni del sistema",
    aboutCafe: "Informazioni sul ristorante/bar",
    aboutFood: "Informazioni sul piatto",
    stopAudio: "Interrompi audio 🛑",
    profile: "👤 Profilo",
    logout: "Disconnetti",
    deleteProfile: "Elimina profilo 🗑️",
    yourPhone: "Il tuo numero di telefono",
    continueBtn: "Continua",
    enterPhoneTitle: "Inserisci il tuo numero di telefono",
    enterPhonePlaceholder: "Ad esempio: +998 90 123 45 67",
    reklamaTitle: "Pubblicità",
    phoneRequiredAlert: "Inserisci il tuo numero di telefono!"
  }
};

interface GuideSection {
  title: string;
  desc: string;
  icon: string;
}

const KITCHEN_GUIDE_DATA: Record<string, { title: string; subtitle: string; closeBtn: string; sections: GuideSection[] }> = {
  uz: {
    title: "Oshxonamiz Yo'riqnomasi",
    subtitle: "Lazzat CRM tizimidan o'ta qulay va samarali foydalanish bo'yicha qo'llanma",
    closeBtn: "Yo'riqnomani yopish",
    sections: [
      {
        title: "🔑 Ro'yxatdan o'tish shartmi?",
        desc: "Tizimimizdan foydalanish uchun hech qanday ro'yxatdan o'tish yoki shaxsiy hisobga kirish talab etilmaydi. Menyuni istalgan vaqtda erkin ko'rib chiqishingiz va buyurtma berishingiz mumkin.",
        icon: "UserX"
      },
      {
        title: "🛒 Taom tanlash va Savat",
        desc: "Yoqtirgan taomingiz ustiga bosib, uning batafsil tavsifi, narxi va oshpaz bahosi bilan tanishishingiz mumkin. Taomni savatga qo'shish uchun mos tugmani bosing va miqdorini belgilang.",
        icon: "ShoppingCart"
      },
      {
        title: "📦 Buyurtma berish usuli",
        desc: "Buyurtma berish uchun Savat bo'limiga o'ting. U yerda yetkazib berish (dostavka) yoki restoranning o'zidan olib ketish (pikap) usullaridan birini tanlang. Ismingiz va telefon raqamingizni kiriting.",
        icon: "Truck"
      },
      {
        title: "💳 To'lovni amalga oshirish",
        desc: "To'lovlar buyurtma yetkazilganda yoki olib ketayotganda qabul qilinadi. Siz naqd pul, plastik karta yoki Click va Payme kabi qulay milliy to'lov ilovalari orqali to'lashingiz mumkin.",
        icon: "CreditCard"
      },
      {
        title: "🔊 Ovozli ta'rif (TTS) nima?",
        desc: "Kattalar, qariyalar hamda ko'rish qobiliyati cheklangan yurtdoshlarimiz uchun maxsus ovozli eshitish tizimi ishlab chiqilgan. 'Ta'rifni eshitish' tugmasini bossangiz, sun'iy intellekt taom tavsifini ovoz chiqarib o'qib beradi.",
        icon: "Volume2"
      },
      {
        title: "💬 Izoh qoldirish qoidalari",
        desc: "Taomlar va xizmat ko'rsatish haqida faqat samimiy, madaniyatli va haqiqiy fikrlarni yozishingizni so'raymiz. Sog'likka oid asossiz tavsiyalar, haqoratomuz so'zlar yoki reklama ko'rinishidagi izohlar qat'iyan taqiqlanadi.",
        icon: "MessageSquare"
      },
      {
        title: "🌐 Tilni almashtirish",
        desc: "Sahifaning eng yuqorisida joylashgan dunyo (globe) belgili til almashtirish tugmasi orqali tizimni bir soniyada o'zingiz tushunadigan tilga (O'zbekcha, Ruscha, Inglizcha va h.k.) o'tkazishingiz mumkin.",
        icon: "Languages"
      },
      {
        title: "⚠️ Muhim qoidalar",
        desc: "Buyurtmani bekor qilish faqatgina oshpazlarimiz taomni tayyorlashga kirishishidan oldin, telefon orqali qo'llab-quvvatlash markazimizga qo'ng'iroq qilish yo'li bilan amalga oshirilishi mumkin. Ma'lumotlaringizni aniq kiriting.",
        icon: "ShieldAlert"
      }
    ]
  },
  uz_cyr: {
    title: "Ошхонамиз Йўриқномаси",
    subtitle: "Lazzat CRM тизимидан ўта қулай ва самарали фойдаланиш бўйича қўлланма",
    closeBtn: "Йўриқномани ёпиш",
    sections: [
      {
        title: "🔑 Рўйхатдан ўтиш шартми?",
        desc: "Тизимимиздан фойдаланиш учун ҳеч қандай рўйхатдан ўтиш ёки шахсий ҳисобга кириш талаб этилмайди. Менюни исталган вақтда эркин кўриб чиқишингиз ва буюртма беришингиз мумкин.",
        icon: "UserX"
      },
      {
        title: "🛒 Таом танлаш ва Сават",
        desc: "Ёқтирган таомингиз устига босиб, унинг батафсил тавсифи, нархи ва ошпаз баҳоси билан танишишингиз мумкин. Таомни саватга қўшиш учун мос тугмани босинг ва миқдорини белгиланг.",
        icon: "ShoppingCart"
      },
      {
        title: "📦 Буюртма бериш усули",
        desc: "Буюртма бериш учун Сават бўлимига ўтинг. У ерда етказиб бериш (доставка) ёки рестораннинг ўзидан олиб кетиш (пикап) усулларидан бирини танланг. Исмингиз ва телефон рақамингизни киритинг.",
        icon: "Truck"
      },
      {
        title: "💳 Тўловни амалга ошириш",
        desc: "Тўловлар буюртма етказилганда ёки олиб кетаётганда қабул қилинади. Сиз нақд пул, пластик карта ёки Click ва Payme каби қулай миллий тўлов иловалари орқали тўлашингиз мумкин.",
        icon: "CreditCard"
      },
      {
        title: "🔊 Овозли таъриф (TTS) нима?",
        desc: "Катталар, қариялар ҳамда кўриш қобилияти чекланган юртдошларимиз учун махсус овозли эшитиш тизими ишлаб чиқилган. 'Таърифни эшитиш' тугмасини боссангиз, сунъий интеллект таом тавсифини овоз чиқариб ўқиб беради.",
        icon: "Volume2"
      },
      {
        title: "💬 Изоҳ қолдириш қоидалари",
        desc: "Таомлар ва хизмат кўрсатиш ҳақида фақат самимий, маданиятли ва ҳақиқий фикрларни ёзишингизни сўраймиз. Соғлиққа оид асоссиз тавсиялар, ҳақоратомуз сўзлар ёки реклама кўринишидаги изоҳлар қатъиян тақиқланади.",
        icon: "MessageSquare"
      },
      {
        title: "🌐 Тилни алмаштириш",
        desc: "Саҳифанинг энг юқорисида жойланган дунё (globe) белгили тил алмаштириш тугмаси орқали тизимни бир сонияда ўзингиз тушунадиган тилга (Ўзбекча, Русча, Инглизча ва ҳ.к.) ўтказишингиз мумкин.",
        icon: "Languages"
      },
      {
        title: "⚠️ Муҳим қоидалар",
        desc: "Буюртмани бекор қилиш фақатгина ошпазларимиз таомни тайёрлашга киришишидан олдин, телефон орқали қўллаб-қувватлаш марказимизга қўнғироқ қилиш йўли билан амалга оширилиши мумкин. Маълумотларингизни аниқ киритинг.",
        icon: "ShieldAlert"
      }
    ]
  },
  ru: {
    title: "Руководство нашей Кухни",
    subtitle: "Инструкция по максимально удобному и эффективному использованию системы Lazzat CRM",
    closeBtn: "Закрыть руководство",
    sections: [
      {
        title: "🔑 Нужна ли регистрация?",
        desc: "Для использования нашей системы не требуется регистрация или вход в личный кабинет! Вы можете свободно изучать меню и оформлять заказы в любое время.",
        icon: "UserX"
      },
      {
        title: "🛒 Выбор блюд и Корзина",
        desc: "Нажмите на любое блюдо, чтобы узнать его подробное описание, цену и оценку шеф-повара. Нажмите кнопку добавления, чтобы отправить блюдо в корзину и указать количество.",
        icon: "ShoppingCart"
      },
      {
        title: "📦 Способы заказа",
        desc: "Перейдите в Корзину для оформления заказа. Выберите доставку курьером до вашего адреса либо самовывоз прямо из нашего ресторана. Введите ваше имя и телефон.",
        icon: "Truck"
      },
      {
        title: "💳 Оплата заказа",
        desc: "Оплата производится наличными, банковской картой при получении заказа курьеру или при самовывозе, а также через удобные мобильные системы Click и Payme.",
        icon: "CreditCard"
      },
      {
        title: "🔊 Что такое Голосовое описание (TTS)?",
        desc: "Специально для пожилых людей и слабовидящих посетителей мы разработали систему озвучивания меню. Нажмите кнопку прослушивания, и искусственный интеллект зачитает описание вслух.",
        icon: "Volume2"
      },
      {
        title: "💬 Правила публикации комментариев",
        desc: "Мы приветствуем только вежливые, культурные и реальные отзывы о блюдах. Оскорбления, реклама, спам, нецензурная брань или вредные медицинские советы строго запрещены.",
        icon: "MessageSquare"
      },
      {
        title: "🌐 Смена языка интерфейса",
        desc: "С помощью выпадающего меню с иконкой глобуса в самом верху страницы вы можете мгновенно перевести всю систему на удобный вам язык (узбекский, русский, английский и др.).",
        icon: "Languages"
      },
      {
        title: "⚠️ Важные правила сервиса",
        desc: "Отмена оформленного заказа возможна только до того момента, как повара начнут его готовить. Для этого свяжитесь с нами по телефону поддержки. Пожалуйста, указывайте верные контактные данные.",
        icon: "ShieldAlert"
      }
    ]
  },
  en: {
    title: "Our Kitchen Guide",
    subtitle: "Comprehensive manual on how to easily and efficiently use the Lazzat CRM system",
    closeBtn: "Close Guide",
    sections: [
      {
        title: "🔑 Is registration required?",
        desc: "No registration or login is required to browse our platform! You can freely explore our menu, view current offers, and place orders at any time.",
        icon: "UserX"
      },
      {
        title: "🛒 Selecting Dishes & Cart",
        desc: "Click on any food card to read its full description, view prices, and see our chef's rating. Simply click 'Add to Cart' and select your desired quantity.",
        icon: "ShoppingCart"
      },
      {
        title: "📦 Ordering Methods",
        desc: "Navigate to the Cart page to finish your order. Choose between home delivery or self-pickup from the restaurant, then input your name and active phone number.",
        icon: "Truck"
      },
      {
        title: "💳 Payments and Billing",
        desc: "Payments are settled during delivery or pickup. You can choose to pay in cash, use credit/debit cards, or pay instantly via local mobile apps like Click and Payme.",
        icon: "CreditCard"
      },
      {
        title: "🔊 Voice-Over system (TTS)",
        desc: "Designed with love for seniors and visually impaired guests. Click the audio play button, and our artificial intelligence will read the dish description aloud for you.",
        icon: "Volume2"
      },
      {
        title: "💬 Commenting Policy",
        desc: "We encourage genuine and polite feedback. Any offensive language, insults, advertisements, spam, or false health-related suggestions are strictly forbidden and moderated.",
        icon: "MessageSquare"
      },
      {
        title: "🌐 Language Switcher",
        desc: "You can instantly switch the website translation using the language globe selector situated at the top right header. It translates the whole page into your selected language.",
        icon: "Languages"
      },
      {
        title: "⚠️ Crucial Guidelines",
        desc: "Order cancellation is only accepted via a direct phone call to our support line before food preparation begins. Please ensure you supply correct contact credentials.",
        icon: "ShieldAlert"
      }
    ]
  },
  de: {
    title: "Unser Küchenhandbuch",
    subtitle: "Umfassende Anleitung zur einfachen und effizienten Nutzung des Lazzat CRM-Systems",
    closeBtn: "Anleitung schließen",
    sections: [
      {
        title: "🔑 Ist eine Registrierung erforderlich?",
        desc: "Für die Nutzung unserer Plattform ist keine Registrierung oder Anmeldung erforderlich! Sie können das Menü jederzeit frei durchsuchen und Bestellungen aufgeben.",
        icon: "UserX"
      },
      {
        title: "🛒 Auswahl & Warenkorb",
        desc: "Klicken Sie auf ein Gericht, um die Beschreibung, den Preis und die Bewertung des Küchenchefs anzuzeigen. Klicken Sie auf 'In den Warenkorb' und wählen Sie die Menge aus.",
        icon: "ShoppingCart"
      },
      {
        title: "📦 Bestellmethoden",
        desc: "Gehen Sie zum Warenkorb, um Ihre Bestellung abzuschließen. Wählen Sie Lieferung nach Hause oder Selbstabholung im Restaurant, geben Sie Namen und Telefonnummer ein.",
        icon: "Truck"
      },
      {
        title: "💳 Zahlungsmethoden",
        desc: "Die Bezahlung erfolgt bei Lieferung oder Abholung. Sie können in bar, mit Kredit- oder Debitkarte oder über lokale mobile Zahlungs-Apps bezahlen.",
        icon: "CreditCard"
      },
      {
        title: "🔊 Sprachausgabe-System (TTS)",
        desc: "Mit Liebe für Senioren und sehbehinderte Gäste entwickelt. Klicken Sie auf die Audio-Schaltfläche, und unsere KI liest Ihnen die Beschreibung des Gerichts laut vor.",
        icon: "Volume2"
      },
      {
        title: "💬 Kommentar-Richtlinien",
        desc: "Wir freuen uns über ehrliches und höfliches Feedback. Beleidigungen, Spam, Werbung oder falsche gesundheitliche Ratschläge sind strengstens verboten und werden moderiert.",
        icon: "MessageSquare"
      },
      {
        title: "🌐 Sprachauswahl",
        desc: "Sie können die Sprache der Website jederzeit über das Globus-Symbol oben rechts ändern. Es übersetzt die gesamte Seite in die von Ihnen gewählte Sprache.",
        icon: "Languages"
      },
      {
        title: "⚠️ Wichtige Richtlinien",
        desc: "Eine Stornierung ist nur per Telefon möglich, bevor die Zubereitung beginnt. Bitte achten Sie darauf, korrekte Kontaktdaten anzugeben.",
        icon: "ShieldAlert"
      }
    ]
  },
  fr: {
    title: "Guide de notre Cuisine",
    subtitle: "Manuel d'utilisation pour naviguer facilement et efficacement sur la plateforme Lazzat CRM",
    closeBtn: "Fermer le guide",
    sections: [
      {
        title: "🔑 Inscription obligatoire ?",
        desc: "Aucune inscription ou connexion n'est requise ! Vous pouvez librement explorer notre menu et passer vos commandes à tout moment.",
        icon: "UserX"
      },
      {
        title: "🛒 Choix des plats et Panier",
        desc: "Cliquez sur la fiche d'un plat pour lire sa description complète, voir les prix et l'avis du chef. Cliquez sur 'Ajouter au panier' et indiquez la quantité.",
        icon: "ShoppingCart"
      },
      {
        title: "📦 Méthodes de commande",
        desc: "Accédez au panier pour finaliser votre commande. Choisissez entre la livraison à domicile ou le retrait en restaurant, puis saisissez votre nom et numéro de téléphone.",
        icon: "Truck"
      },
      {
        title: "💳 Règlement et Facturation",
        desc: "Le paiement s'effectue à la livraison ou au retrait. Vous pouvez payer en espèces, par carte bancaire ou via des applications de paiement mobiles locales.",
        icon: "CreditCard"
      },
      {
        title: "🔊 Synthèse vocale (TTS)",
        desc: "Conçu avec attention pour les aînés et les malvoyants. Cliquez sur le bouton audio pour que notre intelligence artificielle lise la description du plat à voix haute.",
        icon: "Volume2"
      },
      {
        title: "💬 Charte des commentaires",
        desc: "Nous encourageons les retours d'expérience polis et constructifs. Les insultes, spams, publicités ou faux conseils de santé sont strictement interdits.",
        icon: "MessageSquare"
      },
      {
        title: "🌐 Choix de la langue",
        desc: "Vous pouvez changer instantanément la langue du site à l'aide du sélecteur de langue en forme de globe situé en haut à droite de l'en-tête.",
        icon: "Languages"
      },
      {
        title: "⚠️ Directives importantes",
        desc: "L'annulation d'une commande n'est possible que par appel téléphonique direct avant le début de la préparation du plat. Veuillez entrer des coordonnées valides.",
        icon: "ShieldAlert"
      }
    ]
  },
  it: {
    title: "Guida della nostra Cucina",
    subtitle: "Manuale d'uso completo per utilizzare la piattaforma Lazzat CRM in modo semplice e corretto",
    closeBtn: "Chiudi guida",
    sections: [
      {
        title: "🔑 È necessaria la registrazione?",
        desc: "Non è richiesta alcuna registrazione o accesso! Esplora liberamente il nostro menu ed effettua ordini in qualsiasi momento.",
        icon: "UserX"
      },
      {
        title: "🛒 Selezione piatti e Carrello",
        desc: "Clicca su qualsiasi piatto per visualizzare dettagli, prezzi, valutazioni dello chef e aggiungilo al carrello. Scegli poi la quantità desiderata.",
        icon: "ShoppingCart"
      },
      {
        title: "📦 Metodi di ordinazione",
        desc: "Vai alla sezione Carrello per completare l'ordine. Scegli tra la consegna a domicilio o il ritiro in ristorante, quindi inserisci il tuo nome e numero di telefono.",
        icon: "Truck"
      },
      {
        title: "💳 Pagamenti e Saldo",
        desc: "Il pagamento viene effettuato al momento del ricevimento in contanti, carta di credito o app di pagamento locali come Click e Payme.",
        icon: "CreditCard"
      },
      {
        title: "🔊 Sintesi Vocale (TTS)",
        desc: "Pensato per anziani e non vedenti. Clicca sul pulsante della sintesi vocale per ascoltare la descrizione del piatto letta ad alta voce dall'intelligenza artificiale.",
        icon: "Volume2"
      },
      {
        title: "💬 Linee guida per i commenti",
        desc: "Incoraggiamo recensioni civili e costruttive. Commenti offensivi, dannosi, pubblicità o spam saranno immediatamente rimossi dai moderatori.",
        icon: "MessageSquare"
      },
      {
        title: "🌐 Cambio lingua",
        desc: "Cambia istantaneamente la lingua del portale utilizzando il menu di selezione con l'icona del globo in alto nella pagina (Uzbeko, Russo, Inglese, ecc.).",
        icon: "Languages"
      },
      {
        title: "⚠️ Regola importante",
        desc: "L'annullamento dell'ordine è possibile solo telefonando alla nostra assistenza prima dell'inizio della preparazione del piatto. Inserisci dati reali.",
        icon: "ShieldAlert"
      }
    ]
  }
};

const getNavLinkName = (link: any, lang: string) => {
  const cleanUrl = link.url ? link.url.trim().toLowerCase() : "";
  
  if (link.id === "1" || cleanUrl.includes("about") || cleanUrl.includes("haqida")) {
    if (lang === "uz") return "🏠 Cafe haqida";
    if (lang === "uz_cyr") return "🏠 Кафе ҳақида";
    if (lang === "ru") return "🏠 О кафе";
    if (lang === "fr") return "🏠 À propos";
    if (lang === "it") return "🏠 Info";
    if (lang === "de") return "🏠 Über uns";
    return "🏠 About";
  }
  if (link.id === "2" || cleanUrl.includes("sozlamalar") || cleanUrl.includes("settings")) {
    if (lang === "uz") return "⚙️ Sozlamalar";
    if (lang === "uz_cyr") return "⚙️ Созламалар";
    if (lang === "ru") return "⚙️ Настройки";
    if (lang === "fr") return "⚙️ Paramètres";
    if (lang === "it") return "⚙️ Impostazioni";
    if (lang === "de") return "⚙️ Einstellungen";
    return "⚙️ Settings";
  }
  if (link.id === "3" || cleanUrl.includes("oshpaz") || cleanUrl.includes("staff") || cleanUrl.includes("xodimlar")) {
    if (lang === "uz") return "👨‍🍳 Xodimlar";
    if (lang === "uz_cyr") return "👨‍🍳 Ходимлар";
    if (lang === "ru") return "👨‍🍳 Сотрудники";
    if (lang === "fr") return "👨‍🍳 Personnel";
    if (lang === "it") return "👨‍🍳 Personale";
    if (lang === "de") return "👨‍🍳 Personal";
    return "👨‍🍳 Staff";
  }
  if (link.id === "4" || cleanUrl.includes("admin")) {
    if (lang === "uz") return "🔑 Admin";
    if (lang === "uz_cyr") return "🔑 Админ";
    if (lang === "ru") return "🔑 Админ";
    if (lang === "fr") return "🔑 Admin";
    if (lang === "it") return "🔑 Admin";
    if (lang === "de") return "🔑 Admin";
    return "🔑 Admin";
  }
  if (link.id === "5" || cleanUrl.includes("ma'lumot") || cleanUrl.includes("malumot") || cleanUrl.includes("guide") || cleanUrl.includes("yoriqnoma") || cleanUrl.includes("yo'riqnoma") || cleanUrl.includes("note") || cleanUrl.includes("bloknot")) {
    if (lang === "uz") return "📖 Oshxonamiz Yo'riqnomasi";
    if (lang === "uz_cyr") return "📖 Ошхонамиз Йўриқномаси";
    if (lang === "ru") return "📖 Руководство Кухни";
    if (lang === "fr") return "📖 Guide de Cuisine";
    if (lang === "it") return "📖 Guida della Cucina";
    if (lang === "de") return "📖 Küchenhandbuch";
    return "📖 Kitchen Guide";
  }
  return link.name;
};

const getThemeDetails = (theme: "light" | "dark", lang: string) => {
  if (theme === "dark") {
    if (lang === "ru") {
      return {
        title: "🌙 Ночной режим (Dark Mode)",
        points: [
          "Фон становится черным или темно-серым",
          "Текст отображается белым или светлым цветом",
          "Легко для глаз, особенно ночью или в темной комнате",
          "Экономит заряд батареи (на OLED-экранах)"
        ]
      };
    } else if (lang === "en") {
      return {
        title: "🌙 Dark Mode (Night Theme)",
        points: [
          "Background is black or dark gray",
          "Text is white or light color",
          "Easy on the eyes, especially at night or in dark rooms",
          "Consumes less battery (on OLED screens)"
        ]
      };
    } else if (lang === "uz_cyr") {
      return {
        title: "🌙 Тўқ режим (Dark Mode)",
        points: [
          "Фон қора ёки тўқ кулранг бўлади",
          "Матн оқ ёки очиқ рангда бўлади",
          "Кўзга енгил, айниқса кечаси ёки қоронғи хонада ишлатганда",
          "Батарея камроқ сарфланади (OLED экранларда)"
        ]
      };
    } else { // default uz
      return {
        title: "🌙 Tungi rejim (Dark Mode)",
        points: [
          "Fon qora yoki to'q kulrang bo'ladi",
          "Matn oq yoki ochiq rangda bo'ladi",
          "Ko'zga yengil, ayniqsa kechasi yoki qorong'i xonada ishlatganda",
          "Batareya kamroq sarflanadi (OLED ekranlarda)"
        ]
      };
    }
  } else {
    if (lang === "ru") {
      return {
        title: "☀️ Дневной режим (Light Mode)",
        points: [
          "Фон становится белым или светлым",
          "Текст отображается черным или темным цветом",
          "Удобно для чтения при дневном свете и в ярких комнатах"
        ]
      };
    } else if (lang === "en") {
      return {
        title: "☀️ Light Mode (Day Theme)",
        points: [
          "Background is white or light color",
          "Text is black or dark color",
          "More comfortable for viewing in bright rooms or daylight"
        ]
      };
    } else if (lang === "uz_cyr") {
      return {
        title: "☀️ Ёруғ режим (Light Mode)",
        points: [
          "Фон оқ ёки очиқ рангда бўлади",
          "Матн қора ёки тўқ рангда бўлади",
          "Ёруғ хонада, кундузи кўриш учун қулайроқ"
        ]
      };
    } else { // default uz
      return {
        title: "☀️ Kunduzgi rejim (Light Mode)",
        points: [
          "Fon oq yoki ochiq rangda bo'ladi",
          "Matn qora yoki to'q rangda bo'ladi",
          "Yorug' xonada, kunduzi ko'rish uchun qulayroq"
        ]
      };
    }
  }
};

function uzNumberToWords(num: number): string {
  if (num === 0) return "nol";
  const ones = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
  const tens = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];
  
  function helper(n: number): string {
    let parts = [];
    if (n >= 1000000) {
      const million = Math.floor(n / 1000000);
      parts.push(helper(million) + " million");
      n %= 1000000;
    }
    if (n >= 1000) {
      const thousand = Math.floor(n / 1000);
      parts.push(helper(thousand) + " ming");
      n %= 1000;
    }
    if (n >= 100) {
      const hundred = Math.floor(n / 100);
      parts.push(ones[hundred] + " yuz");
      n %= 100;
    }
    if (n >= 10) {
      const ten = Math.floor(n / 10);
      parts.push(tens[ten]);
      n %= 10;
    }
    if (n > 0) {
      parts.push(ones[n]);
    }
    return parts.filter(Boolean).join(" ");
  }
  
  return helper(num);
}

function uzCyrillicNumberToWords(num: number): string {
  if (num === 0) return "ноль";
  const ones = ["", "бир", "икки", "уч", "тўрт", "беш", "олти", "етти", "саккиз", "тўққиз"];
  const tens = ["", "ўн", "йигирма", "ўттиз", "қирқ", "эллик", "олтмиш", "етмиш", "саксон", "тўқсон"];
  
  function helper(n: number): string {
    let parts = [];
    if (n >= 1000000) {
      const million = Math.floor(n / 1000000);
      parts.push(helper(million) + " миллион");
      n %= 1000000;
    }
    if (n >= 1000) {
      const thousand = Math.floor(n / 1000);
      parts.push(helper(thousand) + " минг");
      n %= 1000;
    }
    if (n >= 100) {
      const hundred = Math.floor(n / 100);
      parts.push(ones[hundred] + " юз");
      n %= 100;
    }
    if (n >= 10) {
      const ten = Math.floor(n / 10);
      parts.push(tens[ten]);
      n %= 10;
    }
    if (n > 0) {
      parts.push(ones[n]);
    }
    return parts.filter(Boolean).join(" ");
  }
  
  return helper(num);
}

function ruNumberToWords(num: number): string {
  if (num === 0) return "ноль";
  const ones = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
  const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
  const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
  const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];

  function helper(n: number): string {
    let parts = [];
    if (n >= 1000000) {
      const million = Math.floor(n / 1000000);
      parts.push(helper(million) + " миллион");
      n %= 1000000;
    }
    if (n >= 1000) {
      const thousand = Math.floor(n / 1000);
      let thousandStr = "";
      if (thousand === 1) {
        thousandStr = "одна тысяча";
      } else if (thousand === 2) {
        thousandStr = "две тысячи";
      } else if (thousand >= 3 && thousand <= 4) {
        thousandStr = helper(thousand) + " тысячи";
      } else {
        thousandStr = helper(thousand) + " тысяч";
      }
      thousandStr = thousandStr.replace(/^один тысячи/, "одна тысяча").replace(/^два тысячи/, "две тысячи");
      parts.push(thousandStr);
      n %= 1000;
    }
    if (n >= 100) {
      const hundred = Math.floor(n / 100);
      parts.push(hundreds[hundred]);
      n %= 100;
    }
    if (n >= 20) {
      const ten = Math.floor(n / 10);
      parts.push(tens[ten]);
      n %= 10;
      if (n > 0) {
        parts.push(ones[n]);
      }
    } else if (n >= 10) {
      parts.push(teens[n - 10]);
    } else if (n > 0) {
      parts.push(ones[n]);
    }
    return parts.filter(Boolean).join(" ");
  }
  
  return helper(num);
}

function enNumberToWords(num: number): string {
  if (num === 0) return "zero";
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  
  function helper(n: number): string {
    let parts = [];
    if (n >= 1000000) {
      const million = Math.floor(n / 1000000);
      parts.push(helper(million) + " million");
      n %= 1000000;
    }
    if (n >= 1000) {
      const thousand = Math.floor(n / 1000);
      parts.push(helper(thousand) + " thousand");
      n %= 1000;
    }
    if (n >= 100) {
      const hundred = Math.floor(n / 100);
      parts.push(ones[hundred] + " hundred");
      n %= 100;
    }
    if (n >= 20) {
      const ten = Math.floor(n / 10);
      parts.push(tens[ten]);
      n %= 10;
      if (n > 0) {
        parts.push(ones[n]);
      }
    } else if (n >= 10) {
      parts.push(teens[n - 10]);
    } else if (n > 0) {
      parts.push(ones[n]);
    }
    return parts.filter(Boolean).join(" ");
  }
  
  return helper(num);
}

function convertNumbersInText(text: string, lang: string): string {
  let cleanText = text;
  cleanText = cleanText.replace(/(\d+)[ .](\d{3})\b/g, "$1$2");
  return cleanText.replace(/\b\d+\b/g, (match) => {
    const num = parseInt(match, 10);
    if (isNaN(num)) return match;
    if (lang === "uz") return uzNumberToWords(num);
    if (lang === "uz_cyr") return uzCyrillicNumberToWords(num);
    if (lang === "ru") return ruNumberToWords(num);
    if (lang === "en") return enNumberToWords(num);
    return match;
  });
}

function expandAbbreviations(text: string, lang: string): string {
  let result = text;
  if (lang === "uz") {
    result = result.replace(/\bgr\b/gi, "gramm");
    result = result.replace(/\bgr\./gi, "gramm");
    result = result.replace(/\bg\b/gi, "gramm");
    result = result.replace(/\bkg\b/gi, "kilogramm");
    result = result.replace(/\bkg\./gi, "kilogramm");
    result = result.replace(/\bl\b/gi, "litr");
    result = result.replace(/\bl\./gi, "litr");
    result = result.replace(/\bml\b/gi, "millilitr");
    result = result.replace(/\bml\./gi, "millilitr");
    result = result.replace(/\bta\b/gi, "dona");
    result = result.replace(/\bsom\b/gi, "so'm");
    result = result.replace(/\bso'm\b/gi, "so'm");
  } else if (lang === "uz_cyr") {
    result = result.replace(/\bгр\b/gi, "грамм");
    result = result.replace(/\bгр\./gi, "грамм");
    result = result.replace(/\bг\b/gi, "грамм");
    result = result.replace(/\bкг\b/gi, "килограмм");
    result = result.replace(/\bл\b/gi, "литр");
    result = result.replace(/\bмл\b/gi, "миллилитр");
    result = result.replace(/\bта\b/gi, "дона");
    result = result.replace(/\bсум\b/gi, "сўм");
    result = result.replace(/\bсўм\b/gi, "сўм");
  } else if (lang === "ru") {
    result = result.replace(/\bгр\b/gi, "грамм");
    result = result.replace(/\bгр\./gi, "грамм");
    result = result.replace(/\bг\./gi, "грамм");
    result = result.replace(/\bкг\b/gi, "килограмм");
    result = result.replace(/\bкг\./gi, "килограмм");
    result = result.replace(/\bл\b/gi, "литр");
    result = result.replace(/\bл\./gi, "литр");
    result = result.replace(/\bмл\b/gi, "миллилитр");
    result = result.replace(/\bмл\./gi, "миллилитр");
    result = result.replace(/\bшт\b/gi, "штук");
    result = result.replace(/\bшт\./gi, "штук");
    result = result.replace(/\bруб\b/gi, "рублей");
    result = result.replace(/\bруб\./gi, "рублей");
    result = result.replace(/\bсум\b/gi, "сум");
  } else if (lang === "en") {
    result = result.replace(/\bgr\b/gi, "grams");
    result = result.replace(/\bg\b/gi, "grams");
    result = result.replace(/\bkg\b/gi, "kilograms");
    result = result.replace(/\bl\b/gi, "liters");
    result = result.replace(/\bml\b/gi, "milliliters");
    result = result.replace(/\bpc\b/gi, "piece");
    result = result.replace(/\bpcs\b/gi, "pieces");
  }
  return result;
}

function removeSpecialChars(text: string): string {
  let result = text;
  result = result.replace(/[*#_~]/g, " ");
  result = result.replace(/[-–—/]+/g, ", ");
  result = result.replace(/\s+/g, " ").trim();
  return result;
}

function preprocessTextForSpeech(text: string, lang: string): string {
  if (!text) return "";
  let processed = text;
  processed = removeSpecialChars(processed);
  processed = expandAbbreviations(processed, lang);
  processed = convertNumbersInText(processed, lang);
  processed = processed.replace(/([.,!?:;])([^\s])/g, "$1 $2");
  processed = processed.replace(/\s+/g, " ").trim();
  return processed;
}

interface FoydalanuvchiPanelProps {
  state: CrmState;
  t: Translations;
  onPanelChange: (panel: 'user' | 'staff' | 'admin' | 'about') => void;
  onSetTheme: (theme: 'light' | 'dark') => void;
  onSetLang: (lang: string) => void;
  dynamicTranslations?: Record<string, string>;
}

export default function FoydalanuvchiPanel({
  state,
  t,
  onPanelChange,
  onSetTheme,
  onSetLang,
  dynamicTranslations = {},
}: FoydalanuvchiPanelProps) {
  const activeLang = state.config.activeLang || "uz";
  const localT = (key: string) => {
    const dict = LOCAL_TRANSLATIONS[activeLang] || LOCAL_TRANSLATIONS["uz"];
    return dict[key] || LOCAL_TRANSLATIONS["uz"][key] || "";
  };

  const dT = (text: string) => {
    if (!text) return "";
    return dynamicTranslations[text] || text;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBooklet, setShowBooklet] = useState(false);
  const [bookletPage, setBookletPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [currentPlayingItemId, setCurrentPlayingItemId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState("");

  // Comment System State
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<{ id: string; author: string; text: string; date: string }[]>([]);

  useEffect(() => {
    if (selectedItem) {
      const saved = localStorage.getItem(`comments_${selectedItem.id}`);
      if (saved) {
        try {
          setCommentsList(JSON.parse(saved));
        } catch (e) {
          setCommentsList([]);
        }
      } else {
        setCommentsList([]);
      }
      setShowCommentForm(false);
      setCommentName("");
      setCommentText("");
    }
  }, [selectedItem]);

  // Clear hash on initial load/refresh to prevent the detail modal from getting stuck open
  useEffect(() => {
    if (window.location.hash) {
      window.location.hash = "";
    }
  }, []);

  // Synchronize state with URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let itemId = "";
      const menuMatch = hash.match(/^#\/menu\/(.+)$/);
      const menuDashMatch = hash.match(/^#menu-(.+)$/);
      const productMatch = hash.match(/^#product-(.+)$/);

      if (menuMatch) {
        itemId = menuMatch[1];
      } else if (menuDashMatch) {
        itemId = menuDashMatch[1];
      } else if (productMatch) {
        itemId = productMatch[1];
      }

      if (itemId) {
        const item = state.menu.find((i) => i.id === itemId);
        if (item) {
          setSelectedItem(item);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setSelectedItem(null);
          window.speechSynthesis?.cancel();
          setIsPlayingAudio(false);
        }
      } else {
        setSelectedItem(null);
        window.speechSynthesis?.cancel();
        setIsPlayingAudio(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Sync on mount
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [state?.menu]);

  const handleGoBack = () => {
    window.location.hash = "";
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(false);
  };

  const getBackText = () => {
    const lang = state.config.activeLang || "uz";
    if (lang === "uz") return "← Orqaga";
    if (lang === "uz_cyr") return "← Орқага";
    if (lang === "ru") return "← Назад";
    return "← Back";
  };
  const isCancelledRef = useRef(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAboutCafe, setShowAboutCafe] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [userPhone, setUserPhone] = useState<string | null>(() => {
    return localStorage.getItem("user_phone");
  });
  const [phoneInput, setPhoneInput] = useState("+998");
  const [phoneError, setPhoneError] = useState("");

  const [loginStep, setLoginStep] = useState<"phone" | "password">("phone");
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [detectedName, setDetectedName] = useState("");

  // Profile modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  useEffect(() => {
    if (showProfileModal && userPhone) {
      fetch(`/api/profile/check-auth?phone=${encodeURIComponent(userPhone)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProfileName(data.name || "");
            setProfilePassword(data.password || "");
          }
        })
        .catch((err) => console.error("Error checking profile details:", err));
    }
  }, [showProfileModal, userPhone]);

  const formatUzbekPhone = (value: string): string => {
    let numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("998")) {
      numbers = numbers.slice(3);
    }
    numbers = numbers.slice(0, 9);
    let formatted = "+998";
    if (numbers.length > 0) {
      formatted += " " + numbers.slice(0, 2);
    }
    if (numbers.length > 2) {
      formatted += " " + numbers.slice(2, 5);
    }
    if (numbers.length > 5) {
      formatted += " " + numbers.slice(5, 7);
    }
    if (numbers.length > 7) {
      formatted += " " + numbers.slice(7, 9);
    }
    return formatted;
  };

  const handlePhoneInputChange = (val: string) => {
    if (val.length < 4) {
      setPhoneInput("+998");
      return;
    }
    setPhoneInput(formatUzbekPhone(val));
  };

  // 1. IP Auto-login on mount if not in localStorage (Persists across clears/devices on same network)
  useEffect(() => {
    if (!userPhone) {
      fetch("/api/profile/auto-login")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.phone) {
            setUserPhone(data.phone);
            localStorage.setItem("user_phone", data.phone);
          }
        })
        .catch((err) => console.error("Auto-login error:", err));
    }
  }, [userPhone]);

  // 2. Track product/food details modal views for Admin Analytics
  useEffect(() => {
    if (selectedItem) {
      fetch("/api/analytics/product-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: userPhone || "Mehmon",
          productName: selectedItem.name,
          category: selectedItem.category,
        }),
      }).catch((err) => console.error("Error tracking product view:", err));
    }
  }, [selectedItem, userPhone]);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [adTimerKey, setAdTimerKey] = useState(0);
  
  // Only display advertisements with position === "sidebar" inside the hero carousel
  const carouselAds = (state.ads || []).filter((ad: any) => ad.active && ad.position === "sidebar");

  const heroSlides = [
    { type: "greeting" as const },
    ...carouselAds.map(ad => ({ type: "ad" as const, data: ad }))
  ];

  // Popup Ad Management
  const popupAd = (state.ads || []).find((ad: any) => ad.active && ad.position === "popup");
  const [showPopupAd, setShowPopupAd] = useState(() => {
    if (!popupAd) return false;
    try {
      return !sessionStorage.getItem(`popup_ad_closed_${popupAd.id}`);
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length, adTimerKey]);

  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentAudioCtxRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom Kitchen Guide states
  const [showGuide, setShowGuide] = useState(false);

  // Savol-Javob (FAQ) states
  const [showFaq, setShowFaq] = useState(false);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({});

  const toggleFaqItem = (id: string) => {
    setOpenFaqIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCustomUrlAction = (url: string, e?: React.MouseEvent) => {
    if (!url) return false;
    if (e) e.preventDefault();
    const cleanUrl = url.trim().toLowerCase();
    
    if (cleanUrl === "#restaran/cafe haqida" || cleanUrl.includes("about") || cleanUrl === "#about" || cleanUrl.includes("restaran/cafe haqida") || url.includes("Restaran/Cafe haqida")) {
      onPanelChange("about");
      return true;
    }
    if (cleanUrl === "#sozlamalar" || cleanUrl.includes("sozlamalar") || cleanUrl === "#settings" || cleanUrl.includes("settings") || url.includes("Sozlamalar")) {
      setShowSettings(true);
      return true;
    }
    if (cleanUrl === "#oshpaz & afitsiant" || cleanUrl.includes("oshpaz") || cleanUrl === "#staff" || cleanUrl.includes("staff") || url.includes("Oshpaz & Afitsiant")) {
      onPanelChange("staff");
      return true;
    }
    if (cleanUrl === "#admin paneli" || cleanUrl.includes("admin") || cleanUrl === "#admin" || cleanUrl.includes("admin") || url.includes("Admin paneli")) {
      onPanelChange("admin");
      return true;
    }
    if (cleanUrl === "#ma'lumot" || cleanUrl === "#malumot" || cleanUrl.includes("ma'lumot") || cleanUrl.includes("malumot") || url.includes("Ma'lumot") || url.includes("Malumot") || cleanUrl.includes("guide") || cleanUrl.includes("yoriqnoma") || cleanUrl.includes("yo'riqnoma") || cleanUrl.includes("note") || cleanUrl.includes("bloknot")) {
      setShowGuide(true);
      return true;
    }
    if (cleanUrl === "#faq" || cleanUrl === "#savol-javob" || cleanUrl.includes("faq") || cleanUrl.includes("savol") || cleanUrl.includes("javob") || url.includes("Savol-Javob")) {
      setShowFaq(true);
      return true;
    }
    return false;
  };

  // Automatically open booklet on every visit/refresh (only once per session)
  useEffect(() => {
    if (state.booklet.active) {
      const hasOpened = sessionStorage.getItem("booklet_auto_opened");
      if (!hasOpened) {
        setShowBooklet(true);
        sessionStorage.setItem("booklet_auto_opened", "true");
      }
    }
  }, [state.booklet.active]);

  // Initialize and synchronize Google Translate widget
  useEffect(() => {
    const initTranslate = () => {
      // @ts-ignore
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        // Clear previous content to avoid duplication
        const container = document.getElementById("google_translate_element");
        if (container && container.children.length === 0) {
          // @ts-ignore
          new window.google.translate.TranslateElement({
            pageLanguage: 'uz',
            includedLanguages: 'uz,ru,en,de,it,fr',
            // @ts-ignore
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google_translate_element');
        }
      }
    };

    // Set callback or call directly if already loaded
    // @ts-ignore
    if (window.google && window.google.translate) {
      initTranslate();
    } else {
      // @ts-ignore
      window.googleTranslateElementInit = initTranslate;
    }
  }, []);

  // Sync state language to Google Translate, and watch Google Translate for changes
  useEffect(() => {
    const activeLang = state.config.activeLang;
    let googleLang = "uz";
    if (activeLang === "ru") googleLang = "ru";
    if (activeLang === "en") googleLang = "en";
    if (activeLang === "uz_cyr") googleLang = "uz";

    const originalSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (originalSelect && originalSelect.value !== googleLang) {
      originalSelect.value = googleLang;
      const event = new Event('change', { bubbles: true });
      originalSelect.dispatchEvent(event);
    }
  }, [state.config.activeLang]);

  // Sync Google Translate manual user selection back to React state language
  useEffect(() => {
    const interval = setInterval(() => {
      const originalSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (originalSelect && originalSelect.value) {
        const val = originalSelect.value;
        const currentActive = state.config.activeLang;
        let mapped = "uz";
        if (currentActive === "ru") mapped = "ru";
        if (currentActive === "en") mapped = "en";
        if (currentActive === "uz_cyr") mapped = "uz";

        if (val !== mapped) {
          if (val === "ru" && currentActive !== "ru") onSetLang("ru");
          else if (val === "en" && currentActive !== "en") onSetLang("en");
          else if (val === "uz" && currentActive !== "uz" && currentActive !== "uz_cyr") onSetLang("uz");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.config.activeLang]);

  const getPreparingText = () => {
    const lang = state.config.activeLang || "uz";
    if (lang === "uz") return "Tayyorlanmoqda... ⏳";
    if (lang === "uz_cyr") return "Тайёрланмоqda... ⏳";
    if (lang === "ru") return "Озвучка готовится... ⏳";
    return "Preparing voice... ⏳";
  };

  // Handle Text To Speech - Toggleable, autoplay-safe and fallback supported
  const playTTS = (item: MenuItem) => {
    const currentLang = state.config.activeLang || "uz";
    
    // 1. Confirm language code used for Speech Synthesis and print to console
    console.log("=================== TTS DIAGNOSTIC START ===================");
    console.log("1. Active Language Code used for voice-over:", currentLang);

    // 2. Check if there is ANY Uzbek language voice in the browser
    const browserVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    const uzVoices = browserVoices.filter(v => 
      v.lang.toLowerCase().includes("uz") || 
      v.name.toLowerCase().includes("uzbek")
    );
    console.log("2. Total available browser speechSynthesis voices:", browserVoices.length);
    console.log("3. Uzbek voices found in browser speechSynthesis:", uzVoices.length > 0, uzVoices.map(v => `${v.name} (${v.lang})`));

    // 3. Highlight native lack of Uzbek voice in browser if true
    if (uzVoices.length === 0) {
      console.warn(
        "4. DIAGNOSTIC RESULT: Browser lacks native Uzbek SpeechSynthesis voices! " +
        "This is the root cause: standard SpeechSynthesis defaults to Turkish (tr-TR) " +
        "or Russian (ru-RU) accents, which sound extremely unnatural and terrible for Uzbek text."
      );
      console.log("5. ACTION TAKEN: Routing to highly premium, natural server-side Gemini AI Text-To-Speech (gemini-3.1-flash-tts-preview) which has beautiful native Uzbek pronunciation!");
    } else {
      console.log("4. DIAGNOSTIC RESULT: Found native browser Uzbek voice. We will attempt browser speech synthesis first.");
    }
    console.log("==================== TTS DIAGNOSTIC END ====================");

    if (isPlayingAudio || isGeneratingAudio) {
      console.log("Audio is already playing or generating. Stopping all audio playbacks...");
      isCancelledRef.current = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (currentAudioSourceRef.current) {
        try {
          currentAudioSourceRef.current.stop();
        } catch (err) {}
        currentAudioSourceRef.current = null;
      }
      if (currentAudioCtxRef.current) {
        try {
          currentAudioCtxRef.current.close();
        } catch (err) {}
        currentAudioCtxRef.current = null;
      }
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
        } catch (err) {}
        currentAudioRef.current = null;
      }
      setIsPlayingAudio(false);
      setIsGeneratingAudio(false);
      
      const previousPlayingId = currentPlayingItemId;
      setCurrentPlayingItemId(null);
      
      // If user clicked a DIFFERENT item, stop the previous one and start playing the new one
      if (previousPlayingId !== item.id) {
        setTimeout(() => {
          executePlayTTS(item);
        }, 100);
      }
      return;
    }

    executePlayTTS(item);
  };

  const executePlayTTS = (item: MenuItem) => {
    const currentLang = state.config.activeLang || "uz";
    isCancelledRef.current = false;
    setIsPlayingAudio(true);
    setCurrentPlayingItemId(item.id);
    setAudioError("");

    const textRaw = item.voiceText || `${item.name}. ${item.description}. ${localT("narxi")} ${item.price} ${localT("som")}.`;
    const textToSpeak = preprocessTextForSpeech(textRaw, currentLang);

    // If language is Uzbek or Uzbek Cyrillic, browser-native synthesis is terrible or unavailable.
    // We immediately route to premium server-side Gemini AI TTS which speaks natural, clean Uzbek.
    if (currentLang === "uz" || currentLang === "uz_cyr") {
      playServerTTS(textToSpeak, item.id);
      return;
    }

    // For non-Uzbek languages, try browser speechSynthesis first, fall back to server-side TTS on failure
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      let selectedVoice: SpeechSynthesisVoice | null = null;
      let targetLocales: string[] = [];
      
      if (currentLang === "ru") {
        targetLocales = ["ru-RU", "ru"];
      } else if (currentLang === "en") {
        targetLocales = ["en-US", "en-GB", "en"];
      } else if (currentLang === "fr") {
        targetLocales = ["fr-FR", "fr"];
      } else if (currentLang === "it") {
        targetLocales = ["it-IT", "it"];
      } else if (currentLang === "de") {
        targetLocales = ["de-DE", "de"];
      } else {
        targetLocales = ["en-US", "en"];
      }

      const browserVoices = window.speechSynthesis.getVoices();
      // Look for neural or google premium voices
      for (const locale of targetLocales) {
        const premiumVoice = browserVoices.find(v => 
          v.lang.toLowerCase().replace("_", "-").startsWith(locale.toLowerCase()) && 
          (v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("natural") || v.name.toLowerCase().includes("neural"))
        );
        if (premiumVoice) {
          selectedVoice = premiumVoice;
          break;
        }
      }

      // Fallback to any voice matching locale
      if (!selectedVoice) {
        for (const locale of targetLocales) {
          const match = browserVoices.find(v => v.lang.toLowerCase().replace("_", "-").startsWith(locale.toLowerCase()));
          if (match) {
            selectedVoice = match;
            break;
          }
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        if (currentLang === "ru") {
          utterance.lang = "ru-RU";
        } else if (currentLang === "en") {
          utterance.lang = "en-US";
        } else if (currentLang === "fr") {
          utterance.lang = "fr-FR";
        } else if (currentLang === "it") {
          utterance.lang = "it-IT";
        } else {
          utterance.lang = "en-US";
        }
      }

      // Slow down speed to 0.85 (85% of standard rate) to ensure natural, clear, and easy understanding
      utterance.rate = 0.85;
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setCurrentPlayingItemId(null);
      };
      
      utterance.onerror = (e) => {
        console.warn("SpeechSynthesis error, falling back to server-side TTS...", e);
        playServerTTS(textToSpeak, item.id);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      playServerTTS(textToSpeak, item.id);
    }
  };

  const speakBrowserFallback = (text: string) => {
    if (!window.speechSynthesis) {
      setIsPlayingAudio(false);
      setCurrentPlayingItemId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Look for a Turkish or Azerbaijani voice (phonetically close to Uzbek), otherwise any voice
    const browserVoices = window.speechSynthesis.getVoices();
    const voiceCandidate = browserVoices.find(v => 
      v.lang.toLowerCase().includes("tr") || 
      v.lang.toLowerCase().includes("az") || 
      v.lang.toLowerCase().includes("uz")
    );
    
    if (voiceCandidate) {
      utterance.voice = voiceCandidate;
      utterance.lang = voiceCandidate.lang;
    }
    
    utterance.rate = 0.85;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setCurrentPlayingItemId(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentPlayingItemId(null);
    };
    
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const playServerTTS = async (text: string, itemId: string) => {
    setIsGeneratingAudio(true);
    setIsPlayingAudio(true);
    setCurrentPlayingItemId(itemId);
    try {
      console.log("Generating premium Gemini AI server-side TTS voice-over...");
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "Kore" }),
      });

      if (isCancelledRef.current) {
        console.log("TTS generation resolved but was cancelled by user.");
        return;
      }

      const data = await response.json();
      if (data.success && data.audio) {
        // Decode base64 to 24000Hz raw PCM or standard WAV container
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) {
            throw new Error("Web Audio API is not supported in this browser");
          }
          const audioCtx = new AudioContextClass();
          const binaryString = atob(data.audio);
          const len = binaryString.length;
          
          // Since Gemini TTS outputs raw 16-bit linear PCM (2 bytes per sample), decode manually
          const numOfSamples = len / 2;
          const floatData = new Float32Array(numOfSamples);
          
          for (let i = 0; i < numOfSamples; i++) {
            const byte1 = binaryString.charCodeAt(i * 2);
            const byte2 = binaryString.charCodeAt(i * 2 + 1);
            
            // Reconstruct 16-bit signed integer (little-endian)
            let sample = (byte2 << 8) | byte1;
            if (sample >= 0x8000) {
              sample = sample - 0x10000;
            }
            
            // Convert to float between -1.0 and 1.0
            floatData[i] = sample / 32768.0;
          }
          
          if (isCancelledRef.current) {
            console.log("TTS voice cancelled before decoding audio buffer.");
            audioCtx.close();
            return;
          }

          // Create a mono AudioBuffer at 24000Hz (the standard sample rate of gemini-3.1-flash-tts-preview)
          const audioBuffer = audioCtx.createBuffer(1, numOfSamples, 24000);
          audioBuffer.getChannelData(0).set(floatData);
          
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtx.destination);
          
          // Keep references to stop playback immediately if user clicks "To'xtatish"
          currentAudioSourceRef.current = source;
          currentAudioCtxRef.current = audioCtx;
          
          source.onended = () => {
            setIsPlayingAudio(false);
            setIsGeneratingAudio(false);
            setCurrentPlayingItemId(null);
            currentAudioSourceRef.current = null;
            currentAudioCtxRef.current = null;
          };
          
          source.start(0);
          setIsGeneratingAudio(false); // Done generating, playing now
          console.log("Pristine 24kHz raw PCM voice playback started successfully.");
        } catch (audioContextError) {
          console.warn("Raw PCM decoding via Web Audio API failed. Falling back to standard Audio blob player...", audioContextError);
          if (isCancelledRef.current) return;

          // Fallback playing method: write WAV container blob
          const binaryString = atob(data.audio);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          
          audio.play();
          setIsGeneratingAudio(false); // Done generating, playing now
          audio.onended = () => {
            setIsPlayingAudio(false);
            setCurrentPlayingItemId(null);
            currentAudioRef.current = null;
          };
          audio.onerror = () => {
            setAudioError("Ovoz ijro etishda muammo yuz berdi.");
            setIsPlayingAudio(false);
            setCurrentPlayingItemId(null);
            currentAudioRef.current = null;
          };
        }
      } else {
        const errorMsg = data.message || "Ovozli eshittirish tizimi qo'llab-quvvatlanmaydi.";
        setAudioError(`${errorMsg} (Sintezator fallback ishlatilmoqda)`);
        console.error("Server-side TTS returned unsuccessful:", data);
        setIsGeneratingAudio(false);
        speakBrowserFallback(text);
      }
    } catch (e: any) {
      console.error("Server-side TTS failed:", e);
      setAudioError(`${e.message || "Ovozli eshittirish tizimida xatolik."} (Sintezator fallback ishlatilmoqda)`);
      setIsGeneratingAudio(false);
      speakBrowserFallback(text);
    }
  };

  const getCommentT = (key: string) => {
    const lang = state.config.activeLang || "uz";
    const dicts: Record<string, Record<string, string>> = {
      uz: {
        btn: "Izoh 💬",
        new: "Yangi izoh qoldirish",
        namePlace: "Ismingiz (ixtiyoriy)",
        textPlace: "Izohingizni yozing...",
        cancel: "Bekor qilish",
        send: "Yuborish",
        list: "Izohlar",
        empty: "Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!",
      },
      uz_cyr: {
        btn: "Изоҳ 💬",
        new: "Янги изоҳ қолдириш",
        namePlace: "Исмингиз (ихтиёрий)",
        textPlace: "Изоҳингизни ёзинг...",
        cancel: "Бекор қилиш",
        send: "Юбориш",
        list: "Изоҳлар",
        empty: "Ҳозирча изоҳлар йўқ. Биринчи бўлиб изоҳ қолдиринг!",
      },
      ru: {
        btn: "Отзывы 💬",
        new: "Оставить отзыв",
        namePlace: "Ваше имя (необязательно)",
        textPlace: "Напишите ваш отзыв...",
        cancel: "Отмена",
        send: "Отправить",
        list: "Отзывы",
        empty: "Отзывов пока нет. Оставьте первый отзыв!",
      },
      en: {
        btn: "Comments 💬",
        new: "Leave a comment",
        namePlace: "Your name (optional)",
        textPlace: "Write your comment...",
        cancel: "Cancel",
        send: "Send",
        list: "Comments",
        empty: "No comments yet. Be the first to comment!",
      }
    };
    const currentDict = dicts[lang] || dicts["en"];
    return currentDict[key] || "";
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    if (!selectedItem) return;
    
    const guestLabel = state.config.activeLang === "uz" 
      ? "Mehmon" 
      : state.config.activeLang === "uz_cyr" 
      ? "Меҳмон" 
      : state.config.activeLang === "ru" 
      ? "Гость" 
      : "Guest";

    const newComment = {
      id: Date.now().toString(),
      author: commentName.trim() || guestLabel,
      text: commentText.trim(),
      date: new Date().toLocaleString(),
    };

    const updated = [...commentsList, newComment];
    setCommentsList(updated);
    localStorage.setItem(`comments_${selectedItem.id}`, JSON.stringify(updated));
    setCommentText("");
  };

  // List unique categories
  const categories = ["All", ...Array.from(new Set(state.menu.map((item) => item.category)))];

  // Filtering products: matches name, category, or search keywords (e.g. "ichimliklar" matches category)
  const filteredMenu = state.menu.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    return matchesSearch;
  });

  // Render Booklet Page Content
  const bookletPages = state.booklet.pages.length > 0 ? state.booklet.pages : ["Yo'riqnoma sahifalari mavjud emas."];

  if (selectedItem) {
    return (
      <div className="w-full min-h-screen p-4 md:p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4 py-6 md:py-12 flex flex-col gap-6"
        >
          {/* Top navigation row */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all shadow-md group cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{getBackText()}</span>
            </button>

            {/* Simple logo / brand indicator to make it look premium */}
            <div className="flex items-center gap-2">
              <img
                src={state.footer?.logoUrl || state.config.logoUrl}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full shadow-md object-cover"
              />
              <span className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">
                {(state.config as any).logoText || state.footer?.restaurantName || "Lazzat"}
              </span>
            </div>
          </div>

          {/* Main details page content */}
          <div className="bg-white/85 dark:bg-zinc-950/85 backdrop-blur-lg border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-2 gap-0 md:gap-4">
            {/* Left Column: Huge, gorgeous image */}
            <div className="relative aspect-video md:aspect-square w-full">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover md:rounded-l-3xl"
              />
              
              {/* Overlay Badges */}
              <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{selectedItem.rating} ({localT("chefRating")})</span>
              </span>
              
              {selectedItem.hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-[12px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md animate-pulse">
                  % {state.config.activeLang === "uz" ? "Chegirma" : state.config.activeLang === "ru" ? "Скидка" : "Discount"}
                </span>
              )}
            </div>

            {/* Right Column: Information, pricing, audio, and comments */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 dark:bg-amber-500/5 px-2.5 py-1 rounded-lg">
                    {dT(selectedItem.category)}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-white mt-3 leading-tight tracking-tight">
                    {dT(selectedItem.name)}
                  </h1>
                </div>

                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  {dT(selectedItem.description)}
                </p>

                {/* Pricing & Stock block */}
                <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                  <div>
                    <span className="text-xs text-zinc-400 block font-bold uppercase tracking-wider mb-1">{t.price}:</span>
                    <span className="text-lg md:text-xl font-black text-zinc-950 dark:text-white">
                      {selectedItem.price.toLocaleString()} {localT("som")}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block font-bold uppercase tracking-wider mb-1">{t.stock}:</span>
                    <span className="text-lg md:text-xl font-black text-amber-600 dark:text-amber-400">
                      {selectedItem.stock > 0 ? `${selectedItem.stock} ${localT("stockIn")}` : localT("outOfStock")}
                    </span>
                  </div>
                </div>

                {audioError && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-950/30">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{audioError}</span>
                  </div>
                )}
              </div>

              {/* Senior disclaimer & buttons */}
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* TTS Voice Button */}
                  <button
                    onClick={() => playTTS(selectedItem)}
                    className={`py-3.5 px-5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-md transition-all cursor-pointer ${
                      isGeneratingAudio
                        ? "bg-amber-600/80 text-white animate-pulse"
                        : isPlayingAudio
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/15"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/15"
                    }`}
                  >
                    {isGeneratingAudio ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce" : ""}`} />
                    )}
                    <span>
                      {isGeneratingAudio
                        ? getPreparingText()
                        : isPlayingAudio 
                        ? (state.config.activeLang === "uz" ? "Ovozni to'xtatish 🛑" : state.config.activeLang === "uz_cyr" ? "Овозни тўхтатиш 🛑" : state.config.activeLang === "ru" ? "Остановить 🛑" : "Stop Voice 🛑") 
                        : t.listen}
                    </span>
                  </button>

                  {/* Comments Toggle Button */}
                  <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className={`py-3.5 px-5 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-md transition-all cursor-pointer ${
                      showCommentForm
                        ? "bg-zinc-600 hover:bg-zinc-700 text-white shadow-zinc-600/15 dark:bg-zinc-750 dark:hover:bg-zinc-700"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/15"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{getCommentT("btn")}</span>
                  </button>
                </div>

                <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 font-medium">
                  {localT("seniorAlert")}
                </p>
              </div>
            </div>
          </div>

          {/* Comments block - full page section */}
          <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-md md:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span>{getCommentT("list")} ({commentsList.length})</span>
              </h3>
              
              {!showCommentForm && (
                <button
                  onClick={() => setShowCommentForm(true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  + {getCommentT("new")}
                </button>
              )}
            </div>

            {/* Collapsible Comment Form Section */}
            <AnimatePresence>
              {showCommentForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 space-y-4 overflow-hidden"
                >
                  <h4 className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-amber-500" />
                    <span>{getCommentT("new")}</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Ismingiz</label>
                      <input
                        type="text"
                        placeholder={getCommentT("namePlace")}
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Sizning fikringiz / izohingiz</label>
                      <textarea
                        placeholder={getCommentT("textPlace")}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={4}
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setShowCommentForm(false)}
                        className="px-4 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                      >
                        {getCommentT("cancel")}
                      </button>
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className="px-5 py-2 text-xs bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{getCommentT("send")}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Comments List Section */}
            {commentsList.length === 0 ? (
              <div className="text-center py-8 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                  {getCommentT("empty")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {commentsList.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 text-xs space-y-1.5 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm">{c.author}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">{c.date}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed break-words font-medium">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!userPhone) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col justify-between items-center p-4 relative overflow-hidden select-none" id="phone-entry-screen">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with language selector */}
        <div className="w-full max-w-md flex justify-end items-center z-10 py-2">
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-xs font-mono font-bold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {state.config.activeLang === "uz_cyr" ? "Кирилл" : state.config.activeLang?.toUpperCase()}
              </span>
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-xl border border-zinc-800 py-1.5 z-20 shadow-2xl">
                {state.languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onSetLang(lang);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-between cursor-pointer ${
                      state.config.activeLang === lang ? "text-amber-500" : "text-zinc-300"
                    }`}
                  >
                    <span>
                      {lang === "uz" ? "🇺🇿 O'zbek" : lang === "uz_cyr" ? "🇺🇿 Ўзбек" : lang === "ru" ? "🇷🇺 Рус" : lang === "en" ? "🇬🇧 Eng" : lang === "fr" ? "🇫🇷 Fra" : lang === "it" ? "🇮🇹 Ita" : lang === "de" ? "🇩🇪 Deu" : lang.toUpperCase()}
                    </span>
                    {state.config.activeLang === lang && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-8 rounded-3xl shadow-2xl my-auto z-10 space-y-6 text-center"
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src={state.config.logoUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200"}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-amber-500 tracking-tight">
                {(state.config as any).logoText || state.footer?.restaurantName || "Lazzat CRM"}
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-widest font-bold">
                {localT("welcome")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {loginStep === "phone" ? (
              <>
                <h2 className="text-sm font-bold text-zinc-200 tracking-tight leading-tight">
                  {localT("enterPhoneTitle")}
                </h2>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const trimmed = phoneInput.trim();
                  const digitCount = trimmed.replace(/\D/g, "").length;
                  if (digitCount < 12) {
                    setPhoneError(
                      activeLang === "uz" 
                        ? "Telefon raqamingizni to'liq kiriting! (9 ta raqam)" 
                        : activeLang === "uz_cyr"
                        ? "Телефон рақамингизни тўлиқ киритинг! (9 та рақам)"
                        : activeLang === "ru" 
                        ? "Пожалуйста, введите номер телефона полностью! (9 цифр)" 
                        : "Please enter your full phone number! (9 digits)"
                    );
                    return;
                  }
                  try {
                    const response = await fetch(`/api/profile/check-auth?phone=${encodeURIComponent(trimmed)}`);
                    const data = await response.json();
                    if (data.success && data.hasPassword) {
                      setLoginStep("password");
                      setDetectedName(data.name || "");
                      setPhoneError("");
                      setLoginPasswordInput("");
                      setPasswordError("");
                      return;
                    }
                  } catch (err) {
                    console.error("Error checking auth status:", err);
                  }

                  try {
                    await fetch("/api/profile/save", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ phone: trimmed }),
                    });
                  } catch (err) {
                    console.error("Error saving profile to server:", err);
                  }
                  localStorage.setItem("user_phone", trimmed);
                  setUserPhone(trimmed);
                }} className="space-y-3.5 text-left">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => {
                        handlePhoneInputChange(e.target.value);
                        if (phoneError) setPhoneError("");
                      }}
                      placeholder={localT("enterPhonePlaceholder")}
                      className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold font-mono"
                      autoFocus
                    />
                  </div>

                  {phoneError && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {phoneError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    {localT("continueBtn")}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-sm font-bold text-zinc-200 tracking-tight leading-tight">
                  {detectedName ? `Salom, ${detectedName}! 👋` : "Profil parolini kiriting"}
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Ushbu telefon raqamga parol o'rnatilgan. Iltimos, parolingizni kiriting.
                </p>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const trimmedPass = loginPasswordInput.trim();
                  if (!trimmedPass) {
                    setPasswordError(
                      activeLang === "uz" 
                        ? "Parolni kiriting!" 
                        : "Пожалуйста, введите пароль!"
                    );
                    return;
                  }
                  try {
                    const response = await fetch("/api/profile/login-with-password", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ phone: phoneInput.trim(), password: trimmedPass }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      localStorage.setItem("user_phone", phoneInput.trim());
                      setUserPhone(phoneInput.trim());
                      setLoginStep("phone");
                    } else {
                      setPasswordError(
                        activeLang === "uz" 
                          ? "Noto'g'ri parol! Qayta urinib ko'ring." 
                          : "Неверный пароль! Пожалуйста, попробуйте еще раз."
                      );
                    }
                  } catch (err) {
                    console.error("Error logging in with password:", err);
                    setPasswordError("Tizimda xatolik yuz berdi");
                  }
                }} className="space-y-3.5 text-left">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={loginPasswordInput}
                      onChange={(e) => {
                        setLoginPasswordInput(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      placeholder="Parolingizni kiriting"
                      className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold"
                      autoFocus
                    />
                  </div>

                  {passwordError && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {passwordError}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep("phone");
                        setPhoneError("");
                        setPasswordError("");
                      }}
                      className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                    >
                      Orqaga
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
                    >
                      Kirish
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="w-full max-w-md text-center text-[10px] text-zinc-600 font-medium py-4 z-10">
          © {new Date().getFullYear()} {(state.config as any).logoText || state.footer?.restaurantName || "Lazzat CRM"}. All rights reserved.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-16 relative">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 transition-colors duration-200 select-none">
        {/* Row 1 (Top Layer) */}
        <div className="backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200 relative z-30">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            
            {/* Logo & Kitchen Name */}
            <div className="flex items-center gap-3 shrink-0">
              <img
                src={state.footer?.logoUrl || state.config.logoUrl}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="rounded-full shadow-md object-cover transition-all"
                style={{ width: `${state.config.logoWidth}px`, height: `${state.config.logoWidth}px` }}
              />
              <div>
                <h1 className="text-xl md:text-2xl font-black text-amber-600 dark:text-amber-500 tracking-tight leading-none">
                  {(state.config as any).logoText || state.footer?.restaurantName || "Lazzat CRM"}
                </h1>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 uppercase tracking-wider font-bold">
                  {t.welcome}
                </p>
              </div>
            </div>

            {/* DYNAMIC HEADER QUICK BUTTONS (As requested) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
              {((state as any).navbarLinks || [
                { id: "1", name: "🏠 Cafe haqida", url: "#Restaran/Cafe haqida", order: 1, visible: true },
                { id: "2", name: "⚙️ Sozlamalar", url: "#Sozlamalar", order: 2, visible: true },
                { id: "3", name: "👨‍🍳 Xodimlar", url: "#Oshpaz & Afitsiant", order: 3, visible: true },
                { id: "4", name: "🔑 Admin", url: "#Admin paneli", order: 4, visible: true },
                { id: "5", name: "📖 Oshxonamiz Yo'riqnomasi", url: "#Ma'lumot", order: 5, visible: true },
                { id: "6", name: "❓ Savol-Javob", url: "#faq", order: 6, visible: true },
              ])
                .filter((link: any) => link.visible)
                .sort((a: any, b: any) => a.order - b.order)
                .map((link: any) => (
                  <button
                    key={link.id}
                    onClick={(e) => handleCustomUrlAction(link.url, e)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-xs transition-all cursor-pointer"
                  >
                    {getNavLinkName(link, state.config.activeLang || "uz")}
                  </button>
                ))
              }
            </div>

            {/* Utility menu: Translate */}
            <div className="flex items-center gap-3 animate-fade-in shrink-0">
              {/* Profile Button - clicking opens the profile settings modal directly */}
              <div>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-zinc-700 dark:text-zinc-200 text-xs font-black uppercase tracking-wider shadow-sm"
                  title="Profile"
                >
                  <span className="hidden md:inline">{localT("profile")}</span>
                  <span className="md:hidden text-sm">👤</span>
                </button>
              </div>

              {/* Hamburger Menu Trigger Button */}
              <button
                onClick={() => setShowHamburgerMenu(true)}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
                title="Menyu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Language Switcher */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span className="uppercase text-xs font-mono font-bold">
                    {state.config.activeLang === "uz_cyr" ? "Кирилл" : state.config.activeLang}
                  </span>
                </button>
                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-700 py-2.5 z-[9999]">
                    <div className="px-3 pb-1.5 mb-1.5 border-b border-zinc-100 dark:border-zinc-700">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Milliy Tillar</span>
                    </div>
                    {state.languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          onSetLang(lang);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full px-4 py-1.5 text-left text-xs font-semibold hover:bg-amber-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-between cursor-pointer ${
                          state.config.activeLang === lang ? "text-amber-600 dark:text-amber-400" : "text-zinc-700 dark:text-zinc-200"
                        }`}
                      >
                        <span>
                          {lang === "uz" ? "🇺🇿 O'zbekcha" : lang === "uz_cyr" ? "🇺🇿 Ўзбекча" : lang === "ru" ? "🇷🇺 Русский" : lang === "en" ? "🇬🇧 English" : lang === "fr" ? "🇫🇷 Français" : lang === "it" ? "🇮🇹 Italiano" : lang === "de" ? "🇩🇪 Deutsch" : `🌍 ${lang.toUpperCase()}`}
                        </span>
                        {state.config.activeLang === lang && <span className="text-[10px]">●</span>}
                      </button>
                    ))}

                    {/* Google Translate Integration inside Dropdown - Req #8 */}
                    <div className="px-3 pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-700">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1">🌐 {localT("googleTranslator")}</span>
                      <div id="google_translate_element" className="google-translate-inline-dropdown overflow-hidden rounded-lg"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Row 2 (Bottom Layer) - Search Bar in Full Width */}
        <div className="backdrop-blur-md bg-zinc-50/85 dark:bg-zinc-950/60 border-b border-zinc-200/60 dark:border-zinc-800/60 transition-colors duration-200 relative z-20">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
            <div className="w-full max-w-2xl relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-800 dark:text-white dark:placeholder-zinc-500 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </header>

      {/* PROFILE SETTINGS MODAL OVERLAY */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 dark:border-zinc-800 relative space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setProfileSaveSuccess(false);
                }}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                👤 Profil Sozlamalari
              </h2>

              <div className="space-y-4 text-left">
                {/* Disabled Phone Field */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                    Telefon raqam (O'zgartirib bo'lmaydi)
                  </label>
                  <div className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl text-sm text-zinc-500 dark:text-zinc-400 font-semibold font-mono flex items-center justify-between">
                    <span>{userPhone}</span>
                    <span className="text-green-500 text-xs">✔ Tasdiqlangan</span>
                  </div>
                </div>

                {/* Name Input Field */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                    Ismingiz (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Masalan: Salohiddin"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold"
                  />
                </div>

                {/* Password Input Field */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                    Profil paroli (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Parol kiritmasangiz, parol so'ralmaydi"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold"
                  />
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    💡 Agar parol o'rnatsangiz, boshqa qurilmalardan ushbu telefon raqam orqali kirganda parol kiritishingiz talab qilinadi. Parolni o'chirib tashlasangiz (bo'sh qoldirsangiz), parol so'ralmaydi.
                  </p>
                </div>

                {profileSaveSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-xl text-center">
                    🎉 Profil ma'lumotlari muvaffaqiyatli saqlandi!
                  </div>
                )}

                {/* Buttons */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={async () => {
                      setIsSavingProfile(true);
                      try {
                        await fetch("/api/profile/update", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            phone: userPhone,
                            name: profileName,
                            password: profilePassword
                          }),
                        });
                        setProfileSaveSuccess(true);
                        setTimeout(() => setProfileSaveSuccess(false), 3000);
                      } catch (err) {
                        console.error("Error saving profile details:", err);
                      } finally {
                        setIsSavingProfile(false);
                      }
                    }}
                    disabled={isSavingProfile}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSavingProfile ? "Saqlanmoqda..." : "Saqlash"}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Log Out */}
                    <button
                      onClick={() => {
                        localStorage.removeItem("user_phone");
                        setUserPhone(null);
                        setPhoneInput("+998");
                        setShowProfileModal(false);
                        window.location.reload();
                      }}
                      className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-zinc-200/50 dark:border-zinc-800 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>🚪</span>
                      <span>Chiqish</span>
                    </button>

                    {/* Delete Profile */}
                    <button
                      onClick={async () => {
                        const confirmed = window.confirm(
                          "Haqiqatan ham profilingizni butunlay o'chirmoqchimisiz? Barcha ma'lumotlar o'chib ketadi!"
                        );
                        if (!confirmed) return;
                        
                        try {
                          await fetch("/api/profile/delete", { method: "POST" });
                        } catch (err) {
                          console.error("Error deleting profile from server:", err);
                        }
                        localStorage.removeItem("user_phone");
                        setUserPhone(null);
                        setPhoneInput("+998");
                        setShowProfileModal(false);
                        window.location.reload();
                      }}
                      className="py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-red-500 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>🗑️</span>
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SETTINGS MENU MODAL OVERLAY */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 dark:border-zinc-800 relative"
            >
              <button
                onClick={() => setShowSettings(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                ⚙️ {t.settings}
              </h2>

              <div className="space-y-4">
                {/* Premium Dark / Light Mode selector cards with descriptions */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
                    🎨 {t.darkLight || "Mavzu rejimi"}
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Light Mode Selector Card */}
                    <button
                      onClick={() => onSetTheme("light")}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden group ${
                        state.config.theme === "light"
                          ? "bg-amber-500/5 border-amber-500 ring-2 ring-amber-500/20"
                          : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">☀️</span>
                        {state.config.theme === "light" && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 block">
                          {state.config.activeLang === "uz" ? "Kunduzgi rejim" : state.config.activeLang === "ru" ? "Дневной режим" : "Light Mode"}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold block mt-0.5">Light Mode</span>
                      </div>
                    </button>

                    {/* Dark Mode Selector Card */}
                    <button
                      onClick={() => onSetTheme("dark")}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden group ${
                        state.config.theme === "dark"
                          ? "bg-amber-500/5 border-amber-500 ring-2 ring-amber-500/20"
                          : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">🌙</span>
                        {state.config.theme === "dark" && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 block">
                          {state.config.activeLang === "uz" ? "Tungi rejim" : state.config.activeLang === "ru" ? "Ночной режим" : "Dark Mode"}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold block mt-0.5">Dark Mode</span>
                      </div>
                    </button>
                  </div>

                  {/* Mode explanation box */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 transition-all duration-300">
                    {(() => {
                      const details = getThemeDetails(state.config.theme as "light" | "dark", state.config.activeLang);
                      return (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-500 block">
                            {details.title}
                          </span>
                          <ul className="space-y-1.5">
                            {details.points.map((point, idx) => (
                              <li key={idx} className="text-[10.5px] leading-relaxed text-zinc-600 dark:text-zinc-300 flex items-start gap-1.5 font-semibold">
                                <span className="text-amber-500 shrink-0 text-xs mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800/60" />

                {/* Google Translate Integration inside settings - Req #8 */}
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">🌐 Google Translate</span>
                  <div id="google_translate_element_settings" className="google-translate-settings-box overflow-hidden rounded-lg"></div>
                  {/* Script fallback to trigger widget rendering if needed */}
                  <span className="text-[9px] text-zinc-400 block leading-tight">{localT("autoTranslateDesc")}</span>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800" />

                {/* Switch to panels (Oshpaz/Afitsiant, Admin) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{localT("systemSections")}</span>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      onPanelChange("staff");
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors text-left"
                  >
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">👨‍🍳 {t.staffPanel}</span>
                    <Key className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      onPanelChange("admin");
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors text-left"
                  >
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">🔑 {t.adminPanel}</span>
                    <Key className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADVERTISEMENT SPACE: TOP */}
      {state.ads.map((ad) => {
        if (!ad.active || ad.position !== "top") return null;
        return (
          <div key={ad.id} className="max-w-7xl mx-auto px-4 mt-4">
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative rounded-2xl overflow-hidden shadow-md group">
              {ad.type === "image" && (
                <img src={ad.contentUrl} alt="Ad" referrerPolicy="no-referrer" className="w-full h-32 md:h-44 object-cover group-hover:scale-[1.01] transition-transform duration-300" />
              )}
              {ad.type === "video" && (
                <video src={ad.contentUrl} autoPlay loop muted playsInline className="w-full h-32 md:h-44 object-cover" />
              )}
              <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {localT("adSpace")}
              </span>
            </a>
          </div>
        );
      })}

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        {/* HERO SECTION with Dynamic Background and Integrated Side-by-Side Ad Carousel (Uzum Market Style) */}
        {(() => {
          const heroBg = state.sectionBackgrounds?.hero || {
            bgType: "gradient",
            bgValue: "linear-gradient(to bottom, #18181b, #09090b)"
          };
          
          let heroStyle: React.CSSProperties = {};
          if (heroBg.bgType === "color") {
            heroStyle = { backgroundColor: heroBg.bgValue };
          } else if (heroBg.bgType === "gradient") {
            heroStyle = { backgroundImage: heroBg.bgValue };
          } else if (heroBg.bgType === "image" || heroBg.bgType === "gif") {
            heroStyle = { backgroundImage: `url(${heroBg.bgValue})`, backgroundSize: "cover", backgroundPosition: "center" };
          }

          return (
            <div 
              style={heroStyle}
              className="relative rounded-3xl overflow-hidden shadow-xl border border-zinc-200/10 mb-8 w-full min-h-[300px]"
            >
              {heroBg.bgType === "video" && (
                <video
                  src={heroBg.bgValue}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
              )}
              {/* Dynamic Overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10" />

              {/* Integrated Slide-by-Slide Content */}
              <div className="relative z-20 w-full h-full p-6 md:p-10 lg:p-12 flex flex-col justify-center min-h-[300px] md:min-h-[350px]">
                {(() => {
                  const heroVariants = {
                    enter: (dir: number) => ({
                      opacity: 0,
                      x: dir > 0 ? "100%" : "-100%",
                      scale: 0.95,
                    }),
                    center: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: {
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.35 }
                      }
                    },
                    exit: (dir: number) => ({
                      opacity: 0,
                      x: dir < 0 ? "100%" : "-100%",
                      scale: 0.95,
                      transition: {
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.35 }
                      }
                    })
                  };

                  return (
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                      {(() => {
                        const activeSlide = heroSlides[currentHeroIndex];
                        if (!activeSlide) return null;

                        if (activeSlide.type === "greeting") {
                          return (
                            <motion.div
                              key="greeting"
                              custom={direction}
                              variants={heroVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              className="w-full flex flex-col justify-center text-white text-left space-y-4 md:space-y-6"
                            >
                              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-md text-amber-500 uppercase">
                                {dT(state.footer?.restaurantName || "EVOS Fast Food Restaurant")}
                              </h1>
                              <p className="text-sm md:text-lg text-zinc-200 font-medium leading-relaxed drop-shadow-sm max-w-2xl">
                                {dT(state.footer?.restaurantDesc || "Our mission to help provides fresh and tasty food cooked fresh with fresh and tasty food.")}
                              </p>
                              <div className="pt-2">
                                <a 
                                  href="#menu"
                                  className="inline-flex items-center gap-2.5 px-7 py-4 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                                >
                                  <span>{state.config.activeLang === "uz" ? "Menyuni ko'rish 🍽️" : state.config.activeLang === "ru" ? "Посмотреть меню 🍽️" : "Explore Menu 🍽️"}</span>
                                </a>
                              </div>
                            </motion.div>
                          );
                        } else {
                          const ad = activeSlide.data;
                          if (!ad) return null;
                          return (
                            <motion.div
                              key={ad.id}
                              custom={direction}
                              variants={heroVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              className="w-full h-full flex flex-col justify-center"
                            >
                              <a
                                href={ad.linkUrl || "#"}
                                target={ad.linkUrl ? "_blank" : undefined}
                                rel={ad.linkUrl ? "noopener noreferrer" : undefined}
                                className="relative block w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/10 shadow-2xl group cursor-pointer"
                              >
                                {ad.type === "video" ? (
                                  <video
                                    src={ad.contentUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={ad.contentUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200"}
                                    alt={ad.title || "Ad"}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                                  />
                                )}
                                
                                {/* Beautiful Overlay for ad info readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10" />

                                {/* Reklama Badge */}
                                <span className="absolute top-4 left-4 z-20 bg-amber-500 text-black text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                                  📢 {localT("reklamaTitle")}
                                </span>

                                {/* Title of active ad */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white flex flex-col gap-1 text-left">
                                  {ad.title && (
                                    <h3 className="text-lg md:text-3xl font-black tracking-tight drop-shadow-md text-amber-500 uppercase">
                                      {ad.title}
                                    </h3>
                                  )}
                                  {ad.linkUrl && (
                                    <div className="mt-2">
                                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-500 group-hover:text-amber-400 uppercase tracking-widest transition-colors">
                                        {state.config.activeLang === "uz" ? "Batafsil ma'lumot" : state.config.activeLang === "ru" ? "Подробнее" : "Learn More"} →
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </a>
                            </motion.div>
                          );
                        }
                      })()}
                    </AnimatePresence>
                  );
                })()}
              </div>

              {/* Interactive Left Button (‹) */}
              {heroSlides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const newIndex = (currentHeroIndex - 1 + heroSlides.length) % heroSlides.length;
                    setDirection(-1);
                    setCurrentHeroIndex(newIndex);
                    setAdTimerKey((k) => k + 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 border border-white/15 text-2xl font-bold select-none"
                  aria-label="Previous Slide"
                >
                  ‹
                </button>
              )}

              {/* Interactive Right Button (›) */}
              {heroSlides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const newIndex = (currentHeroIndex + 1) % heroSlides.length;
                    setDirection(1);
                    setCurrentHeroIndex(newIndex);
                    setAdTimerKey((k) => k + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 border border-white/15 text-2xl font-bold select-none"
                  aria-label="Next Slide"
                >
                  ›
                </button>
              )}

              {/* Elegant Dot Indicators (Dots) */}
              {heroSlides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        if (idx === currentHeroIndex) return;
                        setDirection(idx > currentHeroIndex ? 1 : -1);
                        setCurrentHeroIndex(idx);
                        setAdTimerKey((k) => k + 1);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentHeroIndex
                          ? "w-6 bg-amber-500 shadow-lg shadow-amber-500/50"
                          : "w-2 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                      title={slide.type === "greeting" ? "Greeting" : `Ad: ${slide.data?.title || ""}`}
                    />
                  ))}
                </div>
              )}

            </div>
          );
        })()}

        {/* MENU SECTION with Dynamic Background (Requirement 9) */}
        {(() => {
          const menuBg = state.sectionBackgrounds?.menu || {
            bgType: "color",
            bgValue: "transparent"
          };
          
          let menuStyle: React.CSSProperties = {};
          if (menuBg.bgType === "color") {
            menuStyle = { backgroundColor: menuBg.bgValue };
          } else if (menuBg.bgType === "gradient") {
            menuStyle = { backgroundImage: menuBg.bgValue };
          } else if (menuBg.bgType === "image" || menuBg.bgType === "gif") {
            menuStyle = { backgroundImage: `url(${menuBg.bgValue})`, backgroundSize: "cover", backgroundPosition: "center" };
          }

          return (
            <div 
              id="menu"
              style={menuStyle}
              className="relative p-6 md:p-8 rounded-3xl overflow-hidden border border-zinc-200/10 shadow-sm"
            >
              {menuBg.bgType === "video" && (
                <video
                  src={menuBg.bgValue}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-25"
                />
              )}
              {menuBg.bgType === "image" && (
                <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/90 -z-10" />
              )}
              
              <div className="relative z-10">
                {/* Categories Carousel */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 border border-zinc-100 dark:border-zinc-800"
                      }`}
                    >
                      {cat === "All" ? localT("all") : dT(cat)}
                    </button>
                  ))}
                </div>

                {/* Menu Grid - Premium layout style mirroring the user's uploaded images */}
                {filteredMenu.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                    {filteredMenu.map((item) => (
                      <motion.div
                        key={item.id}
                        layoutId={`item-${item.id}`}
                        onClick={() => { window.location.hash = `#/menu/${item.id}`; }}
                        className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-xs border border-zinc-100 dark:border-zinc-700 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col group"
                      >
                          {/* Food Image Container */}
                          <div className="relative aspect-square overflow-hidden bg-zinc-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${item.stock <= 0 ? "blur-md scale-95" : ""}`}
                            />
                            {/* Rating Badge */}
                            <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {item.rating}
                            </span>

                            {/* Discount badge */}
                            {item.hasDiscount && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md animate-pulse flex items-center gap-1">
                                % {state.config.activeLang === "uz" ? "Chegirma" : state.config.activeLang === "ru" ? "Скидка" : "Discount"}
                              </span>
                            )}

                            {/* Stock status indicator */}
                            <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                              item.stock > 10 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : item.stock > 0
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {item.stock > 0 ? `${item.stock} ${localT("ta")}` : localT("outofstockSimple")}
                          </span>

                          {/* Out of Stock Overlay with Blurred Image */}
                          {item.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center z-10 animate-fade-in">
                              <span className="bg-red-600/90 text-white text-[11px] md:text-xs font-black px-3 py-2 rounded-xl uppercase tracking-wider shadow-lg border border-red-500/20 animate-pulse">
                                {state.config.activeLang === "uz" 
                                  ? "Ovqat tugagan" 
                                  : state.config.activeLang === "uz_cyr"
                                  ? "Овқат тугаган"
                                  : state.config.activeLang === "ru" 
                                  ? "Еда закончилась" 
                                  : "Food finished"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content details */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              {dT(item.category)}
                            </span>
                            <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white line-clamp-1 mt-0.5 group-hover:text-amber-600 transition-colors">
                              {dT(item.name)}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                              {dT(item.description)}
                            </p>
                          </div>

                          <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700/50 flex flex-col gap-2">
                            {/* Price row */}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-mono">{localT("narxi")}</span>
                                <span className="text-sm font-extrabold text-zinc-900 dark:text-white">
                                  {item.price.toLocaleString()} {localT("som")}
                                </span>
                              </div>
                            </div>

                            {/* Full-width Voice Button */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                playTTS(item);
                              }}
                              className={`w-full mt-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-all shadow-xs cursor-pointer ${
                                isGeneratingAudio && currentPlayingItemId === item.id
                                  ? "bg-amber-600/85 text-white animate-pulse"
                                  : isPlayingAudio && currentPlayingItemId === item.id
                                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/10"
                                  : "bg-zinc-800 hover:bg-amber-500 text-white dark:bg-zinc-700 dark:hover:bg-amber-500"
                              }`}
                            >
                              {isGeneratingAudio && currentPlayingItemId === item.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio && currentPlayingItemId === item.id ? "animate-bounce" : ""}`} />
                              )}
                              <span>
                                {isGeneratingAudio && currentPlayingItemId === item.id
                                  ? getPreparingText()
                                  : isPlayingAudio && currentPlayingItemId === item.id
                                  ? localT("stopAudio")
                                  : localT("aboutFood")}
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-white dark:bg-zinc-800 rounded-2xl shadow-xs border border-zinc-100 dark:border-zinc-700">
                    <p className="text-zinc-500 dark:text-zinc-400">{localT("noFood")}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* DETAILED DIALOG WITH VOICE OVER */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              layoutId={`item-${selectedItem.id}`}
              className="bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl relative border border-zinc-200 dark:border-zinc-800 max-h-[85vh] md:max-h-[85vh] flex flex-col"
              style={{ maxHeight: "85vh" }}
            >
              <button
                onClick={() => {
                  setSelectedItem(null);
                  window.speechSynthesis?.cancel();
                  setIsPlayingAudio(false);
                }}
                className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sticky Top Header: Image Block */}
              <div className="aspect-video w-full relative shrink-0">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${selectedItem.stock <= 0 ? "blur-md scale-95" : ""}`}
                />
                <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {selectedItem.rating} ({localT("chefRating")})
                </span>
                {selectedItem.hasDiscount && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md animate-pulse">
                    % {state.config.activeLang === "uz" ? "Chegirma" : state.config.activeLang === "ru" ? "Скидка" : "Discount"}
                  </span>
                )}

                {/* Detailed view out of stock overlay */}
                {selectedItem.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-10 animate-fade-in">
                    <span className="bg-red-600/90 text-white text-xs md:text-sm font-black px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-lg border border-red-500/20 animate-pulse">
                      {state.config.activeLang === "uz" 
                        ? "Ovqat tugagan" 
                        : state.config.activeLang === "uz_cyr"
                        ? "Овқат тугаган"
                        : state.config.activeLang === "ru" 
                        ? "Еда закончилась" 
                        : "Food finished"}
                    </span>
                  </div>
                )}
              </div>

              {/* Scrollable Content Block */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar min-h-0 space-y-4">
                <div>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                    {dT(selectedItem.category)}
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                    {dT(selectedItem.name)}
                  </h2>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed">
                    {dT(selectedItem.description)}
                  </p>
                </div>

                {/* Pricing & Stock block */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-xs text-zinc-400 block">{t.price}:</span>
                    <span className="text-lg font-black text-zinc-950 dark:text-white">
                      {selectedItem.price.toLocaleString()} {localT("som")}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">{t.stock}:</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                      {selectedItem.stock > 0 ? `${selectedItem.stock} ${localT("stockIn")}` : localT("outOfStock")}
                    </span>
                  </div>
                </div>

                {audioError && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>{audioError}</span>
                  </div>
                )}

                {/* Collapsible Comment Form Section */}
                {showCommentForm && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800"
                  >
                    <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                      {getCommentT("new")}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder={getCommentT("namePlace")}
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder={getCommentT("textPlace")}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={3}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowCommentForm(false)}
                          className="px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        >
                          {getCommentT("cancel")}
                        </button>
                        <button
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                          className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>{getCommentT("send")}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Comments List Section */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{getCommentT("list")} ({commentsList.length})</span>
                  </h4>
                  {commentsList.length === 0 ? (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 italic py-2 text-center">
                      {getCommentT("empty")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {commentsList.map((c) => (
                        <div key={c.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100/50 dark:border-zinc-800/50 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">{c.author}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{c.date}</span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed break-words">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Bottom Actions Block */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* TTS Voice Button */}
                  <button
                    onClick={() => playTTS(selectedItem)}
                    className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-md transition-all cursor-pointer ${
                      isGeneratingAudio
                        ? "bg-amber-600/80 text-white animate-pulse"
                        : isPlayingAudio
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/15"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/15"
                    }`}
                  >
                    {isGeneratingAudio ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce" : ""}`} />
                    )}
                    <span>
                      {isGeneratingAudio
                        ? getPreparingText()
                        : isPlayingAudio 
                        ? (state.config.activeLang === "uz" ? "Ovozni to'xtatish 🛑" : state.config.activeLang === "uz_cyr" ? "Овозни тўхтатиш 🛑" : state.config.activeLang === "ru" ? "Остановить 🛑" : "Stop Voice 🛑") 
                        : t.listen}
                    </span>
                  </button>

                  {/* Comments Toggle Button */}
                  <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-md transition-all cursor-pointer ${
                      showCommentForm
                        ? "bg-zinc-600 hover:bg-zinc-700 text-white shadow-zinc-600/15 dark:bg-zinc-750 dark:hover:bg-zinc-700"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/15"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{getCommentT("btn")}</span>
                  </button>
                </div>
                
                <p className="text-[9px] text-center text-zinc-400 mt-2">
                  {localT("seniorAlert")}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

            {/* REALISTIC SPIRAL NOTEBOOK WELCOME BOOKLET */}
      <AnimatePresence>
        {showBooklet && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 5, scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#fcfbe3] text-zinc-800 rounded-2xl w-full max-w-md shadow-2xl relative border-2 border-[#e6dec3] flex flex-col overflow-hidden"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {/* Spiral binding rings decoration at the top */}
              <div className="bg-[#ebd9a6] h-10 w-full flex justify-around px-4 items-center border-b-2 border-[#e6dec3] relative">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="w-3.5 h-6 rounded-full bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-400 shadow-sm border border-zinc-500" />
                ))}
                {/* Red X close button */}
                <button
                  onClick={() => setShowBooklet(false)}
                  className="absolute right-4 top-2 text-zinc-800 hover:text-red-600 bg-white/40 hover:bg-white/80 rounded-full p-1 border border-zinc-400 shadow-xs transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Booklet Page content */}
              <div className="p-6 md:p-8 flex-1 min-h-[250px] flex flex-col justify-between relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                {/* Ruled lines background simulation */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(#000_1px,transparent_1px)] [background-size:100%_24px] top-6" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b-2 border-red-200 pb-2 mb-4">
                    <span className="text-sm font-extrabold text-red-500 uppercase tracking-widest font-sans">
                      📖 {dT(state.booklet.title)}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {localT("page")}: {bookletPage + 1}/{bookletPages.length}
                    </span>
                  </div>

                  <p className="text-base md:text-lg text-zinc-900 leading-8 indent-4 font-medium italic select-none">
                    {dT(bookletPages[bookletPage])}
                  </p>
                </div>

                {/* Page turning pagination controls */}
                <div className="relative z-10 mt-8 flex items-center justify-between border-t border-zinc-200 pt-4">
                  <button
                    onClick={() => setBookletPage((prev) => Math.max(0, prev - 1))}
                    disabled={bookletPage === 0}
                    className="flex items-center gap-1 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:text-amber-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>{localT("prev")}</span>
                  </button>

                  <div className="flex gap-1">
                    {bookletPages.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${bookletPage === i ? "bg-amber-600 scale-125" : "bg-zinc-300"}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (bookletPage === bookletPages.length - 1) {
                        setShowBooklet(false);
                      } else {
                        setBookletPage((prev) => prev + 1);
                      }
                    }}
                    className="flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-900 font-sans"
                  >
                    <span>{bookletPage === bookletPages.length - 1 ? localT("goToMenu") : localT("next")}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HAMBURGER MENU DRAWER */}
      <AnimatePresence>
        {showHamburgerMenu && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHamburgerMenu(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-80 max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={state.config.logoUrl}
                      alt="Logo"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full shadow-md object-cover"
                    />
                    <span className="font-bold text-base text-zinc-900 dark:text-white uppercase tracking-wider">
                      {(state.config as any).logoText || state.footer?.restaurantName || "Lazzat CRM"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowHamburgerMenu(false)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body list options */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block px-2 mb-1">
                    {localT("menu") || "Menyu"}
                  </span>

                  {((state as any).navbarLinks || [
                    { id: "1", name: "🏠 Cafe haqida", url: "#Restaran/Cafe haqida", order: 1, visible: true },
                    { id: "2", name: "⚙️ Sozlamalar", url: "#Sozlamalar", order: 2, visible: true },
                    { id: "3", name: "👨‍🍳 Xodimlar", url: "#Oshpaz & Afitsiant", order: 3, visible: true },
                    { id: "4", name: "🔑 Admin", url: "#Admin paneli", order: 4, visible: true },
                    { id: "5", name: "📖 Oshxonamiz Yo'riqnomasi", url: "#Ma'lumot", order: 5, visible: true },
                    { id: "6", name: "❓ Savol-Javob", url: "#faq", order: 6, visible: true },
                  ])
                    .filter((link: any) => link.visible)
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((link: any) => {
                      let descText = "";
                      const cleanLUrl = link.url.toLowerCase();
                      const curLang = state.config.activeLang || "uz";
                      
                      if (cleanLUrl.includes("about") || cleanLUrl.includes("haqida") || cleanLUrl === "#about") {
                        descText = curLang === "uz" ? "Kafemiz ma'lumotlari, video va rasmlar" 
                          : curLang === "uz_cyr" ? "Кафемиз маълумотлари, видео ва расмлар"
                          : curLang === "ru" ? "Информация о кафе, видео и фото" 
                          : curLang === "fr" ? "Détails du café, vidéo et photos"
                          : curLang === "it" ? "Dettagli del locale, video e foto"
                          : curLang === "de" ? "Informationen über das Café, Video und Fotos"
                          : "Cafe details, video and images";
                      } else if (cleanLUrl.includes("setting") || cleanLUrl.includes("sozlamalar") || cleanLUrl === "#settings") {
                        descText = curLang === "uz" ? "Tungi/Kunduzi va Google Tarjimon" 
                          : curLang === "uz_cyr" ? "Тунги/Кундузи ва Google Таржимон"
                          : curLang === "ru" ? "Ночной/Дневной режим и переводчик" 
                          : curLang === "fr" ? "Mode Nuit/Jour et traducteur"
                          : curLang === "it" ? "Modalità Notte/Giorno e traduttore"
                          : curLang === "de" ? "Nacht-/Tagmodus und Übersetzer"
                          : "Night/Day mode and translation";
                      } else if (cleanLUrl.includes("staff") || cleanLUrl.includes("xodimlar") || cleanLUrl.includes("oshpaz")) {
                        descText = curLang === "uz" ? "Oshpaz va afitsiant boshqaruv paneli" 
                          : curLang === "uz_cyr" ? "Ошпаз ва афициант бошқарув панели"
                          : curLang === "ru" ? "Панель повара и официанта" 
                          : curLang === "fr" ? "Panneau cuisine et serveurs"
                          : curLang === "it" ? "Pannello cuochi e camerieri"
                          : curLang === "de" ? "Küchen- und Kellnerbereich"
                          : "Staff and chef panel";
                      } else if (cleanLUrl.includes("admin")) {
                        descText = curLang === "uz" ? "Tizim sozlamalari va analitika" 
                          : curLang === "uz_cyr" ? "Тизим созламалари ва аналитика"
                          : curLang === "ru" ? "Настройки системы и аналитика" 
                          : curLang === "fr" ? "Paramètres système et analyses"
                          : curLang === "it" ? "Impostazioni di sistema e statistiche"
                          : curLang === "de" ? "Systemeinstellungen und Analysen"
                          : "System settings and analytics";
                      } else if (cleanLUrl.includes("ma'lumot") || cleanLUrl.includes("malumot") || cleanLUrl.includes("bloknot") || cleanLUrl.includes("note") || cleanLUrl.includes("guide") || cleanLUrl.includes("yoriqnoma") || cleanLUrl.includes("yo'riqnoma")) {
                        descText = curLang === "uz" ? "Saytdan qulay foydalanish va buyurtma berish qoidalari" 
                          : curLang === "uz_cyr" ? "Сайтдан қулай фойдаланиш ва буюртма бериш қоидалари"
                          : curLang === "ru" ? "Инструкции по использованию сайта и заказам" 
                          : curLang === "fr" ? "Guide d'utilisation du site et des commandes"
                          : curLang === "it" ? "Guida all'uso del sito e degli ordini"
                          : curLang === "de" ? "Leitfaden zur Nutzung der Website und Bestellungen"
                          : "Guidelines on using the site and orders";
                      } else if (cleanLUrl.includes("faq") || cleanLUrl.includes("savol") || cleanLUrl.includes("javob")) {
                        descText = curLang === "uz" ? "Tez-tez beriladigan savollar va javoblar" 
                          : curLang === "uz_cyr" ? "Тез-тез бериладиgan саволлар ва жавоблар"
                          : curLang === "ru" ? "Часто задаваемые вопросы и ответы" 
                          : curLang === "fr" ? "Questions fréquemment posées et réponses"
                          : curLang === "it" ? "Domande frequenti e risposte"
                          : curLang === "de" ? "Häufig gestellte Fragen und Antworten"
                          : "Frequently asked questions and answers";
                      } else {
                        descText = curLang === "uz" ? "Tezkor havola" 
                          : curLang === "uz_cyr" ? "Тезкор ҳавола"
                          : curLang === "ru" ? "Быстрая ссылка" 
                          : curLang === "fr" ? "Lien rapide"
                          : curLang === "it" ? "Link rapido"
                          : curLang === "de" ? "Schnellzugriff"
                          : "Quick link";
                      }

                      return (
                        <button
                          key={link.id}
                          onClick={(e) => {
                            setShowHamburgerMenu(false);
                            handleCustomUrlAction(link.url, e);
                          }}
                          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800/60 text-left transition-all cursor-pointer group"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block truncate">
                              {getNavLinkName(link, curLang)}
                            </span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5 truncate">
                              {descText}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  }
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 text-center">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {(state.config as any).logoText || state.footer?.restaurantName || "Lazzat CRM"} v2.1.0 • Smart Menu
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
{/* ADVERTISEMENT SPACE: BOTTOM */}
      {state.ads.map((ad) => {
        if (!ad.active || ad.position !== "bottom") return null;
        return (
          <div key={ad.id} className="max-w-7xl mx-auto px-4 mt-6">
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative rounded-2xl overflow-hidden shadow-md group">
              {ad.type === "image" && (
                <img src={ad.contentUrl} alt="Ad" referrerPolicy="no-referrer" className="w-full h-24 md:h-36 object-cover group-hover:scale-[1.01] transition-transform duration-300" />
              )}
              {ad.type === "video" && (
                <video src={ad.contentUrl} autoPlay loop muted playsInline className="w-full h-24 md:h-36 object-cover" />
              )}
              <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {localT("adSpace")}
              </span>
            </a>
          </div>
        );
      })}

      {/* PROFESSIONAL DIGITAL MENU FOOTER SECTION (Requirements 1-8) */}
      {(() => {
        const footer = state.footer || {
          restaurantName: "EVOS Fast Food Restaurant",
          restaurantDesc: "Our mission to help provides fresh and tasty food cooked fresh with fresh and tasty food.",
          logoUrl: state.config.logoUrl,
          phone: "+998 71 200 05 05",
          email: "@evos_uz",
          address: "main office address, Tashkent 123, Uzbekistan",
          links: [
            { id: "1", name: "Menyu", url: "#menu" },
            { id: "2", name: "Aksiyalar", url: "#ads" },
            { id: "3", name: "Filiallarimiz", url: "#branches" },
            { id: "4", name: "Biz haqimizda", url: "#about" },
            { id: "5", name: "Karyera", url: "#careers" }
          ],
          socials: [
            { id: "1", platform: "instagram", url: "https://instagram.com/evos_uz" },
            { id: "2", platform: "facebook", url: "https://facebook.com/evos" },
            { id: "3", platform: "telegram", url: "https://t.me/evos_uz" },
            { id: "4", platform: "youtube", url: "https://youtube.com/evos" }
          ],
          apps: [
            { id: "1", platform: "appstore", url: "https://apps.apple.com/uz/app/evos" },
            { id: "2", platform: "googleplay", url: "https://play.google.com/store/apps/details?id=uz.evos" }
          ],
          copyrightText: "© 2024 EVOS. Barcha huquqlar himoyalangan.",
          bgType: "gradient",
          bgValue: "linear-gradient(to right, #451a03, #1e1b4b)"
        };

        const getSocialPlatformInfo = (url: string) => {
          const lowercaseUrl = url.toLowerCase();
          if (lowercaseUrl.includes("instagram.com")) {
            return { name: "Instagram", icon: Instagram };
          }
          if (lowercaseUrl.includes("facebook.com")) {
            return { name: "Facebook", icon: Facebook };
          }
          if (lowercaseUrl.includes("t.me") || lowercaseUrl.includes("telegram.org")) {
            return { name: "Telegram", icon: Send };
          }
          if (lowercaseUrl.includes("youtube.com") || lowercaseUrl.includes("youtu.be")) {
            return { name: "YouTube", icon: Youtube };
          }
          if (lowercaseUrl.includes("tiktok.com")) {
            return { name: "TikTok", icon: Music };
          }
          return { name: "Website", icon: Globe };
        };

        const getAppPlatformInfo = (url: string, platform?: string) => {
          const plat = (platform || "").toLowerCase();
          const lowercaseUrl = url.toLowerCase();
          
          const isAppStore = plat === 'appstore' || lowercaseUrl.includes("apps.apple.com") || lowercaseUrl.includes("apple.com");
          const isGooglePlay = plat === 'googleplay' || lowercaseUrl.includes("play.google.com") || lowercaseUrl.includes("googleplay");
          const isTelegram = plat === 'telegram' || lowercaseUrl.includes("t.me") || lowercaseUrl.includes("telegram.org");
          const isInstagram = plat === 'instagram' || lowercaseUrl.includes("instagram.com");
          const isFacebook = plat === 'facebook' || lowercaseUrl.includes("facebook.com");
          const isYoutube = plat === 'youtube' || lowercaseUrl.includes("youtube.com") || lowercaseUrl.includes("youtu.be");
          const isTiktok = plat === 'tiktok' || lowercaseUrl.includes("tiktok.com");

          if (isAppStore) {
            return { name: "App Store", platform: "appstore" };
          }
          if (isGooglePlay) {
            return { name: "Google Play", platform: "googleplay" };
          }
          if (isTelegram) {
            return { name: "Telegram", platform: "telegram" };
          }
          if (isInstagram) {
            return { name: "Instagram", platform: "instagram" };
          }
          if (isFacebook) {
            return { name: "Facebook", platform: "facebook" };
          }
          if (isYoutube) {
            return { name: "YouTube", platform: "youtube" };
          }
          if (isTiktok) {
            return { name: "TikTok", platform: "tiktok" };
          }
          return { name: "Website", platform: "website" };
        };

        let footerStyle: React.CSSProperties = {};
        if (footer.bgType === "color") {
          footerStyle = { backgroundColor: footer.bgValue };
        } else if (footer.bgType === "gradient") {
          footerStyle = { backgroundImage: footer.bgValue };
        } else if (footer.bgType === "image") {
          footerStyle = { backgroundImage: `url(${footer.bgValue})`, backgroundSize: "cover", backgroundPosition: "center" };
        }

        const showFooter = footer.showFooter !== false;
        if (!showFooter) return null;

        return (
          <footer 
            style={footerStyle}
            className="mt-16 rounded-t-[40px] text-white p-8 md:p-12 relative overflow-hidden shadow-2xl border-t border-zinc-200/10"
          >
            {footer.bgType === "image" && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs -z-10" />
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 relative z-10">
              {/* Brand and Description */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={footer.logoUrl || state.config.logoUrl}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full border-2 border-amber-500/50 shadow-lg object-cover"
                  />
                  <div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
                      {dT(footer.restaurantName)}
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-amber-500 font-extrabold">DIGITAL MENU</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                  {dT(footer.restaurantDesc)}
                </p>
              </div>

              {/* Dynamic Pages Link Column */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-500 mb-4 font-mono">
                  Sahifalar
                </h3>
                <ul className="space-y-2.5">
                  {footer.links?.map((link) => (
                    <li key={link.id}>
                      <a 
                        href={link.url}
                        onClick={(e) => {
                          const handled = handleCustomUrlAction(link.url, e);
                          if (handled) return;
                          
                          if (link.url === "#about" || link.url?.includes("about")) {
                            e.preventDefault();
                            onPanelChange("about");
                          }
                        }}
                        className="text-sm text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 font-semibold"
                      >
                        <span className="text-amber-500">▪</span> {dT(link.name)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information Column */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-500 mb-4 font-mono">
                  Bog'lanish
                </h3>
                <div className="space-y-3">
                  {footer.phone && (
                    <div className="flex items-center gap-3 text-sm text-zinc-300 font-semibold">
                      <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{footer.phone}</span>
                    </div>
                  )}
                  {footer.email && (
                    <div className="flex items-center gap-3 text-sm text-zinc-300 font-semibold">
                      <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{footer.email}</span>
                    </div>
                  )}
                  {footer.address && (
                    <div className="flex items-start gap-3 text-sm text-zinc-300 font-semibold leading-snug">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{dT(footer.address)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Socials Column */}
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-500 mb-4 font-mono">
                  Ijtimoiy Tarmoqlar
                </h3>
                <div className="flex flex-col gap-3">
                  {footer.socials?.map((social) => {
                    const info = getSocialPlatformInfo(social.url);
                    const SocIcon = info.icon;
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-white transition-colors font-semibold group"
                      >
                        <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-amber-500/30 transition-all">
                          <SocIcon className="w-4 h-4 text-amber-500" />
                        </span>
                        <span>{info.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Our Apps Column / Bottom row */}
            {footer.apps && footer.apps.length > 0 && (
              <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col text-center sm:text-left gap-1">
                  <span className="text-xs uppercase tracking-widest text-amber-500 font-black">Bizning Ilovalar</span>
                  <span className="text-xs text-zinc-400">Bizning mobil ilovalarni bepul yuklab oling</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  {footer.apps.map((app) => {
                    const info = getAppPlatformInfo(app.url, app.platform);
                    if (info.platform === "appstore") {
                      return (
                        <a
                          key={app.id}
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-md transition-all active:scale-95 group shrink-0"
                        >
                          <span className="text-2xl"></span>
                          <div className="flex flex-col text-left">
                            <span className="text-[7px] uppercase font-bold text-zinc-400 tracking-wider">Download on the</span>
                            <span className="text-xs font-black leading-tight">App Store</span>
                          </div>
                        </a>
                      );
                    }
                    if (info.platform === "googleplay") {
                      return (
                        <a
                          key={app.id}
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-md transition-all active:scale-95 group shrink-0"
                        >
                          <span className="text-lg">▶️</span>
                          <div className="flex flex-col text-left">
                            <span className="text-[7px] uppercase font-bold text-zinc-400 tracking-wider">GET IT ON</span>
                            <span className="text-xs font-black leading-tight">Google Play</span>
                          </div>
                        </a>
                      );
                    }
                    
                    const IconComponent = info.platform === "telegram" ? Send : info.platform === "instagram" ? Instagram : info.platform === "facebook" ? Facebook : info.platform === "youtube" ? Youtube : info.platform === "tiktok" ? Music : Globe;
                    return (
                      <a
                        key={app.id}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl shadow-md transition-all active:scale-95 text-left shrink-0"
                      >
                        <IconComponent className="w-4 h-4 text-amber-500" />
                        <div className="flex flex-col">
                          <span className="text-[7px] uppercase font-bold text-zinc-400 tracking-wider">Open app</span>
                          <span className="text-xs font-black leading-tight">{info.name}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom copyright details */}
            <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs text-zinc-400 font-medium relative z-10">
              {footer.copyrightText}
            </div>
          </footer>
        );
      })()}

      {/* OSHXONAMIZ YO'RIQNOMASI (KITCHEN GUIDE) MODAL */}
      {showGuide && (() => {
        const curLang = state.config.activeLang || "uz";
        const guide = KITCHEN_GUIDE_DATA[curLang] || KITCHEN_GUIDE_DATA["uz"];
        
        const getIconComponent = (iconName: string) => {
          switch (iconName) {
            case "UserX": return <UserX className="w-5 h-5 text-amber-500" />;
            case "ShoppingCart": return <ShoppingCart className="w-5 h-5 text-amber-500" />;
            case "Truck": return <Truck className="w-5 h-5 text-amber-500" />;
            case "CreditCard": return <CreditCard className="w-5 h-5 text-amber-500" />;
            case "Volume2": return <Volume2 className="w-5 h-5 text-amber-500" />;
            case "MessageSquare": return <MessageSquare className="w-5 h-5 text-amber-500" />;
            case "Languages": return <Languages className="w-5 h-5 text-amber-500" />;
            case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-amber-500" />;
            default: return <BookOpen className="w-5 h-5 text-amber-500" />;
          }
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-amber-500/10 dark:bg-amber-500/5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📖</span>
                  <div>
                    <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-wide">
                      {guide.title}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {guide.subtitle.replace("Lazzat CRM", (state.config as any).logoText || state.footer?.restaurantName || "Lazzat CRM")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl flex gap-3 items-start transition-all hover:shadow-xs"
                    >
                      <div className="p-2 bg-amber-500/10 rounded-xl shrink-0">
                        {getIconComponent(sec.icon)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                          {sec.title}
                        </h4>
                        <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
                          {sec.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-end">
                <button
                  onClick={() => setShowGuide(false)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all font-bold"
                >
                  {guide.closeBtn}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* POPUP AD MODAL */}
      <AnimatePresence>
        {showPopupAd && popupAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Close Button overlay */}
              <button
                onClick={() => {
                  setShowPopupAd(false);
                  try {
                    sessionStorage.setItem(`popup_ad_closed_${popupAd.id}`, "true");
                  } catch (e) {}
                }}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Advertisement Image or Video or Gif content */}
              <div className="relative flex-1 overflow-hidden min-h-[250px] bg-black">
                <a
                  href={popupAd.linkUrl || "#"}
                  target={popupAd.linkUrl ? "_blank" : undefined}
                  rel={popupAd.linkUrl ? "noopener noreferrer" : undefined}
                  className="block w-full h-full"
                >
                  {popupAd.type === "video" ? (
                    <video
                      src={popupAd.contentUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={popupAd.contentUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000"}
                      alt={popupAd.title || "Popup Ad"}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover max-h-[50vh]"
                    />
                  )}
                </a>

                {/* Badge */}
                <span className="absolute top-4 left-4 z-20 bg-amber-500 text-black text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                  📢 REKLAMA
                </span>
              </div>

              {/* Bottom Footer block in Popup Ad */}
              <div className="p-5 bg-zinc-950 border-t border-zinc-800 flex flex-col gap-3 text-center">
                {popupAd.title && (
                  <h3 className="text-base font-black text-amber-500 uppercase tracking-tight">
                    {popupAd.title}
                  </h3>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowPopupAd(false);
                      try {
                        sessionStorage.setItem(`popup_ad_closed_${popupAd.id}`, "true");
                      } catch (e) {}
                    }}
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Yopish
                  </button>
                  {popupAd.linkUrl && (
                    <a
                      href={popupAd.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-xs font-black transition-all text-center flex items-center justify-center"
                    >
                      Batafsil
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ (SAVOL-JAVOB) ACCORDION OVERLAY MODAL */}
      <AnimatePresence>
        {showFaq && (() => {
          const curLang = state.config.activeLang || "uz";
          const rawFaqList = (state as any).faq || [];
          
          // Sort items by order (if available) or index
          const sortedFaq = [...rawFaqList].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

          // Language-specific localized titles
          const titleMap: Record<string, string> = {
            uz: "❓ Savol-Javob",
            uz_cyr: "❓ Савол-Жавоб",
            ru: "❓ Вопросы и Ответы",
            en: "❓ Questions & Answers",
            de: "❓ Fragen & Antworten",
            fr: "❓ Questions & Réponses",
            it: "❓ Domande & Risposte"
          };

          const subtitleMap: Record<string, string> = {
            uz: "Tizim va kafemiz haqida eng ko'p beriladigan savollarga javoblar",
            uz_cyr: "Тизим ва кафемиз ҳақида энг кўп бериладиган саволларга жавоблар",
            ru: "Ответы на часто задаваемые вопросы о нашей системе и кафе",
            en: "Answers to frequently asked questions about our system and cafe",
            de: "Antworten auf häufig gestellte Fragen zu unserem System und Café",
            fr: "Réponses aux questions fréquemment posées sur notre système et notre café",
            it: "Risposte alle domande più frequenti sul nostro sistema e sul locale"
          };

          const emptyMap: Record<string, string> = {
            uz: "Hozircha hech qanday savol-javob kiritilmagan.",
            uz_cyr: "Ҳозирча ҳеч қандай савол-жавоб киритилмаган.",
            ru: "На данный момент вопросы и ответы отсутствуют.",
            en: "No questions and answers have been entered yet.",
            de: "Es wurden noch keine Fragen und Antworten eingegeben.",
            fr: "Aucune question et réponse n'a été saisie pour le moment.",
            it: "Non sono ancora state inserite domande e risposte."
          };

          const searchPlaceholderMap: Record<string, string> = {
            uz: "Savollarni izlash...",
            uz_cyr: "Саволларни излаш...",
            ru: "Поиск вопросов...",
            en: "Search questions...",
            de: "Fragen suchen...",
            fr: "Rechercher des questions...",
            it: "Cerca domande..."
          };

          // Filter FAQs based on search query
          const filteredFaq = sortedFaq.filter((item: any) => {
            const qText = (item.question[curLang] || item.question["uz"] || "").toLowerCase();
            const aText = (item.answer[curLang] || item.answer["uz"] || "").toLowerCase();
            const search = faqSearchQuery.toLowerCase();
            return qText.includes(search) || aText.includes(search);
          });

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between bg-amber-500/10 dark:bg-amber-500/5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">❓</span>
                    <div>
                      <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-wide">
                        {titleMap[curLang] || titleMap["uz"]}
                      </h3>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {subtitleMap[curLang] || subtitleMap["uz"]}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowFaq(false);
                      setFaqSearchQuery("");
                    }}
                    className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/10">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400 dark:text-zinc-500">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder={searchPlaceholderMap[curLang] || "Savollarni izlash..."}
                      value={faqSearchQuery}
                      onChange={(e) => setFaqSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs transition-all"
                    />
                    {faqSearchQuery && (
                      <button
                        onClick={() => setFaqSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Accordion List Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/20">
                  {filteredFaq.length > 0 ? (
                    filteredFaq.map((item: any) => {
                      const isOpen = !!openFaqIds[item.id];
                      const question = item.question[curLang] || item.question["uz"] || "No question provided";
                      const answer = item.answer[curLang] || item.answer["uz"] || "No answer provided";
                      
                      return (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-2xl overflow-hidden transition-all shadow-xs hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-800"
                        >
                          {/* Accordion Trigger Header */}
                          <button
                            onClick={() => toggleFaqItem(item.id)}
                            className="w-full px-5 py-4 flex justify-between items-center text-left transition-all gap-4 select-none hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 cursor-pointer"
                          >
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-tight leading-snug">
                              {question}
                            </span>
                            <span className={`text-xs text-zinc-400 dark:text-zinc-500 font-mono transition-transform duration-300 transform ${isOpen ? 'rotate-180 text-amber-500 font-extrabold' : 'rotate-0'}`}>
                              ▼
                            </span>
                          </button>

                          {/* Accordion Expandable Content with smooth transition */}
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              isOpen ? "max-h-[500px] border-t border-zinc-50 dark:border-zinc-850" : "max-h-0"
                            }`}
                          >
                            <div className="px-5 py-4 bg-zinc-50/30 dark:bg-zinc-950/10">
                              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal whitespace-pre-line">
                                {answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                      <span className="text-3xl block mb-2">🔍</span>
                      {faqSearchQuery 
                        ? (curLang === 'uz' ? "Hech qanday natija topilmadi." : "Никаких результатов не найдено.") 
                        : (emptyMap[curLang] || emptyMap["uz"])}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-zinc-100 dark:border-zinc-850 flex justify-end bg-white dark:bg-zinc-950">
                  <button
                    onClick={() => {
                      setShowFaq(false);
                      setFaqSearchQuery("");
                    }}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
                  >
                    {curLang === "uz" ? "Yopish" : curLang === "ru" ? "Закрыть" : "Close"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
