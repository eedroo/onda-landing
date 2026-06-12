# 🌊 Onda — Landing Page

Landing page da agência Onda construída em React + Three.js.

## Setup

```bash
# Instalar dependências
npm install

# Desenvolvimento local (com hot reload)
npm run dev

# Build para produção
npm run build
```

## Estrutura

```
/
├── index.html          # Entry HTML
├── main.jsx            # React root
├── App.jsx             # App wrapper
├── OndaLanding.jsx     # Componente principal (tudo numa página)
├── vite.config.js      # Config Vite
└── package.json
```

## Three.js — Animação do Hero

O canvas 3D está no componente `HeroCanvas` dentro de `OndaLanding.jsx`.

### Como funciona:
- 5 objetos geométricos (Torus, Sphere, Icosahedron, TorusKnot, Octahedron) em wireframe
- Flutuam com `Math.sin(time)` — movimento orgânico
- Respondem ao `window.scrollY` — uns sobem, outros descem (parallax)
- Opacidade diminui conforme saem do viewport
- Cores: branco 6% opacity + azul acento 12% opacity

### Personalizar objetos:
Em `HeroCanvas`, o array `objects` tem 5 entradas com:
- `x` — posição horizontal
- `baseY` — posição vertical base
- `speed` — velocidade da animação flutuante
- `phase` — offset de fase (para que não se movam em sincronia)

### Adicionar mais geometrias Three.js:
```js
import { SphereGeometry, BoxGeometry, ConeGeometry, ... } from 'three'
// qualquer geometria Three.js funciona
```

## Próximos passos sugeridos

1. **Múltiplas páginas** — adicionar React Router para Sobre Nós, Blog, etc.
2. **CMS para o Blog** — integrar Sanity, Contentful, ou ficheiros MDX
3. **Formulário** — ligar ao backend (Supabase, Resend, FormSubmit, etc.)
4. **Animações de entrada** — framer-motion para os cards dos planos
5. **Cursor personalizado** — cursor circular que reage ao scroll
6. **Parallax avançado** — usar `@react-three/fiber` + `@react-three/drei` para mais controlo

## Deploy

Compatible com Vercel, Netlify, Cloudflare Pages:
```bash
npm run build
# fazer upload da pasta /dist
```
