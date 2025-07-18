#!/usr/bin/env node

import prompts from "prompts";
import shell from "shelljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple console functions
const log = {
  info: (msg) => console.log(`ℹ ${msg}`),
  success: (msg) => console.log(`✓ ${msg}`),
  error: (msg) => console.log(`✗ ${msg}`),
  progress: (msg) => console.log(`⏳ ${msg}`),
};

// Check if command exists
function commandExists(command) {
  return shell.which(command) !== null;
}

// Execute command with error handling
function executeCommand(command, options = {}) {
  const { cwd = null } = options;

  const execOptions = { silent: true };
  if (cwd) execOptions.cwd = cwd;

  const result = shell.exec(command, execOptions);

  if (result.code !== 0) {
    log.error(`Command failed: ${command}`);
    if (result.stderr) log.error(`Error: ${result.stderr}`);
    return false;
  }
  return true;
}

// Check prerequisites
function checkPrerequisites() {
  log.info("Checking prerequisites...");

  if (!commandExists("node")) {
    log.error("Node.js is not installed. Please install Node.js first.");
    process.exit(1);
  }

  if (!commandExists("npm")) {
    log.error("npm is not installed. Please install npm first.");
    process.exit(1);
  }

  log.success("Prerequisites check passed");
}

// Get project configuration
async function getProjectConfig() {
  console.log("\n" + "=".repeat(50));
  console.log("    🚀 React + Vite + Tailwind Setup");
  console.log("=".repeat(50) + "\n");

  const questions = [
    {
      type: "text",
      name: "projectName",
      message: "Enter your project name:",
      initial: "my-react-app",
      validate: (value) => {
        if (!value || value.trim() === "") {
          return "Project name cannot be empty!";
        }

        const trimmed = value.trim();
        if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(trimmed)) {
          return "Invalid project name format!";
        }

        if (fs.existsSync(trimmed)) {
          return `Directory '${trimmed}' already exists!`;
        }

        return true;
      },
    },
    {
      type: "select",
      name: "language",
      message: "Select language:",
      choices: [
        { title: "JavaScript", value: "javascript" },
        { title: "TypeScript", value: "typescript" },
      ],
      initial: 0,
    },
  ];

  const response = await prompts(questions, {
    onCancel: () => {
      log.error("Setup cancelled");
      process.exit(1);
    },
  });

  return {
    projectName: response.projectName.trim(),
    language: response.language,
    template: response.language === "typescript" ? "react-ts" : "react",
  };
}

// Create Vite project
function createViteProject(config) {
  log.progress(`Creating Vite project...`);

  const command = `npm create vite@latest ${config.projectName} -- --template ${config.template}`;

  if (!executeCommand(command)) {
    log.error("Failed to create Vite project");
    process.exit(1);
  }

  log.success("Vite project created successfully");
  return path.resolve(config.projectName);
}

// Install dependencies
function installDependencies(projectPath) {
  log.progress("Installing dependencies...");

  // Install base dependencies
  if (!executeCommand("npm install", { cwd: projectPath })) {
    log.error("Failed to install base dependencies");
    process.exit(1);
  }

  // Install Tailwind CSS with traditional setup
  const tailwindCommand = "npm install -D tailwindcss postcss autoprefixer";
  if (!executeCommand(tailwindCommand, { cwd: projectPath })) {
    log.error("Failed to install Tailwind CSS");
    process.exit(1);
  }

  log.success("Dependencies installed successfully");
}

// Setup Tailwind CSS
function setupTailwind(projectPath, language) {
  log.progress("Setting up Tailwind CSS...");

  // Initialize Tailwind config with PostCSS
  if (!executeCommand("npx tailwindcss init -p", { cwd: projectPath })) {
    log.error("Failed to initialize Tailwind config");
    process.exit(1);
  }

  // Update tailwind.config.js with proper content paths
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  fs.writeFileSync(
    path.join(projectPath, "tailwind.config.js"),
    tailwindConfig
  );

  // Update src/index.css
  const indexCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

  fs.writeFileSync(path.join(projectPath, "src", "index.css"), indexCSS);

  log.success("Tailwind CSS setup completed");
}

// Update App component with simple example
function updateAppComponent(projectPath, language) {
  log.progress("Updating App component...");

  const extension = language === "typescript" ? "tsx" : "jsx";

  const appComponent = `import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center items-center space-x-4 mb-8">
          <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          <span className="text-2xl font-bold text-gray-600">+</span>
          <img src={reactLogo} className="h-16 w-16 animate-spin" alt="React logo" />
          <span className="text-2xl font-bold text-gray-600">+</span>
          <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            TW
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Vite + React + Tailwind
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Count is {count}
          </button>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">Testing standard Tailwind classes:</p>
            <div className="flex justify-center space-x-2">
              <span className="bg-red-500 text-white px-3 py-1 rounded text-sm">bg-red-500</span>
              <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">bg-green-500</span>
              <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm">bg-blue-500</span>
            </div>
            <div className="flex justify-center space-x-2">
              <span className="text-xl font-bold text-purple-600">text-xl</span>
              <span className="text-2xl font-bold text-pink-600">text-2xl</span>
              <span className="text-3xl font-bold text-indigo-600">text-3xl</span>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <div className="w-6 h-6 bg-orange-400 rounded"></div>
              <div className="w-8 h-8 bg-red-400 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <p className="text-gray-600 mb-2">
            Edit <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">src/App.${extension}</code> and save to test HMR
          </p>
          <p className="text-gray-600">
            Check out the{' '}
            <a 
              href="https://tailwindcss.com/docs" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline transition-colors"
            >
              Tailwind CSS docs
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App`;

  const appPath = path.join(projectPath, "src", `App.${extension}`);
  fs.writeFileSync(appPath, appComponent);

  log.success("App component updated");
}

// Update App.css to remove conflicts
function updateAppCSS(projectPath) {
  log.progress("Updating App.css...");

  const appCSS = `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}`;

  fs.writeFileSync(path.join(projectPath, "src", "App.css"), appCSS);
  log.success("App.css updated");
}

// Create simple README
function createReadme(projectPath, config) {
  log.progress("Creating README...");

  const readme = `# ${config.projectName}

A React application built with Vite and Tailwind CSS.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## Tech Stack

- React 18
- Vite
- Tailwind CSS v3.4+
- ${config.language === "typescript" ? "TypeScript" : "JavaScript"}

## Features

- ⚡ Lightning fast with Vite
- 🎨 Tailwind CSS for styling
- 🔥 Hot Module Replacement
- 📱 Responsive design
- ${config.language === "typescript" ? "🔧 TypeScript support" : "🚀 Modern JavaScript"}
- ✅ All Tailwind utility classes working (standard + arbitrary values)

## Project Structure

\`\`\`
${config.projectName}/
├── public/
├── src/
│   ├── assets/
│   ├── App.${config.language === "typescript" ? "tsx" : "jsx"}
│   ├── App.css
│   ├── index.css
│   └── main.${config.language === "typescript" ? "ts" : "js"}
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.${config.language === "typescript" ? "ts" : "js"}
\`\`\`

## Tailwind CSS Classes

This setup supports both standard Tailwind classes and arbitrary values:

- ✅ Standard classes: \`m-10\`, \`text-2xl\`, \`bg-red-500\`
- ✅ Arbitrary values: \`m-[100px]\`, \`text-[10px]\`, \`bg-[#ff0000]\`
`;

  fs.writeFileSync(path.join(projectPath, "README.md"), readme);
  log.success("README created");
}

// Main function
async function main() {
  try {
    checkPrerequisites();
    const config = await getProjectConfig();

    console.log("\n");
    log.info("Starting project setup...");

    // Create project
    const projectPath = createViteProject(config);

    // Setup everything
    installDependencies(projectPath);
    setupTailwind(projectPath, config.language);
    updateAppComponent(projectPath, config.language);
    updateAppCSS(projectPath);
    createReadme(projectPath, config);

    // Success message
    console.log("\n" + "=".repeat(50));
    console.log("    🎉 Setup Complete!");
    console.log("=".repeat(50));
    console.log(`\nNext steps:`);
    console.log(`  1. cd ${config.projectName}`);
    console.log(`  2. npm run dev`);
    console.log(`  3. Open http://localhost:5173\n`);

    log.success("Your React + Vite + Tailwind project is ready!");
    log.info("Both standard classes (m-10, text-2xl) and arbitrary values (m-[100px], text-[10px]) will work perfectly!");
  } catch (error) {
    log.error("Setup failed:");
    console.error(error.message);
    process.exit(1);
  }
}

// Handle interruption
process.on("SIGINT", () => {
  log.error("Setup interrupted");
  process.exit(1);
});

// Run the script
main().catch((error) => {
  log.error("Unexpected error:");
  console.error(error);
  process.exit(1);
});