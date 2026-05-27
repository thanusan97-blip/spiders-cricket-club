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
    <main className="min-h-screen bg-[#eef2ff] px-4 py-10 text-[#071a52] md:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Link href="/competitions" className="font-bold hover:underline">
          ← Back to Competitions
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-3xl pb-10 shadow-lg md:mt-8 md:pb-20">
          <Image
            src="/covers/vctb2025-cover.jpg"
            alt="VCTB 2025 Background"
            fill
            priority
            className="object-cover opacity-25"
          />

          <div className="relative z-10 p-5 md:p-10">
            <h1 className="text-4xl font-extrabold text-[#071a52] md:text-7xl">
              VCTB 2025
            </h1>

            <p className="mt-3 text-xl text-slate-700 md:mt-4 md:text-3xl">
              Vadamaradchy Champion T10 Blast
            </p>

            <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-8">
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm sm:flex-row sm:text-left md:gap-6 md:p-8">
                <div className="relative h-20 w-20 shrink-0 md:h-24 md:w-24">
                  <Image
                    src="/logos/thunnalai-royals.jpg"
                    alt="Thunnalai Royals"
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold md:text-4xl">
                    🏆 Champions
                  </h2>
                  <p className="mt-2 text-2xl font-extrabold text-green-600 md:mt-3 md:text-3xl">
                    Thunnalai Royals
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm sm:flex-row sm:text-left md:gap-6 md:p-8">
                <div className="relative h-20 w-20 shrink-0 md:h-24 md:w-24">
                  <Image
                    src="/logos/balmoral-fighters.jpg"
                    alt="Balmoral Fighters"
                    fill
                    className="object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold md:text-4xl">
                    🥈 Runners Up
                  </h2>
                  <p className="mt-2 text-2xl font-extrabold text-red-600 md:mt-3 md:text-3xl">
                    Balmoral Fighters
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="relative z-10 mt-10 px-5 md:mt-16 md:px-10">
            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              <AwardCard title="🏆 MVP of the Season" name="Mohamad Fazlan" detail="148 Runs & 8 Wickets" />
              <AwardCard title="🏏 Best Batsman" name="Jacob Sachin" detail="187 Runs" />
              <AwardCard title="🎯 Best Bowler" name="Farusath" detail="10 Wickets" />
            </div>
          </section>

          <section className="relative z-10 mx-5 mt-10 rounded-3xl bg-white/90 p-5 shadow-lg backdrop-blur-sm md:mx-10 md:mt-16 md:p-8">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Participating Teams
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map(([name, slug]) => (
                <a
                  key={slug}
                  href={`/competitions/vctb2025/${slug}`}
                  className="block rounded-2xl border border-[#071a52]/20 bg-[#eef2ff] p-4 text-base font-bold transition hover:scale-105 hover:bg-white md:p-5 md:text-xl"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={`/logos/${slug}.jpg`}
                      alt={name}
                      width={45}
                      height={45}
                      className="rounded-full md:h-[50px] md:w-[50px]"
                    />
                    <span>{name}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
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

function AwardCard({
  title,
  name,
  detail,
}: {
  title: string;
  name: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl bg-white/90 p-6 text-center shadow-lg backdrop-blur-sm md:p-8">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <p className="mt-3 text-2xl font-extrabold text-[#071a52] md:mt-4 md:text-3xl">
        {name}
      </p>
      <p className="mt-2 text-base text-slate-600 md:text-lg">{detail}</p>
    </div>
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
      <h2 className="bg-[#3b82f6] px-6 py-4 text-center text-2xl font-extrabold text-white md:text-3xl">
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm md:text-base">
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