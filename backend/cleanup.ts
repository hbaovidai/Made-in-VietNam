import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data cleanup...');

  // Delete everything except Users, Suppliers, and Categories
  console.log('Deleting Reports...');
  await prisma.report.deleteMany({});
  
  console.log('Deleting Subscriptions & Memberships...');
  await prisma.userSubscription.deleteMany({});
  await prisma.membershipPlan.deleteMany({});
  
  console.log('Deleting Contact Submissions...');
  await prisma.contactSubmission.deleteMany({});
  
  console.log('Deleting Notifications...');
  await prisma.notification.deleteMany({});
  
  console.log('Deleting View History & Saved Products...');
  await prisma.viewHistory.deleteMany({});
  await prisma.savedProduct.deleteMany({});
  
  console.log('Deleting Anti-counterfeit data (Scans, QR, Batches)...');
  await prisma.scanEvent.deleteMany({});
  await prisma.qRCode.deleteMany({});
  await prisma.batch.deleteMany({});
  
  console.log('Deleting Messaging data...');
  await prisma.message.deleteMany({});
  await prisma.conversationParticipant.deleteMany({});
  await prisma.conversation.deleteMany({});
  
  console.log('Deleting RFQs and Quotes...');
  await prisma.quote.deleteMany({});
  await prisma.rFQ.deleteMany({});
  
  console.log('Deleting Products...');
  await prisma.product.deleteMany({});
  
  console.log('Deleting Supplier details (Certs, Industries, Markets)...');
  await prisma.certification.deleteMany({});
  await prisma.supplierIndustry.deleteMany({});
  await prisma.supplierMarket.deleteMany({});

  console.log('Data cleanup completed successfully. Only Users, Suppliers, and Categories remain.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
