import Link from "next/link";
import Image from "next/image";

const upcomingFixtures = [
 
  {
    date: "Sunday 31 May 2026",
    team1: "Yarl Gents CC - 1st XI",
    team2: "Spiders Sports Club UK - 1st XI",
    venue: "Old Haberdashers RFC",
    time: "13:00",
  },
  {
    date: "Sunday 07 June 2026",
    team1: "Kent United CC - 2nd XI",
    team2: "Spiders Sports Club UK - 1st XI",
    venue: "Richard Challoner School",
    time: "13:00",
  },
  {
    date: "Sunday 14 June 2026",
    team1: "Spiders Sports Club UK - 1st XI",
    team2: "Valefarm CC - 1st XI",
    venue: "Crown Taverners Cricket Club",
    time: "13:00",
  },
  {
    date: "Sunday 21 June 2026",
    team1: "Spiders Sports Club UK - 1st XI",
    team2: "BEXLEY TAMILS CC",
    venue: "Crown Taverners Cricket Club",
    time: "13:00",
  },
];

const results = [
  {
    date: "Sunday 24 May 2026",
    result: "SPIDERS SPORTS CLUB UK WON BY 8 WICKETS",
    score1: "149/8 (40.0)" ,
    score2: "150/2 (16.0)",
    team1: "A9 CC - 1st XI",
    team2: "SPIDERS SPORTS CLUB UK",
  },{
    date: "Sunday 17 May 2026",
    result: "SPIDERS SPORTS CLUB UK WON BY 200 RUNS",
    score1: "366 All Out (36.4)",
    score2: "166/7 (30.2)",
    team1: "Spiders Sports Club UK",
    team2: "Ravana Royals CC",
  },
  {
    date: "Sunday 10 May 2026",
    result: "SPIDERS SPORTS CLUB UK WON BY 108 RUNS",
    score1: "306/9 (40.0)",
    score2: "198 All Out (39.5)",
    team1: "Spiders Sports Club UK",
    team2: "Vaddukoddai CC",
  },
  {
    date: "Sunday 03 May 2026",
    result: "BEXLEY TAMILS CC CONCEDED",
    score1: "Match Awarded",
    score2: "-",
    team1: "Spiders Sports Club UK",
    team2: "Bexley Tamils CC",
  },
  
];

export default function FixturesPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#3b82f6] shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="rounded-full"
            />

            <div>
              <h1 className="text-xl font-bold text-white md:text-3xl">
                Spiders Sports Club UK
              </h1>

              <p className="text-sm text-white">
                Cricket Club • High Wycombe
              </p>
            </div>
          </Link>

          <nav className="hidden gap-8 font-semibold text-white md:flex">
            <Link href="/">Home</Link>
            <Link href="/competitions">Competitions</Link>
            <Link href="/statistics">Statistics</Link>
            <Link href="/fixtures">Fixtures</Link>
            <Link href="/gallery">Gallery</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#071a52] px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-5xl font-extrabold md:text-7xl">
            Fixtures & Results
          </h1>

          <p className="mt-6 max-w-3xl text-xl text-slate-300">
            Follow upcoming matches and latest results for Spiders Sports Club
            UK.
          </p>
        </div>
      </section>

      {/* UPCOMING FIXTURES */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-4xl font-extrabold">
            Upcoming Fixtures
          </h2>

          <div className="space-y-8">
            {upcomingFixtures.map((fixture, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white p-8 shadow-xl"
              >
                <div className="mb-6 text-2xl font-bold text-[#2563eb]">
                  {fixture.date}
                </div>

                <div className="grid gap-6 md:grid-cols-3 md:items-center">
                  <div>
                    <p className="text-lg text-slate-500">
                      {fixture.time}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {fixture.team1}
                    </h3>
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-[#2563eb]">
                      VS
                    </div>

                    <p className="mt-3 text-slate-500">
                      {fixture.venue}
                    </p>
                  </div>

                  <div className="text-right">
                    <h3 className="text-2xl font-bold">
                      {fixture.team2}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-4xl font-extrabold">
            Latest Results
          </h2>

          <div className="space-y-8">
            {results.map((match, index) => (
              <div
                key={index}
                className="rounded-3xl bg-[#eef2ff] p-8 shadow-xl"
              >
                <div className="mb-4 text-2xl font-bold text-[#2563eb]">
                  {match.date}
                </div>

                <div className="mb-8 text-center text-2xl font-extrabold">
                  {match.result}
                </div>

                <div className="grid gap-8 md:grid-cols-3 md:items-center">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {match.team1}
                    </h3>

                    <p className="mt-2 text-xl text-slate-600">
                      {match.score1}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-[#2563eb]">
                      VS
                    </div>
                  </div>

                  <div className="text-right">
                    <h3 className="text-2xl font-bold">
                      {match.team2}
                    </h3>

                    <p className="mt-2 text-xl text-slate-600">
                      {match.score2}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04113a] px-6 py-8 text-center text-white">
        <p className="text-lg">
          © 2026 Spiders Sports Club UK. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}