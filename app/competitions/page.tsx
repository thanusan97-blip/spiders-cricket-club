import Link from "next/link";
import Image from "next/image";

export default function CompetitionsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 text-[#071a52] md:px-6">
      <Image
        src="/competitions/main-bg.jpg"
        alt="Competitions Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px]" />

      <div className="relative z-10 mx-auto max-w-3xl scale-[0.66] origin-top">
        <Link href="/" className="mb-8 inline-block font-semibold hover:underline">
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-3xl font-extrabold md:text-5xl">
          Competitions
        </h1>

        <div className="grid gap-3 lg:grid-cols-2">
          {/* BTCL */}
          <section className="relative overflow-hidden rounded-3xl border border-[#071a52]/20 bg-white/55 p-6 shadow-2xl backdrop-blur-sm md:p-8">
            <Image src="/competitions/btcl-bg.jpg" alt="BTCL Background" fill className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-white/35" />

            <div className="relative z-10">
              <div className="mb-8 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <Image src="/competitions/btcl.png" alt="BTCL" width={90} height={90} className="rounded-2xl object-contain" />
                <div>
                  <h2 className="text-3xl font-extrabold md:text-4xl">British Tamil Cricket League (BTCL)</h2>
                  <p className="mt-3 text-lg text-slate-700 md:text-xl">Official BTCL league competitions.</p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  ["Season 2026", "Division Challenge - Ongoing", "View live BTCL table →", "https://btcl.play-cricket.com/website/division/137686", "red"],
                  ["Season 2025", "Division Classic and Chera B Group", "Open 2025 tables →", "/competitions/2025", ""],
                  ["Season 2024", "Division Platinum", "Open 2024 table →", "/competitions/2024", ""],
                ].map(([season, text, label, href, color]) => (
                  <div key={season} className="rounded-3xl border border-[#071a52]/20 bg-white/75 p-6 shadow-md backdrop-blur-sm">
                    <h3 className="text-2xl font-bold md:text-3xl">{season}</h3>
                    <p className="mt-3 text-lg">{text}</p>
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={`mt-4 inline-block text-lg font-bold ${color === "red" ? "text-red-600" : ""}`}>
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* VCTB */}
          <section className="relative overflow-hidden rounded-3xl border border-[#071a52]/20 bg-white/55 p-6 shadow-2xl backdrop-blur-sm md:p-8">
            <Image src="/competitions/vctb-bg.jpg" alt="VCTB Background" fill className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-white/35" />

            <div className="relative z-10">
              <div className="mb-8 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <Image src="/competitions/vctb.png" alt="VCTB" width={110} height={110} className="rounded-2xl object-contain" />
                <div>
                  <h2 className="text-3xl font-extrabold md:text-4xl">Vadamaradchy Champion T10 Blast (VCTB)</h2>
                  <p className="mt-3 text-lg text-slate-700 md:text-xl">VCTB tournament competitions.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-[#071a52]/20 bg-white/75 p-6 shadow-md backdrop-blur-sm">
                  <h3 className="text-2xl font-bold md:text-3xl">Season 2026</h3>
                  <p className="mt-3 text-lg">Tournament coming soon</p>
                  <span className="mt-4 inline-block text-lg font-bold text-slate-400">Coming Soon</span>
                </div>

                <div className="rounded-3xl border border-[#071a52]/20 bg-white/75 p-6 shadow-md backdrop-blur-sm">
                  <h3 className="text-2xl font-bold md:text-3xl">Season 2025</h3>
                  <p className="mt-3 text-lg">VCTB Tournament 2025</p>
                  <a href="/competitions/vctb2025" className="mt-4 inline-block text-lg font-bold">Open 2025 competition →</a>
                </div>

                <div className="rounded-3xl border border-[#071a52]/20 bg-white/75 p-6 shadow-md backdrop-blur-sm">
                  <h3 className="text-2xl font-bold md:text-3xl">Season 2024</h3>
                  <p className="mt-3 text-lg">VCTB Tournament 2024</p>
                  <a href="/competitions/vctb2024" className="mt-4 inline-block text-lg font-bold">Open 2024 competition →</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}