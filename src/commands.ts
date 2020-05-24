import { log } from './utils';
import { parse, generate as generateCsv } from './csv';
import eject from './eject';

import type { Config } from './types';
import generateYaml, { getYamlTranslations } from './yaml';

const commands: any = {
  generate: async ({ locale }: { locale: string }, config: Config) => {
    // generate
    const translations = await getYamlTranslations(locale, config);
    const outputDir = `${config.outputDir || config.contentDir}/${config.yamlDir}`;
    const filePath = `${outputDir}/${locale}.yaml`;
    await generateYaml(translations, filePath);
    log(`Wrote ${translations.length} translations to ${filePath}`);
  },
  eject: async ({ locale }: { locale: string }, config: Config) => {
    const translations = await getYamlTranslations(locale, config);
    const outputDir = config.outputDir || config.contentDir;
    await eject(translations, outputDir);
    log(`Wrote ${translations.length} translations to ${outputDir}`);
  },
  export: async ({ locale }: { locale: string }, config: Config) => {
    const translations = await getYamlTranslations(locale, config);
    const filePath = `${config.csvDir}/${locale}.csv`;
    await generateCsv(translations, filePath);
    log(`Wrote to ${filePath}`);
  },
  import: async ({ csv }: { csv: string }, config: Config) => {
    const imports = await parse(csv);
    const outputDir = config.outputDir || config.contentDir;
    await eject(imports, outputDir);
    log(`Wrote ${imports.length} imports to ${outputDir}`);
  },
};

export default commands;
