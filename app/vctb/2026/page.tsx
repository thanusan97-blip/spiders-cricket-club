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


type PublicMatch = {
  id: number;
  match_number: number;
  pitch: string;
  match_date: string;
  start_time: string | null;
  team_a: string;
  team_b: string;
  status: string;
  winner: string | null;
  result_text: string | null;
};

type PublicInnings = {
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


type MatchPlayerStatRow = {
  match_id: number;
  team: string;
  player_id: string;
  player_name: string;
};

type DeliveryStatRow = {
  id: number;
  match_id: number;
  innings_id: number;
  striker_id: string;
  bowler_id: string;
  runs_batter: number;
  extras: number;
  extra_type: string | null;
  wicket: boolean;
  wicket_type: string | null;
  dismissed_player_id: string | null;
  is_legal_ball: boolean;
};

type TournamentLeader = {
  playerId: string;
  playerName: string;
  team: string;
  value: string;
  secondary?: string;
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
  matchNumber?: number;
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
  { matchNumber: 1, time: "8:30 AM", pitch: "Pitch 1", teamA: "Thunnalai Royals", teamB: "Vallvai Blues SC UK", kind: "match" },
  { matchNumber: 2, time: "8:30 AM", pitch: "Pitch 2", teamA: "Balmoral Fighters", teamB: "Niruvaththampai Knights", kind: "match" },
  { matchNumber: 3, time: "10:00 AM", pitch: "Pitch 1", teamA: "Aathiyadi JL Super Kings", teamB: "Team Tiger", kind: "match" },
  { matchNumber: 4, time: "10:00 AM", pitch: "Pitch 2", teamA: "Thunnalai Royals", teamB: "Niruvaththampai Knights", kind: "match" },
  { matchNumber: 5, time: "11:30 AM", pitch: "Pitch 1", teamA: "Balmoral Fighters", teamB: "Vallvai Blues SC UK", kind: "match" },
  { matchNumber: 6, time: "1:00 PM", pitch: "Pitch 1", teamA: "Balmoral Fighters", teamB: "Team Tiger", kind: "match" },
  { matchNumber: 7, time: "1:00 PM", pitch: "Pitch 2", teamA: "Aathiyadi JL Super Kings", teamB: "Vallvai Blues SC UK", kind: "match" },
  { matchNumber: 8, time: "2:30 PM", pitch: "Pitch 1", teamA: "Thunnalai Royals", teamB: "Team Tiger", kind: "match" },
  { matchNumber: 9, time: "2:30 PM", pitch: "Pitch 2", teamA: "Aathiyadi JL Super Kings", teamB: "Niruvaththampai Knights", kind: "match" },
  { matchNumber: 10, time: "4:00 PM", pitch: "Pitch 1", label: "Semi Final 1 — 1st of Group A vs 2nd of Group A", kind: "semi" },
  { matchNumber: 11, time: "4:00 PM", pitch: "Pitch 2", label: "Semi Final 2 — 1st of Group B vs 2nd of Group B", kind: "semi" },
  { matchNumber: 12, time: "5:30 PM", pitch: "Pitch 1", label: "VCTB Grand Final", kind: "final" },
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

  const [publicMatches, setPublicMatches] = useState<PublicMatch[]>([]);
  const [publicInnings, setPublicInnings] = useState<PublicInnings[]>([]);
  const [loadingLiveMatches, setLoadingLiveMatches] = useState(true);
  const [statMatchPlayers, setStatMatchPlayers] = useState<MatchPlayerStatRow[]>([]);
  const [statDeliveries, setStatDeliveries] = useState<DeliveryStatRow[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

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
  // PUBLIC LIVE MATCH DATA
  // =====================================================

  const loadPublicMatchData = useCallback(async () => {
    setLoadingLiveMatches(true);

    const [
      { data: matchData, error: matchError },
      { data: inningsData, error: inningsError },
    ] = await Promise.all([
      supabase
        .from("matches")
        .select(
          "id, match_number, pitch, match_date, start_time, team_a, team_b, status, winner, result_text"
        )
        .order("id", { ascending: false }),

      supabase
        .from("innings")
        .select(
          "id, match_id, innings_number, batting_team, bowling_team, total_runs, wickets, legal_balls, completed, striker_id, non_striker_id, bowler_id"
        )
        .order("innings_number", { ascending: true }),
    ]);

    if (matchError) {
      console.error("Live matches error:", matchError);
      setLoadingLiveMatches(false);
      return;
    }

    if (inningsError) {
      console.error("Live innings error:", inningsError);
      setLoadingLiveMatches(false);
      return;
    }

    // During testing, more than one DB row may exist for the same fixture.
    // Keep only the newest row for each Match Number + Pitch.
    const latestByFixture = new Map<string, PublicMatch>();

    for (const match of (matchData || []) as PublicMatch[]) {
      const key = `${match.match_number}-${match.pitch}`;

      if (!latestByFixture.has(key)) {
        latestByFixture.set(key, match);
      }
    }

    const latestMatches = Array.from(latestByFixture.values());
    const latestMatchIds = new Set(latestMatches.map((match) => match.id));

    setPublicMatches(latestMatches);
    setPublicInnings(
      ((inningsData || []) as PublicInnings[]).filter((inningsRow) =>
        latestMatchIds.has(inningsRow.match_id)
      )
    );

    setLoadingLiveMatches(false);
  }, [supabase]);

  useEffect(() => {
    loadPublicMatchData();

    const channel = supabase
      .channel("vctb-2026-public-live-home")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
        },
        () => {
          loadPublicMatchData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "innings",
        },
        () => {
          loadPublicMatchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, loadPublicMatchData]);

  const loadTournamentStatsData = useCallback(async () => {
    setLoadingStats(true);

    const [
      { data: matchPlayerData, error: matchPlayerError },
      { data: deliveryData, error: deliveryError },
    ] = await Promise.all([
      supabase
        .from("match_players")
        .select("match_id, team, player_id, player_name"),
      supabase
        .from("deliveries")
        .select(
          "id, match_id, innings_id, striker_id, bowler_id, runs_batter, extras, extra_type, wicket, wicket_type, dismissed_player_id, is_legal_ball"
        )
        .order("id"),
    ]);

    if (matchPlayerError) {
      console.error("Tournament match-player stats error:", matchPlayerError);
      setLoadingStats(false);
      return;
    }

    if (deliveryError) {
      console.error("Tournament delivery stats error:", deliveryError);
      setLoadingStats(false);
      return;
    }

    setStatMatchPlayers((matchPlayerData || []) as MatchPlayerStatRow[]);
    setStatDeliveries((deliveryData || []) as DeliveryStatRow[]);
    setLoadingStats(false);
  }, [supabase]);

  useEffect(() => {
    loadTournamentStatsData();

    const statsChannel = supabase
      .channel("vctb-2026-tournament-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deliveries",
        },
        () => {
          loadTournamentStatsData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_players",
        },
        () => {
          loadTournamentStatsData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statsChannel);
    };
  }, [supabase, loadTournamentStatsData]);

  function oversFromLegalBalls(legalBalls: number) {
    return `${Math.floor(legalBalls / 5)}.${legalBalls % 5}`;
  }

  function getLiveMatchInnings(matchId: number) {
    return publicInnings
      .filter((inningsRow) => inningsRow.match_id === matchId)
      .sort((a, b) => a.innings_number - b.innings_number);
  }

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

  const liveMatches = publicMatches
    .filter((match) => match.status === "live")
    .sort((a, b) => {
      if (a.pitch !== b.pitch) {
        return a.pitch.localeCompare(b.pitch);
      }

      return a.match_number - b.match_number;
    });

  // Match a scheduled fixture to its newest database match row.
  function getFixtureDatabaseMatch(fixture: Fixture) {
    if (!fixture.matchNumber) {
      return undefined;
    }

    return publicMatches
      .filter(
        (match) =>
          match.match_number === fixture.matchNumber &&
          match.pitch === fixture.pitch
      )
      .sort((a, b) => b.id - a.id)[0];
  }

  // Never show a live or completed fixture in the "Up Next" area.
  const upcomingFixtures = fixtures
    .filter((fixture) => fixture.kind === "match")
    .filter((fixture) => {
      const databaseMatch = getFixtureDatabaseMatch(fixture);

      if (!databaseMatch) return true;

      return (
        databaseMatch.status !== "live" &&
        databaseMatch.status !== "completed"
      );
    });

  // Show the next available fixture on each pitch.
  const nextPitch1Fixture = upcomingFixtures.find(
    (fixture) => fixture.pitch === "Pitch 1"
  );
  const nextPitch2Fixture = upcomingFixtures.find(
    (fixture) => fixture.pitch === "Pitch 2"
  );

  const upNextFixtures = [
    nextPitch1Fixture,
    nextPitch2Fixture,
  ].filter((fixture): fixture is Fixture => Boolean(fixture));

  // =====================================================
  // AUTOMATIC GROUP POINTS TABLE
  // =====================================================

  const groupStageFixtures = fixtures.filter(
    (fixture) => fixture.kind === "match"
  );

  const completedGroupMatches = groupStageFixtures
    .map((fixture) => {
      const databaseMatch = getFixtureDatabaseMatch(fixture);

      if (!databaseMatch || databaseMatch.status !== "completed") {
        return null;
      }

      const matchInnings = publicInnings
        .filter((inningsRow) => inningsRow.match_id === databaseMatch.id)
        .sort((a, b) => a.innings_number - b.innings_number);

      const isWalkover =
        databaseMatch.result_text?.toLowerCase().includes("walkover") ?? false;

      if (!isWalkover && matchInnings.length < 2) {
        return null;
      }

      return {
        fixture,
        match: databaseMatch,
        innings: matchInnings,
      };
    })
    .filter(
      (
        row
      ): row is {
        fixture: Fixture;
        match: PublicMatch;
        innings: PublicInnings[];
      } => Boolean(row)
    );

  function buildStandings(group: "A" | "B") {
    const groupTeams = teams
      .filter((team) => teamMeta[team.name].group === group)
      .map((team) => team.name);

    const table = new Map<string, StandingRow>();

    for (const teamName of groupTeams) {
      table.set(teamName, {
        team: teamName,
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
    }

    for (const completed of completedGroupMatches) {
      const { match, innings: matchInnings } = completed;

      const isWalkover =
        match.result_text?.toLowerCase().includes("walkover") ?? false;

      if (isWalkover) {
        const winnerRow = table.get(match.winner || "");
        const loserTeam =
          match.winner === match.team_a
            ? match.team_b
            : match.team_a;
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

      const firstInnings = matchInnings.find(
        (inningsRow) => inningsRow.innings_number === 1
      );
      const secondInnings = matchInnings.find(
        (inningsRow) => inningsRow.innings_number === 2
      );

      if (!firstInnings || !secondInnings) continue;

      const teamsInMatch = [match.team_a, match.team_b];

      for (const teamName of teamsInMatch) {
        const row = table.get(teamName);

        if (!row) continue;

        row.played += 1;

        const ownInnings =
          firstInnings.batting_team === teamName
            ? firstInnings
            : secondInnings;

        const oppositionInnings =
          firstInnings.batting_team === teamName
            ? secondInnings
            : firstInnings;

        row.runsFor += ownInnings.total_runs;
        row.runsAgainst += oppositionInnings.total_runs;

        // Standard NRR treatment:
        // if a side is all out, count the full 10-over allocation.
        // Otherwise use the actual number of legal balls faced.
        row.ballsFor +=
          ownInnings.wickets >= 10
            ? 10 * 5
            : ownInnings.legal_balls;

        row.ballsAgainst +=
          oppositionInnings.wickets >= 10
            ? 10 * 5
            : oppositionInnings.legal_balls;
      }

      const teamARow = table.get(match.team_a);
      const teamBRow = table.get(match.team_b);

      if (!teamARow && !teamBRow) {
        continue;
      }

      const teamAInnings =
        firstInnings.batting_team === match.team_a
          ? firstInnings
          : secondInnings;

      const teamBInnings =
        firstInnings.batting_team === match.team_b
          ? firstInnings
          : secondInnings;

      const isTie =
        teamAInnings.total_runs === teamBInnings.total_runs;

      if (isTie) {
        if (teamARow) {
          teamARow.tied += 1;
          teamARow.points += 1;
        }

        if (teamBRow) {
          teamBRow.tied += 1;
          teamBRow.points += 1;
        }
      } else {
        const winner = match.winner;

        if (winner === match.team_a) {
          if (teamARow) {
            teamARow.won += 1;
            teamARow.points += 2;
          }

          if (teamBRow) {
            teamBRow.lost += 1;
          }
        } else if (winner === match.team_b) {
          if (teamBRow) {
            teamBRow.won += 1;
            teamBRow.points += 2;
          }

          if (teamARow) {
            teamARow.lost += 1;
          }
        } else {
          // Safety fallback if winner text is absent but scores differ.
          if (teamAInnings.total_runs > teamBInnings.total_runs) {
            if (teamARow) {
              teamARow.won += 1;
              teamARow.points += 2;
            }

            if (teamBRow) {
              teamBRow.lost += 1;
            }
          } else {
            if (teamBRow) {
              teamBRow.won += 1;
              teamBRow.points += 2;
            }

            if (teamARow) {
              teamARow.lost += 1;
            }
          }
        }
      }
    }

    for (const row of table.values()) {
      const runRateFor =
        row.ballsFor > 0
          ? (row.runsFor / row.ballsFor) * 5
          : 0;

      const runRateAgainst =
        row.ballsAgainst > 0
          ? (row.runsAgainst / row.ballsAgainst) * 5
          : 0;

      row.nrr = runRateFor - runRateAgainst;
    }

    return Array.from(table.values()).sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      if (b.nrr !== a.nrr) {
        return b.nrr - a.nrr;
      }

      if (b.won !== a.won) {
        return b.won - a.won;
      }

      return getDisplayTeamName(a.team).localeCompare(
        getDisplayTeamName(b.team)
      );
    });
  }

  const groupAStandings = buildStandings("A");
  const groupBStandings = buildStandings("B");

  const allGroupMatchesCompleted =
    completedGroupMatches.length === groupStageFixtures.length;

  const semiFinal1Teams =
    allGroupMatchesCompleted &&
    groupAStandings.length >= 2
      ? {
          teamA: groupAStandings[0].team,
          teamB: groupAStandings[1].team,
        }
      : null;

  const semiFinal2Teams =
    allGroupMatchesCompleted &&
    groupBStandings.length >= 2
      ? {
          teamA: groupBStandings[0].team,
          teamB: groupBStandings[1].team,
        }
      : null;

  // A knockout match only belongs to the CURRENT tournament run if it was
  // created after the current group-stage match rows. This prevents old test
  // Semi-Finals/Finals from reappearing after the group stage is restarted.
  const currentGroupGenerationId = allGroupMatchesCompleted
    ? Math.max(0, ...completedGroupMatches.map((row) => row.match.id))
    : 0;

  const semiFinal1Match =
    allGroupMatchesCompleted && semiFinal1Teams
      ? publicMatches
          .filter(
            (match) =>
              match.match_number === 10 &&
              match.pitch === "Pitch 1" &&
              match.id > currentGroupGenerationId &&
              match.team_a === semiFinal1Teams.teamA &&
              match.team_b === semiFinal1Teams.teamB
          )
          .sort((a, b) => b.id - a.id)[0]
      : undefined;

  const semiFinal2Match =
    allGroupMatchesCompleted && semiFinal2Teams
      ? publicMatches
          .filter(
            (match) =>
              match.match_number === 11 &&
              match.pitch === "Pitch 2" &&
              match.id > currentGroupGenerationId &&
              match.team_a === semiFinal2Teams.teamA &&
              match.team_b === semiFinal2Teams.teamB
          )
          .sort((a, b) => b.id - a.id)[0]
      : undefined;

  const bothSemiFinalsCompleted =
    allGroupMatchesCompleted &&
    semiFinal1Match?.status === "completed" &&
    semiFinal2Match?.status === "completed" &&
    Boolean(semiFinal1Match.winner) &&
    Boolean(semiFinal2Match.winner);

  const grandFinalTeams = bothSemiFinalsCompleted
    ? {
        teamA: semiFinal1Match!.winner!,
        teamB: semiFinal2Match!.winner!,
      }
    : null;

  const currentSemiGenerationId =
    semiFinal1Match && semiFinal2Match
      ? Math.max(semiFinal1Match.id, semiFinal2Match.id)
      : 0;

  const grandFinalMatch = grandFinalTeams
    ? publicMatches
        .filter(
          (match) =>
            match.match_number === 12 &&
            match.pitch === "Pitch 1" &&
            match.id > currentSemiGenerationId &&
            match.team_a === grandFinalTeams.teamA &&
            match.team_b === grandFinalTeams.teamB
        )
        .sort((a, b) => b.id - a.id)[0]
    : undefined;

  const tournamentChampion =
    grandFinalMatch?.status === "completed"
      ? grandFinalMatch.winner
      : null;

  const resolvedFixtures: Fixture[] = fixtures.map((fixture) => {
    if (fixture.kind === "semi" && fixture.pitch === "Pitch 1") {
      return semiFinal1Teams
        ? {
            ...fixture,
            teamA: semiFinal1Teams.teamA,
            teamB: semiFinal1Teams.teamB,
            label: "Semi Final 1",
          }
        : fixture;
    }

    if (fixture.kind === "semi" && fixture.pitch === "Pitch 2") {
      return semiFinal2Teams
        ? {
            ...fixture,
            teamA: semiFinal2Teams.teamA,
            teamB: semiFinal2Teams.teamB,
            label: "Semi Final 2",
          }
        : fixture;
    }

    if (fixture.kind === "final") {
      return grandFinalTeams
        ? {
            ...fixture,
            teamA: grandFinalTeams.teamA,
            teamB: grandFinalTeams.teamB,
            label: "VCTB Grand Final",
          }
        : fixture;
    }

    return fixture;
  });

  const resolvedPitch1Fixtures = resolvedFixtures.filter(
    (fixture) => fixture.pitch === "Pitch 1"
  );

  const resolvedPitch2Fixtures = resolvedFixtures.filter(
    (fixture) => fixture.pitch === "Pitch 2"
  );

  // =====================================================
  // AUTOMATIC TOURNAMENT STATISTICS
  // =====================================================

  const completedGroupMatchIds = new Set(
    completedGroupMatches.map((row) => row.match.id)
  );

  const completedDeliveries = statDeliveries.filter((delivery) =>
    completedGroupMatchIds.has(delivery.match_id)
  );

  const playerLookup = new Map<
    string,
    { playerId: string; playerName: string; team: string }
  >();

  for (const row of statMatchPlayers) {
    if (!completedGroupMatchIds.has(row.match_id)) continue;

    const key = `${row.match_id}-${row.player_id}`;

    playerLookup.set(key, {
      playerId: row.player_id,
      playerName: row.player_name,
      team: row.team,
    });
  }

  function findPlayerForMatch(matchId: number, playerId: string) {
    return playerLookup.get(`${matchId}-${playerId}`);
  }

  const battingTotals = new Map<
    string,
    {
      playerId: string;
      playerName: string;
      team: string;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
    }
  >();

  for (const delivery of completedDeliveries) {
    const player = findPlayerForMatch(
      delivery.match_id,
      delivery.striker_id
    );

    if (!player) continue;

    const key = `${player.team}-${player.playerId}`;

    const row =
      battingTotals.get(key) || {
        ...player,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
      };

    row.runs += Number(delivery.runs_batter || 0);

    if (delivery.is_legal_ball && delivery.extra_type !== "wide") {
      row.balls += 1;
    }

    if (delivery.runs_batter === 4) row.fours += 1;
    if (delivery.runs_batter === 6) row.sixes += 1;

    battingTotals.set(key, row);
  }

  const battingRows = Array.from(battingTotals.values());

  const topRunScorer = [...battingRows].sort((a, b) => {
    if (b.runs !== a.runs) return b.runs - a.runs;
    if (b.sixes !== a.sixes) return b.sixes - a.sixes;
    return a.playerName.localeCompare(b.playerName);
  })[0];

  const mostSixes = [...battingRows].sort((a, b) => {
    if (b.sixes !== a.sixes) return b.sixes - a.sixes;
    if (b.runs !== a.runs) return b.runs - a.runs;
    return a.playerName.localeCompare(b.playerName);
  })[0];

  // Highest individual innings score
  const inningsBatting = new Map<
    string,
    {
      playerId: string;
      playerName: string;
      team: string;
      inningsId: number;
      runs: number;
      balls: number;
    }
  >();

  for (const delivery of completedDeliveries) {
    const player = findPlayerForMatch(
      delivery.match_id,
      delivery.striker_id
    );

    if (!player) continue;

    const key = `${delivery.innings_id}-${player.playerId}`;

    const row =
      inningsBatting.get(key) || {
        ...player,
        inningsId: delivery.innings_id,
        runs: 0,
        balls: 0,
      };

    row.runs += Number(delivery.runs_batter || 0);

    if (delivery.is_legal_ball && delivery.extra_type !== "wide") {
      row.balls += 1;
    }

    inningsBatting.set(key, row);
  }

  const highestScore = Array.from(inningsBatting.values()).sort(
    (a, b) => {
      if (b.runs !== a.runs) return b.runs - a.runs;
      if (a.balls !== b.balls) return a.balls - b.balls;
      return a.playerName.localeCompare(b.playerName);
    }
  )[0];

  // Bowling aggregates
  const bowlingTotals = new Map<
    string,
    {
      playerId: string;
      playerName: string;
      team: string;
      wickets: number;
      runs: number;
      legalBalls: number;
    }
  >();

  const inningsBowling = new Map<
    string,
    {
      playerId: string;
      playerName: string;
      team: string;
      inningsId: number;
      wickets: number;
      runs: number;
      legalBalls: number;
    }
  >();

  function chargedBowlerRuns(delivery: DeliveryStatRow) {
    const kind = delivery.extra_type || "";

    if (kind === "bye" || kind === "leg_bye") {
      return Number(delivery.runs_batter || 0);
    }

    if (
      kind === "no_ball_bye" ||
      kind === "no_ball_leg_bye"
    ) {
      return Number(delivery.runs_batter || 0) + 1;
    }

    return (
      Number(delivery.runs_batter || 0) +
      Number(delivery.extras || 0)
    );
  }

  function isBowlerWicket(delivery: DeliveryStatRow) {
    return (
      delivery.wicket &&
      !["Run Out", "Retired Out"].includes(
        delivery.wicket_type || ""
      )
    );
  }

  for (const delivery of completedDeliveries) {
    const player = findPlayerForMatch(
      delivery.match_id,
      delivery.bowler_id
    );

    if (!player) continue;

    const aggregateKey = `${player.team}-${player.playerId}`;

    const totalRow =
      bowlingTotals.get(aggregateKey) || {
        ...player,
        wickets: 0,
        runs: 0,
        legalBalls: 0,
      };

    totalRow.runs += chargedBowlerRuns(delivery);
    if (delivery.is_legal_ball) totalRow.legalBalls += 1;
    if (isBowlerWicket(delivery)) totalRow.wickets += 1;

    bowlingTotals.set(aggregateKey, totalRow);

    const inningsKey = `${delivery.innings_id}-${player.playerId}`;

    const inningsRow =
      inningsBowling.get(inningsKey) || {
        ...player,
        inningsId: delivery.innings_id,
        wickets: 0,
        runs: 0,
        legalBalls: 0,
      };

    inningsRow.runs += chargedBowlerRuns(delivery);
    if (delivery.is_legal_ball) inningsRow.legalBalls += 1;
    if (isBowlerWicket(delivery)) inningsRow.wickets += 1;

    inningsBowling.set(inningsKey, inningsRow);
  }

  const bowlingRows = Array.from(bowlingTotals.values());

  const topWicketTaker = [...bowlingRows].sort((a, b) => {
    if (b.wickets !== a.wickets) return b.wickets - a.wickets;
    if (a.runs !== b.runs) return a.runs - b.runs;
    return a.playerName.localeCompare(b.playerName);
  })[0];

  const bestBowling = Array.from(inningsBowling.values()).sort(
    (a, b) => {
      if (b.wickets !== a.wickets) return b.wickets - a.wickets;
      if (a.runs !== b.runs) return a.runs - b.runs;
      if (a.legalBalls !== b.legalBalls) {
        return a.legalBalls - b.legalBalls;
      }
      return a.playerName.localeCompare(b.playerName);
    }
  )[0];

  const statisticLeaders: Array<{
    icon: string;
    title: string;
    leader?: TournamentLeader;
  }> = [
    {
      icon: "🏏",
      title: "Top Run Scorer",
      leader: topRunScorer
        ? {
            playerId: topRunScorer.playerId,
            playerName: topRunScorer.playerName,
            team: topRunScorer.team,
            value: `${topRunScorer.runs} runs`,
            secondary: `${topRunScorer.balls} balls`,
          }
        : undefined,
    },
    {
      icon: "🎯",
      title: "Top Wicket Taker",
      leader: topWicketTaker
        ? {
            playerId: topWicketTaker.playerId,
            playerName: topWicketTaker.playerName,
            team: topWicketTaker.team,
            value: `${topWicketTaker.wickets} wicket${
              topWicketTaker.wickets === 1 ? "" : "s"
            }`,
            secondary: `${topWicketTaker.runs} runs conceded`,
          }
        : undefined,
    },
    {
      icon: "🔥",
      title: "Most Sixes",
      leader: mostSixes
        ? {
            playerId: mostSixes.playerId,
            playerName: mostSixes.playerName,
            team: mostSixes.team,
            value: `${mostSixes.sixes} six${
              mostSixes.sixes === 1 ? "" : "es"
            }`,
            secondary: `${mostSixes.runs} runs`,
          }
        : undefined,
    },
    {
      icon: "💯",
      title: "Highest Score",
      leader: highestScore
        ? {
            playerId: highestScore.playerId,
            playerName: highestScore.playerName,
            team: highestScore.team,
            value: `${highestScore.runs}`,
            secondary: `${highestScore.balls} balls`,
          }
        : undefined,
    },
    {
      icon: "⚡",
      title: "Best Bowling",
      leader: bestBowling
        ? {
            playerId: bestBowling.playerId,
            playerName: bestBowling.playerName,
            team: bestBowling.team,
            value: `${bestBowling.wickets}/${bestBowling.runs}`,
            secondary: `${oversFromLegalBalls(
              bestBowling.legalBalls
            )} overs`,
          }
        : undefined,
    },
  ];

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
          {[["Live","#live"],["Fixtures","#fixtures"],["Points Table","#points-table"],["Statistics","#statistics"],["Teams","#teams"],["Auction","#auction"]].map(([label,href])=>(
            <a key={label} href={href} className="rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-4 text-center text-sm font-black uppercase tracking-wider transition hover:-translate-y-1 hover:border-yellow-400/50 hover:text-yellow-400">{label}</a>
          ))}
        </nav>

        <section
          id="live"
          className="mt-10 overflow-hidden rounded-[30px] border border-red-500/30 bg-gradient-to-br from-red-950/60 via-[#070707] to-black shadow-2xl"
        >
          <div className="p-7 md:p-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
                  VCTB 3.0 Match Centre
                </p>

                <h2 className="mt-3 text-3xl font-black md:text-5xl">
                  Live Matches
                </h2>

                <p className="mt-3 max-w-2xl text-white/60">
                  Follow both pitches live with official VCTB ball-by-ball scoring and full scorecards.
                </p>
              </div>

              {liveMatches.length > 0 && (
                <div className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-300">
                  ● {liveMatches.length} Match{liveMatches.length === 1 ? "" : "es"} Live
                </div>
              )}
            </div>

            {loadingLiveMatches ? (
              <div className="mt-7 rounded-[24px] border border-white/10 bg-black/40 p-7 text-center">
                <p className="font-black text-white/60">Loading live matches...</p>
              </div>
            ) : liveMatches.length === 0 ? (
              <div className="mt-7 rounded-[24px] border border-white/10 bg-black/40 p-7 text-center">
                <p className="text-xl font-black">No match is live right now</p>
                <p className="mt-2 text-sm text-white/50">
                  As soon as official scoring begins, the live match will appear here automatically.
                </p>

                {upNextFixtures.length > 0 && (
                  <>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <span className="h-px flex-1 bg-white/10" />
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-400">
                        Up Next
                      </p>
                      <span className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {upNextFixtures.map((fixture) => (
                        <OpeningMatchCard
                          key={`${fixture.pitch}-${fixture.time}-${fixture.teamA}-${fixture.teamB}`}
                          pitch={fixture.pitch}
                          time={fixture.time}
                          teamA={fixture.teamA!}
                          teamB={fixture.teamB!}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                {liveMatches.map((liveMatch) => {
                  const matchInnings = getLiveMatchInnings(liveMatch.id);

                  const currentInnings =
                    matchInnings.find((inningsRow) => !inningsRow.completed) ||
                    matchInnings[matchInnings.length - 1] ||
                    null;

                  const firstInnings =
                    matchInnings.find(
                      (inningsRow) => inningsRow.innings_number === 1
                    ) || null;

                  const target =
                    currentInnings?.innings_number === 2 && firstInnings
                      ? firstInnings.total_runs + 1
                      : null;

                  const runsNeeded =
                    target && currentInnings
                      ? Math.max(0, target - currentInnings.total_runs)
                      : null;

                  return (
                    <article
                      key={liveMatch.id}
                      className="overflow-hidden rounded-[26px] border border-red-500/30 bg-black/55 shadow-xl"
                    >
                      <div className="border-b border-white/10 bg-gradient-to-r from-red-950/60 via-black to-yellow-950/30 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                            ● Live • {liveMatch.pitch}
                          </span>

                          <span className="text-xs font-black uppercase text-white/40">
                            Match {liveMatch.match_number}
                          </span>
                        </div>

                        <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                          <TeamMiniRow teamName={liveMatch.team_a} />

                          <div className="text-center text-xs font-black uppercase tracking-[0.3em] text-white/25">
                            VS
                          </div>

                          <div className="sm:flex sm:justify-end">
                            <TeamMiniRow teamName={liveMatch.team_b} />
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        {currentInnings ? (
                          <>
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                              {getDisplayTeamName(currentInnings.batting_team)}
                            </p>

                            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                              <div>
                                <p className="text-4xl font-black">
                                  {currentInnings.total_runs}/{currentInnings.wickets}
                                </p>

                                <p className="mt-1 text-sm font-bold text-white/45">
                                  {oversFromLegalBalls(currentInnings.legal_balls)} overs
                                </p>
                              </div>

                              {target && (
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-white/35">
                                    Target
                                  </p>
                                  <p className="text-xl font-black text-yellow-400">
                                    {target}
                                  </p>

                                  <p className="mt-1 text-xs font-bold text-white/45">
                                    Need {runsNeeded} run{runsNeeded === 1 ? "" : "s"}
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm font-bold text-white/50">
                              Match setup complete. Waiting for the first delivery.
                            </p>
                          </div>
                        )}

                        <Link
                          href={`/vctb/2026/matches/${liveMatch.id}`}
                          className="mt-5 block rounded-2xl bg-yellow-400 px-5 py-4 text-center text-sm font-black uppercase text-black transition hover:bg-yellow-300"
                        >
                          Live Ball-by-Ball & Full Scorecard →
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section id="fixtures" className="mt-16">
          <div className="mb-8"><p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">6 September 2026</p><h2 className="mt-2 text-3xl font-black md:text-5xl">Fixtures & Tournament Schedule</h2><p className="mt-3 max-w-3xl text-white/60">League matches are cross-group. Semi-finals are played within the same group: 1st vs 2nd.</p></div>
          <div className="grid gap-6 xl:grid-cols-2">
            <FixtureColumn
              title="Pitch 1"
              fixtures={resolvedPitch1Fixtures}
              publicMatches={publicMatches}
              publicInnings={publicInnings}
            />
            <FixtureColumn
              title="Pitch 2"
              fixtures={resolvedPitch2Fixtures}
              publicMatches={publicMatches}
              publicInnings={publicInnings}
            />
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-center"><p className="font-black text-yellow-400">📍 Tenetelow Sports Ground, UB2 4LW</p></div>
        </section>

        <section id="points-table" className="mt-16">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              Tournament Standings
            </p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              Points Table
            </h2>
            <p className="mt-3 text-white/60">
              Automatically updated after every completed group-stage match. Win 2 points • Tie 1 point • Loss 0 points • 5-ball-over NRR.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <PointsTable group="A" standings={groupAStandings} />
            <PointsTable group="B" standings={groupBStandings} />
          </div>

          {allGroupMatchesCompleted && semiFinal1Teams && semiFinal2Teams && (
            <div className="mt-6 rounded-[24px] border border-green-400/25 bg-green-950/20 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
                ✓ Group Stage Complete
              </p>
              <p className="mt-2 font-black text-white">
                Semi-final fixtures have been generated automatically from the final standings.
              </p>
            </div>
          )}

          {grandFinalTeams && !tournamentChampion && (
            <div className="mt-4 rounded-[24px] border border-yellow-400/30 bg-yellow-400/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
                🏆 Grand Final Confirmed
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {getDisplayTeamName(grandFinalTeams.teamA)} vs{" "}
                {getDisplayTeamName(grandFinalTeams.teamB)}
              </p>
              <p className="mt-1 text-sm text-white/50">
                5:30 PM • Pitch 1
              </p>
            </div>
          )}

          {tournamentChampion && (
            <div className="mt-4 rounded-[28px] border border-yellow-400/50 bg-gradient-to-r from-yellow-950/40 via-black to-yellow-950/40 p-6 text-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                🏆 VCTB 3.0 Champions
              </p>
              <p className="mt-3 text-3xl font-black text-white">
                {getDisplayTeamName(tournamentChampion)}
              </p>
            </div>
          )}
        </section>

        <section id="statistics" className="mt-16">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">
              Tournament Leaders
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              VCTB 3.0 Statistics
            </h2>

            <p className="mt-3 text-white/60">
              Automatically updated from completed group-stage matches.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statisticLeaders.map(({ icon, title, leader }) => (
              <div
                key={title}
                className="rounded-[24px] border border-white/10 bg-[#0a0a0a] p-6 text-center"
              >
                <div className="text-4xl">{icon}</div>

                <p className="mt-4 text-xs font-black uppercase tracking-wider text-yellow-400">
                  {title}
                </p>

                {loadingStats ? (
                  <p className="mt-3 text-lg font-black text-white/40">
                    Loading...
                  </p>
                ) : leader ? (
                  <>
                    <p className="mt-3 text-lg font-black leading-tight text-white">
                      {leader.playerName}
                    </p>

                    <p className="mt-2 text-sm font-black text-yellow-400">
                      {leader.value}
                    </p>

                    <p className="mt-1 text-xs text-white/45">
                      {teamMeta[leader.team]?.shortName || leader.team}
                    </p>

                    {leader.secondary && (
                      <p className="mt-1 text-xs text-white/30">
                        {leader.secondary}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 text-lg font-black text-white/40">
                    Tournament Pending
                  </p>
                )}
              </div>
            ))}
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
function FixtureColumn({
  title,
  fixtures,
  publicMatches,
  publicInnings,
}: {
  title: string;
  fixtures: Fixture[];
  publicMatches: PublicMatch[];
  publicInnings: PublicInnings[];
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#080808]">
      <div className="bg-gradient-to-r from-blue-950 via-black to-red-950 px-6 py-5">
        <h3 className="text-2xl font-black uppercase">{title}</h3>
      </div>

      <div className="divide-y divide-white/5">
        {fixtures.map((fixture, index) => (
          <FixtureRow
            key={`${fixture.pitch}-${fixture.time}-${index}`}
            fixture={fixture}
            publicMatches={publicMatches}
            publicInnings={publicInnings}
          />
        ))}
      </div>
    </div>
  );
}

function FixtureRow({
  fixture,
  publicMatches,
  publicInnings,
}: {
  fixture: Fixture;
  publicMatches: PublicMatch[];
  publicInnings: PublicInnings[];
}) {
  const isPlayableFixture =
    (fixture.kind === "match" ||
      fixture.kind === "semi" ||
      fixture.kind === "final") &&
    Boolean(fixture.teamA) &&
    Boolean(fixture.teamB);

  if (!isPlayableFixture) {
    return (
      <div className="grid gap-3 px-5 py-4 sm:grid-cols-[90px_1fr] sm:items-center">
        <p className="font-black text-yellow-400">{fixture.time}</p>

        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
              fixture.kind === "final"
                ? "bg-yellow-400 text-black"
                : fixture.kind === "semi"
                ? "bg-red-500/15 text-red-300"
                : "bg-white/10 text-white/60"
            }`}
          >
            {fixture.kind === "final"
              ? "Grand Final"
              : fixture.kind === "semi"
              ? fixture.matchNumber === 10
                ? "Semi Final 1"
                : "Semi Final 2"
              : "Ceremony"}
          </span>

          <p className="mt-2 font-black">{fixture.label}</p>
        </div>
      </div>
    );
  }

  const latestCurrentGroupId = Math.max(
    0,
    ...publicMatches
      .filter((match) => match.match_number >= 1 && match.match_number <= 9)
      .map((match) => match.id)
  );

  const validCurrentSemiMatches = publicMatches.filter(
    (match) =>
      (match.match_number === 10 || match.match_number === 11) &&
      match.id > latestCurrentGroupId
  );

  const latestCurrentSemiId = Math.max(
    0,
    ...validCurrentSemiMatches.map((match) => match.id)
  );

  const fixtureMatch = fixture.matchNumber
    ? publicMatches
        .filter((match) => {
          if (
            match.match_number !== fixture.matchNumber ||
            match.pitch !== fixture.pitch
          ) {
            return false;
          }

          if (fixture.matchNumber === 10 || fixture.matchNumber === 11) {
            return (
              match.id > latestCurrentGroupId &&
              match.team_a === fixture.teamA &&
              match.team_b === fixture.teamB
            );
          }

          if (fixture.matchNumber === 12) {
            return (
              latestCurrentSemiId > 0 &&
              match.id > latestCurrentSemiId &&
              match.team_a === fixture.teamA &&
              match.team_b === fixture.teamB
            );
          }

          return true;
        })
        .sort((a, b) => b.id - a.id)[0]
    : undefined;

  const innings = fixtureMatch
    ? publicInnings
        .filter((inningsRow) => inningsRow.match_id === fixtureMatch.id)
        .sort((a, b) => a.innings_number - b.innings_number)
    : [];

  const isLive = fixtureMatch?.status === "live";
  const isCompleted = fixtureMatch?.status === "completed";

  return (
    <div
      className={`px-5 py-4 ${
        isLive
          ? "bg-red-950/10"
          : isCompleted
          ? "bg-green-950/10"
          : fixture.kind === "semi"
          ? "bg-red-950/5"
          : fixture.kind === "final"
          ? "bg-yellow-950/5"
          : ""
      }`}
    >
      <div className="grid gap-3 sm:grid-cols-[90px_1fr] sm:items-center">
        <div>
          <p className="font-black text-yellow-400">{fixture.time}</p>

          {isLive && (
            <span className="mt-2 inline-flex rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
              ● Live
            </span>
          )}

          {isCompleted && (
            <span className="mt-2 inline-flex rounded-full border border-green-400/20 bg-green-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-green-300">
              ✓ Completed
            </span>
          )}
        </div>

        <div>
          {(fixture.kind === "semi" || fixture.kind === "final") && (
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-white/55">
              {fixture.kind === "final"
                ? "Grand Final"
                : fixture.matchNumber === 10
                ? "Semi Final 1"
                : "Semi Final 2"}
            </p>
          )}

          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <FixtureTeam teamName={fixture.teamA!} />

          <span className="text-center text-xs font-black uppercase tracking-wider text-white/30">
            VS
          </span>

          <FixtureTeam teamName={fixture.teamB!} right />
          </div>
        </div>
      </div>

      {fixture.kind === "semi" && !fixtureMatch && (
        <p className="mt-3 text-xs font-bold text-red-200/60">
          Automatically qualified from the final Group {fixture.pitch === "Pitch 1" ? "A" : "B"} standings.
        </p>
      )}

      {fixtureMatch && (isLive || isCompleted) && (
        <div
          className={`mt-4 rounded-2xl border p-4 ${
            isLive
              ? "border-red-500/25 bg-red-950/20"
              : "border-green-500/20 bg-green-950/20"
          }`}
        >
          {innings.length > 0 && (
            <div className="space-y-2">
              {innings.map((inningsRow) => (
                <div
                  key={inningsRow.id}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <p className="text-sm font-black">
                    {teamMeta[inningsRow.batting_team]?.shortName ||
                      inningsRow.batting_team}
                  </p>

                  <p className="text-sm font-black text-white">
                    {inningsRow.total_runs}/{inningsRow.wickets}
                    <span className="ml-2 font-bold text-white/40">
                      ({Math.floor(inningsRow.legal_balls / 5)}.
                      {inningsRow.legal_balls % 5})
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {isCompleted && fixtureMatch.result_text && (
            <div className="mt-3 border-t border-white/10 pt-3">
              {fixtureMatch.result_text.toLowerCase().includes("walkover") && (
                <span className="mb-2 inline-flex rounded-full border border-orange-400/25 bg-orange-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-orange-300">
                  Walkover
                </span>
              )}

              <p className="text-sm font-black text-green-300">
                {fixtureMatch.result_text}
              </p>
            </div>
          )}

          <Link
            href={`/vctb/2026/matches/${fixtureMatch.id}`}
            className={`mt-3 block rounded-xl px-4 py-3 text-center text-xs font-black uppercase transition ${
              isLive
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            {isLive ? "Live Ball-by-Ball →" : "Full Scorecard →"}
          </Link>
        </div>
      )}
    </div>
  );
}

function FixtureTeam({teamName,right=false}:{teamName:string;right?:boolean}){const team=teams.find((t)=>t.name===teamName);if(!team)return null;return <div className={`flex items-center gap-3 ${right?"sm:flex-row-reverse sm:text-right":""}`}><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1"><Image src={team.logo} alt={team.name} width={40} height={40} className="h-full w-full object-contain"/></div><p className="text-sm font-black leading-tight">{teamMeta[team.name].shortName}</p></div>}
function PointsTable({
  group,
  standings,
}: {
  group: "A" | "B";
  standings: StandingRow[];
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#080808]">
      <div className="border-b border-white/10 bg-white/5 px-6 py-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
          Group {group}
        </p>
        <h3 className="mt-2 text-2xl font-black">Standings</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-black uppercase tracking-wider text-white/40">
              <th className="px-5 py-4">#</th>
              <th className="px-3 py-4">Team</th>
              <th className="px-3 py-4 text-center">P</th>
              <th className="px-3 py-4 text-center">W</th>
              <th className="px-3 py-4 text-center">L</th>
              <th className="px-3 py-4 text-center">T</th>
              <th className="px-3 py-4 text-center">Pts</th>
              <th className="px-3 py-4 text-right">NRR</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((row, index) => {
              const team = teams.find(
                (teamRow) => teamRow.name === row.team
              );

              if (!team) return null;

              return (
                <tr
                  key={row.team}
                  className={`border-b border-white/5 ${
                    index < 2 && row.played > 0
                      ? "bg-green-950/10"
                      : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <span
                      className={`font-black ${
                        index < 2 && row.played > 0
                          ? "text-green-400"
                          : "text-white/35"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white p-1">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <span className="font-black">
                        {teamMeta[team.name].shortName}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-center text-white/60">
                    {row.played}
                  </td>

                  <td className="px-3 py-4 text-center text-white/60">
                    {row.won}
                  </td>

                  <td className="px-3 py-4 text-center text-white/60">
                    {row.lost}
                  </td>

                  <td className="px-3 py-4 text-center text-white/60">
                    {row.tied}
                  </td>

                  <td className="px-3 py-4 text-center font-black text-yellow-400">
                    {row.points}
                  </td>

                  <td
                    className={`px-3 py-4 text-right font-black ${
                      row.nrr > 0
                        ? "text-green-400"
                        : row.nrr < 0
                        ? "text-red-400"
                        : "text-white/50"
                    }`}
                  >
                    {row.nrr > 0 ? "+" : ""}
                    {row.nrr.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/10 px-5 py-3 text-xs text-white/35">
        Top 2 qualify for the same-group semi-final.
      </div>
    </div>
  );
}

function AuctionStat({label,value}:{label:string;value:string}){return <div className="rounded-[22px] border border-white/10 bg-white/5 p-5 text-center"><p className="text-3xl font-black text-yellow-400">{value}</p><p className="mt-2 text-xs font-black uppercase tracking-wider text-white/40">{label}</p></div>}
function SponsorCard({title,src,alt}:{title:string;src:string;alt:string}){return <div className="flex min-h-[190px] flex-col items-center justify-center rounded-3xl border border-yellow-400/30 bg-white p-8 shadow-2xl transition duration-300 hover:-translate-y-1"><p className="mb-5 text-sm font-black uppercase tracking-widest text-[#071a52]">{title}</p><Image src={src} alt={alt} width={260} height={120} className="object-contain"/></div>}