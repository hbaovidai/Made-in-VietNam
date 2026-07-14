-- CreateEnum
CREATE TYPE "SaleChannelType" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'SHOPEE', 'LAZADA', 'TIKTOK_SHOP', 'SHOPIFY', 'ZALO', 'CUSTOM_WEBSITE');

-- CreateEnum
CREATE TYPE "SupplierMediaType" AS ENUM ('AUTHORIZATION_LETTER', 'BUSINESS_LICENSE', 'LEGAL_REP_GOV_ID');

-- CreateEnum
CREATE TYPE "MarketCode" AS ENUM ('USA', 'JPN', 'CHN', 'KOR', 'AUS', 'ASEAN', 'EU', 'AF', 'ME', 'OTHER');

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "address",
DROP COLUMN "province",
DROP COLUMN "ward",
ADD COLUMN     "is_fake" BOOLEAN DEFAULT false,
DROP COLUMN "business_type",
ADD COLUMN     "business_type" "BusinessType",
ALTER COLUMN "account_holder_role" DROP NOT NULL,
ALTER COLUMN "account_holder_role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "manufacturer_profile" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "fact_address" TEXT NOT NULL,
    "own_factory" BOOLEAN NOT NULL DEFAULT true,
    "production_volume" TEXT NOT NULL,
    "production_volume_unit" TEXT NOT NULL,
    "worker_count" INTEGER NOT NULL,
    "location_reg_papers_url" TEXT[],
    "real_est_perm_papers_url" TEXT[],
    "industry_specific_paperls_url" TEXT[],
    "factory_media_url" TEXT[],
    "extra_certs_url" TEXT[],
    "environmental_certs_url" TEXT[]
);

-- CreateTable
CREATE TABLE "exporter_profile" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "years_exp" INTEGER NOT NULL DEFAULT 0,
    "has_org_cert" BOOLEAN NOT NULL DEFAULT false,
    "is_main_indust" BOOLEAN NOT NULL DEFAULT true,
    "exporter_paper_url" TEXT[],
    "foreign_contracts_url" TEXT[],
    "international_certs_url" TEXT[],

    CONSTRAINT "exporter_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exporter_market_map" (
    "exporter_id" TEXT NOT NULL,
    "market_code" "MarketCode" NOT NULL,

    CONSTRAINT "exporter_market_map_pkey" PRIMARY KEY ("exporter_id","market_code")
);

-- CreateTable
CREATE TABLE "supplier_category_map" (
    "category_slug" TEXT NOT NULL,
    "category_level" INTEGER NOT NULL DEFAULT 1,
    "supplier_slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_category_map_pkey" PRIMARY KEY ("category_slug","supplier_slug")
);

-- CreateTable
CREATE TABLE "supplier_channel_map" (
    "supplier_slug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "SaleChannelType" NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "supplier_channel_map_pkey" PRIMARY KEY ("supplier_slug","type")
);

-- CreateTable
CREATE TABLE "supplier_address_map" (
    "supplier_slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplier_address_map_pkey" PRIMARY KEY ("supplier_slug","address")
);

-- CreateTable
CREATE TABLE "supplier_document_media_map" (
    "supplier_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "SupplierMediaType" NOT NULL,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "supplier_document_media_map_pkey" PRIMARY KEY ("url")
);

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_profile_supplierId_key" ON "manufacturer_profile"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "exporter_profile_supplierId_key" ON "exporter_profile"("supplierId");

-- CreateIndex
CREATE INDEX "supplier_document_media_map_supplier_id_type_idx" ON "supplier_document_media_map"("supplier_id", "type");

-- CreateIndex
CREATE INDEX "suppliers_slug_idx" ON "suppliers"("slug");

-- AddForeignKey
ALTER TABLE "manufacturer_profile" ADD CONSTRAINT "manufacturer_profile_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exporter_profile" ADD CONSTRAINT "exporter_profile_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exporter_market_map" ADD CONSTRAINT "exporter_market_map_exporter_id_fkey" FOREIGN KEY ("exporter_id") REFERENCES "exporter_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_category_map" ADD CONSTRAINT "supplier_category_map_category_slug_fkey" FOREIGN KEY ("category_slug") REFERENCES "categories"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_category_map" ADD CONSTRAINT "supplier_category_map_supplier_slug_fkey" FOREIGN KEY ("supplier_slug") REFERENCES "suppliers"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_channel_map" ADD CONSTRAINT "supplier_channel_map_supplier_slug_fkey" FOREIGN KEY ("supplier_slug") REFERENCES "suppliers"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_address_map" ADD CONSTRAINT "supplier_address_map_supplier_slug_fkey" FOREIGN KEY ("supplier_slug") REFERENCES "suppliers"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_document_media_map" ADD CONSTRAINT "supplier_document_media_map_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
