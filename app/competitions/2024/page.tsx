export default function Competition2024() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-[#071a52]">
      <div className="mx-auto max-w-7xl">

        <a
          href="/competitions"
          className="mb-10 inline-block font-bold hover:underline"
        >
          ← Back to Competitions
        </a>

        <h1 className="text-6xl font-black">Season 2024</h1>

        <p className="mt-4 text-2xl text-slate-600">
          Division Platinum
        </p>

        {/* PLATINUM TABLE */}

        <div className="mt-14 overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="bg-[#071a52] px-8 py-6 text-white">
            <h2 className="text-3xl font-black">
              Platinum Division 2024
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-5">Pos</th>
                <th className="p-5">Team</th>
                <th className="p-5">P</th>
                <th className="p-5">W</th>
                <th className="p-5">L</th>
                <th className="p-5">BP</th>
                <th className="p-5">NRR</th>
                <th className="p-5">Pts</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t">
                <td className="p-5">1</td>
                <td className="p-5">West 3 CC - West 3 Blue</td>
                <td className="p-5">16</td>
                <td className="p-5">13</td>
                <td className="p-5">1</td>
                <td className="p-5">3.11</td>
                <td className="p-5">3.11</td>
                <td className="p-5 font-bold">298</td>
              </tr>

              <tr className="border-t bg-slate-50 font-bold">
                <td className="p-5">2</td>
                <td className="p-5">Spiders Sports Club UK - 1st XI</td>
                <td className="p-5">16</td>
                <td className="p-5">14</td>
                <td className="p-5">2</td>
                <td className="p-5">3.80</td>
                <td className="p-5">3.80</td>
                <td className="p-5">289</td>
              </tr>

              <tr className="border-t">
                <td className="p-5">3</td>
                <td className="p-5">Young Royals CC - B</td>
                <td className="p-5">16</td>
                <td className="p-5">9</td>
                <td className="p-5">5</td>
                <td className="p-5">1.27</td>
                <td className="p-5">1.27</td>
                <td className="p-5">244</td>
              </tr>

              <tr className="border-t">
                <td className="p-5">4</td>
                <td className="p-5">Tamil Union CC - 2nd XI</td>
                <td className="p-5">16</td>
                <td className="p-5">9</td>
                <td className="p-5">6</td>
                <td className="p-5">1.20</td>
                <td className="p-5">1.20</td>
                <td className="p-5">229</td>
              </tr>

              <tr className="border-t">
                <td className="p-5">5</td>
                <td className="p-5">Harrow Tamils CC - 1st XI</td>
                <td className="p-5">16</td>
                <td className="p-5">5</td>
                <td className="p-5">8</td>
                <td className="p-5">-0.81</td>
                <td className="p-5">-0.81</td>
                <td className="p-5">186</td>
              </tr>

              <tr className="border-t">
                <td className="p-5">6</td>
                <td className="p-5">Michaelmen SC - 1st XI</td>
                <td className="p-5">16</td>
                <td className="p-5">5</td>
                <td className="p-5">8</td>
                <td className="p-5">-0.34</td>
                <td className="p-5">-0.34</td>
                <td className="p-5">179</td>
              </tr>

              <tr className="border-t">
                <td className="p-5">7</td>
                <td className="p-5">Redbridge United CC - 2nd XI</td>
                <td className="p-5">16</td>
                <td className="p-5">5</td>
                <td className="p-5">10</td>
                <td className="p-5">-1.58</td>
                <td className="p-5">-1.58</td>
                <td className="p-5">175</td>
              </tr>

              <tr className="border-t">
                <td className="p-5">8</td>
                <td className="p-5">Royal Elite Strikers CC - 1st XI</td>
                <td className="p-5">15</td>
                <td className="p-5">2</td>
                <td className="p-5">9</td>
                <td className="p-5">-3.37</td>
                <td className="p-5">-3.37</td>
                <td className="p-5">92</td>
              </tr>

              <tr className="border-t">
                <td className="p-5">9</td>
                <td className="p-5">Vaddukoddai CC - Development</td>
                <td className="p-5">15</td>
                <td className="p-5">0</td>
                <td className="p-5">13</td>
                <td className="p-5">-5.61</td>
                <td className="p-5">-5.61</td>
                <td className="p-5">42</td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}