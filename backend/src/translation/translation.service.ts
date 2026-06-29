import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
  }

  /**
   * Dịch một object có nhiều field từ Tiếng Việt sang Tiếng Anh
   * @param fields - Object { fieldName: vietnameseText }
   * @returns Object { fieldName: englishText }
   */
  async translateFields(
    fields: Record<string, string>,
  ): Promise<Record<string, string>> {
    if (!this.apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured — skipping translation');
      return {};
    }

    // Lọc bỏ field rỗng
    const toTranslate: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value && value.trim()) {
        toTranslate[key] = value;
      }
    }

    if (Object.keys(toTranslate).length === 0) return {};

    const prompt = `You are a professional translator for a B2B e-commerce platform called "VIEproduct" (Made in Vietnam).

TASK: Translate ALL values from Vietnamese to English. Keep all keys exactly the same.

RULES:
- Output ONLY valid JSON, no markdown, no explanation, no code fences
- Use professional B2B/e-commerce English terminology
- "Nhà cung cấp" = "Supplier", "Doanh nghiệp" = "Business/Company"
- Keep brand names unchanged
- For product names, keep them natural and concise
- For descriptions, maintain the original tone and formatting

JSON to translate:
${JSON.stringify(toTranslate, null, 2)}`;

    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        this.logger.error(
          `Gemini API error ${res.status}: ${errText.substring(0, 200)}`,
        );
        return {};
      }

      const data = await res.json();
      const responseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Clean markdown fences if present
      const cleaned = responseText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      this.logger.log(
        `Translated ${Object.keys(parsed).length} fields successfully`,
      );
      return parsed;
    } catch (error) {
      this.logger.error(`Translation failed: ${error.message}`);
      return {};
    }
  }

  /**
   * Dịch tên và mô tả sản phẩm
   */
  async translateProduct(
    name: string,
    description?: string,
  ): Promise<{ nameEn?: string; descriptionEn?: string }> {
    const fields: Record<string, string> = { name };
    if (description) fields.description = description;

    const result = await this.translateFields(fields);
    return {
      nameEn: result.name || undefined,
      descriptionEn: result.description || undefined,
    };
  }

  /**
   * Dịch tên danh mục
   */
  async translateCategory(name: string): Promise<string | undefined> {
    const result = await this.translateFields({ name });
    return result.name || undefined;
  }
}
