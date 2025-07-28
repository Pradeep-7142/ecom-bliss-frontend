import React from 'react';
import { ArrowRight, Smartphone, Shirt, Book, Home, Zap, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      description: 'Latest gadgets and technology',
      icon: Smartphone,
      image: '/placeholder.svg',
      productCount: 1234,
      subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Headphones'],
      featured: true
    },
    {
      id: 'clothing',
      name: 'Fashion & Clothing',
      description: 'Trendy clothes for all occasions',
      icon: Shirt,
      image: '/placeholder.svg',
      productCount: 892,
      subcategories: ['Men\'s Wear', 'Women\'s Wear', 'Kids\' Wear', 'Shoes', 'Accessories'],
      featured: true
    },
    {
      id: 'books',
      name: 'Books & Media',
      description: 'Expand your knowledge',
      icon: Book,
      image: '/placeholder.svg',
      productCount: 567,
      subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'E-books'],
      featured: false
    },
    {
      id: 'home',
      name: 'Home & Kitchen',
      description: 'Everything for your home',
      icon: Home,
      image: '/placeholder.svg',
      productCount: 743,
      subcategories: ['Furniture', 'Kitchen Appliances', 'Decor', 'Bedding', 'Storage'],
      featured: true
    },
    {
      id: 'sports',
      name: 'Sports & Fitness',
      description: 'Stay active and healthy',
      icon: Zap,
      image: '/placeholder.svg',
      productCount: 456,
      subcategories: ['Gym Equipment', 'Outdoor Sports', 'Yoga & Fitness', 'Team Sports', 'Running'],
      featured: false
    },
    {
      id: 'beauty',
      name: 'Beauty & Personal Care',
      description: 'Look and feel your best',
      icon: Palette,
      image: '/placeholder.svg',
      productCount: 324,
      subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Personal Hygiene'],
      featured: false
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  const featuredCategories = categories.filter(cat => cat.featured);
  const otherCategories = categories.filter(cat => !cat.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products organized by categories to help you find exactly what you're looking for.
          </p>
        </div>

        {/* Featured Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Categories</h2>
            <Badge variant="secondary">Most Popular</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center mb-2">
                        <IconComponent className="h-8 w-8 mr-3" />
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {category.productCount.toLocaleString()} products
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Popular in this category:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <Badge key={sub} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {category.subcategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.subcategories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-8">All Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {category.productCount.toLocaleString()} products available
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories.slice(0, 4).map((sub) => (
                          <Badge key={sub} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Use our advanced search to find products across all categories, or contact our support team for assistance.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/products')}>
                  Browse All Products
                </Button>
                <Button variant="outline">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Categories;