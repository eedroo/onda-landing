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
  #problema { border-top: 0.5px solid var(--border); }
  .problema-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: center; margin-top: 4rem;
  }
  .problema-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
  .problema-list li {
    display: flex; align-items: flex-start; gap: 1rem;
    font-size: 1rem; color: var(--muted);
    padding: 1rem 0; border-bottom: 0.5px solid var(--border);
  }
  .problema-list li:last-child { border-bottom: none; }
  .prob-icon {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); flex-shrink: 0; margin-top: 0.55rem;
  }
  .problema-statement {
    background: var(--card); border: 0.5px solid var(--border);
    border-radius: 20px; padding: 2.5rem;
  }
  .prob-stat-label {
    font-size: 0.75rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 0.75rem;
  }
  .prob-stat-big {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 3.5rem; font-weight: 700;
    color: var(--offwhite); line-height: 1; margin-bottom: 0.5rem;
  }
  .prob-stat-big span { color: var(--accent); }
  .prob-stat-sub { color: var(--muted); font-size: 0.95rem; }
  .prob-divider { height: 0.5px; background: var(--border); margin: 1.5rem 0; }

  /* ── PLANOS ── */
  #planos { border-top: 0.5px solid var(--border); }
  .planos-header {
    display: flex; justify-content: space-between;
    align-items: flex-end; margin-bottom: 3rem; flex-wrap: wrap; gap: 2rem;
  }
  .planos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .plano-card {
    background: var(--card); border: 0.5px solid var(--border);
    border-radius: 20px; padding: 2rem;
    display: flex; flex-direction: column;
    transition: border-color 0.3s, transform 0.3s;
    position: relative; overflow: hidden;
  }
  .plano-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: transparent; transition: background 0.3s;
  }
  .plano-card:hover { border-color: rgba(61,142,255,0.3); transform: translateY(-4px); }
  .plano-card:hover::before { background: var(--accent); }
  .plano-card.destaque { border-color: rgba(61,142,255,0.4); background: #0e1620; }
  .plano-card.destaque::before { background: var(--accent); }
  .plano-badge {
    position: absolute; top: 1.5rem; right: 1.5rem;
    background: rgba(61,142,255,0.15); color: var(--accent);
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.3rem 0.7rem; border-radius: 99px;
  }
  .plano-wave { font-size: 1.8rem; margin-bottom: 1rem; }
  .plano-nome {
    font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700;
    color: var(--offwhite); margin-bottom: 0.25rem;
  }
  .plano-objetivo { font-size: 0.85rem; color: var(--muted); margin-bottom: 1.5rem; line-height: 1.5; }
  .plano-preco { display: flex; align-items: baseline; gap: 0.3rem; margin-bottom: 1.5rem; }
  .plano-valor {
    font-family: 'Space Grotesk', sans-serif; font-size: 2.8rem; font-weight: 700; color: var(--offwhite);
  }
  .plano-currency { font-size: 1.2rem; color: var(--muted); }
  .plano-period { font-size: 0.85rem; color: var(--muted); }
  .plano-features {
    list-style: none; flex: 1; display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 2rem;
  }
  .plano-features li { font-size: 0.875rem; color: var(--muted); display: flex; align-items: flex-start; gap: 0.6rem; }
  .feat-check {
    width: 16px; height: 16px; flex-shrink: 0; border-radius: 50%;
    background: rgba(61,142,255,0.15); color: var(--accent);
    display: flex; align-items: center; justify-content: center; font-size: 0.6rem; margin-top: 1px;
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
  return (
    <span style={style}>
      {text.split('').map((ch, i) => (
        <span key={i} className="tw-char" style={{ opacity: 0.12, transition: 'opacity 0.03s' }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
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
        <p className="manifesto-p">
          <TypewriterText text={line1} />
        </p>
        <p className="manifesto-p">
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

      <section id="problema">
        <div className="fade-in">
          <p className="section-label">O problema</p>
          <h2 className="section-title">Já passou por isto?</h2>
        </div>
        <div className="problema-grid fade-in">
          <ul className="problema-list">
            {[
              'A sua empresa existe. O seu serviço é bom. Mas não aparece nas pesquisas do Google.',
              'O website tem visitas — mas não gera contactos nem pedidos.',
              'Os leads chegam de forma desorganizada e perdem-se.',
              'Perde oportunidades por falta de acompanhamento.',
              'A concorrência com serviços inferiores está a ganhar terreno — apenas por ter melhor presença digital.',
            ].map((item, i) => (
              <li key={i}><span className="prob-icon" />{item}</li>
            ))}
          </ul>
          <div className="problema-statement">
            <p className="prob-stat-label">Negócios sem presença digital estruturada</p>
            <div className="prob-stat-big">+<span>7 em 10</span></div>
            <p className="prob-stat-sub">pequenas empresas perdem clientes todos os dias para concorrentes com presença digital mais forte.</p>
            <div className="prob-divider" />
            <p className="prob-stat-label">A solução</p>
            <div className="prob-stat-big" style={{ fontSize:'2rem', color:'var(--offwhite)' }}>Estrutura digital<br />de crescimento.</div>
            <p className="prob-stat-sub" style={{ marginTop:'0.5rem' }}>Não apenas ferramentas. Sistemas que ajudam a ser encontrado, captar contactos e crescer de forma sustentável.</p>
          </div>
        </div>
      </section>

      <section id="planos">
        <div className="planos-header fade-in">
          <div>
            <p className="section-label">Pranchas</p>
            <h2 className="section-title">Escolha a sua prancha</h2>
          </div>
          <p className="section-sub">Tal como uma prancha é feita para deslizar sobre as ondas, cada solução é construída para o seu negócio navegar os desafios digitais.</p>
        </div>
        <div className="planos-grid fade-in">
          <div className="plano-card">
            <div className="plano-wave">🌊</div>
            <div className="plano-nome">One</div>
            <div className="plano-objetivo">Para negócios que querem ser encontrados no Google e Google Maps.</div>
            <div className="plano-preco"><span className="plano-currency">€</span><span className="plano-valor">99</span><span className="plano-period">/mês</span></div>
            <ul className="plano-features">
              {['Google Business Profile','SEO Local','Gestão e atualização da ficha','Publicações periódicas','Gestão de avaliações','Relatório simplificado'].map((f,i) => (
                <li key={i}><span className="feat-check">✓</span>{f}</li>
              ))}
            </ul>
            <a href="#contacto" className="btn-ghost" style={{ textAlign:'center' }}>Começar agora</a>
          </div>
          <div className="plano-card destaque">
            <span className="plano-badge">Popular</span>
            <div className="plano-wave">🌊🌊</div>
            <div className="plano-nome">Flow</div>
            <div className="plano-objetivo">Para negócios que precisam de presença profissional focada em conversão.</div>
            <div className="plano-preco"><span className="plano-currency">€</span><span className="plano-valor">199</span><span className="plano-period">/mês</span></div>
            <ul className="plano-features">
              {['Tudo do One +','Landing Page profissional','Formulário de contacto','Integração WhatsApp','Hospedagem e SSL incluídos','SEO On-Page','Alterações mensais'].map((f,i) => (
                <li key={i}><span className="feat-check">✓</span>{f}</li>
              ))}
            </ul>
            <a href="#contacto" className="btn-primary" style={{ textAlign:'center' }}>Começar agora</a>
          </div>
          <div className="plano-card">
            <div className="plano-wave">🌊🌊🌊</div>
            <div className="plano-nome">Growth</div>
            <div className="plano-objetivo">Para empresas que querem crescer de forma consistente e organizada.</div>
            <div className="plano-preco"><span className="plano-currency">€</span><span className="plano-valor">349</span><span className="plano-period">/mês</span></div>
            <ul className="plano-features">
              {['Tudo do Flow +','Website completo','Blog otimizado para SEO','CRM personalizado','Relatórios mensais','Acompanhamento estratégico','Automações incluídas'].map((f,i) => (
                <li key={i}><span className="feat-check">✓</span>{f}</li>
              ))}
            </ul>
            <a href="#contacto" className="btn-ghost" style={{ textAlign:'center' }}>Começar agora</a>
          </div>
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