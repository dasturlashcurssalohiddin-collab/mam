export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  rating: number;
  voiceText: string;
  hasDiscount?: boolean;
}

export interface Booklet {
  active: boolean;
  title: string;
  pages: string[];
}

export interface Config {
  theme: 'light' | 'dark';
  backgroundType: 'color' | 'image' | 'gif' | 'video';
  backgroundValue: string;
  foregroundColor: string;
  logoUrl: string;
  logoWidth: number;
  effectsEnabled: boolean;
  activeLang: string;
  lastUpdated?: number;
  staffPassword?: string;
  adminPassword?: string;
}

export interface LogEntry {
  id?: string;
  time: string;
  action?: string;
  type?: string;
  user?: string;
}

export interface Stats {
  totalVisits: number;
  activeUsers: number;
  hourlyVisits: number[];
  dailyVisits: number[];
  monthlyVisits: number[];
  yearlyVisits: number[];
  ordersLog: LogEntry[];
  visitsLog: LogEntry[];
  productsSold?: number;
  productViews?: any[];
}

export interface Ad {
  id: string;
  active: boolean;
  position: 'top' | 'bottom' | 'popup' | 'sidebar';
  type: 'image' | 'video' | 'gif';
  contentUrl: string;
  linkUrl: string;
  title?: string;
}

export interface Translations {
  welcome: string;
  menu: string;
  categories: string;
  search: string;
  settings: string;
  staffPanel: string;
  adminPanel: string;
  darkLight: string;
  details: string;
  stock: string;
  price: string;
  listen: string;
  exchange: string;
  add: string;
  delete: string;
  save: string;
  stats: string;
  logs: string;
  visitorStats: string;
  adSpace: string;
  password: string;
  enter: string;
  backToMenu: string;
  close: string;
}

export interface NavbarLink {
  id: string;
  name: string;
  url: string;
  order: number;
  visible: boolean;
}

export interface FaqItem {
  id: string;
  question: Record<string, string>; // Record of language to question text, e.g. { "uz": "...", "ru": "..." }
  answer: Record<string, string>;   // Record of language to answer text, e.g. { "uz": "...", "ru": "..." }
  order: number;
}

export interface CrmState {
  menu: MenuItem[];
  booklet: Booklet;
  config: Config;
  languages: string[];
  translations: Record<string, Translations>;
  stats: Stats;
  ads: Ad[];
  about?: AboutCafe;
  footer?: FooterConfig;
  sectionBackgrounds?: SectionBackgrounds;
  navbarLinks?: NavbarLink[];
  userProfiles?: Record<string, string>;
  faq?: FaqItem[];
}

export interface FooterLink {
  id: string;
  name: string;
  url: string;
}

export interface FooterSocial {
  id: string;
  platform: string;
  url: string;
}

export interface FooterApp {
  id: string;
  platform: 'appstore' | 'googleplay' | 'telegram' | 'website' | 'instagram' | 'facebook' | 'youtube' | 'tiktok';
  url: string;
}

export interface FooterConfig {
  restaurantName: string;
  restaurantDesc: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address: string;
  links: FooterLink[];
  socials: FooterSocial[];
  apps: FooterApp[];
  copyrightText: string;
  bgType: 'color' | 'gradient' | 'image';
  bgValue: string;
  showFooter?: boolean;
}

export interface SectionBg {
  bgType: 'color' | 'gradient' | 'image' | 'video' | 'gif';
  bgValue: string;
}

export interface SectionBackgrounds {
  hero: SectionBg;
  menu: SectionBg;
}

export interface AboutCafe {
  text: string;
  imageUrl: string;
  gifUrl: string;
  videoUrl: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  mapType?: 'embed' | 'coordinates' | 'address';
  mapEmbedLink?: string;
  gallery?: string[];
}

