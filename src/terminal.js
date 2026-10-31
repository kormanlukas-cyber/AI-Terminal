import readline from 'node:readline';
import { commands } from './commands.js';

export function createTerminal() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  return {
    rl,
    async start() {
      console.log('AI Terminal ready. Type "help" to see commands.');

      const handleInput = (input) => {
        const trimmed = input.trim();

        if (!trimmed) {
          return;
        }

        const [command, ...args] = trimmed.split(/\s+/);
        const handler = commands[command];

        if (!handler) {
          console.log(`Command not found: ${command}`);
          return;
        }

        const result = handler(args.join(' '));
        if (result !== undefined) {
          console.log(result);
        }
      };

      rl.on('line', handleInput);

      rl.on('close', () => {
        console.log('Session closed.');
        process.exit(0);
      });
    },
    close() {
      rl.close();
    },
  };
}
