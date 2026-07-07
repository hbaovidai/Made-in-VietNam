#!/usr/bin/env node
/**
 * i18n Auto-Translate using MyMemory API (FREE, no API key)
 * Scans hardcoded Vietnamese → generates keys → translates → replaces in source
 * 
 * MyMemory: https://mymemory.translated.net/doc/spec.php
 * Free: 5000 chars/day (anonymous), 50000/day (with email)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');
const VI_PATH = path.join(SRC, 'locales', 'vi.json');
const EN_PATH = path.join(SRC, 'locales', 'en.json');

// ── Helper: Vietnamese text → snake_case key ──
function toKey(viText) {
  const map = {
    'à':'a','á':'a','ả':'a','ã':'a','ạ':'a',
    'ă':'a','ắ':'a','ằ':'a','ẳ':'a','ẵ':'a','ặ':'a',
    'â':'a','ấ':'a','ầ':'a','ẩ':'a','ẫ':'a','ậ':'a',
    'è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e',
    'ê':'e','ế':'e','ề':'e','ể':'e','ễ':'e','ệ':'e',
    'ì':'i','í':'i','ỉ':'i','ĩ':'i','ị':'i',
    'ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o',
    'ô':'o','ố':'o','ồ':'o','ổ':'o','ỗ':'o','ộ':'o',
    'ơ':'o','ớ':'o','ờ':'o','ở':'o','ỡ':'o','ợ':'o',
    'ù':'u','ú':'u','ủ':'u','ũ':'u','ụ':'u',
    'ư':'u','ứ':'u','ừ':'u','ử':'u','ữ':'u','ự':'u',
    'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y',
    'đ':'d','Đ':'d'
  };
  return viText
    .toLowerCase()
    .split('')
    .map(c => map[c] || c)
    .join('')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 40);
}

// ── MyMemory Translation (FREE) ──
async function translateViToEn(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|en&de=vieproduct.b2b@gmail.com`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      let translated = data.responseData.translatedText;
      // MyMemory sometimes returns ALL CAPS, fix it
      if (translated === translated.toUpperCase() && translated.length > 3) {
        translated = translated.charAt(0) + translated.slice(1).toLowerCase();
      }
      return translated;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Scan files ──
function scanFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules','locales','i18n'].includes(entry.name)) {
      results.push(...scanFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.tsx') && !entry.name.includes('.d.ts')) {
      const lines = fs.readFileSync(full, 'utf-8').split('\n');
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('import ') || trimmed.startsWith('//') || trimmed.startsWith('*')) return;
        const re = />([^<>{]*?[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ][^<>{}]*?)</g;
        let m;
        while ((m = re.exec(line)) !== null) {
          const text = m[1].trim();
          if (text.length > 1) results.push({ file: path.relative(SRC, full), line: idx+1, text });
        }
      });
    }
  }
  return results;
}

// ── Main ──
async function main() {
  const viData = JSON.parse(fs.readFileSync(VI_PATH, 'utf-8'));
  const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
  const existingKeys = new Set(Object.keys(viData));
  const existingVals = new Set(Object.values(viData));

  // Scan all pages + components
  const matches = [
    ...scanFiles(path.join(SRC, 'pages')),
    ...scanFiles(path.join(SRC, 'components')),
    ...scanFiles(path.join(SRC, 'layouts')),
  ];

  // Deduplicate
  const unique = new Map();
  matches.forEach(m => {
    if (!existingVals.has(m.text) && !unique.has(m.text)) {
      unique.set(m.text, []);
    }
    if (unique.has(m.text)) {
      unique.get(m.text).push({ file: m.file, line: m.line });
    }
  });

  console.log(`📊 Found ${unique.size} new hardcoded Vietnamese strings\n`);
  if (unique.size === 0) { console.log('✅ All clean!'); return; }

  // Translate each string
  let added = 0;
  let translated = 0;
  const textToKey = new Map();
  const texts = [...unique.keys()];

  for (let i = 0; i < texts.length; i++) {
    const viText = texts[i];
    let key = toKey(viText);
    
    // Ensure unique key
    let suffix = 0;
    let finalKey = key;
    while (existingKeys.has(finalKey)) {
      suffix++;
      finalKey = `${key}_${suffix}`;
    }
    key = finalKey;

    process.stdout.write(`  [${i+1}/${texts.length}] "${viText.substring(0, 50)}..." → `);

    // Translate
    const en = await translateViToEn(viText);
    if (en) {
      viData[key] = viText;
      enData[key] = en;
      existingKeys.add(key);
      textToKey.set(viText, key);
      added++;
      translated++;
      console.log(`✓ "${en.substring(0, 50)}"`);
    } else {
      // Fallback: use Vietnamese as both
      viData[key] = viText;
      enData[key] = viText; // will need manual translation
      existingKeys.add(key);
      textToKey.set(viText, key);
      added++;
      console.log(`⚠ (kept Vietnamese, needs manual EN)`);
    }

    // Rate limit: 100ms between calls
    await new Promise(r => setTimeout(r, 100));
  }

  // Save locale files
  fs.writeFileSync(VI_PATH, JSON.stringify(viData, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(EN_PATH, JSON.stringify(enData, null, 2) + '\n', 'utf-8');
  console.log(`\n✅ Added ${added} keys (${translated} auto-translated)`);
  console.log(`📁 vi.json: ${Object.keys(viData).length} keys`);
  console.log(`📁 en.json: ${Object.keys(enData).length} keys`);

  // Auto-replace in source files
  console.log('\n🔄 Replacing in source files...\n');
  const changedFiles = new Set();

  // Collect all files that need changes
  const fileContents = new Map();
  for (const [, locations] of unique) {
    for (const loc of locations) {
      const fp = path.join(SRC, loc.file);
      if (!fileContents.has(fp)) {
        fileContents.set(fp, fs.readFileSync(fp, 'utf-8'));
      }
    }
  }

  for (const [fp, origContent] of fileContents) {
    let content = origContent;
    let changed = false;

    for (const [viText, key] of textToKey) {
      const escaped = viText.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&');
      const re = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g');
      const result = content.replace(re, `>$1{t('${key}')}$2<`);
      if (result !== content) { content = result; changed = true; }
    }

    if (changed) {
      // Ensure useTranslation import
      if (!content.includes('useTranslation') && content.includes("{t('")) {
        content = content.replace(
          /(import .+ from 'react';?\n)/m,
          `$1import { useTranslation } from 'react-i18next';\n`
        );
      }
      if (content.includes("{t('") && !content.includes('useTranslation()')) {
        content = content.replace(
          /(export (?:default )?function \w+[^{]*\{)\n/,
          `$1\n  const { t } = useTranslation();\n`
        );
      }
      fs.writeFileSync(fp, content, 'utf-8');
      changedFiles.add(path.relative(SRC, fp));
      console.log(`  ✏️  ${path.relative(SRC, fp)}`);
    }
  }

  console.log(`\n🎉 Done! Updated ${changedFiles.size} files.`);
}

main().catch(console.error);
