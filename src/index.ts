#!/usr/bin/env node
import yargs from 'yargs';
import { defaultConfig, initConfig } from './config';
import commands from './commands';

function requireLocale(y: any) {
  y.positional('locale', {
    describe: 'Target language code (e.g. ja)',
    type: 'string',
  });
}

const argv: any = yargs
  .usage('Usage: $0 <command> [options]')
  .version('v')
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .options({
    c: {
      alias: 'config',
      type: 'string',
      describe: 'Config file',
      default: `i18n-config.yaml`,
    },
  })
  .command('init', 'Generate Config File')
  .command(
    'generate <locale>',
    'Translate content and generate files, use `all` for all',
    requireLocale,
  )
  .command('eject <locale>', 'Auto-translate content and eject YAML in main project', requireLocale)
  .command('export <locale>', 'Export CSV for a locale', requireLocale)
  .command('import <csv>', 'Import CSV translations', (y: any) => {
    y.positional('csv', {
      describe: 'Relative CSV file path',
      type: 'string',
    });
  })
  .demandCommand(1, 'Please enter a command').argv;

(async () => {
  const config = await initConfig(argv);
  if (!config) {
    return;
  }
  const [command] = argv._;
  if (argv.locale && argv.locale !== 'all' && !config.locales.includes(argv.locale)) {
    throw new Error(`The locale ${argv.locale} you specified is not set in config.`);
  }
  await commands[command](argv, config);
})();
