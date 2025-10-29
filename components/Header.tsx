"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4">
      <nav className="flex justify-between items-center mx-10">
        {/* Logo */}
        <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full" />

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-bold">
          <li>
            <Link href="#home">Accueil</Link>
          </li>
          <li>
            <Link href="#about">À propos</Link>
          </li>
          <li>
            <Link href="#staff">Staff</Link>
          </li>
        </ul>

        {/* Hamburger mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>☰</button>
        </div>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-md mt-2 p-4">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link href="#home" onClick={() => setIsOpen(false)}>Accueil</Link>
            </li>
            <li>
              <Link href="#about" onClick={() => setIsOpen(false)}>À propos</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
