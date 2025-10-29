"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import { useLanguage } from "@/contexts/LanguageContext";

const bebas_Neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

// Définir le type des langues
type Lang = "fr" | "en" | "mg";

// Composant ScrollMissile
const ScrollMissile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsScrolling(false), 1000);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 cursor-pointer transition-all duration-500 ${
        isScrolling ? "transform translate-y-[-20px]" : "hover:scale-110"
      }`}
      onClick={scrollToTop}
    >
      <div className="w-14 h-14 bg-gradient-to-r from-[#2596be] to-[#9b4b7c] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <div
          className={`transform transition-all duration-300 ${
            isScrolling ? "rotate-[-45deg] translate-y-[-5px]" : "animate-bounce"
          }`}
        >
          <svg width="33" height="33" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 3L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 17L8 21L16 21L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 rounded-full bg-[#2596be] opacity-20 animate-ping -z-10"></div>
    </div>
  );
};

export default function Page() {
  const { lang } = useLanguage(); // lang doit être 'fr' | 'en' | 'mg'
  const [showVideo, setShowVideo] = useState(true);

  const translations: Record<Lang, { title: string; subtitle: string; donate: string; learnMore: string }> = {
    fr: {
      title: "ONG Ndao Hifanosika",
      subtitle:
        "Nous croyons que chaque jeune, chaque enfant et chaque femme a le potentiel de transformer son avenir. Notre ONG accompagne les entrepreneurs, forme les leaders de demain et soutient les initiatives locales pour bâtir un avenir durable à Madagascar.",
      donate: "Faire un don",
      learnMore: "En savoir plus",
    },
    en: {
      title: "NGO Ndao Hifanosika",
      subtitle:
        "We believe that every young person, every child, and every woman has the potential to transform their future. Our NGO supports entrepreneurs, trains tomorrow's leaders, and promotes local initiatives to build a sustainable future in Madagascar.",
      donate: "Donate",
      learnMore: "Learn More",
    },
    mg: {
      title: "ONG Ndao Hifanosika",
      subtitle:
        "Mino izahay fa manana fahafahana hanova ny hoaviny ny tanora, ny ankizy ary ny vehivavy tsirairay. Manohana ireo mpandraharaha ny fikambananay, manofana mpitarika rahampitso ary manampy ny hetsika ifotony mba hananganana ho avy maharitra eto Madagasikara.",
      donate: "Fanomezana",
      learnMore: "Hamantatra bebe kokoa",
    },
  };

  // Forcer TypeScript à accepter lang comme Lang
  const t = translations[(lang as Lang) || "fr"];

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showVideo) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
        <video src="/Logo-1-[remix] (1).mp4" autoPlay muted playsInline className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Header />
      <ScrollMissile />

      <section id="home" className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 overflow-visible">
        <div className="relative z-10 max-w-xl space-y-6 text-center md:text-left">
          <h1 className={`mt-20 text-9xl md:text-9xl font-bold text-black tracking-wider ${bebas_Neue.className} animate-slide-left drop-shadow-[0_6px_4px_rgba(0,0,0,0.5)]`}>
            {t.title}
          </h1>
          <p className="text-lg md:text-xl font-cinzel text-black -mt-7 animate-slide-left-delay-1">{t.subtitle}</p>
          <div className="flex justify-center md:justify-start space-x-4 animate-slide-left-delay-2">
            <Link href="/login">
              <button className="bg-[#9b4b7c] hover:bg-[#7c3b63] text-white font-semibold px-6 py-3 rounded-3xl">{t.donate}</button>
            </Link>
            <Link href="#about">
              <button className="bg-[#2596be] hover:bg-[#1e7ea1] text-white font-semibold px-6 py-3 rounded-3xl">{t.learnMore}</button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 hidden md:block w-[500px] h-[500px] mt-12 md:mt-0">
          <img src="/Design_sans_titre_1_-removebg-preview.PNG" alt="Photo 1" className="absolute -top-17 left-65 -translate-x-1/2 w-[170px] md:w-[230px] h-auto z-30 rounded-lg animate-fade-in" />
          <img src="/Design sans titre(8).PNG" alt="Photo 2" className="absolute top-28 left-36 -translate-x-1/2 w-[280px] md:w-[350px] h-auto z-20 rounded-lg animate-fade-in" />
          <img src="/Design_sans_titre_6_-removebg-preview.png" alt="Photo 3" className="absolute top-15 left-100 -translate-x-1/2 w-[180px] md:w-[220px] h-auto z-30 rounded-lg animate-fade-in" />
          <img src="/Design_sans_titre_9_-removebg-preview.PNG" alt="Photo 4" className="absolute top-67 left-106 -translate-x-1/2 w-[180px] md:w-[220px] h-auto z-30 rounded-lg" />
          <img src="/Design_sans_titre_10_-removebg-preview.png" alt="Photo 5" className="absolute top-106 left-71 -translate-x-1/2 w-[180px] md:w-[239px] h-auto z-30 rounded-lg" />
        </div>
      </section>
    </div>
  );
}
