import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">
      {/* TOP BAR */}
      <header className="fixed top-0 z-50 w-full bg-[#2563eb] shadow-md">
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
              <h1 className="text-2xl font-black text-white">
                Spiders Sports Club UK
              </h1>

              <p className="text-sm text-white/80">
                Cricket Club • High Wycombe
              </p>
            </div>
          </div>

          <nav className="hidden gap-8 font-semibold text-white md:flex">
            <a href="/">Home</a>
            <Link href="/competitions">Competitions</Link>
            <Link href="/statistics">Statistics</Link>
            <Link href="/gallery">Gallery</Link>
            <a href="#sponsors">Sponsors</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* COVER SECTION */}
      <section
        className="relative flex h-screen items-center justify-center bg-cover bg-center pt-24"
        style={{
          backgroundImage: "url('/gallery/photo2.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071a52]/70 via-[#071a52]/20 to-transparent"/>

        <div className="relative z-10 px-6 text-center">
          <h1 className="text-5xl font-black uppercase leading-tight text-white md:text-7xl">
            Welcome to <br />
            Spiders Sports Club UK
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white md:text-xl">
            A friendly and competitive cricket club welcoming players,
            supporters and sponsors.
          </p>

          <a
            href="#clubareas"
            className="mt-10 inline-block border-4 border-white px-10 py-4 text-xl font-black uppercase text-white transition hover:bg-white hover:text-[#071a52]"
          >
            Explore Club
          </a>
        </div>
      </section>

      {/* CLUB AREAS */}
      <section id="clubareas" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-5xl font-black">Club Areas</h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/competitions"
            className="rounded-3xl border border-[#071a52]/30 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
          >
            <h3 className="text-3xl font-black">Competitions</h3>
            <p className="mt-4 text-lg text-slate-600">
              View BTCL and VCTB competitions for 2026, 2025 and 2024.
            </p>
          </Link>

          <Link
            href="/statistics"
            className="rounded-3xl border border-[#071a52]/30 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
          >
            <h3 className="text-3xl font-black">Statistics</h3>
            <p className="mt-4 text-lg text-slate-600">
              View detailed player batting, bowling and fielding statistics.
            </p>
          </Link>

          <Link
            href="/gallery"
            className="rounded-3xl border border-[#071a52]/30 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
          >
            <h3 className="text-3xl font-black">Gallery</h3>
            <p className="mt-4 text-lg text-slate-600">
              Match day photos and club memories.
            </p>
          </Link>

          <Link
            href="/halloffame"
            className="rounded-3xl border border-[#071a52]/30 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
          >
            <h3 className="text-3xl font-black">Hall of Fame</h3>
            <p className="mt-4 text-lg text-slate-600">
              Top performers and club legends.
            </p>
          </Link>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors" className="bg-[#071a52] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-5xl font-black">Sponsors</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-10 text-center text-4xl font-black text-[#071a52]">
              KIWIKMART
            </div>

            <div className="rounded-3xl bg-white p-10 text-center text-4xl font-black text-[#071a52]">
              Twenty 20 Estates
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-24 text-[#071a52]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-black">Contact Us</h2>

          <p className="mt-6 text-xl text-slate-600">
            Get in touch with Spiders Sports Club UK for matches, sponsorships,
            memberships and enquiries.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-[#071a52]/20 bg-[#eef2ff] p-8">
              <h3 className="text-2xl font-black">Phone</h3>
              <p className="mt-4 text-lg text-slate-700">+44 7XXX XXX XXX</p>
            </div>

            <div className="rounded-3xl border border-[#071a52]/20 bg-[#eef2ff] p-8">
              <h3 className="text-2xl font-black">Email</h3>
              <p className="mt-4 text-lg text-slate-700">
                spiderssportsclubuk@gmail.com
              </p>
            </div>

            <div className="rounded-3xl border border-[#071a52]/20 bg-[#eef2ff] p-8">
              <h3 className="text-2xl font-black">Location</h3>
              <p className="mt-4 text-lg text-slate-700">
                High Wycombe, United Kingdom
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}