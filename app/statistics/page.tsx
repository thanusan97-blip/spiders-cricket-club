export default function StatisticsPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="font-bold">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-5xl font-black">
          Statistics
        </h1>

        <p className="mt-4 text-xl text-slate-600">
          Batting, bowling and fielding statistics.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <a
            href="https://spidersscuk.play-cricket.com/Statistics"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-[#071a52] bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <h2 className="text-3xl font-black">
              Season 2026
            </h2>

            <p className="mt-3 text-slate-600">
              Ongoing live statistics
            </p>

            <p className="mt-6 font-bold text-red-700">
              View live 2026 stats →
            </p>
          </a>

          <a
            href="/statistics/2025"
            className="rounded-2xl border border-[#071a52] bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <h2 className="text-3xl font-black">
              Season 2025
            </h2>

            <p className="mt-3 text-slate-600">
              Independent batting, bowling and fielding stats
            </p>

            <p className="mt-6 font-bold text-[#071a52]">
              Open 2025 stats →
            </p>
          </a>

          <a
            href="/statistics/2024"
            className="rounded-2xl border border-[#071a52] bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <h2 className="text-3xl font-black">
              Season 2024
            </h2>

            <p className="mt-3 text-slate-600">
              Independent batting, bowling and fielding stats
            </p>

            <p className="mt-6 font-bold text-[#071a52]">
              Open 2024 stats →
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}