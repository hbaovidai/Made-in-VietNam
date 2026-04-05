export interface QRCodeData {
  id: string;
  batchId: string;
  code: string;
  scans: number;
  lastScanned: string;
  status: 'active' | 'compromised' | 'expired';
}

export const qrCodes: QRCodeData[] = [
  {
    id: 'qr1',
    batchId: 'b1',
    code: 'MIVN-LOT2026-001-A1',
    scans: 12,
    lastScanned: '2026-03-25T14:30:00Z',
    status: 'active',
  },
  {
    id: 'qr2',
    batchId: 'b1',
    code: 'MIVN-LOT2026-001-A2',
    scans: 154,
    lastScanned: '2026-03-28T09:15:00Z',
    status: 'compromised', // Bị quét quá nhiều lần -> Cảnh báo hàng giả
  },
  {
    id: 'qr3',
    batchId: 'b3',
    code: 'MIVN-LOT2025-099-X1',
    scans: 3,
    lastScanned: '2025-12-01T10:00:00Z',
    status: 'expired',
  },
];
