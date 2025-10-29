"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";
import Header from "@/components/Header";

const bebas_Neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Page() {
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 2000); // durée du splash vidéo

    return () => clearTimeout(timer);
  }, []);

  if (showVideo) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
        <video
          src="/Logo-1-[remix] (1).mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Header />

      {/* Section Home */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 overflow-visible">
        <div className="relative z-10 max-w-xl space-y-6 text-center md:text-left">
          <h1
            className={`mt-20 text-6xl md:text-7xl font-bold text-black tracking-wider ${bebas_Neue.className}`}
          >
            ONG Ndao Hifanosika
          </h1>
          <p className="text-lg md:text-xl text-black -mt-4">
            Nous croyons que chaque jeune, chaque enfant et chaque femme a le potentiel
            de transformer son avenir.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <Link href="/login">
              <button className="bg-[#9b4b7c] hover:bg-[#7c3b63] text-white font-semibold px-6 py-3 rounded-3xl shadow-md transition duration-300">
                Faire un don
              </button>
            </Link>
            <Link href="#about">
              <button className="bg-[#2596be] hover:bg-[#1e7ea1] text-white font-semibold px-6 py-3 rounded-3xl shadow-md transition duration-300">
                En savoir plus
              </button>
            </Link>
          </div>
        </div>

        {/* Images */}
        <div className="relative z-10 hidden md:block w-[500px] h-[500px] mt-12 md:mt-0">
          <Image
            src="/Design_sans_titre_1_-removebg-preview.PNG"
            alt="Photo 1"
            width={230}
            height={230}
            className="absolute -top-16 left-16 w-[230px] rounded-lg"
          />
          <Image
            src="/Design sans titre(8).PNG"
            alt="Photo 3"
            width={350}
            height={350}
            className="absolute top-28 left-36 w-[350px] rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
