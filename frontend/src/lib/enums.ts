export enum Role {
  USER = 'USER',
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
  UNVERIFIED = 'UNVERIFIED',
  SUSPENDED = 'SUSPENDED',
};

export enum SupplierAccountHolderRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  LEGAL_REP = 'LEGAL_REP',
  EMPLOYEE = 'EMPLOYEE',
};

