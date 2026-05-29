import Link from "next/link";

export default function Statistics2025() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-10 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        {/* BREADCRUMB */}
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

          <span className="text-[#071a52]">Season 2025</span>
        </div>

        <h1 className="mt-8 text-6xl font-black">Season 2025 Statistics</h1>

        <p className="mt-4 text-2xl text-slate-600">
          Batting, bowling and fielding statistics.
        </p>

        <StatsTable
          title="Batting"
          headers={["Rank", "Player", "Games", "Inns", "Not Outs", "Runs", "High Score", "Avg", "50s", "100s", "Strike Rate"]}
          rows={[
            ["1", "Satheeshram Chandrasegaram", "17", "17", "1", "325", "89", "20.31", "2", "0", "112.21"],
            ["2", "Ajanthan Thiraviyarasa", "16", "16", "2", "306", "65", "21.86", "1", "0", "100.69"],
            ["3", "Thakeesan Thiraviyarasa", "14", "14", "3", "283", "54", "25.73", "2", "0", "56.88"],
            ["4", "Haseeb Ali", "4", "4", "0", "245", "149", "61.25", "1", "1", "124.37"],
            ["5", "Praveen Kumar Croos Anthonimuthu", "15", "15", "1", "208", "32", "14.86", "0", "0", "98.10"],
            ["6", "Thiruchselvam Arulprakash", "13", "13", "0", "168", "55", "12.92", "1", "0", "84.85"],
            ["7", "Vijitharan Pulendran", "16", "14", "2", "111", "32*", "9.25", "0", "0", "49.07"],
            ["8", "Birunthaban Selvakumar", "13", "12", "2", "96", "20", "9.60", "0", "0", "59.48"],
            ["9", "Piratheepan Kailayapillai", "13", "12", "4", "83", "32", "10.38", "0", "0", "67.48"],
            ["10", "Jeeva Cr", "17", "14", "2", "79", "21", "6.58", "0", "0", "53.38"],
          ]}
        />

        <StatsTable
          title="Bowling"
          headers={["Rank", "Player", "Overs", "Maidens", "Runs", "Wickets", "Best Bowling", "5 Wicket Haul", "Economy", "Strike Rate", "Average"]}
          rows={[
            ["1", "Satheeshram Chandrasegaram", "83.5", "9", "363", "31", "6/34", "1", "4.33", "16.23", "11.71"],
            ["2", "Thiruchselvam Arulprakash", "67", "11", "261", "24", "4/41", "0", "3.90", "16.75", "10.88"],
            ["3", "Ajanthan Thiraviyarasa", "38", "4", "198", "19", "4/25", "0", "5.21", "12.00", "10.42"],
            ["4", "Praveen Kumar Croos Anthonimuthu", "54.1", "8", "226", "15", "5/37", "1", "4.17", "21.67", "15.07"],
            ["5", "Nirojan Arulnathan", "22", "2", "74", "7", "3/19", "0", "3.36", "18.86", "10.57"],
            ["6", "Ronald Ettienne", "10.5", "4", "24", "6", "3/9", "0", "2.22", "10.83", "4.00"],
            ["7", "Thakeesan Thiraviyarasa", "25", "0", "178", "4", "2/24", "0", "7.12", "37.50", "44.50"],
            ["8", "Vijitharan Pulendran", "8.3", "1", "49", "3", "2/20", "0", "5.76", "17.00", "16.33"],
            ["9", "Birunthaban Selvakumar", "8", "0", "56", "2", "1/12", "0", "7.00", "24.00", "28.00"],
            ["10", "Vijitharan Vijayarathnam", "12", "2", "54", "2", "1/17", "0", "4.50", "36.00", "27.00"],
          ]}
        />

        <StatsTable
          title="Fielding"
          headers={["Rank", "Player", "WK Catches", "Stumpings", "Total WK Wickets", "Fielding Catches", "Run Outs", "Total Fielding Wickets", "Total Catches", "Total Victims"]}
          rows={[
            ["1", "Jeeva Cr", "13", "0", "13", "0", "1", "1", "13", "14"],
            ["2", "Ajanthan Thiraviyarasa", "0", "0", "0", "14", "0", "14", "14", "14"],
            ["3", "Satheeshram Chandrasegaram", "0", "0", "0", "8", "0", "8", "8", "8"],
            ["4", "Praveen Kumar Croos Anthonimuthu", "0", "0", "0", "6", "0", "6", "6", "6"],
            ["5", "Thiruchselvam Arulprakash", "0", "0", "0", "4", "1", "5", "4", "5"],
            ["6", "Vijitharan Pulendran", "0", "0", "0", "2", "0", "2", "2", "2"],
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
              <tr key={`${title}-${row[0]}`} className="border-t hover:bg-slate-50">
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