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
  { name: "Aathiyadi Super Kings", owner: "Jatheesan Arulanantham", logo: "/vctb/2026/teams/aathiyadi.png", retained: [
    { playerId: "112", photoCode: "VC 112", name: "Satheesram Chandrasegaram", role: "All-Rounder" },
    { playerId: "6", photoCode: "VC 006", name: "Dinalan Nallagurunathan", role: "All-Rounder" },
    { playerId: "160", photoCode: "VC 160", name: "Mohamed Nawazish", role: "All-Rounder" },
    { playerId: "150", photoCode: "VC 150", name: "Akram Muthalib", role: "Wicket Keeper" },
  ]},
  { name: "Balmoral Fighters", owner: "Krishanth Thayalan & Anushan Arulanantham", logo: "/vctb/2026/teams/balmoral.png", retained: [
    { playerId: "53", photoCode: "VC 053", name: "Anushan Arulanantham", role: "All-Rounder" },
    { playerId: "59", photoCode: "VC 059", name: "Caniston Gunaratnam", role: "All-Rounder" },
    { playerId: "93", photoCode: "VC 093", name: "Dinoshan Theivendram", role: "All-Rounder" },
    { playerId: "92", photoCode: "VC 092", name: "Visnujith Parakirama", role: "Bowler" },
    { playerId: "91", photoCode: "VC 091", name: "Fazlan Mohamed", role: "All-Rounder" },
  ]},
  { name: "Niruvaththampai Knights", owner: "Sornaraj Sornavadivel & Ranjithraj Thurairajah", logo: "/vctb/2026/teams/niruvaththampai.png", retained: [
    { playerId: "71", photoCode: "VC 071", name: "Sornaraj Sornavadivel", role: "All-Rounder" },
    { playerId: "54", photoCode: "VC 054", name: "Kabilraj Kanagaratnam", role: "All-Rounder" },
    { playerId: "103", photoCode: "VC 103", name: "Vensakar Kanthiraj", role: "All-Rounder" },
    { playerId: "55", photoCode: "VC 055", name: "Murvin Abinash", role: "All-Rounder" },
    { playerId: "143", photoCode: "VC 143", name: "Anusan Theiventhiran", role: "All-Rounder" },
  ]},
  { name: "Team Tiger", owner: "Mathan", logo: "/vctb/2026/teams/team-tiger.png", retained: [
    { playerId: "175", photoCode: "VC 175", name: "Mathan", role: "Wicket Keeper" },
    { playerId: "80", photoCode: "VC 080", name: "Pramoth Terrance", role: "All-Rounder" },
    { playerId: "68", photoCode: "VC 068", name: "Ukantharasa Vinith", role: "All-Rounder" },
    { playerId: "49", photoCode: "VC 049", name: "Rajee Sivalingam", role: "All-Rounder" },
  ]},
  { name: "Thunnalai Royals", owner: "Sivathasan Kailasapillai & Kugan Navaratnam", logo: "/vctb/2026/teams/thunnalai.png", retained: [
    { playerId: "22", photoCode: "VC 022", name: "Kugan Navaratnam", role: "All-Rounder" },
    { playerId: "154", photoCode: "VC 154", name: "Dikson Manokarasa", role: "All-Rounder" },
    { playerId: "33", photoCode: "VC 033", name: "Purus Paran", role: "All-Rounder" },
    { playerId: "25", photoCode: "VC 025", name: "Saranijan Gabilan", role: "All-Rounder" },
    { playerId: "36", photoCode: "VC 036", name: "Riffaz Mohammed", role: "All-Rounder" },
  ]},
  { name: "Vallvai Blues SC UK", owner: "Ranjith Mahenthirarasaa & Dinesh Poobalasingham (DK)", logo: "/vctb/2026/teams/vallvai-blues.png", retained: [
    { playerId: "3", photoCode: "VC 003", name: "Ranjith Mahenthirarasaa", role: "All-Rounder" },
    { playerId: "83", photoCode: "VC 083", name: "Dinesh Poobalasingham (DK)", role: "All-Rounder" },
    { playerId: "134", photoCode: "VC 134", name: "Dilan Puviraj", role: "All-Rounder" },
    { playerId: "12", photoCode: "VC 012", name: "Kodeeswaran Vasthiyampillai", role: "Wicket Keeper" },
    { playerId: "167", photoCode: "VC 167", name: "Thishok Arasaretnam", role: "All-Rounder" },
  ]},
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

  // =====================================================
  // PAGE
  // =====================================================


  const latestSigning =
    auctionSignings.length > 0
      ? auctionSignings[auctionSignings.length - 1]
      : null;

  const recentSignings = [...auctionSignings]
    .slice(-5)
    .reverse();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">

        {/* ===================================================== */}
        {/* BREADCRUMB */}
        {/* ===================================================== */}

        <div className="mb-8 flex flex-wrap gap-2 text-sm font-semibold text-white/80 md:text-base">
          <Link
            href="/"
            className="hover:text-yellow-400 hover:underline"
          >
            Home
          </Link>

          <span>›</span>

          <Link
            href="/vctb"
            className="hover:text-yellow-400 hover:underline"
          >
            VCTB
          </Link>

          <span>›</span>

          <span className="text-yellow-400">2026</span>
        </div>

        {/* ===================================================== */}
        {/* HERO */}
        {/* ===================================================== */}

        <section
          className="relative overflow-hidden rounded-[32px] border border-yellow-400/50 shadow-2xl"
          style={{
            backgroundImage: "url('/vctb/2026/vctb-2026-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 p-6 md:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[260px_1fr]">

              {/* VCTB LOGO */}
              <div className="flex justify-center">
                <div className="bg-white p-3 shadow-2xl">
                  <Image
                    src="/vctb/2026/vctb-3-logo.png"
                    alt="VCTB Edition 3.0"
                    width={250}
                    height={250}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* HERO TEXT */}
              <div className="text-center lg:text-left">
                <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-400 md:text-base">
                  KWIK MART PRESENTS
                </p>

                <h1 className="mt-4 text-4xl font-black uppercase leading-tight md:text-6xl">
                  VCTB 2026
                </h1>

                <h2 className="mt-2 text-2xl font-black uppercase text-yellow-400 md:text-4xl">
                  Player Auction Night
                </h2>

                <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <div className="rounded-full border border-yellow-400/50 bg-black/75 px-5 py-3 font-bold">
                    📅 14 August 2026
                  </div>

                  <div className="rounded-full border border-yellow-400/50 bg-black/75 px-5 py-3 font-bold">
                    🕡 6:30 PM
                  </div>
                </div>

                <p className="mt-6 max-w-3xl text-base leading-7 text-white/90 md:text-lg">
                  Follow the VCTB Edition 3.0 player auction and see each
                  team squad develop as players are selected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* LIVE AUCTION CENTRE */}
        {/* ===================================================== */}

        <section className="mt-8 overflow-hidden rounded-[30px] border border-red-500/50 bg-gradient-to-br from-red-950/80 via-black to-black shadow-2xl">

          {/* HEADER */}
          <div className="border-b border-red-500/30 bg-red-950/50 px-6 py-5 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />

              <h2 className="text-2xl font-black uppercase tracking-wide md:text-3xl">
                Live Auction Centre
              </h2>
            </div>

            <p className="mt-2 text-sm text-white/60">
              Live VCTB 2026 player auction updates
            </p>
          </div>

          {/* NO SIGNINGS YET */}
          {!latestSigning ? (
            <div className="p-8 text-center md:p-12">
              <p className="text-xl font-black text-white/70">
                Waiting for the first signing...
              </p>

              <p className="mt-2 text-sm text-white/40">
                New auction signings will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="p-6 md:p-8">

              {/* LATEST SIGNING */}
              <div className="rounded-[26px] border border-yellow-400/40 bg-gradient-to-r from-yellow-500/10 via-red-950/40 to-black p-5 md:p-7">

                <p className="mb-5 text-center text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                  🔥 Latest Signing
                </p>

                <div className="flex flex-col items-center gap-6 md:flex-row">

                  <img
                    src={encodeURI(
                      getAuctionPlayerPhoto(
                        latestSigning.player_id,
                        latestSigning.player?.photo_url
                      )
                    )}
                    alt={
                      latestSigning.player?.name ||
                      `Player ${latestSigning.player_id}`
                    }
                    className="h-28 w-28 shrink-0 rounded-full border-4 border-yellow-400 object-cover shadow-xl md:h-32 md:w-32"
                  />

                  <div className="min-w-0 flex-1 text-center md:text-left">

                    <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
                      {latestSigning.player_id}
                    </p>

                    <h3 className="mt-2 text-2xl font-black md:text-4xl">
                      {latestSigning.player?.name ||
                        `Player ${latestSigning.player_id}`}
                    </h3>

                    {(latestSigning.role ||
                      latestSigning.player?.role) && (
                      <p className="mt-2 text-lg font-semibold text-white/60">
                        {latestSigning.role ||
                          latestSigning.player?.role}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">

                      <div className="rounded-full border border-red-500/40 bg-red-950/60 px-5 py-2">
                        <span className="text-xs font-bold uppercase text-white/50">
                          Team
                        </span>

                        <p className="font-black text-white">
                          {latestSigning.team}
                        </p>
                      </div>

                      <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-5 py-2">
                        <span className="text-xs font-bold uppercase text-yellow-400/70">
                          Sold For
                        </span>

                        <p className="font-black text-yellow-400">
                          {Number(
                            latestSigning.points
                          ).toLocaleString()}{" "}
                          Points
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT SIGNINGS */}
              <div className="mt-8">

                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white/70">
                    Recent Signings
                  </h3>

                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                    {auctionSignings.length} Confirmed
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  {recentSignings.map((signing) => (
                    <div
                      key={signing.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >

                      <div className="flex items-center gap-3">

                        <img
                          src={encodeURI(
                            getAuctionPlayerPhoto(
                              signing.player_id,
                              signing.player?.photo_url
                            )
                          )}
                          alt={
                            signing.player?.name ||
                            signing.player_id
                          }
                          className="h-12 w-12 shrink-0 rounded-full border-2 border-yellow-400 object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">
                            {signing.player?.name ||
                              `Player ${signing.player_id}`}
                          </p>

                          {(signing.role ||
                            signing.player?.role) && (
                            <p className="truncate text-xs text-white/50">
                              {signing.role ||
                                signing.player?.role}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 border-t border-white/10 pt-3">

                        <p className="truncate text-xs font-bold text-red-300">
                          {signing.team}
                        </p>

                        <p className="mt-1 text-lg font-black text-yellow-400">
                          {Number(
                            signing.points
                          ).toLocaleString()}{" "}
                          pts
                        </p>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===================================================== */}
        {/* SPONSORS */}
        {/* ===================================================== */}

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              Partners
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Tournament Sponsors
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* KWIK MART */}
            <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1">
              <p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">
                Title Sponsor
              </p>

              <Image
                src="/sponsors/kiwikmart.png"
                alt="Kwik Mart"
                width={260}
                height={120}
                className="object-contain"
              />
            </div>

            {/* JATHEESAN */}
            <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1">
              <p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">
                Gold Sponsor
              </p>

              <Image
                src="/sponsors/jatheesan.png"
                alt="Jatheesan Ltd"
                width={260}
                height={120}
                className="object-contain"
              />
            </div>

            {/* SAM */}
            <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1">
              <p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">
                Powered By
              </p>

              <Image
                src="/sponsors/sam.jpg"
                alt="SAM Accountants"
                width={260}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* PARTICIPATING TEAMS */}
        {/* ===================================================== */}

        <section className="mt-16">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              VCTB Edition 3.0
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              Participating Teams
            </h2>

            <p className="mt-3 max-w-3xl text-white/70">
              Retained players and auction signings for VCTB 2026.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => {
              const teamSignings = getTeamSignings(team.name);

              const currentSquad =
                team.retained.length + teamSignings.length;

              return (
                <article
                  key={team.name}
                  className="overflow-hidden rounded-[28px] border border-yellow-400/30 bg-[#080808] shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-yellow-400/60"
                >

                  {/* ================================================= */}
                  {/* TEAM HEADER */}
                  {/* ================================================= */}

                  <div className="border-b border-yellow-400/20 bg-gradient-to-r from-yellow-500/20 via-[#111]/80 to-red-600/15 p-6">
                    <div className="flex items-center gap-5">

                      {/* TEAM LOGO */}
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-xl">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          width={90}
                          height={90}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* TEAM NAME */}
                      <div>
                        <h3 className="text-xl font-black uppercase leading-tight md:text-2xl">
                          {team.name}
                        </h3>

                        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
                          VCTB 2026
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* TEAM DETAILS */}
                  {/* ================================================= */}

                  <div className="p-6">

                    {/* OWNER */}
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                        Owner
                      </p>

                      <p className="mt-2 text-lg font-bold">
                        {team.owner}
                      </p>
                    </div>

                    {/* ================================================= */}
                    {/* RETAINED PLAYERS */}
                    {/* ================================================= */}

                    <div className="mt-7">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                          Retained Players
                        </p>

                        <span className="whitespace-nowrap rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-bold text-yellow-300">
                          {team.retained.length}{" "}
                          {team.retained.length === 1
                            ? "Player"
                            : "Players"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {team.retained.map((retainedRef) => {
                          const retainedPlayer =
                            retainedPlayers.get(retainedRef.playerId);

                          return (
                            <div
                              key={retainedRef.playerId}
                              className="flex items-center gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-3"
                            >

                              {/* RETAINED PLAYER PHOTO */}
                              <img
                                src={getRetainedPhoto(
                                  retainedRef.photoCode
                                )}
                                alt={
                                  retainedPlayer?.name ||
                                  retainedRef.name
                                }
                                className="h-14 w-14 shrink-0 rounded-full border-2 border-yellow-400 object-cover"
                              />

                              {/* RETAINED PLAYER DETAILS */}
                              <div className="min-w-0 flex-1">

                                <p className="font-black leading-tight text-white">
                                  {loadingRetained
                                    ? retainedRef.name
                                    : retainedPlayer?.name ||
                                      retainedRef.name}
                                </p>

                                {/* CONFIRMED RETAINED PLAYER ROLE */}
                                <p className="mt-1 text-xs font-semibold text-white/60">
                                  {retainedRef.role || retainedPlayer?.role}
                                </p>

                                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
                                  {retainedRef.photoCode}
                                </p>
                              </div>

                              {/* RETAINED STAR */}
                              <div className="shrink-0 text-lg text-yellow-400">
                                ⭐
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* AUCTION SIGNINGS */}
                    {/* ================================================= */}

                    <div className="mt-7">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                          Auction Signings
                        </p>

                        {teamSignings.length > 0 && (
                          <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-300">
                            {teamSignings.length}{" "}
                            {teamSignings.length === 1
                              ? "Signing"
                              : "Signings"}
                          </span>
                        )}
                      </div>

                      {loadingSignings ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-center">
                          <p className="font-semibold text-white/50">
                            Loading auction signings...
                          </p>
                        </div>
                      ) : teamSignings.length === 0 ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-red-400/30 bg-red-950/20 p-5 text-center">
                          <p className="font-semibold text-white/60">
                            Waiting for Auction Night...
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {teamSignings.map((signing) => {
                            const player = signing.player;

                            const signingRole =
                              signing.role || player?.role;

                            return (
                              <div
                                key={signing.id}
                                className="flex items-center gap-3 rounded-2xl border border-red-400/20 bg-gradient-to-r from-red-950/40 to-white/5 p-3"
                              >

                                {/* AUCTION PLAYER PHOTO */}
                                <img
                                  src={getAuctionPlayerPhoto(
                                    signing.player_id,
                                    player?.photo_url
                                  )}
                                  alt={
                                    player?.name ||
                                    `Player ${signing.player_id}`
                                  }
                                  className="h-14 w-14 shrink-0 rounded-full border-2 border-red-400 object-cover"
                                />

                                {/* AUCTION PLAYER DETAILS */}
                                <div className="min-w-0 flex-1">
                                  <p className="font-black leading-tight text-white">
                                    {player?.name ||
                                      `Player ${signing.player_id}`}
                                  </p>

                                  {/* ROLE FROM ADMIN SIGNING */}
                                  {signingRole && (
                                    <p className="mt-1 text-xs font-semibold text-white/60">
                                      {signingRole}
                                    </p>
                                  )}

                                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
                                    Player #{signing.player_id}
                                  </p>
                                </div>

                                {/* AUCTION POINTS */}
                                <div className="shrink-0 text-right">
                                  <p className="text-lg font-black text-yellow-400">
                                    {Number(
                                      signing.points
                                    ).toLocaleString()}
                                  </p>

                                  <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-400/70">
                                    Points
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* ================================================= */}
                    {/* CURRENT SQUAD */}
                    {/* ================================================= */}

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="text-sm text-white/60">
                        Current Squad
                      </span>

                      <span className="text-lg font-black text-yellow-400">
                        {currentSquad}{" "}
                        {currentSquad === 1 ? "Player" : "Players"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===================================================== */}
        {/* RETENTION RULES */}
        {/* ===================================================== */}

        <section className="mt-16 rounded-[30px] border border-yellow-400/30 bg-[#080808] p-7 shadow-2xl md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
            VCTB 2026
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Retention Rules
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-4xl font-black text-yellow-400">
                4
              </p>

              <p className="mt-2 text-white/70">
                Retained players permitted per team.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-4xl font-black text-yellow-400">
                5
              </p>

              <p className="mt-2 text-white/70">
                If an owner is playing, the squad may include 4 retained
                players plus 1 playing owner.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}