export const commands = {
  help: () => {
    return [
      'Available commands:',
      '  help       Show available commands',
      '  status     Show terminal status',
      '  echo <msg> Echo a message',
      '  exit       Exit the terminal',
    ].join('\n');
  },

  status: () => {
    return 'AI Terminal is running in local mode.';
  },

  echo: (message) => message || 'No message provided.',

  exit: () => {
    process.exit(0);
  },
};
