"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const sliderImages = ["/gallery/photo1.jpeg", "/gallery/photo2.jpeg"];

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

            <Link href="/competitions">Competitions</Link>

            <Link href="/statistics">Statistics</Link>

            <Link href="/fixtures">Fixtures</Link>

            <Link href="/team">Team</Link>

            <Link href="/gallery">Gallery</Link>

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

            <Link href="/competitions" onClick={() => setMenuOpen(false)}>
              Competitions
            </Link>

            <Link href="/statistics" onClick={() => setMenuOpen(false)}>
              Statistics
            </Link>

            <Link href="/fixtures" onClick={() => setMenuOpen(false)}>
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

      {/* HERO SECTION */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden pt-24">

        {sliderImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#071a52]/55 via-[#071a52]/15 to-transparent" />

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

          <h2 className="mb-12 text-5xl font-extrabold">
            Club Areas
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">

            {/* COMPETITIONS */}
            <Link
              href="/competitions"
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-4 text-3xl font-bold">
                Competitions
              </h3>

              <p className="text-lg">
                View BTCL and VCTB competitions for 2026, 2025 and 2024.
              </p>
            </Link>

            {/* STATISTICS */}
            <Link
              href="/statistics"
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-4 text-3xl font-bold">
                Statistics
              </h3>

              <p className="text-lg">
                View detailed player batting, bowling and fielding statistics.
              </p>
            </Link>

            {/* FIXTURES */}
            <Link
              href="/fixtures"
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-4 text-3xl font-bold">
                Fixtures
              </h3>

              <p className="text-lg">
                View latest fixtures, results and upcoming matches.
              </p>
            </Link>

            {/* TEAM */}
            <Link
              href="/team"
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-4 text-3xl font-bold">
                Team
              </h3>

              <p className="text-lg">
                View team information, squad list and player profiles.
              </p>
            </Link>

            {/* GALLERY */}
            <Link
              href="/gallery"
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-4 text-3xl font-bold">
                Gallery
              </h3>

              <p className="text-lg">
                Match day photos and club memories.
              </p>
            </Link>

            {/* HALL OF FAME */}
            <Link
              href="/hall-of-fame"
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="mb-4 text-3xl font-bold">
                Hall of Fame
              </h3>

              <p className="text-lg">
                Top performers and club legends.
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

    <h2 className="mb-12 text-5xl font-extrabold">
      Sponsors
    </h2>

    <div className="grid gap-8 md:grid-cols-2">

      {/* KIWIKMART */}
      <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl transition hover:scale-105">

        <Image
          src="/sponsors/kiwikmart.png"
          alt="Kiwikmart"
          width={250}
          height={120}
          className="object-contain"
        />

      </div>

      {/* TWENTY20 */}
      <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl transition hover:scale-105">

        <Image
          src="/sponsors/twenty20.png"
          alt="Twenty20 Estates"
          width={250}
          height={120}
          className="object-contain"
        />

      </div>
 {/* Jatheesan LTD 3 */}
  <div className="rounded-3xl bg-white p-6 shadow-lg hover:scale-105 transition">
    <Image
      src="/sponsors/jatheesan.png"
      alt="Jatheesan Ltd"
      width={250}
      height={120}
      className="mx-auto object-contain"
    />
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

          <h2 className="text-5xl font-extrabold">
            Contact Us
          </h2>

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

              <p className="mt-4 text-lg">
                High Wycombe, UK
              </p>
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