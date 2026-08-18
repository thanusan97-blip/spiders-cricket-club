"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Player = {
  player_id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
};

type RetainedPlayerRef = {
  playerId: string;
  photoCode: string;
  name: string;
  role: string;
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

const teams = [
  { name: "Aathiyadi JL Super Kings", owner: "Jatheesan Arulanantham", startingPoints: 3000, logo: "/vctb/2026/teams/aathiyadi.png", retained: [
    { playerId: "112", photoCode: "VC 112", name: "Satheesram Chandrasegaram", role: "All-Rounder" },
    { playerId: "6", photoCode: "VC 006", name: "Dinalan Nallagurunathan", role: "All-Rounder" },
    { playerId: "160", photoCode: "VC 160", name: "Mohamed Nawazish", role: "All-Rounder" },
    { playerId: "150", photoCode: "VC 150", name: "Akram Muthalib", role: "Wicket Keeper" },
  ]},
  { name: "Balmoral Fighters", startingPoints: 2900, owner: "Krishanth Thayalan & Anushan Arulanantham", logo: "/vctb/2026/teams/balmoral.png", retained: [
    { playerId: "53", photoCode: "VC 053", name: "Anushan Arulanantham", role: "All-Rounder" },
    { playerId: "59", photoCode: "VC 059", name: "Caniston Gunaratnam", role: "All-Rounder" },
    { playerId: "93", photoCode: "VC 093", name: "Dinoshan Theivendram", role: "All-Rounder" },
    { playerId: "92", photoCode: "VC 092", name: "Visnujith Parakirama", role: "Bowler" },
    { playerId: "91", photoCode: "VC 091", name: "Fazlan Mohamed", role: "All-Rounder" },
  ]},
  { name: "Niruvaththampai Knights", startingPoints: 2900, owner: "Sornaraj Sornavadivel & Ranjithraj Thurairajah", logo: "/vctb/2026/teams/niruvaththampai.png", retained: [
    { playerId: "71", photoCode: "VC 071", name: "Sornaraj Sornavadivel", role: "All-Rounder" },
    { playerId: "54", photoCode: "VC 054", name: "Kabilraj Kanagaratnam", role: "All-Rounder" },
    { playerId: "103", photoCode: "VC 103", name: "Vensakar Kanthiraj", role: "All-Rounder" },
    { playerId: "55", photoCode: "VC 055", name: "Murvin Abinash", role: "All-Rounder" },
    { playerId: "143", photoCode: "VC 143", name: "Anusan Theiventhiran", role: "All-Rounder" },
  ]},
  { name: "Team Tiger", startingPoints: 2900, owner: "Sothilingham Yogeswaran (Mathan)", logo: "/vctb/2026/teams/team-tiger.png", retained: [
    { playerId: "175", photoCode: "VC 175", name: "Mathan", role: "Wicket Keeper" },
    { playerId: "80", photoCode: "VC 080", name: "Pramoth Terrance", role: "All-Rounder" },
    { playerId: "68", photoCode: "VC 068", name: "Ukantharasa Vinith", role: "All-Rounder" },
    { playerId: "49", photoCode: "VC 049", name: "Rajee Sivalingam", role: "All-Rounder" },
    { playerId: "104", photoCode: "VC 104", name: "Dhivendhiran Vembaiyan", role: "Batsman" },
  ]},
  { name: "Thunnalai Royals", startingPoints: 2900, owner: "Sivathasan Kailasapillai & Kugan Navaratnam", logo: "/vctb/2026/teams/thunnalai.png", retained: [
    { playerId: "22", photoCode: "VC 022", name: "Kugan Navaratnam", role: "All-Rounder" },
    { playerId: "154", photoCode: "VC 154", name: "Dikson Manokarasa", role: "All-Rounder" },
    { playerId: "33", photoCode: "VC 033", name: "Purus Paran", role: "All-Rounder" },
    { playerId: "25", photoCode: "VC 025", name: "Saranijan Gabilan", role: "All-Rounder" },
    { playerId: "36", photoCode: "VC 036", name: "Riffaz Mohammed", role: "All-Rounder" },
  ]},
  { name: "Vallvai Blues SC UK", startingPoints: 2900, owner: "Ranjith Mahenthirarasaa & Dinesh Poobalasingham (DK)", logo: "/vctb/2026/teams/vallvai-blues.png", retained: [
    { playerId: "3", photoCode: "VC 003", name: "Ranjith Mahenthirarasaa", role: "All-Rounder" },
    { playerId: "83", photoCode: "VC 083", name: "Dinesh Poobalasingham (DK)", role: "All-Rounder" },
    { playerId: "134", photoCode: "VC 134", name: "Dilan Puviraj", role: "All-Rounder" },
    { playerId: "12", photoCode: "VC 012", name: "Kodeeswaran Vasthiyampillai", role: "Wicket Keeper" },
    { playerId: "167", photoCode: "VC 167", name: "Thishok Arasaretnam", role: "All-Rounder" },
  ]},
];

const teamMeta: Record<string, { shortName: string; slug: string; group: "A" | "B" }> = {
  "Aathiyadi JL Super Kings": { shortName: "Aathiyadi JL Super Kings", slug: "aathiyadi-jl-super-kings", group: "A" },
  "Balmoral Fighters": { shortName: "Balmoral Fighters", slug: "balmoral-fighters", group: "A" },
  "Niruvaththampai Knights": { shortName: "Niruvaththampai Knights", slug: "niruvaththampai-knights", group: "B" },
  "Team Tiger": { shortName: "Team Tiger", slug: "team-tiger", group: "B" },
  "Thunnalai Royals": { shortName: "Thunnalai Royals", slug: "thunnalai-royals", group: "A" },
  "Vallvai Blues SC UK": { shortName: "Vallvai Kadalodikal", slug: "vallvai-blues-sc-uk", group: "B" },
};

type Fixture = {
  time: string;
  pitch: "Pitch 1" | "Pitch 2";
  teamA?: string;
  teamB?: string;
  label?: string;
  kind: "match" | "ceremony" | "semi" | "final";
};

const fixtures: Fixture[] = [
  { time: "8:00 AM", pitch: "Pitch 1", label: "VCTB Opening Ceremony", kind: "ceremony" },
  { time: "8:00 AM", pitch: "Pitch 2", label: "VCTB Opening Ceremony", kind: "ceremony" },
  { time: "8:30 AM", pitch: "Pitch 1", teamA: "Thunnalai Royals", teamB: "Vallvai Blues SC UK", kind: "match" },
  { time: "8:30 AM", pitch: "Pitch 2", teamA: "Balmoral Fighters", teamB: "Niruvaththampai Knights", kind: "match" },
  { time: "10:00 AM", pitch: "Pitch 1", teamA: "Aathiyadi JL Super Kings", teamB: "Team Tiger", kind: "match" },
  { time: "10:00 AM", pitch: "Pitch 2", teamA: "Thunnalai Royals", teamB: "Niruvaththampai Knights", kind: "match" },
  { time: "11:30 AM", pitch: "Pitch 1", teamA: "Balmoral Fighters", teamB: "Vallvai Blues SC UK", kind: "match" },
  { time: "1:00 PM", pitch: "Pitch 1", teamA: "Balmoral Fighters", teamB: "Team Tiger", kind: "match" },
  { time: "1:00 PM", pitch: "Pitch 2", teamA: "Aathiyadi JL Super Kings", teamB: "Vallvai Blues SC UK", kind: "match" },
  { time: "2:30 PM", pitch: "Pitch 1", teamA: "Thunnalai Royals", teamB: "Team Tiger", kind: "match" },
  { time: "2:30 PM", pitch: "Pitch 2", teamA: "Aathiyadi JL Super Kings", teamB: "Niruvaththampai Knights", kind: "match" },
  { time: "4:00 PM", pitch: "Pitch 1", label: "Semi Final 1 — 1st of Group A vs 2nd of Group A", kind: "semi" },
  { time: "4:00 PM", pitch: "Pitch 2", label: "Semi Final 2 — 1st of Group B vs 2nd of Group B", kind: "semi" },
  { time: "5:30 PM", pitch: "Pitch 1", label: "VCTB Grand Final", kind: "final" },
  { time: "7:15 PM", pitch: "Pitch 1", label: "Presentation Ceremony", kind: "ceremony" },
  { time: "7:15 PM", pitch: "Pitch 2", label: "Presentation Ceremony", kind: "ceremony" },
];


export default function VCTB2026Page() {
  const supabase = useMemo(() => createClient(), []);

  const [auctionSignings, setAuctionSignings] = useState<AuctionSigning[]>([]);
  const [loadingSignings, setLoadingSignings] = useState(true);

  const [retainedPlayers, setRetainedPlayers] = useState<
    Map<string, Player>
  >(new Map());

  const [loadingRetained, setLoadingRetained] = useState(true);

  // =====================================================
  // LOAD RETAINED PLAYERS
  // =====================================================

  const loadRetainedPlayers = useCallback(async () => {
    setLoadingRetained(true);

    const retainedIds = [
      ...new Set(
        teams.flatMap((team) =>
          team.retained.map((retainedPlayer) => retainedPlayer.playerId)
        )
      ),
    ];

    const { data, error } = await supabase
      .from("players")
      .select("player_id, name, role, photo_url")
      .in("player_id", retainedIds);

    if (error) {
      console.error("Retained players error:", error);
      setLoadingRetained(false);
      return;
    }

    const playerMap = new Map<string, Player>();

    (data || []).forEach((player) => {
      playerMap.set(String(player.player_id), player);
    });

    setRetainedPlayers(playerMap);
    setLoadingRetained(false);
  }, [supabase]);

  // =====================================================
  // LOAD AUCTION SIGNINGS
  // =====================================================

  const loadAuctionSignings = useCallback(async () => {
    setLoadingSignings(true);

    const { data: signingData, error: signingError } = await supabase
      .from("auction_signings")
      .select("id, created_at, player_id, team, role, points")
      .order("created_at", { ascending: true });

    if (signingError) {
      console.error("Auction signings error:", signingError);
      setLoadingSignings(false);
      return;
    }

    if (!signingData || signingData.length === 0) {
      setAuctionSignings([]);
      setLoadingSignings(false);
      return;
    }

    const playerIds = [
      ...new Set(signingData.map((signing) => String(signing.player_id))),
    ];

    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("player_id, name, role, photo_url")
      .in("player_id", playerIds);

    if (playerError) {
      console.error("Players error:", playerError);

      setAuctionSignings(
        signingData.map((signing) => ({
          ...signing,
          player_id: String(signing.player_id),
        }))
      );

      setLoadingSignings(false);
      return;
    }

    const playerMap = new Map<string, Player>();

    (playerData || []).forEach((player) => {
      playerMap.set(String(player.player_id), player);
    });

    const combinedData: AuctionSigning[] = signingData.map((signing) => ({
      ...signing,
      player_id: String(signing.player_id),
      player: playerMap.get(String(signing.player_id)),
    }));

    setAuctionSignings(combinedData);
    setLoadingSignings(false);
  }, [supabase]);

  // =====================================================
  // INITIAL LOAD + LIVE AUCTION UPDATES
  // =====================================================

  useEffect(() => {
    loadRetainedPlayers();
    loadAuctionSignings();

    const channel = supabase
      .channel("vctb-2026-auction-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auction_signings",
        },
        () => {
          loadAuctionSignings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, loadAuctionSignings, loadRetainedPlayers]);

  // =====================================================
  // PHOTO HELPERS
  // =====================================================

  function getAuctionPlayerPhoto(
    playerId: string,
    photoUrl?: string | null
  ) {
    if (photoUrl) {
      return photoUrl;
    }

    const number = Number(playerId);

    const photoCode = Number.isNaN(number)
      ? playerId
      : `VC ${String(number).padStart(3, "0")}`;

    return `/vctb-2026-players/${photoCode}.jpeg`;
  }

  function getRetainedPhoto(photoCode: string) {
    return `/vctb-2026-players/${photoCode}.jpeg`;
  }

  // =====================================================
  // TEAM SIGNINGS
  // =====================================================

  function getTeamSignings(teamName: string) {
    return auctionSignings.filter(
      (signing) => signing.team === teamName
    );
  }

  function getDisplayTeamName(teamName: string) {
    return teamMeta[teamName]?.shortName || teamName;
  }

  // =====================================================
  // PAGE
  // =====================================================


  const latestSigning =
    auctionSignings.length > 0
      ? auctionSignings[auctionSignings.length - 1]
      : null;

  const topFiveSignings = [...auctionSignings]
    .sort((a, b) => Number(b.points) - Number(a.points))
    .slice(0, 5);

  const totalAuctionPoints = auctionSignings.reduce(
    (total, signing) => total + Number(signing.points || 0),
    0
  );

  const totalSquadPlayers = teams.reduce(
    (total, team) => total + team.retained.length + getTeamSignings(team.name).length,
    0
  );

  const pitch1Fixtures = fixtures.filter((fixture) => fixture.pitch === "Pitch 1");
  const pitch2Fixtures = fixtures.filter((fixture) => fixture.pitch === "Pitch 2");

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="mb-8 flex flex-wrap gap-2 text-sm font-semibold text-white/80 md:text-base">
          <Link href="/" className="hover:text-yellow-400 hover:underline">Home</Link>
          <span>›</span>
          <Link href="/vctb" className="hover:text-yellow-400 hover:underline">VCTB</Link>
          <span>›</span>
          <span className="text-yellow-400">2026</span>
        </div>

        <section className="relative overflow-hidden rounded-[32px] border border-yellow-400/50 shadow-2xl" style={{backgroundImage:"url('/vctb/2026/vctb-2026-bg.png')",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"}}>
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 p-6 md:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[250px_1fr]">
              <div className="flex justify-center">
                <div className="rounded-[26px] bg-white p-3 shadow-2xl">
                  <Image src="/vctb/2026/vctb-3-logo.png" alt="VCTB Edition 3.0" width={240} height={240} priority className="object-contain" />
                </div>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-400 md:text-base">KWIK MART PRESENTS</p>
                <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">Vadamaradchy Champion T10 Blast</h1>
                <h2 className="mt-3 text-2xl font-black uppercase text-yellow-400 md:text-4xl">Edition 3.0 • 2026</h2>
                <p className="mt-6 text-xl font-black uppercase md:text-2xl">The Teams Are Ready 🔥</p>
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/75 md:text-lg">Six teams. {totalSquadPlayers || 102} players. One trophy. VCTB 3.0 moves from Auction Night to tournament day.</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <div className="rounded-full border border-yellow-400/40 bg-black/65 px-5 py-3 font-bold">📅 6 September 2026</div>
                  <div className="rounded-full border border-yellow-400/40 bg-black/65 px-5 py-3 font-bold">📍 Tenetelow Sports Ground, UB2 4LW</div>
                  <div className="rounded-full border border-yellow-400/40 bg-black/65 px-5 py-3 font-bold">🏏 2 Pitches</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {[["Teams","#teams"],["Fixtures","#fixtures"],["Live","#live"],["Points Table","#points-table"],["Statistics","#statistics"],["Auction","#auction"]].map(([label,href])=>(
            <a key={label} href={href} className="rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-4 text-center text-sm font-black uppercase tracking-wider transition hover:-translate-y-1 hover:border-yellow-400/50 hover:text-yellow-400">{label}</a>
          ))}
        </nav>

        <section id="live" className="mt-10 overflow-hidden rounded-[30px] border border-red-500/30 bg-gradient-to-br from-red-950/60 via-[#070707] to-black shadow-2xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 md:p-9">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">VCTB 3.0 Match Centre</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">Opening Round</h2>
              <p className="mt-3 max-w-2xl text-white/60">Two matches begin simultaneously at 8:30 AM across Pitch 1 and Pitch 2.</p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <OpeningMatchCard pitch="Pitch 1" time="8:30 AM" teamA="Thunnalai Royals" teamB="Vallvai Blues SC UK" />
                <OpeningMatchCard pitch="Pitch 2" time="8:30 AM" teamA="Balmoral Fighters" teamB="Niruvaththampai Knights" />
              </div>
            </div>
            <div className="border-t border-white/10 bg-white/[0.03] p-7 lg:border-l lg:border-t-0 md:p-9">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">Live Scoring</p>
              <h3 className="mt-3 text-2xl font-black">VCTB Live Score Centre</h3>
              <p className="mt-3 leading-7 text-white/60">Professional VCTB live scoring, scorecards and broadcast overlays can be connected here when the scoring system is ready.</p>
              <div className="mt-6 rounded-2xl border border-dashed border-yellow-400/30 bg-yellow-400/5 p-5">
                <p className="font-black text-yellow-400">Coming next</p>
                <p className="mt-2 text-sm text-white/50">Live score • Scorecard • Commentary • Playing XI • Match info</p>
              </div>
            </div>
          </div>
        </section>

        <section id="teams" className="mt-16">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">VCTB Edition 3.0</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">2026 Teams</h2>
            <p className="mt-3 max-w-3xl text-white/60">Final squads are complete following the VCTB 3.0 player auction.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team)=>{
              const teamSignings=getTeamSignings(team.name);
              const squadSize=team.retained.length+teamSignings.length;
              const pointsSpent=teamSignings.reduce((total,signing)=>total+Number(signing.points||0),0);
              const remainingPoints=Math.max(0,team.startingPoints-pointsSpent);
              const meta=teamMeta[team.name];
              return <article key={team.name} className="overflow-hidden rounded-[28px] border border-yellow-400/25 bg-[#080808] shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60">
                <div className="border-b border-yellow-400/20 bg-gradient-to-r from-yellow-500/15 via-[#111] to-red-600/10 p-6">
                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-xl"><Image src={team.logo} alt={team.name} width={75} height={75} className="h-full w-full object-contain" /></div>
                    <div className="min-w-0">
                      <div className="mb-2 inline-flex rounded-full bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-400">Group {meta.group}</div>
                      <h3 className="text-xl font-black uppercase leading-tight">{meta.shortName}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">Owner</p>
                  <p className="mt-2 min-h-[52px] text-lg font-bold">{team.owner}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-white/40">Squad</p><p className="mt-1 text-2xl font-black text-white">{squadSize||17}</p><p className="text-xs text-white/40">Players</p></div>
                    <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-yellow-300/70">Auction Balance</p><p className="mt-1 text-2xl font-black text-yellow-400">{remainingPoints.toLocaleString()}</p><p className="text-xs text-yellow-400/50">Points</p></div>
                  </div>
                  <Link
                    href={`/vctb/2026/teams/${meta.slug}`}
                    className="mt-5 block rounded-2xl bg-yellow-400 px-5 py-3 text-center text-sm font-black uppercase text-black transition hover:bg-yellow-300"
                  >
                    View Full Squad →
                  </Link>
                </div>
              </article>
            })}
          </div>
        </section>

        <section id="fixtures" className="mt-16">
          <div className="mb-8"><p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">6 September 2026</p><h2 className="mt-2 text-3xl font-black md:text-5xl">Fixtures & Tournament Schedule</h2><p className="mt-3 max-w-3xl text-white/60">League matches are cross-group. Semi-finals are played within the same group: 1st vs 2nd.</p></div>
          <div className="grid gap-6 xl:grid-cols-2"><FixtureColumn title="Pitch 1" fixtures={pitch1Fixtures}/><FixtureColumn title="Pitch 2" fixtures={pitch2Fixtures}/></div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-center"><p className="font-black text-yellow-400">📍 Tenetelow Sports Ground, UB2 4LW</p></div>
        </section>

        <section id="points-table" className="mt-16">
          <div className="mb-8"><p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Tournament Standings</p><h2 className="mt-2 text-3xl font-black md:text-5xl">Points Table</h2><p className="mt-3 text-white/60">Tables are ready for match results. Automatic scoring integration can be added next.</p></div>
          <div className="grid gap-6 xl:grid-cols-2"><PointsTable group="A"/><PointsTable group="B"/></div>
        </section>

        <section id="statistics" className="mt-16">
          <div className="mb-8"><p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Tournament Leaders</p><h2 className="mt-2 text-3xl font-black md:text-5xl">VCTB 3.0 Statistics</h2></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[["🏏","Top Run Scorer"],["🎯","Top Wicket Taker"],["🔥","Most Sixes"],["💯","Highest Score"],["⚡","Best Bowling"]].map(([icon,title])=><div key={title} className="rounded-[24px] border border-white/10 bg-[#0a0a0a] p-6 text-center"><div className="text-4xl">{icon}</div><p className="mt-4 text-xs font-black uppercase tracking-wider text-yellow-400">{title}</p><p className="mt-3 text-lg font-black text-white/40">Tournament Pending</p></div>)}</div>
        </section>

        <section id="auction" className="mt-16 overflow-hidden rounded-[30px] border border-red-500/30 bg-gradient-to-br from-red-950/60 via-[#080808] to-black shadow-2xl">
          <div className="border-b border-red-500/20 p-7 text-center md:p-9"><p className="text-sm font-black uppercase tracking-[0.3em] text-red-400">VCTB 3.0 Auction</p><h2 className="mt-2 text-3xl font-black md:text-5xl">Auction Completed ✓</h2><p className="mt-3 text-white/60">The squads are complete. Auction Night is now part of the VCTB 3.0 tournament archive.</p></div>
          <div className="p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><AuctionStat label="Auction Signings" value={loadingSignings?"...":auctionSignings.length.toString()}/><AuctionStat label="Teams" value="6"/><AuctionStat label="Final Squad Players" value={(totalSquadPlayers||102).toString()}/><AuctionStat label="Auction Points Spent" value={loadingSignings?"...":totalAuctionPoints.toLocaleString()}/></div>
            {latestSigning&&<div className="mt-7 rounded-[24px] border border-white/10 bg-white/5 p-5"><p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">Final Signing</p><div className="mt-4 flex flex-col items-center gap-4 sm:flex-row"><img src={encodeURI(getAuctionPlayerPhoto(latestSigning.player_id,latestSigning.player?.photo_url))} alt={latestSigning.player?.name||latestSigning.player_id} className="h-20 w-20 rounded-full border-2 border-yellow-400 object-cover"/><div className="text-center sm:text-left"><h3 className="text-2xl font-black">{latestSigning.player?.name||`Player ${latestSigning.player_id}`}</h3><p className="mt-1 text-white/50">{getDisplayTeamName(latestSigning.team)} • {Number(latestSigning.points).toLocaleString()} points</p></div></div></div>}
            <div className="mt-9"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">Auction Leaders</p><h3 className="mt-2 text-2xl font-black md:text-3xl">Top 5 Auction Signings</h3></div><p className="text-sm text-white/40">Automatically ranked by points</p></div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">{topFiveSignings.map((signing,index)=><div key={signing.id} className="rounded-[22px] border border-yellow-400/20 bg-black/50 p-4"><div className="flex items-start justify-between gap-3"><span className="text-3xl font-black text-yellow-400/40">#{index+1}</span><span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">{Number(signing.points).toLocaleString()} pts</span></div><img src={encodeURI(getAuctionPlayerPhoto(signing.player_id,signing.player?.photo_url))} alt={signing.player?.name||signing.player_id} className="mx-auto mt-4 h-24 w-24 rounded-full border-2 border-yellow-400 object-cover"/><h4 className="mt-4 text-center text-lg font-black leading-tight">{signing.player?.name||`Player ${signing.player_id}`}</h4><p className="mt-2 text-center text-xs font-bold text-red-300">{getDisplayTeamName(signing.team)}</p><p className="mt-1 text-center text-xs text-white/40">{signing.role||signing.player?.role||"Player"}</p></div>)}</div>
            </div>
          </div>
        </section>

        <section className="mt-16 pb-4"><div className="mb-6"><p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Partners</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Tournament Sponsors</h2></div><div className="grid gap-5 md:grid-cols-3"><SponsorCard title="Title Sponsor" src="/sponsors/kiwikmart.png" alt="Kwik Mart"/><SponsorCard title="Gold Sponsor" src="/sponsors/jatheesan.png" alt="Jatheesan Ltd"/><SponsorCard title="Powered By" src="/sponsors/sam.jpg" alt="SAM Accountants"/></div></section>
      </div>
    </main>
  );
}

function OpeningMatchCard({pitch,time,teamA,teamB}:{pitch:string;time:string;teamA:string;teamB:string;}){
  return <div className="rounded-[24px] border border-white/10 bg-black/40 p-5"><div className="flex items-center justify-between"><span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-black uppercase text-red-300">{pitch}</span><span className="text-sm font-black text-yellow-400">{time}</span></div><div className="mt-5 space-y-4"><TeamMiniRow teamName={teamA}/><div className="text-center text-xs font-black uppercase tracking-[0.3em] text-white/25">VS</div><TeamMiniRow teamName={teamB}/></div></div>
}
function TeamMiniRow({teamName}:{teamName:string}){const team=teams.find((t)=>t.name===teamName);if(!team)return null;return <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1.5"><Image src={team.logo} alt={team.name} width={44} height={44} className="h-full w-full object-contain"/></div><p className="font-black leading-tight">{teamMeta[team.name].shortName}</p></div>}
function FixtureColumn({title,fixtures}:{title:string;fixtures:Fixture[]}){return <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#080808]"><div className="bg-gradient-to-r from-blue-950 via-black to-red-950 px-6 py-5"><h3 className="text-2xl font-black uppercase">{title}</h3></div><div className="divide-y divide-white/5">{fixtures.map((fixture,index)=><FixtureRow key={`${fixture.pitch}-${fixture.time}-${index}`} fixture={fixture}/>)}</div></div>}
function FixtureRow({fixture}:{fixture:Fixture}){if(fixture.kind!=="match")return <div className="grid gap-3 px-5 py-4 sm:grid-cols-[90px_1fr] sm:items-center"><p className="font-black text-yellow-400">{fixture.time}</p><div><span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${fixture.kind==="final"?"bg-yellow-400 text-black":fixture.kind==="semi"?"bg-red-500/15 text-red-300":"bg-white/10 text-white/60"}`}>{fixture.kind==="final"?"Grand Final":fixture.kind==="semi"?"Semi Final":"Ceremony"}</span><p className="mt-2 font-black">{fixture.label}</p></div></div>;return <div className="grid gap-3 px-5 py-4 sm:grid-cols-[90px_1fr] sm:items-center"><p className="font-black text-yellow-400">{fixture.time}</p><div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]"><FixtureTeam teamName={fixture.teamA!}/><span className="text-center text-xs font-black uppercase tracking-wider text-white/30">VS</span><FixtureTeam teamName={fixture.teamB!} right/></div></div>}
function FixtureTeam({teamName,right=false}:{teamName:string;right?:boolean}){const team=teams.find((t)=>t.name===teamName);if(!team)return null;return <div className={`flex items-center gap-3 ${right?"sm:flex-row-reverse sm:text-right":""}`}><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1"><Image src={team.logo} alt={team.name} width={40} height={40} className="h-full w-full object-contain"/></div><p className="text-sm font-black leading-tight">{teamMeta[team.name].shortName}</p></div>}
function PointsTable({group}:{group:"A"|"B"}){const groupTeams=teams.filter((team)=>teamMeta[team.name].group===group);return <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#080808]"><div className="border-b border-white/10 bg-white/5 px-6 py-5"><p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">Group {group}</p><h3 className="mt-2 text-2xl font-black">Standings</h3></div><div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead><tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-white/40"><th className="px-5 py-4">Team</th><th className="px-3 py-4">P</th><th className="px-3 py-4">W</th><th className="px-3 py-4">L</th><th className="px-3 py-4">Pts</th><th className="px-3 py-4">NRR</th></tr></thead><tbody>{groupTeams.map((team)=><tr key={team.name} className="border-b border-white/5"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-white p-1"><Image src={team.logo} alt={team.name} width={32} height={32} className="h-full w-full object-contain"/></div><span className="font-black">{teamMeta[team.name].shortName}</span></div></td><td className="px-3 py-4 text-white/50">0</td><td className="px-3 py-4 text-white/50">0</td><td className="px-3 py-4 text-white/50">0</td><td className="px-3 py-4 font-black text-yellow-400">0</td><td className="px-3 py-4 text-white/50">0.000</td></tr>)}</tbody></table></div></div>}
function AuctionStat({label,value}:{label:string;value:string}){return <div className="rounded-[22px] border border-white/10 bg-white/5 p-5 text-center"><p className="text-3xl font-black text-yellow-400">{value}</p><p className="mt-2 text-xs font-black uppercase tracking-wider text-white/40">{label}</p></div>}
function SponsorCard({title,src,alt}:{title:string;src:string;alt:string}){return <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1"><p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">{title}</p><Image src={src} alt={alt} width={260} height={120} className="object-contain"/></div>}