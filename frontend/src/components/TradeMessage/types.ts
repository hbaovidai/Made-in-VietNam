export interface Message {
  id: string;
  sender: 'buyer' | 'supplier';
  type: 'text' | 'file' | 'quotation_summary';
  content?: string;
  timestamp: string;
  status?: 'sent' | 'read';
  fileInfo?: {
    name: string;
    size: string;
    url?: string;
  };
  quotationSummary?: {
    unitPrice: string;
    moq: string;
    leadTime: string;
    paymentTerm: string;
  };
}

export interface Conversation {
  id: string;
  supplierName: string;
  avatarText: string;
  avatarBg: string;
  productName: string;
  productImage: string;
  category: string;
  inquiryId: string;
  quantity: string;
  targetPrice: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  verified: boolean;
  responseRate: string;
  responseTime: string;
  country: string;
  yearsOnPlatform: number;
  messages: Message[];
  isStarred?: boolean;
  createdDate?: string;
  supplierId?: string;
  hasRfq?: boolean;
}
