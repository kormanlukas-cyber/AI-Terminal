import fs from 'node:fs';
import os from 'node:os';
import chalk from 'chalk';
import { askAI, getSystemInfo, listDirectory, resolvePath, readFileText } from './ai.js';

export const commands = {
  help: () => {
    return [
      'Available commands:',
      '  help            Show commands',
      '  status          Show terminal status',
      '  echo <text>     Print a message',
      '  pwd             Show current working directory',
      '  ls [path]       List directory contents',
      '  date            Show current date and time',
      '  history         Show command history',
      '  clear           Clear the terminal',
      '  ask <prompt>    Ask an AI question',
      '  cat <file>      Read a file',
      '  exit            Quit the terminal',
    ].join('\n');
  },

  status: () => {
    const info = getSystemInfo();
    return [
      'AI Terminal status',
      `Platform: ${info.platform}`,
      `Arch: ${info.arch}`,
      `Node: ${info.node}`,
      `Working directory: ${info.cwd}`,
    ].join('\n');
  },

  echo: (args) => args.join(' ') || 'No message provided.',

  pwd: () => process.cwd(),

  ls: (args) => {
    const target = args[0] ? resolvePath(args[0]) : process.cwd();
    const entries = listDirectory(target);
    return entries.length ? entries.join('\n') : '(empty directory)';
  },

  date: () => new Date().toString(),

  history: (_, context) => {
    if (!context.state.history.length) {
      return 'No commands in history.';
    }
    return context.state.history.map((entry, index) => `${index + 1}. ${entry}`).join('\n');
  },

  clear: () => {
    console.clear();
    return '';
  },

  ask: async (args) => {
    const prompt = args.join(' ');
    if (!prompt) {
      return 'Usage: ask <your question>';
    }
    return await askAI(prompt);
  },

  cat: (args) => {
    const filePath = args.join(' ');
    if (!filePath) {
      return 'Usage: cat <file path>';
    }

    const resolved = resolvePath(filePath);
    if (!fs.existsSync(resolved)) {
      return `File not found: ${filePath}`;
    }

    return readFileText(resolved);
  },

  exit: () => {
    process.exit(0);
  },
};

export function getCommandList() {
  return Object.keys(commands);
}
