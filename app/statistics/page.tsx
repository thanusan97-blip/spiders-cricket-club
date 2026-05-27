export default function StatisticsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-[#071a52]">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/competitions/stat-bg.jpg"
          alt="Statistics Background"
          className="h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#eef2ff]/85 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <a href="/" className="font-bold">
            ← Back to Home
          </a>

          <h1 className="mt-8 text-5xl font-black md:text-6xl">
            Statistics
          </h1>

          <p className="mt-4 text-lg text-slate-700 md:text-xl">
            Batting, bowling and fielding statistics.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {/* 2026 */}
            <a
              href="https://spidersscuk.play-cricket.com/Statistics"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl border border-[#071a52]/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h2 className="text-3xl font-black md:text-4xl">
                Season 2026
              </h2>

              <p className="mt-3 text-slate-700">
                Ongoing live statistics
              </p>

              <p className="mt-6 font-bold text-red-700">
                View live 2026 stats →
              </p>
            </a>

            {/* 2025 */}
            <a
              href="/statistics/2025"
              className="rounded-3xl border border-[#071a52]/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h2 className="text-3xl font-black md:text-4xl">
                Season 2025
              </h2>

              <p className="mt-3 text-slate-700">
                Independent batting, bowling and fielding stats
              </p>

              <p className="mt-6 font-bold text-[#071a52]">
                Open 2025 stats →
              </p>
            </a>

            {/* 2024 */}
            <a
              href="/statistics/2024"
              className="rounded-3xl border border-[#071a52]/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h2 className="text-3xl font-black md:text-4xl">
                Season 2024
              </h2>

              <p className="mt-3 text-slate-700">
                Independent batting, bowling and fielding stats
              </p>

              <p className="mt-6 font-bold text-[#071a52]">
                Open 2024 stats →
              </p>
            </a>

          </div>
        </div>
      </div>
    </main>
  );
}