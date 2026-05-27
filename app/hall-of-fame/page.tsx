import Image from "next/image";

const seasons = [
  {
    year: "2025",

    batting: [
      {
        name: "Satheeshram Chandrasegaram",
        stat: "325",
        label: "Runs",
        extra: "Highest Score 89",
        image: "/hall-of-fame/satheeshram.jpg",
      },

      {
        name: "Ajanthan Thiraviyarasa",
        stat: "306",
        label: "Runs",
        extra: "Highest Score 65",
        image: "/hall-of-fame/ajanthan.jpg",
      },

      {
        name: "Thakeesan Thiraviyarasa",
        stat: "283",
        label: "Runs",
        extra: "Highest Score 54",
        image: "/hall-of-fame/thakeesan.jpg",
      },

      {
        name: "Haseeb Ali",
        stat: "149",
        label: "Highest Individual Score",
        extra: "149 Runs",
        image: "",
      },
    ],

    bowling: [
      {
        name: "Satheeshram Chandrasegaram",
        stat: "31",
        label: "Wickets",
        extra: "Best Figure 6/34",
        image: "/hall-of-fame/satheeshram.jpg",
      },

      {
        name: "Thiruchselvam Arulprakash",
        stat: "24",
        label: "Wickets",
        extra: "Best Figure 4/41",
        image: "/hall-of-fame/thiruchselvam.jpg",
      },

      {
        name: "Ajanthan Thiraviyarasa",
        stat: "19",
        label: "Wickets",
        extra: "Best Figure 4/25",
        image: "/hall-of-fame/ajanthan.jpg",
      },

      {
        name: "Satheeshram Chandrasegaram",
        stat: "6/34",
        label: "Highest Individual Figure",
        extra: "Best Bowling Figure",
        image: "/hall-of-fame/satheeshram.jpg",
      },
    ],
  },

  {
    year: "2024",

    batting: [
      {
        name: "Thiruchselvam Arulprakash",
        stat: "729",
        label: "Runs",
        extra: "Highest Score 200",
        image: "/hall-of-fame/thiruchselvam.jpg",
      },

      {
        name: "Ajanthan Thiraviyarasa",
        stat: "532",
        label: "Runs",
        extra: "Highest Score 87",
        image: "/hall-of-fame/ajanthan.jpg",
      },

      {
        name: "Satheeshram Chandrasegaram",
        stat: "500",
        label: "Runs",
        extra: "Highest Score 163",
        image: "/hall-of-fame/satheeshram.jpg",
      },

      {
        name: "Thiruchselvam Arulprakash",
        stat: "200",
        label: "Highest Individual Score",
        extra: "200 Runs",
        image: "/hall-of-fame/thiruchselvam.jpg",
      },
    ],

    bowling: [
      {
        name: "Satheeshram Chandrasegaram",
        stat: "34",
        label: "Wickets",
        extra: "Best Figure 6/41",
        image: "/hall-of-fame/satheeshram.jpg",
      },

      {
        name: "Thiruchselvam Arulprakash",
        stat: "28",
        label: "Wickets",
        extra: "Best Figure 5/22",
        image: "/hall-of-fame/thiruchselvam.jpg",
      },

      {
        name: "Ajanthan Thiraviyarasa",
        stat: "20",
        label: "Wickets",
        extra: "Best Figure 4/19",
        image: "/hall-of-fame/ajanthan.jpg",
      },

      {
        name: "Satheeshram Chandrasegaram",
        stat: "6/41",
        label: "Highest Individual Figure",
        extra: "Best Bowling Figure",
        image: "/hall-of-fame/satheeshram.jpg",
      },
    ],
  },
];

export default function HallOfFamePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#eef2ff] px-4 py-10 text-[#071a52] md:px-6 md:py-16">

  {/* Background Image */}
  <Image
    src="/hall-of-fame/hof-bg.jpg"
    alt="Hall of Fame Background"
    fill
    className="object-cover opacity-60"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px]" />

  {/* Content */}
  <div className="relative z-10">
      <div className="mx-auto max-w-7xl">

        <a href="/" className="font-bold hover:underline">
          ← Back to Home
        </a>

        <h1 className="mt-8 text-5xl font-black md:text-6xl">
          Hall of Fame
        </h1>

        {seasons.map((season) => (
          <section key={season.year} className="mt-14">

            <h2 className="text-4xl font-black">
              Season {season.year}
            </h2>

            {/* Batting */}
            <h3 className="mt-8 text-2xl font-black">
              Batting
            </h3>

            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {season.batting.map((item) => (
                <HallCard
                  key={`${season.year}-${item.name}-${item.label}`}
                  item={item}
                  type="batting"
                />
              ))}
            </div>

            {/* Bowling */}
            <h3 className="mt-12 text-2xl font-black">
              Bowling
            </h3>

            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {season.bowling.map((item) => (
                <HallCard
                  key={`${season.year}-${item.name}-${item.label}`}
                  item={item}
                  type="bowling"
                />
              ))}
            </div>

          </section>
        ))}
      </div>
      </div>
</main>
  );
}

function HallCard({
  item,
  type,
}: {
  item: {
    name: string;
    stat: string;
    label: string;
    extra: string;
    image?: string;
  };
  type: "batting" | "bowling";
}) {

  const colour =
    type === "batting"
      ? "bg-cyan-400 text-[#071a52]"
      : "bg-red-500 text-white";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#073b63] p-6 text-white shadow-xl">

      <div className="absolute right-0 top-0 h-full w-14 bg-white/10" />

      <div className="relative z-10">

        <div className="flex items-start justify-between">

          {/* Player Image */}
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/80 bg-slate-300">

            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">
                👤
              </div>
            )}

          </div>

          {/* Label + Stat */}
          <div className="ml-4 flex-1">

            <div className={`inline-block rounded-full px-4 py-2 text-sm font-black ${colour}`}>
              {item.label}
            </div>

            <h2 className="mt-3 text-5xl font-black text-cyan-300">
              {item.stat}
            </h2>

          </div>

        </div>

        {/* Player Name */}
        <div className="mt-8">
          <h3 className="text-2xl font-black uppercase leading-tight">
            {item.name}
          </h3>

          <p className="mt-3 text-lg text-slate-300">
            {item.extra}
          </p>
        </div>

      </div>
    </div>
  );
}