export default function CompetitionsPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-6 py-20 text-[#071a52]">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="font-bold">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-5xl font-black">
          Competitions
        </h1>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* BTCL */}
          <div className="rounded-3xl border border-[#071a52] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black">
              British Tamil Cricket League (BTCL)
            </h2>

            <p className="mt-3 text-slate-600">
              Official BTCL league competitions.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="https://btcl.play-cricket.com/website/division/137686"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border p-5 hover:bg-slate-50"
              >
                <h3 className="text-2xl font-black">
                  Season 2026
                </h3>

                <p className="mt-2 text-slate-600">
                  Division Challenge - Ongoing
                </p>

                <p className="mt-4 font-bold text-red-600">
                  View live BTCL table →
                </p>
              </a>

              <a
                href="/competitions/2025"
                className="block rounded-2xl border p-5 hover:bg-slate-50"
              >
                <h3 className="text-2xl font-black">
                  Season 2025
                </h3>

                <p className="mt-2 text-slate-600">
                  Division Classic and Chera B Group
                </p>

                <p className="mt-4 font-bold">
                  Open 2025 tables →
                </p>
              </a>

              <a
                href="/competitions/2024"
                className="block rounded-2xl border p-5 hover:bg-slate-50"
              >
                <h3 className="text-2xl font-black">
                  Season 2024
                </h3>

                <p className="mt-2 text-slate-600">
                  Division Platinum
                </p>

                <p className="mt-4 font-bold">
                  Open 2024 table →
                </p>
              </a>
            </div>
          </div>

          {/* VCTB */}
          <div className="rounded-3xl border border-[#071a52] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black">
              Vadamaradchy Champion T10 Blast (VCTB)
            </h2>

            <p className="mt-3 text-slate-600">
              VCTB tournament competitions.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border p-5">
                <h3 className="text-2xl font-black">
                  Season 2026
                </h3>

                <p className="mt-2 text-slate-600">
                  Tournament coming soon
                </p>

                <p className="mt-4 font-bold text-slate-400">
                  Coming Soon
                </p>
              </div>

              <a
                href="/competitions/vctb2025"
                className="block rounded-2xl border p-5 hover:bg-slate-50"
              >
                <h3 className="text-2xl font-black">
                  Season 2025
                </h3>

                <p className="mt-2 text-slate-600">
                  VCTB Tournament 2025
                </p>

                <p className="mt-4 font-bold">
                  Open 2025 competition →
                </p>
              </a>

              <a
                href="/competitions/vctb2024"
                className="block rounded-2xl border p-5 hover:bg-slate-50"
              >
                <h3 className="text-2xl font-black">
                  Season 2024
                </h3>

                <p className="mt-2 text-slate-600">
                  VCTB Tournament 2024
                </p>

                <p className="mt-4 font-bold">
                  Open 2024 competition →
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}