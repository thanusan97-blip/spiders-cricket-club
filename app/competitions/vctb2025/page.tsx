import Link from "next/link";

const teams = [
  "Alvai Super Kings",
  "Balmoral Fighters",
  "Karavaddy Warriors",
  "Measureland Blazers",
  "Niruvaththampai Knights",
  "Point Pedro Rangers",
  "Team Tiger",
  "Thunnalai Royals",
];

export default function VCTB2025Page() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        <Link href="/competitions" className="font-bold hover:underline">
          ← Back to Competitions
        </Link>

        <h1 className="mt-8 text-6xl font-extrabold">
          VCTB 2025
        </h1>

        <p className="mt-4 text-2xl text-slate-600">
          Vadamaradchy Champion T10 Blast
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-bold">🏆 Champions</h2>

            <p className="mt-4 text-2xl font-extrabold text-green-600">
              Thunnalai Royals
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-bold">🥈 Runners Up</h2>

            <p className="mt-4 text-2xl font-extrabold text-red-600">
              Balmoral Fighters
            </p>
          </div>
        </div>
<section className="mt-16">
  <div className="grid gap-6 md:grid-cols-3">

    <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
      <h2 className="text-2xl font-bold">
        🏆 MVP of the Season
      </h2>

      <p className="mt-4 text-3xl font-extrabold text-[#071a52]">
        Mohamad Fazlan
      </p>

      <p className="mt-2 text-lg text-slate-600">
        148 Runs & 8 Wickets
      </p>
    </div>

    <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
      <h2 className="text-2xl font-bold">
        🏏 Best Batsman
      </h2>

      <p className="mt-4 text-3xl font-extrabold text-[#071a52]">
        Jacob Sachin
      </p>

      <p className="mt-2 text-lg text-slate-600">
        187 Runs
      </p>
    </div>

    <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
      <h2 className="text-2xl font-bold">
        🎯 Best Bowler
      </h2>

      <p className="mt-4 text-3xl font-extrabold text-[#071a52]">
        Farusath
      </p>

      <p className="mt-2 text-lg text-slate-600">
        10 Wickets
      </p>
    </div>

  </div>
</section>

        <section className="mt-16 rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-4xl font-extrabold">
            Participating Teams
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team}
                className="rounded-2xl border border-[#071a52]/20 bg-[#eef2ff] p-5 text-xl font-bold"
              >
                {team}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}