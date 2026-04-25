import { Part, Order, Review } from './types';

export const mockParts: Part[] = [
  {
    id: '1',
    sku: 'BRK-PAD-001',
    name: 'Performance Brake Pads',
    brand: 'Brembo',
    category: 'Braking',
    price: 129.99,
    stock: 45,
    status: 'in-stock',
    image_url: 'https://picsum.photos/seed/brake/600/600',
    description: 'High-performance ceramic brake pads for racing applications. Engineered for maximum stopping power and heat dissipation.',
    specifications: {
      'Material': 'Ceramic Composite',
      'Heat Rating': 'Up to 800°C',
      'Compatibility': 'Universal Sport',
      'Weight': '1.2kg per set'
    }
  },
  {
    id: '2',
    sku: 'OIL-FLT-042',
    name: 'Synthetic Oil Filter',
    brand: 'K&N',
    category: 'Maintenance',
    price: 18.50,
    stock: 8,
    status: 'low-stock',
    image_url: 'https://picsum.photos/seed/filter/600/600',
    description: 'High-flow oil filter for maximum engine protection. Features a heavy-duty canister and a 17mm hex nut for easy removal.',
    specifications: {
      'Filtration': '99% efficiency',
      'Thread Size': 'M20 x 1.5',
      'Anti-Drainback': 'Yes',
      'Bypass Valve': 'Yes'
    }
  },
  {
    id: '3',
    sku: 'CH-LUB-99',
    name: 'Chain Lubricant Pro',
    brand: 'Motul',
    category: 'Maintenance',
    price: 14.99,
    stock: 0,
    status: 'out-of-stock',
    image_url: 'https://picsum.photos/seed/lube/600/600',
    description: 'Advanced chain lubricant for high-speed motorcycles. Provides excellent protection against wear and corrosion.',
    specifications: {
      'Type': 'Synthetic',
      'Volume': '400ml',
      'Application': 'O-Ring/X-Ring Safe',
      'Weather': 'All-weather'
    }
  },
  {
    id: '4',
    sku: 'TR-SP-007',
    name: 'Racing Slick Tires',
    brand: 'Pirelli',
    category: 'Tires',
    price: 450.00,
    stock: 12,
    status: 'in-stock',
    image_url: 'https://picsum.photos/seed/tire/600/600',
    description: 'Professional racing slick tires for track use. Maximum grip and stability at high speeds.',
    specifications: {
      'Compound': 'Soft/Medium',
      'Size': '120/70 ZR17',
      'Max Speed': '300 km/h',
      'Usage': 'Track Only'
    }
  },
  {
    id: '5',
    sku: 'EXH-SYS-101',
    name: 'Titanium Exhaust System',
    brand: 'Akrapovic',
    category: 'Performance',
    price: 1250.00,
    stock: 3,
    status: 'low-stock',
    image_url: 'https://picsum.photos/seed/exhaust/600/600',
    description: 'Full titanium exhaust system for weight reduction and power gains. Includes carbon fiber muffler.',
    specifications: {
      'Material': 'Titanium / Carbon',
      'Weight Saving': '4.5kg',
      'Power Gain': '+8.2 hp',
      'Sound Level': '102 dB'
    }
  },
  {
    id: '6',
    sku: 'SUS-FK-202',
    name: 'Front Fork Springs',
    brand: 'Ohlins',
    category: 'Suspension',
    price: 189.00,
    stock: 20,
    status: 'in-stock',
    image_url: 'https://picsum.photos/seed/spring/600/600',
    description: 'High-quality fork springs for improved handling and comfort. Precision wound from high-tensile steel.',
    specifications: {
      'Rate': '9.5 N/mm',
      'Length': '280mm',
      'Material': 'Chrome Silicon',
      'Finish': 'Powder Coated'
    }
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    order_number: 'ORD-8829',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
    customer_id: 'Moto Racing Team',
    total_amount: 1250.00,
    items_count: 5,
    status: 'completed',
    items: []
  },
  {
    id: '2',
    order_number: 'ORD-8830',
    created_at: '2024-03-21T11:00:00Z',
    updated_at: '2024-03-21T11:00:00Z',
    customer_id: 'Gecain Logistics',
    total_amount: 450.00,
    items_count: 2,
    status: 'processing',
    items: []
  },
  {
    id: '3',
    order_number: 'ORD-8831',
    created_at: '2024-03-22T12:00:00Z',
    updated_at: '2024-03-22T12:00:00Z',
    customer_id: 'Speedway Parts',
    total_amount: 189.00,
    items_count: 1,
    status: 'pending',
    items: []
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    part_id: '1',
    user_name: 'Alex Rivera',
    user_role: 'Professional Racer',
    rating: 5,
    comment: 'The stopping power is incredible. No fade even after 20 laps at Silverstone.',
    date: '2024-02-15'
  },
  {
    id: '2',
    part_id: '1',
    user_name: 'Sarah Chen',
    user_role: 'Track Day Enthusiast',
    rating: 4,
    comment: 'Great performance, though they do produce a bit of dust. Worth it for the safety.',
    date: '2024-03-01'
  }
];
