export interface Batch {
  id: string;
  productId: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  quantity: number;
  status: 'active' | 'pending' | 'expired';
  qrGenerated: boolean;
}

export const batches: Batch[] = [
  {
    id: 'b1',
    productId: 'p1', // "Hạt cà phê Arabica thượng hạng"
    batchNumber: 'LOT-2026-001',
    manufactureDate: '2026-01-15',
    expiryDate: '2027-01-15',
    quantity: 1000,
    status: 'active',
    qrGenerated: true,
  },
  {
    id: 'b2',
    productId: 'p2', // "Hạt tiêu đen hữu cơ"
    batchNumber: 'LOT-2026-002',
    manufactureDate: '2026-02-01',
    expiryDate: '2028-02-01',
    quantity: 500,
    status: 'active',
    qrGenerated: false,
  },
  {
    id: 'b3',
    productId: 'p1',
    batchNumber: 'LOT-2025-099',
    manufactureDate: '2025-03-10',
    expiryDate: '2026-03-10',
    quantity: 2000,
    status: 'expired',
    qrGenerated: true,
  },
];
