import { Conversation } from './types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    supplierName: 'ABC Manufacturing Co., Ltd.',
    avatarText: 'AM',
    avatarBg: 'bg-blue-600',
    productName: 'Custom Precision CNC Machining Aluminum Parts',
    productImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=120&auto=format&fit=crop&q=80',
    category: 'Machinery parts / CNC Services',
    inquiryId: 'RFQ-2026-98721',
    quantity: '5,000 pcs',
    targetPrice: '$1.20 / pc',
    lastMessage: 'Let me check with our production team. I will get back to you shortly.',
    lastMessageTime: '10:24 AM',
    unreadCount: 2,
    verified: true,
    responseRate: '98.5%',
    responseTime: '< 2 hours',
    country: 'China (Mainland)',
    yearsOnPlatform: 8,
    isStarred: false,
    messages: [
      {
        id: 'm1-1',
        sender: 'buyer',
        type: 'text',
        content: 'Hi, I am looking for a custom CNC machining service for aluminum brackets. Here is our design spec. Could you please provide a quotation for 5,000 units?',
        timestamp: '09:15 AM',
        status: 'read'
      },
      {
        id: 'm1-2',
        sender: 'supplier',
        type: 'text',
        content: 'Hello! Thank you for reaching out to ABC Manufacturing. Yes, we can manufacture these aluminum brackets according to your technical drawings. We have 15 CNC milling centers ready.',
        timestamp: '09:42 AM'
      },
      {
        id: 'm1-3',
        sender: 'supplier',
        type: 'file',
        fileInfo: {
          name: 'Quotation_ABC_Parts_RFQ98721_v2.pdf',
          size: '1.2 MB'
        },
        timestamp: '09:43 AM'
      },
      {
        id: 'm1-4',
        sender: 'supplier',
        type: 'quotation_summary',
        quotationSummary: {
          unitPrice: '$1.15 / pc',
          moq: '1,000 pcs',
          leadTime: '15 working days',
          paymentTerm: '30% T/T Deposit, 70% before shipment'
        },
        timestamp: '09:44 AM'
      },
      {
        id: 'm1-5',
        sender: 'buyer',
        type: 'text',
        content: 'Thank you for the quick response. The quotation details look very promising. If we increase our initial order quantity to 10,000 units, is it possible to reduce the unit price further to $1.05 / pc?',
        timestamp: '10:12 AM',
        status: 'read'
      },
      {
        id: 'm1-6',
        sender: 'supplier',
        type: 'text',
        content: 'Let me check with our production team. I will get back to you shortly.',
        timestamp: '10:24 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    supplierName: 'XYZ Steel Corporation',
    avatarText: 'XS',
    avatarBg: 'bg-slate-700',
    productName: 'Hot Rolled Steel Coils ASTM A36',
    productImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80',
    category: 'Steel & Metallurgy / Raw Metals',
    inquiryId: 'RFQ-2026-44312',
    quantity: '100 Tons',
    targetPrice: '$580.00 / Ton',
    lastMessage: 'Can you guarantee the delivery time to Haiphong Port within 15 days?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    verified: true,
    responseRate: '94.2%',
    responseTime: '< 4 hours',
    country: 'South Korea',
    yearsOnPlatform: 12,
    isStarred: true,
    messages: [
      {
        id: 'm2-1',
        sender: 'buyer',
        type: 'text',
        content: 'Dear sales team, we need 100 metric tons of hot rolled steel coils ASTM A36. Do you have stock available now?',
        timestamp: '2:15 PM',
        status: 'read'
      },
      {
        id: 'm2-2',
        sender: 'supplier',
        type: 'text',
        content: 'Hello, yes, we currently have about 450 tons of ASTM A36 hot rolled coils in stock at our Incheon warehouse. I have attached the detailed chemical composition certificate and quotation sheet.',
        timestamp: '3:05 PM'
      },
      {
        id: 'm2-3',
        sender: 'supplier',
        type: 'file',
        fileInfo: {
          name: 'XYZ_ASTM_A36_Steel_Coils_Spec.pdf',
          size: '2.4 MB'
        },
        timestamp: '3:06 PM'
      },
      {
        id: 'm2-4',
        sender: 'supplier',
        type: 'quotation_summary',
        quotationSummary: {
          unitPrice: '$590.00 / Ton (FOB Busan)',
          moq: '50 Tons',
          leadTime: '7 days (in stock)',
          paymentTerm: '100% L/C at sight'
        },
        timestamp: '3:07 PM'
      },
      {
        id: 'm2-5',
        sender: 'buyer',
        type: 'text',
        content: 'Can you guarantee the delivery time to Haiphong Port within 15 days if we place the order and open the L/C this week?',
        timestamp: '4:20 PM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-3',
    supplierName: 'Sunshine Textile Vietnam JSC',
    avatarText: 'ST',
    avatarBg: 'bg-emerald-600',
    productName: 'Organic Cotton T-Shirts Custom Printing',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
    category: 'Apparel & Fashion / Custom Clothing',
    inquiryId: 'RFQ-2026-10293',
    quantity: '2,000 pcs',
    targetPrice: '$2.50 / pc',
    lastMessage: 'Yes, we can adjust the printing technique to meet your target price. Let me draft a new proposal.',
    lastMessageTime: 'Wednesday',
    unreadCount: 0,
    verified: false,
    responseRate: '89.1%',
    responseTime: '< 12 hours',
    country: 'Vietnam',
    yearsOnPlatform: 3,
    isStarred: false,
    messages: [
      {
        id: 'm3-1',
        sender: 'buyer',
        type: 'text',
        content: 'Hello, we are launching an eco-friendly apparel line. Can you produce 2,000 organic cotton t-shirts with our custom logo print? Our budget is around $2.50 per piece.',
        timestamp: '11:00 AM',
        status: 'read'
      },
      {
        id: 'm3-2',
        sender: 'supplier',
        type: 'text',
        content: 'Hello! We specialize in GOTS-certified organic cotton garments. Yes, we can print your logo. Standard water-based screen printing is ideal for organic cotton. Please see our catalog and certification below.',
        timestamp: '11:45 AM'
      },
      {
        id: 'm3-3',
        sender: 'supplier',
        type: 'file',
        fileInfo: {
          name: 'Sunshine_Organic_Cotton_Cert_2026.pdf',
          size: '850 KB'
        },
        timestamp: '11:46 AM'
      },
      {
        id: 'm3-4',
        sender: 'supplier',
        type: 'quotation_summary',
        quotationSummary: {
          unitPrice: '$2.80 / pc (incl. 2-color screen print)',
          moq: '1,000 pcs',
          leadTime: '25 days from sample approval',
          paymentTerm: '50% Deposit T/T, 50% upon delivery'
        },
        timestamp: '11:48 AM'
      },
      {
        id: 'm3-5',
        sender: 'buyer',
        type: 'text',
        content: 'Your price is slightly above our budget of $2.50. Can we optimize the print sizing or fabric weight (e.g., from 180gsm to 160gsm) to match our target price?',
        timestamp: '01:30 PM',
        status: 'read'
      },
      {
        id: 'm3-6',
        sender: 'supplier',
        type: 'text',
        content: 'Yes, we can adjust the printing technique to meet your target price. Let me draft a new proposal.',
        timestamp: '02:00 PM'
      }
    ]
  },
  {
    id: 'conv-4',
    supplierName: 'DEF Metal Co., Ltd.',
    avatarText: 'DM',
    avatarBg: 'bg-amber-600',
    productName: '6063-T5 Aluminum Extrusion Profiles',
    productImage: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=120&auto=format&fit=crop&q=80',
    category: 'Construction Materials / Aluminum Extrusions',
    inquiryId: 'RFQ-2026-55419',
    quantity: '5 Tons',
    targetPrice: '$2,200 / Ton',
    lastMessage: 'Attached is our mold policy and tooling cost estimation. Please review.',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
    verified: true,
    responseRate: '99.0%',
    responseTime: '< 1 hour',
    country: 'Taiwan',
    yearsOnPlatform: 5,
    isStarred: false,
    messages: [
      {
        id: 'm4-1',
        sender: 'buyer',
        type: 'text',
        content: 'Hi, do you support custom extrusion molds for 6063-T5 aluminum profiles? We need 5 tons initially. Here is our profile section diagram.',
        timestamp: '09:00 AM',
        status: 'read'
      },
      {
        id: 'm4-2',
        sender: 'supplier',
        type: 'text',
        content: 'Hello, yes, custom profiles are our core business! We make molds in-house. For 5 tons, there will be a tooling charge, but it is 100% refundable once you reach 10 tons cumulative order.',
        timestamp: '09:30 AM'
      },
      {
        id: 'm4-3',
        sender: 'supplier',
        type: 'file',
        fileInfo: {
          name: 'DEF_Tooling_Mold_Policy_2026.pdf',
          size: '980 KB'
        },
        timestamp: '09:31 AM'
      },
      {
        id: 'm4-4',
        sender: 'supplier',
        type: 'quotation_summary',
        quotationSummary: {
          unitPrice: '$2,150 / Ton + $800 Tooling Fee (refundable)',
          moq: '3 Tons per custom profile',
          leadTime: '20 days (10d tooling + 10d production)',
          paymentTerm: '100% Tooling fee + 30% deposit, balance on QC'
        },
        timestamp: '09:33 AM'
      }
    ]
  },
  {
    id: 'conv-5',
    supplierName: 'GHI Packaging Solutions',
    avatarText: 'GP',
    avatarBg: 'bg-purple-600',
    productName: 'Biodegradable Kraft Paper Bags with Handles',
    productImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=120&auto=format&fit=crop&q=80',
    category: 'Packaging & Printing / Paper Bags',
    inquiryId: 'RFQ-2026-78810',
    quantity: '20,000 pcs',
    targetPrice: '$0.15 / pc',
    lastMessage: 'Sure, we can send physical samples. We have a pre-made sample box ready for dispatch.',
    lastMessageTime: '1 week ago',
    unreadCount: 1,
    verified: true,
    responseRate: '95.6%',
    responseTime: '< 3 hours',
    country: 'Vietnam',
    yearsOnPlatform: 6,
    isStarred: false,
    messages: [
      {
        id: 'm5-1',
        sender: 'buyer',
        type: 'text',
        content: 'Hi there, we need custom printed brown kraft paper shopping bags with twisted handles. Size is 30x20x10 cm. 20,000 pcs. Target price is $0.15.',
        timestamp: '10:00 AM',
        status: 'read'
      },
      {
        id: 'm5-2',
        sender: 'supplier',
        type: 'text',
        content: 'Hello, we can produce that size. For 120gsm brown kraft paper and 1-color logo print, our price is close to your target. Here is our catalog and dimension specifications.',
        timestamp: '10:45 AM'
      },
      {
        id: 'm5-3',
        sender: 'supplier',
        type: 'file',
        fileInfo: {
          name: 'GHI_Kraft_Bags_Catalog_2026.pdf',
          size: '1.1 MB'
        },
        timestamp: '10:46 AM'
      },
      {
        id: 'm5-4',
        sender: 'supplier',
        type: 'quotation_summary',
        quotationSummary: {
          unitPrice: '$0.165 / pc',
          moq: '10,000 pcs',
          leadTime: '12 days after artwork confirmation',
          paymentTerm: '30% Deposit, 70% against B/L copy'
        },
        timestamp: '10:48 AM'
      },
      {
        id: 'm5-5',
        sender: 'buyer',
        type: 'text',
        content: 'Can you send physical samples to our office in Hanoi? We want to inspect the handles strength. We will cover the express courier fee.',
        timestamp: '11:15 AM',
        status: 'read'
      },
      {
        id: 'm5-6',
        sender: 'supplier',
        type: 'text',
        content: 'Sure, we can send physical samples. We have a pre-made sample box ready for dispatch.',
        timestamp: '02:30 PM'
      }
    ]
  }
];
