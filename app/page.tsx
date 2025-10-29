"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";
import { useLanguage } from "@/contexts/LanguageContext";

const bebas_Neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

// ------------------ Header ------------------
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <nav className="mx-10 backdrop-blur-md bg-white/50 shadow-md rounded-xl px-6 py-3 flex items-center justify-between">
        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-lg text-gray-700 items-center font-bold">
          {["Accueil", "À propos", "Staff", "Projets", "Contact"].map((item, i) => (
            <li key={i} className={i !== 0 ? "border-l border-gray-300 pl-4" : ""}>
              <Link href={`#${item.toLowerCase().replace(" ", "")}`} className="hover:text-[#7c3b63] transition-colors duration-300">
                {item}
              </Link>
            </li>
          ))}
          <li className="border-l border-gray-300 pl-4">
            <Link href="/login">
              <button className="flex items-center bg-[#9b4b7c] hover:bg-[#7c3b63] text-white font-bold px-4 py-2 rounded-lg shadow-md transition duration-300">
                Faire un don
              </button>
            </Link>
          </li>
          <li className="relative border-l border-gray-300 pl-4">
            <button onClick={() => setLangOpen(!langOpen)} className="text-gray-700 hover:text-[#7c3b63] transition-colors duration-300">
              Français ▾
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md py-2 z-50">
                {["English", "Malagasy"].map((lang, i) => (
                  <button key={i} onClick={() => setLangOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Hamburger mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md rounded-xl mt-2 mx-10 p-4">
          <ul className="flex flex-col space-y-4 text-gray-700 font-semibold">
            {["Accueil", "À propos", "Staff", "Projets", "Contact"].map((item, i) => (
              <li key={i}>
                <Link href={`#${item.toLowerCase().replace(" ", "")}`} onClick={() => setIsOpen(false)}>
                  {item}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login">
                <button className="flex items-center bg-[#9b4b7c] hover:bg-[#7c3b63] cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300">
                  Faire un don
                </button>
              </Link>
            </li>
            <li>
              <button onClick={() => setLangOpen(!langOpen)} className="text-gray-700 hover:text-[#7c3b63] transition-colors duration-300">
                Français ▾
              </button>
              {langOpen && (
                <div className="mt-2 bg-white shadow-md rounded-md py-2">
                  {["English", "Malagasy"].map((lang, i) => (
                    <button key={i} onClick={() => setLangOpen(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
      )}

      <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="absolute top-3 left-6"/>
    </header>
  );
};

// ------------------ Scroll Missile ------------------
const ScrollMissile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
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
    <div className={`fixed bottom-8 right-8 z-50 cursor-pointer transition-all duration-500 ${isScrolling ? "transform translate-y-[-20px]" : "hover:scale-110"}`} onClick={scrollToTop}>
      <div className="w-14 h-14 bg-gradient-to-r from-[#2596be] to-[#9b4b7c] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <div className={`transform transition-all duration-300 ${isScrolling ? "rotate-[-45deg] translate-y-[-5px]" : "animate-bounce"}`}>
          <svg width="33" height="33" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 3L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 17L8 21L16 21L14 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 rounded-full bg-[#2596be] opacity-20 animate-ping -z-10"></div>
    </div>
  );
};

// ------------------ Page principale ------------------
export default function Page() {
  const { lang } = useLanguage();
  const [showVideo, setShowVideo] = useState(true);

  const translations = {
    fr: {
      title: "ONG Ndao Hifanosika",
      subtitle: "Nous croyons que chaque jeune, chaque enfant et chaque femme a le potentiel de transformer son avenir. Notre ONG accompagne les entrepreneurs, forme les leaders de demain et soutient les initiatives locales pour bâtir un avenir durable à Madagascar.",
      donate: "Faire un don",
      learnMore: "En savoir plus",
    },
    en: {
      title: "NGO Ndao Hifanosika",
      subtitle: "We believe that every young person, every child, and every woman has the potential to transform their future. Our NGO supports entrepreneurs, trains tomorrow's leaders, and promotes local initiatives to build a sustainable future in Madagascar.",
      donate: "Donate",
      learnMore: "Learn More",
    },
    mg: {
      title: "ONG Ndao Hifanosika",
      subtitle: "Mino izahay fa manana fahafahana hanova ny hoaviny ny tanora, ny ankizy ary ny vehivavy tsirairay. Manohana ireo mpandraharaha ny fikambananay, manofana mpitarika rahampitso ary manampy ny hetsika ifotony mba hananganana ho avy maharitra eto Madagasikara.",
      donate: "Fanomezana",
      learnMore: "Hamantatra bebe kokoa",
    },
  };

  const t = translations[lang as keyof typeof translations];

  // Splash vidéo
  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showVideo) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
        <video src="/Logo-1-[remix] (1).mp4" autoPlay muted playsInline className="w-full h-full object-cover"/>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Header />
      <ScrollMissile />

      {/* Section Home */}
      <section id="home" className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 overflow-visible">
        <div className="relative z-10 max-w-xl space-y-6 text-center md:text-left">
          <h1 className={`mt-20 text-7xl md:text-9xl font-bold text-black tracking-wider ${bebas_Neue.className} animate-slide-left drop-shadow-[0_6px_4px_rgba(0,0,0,0.5)]`}>
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

        {/* Images décoratives */}
       {/* Images décoratives */}
<div className="relative z-10 hidden md:block w-[500px] h-[500px] mt-12 md:mt-0">
  <Image
    src="/Design_sans_titre_1_-removebg-preview.PNG"
    alt="Photo 1"
    width={230}
    height={230}
    className="absolute -top-16 left-[65%] -translate-x-1/2 w-[170px] md:w-[230px] h-auto z-30 rounded-lg animate-fade-in"
    priority
  />
  <Image
    src="/Design sans titre(8).PNG"
    alt="Photo 2"
    width={350}
    height={350}
    className="absolute top-28 left-[36%] -translate-x-1/2 w-[280px] md:w-[350px] h-auto z-20 rounded-lg animate-fade-in"
    priority
  />
  <Image
    src="/Design_sans_titre_6_-removebg-preview.png"
    alt="Photo 3"
    width={220}
    height={220}
    className="absolute top-16 left-[100%] -translate-x-1/2 w-[180px] md:w-[220px] h-auto z-30 rounded-lg animate-fade-in"
    priority
  />
  <Image
    src="/Design_sans_titre_9_-removebg-preview.PNG"
    alt="Photo 4"
    width={220}
    height={220}
    className="absolute top-[67%] left-[106%] -translate-x-1/2 w-[180px] md:w-[220px] h-auto z-30 rounded-lg animate-fade-in"
    priority
  />
  <Image
    src="/Design_sans_titre_10_-removebg-preview.png"
    alt="Photo 5"
    width={239}
    height={239}
    className="absolute top-[106%] left-[71%] -translate-x-1/2 w-[180px] md:w-[239px] h-auto z-30 rounded-lg animate-fade-in"
    priority
  />
</div>

      </section>

    </div>
  );
}
