import Link from "next/link";
import Image from "next/image";

const players = [
  "Haseeb Ali",
  "Donald Croos",
  "Thiruchselvam Arulprakash",
  "Satheeshram Chandrasegarem",
  "Prashant Gawali",
  "Vithushan Jegatheeswaran",
  "Piratheepan Kailayapillai",
  "Manoj Krishnasamy",
  "Kajendran Patkunarasa",
  "Divakar Rajendiran",
  "Jeevachandra Ramajayam",
  "Birunthaban Selvakumar",
  "Thanusan Shanthakumar",
  "Sujanthiran Sritharan",
  "Thakeesan Thiraviyarasa",
  "Balaguru Thiruveragan",
  "Dilrooban Yogarajah",
  "Praveen Kumar Croos Anthonimuthu",
  "Nirojan Arulnathan",
  "Theepalaxshan Arunagiry",
  "Ronald Ettienne",
  "Premkumar Coonghe Juthathatheyhu",
  "Prashanth Krishnakumar",
  "Thinesh Param",
  "Vijitharan Pulendran",
  "Jeeva CR",
  "Shuluckson Sathiyaseelan",
  "Rexsan Shanthakumar",
  "Dinesh Srikantharanganathan",
  "Ajanthan Thiraviyarasa",
  "Thuvarakan Thiraviyarasa",
  "Vijitharan Vijayarathnam",
];

function slugify(name: string) {
  return name.toLowerCase().replaceAll(" ", "-");
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">
      <section className="bg-[#071a52] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="font-bold">← Back to Home</Link>
          <h1 className="mt-8 text-6xl font-extrabold">Team Information</h1>
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

          <div className="grid gap-4 md:grid-cols-2">
            {players.map((player) => (
              <Link
                key={player}
                href={`/team/${slugify(player)}`}
                className="flex items-center gap-4 rounded-xl bg-white p-4 font-bold text-blue-600 shadow transition hover:bg-[#071a52] hover:text-white"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-300 text-xl">
                  👤
                </div>
                {player}
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