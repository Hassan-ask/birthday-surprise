import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES — cinematic dark velvet 3D
═══════════════════════════════════════════════════════════════ */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600;700&family=Alex+Brush&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: #04020a;
        color: #f0e6d3;
        overflow-x: hidden;
        font-family: 'Jost', system-ui, sans-serif;
      }
      #root { min-height: 100vh; }

      :root {
        --bg:        #04020a;
        --bg2:       #08040f;
        --surface:   rgba(255,240,210,0.06);
        --surface2:  rgba(255,240,210,0.10);
        --border:    rgba(255,220,160,0.14);
        --border2:   rgba(255,220,160,0.28);
        --cream:     #f0e6d3;
        --cream2:    rgba(240,230,211,0.70);
        --gold:      #c9a84c;
        --gold2:     #e8c97a;
        --gold3:     #fff1c2;
        --rose:      #d4536b;
        --rose2:     #f07090;
        --wine:      #6b1028;
        --crimson:   #3d0817;
        --shadow:    rgba(0,0,0,0.7);
      }

      ::selection { background: rgba(201,168,76,0.28); color: #fff; }

      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #04020a; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,var(--gold),var(--rose)); border-radius: 99px; }

      .app-root {
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
        padding: clamp(12px, 2.5vw, 28px);
        perspective: 1200px;
      }

      /* ── Cinematic Background ── */
      .cin-bg {
        position: fixed; inset: 0; z-index: 0;
        background:
          radial-gradient(ellipse 70% 55% at 15% 12%, rgba(212,83,107,0.20) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 88% 18%, rgba(201,168,76,0.16) 0%, transparent 55%),
          radial-gradient(ellipse 80% 60% at 50% 100%, rgba(107,16,40,0.55) 0%, transparent 55%),
          linear-gradient(160deg, #08020e 0%, #0d040f 30%, #150818 55%, #0a0310 100%);
        pointer-events: none;
      }
      .cin-bg::before {
        content: '';
        position: absolute; inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E");
        opacity: 0.09; mix-blend-mode: screen;
      }
      .cin-bg::after {
        content: '';
        position: absolute; inset: 0;
        background:
          linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 22%, transparent 74%, rgba(0,0,0,0.65) 100%),
          radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.45) 100%);
      }

      /* ── 3D Orbs ── */
      .orb {
        position: fixed; border-radius: 50%;
        filter: blur(30px); pointer-events: none; z-index: 0;
        animation: orbFloat 14s ease-in-out infinite;
        will-change: transform;
      }
      .orb1 { width:44vw; height:44vw; max-width:520px; max-height:520px; left:-10%; top:-8%;  background:radial-gradient(circle at 40% 35%, rgba(212,83,107,0.28), rgba(107,16,40,0.12) 70%); }
      .orb2 { width:38vw; height:38vw; max-width:440px; max-height:440px; right:-8%; top: 2%; background:radial-gradient(circle at 55% 40%, rgba(201,168,76,0.20), rgba(107,16,40,0.06) 70%); animation-delay:-5s; animation-duration:17s; }
      .orb3 { width:36vw; height:36vw; max-width:400px; max-height:400px; left:36%;bottom:-15%; background:radial-gradient(circle at 45% 40%, rgba(107,16,40,0.65), rgba(10,3,16,0.1) 70%); animation-delay:-9s; animation-duration:20s; }

      @keyframes orbFloat {
        0%,100% { transform: translate3d(0,0,0) scale(1); }
        33%  { transform: translate3d(18px,-22px,0) scale(1.06); }
        66%  { transform: translate3d(-12px,16px,0) scale(0.96); }
      }

      /* ── Particle Dust ── */
      .dust-wrap { position:fixed; inset:0; z-index:1; pointer-events:none; overflow:hidden; }
      .dust-p {
        position:absolute; width:2px; height:2px; border-radius:50%;
        background:rgba(232,201,122,0.75);
        box-shadow: 0 0 8px rgba(232,201,122,0.55);
        animation: dustDrift linear infinite;
        will-change: transform, opacity;
      }
      @keyframes dustDrift {
        0%   { transform:translateY(0) translateX(0); opacity:0; }
        15%  { opacity:0.6; }
        85%  { opacity:0.4; }
        100% { transform:translateY(-120vh) translateX(var(--dx,20px)); opacity:0; }
      }

      /* ── Film Grain ── */
      .grain {
        position:fixed; inset:0; z-index:2; pointer-events:none; opacity:0.035;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='380' height='380'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='380' height='380' filter='url(%23g)' opacity='0.06'/%3E%3C/svg%3E");
        mix-blend-mode:overlay;
      }

      /* ── Vignette ── */
      .vignette {
        position:fixed; inset:0; z-index:2; pointer-events:none;
        background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.72) 100%);
      }

      /* ── Main Layout ── */
      .stage {
        position:relative; z-index:10;
        width: min(1180px, 100%);
        margin: 0 auto;
        min-height: calc(100vh - clamp(24px, 5vw, 56px));
        display:flex; flex-direction:column; justify-content:center; gap:18px;
      }

      /* ── Cards ── */
      .card {
        position:relative; overflow:hidden;
        border-radius: clamp(24px,4vw,44px);
        padding: clamp(22px,4.5vw,58px);
        background: linear-gradient(145deg, rgba(255,240,210,0.085), rgba(255,240,210,0.038));
        border: 1px solid var(--border);
        box-shadow:
          0 18px 55px rgba(0,0,0,0.55),
          0 6px 20px rgba(0,0,0,0.35),
          inset 0 1px 0 rgba(255,255,255,0.10),
          inset 0 -1px 0 rgba(0,0,0,0.3);
        backdrop-filter: blur(8px) saturate(120%);
        -webkit-backdrop-filter: blur(8px) saturate(120%);
        transform-style: preserve-3d;
        will-change: transform;
      }
      .card::before {
        content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
        background:
          linear-gradient(125deg, rgba(255,255,255,0.12) 0%, transparent 25%, transparent 72%, rgba(201,168,76,0.10) 100%),
          radial-gradient(ellipse at top right, rgba(212,83,107,0.09), transparent 42%);
      }
      .card::after {
        content:''; position:absolute; top:0; left:15%; right:15%; height:1px;
        background: linear-gradient(90deg, transparent, rgba(255,220,160,0.45), rgba(255,255,255,0.25), rgba(255,220,160,0.45), transparent);
      }
      .card-inner { position:relative; z-index:1; }
      .card.wide { max-width:1160px; }
      .card.normal { max-width:920px; }
      .card.narrow { max-width:720px; }

      /* ── Typography ── */
      .f-display { font-family:'Playfair Display', Georgia, serif; }
      .f-body { font-family:'Jost', system-ui, sans-serif; }
      .f-script { font-family:'Alex Brush', cursive; }

      .title-xl {
        font-family:'Playfair Display', serif;
        font-size: clamp(2.8rem, 8vw, 7rem);
        line-height: 0.88;
        font-weight: 700;
        letter-spacing: -0.055em;
        color: var(--cream);
      }
      .title-lg {
        font-family:'Playfair Display', serif;
        font-size: clamp(2.4rem, 6vw, 5.2rem);
        line-height: 0.9;
        font-weight: 700;
        letter-spacing: -0.045em;
        color: var(--cream);
      }
      .title-md {
        font-family:'Playfair Display', serif;
        font-size: clamp(1.8rem, 4vw, 3.4rem);
        line-height: 0.95;
        font-weight: 600;
        letter-spacing: -0.03em;
        color: var(--cream);
      }

      .gold-shine {
        background: linear-gradient(92deg, #c9a84c 0%, #e8c97a 22%, #fff8e0 42%, #e8c97a 58%, #c9a84c 78%, #e8c97a 100%);
        background-size: 250% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: goldShine 9s linear infinite;
      }
      .rose-shine {
        background: linear-gradient(92deg, #6b1028 0%, #d4536b 25%, #f07090 45%, #d4536b 65%, #6b1028 100%);
        background-size: 250% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: goldShine 8s linear infinite;
      }
      @keyframes goldShine { to { background-position: 250% center; } }

      .copy {
        font-family:'Jost', sans-serif;
        color: var(--cream2);
        line-height: 1.85;
        font-size: clamp(0.93rem, 1.7vw, 1.06rem);
      }

      /* ── Kicker / Badge ── */
      .kicker {
        display:inline-flex; align-items:center; gap:8px;
        padding: .42rem .85rem;
        border: 1px solid rgba(201,168,76,0.30);
        background: rgba(201,168,76,0.08);
        border-radius: 999px;
        font-size:.66rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase;
        color: var(--gold2);
        font-family:'Jost',sans-serif;
      }

      /* ── Buttons ── */
      .btn {
        position:relative; display:inline-flex; align-items:center; justify-content:center; gap:8px;
        padding: .78rem 1.55rem; border:0; border-radius:14px;
        font-family:'Jost',sans-serif; font-weight:700; font-size:.88rem; letter-spacing:0.02em;
        cursor:pointer; overflow:hidden;
        transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s;
        will-change: transform;
      }
      .btn-primary {
        background: linear-gradient(135deg, #a06010 0%, var(--gold) 35%, var(--rose2) 100%);
        color: #0d0408;
        box-shadow: 0 10px 38px rgba(212,83,107,0.30), 0 4px 16px rgba(201,168,76,0.18);
      }
      .btn-primary::before {
        content:''; position:absolute; inset:0;
        background: linear-gradient(135deg, rgba(255,255,255,0.22), transparent 50%);
        border-radius:inherit;
      }
      .btn-secondary {
        color: var(--cream); font-weight:600;
        background: rgba(255,240,210,0.07);
        border: 1px solid rgba(255,220,160,0.20);
        box-shadow: 0 4px 20px rgba(0,0,0,0.30);
      }
      .btn-ghost {
        color: var(--gold2); font-weight:600;
        background: rgba(201,168,76,0.05);
        border: 1px dashed rgba(201,168,76,0.30);
      }
      .btn:hover { transform: translateY(-3px) scale(1.02); }
      .btn:active { transform: translateY(0) scale(.98); }

      /* ── Mini Cards ── */
      .mini-card {
        position:relative; overflow:hidden;
        border-radius: 22px; padding: 1.35rem;
        background: linear-gradient(145deg, rgba(255,240,210,0.085), rgba(255,240,210,0.035));
        border: 1px solid var(--border);
        box-shadow: 0 18px 52px rgba(0,0,0,0.30);
        transition: transform .28s cubic-bezier(.16,1,.3,1), border-color .28s, box-shadow .28s;
        cursor: pointer;
        transform-style: preserve-3d;
        will-change: transform;
      }
      .mini-card:hover {
        transform: translateY(-7px) rotateX(2deg);
        border-color: rgba(201,168,76,0.38);
        box-shadow: 0 28px 70px rgba(0,0,0,0.50), 0 0 40px rgba(201,168,76,0.10);
      }
      .mini-card::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background: linear-gradient(90deg, transparent, rgba(255,220,160,0.40), transparent);
      }
      .mini-card.dark {
        background: linear-gradient(145deg, rgba(61,8,23,0.75), rgba(20,4,10,0.90));
        border-color: rgba(212,83,107,0.18);
      }
      .mini-card.dark:hover { border-color: rgba(212,83,107,0.45); box-shadow: 0 28px 70px rgba(0,0,0,0.50), 0 0 40px rgba(212,83,107,0.15); }

      /* ── Silhouette ── */
      .silhouette {
        border-radius: 28px; overflow:hidden; position:relative;
        background: linear-gradient(180deg, #04010a 0%, #12040e 40%, #4a0d22 80%, #1e0610 100%);
        border: 1px solid rgba(255,220,160,0.13);
        box-shadow: 0 28px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
      }
      .silhouette.compact { min-height: 260px; }
      .silhouette.full { min-height: 340px; }

      .sil-star { position:absolute; border-radius:50%; background:rgba(255,248,225,.85); animation:silStarTwinkle 2.8s ease-in-out infinite; }
      @keyframes silStarTwinkle { 50%{opacity:.2; transform:scale(.5);} }

      .romantic-snow {
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,.88);
        box-shadow:0 0 10px rgba(255,255,255,.65);
        pointer-events:none;
        z-index:5;
        animation-name: romanticSnowFall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        will-change: transform, opacity;
      }
      @keyframes romanticSnowFall {
        0%   { transform: translate3d(0,-20px,0); opacity:0; }
        10%  { opacity:.85; }
        82%  { opacity:.72; }
        100% { transform: translate3d(var(--drift, 22px), 350px,0); opacity:0; }
      }

      .sil-moon {
        position:absolute; top:22px; right:28px;
        width:56px; height:56px; border-radius:50%;
        background: radial-gradient(circle at 34% 32%, #fff9e0, #e8cc78 55%, rgba(201,168,76,0.15));
        box-shadow: 0 0 50px rgba(232,200,120,0.40);
        animation: moonGlow 4s ease-in-out infinite;
      }
      @keyframes moonGlow { 50%{box-shadow:0 0 80px rgba(232,200,120,0.70); transform:translateY(-5px);} }

      /* ── Progress Header ── */
      .progress-head {
        position:sticky; top:12px; z-index:50;
        border-radius:22px; padding:.88rem 1.1rem;
        background: rgba(8,4,15,0.80);
        border: 1px solid var(--border);
        box-shadow: 0 16px 55px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07);
        backdrop-filter: blur(10px) saturate(125%);
        -webkit-backdrop-filter: blur(10px) saturate(125%);
      }
      .progress-bar-track {
        height:4px; border-radius:99px; background:rgba(255,240,210,0.08); overflow:hidden; margin-top:11px;
      }


      /* ── Heart Game ── */
      .heart-btn { position:absolute; transform:translate(-50%,-50%); border:0; background:transparent; cursor:pointer; font-size:clamp(1.6rem,3.5vw,2.6rem); filter:drop-shadow(0 8px 18px rgba(212,83,107,0.45)); transition:transform .12s; }
      .heart-btn:hover { transform:translate(-50%,-50%) scale(1.25); filter:drop-shadow(0 12px 28px rgba(212,83,107,0.75)); }
      .heart-btn:active { transform:translate(-50%,-50%) scale(.9); }

      /* ── 3D Hover Cards ── */
      .tilt-card { transform-style:preserve-3d; will-change:transform; }

      /* ── Typing cursor ── */
      .type-cursor { display:inline-block; width:2px; height:1em; background:var(--gold2); margin-left:3px; vertical-align:middle; animation:blinkCursor .7s step-end infinite; }
      @keyframes blinkCursor { 50%{opacity:0;} }

      /* ── Letter Paper ── */
      .letter-paper {
        border-radius:24px; padding: clamp(1.4rem,4vw,2.6rem);
        background: linear-gradient(155deg, rgba(255,249,235,0.96) 0%, rgba(255,242,215,0.92) 100%);
        color: #2a0b12;
        position:relative; overflow:hidden;
        box-shadow: 0 30px 80px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.7);
      }
      .letter-paper::before {
        content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
        background-image: repeating-linear-gradient(transparent, transparent 31px, rgba(107,16,40,0.05) 31px, rgba(107,16,40,0.05) 32px);
      }
      .letter-paper::after {
        content:''; position:absolute; top:0; bottom:0; left:52px; width:1px;
        background: rgba(201,100,100,0.16);
      }

      /* ── Emoji Rain ── */
      .rain-wrap { position:fixed; inset:0; z-index:999; pointer-events:none; overflow:hidden; }

      /* ── Hidden Button ── */
      .hidden-btn-wrap { position:fixed; left:16px; bottom:16px; z-index:200; }

      /* ── Confetti ── */
      .confetti-wrap { position:fixed; inset:0; z-index:998; pointer-events:none; overflow:hidden; }

      /* ── Nav row ── */
      .nav-row { display:flex; justify-content:center; align-items:center; gap:12px; flex-wrap:wrap; margin-top:1.55rem; }

      /* ── Grid helpers ── */
      .grid-2 { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr)); gap:clamp(1.4rem,3vw,2.6rem); align-items:center; }
      .grid-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:14px; }
      .grid-promises { display:grid; gap:11px; max-width:760px; margin:0 auto; }


      /* ── Performance tune: smoother on mobile/low-end devices ── */
      .cin-bg::before, .grain { opacity:0.018; }
      .orb { filter: blur(30px); opacity:.75; }
      .card, .mini-card, .progress-head { will-change: auto; }
      .heart-btn { will-change: transform; }

      @media(max-width:760px) {
        .orb { display:none; }
        .dust-wrap, .grain { display:none; }
        .card { backdrop-filter:none; -webkit-backdrop-filter:none; box-shadow:0 14px 38px rgba(0,0,0,.55); }
        .mini-card { box-shadow:0 10px 28px rgba(0,0,0,.35); }
      }
      @media(max-width:660px) {
        .card { padding: 18px; border-radius: 24px; }
        .sil-moon { width:44px; height:44px; top:14px; right:16px; }

        /* Mobile fix only for Heart Game screen */
        .heart-screen {
          padding: 12px !important;
          overflow: visible !important;
        }
        .heart-screen .title-lg {
          font-size: clamp(2rem, 10vw, 2.7rem) !important;
          line-height: 1 !important;
          letter-spacing: -0.035em !important;
        }
        .heart-screen .copy {
          font-size: .88rem !important;
          line-height: 1.62 !important;
        }
        .heart-game-layout {
          grid-template-columns: 1fr !important;
          gap: 12px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .heart-arena {
          height: min(58svh, 380px) !important;
          min-height: 330px !important;
          width: 100% !important;
          border-radius: 20px !important;
        }
        .heart-arena-start {
          padding: 16px !important;
          gap: 10px !important;
        }
        .heart-arena-start .heart-start-icon {
          font-size: 3.8rem !important;
        }
        .heart-arena-start .heart-start-title {
          font-size: clamp(1.45rem, 8vw, 2.1rem) !important;
        }
        .heart-progress-row {
          top: 10px !important;
          left: 10px !important;
          right: 10px !important;
          gap: 7px !important;
        }
        .heart-progress-row .heart-count-pill {
          padding: .36rem .62rem !important;
          white-space: nowrap !important;
        }
        .heart-progress-row .heart-count-pill p {
          font-size: .68rem !important;
        }
        .heart-progress-bar {
          max-width: none !important;
          height: 7px !important;
        }
        .heart-btn {
          font-size: clamp(1.8rem, 9vw, 2.4rem) !important;
          z-index: 5 !important;
        }
        .heart-info-panel {
          min-height: auto !important;
          width: 100% !important;
          padding: 1rem !important;
          border-radius: 20px !important;
        }
        .heart-info-panel .heart-panel-title {
          font-size: 1.35rem !important;
        }
        .heart-unlock-list {
          gap: 8px !important;
        }
        .heart-secret-card {
          padding: .65rem .75rem !important;
          border-radius: 14px !important;
        }
        .heart-secret-card .copy {
          font-size: .78rem !important;
          line-height: 1.45 !important;
        }
        .heart-screen .nav-row {
          margin-top: 1rem !important;
        }
        .heart-screen .btn {
          padding: .66rem 1rem !important;
          font-size: .8rem !important;
        }
      }
      @media(prefers-reduced-motion:reduce) {
        *, *::before, *::after { animation-duration:.001ms !important; animation-iteration-count:1 !important; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════════════════════ */
const CONFIG = {
  herName: "Fariha",
  yourName: "Mohammad Hassan",
  password: "future",
  passwordHint: "hamari woh manzil jahan dua, izzat, pyaar ho 🙈",
  musicUrl: "/music/romantic.mp3",
  personalLines: [
    "Fariha, aaj ka surprise meri taraf se ek digital gift nahi, meri mohabbat ka woh lifafa hai jisme care, respect, loyalty aur sirf aap ke liye likhi hui dhadkanein rakhi hain. ❤️",
    "Aap se baat ho to lagta hai din ne apni awaaz halki kar li, waqt ne speed kam kar di, aur dil ne chupke se keh diya: is insan ko hamesha naram lafzon me sambhalna. 🤍",
    "Main superhero nahi, lekin aap ke liye duaon ka guard, mood ka mechanic, smile ka supplier, aur husband-material ka full-time trainee ban kar ready hoon. ✨",
  ],
  futureWifeFeatures: [
    { emoji:"😊", label:"Muskurahat", title:"Woh Smile Jis Par Dil Ka Password Unlock Ho Jaye", desc:"Aapki muskurahat aisi hai ke banda serious rehne ka irada kare, phir bhi dil apni kursi se uth kar clap kar deta hai. Ye smile normal nahi, meri daily peace ki premium subscription hai." },
    { emoji:"🌸", label:"Nazakat", title:"Haya Ki Khushboo Aur Adaab Ki Roshni", desc:"Aapki personality me shor nahi, lekin asar bohot gehra hai. Aapka tameez se bolna, nazakat se behave karna aur apni limits ko samajhna dil ko izzat se attract karta hai." },
    { emoji:"🔐", label:"Amanat", title:"Trust Jise Main Dil Ke Locker Me Rakhta Hoon", desc:"Aapka bharosa mere liye koi casual cheez nahi; ye meri zimmedari ka sab se khoobsurat imtehan hai. Aapki baat, aapka comfort aur aapki privacy mere liye sacred zone hai." },
    { emoji:"💬", label:"Baat", title:"Conversation Jo Seedha Rooh Tak Utar Jaye", desc:"Aap se guftagu me na banawat hoti hai, na thakan. Jaise har message ke baad dil ko ek choti si chai milti ho aur mood kehta ho: haan bhai, ab din behtar hai." },
    { emoji:"🏡", label:"Ghar", title:"Future Jahan Mohabbat Bhi Ho Aur Sukoon Bhi", desc:"Aap ke saath kal ka tasavvur kisi noisy dream jaisa nahi, ek peaceful ghar jaisa lagta hai; duaon ki mehfil, families ki khushi, choti nok-jhok, aur meri taraf se emergency food diplomacy." },
    { emoji:"💎", label:"Qeemat", title:"Aisi Qadar Jo Lafzon Se Aage Nikal Jaye", desc:"Aap mere liye sirf pasand ka naam nahi; aap woh insan hain jinki feelings ko samajhna, mood ko protect karna aur izzat ko priority dena mere dil ki khushi ban gaya hai." },
  ],
  whySpecial: [
    { emoji:"💫", title:"Dil Ka Sukoon", text:"Aapki presence me ajeeb si softness hai; jaise thaki hui soch ko bhi koi keh raha ho ke fikar mat karo, yahan pyaar bhi tameez se milta hai." },
    { emoji:"❤️", title:"Safe Feeling", text:"Aap ke qareeb hone ka ehsaas dil ko secure karta hai; wahan judgement nahi hoti, bas samajh, ehtram aur ek meethi si closeness mehsoos hoti hai." },
    { emoji:"🌙", title:"Waqt Ki Chori", text:"Aap se baat shuru ho to clock bhi thora corrupt ho jata hai; minutes chupke se hours ban jate hain aur mujhe complaint karne ka bilkul mann nahi karta." },
    { emoji:"🤍", title:"Izzat Wali Mohabbat", text:"Mere liye real love wahi hai jahan pehle Allah ka khauf, phir families ki khushi, phir ek dusre ki dignity ka khayal rakha jaye." },
    { emoji:"🌷", title:"Narmi Ka Jadoo", text:"Aapki nature me woh graceful calmness hai jo zabardasti impress nahi karti, bas dheere se dil ke darwaze par dastak de kar andar aa jati hai." },
    { emoji:"😄", title:"Cute Drama Department", text:"Kabhi aap itni masoom serious ho jati hain ke mujhe lagta hai viva chal raha hai; phir ek choti si baat se hansi aa jaye to mera poora system reboot ho jata hai." },
  ],
  promises: [
    { icon:"🛡️", text:"Main aapki self-respect ko apni feelings se bhi pehle rakhunga, kyunki jo mohabbat izzat na de woh sirf lafzon ka shor hoti hai." },
    { icon:"🕊️", text:"Main chahunga har qadam halal niyat, dua, aapki raza aur dono gharon ki khushi ke saath uthe; jaldi se zyada barkat zaroori hai." },
    { icon:"🤍", text:"Agar meri koi baat kabhi aapke dil ko chhoo kar dukh de, main defend karne se pehle samajhne ki koshish karunga." },
    { icon:"💌", text:"Main aapko sirf birthday par princess feel nahi karwana chahta, routine ke random dinon me bhi aapko apni priority mehsoos karwana chahta hoon." },
    { icon:"🌍", text:"Zindagi jahan bhi le jaye, meri koshish rahegi ke aap meri wajah se kabhi akeli, ignored ya unvalued feel na karen." },
    { icon:"😄", text:"Mood off hua to pehle pyaar se poochunga, phir joke try karunga, phir food plan activate hoga; aur agar phir bhi smile na aaye to main khud meme ban jaunga." },
  ],
  birthdayPresents: [
    { emoji:"🤲", title:"Dua Ka Tohfa", text:"Allah aapke naseeb me wo roshni likhe jo aankhon me chamak, dil me itminan aur zindagi me asani ban kar utare. Ameen." },
    { emoji:"🌹", title:"Ehtram Ka Gulab", text:"Meri taraf se sab se pehla gift ye hai ke aapki dignity, choices aur boundaries ko hamesha serious value milegi." },
    { emoji:"🔐", title:"Raazdari Ka Promise", text:"Jo baat aap bharose se share karen, us par meri zubaan ka lock aur dil ki hifazat dono lagay rahenge." },
    { emoji:"💌", title:"Waqt Ka Voucher", text:"Busy schedule apni jagah, lekin aap ke liye waqt nikalna meri majboori nahi, meri favourite aadat ban sakti hai." },
    { emoji:"🌙", title:"Sukoon Ki Chadar", text:"Meri tamanna hai ke mere saath aapko panic nahi, peace mile; sawal nahi, samajh mile; distance nahi, gentle closeness mile." },
    { emoji:"🍝", title:"Food Treaty", text:"Aapki cravings ko national emergency declare kiya jayega, meri fish fry ko opposition ka haq milega, aur dessert par dono ki coalition government banegi." },
  ],
  heartGameSecrets: [
    { label:"Roshan", text:"Aapki hansi andheray mood me fairy lights jaisi lagti hai." },
    { label:"Aman", text:"Mujhe aapka bharosa jeetna nahi, roz nibhana hai." },
    { label:"Qurbat", text:"Aapki baaton ka lehja dil ko ghar ki dehleez jaisa mehfooz lagta hai." },
    { label:"Kal", text:"Aap ke saath future ka khayal plan se zyada dua ban kar aata hai." },
    { label:"Ameen", text:"Allah hamare liye woh raasta kholay jisme izzat, asani aur dono families ki muskurahat ho." },
  ],
  letter: `Meri Pyaari Fariha,

Happy 20th Birthday, meri dil ki sab se khoobsurat dua. ❤️

Aaj main sirf wish nahi kar raha; aaj main apne dil ka woh hissa aapke naam likh raha hoon jo shayad normal dinon me lafzon ke peeche chup jata hai. Aapki birthday mere liye ek date nahi, ek ehsaas hai ke duniya me ek aisi ladki bhi hai jiska naam aate hi mere andar ki sakhti pighal jati hai aur dil bohot narmi se muskura deta hai.

Fariha, aapki beauty sirf face ki baat nahi. Aapki asli khoobsurti aapki haya, aapki tameez, aapki soft voice, aapka respectful nature aur woh masoom sa andaaz hai jo kisi ko bhi overacting ke baghair deeply special feel kara de. Aap chalti phirti poetry nahi; aap woh page hain jise parh kar insan dua mangna seekh leta hai.

Kabhi kabhi sochta hoon ke main aap se itna attach kyun feel karta hoon. Phir jawab bohot simple milta hai: aap me show off kam, sincerity zyada hai; aap me attitude kam, grace zyada hai; aap me noise kam, sukoon zyada hai. Aur shayad isi liye mera dil aapki taraf sirf attract nahi hota, aapki izzat karna bhi chahta hai.

Aapki ek muskurahat meri poori planning kharab kar sakti hai. Main sochta hoon aaj mature banunga, thora composed rahunga, lekin phir aapki smile ka khayal aata hai aur mera inner gentleman bhi kehta hai: bhai, ye case emotional court me chala gaya hai. Sach kahun to aapki hansi meri favourite notification hai, bas uski ringtone seedha dil me bajti hai.

Meri mohabbat ka matlab sirf romantic lines nahi. Mere liye pyaar ka matlab hai aapki baat ghour se sunna, aapki thakan ko samajhna, aapke mood ki respect karna, aapki privacy ko protect karna, aur aapki aankhon me kabhi meri wajah se pareshani na aane dena. Main chahta hoon ke agar kabhi aap mera naam sochen to dil kahe: haan, is insan ke paas meri izzat safe hai.

Main aapko chand sitaray tod kar dene ka jhoot nahi bolunga, kyunki mujhe electrician ka bhi itna experience nahi. Lekin main ye keh sakta hoon ke InshaAllah aapke liye har roz choti choti care jama karta rahunga; kabhi dua ki shakal me, kabhi message ki shakal me, kabhi samajhne ki shakal me, aur kabhi aisi silly baat ki shakal me jo aapko hasne par majboor kar de.

Aap meri nazar me woh queen hain jinki crown gold ka nahi, dignity ka bana hua hai. Aapko impress karne se zyada main aapko secure feel karwana chahta hoon. Aapko chase karne se zyada main aapka trust deserve karna chahta hoon. Aapko sirf apna kehne se zyada main aapke liye apna character behtar banana chahta hoon.

Ek choti si shayari aap ke naam:

Teri muskurahat se meri subah me ujala hota hai,
Tera naam aaye to dil ka lehja nirala hota hai,
Main lafzon me chhupa loon jo mohabbat meri,
Phir bhi har dua me tera hi hawala hota hai.

Aur ek aur, kyunki birthday hai aur Hassan ko thora dramatic hone ka legal permission mil gaya:

Tum ho to baat me narmi, khayal me rang aata hai,
Dil be-sabab bhi khush ho kar shukr ka geet gata hai,
Main maangta hoon bas itni si barkat apni zindagi me,
Jahan tumhara sukoon ho, wahin mera ghar ban jata hai.

Fariha, future Allah ke haath me hai. Main hawa me mahal banane ke bajaye dua me raasta mangna pasand karta hoon. Meri niyat ye hai ke agar Allah ne hum dono ke liye behtari likhi ho, to har step izzat, halal asani, families ki razamandi aur khushi ke saath ho. Mujhe jaldi nahi, mujhe barkat chahiye. Mujhe drama nahi, mujhe sukoon wali mohabbat chahiye.

Agar kabhi aap udaas hon, main sirf ye nahi kehna chahta ke smile karo. Main pehle ye poochna chahta hoon ke dil par bojh kis baat ka hai. Agar aap chup rehna chahen to main aapki khamoshi ko bhi respect karunga. Agar aap bolna chahen to main beech me apni unnecessary TED Talk nahi shuru karunga, Thora mushkil hoga, lekin aap ke liye main apni commentary volume low kar sakta hoon.

Aur haan, birthday ke baad bhi ye na samajhna ke romance ka monthly package expire ho gaya. InshaAllah care renewal automatic rahegi, dua unlimited rahegi, loyalty lifetime plan me hogi, aur jokes kabhi kabhi itne bekaar honge ke aapko hasna hi padega. Warna main claim kar dunga ke meri comedy advanced level ki hai, samajhne me waqt lagta hai.

Meri dua hai ke Allah aapki zindagi me woh log rakhe jo aapko samjhein, aapki qadar karen, aur aapki rooh ko halka rakhen. Allah aapko har buri nazar, har unnecessary tension aur har aisi cheez se mehfooz rakhe jo aapki smile kam kare. Aapka dil hamesha roshan rahe, aapki aankhon me umeed rahe, aur aapki zindagi me woh khushi aaye jo aap chup chap deserve karti hain.

Aaj ke din main bas itna kehna chahta hoon: aap mere liye aam nahi hain. Aap woh naam hain jo dua me aaye to lafz khud adab se seedhe ho jate hain. Aap woh feeling hain jo dil ko caring bana deti hai. Aap woh insan hain jiske liye main better, softer, more responsible aur zyada sincere banna chahta hoon.

Happy Birthday, meri pyaari Fariha. Aapki har saal-girah par Allah aapko aur zyada izzat, sehat, khushi, noor aur sukoon ata kare. Aur agar Allah ne chaha, to ek din main aapko sirf message me nahi, haq se, izzat se, aur zindagi bhar wali zimmedari ke saath birthday wish karunga.

Hamesha respect, care, dua, mohabbat aur thori si hasi mazak ke saath,
Mohammad Hassan 💌`,
  hiddenSecret: "Confession time: aapki smile mere dil ka screenshot le leti hai, aur phir main poora din normal behave karne ki acting karta rehta hoon. ❤️",
  finalMessage: `Happy 20th Birthday, Fariha ❤️
Allah aapki zindagi me noor, dil me sukoon, chehre par asli muskurahat aur qismat me behtareen faislay likhe.
Meri dua hai ke agar hum ek dusre ke liye behtar hain, to Allah hamare darmiyan izzat, halal asani, families ki khushi aur mohabbat ki barkat rakh de. Ameen 🤍`,
};

const STEPS = ["Welcome","Qualities","Special","Game","Promises","Presents","Letter","Finale"];

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════════════ */
const pageVar = {
  hidden: { opacity:0, y:22 },
  show:   { opacity:1, y:0, transition:{ duration:.42, ease:[.22,1,.36,1] } },
  exit:   { opacity:0, y:-14, transition:{ duration:.2 } },
};
const staggerVar = { hidden:{}, show:{ transition:{ staggerChildren:.045 } } };
const fadeUpVar  = { hidden:{ opacity:0, y:18 }, show:{ opacity:1, y:0, transition:{ duration:.38, ease:[.22,1,.36,1] } } };

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════════════════ */
function CinBG() {
  const dust = useMemo(() => Array.from({length:12},(_,i)=>({
    id:i,
    left:`${Math.random()*100}%`,
    bottom:`-${5+Math.random()*10}%`,
    delay:`${Math.random()*12}s`,
    dur:`${14+Math.random()*12}s`,
    dx:`${-30+Math.random()*60}px`,
    op: 0.25+Math.random()*0.45,
  })),[]);
  return (
    <>
      <div className="cin-bg"/>
      <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
      <div className="dust-wrap">
        {dust.map(p=>(
          <span key={p.id} className="dust-p" style={{
            left:p.left, bottom:p.bottom,
            animationDelay:p.delay, animationDuration:p.dur,
            opacity:p.op, '--dx':p.dx,
          }}/>
        ))}
      </div>
      <div className="grain"/>
      <div className="vignette"/>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EMOJI RAIN + CONFETTI
═══════════════════════════════════════════════════════════════ */
function EmojiRain({active, emojis=["❤️","💖","✨"], count=14}) {
  if(!active) return null;
  return (
    <div className="rain-wrap">
      {Array.from({length:count}).map((_,i)=>(
        <motion.div key={i} style={{position:"absolute", fontSize:"clamp(.9rem,2.8vw,2rem)"}}
          initial={{y:"108vh", x:`${(i*41)%100}vw`, opacity:0, scale:.3, rotate:0}}
          animate={{y:"-12vh", opacity:[0,1,1,.4,0], scale:[.3,1.2,1,1], rotate:[0,20,-15,8]}}
          transition={{duration:3+(i%5)*.22, delay:(i%8)*.06, ease:"easeOut"}}>
          {emojis[i%emojis.length]}
        </motion.div>
      ))}
    </div>
  );
}
function Confetti({active}) {
  if(!active) return null;
  return (
    <div className="confetti-wrap">
      {Array.from({length:34}).map((_,i)=>(
        <motion.div key={i} style={{position:"absolute", fontSize:"clamp(.8rem,2.2vw,1.6rem)"}}
          initial={{y:-70, x:`${(i*31)%100}vw`, opacity:1, rotate:0, scale:.6}}
          animate={{y:"112vh", rotate:540+(i%7)*70, opacity:[1,1,.7,0], scale:[.6,1.2,1]}}
          transition={{duration:3.2+(i%6)*.3, delay:(i%9)*.055, ease:"easeIn"}}>
          {["🎊","🎉","✨","💖","🌷","💍","💌","🥂","⭐"][i%9]}
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D TILT CARD
═══════════════════════════════════════════════════════════════ */
function TiltCard({children, style={}, className=""}) {
  return (
    <motion.div
      style={{transformPerspective:700, ...style}}
      whileHover={{y:-3, scale:1.008}}
      transition={{duration:.22, ease:[.22,1,.36,1]}}
      className={`tilt-card ${className}`}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SILHOUETTE
═══════════════════════════════════════════════════════════════ */
function Silhouette({compact=false}) {
  const snow = useMemo(()=>Array.from({length:compact?18:34},(_,i)=>({
    id:i,
    left:`${Math.random()*100}%`,
    top:`-${8+Math.random()*35}px`,
    size:`${1.6+Math.random()*3.2}px`,
    drift:`${-42+Math.random()*84}px`,
    delay:`${Math.random()*5.5}s`,
    dur:`${6.5+Math.random()*5.5}s`,
    opacity:.42+Math.random()*.48,
  })),[compact]);

  return (
    <div className={`silhouette ${compact?"compact":"full"}`} style={{
      backgroundImage:`
        linear-gradient(180deg, rgba(4,2,10,.05) 0%, rgba(10,3,15,.08) 35%, rgba(61,8,23,.34) 72%, rgba(4,1,10,.86) 100%),
        radial-gradient(circle at 50% 25%, rgba(255,230,150,.12), transparent 34%),
        url("/images/romantic-couple.jpg")
      `,
      backgroundSize:"cover, cover, cover",
      backgroundPosition:"center, center, center 54%",
      backgroundRepeat:"no-repeat",
      border:"1px solid rgba(255,220,160,.22)",
      boxShadow:"0 28px 90px rgba(0,0,0,.62), 0 0 70px rgba(212,83,107,.10), inset 0 1px 0 rgba(255,255,255,.10)"
    }}>
      {/* Soft cinematic overlay */}
      <div style={{
        position:"absolute",
        inset:0,
        zIndex:1,
        pointerEvents:"none",
        background:"radial-gradient(circle at 50% 28%, transparent 0%, rgba(4,1,10,.10) 45%, rgba(4,1,10,.36) 100%)"
      }}/>

      {/* Snow falling on the romantic photo */}
      {snow.map(s=>(
        <span key={s.id} className="romantic-snow" style={{
          left:s.left,
          top:s.top,
          width:s.size,
          height:s.size,
          opacity:s.opacity,
          animationDelay:s.delay,
          animationDuration:s.dur,
          "--drift":s.drift,
        }}/>
      ))}

      <div style={{
        position:"absolute",
        left:18,
        top:16,
        zIndex:6,
        padding:".48rem .7rem",
        borderRadius:999,
        background:"rgba(8,4,15,.46)",
        border:"1px solid rgba(255,220,160,.20)",
        backdropFilter:"blur(6px)",
        WebkitBackdropFilter:"blur(6px)"
      }}>
        <p className="f-body" style={{
          color:"rgba(255,241,194,.90)",
          fontSize:".62rem",
          fontWeight:900,
          letterSpacing:".18em",
          textTransform:"uppercase"
        }}>Private Birthday Love Story</p>
      </div>

      <div style={{
        position:"absolute",
        inset:"auto 0 0",
        height:compact?70:110,
        background:"linear-gradient(0deg,rgba(4,1,10,.82),rgba(4,1,10,.28),transparent)",
        zIndex:2,
        pointerEvents:"none"
      }}/>
      {!compact&&<div style={{position:"absolute",left:22,right:22,bottom:18,zIndex:6,textAlign:"center"}}>
        <p className="f-script" style={{color:"rgba(255,241,194,.88)",fontSize:"1.2rem",lineHeight:1.35}}>A promise wrapped in respect, dua and husband-level care</p>
      </div>}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════════ */
function Typewriter({lines, speed=28}) {
  const full = useMemo(()=>lines.join("\n\n"),[lines]);
  const [txt,setTxt] = useState("");
  useEffect(()=>{
    let i=0; setTxt("");
    const t=setInterval(()=>{ i=Math.min(full.length,i+3); setTxt(full.slice(0,i)); if(i>=full.length) clearInterval(t); },speed);
    return ()=>clearInterval(t);
  },[full,speed]);
  return (
    <p className="copy f-body" style={{whiteSpace:"pre-line",margin:0}}>
      {txt}<span className="type-cursor"/>
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════════════════════ */
function Card({children,wide,narrow,className=""}) {
  return (
    <motion.section variants={pageVar} initial="hidden" animate="show" exit="exit"
      className={`card glass ${wide?"wide":narrow?"narrow":"normal"} ${className}`}>
      <div className="card-inner">{children}</div>
    </motion.section>
  );
}
function Btn({children,onClick,variant="primary",type="button",style={}}) {
  return (
    <motion.button type={type} onClick={onClick} className={`btn btn-${variant}`}
      whileHover={{y:-3,scale:1.02}} whileTap={{scale:.97}} style={style}>
      {children}
    </motion.button>
  );
}
function Kicker({children}) {
  return <span className="kicker f-body">{children}</span>;
}
function NavRow({onBack,onNext,nextLabel="Next →",extra}) {
  return (
    <div className="nav-row">
      {onBack&&<Btn variant="secondary" onClick={onBack}>← Back</Btn>}
      {extra}
      {onNext&&<Btn onClick={onNext}>{nextLabel}</Btn>}
    </div>
  );
}
function SectionHead({kicker,title,sub,center=true}) {
  return (
    <div style={{textAlign:center?"center":"left",marginBottom:"1.8rem"}}>
      {kicker&&<Kicker>{kicker}</Kicker>}
      <div className="title-lg" style={{marginTop:".9rem"}}>{title}</div>
      {sub&&<p className="copy" style={{maxWidth:660,margin:center?"1rem auto 0":"1rem 0 0"}}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS HEADER
═══════════════════════════════════════════════════════════════ */
function ProgressHeader({step,total,musicOn,onToggleMusic}) {
  const pct = ((step+1)/total)*100;
  return (
    <motion.header initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} transition={{duration:.45}} className="progress-head">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <motion.div animate={{scale:[1,1.1,1]}} transition={{duration:2.5,repeat:Infinity}}
            style={{width:44,height:44,borderRadius:14,display:"grid",placeItems:"center",fontSize:"1.2rem",
              background:"linear-gradient(135deg,var(--gold),var(--rose))",
              boxShadow:"0 8px 28px rgba(212,83,107,.35)"}}>❤️</motion.div>
          <div>
            <p className="f-body" style={{color:"var(--gold2)",fontSize:".63rem",fontWeight:800,letterSpacing:".18em",textTransform:"uppercase"}}>H ❤ F · Birthday Journey</p>
            <p className="f-display" style={{color:"var(--cream)",fontSize:"1.04rem",fontWeight:700,marginTop:2}}>{step+1}/{total} — {STEPS[step]}</p>
          </div>
        </div>
        <Btn variant="secondary" onClick={onToggleMusic} style={{minHeight:40,padding:".54rem .9rem",fontSize:".84rem"}}>
          <motion.span animate={musicOn?{rotate:[0,12,-12,0]}:{}} transition={{duration:1.2,repeat:Infinity}}>{musicOn?"🎵":"🎶"}</motion.span>
          {musicOn?" Music On":" Play Music"}
        </Btn>
      </div>
      <div className="progress-bar-track">
        <motion.div animate={{width:`${pct}%`}} transition={{duration:.5,ease:[.16,1,.3,1]}}
          style={{height:"100%",borderRadius:99,
            background:"linear-gradient(90deg,var(--gold),var(--rose),var(--wine))",
            boxShadow:"0 0 14px rgba(212,83,107,.55)"}}>
          {/* shimmer */}
          <motion.div animate={{x:["0%","100%"]}} transition={{duration:1.8,repeat:Infinity,ease:"linear"}}
            style={{width:"35%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)"}}/>
        </motion.div>
      </div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HIDDEN BUTTON
═══════════════════════════════════════════════════════════════ */
function HiddenButton() {
  const [open,setOpen]=useState(false);
  const [rain,setRain]=useState(false);
  const popupRef=useRef(null);
  const rainRef=useRef(null);

  const close=()=>{
    setOpen(false);
    clearTimeout(popupRef.current);
  };

  const click=()=>{
    setOpen(true);
    setRain(true);

    clearTimeout(popupRef.current);
    clearTimeout(rainRef.current);

    rainRef.current=setTimeout(()=>setRain(false),2500);

    // Button dobara show hote hi popup message khud chala jayega
    popupRef.current=setTimeout(()=>setOpen(false),4200);
  };

  useEffect(()=>()=> {
    clearTimeout(popupRef.current);
    clearTimeout(rainRef.current);
  },[]);

  return (
    <>
      <EmojiRain active={rain} emojis={["😂","❤️","✨","🙈"]} count={12}/>
      <div className="hidden-btn-wrap">
        <AnimatePresence mode="wait">
          {!open
            ? <motion.button key="hidden-btn" onClick={click} className="btn btn-ghost"
                initial={{opacity:0,y:8,scale:.94}}
                animate={{opacity:1,y:[0,-3,0],rotate:[0,-1.5,1.5,-1.5,0],scale:1}}
                exit={{opacity:0,y:8,scale:.94}}
                transition={{
                  y:{duration:3,repeat:Infinity,repeatDelay:2},
                  rotate:{duration:3,repeat:Infinity,repeatDelay:2}
                }}
                style={{minHeight:36,padding:".48rem .85rem",fontSize:".76rem"}}>
                Secret Smile Button 😄
              </motion.button>
            : <motion.div key="funny-popup"
                initial={{opacity:0,y:18,scale:.86,rotate:-3}}
                animate={{opacity:1,y:0,scale:1,rotate:0}}
                exit={{opacity:0,y:12,scale:.9,rotate:3}}
                transition={{type:"spring",stiffness:280,damping:18}}
                style={{
                  width:"min(270px, calc(100vw - 32px))",
                  borderRadius:20,
                  padding:"1rem 1.05rem",
                  background:"linear-gradient(145deg, rgba(61,8,23,.96), rgba(12,3,10,.96))",
                  border:"1px solid rgba(255,220,160,.24)",
                  boxShadow:"0 18px 55px rgba(0,0,0,.55), 0 0 35px rgba(212,83,107,.22)",
                  position:"relative",
                  overflow:"hidden",
                  backdropFilter:"blur(12px)"
                }}>
                <button type="button" onClick={close}
                  aria-label="Close popup"
                  style={{
                    position:"absolute",top:8,right:8,width:24,height:24,borderRadius:"50%",
                    border:"1px solid rgba(255,220,160,.22)",
                    background:"rgba(8,4,15,.76)",
                    color:"var(--gold2)",
                    cursor:"pointer",
                    fontWeight:800,
                    lineHeight:1
                  }}>
                  ×
                </button>

                <p className="f-body" style={{
                  color:"var(--gold2)",
                  fontSize:".62rem",
                  fontWeight:900,
                  letterSpacing:".16em",
                  textTransform:"uppercase",
                  marginBottom:".45rem",
                  paddingRight:26
                }}>
                  Secret Alert 🙈
                </p>

                <p className="f-script" style={{
                  color:"var(--cream)",
                  fontSize:"1.18rem",
                  lineHeight:1.45,
                  margin:0,
                  paddingRight:8
                }}>
                  Acha ji, secret khul gaya… ab smile dena compulsory hai 😄❤️
                </p>

                <p className="f-body" style={{
                  color:"rgba(240,230,211,.62)",
                  fontSize:".76rem",
                  lineHeight:1.55,
                  marginTop:".55rem"
                }}>
                  Fariha, ab muskurana lazmi hai — warna ye button mujhe report kar dega ke husband material slow chal raha hai.
                </p>
              </motion.div>
          }
        </AnimatePresence>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SCREEN: PASSWORD
═══════════════════════════════════════════════════════════════ */
function PasswordScreen({onUnlock}) {
  const [val,setVal]=useState("");
  const [err,setErr]=useState("");
  const [shake,setShake]=useState(false);
  const submit=e=>{
    e.preventDefault();
    if(val.trim().toLowerCase()===CONFIG.password.toLowerCase()){onUnlock();return;}
    setShake(true); setTimeout(()=>setShake(false),500);
    setErr("Password thora sa sharma gaya hai... hint dobara dekho 😅❤️");
  };
  return (
    <Card narrow>
      <div style={{textAlign:"center",maxWidth:520,margin:"0 auto"}}>
        <TiltCard style={{display:"inline-block",marginBottom:"1.5rem"}}>
          <motion.div animate={{y:[0,-8,0],rotateZ:[0,3,-3,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
            style={{width:92,height:92,borderRadius:26,display:"grid",placeItems:"center",fontSize:"2.2rem",
              background:"linear-gradient(145deg,var(--gold2),var(--rose),var(--wine))",
              boxShadow:"0 22px 60px rgba(212,83,107,.35), inset 0 1px 0 rgba(255,255,255,.2)"}}>🔐</motion.div>
        </TiltCard>

        <Kicker>Private Premiere · Sirf Aapke Liye</Kicker>

        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}}>
          <div className="title-xl" style={{marginTop:".9rem",lineHeight:.9}}>
            <span className="gold-shine">Secret</span><br/>Surprise
          </div>
        </motion.div>

        <motion.p className="copy" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.16}}
          style={{maxWidth:460,margin:"1rem auto 0"}}>
          Ye cinematic birthday experience sirf aapke liye hai. Password dalo aur apni dil wali special film shuru karo.
        </motion.p>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.22}}
          style={{margin:"1.1rem auto 0",borderRadius:16,padding:".8rem 1.1rem",
            background:"rgba(201,168,76,.07)",border:"1px dashed rgba(201,168,76,.28)"}}>
          <p className="f-script" style={{color:"var(--gold2)",fontSize:"1.2rem"}}>Hint: <em>{CONFIG.passwordHint}</em></p>
        </motion.div>

        <motion.form onSubmit={submit} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.28}}
          style={{margin:"1.3rem auto 0",maxWidth:460}}>
          <motion.div animate={shake?{x:[-10,10,-8,8,-4,4,0]}:{}} transition={{duration:.4}}>
            <input value={val} onChange={e=>setVal(e.target.value)} placeholder="Password yahaan likhein…"
              autoComplete="off" className="f-body"
              style={{width:"100%",background:"rgba(255,240,210,.06)",border:"1px solid rgba(255,220,160,.18)",
                borderRadius:12,padding:"1rem 1.2rem",color:"var(--cream)",textAlign:"center",
                outline:"none",letterSpacing:".05em",fontSize:"1rem",
                transition:"border-color .2s, box-shadow .2s"}}
              onFocus={e=>{e.target.style.borderColor="rgba(201,168,76,.5)";e.target.style.boxShadow="0 0 0 3px rgba(201,168,76,.12)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,220,160,.18)";e.target.style.boxShadow="none";}}
            />
          </motion.div>
          <AnimatePresence>
            {err&&<motion.p initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="f-body" style={{marginTop:".6rem",color:"var(--rose2)",fontSize:".86rem",fontWeight:700}}>{err}</motion.p>}
          </AnimatePresence>
          <Btn type="submit" style={{marginTop:"1rem",width:"100%",padding:".9rem",fontSize:".96rem"}}>
            ✦ Unlock Dil Wala Surprise ✦
          </Btn>
        </motion.form>

        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.36}}
          style={{marginTop:"1.8rem"}}>
          <Silhouette compact/>
        </motion.div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 1: WELCOME
═══════════════════════════════════════════════════════════════ */
function EntryStep({onNext}) {
  return (
    <Card wide>
      <div className="grid-2">
        <motion.div variants={staggerVar} initial="hidden" animate="show">
          <motion.div variants={fadeUpVar}><Kicker>🎂 Birthday Surprise · Husband-Material Edition · 2026</Kicker></motion.div>
          <motion.div variants={fadeUpVar} className="title-xl" style={{marginTop:".9rem",lineHeight:.88}}>
            Happy<br/>Birthday,<br/><span className="rose-shine">{CONFIG.herName}</span>
          </motion.div>
          <motion.p variants={fadeUpVar} className="copy" style={{marginTop:"1.1rem",maxWidth:520}}>
            Ye sirf birthday website nahi — ye meri taraf se aapke liye ek romantic, respectful aur dil se bana hua surprise hai: dua, care, loyalty, smile mission, thori comedy aur bohot sincere feelings.
          </motion.p>
          <motion.div variants={fadeUpVar} style={{marginTop:"1.6rem",display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={onNext}>Start Our Cute Film →</Btn>
            <Btn variant="secondary">Made with dil, dua, loyalty & care 💌</Btn>
          </motion.div>
          <motion.div variants={fadeUpVar} style={{marginTop:"1.5rem",paddingTop:"1.3rem",borderTop:"1px solid rgba(255,220,160,.13)"}}>
            <Typewriter lines={CONFIG.personalLines}/>
          </motion.div>
        </motion.div>

        <motion.div initial={{opacity:0,x:28,rotateY:-8}} animate={{opacity:1,x:0,rotateY:0}}
          transition={{duration:.65,delay:.15,ease:[.22,1,.36,1]}}>
          <TiltCard><Silhouette/></TiltCard>
          {/* Feature pills */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14,justifyContent:"center"}}>
            {[["😄","Smile"],["🤍","Respect"],["❤️","Care"],["🎁","Presents"],["💌","Letter"]].map(([e,l])=>(
              <span key={l} className="kicker" style={{fontSize:".62rem"}}>
                {e} {l}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 2: FEATURES
═══════════════════════════════════════════════════════════════ */
function FeaturesStep({onNext,onBack}) {
  const [revealed,setRevealed]=useState({});
  return (
    <Card wide>
      <SectionHead kicker="🌸 Dil Sambhalne Wali File"
        title={<><span className="gold-shine">Aapki</span> Dil Jeetne Wali Qualities</>}
        sub="Har card ek alag reason hai ke aap meri nazar me sirf achi nahi, genuinely special, graceful aur future-wife material hain."/>
      <motion.div variants={staggerVar} initial="hidden" animate="show" className="grid-cards">
        {CONFIG.futureWifeFeatures.map((item,i)=>{
          const open=!!revealed[i];
          return (
            <motion.button key={item.title} variants={fadeUpVar}
              onClick={()=>setRevealed(r=>({...r,[i]:true}))}
              className={`mini-card ${open?"":"dark"}`}
              style={{minHeight:220,textAlign:"left",color:"var(--cream)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <p className="f-body" style={{color:"var(--gold2)",fontSize:".64rem",letterSpacing:".16em",fontWeight:800,textTransform:"uppercase"}}>{item.label}</p>
                {!open&&<span style={{color:"rgba(240,230,211,.3)",fontSize:".72rem",fontWeight:600}}>tap to feel</span>}
              </div>
              <div style={{fontSize:"2.8rem",margin:".9rem 0",filter:"drop-shadow(0 8px 18px rgba(212,83,107,.4))"}}>{item.emoji}</div>
              {!open
                ? <div className="title-md" style={{fontSize:"1.45rem"}}><span className="gold-shine">Feature #{i+1}</span></div>
                : <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                    <div className="f-display" style={{fontSize:"1.45rem",fontWeight:700,color:"var(--cream)",lineHeight:1.1}}>{item.title}</div>
                    <p className="f-body" style={{marginTop:".6rem",color:"var(--cream2)",fontSize:".9rem",lineHeight:1.72}}>{item.desc}</p>
                  </motion.div>
              }
            </motion.button>
          );
        })}
      </motion.div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Why You Matter →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 3: WHY SPECIAL
═══════════════════════════════════════════════════════════════ */
function WhySpecialStep({onNext,onBack}) {
  return (
    <Card wide>
      <SectionHead kicker="❤️ Dil Ka Reason"
        title={<>Why You <span className="rose-shine">Matter</span></>}
        sub="Kuch log sirf pasand nahi aate, dil ko comfortable, safe aur close lagne lagte hain. Ye section usi respectful feeling ke naam."/>
      <motion.div variants={staggerVar} initial="hidden" animate="show" className="grid-cards">
        {CONFIG.whySpecial.map((item,i)=>(
          <motion.div key={item.title} variants={fadeUpVar} className="mini-card">
            <motion.div animate={{y:[0,-6,0],scale:[1,1.08,1]}} transition={{duration:3+i*.4,repeat:Infinity}}
              style={{fontSize:"2.6rem",marginBottom:".8rem",filter:"drop-shadow(0 6px 14px rgba(212,83,107,.35))"}}>{item.emoji}</motion.div>
            <div className="f-display" style={{fontSize:"1.4rem",fontWeight:700,color:"var(--cream)",lineHeight:1.1}}>{item.title}</div>
            <div style={{height:1,background:"linear-gradient(90deg,rgba(201,168,76,.3),transparent)",margin:".75rem 0"}}/>
            <p className="copy f-body" style={{fontSize:".9rem",lineHeight:1.75}}>{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Heart Game →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 5: HEART GAME
═══════════════════════════════════════════════════════════════ */
function HeartGameStep({onNext,onBack}) {
  const [hearts,setHearts]=useState([]);
  const [caught,setCaught]=useState(0);
  const [started,setStarted]=useState(false);
  const [done,setDone]=useState(false);
  const [rain,setRain]=useState(false);
  const [unlocked,setUnlocked]=useState([]);
  const ivRef=useRef(null);
  const toRef=useRef(null);
  const target=10;

  const spawn=useCallback(()=>{
    const id=Date.now()+Math.random();
    const pool=["❤️","💖","🌹","💝","✨","🤍"];
    const e=pool[Math.floor(Math.random()*pool.length)];
    const secret=CONFIG.heartGameSecrets[Math.floor(Math.random()*CONFIG.heartGameSecrets.length)];
    setHearts(h=>[...h.slice(-7),{id,e,secret,x:14+Math.random()*72,y:24+Math.random()*58}]);
  },[]);

  const start=()=>{
    clearInterval(ivRef.current); clearTimeout(toRef.current);
    setStarted(true);setDone(false);setCaught(0);setHearts([]);setUnlocked([]);
    spawn();
    ivRef.current=setInterval(spawn,950);
    toRef.current=setTimeout(()=>{clearInterval(ivRef.current);setDone(true);},18000);
  };

  const catchIt=heart=>{
    setHearts(h=>h.filter(x=>x.id!==heart.id));
    setUnlocked(u=>{
      const exists=u.some(x=>x.label===heart.secret.label);
      return exists?u:[...u,heart.secret].slice(-5);
    });
    setCaught(c=>{
      const next=c+1;
      if(next>=target){
        clearInterval(ivRef.current);
        clearTimeout(toRef.current);
        setDone(true);
        setRain(true);
        setTimeout(()=>setRain(false),3200);
      }
      return next;
    });
  };

  useEffect(()=>()=>{clearInterval(ivRef.current);clearTimeout(toRef.current);},[]);

  return (
    <Card wide className="heart-screen">
      <EmojiRain active={rain} emojis={["❤️","💖","🌹","✨","🤍"]} count={16}/>
      <SectionHead kicker="🎮 Special Heart Game — Unlock Her Smile"
        title={<>Collect <span className="rose-shine">Dil Wale Hearts</span></>}
        sub="Har heart ke andar ek choti si feeling hidden hai. 10 hearts collect karo aur final birthday note unlock ho jayega — bilkul special edition."/>

      <div className="heart-game-layout" style={{display:"grid",gridTemplateColumns:"minmax(0,1.4fr) minmax(240px,.6fr)",gap:14,alignItems:"stretch"}}>
        <div className="heart-arena" style={{position:"relative",borderRadius:26,overflow:"hidden",
          background:"radial-gradient(circle at 50% 24%,rgba(240,112,144,.18),transparent 32%), linear-gradient(145deg,rgba(30,5,15,.92),rgba(8,2,8,.98))",
          border:"1px solid rgba(255,220,160,.18)",height:380,
          boxShadow:"0 24px 75px rgba(0,0,0,.62), inset 0 0 70px rgba(107,16,40,.18)"}}>
          <div style={{position:"absolute",inset:0,
            backgroundImage:"radial-gradient(circle at 20% 20%,rgba(255,241,194,.10),transparent 2px),radial-gradient(circle at 70% 35%,rgba(240,112,144,.12),transparent 2px),linear-gradient(rgba(212,83,107,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(212,83,107,.035) 1px,transparent 1px)",
            backgroundSize:"120px 120px, 150px 150px, 38px 38px, 38px 38px",borderRadius:"inherit"}}/>

          <motion.div animate={{scale:[1,1.04,1],opacity:[.65,1,.65]}} transition={{duration:2.4,repeat:Infinity}}
            style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:170,height:170,borderRadius:"50%",
              background:"radial-gradient(circle,rgba(240,112,144,.12),transparent 70%)"}}/>

          {!started&&(
            <div className="heart-arena-start" style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,textAlign:"center",padding:24}}>
              <motion.div animate={{scale:[1,1.16,1],rotate:[0,7,-7,0]}} transition={{duration:2.2,repeat:Infinity}}
                className="heart-start-icon" style={{fontSize:"5rem",filter:"drop-shadow(0 0 28px rgba(240,112,144,.9))"}}>💝</motion.div>
              <div className="f-display gold-shine heart-start-title" style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:700,lineHeight:1}}>Fariha Smile Mission</div>
              <p className="copy" style={{maxWidth:480}}>Dil wale hearts collect karo. Har click ek hidden line reveal karega — thori cute, thori caring, aur full husband-material energy ke saath.</p>
              <Btn onClick={start}>Start Mission →</Btn>
            </div>
          )}

          <AnimatePresence>
            {started&&hearts.map(h=>(
              <motion.button key={h.id} className="heart-btn"
                initial={{scale:0,opacity:0,rotate:-25}}
                animate={{scale:1,opacity:1}}
                exit={{scale:0,opacity:0,y:-34}}
                transition={{duration:.22}}
                onClick={()=>catchIt(h)}
                style={{left:`${h.x}%`,top:`${h.y}%`,fontSize:"clamp(1.8rem,4vw,3rem)"}}>
                {h.e}
              </motion.button>
            ))}
          </AnimatePresence>

          {started&&(
            <div className="heart-progress-row" style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",zIndex:4}}>
              <div className="heart-count-pill" style={{background:"rgba(10,2,8,.82)",border:"1px solid rgba(255,220,160,.18)",borderRadius:999,padding:".42rem .85rem",}}>
                <p className="f-body" style={{fontSize:".78rem",fontWeight:900,color:"var(--gold2)",letterSpacing:".08em"}}>HEARTS {caught}/{target}</p>
              </div>
              <div className="heart-progress-bar" style={{flex:1,height:8,borderRadius:999,background:"rgba(255,240,210,.10)",overflow:"hidden",maxWidth:260}}>
                <motion.div animate={{width:`${Math.min(100,(caught/target)*100)}%`}} style={{height:"100%",borderRadius:999,background:"linear-gradient(90deg,var(--rose),var(--gold2))",boxShadow:"0 0 14px rgba(240,112,144,.55)"}}/>
              </div>
            </div>
          )}

          <AnimatePresence>
            {done&&(
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",
                  justifyContent:"center",background:"rgba(4,1,10,.88)",
                  textAlign:"center",padding:"2rem",zIndex:6}}>
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260,damping:18}}
                  style={{fontSize:"4rem",marginBottom:".8rem",filter:"drop-shadow(0 0 24px rgba(240,112,144,.9))"}}>🎉</motion.div>
                <div className="f-display rose-shine" style={{fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:700,lineHeight:1}}>Smile Mission Complete!</div>
                <p className="copy f-body" style={{marginTop:".75rem",maxWidth:560}}>Aapne {caught} hearts collect kiye — lekin sach ye hai ke dil to pehle hi aapki respectful smile, soft nature aur decent vibe se impress ho chuka tha. ❤️</p>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginTop:"1rem"}}>
                  <Btn variant="secondary" onClick={start}>Dobara Khelo 🔄</Btn>
                  <Btn onClick={onNext}>Promises Unlock →</Btn>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mini-card heart-info-panel" style={{cursor:"default",minHeight:380,display:"flex",flexDirection:"column",justifyContent:"space-between",background:"linear-gradient(145deg,rgba(61,8,23,.55),rgba(255,240,210,.045))"}}>
          <div>
            <p className="f-body" style={{color:"var(--gold2)",fontSize:".67rem",fontWeight:900,letterSpacing:".16em",textTransform:"uppercase"}}>Unlocked Dil Wali Feelings</p>
            <div className="f-display heart-panel-title" style={{color:"var(--cream)",fontSize:"1.6rem",fontWeight:700,marginTop:8,lineHeight:1.05}}>Har heart me ek sincere baat</div>
            <div style={{height:1,background:"linear-gradient(90deg,rgba(255,220,160,.30),transparent)",margin:"1rem 0"}}/>
            <div className="heart-unlock-list" style={{display:"grid",gap:10}}>
              {CONFIG.heartGameSecrets.map((s,i)=>{
                const open=unlocked.some(u=>u.label===s.label) || done;
                return (
                  <motion.div key={s.label} className="heart-secret-card" animate={{opacity:open?1:.45,scale:open?1:.98}}
                    style={{borderRadius:16,padding:".75rem .85rem",border:open?"1px solid rgba(201,168,76,.30)":"1px dashed rgba(255,220,160,.14)",background:open?"rgba(201,168,76,.08)":"rgba(255,240,210,.035)"}}>
                    <p className="f-body" style={{fontWeight:900,color:open?"var(--gold2)":"rgba(240,230,211,.48)",fontSize:".78rem"}}>{open?"💖":"🔒"} {s.label}</p>
                    <p className="copy" style={{fontSize:".82rem",lineHeight:1.55,marginTop:4,color:open?"var(--cream2)":"rgba(240,230,211,.38)"}}>{open?s.text:"Heart collect karo to ye sweet line unlock hogi."}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <p className="f-script" style={{color:"var(--gold2)",fontSize:"1.15rem",lineHeight:1.35,marginTop:"1rem"}}>Goal simple hai: aapki smile unlock karni hai, pressure bilkul nahi. 😄</p>
        </div>
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Promises →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 6: PROMISES
═══════════════════════════════════════════════════════════════ */
function PromisesStep({onNext,onBack}) {
  const [checked,setChecked]=useState({});
  const all=Object.keys(checked).length===CONFIG.promises.length;
  return (
    <Card>
      <SectionHead kicker="🤍 Promises — Dil Se"
        title={<>My <span className="gold-shine">Promises</span></>}
        sub="Ye filmy dialogues nahi — meri sincere niyat ka clear version hai: respect, trust, care, loyalty, protection aur thora sa cute mazak."/>
      <div className="grid-promises">
        {CONFIG.promises.map((p,i)=>{
          const done=!!checked[i];
          return (
            <motion.button key={p.text}
              initial={{opacity:0,x:i%2===0?-28:28}} animate={{opacity:1,x:0}} transition={{delay:i*.09,ease:[.22,1,.36,1]}}
              onClick={()=>setChecked(c=>({...c,[i]:true}))}
              whileHover={{x:5,borderColor:done?"rgba(201,168,76,.4)":"rgba(212,83,107,.3)"}}
              whileTap={{scale:.98}}
              className="mini-card"
              style={{display:"flex",gap:14,alignItems:"center",textAlign:"left",padding:"1rem 1.2rem",
                borderColor:done?"rgba(201,168,76,.30)":"var(--border)",
                background:done?"rgba(61,8,23,.6)":"rgba(255,240,210,.055)"}}>
              <motion.div animate={done?{scale:[1,1.35,1],rotate:[0,12,-6,0]}:{}} transition={{duration:.4}}
                style={{width:42,height:42,borderRadius:12,flexShrink:0,display:"grid",placeItems:"center",
                  background:done?"linear-gradient(135deg,var(--gold),var(--rose))":"rgba(255,240,210,.07)",
                  fontSize:done?"1.1rem":"1.3rem",
                  boxShadow:done?"0 4px 20px rgba(201,168,76,.35)":"none",
                  transition:"all .25s"}}>
                {done?"✓":p.icon}
              </motion.div>
              <p className="f-body" style={{fontSize:".93rem",lineHeight:1.72,fontWeight:done?600:400,
                color:done?"var(--cream)":"var(--cream2)",transition:"all .2s"}}>{p.text}</p>
            </motion.button>
          );
        })}
        <AnimatePresence>
          {all&&(
            <motion.div initial={{opacity:0,y:14,scale:.94}} animate={{opacity:1,y:0,scale:1}} className="mini-card"
              style={{textAlign:"center",padding:".9rem",background:"rgba(201,168,76,.09)",borderColor:"rgba(201,168,76,.28)"}}>
              <p className="f-script" style={{color:"var(--gold2)",fontSize:"1.25rem"}}>Sab promises confirm — ab husband-material responsibility aur bhi sweet ho gayi 🤍</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Birthday Presents →"/>
    </Card>
  );
}


/* ═══════════════════════════════════════════════════════════════
   SCREEN 7: BIRTHDAY PRESENTS
═══════════════════════════════════════════════════════════════ */
function PresentsStep({onNext,onBack}) {
  return (
    <Card wide>
      <SectionHead kicker="🎁 Birthday Presents — Dil Se"
        title={<>Gifts For <span className="gold-shine">{CONFIG.herName}</span></>}
        sub="Ye gifts wrapping paper wale nahi — dil wale presents hain: dua, respect, trust, time, sukoon, loyalty aur ek cute food deal."/>
      <motion.div variants={staggerVar} initial="hidden" animate="show" className="grid-cards">
        {CONFIG.birthdayPresents.map((gift,i)=>(
          <motion.div key={gift.title} variants={fadeUpVar} className="mini-card"
            style={{minHeight:210,textAlign:"left"}}>
            <motion.div animate={{y:[0,-6,0],scale:[1,1.08,1]}} transition={{duration:3+i*.35,repeat:Infinity}}
              style={{fontSize:"2.7rem",marginBottom:".8rem",filter:"drop-shadow(0 6px 14px rgba(201,168,76,.35))"}}>
              {gift.emoji}
            </motion.div>
            <div className="f-display" style={{fontSize:"1.45rem",fontWeight:700,color:"var(--cream)",lineHeight:1.1}}>
              {gift.title}
            </div>
            <div style={{height:1,background:"linear-gradient(90deg,rgba(201,168,76,.3),transparent)",margin:".75rem 0"}}/>
            <p className="copy f-body" style={{fontSize:".92rem",lineHeight:1.75}}>
              {gift.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Read Letter →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 7: LETTER
═══════════════════════════════════════════════════════════════ */
function LetterStep({onNext,onBack}) {
  return (
    <Card narrow>
      <SectionHead kicker="💌 Main Scene — Dil Wala Letter"
        title={<><span className="gold-shine">Birthday</span> Letter</>}
        sub="Ye letter aisa rakha hai ke har line alag feel de: respect bhi, romance bhi, future bhi, care bhi, aur halka sa Hassan-style mazak bhi."/>
      <motion.div initial={{opacity:0,y:22,rotateX:-4}} animate={{opacity:1,y:0,rotateX:0}}
        transition={{delay:.12,duration:.55,ease:[.22,1,.36,1]}}
        style={{maxWidth:700,margin:"0 auto"}}>
        <TiltCard>
          <div className="letter-paper">
            {/* Red vertical line */}
            <div style={{position:"absolute",top:0,bottom:0,left:52,width:1,background:"rgba(201,100,100,.15)"}}/>
            <p className="f-script" style={{position:"relative",zIndex:1,
              whiteSpace:"pre-line",fontSize:"clamp(1.05rem,2.3vw,1.22rem)",lineHeight:2,
              color:"#2a0b12",paddingLeft:14}}>
              {CONFIG.letter}
            </p>
          </div>
        </TiltCard>
      </motion.div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Final Surprise →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 8: FINALE
═══════════════════════════════════════════════════════════════ */
function FinalStep({onBack}) {
  const [yes,setYes]=useState(false);
  const [no,setNo]=useState(0);
  const noTexts=["Nahi? impossible 😅","Soch lo, husband material ready hai 😄","Dua me yaad rakhna ❤️","Ameen best answer hai 🥹","Ye button sirf cute drama hai 😌","Aik baar aur smile ke saath try karo 😄"];

  return (
    <Card narrow>
      <Confetti active={yes}/>
      <EmojiRain active={yes} emojis={["❤️","💖","🎊","✨","🌷","💍"]} count={16}/>

      <div style={{textAlign:"center",maxWidth:620,margin:"0 auto"}}>
        <TiltCard style={{display:"inline-block",marginBottom:"1.6rem"}}>
          <motion.div animate={{y:[0,-10,0],rotate:[0,5,-5,0]}}
            transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
            style={{width:100,height:100,borderRadius:30,display:"grid",placeItems:"center",fontSize:"3rem",
              background:"linear-gradient(145deg,var(--gold2),var(--rose),var(--wine))",
              boxShadow:"0 24px 65px rgba(212,83,107,.40), inset 0 1px 0 rgba(255,255,255,.18)"}}>❤️</motion.div>
        </TiltCard>

        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}}>
          <Kicker>✨ Final Scene · Dil Se Dua</Kicker>
          <div className="title-xl" style={{marginTop:".9rem",lineHeight:.88}}>
            <span className="gold-shine">Happy</span><br/>
            <span className="rose-shine">Birthday</span><br/>
            Fariha
          </div>
        </motion.div>

        <motion.p className="copy f-body" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.18}}
          style={{maxWidth:520,margin:"1rem auto 0",whiteSpace:"pre-line"}}>
          {CONFIG.finalMessage}
        </motion.p>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.24}}
          style={{margin:"1.4rem 0 0"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,.3),rgba(212,83,107,.2),transparent)",marginBottom:"1.4rem"}}/>
          <div className="f-display" style={{fontSize:"clamp(1.6rem,4vw,2.4rem)",fontWeight:700,color:"var(--cream)"}}>
            Agle Saal Aur Zyada Haq, Izzat Aur Care Se? ❤️
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.3}}
          style={{marginTop:"1.4rem",display:"flex",justifyContent:"center",alignItems:"center",gap:12,flexWrap:"wrap",minHeight:68}}>
          <Btn variant="secondary" onClick={onBack}>← Back</Btn>
          <Btn onClick={()=>setYes(true)} style={{fontSize:"1rem",padding:".88rem 2.2rem"}}>
            InshaAllah, Ameen ❤️
          </Btn>
          <motion.button type="button"
            onMouseEnter={()=>setNo(n=>n+1)} onClick={()=>setNo(n=>n+1)}
            animate={{x:[0,30,-22,16,-10,0][no%6], y:[0,-12,10,-8,5,0][no%6]}}
            transition={{type:"spring",stiffness:200,damping:14}}
            className="btn btn-ghost" style={{fontSize:".82rem",padding:".6rem 1rem"}}>
            {noTexts[no%noTexts.length]}
          </motion.button>
        </motion.div>

        <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:.38}}
          style={{marginTop:"1.6rem"}}>
          <TiltCard><Silhouette compact/></TiltCard>
        </motion.div>

        <AnimatePresence>
          {yes&&(
            <motion.div initial={{opacity:0,y:24,scale:.92}} animate={{opacity:1,y:0,scale:1}}
              transition={{type:"spring",stiffness:220,damping:20}}
              className="mini-card"
              style={{marginTop:"1.5rem",textAlign:"center",
                background:"linear-gradient(145deg,rgba(61,8,23,.8),rgba(107,16,40,.5))",
                borderColor:"rgba(212,83,107,.30)",padding:"1.8rem"}}>
              <motion.div animate={{scale:[1,1.05,1]}} transition={{duration:1.8,repeat:Infinity}}
                className="f-display gold-shine"
                style={{fontSize:"clamp(2.2rem,6vw,4rem)",fontWeight:700,lineHeight:1}}>
                Aap Meri Duaon Me Hain ❤️
              </motion.div>
              <p className="copy f-body" style={{maxWidth:480,margin:".6rem auto 0"}}>
                Ye birthday surprise complete hua, lekin meri dua yahin se shuru hoti hai: Allah hamare liye jo behtareen ho, usme asani, izzat, families ki khushi, halal mohabbat aur sukoon ata farmae. Ameen 🤍
              </p>
              <div style={{display:"flex",justifyContent:"center",gap:"1rem",marginTop:"1.1rem"}}>
                {["❤️","💌","🌹","✨","💍"].map((e,i)=>(
                  <motion.span key={e} animate={{y:[0,-10,0],scale:[1,1.2,1]}}
                    transition={{duration:1.8,delay:i*.22,repeat:Infinity}}
                    style={{fontSize:"1.8rem",filter:"drop-shadow(0 0 8px rgba(212,83,107,.6))"}}>
                    {e}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function BirthdaySurpriseApp() {
  const [unlocked,setUnlocked]=useState(false);
  const [step,setStep]=useState(0);
  const [musicOn,setMusicOn]=useState(false);
  const musicRef=useRef(null);
  const total=STEPS.length;

  const next=()=>setStep(s=>Math.min(s+1,total-1));
  const back=()=>setStep(s=>Math.max(s-1,0));

  const unlock=async()=>{
    setUnlocked(true);
    setTimeout(async()=>{
      try{await musicRef.current?.play();setMusicOn(true);}catch{setMusicOn(false);}
    },300);
  };

  const toggleMusic=async()=>{
    const a=musicRef.current; if(!a) return;
    if(musicOn){a.pause();setMusicOn(false);return;}
    try{await a.play();setMusicOn(true);}catch{setMusicOn(false);}
  };

  const screens=[
    <EntryStep    key="welcome"  onNext={next}/>,
    <FeaturesStep key="features" onNext={next} onBack={back}/>,
    <WhySpecialStep key="special" onNext={next} onBack={back}/>,
    <HeartGameStep key="game"   onNext={next} onBack={back}/>,
    <PromisesStep  key="promises" onNext={next} onBack={back}/>,
    <PresentsStep  key="presents" onNext={next} onBack={back}/>,
    <LetterStep    key="letter"  onNext={next} onBack={back}/>,
    <FinalStep     key="final"   onBack={back}/>,
  ];

  return (
    <main className="app-root f-body">
      <GlobalStyle/>
      <CinBG/>
      <audio ref={musicRef} src={CONFIG.musicUrl} loop preload="auto"/>
      {unlocked&&<HiddenButton/>}
      <div className="stage">
        {unlocked&&<ProgressHeader step={step} total={total} musicOn={musicOn} onToggleMusic={toggleMusic}/>}
        <AnimatePresence mode="wait">
          {!unlocked
            ? <PasswordScreen key="pw" onUnlock={unlock}/>
            : screens[step]
          }
        </AnimatePresence>
      </div>
    </main>
  );
}