require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

// Sample categories
const categories = [
  {
    name: 'Electronics',
    description: 'Latest gadgets and technology',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop',
    productCount: 156
  },
  {
    name: 'Clothing',
    description: 'Trendy clothes for all occasions',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
    productCount: 89
  },
  {
    name: 'Home & Kitchen',
    description: 'Everything for your home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    productCount: 234
  },
  {
    name: 'Fitness',
    description: 'Stay active and healthy',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    productCount: 67
  },
  {
    name: 'Gaming',
    description: 'Gaming equipment and accessories',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop',
    productCount: 45
  },
  {
    name: 'Home & Office',
    description: 'Office supplies and furniture',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop',
    productCount: 123
  }
];

// Sample brands
const brands = [
  {
    name: 'AudioTech',
    description: 'Premium audio equipment',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
    productCount: 25
  },
  {
    name: 'FitGear',
    description: 'Fitness and sports equipment',
    logo: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=100&h=100&fit=crop',
    productCount: 18
  },
  {
    name: 'GamePro',
    description: 'Professional gaming gear',
    logo: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop',
    productCount: 32
  },
  {
    name: 'EcoWear',
    description: 'Sustainable fashion',
    logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    productCount: 15
  },
  {
    name: 'BrewMaster',
    description: 'Kitchen appliances',
    logo: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop',
    productCount: 28
  },
  {
    name: 'ChargeTech',
    description: 'Charging solutions',
    logo: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop',
    productCount: 12
  },
  {
    name: 'LightCraft',
    description: 'Lighting solutions',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    productCount: 8
  },
  {
    name: 'SoundWave',
    description: 'Audio and speakers',
    logo: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
    productCount: 22
  }
];

// Sample products
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
    ],
    category: 'Electronics',
    brand: 'AudioTech',
    rating: 4.5,
    stock: 15
  },
  {
    name: 'Smart Fitness Tracker',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    description: 'Advanced fitness tracker with heart rate monitor and GPS tracking.',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop'
    ],
    category: 'Fitness',
    brand: 'FitGear',
    rating: 4.3,
    stock: 8
  },
  {
    name: 'Professional Gaming Mouse',
    price: 79.99,
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop'
    ],
    category: 'Gaming',
    brand: 'GamePro',
    rating: 4.8,
    stock: 0
  },
  {
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    description: 'Comfortable organic cotton t-shirt available in multiple colors and sizes.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'
    ],
    category: 'Clothing',
    brand: 'EcoWear',
    rating: 4.2,
    stock: 25
  },
  {
    name: 'Premium Coffee Maker',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    description: 'Professional-grade coffee maker with multiple brewing options and temperature control.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop'
    ],
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    rating: 4.6,
    stock: 12
  },
  {
    name: 'Wireless Charging Pad',
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop'
    ],
    category: 'Electronics',
    brand: 'ChargeTech',
    rating: 4.1,
    stock: 20
  },
  {
    name: 'Minimalist Desk Lamp',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
    ],
    category: 'Home & Office',
    brand: 'LightCraft',
    rating: 4.4,
    stock: 3
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
    description: 'Compact Bluetooth speaker with powerful bass and waterproof design.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'
    ],
    category: 'Electronics',
    brand: 'SoundWave',
    rating: 4.7,
    stock: 18
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully!');
    
    try {
      // Clear existing data
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Brand.deleteMany({});
      
      console.log('🗑️  Cleared existing data');
      
      // Insert categories
      const createdCategories = await Category.insertMany(categories);
      console.log(`✅ Inserted ${createdCategories.length} categories`);
      
      // Insert brands
      const createdBrands = await Brand.insertMany(brands);
      console.log(`✅ Inserted ${createdBrands.length} brands`);
      
      // Insert products
      const createdProducts = await Product.insertMany(products);
      console.log(`✅ Inserted ${createdProducts.length} products`);
      
      console.log('🎉 Database seeded successfully!');
      console.log(`📊 Total: ${createdCategories.length} categories, ${createdBrands.length} brands, ${createdProducts.length} products`);
      
    } catch (error) {
      console.error('❌ Error seeding database:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  }); 