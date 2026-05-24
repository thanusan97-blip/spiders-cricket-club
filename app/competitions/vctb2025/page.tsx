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
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        <Link href="/competitions" className="font-bold hover:underline">
          ← Back to Competitions
        </Link>

        <section className="relative mt-8 overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/covers/vctb2025-cover.jpg"
            alt="VCTB 2025 Background"
            fill
            priority
            className="object-cover opacity-20"
          />

          <div className="relative z-10 p-10">
            <h1 className="text-7xl font-extrabold text-[#071a52]">
              VCTB 2025
            </h1>

            <p className="mt-4 text-3xl text-slate-700">
              Vadamaradchy Champion T10 Blast
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="flex items-center gap-6 rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src="/logos/thunnalai-royals.jpg"
                    alt="Thunnalai Royals"
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-4xl font-bold">🏆 Champions</h2>
                  <p className="mt-3 text-3xl font-extrabold text-green-600">
                    Thunnalai Royals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
                <div className="relative h-24 w-24 shrink-0">
                  <Image
                    src="/logos/balmoral-fighters.jpg"
                    alt="Balmoral Fighters"
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-4xl font-bold">🥈 Runners Up</h2>
                  <p className="mt-3 text-3xl font-extrabold text-red-600">
                    Balmoral Fighters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
              <h2 className="text-2xl font-bold">🏆 MVP of the Season</h2>
              <p className="mt-4 text-3xl font-extrabold text-[#071a52]">
                Mohamad Fazlan
              </p>
              <p className="mt-2 text-lg text-slate-600">
                148 Runs & 8 Wickets
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
              <h2 className="text-2xl font-bold">🏏 Best Batsman</h2>
              <p className="mt-4 text-3xl font-extrabold text-[#071a52]">
                Jacob Sachin
              </p>
              <p className="mt-2 text-lg text-slate-600">187 Runs</p>
            </div>

            <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
              <h2 className="text-2xl font-bold">🎯 Best Bowler</h2>
              <p className="mt-4 text-3xl font-extrabold text-[#071a52]">
                Farusath
              </p>
              <p className="mt-2 text-lg text-slate-600">10 Wickets</p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-4xl font-extrabold">Participating Teams</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map(([name, slug]) => (
              <a
                key={slug}
                href={`/competitions/vctb2025/${slug}`}
                className="block rounded-2xl border border-[#071a52]/20 bg-[#eef2ff] p-5 text-xl font-bold transition hover:scale-105 hover:bg-white"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={`/logos/${slug}.jpg`}
                    alt={name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <span>{name}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <StatsTable
            title="Top Batsmen"
            headers={["Rank", "Name", "Team", "Runs Total"]}
            rows={batsmen}
          />

          <StatsTable
            title="Top Bowlers"
            headers={["Rank", "Name", "Team", "WKTS Total"]}
            rows={bowlers}
          />
        </section>
      </div>
    </main>
  );
}

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
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <h2 className="bg-[#3b82f6] px-6 py-4 text-center text-3xl font-extrabold text-white">
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#dbeafe]">
              {headers.map((header) => (
                <th key={header} className="border border-slate-300 px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={`${title}-${row[0]}`} className="hover:bg-[#eef2ff]">
                {row.map((cell, index) => (
                  <td key={index} className="border border-slate-300 px-4 py-3">
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