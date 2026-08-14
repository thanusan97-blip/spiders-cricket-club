"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

const teamBudgets: Record<string, number> = {
  "Aathiyadi JL Super Kings": 3000,
  "Balmoral Fighters": 2900,
  "Niruvaththampai Knights": 2900,
  "Team Tiger": 2900,
  "Thunnalai Royals": 2900,
  "Vallvai Blues SC UK": 2900,
};

const teamLogos: Record<string, string> = {
  "Aathiyadi JL Super Kings": "/vctb/2026/teams/aathiyadi.png",
  "Balmoral Fighters": "/vctb/2026/teams/balmoral.png",
  "Niruvaththampai Knights": "/vctb/2026/teams/niruvaththampai.png",
  "Team Tiger": "/vctb/2026/teams/team-tiger.png",
  "Thunnalai Royals": "/vctb/2026/teams/thunnalai.png",
  "Vallvai Blues SC UK": "/vctb/2026/teams/vallvai-blues.png",
};

export default function VCTBLiveOverlayPage() {
  const supabase = useMemo(() => createClient(), []);

  const [signings, setSignings] = useState<AuctionSigning[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSignings = useCallback(async () => {
    const { data: signingData, error: signingError } = await supabase
      .from("auction_signings")
      .select("id, created_at, player_id, team, role, points")
      .order("created_at", { ascending: true });

    if (signingError) {
      console.error("Auction signing error:", signingError);
      setLoading(false);
      return;
    }

    if (!signingData || signingData.length === 0) {
      setSignings([]);
      setLoading(false);
      return;
    }

    const playerIds = [
      ...new Set(signingData.map((item) => String(item.player_id))),
    ];

    const { data: players, error: playerError } = await supabase
      .from("players")
      .select("player_id, name, role, photo_url")
      .in("player_id", playerIds);

    if (playerError) {
      console.error("Player loading error:", playerError);
    }

    const playerMap = new Map<string, Player>();

    (players || []).forEach((player) => {
      playerMap.set(String(player.player_id), player);
    });

    const combined: AuctionSigning[] = signingData.map((item) => ({
      ...item,
      player_id: String(item.player_id),
      player: playerMap.get(String(item.player_id)),
    }));

    setSignings(combined);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadSignings();

    const channel = supabase
      .channel("vctb-stream-overlay")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auction_signings",
        },
        () => {
          loadSignings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, loadSignings]);

  function getPlayerPhoto(signing: AuctionSigning) {
    if (signing.player?.photo_url) {
      return signing.player.photo_url;
    }

    const playerId = signing.player_id;

    const photoCode = playerId.startsWith("VC")
      ? playerId
      : `VC ${String(Number(playerId)).padStart(3, "0")}`;

    return encodeURI(`/vctb-2026-players/${photoCode}.jpeg`);
  }

  function getRemainingPoints(team: string) {
    const startingPoints = teamBudgets[team] ?? 0;

    const spentPoints = signings
      .filter((signing) => signing.team === team)
      .reduce(
        (total, signing) => total + Number(signing.points || 0),
        0
      );

    return Math.max(0, startingPoints - spentPoints);
  }

  const latest =
    signings.length > 0 ? signings[signings.length - 1] : null;

  return (
    <main
      className="flex min-h-screen items-end p-8 text-white"
      style={{
        background: "transparent",
      }}
    >
      {loading ? null : !latest ? (
        /* WAITING FOR NEXT SIGNING */
        <div
          className="
            w-full
            rounded-3xl
            border border-yellow-400/40
            bg-black/35
            px-8
            py-5
            shadow-2xl
            backdrop-blur-md
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
                VCTB 3.0
              </p>

              <p className="mt-1 text-xl font-black uppercase">
                Live Auction
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm font-black uppercase text-red-400">
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />

              Waiting for next signing
            </div>
          </div>
        </div>
      ) : (
        /* LATEST PLAYER SIGNING */
        <div
          className="
            w-full
            overflow-hidden
            rounded-[28px]
            border border-yellow-400/40
            bg-black/45
            shadow-2xl
            backdrop-blur-md
          "
        >
          {/* TOP BAR */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-yellow-400/20
              bg-gradient-to-r
              from-red-950/70
              via-black/45
              to-blue-950/70
              px-6
              py-3
              backdrop-blur-sm
            "
          >
            <div className="flex items-center gap-3">
              <img
                src="/competitions/vctb.png"
                alt="VCTB"
                className="h-10 w-10 rounded-full bg-white object-contain p-1"
              />

              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                  VCTB 3.0
                </p>

                <p className="text-sm font-black uppercase">
                  Live Auction Centre
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-red-500/30
                bg-red-600/20
                px-4
                py-2
                text-xs
                font-black
                uppercase
                text-red-300
              "
            >
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

              Live
            </div>
          </div>

          {/* PLAYER SIGNING DETAILS */}

          <div
            className="
              grid
              items-center
              gap-5
              bg-black/20
              px-6
              py-5
              md:grid-cols-[90px_100px_1fr_auto_auto]
            "
          >
            {/* TEAM LOGO */}

            <div className="flex justify-center">
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  bg-white/95
                  p-2
                  shadow-lg
                "
              >
                {teamLogos[latest.team] ? (
                  <img
                    src={teamLogos[latest.team]}
                    alt={latest.team}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-black text-black">
                    TEAM
                  </span>
                )}
              </div>
            </div>

            {/* PLAYER PHOTO */}

            <div className="flex justify-center">
              <img
                src={getPlayerPhoto(latest)}
                alt={
                  latest.player?.name ||
                  `Player ${latest.player_id}`
                }
                className="
                  h-20
                  w-20
                  rounded-full
                  border-4
                  border-yellow-400
                  bg-black
                  object-cover
                  shadow-lg
                "
              />
            </div>

            {/* PLAYER INFORMATION */}

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                Just Signed
              </p>

              <h1
                className="
                  mt-1
                  truncate
                  text-2xl
                  font-black
                  uppercase
                  drop-shadow-lg
                  md:text-3xl
                "
              >
                {latest.player?.name ||
                  `Player ${latest.player_id}`}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-white/80">
                <span>{latest.player_id}</span>

                <span className="text-white/40">•</span>

                <span>
                  {latest.role ||
                    latest.player?.role ||
                    "Player"}
                </span>

                <span className="text-white/40">•</span>

                <span className="text-yellow-400">
                  {latest.team}
                </span>
              </div>
            </div>

            {/* SOLD FOR */}

            <div
              className="
                min-w-[140px]
                rounded-2xl
                border
                border-yellow-400/30
                bg-yellow-400/10
                px-5
                py-3
                text-center
                backdrop-blur-sm
              "
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-200">
                Sold For
              </p>

              <p className="mt-1 text-3xl font-black text-yellow-400">
                {Number(latest.points).toLocaleString()}
              </p>

              <p className="text-[10px] font-bold uppercase text-yellow-300/70">
                Points
              </p>
            </div>

            {/* REMAINING POINTS */}

            <div
              className="
                min-w-[155px]
                rounded-2xl
                border
                border-green-400/30
                bg-green-400/10
                px-5
                py-3
                text-center
                backdrop-blur-sm
              "
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">
                Remaining
              </p>

              <p className="mt-1 text-3xl font-black text-green-400">
                {getRemainingPoints(
                  latest.team
                ).toLocaleString()}
              </p>

              <p className="text-[10px] font-bold uppercase text-green-300/70">
                Points
              </p>
            </div>
          </div>

          {/* BOTTOM ACCENT */}

          <div className="h-1 w-full bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600" />
        </div>
      )}
    </main>
  );
}