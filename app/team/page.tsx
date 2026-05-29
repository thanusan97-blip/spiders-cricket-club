import Link from "next/link";
import Image from "next/image";

const players = [
  {
    name: "Haseeb Ali",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Donald Croos",
    profile: "Right arm batsman",
  },
  {
    name: "Thiruchselvam Arulprakash",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Satheeshram Chandrasegarem",
    profile: "All Rounder – Right arm batsman, Right arm medium",
  },
  {
    name: "Prashant Gawali",
    profile: "Right arm batsman",
  },
  {
    name: "Vithushan Jegatheeswaran",
    profile: "Right arm batsman",
  },
  {
    name: "Piratheepan Kailayapillai",
    profile: "Right arm batsman",
  },
  {
    name: "Manoj Krishnasamy",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Kajendran Patkunarasa",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Divakar Rajendiran",
    profile: "Right arm batsman",
  },
  {
    name: "Jeevachandra Ramajayam",
    profile: "Right arm batsman, Wicket Keeper",
  },
  {
    name: "Birunthaban Selvakumar",
    profile: "All Rounder – Left arm batsman, Left arm medium fast bowling",
  },
  {
    name: "Thanusan Shanthakumar",
    profile: "Right arm batsman, Wicket Keeper",
  },
  {
    name: "Sujanthiran Sritharan",
    profile: "Right arm batsman",
  },
  {
    name: "Thakeesan Thiraviyarasa",
    profile: "All Rounder – Right arm batsman, Right arm Leg Spin",
  },
  {
    name: "Balaguru Thiruveragan",
    profile: "Right arm batsman",
  },
  {
    name: "Dilrooban Yogarajah",
    profile: "All Rounder – Right arm batsman, Right arm Leg Spin",
  },
  {
    name: "Praveen Kumar Croos Anthonimuthu",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Nirojan Arulnathan",
    profile: "Bowler – Left arm Off Spin",
  },
  {
    name: "Theepalaxshan Arunagiry",
    profile: "Right arm batsman",
  },
  {
    name: "Ronald Ettienne",
    profile: "Right arm batsman",
  },
  {
    name: "Premkumar Coonghe Juthathatheyhu",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Prashanth Krishnakumar",
    profile: "Right arm batsman",
  },
  {
    name: "Thinesh Param",
    profile: "Right arm batsman",
  },
  {
    name: "Vijitharan Pulendran",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Jeeva CR",
    profile: "Right arm batsman, Wicket Keeper",
  },
  {
    name: "Shuluckson Sathiyaseelan",
    profile: "Right arm batsman",
  },
  {
    name: "Rexsan Shanthakumar",
    profile: "Right arm batsman",
  },
  {
    name: "Dinesh Srikantharanganathan",
    profile: "Right arm batsman",
  },
  {
    name: "Ajanthan Thiraviyarasa",
    profile: "All Rounder – Right arm batsman, Right arm medium fast bowling",
  },
  {
    name: "Thuvarakan Thiraviyarasa",
    profile: "Right arm batsman",
  },
  {
    name: "Vijitharan Vijayarathnam",
    profile: "Bowler – Right arm Leg Spin",
  },
];

function slugify(name: string) {
  return name.toLowerCase().replaceAll(" ", "-");
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">
      <section className="bg-[#071a52] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="font-bold">
            ← Back to Home
          </Link>

          <h1 className="mt-8 text-5xl font-extrabold md:text-6xl">
            Team Information
          </h1>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Image
              src="/gallery/photo2.jpeg"
              alt="Team"
              width={350}
              height={250}
              className="rounded-2xl object-cover"
            />

            <div className="md:col-span-2">
              <h2 className="text-4xl font-extrabold">1st XI</h2>

              <p className="mt-3 text-xl text-slate-600">
                Spiders Sports Club UK
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Info label="Player Type" value="Adult Men" />
                <Info label="Manager" value="Thakeesan Thiraviyarasa" />
                <Info label="Captain" value="Vijitharan Pulendran" />
                <Info label="Club Email" value="spiderssportsclubuk@gmail.com" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-5xl font-extrabold">Squad</h2>

          <div className="grid gap-5 md:grid-cols-2">
            {players.map((player) => (
              <Link
                key={player.name}
                href={`/team/${slugify(player.name)}`}
                className="group flex items-center gap-5 rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:bg-[#071a52] hover:text-white hover:shadow-xl"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-300 text-2xl">
                  👤
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-blue-600 group-hover:text-white md:text-xl">
                    {player.name}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-slate-600 group-hover:text-blue-100 md:text-base">
                    {player.profile}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-bold">{label}</p>
      <p className="mt-2 rounded-xl bg-[#eef2ff] p-4 text-lg">{value}</p>
    </div>
  );
}