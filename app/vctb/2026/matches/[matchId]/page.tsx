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
  const [showScorecard, setShowScorecard] = useState(false);

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

    return () => {
      supabase.removeChannel(channel);
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

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-2.5 py-3 sm:px-4 md:px-3 md:py-8">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 md:mb-4 md:gap-3">
          <Link
            href="/vctb/2026#live"
            className="text-xs font-bold text-white/50 hover:text-yellow-400 md:text-sm"
          >
            ← VCTB 2026
          </Link>

          <div className="flex items-center gap-2">
            {match.status === "live" && (
              <span className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
                ● Live
              </span>
            )}

            {match.status === "completed" && (
              <span className="rounded-full bg-green-600/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-300">
                ✓ Completed
              </span>
            )}

            <span className="rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5 text-[10px] font-black uppercase text-yellow-400">
              {match.pitch} • Match {match.match_number}
            </span>
          </div>
        </div>

        <section className="overflow-hidden rounded-[18px] border border-white/10 bg-[#080808] shadow-2xl md:rounded-[24px]">
          <div className="border-b border-white/10 bg-gradient-to-r from-red-950/50 via-black to-yellow-950/30 p-3 md:p-5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
              VCTB 3.0 • 2026
            </p>

            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:mt-4 md:gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div>
                <p className="text-sm font-black leading-tight md:text-xl">
                  {displayTeamName(match.team_a)}
                </p>
              </div>

              <div className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/25 md:text-xs md:tracking-[0.3em]">
                VS
              </div>

              <div className="md:text-right">
                <p className="text-sm font-black leading-tight md:text-xl">
                  {displayTeamName(match.team_b)}
                </p>
              </div>
            </div>

            {match.toss_winner && (
              <p className="mt-2 text-[10px] text-white/45 md:mt-4 md:text-sm">
                Toss:{" "}
                <span className="font-bold text-white/70">
                  {displayTeamName(match.toss_winner)}
                </span>{" "}
                chose to {match.toss_decision}
              </p>
            )}
          </div>

          {currentInnings && (
            <div className="p-2.5 sm:p-5 md:p-4">
              <div className="rounded-[16px] border border-yellow-400/20 bg-yellow-400/5 p-3 md:rounded-[22px] md:p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-yellow-400">
                      {displayTeamName(currentInnings.batting_team)}
                    </p>

                    <h1 className="mt-1 text-3xl font-black md:mt-2 md:text-5xl">
                      {currentInnings.total_runs}/{currentInnings.wickets}
                    </h1>

                    <p className="mt-1 text-[10px] font-bold text-white/50 md:mt-2 md:text-sm">
                      {oversFromBalls(currentInnings.legal_balls)} / {MAX_OVERS} overs
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black uppercase text-white/35">
                      CRR
                    </p>
                    <p className="text-xl font-black text-yellow-400 md:text-2xl">
                      {currentRunRate}
                    </p>
                  </div>
                </div>

                {target && (
                  <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-lg border border-white/10 bg-black/30 p-2 text-center md:mt-5 md:gap-2 md:rounded-xl md:p-3">
                    <MiniStat label="Target" value={String(target)} />
                    <MiniStat
                      label="Need"
                      value={`${runsNeeded} from ${ballsRemaining}`}
                    />
                    <MiniStat label="RRR" value={requiredRunRate} />
                  </div>
                )}
              </div>

              <div className="mt-2 grid grid-cols-3 gap-1.5 md:mt-4 md:gap-3 md:grid-cols-3">
                <PublicPlayerCard
                  title="Striker"
                  name={
                    strikerStat
                      ? playerLabel(strikerStat.player)
                      : "Waiting for batter"
                  }
                  primary={
                    strikerStat
                      ? `${strikerStat.runs} (${strikerStat.balls})`
                      : "-"
                  }
                  secondary={
                    strikerStat
                      ? `4s ${strikerStat.fours} • 6s ${strikerStat.sixes} • SR ${
                          strikerStat.balls
                            ? (
                                (strikerStat.runs / strikerStat.balls) *
                                100
                              ).toFixed(1)
                            : "0.0"
                        }`
                      : ""
                  }
                  active
                />

                <PublicPlayerCard
                  title="Non-Striker"
                  name={
                    nonStrikerStat
                      ? playerLabel(nonStrikerStat.player)
                      : "Waiting for batter"
                  }
                  primary={
                    nonStrikerStat
                      ? `${nonStrikerStat.runs} (${nonStrikerStat.balls})`
                      : "-"
                  }
                  secondary={
                    nonStrikerStat
                      ? `4s ${nonStrikerStat.fours} • 6s ${nonStrikerStat.sixes} • SR ${
                          nonStrikerStat.balls
                            ? (
                                (nonStrikerStat.runs /
                                  nonStrikerStat.balls) *
                                100
                              ).toFixed(1)
                            : "0.0"
                        }`
                      : ""
                  }
                />

                <PublicPlayerCard
                  title="Bowler"
                  name={
                    activeBowlerStat
                      ? playerLabel(activeBowlerStat.player)
                      : "Waiting for bowler"
                  }
                  primary={
                    activeBowlerStat
                      ? `${oversFromBalls(
                          activeBowlerStat.legalBalls
                        )}-${activeBowlerStat.runs}-${activeBowlerStat.wickets}`
                      : "-"
                  }
                  secondary={
                    activeBowlerStat
                      ? `Economy ${
                          activeBowlerStat.legalBalls
                            ? (
                                (activeBowlerStat.runs /
                                  activeBowlerStat.legalBalls) *
                                BALLS_PER_OVER
                              ).toFixed(2)
                            : "0.00"
                        }`
                      : ""
                  }
                />
              </div>

              <div className="mt-2 rounded-xl border border-white/10 bg-black p-2.5 md:mt-4 md:rounded-2xl md:p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white/35">
                    Recent Balls
                  </p>

                  <button
                    onClick={() => setShowScorecard(true)}
                    className="rounded-lg bg-white/5 px-3 py-2 text-xs font-black uppercase text-yellow-400"
                  >
                    Full Scorecard
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5 md:mt-3 md:gap-2">
                  {recentBalls.length === 0 ? (
                    <span className="text-sm text-white/30">
                      Waiting for first delivery
                    </span>
                  ) : (
                    recentBalls.map((delivery) => (
                      <span
                        key={delivery.id}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-black ${
                          delivery.wicket
                            ? "bg-red-600"
                            : delivery.runs_batter === 4 ||
                              delivery.runs_batter === 6
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

              <section className="mt-3 md:mt-5">
                <div className="mb-2 flex items-end justify-between gap-3 md:mb-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                      Live Commentary
                    </p>
                    <h2 className="mt-0.5 text-lg font-black md:mt-1 md:text-2xl">
                      Ball-by-Ball
                    </h2>
                  </div>

                  <span className="text-xs font-bold text-white/35">
                    Latest first
                  </span>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  {currentDeliveries.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/40">
                      Ball-by-ball commentary will appear here once the match starts.
                    </div>
                  ) : (
                    [...currentDeliveries]
                      .reverse()
                      .map((delivery) => (
                        <div
                          key={delivery.id}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 md:rounded-2xl md:p-4"
                        >
                          <p className="text-[11px] font-bold text-white/75 md:text-sm">
                            {deliveryCommentary(delivery)}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              </section>

              {match.status === "completed" && (
                <div className="mt-6 rounded-2xl border border-green-400/30 bg-green-950/30 p-5 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
                    Match Completed
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {match.result_text}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {showScorecard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 p-0 md:p-6">
          <div className="mx-auto max-w-5xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#080808]/95 px-3 py-2.5 backdrop-blur md:rounded-2xl md:border md:p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                  VCTB 3.0
                </p>
                <h2 className="mt-0.5 text-lg font-black md:mt-1 md:text-2xl">
                  Full Scorecard
                </h2>
              </div>

              <button
                onClick={() => setShowScorecard(false)}
                className="rounded-xl bg-white/10 px-4 py-2 font-black"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5 md:mt-4 md:space-y-6">
              {innings.map((inningsRow) => {
                const inningsDeliveries = deliveries.filter(
                  (delivery) => delivery.innings_id === inningsRow.id
                );

                const batters = getBatterStats(
                  inningsRow,
                  inningsDeliveries
                );

                const bowlers = getBowlerStats(
                  inningsRow,
                  inningsDeliveries
                );

                const extras = inningsDeliveries.reduce(
                  (sum, delivery) =>
                    sum + Number(delivery.extras || 0),
                  0
                );

                return (
                  <section
                    key={inningsRow.id}
                    className="border-y border-white/10 bg-[#080808] px-2.5 py-3 md:rounded-[24px] md:border md:p-4 sm:md:p-5"
                  >
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-yellow-400">
                          Innings {inningsRow.innings_number}
                        </p>
                        <h3 className="mt-1 text-2xl font-black">
                          {displayTeamName(inningsRow.batting_team)}
                        </h3>
                      </div>

                      <p className="text-2xl font-black">
                        {inningsRow.total_runs}/{inningsRow.wickets}
                        <span className="ml-2 text-sm text-white/40">
                          ({oversFromBalls(inningsRow.legal_balls)})
                        </span>
                      </p>
                    </div>

                    <div className="mt-3 md:hidden">
                      <div className="grid grid-cols-[1fr_28px_28px_28px_28px_45px] items-center border-b border-white/10 px-1 pb-2 text-[8px] font-black uppercase text-white/35">
                        <span>Batter</span><span className="text-right">R</span><span className="text-right">B</span><span className="text-right">4s</span><span className="text-right">6s</span><span className="text-right">SR</span>
                      </div>
                      <div className="divide-y divide-white/5">
                        {batters.map((row) => (
                          <div key={row.player.player_id} className="grid grid-cols-[1fr_28px_28px_28px_28px_45px] items-start px-1 py-2">
                            <div className="min-w-0 pr-1"><p className="truncate text-[10px] font-black leading-tight text-white">{playerLabel(row.player)}</p><p className="mt-0.5 truncate text-[8px] leading-tight text-white/40">{row.dismissal}</p></div>
                            <span className="text-right text-[10px] font-black">{row.runs}</span><span className="text-right text-[10px]">{row.balls}</span><span className="text-right text-[10px]">{row.fours}</span><span className="text-right text-[10px]">{row.sixes}</span><span className="text-right text-[10px]">{row.balls ? ((row.runs / row.balls) * 100).toFixed(1) : "0.0"}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[10px]"><span className="font-bold text-white/45">Extras</span><span className="font-black">{extras}</span></div>
                    </div>

                    <div className="mt-5 hidden overflow-x-auto md:block">
                      <table className="w-full min-w-[680px] text-sm">
                        <thead className="text-left text-xs uppercase text-white/35">
                          <tr>
                            <th className="pb-3">Batter</th>
                            <th className="pb-3">Dismissal</th>
                            <th className="pb-3 text-right">R</th>
                            <th className="pb-3 text-right">B</th>
                            <th className="pb-3 text-right">4s</th>
                            <th className="pb-3 text-right">6s</th>
                            <th className="pb-3 text-right">SR</th>
                          </tr>
                        </thead>

                        <tbody>
                          {batters.map((row) => (
                            <tr
                              key={row.player.player_id}
                              className="border-t border-white/5"
                            >
                              <td className="py-3 font-black">
                                {playerLabel(row.player)}
                              </td>

                              <td className="py-3 text-white/45">
                                {row.dismissal}
                              </td>

                              <td className="py-3 text-right font-black">
                                {row.runs}
                              </td>

                              <td className="py-3 text-right">
                                {row.balls}
                              </td>

                              <td className="py-3 text-right">
                                {row.fours}
                              </td>

                              <td className="py-3 text-right">
                                {row.sixes}
                              </td>

                              <td className="py-3 text-right">
                                {row.balls
                                  ? (
                                      (row.runs / row.balls) *
                                      100
                                    ).toFixed(1)
                                  : "0.0"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-3 hidden text-sm font-bold text-white/45 md:block">
                      Extras: {extras}
                    </p>

                    <div className="mt-4 md:hidden">
                      <div className="grid grid-cols-[1fr_35px_35px_35px_50px] items-center border-b border-white/10 px-1 pb-2 text-[8px] font-black uppercase text-white/35">
                        <span>Bowler</span><span className="text-right">O</span><span className="text-right">R</span><span className="text-right">W</span><span className="text-right">Econ</span>
                      </div>
                      <div className="divide-y divide-white/5">
                        {bowlers.map((row) => (
                          <div key={row.player.player_id} className="grid grid-cols-[1fr_35px_35px_35px_50px] items-center px-1 py-2">
                            <span className="truncate pr-1 text-[10px] font-black">{playerLabel(row.player)}</span><span className="text-right text-[10px]">{oversFromBalls(row.legalBalls)}</span><span className="text-right text-[10px]">{row.runs}</span><span className="text-right text-[10px] font-black">{row.wickets}</span><span className="text-right text-[10px]">{row.legalBalls ? ((row.runs / row.legalBalls) * BALLS_PER_OVER).toFixed(2) : "0.00"}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 hidden overflow-x-auto md:block">
                      <table className="w-full min-w-[560px] text-sm">
                        <thead className="text-left text-xs uppercase text-white/35">
                          <tr>
                            <th className="pb-3">Bowler</th>
                            <th className="pb-3 text-right">O</th>
                            <th className="pb-3 text-right">R</th>
                            <th className="pb-3 text-right">W</th>
                            <th className="pb-3 text-right">Econ</th>
                          </tr>
                        </thead>

                        <tbody>
                          {bowlers.map((row) => (
                            <tr
                              key={row.player.player_id}
                              className="border-t border-white/5"
                            >
                              <td className="py-3 font-black">
                                {playerLabel(row.player)}
                              </td>

                              <td className="py-3 text-right">
                                {oversFromBalls(row.legalBalls)}
                              </td>

                              <td className="py-3 text-right">
                                {row.runs}
                              </td>

                              <td className="py-3 text-right font-black">
                                {row.wickets}
                              </td>

                              <td className="py-3 text-right">
                                {row.legalBalls
                                  ? (
                                      (row.runs / row.legalBalls) *
                                      BALLS_PER_OVER
                                    ).toFixed(2)
                                  : "0.00"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
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
      <p className="text-[10px] font-black uppercase tracking-wider text-white/35">
        {label}
      </p>
      <p className="mt-1 font-black text-yellow-400">{value}</p>
    </div>
  );
}

function PublicPlayerCard({
  title,
  name,
  primary,
  secondary,
  active = false,
}: {
  title: string;
  name: string;
  primary: string;
  secondary: string;
  active?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border p-2 md:rounded-2xl md:p-4 ${
        active
          ? "border-yellow-400/40 bg-yellow-400/5"
          : "border-white/10 bg-black"
      }`}
    >
      <p className="text-[7px] font-black uppercase tracking-wider text-white/35 md:text-[10px]">{title}</p>
      <p className={`mt-1 truncate text-[10px] font-black leading-tight md:mt-2 md:text-base ${active ? "text-yellow-400" : ""}`}>{name}</p>
      <p className="mt-1 text-sm font-black md:mt-2 md:text-2xl">{primary}</p>
      <p className="mt-0.5 truncate text-[7px] text-white/45 md:mt-1 md:text-xs">{secondary}</p>
    </div>
  );
}