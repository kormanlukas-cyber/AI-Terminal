# AI Terminal

A terminal-first AI agent that combines a local command shell with OpenAI-compatible AI assistance and built-in tool execution.

## Features

- Interactive readline shell
- Command history tracking
- Colorized terminal output
- Built-in local commands:
  - help
  - status
  - echo
  - ls
  - pwd
  - date
  - history
  - clear
  - cat
  - ask
  - agent
  - tool
  - exit
- AI-powered `ask` and `agent` commands
- Tool execution for filesystem and system tasks
- Lightweight architecture ready for extension

## Quick start

```bash
npm install
cp .env.example .env
npm start
```

Try commands like:

```bash
help
status
echo hello from AI Terminal
ls
pwd
date
ask Explain what this project does.
agent Summarize the repo and suggest next improvements.
history
clear
exit
```

## Environment

Create a `.env` file based on `.env.example`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

If no API key is configured, the terminal still works for local commands.

## Deployment

### Local run

```bash
npm install
cp .env.example .env
npm start
```

### Docker

```bash
docker build -t ai-terminal .
docker run -it --rm --env-file .env ai-terminal
```

### Docker Compose

```bash
docker compose up --build
```

## Architecture

The project is split into four main parts:

- shell I/O and prompt handling
- command routing
- tool layer
- AI adapter

Key files:

- `src/index.js`
- `src/terminal.js`
- `src/commands.js`
- `src/agent.js`
- `src/tools.js`
- `src/ai.js`

## Example agent usage

```bash
agent List the repository files and explain the main modules.
agent Read README.md and summarize the current project.
agent Use the available tools to inspect the current working directory.
```

## Notes

This repo is a solid base for an AI terminal agent, and it is designed to be extended with more tools, more commands, and richer agent behavior.
