"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">
      {/* TOP BAR */}
      <header className="fixed top-0 z-50 w-full bg-[#3b82f6] shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* LOGO */}
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
            <a href="#club">Competitions</a>
            <a href="#club">Statistics</a>
            <a href="#club">Gallery</a>
            <a href="#sponsors">Sponsors</a>
            <a href="#contact">Contact</a>
          </nav>

          {/* MOBILE BUTTON */}
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

            <a href="#club" onClick={() => setMenuOpen(false)}>
              Competitions
            </a>

            <a href="#club" onClick={() => setMenuOpen(false)}>
              Statistics
            </a>

            <a href="#club" onClick={() => setMenuOpen(false)}>
              Gallery
            </a>

            <a href="#sponsors" onClick={() => setMenuOpen(false)}>
              Sponsors
            </a>

            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        className="relative flex h-screen items-center justify-center bg-cover bg-center pt-24"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(7,26,82,0.55), rgba(7,26,82,0.15)), url('/gallery/photo2.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-5xl px-6 text-center text-white">
          <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-7xl">
            WELCOME TO <br />
            SPIDERS SPORTS CLUB UK
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg md:text-2xl">
            A friendly and competitive cricket club welcoming players,
            supporters and sponsors.
          </p>

          <a
            href="#club"
            className="border-4 border-white px-10 py-4 text-xl font-bold transition hover:bg-white hover:text-[#071a52]"
          >
            EXPLORE CLUB
          </a>
        </div>
      </section>

      {/* CLUB AREAS */}
      <section id="club" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-5xl font-extrabold">Club Areas</h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold">Competitions</h3>
              <p className="text-lg">
                View BTCL and VCTB competitions for 2026, 2025 and 2024.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold">Statistics</h3>
              <p className="text-lg">
                View detailed player batting, bowling and fielding statistics.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold">Gallery</h3>
              <p className="text-lg">
                Match day photos and club memories.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold">Hall of Fame</h3>
              <p className="text-lg">
                Top performers and club legends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section
        id="sponsors"
        className="bg-[#071a52] px-6 py-24 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-5xl font-extrabold">Sponsors</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-10 text-center text-4xl font-bold text-[#071a52] shadow-xl">
              KIWIKMART
            </div>

            <div className="rounded-3xl bg-white p-10 text-center text-4xl font-bold text-[#071a52] shadow-xl">
              Twenty 20 Estates
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-white px-6 py-24 text-[#071a52]"
      >
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-5xl font-extrabold">Contact Us</h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-600">
            Get in touch with Spiders Sports Club UK for matches,
            sponsorships, memberships and general enquiries.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-[#eef2ff] p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Email</h3>
              <p className="mt-4 text-lg">
                spiderssportsclubuk@gmail.com
              </p>
            </div>

            <div className="rounded-3xl bg-[#eef2ff] p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Location</h3>
              <p className="mt-4 text-lg">High Wycombe, UK</p>
            </div>

            <div className="rounded-3xl bg-[#eef2ff] p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Join Us</h3>
              <p className="mt-4 text-lg">
                Players and supporters are welcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04113a] px-6 py-8 text-center text-white">
        <p className="text-lg">
          © 2026 Spiders Sports Club UK. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}