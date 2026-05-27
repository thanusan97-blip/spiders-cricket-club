import Image from "next/image";

export default function Competition2024() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-[#071a52] md:px-6">
      <Image
        src="/competitions/season-2025-bg.jpg"
        alt="Season 2024 Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />

      <div className="relative z-10 mx-auto max-w-5xl scale-[0.88] origin-top">
        <a href="/competitions" className="mb-8 inline-block font-bold hover:underline">
          ← Back to Competitions
        </a>

        <h1 className="text-4xl font-black md:text-6xl">Season 2024</h1>

        <p className="mt-3 text-xl text-slate-600 md:text-2xl">
          Division Platinum
        </p>

        <div className="mt-10 overflow-hidden rounded-3xl border bg-white/85 shadow-xl backdrop-blur-sm">
          <div className="bg-[#071a52] px-6 py-4 text-white md:px-8">
            <h2 className="text-2xl font-black md:text-3xl">
              Platinum Division 2024
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm md:text-base">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="p-4">Pos</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">P</th>
                  <th className="p-4">W</th>
                  <th className="p-4">L</th>
                  <th className="p-4">BP</th>
                  <th className="p-4">NRR</th>
                  <th className="p-4">Pts</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["1", "West 3 CC - West 3 Blue", "16", "13", "1", "3.11", "3.11", "298"],
                  ["2", "Spiders Sports Club UK - 1st XI", "16", "14", "2", "3.80", "3.80", "289"],
                  ["3", "Young Royals CC - B", "16", "9", "5", "1.27", "1.27", "244"],
                  ["4", "Tamil Union CC - 2nd XI", "16", "9", "6", "1.20", "1.20", "229"],
                  ["5", "Harrow Tamils CC - 1st XI", "16", "5", "8", "-0.81", "-0.81", "186"],
                  ["6", "Michaelmen SC - 1st XI", "16", "5", "8", "-0.34", "-0.34", "179"],
                  ["7", "Redbridge United CC - 2nd XI", "16", "5", "10", "-1.58", "-1.58", "175"],
                  ["8", "Royal Elite Strikers CC - 1st XI", "15", "2", "9", "-3.37", "-3.37", "92"],
                  ["9", "Vaddukoddai CC - Development", "15", "0", "13", "-5.61", "-5.61", "42"],
                ].map((row) => (
                  <tr
                    key={row[0]}
                    className={`border-t ${
                      row[1].includes("Spiders") ? "bg-slate-50 font-bold" : ""
                    }`}
                  >
                    {row.map((cell) => (
                      <td key={cell} className="p-4">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}