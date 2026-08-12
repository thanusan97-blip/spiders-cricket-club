import Image from "next/image";
import Link from "next/link";

const teams = [
  {
    name: "Aathiyadi Super Kings",
    owner: "Jatheesan Arulanantham",
    logo: "/vctb/2026/teams/aathiyadi.png",
    retained: ["Player A", "Player B", "Player C", "Player D"],
  },
  {
    name: "Balmoral Fighters",
    owner: "Krishanth Thayalan & Anushan Arulanantham",
    logo: "/vctb/2026/teams/balmoral.png",
    retained: ["Player A", "Player B", "Player C", "Player D"],
  },
  {
    name: "Niruvaththampai Knights",
    owner: "Sornaraj Sornavadivel & Ranjithraj Thurairajah",
    logo: "/vctb/2026/teams/niruvaththampai.png",
    retained: ["Player A", "Player B", "Player C", "Player D"],
  },
  {
    name: "Team Tiger",
    owner: "Sothilingam Yogeswaran",
    logo: "/vctb/2026/teams/team-tiger.png",
    retained: ["Player A", "Player B", "Player C", "Player D"],
  },
  {
    name: "Thunnalai Royals",
    owner: "Sivathasan Kailasapillai & Kugan Navaratnam",
    logo: "/vctb/2026/teams/thunnalai.png",
    retained: ["Player A", "Player B", "Player C", "Player D"],
  },
  {
    name: "Vallvai Blues SC UK",
    owner: "Valvai Blues Sports Committee",
    logo: "/vctb/2026/teams/vallvai-blues.png",
    retained: ["Player A", "Player B", "Player C", "Player D"],
  },
];

export default function VCTB2026Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">

        {/* BREADCRUMB */}
        <div className="mb-8 flex flex-wrap gap-2 text-sm font-semibold text-white/80 md:text-base">
          <Link
            href="/"
            className="hover:text-yellow-400 hover:underline"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            href="/vctb"
            className="hover:text-yellow-400 hover:underline"
          >
            VCTB
          </Link>

          <span>›</span>

          <span className="text-yellow-400">2026</span>
        </div>

        {/* ===================================================== */}
        {/* HERO - BACKGROUND IMAGE ONLY INSIDE THIS BOX */}
        {/* ===================================================== */}

        <section
          className="relative overflow-hidden rounded-[32px] border border-yellow-400/50 shadow-2xl"
          style={{
            backgroundImage: "url('/vctb/2026/vctb-2026-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* DARK OVERLAY - ONLY INSIDE HERO */}
          <div className="absolute inset-0 bg-black/60" />

          {/* HERO CONTENT */}
          <div className="relative z-10 p-6 md:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[260px_1fr]">

              {/* VCTB LOGO */}
              <div className="flex justify-center">
                <div className="bg-white p-3 shadow-2xl">
                  <Image
                    src="/vctb/2026/vctb-3-logo.png"
                    alt="VCTB Edition 3.0"
                    width={250}
                    height={250}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* HERO INFORMATION */}
              <div className="text-center lg:text-left">

                <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-400 md:text-base">
                  KWIK MART PRESENTS
                </p>

                <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
                  VCTB 2026
                </h1>

                <h2 className="mt-2 text-2xl font-black uppercase text-yellow-400 md:text-4xl">
                  Player Auction Night
                </h2>

                {/* DATE + TIME */}
                <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">

                  <div className="rounded-full border border-yellow-400/50 bg-black/75 px-5 py-3 font-bold">
                    📅 14 August 2026
                  </div>

                  <div className="rounded-full border border-yellow-400/50 bg-black/75 px-5 py-3 font-bold">
                    🕡 6:30 PM
                  </div>

                </div>

                <p className="mt-6 max-w-3xl text-base leading-7 text-white/90 md:text-lg">
                  Follow the VCTB Edition 3.0 player auction and see each
                  team squad develop as players are selected.
                </p>

              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* AUCTION CENTRE */}
        {/* ===================================================== */}

        <section className="mt-8 rounded-3xl border border-red-500/40 bg-gradient-to-r from-red-950/80 via-red-950/60 to-red-950/80 p-6 text-center shadow-xl">

          <div className="flex items-center justify-center gap-3">

            <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />

            <h2 className="text-xl font-black uppercase tracking-wide md:text-2xl">
              Auction Centre
            </h2>

          </div>

          <p className="mt-3 text-white/75">
            Team squads will be updated during the auction.
          </p>

        </section>

        {/* ===================================================== */}
        {/* SPONSORS */}
        {/* ===================================================== */}

        <section className="mt-12">

          <div className="mb-6">

            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              Partners
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Tournament Sponsors
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* KWIK MART */}
            <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1">

              <p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">
                Title Sponsor
              </p>

              <Image
                src="/sponsors/kiwikmart.png"
                alt="Kwik Mart"
                width={260}
                height={120}
                className="object-contain"
              />

            </div>

            {/* JATHEESAN */}
            <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1">

              <p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">
                Gold Sponsor
              </p>

              <Image
                src="/sponsors/jatheesan.png"
                alt="Jatheesan Ltd"
                width={260}
                height={120}
                className="object-contain"
              />

            </div>

            {/* SAM */}
            <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1">

              <p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">
                Powered By
              </p>

              <Image
                src="/sponsors/sam.jpg"
                alt="SAM Accountants"
                width={260}
                height={120}
                className="object-contain"
              />

            </div>

          </div>
        </section>

        {/* ===================================================== */}
        {/* PARTICIPATING TEAMS */}
        {/* ===================================================== */}

        <section className="mt-16">

          <div className="mb-8">

            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              VCTB Edition 3.0
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              Participating Teams
            </h2>

            <p className="mt-3 max-w-3xl text-white/70">
              Retained players will be confirmed and auction signings
              will be added as the event progresses.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {teams.map((team) => (

              <article
                key={team.name}
                className="overflow-hidden rounded-[28px] border border-yellow-400/30 bg-[#080808] shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60"
              >

                {/* TEAM HEADER */}
                <div className="border-b border-yellow-400/20 bg-gradient-to-r from-yellow-500/20 via-[#111]/80 to-red-600/15 p-6">

                  <div className="flex items-center gap-5">

                    {/* TEAM LOGO */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-xl">

                      <Image
                        src={team.logo}
                        alt={team.name}
                        width={90}
                        height={90}
                        className="h-full w-full object-contain"
                      />

                    </div>

                    {/* TEAM NAME */}
                    <div>

                      <h3 className="text-xl font-black uppercase leading-tight md:text-2xl">
                        {team.name}
                      </h3>

                      <p className="mt-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
                        VCTB 2026
                      </p>

                    </div>

                  </div>
                </div>

                {/* TEAM DETAILS */}
                <div className="p-6">

                  {/* OWNER */}
                  <div>

                    <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                      Owner
                    </p>

                    <p className="mt-2 text-lg font-bold">
                      {team.owner}
                    </p>

                  </div>

                  {/* RETAINED PLAYERS */}
                  <div className="mt-7">

                    <div className="flex items-center justify-between gap-4">

                      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                        Retained Players
                      </p>

                      <span className="whitespace-nowrap rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-bold text-yellow-300">
                        4 Players
                      </span>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      {team.retained.map((player) => (

                        <div
                          key={player}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold"
                        >
                          ⭐ {player}
                        </div>

                      ))}

                    </div>

                  </div>

                  {/* AUCTION SIGNINGS */}
                  <div className="mt-7">

                    <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                      Auction Signings
                    </p>

                    <div className="mt-4 rounded-2xl border border-dashed border-red-400/30 bg-red-950/20 p-5 text-center">

                      <p className="font-semibold text-white/60">
                        Waiting for Auction Night...
                      </p>

                    </div>

                  </div>

                  {/* CURRENT SQUAD */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">

                    <span className="text-sm text-white/60">
                      Current Squad
                    </span>

                    <span className="text-lg font-black text-yellow-400">
                      4 Players
                    </span>

                  </div>

                </div>

              </article>

            ))}

          </div>
        </section>

        {/* ===================================================== */}
        {/* RETENTION RULES */}
        {/* ===================================================== */}

        <section className="mt-16 rounded-[30px] border border-yellow-400/30 bg-[#080808] p-7 shadow-2xl md:p-10">

          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            VCTB 2026
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Retention Rules
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">

            {/* RULE 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-4xl font-black text-yellow-400">
                4
              </p>

              <p className="mt-2 text-white/70">
                Retained players permitted per team.
              </p>

            </div>

            {/* RULE 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-4xl font-black text-yellow-400">
                5
              </p>

              <p className="mt-2 text-white/70">
                If an owner is playing, the squad may include
                4 retained players plus 1 playing owner.
              </p>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}