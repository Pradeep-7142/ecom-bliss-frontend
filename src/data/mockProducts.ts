import { Product } from '@/contexts/CartContext';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    brand: 'AudioTech',
    rating: 4.5,
    stock: 15,
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
    category: 'Fitness',
    brand: 'FitGear',
    rating: 4.3,
    stock: 8,
    description: 'Advanced fitness tracker with heart rate monitor and GPS tracking.',
    images: [
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'Professional Gaming Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    category: 'Gaming',
    brand: 'GamePro',
    rating: 4.8,
    stock: 0,
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    images: [
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop'
    ]
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    brand: 'EcoWear',
    rating: 4.2,
    stock: 25,
    description: 'Comfortable organic cotton t-shirt available in multiple colors and sizes.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'
    ]
  },
  {
    id: '5',
    name: 'Premium Coffee Maker',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    rating: 4.6,
    stock: 12,
    description: 'Professional-grade coffee maker with multiple brewing options and temperature control.',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop'
    ]
  },
  {
    id: '6',
    name: 'Wireless Charging Pad',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
    category: 'Electronics',
    brand: 'ChargeTech',
    rating: 4.1,
    stock: 20,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop'
    ]
  },
  {
    id: '7',
    name: 'Minimalist Desk Lamp',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    category: 'Home & Office',
    brand: 'LightCraft',
    rating: 4.4,
    stock: 3,
    description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
    ]
  },
  {
    id: '8',
    name: 'Portable Bluetooth Speaker',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Electronics',
    brand: 'SoundWave',
    rating: 4.7,
    stock: 18,
    description: 'Compact Bluetooth speaker with powerful bass and waterproof design.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'
    ]
  }
];

export const categories = [
  { name: 'Electronics', count: 156, image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop' },
  { name: 'Clothing', count: 89, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop' },
  { name: 'Home & Kitchen', count: 234, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop' },
  { name: 'Fitness', count: 67, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' },
  { name: 'Gaming', count: 45, image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop' },
  { name: 'Home & Office', count: 123, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop' }
];

export const brands = [
  'AudioTech',
  'FitGear',
  'GamePro',
  'EcoWear',
  'BrewMaster',
  'ChargeTech',
  'LightCraft',
  'SoundWave'
];