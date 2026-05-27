import Image from "next/image";

export default function Competition2025() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-[#071a52] md:px-6">
      
      {/* BACKGROUND IMAGE */}
      <Image
        src="/competitions/season-2025-bg.jpg"
        alt="Season 2025 Background"
        fill
        priority
        className="object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[1px]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-5xl scale-[0.88] origin-top">

        {/* BACK BUTTON */}
        <a
          href="/competitions"
          className="mb-8 inline-block font-bold hover:underline"
        >
          ← Back to Competitions
        </a>

        {/* TITLE */}
        <h1 className="text-4xl font-black md:text-6xl">
          Season 2025
        </h1>

        <p className="mt-3 text-xl text-slate-600 md:text-2xl">
          Division Classic & Chera B Group
        </p>

        {/* DIVISION CLASSIC */}
        <div className="mt-10 overflow-hidden rounded-3xl border bg-white/85 shadow-xl backdrop-blur-sm">

          <div className="bg-[#071a52] px-6 py-4 text-white md:px-8">
            <h2 className="text-2xl font-black md:text-3xl">
              Division Classic 2025
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

                <tr className="border-t">
                  <td className="p-4">1</td>
                  <td className="p-4">Yarl Gents CC - 1st XI</td>
                  <td className="p-4">14</td>
                  <td className="p-4">9</td>
                  <td className="p-4">4</td>
                  <td className="p-4">29</td>
                  <td className="p-4">1.02</td>
                  <td className="p-4 font-bold">219</td>
                </tr>

                <tr className="border-t bg-slate-50 font-bold">
                  <td className="p-4">2</td>
                  <td className="p-4">Spiders Sports Club UK - 1st XI</td>
                  <td className="p-4">14</td>
                  <td className="p-4">9</td>
                  <td className="p-4">4</td>
                  <td className="p-4">22</td>
                  <td className="p-4">0.46</td>
                  <td className="p-4">212</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">3</td>
                  <td className="p-4">West 3 CC - West 3 Blue</td>
                  <td className="p-4">14</td>
                  <td className="p-4">8</td>
                  <td className="p-4">5</td>
                  <td className="p-4">33</td>
                  <td className="p-4">1.31</td>
                  <td className="p-4">203</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">4</td>
                  <td className="p-4">Hartleyites Sports Club - 2nd XI</td>
                  <td className="p-4">14</td>
                  <td className="p-4">8</td>
                  <td className="p-4">5</td>
                  <td className="p-4">32</td>
                  <td className="p-4">0.63</td>
                  <td className="p-4">202</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">5</td>
                  <td className="p-4">Kotahena Lankans CC - 1st XI</td>
                  <td className="p-4">14</td>
                  <td className="p-4">6</td>
                  <td className="p-4">7</td>
                  <td className="p-4">44</td>
                  <td className="p-4">0.15</td>
                  <td className="p-4">174</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* CHERA GROUP */}
        <div className="mt-10 overflow-hidden rounded-3xl border bg-white/85 shadow-xl backdrop-blur-sm">

          <div className="bg-[#071a52] px-6 py-4 text-white md:px-8">
            <h2 className="text-2xl font-black md:text-3xl">
              Chera B Group 2025
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm md:text-base">

              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="p-4">Pos</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">P</th>
                  <th className="p-4">W</th>
                  <th className="p-4">L</th>
                  <th className="p-4">NRR</th>
                  <th className="p-4">Pts</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-t">
                  <td className="p-4">1</td>
                  <td className="p-4">Spartans CC</td>
                  <td className="p-4">4</td>
                  <td className="p-4">3</td>
                  <td className="p-4">1</td>
                  <td className="p-4">-0.07</td>
                  <td className="p-4 font-bold">6</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">2</td>
                  <td className="p-4">Croydon United CC</td>
                  <td className="p-4">4</td>
                  <td className="p-4">2</td>
                  <td className="p-4">2</td>
                  <td className="p-4">0.14</td>
                  <td className="p-4">4</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">3</td>
                  <td className="p-4">Hartleyites Sports Club</td>
                  <td className="p-4">4</td>
                  <td className="p-4">2</td>
                  <td className="p-4">2</td>
                  <td className="p-4">0.08</td>
                  <td className="p-4">4</td>
                </tr>

                <tr className="border-t bg-slate-50 font-bold">
                  <td className="p-4">4</td>
                  <td className="p-4">Spiders Sports Club UK</td>
                  <td className="p-4">4</td>
                  <td className="p-4">2</td>
                  <td className="p-4">2</td>
                  <td className="p-4">0.03</td>
                  <td className="p-4">4</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">5</td>
                  <td className="p-4">V Mahavidyans CC</td>
                  <td className="p-4">4</td>
                  <td className="p-4">1</td>
                  <td className="p-4">3</td>
                  <td className="p-4">-0.19</td>
                  <td className="p-4">2</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}