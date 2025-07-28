import React, { useState, useEffect } from 'react';
import { Clock, Zap, Flame, Gift, Tag, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockProducts';

const Deals = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Flash Sale Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealCategories = [
    {
      id: 'flash-sale',
      title: 'Flash Sale',
      subtitle: 'Limited time offers',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-500',
      products: mockProducts.slice(0, 4),
      discount: '50-80%',
      timeLimit: true
    },
    {
      id: 'daily-deals',
      title: 'Deal of the Day',
      subtitle: 'Best prices today',
      icon: Flame,
      gradient: 'from-red-500 to-pink-500',
      products: mockProducts.slice(4, 8),
      discount: '30-60%',
      timeLimit: false
    },
    {
      id: 'clearance',
      title: 'Clearance Sale',
      subtitle: 'Final markdowns',
      icon: Tag,
      gradient: 'from-purple-500 to-indigo-500',
      products: mockProducts.slice(8, 12),
      discount: '20-40%',
      timeLimit: false
    },
    {
      id: 'bundle-deals',
      title: 'Bundle Offers',
      subtitle: 'Buy more, save more',
      icon: Gift,
      gradient: 'from-green-500 to-teal-500',
      products: mockProducts.slice(12, 16),
      discount: 'Up to 25%',
      timeLimit: false
    }
  ];

  const featuredDeals = [
    {
      title: 'Electronics Mega Sale',
      description: 'Up to 70% off on latest gadgets',
      image: '/placeholder.svg',
      originalPrice: 999,
      salePrice: 299,
      saved: 700,
      stock: 23,
      totalStock: 100
    },
    {
      title: 'Fashion Week Special',
      description: 'Designer clothes at unbeatable prices',
      image: '/placeholder.svg',
      originalPrice: 299,
      salePrice: 99,
      saved: 200,
      stock: 45,
      totalStock: 80
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Amazing Deals & Offers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on our incredible deals and limited-time offers. Save big on your favorite products!
          </p>
        </div>

        {/* Flash Sale Banner */}
        <Card className="mb-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Zap className="h-8 w-8 mr-3" />
                  <h2 className="text-3xl font-bold">Flash Sale</h2>
                </div>
                <p className="text-lg opacity-90 mb-4">Up to 80% off - Limited time only!</p>
                <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
                  Shop Flash Sale
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm opacity-90 mb-2">Sale ends in:</p>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs">HOURS</div>
                  </div>
                  <div className="text-2xl">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs">MINS</div>
                  </div>
                  <div className="text-2xl">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs">SECS</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
          </CardContent>
        </Card>

        {/* Featured Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Deals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredDeals.map((deal, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex">
                  <div className="w-1/3">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{deal.title}</h3>
                        <p className="text-sm text-muted-foreground">{deal.description}</p>
                      </div>
                      <Badge variant="destructive">
                        Save ${deal.saved}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl font-bold text-primary">${deal.salePrice}</span>
                      <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                      <Badge variant="secondary">
                        {Math.round(((deal.originalPrice - deal.salePrice) / deal.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock remaining</span>
                        <span>{deal.stock} left</span>
                      </div>
                      <Progress value={(deal.stock / deal.totalStock) * 100} className="h-2" />
                    </div>
                    
                    <Button className="w-full">
                      Grab Deal Now
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Deal Categories */}
        {dealCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.id} className="mb-12">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.gradient} flex items-center justify-center mr-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center">
                          {category.title}
                          {category.timeLimit && (
                            <Timer className="ml-2 h-4 w-4 text-muted-foreground" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{category.subtitle}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-lg font-semibold">
                      {category.discount} OFF
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      originalPrice: product.price,
                      price: product.price * 0.7, // Apply discount
                      discount: 30
                    }}
                  />
                ))}
              </div>

              {category.products.length > 4 && (
                <div className="text-center mt-6">
                  <Button variant="outline" size="lg">
                    View All {category.title}
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Never Miss a Deal!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Subscribe to our newsletter and be the first to know about flash sales, exclusive offers, and new arrivals.
            </p>
            <div className="flex max-w-sm mx-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deals;