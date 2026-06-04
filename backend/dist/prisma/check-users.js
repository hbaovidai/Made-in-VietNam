"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, fullName: true } });
    console.log('📋 Users trong DB:', users.length);
    users.forEach(u => console.log(`  - ${u.email} (${u.role}) — ${u.fullName}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check-users.js.map