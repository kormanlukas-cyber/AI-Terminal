# AI Terminal

A terminal-first application for building AI-powered command-line experiences.

## Features

- Interactive readline shell
- Command registry with built-in commands
- Command history tracking
- Async AI question support via OpenAI-compatible API
- Colorized terminal output
- File-system commands such as `ls`, `pwd`, and `date`
- Lightweight architecture suitable for extension

## Quick start

```bash
npm install
cp .env.example .env
npm start
```

Then try commands like:

```bash
help
status
echo hello from AI Terminal
ls
pwd
date
ask Explain what this project does.
history
clear
exit
```

## Environment variables

Create a `.env` file based on `.env.example` and set your keys if you want to use the AI integration:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

## Architecture

The project is intentionally modular:

- `src/index.js` starts the terminal
- `src/terminal.js` owns prompt and input handling
- `src/commands.js` contains built-in commands
- `src/ai.js` wraps the AI provider call

## Project structure

```text
.
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
├── LICENSE
├── README.md
├── package.json
├── src/
│   ├── ai.js
│   ├── commands.js
│   ├── index.js
│   └── terminal.js
└── node_modules/
```

## Notes

This repo is designed as a clean starting point for an AI-powered terminal agent. You can expand it with commands for file creation, code execution, search, prompts, or tool integrations.
