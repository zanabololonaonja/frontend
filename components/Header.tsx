"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
type Language = "fr" | "en" | "mg";

const languages: Language[] = ["fr", "en", "mg"];

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
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-4 md:mx-10 backdrop-blur-md bg-white/70 shadow-md rounded-xl px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logoremove.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center space-x-4 font-bold text-gray-700 text-lg">
          {[
            { label: t.home, href: "#home" },
            { label: t.about, href: "#about" },
            { label: t.staff, href: "#staff" },
            { label: t.projects, href: "#projects" },
            { label: t.news, href: "/actualites" },
            { label: t.contact, href: "#contact" },
          ].map((item, i) => (
            <li key={i} className={i !== 0 ? "border-l border-gray-300 pl-4" : ""}>
              <Link
                href={item.href}
                className="hover:text-[#7c3b63] transition-colors duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li className="border-l border-gray-300 pl-4">
            <Link href="/login">
              <button className="bg-white hover:bg-[#f3e5f0] text-[#9b4b7c] font-bold px-4 py-2 rounded-lg shadow-md transition duration-300">
                {t.connecter}
              </button>
            </Link>
          </li>

          <li className="border-l border-gray-300 pl-4">
            <Link href="/login">
              <button className="bg-[#9b4b7c] hover:bg-[#7c3b63] text-white font-bold px-4 py-2 rounded-lg shadow-md transition duration-300">
                {t.donate}
              </button>
            </Link>
          </li>

          {/* Sélecteur de langue */}
          <li className="relative border-l border-gray-300 pl-4">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="text-gray-700 hover:text-[#7c3b63] transition-colors duration-300"
            >
              {t.flag} ▾
            </button>

           {langOpen && (
  <div className="mt-2 bg-white shadow-md rounded-md py-2">
    {languages.map((l) => (
      <button
        key={l}
        onClick={() => {
          setLang(l);        // OK, l est Language
          setLangOpen(false);
          setIsOpen(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        {translations[l].flag} {translations[l].langLabel}  {/* OK, l est Language */}
      </button>
    ))}
  </div>
)}
          </li>
        </ul>

        {/* Hamburger Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-md rounded-xl mt-2 mx-4 p-4">
          <ul className="flex flex-col space-y-4 text-gray-700 font-semibold">
            {[
              { label: t.home, href: "#home" },
              { label: t.about, href: "#about" },
              { label: t.staff, href: "#staff" },
              { label: t.projects, href: "#projects" },
              { label: t.news, href: "/actualites" },
              { label: t.contact, href: "#contact" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li>
              <Link href="/login">
                <button className="bg-white hover:bg-[#f3e5f0] text-[#9b4b7c] font-bold px-4 py-2 rounded-lg shadow-md w-full">
                  {t.connecter}
                </button>
              </Link>
            </li>

            <li>
              <Link href="/login">
                <button className="bg-[#9b4b7c] hover:bg-[#7c3b63] text-white font-bold px-4 py-2 rounded-lg shadow-md w-full">
                  {t.donate}
                </button>
              </Link>
            </li>

            <li>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-full text-left text-gray-700 hover:text-[#7c3b63] transition-colors duration-300"
              >
                {t.langLabel} ▾
              </button>

              {langOpen && (
  <div className="mt-2 bg-white shadow-md rounded-md py-2">
    {languages.map((l) => (
      <button
        key={l}
        onClick={() => {
          setLang(l);        // OK, l est Language
          setLangOpen(false);
          setIsOpen(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        {translations[l].flag} {translations[l].langLabel}  {/* OK, l est Language */}
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
