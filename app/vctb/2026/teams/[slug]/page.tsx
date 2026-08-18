"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Player = {
  player_id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
};

type AuctionSigning = {
  id: number;
  created_at: string;
  player_id: string;
  team: string;
  role: string | null;
  points: number;
  player?: Player;
};

type RetainedPlayer = {
  playerId: string;
  photoCode: string;
  name: string;
  role: string;
};

type TeamInfo = {
  name: string;
  displayName: string;
  owner: string;
  logo: string;
  startingPoints: number;
  group: "A" | "B";
  retained: RetainedPlayer[];
};

const teams: Record<string, TeamInfo> = {
  "aathiyadi-jl-super-kings": {
    name: "Aathiyadi JL Super Kings",
    displayName: "Aathiyadi JL Super Kings",
    owner: "Jatheesan Arulanantham",
    logo: "/vctb/2026/teams/aathiyadi.png",
    startingPoints: 3000,
    group: "A",
    retained: [
      {
        playerId: "112",
        photoCode: "VC 112",
        name: "Satheesram Chandrasegaram",
        role: "All-Rounder",
      },
      {
        playerId: "6",
        photoCode: "VC 006",
        name: "Dinalan Nallagurunathan",
        role: "All-Rounder",
      },
      {
        playerId: "160",
        photoCode: "VC 160",
        name: "Mohamed Nawazish",
        role: "All-Rounder",
      },
      {
        playerId: "150",
        photoCode: "VC 150",
        name: "Akram Muthalib",
        role: "Wicket Keeper",
      },
    ],
  },

  "balmoral-fighters": {
    name: "Balmoral Fighters",
    displayName: "Balmoral Fighters",
    owner: "Krishanth Thayalan & Anushan Arulanantham",
    logo: "/vctb/2026/teams/balmoral.png",
    startingPoints: 2900,
    group: "A",
    retained: [
      {
        playerId: "53",
        photoCode: "VC 053",
        name: "Anushan Arulanantham",
        role: "All-Rounder",
      },
      {
        playerId: "59",
        photoCode: "VC 059",
        name: "Caniston Gunaratnam",
        role: "All-Rounder",
      },
      {
        playerId: "93",
        photoCode: "VC 093",
        name: "Dinoshan Theivendram",
        role: "All-Rounder",
      },
      {
        playerId: "92",
        photoCode: "VC 092",
        name: "Visnujith Parakirama",
        role: "Bowler",
      },
      {
        playerId: "91",
        photoCode: "VC 091",
        name: "Fazlan Mohamed",
        role: "All-Rounder",
      },
    ],
  },

  "niruvaththampai-knights": {
    name: "Niruvaththampai Knights",
    displayName: "Niruvaththampai Knights",
    owner: "Sornaraj Sornavadivel & Ranjithraj Thurairajah",
    logo: "/vctb/2026/teams/niruvaththampai.png",
    startingPoints: 2900,
    group: "B",
    retained: [
      {
        playerId: "71",
        photoCode: "VC 071",
        name: "Sornaraj Sornavadivel",
        role: "All-Rounder",
      },
      {
        playerId: "54",
        photoCode: "VC 054",
        name: "Kabilraj Kanagaratnam",
        role: "All-Rounder",
      },
      {
        playerId: "103",
        photoCode: "VC 103",
        name: "Vensakar Kanthiraj",
        role: "All-Rounder",
      },
      {
        playerId: "55",
        photoCode: "VC 055",
        name: "Murvin Abinash",
        role: "All-Rounder",
      },
      {
        playerId: "143",
        photoCode: "VC 143",
        name: "Anusan Theiventhiran",
        role: "All-Rounder",
      },
    ],
  },

  "team-tiger": {
    name: "Team Tiger",
    displayName: "Team Tiger",
    owner: "Sothilingham Yogeswaran (Mathan)",
    logo: "/vctb/2026/teams/team-tiger.png",
    startingPoints: 2900,
    group: "B",
    retained: [
      {
        playerId: "175",
        photoCode: "VC 175",
        name: "Mathan",
        role: "Wicket Keeper",
      },
      {
        playerId: "80",
        photoCode: "VC 080",
        name: "Pramoth Terrance",
        role: "All-Rounder",
      },
      {
        playerId: "68",
        photoCode: "VC 068",
        name: "Ukantharasa Vinith",
        role: "All-Rounder",
      },
      {
        playerId: "49",
        photoCode: "VC 049",
        name: "Rajee Sivalingam",
        role: "All-Rounder",
      },
      {
        playerId: "104",
        photoCode: "VC 104",
        name: "Dhivendhiran Vembaiyan",
        role: "Batsman",
      },
    ],
  },

  "thunnalai-royals": {
    name: "Thunnalai Royals",
    displayName: "Thunnalai Royals",
    owner: "Sivathasan Kailasapillai & Kugan Navaratnam",
    logo: "/vctb/2026/teams/thunnalai.png",
    startingPoints: 2900,
    group: "A",
    retained: [
      {
        playerId: "22",
        photoCode: "VC 022",
        name: "Kugan Navaratnam",
        role: "All-Rounder",
      },
      {
        playerId: "154",
        photoCode: "VC 154",
        name: "Dikson Manokarasa",
        role: "All-Rounder",
      },
      {
        playerId: "33",
        photoCode: "VC 033",
        name: "Purus Paran",
        role: "All-Rounder",
      },
      {
        playerId: "25",
        photoCode: "VC 025",
        name: "Saranijan Gabilan",
        role: "All-Rounder",
      },
      {
        playerId: "36",
        photoCode: "VC 036",
        name: "Riffaz Mohammed",
        role: "All-Rounder",
      },
    ],
  },

  "vallvai-blues-sc-uk": {
    name: "Vallvai Blues SC UK",
    displayName: "Vallvai Kadalodikal",
    owner: "Ranjith Mahenthirarasaa & Dinesh Poobalasingham (DK)",
    logo: "/vctb/2026/teams/vallvai-blues.png",
    startingPoints: 2900,
    group: "B",
    retained: [
      {
        playerId: "3",
        photoCode: "VC 003",
        name: "Ranjith Mahenthirarasaa",
        role: "All-Rounder",
      },
      {
        playerId: "83",
        photoCode: "VC 083",
        name: "Dinesh Poobalasingham (DK)",
        role: "All-Rounder",
      },
      {
        playerId: "134",
        photoCode: "VC 134",
        name: "Dilan Puviraj",
        role: "All-Rounder",
      },
      {
        playerId: "12",
        photoCode: "VC 012",
        name: "Kodeeswaran Vasthiyampillai",
        role: "Wicket Keeper",
      },
      {
        playerId: "167",
        photoCode: "VC 167",
        name: "Thishok Arasaretnam",
        role: "All-Rounder",
      },
    ],
  },
};

export default function TeamSquadPage() {
  const params = useParams();
  const slug = String(params.slug);

  const team = teams[slug];

  const supabase = useMemo(() => createClient(), []);

  const [auctionSignings, setAuctionSignings] = useState<AuctionSigning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!team) {
      return;
    }

    async function loadTeam() {
      setLoading(true);

      const { data: signingData, error: signingError } = await supabase
        .from("auction_signings")
        .select("id, created_at, player_id, team, role, points")
        .eq("team", team.name)
        .order("created_at", { ascending: true });

      if (signingError) {
        console.error(signingError);
        setLoading(false);
        return;
      }

      if (!signingData || signingData.length === 0) {
        setAuctionSignings([]);
        setLoading(false);
        return;
      }

      const playerIds = [
        ...new Set(
          signingData.map((signing) => String(signing.player_id))
        ),
      ];

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("player_id, name, role, photo_url")
        .in("player_id", playerIds);

      if (playerError) {
        console.error(playerError);
      }

      const playerMap = new Map<string, Player>();

      (playerData || []).forEach((player) => {
        playerMap.set(String(player.player_id), player);
      });

      const combined = signingData.map((signing) => ({
        ...signing,
        player_id: String(signing.player_id),
        player: playerMap.get(String(signing.player_id)),
      }));

      setAuctionSignings(combined);
      setLoading(false);
    }

    loadTeam();
  }, [supabase, team]);

  if (!team) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-black">Team Not Found</h1>

          <Link
            href="/vctb/2026"
            className="mt-6 inline-block rounded-xl bg-yellow-400 px-6 py-3 font-black text-black"
          >
            Back to VCTB 2026
          </Link>
        </div>
      </main>
    );
  }

  const pointsSpent = auctionSignings.reduce(
    (total, signing) => total + Number(signing.points || 0),
    0
  );

  const remainingPoints = Math.max(
    0,
    team.startingPoints - pointsSpent
  );

  const squadSize =
    team.retained.length + auctionSignings.length;

  function getAuctionPhoto(signing: AuctionSigning) {
    if (signing.player?.photo_url) {
      return signing.player.photo_url;
    }

    const number = Number(signing.player_id);

    const photoCode = Number.isNaN(number)
      ? signing.player_id
      : `VC ${String(number).padStart(3, "0")}`;

    return encodeURI(`/vctb-2026-players/${photoCode}.jpeg`);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">

        {/* BREADCRUMB */}

        <div className="mb-8 flex flex-wrap gap-2 text-sm font-semibold text-white/60">
          <Link
            href="/"
            className="hover:text-yellow-400"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            href="/vctb"
            className="hover:text-yellow-400"
          >
            VCTB
          </Link>

          <span>›</span>

          <Link
            href="/vctb/2026"
            className="hover:text-yellow-400"
          >
            2026
          </Link>

          <span>›</span>

          <span className="text-yellow-400">
            {team.displayName}
          </span>
        </div>

        {/* TEAM HERO */}

        <section className="overflow-hidden rounded-[30px] border border-yellow-400/30 bg-gradient-to-br from-yellow-500/15 via-[#090909] to-red-950/30 shadow-2xl">

          <div className="grid items-center gap-8 p-7 md:p-10 lg:grid-cols-[170px_1fr]">

            <div className="flex justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white p-4 shadow-2xl">
                <Image
                  src={team.logo}
                  alt={team.displayName}
                  width={150}
                  height={150}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="text-center lg:text-left">

              <span className="inline-flex rounded-full bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-yellow-400">
                Group {team.group}
              </span>

              <h1 className="mt-4 text-4xl font-black uppercase md:text-6xl">
                {team.displayName}
              </h1>

              <p className="mt-3 text-lg font-semibold text-white/60">
                VCTB Edition 3.0 • 2026 Final Squad
              </p>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                  Owner
                </p>

                <p className="mt-2 text-xl font-bold">
                  {team.owner}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SUMMARY */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            title="Squad"
            value={loading ? "..." : squadSize.toString()}
            subtitle="Players"
          />

          <SummaryCard
            title="Retained"
            value={team.retained.length.toString()}
            subtitle="Players"
          />

          <SummaryCard
            title="Auction Signings"
            value={loading ? "..." : auctionSignings.length.toString()}
            subtitle="Players"
          />

          <SummaryCard
            title="Auction Spend"
            value={loading ? "..." : pointsSpent.toLocaleString()}
            subtitle={`${remainingPoints.toLocaleString()} pts remaining`}
            yellow
          />

        </section>

        {/* RETAINED PLAYERS */}

        <section className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              ⭐ Retained
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Retained Players
            </h2>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {team.retained.map((player) => (
              <PlayerCard
                key={player.playerId}
                photo={encodeURI(
                  `/vctb-2026-players/${player.photoCode}.jpeg`
                )}
                name={player.name}
                role={player.role}
                playerId={player.photoCode}
                badge="Retained"
              />
            ))}

          </div>

        </section>

        {/* AUCTION SIGNINGS */}

        <section className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
              🔥 Auction
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Auction Signings
            </h2>

          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/40">
              Loading squad...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {auctionSignings.map((signing) => (
                <PlayerCard
                  key={signing.id}
                  photo={getAuctionPhoto(signing)}
                  name={
                    signing.player?.name ||
                    `Player ${signing.player_id}`
                  }
                  role={
                    signing.role ||
                    signing.player?.role ||
                    "Player"
                  }
                  playerId={signing.player_id}
                  badge={`${Number(
                    signing.points
                  ).toLocaleString()} pts`}
                  auction
                />
              ))}

            </div>
          )}

        </section>

        {/* BACK BUTTON */}

        <div className="mt-14 text-center">
          <Link
            href="/vctb/2026#teams"
            className="inline-flex rounded-2xl border border-yellow-400/40 bg-yellow-400/10 px-6 py-3 font-black text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
          >
            ← Back to VCTB 2026 Teams
          </Link>
        </div>

      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  yellow = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  yellow?: boolean;
}) {
  return (
    <div
      className={`rounded-[22px] border p-5 text-center ${
        yellow
          ? "border-yellow-400/25 bg-yellow-400/5"
          : "border-white/10 bg-white/5"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-wider text-white/40">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-black ${
          yellow ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-white/40">
        {subtitle}
      </p>
    </div>
  );
}

function PlayerCard({
  photo,
  name,
  role,
  playerId,
  badge,
  auction = false,
}: {
  photo: string;
  name: string;
  role: string;
  playerId: string;
  badge: string;
  auction?: boolean;
}) {
  return (
    <article
      className={`overflow-hidden rounded-[24px] border bg-[#090909] shadow-xl ${
        auction
          ? "border-red-400/20"
          : "border-yellow-400/20"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black">

        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent px-4 pb-4 pt-14">

          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
              auction
                ? "bg-red-500/20 text-red-300"
                : "bg-yellow-400/15 text-yellow-300"
            }`}
          >
            {badge}
          </span>

        </div>
      </div>

      <div className="p-5">

        <h3 className="text-xl font-black leading-tight">
          {name}
        </h3>

        <p className="mt-2 font-semibold text-white/60">
          {role}
        </p>

        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/35">
          {playerId}
        </p>

      </div>

    </article>
  );
}