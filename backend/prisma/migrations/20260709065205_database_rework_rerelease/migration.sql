-- CreateEnum (Safe)
DO $$ BEGIN
    CREATE TYPE "SupplierApplicantRole" AS ENUM ('OWNER', 'MANAGER', 'LEGAL_REP', 'EMPLOYEE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum (Safe)
DO $$ BEGIN
    CREATE TYPE "SupplierApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum (Safe)
DO $$ BEGIN
    CREATE TYPE "SupplierStatus" AS ENUM ('VERIFIED', 'SUSPENDED', 'APPLICATION_REJECTED', 'APPLICATION_PENDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum (Safe)
DO $$ BEGIN
    CREATE TYPE "SupplierAccountHolderRole" AS ENUM ('OWNER', 'MANAGER', 'LEGAL_REP', 'EMPLOYEE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum (Safe)
DO $$ BEGIN
    CREATE TYPE "SupplierType" AS ENUM ('DISTRIBUTOR', 'MANUFACTURER', 'EXPORTER', 'DIGITAL_GOODS', 'MANU_EXPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum (Safe)
DO $$ BEGIN
    CREATE TYPE "BusinessType" AS ENUM ('PRIVATE', 'LIMITED_LIABILITY', 'JOINT_STOCK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- DropIndex (Safe)
DROP INDEX IF EXISTS "suppliers_is_verified_idx";
DROP INDEX IF EXISTS "suppliers_verification_status_idx";

-- AlterTable products (Safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='attributes') THEN
        ALTER TABLE "products" ADD COLUMN "attributes" JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='brand') THEN
        ALTER TABLE "products" ADD COLUMN "brand" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='customizations') THEN
        ALTER TABLE "products" ADD COLUMN "customizations" TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='export_markets') THEN
        ALTER TABLE "products" ADD COLUMN "export_markets" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='lead_time') THEN
        ALTER TABLE "products" ADD COLUMN "lead_time" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='origin') THEN
        ALTER TABLE "products" ADD COLUMN "origin" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='port') THEN
        ALTER TABLE "products" ADD COLUMN "port" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='production_capacity') THEN
        ALTER TABLE "products" ADD COLUMN "production_capacity" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sku') THEN
        ALTER TABLE "products" ADD COLUMN "sku" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='specifications') THEN
        ALTER TABLE "products" ADD COLUMN "specifications" JSONB;
    END IF;
END $$;

-- AlterTable suppliers (Safe)
ALTER TABLE "suppliers" 
DROP COLUMN IF EXISTS "city",
DROP COLUMN IF EXISTS "company_email",
DROP COLUMN IF EXISTS "company_phone",
DROP COLUMN IF EXISTS "identity_card_url",
DROP COLUMN IF EXISTS "is_verified",
DROP COLUMN IF EXISTS "legal_representative",
DROP COLUMN IF EXISTS "verification_status",
DROP COLUMN IF EXISTS "business_license_url";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='account_holder_name') THEN
        ALTER TABLE "suppliers" ADD COLUMN "account_holder_name" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='account_holder_role') THEN
        ALTER TABLE "suppliers" ADD COLUMN "account_holder_role" "SupplierAccountHolderRole" NOT NULL DEFAULT 'OWNER';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='authorization_letter_url') THEN
        ALTER TABLE "suppliers" ADD COLUMN "authorization_letter_url" TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='contact_email') THEN
        ALTER TABLE "suppliers" ADD COLUMN "contact_email" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='contact_phone') THEN
        ALTER TABLE "suppliers" ADD COLUMN "contact_phone" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='legal_rep_gov_id') THEN
        ALTER TABLE "suppliers" ADD COLUMN "legal_rep_gov_id" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='legal_rep_gov_id_url') THEN
        ALTER TABLE "suppliers" ADD COLUMN "legal_rep_gov_id_url" TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='legal_rep_name') THEN
        ALTER TABLE "suppliers" ADD COLUMN "legal_rep_name" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='sales_channels') THEN
        ALTER TABLE "suppliers" ADD COLUMN "sales_channels" JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='status') THEN
        ALTER TABLE "suppliers" ADD COLUMN "status" "SupplierStatus" NOT NULL DEFAULT 'APPLICATION_PENDING';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='supplier_type') THEN
        ALTER TABLE "suppliers" ADD COLUMN "supplier_type" "SupplierType";
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='ward') THEN
        ALTER TABLE "suppliers" ADD COLUMN "ward" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='business_license_url') THEN
        ALTER TABLE "suppliers" ADD COLUMN "business_license_url" TEXT[];
    END IF;
END $$;

-- CreateTable (Safe)
CREATE TABLE IF NOT EXISTS "faqs" (
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

-- CreateTable (Safe)
CREATE TABLE IF NOT EXISTS "legal_sections" (
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

-- CreateTable (Safe)
CREATE TABLE IF NOT EXISTS "supplier_applications" (
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

-- CreateIndex (Safe)
CREATE UNIQUE INDEX IF NOT EXISTS "legal_sections_page_key_slug_key" ON "legal_sections"("page_key", "slug");
CREATE INDEX IF NOT EXISTS "categories_id_idx" ON "categories"("id");
CREATE INDEX IF NOT EXISTS "categories_name_idx" ON "categories"("name");
CREATE INDEX IF NOT EXISTS "categories_name_en_idx" ON "categories"("name_en");
CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "products"("category_id");
CREATE UNIQUE INDEX IF NOT EXISTS "suppliers_id_key" ON "suppliers"("id");
CREATE UNIQUE INDEX IF NOT EXISTS "suppliers_tax_code_key" ON "suppliers"("tax_code");
CREATE INDEX IF NOT EXISTS "suppliers_id_idx" ON "suppliers"("id");
CREATE INDEX IF NOT EXISTS "suppliers_updated_at_idx" ON "suppliers"("updated_at");
CREATE INDEX IF NOT EXISTS "suppliers_status_idx" ON "suppliers"("status");
CREATE INDEX IF NOT EXISTS "suppliers_tax_code_idx" ON "suppliers"("tax_code");
