import Link from "next/link";
import Image from "next/image";

export default function VCTBPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 text-[#071a52] md:px-6">
      <Image
        src="/competitions/main-bg.jpg"
        alt="VCTB Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px]" />

      <div className="relative z-10 mx-auto max-w-5xl scale-[0.66] origin-top">
        <Link
          href="/"
          className="mb-8 inline-block font-semibold hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-4 text-3xl font-extrabold md:text-5xl">
          VCTB
        </h1>

        <section className="relative overflow-hidden rounded-3xl border border-[#071a52]/20 bg-white/55 p-6 shadow-2xl backdrop-blur-sm md:p-8">
          <Image
            src="/competitions/vctb-bg.jpeg"
            alt="VCTB Background"
            fill
            className="object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-white/35" />

          <div className="relative z-10">
            <div className="mb-8 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <Image
                src="/competitions/vctb.png"
                alt="VCTB"
                width={110}
                height={110}
                className="rounded-2xl object-contain"
              />

              <div>
                <h2 className="text-3xl font-extrabold md:text-4xl">
                  Vadamaradchy Champion T10 Blast (VCTB)
                </h2>

                <p className="mt-3 text-lg text-slate-700 md:text-xl">
                  VCTB tournament competitions.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-[#071a52]/20 bg-white/75 p-6 shadow-md backdrop-blur-sm">
                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2026
                </h3>

                <p className="mt-3 text-lg">
                  VCTB Tournament 2026
                </p>

                <Link
                  href="/vctb/2026"
                  className="mt-4 inline-block text-lg font-bold text-red-600"
                >
                  Open 2026 competition →
                </Link>
              </div>

              <div className="rounded-3xl border border-[#071a52]/20 bg-white/75 p-6 shadow-md backdrop-blur-sm">
                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2025
                </h3>

                <p className="mt-3 text-lg">
                  VCTB Tournament 2025
                </p>

                <Link
                  href="/competitions/vctb2025"
                  className="mt-4 inline-block text-lg font-bold"
                >
                  Open 2025 competition →
                </Link>
              </div>

              <div className="rounded-3xl border border-[#071a52]/20 bg-white/75 p-6 shadow-md backdrop-blur-sm">
                <h3 className="text-2xl font-bold md:text-3xl">
                  Season 2024
                </h3>

                <p className="mt-3 text-lg">
                  VCTB Tournament 2024
                </p>

                <Link
                  href="/competitions/vctb2024"
                  className="mt-4 inline-block text-lg font-bold"
                >
                  Open 2024 competition →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}