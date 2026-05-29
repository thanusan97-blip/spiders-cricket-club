import Link from "next/link";

export default function Statistics2024() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold md:text-base">
  <Link
    href="/"
    className="text-slate-500 hover:text-[#071a52] hover:underline"
  >
    Home
  </Link>

  <span className="text-slate-400">›</span>

  <Link
    href="/statistics"
    className="text-slate-500 hover:text-[#071a52] hover:underline"
  >
    Statistics
  </Link>

  <span className="text-slate-400">›</span>

  <span className="text-[#071a52]">
    Season 2024
  </span>
</div>

        <h1 className="mt-8 text-6xl font-black">Season 2024 Statistics</h1>

        <p className="mt-4 text-2xl text-slate-600">
          Batting, bowling and fielding statistics.
        </p>

        <StatsTable
          title="Batting"
          headers={["Rank", "Player", "Games", "Inns", "Not Outs", "Runs", "High Score", "Avg", "50s", "100s", "Strike Rate"]}
          rows={[
            ["1", "Thiruchselvam Arulprakash", "16", "15", "3", "729", "200*", "60.75", "4", "1", "131.84"],
            ["2", "Ajanthan Thiraviyarasa", "16", "12", "4", "532", "87*", "66.50", "7", "0", "144.17"],
            ["3", "Satheeshram Chandrasegaram", "16", "13", "1", "500", "163", "41.67", "2", "1", "118.48"],
            ["4", "Vijitharan Pulendran", "16", "14", "4", "351", "85*", "35.10", "0", "1", "123.30"],
            ["5", "Premkumar Coonghe Juthathatheyu", "15", "13", "0", "295", "105", "22.69", "1", "1", "86.76"],
            ["6", "Thakeesan Thiraviyarasa", "15", "14", "1", "276", "100*", "21.23", "0", "1", "61.06"],
            ["7", "Praveen Kumar Croos Anthonimuthu", "10", "10", "3", "251", "74", "35.86", "2", "0", "81.85"],
            ["8", "Balaguru Thiruveragan", "10", "6", "2", "103", "74*", "25.75", "1", "0", "108.42"],
            ["9", "Jeeva Cr", "12", "8", "1", "99", "41", "14.14", "0", "0", "77.95"],
            ["10", "Dirooban Yogarajah", "11", "8", "2", "91", "29*", "15.17", "0", "0", "86.67"],
          ]}
        />

        <StatsTable
          title="Bowling"
          headers={["Rank", "Player", "Overs", "Maidens", "Runs", "Wickets", "Best Bowling", "5 Wicket Haul", "Economy", "Strike Rate", "Average"]}
          rows={[
            ["1", "Satheeshram Chandrasegaram", "92", "11", "401", "34", "6/41", "1", "4.36", "16.24", "11.79"],
            ["2", "Thiruchselvam Arulprakash", "71", "9", "289", "28", "5/22", "1", "4.07", "15.21", "10.32"],
            ["3", "Ajanthan Thiraviyarasa", "54", "6", "240", "20", "4/19", "0", "4.44", "16.20", "12.00"],
            ["4", "Praveen Kumar Croos Anthonimuthu", "47", "5", "218", "14", "4/33", "0", "4.63", "20.14", "15.57"],
            ["5", "Vijitharan Pulendran", "24", "1", "126", "8", "3/25", "0", "5.25", "18.00", "15.75"],
            ["6", "Ronald Ettienne", "15", "2", "74", "7", "3/17", "0", "4.93", "12.85", "10.57"],
            ["7", "Nirojan Arulnathan", "20", "3", "101", "6", "2/18", "0", "5.05", "20.00", "16.83"],
            ["8", "Thakeesan Thiraviyarasa", "18", "0", "122", "4", "2/24", "0", "6.77", "27.00", "30.50"],
            ["9", "Birunthaban Selvakumar", "10", "1", "61", "3", "2/20", "0", "6.10", "20.00", "20.33"],
            ["10", "Jeeva Cr", "8", "0", "54", "2", "1/16", "0", "6.75", "24.00", "27.00"],
          ]}
        />

        <StatsTable
          title="Fielding"
          headers={["Rank", "Player", "WK Catches", "Stumpings", "Total WK Wickets", "Fielding Catches", "Run Outs", "Total Fielding Wickets", "Total Catches", "Total Victims"]}
          rows={[
            ["1", "Jeeva Cr", "15", "1", "16", "0", "1", "1", "15", "17"],
            ["2", "Ajanthan Thiraviyarasa", "0", "0", "0", "16", "1", "17", "16", "17"],
            ["3", "Satheeshram Chandrasegaram", "0", "0", "0", "11", "0", "11", "11", "11"],
            ["4", "Praveen Kumar Croos Anthonimuthu", "0", "0", "0", "8", "1", "9", "8", "9"],
            ["5", "Thiruchselvam Arulprakash", "0", "0", "0", "7", "0", "7", "7", "7"],
            ["6", "Vijitharan Pulendran", "0", "0", "0", "5", "1", "6", "5", "6"],
          ]}
        />
      </div>
    </main>
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
    <div className="mt-12 overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="bg-[#071a52] px-8 py-6 text-white">
        <h2 className="text-3xl font-black">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100 text-left">
            <tr>
              {headers.map((header) => (
                <th key={header} className="p-4 text-sm font-black">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={`${title}-${row[0]}`}
                className="border-t hover:bg-slate-50"
              >
                {row.map((cell, index) => (
                  <td
                    key={`${title}-${row[0]}-${index}`}
                    className={
                      index === 1
                        ? "p-4 font-bold text-[#071a52]"
                        : "p-4 text-slate-700"
                    }
                  >
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