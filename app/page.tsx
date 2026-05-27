"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const sliderImages = ["/gallery/photo1.jpeg", "/gallery/photo2.jpeg"];

const clubAreas = [
  {
    title: "Competitions",
    text: "View BTCL and VCTB competitions for 2026, 2025 and 2024.",
    button: "Explore Competitions",
    icon: "🏆",
    link: "/competitions",
  },
  {
    title: "Statistics",
    text: "View detailed player batting, bowling and fielding statistics.",
    button: "View Statistics",
    icon: "📊",
    link: "/statistics",
  },
  {
    title: "Fixtures",
    text: "View latest fixtures, results and upcoming matches.",
    button: "See Fixtures",
    icon: "📅",
    link: "/fixtures",
  },
  {
    title: "Team",
    text: "View team information, squad list and player profiles.",
    button: "Meet the Team",
    icon: "👥",
    link: "/team",
  },
  {
    title: "Gallery",
    text: "Match day photos and club memories.",
    button: "View Gallery",
    icon: "🖼️",
    link: "/gallery",
  },
  {
    title: "Hall of Fame",
    text: "Top performers and club legends.",
    button: "Explore Legends",
    icon: "⭐",
    link: "/hall-of-fame",
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
          <div className="flex items-center gap-3 sm:gap-4">
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
              <p className="text-sm text-white">Cricket Club • High Wycombe</p>
            </div>
          </div>

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

          <button
            className="text-4xl text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-4 bg-[#2563eb] px-6 py-6 text-lg font-semibold text-white md:hidden">
            <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
            <Link href="/competitions" onClick={() => setMenuOpen(false)}>Competitions</Link>
            <Link href="/statistics" onClick={() => setMenuOpen(false)}>Statistics</Link>
            <Link href="/fixtures" onClick={() => setMenuOpen(false)}>Fixtures</Link>
            <Link href="/team" onClick={() => setMenuOpen(false)}>Team</Link>
            <Link href="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
            <a href="#sponsors" onClick={() => setMenuOpen(false)}>Sponsors</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
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
          <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl">
            WELCOME TO <br />
            SPIDERS SPORTS CLUB UK
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg md:text-2xl">
            A friendly and competitive cricket club welcoming players,
            supporters and sponsors.
          </p>

          <a
            href="#club"
            className="border-4 border-white px-6 py-3 text-lg font-bold transition hover:bg-white hover:text-[#071a52] md:px-10 md:py-4 md:text-xl"
          >
            EXPLORE CLUB
          </a>
        </div>
      </section>

      {/* CLUB AREAS */}
      <section
        id="club"
        className="relative overflow-hidden px-4 py-6 md:px-6 md:py-10"
      >
        <div className="absolute inset-0">
          <Image
            src="/home/club-bg.jpeg"
            alt="Club Background"
            fill
            className="object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-white/45 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl scale-[0.88] origin-top">
          <h2 className="text-5xl font-extrabold text-[#061b52] md:text-6xl">
            Club Areas
          </h2>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-blue-600" />
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </div>

          <p className="mt-5 text-lg text-[#1d3158] md:text-xl">
            Explore everything about Spiders Sports Club UK.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubAreas.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group relative min-h-[210px] overflow-hidden rounded-3xl border border-blue-200/70 bg-white/75 p-6 shadow-xl shadow-blue-900/10 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/80 to-blue-100/70" />

                <div className="absolute -right-5 top-10 text-[120px] opacity-10 transition group-hover:scale-110">
                  {item.icon}
                </div>

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-100/80 text-3xl shadow-md">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-extrabold text-[#061b52] md:text-2xl">
                    {item.title}
                  </h3>

                  <div className="mt-3 h-1 w-16 rounded-full bg-blue-600" />

                  <p className="mt-5 max-w-sm text-base leading-7 text-[#17284d]">
                    {item.text}
                  </p>

                  <div className="mt-auto flex items-center justify-between rounded-2xl bg-blue-100/70 px-5 py-4 font-bold text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                    <span>{item.button}</span>
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors" className="bg-[#071a52] px-4 py-16 text-white md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-4xl font-extrabold md:text-5xl">Sponsors</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl transition hover:scale-105">
              <Image src="/sponsors/kiwikmart.png" alt="Kiwikmart" width={250} height={120} className="object-contain" />
            </div>

            <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl transition hover:scale-105">
              <Image src="/sponsors/twenty20.png" alt="Twenty20 Estates" width={250} height={120} className="object-contain" />
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg transition hover:scale-105">
              <Image src="/sponsors/jatheesan.png" alt="Jatheesan Ltd" width={250} height={120} className="mx-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white px-4 py-16 text-[#071a52] md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-extrabold md:text-5xl">Contact Us</h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-xl">
            Get in touch with Spiders Sports Club UK for matches,
            sponsorships, memberships and general enquiries.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-[#eef2ff] p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Email</h3>
              <p className="mt-4 text-lg">spiderssportsclubuk@gmail.com</p>
            </div>

            <div className="rounded-3xl bg-[#eef2ff] p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Location</h3>
              <p className="mt-4 text-lg">High Wycombe, UK</p>
            </div>

            <div className="rounded-3xl bg-[#eef2ff] p-8 shadow-lg">
              <h3 className="text-2xl font-bold">Join Us</h3>
              <p className="mt-4 text-lg">Players and supporters are welcome.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA FOOTER */}
      <section className="bg-[#071a52] py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-6">
          <h2 className="text-center text-2xl font-bold md:text-3xl">
            Follow Spiders Sports Club UK
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://www.facebook.com/profile.php?id=61553153775249" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3 font-semibold transition hover:scale-110">
              <FaFacebookF size={22} />
              Facebook
            </a>

            <a href="https://www.instagram.com/spidersscuk_23/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-pink-600 px-6 py-3 font-semibold transition hover:scale-110">
              <FaInstagram size={22} />
              Instagram
            </a>

            <a href="https://www.youtube.com/@Spiderssportsclubuk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-red-600 px-6 py-3 font-semibold transition hover:scale-110">
              <FaYoutube size={22} />
              YouTube
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#04113a] px-6 py-8 text-center text-white">
        <p className="text-lg">© 2026 Spiders Sports Club UK. All Rights Reserved.</p>
      </footer>
    </main>
  );
}