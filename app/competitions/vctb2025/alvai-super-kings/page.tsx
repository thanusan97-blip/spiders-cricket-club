import Link from "next/link";

const players = [
  "THUVA MURALI (Owner)",
  "ANUSHAN THEIVENDRAM",
  "JATHUSAN SATHANANTHASIVAM",
  "KETHEESWARANATHAN KURUPARAN",
  "SUTHARSHAN SABARATNAM",
  "SHARUBAN KANTHASAMY",
  "MIRESH SURENDRAN",
  "JEYARUPANARAJ INPARAJAH",
  "SATHIYA KAJENDRAN",
  "PRASHAN SUVENTHIRATHAS",
  "SUNTHUJAN UTHAYACHANDRAN",
  "PIRISHANKAR RAJASRIPRIYA",
  "ABI KANTHIRAJ",
  "RAHUL KULASEGARAM",
  "NIROOPAN PARANTHAMAN",
  "IMAYAVAN SINNAPPA",
  "GAVASKAR KANTHIRAJ",
  "THANUSHAN SUNDARLINGAM",
];

export default function AlvaiSuperKingsPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/competitions/vctb2025"
          className="font-bold hover:underline"
        >
          ← Back to VCTB 2025
        </Link>

        {/* TEAM HEADER */}
        <section className="mt-10 rounded-3xl bg-white p-10 shadow-lg">

          <h1 className="text-6xl font-extrabold">
            Alvai Super Kings
          </h1>

          <p className="mt-4 text-2xl text-slate-600">
            VCTB 2025 Squad
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {/* OWNER */}
            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">
                👑 Owner
              </h2>

              <p className="mt-4 text-xl">
                Thuva Murali & Sutha Mano
              </p>
            </div>

            {/* CAPTAIN */}
            <div className="rounded-2xl border border-[#071a52]/10 p-6">
              <h2 className="text-2xl font-bold">
                🏏 Captain
              </h2>

              <p className="mt-4 text-xl">
                Abi Kanthiraj
              </p>
            </div>

           {/* ACHIEVEMENT */}
<div className="rounded-2xl border border-[#071a52]/10 p-6">
  <h2 className="text-2xl font-bold">
    🏆 Achievement
  </h2>

  <p className="mt-4 text-xl">
    Group Stage
  </p>
</div>

          </div>
        </section>

        {/* SQUAD LIST */}
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