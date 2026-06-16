# 🌊 Onda — Agência de Crescimento Digital

Landing page da agência **Onda**, construída em **React + Vite + Three.js**.

Projeto desenvolvido como base para o site institucional da agência, com foco em experiência visual, animações 3D controladas por scroll e design editorial moderno.

---

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React 18 | Componentes e gestão de estado |
| Vite | Bundler e servidor de desenvolvimento |
| Three.js | Objetos 3D wireframe e animações no hero |
| CSS (in-JS) | Estilos globais injetados via `dangerouslySetInnerHTML` |

---

## Estrutura do projeto
onda-landing/

├── public/

│   └── favicon.png

├── src/

│   ├── main.jsx            # Ponto de entrada React

│   ├── App.jsx             # Componente raiz

│   └── OndaLanding.jsx     # Landing page completa

├── index.html

├── vite.config.js

├── package.json

└── README.md
---

## Instalação e desenvolvimento

```bash
# 1. Clonar o repositório
git clone https://github.com/eedroo/onda-landing.git
cd onda-landing

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

Abre `http://localhost:5173` no browser.

---

## Build para produção

```bash
npm run build
```

Gera a pasta `/dist` com todos os ficheiros otimizados prontos para deploy.

---

## Deploy (cPanel / GoDaddy)

1. Correr `npm run build` localmente
2. Fazer upload do **conteúdo** da pasta `/dist` para `public_html` via File Manager ou FTP
3. Criar ficheiro `.htaccess` em `public_html` com o seguinte conteúdo:
Options -MultiViews

RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f

RewriteRule ^ index.html [QL]
---

## Funcionalidades

### Hero — Three.js
- 5 objetos geométricos wireframe (Torus, Sphere, Icosahedron, TorusKnot, Octahedron)
- Movimento horizontal e vertical controlado pelo scroll
- Rotação sincronizada com a posição do scroll — avança ao descer, recua ao subir
- Escala cresce com o scroll
- Blur progressivo simulando profundidade de campo
- Fade out ao sair do viewport

### Manifesto
- Layout em grelha com dodecaedros wireframe animados (Three.js)
- Efeito typewriter por scroll — letras reveladas conforme o utilizador desce
- Animação de entrada com slide

### Problema
- Scroll storytelling — conteúdo fixo (sticky) com elementos que aparecem progressivamente
- Animação de contagem no número "+7 em 10"
- Cada item entra com slide da direita

### Planos (Bento Grid)
- Glow cursor — efeito de luz que segue o cursor globalmente entre os cards
- Layout assimétrico com card destacado (Flow)

### Outras secções
- Método Onda (4 passos)
- Diferencial competitivo
- Creative.Onda
- FAQ com accordion
- Formulário de qualificação
- Footer

---

## Roadmap

- [ ] Ligar formulário a serviço de email (Resend / Formspree)
- [ ] Adicionar React Router para páginas internas (Sobre Nós, Blog, Creative)
- [ ] CMS para o Blog (Sanity ou MDX)
- [ ] Versão mobile otimizada
- [ ] Página de obrigado após submissão do formulário

---

## Autor

Desenvolvido por **Eduardo Pereira** para a agência [Onda](https://onda.work).