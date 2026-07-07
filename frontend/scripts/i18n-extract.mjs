#!/usr/bin/env node
/**
 * i18n Extraction & Translation Script
 * 
 * 1. Scans all .tsx files for hardcoded Vietnamese text
 * 2. Groups them by file
 * 3. Uses Gemini API to generate translation keys + English translations
 * 4. Outputs new keys to merge into vi.json and en.json
 * 5. Shows which files/lines need to be updated
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCjfn3Kpdf7Au6L6WGYyXcxUN8I-GU70hU';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SRC_DIR = path.join(__dirname, '..', 'src');
const VI_JSON = path.join(SRC_DIR, 'locales', 'vi.json');
const EN_JSON = path.join(SRC_DIR, 'locales', 'en.json');

// Vietnamese character pattern
const VI_CHARS = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ]/;

// Load existing translation keys
const existingVi = JSON.parse(fs.readFileSync(VI_JSON, 'utf-8'));
const existingEn = JSON.parse(fs.readFileSync(EN_JSON, 'utf-8'));
const existingViValues = new Set(Object.values(existingVi));

/**
 * Scan .tsx files for hardcoded Vietnamese strings
 */
function scanFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'locales', 'i18n'].includes(entry.name)) {
      results.push(...scanFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.includes('.d.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, idx) => {
        // Skip imports, comments, console logs
        const trimmed = line.trim();
        if (trimmed.startsWith('import ') || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.includes('console.')) return;
        
        // Find Vietnamese text in JSX: >text< or 'text' or "text"
        const matches = [];
        
        // Pattern 1: JSX text content >Vietnamese text<
        const jsxPattern = />([^<>{]*?[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ][^<>{}]*?)</g;
        let m;
        while ((m = jsxPattern.exec(line)) !== null) {
          const text = m[1].trim();
          if (text.length > 1 && !existingViValues.has(text)) {
            matches.push(text);
          }
        }
        
        // Pattern 2: String literals with Vietnamese 'text' or "text" (in attributes like placeholder, title, etc.)
        const strPattern = /(?:placeholder|title|label|alt|aria-label|content)=["']([^"']*?[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđĐ][^"']*?)["']/g;
        while ((m = strPattern.exec(line)) !== null) {
          const text = m[1].trim();
          if (text.length > 1 && !existingViValues.has(text)) {
            matches.push(text);
          }
        }
        
        if (matches.length > 0) {
          const relPath = path.relative(SRC_DIR, fullPath);
          matches.forEach(text => {
            results.push({
              file: relPath,
              line: idx + 1,
              text: text
            });
          });
        }
      });
    }
  }
  return results;
}

/**
 * Call Gemini API to generate translation keys and English translations
 */
async function translateWithGemini(viTexts) {
  const prompt = `You are a professional translator for a B2B e-commerce platform called VIEProduct (Vietnamese B2B marketplace).

I have a list of hardcoded Vietnamese text strings that need to be internationalized. For each Vietnamese text:
1. Generate a descriptive, snake_case translation key (short but descriptive, like "cart_login_required", "checkout_submit_btn")
2. Provide the professional English translation

IMPORTANT RULES:
- Keys must be unique and descriptive
- Keys should use snake_case format
- English translations must be natural and professional (B2B context)
- Keep translations concise but accurate
- For buttons/labels, keep translations short
- Preserve any HTML tags or special characters

Input Vietnamese texts (one per line):
${viTexts.map((t, i) => `${i + 1}. "${t}"`).join('\n')}

Output MUST be a valid JSON array of objects with exactly these fields:
[
  { "vi": "original vietnamese text", "key": "translation_key", "en": "English translation" },
  ...
]

Return ONLY the JSON array, no markdown, no explanation.`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`  API HTTP ${response.status}: ${errText.substring(0, 200)}`);
      return [];
    }

    const data = await response.json();
    
    if (data.error) {
      console.error(`  API Error: ${data.error.message}`);
      return [];
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      console.error('  API returned empty response');
      return [];
    }
    
    try {
      return JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      console.error('  Could not parse:', text.substring(0, 200));
      return [];
    }
  } catch (err) {
    console.error('  Gemini error:', err.message);
    return [];
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning source files for hardcoded Vietnamese text...\n');
  
  const allMatches = scanFiles(path.join(SRC_DIR, 'pages'));
  const componentMatches = scanFiles(path.join(SRC_DIR, 'components'));
  const layoutMatches = scanFiles(path.join(SRC_DIR, 'layouts'));
  
  const matches = [...allMatches, ...componentMatches, ...layoutMatches];
  
  // Deduplicate by text
  const uniqueTexts = new Map();
  matches.forEach(m => {
    if (!uniqueTexts.has(m.text)) {
      uniqueTexts.set(m.text, []);
    }
    uniqueTexts.get(m.text).push({ file: m.file, line: m.line });
  });
  
  console.log(`📊 Found ${uniqueTexts.size} unique hardcoded Vietnamese strings across ${matches.length} occurrences\n`);
  
  if (uniqueTexts.size === 0) {
    console.log('✅ No hardcoded Vietnamese text found. All good!');
    return;
  }
  
  // Process in batches of 20 for reliability
  const textsArray = [...uniqueTexts.keys()];
  const BATCH_SIZE = 20;
  const allTranslations = [];
  
  for (let i = 0; i < textsArray.length; i += BATCH_SIZE) {
    const batch = textsArray.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(textsArray.length / BATCH_SIZE);
    console.log(`🤖 Translating batch ${batchNum}/${totalBatches} (${batch.length} strings)...`);
    
    const translations = await translateWithGemini(batch);
    console.log(`   ✓ Got ${translations.length} translations`);
    allTranslations.push(...translations);
    
    // Rate limit: wait 1.5s between batches
    if (i + BATCH_SIZE < textsArray.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  
  // Build new translation maps
  const newVi = { ...existingVi };
  const newEn = { ...existingEn };
  const existingKeys = new Set(Object.keys(existingVi));
  let addedCount = 0;
  
  // Map to store vi_text -> key for file replacement
  const textToKey = new Map();
  
  for (const t of allTranslations) {
    let key = t.key;
    // Ensure key uniqueness
    if (existingKeys.has(key)) {
      key = key + '_v2';
    }
    if (!existingKeys.has(key)) {
      newVi[key] = t.vi;
      newEn[key] = t.en;
      existingKeys.add(key);
      textToKey.set(t.vi, key);
      addedCount++;
    }
  }
  
  // Write updated locale files
  fs.writeFileSync(VI_JSON, JSON.stringify(newVi, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(EN_JSON, JSON.stringify(newEn, null, 2) + '\n', 'utf-8');
  
  console.log(`\n✅ Added ${addedCount} new translation keys`);
  console.log(`📁 Updated: src/locales/vi.json (${Object.keys(newVi).length} keys)`);
  console.log(`📁 Updated: src/locales/en.json (${Object.keys(newEn).length} keys)`);
  
  // Generate replacement guide
  const guideLines = [];
  guideLines.push('# i18n Replacement Guide');
  guideLines.push(`# Generated: ${new Date().toISOString()}`);
  guideLines.push(`# Total: ${addedCount} new keys\n`);
  
  for (const [text, locations] of uniqueTexts) {
    const key = textToKey.get(text);
    if (key) {
      guideLines.push(`## "${text}"`);
      guideLines.push(`   Key: ${key}`);
      guideLines.push(`   Replace with: {t('${key}')}`);
      guideLines.push(`   Locations:`);
      locations.forEach(loc => {
        guideLines.push(`     - ${loc.file}:${loc.line}`);
      });
      guideLines.push('');
    }
  }
  
  const guidePath = path.join(__dirname, 'i18n-replacement-guide.md');
  fs.writeFileSync(guidePath, guideLines.join('\n'), 'utf-8');
  console.log(`📝 Replacement guide: scripts/i18n-replacement-guide.md`);
  
  // === AUTO-REPLACE IN SOURCE FILES ===
  console.log('\n🔄 Auto-replacing hardcoded text in source files...\n');
  
  let replacedCount = 0;
  const fileReplacements = new Map();
  
  for (const [text, locations] of uniqueTexts) {
    const key = textToKey.get(text);
    if (!key) continue;
    
    for (const loc of locations) {
      const fullPath = path.join(SRC_DIR, loc.file);
      if (!fileReplacements.has(fullPath)) {
        fileReplacements.set(fullPath, fs.readFileSync(fullPath, 'utf-8'));
      }
    }
  }
  
  for (const [filePath, originalContent] of fileReplacements) {
    let content = originalContent;
    let fileChanged = false;
    
    for (const [text, locations] of uniqueTexts) {
      const key = textToKey.get(text);
      if (!key) continue;
      
      const fileLocations = locations.filter(l => path.join(SRC_DIR, l.file) === filePath);
      if (fileLocations.length === 0) continue;
      
      // Replace >Vietnamese text< with >{t('key')}<
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const jsxRegex = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g');
      const newContent = content.replace(jsxRegex, `>$1{t('${key}')}$2<`);
      
      if (newContent !== content) {
        content = newContent;
        fileChanged = true;
        replacedCount++;
      }
    }
    
    if (fileChanged) {
      // Ensure useTranslation import exists
      if (!content.includes('useTranslation') && content.includes("{t('")) {
        // Add import
        if (content.includes("from 'react'")) {
          content = content.replace(
            /^(import .* from 'react';?\n)/m,
            `$1import { useTranslation } from 'react-i18next';\n`
          );
        }
      }
      
      // Ensure const { t } = useTranslation() exists if using t()
      if (content.includes("{t('") && !content.includes('const { t }') && !content.includes('= useTranslation()')) {
        // Add after first line of function component
        content = content.replace(
          /((?:export\s+)?(?:function|const)\s+\w+.*?{)\n/,
          `$1\n  const { t } = useTranslation();\n`
        );
      }
      
      fs.writeFileSync(filePath, content, 'utf-8');
      const relPath = path.relative(SRC_DIR, filePath);
      console.log(`  ✏️  ${relPath}`);
    }
  }
  
  console.log(`\n🎉 Done! Auto-replaced ${replacedCount} strings in source files.`);
  console.log(`⚠️  Please review the changes and test the application.`);
}

main().catch(console.error);
