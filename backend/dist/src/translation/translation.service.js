"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TranslationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const common_1 = require("@nestjs/common");
let TranslationService = TranslationService_1 = class TranslationService {
    logger = new common_1.Logger(TranslationService_1.name);
    apiKey;
    apiUrl;
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    }
    async translateFields(fields) {
        if (!this.apiKey) {
            this.logger.warn('GEMINI_API_KEY not configured — skipping translation');
            return {};
        }
        const toTranslate = {};
        for (const [key, value] of Object.entries(fields)) {
            if (value && value.trim()) {
                toTranslate[key] = value;
            }
        }
        if (Object.keys(toTranslate).length === 0)
            return {};
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
                this.logger.error(`Gemini API error ${res.status}: ${errText.substring(0, 200)}`);
                return {};
            }
            const data = await res.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleaned = responseText
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();
            const parsed = JSON.parse(cleaned);
            this.logger.log(`Translated ${Object.keys(parsed).length} fields successfully`);
            return parsed;
        }
        catch (error) {
            this.logger.error(`Translation failed: ${error.message}`);
            return {};
        }
    }
    async translateProduct(name, description) {
        const fields = { name };
        if (description)
            fields.description = description;
        const result = await this.translateFields(fields);
        return {
            nameEn: result.name || undefined,
            descriptionEn: result.description || undefined,
        };
    }
    async translateCategory(name) {
        const result = await this.translateFields({ name });
        return result.name || undefined;
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = TranslationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TranslationService);
//# sourceMappingURL=translation.service.js.map