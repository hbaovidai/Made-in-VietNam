/**
 * 🌐 Auto-Translate i18n JSON using Gemini API (FREE)
 * 
 * Hướng dẫn sử dụng:
 * 1. Lấy API Key miễn phí tại: https://aistudio.google.com/apikey
 * 2. Chạy: GEMINI_API_KEY=your_key_here node scripts/translate.js
 * 
 * Hoặc tạo file .env trong thư mục frontend:
 *   GEMINI_API_KEY=your_key_here
 * Rồi chạy: node scripts/translate.js
 */

const fs = require('fs');
const path = require('path');

// ============ CẤU HÌNH ============
const SOURCE_LANG = 'vi';           // Ngôn ngữ gốc
const TARGET_LANG = 'en';           // Ngôn ngữ đích
const SOURCE_FILE = path.join(__dirname, '..', 'src', 'locales', `${SOURCE_LANG}.json`);
const TARGET_FILE = path.join(__dirname, '..', 'src', 'locales', `${TARGET_LANG}.json`);
const BATCH_SIZE = 80;              // Số key mỗi lần gửi API (tránh quá tải)
const API_DELAY_MS = 1500;          // Delay giữa các batch (tránh rate limit free tier)

// ============ LẤY API KEY ============
// Ưu tiên: biến môi trường > .env file
let API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
  } catch (e) { /* .env not found, skip */ }
}

if (!API_KEY) {
  console.error('❌ Thiếu GEMINI_API_KEY!');
  console.error('👉 Lấy key miễn phí tại: https://aistudio.google.com/apikey');
  console.error('👉 Chạy: GEMINI_API_KEY=your_key node scripts/translate.js');
  process.exit(1);
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// ============ HÀM GỌI GEMINI API ============
async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,  // Rất chính xác, ít sáng tạo
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ============ HÀM DỊCH 1 BATCH ============
async function translateBatch(entries) {
  const jsonChunk = {};
  for (const [key, value] of entries) {
    jsonChunk[key] = value;
  }

  const prompt = `You are a professional translator for a B2B e-commerce platform called "VIEproduct" (Made in Vietnam).

TASK: Translate ALL values from Vietnamese to English. Keep all keys exactly the same.

RULES:
- Output ONLY valid JSON, no markdown, no explanation, no code fences
- Keep {{variables}} and interpolation patterns intact (e.g. {{count}}, {{name}})
- Use professional B2B/e-commerce English terminology
- "Nhà cung cấp" = "Supplier", "Doanh nghiệp" = "Business/Company", "Báo giá" = "Quotation"
- "Duyệt" (as in approve) = "Approve/Verify", "Đơn hàng" = "Order"
- Keep brand names like "VIEproduct" unchanged
- For UI labels, keep them concise and natural in English

JSON to translate:
${JSON.stringify(jsonChunk, null, 2)}`;

  const response = await callGemini(prompt);
  
  // Clean response: remove markdown code fences if any
  let cleaned = response
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('⚠️  Lỗi parse JSON từ Gemini, thử lại batch này...');
    console.error('Raw response:', cleaned.substring(0, 200));
    return null;
  }
}

// ============ HÀM CHÍNH ============
async function main() {
  console.log('🌐 MIVN5 Auto-Translator (Gemini API - FREE)');
  console.log('━'.repeat(50));

  // 1. Đọc file nguồn
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`❌ Không tìm thấy file: ${SOURCE_FILE}`);
    process.exit(1);
  }

  const sourceData = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf-8'));
  const sourceKeys = Object.entries(sourceData);
  console.log(`📖 Đọc ${SOURCE_FILE}`);
  console.log(`   → ${sourceKeys.length} keys trong ${SOURCE_LANG}.json`);

  // 2. Đọc file đích hiện có (nếu có) để giữ lại bản dịch cũ
  let existingTarget = {};
  if (fs.existsSync(TARGET_FILE)) {
    existingTarget = JSON.parse(fs.readFileSync(TARGET_FILE, 'utf-8'));
    console.log(`📝 File ${TARGET_LANG}.json hiện có ${Object.keys(existingTarget).length} keys`);
  }

  // 3. Tìm keys cần dịch (mới hoặc chưa dịch)
  const isUniversalValue = (value) => {
    // Bỏ qua các giá trị giống nhau ở mọi ngôn ngữ: Email, URL, số, brand...
    if (/^[\d\s\$%.,\-–—~+×÷=<>()\/\\@#&*!?:;'"]*$/.test(value)) return true;
    if (/^(US\s*\$|EUR|VND)/i.test(value)) return true;
    if (/^https?:\/\//i.test(value)) return true;
    // Các từ phổ quát: Email, Google, Facebook, QR Code, FAQ, Admin, Kg...
    const universals = ['email','website','google','facebook','app store','google play',
      'video','qr code','qr','faq','admin','kg','g','ml','l','m','cm','mm','trade assurance'];
    if (universals.includes(value.toLowerCase().trim())) return true;
    return false;
  };

  const needTranslation = sourceKeys.filter(([key]) => {
    if (!existingTarget[key]) return true; // Key mới, chưa có → cần dịch
    if (existingTarget[key] !== sourceData[key]) return false; // Đã dịch khác → bỏ qua
    // Giá trị giống nhau → kiểm tra có phải từ phổ quát không
    if (isUniversalValue(sourceData[key])) return false; // Từ phổ quát → bỏ qua
    return true; // Thật sự chưa dịch → cần dịch
  });

  if (needTranslation.length === 0) {
    console.log('✅ Tất cả keys đã được dịch! Không cần làm gì thêm.');
    return;
  }

  console.log(`🔄 Cần dịch: ${needTranslation.length} keys mới/chưa dịch`);
  console.log('━'.repeat(50));

  // 4. Chia thành batches và dịch
  const totalBatches = Math.ceil(needTranslation.length / BATCH_SIZE);
  const translatedResult = { ...existingTarget };
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < totalBatches; i++) {
    const batch = needTranslation.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const batchNum = i + 1;
    
    process.stdout.write(`  📦 Batch ${batchNum}/${totalBatches} (${batch.length} keys)... `);

    let result = null;
    let retries = 3;
    
    while (retries > 0 && !result) {
      try {
        result = await translateBatch(batch);
      } catch (err) {
        retries--;
        if (retries > 0) {
          console.log(`⚠️  Lỗi, thử lại (${retries} lần)...`);
          await sleep(3000);
        } else {
          console.log(`❌ Thất bại: ${err.message}`);
        }
      }
    }

    if (result) {
      Object.assign(translatedResult, result);
      successCount += batch.length;
      console.log('✅');
    } else {
      failCount += batch.length;
      console.log('❌ Bỏ qua batch này');
    }

    // Delay giữa các batch
    if (i < totalBatches - 1) {
      await sleep(API_DELAY_MS);
    }
  }

  // 5. Đồng bộ thứ tự keys theo file nguồn + xóa keys thừa
  const finalResult = {};
  for (const [key] of sourceKeys) {
    finalResult[key] = translatedResult[key] || sourceData[key]; // fallback về tiếng Việt nếu chưa dịch
  }

  // 6. Ghi file
  fs.writeFileSync(TARGET_FILE, JSON.stringify(finalResult, null, 2) + '\n', 'utf-8');

  console.log('━'.repeat(50));
  console.log(`✅ Hoàn thành! Đã ghi ${TARGET_FILE}`);
  console.log(`   → Dịch thành công: ${successCount} keys`);
  if (failCount > 0) console.log(`   → Thất bại: ${failCount} keys (giữ nguyên tiếng Việt)`);
  console.log(`   → Tổng: ${Object.keys(finalResult).length} keys`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ CHẠY ============
main().catch(err => {
  console.error('💥 Lỗi không mong muốn:', err);
  process.exit(1);
});
