import Link from "next/link";
import Image from "next/image";

export default function CompetitionsPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] px-4 py-16 text-[#071a52] md:px-6 md:py-24">

      <div className="mx-auto max-w-7xl">

        <Link
          href="/"
          className="mb-10 inline-block font-semibold hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-12 text-4xl font-extrabold md:mb-16 md:text-6xl">
          Competitions
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* BTCL */}
          <div className="rounded-3xl border border-[#071a52] bg-white p-6 shadow-lg md:p-8">

            <div className="mb-8 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">

              <Image
                src="/competitions/btcl.png"
                alt="BTCL"
                width={90}
                height={90}
                className="rounded-2xl object-contain"
              />

              <div>
                <h2 className="text-3xl font-extrabold md:text-4xl">
                  British Tamil Cricket League (BTCL)
                </h2>

                <p className="mt-3 text-xl text-slate-600">
                  Official BTCL league competitions.
                </p>
              </div>

            </div>

            <div className="space-y-6">

              <div className="rounded-3xl border border-[#071a52] p-6">

                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2026
                </h3>

                <p className="mt-3 text-lg">
                  Division Challenge - Ongoing
                </p>

                <a
                  href="https://btcl.play-cricket.com/website/division/137686"
                  target="_blank"
                  className="mt-4 inline-block text-lg font-bold text-red-600"
                >
                  View live BTCL table →
                </a>

              </div>

              <div className="rounded-3xl border border-[#071a52] p-6">

                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2025
                </h3>

                <p className="mt-3 text-lg">
                  Division Classic and Chera B Group
                </p>

                <a
                  href="/competitions/2025"
                  className="mt-4 inline-block text-lg font-bold"
                >
                  Open 2025 tables →
                </a>

              </div>

              <div className="rounded-3xl border border-[#071a52] p-6">

                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2024
                </h3>

                <p className="mt-3 text-lg">
                  Division Platinum
                </p>

                <a
                  href="/competitions/2024"
                  className="mt-4 inline-block text-lg font-bold"
                >
                  Open 2024 table →
                </a>

              </div>

            </div>
          </div>

          {/* VCTB */}
          <div className="rounded-3xl border border-[#071a52] bg-white p-6 shadow-lg md:p-8">

            <div className="mb-8 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">

              <Image
                src="/competitions/vctb.png"
                alt="VCTB"
                width={120}
                height={120}
                className="rounded-2xl object-contain"
              />

              <div>
                <h2 className="text-3xl font-extrabold md:text-4xl">
                  Vadamaradchy Champion T10 Blast (VCTB)
                </h2>

                <p className="mt-3 text-xl text-slate-600">
                  VCTB tournament competitions.
                </p>
              </div>

            </div>

            <div className="space-y-6">

              <div className="rounded-3xl border border-[#071a52] p-6">

                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2026
                </h3>

                <p className="mt-3 text-lg">
                  Tournament coming soon
                </p>

                <span className="mt-4 inline-block text-lg font-bold text-slate-400">
                  Coming Soon
                </span>

              </div>

              <div className="rounded-3xl border border-[#071a52] p-6">

                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2025
                </h3>

                <p className="mt-3 text-lg">
                  VCTB Tournament 2025
                </p>

                <a
                  href="/competitions/vctb2025"
                  className="mt-4 inline-block text-lg font-bold"
                >
                  Open 2025 competition →
                </a>

              </div>

              <div className="rounded-3xl border border-[#071a52] p-6">

                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2024
                </h3>

                <p className="mt-3 text-lg">
                  VCTB Tournament 2024
                </p>

                <a
                  href="/competitions/vctb2024"
                  className="mt-4 inline-block text-lg font-bold"
                >
                  Open 2024 competition →
                </a>

              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}