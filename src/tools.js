import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

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
  return fs.readdirSync(targetDir, { withFileTypes: true })
    .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))
    .sort((a, b) => a.localeCompare(b));
}

export function readFileText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function resolvePath(inputPath) {
  return path.resolve(process.cwd(), inputPath);
}

export function runShell(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (error) {
    return error.stdout?.toString() || error.message;
  }
}

export function writeTextFile(filePath, contents) {
  fs.writeFileSync(filePath, contents, 'utf8');
  return `Wrote ${filePath}`;
}

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}
