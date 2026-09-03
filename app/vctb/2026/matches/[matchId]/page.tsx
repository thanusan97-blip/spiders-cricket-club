"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type MatchRow = {
  id: number;
  match_number: number;
  pitch: string;
  match_date: string;
  start_time: string | null;
  team_a: string;
  team_b: string;
  toss_winner: string | null;
  toss_decision: string | null;
  status: string;
  winner: string | null;
  result_text: string | null;
};

type MatchPlayer = {
  id: number;
  match_id: number;
  team: string;
  player_id: string;
  player_name: string;
  role: string | null;
  is_captain: boolean;
  is_wicket_keeper: boolean;
};

type InningsRow = {
  id: number;
  match_id: number;
  innings_number: number;
  batting_team: string;
  bowling_team: string;
  total_runs: number;
  wickets: number;
  legal_balls: number;
  completed: boolean;
  striker_id?: string | null;
  non_striker_id?: string | null;
  bowler_id?: string | null;
};

type DeliveryRow = {
  id: number;
  match_id: number;
  innings_id: number;
  over_number: number;
  ball_in_over: number;
  striker_id: string;
  non_striker_id: string;
  bowler_id: string;
  runs_batter: number;
  extras: number;
  extra_type: string | null;
  wicket: boolean;
  wicket_type: string | null;
  dismissed_player_id: string | null;
  fielder_id: string | null;
  is_legal_ball: boolean;
  created_at: string;
};

type BatterStat = {
  player: MatchPlayer;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dismissal: string;
};

type BowlerStat = {
  player: MatchPlayer;
  legalBalls: number;
  runs: number;
  wickets: number;
};

const BALLS_PER_OVER = 5;
const MAX_OVERS = 10;
const MAX_LEGAL_BALLS = BALLS_PER_OVER * MAX_OVERS;

function displayTeamName(team: string) {
  return team === "Vallvai Blues SC UK" ? "Vallvai Kadalodikal" : team;
}

const teamLogoMap: Record<string, string> = {
  "Aathiyadi JL Super Kings": "/vctb/2026/teams/aathiyadi.png",
  "Balmoral Fighters": "/vctb/2026/teams/balmoral.png",
  "Niruvaththampai Knights": "/vctb/2026/teams/niruvaththampai.png",
  "Team Tiger": "/vctb/2026/teams/team-tiger.png",
  "Thunnalai Royals": "/vctb/2026/teams/thunnalai.png",
  "Vallvai Blues SC UK": "/vctb/2026/teams/vallvai-blues.png",
};

function teamLogo(team: string) {
  return teamLogoMap[team] || "/vctb/2026/vctb-3-logo.png";
}

function shortTeamName(team: string) {
  const display = displayTeamName(team);
  if (display === "Aathiyadi JL Super Kings") return "Aathiyadi";
  if (display === "Balmoral Fighters") return "Balmoral";
  if (display === "Niruvaththampai Knights") return "Niruvaththampai";
  if (display === "Team Tiger") return "Team Tiger";
  if (display === "Thunnalai Royals") return "Thunnalai";
  if (display === "Vallvai Kadalodikal") return "Vallvai";
  return display;
}

function scorecardPlayerLabel(player: MatchPlayer) {
  const parts = player.player_name.trim().split(/\s+/).filter(Boolean);
  const shortName =
    parts.length <= 1
      ? player.player_name
      : `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}`;

  const tags = [
    player.is_captain ? "c" : "",
    player.is_wicket_keeper ? "wk" : "",
  ].filter(Boolean);

  return `${shortName}${tags.length ? ` (${tags.join(" & ")})` : ""}`;
}

function playerRoleLabel(player: MatchPlayer) {
  return player.role || "Player";
}

function oversFromBalls(legalBalls: number) {
  const overs = Math.floor(legalBalls / BALLS_PER_OVER);
  const balls = legalBalls % BALLS_PER_OVER;
  return `${overs}.${balls}`;
}

function playerLabel(player: MatchPlayer) {
  const tags = [
    player.is_captain ? "c" : "",
    player.is_wicket_keeper ? "wk" : "",
  ].filter(Boolean);

  return `${player.player_name}${tags.length ? ` (${tags.join(" & ")})` : ""}`;
}

export default function PublicMatchPage() {
  const params = useParams();
  const matchId = Number(params.matchId);

  const supabase = useMemo(() => createClient(), []);

  const [match, setMatch] = useState<MatchRow | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [innings, setInnings] = useState<InningsRow[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "live" | "scorecard" | "squads" | "awards">("live");
  const [playerOfMatchId, setPlayerOfMatchId] = useState<string>("");
  const [squadTeam, setSquadTeam] = useState<"a" | "b">("a");

  const loadMatch = useCallback(async () => {
    if (!matchId || Number.isNaN(matchId)) return;

    try {
      const [
        { data: matchData, error: matchError },
        { data: playerData, error: playerError },
        { data: inningsData, error: inningsError },
        { data: deliveryData, error: deliveryError },
      ] = await Promise.all([
        supabase.from("matches").select("*").eq("id", matchId).single(),
        supabase
          .from("match_players")
          .select("*")
          .eq("match_id", matchId)
          .order("team")
          .order("player_name"),
        supabase
          .from("innings")
          .select("*")
          .eq("match_id", matchId)
          .order("innings_number"),
        supabase
          .from("deliveries")
          .select("*")
          .eq("match_id", matchId)
          .order("id"),
      ]);

      if (matchError) throw matchError;
      if (playerError) throw playerError;
      if (inningsError) throw inningsError;
      if (deliveryError) throw deliveryError;

      const { data: awardData } = await supabase
        .from("match_awards")
        .select("player_of_match_id")
        .eq("match_id", matchId)
        .maybeSingle();

      setPlayerOfMatchId(awardData?.player_of_match_id || "");
      setMatch(matchData as MatchRow);
      setPlayers((playerData || []) as MatchPlayer[]);
      setInnings((inningsData || []) as InningsRow[]);
      setDeliveries((deliveryData || []) as DeliveryRow[]);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not load this match.");
    } finally {
      setLoading(false);
    }
  }, [matchId, supabase]);

  useEffect(() => {
    loadMatch();

    // Primary live updates: Supabase Realtime.
    const channel = supabase
      .channel(`public-vctb-match-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `id=eq.${matchId}`,
        },
        () => loadMatch()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "innings",
          filter: `match_id=eq.${matchId}`,
        },
        () => loadMatch()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deliveries",
          filter: `match_id=eq.${matchId}`,
        },
        () => loadMatch()
      )
      .subscribe();

    const awardsChannel = supabase
      .channel(`vctb-match-awards-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_awards",
          filter: `match_id=eq.${matchId}`,
        },
        () => loadMatch()
      )
      .subscribe();

    // Mobile-safe fallback:
    // Some phone browsers can temporarily pause/drop the realtime websocket.
    // While this page is visible, quietly re-sync every 2 seconds.
    const liveSyncTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadMatch();
      }
    }, 2000);

    // Immediately catch up when the user returns to this browser tab/app.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadMatch();
      }
    };

    const handleWindowFocus = () => {
      loadMatch();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.clearInterval(liveSyncTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      supabase.removeChannel(channel);
      supabase.removeChannel(awardsChannel);
    };
  }, [matchId, supabase, loadMatch]);

  const currentInnings =
    innings.find((row) => !row.completed) ||
    innings[innings.length - 1] ||
    null;

  const firstInnings =
    innings.find((row) => row.innings_number === 1) || null;

  const currentDeliveries = currentInnings
    ? deliveries.filter((d) => d.innings_id === currentInnings.id)
    : [];

  const recentBalls = currentDeliveries.slice(-6);

  const strikerId = currentInnings?.striker_id || "";
  const nonStrikerId = currentInnings?.non_striker_id || "";
  const bowlerId = currentInnings?.bowler_id || "";

  const target =
    currentInnings?.innings_number === 2 && firstInnings
      ? firstInnings.total_runs + 1
      : null;

  const runsNeeded =
    target && currentInnings
      ? Math.max(0, target - currentInnings.total_runs)
      : null;

  const ballsRemaining = currentInnings
    ? Math.max(0, MAX_LEGAL_BALLS - currentInnings.legal_balls)
    : 0;

  const currentRunRate =
    currentInnings && currentInnings.legal_balls > 0
      ? (
          (currentInnings.total_runs / currentInnings.legal_balls) *
          BALLS_PER_OVER
        ).toFixed(2)
      : "0.00";

  const requiredRunRate =
    runsNeeded !== null && ballsRemaining > 0
      ? ((runsNeeded / ballsRemaining) * BALLS_PER_OVER).toFixed(2)
      : "-";

  function getPlayer(playerId: string | null | undefined) {
    return players.find((player) => player.player_id === playerId);
  }

  function getBatterStats(
    inningsRow: InningsRow,
    inningsDeliveries: DeliveryRow[]
  ): BatterStat[] {
    const teamPlayers = players.filter(
      (player) => player.team === inningsRow.batting_team
    );

    const appearanceOrder: string[] = [];

    const addIfMissing = (playerId?: string | null) => {
      if (playerId && !appearanceOrder.includes(playerId)) {
        appearanceOrder.push(playerId);
      }
    };

    for (const delivery of inningsDeliveries) {
      addIfMissing(delivery.striker_id);
      addIfMissing(delivery.non_striker_id);
    }

    addIfMissing(inningsRow.striker_id);
    addIfMissing(inningsRow.non_striker_id);

    const orderedPlayers = [
      ...appearanceOrder
        .map((id) => teamPlayers.find((player) => player.player_id === id))
        .filter(Boolean) as MatchPlayer[],
      ...teamPlayers.filter(
        (player) => !appearanceOrder.includes(player.player_id)
      ),
    ];

    return orderedPlayers.map((player) => {
      const faced = inningsDeliveries.filter(
        (delivery) => delivery.striker_id === player.player_id
      );

      const runs = faced.reduce(
        (sum, delivery) => sum + Number(delivery.runs_batter || 0),
        0
      );

      const balls = faced.filter(
        (delivery) => delivery.is_legal_ball && delivery.extra_type !== "wide"
      ).length;

      const fours = faced.filter(
        (delivery) => delivery.runs_batter === 4
      ).length;

      const sixes = faced.filter(
        (delivery) => delivery.runs_batter === 6
      ).length;

      const dismissalBall = inningsDeliveries.find(
        (delivery) =>
          delivery.wicket &&
          delivery.dismissed_player_id === player.player_id
      );

      const hasAppeared =
        appearanceOrder.includes(player.player_id) ||
        player.player_id === inningsRow.striker_id ||
        player.player_id === inningsRow.non_striker_id;

      let dismissal = hasAppeared ? "not out" : "DNB";

      if (dismissalBall) {
        const bowler = getPlayer(dismissalBall.bowler_id);
        const fielder = getPlayer(dismissalBall.fielder_id);

        if (dismissalBall.wicket_type === "Bowled") {
          dismissal = `b ${bowler?.player_name || ""}`;
        } else if (dismissalBall.wicket_type === "LBW") {
          dismissal = `lbw b ${bowler?.player_name || ""}`;
        } else if (dismissalBall.wicket_type === "Caught") {
          dismissal = `c ${fielder?.player_name || ""} b ${
            bowler?.player_name || ""
          }`;
        } else if (dismissalBall.wicket_type === "Caught & Bowled") {
          dismissal = `c & b ${bowler?.player_name || ""}`;
        } else if (dismissalBall.wicket_type === "Run Out") {
          dismissal = `run out${
            fielder ? ` (${fielder.player_name})` : ""
          }`;
        } else if (dismissalBall.wicket_type === "Stumped") {
          dismissal = `st ${fielder?.player_name || ""} b ${
            bowler?.player_name || ""
          }`;
        } else {
          dismissal = dismissalBall.wicket_type || "out";
        }
      }

      return {
        player,
        runs,
        balls,
        fours,
        sixes,
        dismissal,
      };
    });
  }

  function getBowlerStats(
    inningsRow: InningsRow,
    inningsDeliveries: DeliveryRow[]
  ): BowlerStat[] {
    const teamPlayers = players.filter(
      (player) => player.team === inningsRow.bowling_team
    );

    return teamPlayers
      .map((player) => {
        const bowled = inningsDeliveries.filter(
          (delivery) => delivery.bowler_id === player.player_id
        );

        if (bowled.length === 0) return null;

        const legalBalls = bowled.filter(
          (delivery) => delivery.is_legal_ball
        ).length;

        const runs = bowled.reduce((sum, delivery) => {
          const kind = delivery.extra_type || "";

          if (kind === "bye" || kind === "leg_bye") {
            return sum + Number(delivery.runs_batter || 0);
          }

          if (
            kind === "no_ball_bye" ||
            kind === "no_ball_leg_bye"
          ) {
            return sum + Number(delivery.runs_batter || 0) + 1;
          }

          return (
            sum +
            Number(delivery.runs_batter || 0) +
            Number(delivery.extras || 0)
          );
        }, 0);

        const wickets = bowled.filter(
          (delivery) =>
            delivery.wicket &&
            !["Run Out", "Retired Out"].includes(
              delivery.wicket_type || ""
            )
        ).length;

        return {
          player,
          legalBalls,
          runs,
          wickets,
        };
      })
      .filter((row): row is BowlerStat => Boolean(row));
  }

  const currentBatters = currentInnings
    ? getBatterStats(currentInnings, currentDeliveries)
    : [];

  const strikerStat = currentBatters.find(
    (row) => row.player.player_id === strikerId
  );

  const nonStrikerStat = currentBatters.find(
    (row) => row.player.player_id === nonStrikerId
  );

  const currentBowlers = currentInnings
    ? getBowlerStats(currentInnings, currentDeliveries)
    : [];

  const activeBowlerStat = currentBowlers.find(
    (row) => row.player.player_id === bowlerId
  );

  function deliveryBadge(delivery: DeliveryRow) {
    if (delivery.wicket) return "W";

    if (delivery.extra_type === "wide") {
      return `${delivery.extras}Wd`;
    }

    if (
      delivery.extra_type === "no_ball" ||
      delivery.extra_type === "no_ball_bye" ||
      delivery.extra_type === "no_ball_leg_bye"
    ) {
      return `${
        Number(delivery.runs_batter || 0) +
        Number(delivery.extras || 0)
      }Nb`;
    }

    if (delivery.extra_type === "bye") {
      return `${delivery.extras}B`;
    }

    if (delivery.extra_type === "leg_bye") {
      return `${delivery.extras}Lb`;
    }

    return String(delivery.runs_batter);
  }

  function deliveryCommentary(delivery: DeliveryRow) {
    const striker = getPlayer(delivery.striker_id);
    const bowler = getPlayer(delivery.bowler_id);
    const dismissed = getPlayer(delivery.dismissed_player_id);

    const ballLabel = `${delivery.over_number}.${delivery.ball_in_over}`;

    if (delivery.wicket) {
      return `${ballLabel} • ${bowler?.player_name || "Bowler"} to ${
        striker?.player_name || "Batter"
      } — WICKET${
        dismissed ? `, ${dismissed.player_name}` : ""
      } ${delivery.wicket_type ? `(${delivery.wicket_type})` : ""}`;
    }

    if (delivery.extra_type === "wide") {
      return `${ballLabel} • ${bowler?.player_name || "Bowler"} to ${
        striker?.player_name || "Batter"
      } — ${delivery.extras} wide run${
        delivery.extras === 1 ? "" : "s"
      }`;
    }

    if (
      delivery.extra_type === "no_ball" ||
      delivery.extra_type === "no_ball_bye" ||
      delivery.extra_type === "no_ball_leg_bye"
    ) {
      const total =
        Number(delivery.runs_batter || 0) +
        Number(delivery.extras || 0);

      return `${ballLabel} • ${bowler?.player_name || "Bowler"} to ${
        striker?.player_name || "Batter"
      } — No ball, ${total} run${total === 1 ? "" : "s"}`;
    }

    if (delivery.extra_type === "bye") {
      return `${ballLabel} • ${delivery.extras} bye${
        delivery.extras === 1 ? "" : "s"
      }`;
    }

    if (delivery.extra_type === "leg_bye") {
      return `${ballLabel} • ${delivery.extras} leg bye${
        delivery.extras === 1 ? "" : "s"
      }`;
    }

    if (delivery.runs_batter === 4) {
      return `${ballLabel} • ${bowler?.player_name || "Bowler"} to ${
        striker?.player_name || "Batter"
      } — FOUR`;
    }

    if (delivery.runs_batter === 6) {
      return `${ballLabel} • ${bowler?.player_name || "Bowler"} to ${
        striker?.player_name || "Batter"
      } — SIX`;
    }

    return `${ballLabel} • ${bowler?.player_name || "Bowler"} to ${
      striker?.player_name || "Batter"
    } — ${delivery.runs_batter} run${
      delivery.runs_batter === 1 ? "" : "s"
    }`;
  }

  const teamAPlayers = players.filter((player) => player.team === match?.team_a);
  const teamBPlayers = players.filter((player) => player.team === match?.team_b);
  const selectedSquad = squadTeam === "a" ? teamAPlayers : teamBPlayers;
  const selectedSquadName = squadTeam === "a" ? match?.team_a : match?.team_b;

  const allBatterStats = innings.flatMap((inn) =>
    getBatterStats(inn, deliveries.filter((d) => d.innings_id === inn.id))
  );
  const appearedBatters = allBatterStats.filter((row) => row.dismissal !== "DNB");

  const allBowlerStats = innings.flatMap((inn) =>
    getBowlerStats(inn, deliveries.filter((d) => d.innings_id === inn.id))
  );

  const bestBatsman = [...appearedBatters].sort((a, b) => {
    if (b.runs !== a.runs) return b.runs - a.runs;
    const bSr = b.balls ? (b.runs / b.balls) * 100 : 0;
    const aSr = a.balls ? (a.runs / a.balls) * 100 : 0;
    return bSr - aSr;
  })[0];

  const bestBowler = [...allBowlerStats].sort((a, b) => {
    if (b.wickets !== a.wickets) return b.wickets - a.wickets;
    const aEcon = a.legalBalls ? (a.runs / a.legalBalls) * BALLS_PER_OVER : Infinity;
    const bEcon = b.legalBalls ? (b.runs / b.legalBalls) * BALLS_PER_OVER : Infinity;
    return aEcon - bEcon;
  })[0];

  const strikeRateKing = [...appearedBatters]
    .filter((row) => row.runs >= 20 && row.balls > 0)
    .sort((a, b) => {
      const aSr = (a.runs / a.balls) * 100;
      const bSr = (b.runs / b.balls) * 100;
      return bSr - aSr || b.runs - a.runs;
    })[0];

  const economyKing = [...allBowlerStats]
    .filter((row) => row.legalBalls >= 2 * BALLS_PER_OVER)
    .sort((a, b) => {
      const aEcon = (a.runs / a.legalBalls) * BALLS_PER_OVER;
      const bEcon = (b.runs / b.legalBalls) * BALLS_PER_OVER;
      return aEcon - bEcon || b.wickets - a.wickets;
    })[0];

  function findBattingStreak(required: number, boundaryMode: boolean) {
    for (const player of players) {
      const faced = deliveries.filter((d) => d.striker_id === player.player_id);
      let streak = 0;
      for (const d of faced) {
        const hit = boundaryMode
          ? d.runs_batter === 4 || d.runs_batter === 6
          : d.runs_batter === 6;
        streak = hit ? streak + 1 : 0;
        if (streak >= required) return player;
      }
    }
    return undefined;
  }

  const sixHatTrickPlayer = findBattingStreak(3, false);
  const boundaryKingPlayer = findBattingStreak(4, true);

  const maidenOvers = (() => {
    const found: { player: MatchPlayer; innings: number; over: number }[] = [];
    for (const inn of innings) {
      const ds = deliveries.filter((d) => d.innings_id === inn.id);
      const overKeys = Array.from(new Set(ds.map((d) => d.over_number)));
      for (const over of overKeys) {
        const overBalls = ds.filter((d) => d.over_number === over);
        const legal = overBalls.filter((d) => d.is_legal_ball);
        if (legal.length !== BALLS_PER_OVER) continue;
        const bowlerId = overBalls[0]?.bowler_id;
        if (!bowlerId || overBalls.some((d) => d.bowler_id !== bowlerId)) continue;
        const conceded = overBalls.reduce((sum, d) => {
          const kind = d.extra_type || "";
          if (kind === "bye" || kind === "leg_bye") return sum + Number(d.runs_batter || 0);
          if (kind === "no_ball_bye" || kind === "no_ball_leg_bye") return sum + Number(d.runs_batter || 0) + 1;
          return sum + Number(d.runs_batter || 0) + Number(d.extras || 0);
        }, 0);
        const player = players.find((p) => p.player_id === bowlerId);
        if (conceded === 0 && player) found.push({ player, innings: inn.innings_number, over });
      }
    }
    return found;
  })();

  const playerOfMatch = players.find((p) => p.player_id === playerOfMatchId);

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-10 text-center text-white">
        Loading live match...
      </main>
    );
  }

  if (errorMessage || !match) {
    return (
      <main className="min-h-screen bg-black px-4 py-16 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-black">Match not available</h1>
          <p className="mt-3 text-white/50">
            {errorMessage || "This match could not be found."}
          </p>

          <Link
            href="/vctb/2026#live"
            className="mt-6 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-black text-black"
          >
            Back to VCTB Live
          </Link>
        </div>
      </main>
    );
  }

  const tabs = [
    ["info", "Info"],
    ["live", "Live"],
    ["scorecard", "Scorecard"],
    ["squads", "Squads"],
    ["awards", "Awards"],
  ] as const;

  return (
    <main className="min-h-[100dvh] bg-black text-white">
      <div
        className="mx-auto max-w-5xl"
        style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }}
      >
        {/* Professional match-centre header */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="px-3 pb-2 pt-2 sm:px-4 md:px-5">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <Link
                href="/vctb/2026#live"
                className="whitespace-nowrap text-xs font-black text-white/60 transition hover:text-yellow-400 md:text-sm"
              >
                ← Back
              </Link>

              <div className="min-w-0 text-center">
                <p className="truncate text-[15px] font-black md:text-xl">
                  {shortTeamName(match.team_a)}
                  <span className="mx-2 text-white/30">v</span>
                  {shortTeamName(match.team_b)}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1.5">
                {match.status === "live" && (
                  <span className="rounded-full bg-red-600 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider">
                    ● Live
                  </span>
                )}
                {match.status === "completed" && (
                  <span className="rounded-full border border-green-400/20 bg-green-950/30 px-2.5 py-1.5 text-[9px] font-black uppercase text-green-300">
                    ✓ Done
                  </span>
                )}
              </div>
            </div>

            <nav className="mt-3 grid grid-cols-5 border-t border-white/5">
              {tabs.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative py-3 text-[9px] font-black uppercase tracking-[0.04em] transition sm:text-[11px] md:text-sm ${
                    activeTab === key
                      ? "text-yellow-400"
                      : "text-white/45 hover:text-white"
                  }`}
                >
                  {label}
                  {activeTab === key && (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-yellow-400" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <div className="px-2.5 pb-8 pt-3 sm:px-4 md:px-3 md:pt-5">
          {/* Match identity card shared by all tabs */}
          <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#080808] shadow-2xl">
            <div className="bg-gradient-to-r from-red-950/50 via-[#080808] to-yellow-950/30 px-3 py-3.5 md:px-5 md:py-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400 md:text-xs">
                  VCTB 3.0 • 2026
                </p>
                <span className="rounded-full border border-yellow-400/20 bg-yellow-400/5 px-2.5 py-1 text-[9px] font-black uppercase text-yellow-400 md:text-[10px]">
                  {match.pitch} • Match {match.match_number}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <TeamIdentity team={match.team_a} align="left" />
                <div className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                  VS
                </div>
                <TeamIdentity team={match.team_b} align="right" />
              </div>
            </div>
          </section>

          {activeTab === "info" && (
            <section className="mt-3 space-y-3">
              <Panel title="Match Info" eyebrow="Tournament Details">
                <InfoRow label="Match" value={`Match ${match.match_number}`} />
                <InfoRow label="Series" value="Vadamaradchy Champion T10 Blast 3.0" />
                <InfoRow label="Match Type" value="T10 • 10 overs • 5 balls per over" />
                <InfoRow label="Date" value="Sunday, 6 September 2026" />
                <InfoRow label="Start Time" value={match.start_time ? `${match.start_time} UK time` : "TBC"} />
                <InfoRow label="Pitch" value={match.pitch} />
                <InfoRow label="Venue" value="Tenetelow Sports Ground, UB2 4LW" />
                <InfoRow
                  label="Toss"
                  value={
                    match.toss_winner
                      ? `${displayTeamName(match.toss_winner)} chose to ${match.toss_decision}`
                      : "Toss not completed"
                  }
                  last
                />
              </Panel>

              <Panel title="Playing XI" eyebrow="Match Squads">
                <button
                  onClick={() => {
                    setSquadTeam("a");
                    setActiveTab("squads");
                  }}
                  className="flex w-full items-center gap-3 border-b border-white/10 py-3 text-left"
                >
                  <img src={teamLogo(match.team_a)} alt="" className="h-10 w-10 rounded-full object-contain" />
                  <span className="min-w-0 flex-1 font-black">{displayTeamName(match.team_a)}</span>
                  <span className="text-xl text-white/30">›</span>
                </button>
                <button
                  onClick={() => {
                    setSquadTeam("b");
                    setActiveTab("squads");
                  }}
                  className="flex w-full items-center gap-3 py-3 text-left"
                >
                  <img src={teamLogo(match.team_b)} alt="" className="h-10 w-10 rounded-full object-contain" />
                  <span className="min-w-0 flex-1 font-black">{displayTeamName(match.team_b)}</span>
                  <span className="text-xl text-white/30">›</span>
                </button>
              </Panel>
            </section>
          )}

          {activeTab === "live" && (
            <section className="mt-3">
              {currentInnings ? (
                <>
                  <div className="rounded-[22px] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/[0.08] via-[#0a0a0a] to-red-950/10 p-4 md:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={teamLogo(currentInnings.batting_team)}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-full object-contain md:h-14 md:w-14"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black uppercase tracking-wider text-yellow-400">
                            {displayTeamName(currentInnings.batting_team)}
                          </p>
                          <div className="mt-1 flex items-end gap-2">
                            <h1 className="text-4xl font-black leading-none md:text-5xl">
                              {currentInnings.total_runs}/{currentInnings.wickets}
                            </h1>
                            <span className="pb-0.5 text-xs font-bold text-white/45 md:text-sm">
                              ({oversFromBalls(currentInnings.legal_balls)})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[9px] font-black uppercase tracking-wider text-white/35">
                          CRR
                        </p>
                        <p className="mt-1 text-xl font-black text-yellow-400 md:text-2xl">
                          {currentRunRate}
                        </p>
                      </div>
                    </div>

                    {target && (
                      <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/30 py-2.5 text-center">
                        <MiniStat label="Target" value={String(target)} />
                        <MiniStat label="Need" value={`${runsNeeded} / ${ballsRemaining}`} />
                        <MiniStat label="RRR" value={requiredRunRate} />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 overflow-hidden rounded-[18px] border border-white/10 bg-[#080808]">
                    <div className="grid grid-cols-[1fr_42px_42px_42px_42px_58px] border-b border-white/10 px-3 py-2 text-[8px] font-black uppercase text-white/35 md:text-[10px]">
                      <span>Batter</span><span className="text-right">R</span><span className="text-right">B</span><span className="text-right">4s</span><span className="text-right">6s</span><span className="text-right">SR</span>
                    </div>

                    {[strikerStat, nonStrikerStat].map((row, index) => (
                      <div
                        key={row?.player.player_id || index}
                        className={`grid grid-cols-[1fr_42px_42px_42px_42px_58px] items-center px-3 py-3 ${
                          index === 0 ? "border-b border-white/5" : ""
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className={`text-[12px] font-black leading-tight md:text-sm ${index === 0 ? "text-yellow-400" : "text-white"}`}>
                            {row ? playerLabel(row.player) : "Waiting for batter"}
                            {index === 0 && row ? " *" : ""}
                          </p>
                        </div>
                        <span className="text-right text-[12px] font-black">{row?.runs ?? "-"}</span>
                        <span className="text-right text-[11px]">{row?.balls ?? "-"}</span>
                        <span className="text-right text-[11px]">{row?.fours ?? "-"}</span>
                        <span className="text-right text-[11px]">{row?.sixes ?? "-"}</span>
                        <span className="text-right text-[11px]">
                          {row
                            ? row.balls
                              ? ((row.runs / row.balls) * 100).toFixed(1)
                              : "0.0"
                            : "-"}
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-white/10 bg-black/30">
                      <div className="grid grid-cols-[1fr_48px_48px_48px_60px] px-3 py-2 text-[8px] font-black uppercase text-white/35 md:text-[10px]">
                        <span>Bowler</span><span className="text-right">O</span><span className="text-right">R</span><span className="text-right">W</span><span className="text-right">Econ</span>
                      </div>
                      <div className="grid grid-cols-[1fr_48px_48px_48px_60px] items-center px-3 pb-3">
                        <span className="pr-2 text-[12px] font-black md:text-sm">
                          {activeBowlerStat ? playerLabel(activeBowlerStat.player) : "Waiting for bowler"}
                        </span>
                        <span className="text-right text-[11px]">
                          {activeBowlerStat ? oversFromBalls(activeBowlerStat.legalBalls) : "-"}
                        </span>
                        <span className="text-right text-[11px]">{activeBowlerStat?.runs ?? "-"}</span>
                        <span className="text-right text-[11px] font-black">{activeBowlerStat?.wickets ?? "-"}</span>
                        <span className="text-right text-[11px]">
                          {activeBowlerStat
                            ? activeBowlerStat.legalBalls
                              ? ((activeBowlerStat.runs / activeBowlerStat.legalBalls) * BALLS_PER_OVER).toFixed(2)
                              : "0.00"
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-[18px] border border-white/10 bg-[#080808] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                        Recent Balls
                      </p>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {recentBalls.length === 0 ? (
                        <span className="text-sm text-white/30">Waiting for first delivery</span>
                      ) : (
                        recentBalls.map((delivery) => (
                          <span
                            key={delivery.id}
                            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-black ${
                              delivery.wicket
                                ? "bg-red-600"
                                : delivery.runs_batter === 4 || delivery.runs_batter === 6
                                ? "bg-yellow-400 text-black"
                                : "bg-white/10"
                            }`}
                          >
                            {deliveryBadge(delivery)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <section className="mt-4">
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-400">
                          Live Commentary
                        </p>
                        <h2 className="mt-1 text-xl font-black">Ball-by-Ball</h2>
                      </div>
                      <span className="text-[10px] font-bold text-white/30">Latest first</span>
                    </div>

                    <div className="space-y-2">
                      {currentDeliveries.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/40">
                          Ball-by-ball commentary will appear here once the match starts.
                        </div>
                      ) : (
                        [...currentDeliveries].reverse().map((delivery) => (
                          <div
                            key={delivery.id}
                            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 md:p-4"
                          >
                            <p className="text-[11px] font-bold leading-5 text-white/75 md:text-sm">
                              {deliveryCommentary(delivery)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </section>

                  {match.status === "completed" && (
                    <div className="mt-5 rounded-2xl border border-green-400/30 bg-green-950/30 p-5 text-center">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
                        Match Completed
                      </p>
                      <p className="mt-2 text-xl font-black">{match.result_text}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/50">
                  Waiting for innings data.
                </div>
              )}
            </section>
          )}

          {activeTab === "scorecard" && (
            <section className="mt-3 space-y-3">
              {[...innings]
                .sort((a, b) => b.innings_number - a.innings_number)
                .map((inningsRow) => {
                const inningsDeliveries = deliveries.filter(
                  (delivery) => delivery.innings_id === inningsRow.id
                );
                const batters = getBatterStats(inningsRow, inningsDeliveries);
                const bowlers = getBowlerStats(inningsRow, inningsDeliveries);
                const extras = inningsDeliveries.reduce(
                  (sum, delivery) => sum + Number(delivery.extras || 0),
                  0
                );
                const yetToBat = batters.filter((row) => row.dismissal === "DNB");

                return (
                  <section
                    key={inningsRow.id}
                    className="overflow-hidden rounded-[22px] border border-white/10 bg-[#080808]"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-yellow-950/20 to-transparent p-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={teamLogo(inningsRow.batting_team)}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-contain"
                        />
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-wider text-yellow-400">
                            Innings {inningsRow.innings_number}
                          </p>
                          <h3 className="truncate text-base font-black md:text-xl">
                            {displayTeamName(inningsRow.batting_team)}
                          </h3>
                        </div>
                      </div>
                      <p className="shrink-0 text-xl font-black md:text-2xl">
                        {inningsRow.total_runs}/{inningsRow.wickets}
                        <span className="ml-1 text-xs text-white/40">
                          ({oversFromBalls(inningsRow.legal_balls)})
                        </span>
                      </p>
                    </div>

                    <div className="px-2.5 py-3 sm:px-4">
                      <div className="grid grid-cols-[minmax(0,1fr)_30px_30px_30px_30px_48px] border-b border-white/10 pb-2 text-[8px] font-black uppercase text-white/35 sm:grid-cols-[minmax(0,1fr)_42px_42px_42px_42px_62px] sm:text-[10px]">
                        <span>Batter</span><span className="text-right">R</span><span className="text-right">B</span><span className="text-right">4s</span><span className="text-right">6s</span><span className="text-right">SR</span>
                      </div>

                      <div className="divide-y divide-white/5">
                        {batters.filter((row) => row.dismissal !== "DNB").map((row) => (
                          <div
                            key={row.player.player_id}
                            className="grid grid-cols-[minmax(0,1fr)_30px_30px_30px_30px_48px] items-start py-2.5 sm:grid-cols-[minmax(0,1fr)_42px_42px_42px_42px_62px]"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-[10px] font-black leading-tight sm:text-sm">
                                {scorecardPlayerLabel(row.player)}
                              </p>
                              <p className="mt-1 text-[8px] leading-tight text-white/40 sm:text-[10px]">
                                {row.dismissal}
                              </p>
                            </div>
                            <span className="text-right text-[10px] font-black sm:text-sm">{row.runs}</span>
                            <span className="text-right text-[10px] sm:text-sm">{row.balls}</span>
                            <span className="text-right text-[10px] sm:text-sm">{row.fours}</span>
                            <span className="text-right text-[10px] sm:text-sm">{row.sixes}</span>
                            <span className="text-right text-[10px] sm:text-sm">
                              {row.balls ? ((row.runs / row.balls) * 100).toFixed(1) : "0.0"}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 grid grid-cols-[1fr_auto] border-t border-white/10 py-2.5 text-xs">
                        <span className="font-black text-white/45">Extras</span>
                        <span className="font-black">{extras}</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto] border-t border-white/10 py-2.5">
                        <span className="font-black">Total</span>
                        <span className="font-black">
                          {inningsRow.total_runs}-{inningsRow.wickets} ({oversFromBalls(inningsRow.legal_balls)} Ov)
                        </span>
                      </div>

                      {yetToBat.length > 0 && (
                        <div className="border-t border-white/10 py-3">
                          <p className="text-[9px] font-black uppercase tracking-wider text-white/35">
                            Yet to bat
                          </p>
                          <p className="mt-2 text-xs font-bold leading-5 text-white/70 sm:text-sm">
                            {yetToBat.map((row) => scorecardPlayerLabel(row.player)).join(", ")}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_38px_38px_38px_52px] border-b border-white/10 pb-2 text-[8px] font-black uppercase text-white/35 sm:grid-cols-[minmax(0,1fr)_48px_48px_48px_65px] sm:text-[10px]">
                        <span>Bowler</span><span className="text-right">O</span><span className="text-right">R</span><span className="text-right">W</span><span className="text-right">Econ</span>
                      </div>

                      <div className="divide-y divide-white/5">
                        {bowlers.map((row) => (
                          <div
                            key={row.player.player_id}
                            className="grid grid-cols-[minmax(0,1fr)_38px_38px_38px_52px] items-center py-2.5 sm:grid-cols-[minmax(0,1fr)_48px_48px_48px_65px]"
                          >
                            <span className="pr-2 text-[10px] font-black sm:text-sm">
                              {scorecardPlayerLabel(row.player)}
                            </span>
                            <span className="text-right text-[10px] sm:text-sm">{oversFromBalls(row.legalBalls)}</span>
                            <span className="text-right text-[10px] sm:text-sm">{row.runs}</span>
                            <span className="text-right text-[10px] font-black sm:text-sm">{row.wickets}</span>
                            <span className="text-right text-[10px] sm:text-sm">
                              {row.legalBalls ? ((row.runs / row.legalBalls) * BALLS_PER_OVER).toFixed(2) : "0.00"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              })}
            </section>
          )}

          {activeTab === "awards" && (
            <section className="mt-3">
              {match.status !== "completed" ? (
                <div className="rounded-[22px] border border-white/10 bg-[#080808] p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/5 text-3xl">🏆</div>
                  <h2 className="mt-4 text-xl font-black">Match Awards</h2>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Awards will be confirmed automatically when the match is completed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AwardCard
                    icon="⭐"
                    title="Player of the Match"
                    player={playerOfMatch}
                    detail={playerOfMatch ? `${displayTeamName(playerOfMatch.team)} • Selected by scorer` : "Awaiting scorer selection"}
                    featured
                  />
                  <AwardCard
                    icon="🏏"
                    title="Best Batsman"
                    player={bestBatsman?.player}
                    detail={bestBatsman ? `${bestBatsman.runs} (${bestBatsman.balls}) • SR ${bestBatsman.balls ? ((bestBatsman.runs / bestBatsman.balls) * 100).toFixed(1) : "0.0"}` : "Not achieved"}
                  />
                  <AwardCard
                    icon="🎯"
                    title="Best Bowler"
                    player={bestBowler?.player}
                    detail={bestBowler ? `${oversFromBalls(bestBowler.legalBalls)}-${bestBowler.runs}-${bestBowler.wickets} • Econ ${bestBowler.legalBalls ? ((bestBowler.runs / bestBowler.legalBalls) * BALLS_PER_OVER).toFixed(2) : "0.00"}` : "Not achieved"}
                  />
                  <AwardCard
                    icon="⚡"
                    title="Strike Rate King"
                    player={strikeRateKing?.player}
                    detail={strikeRateKing ? `${strikeRateKing.runs} (${strikeRateKing.balls}) • SR ${((strikeRateKing.runs / strikeRateKing.balls) * 100).toFixed(1)} • Min 20 runs` : "Not achieved • Minimum 20 runs"}
                  />
                  <AwardCard
                    icon="🔒"
                    title="Economy King"
                    player={economyKing?.player}
                    detail={economyKing ? `${oversFromBalls(economyKing.legalBalls)} overs • Econ ${((economyKing.runs / economyKing.legalBalls) * BALLS_PER_OVER).toFixed(2)} • ${economyKing.wickets} wkts` : "Not achieved • Minimum 2 overs"}
                  />
                  <AwardCard
                    icon="🔥"
                    title="Hat-trick of Sixes"
                    player={sixHatTrickPlayer}
                    detail={sixHatTrickPlayer ? "3 consecutive sixes" : "Not achieved"}
                  />
                  <AwardCard
                    icon="💥"
                    title="Boundary King"
                    player={boundaryKingPlayer}
                    detail={boundaryKingPlayer ? "4 consecutive boundaries" : "Not achieved"}
                  />
                  <div className="rounded-[20px] border border-white/10 bg-[#080808] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-xl">⭕</div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-yellow-400">Maiden Over Award</p>
                        {maidenOvers.length ? (
                          <div className="mt-2 space-y-1">
                            {maidenOvers.map((item, index) => (
                              <p key={`${item.player.player_id}-${item.innings}-${item.over}-${index}`} className="text-sm font-black">
                                {playerLabel(item.player)}
                                <span className="ml-2 text-xs font-bold text-white/40">Innings {item.innings} • Over {item.over}</span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1 text-sm font-bold text-white/45">Not achieved</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "squads" && (
            <section className="mt-3">
              <div className="rounded-[22px] border border-white/10 bg-[#080808] p-3">
                <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-yellow-400/25">
                  <button
                    onClick={() => setSquadTeam("a")}
                    className={`flex items-center justify-center gap-2 px-2 py-3 text-xs font-black ${
                      squadTeam === "a" ? "bg-yellow-400 text-black" : "bg-black text-white/55"
                    }`}
                  >
                    <img src={teamLogo(match.team_a)} alt="" className="h-7 w-7 rounded-full object-contain" />
                    <span className="truncate">{shortTeamName(match.team_a)}</span>
                  </button>
                  <button
                    onClick={() => setSquadTeam("b")}
                    className={`flex items-center justify-center gap-2 px-2 py-3 text-xs font-black ${
                      squadTeam === "b" ? "bg-yellow-400 text-black" : "bg-black text-white/55"
                    }`}
                  >
                    <img src={teamLogo(match.team_b)} alt="" className="h-7 w-7 rounded-full object-contain" />
                    <span className="truncate">{shortTeamName(match.team_b)}</span>
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3 border-b border-white/10 pb-3">
                  <img
                    src={teamLogo(selectedSquadName || "")}
                    alt=""
                    className="h-12 w-12 rounded-full object-contain"
                  />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">
                      Playing XI
                    </p>
                    <h2 className="mt-0.5 text-lg font-black">
                      {displayTeamName(selectedSquadName || "")}
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-white/5">
                  {selectedSquad.map((player, index) => (
                    <div key={player.player_id} className="flex items-center gap-3 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-black text-white/40">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black leading-tight">{playerLabel(player)}</p>
                        <p className="mt-1 text-xs font-bold text-white/40">
                          {playerRoleLabel(player)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function TeamIdentity({
  team,
  align,
}: {
  team: string;
  align: "left" | "right";
}) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <img
        src={teamLogo(team)}
        alt={`${displayTeamName(team)} logo`}
        className="h-12 w-12 shrink-0 rounded-full object-contain md:h-16 md:w-16"
      />
      <div className="min-w-0">
        <p className="text-[12px] font-black leading-tight md:text-lg">
          {displayTeamName(team)}
        </p>
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#080808]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-yellow-400">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-black">{title}</h2>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[105px_1fr] gap-4 py-3.5 ${last ? "" : "border-b border-white/5"}`}>
      <span className="text-xs font-bold text-white/35">{label}</span>
      <span className="text-sm font-black leading-5 text-white/90">{value}</span>
    </div>
  );
}

function AwardCard({
  icon,
  title,
  player,
  detail,
  featured = false,
}: {
  icon: string;
  title: string;
  player?: MatchPlayer;
  detail: string;
  featured?: boolean;
}) {
  return (
    <div className={`rounded-[20px] border p-4 ${featured ? "border-yellow-400/30 bg-gradient-to-r from-yellow-400/[0.09] to-red-950/10" : "border-white/10 bg-[#080808]"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${featured ? "bg-yellow-400 text-black" : "bg-white/5"}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-yellow-400">{title}</p>
          <p className="mt-1 text-base font-black">{player ? playerLabel(player) : detail}</p>
          {player && <p className="mt-1 text-[11px] font-bold text-white/45">{detail}</p>}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-wider text-white/35">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-yellow-400">{value}</p>
    </div>
  );
}
