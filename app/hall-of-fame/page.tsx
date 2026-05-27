const seasons = [
  {
    year: "2025",
    batting: [
      { name: "Satheeshram Chandrasegaram", stat: "325", label: "Runs", extra: "Highest Score 89" },
      { name: "Ajanthan Thiraviyarasa", stat: "306", label: "Runs", extra: "Highest Score 65" },
      { name: "Thakeesan Thiraviyarasa", stat: "283", label: "Runs", extra: "Highest Score 54" },
      { name: "Haseeb Ali", stat: "149", label: "Highest Individual Score", extra: "149 Runs" },
    ],
    bowling: [
      { name: "Satheeshram Chandrasegaram", stat: "31", label: "Wickets", extra: "Best Figure 6/34" },
      { name: "Thiruchselvam Arulprakash", stat: "24", label: "Wickets", extra: "Best Figure 4/41" },
      { name: "Ajanthan Thiraviyarasa", stat: "19", label: "Wickets", extra: "Best Figure 4/25" },
      { name: "Satheeshram Chandrasegaram", stat: "6/34", label: "Highest Individual Figure", extra: "Best Bowling Figure" },
    ],
  },
  {
    year: "2024",
    batting: [
      { name: "Thiruchselvam Arulprakash", stat: "729", label: "Runs", extra: "Highest Score 200" },
      { name: "Ajanthan Thiraviyarasa", stat: "532", label: "Runs", extra: "Highest Score 87" },
      { name: "Satheeshram Chandrasegaram", stat: "500", label: "Runs", extra: "Highest Score 163" },
      { name: "Thiruchselvam Arulprakash", stat: "200", label: "Highest Individual Score", extra: "200 Runs" },
    ],
    bowling: [
      { name: "Satheeshram Chandrasegaram", stat: "34", label: "Wickets", extra: "Best Figure 6/41" },
      { name: "Thiruchselvam Arulprakash", stat: "28", label: "Wickets", extra: "Best Figure 5/22" },
      { name: "Ajanthan Thiraviyarasa", stat: "20", label: "Wickets", extra: "Best Figure 4/19" },
      { name: "Satheeshram Chandrasegaram", stat: "6/41", label: "Highest Individual Figure", extra: "Best Bowling Figure" },
    ],
  },
];

export default function HallOfFamePage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-4 py-10 text-[#071a52] md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="font-bold hover:underline">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-5xl font-black md:text-6xl">
          Hall of Fame
        </h1>

        {seasons.map((season) => (
          <section key={season.year} className="mt-12">
            <h2 className="text-4xl font-black">Season {season.year}</h2>

            <h3 className="mt-8 text-2xl font-black">Batting</h3>
            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {season.batting.map((item) => (
                <HallCard key={`${season.year}-${item.name}-${item.label}`} item={item} type="batting" />
              ))}
            </div>

            <h3 className="mt-10 text-2xl font-black">Bowling</h3>
            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {season.bowling.map((item) => (
                <HallCard key={`${season.year}-${item.name}-${item.label}`} item={item} type="bowling" />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function HallCard({
  item,
  type,
}: {
  item: { name: string; stat: string; label: string; extra: string };
  type: "batting" | "bowling";
}) {
  const colour = type === "batting" ? "bg-cyan-400" : "bg-red-500";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#073b63] p-6 text-white shadow-xl">
      <div className="absolute -right-10 top-0 h-full w-20 bg-white/10" />

      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-300 text-4xl">
          👤
        </div>

        <div>
          <p className={`inline-block rounded-full px-3 py-1 text-sm font-black text-[#071a52] ${colour}`}>
            {item.label}
          </p>

          <h2 className="mt-3 text-4xl font-black text-cyan-300">
            {item.stat}
          </h2>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-black uppercase">
          {item.name}
        </h3>

        <p className="mt-2 text-sm text-slate-300">
          {item.extra}
        </p>
      </div>
    </div>
  );
}