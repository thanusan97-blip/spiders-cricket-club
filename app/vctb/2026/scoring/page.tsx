"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type PlayerRow = {
  player_id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
};

type AuctionSigningRow = {
  player_id: string;
  team: string;
  role: string | null;
};

type SquadPlayer = {
  player_id: string;
  name: string;
  role: string;
  photo_url: string | null;
};

type Fixture = {
  matchNumber: number;
  pitch: "Pitch 1" | "Pitch 2";
  startTime: string;
  teamA: string;
  teamB: string;
};

type FixtureMatch = {
  id: number;
  match_number: number;
  pitch: string;
  start_time: string | null;
  team_a: string;
  team_b: string;
  status: string;
  winner: string | null;
  result_text: string | null;
};


type StandingInnings = {
  id: number;
  match_id: number;
  innings_number: number;
  batting_team: string;
  bowling_team: string;
  total_runs: number;
  wickets: number;
  legal_balls: number;
  completed: boolean;
};

type StandingRow = {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  runsFor: number;
  ballsFor: number;
  runsAgainst: number;
  ballsAgainst: number;
  nrr: number;
};

const PLAYING_XI_SIZE = 11;

const fixtures: Fixture[] = [
  { matchNumber: 1, pitch: "Pitch 1", startTime: "08:30", teamA: "Thunnalai Royals", teamB: "Vallvai Blues SC UK" },
  { matchNumber: 2, pitch: "Pitch 2", startTime: "08:30", teamA: "Balmoral Fighters", teamB: "Niruvaththampai Knights" },
  { matchNumber: 3, pitch: "Pitch 1", startTime: "10:00", teamA: "Aathiyadi JL Super Kings", teamB: "Team Tiger" },
  { matchNumber: 4, pitch: "Pitch 2", startTime: "10:00", teamA: "Thunnalai Royals", teamB: "Niruvaththampai Knights" },
  { matchNumber: 5, pitch: "Pitch 1", startTime: "11:30", teamA: "Balmoral Fighters", teamB: "Vallvai Blues SC UK" },
  { matchNumber: 6, pitch: "Pitch 1", startTime: "13:00", teamA: "Balmoral Fighters", teamB: "Team Tiger" },
  { matchNumber: 7, pitch: "Pitch 2", startTime: "13:00", teamA: "Aathiyadi JL Super Kings", teamB: "Vallvai Blues SC UK" },
  { matchNumber: 8, pitch: "Pitch 1", startTime: "14:30", teamA: "Thunnalai Royals", teamB: "Team Tiger" },
  { matchNumber: 9, pitch: "Pitch 2", startTime: "14:30", teamA: "Aathiyadi JL Super Kings", teamB: "Niruvaththampai Knights" },
];

const retainedByTeam: Record<string, { player_id: string; role: string }[]> = {
  "Aathiyadi JL Super Kings": [
    { player_id: "VC 112", role: "All-Rounder" },
    { player_id: "VC 006", role: "All-Rounder" },
    { player_id: "VC 160", role: "All-Rounder" },
    { player_id: "VC 150", role: "Wicket Keeper" },
  ],
  "Balmoral Fighters": [
    { player_id: "VC 053", role: "All-Rounder" },
    { player_id: "VC 059", role: "All-Rounder" },
    { player_id: "VC 093", role: "All-Rounder" },
    { player_id: "VC 092", role: "Bowler" },
    { player_id: "VC 091", role: "All-Rounder" },
  ],
  "Niruvaththampai Knights": [
    { player_id: "VC 071", role: "All-Rounder" },
    { player_id: "VC 054", role: "All-Rounder" },
    { player_id: "VC 103", role: "All-Rounder" },
    { player_id: "VC 055", role: "All-Rounder" },
    { player_id: "VC 143", role: "All-Rounder" },
  ],
  "Team Tiger": [
    { player_id: "VC 175", role: "Wicket Keeper" },
    { player_id: "VC 080", role: "All-Rounder" },
    { player_id: "VC 068", role: "All-Rounder" },
    { player_id: "VC 049", role: "All-Rounder" },
    { player_id: "VC 104", role: "Batsman" },
  ],
  "Thunnalai Royals": [
    { player_id: "VC 022", role: "All-Rounder" },
    { player_id: "VC 154", role: "All-Rounder" },
    { player_id: "VC 033", role: "All-Rounder" },
    { player_id: "VC 025", role: "All-Rounder" },
    { player_id: "VC 036", role: "All-Rounder" },
  ],
  "Vallvai Blues SC UK": [
    { player_id: "VC 003", role: "All-Rounder" },
    { player_id: "VC 083", role: "All-Rounder" },
    { player_id: "VC 134", role: "All-Rounder" },
    { player_id: "VC 012", role: "Wicket Keeper" },
    { player_id: "VC 167", role: "All-Rounder" },
  ],
};

function displayTeamName(team: string) {
  return team === "Vallvai Blues SC UK" ? "Vallvai Kadalodikal" : team;
}

function fallbackPhoto(playerId: string) {
  return encodeURI(`/vctb-2026-players/${playerId}.jpeg`);
}

export default function VCTBScoringCentrePage() {
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


  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [teamASquad, setTeamASquad] = useState<SquadPlayer[]>([]);
  const [teamBSquad, setTeamBSquad] = useState<SquadPlayer[]>([]);
  const [teamAXI, setTeamAXI] = useState<string[]>([]);
  const [teamBXI, setTeamBXI] = useState<string[]>([]);

  const [teamACaptain, setTeamACaptain] = useState("");
  const [teamAWicketKeeper, setTeamAWicketKeeper] = useState("");
  const [teamBCaptain, setTeamBCaptain] = useState("");
  const [teamBWicketKeeper, setTeamBWicketKeeper] = useState("");

  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState<"bat" | "bowl" | "">("");
  const [strikerId, setStrikerId] = useState("");
  const [nonStrikerId, setNonStrikerId] = useState("");
  const [bowlerId, setBowlerId] = useState("");
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [startingMatch, setStartingMatch] = useState(false);
  const [message, setMessage] = useState("");
  const [fixtureMatches, setFixtureMatches] = useState<FixtureMatch[]>([]);
  const [standingInnings, setStandingInnings] = useState<StandingInnings[]>([]);
  const [restartTarget, setRestartTarget] = useState<{
    fixture: Fixture;
    match: FixtureMatch;
  } | null>(null);
  const [restarting, setRestarting] = useState(false);
  const [walkoverTarget, setWalkoverTarget] = useState<Fixture | null>(null);
  const [walkoverProcessing, setWalkoverProcessing] = useState(false);

  useEffect(() => {
    async function loadFixtureData() {
      const [
        { data: matchData, error: matchError },
        { data: inningsData, error: inningsError },
      ] = await Promise.all([
        supabase
          .from("matches")
          .select(
            "id, match_number, pitch, start_time, team_a, team_b, status, winner, result_text"
          )
          .order("id", { ascending: false }),
        supabase
          .from("innings")
          .select(
            "id, match_id, innings_number, batting_team, bowling_team, total_runs, wickets, legal_balls, completed"
          )
          .order("innings_number"),
      ]);

      if (matchError) {
        console.error(matchError);
        return;
      }

      if (inningsError) {
        console.error(inningsError);
        return;
      }

      const latestByFixture = new Map<string, FixtureMatch>();

      for (const row of (matchData || []) as FixtureMatch[]) {
        const key = `${row.match_number}-${row.pitch}`;

        if (!latestByFixture.has(key)) {
          latestByFixture.set(key, row);
        }
      }

      const latestMatches = Array.from(latestByFixture.values());
      const ids = new Set(latestMatches.map((row) => row.id));

      setFixtureMatches(latestMatches);
      setStandingInnings(
        ((inningsData || []) as StandingInnings[]).filter((row) =>
          ids.has(row.match_id)
        )
      );
    }

    loadFixtureData();

    const channel = supabase
      .channel("vctb-scoring-centre-qualification")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        loadFixtureData
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "innings" },
        loadFixtureData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const completedGroupMatches = fixtures
    .map((fixture) => {
      const match = fixtureMatches.find(
        (row) =>
          row.match_number === fixture.matchNumber &&
          row.pitch === fixture.pitch &&
          row.status === "completed"
      );

      if (!match) return null;

      const innings = standingInnings
        .filter((row) => row.match_id === match.id)
        .sort((a, b) => a.innings_number - b.innings_number);

      const isWalkover =
        match.result_text?.toLowerCase().includes("walkover") ?? false;

      if (!isWalkover && innings.length < 2) return null;

      return { fixture, match, innings };
    })
    .filter(Boolean) as {
      fixture: Fixture;
      match: FixtureMatch;
      innings: StandingInnings[];
    }[];

  function buildCommonStandings() {
    const table = new Map<string, StandingRow>();

    Object.keys(retainedByTeam).forEach((team) => {
      table.set(team, {
        team,
        played: 0,
        won: 0,
        lost: 0,
        tied: 0,
        points: 0,
        runsFor: 0,
        ballsFor: 0,
        runsAgainst: 0,
        ballsAgainst: 0,
        nrr: 0,
      });
    });

    for (const completed of completedGroupMatches) {
      const isWalkover =
        completed.match.result_text?.toLowerCase().includes("walkover") ?? false;

      if (isWalkover) {
        const winnerRow = table.get(completed.match.winner || "");
        const loserTeam =
          completed.match.winner === completed.match.team_a
            ? completed.match.team_b
            : completed.match.team_a;
        const loserRow = table.get(loserTeam);

        if (winnerRow) {
          winnerRow.played += 1;
          winnerRow.won += 1;
          winnerRow.points += 2;
        }

        if (loserRow) {
          loserRow.played += 1;
          loserRow.lost += 1;
        }

        continue;
      }

      const first = completed.innings.find(
        (row) => row.innings_number === 1
      );
      const second = completed.innings.find(
        (row) => row.innings_number === 2
      );

      if (!first || !second) continue;

      for (const team of [
        completed.match.team_a,
        completed.match.team_b,
      ]) {
        const row = table.get(team);
        if (!row) continue;

        const own =
          first.batting_team === team ? first : second;
        const opp =
          first.batting_team === team ? second : first;

        row.played += 1;
        row.runsFor += own.total_runs;
        row.runsAgainst += opp.total_runs;
        row.ballsFor +=
          own.wickets >= 10 ? 50 : own.legal_balls;
        row.ballsAgainst +=
          opp.wickets >= 10 ? 50 : opp.legal_balls;
      }

      const a = table.get(completed.match.team_a);
      const b = table.get(completed.match.team_b);

      const aInn =
        first.batting_team === completed.match.team_a
          ? first
          : second;
      const bInn =
        first.batting_team === completed.match.team_b
          ? first
          : second;

      if (aInn.total_runs === bInn.total_runs) {
        if (a) {
          a.tied += 1;
          a.points += 1;
        }
        if (b) {
          b.tied += 1;
          b.points += 1;
        }
      } else if (
        completed.match.winner === completed.match.team_a
      ) {
        if (a) {
          a.won += 1;
          a.points += 2;
        }
        if (b) b.lost += 1;
      } else if (
        completed.match.winner === completed.match.team_b
      ) {
        if (b) {
          b.won += 1;
          b.points += 2;
        }
        if (a) a.lost += 1;
      }
    }

    for (const row of table.values()) {
      const forRate =
        row.ballsFor > 0
          ? (row.runsFor / row.ballsFor) * 5
          : 0;
      const againstRate =
        row.ballsAgainst > 0
          ? (row.runsAgainst / row.ballsAgainst) * 5
          : 0;

      row.nrr = forRate - againstRate;
    }

    return Array.from(table.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.nrr !== a.nrr) return b.nrr - a.nrr;
      if (b.won !== a.won) return b.won - a.won;
      return displayTeamName(a.team).localeCompare(
        displayTeamName(b.team)
      );
    });
  }

  const commonStandings = buildCommonStandings();

  const groupStageComplete =
    completedGroupMatches.length === fixtures.length;

  const automaticSemiFinals: Fixture[] =
    groupStageComplete && commonStandings.length >= 4
      ? [
          {
            matchNumber: 10,
            pitch: "Pitch 1",
            startTime: "16:00",
            teamA: commonStandings[0].team,
            teamB: commonStandings[3].team,
          },
          {
            matchNumber: 11,
            pitch: "Pitch 2",
            startTime: "16:00",
            teamA: commonStandings[1].team,
            teamB: commonStandings[2].team,
          },
        ]
      : [];

  // Only use knockout rows created AFTER the current completed group stage.
  // This prevents an old test Semi-Final/Final from returning after Matches 1–9
  // are restarted.
  const currentGroupGenerationId = groupStageComplete
    ? Math.max(0, ...completedGroupMatches.map((row) => row.match.id))
    : 0;

  const expectedSemiFinal1 = automaticSemiFinals.find(
    (fixture) => fixture.matchNumber === 10
  );
  const expectedSemiFinal2 = automaticSemiFinals.find(
    (fixture) => fixture.matchNumber === 11
  );

  const semiFinal1Match =
    groupStageComplete && expectedSemiFinal1
      ? fixtureMatches
          .filter(
            (row) =>
              row.match_number === 10 &&
              row.pitch === "Pitch 1" &&
              row.id > currentGroupGenerationId &&
              row.team_a === expectedSemiFinal1.teamA &&
              row.team_b === expectedSemiFinal1.teamB
          )
          .sort((a, b) => b.id - a.id)[0]
      : undefined;

  const semiFinal2Match =
    groupStageComplete && expectedSemiFinal2
      ? fixtureMatches
          .filter(
            (row) =>
              row.match_number === 11 &&
              row.pitch === "Pitch 2" &&
              row.id > currentGroupGenerationId &&
              row.team_a === expectedSemiFinal2.teamA &&
              row.team_b === expectedSemiFinal2.teamB
          )
          .sort((a, b) => b.id - a.id)[0]
      : undefined;

  const automaticFinal: Fixture[] =
    groupStageComplete &&
    semiFinal1Match?.status === "completed" &&
    semiFinal2Match?.status === "completed" &&
    semiFinal1Match.winner &&
    semiFinal2Match.winner
      ? [
          {
            matchNumber: 12,
            pitch: "Pitch 1",
            startTime: "17:30",
            teamA: semiFinal1Match.winner,
            teamB: semiFinal2Match.winner,
          },
        ]
      : [];

  const availableFixtures = [
    ...fixtures,
    ...automaticSemiFinals,
    ...automaticFinal,
  ];

  function getFixtureMatch(fixture: Fixture) {
    const candidates = fixtureMatches
      .filter(
        (row) =>
          row.match_number === fixture.matchNumber &&
          row.pitch === fixture.pitch
      )
      .sort((a, b) => b.id - a.id);

    if (fixture.matchNumber === 10 || fixture.matchNumber === 11) {
      return candidates.find(
        (row) =>
          groupStageComplete &&
          row.id > currentGroupGenerationId &&
          row.team_a === fixture.teamA &&
          row.team_b === fixture.teamB
      );
    }

    if (fixture.matchNumber === 12) {
      const currentSemiGenerationId =
        semiFinal1Match && semiFinal2Match
          ? Math.max(semiFinal1Match.id, semiFinal2Match.id)
          : 0;

      return candidates.find(
        (row) =>
          currentSemiGenerationId > 0 &&
          row.id > currentSemiGenerationId &&
          row.team_a === fixture.teamA &&
          row.team_b === fixture.teamB
      );
    }

    return candidates[0];
  }

  const resumableMatches = fixtureMatches.filter(
    (row) => row.status === "live"
  );

  async function restartMatchSetup() {
    if (!restartTarget) return;

    setRestarting(true);
    setMessage("");

    try {
      const fixture = restartTarget.fixture;

      // Find EVERY database row ever created for this fixture.
      // This removes old test duplicates as well as the current match.
      const { data: fixtureRows, error: fixtureRowsError } = await supabase
        .from("matches")
        .select("id")
        .eq("match_number", fixture.matchNumber)
        .eq("pitch", fixture.pitch);

      if (fixtureRowsError) throw fixtureRowsError;

      const matchIds = (fixtureRows || []).map((row) => Number(row.id));

      if (matchIds.length > 0) {
        // Delete ALL ball-by-ball data first.
        const { error: deliveriesError } = await supabase
          .from("deliveries")
          .delete()
          .in("match_id", matchIds);

        if (deliveriesError) throw deliveriesError;

        // Delete ALL innings. Any batting/bowling statistics derived from
        // deliveries/innings will therefore reset automatically.
        const { error: inningsError } = await supabase
          .from("innings")
          .delete()
          .in("match_id", matchIds);

        if (inningsError) throw inningsError;

        // Delete selected XI, captain and wicket-keeper designations.
        const { error: matchPlayersError } = await supabase
          .from("match_players")
          .delete()
          .in("match_id", matchIds);

        if (matchPlayersError) throw matchPlayersError;

        // Finally remove ALL copies of the fixture itself, including any
        // completed result/winner stored in older test rows.
        const { error: matchesError } = await supabase
          .from("matches")
          .delete()
          .in("id", matchIds);

        if (matchesError) throw matchesError;

        for (const id of matchIds) {
          sessionStorage.removeItem(`vctb-scoring-${id}`);
        }
      }

      // Remove every cached copy of this fixture from the Scoring Centre.
      setFixtureMatches((current) =>
        current.filter(
          (row) =>
            !(
              row.match_number === fixture.matchNumber &&
              row.pitch === fixture.pitch
            )
        )
      );

      setRestartTarget(null);
      setRestarting(false);

      // Open a completely fresh Match Setup screen.
      await openFixture(fixture);
    } catch (error) {
      console.error(error);
      setMessage(
        "Could not restart the match. Please check Supabase delete permissions."
      );
      setRestarting(false);
    }
  }

  async function completeWalkover(
    fixture: Fixture,
    winningTeam: string
  ) {
    const losingTeam =
      winningTeam === fixture.teamA
        ? fixture.teamB
        : fixture.teamA;

    setWalkoverProcessing(true);
    setMessage("");

    try {
      const { data: oldRows, error: oldRowsError } = await supabase
        .from("matches")
        .select("id")
        .eq("match_number", fixture.matchNumber)
        .eq("pitch", fixture.pitch);

      if (oldRowsError) throw oldRowsError;

      const oldIds = (oldRows || []).map((row) => Number(row.id));

      if (oldIds.length > 0) {
        const { error: deliveriesError } = await supabase
          .from("deliveries")
          .delete()
          .in("match_id", oldIds);
        if (deliveriesError) throw deliveriesError;

        const { error: inningsError } = await supabase
          .from("innings")
          .delete()
          .in("match_id", oldIds);
        if (inningsError) throw inningsError;

        const { error: playersError } = await supabase
          .from("match_players")
          .delete()
          .in("match_id", oldIds);
        if (playersError) throw playersError;

        const { error: matchesError } = await supabase
          .from("matches")
          .delete()
          .in("id", oldIds);
        if (matchesError) throw matchesError;

        oldIds.forEach((id) =>
          sessionStorage.removeItem(`vctb-scoring-${id}`)
        );
      }

      const resultText = `${displayTeamName(winningTeam)} won by walkover`;

      const { data: inserted, error: insertError } = await supabase
        .from("matches")
        .insert({
          match_number: fixture.matchNumber,
          pitch: fixture.pitch,
          match_date: "2026-09-06",
          start_time: fixture.startTime,
          team_a: fixture.teamA,
          team_b: fixture.teamB,
          status: "completed",
          winner: winningTeam,
          result_text: resultText,
        })
        .select(
          "id, match_number, pitch, start_time, team_a, team_b, status, winner, result_text"
        )
        .single();

      if (insertError) throw insertError;

      setFixtureMatches((current) => [
        inserted as FixtureMatch,
        ...current.filter(
          (row) =>
            !(
              row.match_number === fixture.matchNumber &&
              row.pitch === fixture.pitch
            )
        ),
      ]);

      setStandingInnings((current) =>
        current.filter((row) => !oldIds.includes(row.match_id))
      );

      setWalkoverTarget(null);
      setMessage(
        `${resultText}. ${displayTeamName(winningTeam)} receives 2 points, ${displayTeamName(losingTeam)} receives 0 points, and NRR is unchanged.`
      );
    } catch (error) {
      console.error(error);
      setMessage(
        "Could not complete the walkover. Please check Supabase permissions."
      );
    } finally {
      setWalkoverProcessing(false);
    }
  }

  const battingTeam =
    tossWinner && tossDecision && selectedFixture
      ? tossDecision === "bat"
        ? tossWinner
        : selectedFixture.teamA === tossWinner
        ? selectedFixture.teamB
        : selectedFixture.teamA
      : "";

  const bowlingTeam =
    battingTeam && selectedFixture
      ? selectedFixture.teamA === battingTeam
        ? selectedFixture.teamB
        : selectedFixture.teamA
      : "";

  const battingXI =
    battingTeam && selectedFixture
      ? selectedFixture.teamA === battingTeam
        ? teamAXI
        : teamBXI
      : [];

  const bowlingXI =
    bowlingTeam && selectedFixture
      ? selectedFixture.teamA === bowlingTeam
        ? teamAXI
        : teamBXI
      : [];

  const battingSquad =
    battingTeam && selectedFixture
      ? selectedFixture.teamA === battingTeam
        ? teamASquad
        : teamBSquad
      : [];

  const bowlingSquad =
    bowlingTeam && selectedFixture
      ? selectedFixture.teamA === bowlingTeam
        ? teamASquad
        : teamBSquad
      : [];

  const openingBatters = battingSquad.filter((player) =>
    battingXI.includes(player.player_id)
  );

  const openingBowlers = bowlingSquad.filter((player) =>
    bowlingXI.includes(player.player_id)
  );

  const teamASelectedPlayers = teamASquad.filter((player) =>
    teamAXI.includes(player.player_id)
  );

  const teamBSelectedPlayers = teamBSquad.filter((player) =>
    teamBXI.includes(player.player_id)
  );

  async function loadTeamSquad(team: string): Promise<SquadPlayer[]> {
    const retained = retainedByTeam[team] || [];

    const { data: auctionRows, error: auctionError } = await supabase
      .from("auction_signings")
      .select("player_id, team, role")
      .eq("team", team);

    if (auctionError) throw auctionError;

    const auctionSignings = (auctionRows || []) as AuctionSigningRow[];

    const playerIds = [
      ...new Set([
        ...retained.map((player) => player.player_id),
        ...auctionSignings.map((player) => player.player_id),
      ]),
    ];

    if (playerIds.length === 0) return [];

    const { data: playerRows, error: playerError } = await supabase
      .from("players")
      .select("player_id, name, role, photo_url")
      .in("player_id", playerIds);

    if (playerError) throw playerError;

    const players = (playerRows || []) as PlayerRow[];
    const playerMap = new Map(players.map((player) => [player.player_id, player]));
    const retainedRoleMap = new Map(
      retained.map((player) => [player.player_id, player.role])
    );
    const auctionRoleMap = new Map(
      auctionSignings.map((player) => [player.player_id, player.role || "Player"])
    );

    return playerIds
      .map((playerId) => {
        const player = playerMap.get(playerId);
        if (!player) return null;

        return {
          player_id: player.player_id,
          name: player.name,
          role:
            retainedRoleMap.get(playerId) ||
            auctionRoleMap.get(playerId) ||
            player.role ||
            "Player",
          photo_url: player.photo_url,
        } satisfies SquadPlayer;
      })
      .filter((player): player is SquadPlayer => Boolean(player))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async function openFixture(fixture: Fixture) {
    setMessage("");
    setLoadingSetup(true);
    setSelectedFixture(fixture);
    setTeamAXI([]);
    setTeamBXI([]);
    setTeamACaptain("");
    setTeamAWicketKeeper("");
    setTeamBCaptain("");
    setTeamBWicketKeeper("");
    setTossWinner("");
    setTossDecision("");
    setStrikerId("");
    setNonStrikerId("");
    setBowlerId("");

    try {
      const [aSquad, bSquad] = await Promise.all([
        loadTeamSquad(fixture.teamA),
        loadTeamSquad(fixture.teamB),
      ]);

      setTeamASquad(aSquad);
      setTeamBSquad(bSquad);
    } catch (error) {
      console.error(error);
      setMessage("Could not load the squads. Please check Supabase access.");
    } finally {
      setLoadingSetup(false);
    }
  }

  function toggleXI(
    playerId: string,
    current: string[],
    setter: (value: string[]) => void
  ) {
    if (current.includes(playerId)) {
      setter(current.filter((id) => id !== playerId));

      if (current === teamAXI) {
        if (teamACaptain === playerId) setTeamACaptain("");
        if (teamAWicketKeeper === playerId) setTeamAWicketKeeper("");
      }

      if (current === teamBXI) {
        if (teamBCaptain === playerId) setTeamBCaptain("");
        if (teamBWicketKeeper === playerId) setTeamBWicketKeeper("");
      }

      return;
    }

    if (current.length >= PLAYING_XI_SIZE) {
      setMessage(`You can select a maximum of ${PLAYING_XI_SIZE} players.`);
      return;
    }

    setMessage("");
    setter([...current, playerId]);
  }

  async function startMatch() {
    if (!selectedFixture) return;

    setMessage("");

    if (teamAXI.length !== PLAYING_XI_SIZE || teamBXI.length !== PLAYING_XI_SIZE) {
      setMessage(`Select exactly ${PLAYING_XI_SIZE} players for both teams.`);
      return;
    }

    if (
      !teamACaptain ||
      !teamAWicketKeeper ||
      !teamBCaptain ||
      !teamBWicketKeeper
    ) {
      setMessage("Select a captain and wicket keeper for both teams.");
      return;
    }

    if (
      !teamAXI.includes(teamACaptain) ||
      !teamAXI.includes(teamAWicketKeeper) ||
      !teamBXI.includes(teamBCaptain) ||
      !teamBXI.includes(teamBWicketKeeper)
    ) {
      setMessage("Captain and wicket keeper must be selected in the Playing XI.");
      return;
    }

    if (!tossWinner || !tossDecision) {
      setMessage("Select the toss winner and whether they chose to bat or bowl.");
      return;
    }

    if (!strikerId || !nonStrikerId || !bowlerId) {
      setMessage("Select the striker, non-striker and opening bowler.");
      return;
    }

    if (strikerId === nonStrikerId) {
      setMessage("Striker and non-striker must be different players.");
      return;
    }

    setStartingMatch(true);

    try {
      // Prevent duplicate rows if this fixture already exists.
      const { data: existingRows, error: existingError } = await supabase
        .from("matches")
        .select("id, status, result_text")
        .eq("match_number", selectedFixture.matchNumber)
        .eq("pitch", selectedFixture.pitch)
        .order("id", { ascending: false })
        .limit(1);

      if (existingError) throw existingError;

      const existingMatch = existingRows?.[0];

      if (existingMatch?.status === "live") {
        window.location.href = `/vctb/2026/scoring/${existingMatch.id}`;
        return;
      }

      if (existingMatch?.status === "completed") {
        setMessage(
          existingMatch.result_text
            ? `This match is already completed: ${existingMatch.result_text}`
            : "This match is already completed."
        );
        setStartingMatch(false);
        return;
      }

      const { data: insertedMatch, error: insertMatchError } = await supabase
        .from("matches")
        .insert({
          match_number: selectedFixture.matchNumber,
          pitch: selectedFixture.pitch,
          match_date: "2026-09-06",
          start_time: selectedFixture.startTime,
          team_a: selectedFixture.teamA,
          team_b: selectedFixture.teamB,
          toss_winner: tossWinner,
          toss_decision: tossDecision,
          status: "live",
        })
        .select("id")
        .single();

      if (insertMatchError) throw insertMatchError;

      const matchId = Number(insertedMatch.id);

      const allMatchPlayers = [
        ...teamASquad
          .filter((player) => teamAXI.includes(player.player_id))
          .map((player) => ({
            match_id: matchId,
            team: selectedFixture.teamA,
            player_id: player.player_id,
            player_name: player.name,
            role: player.role,
            is_captain: player.player_id === teamACaptain,
            is_wicket_keeper: player.player_id === teamAWicketKeeper,
          })),
        ...teamBSquad
          .filter((player) => teamBXI.includes(player.player_id))
          .map((player) => ({
            match_id: matchId,
            team: selectedFixture.teamB,
            player_id: player.player_id,
            player_name: player.name,
            role: player.role,
            is_captain: player.player_id === teamBCaptain,
            is_wicket_keeper: player.player_id === teamBWicketKeeper,
          })),
      ];

      const { error: matchPlayersError } = await supabase
        .from("match_players")
        .insert(allMatchPlayers);

      if (matchPlayersError) throw matchPlayersError;

      const { data: inningsRow, error: inningsError } = await supabase
        .from("innings")
        .insert({
          match_id: matchId,
          innings_number: 1,
          batting_team: battingTeam,
          bowling_team: bowlingTeam,
          total_runs: 0,
          wickets: 0,
          legal_balls: 0,
          completed: false,
          striker_id: strikerId,
          non_striker_id: nonStrikerId,
          bowler_id: bowlerId,
        })
        .select("id")
        .single();

      if (inningsError) throw inningsError;

      sessionStorage.setItem(
        `vctb-scoring-${matchId}`,
        JSON.stringify({
          matchId,
          inningsId: inningsRow.id,
          strikerId,
          nonStrikerId,
          bowlerId,
          battingTeam,
          bowlingTeam,
        })
      );

      window.location.href = `/vctb/2026/scoring/${matchId}`;
    } catch (error) {
      console.error(error);
      setMessage(
        "Could not start the match. If Supabase shows an RLS/permission error, send me the exact error."
      );
      setStartingMatch(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-20 text-center text-white">
        <p className="font-black text-yellow-400">Checking scorer access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed bottom-3 right-3 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/90 p-1.5 shadow-xl">
        <span className="hidden max-w-[180px] truncate pl-2 text-[10px] font-bold text-white/40 sm:block">
          {scorerEmail}
        </span>
        <button
          onClick={signOutScorer}
          className="rounded-full border border-red-400/20 bg-red-950/30 px-3 py-2 text-[10px] font-black uppercase text-red-200"
        >
          Sign Out
        </button>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          <span>›</span>
          <Link href="/vctb/2026" className="hover:text-yellow-400">VCTB 2026</Link>
          <span>›</span>
          <span className="text-yellow-400">Scoring Centre</span>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-[#080808] to-red-950/20 p-6 shadow-2xl md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-yellow-400">
            VCTB Edition 3.0
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase md:text-6xl">
            Scoring Centre
          </h1>

          <p className="mt-4 max-w-3xl text-white/60">
            10 overs per innings • 5 legal balls per over • Win 2 points • Tie 1 point • Loss 0 points
          </p>
        </section>

        {resumableMatches.length > 0 && !selectedFixture && (
          <section className="mt-8">
            <div className="mb-4"><p className="text-xs font-black uppercase tracking-[0.3em] text-green-400">Live Matches</p><h2 className="mt-2 text-2xl font-black">Resume Scoring</h2></div>
            <div className="grid gap-4 md:grid-cols-2">
              {resumableMatches.map((m) => (
                <Link key={m.id} href={`/vctb/2026/scoring/${m.id}`} className="rounded-[22px] border border-green-400/25 bg-green-950/15 p-5 transition hover:border-green-400/60">
                  <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-black uppercase text-green-300">{m.pitch}</span><span className="text-xs font-black text-white/40">Match {m.match_number}</span></div>
                  <p className="mt-4 text-lg font-black">{displayTeamName(m.team_a)}</p><p className="my-1 text-xs font-black uppercase text-red-400">VS</p><p className="text-lg font-black">{displayTeamName(m.team_b)}</p>
                  <div className="mt-4 rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-black uppercase text-black">Resume Match Scoring →</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!selectedFixture ? (
          <section className="mt-10">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                Match Setup
              </p>
              <h2 className="mt-2 text-3xl font-black">Select a Match</h2>
            </div>

            {groupStageComplete && automaticSemiFinals.length === 2 && (
              <div className="mb-6 rounded-[24px] border border-green-400/25 bg-green-950/20 p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
                  ✓ Group Stage Complete
                </p>
                <p className="mt-2 font-black text-white">
                  Semi Final 1 and Semi Final 2 have been generated automatically from the final common points table.
                </p>
              </div>
            )}

            {automaticFinal.length === 1 && (
              <div className="mb-6 rounded-[24px] border border-yellow-400/30 bg-yellow-400/5 p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                  🏆 Grand Final Generated
                </p>
                <p className="mt-2 font-black text-white">
                  {displayTeamName(automaticFinal[0].teamA)} vs{" "}
                  {displayTeamName(automaticFinal[0].teamB)}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  Match 12 • Pitch 1 • 17:30
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {availableFixtures.map((fixture) => {
                const fixtureMatch = getFixtureMatch(fixture);
                const isLive = fixtureMatch?.status === "live";
                const isCompleted = fixtureMatch?.status === "completed";

                return (
                  <div
                    key={`${fixture.pitch}-${fixture.matchNumber}`}
                    className={`rounded-[24px] border p-5 text-left transition ${
                      isCompleted
                        ? "border-green-400/30 bg-green-950/10"
                        : isLive
                        ? "border-blue-400/30 bg-blue-950/10"
                        : "border-white/10 bg-[#0a0a0a]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                          isCompleted
                            ? "bg-green-400/10 text-green-300"
                            : isLive
                            ? "bg-blue-400/10 text-blue-300"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {fixture.pitch}
                      </span>

                      <span className="font-black text-yellow-400">
                        {fixture.startTime}
                      </span>
                    </div>

                    <p className="mt-5 text-xs font-black uppercase tracking-wider text-white/35">
                      Match {fixture.matchNumber}
                    </p>

                    <p className="mt-2 text-xl font-black">
                      {displayTeamName(fixture.teamA)}
                    </p>

                    <p className="my-2 text-xs font-black uppercase tracking-[0.25em] text-red-400">
                      VS
                    </p>

                    <p className="text-xl font-black">
                      {displayTeamName(fixture.teamB)}
                    </p>

                    {isCompleted && fixtureMatch ? (
                      <>
                        <div className="mt-5 rounded-xl border border-green-400/20 bg-green-950/30 p-4">
                          <p className="text-xs font-black uppercase tracking-wider text-green-300">
                            ✓ Match Completed
                          </p>

                          <p className="mt-2 font-black text-white">
                            {fixtureMatch.result_text || "Result recorded"}
                          </p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Link
                            href={`/vctb/2026/scoring/${fixtureMatch.id}`}
                            className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-black uppercase text-white"
                          >
                            View Match →
                          </Link>

                          <button
                            onClick={() =>
                              setRestartTarget({
                                fixture,
                                match: fixtureMatch,
                              })
                            }
                            className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-center text-sm font-black uppercase text-red-200"
                          >
                            Start Setup Again
                          </button>
                        </div>
                      </>
                    ) : isLive && fixtureMatch ? (
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link
                          href={`/vctb/2026/scoring/${fixtureMatch.id}`}
                          className="block rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-black uppercase text-black"
                        >
                          Resume Scoring →
                        </Link>

                        <button
                          onClick={() =>
                            setRestartTarget({
                              fixture,
                              match: fixtureMatch,
                            })
                          }
                          className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-center text-sm font-black uppercase text-red-200"
                        >
                          Start Setup Again
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openFixture(fixture)}
                          className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase text-black"
                        >
                          Set Up Match →
                        </button>

                        <button
                          onClick={() => setWalkoverTarget(fixture)}
                          className="rounded-xl border border-orange-400/30 bg-orange-950/30 px-4 py-3 text-center text-sm font-black uppercase text-orange-200"
                        >
                          Walkover
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="mt-10">
            <button
              onClick={() => setSelectedFixture(null)}
              className="mb-5 text-sm font-bold text-white/50 hover:text-yellow-400"
            >
              ← Back to matches
            </button>

            <div className="rounded-[28px] border border-white/10 bg-[#080808] p-5 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-yellow-400">
                    {selectedFixture.pitch} • {selectedFixture.startTime}
                  </p>

                  <h2 className="mt-2 text-2xl font-black md:text-4xl">
                    {displayTeamName(selectedFixture.teamA)}
                    <span className="mx-3 text-red-400">VS</span>
                    {displayTeamName(selectedFixture.teamB)}
                  </h2>
                </div>

                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-black text-white/50">
                  Match {selectedFixture.matchNumber}
                </span>
              </div>
            </div>

            {loadingSetup ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/50">
                Loading final squads...
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <SquadSelector
                    teamName={selectedFixture.teamA}
                    squad={teamASquad}
                    selected={teamAXI}
                    onToggle={(playerId) => toggleXI(playerId, teamAXI, setTeamAXI)}
                  />

                  <SquadSelector
                    teamName={selectedFixture.teamB}
                    squad={teamBSquad}
                    selected={teamBXI}
                    onToggle={(playerId) => toggleXI(playerId, teamBXI, setTeamBXI)}
                  />
                </div>

                <section className="mt-6 rounded-[28px] border border-blue-400/20 bg-blue-950/10 p-5 md:p-7">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
                    Team Leadership
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Captain & Wicket Keeper
                  </h3>

                  <p className="mt-2 text-sm text-white/50">
                    Choose from the selected Playing XI. The same player can be both captain and wicket keeper.
                  </p>

                  <div className="mt-6 grid gap-5 xl:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="mb-4 font-black text-yellow-400">
                        {displayTeamName(selectedFixture.teamA)}
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <PlayerSelect
                          label="Captain"
                          value={teamACaptain}
                          onChange={setTeamACaptain}
                          players={teamASelectedPlayers}
                        />

                        <PlayerSelect
                          label="Wicket Keeper"
                          value={teamAWicketKeeper}
                          onChange={setTeamAWicketKeeper}
                          players={teamASelectedPlayers}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="mb-4 font-black text-yellow-400">
                        {displayTeamName(selectedFixture.teamB)}
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <PlayerSelect
                          label="Captain"
                          value={teamBCaptain}
                          onChange={setTeamBCaptain}
                          players={teamBSelectedPlayers}
                        />

                        <PlayerSelect
                          label="Wicket Keeper"
                          value={teamBWicketKeeper}
                          onChange={setTeamBWicketKeeper}
                          players={teamBSelectedPlayers}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-6 rounded-[28px] border border-yellow-400/20 bg-yellow-400/5 p-5 md:p-7">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                    Toss
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm font-black text-white/60">
                        Toss winner
                      </span>

                      <select
                        value={tossWinner}
                        onChange={(event) => {
                          setTossWinner(event.target.value);
                          setStrikerId("");
                          setNonStrikerId("");
                          setBowlerId("");
                        }}
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white"
                      >
                        <option value="">Select team</option>
                        <option value={selectedFixture.teamA}>
                          {displayTeamName(selectedFixture.teamA)}
                        </option>
                        <option value={selectedFixture.teamB}>
                          {displayTeamName(selectedFixture.teamB)}
                        </option>
                      </select>
                    </label>

                    <div>
                      <span className="mb-2 block text-sm font-black text-white/60">
                        Decision
                      </span>

                      <div className="grid grid-cols-2 gap-3">
                        {(["bat", "bowl"] as const).map((decision) => (
                          <button
                            key={decision}
                            onClick={() => {
                              setTossDecision(decision);
                              setStrikerId("");
                              setNonStrikerId("");
                              setBowlerId("");
                            }}
                            className={`rounded-xl border px-4 py-4 font-black uppercase ${
                              tossDecision === decision
                                ? "border-yellow-400 bg-yellow-400 text-black"
                                : "border-white/10 bg-black text-white"
                            }`}
                          >
                            {decision}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {battingTeam && bowlingTeam && (
                  <section className="mt-6 rounded-[28px] border border-red-400/20 bg-red-950/10 p-5 md:p-7">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
                      Opening Players
                    </p>

                    <p className="mt-3 text-sm text-white/50">
                      Batting first:{" "}
                      <span className="font-black text-white">
                        {displayTeamName(battingTeam)}
                      </span>
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <PlayerSelect
                        label="Striker"
                        value={strikerId}
                        onChange={setStrikerId}
                        players={openingBatters}
                      />

                      <PlayerSelect
                        label="Non-Striker"
                        value={nonStrikerId}
                        onChange={setNonStrikerId}
                        players={openingBatters}
                      />

                      <PlayerSelect
                        label="Opening Bowler"
                        value={bowlerId}
                        onChange={setBowlerId}
                        players={openingBowlers}
                      />
                    </div>
                  </section>
                )}

                {message && (
                  <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-sm font-bold text-red-200">
                    {message}
                  </div>
                )}

                <button
                  onClick={startMatch}
                  disabled={startingMatch}
                  className="mt-6 w-full rounded-2xl bg-red-600 px-5 py-5 text-lg font-black uppercase text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {startingMatch ? "Starting Match..." : "🏏 Start Match"}
                </button>
              </>
            )}
          </section>
        )}
        {walkoverTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-lg rounded-[28px] border border-orange-400/30 bg-[#0a0a0a] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">
              Complete by Walkover
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Which team receives the walkover?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Winner: 2 points • Loser: 0 points • NRR unchanged.
              For a Semi-Final or Final, the selected winner advances automatically.
            </p>

            <div className="mt-6 space-y-3">
              <button
                disabled={walkoverProcessing}
                onClick={() =>
                  completeWalkover(walkoverTarget, walkoverTarget.teamA)
                }
                className="w-full rounded-2xl bg-yellow-400 px-5 py-4 text-left font-black text-black disabled:opacity-50"
              >
                {displayTeamName(walkoverTarget.teamA)}
              </button>

              <button
                disabled={walkoverProcessing}
                onClick={() =>
                  completeWalkover(walkoverTarget, walkoverTarget.teamB)
                }
                className="w-full rounded-2xl bg-yellow-400 px-5 py-4 text-left font-black text-black disabled:opacity-50"
              >
                {displayTeamName(walkoverTarget.teamB)}
              </button>

              <button
                disabled={walkoverProcessing}
                onClick={() => setWalkoverTarget(null)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-black text-white"
              >
                Cancel
              </button>
            </div>

            {walkoverProcessing && (
              <p className="mt-4 text-center text-sm font-bold text-orange-200">
                Recording walkover...
              </p>
            )}
          </div>
        </div>
      )}

      {restartTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md rounded-[24px] border border-red-500/30 bg-[#0a0a0a] p-6 shadow-2xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
                Restart Match Setup
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Are you sure you want to restart this match?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/60">
                This will permanently delete ALL saved records for this fixture,
                including any older test copies, innings, deliveries, selected
                match players, winner and result. Batting and bowling statistics
                calculated from this match will also reset. You will then return
                to Match Setup and start the fixture again from zero.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  disabled={restarting}
                  onClick={() => setRestartTarget(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 font-black uppercase text-white disabled:opacity-40"
                >
                  No
                </button>

                <button
                  disabled={restarting}
                  onClick={restartMatchSetup}
                  className="rounded-xl bg-red-600 px-4 py-4 font-black uppercase text-white disabled:opacity-40"
                >
                  {restarting ? "Deleting..." : "Yes, Restart"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

function SquadSelector({
  teamName,
  squad,
  selected,
  onToggle,
}: {
  teamName: string;
  squad: SquadPlayer[];
  selected: string[];
  onToggle: (playerId: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#080808]">
      <div className="border-b border-white/10 bg-white/5 p-5">
        <p className="text-xs font-black uppercase tracking-wider text-yellow-400">
          Playing XI
        </p>

        <h3 className="mt-2 text-2xl font-black">
          {displayTeamName(teamName)}
        </h3>

        <p className="mt-2 text-sm font-bold text-white/40">
          {selected.length}/{PLAYING_XI_SIZE} selected
        </p>
      </div>

      <div className="max-h-[620px] space-y-2 overflow-y-auto p-4">
        {squad.map((player) => {
          const checked = selected.includes(player.player_id);

          return (
            <button
              type="button"
              key={player.player_id}
              onClick={() => onToggle(player.player_id)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                checked
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/10 bg-black"
              }`}
            >
              <img
                src={player.photo_url || fallbackPhoto(player.player_id)}
                alt={player.name}
                className="h-12 w-12 rounded-full border border-white/20 object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{player.name}</p>

                <p className="mt-1 text-xs text-white/45">
                  {player.player_id} • {player.role}
                </p>
              </div>

              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-black ${
                  checked
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : "border-white/20 text-transparent"
                }`}
              >
                ✓
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
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
  players: SquadPlayer[];
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-black text-white/60">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 font-bold text-white"
      >
        <option value="">Select player</option>

        {players.map((player) => (
          <option key={player.player_id} value={player.player_id}>
            {player.name} — {player.player_id}
          </option>
        ))}
      </select>
    </label>
  );
}