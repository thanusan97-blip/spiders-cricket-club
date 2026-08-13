import Image from "next/image";
import Link from "next/link";

const seasons = [
  {
    year: "2026",
    edition: "Edition 3.0",
    title: "VCTB 2026",
    description:
      "The current season of the Vadamaradchy Champion T10 Blast. Follow the player auction, participating teams and tournament updates.",
    href: "/vctb/2026",
    button: "OPEN VCTB 2026",
    badge: "CURRENT SEASON",
    featured: true,
  },
  {
    year: "2025",
    edition: "Edition 2.0",
    title: "VCTB 2025",
    description:
      "Explore the second edition of VCTB, including tournament information, teams and results.",
    href: "/vctb/2025",
    button: "OPEN 2025 SEASON",
    badge: "PAST SEASON",
    featured: false,
  },
  {
    year: "2024",
    edition: "Edition 1.0",
    title: "VCTB 2024",
    description:
      "Revisit the inaugural season of the Vadamaradchy Champion T10 Blast.",
    href: "/vctb/2024",
    button: "OPEN 2024 SEASON",
    badge: "FIRST EDITION",
    featured: false,
  },
];

export default function VCTBPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="relative overflow-hidden border-b border-yellow-400/20">
        <Image
          src="/vctb/2026/vctb-2026-bg.png"
          alt="VCTB Tournament"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-yellow-400"
          >
            ← Back to Home
          </Link>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[340px_1fr]">
            <div className="flex justify-center lg:justify-start">
              <div className="rounded-[30px] border border-yellow-400/40 bg-white p-5 shadow-2xl">
                <Image
                  src="/vctb/2026/vctb-3-logo.png"
                  alt="VCTB Edition 3.0"
                  width={300}
                  height={300}
                  className="h-auto w-full max-w-[270px] object-contain"
                  priority
                />
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-400 md:text-base">
                Spiders Sports Club UK
              </p>

              <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl lg:text-7xl">
                VCTB
              </h1>

              <h2 className="mt-2 text-2xl font-black uppercase text-yellow-400 md:text-4xl">
                Vadamaradchy Champion T10 Blast
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/75 md:mx-0 md:text-lg">
                The home of the Vadamaradchy Champion T10 Blast. Explore
                every edition of VCTB, follow the current tournament and
                revisit previous seasons.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <div className="rounded-full border border-yellow-400/40 bg-black/60 px-5 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                    Format
                  </p>
                  <p className="font-black text-yellow-400">T10 Cricket</p>
                </div>

                <div className="rounded-full border border-yellow-400/40 bg-black/60 px-5 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                    Current Edition
                  </p>
                  <p className="font-black text-yellow-400">Edition 3.0</p>
                </div>

                <div className="rounded-full border border-yellow-400/40 bg-black/60 px-5 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                    Season
                  </p>
                  <p className="font-black text-yellow-400">2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            VCTB History
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            Explore Every Season
          </h2>

          <p className="mt-3 max-w-2xl text-white/60">
            Select a VCTB edition to view the tournament, teams and season
            information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            href="/vctb/2026"
            className="group relative overflow-hidden rounded-[32px] border border-yellow-400/50 bg-[#080808] shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400 lg:col-span-2"
          >
            <div className="absolute inset-0">
              <Image
                src="/vctb/2026/vctb-2026-bg.png"
                alt="VCTB 2026"
                fill
                className="object-cover opacity-30 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-red-950/60" />
            </div>

            <div className="relative z-10 grid items-center gap-8 p-7 md:grid-cols-[220px_1fr_auto] md:p-10">
              <div className="flex justify-center md:justify-start">
                <div className="rounded-3xl bg-white p-3 shadow-xl">
                  <Image
                    src="/vctb/2026/vctb-3-logo.png"
                    alt="VCTB Edition 3.0"
                    width={190}
                    height={190}
                    className="h-[170px] w-[170px] object-contain"
                  />
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-wider">
                    Current Season
                  </span>

                  <span className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-yellow-400">
                    Edition 3.0
                  </span>
                </div>

                <p className="mt-5 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
                  Season 2026
                </p>

                <h3 className="mt-2 text-3xl font-black uppercase md:text-5xl">
                  VCTB 2026
                </h3>

                <p className="mt-4 max-w-2xl leading-7 text-white/70">
                  Follow the current VCTB season, player auction,
                  participating teams and live squad updates.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70">
                    🏏 Player Auction
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70">
                    🛡️ Teams
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/70">
                    🔴 Live Updates
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="rounded-2xl bg-yellow-400 px-6 py-4 text-center font-black text-black transition group-hover:bg-yellow-300">
                  OPEN 2026 <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {seasons
            .filter((season) => !season.featured)
            .map((season) => (
              <Link
                key={season.year}
                href={season.href}
                className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#080808] shadow-xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400/50"
              >
                <div className="relative overflow-hidden border-b border-white/10 p-7">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-red-600/10" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-wider text-white/60">
                          {season.badge}
                        </span>

                        <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                          {season.edition}
                        </p>

                        <h3 className="mt-2 text-4xl font-black">
                          {season.year}
                        </h3>
                      </div>

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2">
                        <Image
                          src="/competitions/vctb.png"
                          alt="VCTB"
                          width={70}
                          height={70}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-7">
                  <h4 className="text-2xl font-black">
                    {season.title}
                  </h4>

                  <p className="mt-3 min-h-[72px] leading-6 text-white/60">
                    {season.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-sm font-black text-yellow-400">
                      {season.button}
                    </span>

                    <span className="text-2xl text-yellow-400 transition duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="border-t border-yellow-400/20 bg-[#070707]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 text-center md:grid-cols-3 md:px-6">
          <div>
            <p className="text-4xl font-black text-yellow-400">3</p>
            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-white/50">
              VCTB Editions
            </p>
          </div>

          <div>
            <p className="text-4xl font-black text-yellow-400">T10</p>
            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-white/50">
              Cricket Format
            </p>
          </div>

          <div>
            <p className="text-4xl font-black text-yellow-400">2026</p>
            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-white/50">
              Current Season
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}