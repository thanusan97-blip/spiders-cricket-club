"use client";

import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type MatchRow = {
  id: number;
  match_number: number;
  pitch: string;
  team_a: string;
  team_b: string;
  status: string;
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
  is_legal_ball: boolean;
};

const BALLS_PER_OVER = 5;

const TEAM_LOGOS: Record<string, string> = {
  "Aathiyadi JL Super Kings": "/vctb/2026/teams/aathiyadi.png",
  "Balmoral Fighters": "/vctb/2026/teams/balmoral.png",
  "Niruvaththampai Knights": "/vctb/2026/teams/niruvaththampai.png",
  "Team Tiger": "/vctb/2026/teams/team-tiger.png",
  "Thunnalai Royals": "/vctb/2026/teams/thunnalai.png",
  "Vallvai Blues SC UK": "/vctb/2026/teams/vallvai-blues.png",
};

function displayTeam(team: string) {
  return team === "Vallvai Blues SC UK" ? "Vallvai Kadalodikal" : team;
}

function overs(balls: number) {
  return `${Math.floor(balls / BALLS_PER_OVER)}.${balls % BALLS_PER_OVER}`;
}

function deliveryBadge(d: DeliveryRow) {
  if (d.wicket) return "W";
  if (d.extra_type === "wide") return d.extras > 1 ? `${d.extras}WD` : "WD";
  if (["no_ball", "no_ball_bye", "no_ball_leg_bye"].includes(d.extra_type || "")) return "NB";
  if (d.extra_type === "bye") return d.extras > 1 ? `${d.extras}B` : "B";
  if (d.extra_type === "leg_bye") return d.extras > 1 ? `${d.extras}LB` : "LB";
  return String(d.runs_batter);
}

const shell: CSSProperties = {
  position: "fixed",
  inset: 0,
  overflow: "hidden",
  background: "transparent",
  fontFamily: "Arial, Helvetica, sans-serif",
  color: "#fff",
};

const gold = "#e7b43a";
const navy = "#06162f";
const red = "#d71927";

export default function VCTBOverlayPage() {
  const params = useParams();
  const slug = String(params.pitch || "pitch-1").toLowerCase();
  const pitch = slug === "pitch-2" ? "Pitch 2" : "Pitch 1";
  const supabase = useMemo(() => createClient(), []);

  const [match, setMatch] = useState<MatchRow | null>(null);
  const [innings, setInnings] = useState<InningsRow[]>([]);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);

  const [centreCard, setCentreCard] = useState<"batting" | "bowling" | null>(null);
  const [eventAnimation, setEventAnimation] = useState<"FOUR" | "SIX" | "WICKET" | null>(null);
  const lastAnimatedDeliveryId = useRef<number | null>(null);
  const animationTimer = useRef<number | null>(null);
  const hasInitialDeliverySnapshot = useRef(false);
  const lastOverCardKey = useRef<string | null>(null);
  const overCardTimers = useRef<number[]>([]);

  const load = useCallback(async () => {
    const { data: matchRows, error: matchError } = await supabase
      .from("matches")
      .select("id,match_number,pitch,team_a,team_b,status")
      .eq("pitch", pitch)
      .eq("status", "live")
      .order("id", { ascending: false })
      .limit(1);

    if (matchError) {
      console.error(matchError);
      return;
    }

    const liveMatch = (matchRows?.[0] || null) as MatchRow | null;
    setMatch(liveMatch);

    if (!liveMatch) {
      setInnings([]);
      setPlayers([]);
      setDeliveries([]);
      return;
    }

    const [inningsRes, playersRes, deliveriesRes] = await Promise.all([
      supabase.from("innings").select("*").eq("match_id", liveMatch.id).order("innings_number"),
      supabase.from("match_players").select("*").eq("match_id", liveMatch.id),
      supabase.from("deliveries").select("*").eq("match_id", liveMatch.id).order("id"),
    ]);

    if (inningsRes.error) console.error(inningsRes.error);
    if (playersRes.error) console.error(playersRes.error);
    if (deliveriesRes.error) console.error(deliveriesRes.error);

    setInnings((inningsRes.data || []) as InningsRow[]);
    setPlayers((playersRes.data || []) as MatchPlayer[]);
    setDeliveries((deliveriesRes.data || []) as DeliveryRow[]);
  }, [pitch, supabase]);

  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    load();

    const channel = supabase
      .channel(`overlay-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "innings" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "deliveries" }, load)
      .subscribe();

    const timer = window.setInterval(load, 3000);

    return () => {
      window.clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, [load, slug, supabase]);

  const currentInnings =
    innings.find((row) => !row.completed) ||
    innings[innings.length - 1] ||
    null;

  const firstInnings =
    innings.find((row) => row.innings_number === 1) || null;

  const secondInnings =
    innings.find((row) => row.innings_number === 2) || null;

  const secondInningsDeliveries = secondInnings
    ? deliveries.filter((d) => d.innings_id === secondInnings.id)
    : [];

  const secondInningsStarted =
    !!secondInnings &&
    (secondInnings.legal_balls > 0 || secondInningsDeliveries.length > 0);

  const betweenInnings =
    !!firstInnings?.completed && !secondInningsStarted;

  const popupInnings = betweenInnings ? firstInnings : currentInnings;

  const inningsDeliveries = currentInnings
    ? deliveries.filter((d) => d.innings_id === currentInnings.id)
    : [];

  const popupDeliveries = popupInnings
    ? deliveries.filter((d) => d.innings_id === popupInnings.id)
    : [];

  // FOUR / SIX / WICKET animation: trigger only for a newly arriving delivery.
  useEffect(() => {
    if (!match || !currentInnings) {
      hasInitialDeliverySnapshot.current = false;
      lastAnimatedDeliveryId.current = null;
      setEventAnimation(null);
      return;
    }

    const latest = inningsDeliveries[inningsDeliveries.length - 1];
    if (!latest) {
      hasInitialDeliverySnapshot.current = true;
      lastAnimatedDeliveryId.current = null;
      return;
    }

    if (!hasInitialDeliverySnapshot.current) {
      hasInitialDeliverySnapshot.current = true;
      lastAnimatedDeliveryId.current = latest.id;
      return;
    }

    if (lastAnimatedDeliveryId.current === latest.id) return;
    lastAnimatedDeliveryId.current = latest.id;

    let next: "FOUR" | "SIX" | "WICKET" | null = null;
    if (latest.wicket) next = "WICKET";
    else if (Number(latest.runs_batter || 0) === 6) next = "SIX";
    else if (Number(latest.runs_batter || 0) === 4) next = "FOUR";
    if (!next) return;

    if (animationTimer.current) window.clearTimeout(animationTimer.current);
    setEventAnimation(next);
    animationTimer.current = window.setTimeout(() => {
      setEventAnimation(null);
      animationTimer.current = null;
    }, next === "WICKET" ? 2600 : 2200);
  }, [match?.id, currentInnings?.id, inningsDeliveries.length, inningsDeliveries[inningsDeliveries.length - 1]?.id]);

  // Every completed over:
  // batting scorecard 10 sec -> bowling scorecard 10 sec -> hide.
  useEffect(() => {
    if (!match || !currentInnings || betweenInnings || currentInnings.completed) {
      return;
    }

    const legalBalls = currentInnings.legal_balls || 0;

    if (legalBalls <= 0 || legalBalls % BALLS_PER_OVER !== 0) {
      return;
    }

    const key = `${match.id}-${currentInnings.id}-${legalBalls}`;

    if (lastOverCardKey.current === key) {
      return;
    }

    lastOverCardKey.current = key;

    overCardTimers.current.forEach((timer) => window.clearTimeout(timer));
    overCardTimers.current = [];

    setCentreCard("batting");

    const bowlingTimer = window.setTimeout(() => {
      setCentreCard("bowling");
    }, 10000);

    const hideTimer = window.setTimeout(() => {
      setCentreCard(null);
    }, 20000);

    overCardTimers.current = [bowlingTimer, hideTimer];

    return () => {};
  }, [
    match?.id,
    currentInnings?.id,
    currentInnings?.legal_balls,
    currentInnings?.completed,
    betweenInnings,
  ]);

  // At the end of the first innings:
  // batting scorecard 20 sec -> bowling scorecard 20 sec -> repeat
  // until the second innings actually starts.
  useEffect(() => {
    if (!betweenInnings) {
      return;
    }

    overCardTimers.current.forEach((timer) => window.clearTimeout(timer));
    overCardTimers.current = [];

    setCentreCard("batting");

    const cycle = window.setInterval(() => {
      setCentreCard((current) =>
        current === "batting" ? "bowling" : "batting"
      );
    }, 20000);

    return () => {
      window.clearInterval(cycle);
    };
  }, [betweenInnings, firstInnings?.id]);

  // As soon as the next innings starts, remove the repeating innings-break card.
  useEffect(() => {
    if (secondInningsStarted) {
      setCentreCard(null);
    }
  }, [secondInningsStarted]);

  useEffect(() => {
    return () => {
      overCardTimers.current.forEach((timer) => window.clearTimeout(timer));
      if (animationTimer.current) window.clearTimeout(animationTimer.current);
    };
  }, []);

  const playerById = (id?: string | null) =>
    players.find((p) => p.player_id === id);

  const striker = playerById(currentInnings?.striker_id);
  const nonStriker = playerById(currentInnings?.non_striker_id);
  const bowler = playerById(currentInnings?.bowler_id);

  const batterFigures = (id?: string | null) => {
    if (!id) return { runs: 0, balls: 0 };
    const faced = inningsDeliveries.filter((d) => d.striker_id === id);
    return {
      runs: faced.reduce((sum, d) => sum + Number(d.runs_batter || 0), 0),
      balls: faced.filter((d) => d.is_legal_ball && d.extra_type !== "wide").length,
    };
  };

  const bowlerFigures = (id?: string | null) => {
    if (!id) return { balls: 0, runs: 0, wickets: 0 };
    const bowled = inningsDeliveries.filter((d) => d.bowler_id === id);
    const balls = bowled.filter((d) => d.is_legal_ball).length;
    const runs = bowled.reduce((sum, d) => {
      const kind = d.extra_type || "";
      if (kind === "bye" || kind === "leg_bye") return sum + Number(d.runs_batter || 0);
      if (kind === "no_ball_bye" || kind === "no_ball_leg_bye")
        return sum + Number(d.runs_batter || 0) + 1;
      return sum + Number(d.runs_batter || 0) + Number(d.extras || 0);
    }, 0);
    const wickets = bowled.filter(
      (d) => d.wicket && !["Run Out", "Retired Out"].includes(d.wicket_type || "")
    ).length;
    return { balls, runs, wickets };
  };

  const s = batterFigures(striker?.player_id);
  const ns = batterFigures(nonStriker?.player_id);
  const bf = bowlerFigures(bowler?.player_id);
  const recent = inningsDeliveries.slice(-6);

  const batting = currentInnings?.batting_team || match?.team_a || "";
  const bowling = currentInnings?.bowling_team || match?.team_b || "";

  const popupBattingTeam = popupInnings?.batting_team || batting;
  const popupBowlingTeam = popupInnings?.bowling_team || bowling;

  const popupBattingPlayers = players
    .filter((player) => player.team === popupBattingTeam)
    .map((player, originalIndex) => {
      const faced = popupDeliveries.filter(
        (delivery) => delivery.striker_id === player.player_id
      );

      const runs = faced.reduce(
        (sum, delivery) => sum + Number(delivery.runs_batter || 0),
        0
      );

      const balls = faced.filter(
        (delivery) =>
          delivery.is_legal_ball && delivery.extra_type !== "wide"
      ).length;

      const fours = faced.filter(
        (delivery) => Number(delivery.runs_batter || 0) === 4
      ).length;

      const sixes = faced.filter(
        (delivery) => Number(delivery.runs_batter || 0) === 6
      ).length;

      const wicketDelivery = popupDeliveries.find(
        (delivery) =>
          delivery.wicket &&
          delivery.dismissed_player_id === player.player_id
      );

      const firstAppearance = popupDeliveries.findIndex(
        (delivery) =>
          delivery.striker_id === player.player_id ||
          delivery.non_striker_id === player.player_id ||
          delivery.dismissed_player_id === player.player_id
      );

      const hasAppeared = firstAppearance >= 0;

      return {
        player,
        runs,
        balls,
        fours,
        sixes,
        strikeRate: balls ? ((runs / balls) * 100).toFixed(1) : "0.0",
        dismissal: wicketDelivery
          ? wicketDelivery.wicket_type || "OUT"
          : hasAppeared
          ? "NOT OUT"
          : "DNB",
        hasAppeared,
        order: hasAppeared ? firstAppearance : 100000 + originalIndex,
      };
    })
    .sort((a, b) => a.order - b.order);

  const popupBowlingPlayers = players
    .filter((player) => player.team === popupBowlingTeam)
    .map((player) => {
      const bowled = popupDeliveries.filter(
        (delivery) => delivery.bowler_id === player.player_id
      );

      const legalBalls = bowled.filter(
        (delivery) => delivery.is_legal_ball
      ).length;

      const runs = bowled.reduce((sum, delivery) => {
        const kind = delivery.extra_type || "";

        if (kind === "bye" || kind === "leg_bye") {
          return sum + Number(delivery.runs_batter || 0);
        }

        if (kind === "no_ball_bye" || kind === "no_ball_leg_bye") {
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
          !["Run Out", "Retired Out"].includes(delivery.wicket_type || "")
      ).length;

      return {
        player,
        legalBalls,
        runs,
        wickets,
        economy: legalBalls
          ? ((runs / legalBalls) * BALLS_PER_OVER).toFixed(2)
          : "0.00",
      };
    })
    .filter((row) => row.legalBalls > 0)
    .sort((a, b) => {
      if (b.wickets !== a.wickets) return b.wickets - a.wickets;
      if (a.runs !== b.runs) return a.runs - b.runs;
      return a.player.player_name.localeCompare(b.player.player_name);
    });

  if (!match) {
    return (
      <main style={shell}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 36,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "9px 22px 9px 10px",
            border: `2px solid ${gold}`,
            borderRadius: 999,
            background: "linear-gradient(90deg,#06162f,#020817,#681019)",
            boxShadow: "0 10px 35px rgba(0,0,0,.65)",
          }}
        >
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${gold}`,
              background: "#071831",
            }}
          >
            <img
              src="/vctb/2026/vctb-3-logo.png"
              alt="VCTB 3.0"
              style={{
                width: "112%",
                height: "112%",
                marginLeft: "-6%",
                marginTop: "-6%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div>
            <div style={{ color: "#ffc71c", fontSize: 12, fontWeight: 900, letterSpacing: 2 }}>
              VCTB 3.0 • {pitch.toUpperCase()}
            </div>
            <div style={{ marginTop: 2, fontSize: 20, fontWeight: 950 }}>
              WAITING FOR LIVE MATCH
            </div>
          </div>
        </div>
      </main>
    );
  }

  const width = "min(1840px, calc(100vw - 34px))";

  const teamHeader: CSSProperties = {
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 18px",
    color: "#fff",
    background: "linear-gradient(180deg,#df1e2c 0%,#ad0815 100%)",
    borderBottom: "1px solid rgba(255,217,105,.82)",
    fontSize: 21,
    lineHeight: 1,
    fontWeight: 1000,
    whiteSpace: "nowrap",
    textShadow: "0 2px 3px rgba(0,0,0,.45)",
  };

  const panelSurface: CSSProperties = {
    background:
      "radial-gradient(circle at 85% 120%,rgba(26,98,191,.24),transparent 43%),linear-gradient(180deg,#0c2d61 0%,#071a39 50%,#050f22 100%)",
    borderTop: `2px solid ${gold}`,
    borderBottom: `2px solid ${gold}`,
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,.12), inset 0 -12px 28px rgba(0,0,0,.20)",
  };

  const teamLogoCircle = (team: string): CSSProperties => ({
    width: 82,
    height: 82,
    flex: "0 0 82px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    background: "#fff",
    border: "3px solid rgba(255,255,255,.95)",
    boxShadow: "0 0 0 3px #174e91, 0 5px 12px rgba(0,0,0,.35)",
  });

  return (
    <main style={shell}>
      <style>{`
        @keyframes eventBack {0%{opacity:0}12%{opacity:1}82%{opacity:1}100%{opacity:0}}
        @keyframes eventWord {0%{opacity:0;transform:scale(.2) rotate(-8deg);filter:blur(10px)}22%{opacity:1;transform:scale(1.15) rotate(2deg);filter:blur(0)}38%{transform:scale(.98)}72%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.22);filter:blur(3px)}}
        @keyframes eventRing {0%{opacity:.95;transform:translate(-50%,-50%) scale(.15)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.7)}}
      `}</style>

      {eventAnimation && (
        <div style={{
          position:"absolute", inset:0, zIndex:500, pointerEvents:"none",
          display:"flex", alignItems:"center", justifyContent:"center",
          animation:`eventBack ${eventAnimation==="WICKET"?"2.6s":"2.2s"} ease-out both`,
          background:eventAnimation==="WICKET"
            ?"radial-gradient(circle,rgba(220,18,34,.58),rgba(70,0,8,.18) 38%,transparent 68%)"
            :eventAnimation==="SIX"
            ?"radial-gradient(circle,rgba(255,194,20,.45),rgba(9,61,143,.18) 40%,transparent 70%)"
            :"radial-gradient(circle,rgba(22,145,230,.48),rgba(5,40,100,.18) 40%,transparent 70%)"
        }}>
          <div style={{
            position:"absolute", left:"50%", top:"50%", width:520, height:520,
            borderRadius:"50%", border:`8px solid ${eventAnimation==="WICKET"?"#ef1e2d":"#ffc71c"}`,
            boxShadow:`0 0 60px ${eventAnimation==="WICKET"?"rgba(239,30,45,.9)":"rgba(255,199,28,.8)"}`,
            animation:"eventRing 1.35s ease-out both"
          }}/>

          <div style={{
            position:"relative", minWidth:eventAnimation==="WICKET"?820:510,
            padding:eventAnimation==="WICKET"?"48px 82px":"30px 78px 42px",
            textAlign:"center", borderRadius:42, border:`4px solid ${gold}`,
            background:eventAnimation==="WICKET"
              ?"linear-gradient(135deg,#4d0209,#d71927 48%,#071831)"
              :"linear-gradient(135deg,#071831,#0b3d82 48%,#071831)",
            boxShadow:"0 22px 70px rgba(0,0,0,.72),inset 0 2px 0 rgba(255,255,255,.2),0 0 45px rgba(231,180,58,.45)",
            animation:`eventWord ${eventAnimation==="WICKET"?"2.6s":"2.2s"} cubic-bezier(.2,.8,.2,1) both`
          }}>
            <div style={{
              position:"absolute",left:-64,top:"50%",transform:"translateY(-50%)",
              width:128,height:128,borderRadius:"50%",overflow:"hidden",
              border:`4px solid ${gold}`,background:"#071831",boxShadow:"0 8px 25px rgba(0,0,0,.55)"
            }}>
              <img src="/vctb/2026/vctb-3-logo.png" alt="" style={{width:"116%",height:"116%",marginLeft:"-8%",marginTop:"-8%",objectFit:"cover"}}/>
            </div>
            <div style={{color:"#ffc71c",fontSize:18,fontWeight:1000,letterSpacing:"6px",textShadow:"0 2px 5px #000"}}>VCTB 3.0</div>
            <div style={{
              marginTop:2,color:"#fff",fontSize:eventAnimation==="WICKET"?104:154,lineHeight:.92,
              fontWeight:1000,letterSpacing:eventAnimation==="WICKET"?"-5px":"-10px",
              textShadow:eventAnimation==="WICKET"?"0 6px 0 #8d0711,0 12px 25px rgba(0,0,0,.7)":"0 6px 0 #0a3977,0 12px 25px rgba(0,0,0,.7)"
            }}>
              {eventAnimation==="FOUR"?"4":eventAnimation==="SIX"?"6":"WICKET"}
            </div>
            {eventAnimation!=="WICKET" && (
              <div style={{marginTop:-3,color:"#fff",fontSize:25,fontWeight:1000,letterSpacing:"8px"}}>
                {eventAnimation==="FOUR"?"FOUR":"SIX"}
              </div>
            )}
          </div>
        </div>
      )}

      {centreCard && popupInnings && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "47%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            width: 900,
            maxHeight: 560,
            overflow: "hidden",
            borderRadius: 28,
            border: `3px solid ${gold}`,
            background:
              "radial-gradient(circle at 50% -15%,rgba(38,111,215,.28),transparent 42%),linear-gradient(180deg,#0b2c61 0%,#071831 40%,#030914 100%)",
            color: "#fff",
            boxShadow:
              "0 24px 65px rgba(0,0,0,.72), inset 0 1px 0 rgba(255,255,255,.14)",
          }}
        >
          <div
            style={{
              height: 88,
              display: "grid",
              gridTemplateColumns: "82px 1fr auto",
              alignItems: "center",
              gap: 18,
              padding: "0 24px",
              background:
                "linear-gradient(90deg,#a50a17 0%,#d91827 38%,#091a3a 72%,#06142e 100%)",
              borderBottom: `2px solid ${gold}`,
            }}
          >
            <div
              style={{
                width: 66,
                height: 66,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
                background: "#fff",
                boxShadow: "0 0 0 3px #194d8a",
              }}
            >
              <img
                src={
                  TEAM_LOGOS[
                    centreCard === "batting"
                      ? popupBattingTeam
                      : popupBowlingTeam
                  ] || "/vctb/2026/vctb-3-logo.png"
                }
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <div>
              <div
                style={{
                  color: "#ffc71c",
                  fontSize: 13,
                  fontWeight: 1000,
                  letterSpacing: "3px",
                }}
              >
                {betweenInnings ? "INNINGS BREAK" : "END OF OVER"}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 30,
                  lineHeight: 1,
                  fontWeight: 1000,
                }}
              >
                {centreCard === "batting"
                  ? `${displayTeam(popupBattingTeam)} • BATTING`
                  : `${displayTeam(popupBowlingTeam)} • BOWLING`}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 33,
                  lineHeight: 1,
                  fontWeight: 1000,
                  color: "#fff",
                }}
              >
                {popupInnings.total_runs}-{popupInnings.wickets}
              </div>
              <div
                style={{
                  marginTop: 5,
                  color: "#ffc71c",
                  fontSize: 15,
                  fontWeight: 950,
                }}
              >
                {overs(popupInnings.legal_balls)} OVERS
              </div>
            </div>
          </div>

          {centreCard === "batting" ? (
            <div style={{ padding: "16px 22px 18px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "38px 1fr 155px 48px 48px 48px 48px 68px",
                  gap: 8,
                  alignItems: "center",
                  padding: "0 10px 10px",
                  color: "rgba(255,255,255,.48)",
                  fontSize: 11,
                  fontWeight: 1000,
                  letterSpacing: "1px",
                  borderBottom: "1px solid rgba(255,255,255,.14)",
                }}
              >
                <span>#</span>
                <span>BATTER</span>
                <span>STATUS</span>
                <span style={{ textAlign: "right" }}>R</span>
                <span style={{ textAlign: "right" }}>B</span>
                <span style={{ textAlign: "right" }}>4s</span>
                <span style={{ textAlign: "right" }}>6s</span>
                <span style={{ textAlign: "right" }}>SR</span>
              </div>

              {popupBattingPlayers.map((row, index) => (
                <div
                  key={row.player.player_id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "38px 1fr 155px 48px 48px 48px 48px 68px",
                    gap: 8,
                    alignItems: "center",
                    minHeight: 35,
                    padding: "4px 10px",
                    borderBottom: "1px solid rgba(255,255,255,.07)",
                    opacity: row.dismissal === "DNB" ? 0.42 : 1,
                  }}
                >
                  <span
                    style={{
                      color: index < 2 ? "#ffc71c" : "rgba(255,255,255,.36)",
                      fontSize: 12,
                      fontWeight: 950,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: 15,
                      fontWeight: 950,
                    }}
                  >
                    {row.player.player_name}
                    {row.player.is_captain ? " (c)" : ""}
                    {row.player.is_wicket_keeper ? " (wk)" : ""}
                  </span>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color:
                        row.dismissal === "NOT OUT"
                          ? "#59ef9b"
                          : "rgba(255,255,255,.48)",
                      fontSize: 11,
                      fontWeight: 850,
                    }}
                  >
                    {row.dismissal}
                  </span>
                  <strong style={{ textAlign: "right", fontSize: 16 }}>
                    {row.runs}
                  </strong>
                  <span style={{ textAlign: "right", fontSize: 14 }}>
                    {row.balls}
                  </span>
                  <span style={{ textAlign: "right", fontSize: 14 }}>
                    {row.fours}
                  </span>
                  <span style={{ textAlign: "right", fontSize: 14 }}>
                    {row.sixes}
                  </span>
                  <span style={{ textAlign: "right", fontSize: 14 }}>
                    {row.strikeRate}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "16px 22px 22px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "42px 1fr 80px 80px 80px 95px",
                  gap: 10,
                  alignItems: "center",
                  padding: "0 12px 11px",
                  color: "rgba(255,255,255,.48)",
                  fontSize: 11,
                  fontWeight: 1000,
                  letterSpacing: "1px",
                  borderBottom: "1px solid rgba(255,255,255,.14)",
                }}
              >
                <span>#</span>
                <span>BOWLER</span>
                <span style={{ textAlign: "right" }}>O</span>
                <span style={{ textAlign: "right" }}>R</span>
                <span style={{ textAlign: "right" }}>W</span>
                <span style={{ textAlign: "right" }}>ECON</span>
              </div>

              {popupBowlingPlayers.length ? (
                popupBowlingPlayers.map((row, index) => (
                  <div
                    key={row.player.player_id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px 1fr 80px 80px 80px 95px",
                      gap: 10,
                      alignItems: "center",
                      minHeight: 51,
                      padding: "6px 12px",
                      borderBottom: "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <span
                      style={{
                        color: index === 0 ? "#ffc71c" : "rgba(255,255,255,.38)",
                        fontWeight: 950,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span style={{ fontSize: 17, fontWeight: 950 }}>
                      {row.player.player_name}
                    </span>
                    <span style={{ textAlign: "right", fontSize: 16 }}>
                      {overs(row.legalBalls)}
                    </span>
                    <span style={{ textAlign: "right", fontSize: 16 }}>
                      {row.runs}
                    </span>
                    <strong
                      style={{
                        textAlign: "right",
                        color: "#ffc71c",
                        fontSize: 18,
                      }}
                    >
                      {row.wickets}
                    </strong>
                    <span style={{ textAlign: "right", fontSize: 16 }}>
                      {row.economy}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: 55,
                    textAlign: "center",
                    color: "rgba(255,255,255,.4)",
                    fontSize: 18,
                    fontWeight: 850,
                  }}
                >
                  NO BOWLING FIGURES YET
                </div>
              )}
            </div>
          )}

          <div
            style={{
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,.48)",
              background: "rgba(0,0,0,.25)",
              borderTop: "1px solid rgba(255,255,255,.08)",
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "2px",
            }}
          >
            VCTB 3.0 • TENETELOW SPORTS GROUND, SOUTHALL
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 28,
          transform: "translateX(-50%)",
          width,
          height: 205,
          display: "grid",
          gridTemplateColumns: "235px 430px minmax(650px,1fr) 430px",
          gridTemplateRows: "164px 41px",
          alignItems: "stretch",
          filter: "drop-shadow(0 15px 22px rgba(0,0,0,.68))",
        }}
      >
        {/* LEFT DECORATIVE WING + VCTB LOGO */}
        <div
          style={{
            position: "relative",
            gridColumn: 1,
            gridRow: "1 / span 2",
            zIndex: 8,
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 34,
              width: 224,
              height: 161,
              borderRadius: "26px 0 0 26px",
              border: `2px solid ${gold}`,
              borderRight: 0,
              background:
                "radial-gradient(circle at 8% 42%,rgba(229,25,36,.85),transparent 34%),radial-gradient(circle at 80% 92%,rgba(22,91,183,.5),transparent 46%),linear-gradient(135deg,#310712,#071a39 45%,#09142d)",
              boxShadow: "inset 0 0 26px rgba(29,92,191,.28)",
            }}
          />

          {/* subtle red/blue texture bars */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 11,
              width: 220,
              height: 35,
              opacity: 0.42,
              background:
                "repeating-linear-gradient(135deg,rgba(230,27,40,.9) 0 8px,rgba(230,27,40,0) 8px 18px),linear-gradient(90deg,#79101b,#071936)",
            }}
          />

          {/* circular masked logo removes white corners */}
          <div
            style={{
              position: "absolute",
              left: 27,
              top: 2,
              width: 192,
              height: 192,
              borderRadius: "50%",
              overflow: "hidden",
              background:
                "radial-gradient(circle,#0a346e 0%,#07162e 72%,#020712 100%)",
              border: "4px solid #e6e7eb",
              boxShadow:
                `0 0 0 4px #b51320, 0 0 0 7px ${gold}, 0 8px 22px rgba(0,0,0,.65)`,
            }}
          >
            <img
              src="/vctb/2026/vctb-3-logo.png"
              alt="VCTB 3.0"
              style={{
                width: "116%",
                height: "116%",
                marginLeft: "-8%",
                marginTop: "-8%",
                objectFit: "cover",
                borderRadius: "50%",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* BATTING SCORE PANEL */}
        <section
          style={{
            ...panelSurface,
            position: "relative",
            gridColumn: 2,
            gridRow: 1,
            overflow: "hidden",
            borderLeft: `2px solid ${gold}`,
            borderRadius: "25px 0 0 25px",
            marginLeft: -26,
            zIndex: 4,
          }}
        >
          <div style={{ ...teamHeader, paddingLeft: 74 }}>
            {displayTeam(batting).toUpperCase()}
          </div>

          <div
            style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              gap: 15,
              padding: "8px 18px 8px 58px",
            }}
          >
            <div style={teamLogoCircle(batting)}>
              <img
                src={TEAM_LOGOS[batting] || "/vctb/2026/vctb-3-logo.png"}
                alt={displayTeam(batting)}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                fontSize: 64,
                lineHeight: .93,
                fontWeight: 1000,
                letterSpacing: "-4px",
                whiteSpace: "nowrap",
                textShadow: "0 3px 4px rgba(0,0,0,.45)",
              }}
            >
              {currentInnings?.total_runs ?? 0}-{currentInnings?.wickets ?? 0}
            </div>

            <div
              style={{
                marginLeft: "auto",
                minWidth: 70,
                textAlign: "center",
                paddingRight: 5,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 950 }}>OVERS</div>
              <div style={{ marginTop: 3, color: "#ffc81d", fontSize: 31, fontWeight: 1000 }}>
                {overs(currentInnings?.legal_balls || 0)}
              </div>
            </div>
          </div>
        </section>

        {/* CENTER BATTERS + RECENT BALLS */}
        <section
          style={{
            ...panelSurface,
            position: "relative",
            zIndex: 7,
            gridColumn: 3,
            gridRow: 1,
            marginLeft: -18,
            marginRight: 0,
            overflow: "hidden",
            borderLeft: `2px solid ${gold}`,
            borderRight: `2px solid ${gold}`,
            borderRadius: 38,
            background:
              "radial-gradient(circle at 50% -10%,rgba(46,119,217,.23),transparent 45%),linear-gradient(180deg,#102f66 0%,#071831 51%,#040c1d 100%)",
          }}
        >
          <div
            style={{
              height: 81,
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              alignItems: "center",
              padding: "0 32px",
              borderBottom: "1px solid rgba(230,30,43,.58)",
            }}
          >
            <div
              style={{
                minWidth: 0,
                display: "grid",
                gridTemplateColumns: "20px 1fr auto auto",
                gap: 10,
                alignItems: "center",
                paddingRight: 23,
              }}
            >
              <span style={{ color: "#ffc71d", fontSize: 17 }}>▶</span>
              <span
                style={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 19,
                  fontWeight: 1000,
                }}
              >
                {(striker?.player_name || "—").toUpperCase()}
              </span>
              <strong style={{ color: "#ffc71d", fontSize: 34, lineHeight: 1 }}>{s.runs}</strong>
              <span style={{ alignSelf: "end", paddingBottom: 5, fontSize: 14, fontWeight: 900 }}>
                {s.balls}
              </span>
            </div>

            <div style={{ width: 1, height: 41, background: "rgba(255,255,255,.45)" }} />

            <div
              style={{
                minWidth: 0,
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: 10,
                alignItems: "center",
                paddingLeft: 25,
              }}
            >
              <span
                style={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 19,
                  fontWeight: 1000,
                }}
              >
                {(nonStriker?.player_name || "—").toUpperCase()}
              </span>
              <strong style={{ color: "#ffc71d", fontSize: 34, lineHeight: 1 }}>{ns.runs}</strong>
              <span style={{ alignSelf: "end", paddingBottom: 5, fontSize: 14, fontWeight: 900 }}>
                {ns.balls}
              </span>
            </div>
          </div>

          <div
            style={{
              height: 83,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 34,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 1000 }}>RECENT BALLS</span>

            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const d = recent[i];

                if (!d) {
                  return (
                    <span
                      key={i}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,.96)",
                        background: "transparent",
                      }}
                    />
                  );
                }

                const special = d.wicket || d.runs_batter === 4 || d.runs_batter === 6;

                return (
                  <span
                    key={d.id}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: special ? "#fff" : "#07142c",
                      background: d.wicket
                        ? "#e41d2d"
                        : d.runs_batter === 4 || d.runs_batter === 6
                        ? "#168ee1"
                        : "#fff",
                      border: "2px solid #fff",
                      fontSize: 15,
                      fontWeight: 1000,
                      boxShadow: "inset 0 -2px 4px rgba(0,0,0,.18)",
                    }}
                  >
                    {deliveryBadge(d)}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOWLING PANEL */}
        <section
          style={{
            ...panelSurface,
            position: "relative",
            gridColumn: 4,
            gridRow: 1,
            overflow: "hidden",
            borderRight: `2px solid ${gold}`,
            borderRadius: "0 30px 30px 0",
            marginRight: 0,
            zIndex: 4,
            background:
              "radial-gradient(circle at 94% 95%,rgba(206,26,35,.25),transparent 42%),linear-gradient(180deg,#0c2d61 0%,#071a39 50%,#050f22 100%)",
          }}
        >
          <div style={teamHeader}>{displayTeam(bowling).toUpperCase()}</div>

          <div
            style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "8px 22px 8px 24px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: "#35afff",
                  fontSize: 22,
                  fontWeight: 1000,
                }}
              >
                {(bowler?.player_name || "—").toUpperCase()}
              </div>

              <div
                style={{
                  marginTop: 7,
                  fontSize: 31,
                  lineHeight: 1,
                  fontWeight: 1000,
                  whiteSpace: "nowrap",
                }}
              >
                {overs(bf.balls)}-{bf.runs}-{bf.wickets}
              </div>
            </div>

            <div style={teamLogoCircle(bowling)}>
              <img
                src={TEAM_LOGOS[bowling] || "/vctb/2026/vctb-3-logo.png"}
                alt={displayTeam(bowling)}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </section>

        {/* VENUE STRIP */}
        <div
          style={{
            position: "relative",
            zIndex: 6,
            gridColumn: "2 / 5",
            gridRow: 2,
            marginLeft: -26,
            marginRight: -18,
            height: 41,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 19,
            border: `2px solid ${gold}`,
            borderTop: 0,
            borderRadius: "0 0 23px 23px",
            background:
              "repeating-linear-gradient(135deg,rgba(18,71,148,.34) 0 16px,rgba(3,12,28,.05) 16px 32px),linear-gradient(90deg,#071831,#030814,#071831)",
            fontSize: 16,
            fontWeight: 1000,
            letterSpacing: "3.1px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#ee1e2d", fontSize: 26, letterSpacing: "-5px" }}>›››</span>
          LIVE FROM TENETELOW SPORTS GROUND, SOUTHALL
          <span style={{ color: "#ee1e2d", fontSize: 26, letterSpacing: "-5px" }}>‹‹‹</span>
        </div>

        {/* LIVE BADGE */}
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: -2,
            zIndex: 12,
            minWidth: 132,
            height: 49,
            padding: "0 19px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            color: "#fff",
            borderRadius: 999,
            border: `2px solid ${gold}`,
            background: "linear-gradient(180deg,#ff2633 0%,#a8050e 100%)",
            boxShadow: "0 4px 8px rgba(0,0,0,.45)",
            fontSize: 23,
            fontWeight: 1000,
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
          LIVE
        </div>
      </div>
    </main>
  );
}