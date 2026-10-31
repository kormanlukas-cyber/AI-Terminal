# AI Terminal

A lightweight AI-first terminal and browser app built for local experimentation and deployment.

## Features

- interactive command-line shell
- browser-based chat UI
- OpenAI-compatible AI chat endpoint
- Docker support
- local and web deployment modes

## Quick start

```bash
npm install
cp .env.example .env
npm start
```

Open http://localhost:3000 in the browser.

## CLI mode

```bash
npm run cli
```

## Commands in the CLI

```bash
help
status
echo hello from AI Terminal
exit
```

## Environment variables

Create a `.env` file:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=3000
```

## Docker

```bash
docker build -t ai-terminal .
docker run -it --rm --env-file .env -p 3000:3000 ai-terminal
```

Or:

```bash
docker compose up --build
```

## Public deployment

This app can be hosted publicly on Render, Railway, Fly.io, or any Node.js-compatible cloud service.

### Render

- Connect the GitHub repo
- Set the build command to `npm install`
- Set the start command to `npm start`
- Add environment variables:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL=gpt-4o-mini`
  - `PORT=3000`

### Railway

- Deploy the repo from GitHub
- Set the same environment variables
- Start command: `npm start`

## Notes

This app includes both a terminal interface and a browser-based chat UI. The browser version uses the OpenAI chat completion API, and the CLI mode is kept for local shell interactions.
