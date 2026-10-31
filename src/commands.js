import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const DEFAULT_MODEL = 'gpt-4o-mini';

export async function askAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return 'OPENAI_API_KEY is not configured. Add it to your .env file.';
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const message = data?.choices?.[0]?.message?.content;

  return message?.trim() || 'No response returned by the AI provider.';
}

export function getSystemInfo() {
  return {
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    cwd: process.cwd(),
    home: os.homedir(),
    temp: os.tmpdir(),
  };
}

export function listDirectory(targetDir = process.cwd()) {
  try {
    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    return entries
      .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    throw new Error(`Unable to read directory: ${targetDir}`);
  }
}

export function readFileText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function resolvePath(inputPath) {
  return path.resolve(process.cwd(), inputPath);
}
