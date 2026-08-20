"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type MatchRow = { id:number; match_number:number; pitch:string; team_a:string; team_b:string; status:string };
type InningsRow = { id:number; match_id:number; innings_number:number; batting_team:string; bowling_team:string; total_runs:number; wickets:number; legal_balls:number; completed:boolean; striker_id?:string|null; non_striker_id?:string|null; bowler_id?:string|null };
type MatchPlayer = { id:number; match_id:number; team:string; player_id:string; player_name:string; role:string|null; is_captain:boolean; is_wicket_keeper:boolean };
type DeliveryRow = { id:number; match_id:number; innings_id:number; over_number:number; ball_in_over:number; striker_id:string; non_striker_id:string; bowler_id:string; runs_batter:number; extras:number; extra_type:string|null; wicket:boolean; wicket_type:string|null; dismissed_player_id:string|null; is_legal_ball:boolean };

const BALLS_PER_OVER = 5;
const TEAM_LOGOS: Record<string,string> = {
  "Aathiyadi JL Super Kings": "/vctb/2026/teams/aathiyadi.png",
  "Balmoral Fighters": "/vctb/2026/teams/balmoral.png",
  "Niruvaththampai Knights": "/vctb/2026/teams/niruvaththampai.png",
  "Team Tiger": "/vctb/2026/teams/team-tiger.png",
  "Thunnalai Royals": "/vctb/2026/teams/thunnalai.png",
  "Vallvai Blues SC UK": "/vctb/2026/teams/vallvai-blues.png",
};

function teamName(team:string){ return team === "Vallvai Blues SC UK" ? "Vallvai Kadalodikal" : team; }
function overs(balls:number){ return `${Math.floor(balls/BALLS_PER_OVER)}.${balls%BALLS_PER_OVER}`; }
function ballBadge(d:DeliveryRow){
  if(d.wicket) return "W";
  if(d.extra_type === "wide") return d.extras > 1 ? `${d.extras}WD` : "WD";
  if(["no_ball","no_ball_bye","no_ball_leg_bye"].includes(d.extra_type || "")) return "NB";
  if(d.extra_type === "bye") return d.extras > 1 ? `${d.extras}B` : "B";
  if(d.extra_type === "leg_bye") return d.extras > 1 ? `${d.extras}LB` : "LB";
  return String(d.runs_batter);
}

export default function VCTBOverlayPage(){
  const params = useParams();
  const pitchSlug = String(params.pitch || "pitch-1").toLowerCase();
  const pitch = pitchSlug === "pitch-2" ? "Pitch 2" : "Pitch 1";
  const supabase = useMemo(()=>createClient(),[]);

  const [match,setMatch] = useState<MatchRow|null>(null);
  const [innings,setInnings] = useState<InningsRow[]>([]);
  const [players,setPlayers] = useState<MatchPlayer[]>([]);
  const [deliveries,setDeliveries] = useState<DeliveryRow[]>([]);

  const load = useCallback(async()=>{
    const { data:matches,error } = await supabase.from("matches")
      .select("id,match_number,pitch,team_a,team_b,status")
      .eq("pitch",pitch).eq("status","live").order("id",{ascending:false}).limit(1);
    if(error){ console.error(error); return; }
    const live = (matches?.[0] || null) as MatchRow|null;
    if(!live){ setMatch(null); setInnings([]); setPlayers([]); setDeliveries([]); return; }

    const [inn,ply,del] = await Promise.all([
      supabase.from("innings").select("*").eq("match_id",live.id).order("innings_number"),
      supabase.from("match_players").select("*").eq("match_id",live.id),
      supabase.from("deliveries").select("*").eq("match_id",live.id).order("id"),
    ]);
    if(inn.error) console.error(inn.error);
    if(ply.error) console.error(ply.error);
    if(del.error) console.error(del.error);
    setMatch(live);
    setInnings((inn.data||[]) as InningsRow[]);
    setPlayers((ply.data||[]) as MatchPlayer[]);
    setDeliveries((del.data||[]) as DeliveryRow[]);
  },[pitch,supabase]);

  useEffect(()=>{
    load();
    const channel = supabase.channel(`vctb-overlay-${pitchSlug}`)
      .on("postgres_changes",{event:"*",schema:"public",table:"matches"},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"innings"},load)
      .on("postgres_changes",{event:"*",schema:"public",table:"deliveries"},load)
      .subscribe();
    const timer = window.setInterval(load,4000);
    return ()=>{ window.clearInterval(timer); supabase.removeChannel(channel); };
  },[load,pitchSlug,supabase]);

  const current = innings.find(i=>!i.completed) || innings[innings.length-1] || null;
  const currentDeliveries = current ? deliveries.filter(d=>d.innings_id===current.id) : [];
  const getPlayer = (id?:string|null)=>players.find(p=>p.player_id===id);
  const striker = getPlayer(current?.striker_id);
  const nonStriker = getPlayer(current?.non_striker_id);
  const bowler = getPlayer(current?.bowler_id);

  const battingTeam = current?.batting_team || match?.team_a || "";
  const bowlingTeam = current?.bowling_team || match?.team_b || "";

  const batterFig=(id?:string|null)=>{
    if(!id) return {runs:0,balls:0};
    const faced=currentDeliveries.filter(d=>d.striker_id===id);
    return {
      runs: faced.reduce((s,d)=>s+Number(d.runs_batter||0),0),
      balls: faced.filter(d=>d.is_legal_ball && d.extra_type!=="wide").length,
    };
  };

  const bowlerFig=(id?:string|null)=>{
    if(!id) return {legalBalls:0,runs:0,wickets:0};
    const bowled=currentDeliveries.filter(d=>d.bowler_id===id);
    const legalBalls=bowled.filter(d=>d.is_legal_ball).length;
    const runs=bowled.reduce((sum,d)=>{
      const kind=d.extra_type||"";
      if(kind==="bye"||kind==="leg_bye") return sum+Number(d.runs_batter||0);
      if(kind==="no_ball_bye"||kind==="no_ball_leg_bye") return sum+Number(d.runs_batter||0)+1;
      return sum+Number(d.runs_batter||0)+Number(d.extras||0);
    },0);
    const wickets=bowled.filter(d=>d.wicket && !["Run Out","Retired Out"].includes(d.wicket_type||"")).length;
    return {legalBalls,runs,wickets};
  };

  const sf=batterFig(striker?.player_id), nsf=batterFig(nonStriker?.player_id), bf=bowlerFig(bowler?.player_id);
  const recent=currentDeliveries.slice(-6);

  if(!match){
    return <main className="root"><div className="waiting"><Image src="/vctb/2026/vctb-3-logo.png" alt="VCTB" width={62} height={62}/><div><b>VCTB 3.0 • {pitch.toUpperCase()}</b><span>WAITING FOR LIVE MATCH</span></div></div><Global/></main>;
  }

  return <main className="root">
    <div className="board">
      <div className="brand">
        <div className="brandBack"/>
        <Image src="/vctb/2026/vctb-3-logo.png" alt="VCTB 3.0" width={170} height={170} className="vctb" priority/>
      </div>

      <div className="left panel">
        <div className="redTitle">{teamName(battingTeam).toUpperCase()}</div>
        <div className="leftBody">
          <div className="logoCircle"><Image src={TEAM_LOGOS[battingTeam] || "/vctb/2026/vctb-3-logo.png"} alt={teamName(battingTeam)} width={80} height={80}/></div>
          <div className="score">{current?.total_runs || 0}-{current?.wickets || 0}</div>
          <div className="overs"><span>OVERS</span><b>{overs(current?.legal_balls||0)}</b></div>
        </div>
      </div>

      <div className="center panel">
        <div className="batters">
          <div className="bat"><i>▶</i><span>{(striker?.player_name||"STRIKER").toUpperCase()}</span><b>{sf.runs}</b><em>{sf.balls}</em></div>
          <div className="divider"/>
          <div className="bat"><span>{(nonStriker?.player_name||"NON-STRIKER").toUpperCase()}</span><b>{nsf.runs}</b><em>{nsf.balls}</em></div>
        </div>
        <div className="recent"><strong>RECENT BALLS</strong><div className="balls">{Array.from({length:6}).map((_,i)=>{ const d=recent[i]; return d ? <span key={d.id} className={`ball ${d.wicket?"wicket":d.runs_batter===4||d.runs_batter===6?"boundary":""}`}>{ballBadge(d)}</span> : <span key={i} className="ball empty"/>; })}</div></div>
      </div>

      <div className="right panel">
        <div className="redTitle rightTitle">{teamName(bowlingTeam).toUpperCase()}</div>
        <div className="rightBody">
          <div className="bowler"><span>{(bowler?.player_name||"BOWLER").toUpperCase()}</span><b>{overs(bf.legalBalls)}-{bf.runs}-{bf.wickets}</b></div>
          <div className="logoCircle rightLogo"><Image src={TEAM_LOGOS[bowlingTeam] || "/vctb/2026/vctb-3-logo.png"} alt={teamName(bowlingTeam)} width={80} height={80}/></div>
        </div>
      </div>

      <div className="venue">›› <span>LIVE FROM TENETELOW SPORTS GROUND, SOUTHALL</span> ‹‹</div>
      <div className="live"><i/> LIVE</div>
    </div>
    <Global/>
  </main>;
}

function Global(){ return <><style jsx global>{`html,body{background:transparent!important;overflow:hidden!important}*{box-sizing:border-box}`}</style><style jsx>{`
.root{position:fixed;inset:0;background:transparent;color:white;font-family:Arial,Helvetica,sans-serif;overflow:hidden}
.board{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);width:min(1780px,calc(100vw - 50px));height:192px;display:grid;grid-template-columns:190px 430px 1fr 410px;grid-template-rows:150px 42px;filter:drop-shadow(0 16px 26px rgba(0,0,0,.72))}
.brand{grid-row:1/3;position:relative;z-index:8;display:flex;align-items:center;justify-content:center}.brandBack{position:absolute;left:12px;right:-16px;bottom:9px;top:31px;border:2px solid #dcb136;border-right:0;border-radius:95px 0 0 95px;background:radial-gradient(circle at 20% 60%,rgba(226,20,31,.7),transparent 46%),linear-gradient(145deg,#092759,#061329 55%,#9a101b)}.vctb{position:relative;width:152px;height:152px;object-fit:contain;filter:drop-shadow(0 5px 7px rgba(0,0,0,.7))}
.panel{position:relative;grid-row:1;overflow:hidden;border-top:2px solid #e0b53f;border-bottom:2px solid #e0b53f;background:radial-gradient(circle at 20% 120%,rgba(21,93,190,.33),transparent 48%),linear-gradient(#0b2d65,#071938 52%,#061126)}.panel:after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.11;background-image:radial-gradient(circle at 8px 8px,#fff 1px,transparent 1.5px);background-size:18px 18px;mask-image:linear-gradient(transparent,#000)}
.left{border-left:2px solid #e0b53f;border-radius:27px 0 0 27px}.right{border-right:2px solid #e0b53f;border-radius:0 27px 27px 0;background:radial-gradient(circle at 90% 110%,rgba(222,25,35,.35),transparent 44%),linear-gradient(#0b2d65,#071938 52%,#061126)}.center{z-index:4;margin:0 -17px;border:2px solid #e0b53f;border-radius:34px;clip-path:polygon(4% 0,96% 0,100% 18%,100% 82%,96% 100%,4% 100%,0 82%,0 18%);background:radial-gradient(circle at 50% -20%,rgba(40,112,220,.25),transparent 46%),linear-gradient(#103268,#071831 50%,#050d1e)}
.redTitle{position:relative;z-index:2;height:42px;display:flex;align-items:center;padding:0 22px 0 35px;background:linear-gradient(90deg,#ac0c17,#ee2934,#970813);border-bottom:1px solid rgba(255,211,87,.75);font-size:19px;font-weight:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rightTitle{justify-content:center;padding-left:18px}
.leftBody,.rightBody{position:relative;z-index:2;height:108px;display:flex;align-items:center}.leftBody{gap:14px;padding:7px 16px 8px 18px}.rightBody{justify-content:space-between;padding:7px 15px 8px 24px}.logoCircle{width:76px;height:76px;flex:0 0 76px;border-radius:50%;background:#fff;border:3px solid #fff;box-shadow:0 0 0 3px #0a3778;display:flex;align-items:center;justify-content:center;padding:5px}.logoCircle :global(img){width:100%;height:100%;object-fit:contain}.rightLogo{width:84px;height:84px;flex-basis:84px}.score{font-size:58px;line-height:.95;font-weight:1000;letter-spacing:-.055em;white-space:nowrap}.overs{margin-left:auto;display:flex;flex-direction:column;align-items:center}.overs span{font-size:13px;font-weight:900}.overs b{font-size:28px;color:#ffc51c;line-height:1.05}
.batters{position:relative;z-index:2;height:75px;display:grid;grid-template-columns:1fr 1px 1fr;align-items:center;padding:0 35px;border-bottom:1px solid rgba(239,42,52,.55)}.divider{height:38px;background:rgba(255,255,255,.38)}.bat{min-width:0;display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;padding:0 21px}.bat:first-child{grid-template-columns:auto 1fr auto auto}.bat i{color:#ffc51c;font-style:normal;font-size:14px}.bat span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:18px;font-weight:950}.bat b{color:#ffc51c;font-size:30px}.bat em{font-size:14px;font-weight:900;font-style:normal;align-self:end;padding-bottom:5px}
.recent{position:relative;z-index:2;height:75px;display:flex;align-items:center;justify-content:center;gap:28px}.recent>strong{font-size:14px}.balls{display:flex;gap:10px}.ball{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;color:#07142d;border:2px solid #fff;font-size:14px;font-weight:1000}.ball.empty{background:transparent;color:transparent}.ball.boundary{background:#168fdf;color:#fff}.ball.wicket{background:#e41d2d;color:#fff}
.bowler{min-width:0;flex:1}.bowler span{display:block;color:#3ab0ff;font-size:21px;font-weight:1000;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bowler b{display:block;margin-top:7px;font-size:29px;line-height:1}
.venue{position:relative;z-index:5;grid-column:2/5;grid-row:2;margin-top:-1px;height:42px;border:2px solid #d8aa32;border-top:0;border-radius:0 0 22px 22px;display:flex;align-items:center;justify-content:center;gap:18px;background:repeating-linear-gradient(135deg,rgba(17,81,170,.35) 0 18px,rgba(7,25,57,.2) 18px 36px),linear-gradient(90deg,#071733,#050b16,#071733);color:#e52b36;font-size:22px;font-weight:1000;letter-spacing:-.16em}.venue span{color:#fff;font-size:15px;letter-spacing:.18em}
.live{position:absolute;right:82px;bottom:-4px;z-index:10;min-width:126px;height:48px;border:2px solid #e0b53f;border-radius:999px;background:linear-gradient(#ff2d38,#a8050e);display:flex;align-items:center;justify-content:center;gap:8px;font-size:22px;font-weight:1000}.live i{width:11px;height:11px;border-radius:50%;background:#fff;animation:pulse 1.4s infinite}@keyframes pulse{50%{opacity:.4}}
.waiting{position:absolute;left:50%;bottom:45px;transform:translateX(-50%);display:flex;align-items:center;gap:14px;padding:10px 22px 10px 10px;border:2px solid #e0b53f;border-radius:999px;background:linear-gradient(90deg,rgba(8,39,84,.96),rgba(5,11,24,.97),rgba(120,9,19,.96));filter:drop-shadow(0 12px 22px rgba(0,0,0,.65))}.waiting img{border-radius:50%}.waiting div{display:flex;flex-direction:column}.waiting b{color:#ffc51c;font-size:13px;letter-spacing:.17em}.waiting span{margin-top:3px;font-size:20px;font-weight:1000}
@media(max-width:1250px){.board{width:1600px;transform:translateX(-50%) scale(.72);transform-origin:bottom center}}
`}</style></> }