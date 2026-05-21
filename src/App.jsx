import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
        filter: blur(55px); pointer-events: none; z-index: 0;
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
          0 30px 100px rgba(0,0,0,0.65),
          0 8px 30px rgba(0,0,0,0.4),
          inset 0 1px 0 rgba(255,255,255,0.10),
          inset 0 -1px 0 rgba(0,0,0,0.3);
        backdrop-filter: blur(18px) saturate(150%);
        -webkit-backdrop-filter: blur(18px) saturate(150%);
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
        animation: goldShine 5s linear infinite;
      }
      .rose-shine {
        background: linear-gradient(92deg, #6b1028 0%, #d4536b 25%, #f07090 45%, #d4536b 65%, #6b1028 100%);
        background-size: 250% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: goldShine 4.5s linear infinite;
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
        backdrop-filter: blur(20px) saturate(160%);
        -webkit-backdrop-filter: blur(20px) saturate(160%);
      }
      .progress-bar-track {
        height:4px; border-radius:99px; background:rgba(255,240,210,0.08); overflow:hidden; margin-top:11px;
      }

      /* ── Range ── */
      input[type=range] { -webkit-appearance:none; width:100%; height:6px; border-radius:99px; background:rgba(255,240,210,0.12); outline:none; cursor:pointer; }
      input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #fff, var(--gold2) 42%, var(--rose)); box-shadow:0 0 0 6px rgba(201,168,76,0.15), 0 8px 22px rgba(0,0,0,0.35); }

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

      /* ── Voice Player ── */
      .voice-panel {
        border-radius:28px; padding:2.4rem 2rem;
        background: linear-gradient(145deg, rgba(61,8,23,0.75) 0%, rgba(107,16,40,0.45) 50%, rgba(20,4,10,0.85) 100%);
        border: 1px solid rgba(212,83,107,0.22);
        box-shadow: 0 24px 70px rgba(0,0,0,0.55), 0 0 60px rgba(107,16,40,0.20);
        position:relative; overflow:hidden;
      }

      /* ── Waveform ── */
      .wavebar { border-radius:99px; transition:background .3s; }

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

      @media(max-width:660px) {
        .card { padding: 18px; border-radius: 24px; }
        .sil-moon { width:44px; height:44px; top:14px; right:16px; }
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
  passwordHint: "hamara rishta kis taraf ja raha hai 🙈",
  musicUrl: "/music/romantic.mp3",
  voiceNoteUrl: "/audio/voice-message.mp3",
  personalLines: [
    "Abhi hum saath nahi hain, lekin apse baat karte karte mujhe ye zaroor feel hota hai ke Allah ne kuch log dil ko sukoon dene ke liye banaye hote hain — aur ap unhi logon me se hain. ❤️",
    "Apse baat hoti hai to din thoda halka, mood thoda acha, aur smile thodi zyada real ho jaati hai. Ye normal chat nahi lagti — ye meri favorite notification ban chuki hai. 😄",
    "Main future ka claim nahi karta, lekin dua zaroor karta hoon: agar Allah ne behtari rakhi ho, to agla birthday main apko aur bhi zyada haq se wish karun. Ameen. 🤍",
  ],
  futureWifeFeatures: [
    { emoji:"😄", label:"Smile", title:"Dangerous Smile", desc:"Apki smile ka issue ye hai ke banda normal rehna chahta hai, lekin dil khud hi impressed ho jaata hai. Is smile par fine lagna chahiye." },
    { emoji:"🧠", label:"Mind", title:"Smart & Sweet", desc:"Apki baaton me samajh bhi hoti hai aur softness bhi. Rare combo: dil bhi jeet leti hain aur argument bhi respectfully win kar leti hain." },
    { emoji:"🌹", label:"Beauty", title:"Gracefully Beautiful", desc:"Ap beautiful hain, lekin sirf face se nahi — apki baat karne ka tareeqa, apki haya, apki vibe… sab kuch elegant lagta hai." },
    { emoji:"🤌", label:"Future", title:"Future Wife Energy", desc:"Apki simplicity, care aur vibe dekh kar dil kehta hai: ye insan life me ho to life better ho sakti hai. 🤍" },
  ],
  whySpecial: [
    { emoji:"💫", title:"Apki Baaten", text:"Apki baaton me ajeeb sa sukoon hai. Simple si baat bhi dil ko itni achi lagti hai ke reply dene se pehle smile aa jaati hai." },
    { emoji:"🌸", title:"Apki Vibe", text:"Apki vibe soft, respectful aur classy hai. Aisi vibe har kisi me nahi hoti — aur isi liye ap special lagti hain." },
    { emoji:"💗", title:"Apki Simplicity", text:"Apki simplicity bohot pasand hai. Jis tarah ap naturally baat karti hain, usme koi fake cheez feel nahi hoti." },
    { emoji:"✨", title:"Apka Asar", text:"Ap meri life me officially nahi aayi abhi, lekin apki baaton ka asar already acha hai. Ye main casually nahi keh raha." },
  ],
  promises: [
    { icon:"🛡️", text:"Main apki izzat hamesha karunga — abhi bhi, future me bhi. Respect mere liye romance se pehle aati hai." },
    { icon:"🕊️", text:"Main apko kabhi pressure feel nahi karwana chahta. Jo bhi ho, Allah ki raza aur dono families ki khushi ke saath ho." },
    { icon:"🌟", text:"Agar Allah ne hume saath likha, to apka sukoon, smile aur respect protect karne ki poori koshish karunga." },
    { icon:"💎", text:"Main apki baaton ko lightly nahi leta. Ap important hain — aur main chahta hoon ke ap hamesha valued feel karen." },
    { icon:"♾️", text:"Abhi hum sirf baat karte hain, lekin meri niyat simple hai: agar future bana, to izzat, care aur loyalty ke saath bana." },
  ],
  loveMeterMessages: [
    "Itna kam? Ye meter bhi keh raha hai: Hassan bhai, sach bolo 😄",
    "Ab thoda dil wali side active ho rahi hai… lekin abhi bhi kam hai ❤️",
    "Yahan se baat cute se serious zone me enter kar rahi hai 😌",
    "100%! Meter bhi maan gaya: Fariha special hain. Officially. Respectfully. 💖",
  ],
  letter: `Pyaari Fariha,

Happy Birthday ❤️

Aaj apka birthday hai, aur main bas ye kehna chahta hoon ke Allah apki zindagi ko khushiyon, sukoon, sehat aur kamyabi se bhar de. Ap jahan bhi rahen, jis haal me bhi rahen, Allah apko hamesha apni hifazat me rakhe. Ameen.

Main jaanta hoon ke abhi hum us stage par nahi hain jahan main bohot bade claims karun. Abhi bas baat hoti hai — lekin kabhi kabhi kuch logon se baat karte karte insan ko feel hota hai ke ye insan different hai. Ap mere liye waisi hi hain.

Apki simplicity, apka baat karne ka tareeqa, apki respect aur apki soft si vibe — ye sab genuinely bohot acha lagta hai. Aur haan, apki smile ka to alag hi issue hai. Wo banda normal rehne hi nahi deti. 😄

Main future ka guarantee nahi de sakta, kyunki future Allah ke haath me hai. Lekin dua zaroor karta hoon ke agar hum dono ke liye behtari isi me ho, to Allah hume izzat, mohabbat aur families ki khushi ke saath saath kar de.

Agle saal, agar Allah ne chaha, to shayad main ye birthday wish aur zyada haq se kar raha hoon.

Ap special hain, Fariha. Aur ye baat main sirf impress karne ke liye nahi keh raha — dil se keh raha hoon.

With respect, care, aur thori si cute si dramebazi,
Mohammad Hassan 💌`,
  hiddenSecret: "Sach bataun? Apse baat karna meri favorite daily habit ban chuki hai ❤️",
  finalMessage: `Happy Birthday, Fariha ❤️\nAaj dua hai, agle saal inshaAllah aur zyada haq se wish karunga 😌`,
};

const STEPS = ["Welcome","Features","Special","Voice","Game","Meter","Promises","Letter","Finale"];

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════════════ */
const pageVar = {
  hidden: { opacity:0, y:30, filter:"blur(10px)" },
  show:   { opacity:1, y:0, filter:"blur(0px)", transition:{ duration:.55, ease:[.22,1,.36,1] } },
  exit:   { opacity:0, y:-20, filter:"blur(8px)", transition:{ duration:.26 } },
};
const staggerVar = { hidden:{}, show:{ transition:{ staggerChildren:.08 } } };
const fadeUpVar  = { hidden:{ opacity:0, y:22 }, show:{ opacity:1, y:0, transition:{ duration:.5, ease:[.22,1,.36,1] } } };

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════════════════ */
function CinBG() {
  const dust = useMemo(() => Array.from({length:28},(_,i)=>({
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
function EmojiRain({active, emojis=["❤️","💖","✨"], count=28}) {
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
      {Array.from({length:85}).map((_,i)=>(
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
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx,{stiffness:220,damping:32});
  const sry = useSpring(ry,{stiffness:220,damping:32});

  const onMove = e => {
    if(!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - .5;
    const py = (e.clientY - r.top)  / r.height - .5;
    rx.set(py * -10);
    ry.set(px *  12);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{rotateX:srx, rotateY:sry, transformPerspective:900, ...style}}
      className={`tilt-card ${className}`}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SILHOUETTE
═══════════════════════════════════════════════════════════════ */
function Silhouette({compact=false}) {
  const stars = useMemo(()=>Array.from({length:compact?30:50},(_,i)=>({
    id:i, left:`${8+Math.random()*84}%`, top:`${5+Math.random()*54}%`,
    w:Math.random()*2+.8, delay:`${Math.random()*3}s`, dur:`${1.8+Math.random()*2.4}s`,
  })),[compact]);
  return (
    <div className={`silhouette ${compact?"compact":"full"}`}>
      {stars.map(s=>(
        <span key={s.id} className="sil-star" style={{
          left:s.left, top:s.top, width:s.w, height:s.w,
          animationDelay:s.delay, animationDuration:s.dur,
          boxShadow:`0 0 ${s.w*4}px rgba(255,248,225,.6)`,
        }}/>
      ))}
      <div className="sil-moon"/>
      {/* Ground fog */}
      <div style={{position:"absolute",inset:"auto 0 0",height:80,background:"linear-gradient(0deg,rgba(4,1,10,.85),rgba(4,1,10,.3),transparent)"}}/>
      {/* Initials */}
      <div style={{position:"absolute",left:20,top:18,zIndex:2}}>
        <p className="f-display" style={{color:"rgba(240,230,211,.70)",fontSize:"1.4rem",fontWeight:700,letterSpacing:".22em"}}>H <span style={{color:"var(--rose2)"}}>❤</span> F</p>
        <p className="f-body" style={{color:"rgba(240,230,211,.32)",fontSize:".62rem",fontWeight:800,letterSpacing:".2em",marginTop:2}}>PRIVATE EDITION</p>
      </div>
      {/* SVG couple */}
      <svg viewBox="0 0 380 240" style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:compact?"80%":"74%",height:"auto",filter:"drop-shadow(0 16px 22px rgba(0,0,0,.7))"}}>
        {/* Ground */}
        <path d="M30 218 C100 196 160 200 190 210 C225 222 280 200 350 218 L350 240 L30 240Z" fill="rgba(4,1,10,.95)"/>
        {/* Him */}
        <ellipse cx="162" cy="86" rx="18" ry="19" fill="#030108"/>
        <path d="M142 108 Q162 100 182 108 L188 180 L136 180Z" fill="#030108"/>
        <path d="M140 118 Q115 144 108 176" stroke="#030108" strokeWidth="17" strokeLinecap="round" fill="none"/>
        {/* tie */}
        <path d="M162 108 L157 128 L162 124 L167 128Z" fill="rgba(107,16,40,.6)"/>
        {/* Her */}
        <ellipse cx="218" cy="90" rx="16" ry="17" fill="#030108"/>
        {/* hair */}
        <path d="M202 86 Q218 72 234 86 Q230 74 218 71 Q206 74 202 86Z" fill="#030108"/>
        {/* dress */}
        <path d="M200 110 Q218 168 238 110 Q228 190 196 190Z" fill="#030108"/>
        <path d="M230 120 Q254 145 260 174" stroke="#030108" strokeWidth="16" strokeLinecap="round" fill="none"/>
        {/* Joined hands */}
        <path d="M182 148 Q200 136 214 148" stroke="#030108" strokeWidth="14" strokeLinecap="round" fill="none"/>
        {/* Floating heart */}
        <text x="190" y="60" textAnchor="middle" fontSize="20" fill="rgba(212,83,107,.92)" style={{filter:"drop-shadow(0 0 8px rgba(212,83,107,.7))"}}>❤</text>
        <text x="212" y="44" textAnchor="middle" fontSize="12" fill="rgba(201,168,76,.75)">✦</text>
        <text x="170" y="50" textAnchor="middle" fontSize="9"  fill="rgba(240,112,144,.55)">✦</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════════ */
function Typewriter({lines, speed=20}) {
  const full = useMemo(()=>lines.join("\n\n"),[lines]);
  const [txt,setTxt] = useState("");
  useEffect(()=>{
    let i=0; setTxt("");
    const t=setInterval(()=>{ setTxt(full.slice(0,++i)); if(i>=full.length) clearInterval(t); },speed);
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
  const click=()=>{setOpen(true);setRain(true);setTimeout(()=>setRain(false),2800);};
  return (
    <>
      <EmojiRain active={rain} emojis={["❤️","🌹","✨","💖"]} count={22}/>
      <div className="hidden-btn-wrap">
        {!open
          ? <motion.button onClick={click} className="btn btn-ghost"
              animate={{y:[0,-3,0],rotate:[0,-1.5,1.5,-1.5,0]}}
              transition={{duration:3,repeat:Infinity,repeatDelay:2}}
              style={{minHeight:36,padding:".48rem .85rem",fontSize:".76rem"}}>
              Do Not Click 😄
            </motion.button>
          : <motion.div initial={{opacity:0,y:14,scale:.88,rotate:-4}} animate={{opacity:1,y:0,scale:1,rotate:0}}
              transition={{type:"spring",stiffness:280,damping:18}}
              className="card" style={{maxWidth:230,padding:"1rem",borderRadius:18}}>
              <div className="card-inner">
                <p className="f-script" style={{color:"var(--cream)",fontSize:"1.18rem",lineHeight:1.5}}>{CONFIG.hiddenSecret}</p>
              </div>
            </motion.div>
        }
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
    setErr("Password thora sa galat hai... hint dobara dekho 😅❤️");
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

        <Kicker>Private Premiere · Sirf Apke Liye</Kicker>

        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}}>
          <div className="title-xl" style={{marginTop:".9rem",lineHeight:.9}}>
            <span className="gold-shine">Secret</span><br/>Surprise
          </div>
        </motion.div>

        <motion.p className="copy" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.16}}
          style={{maxWidth:460,margin:"1rem auto 0"}}>
          Ye cinematic birthday experience sirf apke liye hai. Password dalo aur apni special film shuru karo.
        </motion.p>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.22}}
          style={{margin:"1.1rem auto 0",borderRadius:16,padding:".8rem 1.1rem",
            background:"rgba(201,168,76,.07)",border:"1px dashed rgba(201,168,76,.28)"}}>
          <p className="f-script" style={{color:"var(--gold2)",fontSize:"1.2rem"}}>Hint: <em>{CONFIG.passwordHint}</em></p>
        </motion.div>

        <motion.form onSubmit={submit} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.28}}
          style={{margin:"1.3rem auto 0",maxWidth:460}}>
          <motion.div animate={shake?{x:[-10,10,-8,8,-4,4,0]}:{}} transition={{duration:.4}}>
            <input value={val} onChange={e=>setVal(e.target.value)} placeholder="Password yahaan…"
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
            ✦ Unlock Surprise ✦
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
          <motion.div variants={fadeUpVar}><Kicker>🎂 Birthday Film · Luxury Cut · 2025</Kicker></motion.div>
          <motion.div variants={fadeUpVar} className="title-xl" style={{marginTop:".9rem",lineHeight:.88}}>
            Happy<br/>Birthday,<br/><span className="rose-shine">{CONFIG.herName}</span>
          </motion.div>
          <motion.p variants={fadeUpVar} className="copy" style={{marginTop:"1.1rem",maxWidth:520}}>
            Ye ek website nahi — ye ek smooth cinematic birthday experience hai. Thori funny baatein, thori genuine feelings, ek cute game, kuch respectful promises aur ek special final scene — sab apke liye.
          </motion.p>
          <motion.div variants={fadeUpVar} style={{marginTop:"1.6rem",display:"flex",gap:12,flexWrap:"wrap"}}>
            <Btn onClick={onNext}>Start The Film →</Btn>
            <Btn variant="secondary">Made with feelings 💌</Btn>
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
            {[["😄","Funny"],["❤️","Emotional"],["🎮","Game"],["🎙️","Voice"],["💌","Letter"],["🤍","Promises"]].map(([e,l])=>(
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
      <SectionHead kicker="😄 Classified Editorial File"
        title={<><span className="gold-shine">Future Wife</span> Features</>}
        sub="Tap karo. Har card apki ek cute, classy aur thori dangerous quality reveal karega."/>
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
                {!open&&<span style={{color:"rgba(240,230,211,.3)",fontSize:".72rem",fontWeight:600}}>tap to reveal</span>}
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
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Why You're Special →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 3: WHY SPECIAL
═══════════════════════════════════════════════════════════════ */
function WhySpecialStep({onNext,onBack}) {
  return (
    <Card wide>
      <SectionHead kicker="❤️ Dil Se — Serious Section"
        title={<>Why You're <span className="rose-shine">Special</span></>}
        sub="Ab funny part ke baad real part. Ye sab dil se hai — respectfully, genuinely."/>
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
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Voice Message →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 4: VOICE NOTE
═══════════════════════════════════════════════════════════════ */
function VoiceStep({onNext,onBack}) {
  const [playing,setPlaying]=useState(false);
  const [played,setPlayed]=useState(false);
  const [progress,setProgress]=useState(0);
  const audioRef=useRef(null);
  const ivRef=useRef(null);

  const toggle=()=>{
    const a=audioRef.current;
    if(!a) return;
    if(playing){a.pause();setPlaying(false);clearInterval(ivRef.current);return;}
    a.play().catch(()=>{});
    setPlaying(true); setPlayed(true);
    ivRef.current=setInterval(()=>{
      if(a.duration) setProgress((a.currentTime/a.duration)*100);
      if(a.ended){setPlaying(false);clearInterval(ivRef.current);}
    },180);
  };
  useEffect(()=>()=>clearInterval(ivRef.current),[]);

  const bars = Array.from({length:36},(_,i)=>{
    const h=[35,55,75,45,85,40,70,60,90,48,65,55,92,42,68,78,52,88,38,72,58,82,46,62,76,44,68,52,88,58,72,46,80,55,70,48][i]||50;
    const filled=(i/36)*100<=progress;
    return {h, filled};
  });

  return (
    <Card narrow>
      <audio ref={audioRef} src={CONFIG.voiceNoteUrl} onEnded={()=>{setPlaying(false);setProgress(100);}}/>
      <SectionHead kicker="🎙️ Voice Note · From Hassan"
        title={<>A Message <span className="gold-shine">Just For You</span></>}
        sub="Type se zyada powerful hai voice. Ye message sirf apke liye record kiya gaya."/>

      <TiltCard>
        <div className="voice-panel" style={{maxWidth:580,margin:"0 auto",textAlign:"center"}}>
          {/* Star field inside */}
          {useMemo(()=>Array.from({length:22},(_,i)=>({
            id:i,l:`${Math.random()*100}%`,t:`${Math.random()*50}%`,
            del:`${Math.random()*2}s`,dur:`${1.5+Math.random()*2}s`,
          })),[]).map(s=>(
            <span key={s.id} style={{position:"absolute",left:s.l,top:s.t,width:1.5,height:1.5,
              borderRadius:"50%",background:"rgba(255,248,225,.7)",
              animation:`silStarTwinkle ${s.dur} ease-in-out ${s.del} infinite`}}/>
          ))}
          <div style={{position:"relative",zIndex:1}}>
            {/* Big play button */}
            <div style={{position:"relative",display:"inline-block",marginBottom:"1.4rem"}}>
              {playing&&<>
                <div style={{position:"absolute",inset:-14,borderRadius:"50%",border:"1.5px solid rgba(212,83,107,.55)",animation:"pulse-ring 1.4s ease-out infinite"}}/>
                <div style={{position:"absolute",inset:-22,borderRadius:"50%",border:"1px solid rgba(212,83,107,.3)",animation:"pulse-ring 1.4s ease-out .5s infinite"}}/>
              </>}
              <style>{`@keyframes pulse-ring{0%{transform:scale(.85);opacity:1}100%{transform:scale(2.2);opacity:0}}`}</style>
              <motion.button onClick={toggle} whileHover={{scale:1.08}} whileTap={{scale:.92}}
                style={{width:88,height:88,borderRadius:"50%",border:"1.5px solid rgba(255,220,160,.30)",
                  background:"radial-gradient(circle at 36% 30%, rgba(255,255,255,.22), rgba(201,168,76,.14), rgba(212,83,107,.18))",
                  boxShadow:playing?"0 0 50px rgba(212,83,107,.55), 0 16px 40px rgba(0,0,0,.5)":"0 16px 40px rgba(0,0,0,.5)",
                  fontSize:"2rem",color:"#fff",cursor:"pointer",position:"relative",
                  transition:"box-shadow .3s"}}>
                {playing?"⏸️":"▶️"}
              </motion.button>
            </div>

            <motion.h3 key={played?playing?"p":"d":"i"} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
              className="f-display" style={{color:"var(--cream)",fontSize:"1.6rem",fontWeight:700,marginBottom:".4rem"}}>
              {playing?"Suno… ❤️":played?"Dobara sunna hai? 🥹":"Play Message from Hassan"}
            </motion.h3>
            <p className="copy f-body" style={{fontSize:".88rem",marginBottom:"1.4rem"}}>
              {played?"Main lucky hun ke tum meri life me ho ❤️":"Happy Birthday… Allah tumhe hamesha khush rakhe…"}
            </p>

            {/* Waveform */}
            <div style={{display:"flex",alignItems:"center",gap:3,height:44,justifyContent:"center"}}>
              {bars.map((b,i)=>(
                <motion.div key={i} className="wavebar"
                  animate={playing&&b.filled?{scaleY:[1,1.5,.7,1.3,1]}:{scaleY:1}}
                  transition={{duration:.4,delay:i*.015,repeat:playing?Infinity:0}}
                  style={{
                    width:5,flex:"0 0 5px",borderRadius:3,
                    height:`${b.h}%`,
                    background:b.filled
                      ?"linear-gradient(180deg,var(--gold2),var(--rose))"
                      :"rgba(255,240,210,.14)",
                    boxShadow:b.filled?"0 0 6px rgba(201,168,76,.4)":"none",
                    transition:"background .25s",
                  }}/>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>

      <motion.p className="f-script" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}
        style={{textAlign:"center",color:"var(--gold2)",fontSize:"1.1rem",marginTop:"1rem",opacity:.8}}>
        💡 /audio/voice-message.mp3 pe apni recording rakho
      </motion.p>
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
  const ivRef=useRef(null);
  const toRef=useRef(null);

  const spawn=useCallback(()=>{
    const id=Date.now()+Math.random();
    const e=["❤️","💖","🌹","💝","✨"][Math.floor(Math.random()*5)];
    setHearts(h=>[...h.slice(-12),{id,e,x:8+Math.random()*84,y:12+Math.random()*72}]);
  },[]);

  const start=()=>{
    clearInterval(ivRef.current); clearTimeout(toRef.current);
    setStarted(true);setDone(false);setCaught(0);setHearts([]);
    spawn();
    ivRef.current=setInterval(spawn,820);
    toRef.current=setTimeout(()=>{clearInterval(ivRef.current);setDone(true);},13000);
  };
  const catchIt=id=>{
    setHearts(h=>h.filter(x=>x.id!==id));
    setCaught(c=>{if(c+1>=8){setRain(true);setTimeout(()=>setRain(false),2800);}return c+1;});
  };
  useEffect(()=>()=>{clearInterval(ivRef.current);clearTimeout(toRef.current);},[]);

  return (
    <Card wide>
      <EmojiRain active={rain} emojis={["❤️","💖","🌹","✨"]}/>
      <SectionHead kicker="🎮 Mini Game — Catch The Heart"
        title={<>Mera Dil <span className="rose-shine">Pakro</span></>}
        sub="Hearts click karo. Officially mera dil pakarne ki practice — respectfully, birthday edition. 😄"/>

      <div style={{position:"relative",borderRadius:22,overflow:"hidden",
        background:"linear-gradient(145deg,rgba(30,5,15,.85),rgba(10,2,8,.95))",
        border:"1px solid rgba(212,83,107,.18)",height:340,
        boxShadow:"0 18px 60px rgba(0,0,0,.6), inset 0 0 60px rgba(107,16,40,.12)"}}>
        {/* Grid overlay */}
        <div style={{position:"absolute",inset:0,
          backgroundImage:"linear-gradient(rgba(212,83,107,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,83,107,.04) 1px,transparent 1px)",
          backgroundSize:"38px 38px",borderRadius:"inherit"}}/>

        {!started&&(
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
            <motion.div animate={{scale:[1,1.15,1],rotate:[0,8,-8,0]}} transition={{duration:2.2,repeat:Infinity}}
              style={{fontSize:"5rem",filter:"drop-shadow(0 0 24px rgba(212,83,107,.8))"}}>❤️</motion.div>
            <Btn onClick={start}>Start Game →</Btn>
          </div>
        )}

        <AnimatePresence>
          {started&&hearts.map(h=>(
            <motion.button key={h.id} className="heart-btn"
              initial={{scale:0,opacity:0,rotate:-20}}
              animate={{scale:1,opacity:1,rotate:0}}
              exit={{scale:0,opacity:0,y:-30}}
              onClick={()=>catchIt(h.id)}
              style={{left:`${h.x}%`,top:`${h.y}%`}}>
              {h.e}
            </motion.button>
          ))}
        </AnimatePresence>

        {started&&!done&&(
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}}
            style={{position:"absolute",top:12,right:14,
              background:"rgba(10,2,8,.85)",border:"1px solid rgba(212,83,107,.22)",
              borderRadius:10,padding:".4rem .9rem",
              display:"flex",alignItems:"center",gap:6,backdropFilter:"blur(8px)"}}>
            <span style={{filter:"drop-shadow(0 0 6px rgba(212,83,107,.8))"}}>❤️</span>
            <p className="f-body" style={{fontWeight:800,color:"var(--cream)",fontSize:".9rem"}}>{caught}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {done&&(
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",background:"rgba(4,1,10,.88)",backdropFilter:"blur(14px)",
                textAlign:"center",padding:"2rem"}}>
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:260,damping:18}}
                style={{fontSize:"3.5rem",marginBottom:".8rem",filter:"drop-shadow(0 0 20px rgba(212,83,107,.8))"}}>🎉</motion.div>
              <div className="f-display rose-shine" style={{fontSize:"2rem",fontWeight:700}}>Tumne {caught} dil pakde!</div>
              <p className="copy f-body" style={{marginTop:".5rem"}}>Already tumhare paas tha ❤️<br/>Game sirf confirm karna tha.</p>
              <Btn variant="secondary" onClick={start} style={{marginTop:"1rem"}}>Dobara Khelo 🔄</Btn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Love Meter →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 6: LOVE METER
═══════════════════════════════════════════════════════════════ */
function LoveMeterStep({onNext,onBack}) {
  const [val,setVal]=useState(72);
  const [rain,setRain]=useState(false);
  const idx=val<35?0:val<65?1:val<90?2:3;
  const col=val<35?"#c0783a":val<65?"var(--rose)":val<90?"var(--crimson)":"var(--wine)";
  const perfect=()=>{setVal(100);setRain(true);setTimeout(()=>setRain(false),3000);};

  return (
    <Card narrow>
      <EmojiRain active={rain} emojis={["❤️","💯","💖","✨"]} count={30}/>
      <SectionHead kicker="💘 Love Meter — Fun Section"
        title={<>How <span className="gold-shine">Special</span> Are You?</>}
        sub="Answer to obviously 100 hai, lekin thora birthday drama zaroori hota hai. 😌"/>

      <TiltCard style={{maxWidth:580,margin:"0 auto"}}>
        <div className="mini-card" style={{textAlign:"center",padding:"2.2rem",cursor:"default"}}>
          {/* Labels */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:".8rem"}}>
            {["Normal 😐","Special 🥹","My Fav 💖"].map(l=>(
              <p key={l} className="f-body" style={{fontSize:".68rem",fontWeight:700,color:"var(--cream2)",letterSpacing:".04em"}}>{l}</p>
            ))}
          </div>
          {/* Bar */}
          <div style={{height:20,borderRadius:99,background:"rgba(255,240,210,.09)",overflow:"hidden",padding:3}}>
            <motion.div animate={{width:`${val}%`}} transition={{duration:.35,ease:[.16,1,.3,1]}}
              style={{height:"100%",borderRadius:99,
                background:`linear-gradient(90deg,${col},var(--rose),var(--gold))`,
                boxShadow:`0 0 20px ${col}80`}}>
              <motion.div animate={{x:["0%","200%"]}} transition={{duration:1.5,repeat:Infinity,ease:"linear"}}
                style={{width:"35%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)"}}/>
            </motion.div>
          </div>
          {/* Big number */}
          <motion.div animate={{scale:[1,1.04,1]}} transition={{duration:2,repeat:Infinity}}
            className="f-display gold-shine"
            style={{fontSize:"clamp(3.5rem,9vw,6rem)",fontWeight:700,lineHeight:1,margin:"1.2rem 0 .4rem"}}>
            {val}%
          </motion.div>
          <input type="range" min={1} max={100} value={val} onChange={e=>setVal(+e.target.value)} style={{width:"100%",marginBottom:"1rem"}}/>
          <motion.div key={idx} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            style={{padding:".85rem 1.1rem",borderRadius:14,background:"rgba(107,16,40,.25)",border:"1px solid rgba(212,83,107,.2)"}}>
            <p className="f-script" style={{color:"var(--gold2)",fontSize:"1.2rem"}}>{CONFIG.loveMeterMessages[idx]}</p>
          </motion.div>
        </div>
      </TiltCard>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Promises →"
        extra={<Btn variant="secondary" onClick={perfect}>Make it 100% 💯</Btn>}/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 7: PROMISES
═══════════════════════════════════════════════════════════════ */
function PromisesStep({onNext,onBack}) {
  const [checked,setChecked]=useState({});
  const all=Object.keys(checked).length===CONFIG.promises.length;
  return (
    <Card>
      <SectionHead kicker="🤍 Real Promises — Signed & Sealed"
        title={<>My <span className="gold-shine">Promises</span></>}
        sub="Ye promises abhi ke liye bhi hain aur future ke liye bhi — respect, care aur clean niyat ke saath."/>
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
              <p className="f-script" style={{color:"var(--gold2)",fontSize:"1.25rem"}}>Sab promises confirm! Witnesses: dil aur Allah ❤️</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextLabel="Read Letter →"/>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN 8: LETTER
═══════════════════════════════════════════════════════════════ */
function LetterStep({onNext,onBack}) {
  return (
    <Card narrow>
      <SectionHead kicker="💌 Main Scene — The Letter"
        title={<><span className="gold-shine">Birthday</span> Letter</>}
        sub="Simple, readable, emotional — exactly waisa jaisa ek respectful birthday letter hona chahiye."/>
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
   SCREEN 9: FINALE
═══════════════════════════════════════════════════════════════ */
function FinalStep({onBack}) {
  const [yes,setYes]=useState(false);
  const [no,setNo]=useState(0);
  const noTexts=["Nahi? 😅","Soch lo 😄","Dua me yaad rakhna ❤️","Ameen best hai 🥹","Ye button sirf drama hai 😌","Aik baar aur try karo 😄"];

  return (
    <Card narrow>
      <Confetti active={yes}/>
      <EmojiRain active={yes} emojis={["❤️","💖","🎊","✨","🌷","💍"]} count={32}/>

      <div style={{textAlign:"center",maxWidth:620,margin:"0 auto"}}>
        <TiltCard style={{display:"inline-block",marginBottom:"1.6rem"}}>
          <motion.div animate={{y:[0,-10,0],rotate:[0,5,-5,0]}}
            transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
            style={{width:100,height:100,borderRadius:30,display:"grid",placeItems:"center",fontSize:"3rem",
              background:"linear-gradient(145deg,var(--gold2),var(--rose),var(--wine))",
              boxShadow:"0 24px 65px rgba(212,83,107,.40), inset 0 1px 0 rgba(255,255,255,.18)"}}>❤️</motion.div>
        </TiltCard>

        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}}>
          <Kicker>✨ Final Scene · The Ending</Kicker>
          <div className="title-xl" style={{marginTop:".9rem",lineHeight:.88}}>
            <span className="gold-shine">Happy First</span><br/>
            <span className="rose-shine">Birthday</span><br/>
            Together
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
            Agle Saal InshaAllah? 🤍
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
                I Love You ❤️
              </motion.div>
              <p className="copy f-body" style={{maxWidth:480,margin:".6rem auto 0"}}>
                Ye birthday surprise officially complete ho gaya. Ye sirf ek page nahi — ye ek beginning hai. Saath ke liye. Hamesha ke liye. 💍
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
    <VoiceStep    key="voice"    onNext={next} onBack={back}/>,
    <HeartGameStep key="game"   onNext={next} onBack={back}/>,
    <LoveMeterStep key="meter"  onNext={next} onBack={back}/>,
    <PromisesStep  key="promises" onNext={next} onBack={back}/>,
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