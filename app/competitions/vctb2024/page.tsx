import Link from "next/link";

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
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold md:text-base">
  <Link href="/" className="text-slate-500 hover:text-[#071a52] hover:underline">
    Home
  </Link>

  <span className="text-slate-400">›</span>

  <Link
    href="/competitions"
    className="text-slate-500 hover:text-[#071a52] hover:underline"
  >
    Competitions
  </Link>

  <span className="text-slate-400">›</span>

  <span className="text-[#071a52]">
    VCTB 2024
  </span>
</div>

        <h1 className="mt-8 text-6xl font-extrabold">VCTB 2024</h1>

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
              Point Pedro Rangers
            </p>
          </div>
        </div>

        <section className="mt-16 rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-4xl font-extrabold">Participating Teams</h2>

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