"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL,
        },
    },
});
async function main() {
    const products = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        take: 3,
        orderBy: { createdAt: 'desc' },
    });
    if (products.length < 3) {
        console.error(`Only found ${products.length} ACTIVE products, need 3.`);
        return;
    }
    console.log('=== 3 Sản phẩm được chọn ===\n');
    const p1 = products[0];
    await prisma.product.update({
        where: { id: p1.id },
        data: { pricingMode: 'STANDARD', minPrice: 150000, maxPrice: 150000 },
    });
    await prisma.priceTier.deleteMany({ where: { productId: p1.id } });
    console.log(`✅ [STANDARD] "${p1.name}" → 150,000 VND`);
    console.log(`   Slug: ${p1.slug}\n`);
    const p2 = products[1];
    await prisma.product.update({
        where: { id: p2.id },
        data: { pricingMode: 'CONTACT', minPrice: 0, maxPrice: 0 },
    });
    await prisma.priceTier.deleteMany({ where: { productId: p2.id } });
    console.log(`✅ [CONTACT] "${p2.name}" → Liên hệ để biết giá`);
    console.log(`   Slug: ${p2.slug}\n`);
    const p3 = products[2];
    await prisma.product.update({
        where: { id: p3.id },
        data: { pricingMode: 'TIERED', minPrice: 80000, maxPrice: 150000 },
    });
    await prisma.priceTier.deleteMany({ where: { productId: p3.id } });
    await prisma.priceTier.createMany({
        data: [
            { productId: p3.id, minQty: 1, maxQty: 99, price: 150000 },
            { productId: p3.id, minQty: 100, maxQty: 499, price: 120000 },
            { productId: p3.id, minQty: 500, maxQty: null, price: 80000 },
        ],
    });
    console.log(`✅ [TIERED] "${p3.name}" → 3 bậc giá:`);
    console.log(`   1-99: 150,000 | 100-499: 120,000 | ≥500: 80,000`);
    console.log(`   Slug: ${p3.slug}\n`);
    console.log('=== Done! Mở trang chi tiết từng sản phẩm để xem ===');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-pricing-demo.js.map