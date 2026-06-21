export const Role = {
  USER: 'USER',
  SUPPLIER: 'SUPPLIER',
  ADMIN: 'ADMIN'
};

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
};

export const ProductStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  REJECTED: 'REJECTED'
};

export const RFQStatus = {
  OPEN: 'OPEN',
  QUOTED: 'QUOTED',
  NEGOTIATING: 'NEGOTIATING',
  CLOSED: 'CLOSED',
  EXPIRED: 'EXPIRED',
}

export const QuoteStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const BatchStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  EXPIRED: 'EXPIRED',
};

export const QRStatus = {
  ACTIVE: 'ACTIVE',
  COMPROMISED: 'COMPROMISED',
  EXPIRED: 'EXPIRED',
};

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
};

export const PaymentMethod = {
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER'
};

export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'UNPAID',
  REFUNDED: 'UNPAID',
};

export const MessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
  SYSTEM: 'SYSTEM',
};

export const SupplierStatus = {
  VERIFIED: 'VERIFIED',
  UNVERIFIED: 'UNVERIFIED',
  SUSPENDED: 'SUSPENDED',
};

export const SupplierAccountHolderRole = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  LEGAL_REP: 'LEGAL_REP',
  EMPLOYEE: 'EMPLOYEE',
};

