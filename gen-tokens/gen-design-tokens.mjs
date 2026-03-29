import { fileURLToPath } from 'node:url';
import path, { basename } from 'node:path';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pairsNames } from './normalized-prefix.mjs';
import { parseJson } from './utils.mjs';

function tokenLines(config, type, prefix) {
  return Object.entries(config).map(([key, value]) => {
    const normalizedKey = key.replace(/\./g, '-');
    const cssVar = `--${prefix}-${normalizedKey}`;
    if (type === 'css') {
      return `    ${cssVar}: ${value};`;
    }
    if (type === 'scss') {
      const scssVar = `$${prefix}-${normalizedKey}`;
      return `${scssVar}: var(${cssVar});`;
    }
    throw new Error(`Неизвестный type: ${type}`);
  });
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const projectDir = path.join(__dirname, '..');
  const tokensDir = path.join(projectDir, 'design-tokens');
  const generatedTokensDir = path.join(projectDir, 'generated');

  if (!existsSync(tokensDir)) {
    console.error(`Нет папки: ${tokensDir}`);
    process.exit(1);
  }

  rmSync(generatedTokensDir, { recursive: true, force: true });
  mkdirSync(generatedTokensDir, { recursive: true });

  const files = readdirSync(tokensDir).filter(name => name.endsWith('.json')).sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.error('Список файлов пуст!');
    process.exit(1);
  }

  const blockCss = [];
  const blockScss = [];

  for (const fileName of files) {
    const filepath = path.join(tokensDir, fileName);
    const raw = readFileSync(filepath, 'utf-8');
    const jsonConfig = parseJson(raw, filepath);

    const stem = basename(fileName, '.json');
    const prefix = pairsNames[stem] ?? stem;

    blockCss.push(`\n${tokenLines(jsonConfig, 'css', prefix).join('\n')}\n`);
    blockScss.push(`\n${tokenLines(jsonConfig, 'scss', prefix).join('\n')}\n`);
  }

  const cssOut = `:root {\n${blockCss.join('')}}\n`;
  const scssOut = `${blockScss.join('')}\n`;

  writeFileSync(path.join(generatedTokensDir, 'tokens.css'), cssOut);
  writeFileSync(path.join(generatedTokensDir, 'tokens.scss'), scssOut);
}

main();
