import Link from "next/link";

const players = [
  "NIROJAN UTHAYASANGAR (Owner)",
  "JEYAVARMAN SIVA",
  "VYKUNTHAN PANCHAVARANAN",
  "SATHEESWARAN KANAGARATNAM",
  "PRASANNA GANESHALINGAM",
  "THEEP SUBATHIRAJA",
  "LOKI THILAKSAN",
  "JEGENDRAN RASALINGAM",
  "BALA RAJAH",
  "ZAID FALEEL",
  "SESHASAYEE KAMALENDRAN",
  "MANIKANDAN KUNNAIYAN",
  "ABHISHEKAN AYANNAN SRINIVASAN",
  "MATHUSUTHAN RABINDRANATH",
  "YATHUSAN KANAKALINGAM",
  "ASWIN UNNIKRISHNAN",
  "MAHESWARAN BAKEERATHAN",
  "RAMAKRISHNAN SIVANATHAN",
];

export default function PointPedroRangersPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/competitions/vctb2025"
          className="font-bold hover:underline"
        >
          ← Back to VCTB 2025
        </Link>

        <section className="mt-10 rounded-3xl bg-white p-10 shadow-lg">

          <h1 className="text-6xl font-extrabold">
            Point Pedro Rangers
          </h1>

          <p className="mt-4 text-2xl text-slate-600">
            VCTB 2025 Squad
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">
                👑 Owner
              </h2>

              <p className="mt-4 text-xl">
                Nirojan Uthayasangar
              </p>
            </div>

            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">
                🏏 Captain
              </h2>

              <p className="mt-4 text-xl">
                Satheeswaran Kanagaratnam
              </p>
            </div>

            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">
                🏆 Achievement
              </h2>

              <p className="mt-4 text-xl">
                Playoffs
              </p>
            </div>

          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-white p-10 shadow-lg">

          <h2 className="text-4xl font-extrabold">
            Squad List
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {players.map((player) => (
              <div
                key={player}
                className="rounded-2xl border border-[#071a52]/10 bg-[#eef2ff] p-5 text-lg font-bold transition hover:scale-105 hover:bg-white"
              >
                {player}
              </div>
            ))}

          </div>
        </section>

      </div>
    </main>
  );
}