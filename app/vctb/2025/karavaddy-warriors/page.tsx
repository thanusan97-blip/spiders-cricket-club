import Link from "next/link";

const players = [
  "DINALAN NALLAGURUNATHAN",
  "MATHUMITHAN SENTHILKUMAR",
  "UMAISUTHAN JEYAVARATHARASA",
  "SIVANANTHAN SHAJEETH",
  "SATHEESWARAN SIVANESAN",
  "KIRITHARAN KAMALANATHAN",
  "VINOTHAN RUBASINGAM",
  "ANTON ABISHEK",
  "SUWETHAN JEYAMOHAN",
  "MOHAMMED SHIHAN",
  "SUTHA KAILASAPILLAI",
  "FAUZUL KIBREETH MOHAMED RAMIZ",
  "KIRUSHOBAN GIRIHARAN",
  "DINOSHAN THEIVENDRAM",
  "AYNKARAN SUBRAMANIAM",
  "JAGATH JEEVAN",
];

export default function KaravaddyWarriorsPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
          <Link href="/" className="text-slate-500 hover:text-[#071a52] hover:underline">Home</Link>
          <span className="text-slate-400">›</span>
          <Link href="/vctb" className="text-slate-500 hover:text-[#071a52] hover:underline">VCTB</Link>
          <span className="text-slate-400">›</span>
          <Link href="/vctb/2025" className="text-slate-500 hover:text-[#071a52] hover:underline">VCTB 2025</Link>
          <span className="text-slate-400">›</span>
          <span className="font-semibold text-[#071a52]">Karavaddy Warriors</span>
        </div>

        <section className="mt-10 rounded-3xl bg-white p-10 shadow-lg">
          <h1 className="text-6xl font-extrabold">Karavaddy Warriors</h1>
          <p className="mt-4 text-2xl text-slate-600">VCTB 2025 Squad</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">👑 Owner</h2>
              <p className="mt-4 text-xl">George Arun & R. Janagan</p>
            </div>
            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">🏏 Captain</h2>
              <p className="mt-4 text-xl">Dinalan Nallagurunathan</p>
            </div>
            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">🏆 Achievement</h2>
              <p className="mt-4 text-xl">Group Stage</p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-white p-10 shadow-lg">
          <h2 className="text-4xl font-extrabold">Squad List</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <div key={player} className="rounded-2xl border border-[#071a52]/10 bg-[#eef2ff] p-5 text-lg font-bold transition hover:scale-105 hover:bg-white">{player}</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}