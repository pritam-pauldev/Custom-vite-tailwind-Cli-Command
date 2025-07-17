<h1 align="center">🚀 Custom Next.js CLI: <code>npx create-vite-pp &lt;myApp&gt;</code></h1>

<p align="center">A minimal yet powerful ⚡ CLI tool to kickstart a clean <b>Vite + React</b> project with <b>Tailwind CSS</b> — in seconds.</p>

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20By-Vite%20%2B%20React-blue?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38b2ac?style=flat-square&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/TypeScript%2FJavaScript-optional-blueviolet?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/PostCSS-configured-cc6699?style=flat-square&logo=postcss" />
  <img src="https://img.shields.io/badge/Autoprefixer-enabled-ff6d00?style=flat-square&logo=css3" />
  <img src="https://img.shields.io/badge/Inquirer-js-interactive-29abe2?style=flat-square&logo=javascript" />
  <img src="https://img.shields.io/badge/Node.js-required-339933?style=flat-square&logo=nodedotjs" />
</p>


---

## 🔥 Why use this CLI?

- ⚡ **Instant setup** – No Tailwind config headaches
- 🔥 **Zero boilerplate** – Clean, minimal, and production-ready
- ✨ **Professional folder structure** – Easy to scale
- 🔄 **Supports JS & TS** – Choose what you love
- 🧼 **Lightweight by default** – Focus on building, not setting up

---

## 📦 Installation & Usage

To scaffold a new project using this CLI, run:
npx create-vite-pp my-app



The CLI will:

Prompt you to choose JavaScript or TypeScript

Set up a fresh Vite + React project

Automatically configure:

✅ Tailwind CSS

✅ PostCSS + autoprefixer

✅ Pre-defined folder structure

Apply clean minimal boilerplate — so you can start building right away

💡 Why use this CLI?
⚡ Instant setup – no Tailwind config headaches
🔥 No unnecessary boilerplate – perfect for production or practice
✨ Professional folder structure
🔄 Supports both JS and TS
🧼 Opinionated and lightweight by default

🛠️ Features
Feature	Support
Vite + React	✅
Tailwind CSS	✅
TypeScript	✅
JavaScript	✅
Clean Codebase	✅
Super Fast Setup	✅


🤖 How it works internally
This CLI tool:
Uses npm create vite@latest to scaffold a Vite + React app
Installs Tailwind + PostCSS

Automatically configures:
tailwind.config.js
postcss.config.js

Adds @tailwind base;, components;, utilities; to index.css

Replaces default vite.config.js with a pre-configured version

Uses inquirer to let you choose between JavaScript & TypeScript

📦 Example Output Structure
my-app/
├── public/
├── src/
│   ├── App.jsx or .tsx
│   ├── index.css
│   └── main.jsx or .tsx
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── vite.config.js

📬 Feedback or Suggestions?
Feel free to open issues or feature requests!
