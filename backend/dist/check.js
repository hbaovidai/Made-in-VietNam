"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    console.log('USERS IN DB:');
    users.forEach(u => {
        console.log(`- Email: ${u.email}, Role: ${u.role}, Name: ${u.fullName}`);
    });
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check.js.map