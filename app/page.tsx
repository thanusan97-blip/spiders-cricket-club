"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const sliderImages = [
  "/gallery/photo1.jpeg",
  "/gallery/photo2.jpeg",
];

const fixtures = [
  {
    date: "Sunday 24 May 2026",
    opponent: "A9 CC - 1st XI",
    venue: "Joseph Hood Recreation Ground, Morden",
    time: "13:00",
  },
  {
    date: "Sunday 31 May 2026",
    opponent: "Yarl Gents CC - 1st XI",
    venue: "Old Haberdashers' RFC",
    time: "13:00",
  },
  {
    date: "Sunday 07 June 2026",
    opponent: "Kent United CC - 2nd XI",
    venue: "Richard Challoner School",
    time: "13:00",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">
      {/* TOP BAR */}
      <header className="fixed top-0 z-50 w-full bg-[#3b82f6] shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Spiders Logo"
              width={70}
              height={70}
              className="rounded-full"
            />

            <div>
              <h1 className="text-xl font-bold text-white md:text-3xl">
                Spiders Sports Club UK
              </h1>

              <p className="text-sm text-white">
                Cricket Club • High Wycombe
              </p>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden items-center gap-8 font-semibold text-white md:flex">
            <a href="/">Home</a>
            <Link href="/competitions">Competitions</Link>
            <Link href="/statistics">Statistics</Link>
            <Link href="/fixtures">Fixtures</Link>
            <Link href="/team">Team</Link>
            <Link href="/gallery">Gallery</Link>
            <a href="#sponsors">Sponsors</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            className="text-4xl text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="flex flex-col gap-4 bg-[#2563eb] px-6 py-6 text-lg font-semibold text-white md:hidden">
            <a href="/" onClick={() => setMenuOpen(false)}>
              Home
            </a>

            <Link
              href="/competitions"
              onClick={() => setMenuOpen(false)}
            >
              Competitions
            </Link>

            <Link
              href="/statistics"
              onClick={() => setMenuOpen(false)}
            >
              Statistics
            </Link>

            <Link
              href="/fixtures"
              onClick={() => setMenuOpen(false)}
            >
              Fixtures
            </Link>

            <Link href="/team" onClick={() => setMenuOpen(false)}>
              Team
            </Link>

            <Link href="/gallery" onClick={() => setMenuOpen(false)}>
              Gallery
            </Link>

            <a href="#sponsors" onClick={() => setMenuOpen(false)}>
              Sponsors
            </a>

            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </div>
        )}
      </header>

      {/* HERO SLIDER */}
      <section className="relative mt-[102px] h-[75vh] overflow-hidden">
        <Image
          src={sliderImages[currentImage]}
          alt="Club Image"
          fill
          priority
          className="object-cover transition-all duration-1000"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <h2 className="max-w-5xl text-5xl font-extrabold md:text-7xl">
            WELCOME TO
            <br />
            SPIDERS SPORTS CLUB UK
          </h2>

          <p className="mt-6 max-w-3xl text-lg md:text-2xl">
            A friendly and competitive cricket club welcoming players,
            supporters and sponsors.
          </p>

          <a
            href="#club"
            className="mt-8 border-4 border-white px-10 py-4 text-2xl font-bold transition hover:bg-white hover:text-[#071a52]"
          >
            EXPLORE CLUB
          </a>
        </div>
      </section>

      {/* CLUB AREAS */}
      <section id="club" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-14 text-5xl font-extrabold md:text-6xl">
            Club Areas
          </h2>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-5">
            {/* COMPETITIONS */}
            <Link
              href="/competitions"
              className="rounded-3xl bg-white p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-5 text-3xl font-bold">Competitions</h3>

              <p className="text-lg leading-8">
                View BTCL and VCTB competitions for 2026, 2025 and 2024.
              </p>
            </Link>

            {/* STATISTICS */}
            <Link
              href="/statistics"
              className="rounded-3xl bg-white p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-5 text-3xl font-bold">Statistics</h3>

              <p className="text-lg leading-8">
                View detailed player batting, bowling and fielding statistics.
              </p>
            </Link>

            {/* FIXTURES */}
            <Link
              href="/fixtures"
              className="rounded-3xl bg-white p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-5 text-3xl font-bold">Fixtures</h3>

              <div className="space-y-5">
                {fixtures.map((fixture, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-[#eef2ff] p-4"
                  >
                    <p className="font-bold">{fixture.date}</p>

                    <p className="mt-2 text-sm">
                      vs {fixture.opponent}
                    </p>

                    <p className="text-sm">{fixture.venue}</p>

                    <p className="mt-1 text-sm font-semibold">
                      {fixture.time}
                    </p>
                  </div>
                ))}
              </div>
            </Link>

            {/* TEAM */}
            <Link
              href="/team"
              className="rounded-3xl bg-white p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-5 text-3xl font-bold">Team</h3>

              <p className="text-lg leading-8">
                View team information, squad list and player profiles.
              </p>
            </Link>

            {/* GALLERY */}
            <Link
              href="/gallery"
              className="rounded-3xl bg-white p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-5 text-3xl font-bold">Gallery</h3>

              <p className="text-lg leading-8">
                Match day photos and club memories.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section
        id="sponsors"
        className="bg-[#071a52] px-6 py-24 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-14 text-5xl font-extrabold">Sponsors</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl">
              <Image
                src="/sponsors/kiwikmart.png"
                alt="Kiwikmart"
                width={260}
                height={120}
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl">
              <Image
                src="/sponsors/twenty20estates.png"
                alt="Twenty20 Estates"
                width={260}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-5xl font-extrabold">
            Contact Us
          </h2>

          <p className="text-xl leading-9">
            Interested in joining Spiders Sports Club UK or sponsoring
            the club?
          </p>

          <div className="mt-10 space-y-4 text-xl">
            <p>📧 spiderssportsclubuk@gmail.com</p>
            <p>📍 High Wycombe, United Kingdom</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071a52] px-6 py-10 text-center text-white">
        <div className="mb-6 flex justify-center gap-6 text-3xl">
          <a href="#">📘</a>
          <a href="#">📸</a>
          <a href="#">▶️</a>
          <a href="#">💬</a>
        </div>

        <p className="text-lg">
          © 2026 Spiders Sports Club UK. All Rights Reserved.
        </p>
      </footer>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://wa.me/447000000000"
        target="_blank"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-4xl text-white shadow-2xl transition hover:scale-110"
      >
        💬
      </a>
    </main>
  );
}