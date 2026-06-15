import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:    #080808;
    --offwhite: #F0EEE8;
    --muted:    #888680;
    --accent:   #3D8EFF;
    --card:     #111111;
    --border:   rgba(255,255,255,0.08);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--offwhite);
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.65;
    overflow-x: hidden;
  }

  h1,h2,h3,h4,h5 {
    font-family: 'Space Grotesk', sans-serif;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 2.5rem;
    transition: background 0.4s, backdrop-filter 0.4s;
  }
  nav.scrolled {
    background: rgba(8,8,8,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 0.5px solid var(--border);
  }
  .nav-logo {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700; font-size: 2rem;
    letter-spacing: -0.04em; color: var(--offwhite);
    text-decoration: none;
  }
  .nav-links {
    display: flex; gap: 2.5rem; list-style: none;
  }
  .nav-links a {
    color: rgba(240,238,232,0.55); text-decoration: none;
    font-size: 1.3rem; font-weight: 400;
    letter-spacing: 0.01em;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--offwhite); }
  .nav-cta {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: var(--offwhite);
    padding: 0.55rem 1.4rem;
    border-radius: 99px;
    font-size: 0.9rem; font-weight: 500;
    cursor: pointer; transition: all 0.25s;
    font-family: 'Inter', sans-serif;
    text-decoration: none;
    letter-spacing: 0.01em;
  }
  .nav-cta:hover {
    background: var(--offwhite);
    color: var(--black);
    border-color: var(--offwhite);
  }

  /* ── HERO ── */
  #hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center;
  }
  #hero-canvas {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 0;
  }
  .hero-content {
    position: relative; z-index: 2;
    padding: 0 2.5rem;
    max-width: 820px;
  }
  .hero-eyebrow {
    font-size: 0.78rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(173,212,255,0.6); margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .hero-eyebrow::before {
    content: ''; display: inline-block;
    width: 24px; height: 1px; background: rgba(173,212,255,0.4);
  }
  .hero-h1 {
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    font-weight: 700;
    color: var(--offwhite);
    margin-bottom: 1.5rem;
  }
  .hero-h1 em {
    font-style: normal;
    color: var(--offwhite);
    opacity: 0.75;
  }
  .hero-sub {
    font-size: 1.1rem; color: var(--muted);
    max-width: 520px; margin-bottom: 2.5rem;
    line-height: 1.7;
  }
  .hero-actions {
    display: flex; gap: 1rem; flex-wrap: wrap;
  }
  .btn-primary {
    background: var(--offwhite);
    color: var(--black);
    border: 1px solid transparent;
    padding: 0.85rem 2rem;
    border-radius: 99px;
    font-size: 0.95rem; font-weight: 600;
    cursor: pointer; transition: all 0.25s;
    font-family: 'Space Grotesk', sans-serif;
    text-decoration: none; display: inline-block;
  }
  .btn-primary:hover {
    background: transparent;
    color: var(--offwhite);
    border-color: rgba(255,255,255,0.35);
    transform: translateY(-1px);
  }
  .btn-ghost {
    background: transparent;
    color: var(--offwhite);
    border: 1px solid var(--border);
    padding: 0.85rem 2rem;
    border-radius: 99px;
    font-size: 0.95rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Space Grotesk', sans-serif;
    text-decoration: none; display: inline-block;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.4); }
  .hero-scroll {
    position: absolute; bottom: 2.5rem; left: 2.5rem;
    display: flex; align-items: center; gap: 0.5rem;
    color: var(--muted); font-size: 0.78rem; letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .scroll-line {
    width: 40px; height: 1px; background: var(--muted);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse {
    0%,100% { opacity: 0.4; width: 40px; }
    50% { opacity: 1; width: 60px; }
  }

  /* ── SECTIONS ── */
  section { padding: 7rem 2.5rem; }
  .section-label {
    font-size: 0.75rem; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 1rem;
  }
  .section-title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700; color: var(--offwhite);
    margin-bottom: 1rem;
  }
  .section-sub {
    font-size: 1rem; color: var(--muted);
    max-width: 520px; line-height: 1.7;
  }

  /* ── PROBLEM ── */
/* ── PROBLEM ── */
  #problema { border-top: 0.5px solid var(--border); }
  .prob-scroll-track { height: 160vh; position: relative; }
  .prob-sticky {
    position: sticky; top: 0; height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    padding: 0 4rem; overflow: hidden;
  }
  .prob-inner { width: 100%; max-width: 680px; }
  .prob-label-top {
    font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 0.75rem;
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .prob-label-top.vis { opacity: 1; transform: translateY(0); }
  .prob-headline {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700;
    letter-spacing: -0.025em; color: var(--offwhite); margin-bottom: 3rem;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
  }
  .prob-headline.vis { opacity: 1; transform: translateY(0); }
  .prob-row {
    display: grid; grid-template-columns: 3rem 1fr;
    gap: 1.5rem; align-items: baseline;
    padding: 1.1rem 0; border-bottom: 0.5px solid var(--border);
    opacity: 0; transform: translateX(32px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .prob-row:first-child { border-top: 0.5px solid var(--border); }
  .prob-row.vis { opacity: 1; transform: translateX(0); }
  .prob-row-num {
    font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; font-weight: 600;
    color: rgba(255,255,255,0.18); letter-spacing: 0.08em; transition: color 0.3s;
  }
  .prob-row.vis .prob-row-num { color: var(--accent); }
  .prob-row-text { font-size: 1.15rem; color: var(--muted); line-height: 1.5; transition: color 0.3s; }
  .prob-row.vis .prob-row-text { color: var(--offwhite); }
  .prob-stat-wrap {
    margin-top: 2.5rem; display: flex; align-items: baseline; gap: 1.5rem;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .prob-stat-wrap.vis { opacity: 1; transform: translateY(0); }
  .prob-stat-num {
    font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 700; letter-spacing: -0.04em; color: var(--offwhite); line-height: 1; white-space: nowrap;
  }
  .prob-stat-num span { color: var(--accent); }
  .prob-stat-desc { font-size: 0.88rem; color: var(--muted); line-height: 1.6; max-width: 280px; }
  @media (max-width: 900px) {
    .prob-sticky { padding: 0 1.5rem; }
    .prob-scroll-track { height: 400vh; }
  }

 /* ── PLANOS ── */
  #planos { border-top: 0.5px solid var(--border); padding: 7rem 2.5rem; }
  .planos-hero { margin-bottom: 5rem; }
  .planos-hero-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(2.8rem, 6vw, 5.5rem);
    font-weight: 700; line-height: 1.05;
    letter-spacing: -0.03em; color: var(--offwhite);
    max-width: 700px; margin-bottom: 1.5rem;
  }
  .planos-hero-sub {
    font-size: 1rem; color: var(--muted);
    max-width: 480px; line-height: 1.7;
  }
  .planos-bento {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
  }
 
  /* Glow cursor effect */
.plano-box {
    background: #080808;
    border: 1.5px solid rgba(255,255,255,0.18);
    border-radius: 16px;
    padding: 0;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
    cursor: default;
  }
  .pb-track {
    position: absolute; inset: 0;
    overflow: hidden; border-radius: 16px;
    pointer-events: none; z-index: 0;
  }
 .pb-glow {
    position: absolute;
    width: 500px; height: 500px;
    left: 50%; top: 50%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(61,142,255,0.25) 0%, rgba(61,142,255,0.08) 40%, transparent 70%);
    filter: blur(20px);
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: opacity 0.5s;
  }

.pb-border-track {
    position: absolute; inset: -1px;
    border-radius: 17px;
    overflow: hidden;
    pointer-events: none; z-index: 2;
  }
  .pb-border-glow {
    position: absolute;
    width: 120px; height: 120px;
    left: 50%; top: 50%;
    border-radius: 50%;
    background: rgba(61,142,255,0.9);
    filter: blur(8px);
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
  }

  .pb-content {
    position: relative; z-index: 1;
    padding: 2.5rem;
    display: flex; flex-direction: column;
    justify-content: space-between;
    gap: 1.25rem; height: 100%;
  }
  .plano-box-dot {
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--offwhite);
  }
  .plano-box-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem; font-weight: 700;
    color: var(--offwhite); letter-spacing: -0.02em;
  }
  .plano-box-desc {
    font-size: 0.92rem; color: var(--muted);
    line-height: 1.7; flex: 1;
  }
  .plano-box-cta {
    font-size: 0.82rem; font-weight: 500;
    color: rgba(255,255,255,0.4); text-decoration: none;
    display: flex; align-items: center; gap: 0.4rem;
    transition: color 0.2s; margin-top: auto;
  }
  .plano-box:hover .plano-box-cta { color: var(--offwhite); }
  .plano-box.tall { grid-row: 1 / 3; }
  .plano-box:hover {
    background-clip: padding-box;
    
  }
  


  .planos-cta-wrap {
    margin-top: 5rem;
    display: flex; flex-direction: column;
    align-items: center; gap: 2rem; text-align: center;
  }
  .planos-cta-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 700; letter-spacing: -0.025em; color: var(--offwhite);
  }
  .planos-cta-title span { font-weight: 900; }
  .spiral-svg { opacity: 0.5; }

  @media (max-width: 900px) {
    .planos-bento { grid-template-columns: 1fr; }
    .plano-box.tall { grid-row: auto; }
  }
  
  /* ── MÉTODO ── */
  #metodo { border-top: 0.5px solid var(--border); }
  .metodo-steps {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 0; margin-top: 4rem; position: relative;
  }
  .metodo-steps::before {
    content: ''; position: absolute;
    top: 2rem; left: calc(12.5% + 1rem); right: calc(12.5% + 1rem);
    height: 0.5px; background: var(--border);
  }
  .metodo-step { padding: 0 2rem 0 0; position: relative; }
  .step-num {
    width: 3.5rem; height: 3.5rem; border-radius: 50%;
    background: var(--card); border: 0.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; font-weight: 700;
    color: var(--accent); margin-bottom: 1.5rem; position: relative; z-index: 1;
    transition: background 0.3s, border-color 0.3s;
  }
  .metodo-step:hover .step-num { background: rgba(61,142,255,0.1); border-color: var(--accent); }
  .step-title { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; color: var(--offwhite); margin-bottom: 0.5rem; }
  .step-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; }

  /* ── DIFERENCIAL ── */
  #diferencial { border-top: 0.5px solid var(--border); }
  .dif-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
  .dif-card { background: var(--card); border-radius: 20px; border: 0.5px solid var(--border); padding: 2rem; }
  .dif-card-title {
    font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 1.5rem;
  }
  .dif-items { display: flex; flex-direction: column; gap: 0.75rem; }
  .dif-item {
    font-size: 0.95rem; padding: 0.75rem 0; border-bottom: 0.5px solid var(--border);
    display: flex; align-items: center; gap: 0.75rem;
  }
  .dif-item:last-child { border-bottom: none; padding-bottom: 0; }
  .dif-item.strike { color: var(--muted); text-decoration: line-through; }
  .dif-item.highlight { color: var(--offwhite); }
  .dif-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .dif-dot.gray { background: var(--border); }
  .dif-dot.blue { background: var(--accent); }

  /* ── CREATIVE ── */
  #creative { border-top: 0.5px solid var(--border); }
  .creative-inner {
    background: var(--card); border: 0.5px solid var(--border); border-radius: 24px; padding: 4rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
  }
  .creative-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 2rem; }
  .tag {
    background: rgba(255,255,255,0.05); border: 0.5px solid var(--border); color: var(--muted);
    padding: 0.4rem 0.9rem; border-radius: 99px; font-size: 0.8rem;
  }

  /* ── FAQ ── */
  #faq { border-top: 0.5px solid var(--border); }
  .faq-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin-top: 3rem;
    border: 0.5px solid var(--border); border-radius: 20px; overflow: hidden;
  }
  .faq-item { background: var(--card); padding: 2rem; cursor: pointer; transition: background 0.2s; }
  .faq-item:hover { background: #151515; }
  .faq-q {
    font-family: 'Space Grotesk', sans-serif; font-size: 0.95rem; font-weight: 600;
    color: var(--offwhite); margin-bottom: 0.75rem;
    display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;
  }
  .faq-toggle {
    width: 22px; height: 22px; flex-shrink: 0; border-radius: 50%;
    border: 0.5px solid var(--border); display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: var(--accent); transition: transform 0.3s;
  }
  .faq-item.open .faq-toggle { transform: rotate(45deg); }
  .faq-a {
    font-size: 0.875rem; color: var(--muted); line-height: 1.7;
    max-height: 0; overflow: hidden; transition: max-height 0.4s ease;
  }
  .faq-item.open .faq-a { max-height: 300px; }

  /* ── CTA FINAL ── */
  #cta-final { border-top: 0.5px solid var(--border); text-align: center; }
  .cta-final-inner { max-width: 680px; margin: 0 auto; }
  .cta-wave-big { font-size: 5rem; line-height: 1; margin-bottom: 1rem; }

  /* ── FORM ── */
  #contacto { border-top: 0.5px solid var(--border); }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 3rem; }
  .form-full { grid-column: 1 / -1; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-label { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.05em; color: var(--muted); text-transform: uppercase; }
  .form-input, .form-select {
    background: var(--card); border: 0.5px solid var(--border); color: var(--offwhite);
    padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.9rem; font-family: 'Inter', sans-serif;
    transition: border-color 0.2s; appearance: none; -webkit-appearance: none;
  }
  .form-input:focus, .form-select:focus { outline: none; border-color: var(--accent); }
  .form-input::placeholder { color: rgba(136,134,128,0.5); }
  .form-select option { background: #111; color: var(--offwhite); }
  .form-submit {
    grid-column: 1 / -1; background: var(--offwhite); color: var(--black); border: none;
    padding: 1rem 2rem; border-radius: 99px; font-size: 1rem; font-weight: 600;
    font-family: 'Space Grotesk', sans-serif; cursor: pointer; transition: all 0.2s;
    margin-top: 1rem; width: 100%;
  }
  .form-submit:hover { opacity: 0.88; transform: translateY(-1px); }
  .form-privacy { grid-column: 1 / -1; font-size: 0.78rem; color: var(--muted); text-align: center; margin-top: 0.5rem; }

  /* ── FOOTER ── */
  footer {
    border-top: 0.5px solid var(--border); padding: 3rem 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .footer-logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.3rem; letter-spacing: -0.02em; color: var(--offwhite); }
  .footer-links { display: flex; gap: 2rem; list-style: none; }
  .footer-links a { font-size: 0.85rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--offwhite); }
  .footer-copy { font-size: 0.78rem; color: var(--muted); }

  /* ── MANIFESTO ── */
  #manifesto {
    min-height: 100vh;
    border-top: 0.5px solid var(--border);
    display: grid;
    grid-template-columns: 1fr 1.8fr;
    position: relative;
    overflow: hidden;
  }
  .manifesto-left {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  .manifesto-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6rem 3rem;
    gap: 3rem;
    min-width: 0;
  }
  .manifesto-p {
    font-size: clamp(2.5rem, 3vw, 4.2rem);
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: -0.01em;
    text-align: right;
    color: var(--offwhite);
    width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    
  }

  .manifesto-sub {
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-family: 'Inter', sans-serif;
    text-align: center;
    color: rgba(240,238,232,0.35);
  }
  .tw-char { display: inline; }

  @media (max-width: 900px) {
    #manifesto { grid-template-columns: 1fr; }
    .manifesto-left { min-height: 60vw; }
    .manifesto-right { padding: 3rem 1.5rem; }
    .manifesto-p { font-size: 1.4rem; }
  }

  /* ── FADE IN ── */
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 900px) {
    nav { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    section { padding: 5rem 1.5rem; }
    .hero-content { padding: 0 1.5rem; }
    .problema-grid, .dif-grid, .creative-inner { grid-template-columns: 1fr; }
    .planos-grid { grid-template-columns: 1fr; }
    .metodo-steps { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .metodo-steps::before { display: none; }
    .faq-grid { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    footer { flex-direction: column; gap: 2rem; text-align: center; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

/* ─────────────────────────────────────────────
   THREE.JS HERO CANVAS
───────────────────────────────────────────── */
function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 6;

    const wMat = () => new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.32, transparent: true });
    const aMat = () => new THREE.MeshBasicMaterial({ color: 0xadd4ff, wireframe: true, opacity: 0.26, transparent: true });
    const gMat = () => new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.20, transparent: true });

    /*
      dir X: +1 = começa à direita, vai para a esquerda no scroll
             -1 = começa à esquerda, vai para a direita no scroll
      dir Y: +1 = sobe no scroll, -1 = desce no scroll
      baseScale: tamanho inicial
      scrollScaleMult: quanto cresce por unidade de scroll normalizada
    */
    const objects = [
      {
        mesh: new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.35, 24, 80), aMat()),
        baseX: 3.2, baseY: 0.3, baseScale: 1.0,
        dirX: -1, dirY: 1,
        speed: 0.0006, phase: 0, maxOp: 0.26, scrollScaleMult: 0.9,
      },
      {
        mesh: new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 24), wMat()),
        baseX: -3.0, baseY: -0.5, baseScale: 1.0,
        dirX: 1, dirY: -1,
        speed: 0.0009, phase: 1.3, maxOp: 0.32, scrollScaleMult: 0.7,
      },
      {
        mesh: new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), aMat()),
        baseX: 2.0, baseY: 2.2, baseScale: 0.9,
        dirX: -1, dirY: 1,
        speed: 0.0007, phase: 2.1, maxOp: 0.26, scrollScaleMult: 1.1,
      },
      {
        mesh: new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.18, 100, 16), wMat()),
        baseX: -1.8, baseY: -2.0, baseScale: 0.9,
        dirX: 1, dirY: -1,
        speed: 0.0005, phase: 0.7, maxOp: 0.32, scrollScaleMult: 0.8,
      },
      {
        mesh: new THREE.Mesh(new THREE.OctahedronGeometry(0.6), gMat()),
        baseX: 0.4, baseY: 3.0, baseScale: 0.85,
        dirX: -1, dirY: 1,
        speed: 0.0008, phase: 1.8, maxOp: 0.20, scrollScaleMult: 1.2,
      },
    ];

    objects.forEach(o => {
      o.mesh.position.set(o.baseX, o.baseY, 0);
      o.mesh.scale.setScalar(o.baseScale);
      scene.add(o.mesh);
    });

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let scrollY = 0;
    let animFrame;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Blur canvas element conforme scroll — simula depth of field */
    const blurCanvas = () => {
      const blurPx = Math.min(scrollY * 0.008, 5);
      canvas.style.filter = blurPx > 0.2 ? `blur(${blurPx.toFixed(1)}px)` : '';
    };

    const tick = (t) => {
      animFrame = requestAnimationFrame(tick);
      blurCanvas();

      /* Scroll normalizado — 0 = topo, 1 = depois de 1 viewport de scroll */
      const scrollNorm = scrollY / (window.innerHeight || 800);

      objects.forEach((o) => {
        /* Flutuação orgânica */
        const floatY = Math.sin(t * o.speed + o.phase) * 0.5;
        const floatX = Math.cos(t * o.speed * 0.7 + o.phase) * 0.15;

        /* Movimento de scroll */
        const moveX = o.dirX * scrollNorm * 4.5;   /* cruza a tela horizontalmente */
        const moveY = o.dirY * scrollNorm * 3.5;   /* sobe ou desce */

        o.mesh.position.x = o.baseX + floatX + moveX;
        o.mesh.position.y = o.baseY + floatY + moveY;

        /* Escala cresce com o scroll */
        const s = o.baseScale + scrollNorm * o.scrollScaleMult;
        o.mesh.scale.setScalar(s);

        /* Rotação diretamente pela posição do scroll — para se parar, recua se voltar */
        const rotScroll = scrollNorm * Math.PI * 2;
        o.mesh.rotation.x = rotScroll * (0.8 + (o.phase % 1) * 0.6);
        o.mesh.rotation.y = rotScroll * (1.0 + (o.phase % 1) * 0.4);
        o.mesh.rotation.z = rotScroll * (o.dirX * 0.3);

        /* Opacidade: máxima enquanto dentro do viewport NDC, fade só na borda */
        const worldPos = new THREE.Vector3();
        o.mesh.getWorldPosition(worldPos);
        const proj = worldPos.clone().project(camera);

        /* proj.x e proj.y em NDC: -1 a 1 = dentro do ecrã */
        const marginX = 0.15;
        const marginY = 0.15;
        const outX = Math.max(0, Math.abs(proj.x) - (1 + marginX));
        const outY = Math.max(0, Math.abs(proj.y) - (1 + marginY));
        const out  = Math.max(outX, outY);
        const fade = Math.max(0, 1 - out * 4);

        o.mesh.material.opacity = o.maxOp * fade;
      });

      renderer.render(scene, camera);
    };
    animFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrame);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" />;
}

/* ─────────────────────────────────────────────
   DODECAHEDRON CANVAS
───────────────────────────────────────────── */
function DodecaCanvas({ canvasId, size }) {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = size === 'mini' ? 4.0 : 4.2;

    const geo = new THREE.DodecahedronGeometry(1.5, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff, wireframe: true, opacity: 0, transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const resize = () => {
      const w = wrap.clientWidth || 300;
      renderer.setSize(w, w, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const maxOp  = size === 'mini' ? 0.22 : 0.38;
    let entered  = false;
    let t        = size === 'mini' ? 2.0 : 0;
    let animFrame;

    /* Só começa a animar quando visível */
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) entered = true;
    }, { threshold: 0.05 });
    io.observe(wrap);

    const tick = () => {
      animFrame = requestAnimationFrame(tick);
      if (!entered) return;

      t += size === 'mini' ? 0.005 : 0.007;

      /* Fade-in rápido */
      mat.opacity = Math.min(mat.opacity + 0.015, maxOp + Math.sin(t * 0.9) * 0.04);

      mesh.rotation.x = t * 0.14;
      mesh.rotation.y = t * 0.22;
      mesh.rotation.z = t * 0.07;
      mesh.scale.setScalar(1 + Math.sin(t * 1.0) * 0.025);

      renderer.render(scene, camera);
    };
    animFrame = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(animFrame); ro.disconnect(); io.disconnect(); renderer.dispose(); };
  }, []);

  return (
    <div ref={wrapRef} style={{ width: '100%', aspectRatio: '1' }}>
      <canvas ref={canvasRef} id={canvasId} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCROLL TYPEWRITER HOOK
───────────────────────────────────────────── */
function useScrollTypewriter(sectionId) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const spans = section.querySelectorAll('.tw-char');
    if (!spans.length) return;
    const total = spans.length;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight;
      const prog = Math.max(0, Math.min(1, (winH - rect.top) / (rect.height + winH * 0.3)));
      const reveal = Math.floor(prog * total);
      spans.forEach((s, i) => { s.style.opacity = i < reveal ? '1' : '0.12'; });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
}

function TypewriterText({ text, style }) {
  const words = text.split(' ');
  let charIndex = 0;
  return (
    <span style={style}>
      {words.map((word, wi) => {
        const wordSpans = word.split('').map((ch, ci) => {
          const idx = charIndex++;
          return <span key={idx} className="tw-char" style={{ opacity: 0.12, transition: 'opacity 0.03s' }}>{ch}</span>;
        });
        if (wi < words.length - 1) charIndex++; // espaço
        return (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {wordSpans}
            {wi < words.length - 1 && (
              <span className="tw-char" style={{ opacity: 0.12, transition: 'opacity 0.03s' }}>&nbsp;</span>
            )}
          </span>
        );
      })}
    </span>
  );
}
/* ─────────────────────────────────────────────
   PROBLEMA — scroll storytelling
───────────────────────────────────────────── */
function ProblemaSection() {
  const trackRef  = useRef(null);
  const headerRef = useRef(null);
  const titleRef  = useRef(null);
  const rowRefs   = useRef([]);
  const statRef   = useRef(null);

  const problems = [
    'A sua empresa existe. O serviço é bom. Mas não aparece nas pesquisas do Google.',
    'O website tem visitas — mas não gera contactos nem pedidos.',
    'Os leads chegam de forma desorganizada e perdem-se.',
    'Perde oportunidades por falta de acompanhamento.',
    'A concorrência com serviços inferiores ganha terreno apenas por ter melhor presença digital.',
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const STEPS = problems.length + 3;
    const onScroll = () => {
      const rect    = track.getBoundingClientRect();
      const trackH  = track.offsetHeight;
      const winH    = window.innerHeight;
      const scrolled = Math.max(0, winH - rect.top - 300); // 300px de margem para começar a animar antes de entrar totalmente
      const total   = trackH - winH; // 200% da altura da viewport para terminar a animação
      const prog    = Math.min(1, scrolled / total);
      const step    = prog * STEPS;
      if (headerRef.current) headerRef.current.classList.toggle('vis', step >= 0.1);
      if (titleRef.current)  titleRef.current.classList.toggle('vis', step >= 0.2);
      rowRefs.current.forEach((el, i) => {
        if (el) el.classList.toggle('vis', step >= 1.5 + i * 1.8);
      });
      const statVisible = step >= STEPS - 1 // aparece no final, depois de todos os rows
if (statRef.current && !statRef.current.classList.contains('vis') && statVisible) {
  statRef.current.classList.add('vis');
  /* animação de contagem */
  const el = document.getElementById('count7');
  if (el) {
    let n = 0;
    const interval = setInterval(() => {
      n++;
      el.textContent = n;
      if (n >= 7) clearInterval(interval);
    }, 80);
  }
} else if (!statVisible) {
  statRef.current?.classList.remove('vis');
  const el = document.getElementById('count7');
  if (el) el.textContent = '0';
}
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="problema">
      <div className="prob-scroll-track" ref={trackRef}>
        <div className="prob-sticky">
          <div className="prob-inner">
            <p className="prob-label-top" ref={headerRef}>O problema</p>
            <h2 className="prob-headline" ref={titleRef}>Já passou por isto?</h2>
            {problems.map((item, i) => (
              <div key={i} className="prob-row" ref={el => rowRefs.current[i] = el}>
                <span className="prob-row-num">0{i + 1}</span>
                <span className="prob-row-text">{item}</span>
              </div>
            ))}
            <div className="prob-stat-wrap" ref={statRef}>
              <div className="prob-stat-num">+<span id="count7">0</span> em 10</div>
              <p className="prob-stat-desc">pequenas empresas perdem clientes todos os dias para concorrentes com melhor presença digital.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




/* ─────────────────────────────────────────────
   MANIFESTO SECTION
───────────────────────────────────────────── */
function ManifestoSection() {
  useScrollTypewriter('manifesto');

  const line1 = 'Na Onda, acreditamos no poder de transformar empresas em experiências que conectam e inspiram.';
  const line2 = 'Assim como as ondas do oceano, somos guiados pelo movimento, pela energia e pela unicidade de cada projeto.';

  return (
    <section id="manifesto">

      {/* ESQUERDA — dodecaedro grande + mini no canto inferior direito */}
      <div className="manifesto-left">
        {/* Principal — ocupa ~70% da coluna */}
        <div style={{ width: '72%', maxWidth: '400px' }}>
          <DodecaCanvas canvasId="dodeca-main" size="main" />
        </div>
        {/* Mini — canto inferior direito da coluna esquerda */}
        <div style={{
          position: 'absolute', bottom: '8%', right: '6%',
          width: '20%', maxWidth: '110px',
        }}>
          <DodecaCanvas canvasId="dodeca-mini" size="mini" />
        </div>
      </div>

      {/* DIREITA — texto */}
      <div className="manifesto-right">
        <p className="manifesto-p" lang="pt">
          <TypewriterText text={line1} />
        </p>
        <p className="manifesto-p" lang="pt">
          <TypewriterText text={line2} />
        </p>
        <p className="manifesto-sub">
          <TypewriterText text="Agência de Crescimento Digital · Lisboa" />
        </p>
      </div>

    </section>
  );
}

/* ─────────────────────────────────────────────
   Planos bento ITEM
───────────────────────────────────────────── */
function PlanosBento() {
  const boxRefs = useRef([]);

  useEffect(() => {
    const onMove = (e) => {
  boxRefs.current.forEach((box) => {
    if (!box) return;
    const glow  = box.querySelector('.pb-glow');
    const track = box.querySelector('.pb-track');
    if (!glow || !track) return;

    const rect    = track.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top  - rect.height / 2;

    /* Distância do cursor ao centro do card */
    const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    const maxDist = 900;
    const proximity = Math.max(0, 1 - dist / maxDist);

    /* Glow interior */
    glow.animate(
      [{ transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))` }],
      { duration: 300, fill: 'forwards' }
    );
    glow.style.opacity = String(proximity);

    /* Borda via box-shadow — só onde o cursor está próximo */
    const glowIntensity = (proximity * 0.6).toFixed(2);
    box.style.boxShadow = proximity > 0.05
      ? `0 0 0 1.5px rgba(61,142,255,${glowIntensity}), 0 0 ${20 * proximity}px rgba(61,142,255,${(proximity * 0.15).toFixed(2)})`
      : '';
  });
};
   window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const planos = [
    {
      name: 'Flow',
      tall: false,
      desc: 'Para negócios que precisam de mais do que visibilidade — precisam de converter. Construímos uma presença digital profissional com landing page otimizada, integração WhatsApp e SEO On-Page para que cada visitante tenha um motivo para entrar em contacto.',
    },
    {
      name: 'One',
      tall: true,
      desc: 'O ponto de partida para qualquer negócio local. Otimizamos o seu Google Business Profile para que apareça nas pesquisas certas, no momento certo, para os clientes certos.',
      },
    {
      name: 'Growth',
      tall: false,
      desc: 'Para empresas prontas para crescer de forma estruturada. Website completo, CRM, blog SEO e acompanhamento estratégico mensal — a infraestrutura digital que o seu negócio precisa para escalar.',
    },
  ];

  return (
    <div className="planos-bento fade-in">
      {planos.map((p, i) => (
        <div
          key={p.name}
          className={`plano-box${p.tall ? ' tall' : ''}`}
          ref={el => boxRefs.current[i] = el}
        >
          {/* Elemento glow que segue o cursor */}
          <div className="pb-track">
            <div className="pb-glow" />
          </div>
          


          {/* Conteúdo por cima */}
          <div className="pb-content">
  <div className="plano-box-dot" />
  <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
    <div className="plano-box-name">{p.name}</div>
    <p className="plano-box-desc">{p.desc}</p>
    <a href="#contacto" className="plano-box-cta">Saber mais →</a>
  </div>
</div>
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-q">
        {q}
        <span className="faq-toggle">+</span>
      </div>
      <div className="faq-a">{a}</div>
    </div>
  );
}

function useFadeIn() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return scrolled;
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function OndaLanding() {
  const navScrolled = useNavScroll();
  useFadeIn();

  const [form, setForm] = useState({
    nome:'', email:'', telefone:'', empresa:'', website:'',
    setor:'', faturacao:'', orcamento:'', objetivo:'', origem:''
  });
  const [sent, setSent] = useState(false);

  const handleForm = e => {
    e.preventDefault();
    setSent(true);
  };

  const faqs = [
    { q: 'Qual é o investimento para trabalhar com a Onda?', a: 'Os nossos serviços começam a partir de 99€/mês. O investimento final depende dos objetivos, da estrutura digital atual e das necessidades de cada negócio. Na reunião estratégica identificamos a solução mais adequada.' },
    { q: 'Trabalham com contratos de fidelização?', a: 'Acreditamos que as parcerias devem existir porque fazem sentido para ambas as partes. Trabalhamos com um compromisso mínimo de 3 meses — necessário para implementar, analisar e otimizar. Após esse período, a continuidade depende dos resultados obtidos.' },
    { q: 'Em quanto tempo posso esperar resultados?', a: 'Cada negócio tem um ponto de partida diferente. Algumas melhorias são percebidas nas primeiras semanas; estratégias de SEO e posicionamento local geram resultados mais consistentes ao longo dos meses.' },
    { q: 'Como medem os resultados?', a: 'Definimos indicadores claros no início: contactos gerados, pedidos de orçamento, chamadas, visibilidade no Google, conversões. Recebe relatórios periódicos e acompanhamento contínuo.' },
    { q: 'A Onda garante resultados?', a: 'Garantimos estratégia, implementação e otimização contínua. Os resultados dependem também de fatores externos — mercado, concorrência, qualidade da oferta. Trabalhamos com objetivos realistas e total transparência.' },
    { q: 'Trabalham com empresas do meu setor?', a: 'Sim. Trabalhamos com hotelaria, turismo, wellness, restauração, marcas de lifestyle e pequenos negócios locais. O mais importante é a vontade de crescer digitalmente.' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <nav className={navScrolled ? 'scrolled' : ''}>
        <a href="#hero" className="nav-logo">✦ ONDA</a>
        <ul className="nav-links">
          <li><a href="#problema">Sobre nós</a></li>
          <li><a href="#planos">Serviços</a></li>
          <li><a href="#metodo">Método</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="#contacto" className="nav-cta">Agendar reunião</a>
      </nav>

      <section id="hero">
        <HeroCanvas />
        <div className="hero-content">
          <p className="hero-eyebrow">Agência de Crescimento Digital · Lisboa</p>
          <h1 className="hero-h1">
            Navegue nas Ondas<br />
            do Marketing<br />
            <em>com Confiança.</em>
          </h1>
          <p className="hero-sub">
            Presença digital, SEO local e automações que transformam visitantes em oportunidades reais.
          </p>
          <div className="hero-actions">
            <a href="#contacto" className="btn-primary">Transforme a sua empresa hoje</a>
            <a href="#planos" className="btn-ghost">Conhecer Soluções</a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          scroll
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <ManifestoSection />

      {/* ── PROBLEMA  ── */}
      <ProblemaSection />

      <section id="planos">
        <div className="planos-hero fade-in">
          <p className="section-label">Pranchas</p>
          <h2 className="planos-hero-title">Quer levar o seu negócio<br />a outro patamar?</h2>
          <p className="planos-hero-sub">Não apenas criamos soluções — desenhamos pranchas que ajudam marcas a surfar desafios com fluidez, confiança e estilo.</p>
        </div>

        <PlanosBento />

        <div className="planos-cta-wrap fade-in">
          <svg className="spiral-svg" width="420" height="420" viewBox="0 0 120 120" fill="none">
            <path d="M60 60 m0 -50 a50 50 0 1 1 -0.1 0" stroke="white" strokeWidth="0.8" fill="none" opacity="0.6"/>
            <path d="M60 60 m0 -40 a40 40 0 1 1 -0.1 0" stroke="white" strokeWidth="0.7" fill="none" opacity="0.5"/>
            <path d="M60 60 m0 -30 a30 30 0 1 1 -0.1 0" stroke="white" strokeWidth="0.6" fill="none" opacity="0.4"/>
            <path d="M60 60 m0 -20 a20 20 0 1 1 -0.1 0" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3"/>
            <path d="M60 60 m0 -10 a10 10 0 1 1 -0.1 0" stroke="white" strokeWidth="0.4" fill="none" opacity="0.2"/>
          </svg>
          <p className="planos-cta-title">Quer surfar nesta <span>ONDA?</span></p>
          <a href="#contacto" className="btn-primary" style={{ fontSize:'1rem', padding:'0.9rem 2.2rem' }}>
            Vem com a gente
          </a>
        </div>
      </section>

      <section id="metodo">
        <div className="fade-in">
          <p className="section-label">Como trabalhamos</p>
          <h2 className="section-title">O Método Onda</h2>
        </div>
        <div className="metodo-steps fade-in">
          {[
            { n:'01', title:'Diagnóstico', desc:'Analisamos o negócio, mercado, concorrência e presença digital atual.' },
            { n:'02', title:'Construção',  desc:'Implementamos a solução mais adequada: Google Business, website, CRM, SEO.' },
            { n:'03', title:'Otimização',  desc:'Analisamos dados e comportamento. Realizamos melhorias contínuas.' },
            { n:'04', title:'Crescimento', desc:'SEO avançado, automações, IA e expansão digital progressiva.' },
          ].map(s => (
            <div key={s.n} className="metodo-step">
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="diferencial">
        <div className="fade-in">
          <p className="section-label">Porquê a Onda</p>
          <h2 className="section-title">Menos complexidade.<br />Mais resultado.</h2>
        </div>
        <div className="dif-grid fade-in">
          <div className="dif-card">
            <div className="dif-card-title">O que as outras agências vendem</div>
            <div className="dif-items">
              {['Websites isolados','Redes sociais genéricas','Design sem estratégia','Contratos longos sem resultados'].map((item,i) => (
                <div key={i} className="dif-item strike"><div className="dif-dot gray" />{item}</div>
              ))}
            </div>
          </div>
          <div className="dif-card" style={{ borderColor:'rgba(61,142,255,0.2)' }}>
            <div className="dif-card-title" style={{ color:'var(--accent)' }}>O que a Onda constrói</div>
            <div className="dif-items">
              {['Uma estrutura digital de crescimento','SEO local que gera visibilidade real','Sistemas que captam e organizam leads','Automações que poupam tempo e dinheiro'].map((item,i) => (
                <div key={i} className="dif-item highlight"><div className="dif-dot blue" />{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="creative">
        <div className="creative-inner fade-in">
          <div>
            <p className="section-label">Divisão criativa</p>
            <h2 className="section-title">Creative<span style={{ color:'var(--accent)' }}>.</span>Onda</h2>
            <p className="section-sub" style={{ marginTop:'1rem' }}>Quando a estratégia encontra a arte. Para marcas que precisam de direção criativa, branding e projetos especiais.</p>
            <div className="creative-tags">
              {['Branding','Direção Criativa','Campanhas','Fotografia','Vídeo','Conteúdo Editorial','Moda'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <a href="#contacto" className="btn-primary" style={{ marginTop:'2rem', display:'inline-block' }}>Saber mais</a>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:'240px', height:'240px', margin:'0 auto', borderRadius:'50%', border:'0.5px solid rgba(61,142,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem' }}>✦</div>
            <p style={{ marginTop:'1.5rem', fontSize:'0.85rem', color:'var(--muted)', fontStyle:'italic' }}>Uma extensão premium da Onda<br />para negócios que procuram diferenciação.</p>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="fade-in">
          <p className="section-label">Perguntas frequentes</p>
          <h2 className="section-title">Respostas diretas.</h2>
        </div>
        <div className="faq-grid fade-in">
          {faqs.map((f,i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      <section id="cta-final">
        <div className="cta-final-inner fade-in">
          <div className="cta-wave-big">🌊</div>
          <p className="section-label">Pronto para surfar?</p>
          <h2 className="section-title" style={{ fontSize:'clamp(2rem,5vw,4rem)' }}>Vamos fazer crescer<br />o seu negócio.</h2>
          <p className="section-sub" style={{ margin:'1.5rem auto 2.5rem', textAlign:'center' }}>Analisamos o seu negócio e identificamos as oportunidades de crescimento digital.</p>
          <a href="#contacto" className="btn-primary" style={{ fontSize:'1.05rem', padding:'1rem 2.5rem' }}>Agendar Reunião Estratégica</a>
        </div>
      </section>

      <section id="contacto">
        <div className="fade-in" style={{ maxWidth:'720px' }}>
          <p className="section-label">Contacto</p>
          <h2 className="section-title">Agendar Reunião<br />Estratégica</h2>
          <p className="section-sub" style={{ marginTop:'0.75rem' }}>Preencha os dados abaixo. A nossa equipa entra em contacto em 24 horas úteis.</p>
        </div>
        {sent ? (
          <div className="fade-in" style={{ marginTop:'3rem', textAlign:'center', padding:'3rem', background:'var(--card)', border:'0.5px solid var(--border)', borderRadius:'20px', maxWidth:'480px' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🌊</div>
            <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", marginBottom:'0.5rem' }}>Mensagem enviada!</h3>
            <p style={{ color:'var(--muted)', fontSize:'0.9rem' }}>Entramos em contacto em 24 horas úteis.</p>
          </div>
        ) : (
          <form onSubmit={handleForm} className="form-grid fade-in">
            {[
              { label:'Nome completo', key:'nome', type:'text', placeholder:'O seu nome' },
              { label:'Email profissional', key:'email', type:'email', placeholder:'email@empresa.com' },
              { label:'Telefone', key:'telefone', type:'tel', placeholder:'+351 9XX XXX XXX' },
              { label:'Nome da empresa', key:'empresa', type:'text', placeholder:'Nome da empresa' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} placeholder={placeholder}
                  value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
            <div className="form-group form-full">
              <label className="form-label">Website ou Instagram</label>
              <input className="form-input" type="text" placeholder="www.empresa.com ou @empresa"
                value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            </div>
            {[
              { label:'Setor de atividade', key:'setor', opts:['Serviços','Saúde','Imobiliário','Hotelaria','Restauração','Retalho','E-commerce','Turismo','Wellness','Outro'] },
              { label:'Faturação mensal aproximada', key:'faturacao', opts:['Menos de 10.000€','10.000 - 25.000€','25.000 - 50.000€','50.000 - 100.000€','Mais de 100.000€'] },
              { label:'Orçamento mensal para marketing', key:'orcamento', opts:['Menos de 500€','500 - 1.000€','1.000 - 2.500€','2.500 - 5.000€','Mais de 5.000€'] },
              { label:'Principal objetivo', key:'objetivo', opts:['Gerar mais leads','Aumentar vendas','Melhorar posicionamento','Lançar novo produto','Outro'] },
            ].map(({ label, key, opts }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <select className="form-select" value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} required>
                  <option value="">Selecionar</option>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Como nos conheceu</label>
              <select className="form-select" value={form.origem} onChange={e => setForm({ ...form, origem: e.target.value })}>
                <option value="">Selecionar</option>
                {['Google','Redes Sociais','Recomendação','Outro'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <button type="submit" className="form-submit">Agendar Reunião Estratégica →</button>
            <p className="form-privacy">Os seus dados são tratados com confidencialidade. Consulte a nossa política de privacidade.</p>
          </form>
        )}
      </section>

      <footer>
        <div className="footer-logo">✦ ONDA</div>
        <ul className="footer-links">
          <li><a href="#problema">Sobre nós</a></li>
          <li><a href="#planos">Serviços</a></li>
          <li><a href="#metodo">Método</a></li>
          <li><a href="#creative">Creative.Onda</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <p className="footer-copy">©2024 Onda · Agência de Marketing em Lisboa</p>
      </footer>
    </>
  );
}