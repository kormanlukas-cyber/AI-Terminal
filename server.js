import express from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import 'dotenv/config';

const app = express();
const port = Number(process.env.PORT) || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAX_HISTORY = 12;
const sessions = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getSession(sessionId) {
  if (!sessionId) return null;

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { messages: [] });
  }

  return sessions.get(sessionId);
}

function appendMessage(sessionId, role, content) {
  const session = getSession(sessionId);
  if (!session) return;

  session.messages.push({ role, content: String(content).trim() });
  if (session.messages.length > MAX_HISTORY * 2) {
    session.messages = session.messages.slice(-MAX_HISTORY * 2);
  }
}

function isInsideProject(targetPath) {
  const resolved = path.resolve(targetPath);
  const root = path.resolve(__dirname);
  return resolved === root || resolved.startsWith(root + path.sep);
}

function listDirectory(target = '.') {
  const safeTarget = path.resolve(__dirname, target);
  if (!isInsideProject(safeTarget)) {
    throw new Error('Refusing to access a path outside the project root.');
  }

  const entries = fs.readdirSync(safeTarget, { withFileTypes: true });
  return entries
    .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))
    .sort((a, b) => a.localeCompare(b));
}

function readFile(targetPath) {
  const safeTarget = path.resolve(__dirname, targetPath);
  if (!isInsideProject(safeTarget)) {
    throw new Error('Refusing to read a path outside the project root.');
  }

  return fs.readFileSync(safeTarget, 'utf8');
}

function getSystemInfo() {
  return {
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    cwd: process.cwd(),
    home: os.homedir(),
    temp: os.tmpdir(),
  };
}

function runSafeShell(command) {
  const allowed = [
    /^pwd$/i,
    /^ls(?:\s+.*)?$/i,
    /^echo\s+.+$/i,
    /^node\s+-v$/i,
    /^npm\s+-v$/i,
    /^git\s+status(?:\s+.*)?$/i,
    /^git\s+branch(?:\s+.*)?$/i,
    /^cat\s+.+$/i,
    /^head\s+.+$/i,
    /^tail\s+.+$/i,
  ];

  const isAllowed = allowed.some((pattern) => pattern.test(command.trim()));
  if (!isAllowed) {
    throw new Error('Shell access is restricted to safe read-only commands.');
  }

  try {
    return execSync(command, {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 1024 * 1024,
    });
  } catch (error) {
    return error.stdout?.toString() || error.stderr?.toString() || error.message;
  }
}

function executeBuiltInTool(message) {
  const lower = message.toLowerCase();

  if (
    lower.includes('system info') ||
    lower.includes('what environment') ||
    lower.includes('tell me about this machine') ||
    lower.includes('environment info')
  ) {
    return `System info:\n${JSON.stringify(getSystemInfo(), null, 2)}`;
  }

  if (
    lower.includes('list files') ||
    lower.includes('list directory') ||
    lower.includes('directory contents') ||
    lower.includes('show files') ||
    lower.includes('what files are here') ||
    lower.includes('ls')
  ) {
    const files = listDirectory('.');
    return `Project files:\n${files.join('\n')}`;
  }

  if (
    lower.includes('pwd') ||
    lower.includes('working directory') ||
    lower.includes('where am i')
  ) {
    return `Working directory:\n${__dirname}`;
  }

  const readMatch = message.match(/(?:read|open|view|show)\s+(?:file\s+)?["']?([^\n"'\s]+)["']?/i);
  if (readMatch) {
    const target = readMatch[1];
    try {
      const content = readFile(target);
      return `File: ${target}\n\n${content.slice(0, 4000)}`;
    } catch (error) {
      return `Could not read "${target}": ${error.message}`;
    }
  }

  const shellMatch = message.match(/(?:run|execute|shell)\s+(.+)/i);
  if (shellMatch) {
    try {
      return `Shell output:\n${runSafeShell(shellMatch[1])}`;
    } catch (error) {
      return `Shell error: ${error.message}`;
    }
  }

  if (
    lower.includes('repo') ||
    lower.includes('project overview') ||
    lower.includes('what is in this app') ||
    lower.includes('project structure')
  ) {
    const files = listDirectory('.');
    return `Project overview:\n${files.join('\n')}`;
  }

  return null;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, status: 'AI Terminal web app is running' });
});

app.post('/api/chat', async (req, res) => {
  const { message, sessionId, mode = 'chat' } = req.body || {};

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'A message is required.' });
  }

  const activeSessionId = sessionId || crypto.randomUUID();
  const session = getSession(activeSessionId);
  const userMessage = String(message).trim();
  appendMessage(activeSessionId, 'user', userMessage);

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return res.status(400).json({
      error: 'OPENAI_API_KEY is not configured. Add it to your .env file before using the AI chat.',
    });
  }

  try {
    let reply = null;
    let toolResult = null;

    if (mode === 'agent') {
      toolResult = executeBuiltInTool(userMessage);
    }

    if (toolResult) {
      reply = toolResult;
    } else {
      const systemPrompt =
        'You are a helpful AI terminal assistant and coding partner. Keep answers concise, practical, and technically accurate. If the user asks for project structure, files, or repo info, prefer concrete answers with file names and exact behaviors.';

      const openaiMessages = [
        { role: 'system', content: systemPrompt },
        ...session.messages.slice(-MAX_HISTORY),
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          messages: openaiMessages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      reply = data?.choices?.[0]?.message?.content?.trim() || 'No response returned.';
    }

    appendMessage(activeSessionId, 'assistant', reply);

    res.json({
      reply,
      sessionId: activeSessionId,
      mode,
      toolUsed: Boolean(toolResult),
      toolResult,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'Unable to complete the AI request.',
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`AI Terminal web app running at http://localhost:${port}`);
});
