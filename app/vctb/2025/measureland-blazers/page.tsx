import Link from "next/link";

const players = [
  "RAMANAN RASANEHRU (Owner)",
  "PIRASATH JEEVA",
  "RAGU SETHU",
  "JASITHARAN SELLACHAMI",
  "SHARON SATHYAMOORTHY",
  "KUPERAN YOGANATHAN",
  "SATHEESRAM CHANDRASEGARAM",
  "KALKHOGAN JELAM",
  "PRAGASH RAMACHANDRAN",
  "DIKSON MANOKARASA",
  "NIRUSHAN VICKNESWARAN",
  "HARSAN PUSPARAJA",
  "THISANTH SRISHANGAR",
  "KANAGARATNAM KABILRAJ",
  "SANJOPAN JEYATHEESAN",
  "NIRANCHAN T",
  "JOE CLEMENT RAJ",
  "ANTON THANURAJ",
];

export default function MeasurelandBlazersPage() {
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
          <span className="font-semibold text-[#071a52]">Measureland Blazers</span>
        </div>

        <section className="mt-10 rounded-3xl bg-white p-10 shadow-lg">
          <h1 className="text-6xl font-extrabold">Measureland Blazers</h1>
          <p className="mt-4 text-2xl text-slate-600">VCTB 2025 Squad</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">👑 Owner</h2>
              <p className="mt-4 text-xl">Ramanan Rasaneru</p>
            </div>
            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">🏏 Captain</h2>
              <p className="mt-4 text-xl">Pirasath Jeeva</p>
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