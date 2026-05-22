import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">

      {/* TOP BAR */}
      <header className="fixed top-0 z-50 w-full bg-[#2563eb] shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Spiders Logo"
              width={70}
              height={70}
              className="rounded-full"
            />

            <div>
              <h1 className="text-5xl font-extrabold text-white">
                Spiders Sports Club UK
              </h1>

              <p className="text-lg text-white">
                Cricket Club • High Wycombe
              </p>
            </div>
          </div>

          {/* MENU */}
          <nav className="hidden gap-10 text-xl font-bold text-white lg:flex">
            <Link href="/">Home</Link>
            <Link href="/competitions">Competitions</Link>
            <Link href="/statistics">Statistics</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/sponsors">Sponsors</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="relative flex h-screen items-center justify-center bg-cover bg-center pt-24"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(7,26,82,0.55), rgba(7,26,82,0.15)), url('/photo1.jpeg')",
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-6xl font-extrabold md:text-8xl">
            WELCOME TO
            <br />
            SPIDERS SPORTS CLUB UK
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-2xl">
            A friendly and competitive cricket club welcoming players,
            supporters and sponsors.
          </p>

          <button className="mt-12 border-4 border-white px-12 py-5 text-2xl font-bold transition hover:bg-white hover:text-[#071a52]">
            EXPLORE CLUB
          </button>
        </div>
      </section>

      {/* FIXTURES & RESULTS */}
      <section className="bg-white px-6 py-24 text-[#071a52]">
        <div className="mx-auto max-w-7xl">

          <h2 className="mb-12 text-5xl font-extrabold">
            Fixtures & Results
          </h2>

          {/* RESULTS */}
          <h3 className="mb-6 bg-slate-300 px-6 py-4 text-2xl font-bold">
            Results - Last 30 Days
          </h3>

          <div className="space-y-8">

            <FixtureResult
              date="Sunday 17 May 2026"
              result="Spiders Sports Club UK won by 200 runs"
              team1="Spiders Sports Club UK - 1st XI"
              score1="366 / All out (36.4)"
              team2="Ravana Royals CC - 1st XI"
              score2="166 / 7 (30.2)"
            />

            <FixtureResult
              date="Sunday 10 May 2026"
              result="Spiders Sports Club UK won by 108 runs"
              team1="Vaddukoddai CC - Legends"
              score1="198 / All out (39.5)"
              team2="Spiders Sports Club UK - 1st XI"
              score2="306 / 9 (40.0)"
            />

            <FixtureResult
              date="Sunday 03 May 2026"
              result="Bexley Tamils CC conceded"
              team1="Bexley Tamils CC - B"
              score1=""
              team2="Spiders Sports Club UK - 1st XI"
              score2=""
            />

          </div>

          {/* UPCOMING */}
          <h3 className="mb-6 mt-16 bg-slate-300 px-6 py-4 text-2xl font-bold">
            Upcoming - Next 30 Days
          </h3>

          <div className="space-y-8">

            <UpcomingFixture
              date="Sunday 24 May 2026"
              time="13:00"
              ground="Joseph Hood Recreation Ground, Martin Way, Morden, SW20 9BX"
              team1="A9 CC - 1st XI"
              team2="Spiders Sports Club UK - 1st XI"
            />

            <UpcomingFixture
              date="Sunday 31 May 2026"
              time="13:00"
              ground="Old Haberdashers RFC"
              team1="Yarl Gents CC - 1st XI"
              team2="Spiders Sports Club UK - 1st XI"
            />

            <UpcomingFixture
              date="Sunday 07 June 2026"
              time="13:00"
              ground="Richard Challoner School, Manor Dr N, New Malden KT3 5PE"
              team1="Kent United CC - 2nd XI"
              team2="Spiders Sports Club UK - 1st XI"
            />

            <UpcomingFixture
              date="Sunday 14 June 2026"
              time="13:00"
              ground="Crown Taverners Cricket Club, Minley Road, Camberley, GU17 9UA"
              team1="Spiders Sports Club UK - 1st XI"
              team2="Valefarm CC - 1st XI"
            />

            <UpcomingFixture
              date="Sunday 21 June 2026"
              time="13:00"
              ground="Crown Taverners Cricket Club, Minley Road, Camberley, GU17 9UA"
              team1="Spiders Sports Club UK - 1st XI"
              team2="Bexley Tamils CC - B"
            />

          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="bg-[#071a52] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-5xl font-extrabold text-white">
            Sponsors
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-12 text-center text-5xl font-extrabold text-[#071a52] shadow-xl">
              KIWIKMART
            </div>

            <div className="rounded-3xl bg-white p-12 text-center text-5xl font-extrabold text-[#071a52] shadow-xl">
              Twenty 20 Estates
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#071a52] py-10 text-center text-2xl text-white">
        © 2026 Spiders Sports Club UK. All Rights Reserved.
      </footer>
    </main>
  );
}

/* FIXTURE RESULT CARD */
function FixtureResult({
  date,
  result,
  team1,
  score1,
  team2,
  score2,
}: {
  date: string;
  result: string;
  team1: string;
  score1: string;
  team2: string;
  score2: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-[#eef2ff] shadow-lg">

      <div className="bg-slate-200 px-6 py-4 text-2xl font-bold">
        {date}
      </div>

      <div className="p-8 text-center">

        <p className="mb-8 text-3xl font-extrabold uppercase">
          {result}
        </p>

        <div className="grid items-center gap-6 md:grid-cols-3">

          <div>
            <h4 className="text-2xl font-bold">{team1}</h4>

            <p className="mt-4 text-3xl text-slate-600">
              {score1}
            </p>
          </div>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-300 text-2xl font-bold">
            VS
          </div>

          <div>
            <h4 className="text-2xl font-bold">{team2}</h4>

            <p className="mt-4 text-3xl text-slate-600">
              {score2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* UPCOMING FIXTURE CARD */
function UpcomingFixture({
  date,
  time,
  ground,
  team1,
  team2,
}: {
  date: string;
  time: string;
  ground: string;
  team1: string;
  team2: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border bg-[#eef2ff] shadow-lg">

      <div className="bg-slate-200 px-6 py-4 text-2xl font-bold">
        {date}
      </div>

      <div className="p-8 text-center">

        <p className="text-2xl font-bold text-slate-600">
          {time}
        </p>

        <p className="mt-3 text-lg text-blue-600">
          {ground}
        </p>

        <div className="mt-8 grid items-center gap-6 md:grid-cols-3">

          <h4 className="text-2xl font-bold">{team1}</h4>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-300 text-2xl font-bold">
            VS
          </div>

          <h4 className="text-2xl font-bold">{team2}</h4>

        </div>
      </div>
    </div>
  );
}