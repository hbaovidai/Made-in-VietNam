/*
  Warnings:

  - The `verification_status` column on the `suppliers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SupplierApplicantRole" AS ENUM ('OWNER', 'MANAGER', 'LEGAL_REP', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "SupplierApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SupplierVerificationStatus" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- DropIndex
DROP INDEX "suppliers_is_verified_idx";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "customizations" TEXT[],
ADD COLUMN     "export_markets" TEXT,
ADD COLUMN     "lead_time" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "port" TEXT,
ADD COLUMN     "production_capacity" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "specifications" JSONB;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "sales_channels" JSONB,
DROP COLUMN "verification_status",
ADD COLUMN     "verification_status" "SupplierVerificationStatus" DEFAULT 'UNVERIFIED',
ALTER COLUMN "is_verified" DROP NOT NULL;

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question_vi" TEXT NOT NULL,
    "answer_vi" TEXT NOT NULL,
    "question_en" TEXT NOT NULL,
    "answer_en" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_sections" (
    "id" TEXT NOT NULL,
    "title_vi" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content_vi" TEXT NOT NULL,
    "content_en" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "page_key" TEXT NOT NULL DEFAULT 'terms',

    CONSTRAINT "legal_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_applications" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "applicant_role" "SupplierApplicantRole" NOT NULL,
    "gov_id" TEXT NOT NULL,
    "gov_id_pic_url" TEXT[],
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "SupplierApplicationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "supplier_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "legal_sections_page_key_slug_key" ON "legal_sections"("page_key", "slug");

-- CreateIndex
CREATE INDEX "categories_id_idx" ON "categories"("id");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_name_en_idx" ON "categories"("name_en");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "suppliers_updated_at_idx" ON "suppliers"("updated_at");

-- CreateIndex
CREATE INDEX "suppliers_verification_status_idx" ON "suppliers"("verification_status");
