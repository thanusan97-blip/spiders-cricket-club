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

const BALLS_PER_OVER = 5;
const MAX_OVERS = 10;
const MAX_LEGAL_BALLS = BALLS_PER_OVER * MAX_OVERS;
const MAX_WICKETS = 10;

const wicketTypes = [
  "Bowled",
  "Caught",
  "Caught & Bowled",
  "LBW",
  "Run Out",
  "Stumped",
  "Hit Wicket",
  "Obstructing the Field",
  "Hit the Ball Twice",
  "Timed Out",
  "Retired Out",
];

function displayTeamName(team: string) {
  return team === "Vallvai Blues SC UK" ? "Vallvai Kadalodikal" : team;
}

function oversFromBalls(legalBalls: number) {
  const overs = Math.floor(legalBalls / BALLS_PER_OVER);
  const balls = legalBalls % BALLS_PER_OVER;
  return `${overs}.${balls}`;
}

function currentBallLabel(legalBalls: number) {
  const completedOvers = Math.floor(legalBalls / BALLS_PER_OVER);
  const ballsInCurrentOver = legalBalls % BALLS_PER_OVER;

  return `${completedOvers}.${ballsInCurrentOver + 1}`;
}

function playerLabel(player: MatchPlayer) {
  const tags = [
    player.is_captain ? "c" : "",
    player.is_wicket_keeper ? "wk" : "",
  ].filter(Boolean);

  return `${player.player_name}${tags.length ? ` (${tags.join(" & ")})` : ""}`;
}

export default function MatchScorerPage() {
  const params = useParams();
  const matchId = Number(params.matchId);

  const supabase = useMemo(() => createClient(), []);
  const [authLoading, setAuthLoading] = useState(true);
  const [scorerEmail, setScorerEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        window.location.href = "/vctb/2026/scoring/login";
        return;
      }

      setScorerEmail(user.email || "");
      setAuthLoading(false);
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        window.location.href = "/vctb/2026/scoring/login";
        return;
      }

      setScorerEmail(session.user.email || "");
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOutScorer() {
    await supabase.auth.signOut();
    window.location.href = "/vctb/2026/scoring/login";
  }


  const [match, setMatch] = useState<MatchRow | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [innings, setInnings] = useState<InningsRow[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);

  const [strikerId, setStrikerId] = useState("");
  const [nonStrikerId, setNonStrikerId] = useState("");
  const [bowlerId, setBowlerId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [showWicket, setShowWicket] = useState(false);
  const [wicketType, setWicketType] = useState("Bowled");
  const [dismissedPlayerId, setDismissedPlayerId] = useState("");
  const [fielderId, setFielderId] = useState("");

  const [showNoBallDetails, setShowNoBallDetails] = useState(false);
  const [pendingNoBallRuns, setPendingNoBallRuns] = useState(0);

  const [runOutDeliveryType, setRunOutDeliveryType] =
    useState<"legal" | "wide" | "no_ball">("legal");
  const [runOutRuns, setRunOutRuns] = useState(0);
  const [runOutRunType, setRunOutRunType] =
    useState<"bat" | "bye" | "leg_bye">("bat");

  const [showScorecard, setShowScorecard] = useState(false);
  const [extraSheet, setExtraSheet] = useState<
    "wide" | "no_ball" | "bye" | "leg_bye" | null
  >(null);

  const currentInnings =
    innings.find((row) => !row.completed) ||
    innings[innings.length - 1] ||
    null;

  const firstInnings = innings.find((row) => row.innings_number === 1) || null;
  const secondInnings = innings.find((row) => row.innings_number === 2) || null;

  const battingPlayers = currentInnings
    ? players.filter((player) => player.team === currentInnings.batting_team)
    : [];

  const bowlingPlayers = currentInnings
    ? players.filter((player) => player.team === currentInnings.bowling_team)
    : [];

  const target =
    currentInnings?.innings_number === 2 && firstInnings
      ? firstInnings.total_runs + 1
      : null;

  const runsNeeded =
    target && currentInnings
      ? Math.max(0, target - currentInnings.total_runs)
      : null;

  const legalBallsRemaining = currentInnings
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
    runsNeeded !== null && legalBallsRemaining > 0
      ? ((runsNeeded / legalBallsRemaining) * BALLS_PER_OVER).toFixed(2)
      : target && runsNeeded === 0
      ? "0.00"
      : "-";

  const currentInningsDeliveries = currentInnings
    ? deliveries.filter((delivery) => delivery.innings_id === currentInnings.id)
    : [];

  const lastSix = currentInningsDeliveries.slice(-6);

  const loadMatch = useCallback(async () => {
    if (!matchId || Number.isNaN(matchId)) return;

    setLoading(true);
    setMessage("");

    try {
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single();

      if (matchError) throw matchError;

      const { data: playerData, error: playerError } = await supabase
        .from("match_players")
        .select("*")
        .eq("match_id", matchId)
        .order("team")
        .order("player_name");

      if (playerError) throw playerError;

      const { data: inningsData, error: inningsError } = await supabase
        .from("innings")
        .select("*")
        .eq("match_id", matchId)
        .order("innings_number");

      if (inningsError) throw inningsError;

      const { data: deliveryData, error: deliveryError } = await supabase
        .from("deliveries")
        .select("*")
        .eq("match_id", matchId)
        .order("id");

      if (deliveryError) throw deliveryError;

      setMatch(matchData as MatchRow);
      setPlayers((playerData || []) as MatchPlayer[]);
      setInnings((inningsData || []) as InningsRow[]);
      setDeliveries((deliveryData || []) as DeliveryRow[]);

      const active = ((inningsData || []) as InningsRow[]).find((row) => !row.completed) || ((inningsData || []) as InningsRow[]).slice(-1)[0];

      if (active?.striker_id || active?.non_striker_id || active?.bowler_id) {
        setStrikerId(active.striker_id || "");
        setNonStrikerId(active.non_striker_id || "");
        setBowlerId(active.bowler_id || "");
      } else {
        const sessionKey = `vctb-scoring-${matchId}`;
        const savedSession = sessionStorage.getItem(sessionKey);
        if (savedSession) {
          const session = JSON.parse(savedSession);
          setStrikerId(session.strikerId || "");
          setNonStrikerId(session.nonStrikerId || "");
          setBowlerId(session.bowlerId || "");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not load this match.");
    } finally {
      setLoading(false);
    }
  }, [matchId, supabase]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  async function persistCurrentPlayers(nextStriker: string, nextNonStriker: string, nextBowler: string, inningsId = currentInnings?.id) {
    if (!inningsId) return;
    await supabase.from("innings").update({
      striker_id: nextStriker || null,
      non_striker_id: nextNonStriker || null,
      bowler_id: nextBowler || null,
    }).eq("id", inningsId);

    sessionStorage.setItem(`vctb-scoring-${matchId}`, JSON.stringify({
      matchId, inningsId, strikerId: nextStriker, nonStrikerId: nextNonStriker, bowlerId: nextBowler,
      battingTeam: currentInnings?.batting_team, bowlingTeam: currentInnings?.bowling_team,
    }));
  }

  async function refreshInningsAndDeliveries() {
    const [{ data: inningsData }, { data: deliveryData }] = await Promise.all([
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

    setInnings((inningsData || []) as InningsRow[]);
    setDeliveries((deliveryData || []) as DeliveryRow[]);
  }

  function swapStrike() {
    setStrikerId(nonStrikerId);
    setNonStrikerId(strikerId);
  }

  async function completeMatch(
    completedInnings: InningsRow,
    scoreAfterBall: number,
    wicketsAfterBall: number,
    legalBallsAfterBall: number
  ) {
    if (!match || !firstInnings) return;

    const chasingTeam = completedInnings.batting_team;
    const defendingTeam = completedInnings.bowling_team;
    const chaseTarget = firstInnings.total_runs + 1;

    let winner: string | null = null;
    let resultText = "";

    if (scoreAfterBall >= chaseTarget) {
      winner = chasingTeam;
      const wicketsRemaining = Math.max(0, 10 - wicketsAfterBall);
      resultText = `${displayTeamName(chasingTeam)} won by ${wicketsRemaining} wicket${
        wicketsRemaining === 1 ? "" : "s"
      }`;
    } else if (
      legalBallsAfterBall >= MAX_LEGAL_BALLS ||
      wicketsAfterBall >= MAX_WICKETS
    ) {
      if (scoreAfterBall === firstInnings.total_runs) {
        winner = null;
        resultText = "Match tied";
      } else {
        winner = defendingTeam;
        const margin = firstInnings.total_runs - scoreAfterBall;
        resultText = `${displayTeamName(defendingTeam)} won by ${margin} run${
          margin === 1 ? "" : "s"
        }`;
      }
    } else {
      return;
    }

    await supabase
      .from("innings")
      .update({ completed: true })
      .eq("id", completedInnings.id);

    await supabase
      .from("matches")
      .update({
        status: "completed",
        winner,
        result_text: resultText,
      })
      .eq("id", matchId);

    setMessage(resultText);
    await loadMatch();
  }

  async function maybeCompleteFirstInnings(
    activeInnings: InningsRow,
    wicketsAfterBall: number,
    legalBallsAfterBall: number
  ) {
    if (
      activeInnings.innings_number !== 1 ||
      (legalBallsAfterBall < MAX_LEGAL_BALLS &&
        wicketsAfterBall < MAX_WICKETS)
    ) {
      return false;
    }

    await supabase
      .from("innings")
      .update({ completed: true })
      .eq("id", activeInnings.id);

    setStrikerId("");
    setNonStrikerId("");
    setBowlerId("");
    setMessage("First innings completed. Start the second innings.");
    await refreshInningsAndDeliveries();

    return true;
  }

  function getBatterStats(inningsRow: InningsRow, ds: DeliveryRow[]) {
    const teamPlayers = players.filter(
      (p) => p.team === inningsRow.batting_team
    );

    // Build the batting order from actual appearance in the innings:
    // openers first, then each new batter as they first appears in a delivery.
    const appearanceOrder: string[] = [];

    const addIfMissing = (playerId?: string | null) => {
      if (playerId && !appearanceOrder.includes(playerId)) {
        appearanceOrder.push(playerId);
      }
    };

    for (const d of ds) {
      addIfMissing(d.striker_id);
      addIfMissing(d.non_striker_id);
    }

    // If the innings has started but one of the current batters has not yet faced
    // a delivery, keep them in the correct current batting order too.
    addIfMissing(inningsRow.striker_id || strikerId);
    addIfMissing(inningsRow.non_striker_id || nonStrikerId);

    // DNB players come after everyone who actually appeared.
    const orderedPlayers = [
      ...appearanceOrder
        .map((id) => teamPlayers.find((p) => p.player_id === id))
        .filter(Boolean) as MatchPlayer[],
      ...teamPlayers.filter(
        (p) => !appearanceOrder.includes(p.player_id)
      ),
    ];

    return orderedPlayers.map((player) => {
      const faced = ds.filter((d) => d.striker_id === player.player_id);

      const runs = faced.reduce(
        (sum, d) => sum + Number(d.runs_batter || 0),
        0
      );

      const balls = faced.filter(
        (d) => d.is_legal_ball && d.extra_type !== "wide"
      ).length;

      const fours = faced.filter((d) => d.runs_batter === 4).length;
      const sixes = faced.filter((d) => d.runs_batter === 6).length;

      const dismissalBall = ds.find(
        (d) =>
          d.wicket &&
          d.dismissed_player_id === player.player_id
      );

      const hasAppeared =
        appearanceOrder.includes(player.player_id) ||
        player.player_id === inningsRow.striker_id ||
        player.player_id === inningsRow.non_striker_id ||
        player.player_id === strikerId ||
        player.player_id === nonStrikerId;

      let dismissal = hasAppeared ? "not out" : "DNB";

      if (dismissalBall) {
        dismissal = dismissalBall.wicket_type || "out";
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

  function getBowlerStats(inningsRow: InningsRow, ds: DeliveryRow[]) {
    return players.filter((p) => p.team === inningsRow.bowling_team).map((player) => {
      const bowled = ds.filter((d) => d.bowler_id === player.player_id);
      if (!bowled.length) return null;
      const legalBalls = bowled.filter((d) => d.is_legal_ball).length;
      const runs = bowled.reduce((sum,d) => {
        const kind = d.extra_type || "";
        if (kind === "bye" || kind === "leg_bye") {
          return sum + Number(d.runs_batter || 0);
        }
        if (kind === "no_ball_bye" || kind === "no_ball_leg_bye") {
          return sum + Number(d.runs_batter || 0) + 1;
        }
        return sum + Number(d.runs_batter || 0) + Number(d.extras || 0);
      }, 0);
      const wickets = bowled.filter((d) => d.wicket && !["Run Out","Retired Out"].includes(d.wicket_type || "")).length;
      return { player, legalBalls, runs, wickets };
    }).filter(Boolean) as {player: MatchPlayer; legalBalls:number; runs:number; wickets:number}[];
  }

  const currentBatterStats = currentInnings ? getBatterStats(currentInnings, currentInningsDeliveries) : [];
  const strikerStat = currentBatterStats.find((r) => r.player.player_id === strikerId);
  const nonStrikerStat = currentBatterStats.find((r) => r.player.player_id === nonStrikerId);
  const currentBowlerStats = currentInnings ? getBowlerStats(currentInnings, currentInningsDeliveries) : [];
  const activeBowlerStat = currentBowlerStats.find((r) => r.player.player_id === bowlerId);

  async function handlePlayerChange(type: "striker" | "nonStriker" | "bowler", value: string) {
    let ns = strikerId, nn = nonStrikerId, nb = bowlerId;
    if (type === "striker") { ns = value; setStrikerId(value); }
    if (type === "nonStriker") { nn = value; setNonStrikerId(value); }
    if (type === "bowler") { nb = value; setBowlerId(value); }
    await persistCurrentPlayers(ns, nn, nb);
  }

  async function recordDelivery({
    runsBatter = 0,
    extras = 0,
    extraType = null,
    isLegalBall = true,
    isWicket = false,
    wicketKind = null,
    dismissedId = null,
    fielder = null,
    strikeChangeRuns = 0,
  }: {
    runsBatter?: number;
    extras?: number;
    extraType?: string | null;
    isLegalBall?: boolean;
    isWicket?: boolean;
    wicketKind?: string | null;
    dismissedId?: string | null;
    fielder?: string | null;
    strikeChangeRuns?: number;
  }) {
    if (!currentInnings) return;

    if (!strikerId || !nonStrikerId || !bowlerId) {
      setMessage("Select striker, non-striker and bowler first.");
      return;
    }

    if (currentInnings.completed || match?.status === "completed") {
      setMessage("This innings/match is already completed.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const legalBallsBefore = currentInnings.legal_balls;
      const overNumber = Math.floor(legalBallsBefore / BALLS_PER_OVER) + 1;
      const ballInOver = (legalBallsBefore % BALLS_PER_OVER) + 1;

      const { error: insertError } = await supabase.from("deliveries").insert({
        match_id: matchId,
        innings_id: currentInnings.id,
        over_number: overNumber,
        ball_in_over: ballInOver,
        striker_id: strikerId,
        non_striker_id: nonStrikerId,
        bowler_id: bowlerId,
        runs_batter: runsBatter,
        extras,
        extra_type: extraType,
        wicket: isWicket,
        wicket_type: wicketKind,
        dismissed_player_id: dismissedId,
        fielder_id: fielder,
        is_legal_ball: isLegalBall,
      });

      if (insertError) throw insertError;

      const totalRunsAdded = runsBatter + extras;
      const totalRunsAfter = currentInnings.total_runs + totalRunsAdded;
      const wicketsAfter = currentInnings.wickets + (isWicket ? 1 : 0);
      const legalBallsAfter =
        currentInnings.legal_balls + (isLegalBall ? 1 : 0);

      const { error: inningsUpdateError } = await supabase
        .from("innings")
        .update({
          total_runs: totalRunsAfter,
          wickets: wicketsAfter,
          legal_balls: legalBallsAfter,
        })
        .eq("id", currentInnings.id);

      if (inningsUpdateError) throw inningsUpdateError;

      if (currentInnings.innings_number === 2 && firstInnings) {
        await completeMatch(
          currentInnings,
          totalRunsAfter,
          wicketsAfter,
          legalBallsAfter
        );

        if (
          totalRunsAfter >= firstInnings.total_runs + 1 ||
          legalBallsAfter >= MAX_LEGAL_BALLS ||
          wicketsAfter >= MAX_WICKETS
        ) {
          return;
        }
      }

      const firstInningsFinished = await maybeCompleteFirstInnings(
        currentInnings,
        wicketsAfter,
        legalBallsAfter
      );

      if (firstInningsFinished) return;

      let nextStriker = strikerId;
      let nextNonStriker = nonStrikerId;
      let nextBowler = bowlerId;

      if (strikeChangeRuns % 2 === 1) {
        [nextStriker, nextNonStriker] = [nextNonStriker, nextStriker];
      }

      if (isWicket && dismissedId) {
        if (dismissedId === nextStriker) nextStriker = "";
        if (dismissedId === nextNonStriker) nextNonStriker = "";
      }

      if (isLegalBall && legalBallsAfter > 0 && legalBallsAfter % BALLS_PER_OVER === 0) {
        [nextStriker, nextNonStriker] = [nextNonStriker, nextStriker];
        nextBowler = "";
        setMessage("Over complete. Select the next bowler.");
      }

      setStrikerId(nextStriker);
      setNonStrikerId(nextNonStriker);
      setBowlerId(nextBowler);
      await persistCurrentPlayers(nextStriker, nextNonStriker, nextBowler, currentInnings.id);
      await refreshInningsAndDeliveries();
    } catch (error) {
      console.error(error);
      setMessage("Could not save that delivery.");
    } finally {
      setSaving(false);
    }
  }

  async function recordWide(additionalRuns: number) {
    // A wide always carries the automatic 1-run penalty.
    // additionalRuns are runs completed by the batters beyond that penalty.
    await recordDelivery({
      extras: 1 + additionalRuns,
      extraType: "wide",
      isLegalBall: false,
      strikeChangeRuns: additionalRuns,
    });
  }

  async function recordNoBall(
    additionalRuns: number,
    runType: "bat" | "bye" | "leg_bye" = "bat"
  ) {
    // A no-ball always carries the automatic 1-run penalty.
    if (runType === "bat") {
      await recordDelivery({
        runsBatter: additionalRuns,
        extras: 1,
        extraType: "no_ball",
        isLegalBall: false,
        strikeChangeRuns: additionalRuns,
      });
      return;
    }

    await recordDelivery({
      runsBatter: 0,
      extras: 1 + additionalRuns,
      extraType:
        runType === "bye" ? "no_ball_bye" : "no_ball_leg_bye",
      isLegalBall: false,
      strikeChangeRuns: additionalRuns,
    });
  }

  async function recordBye(total: number, type: "bye" | "leg_bye") {
    await recordDelivery({
      extras: total,
      extraType: type,
      isLegalBall: true,
      strikeChangeRuns: total,
    });
  }

  async function recordRunOut() {
    if (!dismissedPlayerId) {
      setMessage("Select which batter is run out.");
      return;
    }

    let runsBatter = 0;
    let extras = 0;
    let extraType: string | null = null;
    let isLegalBall = true;

    if (runOutDeliveryType === "legal") {
      if (runOutRunType === "bat") {
        runsBatter = runOutRuns;
      } else {
        extras = runOutRuns;
        extraType = runOutRunType;
      }
    }

    if (runOutDeliveryType === "wide") {
      extras = 1 + runOutRuns;
      extraType = "wide";
      isLegalBall = false;
    }

    if (runOutDeliveryType === "no_ball") {
      isLegalBall = false;

      if (runOutRunType === "bat") {
        runsBatter = runOutRuns;
        extras = 1;
        extraType = "no_ball";
      } else {
        extras = 1 + runOutRuns;
        extraType =
          runOutRunType === "bye"
            ? "no_ball_bye"
            : "no_ball_leg_bye";
      }
    }

    await recordDelivery({
      runsBatter,
      extras,
      extraType,
      isLegalBall,
      isWicket: true,
      wicketKind: "Run Out",
      dismissedId: dismissedPlayerId,
      fielder: fielderId || null,
      strikeChangeRuns: runOutRuns,
    });

    setShowWicket(false);
  }

  async function startSecondInnings() {
    if (!match || !firstInnings || !firstInnings.completed || secondInnings) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("innings")
        .insert({
          match_id: matchId,
          innings_number: 2,
          batting_team: firstInnings.bowling_team,
          bowling_team: firstInnings.batting_team,
          total_runs: 0,
          wickets: 0,
          legal_balls: 0,
          completed: false,
          striker_id: null,
          non_striker_id: null,
          bowler_id: null,
        })
        .select("*")
        .single();

      if (error) throw error;

      setStrikerId("");
      setNonStrikerId("");
      setBowlerId("");
      setMessage(
        `Target: ${firstInnings.total_runs + 1}. Select the opening batters and bowler.`
      );

      setInnings((current) => [...current, data as InningsRow]);
      await refreshInningsAndDeliveries();
    } catch (error) {
      console.error(error);
      setMessage("Could not start the second innings.");
    } finally {
      setSaving(false);
    }
  }

  async function undoLastBall() {
    if (!currentInnings) return;

    const inningsDeliveries = deliveries.filter(
      (delivery) => delivery.innings_id === currentInnings.id
    );

    const last = inningsDeliveries[inningsDeliveries.length - 1];

    if (!last) {
      setMessage("There is no delivery to undo.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const { error: deleteError } = await supabase
        .from("deliveries")
        .delete()
        .eq("id", last.id);

      if (deleteError) throw deleteError;

      const remaining = inningsDeliveries.filter(
        (delivery) => delivery.id !== last.id
      );

      const totalRuns = remaining.reduce(
        (sum, delivery) =>
          sum + Number(delivery.runs_batter || 0) + Number(delivery.extras || 0),
        0
      );

      const wickets = remaining.reduce(
        (sum, delivery) => sum + (delivery.wicket ? 1 : 0),
        0
      );

      const legalBalls = remaining.reduce(
        (sum, delivery) => sum + (delivery.is_legal_ball ? 1 : 0),
        0
      );

      // Restore the exact players who were in place BEFORE the undone ball.
      // This fixes undoing ball 5 of an over: the previous bowler is selected again automatically.
      const restoreStriker = last.striker_id;
      const restoreNonStriker = last.non_striker_id;
      const restoreBowler = last.bowler_id;

      await supabase
        .from("innings")
        .update({
          total_runs: totalRuns,
          wickets,
          legal_balls: legalBalls,
          completed: false,
          striker_id: restoreStriker,
          non_striker_id: restoreNonStriker,
          bowler_id: restoreBowler,
        })
        .eq("id", currentInnings.id);

      await supabase
        .from("matches")
        .update({
          status: "live",
          winner: null,
          result_text: null,
        })
        .eq("id", matchId);

      setStrikerId(restoreStriker);
      setNonStrikerId(restoreNonStriker);
      setBowlerId(restoreBowler);

      await persistCurrentPlayers(
        restoreStriker,
        restoreNonStriker,
        restoreBowler,
        currentInnings.id
      );

      await refreshInningsAndDeliveries();

      // Re-apply after refresh so React state cannot be overwritten by stale data.
      setStrikerId(restoreStriker);
      setNonStrikerId(restoreNonStriker);
      setBowlerId(restoreBowler);

      setMessage("Last ball undone. Previous striker, non-striker and bowler restored.");
    } catch (error) {
      console.error(error);
      setMessage("Could not undo the last delivery.");
    } finally {
      setSaving(false);
    }
  }

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
      return `${Number(delivery.runs_batter || 0) + Number(delivery.extras || 0)}Nb`;
    }

    if (delivery.extra_type === "bye") {
      return `${delivery.extras}B`;
    }

    if (delivery.extra_type === "leg_bye") {
      return `${delivery.extras}Lb`;
    }

    return String(delivery.runs_batter);
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-20 text-center text-white">
        <p className="font-black text-yellow-400">Checking scorer access...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-8 text-center text-white">
        Loading match...
      </main>
    );
  }

  if (!match || !currentInnings) {
    return (
      <main className="min-h-screen bg-black px-4 py-16 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-black">Match not found</h1>

          <Link
            href="/vctb/2026/scoring"
            className="mt-6 inline-block rounded-xl bg-yellow-400 px-5 py-3 font-black text-black"
          >
            Back to Scoring Centre
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#030303] text-white md:min-h-screen md:h-auto md:overflow-visible">
      <div
        className="mx-auto flex h-full max-w-3xl flex-col px-3 sm:px-4 md:block md:h-auto md:py-5"
        style={{
          paddingTop: "max(12px, calc(env(safe-area-inset-top) + 8px))",
          paddingBottom: "max(10px, calc(env(safe-area-inset-bottom) + 6px))",
        }}
      >

        <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2 px-0.5 md:mb-2">
          <Link
            href="/vctb/2026/scoring"
            className="whitespace-nowrap text-[12px] font-black text-white/75 hover:text-yellow-400 md:text-sm"
          >
            ← Scoring Centre
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={() => setShowScorecard(true)} className="rounded-full border border-white/20 bg-white/[0.08] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-white shadow-sm md:px-3 md:py-1.5">Scorecard</button>
            <div className="hidden rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1.5 text-[10px] font-black uppercase text-yellow-400 sm:block">
              {match.pitch} • Match {match.match_number}
            </div>
            <button
              onClick={signOutScorer}
              className="rounded-full border border-red-400/30 bg-red-950/35 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-red-100 shadow-sm md:px-3 md:py-1.5"
            >
              Sign Out
            </button>
          </div>
        </div>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#080808] shadow-2xl md:block md:rounded-[20px]">
          <div className="shrink-0 border-b border-white/10 bg-gradient-to-r from-red-950/45 via-[#080808] to-yellow-950/25 px-4 py-2.5 md:p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-400 md:text-xs md:tracking-[0.25em]">
              {displayTeamName(currentInnings.batting_team)}
            </p>

            <div className="mt-1.5 flex items-end justify-between gap-3 md:mt-2 md:flex-wrap">
              <div>
                <h1 className="text-[34px] font-black leading-none sm:text-4xl md:text-5xl">
                  {currentInnings.total_runs}/{currentInnings.wickets}
                </h1>

                <p className="mt-1.5 text-[11px] font-bold text-white/45 md:mt-1 md:text-sm">
                  {oversFromBalls(currentInnings.legal_balls)} / {MAX_OVERS} overs
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35 md:text-xs">CRR</p>
                <p className="mt-0.5 text-xl font-black text-yellow-400 md:text-lg">
                  {currentRunRate}
                </p>
              </div>
            </div>

            {target && (
              <div className="mt-1 grid grid-cols-3 gap-1 rounded-lg border border-red-400/20 bg-red-950/20 px-2 py-1 text-center md:mt-5 md:gap-2 md:rounded-2xl md:p-3">
                <MiniStat label="Target" value={target.toString()} />
                <MiniStat label="Need" value={`${runsNeeded} runs`} />
                <MiniStat label="RRR" value={requiredRunRate} />
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-2.5 md:block md:p-3">

            <div className="grid shrink-0 grid-cols-1 gap-1.5 md:grid-cols-3 md:gap-2">
              <CompactPlayerRow
                title="Striker"
                selectValue={strikerId}
                onSelect={(value) => handlePlayerChange("striker", value)}
                players={battingPlayers}
                name={strikerStat ? playerLabel(strikerStat.player) : "Select striker"}
                score={strikerStat ? `${strikerStat.runs} (${strikerStat.balls})` : "-"}
                detail={strikerStat ? `SR ${strikerStat.balls ? ((strikerStat.runs / strikerStat.balls) * 100).toFixed(1) : "0.0"}` : ""}
                active
              />

              <CompactPlayerRow
                title="Non-Striker"
                selectValue={nonStrikerId}
                onSelect={(value) => handlePlayerChange("nonStriker", value)}
                players={battingPlayers}
                name={nonStrikerStat ? playerLabel(nonStrikerStat.player) : "Select non-striker"}
                score={nonStrikerStat ? `${nonStrikerStat.runs} (${nonStrikerStat.balls})` : "-"}
                detail={nonStrikerStat ? `SR ${nonStrikerStat.balls ? ((nonStrikerStat.runs / nonStrikerStat.balls) * 100).toFixed(1) : "0.0"}` : ""}
              />

              <CompactPlayerRow
                title="Bowler"
                selectValue={bowlerId}
                onSelect={(value) => handlePlayerChange("bowler", value)}
                players={bowlingPlayers}
                name={activeBowlerStat ? playerLabel(activeBowlerStat.player) : "Select bowler"}
                score={activeBowlerStat ? `${oversFromBalls(activeBowlerStat.legalBalls)}-${activeBowlerStat.runs}-${activeBowlerStat.wickets}` : "-"}
                detail={activeBowlerStat ? `Econ ${activeBowlerStat.legalBalls ? ((activeBowlerStat.runs / activeBowlerStat.legalBalls) * BALLS_PER_OVER).toFixed(2) : "0.00"}` : ""}
              />
            </div>

            <div className="mt-1.5 shrink-0 rounded-xl border border-white/10 bg-black/80 px-3 py-1.5 md:mt-3 md:p-3">
              <div className="flex items-center gap-2">
                <p className="shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-white/35 md:text-xs md:tracking-[0.25em]">
                  Recent
                </p>

                <div className="flex min-w-0 flex-1 gap-1 overflow-hidden md:mt-2 md:flex-wrap md:gap-1.5">
                {lastSix.length === 0 ? (
                  <span className="text-sm text-white/30">No balls yet</span>
                ) : (
                  lastSix.map((delivery) => (
                    <span
                      key={delivery.id}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[11px] font-black md:h-8 md:min-w-8 md:text-xs ${
                        delivery.wicket
                          ? "bg-red-600 text-white"
                          : delivery.runs_batter === 4 || delivery.runs_batter === 6
                          ? "bg-yellow-400 text-black"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {deliveryBadge(delivery)}
                    </span>
                  ))
                )}
                </div>
              </div>
            </div>

            <section className="mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] md:mt-3 md:block">
              <div className="grid min-h-0 flex-[6] grid-cols-3">
                {[0, 1, 2, 3, 4, 6].map((runs) => (
                  <button
                    key={runs}
                    disabled={saving}
                    onClick={() =>
                      recordDelivery({
                        runsBatter: runs,
                        strikeChangeRuns: runs,
                      })
                    }
                    className={`min-h-0 border-b border-r border-white/10 text-xl font-black transition active:bg-white/10 active:scale-[0.98] disabled:opacity-40 md:min-h-[66px] md:text-2xl ${
                      runs === 4 || runs === 6
                        ? "text-yellow-400"
                        : "text-white"
                    }`}
                  >
                    <span className="block">{runs}</span>
                    {(runs === 4 || runs === 6) && (
                      <span className="block text-[7px] font-bold uppercase text-white/45 md:mt-1 md:text-[10px]">
                        {runs === 4 ? "Four" : "Six"}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid min-h-0 flex-[2] grid-cols-4 border-t border-white/10">
                {[
                  ["WD", "wide"],
                  ["NB", "no_ball"],
                  ["BYE", "bye"],
                  ["LB", "leg_bye"],
                ].map(([label, type]) => (
                  <button
                    key={type}
                    disabled={saving}
                    onClick={() =>
                      setExtraSheet(
                        type as "wide" | "no_ball" | "bye" | "leg_bye"
                      )
                    }
                    className="min-h-0 border-r border-white/10 text-[11px] font-black tracking-wide text-blue-200 active:bg-blue-950/30 active:scale-[0.98] disabled:opacity-40 md:min-h-[52px] md:text-sm"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid min-h-0 flex-[2] grid-cols-2 border-t border-white/10">
                <button
                  disabled={saving}
                  onClick={() => {
                    setDismissedPlayerId(strikerId);
                    setWicketType("Bowled");
                    setFielderId("");
                    setRunOutDeliveryType("legal");
                    setRunOutRuns(0);
                    setRunOutRunType("bat");
                    setShowWicket(true);
                  }}
                  className="min-h-0 border-r border-white/10 bg-red-950/35 text-sm font-black uppercase tracking-wide text-red-300 active:bg-red-900/40 active:scale-[0.98] disabled:opacity-40 md:min-h-[56px] md:text-base"
                >
                  Out
                </button>

                <button
                  disabled={saving}
                  onClick={undoLastBall}
                  className="min-h-0 text-sm font-black uppercase tracking-wide text-white active:bg-white/5 active:scale-[0.98] disabled:opacity-40 md:min-h-[56px] md:text-base"
                >
                  ↶ Undo
                </button>
              </div>
            </section>

            {message && (
              <div className="mt-1 shrink-0 rounded-lg border border-yellow-400/20 bg-yellow-400/5 px-2 py-1 text-[9px] font-bold text-yellow-100 md:mt-4 md:rounded-2xl md:p-4 md:text-sm">
                {message}
              </div>
            )}

            {firstInnings?.completed && !secondInnings && (
              <button
                disabled={saving}
                onClick={startSecondInnings}
                className="mt-5 w-full rounded-2xl bg-yellow-400 px-5 py-5 text-lg font-black uppercase text-black"
              >
                Start 2nd Innings — Target {firstInnings.total_runs + 1}
              </button>
            )}

            {match.status === "completed" && (
              <div className="mt-5 rounded-2xl border border-green-400/30 bg-green-950/30 p-5 text-center">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
                  Match Completed
                </p>
                <p className="mt-2 text-xl font-black">
                  {match.result_text}
                </p>
              </div>
            )}
          </div>
        </section>

        {extraSheet && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-2 sm:items-center sm:justify-center">
            <div className="w-full max-w-md rounded-t-[28px] border border-white/10 bg-[#f3f3f3] p-4 text-black sm:rounded-[28px]">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-black/20" />

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setExtraSheet(null)}
                  className="text-sm font-black text-red-500"
                >
                  Cancel
                </button>

                <h2 className="text-lg font-black">
                  {extraSheet === "wide"
                    ? "Wide Ball (1 Run)"
                    : extraSheet === "no_ball"
                    ? "No Ball (1 Run)"
                    : extraSheet === "bye"
                    ? "Bye"
                    : "Leg Bye"}
                </h2>

                <span className="w-12" />
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {(extraSheet === "wide" || extraSheet === "no_ball"
                  ? [0, 1, 2, 3, 4, 5, 6]
                  : [1, 2, 3, 4, 5, 6]
                ).map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      if (extraSheet === "wide") {
                        recordWide(value);
                        setExtraSheet(null);
                        return;
                      }

                      if (extraSheet === "no_ball") {
                        if (value === 0) {
                          recordNoBall(0, "bat");
                          setExtraSheet(null);
                        } else {
                          setPendingNoBallRuns(value);
                          setExtraSheet(null);
                          setShowNoBallDetails(true);
                        }
                        return;
                      }

                      if (extraSheet === "bye") {
                        recordBye(value, "bye");
                        setExtraSheet(null);
                        return;
                      }

                      recordBye(value, "leg_bye");
                      setExtraSheet(null);
                    }}
                    className="min-h-[70px] rounded-2xl border-2 border-black/10 bg-white text-lg font-black"
                  >
                    {extraSheet === "wide"
                      ? value === 0
                        ? "WD"
                        : `WD + ${value}`
                      : extraSheet === "no_ball"
                      ? value === 0
                        ? "NB"
                        : `NB + ${value}`
                      : value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showWicket && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/80 p-3 sm:items-center sm:justify-center">
            <div className="w-full max-w-lg rounded-[20px] border border-red-400/30 bg-[#090909] p-5 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">Record Wicket</h2>

                <button
                  onClick={() => setShowWicket(false)}
                  className="text-2xl text-white/50"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/60">
                    Wicket Type
                  </span>

                  <select
                    value={wicketType}
                    onChange={(event) => {
                      setWicketType(event.target.value);
                      setDismissedPlayerId(strikerId);
                      setFielderId("");
                      setRunOutDeliveryType("legal");
                      setRunOutRuns(0);
                      setRunOutRunType("bat");
                    }}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white"
                  >
                    {wicketTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-black text-white/60">
                    {wicketType === "Run Out"
                      ? "Which batter is run out?"
                      : "Dismissed Player"}
                  </span>

                  <select
                    value={dismissedPlayerId}
                    onChange={(event) => setDismissedPlayerId(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white"
                  >
                    <option value="">Select player</option>

                    {[strikerId, nonStrikerId]
                      .filter(Boolean)
                      .map((id) => {
                        const player = battingPlayers.find(
                          (candidate) => candidate.player_id === id
                        );

                        return (
                          <option key={id} value={id}>
                            {player ? playerLabel(player) : id}
                          </option>
                        );
                      })}
                  </select>
                </label>

                {wicketType === "Run Out" && (
                  <>
                    <div>
                      <span className="mb-2 block text-sm font-black text-white/60">
                        Delivery Type
                      </span>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          ["legal", "Legal"],
                          ["wide", "Wide"],
                          ["no_ball", "No Ball"],
                        ].map(([value, label]) => (
                          <button
                            type="button"
                            key={value}
                            onClick={() =>
                              setRunOutDeliveryType(
                                value as "legal" | "wide" | "no_ball"
                              )
                            }
                            className={`rounded-xl border px-3 py-3 text-sm font-black ${
                              runOutDeliveryType === value
                                ? "border-yellow-400 bg-yellow-400 text-black"
                                : "border-white/10 bg-black text-white"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-black text-white/60">
                        Runs completed before run out
                      </span>

                      <select
                        value={runOutRuns}
                        onChange={(event) =>
                          setRunOutRuns(Number(event.target.value))
                        }
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white"
                      >
                        {Array.from({ length: 13 }, (_, i) => i).map((runs) => (
                          <option key={runs} value={runs}>
                            {runs}
                          </option>
                        ))}
                      </select>
                    </label>

                    {runOutDeliveryType !== "wide" && runOutRuns > 0 && (
                      <div>
                        <span className="mb-2 block text-sm font-black text-white/60">
                          How were the runs scored?
                        </span>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            ["bat", "Bat Runs"],
                            ["bye", "Bye"],
                            ["leg_bye", "Leg Bye"],
                          ].map(([value, label]) => (
                            <button
                              type="button"
                              key={value}
                              onClick={() =>
                                setRunOutRunType(
                                  value as "bat" | "bye" | "leg_bye"
                                )
                              }
                              className={`rounded-xl border px-3 py-3 text-sm font-black ${
                                runOutRunType === value
                                  ? "border-yellow-400 bg-yellow-400 text-black"
                                  : "border-white/10 bg-black text-white"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {(wicketType === "Caught" ||
                  wicketType === "Run Out" ||
                  wicketType === "Stumped") && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-white/60">
                      {wicketType === "Run Out"
                        ? "Fielder (Run Out)"
                        : wicketType === "Stumped"
                        ? "Wicket Keeper"
                        : "Fielder"}
                    </span>

                    <select
                      value={fielderId}
                      onChange={(event) => setFielderId(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white"
                    >
                      <option value="">Select fielder</option>

                      {bowlingPlayers.map((player) => (
                        <option key={player.player_id} value={player.player_id}>
                          {playerLabel(player)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <button
                  disabled={!dismissedPlayerId || saving}
                  onClick={async () => {
                    if (wicketType === "Run Out") {
                      await recordRunOut();
                      return;
                    }

                    await recordDelivery({
                      isWicket: true,
                      wicketKind: wicketType,
                      dismissedId: dismissedPlayerId,
                      fielder:
                        wicketType === "Caught" || wicketType === "Stumped"
                          ? fielderId || null
                          : null,
                    });

                    setShowWicket(false);
                  }}
                  className="w-full rounded-2xl bg-red-600 px-5 py-4 font-black uppercase text-white disabled:opacity-40"
                >
                  Confirm Wicket
                </button>
              </div>
            </div>
          </div>
        )}


        {showNoBallDetails && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/80 p-3 sm:items-center sm:justify-center">
            <div className="w-full max-w-md rounded-[20px] border border-blue-400/30 bg-[#090909] p-5 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-blue-300">
                    No Ball +{pendingNoBallRuns}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    How were the additional runs scored?
                  </h2>
                </div>

                <button
                  onClick={() => setShowNoBallDetails(false)}
                  className="text-2xl text-white/50"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  ["bat", "Bat Runs"],
                  ["bye", "Bye"],
                  ["leg_bye", "Leg Bye"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={async () => {
                      await recordNoBall(
                        pendingNoBallRuns,
                        value as "bat" | "bye" | "leg_bye"
                      );
                      setShowNoBallDetails(false);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-lg font-black"
                  >
                    {label}
                  </button>
                ))}

                <button
                  onClick={() => setShowNoBallDetails(false)}
                  className="rounded-2xl border border-red-400/20 bg-red-950/20 px-4 py-4 font-black text-red-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showScorecard && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 p-3 sm:p-6">
            <div className="mx-auto max-w-5xl">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-[#080808] p-4">
                <div><p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">VCTB 3.0</p><h2 className="mt-1 text-2xl font-black">Full Scorecard</h2></div>
                <button onClick={() => setShowScorecard(false)} className="rounded-xl bg-white/10 px-4 py-2 font-black">Close</button>
              </div>
              <div className="mt-4 space-y-6">
                {innings.map((inn) => {
                  const ds = deliveries.filter((d) => d.innings_id === inn.id);
                  const bat = getBatterStats(inn, ds);
                  const bowl = getBowlerStats(inn, ds);
                  const extras = ds.reduce((sum,d) => sum + Number(d.extras||0),0);
                  return <section key={inn.id} className="rounded-[24px] border border-white/10 bg-[#080808] p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-yellow-400">Innings {inn.innings_number}</p><h3 className="mt-1 text-2xl font-black">{displayTeamName(inn.batting_team)}</h3></div><p className="text-2xl font-black">{inn.total_runs}/{inn.wickets} <span className="text-sm text-white/40">({oversFromBalls(inn.legal_balls)})</span></p></div>
                    <div className="mt-5 overflow-x-auto"><table className="w-full table-fixed text-[11px] sm:text-sm"><thead className="text-left text-[9px] uppercase text-white/35 sm:text-xs"><tr><th className="w-[30%] pr-1">Batter</th><th className="w-[25%] pr-1">Dismissal</th><th className="w-[7%] text-right">R</th><th className="w-[7%] text-right">B</th><th className="w-[7%] text-right">4s</th><th className="w-[7%] text-right">6s</th><th className="w-[17%] text-right">SR</th></tr></thead><tbody>{bat.map((r:any)=><tr key={r.player.player_id} className="border-t border-white/5"><td className="truncate py-3 pr-1 font-black">{scorecardPlayerLabel(r.player)}</td><td className="truncate py-3 pr-1 text-white/45">{r.dismissal}</td><td className="py-3 text-right font-black">{r.runs}</td><td className="py-3 text-right">{r.balls}</td><td className="py-3 text-right">{r.fours}</td><td className="py-3 text-right">{r.sixes}</td><td className="py-3 text-right">{r.balls ? ((r.runs/r.balls)*100).toFixed(1) : "0.0"}</td></tr>)}</tbody></table></div>
                    <p className="mt-3 text-sm font-bold text-white/45">Extras: {extras}</p>
                    <div className="mt-6 overflow-x-auto"><table className="w-full table-fixed text-[11px] sm:text-sm"><thead className="text-left text-xs uppercase text-white/35"><tr><th>Bowler</th><th className="text-right">O</th><th className="text-right">R</th><th className="text-right">W</th><th className="text-right">Econ</th></tr></thead><tbody>{bowl.map((r:any)=><tr key={r.player.player_id} className="border-t border-white/5"><td className="py-3 font-black">{scorecardPlayerLabel(r.player)}</td><td className="py-3 text-right">{oversFromBalls(r.legalBalls)}</td><td className="py-3 text-right">{r.runs}</td><td className="py-3 text-right font-black">{r.wickets}</td><td className="py-3 text-right">{r.legalBalls ? ((r.runs/r.legalBalls)*BALLS_PER_OVER).toFixed(2) : "0.00"}</td></tr>)}</tbody></table></div>
                  </section>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function scorecardPlayerLabel(player: MatchPlayer) {
  const full = playerLabel(player).trim();

  // Keep role markers such as (c) and (wk), but shorten the personal name
  // to "First I" for the mobile scorecard.
  const roleMatch = full.match(/\s*((?:\([^)]*\)\s*)+)$/);
  const roles = roleMatch ? roleMatch[1].trim() : "";
  const nameOnly = roleMatch ? full.slice(0, roleMatch.index).trim() : full;

  const parts = nameOnly.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return `${nameOnly}${roles ? ` ${roles}` : ""}`;

  const first = parts[0];
  const initial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first} ${initial}${roles ? ` ${roles}` : ""}`;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wider text-white/35">
        {label}
      </p>
      <p className="mt-1 font-black text-yellow-400">{value}</p>
    </div>
  );
}

function ExtraButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="min-h-[58px] rounded-2xl border border-blue-400/20 bg-blue-950/20 px-3 font-black text-blue-100 transition active:scale-95 disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function CompactPlayerRow({
  title,
  selectValue,
  onSelect,
  players,
  name,
  score,
  detail,
  active = false,
}: {
  title: string;
  selectValue: string;
  onSelect: (value: string) => void;
  players: MatchPlayer[];
  name: string;
  score: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div
      className={`relative min-w-0 rounded-xl border px-3 py-2 md:rounded-xl md:p-3 ${
        active
          ? "border-yellow-400/40 bg-gradient-to-r from-yellow-400/[0.08] to-transparent"
          : "border-white/10 bg-black/80"
      }`}
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/35 md:text-[9px] md:tracking-wider">
              {title}
            </p>
            {detail && (
              <span className="hidden text-[9px] font-bold text-white/30 md:inline">
                {detail}
              </span>
            )}
          </div>

          <p
            className={`mt-1 truncate text-[14px] font-black leading-tight md:text-sm ${
              active ? "text-yellow-400" : "text-white"
            }`}
          >
            {name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="text-right">
            <p className="text-[15px] font-black leading-none md:text-lg">{score}</p>
            <p className="mt-1 text-[9px] font-bold text-white/35 md:hidden">{detail}</p>
          </div>

          {/* Mobile: clean three-dot player changer */}
          <details className="group relative md:hidden">
            <summary
              aria-label={`Change ${title}`}
              className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-lg font-black leading-none text-white/75 transition active:scale-95 [&::-webkit-details-marker]:hidden"
            >
              ⋯
            </summary>

            <div className="absolute right-0 top-11 z-40 w-[min(78vw,310px)] rounded-2xl border border-white/15 bg-[#111111] p-3 shadow-2xl">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-yellow-400">
                Change {title}
              </p>
              <select
                value={selectValue}
                onChange={(event) => onSelect(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm font-bold text-white outline-none focus:border-yellow-400/50"
              >
                <option value="">Select player</option>
                {players.map((player) => (
                  <option key={player.player_id} value={player.player_id}>
                    {playerLabel(player)}
                  </option>
                ))}
              </select>
            </div>
          </details>
        </div>
      </div>

      {/* Desktop keeps the familiar selector. Mobile hides it behind ⋯ */}
      <select
        value={selectValue}
        onChange={(event) => onSelect(event.target.value)}
        className="mt-2 hidden w-full min-w-0 rounded-lg border border-white/10 bg-[#0a0a0a] px-2 py-1.5 text-[11px] font-bold text-white md:block"
      >
        <option value="">Select player</option>
        {players.map((player) => (
          <option key={player.player_id} value={player.player_id}>
            {playerLabel(player)}
          </option>
        ))}
      </select>
    </div>
  );
}

function LivePlayerCard({ title, name, primary, secondary, active = false }: { title:string; name:string; primary:string; secondary:string; active?:boolean }) {
  return <div className={`rounded-2xl border p-4 ${active ? "border-yellow-400/40 bg-yellow-400/5" : "border-white/10 bg-black"}`}><p className="text-[10px] font-black uppercase tracking-wider text-white/35">{title}</p><p className="mt-2 truncate font-black">{name}</p><p className="mt-2 text-2xl font-black text-yellow-400">{primary}</p><p className="mt-1 text-xs text-white/45">{secondary}</p></div>;
}

function PenaltyExtrasGrid({
  title,
  prefix,
  onScore,
  disabled,
}: {
  title: string;
  prefix: string;
  onScore: (additionalRuns: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="mb-3 rounded-2xl border border-blue-400/10 bg-blue-950/10 p-3">
      <p className="mb-2 text-xs font-black uppercase tracking-wider text-blue-200">
        {title}
      </p>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {[0, 1, 2, 3, 4, 5, 6].map((additional) => (
          <button
            key={additional}
            disabled={disabled}
            onClick={() => onScore(additional)}
            className="min-h-[48px] rounded-xl border border-blue-400/20 bg-blue-950/20 px-2 text-sm font-black text-blue-100 active:scale-95 disabled:opacity-40"
          >
            {additional === 0 ? prefix : `${prefix}+${additional}`}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[11px] text-white/35">
        {prefix} includes the automatic 1-run penalty. {prefix}+1 = 2 total, {prefix}+2 = 3 total.
      </p>
    </div>
  );
}

function ExtrasGrid({ title, prefix, onScore, disabled }: { title:string; prefix:string; onScore:(total:number)=>void; disabled:boolean }) {
  return <div className="mb-3 rounded-2xl border border-blue-400/10 bg-blue-950/10 p-3"><p className="mb-2 text-xs font-black uppercase tracking-wider text-blue-200">{title}</p><div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{[1,2,3,4,5,6].map((v)=><button key={v} disabled={disabled} onClick={()=>onScore(v)} className="min-h-[48px] rounded-xl border border-blue-400/20 bg-blue-950/20 px-2 text-sm font-black text-blue-100 active:scale-95 disabled:opacity-40">{prefix}+{v}</button>)}</div></div>;
}

function PlayerSelect({
  label,
  value,
  onChange,
  players,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  players: MatchPlayer[];
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-white/40">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm font-bold text-white"
      >
        <option value="">Select player</option>

        {players.map((player) => (
          <option key={player.player_id} value={player.player_id}>
            {playerLabel(player)} — {player.player_id}
          </option>
        ))}
      </select>
    </label>
  );
}