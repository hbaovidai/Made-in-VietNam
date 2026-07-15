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
    datasources: { db: { url: process.env.DIRECT_URL } },
});
async function main() {
    const tieredProduct = await prisma.product.findFirst({
        where: { pricingMode: 'TIERED' },
    });
    if (!tieredProduct) {
        console.log('No TIERED product found');
        return;
    }
    await prisma.priceTier.deleteMany({ where: { productId: tieredProduct.id } });
    await prisma.priceTier.createMany({
        data: [
            { productId: tieredProduct.id, minQty: 1, maxQty: 49, price: 180000 },
            { productId: tieredProduct.id, minQty: 50, maxQty: 199, price: 150000 },
            { productId: tieredProduct.id, minQty: 200, maxQty: 499, price: 120000 },
            { productId: tieredProduct.id, minQty: 500, maxQty: null, price: 85000 },
        ],
    });
    await prisma.product.update({
        where: { id: tieredProduct.id },
        data: { minPrice: 85000, maxPrice: 180000 },
    });
    console.log(`✅ Updated "${tieredProduct.name}" with 4 price tiers:`);
    console.log('   1-49: 180,000 | 50-199: 150,000 | 200-499: 120,000 | ≥500: 85,000');
    console.log(`   Slug: ${tieredProduct.slug}`);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-4tiers.js.map