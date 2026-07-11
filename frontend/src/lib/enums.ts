export enum Role {
  USER = 'USER',
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  ADMIN = 'ADMIN'
};

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
};

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  REJECTED = 'REJECTED'
};

export enum RFQStatus {
  OPEN = 'OPEN',
  QUOTED = 'QUOTED',
  NEGOTIATING = 'NEGOTIATING',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export enum QuoteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
};

export enum BatchStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
};

export enum QRStatus {
  ACTIVE = 'ACTIVE',
  COMPROMISED = 'COMPROMISED',
  EXPIRED = 'EXPIRED',
};

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
};

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER'
};

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'UNPAID',
  REFUNDED = 'UNPAID',
};

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
};

export enum SupplierStatus {
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  APPLICATION_PENDING = 'APPLICATION_PENDING',
};

export enum SupplierAccountHolderRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  LEGAL_REP = 'LEGAL_REP',
  EMPLOYEE = 'EMPLOYEE',
};

export enum SupplierType {
  NORMAL = "NORMAL", // TODO: migrate everything that uses this to use DISTRIBUTOR
  DISTRIBUTOR = 'DISTRIBUTOR',
  MANUFACTURER = "MANUFACTURER",
  EXPORTER = "EXPORTER",
  MANU_EXPORT = 'MANU_EXPORT',
  DIGITAL_GOODS = 'DIGITAL_GOODS',
};

export enum BusinessType {
  PRIVATE = 'PRIVATE',
  LIMITED_LIABILITY = 'LIMITED_LIABILITY',
  JOINT_STOCK = 'JOINT_STOCK'
};

export enum Market {
  US = 'US', EU = 'EU', JAP = 'JAP', SKOR = 'SKOR',
  CHINA = 'CHINA', ASEAN = 'ASEAN', AUS = 'AUS', MID_EAST = 'MID_EAST',
  AFRICA = 'AFRICA', OTHER = 'OTHER',
};

export enum Incoterm {
  EXW = 'EXW', FOB = 'FOB', CIF = 'CIF',
  CFR = 'CFR', DDR = 'DDR', DAP = 'DAP',
};

export enum SaleChannels {
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  SHOPEE = 'SHOPEE',
  LAZADA = 'LAZADA',
  TIKTOK_SHOP = 'TIKTOK_SHOP',
  SHOPIFY = 'SHOPIFY',
  CUSTOM_WEBSITE = 'CUSTOM_WEBSITE',
};

export const SaleChannelsMap = {
  [SaleChannels.INSTAGRAM]: 'Instagram',
  [SaleChannels.FACEBOOK]: 'Facebook',
  [SaleChannels.SHOPEE]: 'Shopee',
  [SaleChannels.LAZADA]: 'Lazada',
  [SaleChannels.SHOPIFY]: 'Shopify',
  [SaleChannels.CUSTOM_WEBSITE]: 'Website',
};
