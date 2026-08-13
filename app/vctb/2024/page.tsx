import Link from "next/link";
import Image from "next/image";

const teams = [
  "Point Pedro Rangers",
  "Thumpalai Navalars",
  "Karaveddy Warriors",
  "Balmoral Fighters",
  "Aathiyadi Super Kings",
  "Team Tiger",
  "Thunnalai Royals",
  "Alvai DLF",
];

export default function VCTB2024Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden border-b border-yellow-400/20">
        <Image
          src="/competitions/vctb-bg.jpeg"
          alt="VCTB 2024"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/65 to-black" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          {/* BREADCRUMB */}
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/60">
            <Link
              href="/"
              className="transition hover:text-yellow-400"
            >
              Home
            </Link>

            <span>›</span>

            <Link
              href="/vctb"
              className="transition hover:text-yellow-400"
            >
              VCTB
            </Link>

            <span>›</span>

            <span className="text-yellow-400">2024</span>
          </div>

          {/* HERO CONTENT */}
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[220px_1fr]">
            {/* LOGO */}
            <div className="flex justify-center lg:justify-start">
              <div className="rounded-[28px] border border-yellow-400/40 bg-white p-5 shadow-2xl">
                <Image
                  src="/competitions/vctb.png"
                  alt="VCTB"
                  width={190}
                  height={190}
                  className="h-[170px] w-[170px] object-contain"
                />
              </div>
            </div>

            {/* TEXT */}
            <div className="text-center lg:text-left">
              <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-yellow-400">
                  Edition 1.0
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white/70">
                  Inaugural Season
                </span>
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-yellow-400">
                Vadamaradchy Champion T10 Blast
              </p>

              <h1 className="mt-3 text-5xl font-black uppercase leading-tight md:text-7xl">
                VCTB 2024
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-7 text-white/70">
                Revisit the inaugural edition of the Vadamaradchy Champion
                T10 Blast and the teams that competed in the first VCTB
                tournament.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <div className="rounded-full border border-yellow-400/30 bg-black/60 px-5 py-3">
                  🏏 T10 Cricket
                </div>

                <div className="rounded-full border border-yellow-400/30 bg-black/60 px-5 py-3">
                  🛡️ 8 Teams
                </div>

                <div className="rounded-full border border-yellow-400/30 bg-black/60 px-5 py-3">
                  🏆 Edition 1.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SEASON RESULTS */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            Season Results
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            2024 Champions
          </h2>

          <p className="mt-3 text-white/50">
            The champions and runners-up of the inaugural VCTB season.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* CHAMPIONS */}
          <div className="relative overflow-hidden rounded-[30px] border border-yellow-400/40 bg-[#080808] p-7 shadow-2xl md:p-9">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 via-transparent to-transparent" />

            <div className="relative z-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-4xl">
                🏆
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-yellow-400">
                Champions
              </p>

              <h3 className="mt-3 text-3xl font-black md:text-4xl">
                Thunnalai Royals
              </h3>

              <p className="mt-2 text-white/50">
                VCTB 2024 Champions
              </p>
            </div>
          </div>

          {/* RUNNERS UP */}
          <div className="relative overflow-hidden rounded-[30px] border border-red-500/30 bg-[#080808] p-7 shadow-2xl md:p-9">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 via-transparent to-transparent" />

            <div className="relative z-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-4xl">
                🥈
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-red-400">
                Runners Up
              </p>

              <h3 className="mt-3 text-3xl font-black md:text-4xl">
                Point Pedro Rangers
              </h3>

              <p className="mt-2 text-white/50">
                VCTB 2024 Finalists
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PARTICIPATING TEAMS */}
      {/* ===================================================== */}

      <section className="border-y border-yellow-400/10 bg-[#060606]">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              Edition 1.0
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              Participating Teams
            </h2>

            <p className="mt-3 text-white/50">
              The eight teams that competed in the first VCTB tournament.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teams.map((team, index) => (
              <div
                key={team}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0c0c0c] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-sm font-black text-yellow-400">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="mt-5 text-xl font-black leading-tight">
                    {team}
                  </h3>

                  <p className="mt-3 text-xs font-black uppercase tracking-wider text-white/40">
                    VCTB 2024
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* VCTB HISTORY */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="relative overflow-hidden rounded-[32px] border border-yellow-400/30 bg-[#080808] p-8 text-center shadow-2xl md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-red-600/10" />

          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              Where It Started
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              The First VCTB
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-7 text-white/60">
              VCTB 2024 marked the beginning of the Vadamaradchy Champion
              T10 Blast and established the foundation for the tournament
              editions that followed.
            </p>

            <Link
              href="/vctb"
              className="mt-8 inline-block rounded-2xl bg-yellow-400 px-7 py-4 font-black text-black transition hover:bg-yellow-300"
            >
              EXPLORE ALL VCTB SEASONS →
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FOOTER CTA */}
      {/* ===================================================== */}

      <section className="border-t border-yellow-400/20 bg-[#070707]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 text-center md:flex-row md:px-6 md:text-left">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-400">
              VCTB
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Explore another VCTB season
            </h2>
          </div>

          <Link
            href="/vctb"
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black transition hover:bg-yellow-300"
          >
            ← ALL VCTB SEASONS
          </Link>
        </div>
      </section>
    </main>
  );
}