import fs from 'node:fs';
import chalk from 'chalk';
import { askAI } from './ai.js';
import {
  getSystemInfo,
  listDirectory,
  readFileText,
  resolvePath,
  runShell,
  writeTextFile,
  fileExists,
} from './tools.js';

export class Agent {
  constructor(tools = {}) {
    this.tools = tools;
  }

  async run(prompt) {
    const normalized = prompt.trim();
    if (!normalized) {
      return 'No prompt provided.';
    }

    const explicitTool = /^tool\s+(\w+)(?:\s+(.*))?$/i.exec(normalized);
    if (explicitTool) {
      const [, name, argsRaw = ''] = explicitTool;
      const tool = this.tools[name];
      if (!tool) {
        return `Unknown tool: ${name}`;
      }
      const result = await tool(argsRaw.trim());
      return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    }

    const systemInstruction = [
      'You are a helpful terminal AI assistant.',
      'Use available tools when the task involves reading files, checking directories, or querying the system.',
      'If no tool is needed, answer directly and concisely.',
    ].join(' ');

    return await askAI(`${systemInstruction}\n\nUser request: ${normalized}`);
  }
}

export const commands = {
  help: () => {
    return [
      'Available commands:',
      '  help            Show this message',
      '  status          Show system status',
      '  echo <text>     Print a message',
      '  pwd             Show current directory',
      '  ls [path]       List a directory',
      '  date            Show current time',
      '  history         Show command history',
      '  clear           Clear the terminal',
      '  ask <prompt>    Ask the AI directly',
      '  agent <prompt>  Let the agent decide whether to use tools or AI',
      '  tool <name>     Run a built-in tool manually',
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

  agent: async (args, context) => {
    const prompt = args.join(' ');
    if (!prompt) {
      return 'Usage: agent <your task>';
    }
    return await context.agent.run(prompt);
  },

  tool: async (args, context) => {
    const [name, ...rest] = args;
    if (!name) {
      return 'Usage: tool <tool-name> [arguments]';
    }

    const tool = context.tools[name];
    if (!tool) {
      return `Unknown tool: ${name}`;
    }

    const result = await tool(rest.join(' '));
    return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  },

  cat: (args) => {
    const filePath = args.join(' ');
    if (!filePath) {
      return 'Usage: cat <file path>';
    }

    const resolved = resolvePath(filePath);
    if (!fileExists(resolved)) {
      return `File not found: ${filePath}`;
    }

    return readFileText(resolved);
  },

  exit: () => {
    process.exit(0);
  },
};

export function buildToolMap() {
  return {
    list_dir: (arg = '.') => listDirectory(resolvePath(arg)),
    read_file: (arg) => {
      if (!arg) {
        throw new Error('Usage: tool read_file <path>');
      }
      return readFileText(resolvePath(arg));
    },
    status: () => getSystemInfo(),
    shell: (command) => runShell(command),
    write_file: (args) => {
      const match = /^(.+?)\s+--\s+(.+)$/s.exec(args || '');
      if (!match) {
        throw new Error('Usage: tool write_file <path> -- <contents>');
      }
      const [, filePath, content] = match;
      return writeTextFile(resolvePath(filePath), content);
    },
  };
}
