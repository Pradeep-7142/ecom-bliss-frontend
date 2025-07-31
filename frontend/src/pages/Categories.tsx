import React from 'react';
import { ArrowRight, Smartphone, Shirt, Book, Home, Zap, Palette, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useProducts';

const Categories = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading, error } = useCategories();

  // Default categories with icons for fallback
  const defaultCategories = [
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
      productCount: 678,
      subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Tools'],
      featured: false
    }
  ];

  // Use API data if available, otherwise fall back to default categories
  const displayCategories = categories?.length > 0 ? categories.map(cat => ({
    id: cat._id,
    name: cat.name,
    description: cat.description || 'Explore amazing products',
    icon: Smartphone, // Default icon
    image: cat.image || '/placeholder.svg',
    productCount: cat.productCount || 0,
    subcategories: [], // API doesn't provide subcategories yet
    featured: cat.productCount > 100 // Consider featured if more than 100 products
  })) : defaultCategories;

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover products organized by categories. Find exactly what you're looking for with our comprehensive selection.
          </p>
        </div>

        {/* Featured Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              // Error state
              <div className="text-center py-12">
                <p className="text-muted-foreground">Failed to load categories</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              // Categories grid
              displayCategories
                .filter(category => category.featured)
                .map((category) => (
                  <Card 
                    key={category.id} 
                    className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">
                          {category.productCount} items
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-white/90 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              // Loading skeleton for all categories
              Array.from({ length: 12 }).map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              displayCategories.map((category) => (
                <Card 
                  key={category.id} 
                  className="p-4 hover:shadow-medium transition-shadow cursor-pointer"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <category.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {category.productCount} products
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Category Details (if subcategories are available) */}
        {displayCategories.some(cat => cat.subcategories.length > 0) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Subcategory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCategories
                .filter(category => category.subcategories.length > 0)
                .map((category) => (
                  <Card key={category.id} className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                        <category.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.productCount} products</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {category.subcategories.map((subcategory, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`)}
                        >
                          {subcategory}
                          <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;