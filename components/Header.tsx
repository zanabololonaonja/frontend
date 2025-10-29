"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const translations = {
    fr: {
      home: "Accueil",
      about: "À propos",
      staff: "Témoignages",
      projects: "Réalisations",
      news: "Actualités",
      contact: "Contact",
      connecter: "Se connecter",
      donate: "Faire un don",
      langLabel: "Français",
      flag: "🇫🇷",
    },
    en: {
      home: "Home",
      about: "About",
      staff: "Testimonials",
      projects: "Projects",
      news: "News",
      contact: "Contact",
      connecter: "Log in",
      donate: "Donate",
      langLabel: "English",
      flag: "🇬🇧",
    },
    mg: {
      home: "Fandraisana",
      about: "Momban’ny",
      staff: "Vavolombelona",
      projects: "Tetikasa",
      news: "Vaovao",
      contact: "Fifandraisana",
      connecter: "Hiditra",
      donate: "Fanomezana",
      langLabel: "Malagasy",
      flag: "🇲🇬",
    },
  };

  const t = translations[lang];

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <nav className="mx-4 md:mx-10 backdrop-blur-md bg-white/50 shadow-md rounded-xl px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logoremove.png" alt="Logo" width={96} height={96} className="h-24"/>
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-4 text-lg text-gray-700 font-bold items-center">
          <li><Link href="#home" className="hover:text-[#7c3b63] transition-colors">{t.home}</Link></li>
          <li className="border-l border-gray-300 pl-4"><Link href="#about" className="hover:text-[#7c3b63] transition-colors">{t.about}</Link></li>
          <li className="border-l border-gray-300 pl-4"><Link href="#staff" className="hover:text-[#7c3b63] transition-colors">{t.staff}</Link></li>
          <li className="border-l border-gray-300 pl-4"><Link href="#projects" className="hover:text-[#7c3b63] transition-colors">{t.projects}</Link></li>
          <li className="border-l border-gray-300 pl-4"><Link href="/actualites" className="hover:text-[#7c3b63] transition-colors">{t.news}</Link></li>
          <li className="border-l border-gray-300 pl-4"><Link href="#contact" className="hover:text-[#7c3b63] transition-colors">{t.contact}</Link></li>

          <li className="border-l border-gray-300 pl-4">
            <Link href="/login">
              <button className="flex items-center hover:bg-[#7c3b63] cursor-pointer text-[#9b4b7c] font-bold px-4 py-2 rounded-lg shadow-md transition duration-300">{t.connecter}</button>
            </Link>
          </li>

          <li className="border-l border-gray-300 pl-4">
            <Link href="/login">
              <button className="flex items-center bg-[#9b4b7c] hover:bg-[#7c3b63] text-white font-bold px-4 py-2 rounded-lg shadow-md transition duration-300">{t.donate}</button>
            </Link>
          </li>

          {/* Sélecteur langue */}
          <li className="relative border-l border-gray-300 pl-4">
            <button onClick={() => setLangOpen(!langOpen)} className="text-gray-700 hover:text-[#7c3b63] transition-colors">{t.flag} ▾</button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-16 bg-white shadow-md rounded-md py-2 z-50">
                <button onClick={() => { setLang("fr"); setLangOpen(false); }} className="block w-full text-center py-2 hover:bg-gray-100">🇫🇷</button>
                <button onClick={() => { setLang("en"); setLangOpen(false); }} className="block w-full text-center py-2 hover:bg-gray-100">🇬🇧</button>
                <button onClick={() => { setLang("mg"); setLangOpen(false); }} className="block w-full text-center py-2 hover:bg-gray-100">🇲🇬</button>
              </div>
            )}
          </li>
        </ul>

        {/* Hamburger mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md rounded-xl mt-2 mx-4 p-4">
          <ul className="flex flex-col space-y-4 text-gray-700 font-semibold">
            {["home","about","staff","projects","contact"].map((id) => (
              <li key={id}>
                <Link href={`#${id}`} onClick={() => setIsOpen(false)}>{t[id as keyof typeof t]}</Link>
              </li>
            ))}
            <li>
              <Link href="/login">
                <button className="flex items-center bg-[#9b4b7c] hover:bg-[#7c3b63] text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300">{t.donate}</button>
              </Link>
            </li>
            <li>
              <button onClick={() => setLangOpen(!langOpen)} className="text-gray-700 hover:text-[#7c3b63] transition-colors">{t.langLabel} ▾</button>
              {langOpen && (
                <div className="mt-2 bg-white shadow-md rounded-md py-2">
                  <button onClick={() => { setLang("fr"); setLangOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Français</button>
                  <button onClick={() => { setLang("en"); setLangOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                  <button onClick={() => { setLang("mg"); setLangOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Malagasy</button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
