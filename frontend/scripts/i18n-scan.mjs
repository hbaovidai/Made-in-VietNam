#!/usr/bin/env node
/**
 * i18n Scan-only script — Extracts hardcoded Vietnamese text 
 * and outputs as a clean list for manual/AI translation
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, '..', 'src');
const VI_JSON = path.join(SRC_DIR, 'locales', 'vi.json');

const existingVi = JSON.parse(fs.readFileSync(VI_JSON, 'utf-8'));
const existingViValues = new Set(Object.values(existingVi));

function scanFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'locales', 'i18n'].includes(entry.name)) {
      results.push(...scanFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.includes('.d.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('import ') || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.includes('console.')) return;
        
        const jsxPattern = />([^<>{]*?[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ][^<>{}]*?)</g;
        let m;
        while ((m = jsxPattern.exec(line)) !== null) {
          const text = m[1].trim();
          if (text.length > 1 && !existingViValues.has(text)) {
            results.push({
              file: path.relative(SRC_DIR, fullPath),
              line: idx + 1,
              text
            });
          }
        }
      });
    }
  }
  return results;
}

const matches = [
  ...scanFiles(path.join(SRC_DIR, 'pages')),
  ...scanFiles(path.join(SRC_DIR, 'components')),
  ...scanFiles(path.join(SRC_DIR, 'layouts')),
];

// Deduplicate
const uniqueTexts = new Map();
matches.forEach(m => {
  if (!uniqueTexts.has(m.text)) uniqueTexts.set(m.text, []);
  uniqueTexts.get(m.text).push({ file: m.file, line: m.line });
});

// Group by file for clean output
const byFile = new Map();
matches.forEach(m => {
  if (!byFile.has(m.file)) byFile.set(m.file, []);
  byFile.get(m.file).push(m);
});

console.log(`Found ${uniqueTexts.size} unique strings in ${byFile.size} files\n`);

// Output JSON-ready list
const outputList = [];
for (const [text] of uniqueTexts) {
  outputList.push(text);
}

fs.writeFileSync(
  path.join(__dirname, 'hardcoded-texts.json'),
  JSON.stringify(outputList, null, 2),
  'utf-8'
);

// Output by-file report  
let report = '';
for (const [file, items] of byFile) {
  report += `\n=== ${file} ===\n`;
  items.forEach(i => {
    report += `  L${i.line}: "${i.text}"\n`;
  });
}
fs.writeFileSync(path.join(__dirname, 'hardcoded-report.txt'), report, 'utf-8');
console.log(`Written: scripts/hardcoded-texts.json (${outputList.length} texts)`);
console.log(`Written: scripts/hardcoded-report.txt`);
