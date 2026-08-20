"use client";

import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
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

  const inningsDeliveries = currentInnings
    ? deliveries.filter((d) => d.innings_id === currentInnings.id)
    : [];

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

  if (!match) {
    return (
      <main style={shell}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 40,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "10px 24px 10px 12px",
            borderRadius: 999,
            border: `2px solid ${gold}`,
            background: "linear-gradient(90deg,#071936,#030915,#67111a)",
            boxShadow: "0 10px 35px rgba(0,0,0,.65)",
          }}
        >
          <img
            src="/vctb/2026/vctb-3-logo.png"
            alt="VCTB"
            style={{ width: 62, height: 62, objectFit: "contain" }}
          />
          <div>
            <div style={{ color: "#ffc71c", fontSize: 12, fontWeight: 900, letterSpacing: 2 }}>
              VCTB 3.0 • {pitch.toUpperCase()}
            </div>
            <div style={{ marginTop: 3, fontSize: 20, fontWeight: 900 }}>
              WAITING FOR LIVE MATCH
            </div>
          </div>
        </div>
      </main>
    );
  }

  const board: CSSProperties = {
    position: "absolute",
    left: "50%",
    bottom: 34,
    transform: "translateX(-50%)",
    width: "calc(100vw - 60px)",
    maxWidth: 1760,
    height: 188,
    display: "grid",
    gridTemplateColumns: "175px 420px minmax(600px,1fr) 400px",
    gridTemplateRows: "148px 40px",
    filter: "drop-shadow(0 16px 26px rgba(0,0,0,.65))",
  };

  const panelBase: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg,#0c2b5d 0%,#071936 52%,#050e20 100%)",
    borderTop: `2px solid ${gold}`,
    borderBottom: `2px solid ${gold}`,
  };

  return (
    <main style={shell}>
      <div style={board}>
        {/* VCTB BRAND */}
        <div
          style={{
            gridRow: "1 / span 2",
            position: "relative",
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "28px 0 10px 18px",
              border: `2px solid ${gold}`,
              borderRight: 0,
              borderRadius: "95px 0 0 95px",
              background: "linear-gradient(135deg,#0b2a59 0%,#07152d 58%,#8f101b 100%)",
            }}
          />
          <img
            src="/vctb/2026/vctb-3-logo.png"
            alt="VCTB 3.0"
            style={{
              position: "relative",
              zIndex: 2,
              width: 142,
              height: 142,
              objectFit: "contain",
              filter: "drop-shadow(0 5px 8px rgba(0,0,0,.55))",
            }}
          />
        </div>

        {/* BATTING TEAM */}
        <section
          style={{
            ...panelBase,
            borderLeft: `2px solid ${gold}`,
            borderRadius: "25px 0 0 25px",
          }}
        >
          <div
            style={{
              height: 41,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              background: "linear-gradient(90deg,#9d0915,#ed2632,#a30916)",
              borderBottom: "1px solid rgba(255,215,110,.75)",
              fontSize: 20,
              fontWeight: 1000,
              whiteSpace: "nowrap",
            }}
          >
            {displayTeam(batting).toUpperCase()}
          </div>

          <div
            style={{
              height: 107,
              display: "flex",
              alignItems: "center",
              gap: 15,
              padding: "7px 16px",
            }}
          >
            <div
              style={{
                width: 78,
                height: 78,
                flex: "0 0 78px",
                borderRadius: "50%",
                background: "#fff",
                padding: 5,
                boxShadow: "0 0 0 3px rgba(9,49,102,.9)",
              }}
            >
              <img
                src={TEAM_LOGOS[batting] || "/vctb/2026/vctb-3-logo.png"}
                alt={displayTeam(batting)}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <div
              style={{
                fontSize: 58,
                lineHeight: 1,
                fontWeight: 1000,
                letterSpacing: "-3px",
                whiteSpace: "nowrap",
              }}
            >
              {currentInnings?.total_runs ?? 0}-{currentInnings?.wickets ?? 0}
            </div>

            <div style={{ marginLeft: "auto", textAlign: "center", minWidth: 65 }}>
              <div style={{ fontSize: 12, fontWeight: 900 }}>OVERS</div>
              <div style={{ color: "#ffc71c", fontSize: 29, fontWeight: 1000 }}>
                {overs(currentInnings?.legal_balls || 0)}
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE */}
        <section
          style={{
            ...panelBase,
            zIndex: 3,
            marginLeft: -14,
            marginRight: -14,
            borderLeft: `2px solid ${gold}`,
            borderRight: `2px solid ${gold}`,
            borderRadius: 34,
            background: "linear-gradient(180deg,#102f66 0%,#071831 52%,#040c1d 100%)",
          }}
        >
          <div
            style={{
              height: 74,
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              alignItems: "center",
              padding: "0 28px",
              borderBottom: "1px solid rgba(232,37,48,.55)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{ color: "#ffc71c", fontSize: 14 }}>▶</span>
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  fontSize: 18,
                  fontWeight: 950,
                }}
              >
                {(striker?.player_name || "—").toUpperCase()}
              </span>
              <strong style={{ color: "#ffc71c", fontSize: 30 }}>{s.runs}</strong>
              <small style={{ fontSize: 14, fontWeight: 900 }}>{s.balls}</small>
            </div>

            <div style={{ width: 1, height: 37, background: "rgba(255,255,255,.45)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 22, minWidth: 0 }}>
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  fontSize: 18,
                  fontWeight: 950,
                }}
              >
                {(nonStriker?.player_name || "—").toUpperCase()}
              </span>
              <strong style={{ color: "#ffc71c", fontSize: 30 }}>{ns.runs}</strong>
              <small style={{ fontSize: 14, fontWeight: 900 }}>{ns.balls}</small>
            </div>
          </div>

          <div
            style={{
              height: 74,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 950 }}>RECENT BALLS</span>
            <div style={{ display: "flex", gap: 10 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const d = recent[i];
                if (!d) {
                  return (
                    <span
                      key={i}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        border: "2px solid #fff",
                      }}
                    />
                  );
                }

                const special = d.wicket || d.runs_batter === 4 || d.runs_batter === 6;
                return (
                  <span
                    key={d.id}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: d.wicket ? "#e11e2c" : special ? "#168ddd" : "#fff",
                      color: special ? "#fff" : "#08152e",
                      border: "2px solid #fff",
                      fontSize: 14,
                      fontWeight: 1000,
                    }}
                  >
                    {deliveryBadge(d)}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOWLING TEAM */}
        <section
          style={{
            ...panelBase,
            borderRight: `2px solid ${gold}`,
            borderRadius: "0 25px 25px 0",
          }}
        >
          <div
            style={{
              height: 41,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              background: "linear-gradient(90deg,#9d0915,#ed2632,#a30916)",
              borderBottom: "1px solid rgba(255,215,110,.75)",
              fontSize: 20,
              fontWeight: 1000,
              whiteSpace: "nowrap",
            }}
          >
            {displayTeam(bowling).toUpperCase()}
          </div>

          <div
            style={{
              height: 107,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 15px 7px 24px",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: "#39afff",
                  fontSize: 20,
                  fontWeight: 1000,
                }}
              >
                {(bowler?.player_name || "—").toUpperCase()}
              </div>
              <div style={{ marginTop: 5, fontSize: 29, fontWeight: 1000 }}>
                {overs(bf.balls)}-{bf.runs}-{bf.wickets}
              </div>
            </div>

            <div
              style={{
                width: 82,
                height: 82,
                flex: "0 0 82px",
                borderRadius: "50%",
                background: "#fff",
                padding: 5,
                boxShadow: "0 0 0 3px rgba(9,49,102,.9)",
              }}
            >
              <img
                src={TEAM_LOGOS[bowling] || "/vctb/2026/vctb-3-logo.png"}
                alt={displayTeam(bowling)}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>
        </section>

        {/* VENUE */}
        <div
          style={{
            gridColumn: "2 / 5",
            gridRow: 2,
            zIndex: 4,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "linear-gradient(90deg,#071733,#030915,#071733)",
            border: `2px solid ${gold}`,
            borderTop: 0,
            borderRadius: "0 0 20px 20px",
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: "3px",
          }}
        >
          <span style={{ color: red, fontSize: 23 }}>››</span>
          LIVE FROM TENETELOW SPORTS GROUND, SOUTHALL
          <span style={{ color: red, fontSize: 23 }}>‹‹</span>
        </div>

        {/* LIVE BADGE */}
        <div
          style={{
            position: "absolute",
            right: 72,
            bottom: -3,
            zIndex: 8,
            height: 47,
            minWidth: 124,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 999,
            border: `2px solid ${gold}`,
            background: "linear-gradient(180deg,#ff2732,#a8050d)",
            fontSize: 22,
            fontWeight: 1000,
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#fff" }} />
          LIVE
        </div>
      </div>
    </main>
  );
}