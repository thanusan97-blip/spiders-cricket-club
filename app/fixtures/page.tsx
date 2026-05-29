import Link from "next/link";
import Script from "next/script";

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
    score1: "149/8 (40.0)",
    score2: "150/2 (16.0)",
    team1: "A9 CC - 1st XI",
    team2: "SPIDERS SPORTS CLUB UK",
  },
  {
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
    <main className="relative min-h-screen overflow-hidden text-[#071a52]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/competitions/stat-bg.jpg"
          alt="Fixtures Background"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#eef2ff]/85 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="font-bold hover:underline">
            ← Back to Home
          </Link>

          <h1 className="mt-8 text-5xl font-black md:text-6xl">
            Fixtures & Results
          </h1>

          <p className="mt-4 text-lg text-slate-700 md:text-xl">
            Live score, upcoming fixtures and latest results.
          </p>

          {/* LIVE SCORE */}
          <section className="mt-10 rounded-3xl border border-[#071a52]/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm md:p-8">
            <h2 className="text-3xl font-black md:text-4xl">Live Score</h2>

            <p className="mt-3 text-slate-700">
              Follow today&apos;s live Play-Cricket scorecards.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl bg-white p-4 shadow-inner">
              <a
                style={{ display: "none" }}
                className="lsw"
                href="https://www.play-cricket.com/embed_widget/live_scorer_widgets?club_id=28250&days=0"
                id="lsw_link_1526534855798"
              />

              <div
                className="lsw-col-12 lsw_tile"
                id="lsw_container_1526534855798"
              />
            </div>
          </section>

          {/* UPCOMING FIXTURES */}
          <section className="mt-12">
            <h2 className="text-4xl font-black">Upcoming Fixtures</h2>

            <div className="mt-8 grid gap-6">
              {upcomingFixtures.map((fixture, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-[#071a52]/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8"
                >
                  <div className="text-xl font-bold text-blue-700">
                    {fixture.date}
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-3 md:items-center">
                    <div>
                      <p className="text-slate-600">{fixture.time}</p>
                      <h3 className="mt-2 text-xl font-black md:text-2xl">
                        {fixture.team1}
                      </h3>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl font-black text-blue-600">
                        VS
                      </div>
                      <p className="mt-2 text-slate-600">{fixture.venue}</p>
                    </div>

                    <div className="md:text-right">
                      <h3 className="text-xl font-black md:text-2xl">
                        {fixture.team2}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RESULTS */}
          <section className="mt-12">
            <h2 className="text-4xl font-black">Latest Results</h2>

            <div className="mt-8 grid gap-6">
              {results.map((match, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-[#071a52]/20 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8"
                >
                  <div className="text-xl font-bold text-blue-700">
                    {match.date}
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#071a52] px-5 py-3 text-center text-lg font-black text-white md:text-2xl">
                    {match.result}
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-3 md:items-center">
                    <div>
                      <h3 className="text-xl font-black md:text-2xl">
                        {match.team1}
                      </h3>
                      <p className="mt-2 text-lg text-slate-700">
                        {match.score1}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl font-black text-blue-600">
                        VS
                      </div>
                    </div>

                    <div className="md:text-right">
                      <h3 className="text-xl font-black md:text-2xl">
                        {match.team2}
                      </h3>
                      <p className="mt-2 text-lg text-slate-700">
                        {match.score2}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Script
        src="https://www.play-cricket.com/live_scorer.js"
        strategy="afterInteractive"
      />
    </main>
  );
}