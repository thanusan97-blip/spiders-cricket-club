"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

// 6 September 2026 at 08:00 BST (UK time)
const START = Date.UTC(2026, 8, 6, 7, 0, 0);
// Tournament-day display ends at midnight after 6 September (BST)
const END = Date.UTC(2026, 8, 6, 23, 0, 0);

type Countdown = { days:number; hours:number; minutes:number; seconds:number };

function getCountdown(): Countdown {
  const d = Math.max(0, START - Date.now());
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

const clubAreas = [
  { title:"Competitions", text:"View BTCL and VCTB competitions for 2026, 2025 and 2024.", button:"Explore Competitions", icon:"🏆", link:"/competitions" },
  { title:"Statistics", text:"View detailed player batting, bowling and fielding statistics.", button:"View Statistics", icon:"📊", link:"/statistics" },
  { title:"VCTB", text:"Explore VCTB 2026, 2025 and 2024 tournaments.", button:"Explore VCTB", icon:"🏏", link:"/vctb" },
  { title:"Team", text:"View team information, squad list and player profiles.", button:"Meet the Team", icon:"👥", link:"/team" },
  { title:"Gallery", text:"Match day photos and club memories.", button:"View Gallery", icon:"🖼️", link:"/gallery" },
  { title:"Hall of Fame", text:"Top performers and club legends.", button:"Explore Legends", icon:"⭐", link:"/hall-of-fame" },
];

export default function HomePage() {
  // Render a real countdown value into the HTML immediately.
  // This means mobile never starts at 00 00 00 00 even if React hydration is delayed.
  const initialNow = Date.now();
  const initialDiff = Math.max(0, START - initialNow);
  const countdown: Countdown = {
    days: Math.floor(initialDiff / 86400000),
    hours: Math.floor((initialDiff / 3600000) % 24),
    minutes: Math.floor((initialDiff / 60000) % 60),
    seconds: Math.floor((initialDiff / 1000) % 60),
  };

  const live = initialNow >= START && initialNow < END;
  const finished = initialNow >= END;

  return (
    <main className="min-h-screen bg-[#eef2ff] text-[#071a52]">
      <header className="fixed left-0 top-0 z-[9999] w-full bg-[#07111f] shadow-md">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image src="/logo.png" alt="Spiders Logo" width={70} height={70} priority className="h-[55px] w-[55px] shrink-0 rounded-full object-contain sm:h-[70px] sm:w-[70px]" />
            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-lg font-bold text-white sm:text-xl md:text-3xl">Spiders Sports Club UK</h1>
              <p className="text-xs text-white sm:text-sm">Cricket Club • High Wycombe</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 font-semibold text-white md:flex">
            <Link href="/">Home</Link><Link href="/competitions">Competitions</Link><Link href="/statistics">Statistics</Link>
            <Link href="/vctb">VCTB</Link><Link href="/team">Team</Link><Link href="/gallery">Gallery</Link>
            <a href="#sponsors">Sponsors</a><a href="#contact">Contact</a>
          </nav>

          <details className="group relative z-[10000] md:hidden">
            <summary className="flex h-12 w-12 cursor-pointer list-none touch-manipulation items-center justify-center rounded-lg text-white [&::-webkit-details-marker]:hidden">
              <span className="text-[34px] leading-none group-open:hidden">☰</span>
              <span className="hidden text-[30px] leading-none group-open:block">✕</span>
            </summary>
            <div className="fixed left-0 right-0 top-[79px] z-[9998] border-t border-white/10 bg-[#0b1f3a] px-5 py-4 shadow-2xl">
              <nav className="mx-auto flex max-w-7xl flex-col">
                {[
                  ["/","Home"],["/competitions","Competitions"],["/statistics","Statistics"],["/vctb","VCTB"],
                  ["/team","Team"],["/gallery","Gallery"]
                ].map(([href,label]) => <Link key={href} href={href} className="rounded-lg px-4 py-3 text-base font-semibold text-white">{label}</Link>)}
                <a href="#sponsors" className="rounded-lg px-4 py-3 text-base font-semibold text-white">Sponsors</a>
                <a href="#contact" className="rounded-lg px-4 py-3 text-base font-semibold text-white">Contact</a>
              </nav>
            </div>
          </details>
        </div>
      </header>

      <section className="relative mt-[79px] flex min-h-[calc(100svh-79px)] items-center justify-center overflow-hidden bg-[#020617] md:mt-[102px] md:min-h-[calc(100vh-102px)]">
        <div className="absolute inset-0 bg-no-repeat md:hidden" style={{backgroundImage:"url('/vctb/2026/vctb-2026-bg.png')",backgroundSize:"160% auto",backgroundPosition:"50% top",backgroundColor:"#020617"}} />
        <div className="absolute inset-0 hidden bg-no-repeat md:block" style={{backgroundImage:"url('/vctb/2026/vctb-2026-bg.png')",backgroundSize:"100% 100%",backgroundPosition:"center top",backgroundColor:"#020617"}} />
        <div className="absolute inset-0 bg-black/40 md:bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#020617]/85 md:hidden" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-4 pt-3 text-center text-white sm:px-6 md:pb-6 md:pt-4">
          <div aria-hidden="true" className="invisible select-none">
            <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.3em] sm:text-xs md:text-sm">Kwik Mart Presents</p>
            <h1 className="max-w-5xl text-[31px] font-black uppercase leading-[0.97] sm:text-5xl md:text-6xl lg:text-7xl">
              Vadamaradchy<span className="block">Champion</span><span className="mt-1 block">T10 Blast</span>
            </h1>
            <div className="mt-3 rounded-full px-5 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] sm:text-xs md:text-base">Edition 3.0 • 2026</div>
          </div>

          <div className="mt-2 md:mt-3">
            <div id="vctb-status" className={"inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.13em] backdrop-blur-md sm:text-xs md:px-5 md:py-2 md:text-base " + (live ? "border-red-400 bg-red-600 text-white" : "border-yellow-400/60 bg-black/70 text-yellow-300")}>
              {live ? "● VCTB 3.0 LIVE NOW" : finished ? "🏆 VCTB 3.0 TOURNAMENT RESULTS" : "🔥 THE COUNTDOWN IS ON"}
            </div>
          </div>

          <div className="mt-3 flex max-w-[390px] flex-col items-center justify-center gap-1 text-[11px] font-bold sm:max-w-none sm:flex-row sm:gap-3 sm:text-sm md:mt-4 md:text-lg">
            <span>📅 6 SEPTEMBER 2026</span><span className="hidden text-yellow-400 sm:inline">•</span><span>📍 Tenetelow Sports Ground, UB2 4LW</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:justify-center md:mt-4 md:gap-3">
            {["6 Teams","102 Players","2 Pitches"].map(x => <span key={x} className="rounded-full border border-white/30 bg-black/60 px-4 py-1.5 text-[9px] font-bold uppercase backdrop-blur-md sm:text-xs md:px-5 md:py-2 md:text-sm">{x}</span>)}
            <span className="rounded-full border border-yellow-400/60 bg-yellow-400/15 px-4 py-1.5 text-[9px] font-bold uppercase text-yellow-300 backdrop-blur-md sm:text-xs md:px-5 md:py-2 md:text-sm">1 Champion</span>
          </div>

          {!live && !finished && (
            <div id="vctb-countdown-wrapper" className="mt-4 md:mt-6">
              <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.23em] text-white/80 sm:text-xs md:mb-3 md:text-sm">Tournament Day Begins In</p>
              <div className="grid grid-cols-4 gap-1 sm:gap-3 md:gap-4">
                <CountdownBox id="vctb-days" value={countdown.days} label="Days" />
                <CountdownBox id="vctb-hours" value={countdown.hours} label="Hours" />
                <CountdownBox id="vctb-minutes" value={countdown.minutes} label="Mins" />
                <CountdownBox id="vctb-seconds" value={countdown.seconds} label="Secs" />
              </div>
            </div>
          )}

          <div className="mt-4 flex w-full max-w-[340px] flex-col items-center justify-center sm:w-auto sm:max-w-none md:mt-6">
            <Link id="vctb-main-button" href="/vctb/2026" className="w-full rounded-xl bg-yellow-400 px-7 py-3 text-[11px] font-black uppercase tracking-wide text-[#071a52] shadow-xl transition hover:scale-105 hover:bg-yellow-300 sm:w-auto sm:text-sm md:px-10 md:py-4 md:text-base">
              {live ? "FOLLOW LIVE ACTION →" : finished ? "VIEW VCTB 3.0 RESULTS →" : "ENTER VCTB 3.0 →"}
            </Link>
          </div>
          <p className="mt-3 max-w-[345px] text-[8px] font-bold uppercase leading-4 tracking-[0.09em] text-white/80 sm:max-w-none sm:text-xs md:mt-5 md:text-sm">Live Scores • Fixtures • Results • Statistics • Points Table</p>
        </div>
      </section>

      <section id="club" className="relative overflow-hidden px-4 py-6 md:px-6 md:py-10">
        <div className="absolute inset-0"><Image src="/home/club-bg.jpeg" alt="Club Background" fill className="object-cover opacity-85" /><div className="absolute inset-0 bg-white/45 backdrop-blur-[1px]" /></div>
        <div className="relative z-10 mx-auto max-w-5xl origin-top scale-[0.88]">
          <h2 className="text-5xl font-extrabold text-[#061b52] md:text-6xl">Club Areas</h2>
          <div className="mt-4 flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-blue-600" /><div className="h-2 w-2 rounded-full bg-blue-500" /></div>
          <p className="mt-5 text-lg text-[#1d3158] md:text-xl">Explore everything about Spiders Sports Club UK.</p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubAreas.map(item => (
              <Link key={item.title} href={item.link} className="group relative min-h-[210px] overflow-hidden rounded-3xl border border-blue-200/70 bg-white/75 p-6 shadow-xl transition duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/80 to-blue-100/70" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-blue-200 bg-blue-100/80 text-3xl">{item.icon}</div>
                  <h3 className="text-xl font-extrabold text-[#061b52] md:text-2xl">{item.title}</h3>
                  <div className="mt-3 h-1 w-16 rounded-full bg-blue-600" />
                  <p className="mt-5 max-w-sm text-base leading-7 text-[#17284d]">{item.text}</p>
                  <div className="mt-auto flex items-center justify-between rounded-2xl bg-blue-100/70 px-5 py-4 font-bold text-blue-700"><span>{item.button}</span><span className="text-2xl">→</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="sponsors" className="bg-[#071a52] px-4 py-16 text-white md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-4xl font-extrabold md:text-5xl">Sponsors</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Sponsor src="/sponsors/kiwikmart.png" alt="Kwik Mart" />
            <Sponsor src="/sponsors/jatheesan.png" alt="Jatheesan Ltd" />
            <Sponsor src="/sponsors/sam.jpg" alt="S&M Accountants" />
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white px-4 py-16 text-[#071a52] md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-extrabold md:text-5xl">Contact Us</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-xl">Get in touch with Spiders Sports Club UK for matches, sponsorships, memberships and general enquiries.</p>
        </div>
      </section>

      <section className="bg-[#071a52] py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-6">
          <h2 className="text-center text-2xl font-bold md:text-3xl">Follow Spiders Sports Club UK</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://www.facebook.com/profile.php?id=61553153775249" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3 font-semibold"><FaFacebookF size={22}/>Facebook</a>
            <a href="https://www.instagram.com/spidersscuk_23/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-pink-600 px-6 py-3 font-semibold"><FaInstagram size={22}/>Instagram</a>
            <a href="https://www.youtube.com/@Spiderssportsclubuk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-red-600 px-6 py-3 font-semibold"><FaYoutube size={22}/>YouTube</a>
          </div>
        </div>
      </section>

      <footer className="bg-[#04113a] px-6 py-8 text-center text-white"><p className="text-lg">© 2026 Spiders Sports Club UK. All Rights Reserved.</p></footer>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var START = 1788678000000;
  var END = 1788735600000;
  var timer;

  function el(id) { return document.getElementById(id); }
  function pad(n) { return String(Math.max(0, n)).padStart(2, "0"); }

  function updateVctbCountdown() {
    var now = Date.now();
    var status = el("vctb-status");
    var wrapper = el("vctb-countdown-wrapper");
    var button = el("vctb-main-button");

    if (now >= END) {
      if (wrapper) wrapper.style.display = "none";
      if (status) status.textContent = "🏆 VCTB 3.0 TOURNAMENT RESULTS";
      if (button) button.textContent = "VIEW VCTB 3.0 RESULTS →";
      return;
    }

    if (now >= START) {
      if (wrapper) wrapper.style.display = "none";
      if (status) {
        status.textContent = "● VCTB 3.0 LIVE NOW";
        status.style.background = "#dc2626";
        status.style.color = "#ffffff";
        status.style.borderColor = "#f87171";
      }
      if (button) button.textContent = "FOLLOW LIVE ACTION →";
      return;
    }

    var diff = START - now;
    var d = el("vctb-days");
    var h = el("vctb-hours");
    var m = el("vctb-minutes");
    var s = el("vctb-seconds");

    if (d) d.textContent = pad(Math.floor(diff / 86400000));
    if (h) h.textContent = pad(Math.floor(diff / 3600000) % 24);
    if (m) m.textContent = pad(Math.floor(diff / 60000) % 60);
    if (s) s.textContent = pad(Math.floor(diff / 1000) % 60);
  }

  function startVctbCountdown() {
    updateVctbCountdown();
    if (timer) clearInterval(timer);
    timer = setInterval(updateVctbCountdown, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startVctbCountdown, { once: true });
  } else {
    startVctbCountdown();
  }

  window.addEventListener("pageshow", updateVctbCountdown);
  window.addEventListener("focus", updateVctbCountdown);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) updateVctbCountdown();
  });
})();
          `,
        }}
      />
    </main>
  );
}

function CountdownBox({id,value,label}:{id:string;value:number;label:string}) {
  return (
    <div className="min-w-[58px] rounded-lg border border-white/30 bg-black/70 px-1.5 py-2.5 text-center shadow-xl backdrop-blur-md sm:min-w-[80px] sm:px-4 sm:py-3 md:min-w-[105px] md:px-5 md:py-4">
      <div id={id} suppressHydrationWarning className="text-lg font-black leading-none text-yellow-400 sm:text-2xl md:text-4xl">{String(value).padStart(2,"0")}</div>
      <div className="mt-1 text-[7px] font-bold uppercase tracking-[0.1em] text-white/80 sm:text-[9px] md:text-xs">{label}</div>
    </div>
  );
}

function Sponsor({src,alt}:{src:string;alt:string}) {
  return <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-xl"><Image src={src} alt={alt} width={250} height={120} className="object-contain" /></div>;
}
