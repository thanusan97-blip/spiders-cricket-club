import Link from "next/link";
import Image from "next/image";

const teams = [
  ["Alvai Super Kings", "alvai-super-kings"],
  ["Balmoral Fighters", "balmoral-fighters"],
  ["Karavaddy Warriors", "karavaddy-warriors"],
  ["Measureland Blazers", "measureland-blazers"],
  ["Niruvaththampai Knights", "niruvaththampai-knights"],
  ["Point Pedro Rangers", "point-pedro-rangers"],
  ["Team Tiger", "team-tiger"],
  ["Thunnalai Royals", "thunnalai-royals"],
];

const batsmen = [
  ["1", "Jacob Sachin", "TR", "187"],
  ["2", "Ziya Mohamad", "NK", "157"],
  ["3", "Mohamad Fazlan", "BF", "148"],
  ["4", "Jegendran", "PPR", "141"],
  ["5", "Dinoshan", "KW", "118"],
  ["6", "Madhusan", "TR", "118"],
  ["7", "Canistan", "BF", "102"],
  ["8", "Aravinthan", "NK", "82"],
  ["9", "Dikson", "MB", "58"],
  ["10", "Theivendran", "TT", "58"],
];

const bowlers = [
  ["1", "Farusath", "BF", "10"],
  ["2", "Mohamad Fazlan", "BF", "8"],
  ["3", "Visnujith", "BF", "8"],
  ["4", "Caniston", "BF", "6"],
  ["5", "Madhusan", "TR", "6"],
  ["6", "Purus Paran", "TR", "6"],
  ["7", "Riffas Mohamed", "BF", "5"],
  ["8", "Neru", "TR", "5"],
  ["9", "Ryan", "NK", "4"],
  ["10", "Kavi", "TR", "4"],
];

export default function VCTB2025Page() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden border-b border-yellow-400/20">

        <Image
          src="/covers/vctb2025-cover.jpg"
          alt="VCTB 2025"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />

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

            <span className="text-yellow-400">
              2025
            </span>

          </div>

          {/* HERO CONTENT */}
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[220px_1fr]">

            {/* VCTB LOGO */}
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
                  Edition 2.0
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white/70">
                  Completed Season
                </span>

              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-yellow-400">
                Vadamaradchy Champion T10 Blast
              </p>

              <h1 className="mt-3 text-5xl font-black uppercase leading-tight md:text-7xl">
                VCTB 2025
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-7 text-white/70">
                Revisit VCTB Edition 2.0, including the champions,
                tournament awards, participating teams and leading
                performers from the 2025 season.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">

                <div className="rounded-full border border-yellow-400/30 bg-black/60 px-5 py-3">
                  🏏 T10 Cricket
                </div>

                <div className="rounded-full border border-yellow-400/30 bg-black/60 px-5 py-3">
                  🛡️ 8 Teams
                </div>

                <div className="rounded-full border border-yellow-400/30 bg-black/60 px-5 py-3">
                  🏆 Edition 2.0
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CHAMPIONS */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">

        <div className="mb-8">

          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            Season Results
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            2025 Champions
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* CHAMPIONS */}
          <div className="relative overflow-hidden rounded-[30px] border border-yellow-400/40 bg-[#080808] p-7 shadow-2xl md:p-9">

            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">

              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white p-3 shadow-xl">

                <Image
                  src="/logos/thunnalai-royals.jpg"
                  alt="Thunnalai Royals"
                  width={100}
                  height={100}
                  className="h-full w-full rounded-full object-contain"
                />

              </div>

              <div>

                <p className="text-sm font-black uppercase tracking-[0.25em] text-yellow-400">
                  🏆 Champions
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  Thunnalai Royals
                </h3>

                <p className="mt-2 text-white/50">
                  VCTB 2025 Champions
                </p>

              </div>
            </div>
          </div>

          {/* RUNNERS UP */}
          <div className="relative overflow-hidden rounded-[30px] border border-red-500/30 bg-[#080808] p-7 shadow-2xl md:p-9">

            <div className="absolute inset-0 bg-gradient-to-br from-red-600/15 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">

              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white p-3 shadow-xl">

                <Image
                  src="/logos/balmoral-fighters.jpg"
                  alt="Balmoral Fighters"
                  width={100}
                  height={100}
                  className="h-full w-full rounded-full object-contain"
                />

              </div>

              <div>

                <p className="text-sm font-black uppercase tracking-[0.25em] text-red-400">
                  🥈 Runners Up
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  Balmoral Fighters
                </h3>

                <p className="mt-2 text-white/50">
                  VCTB 2025 Finalists
                </p>

              </div>
            </div>
          </div>

        </div>

        {/* ================================================= */}
        {/* AWARDS */}
        {/* ================================================= */}

        <div className="mt-12">

          <div className="mb-7">

            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              Individual Awards
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Season Awards
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <AwardCard
              icon="🏆"
              title="MVP of the Season"
              name="Mohamad Fazlan"
              detail="148 Runs & 8 Wickets"
            />

            <AwardCard
              icon="🏏"
              title="Best Batsman"
              name="Jacob Sachin"
              detail="187 Runs"
            />

            <AwardCard
              icon="🎯"
              title="Best Bowler"
              name="Farusath"
              detail="10 Wickets"
            />

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
              VCTB 2025
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              Participating Teams
            </h2>

            <p className="mt-3 text-white/50">
              Explore the eight teams that competed in Edition 2.0.
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {teams.map(([name, slug]) => (

              <Link
                key={slug}
                href={`/vctb/2025/${slug}`}
                className="group rounded-[24px] border border-white/10 bg-[#0c0c0c] p-5 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white p-2">

                    <Image
                      src={`/logos/${slug}.jpg`}
                      alt={name}
                      width={60}
                      height={60}
                      className="h-full w-full rounded-full object-contain"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-black leading-tight">
                      {name}
                    </p>

                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                      View Team →
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STATISTICS */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">

        <div className="mb-8">

          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            Performance
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            2025 Statistics
          </h2>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <StatsTable
            title="🏏 Top Batsmen"
            headers={["Rank", "Name", "Team", "Runs"]}
            rows={batsmen}
          />

          <StatsTable
            title="🎯 Top Bowlers"
            headers={["Rank", "Name", "Team", "Wickets"]}
            rows={bowlers}
          />

        </div>
      </section>

      {/* ===================================================== */}
      {/* BACK TO VCTB */}
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

/* ===================================================== */
/* AWARD CARD */
/* ===================================================== */

function AwardCard({
  icon,
  title,
  name,
  detail,
}: {
  icon: string;
  title: string;
  name: string;
  detail: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-yellow-400/20 bg-[#0a0a0a] p-7 text-center shadow-xl">

      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent" />

      <div className="relative z-10">

        <div className="text-4xl">
          {icon}
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
          {title}
        </p>

        <h3 className="mt-3 text-2xl font-black">
          {name}
        </h3>

        <p className="mt-2 text-white/50">
          {detail}
        </p>

      </div>
    </div>
  );
}

/* ===================================================== */
/* STATS TABLE */
/* ===================================================== */

function StatsTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-yellow-400/20 bg-[#080808] shadow-2xl">

      <div className="border-b border-yellow-400/20 bg-gradient-to-r from-yellow-500/15 via-black to-red-600/10 px-6 py-5">

        <h2 className="text-2xl font-black">
          {title}
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[520px] border-collapse text-sm md:text-base">

          <thead>

            <tr className="border-b border-white/10 bg-white/5">

              {headers.map((header) => (

                <th
                  key={header}
                  className="px-4 py-4 text-left text-xs font-black uppercase tracking-wider text-yellow-400"
                >
                  {header}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {rows.map((row, rowIndex) => (

              <tr
                key={`${title}-${row[0]}`}
                className="border-b border-white/5 transition hover:bg-white/5"
              >

                {row.map((cell, index) => (

                  <td
                    key={index}
                    className={`px-4 py-4 ${
                      index === 0
                        ? "font-black text-yellow-400"
                        : index === 1
                        ? "font-bold text-white"
                        : "text-white/60"
                    }`}
                  >
                    {cell}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}