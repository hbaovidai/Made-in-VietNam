-- CreateEnum
CREATE TYPE "SupplierApplicantRole" AS ENUM ('OWNER', 'MANAGER', 'LEGAL_REP', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "SupplierApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SupplierStatus" AS ENUM ('VERIFIED', 'SUSPENDED', 'APPLICATION_REJECTED', 'APPLICATION_PENDING');

-- CreateEnum
CREATE TYPE "SupplierAccountHolderRole" AS ENUM ('OWNER', 'MANAGER', 'LEGAL_REP', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('DISTRIBUTOR', 'MANUFACTURER', 'EXPORTER', 'DIGITAL_GOODS', 'MANU_EXPORT');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('PRIVATE', 'LIMITED_LIABILITY', 'JOINT_STOCK');

-- DropIndex
DROP INDEX IF EXISTS "suppliers_is_verified_idx";

-- DropIndex
DROP INDEX IF EXISTS "suppliers_verification_status_idx";

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
ALTER TABLE "suppliers" DROP COLUMN IF EXISTS "city",
DROP COLUMN IF EXISTS "company_email",
DROP COLUMN IF EXISTS "company_phone",
DROP COLUMN IF EXISTS "identity_card_url",
DROP COLUMN IF EXISTS "is_verified",
DROP COLUMN IF EXISTS "legal_representative",
DROP COLUMN IF EXISTS "verification_status",
ADD COLUMN     "account_holder_name" TEXT,
ADD COLUMN     "account_holder_role" "SupplierAccountHolderRole" NOT NULL,
ADD COLUMN     "authorization_letter_url" TEXT[],
ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "legal_rep_gov_id" TEXT,
ADD COLUMN     "legal_rep_gov_id_url" TEXT[],
ADD COLUMN     "legal_rep_name" TEXT,
ADD COLUMN     "sales_channels" JSONB,
ADD COLUMN     "status" "SupplierStatus" NOT NULL DEFAULT 'APPLICATION_PENDING',
ADD COLUMN     "supplier_type" "SupplierType",
ADD COLUMN     "ward" TEXT,
DROP COLUMN IF EXISTS "business_license_url",
ADD COLUMN     "business_license_url" TEXT[];

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
CREATE UNIQUE INDEX "suppliers_id_key" ON "suppliers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_tax_code_key" ON "suppliers"("tax_code");

-- CreateIndex
CREATE INDEX "suppliers_id_idx" ON "suppliers"("id");

-- CreateIndex
CREATE INDEX "suppliers_updated_at_idx" ON "suppliers"("updated_at");

-- CreateIndex
CREATE INDEX "suppliers_status_idx" ON "suppliers"("status");

-- CreateIndex
CREATE INDEX "suppliers_tax_code_idx" ON "suppliers"("tax_code");
