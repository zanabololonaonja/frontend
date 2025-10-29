"use client";

import Link from "next/link";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas_Neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Section Home */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 overflow-visible">
        <div className="relative z-10 max-w-xl space-y-6 text-center md:text-left">
          <h1
            className={`mt-20 text-6xl md:text-9xl font-bold text-black tracking-wider ${bebas_Neue.className}`}
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
            className="absolute -top-[17px] left-[65px] rounded-lg"
          />
          <Image
            src="/Design sans titre(8).PNG"
            alt="Photo 2"
            width={350}
            height={350}
            className="absolute top-[28px] left-[36px] rounded-lg"
          />
          <Image
            src="/Design_sans_titre_6_-removebg-preview.png"
            alt="Photo 3"
            width={220}
            height={220}
            className="absolute top-[15px] left-[100px] rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
