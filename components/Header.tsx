"use client";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const translations = {
    fr: { home: "Accueil", about: "À propos", staff: "Témoignages", projects: "Réalisations", news: "Actualités", contact: "Contact", connecter:"Se connecter", donate:"Faire un don", langLabel:"Français", flag:"🇫🇷" },
    en: { home: "Home", about: "About", staff: "Testimonials", projects: "Projects", news: "News", contact: "Contact", connecter:"Log in", donate:"Donate", langLabel:"English", flag:"🇬🇧" },
    mg: { home: "Fandraisana", about:"Momban’ny", staff:"Vavolombelona", projects:"Tetikasa", news:"Vaovao", contact:"Fifandraisana", connecter:"Hiditra", donate:"Fanomezana", langLabel:"Malagasy", flag:"🇲🇬" },
  };

  const t = translations[lang];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <img src="/logoremove.png" alt="Logo" className="h-14 w-auto" />
          </Link>
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 items-center font-semibold text-gray-700">
          {["home","about","staff","projects","news","contact"].map((key) => (
            <li key={key}>
              <Link href={`#${key}`} className="hover:text-[#7c3b63] transition-colors duration-300">
                {t[key as keyof typeof t]}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/login">
              <button className="bg-white text-[#9b4b7c] border border-[#9b4b7c] px-4 py-2 rounded-lg hover:bg-[#7c3b63] hover:text-white transition">
                {t.connecter}
              </button>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <button className="bg-[#9b4b7c] text-white px-4 py-2 rounded-lg hover:bg-[#7c3b63] transition">
                {t.donate}
              </button>
            </Link>
          </li>
          <li className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="px-2 py-1 hover:text-[#7c3b63] transition">
              {t.flag} ▾
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-20 bg-white shadow-md rounded-md py-1 z-50">
                {(["fr","en","mg"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); setIsOpen(false); }}
                    className="block w-full text-center px-2 py-1 hover:bg-gray-100"
                  >
                    {translations[l].flag} {translations[l].langLabel}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md p-4 mx-4 rounded-lg">
          <ul className="flex flex-col space-y-3 font-semibold text-gray-700">
            {["home","about","staff","projects","news","contact"].map((key) => (
              <li key={key}>
                <Link href={`#${key}`} onClick={() => setIsOpen(false)}>
                  {t[key as keyof typeof t]}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login">
                <button className="w-full bg-[#9b4b7c] text-white px-4 py-2 rounded-lg hover:bg-[#7c3b63] transition">{t.donate}</button>
              </Link>
            </li>
            <li>
              {/* Sélecteur langue mobile */}
              <button onClick={() => setLangOpen(!langOpen)} className="px-2 py-1 hover:text-[#7c3b63] transition">{t.langLabel} ▾</button>
              {langOpen && (
                <div className="mt-2 bg-white shadow-md rounded-md py-1">
                  {(["fr","en","mg"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); setIsOpen(false); }}
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                    >
                      {translations[l].flag} {translations[l].langLabel}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
