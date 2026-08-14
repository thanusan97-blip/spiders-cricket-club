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
      console.error(signingError);
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

    const { data: players } = await supabase
      .from("players")
      .select("player_id, name, role, photo_url")
      .in("player_id", playerIds);

    const playerMap = new Map<string, Player>();

    (players || []).forEach((player) => {
      playerMap.set(String(player.player_id), player);
    });

    setSignings(
      signingData.map((item) => ({
        ...item,
        player_id: String(item.player_id),
        player: playerMap.get(String(item.player_id)),
      }))
    );

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
    const starting = teamBudgets[team] ?? 0;

    const spent = signings
      .filter((signing) => signing.team === team)
      .reduce(
        (total, signing) => total + Number(signing.points || 0),
        0
      );

    return Math.max(0, starting - spent);
  }

  const latest =
    signings.length > 0 ? signings[signings.length - 1] : null;

  return (
    <main className="flex min-h-screen items-end bg-transparent p-8 text-white">

      {loading ? null : !latest ? (
        <div className="w-full rounded-3xl border border-yellow-400/30 bg-black/90 px-8 py-5 shadow-2xl">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
                VCTB 3.0
              </p>

              <p className="mt-1 text-xl font-black uppercase">
                Live Auction
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-black uppercase text-red-400">
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
              Waiting for next signing
            </div>

          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-[28px] border border-yellow-400/50 bg-black/95 shadow-2xl">

          {/* TOP BAR */}
          <div className="flex items-center justify-between border-b border-yellow-400/20 bg-gradient-to-r from-red-950 via-black to-blue-950 px-6 py-3">

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

            <div className="flex items-center gap-2 rounded-full bg-red-600/20 px-4 py-2 text-xs font-black uppercase text-red-300">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

              Live

            </div>

          </div>

          {/* SIGNING */}
          <div className="grid items-center gap-5 px-6 py-5 md:grid-cols-[90px_100px_1fr_auto_auto]">

            {/* TEAM LOGO */}
            <div className="flex justify-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-2">

                <img
                  src={teamLogos[latest.team]}
                  alt={latest.team}
                  className="h-full w-full object-contain"
                />

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
                className="h-20 w-20 rounded-full border-4 border-yellow-400 object-cover"
              />

            </div>

            {/* PLAYER */}
            <div className="min-w-0">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                Just Signed
              </p>

              <h1 className="mt-1 truncate text-2xl font-black uppercase md:text-3xl">
                {latest.player?.name ||
                  `Player ${latest.player_id}`}
              </h1>

              <div className="mt-2 flex flex-wrap gap-3 text-sm font-bold text-white/60">

                <span>
                  {latest.player_id}
                </span>

                <span>•</span>

                <span>
                  {latest.role ||
                    latest.player?.role ||
                    "Player"}
                </span>

                <span>•</span>

                <span className="text-yellow-400">
                  {latest.team}
                </span>

              </div>

            </div>

            {/* SOLD FOR */}
            <div className="min-w-[130px] text-center">

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Sold For
              </p>

              <p className="mt-1 text-3xl font-black text-yellow-400">
                {Number(latest.points).toLocaleString()}
              </p>

              <p className="text-[10px] font-bold uppercase text-yellow-400/60">
                Points
              </p>

            </div>

            {/* REMAINING */}
            <div className="min-w-[150px] rounded-2xl border border-green-400/30 bg-green-400/10 px-5 py-3 text-center">

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">
                Remaining
              </p>

              <p className="mt-1 text-3xl font-black text-green-400">
                {getRemainingPoints(
                  latest.team
                ).toLocaleString()}
              </p>

              <p className="text-[10px] font-bold uppercase text-green-400/60">
                Points
              </p>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}