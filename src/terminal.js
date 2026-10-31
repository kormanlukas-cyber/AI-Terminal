import readline from 'node:readline';
import chalk from 'chalk';
import { commands } from './commands.js';
import { Agent, buildToolMap } from './agent.js';

export function createTerminal() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  const state = {
    history: [],
  };

  const tools = buildToolMap();
  const agent = new Agent(tools);

  const printBanner = () => {
    console.log(chalk.bold.cyan('AI Terminal'));
    console.log(chalk.gray('Type "help" to see available commands.'));
  };

  const printPrompt = () => {
    process.stdout.write(chalk.magenta('ai-terminal> '));
  };

  const handleCommand = async (line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      printPrompt();
      return;
    }

    state.history.push(trimmed);

    const [commandName, ...args] = trimmed.split(/\s+/);
    const handler = commands[commandName];

    if (!handler) {
      const fallback = await agent.run(trimmed);
      console.log(chalk.green(fallback));
      printPrompt();
      return;
    }

    try {
      const result = await handler(args, { state, tools, agent, rl, printPrompt });
      if (typeof result === 'string' && result.length > 0) {
        console.log(chalk.green(result));
      }
    } catch (error) {
      console.log(chalk.red(`Error: ${error.message}`));
    }

    printPrompt();
  };

  return {
    rl,
    start() {
      printBanner();
      printPrompt();

      rl.on('line', async (line) => {
        await handleCommand(line);
      });

      rl.on('SIGINT', () => {
        console.log(chalk.yellow('\nSession interrupted. Type "exit" to quit.'));
        printPrompt();
      });

      rl.on('close', () => {
        console.log(chalk.gray('\nSession closed.'));
        process.exit(0);
      });
    },
    close() {
      rl.close();
    },
    state,
  };
}
