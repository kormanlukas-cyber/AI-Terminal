# AI Terminal

A terminal-first AI agent that blends a local CLI shell with an OpenAI-compatible LLM and built-in tools.

## Features

- Interactive readline shell
- Command history tracking
- Colorized output
- Built-in local commands such as `help`, `status`, `ls`, `pwd`, `date`, `history`, and `cat`
- AI-powered `ask` command
- Agent mode for higher-level prompts
- Tool execution layer for filesystem and shell operations
- Extensible architecture for future plugins or tools

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
agent Summarize the project and suggest next improvements.
history
clear
exit
```

## Environment

Required for AI requests:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

If the API key is missing, the app will still run the local terminal commands and return a helpful message when AI features are used.

## Architecture

The app is organized into a shell, a command registry, a tool layer, and an AI adapter.

- `src/index.js` starts the terminal
- `src/terminal.js` manages prompt lifecycle and IO
- `src/commands.js` defines shell commands
- `src/ai.js` contains the OpenAI-compatible API client
- `src/tools.js` exposes local tools such as file and system inspection
- `src/agent.js` coordinates task execution and prompt routing

## Example agent usage

```bash
agent List the repo files and explain the key modules.
agent Read README.md and summarize the project quickly.
agent Use the available tools to inspect the current working directory.
```
