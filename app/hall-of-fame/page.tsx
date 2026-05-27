import Image from "next/image";

export default function HallOfFamePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef2ff] px-4 py-10 text-[#071a52] md:px-6 md:py-16">

      {/* Background Image */}
      <Image
        src="/hall-of-fame/hof-bg.jpg"
        alt="Hall of Fame Background"
        fill
        className="object-cover opacity-15"
      />

      {/* White Overlay */}
      <div className="absolute inset-0 bg-white/70" />

      {/* Page Content */}
      <div className="relative z-10 mx-auto max-w-7xl">

        <a href="/" className="font-bold">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-5xl font-black md:text-7xl">
          Hall of Fame
        </h1>

        <h2 className="mt-14 text-3xl font-black md:text-5xl">
          Season 2025
        </h2>

        {/* BATTING */}
        <h3 className="mt-10 text-2xl font-black md:text-4xl">
          Batting
        </h3>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* CARD 1 */}
          <div className="overflow-hidden rounded-[30px] bg-[#073763] shadow-2xl">
            <div className="flex">

              <div className="flex-1 p-6">
                <Image
                  src="/hall-of-fame/satheesh.jpg"
                  alt="Satheeshram"
                  width={110}
                  height={110}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover"
                />

                <div className="mt-5 inline-block rounded-full bg-cyan-400 px-5 py-2 text-lg font-black text-[#071a52]">
                  Runs
                </div>

                <h2 className="mt-4 text-6xl font-black text-cyan-300">
                  325
                </h2>

                <h3 className="mt-6 text-2xl font-black text-white">
                  SATHEESHRAM
                  <br />
                  CHANDRASEGARAM
                </h3>

                <p className="mt-4 text-xl text-white/80">
                  Highest Score 89
                </p>
              </div>

              <div className="w-16 bg-[#295883]" />
            </div>
          </div>

          {/* CARD 2 */}
          <div className="overflow-hidden rounded-[30px] bg-[#073763] shadow-2xl">
            <div className="flex">

              <div className="flex-1 p-6">
                <Image
                  src="/hall-of-fame/ajanthan.jpg"
                  alt="Ajanthan"
                  width={110}
                  height={110}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover"
                />

                <div className="mt-5 inline-block rounded-full bg-cyan-400 px-5 py-2 text-lg font-black text-[#071a52]">
                  Runs
                </div>

                <h2 className="mt-4 text-6xl font-black text-cyan-300">
                  306
                </h2>

                <h3 className="mt-6 text-2xl font-black text-white">
                  AJANTHAN
                  <br />
                  THIRAVIYARASA
                </h3>

                <p className="mt-4 text-xl text-white/80">
                  Highest Score 65
                </p>
              </div>

              <div className="w-16 bg-[#295883]" />
            </div>
          </div>

          {/* CARD 3 */}
          <div className="overflow-hidden rounded-[30px] bg-[#073763] shadow-2xl">
            <div className="flex">

              <div className="flex-1 p-6">
                <Image
                  src="/hall-of-fame/thakeesan.jpg"
                  alt="Thakeesan"
                  width={110}
                  height={110}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover"
                />

                <div className="mt-5 inline-block rounded-full bg-cyan-400 px-5 py-2 text-lg font-black text-[#071a52]">
                  Runs
                </div>

                <h2 className="mt-4 text-6xl font-black text-cyan-300">
                  283
                </h2>

                <h3 className="mt-6 text-2xl font-black text-white">
                  THAKEESAN
                  <br />
                  THIRAVIYARASA
                </h3>

                <p className="mt-4 text-xl text-white/80">
                  Highest Score 54
                </p>
              </div>

              <div className="w-16 bg-[#295883]" />
            </div>
          </div>

          {/* CARD 4 */}
          <div className="overflow-hidden rounded-[30px] bg-[#073763] shadow-2xl">
            <div className="flex">

              <div className="flex-1 p-6">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-5xl">
                  👤
                </div>

                <div className="mt-5 inline-block rounded-full bg-cyan-400 px-5 py-2 text-lg font-black text-[#071a52]">
                  Highest Individual Score
                </div>

                <h2 className="mt-4 text-6xl font-black text-cyan-300">
                  149
                </h2>

                <h3 className="mt-6 text-2xl font-black text-white">
                  HASEEB ALI
                </h3>

                <p className="mt-4 text-xl text-white/80">
                  149 Runs
                </p>
              </div>

              <div className="w-16 bg-[#295883]" />
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}