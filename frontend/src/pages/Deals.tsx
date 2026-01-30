import React, { useState, useEffect } from 'react';
import { Clock, Zap, Flame, Gift, Tag, Timer, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';

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

  // Get products for different deal categories
  const { data: flashSaleProducts, isLoading: flashSaleLoading } = useProducts({ limit: 4 });
  const { data: dailyDealsProducts, isLoading: dailyDealsLoading } = useProducts({ limit: 4, sortBy: 'rating', sortOrder: 'desc' });
  const { data: clearanceProducts, isLoading: clearanceLoading } = useProducts({ limit: 4, sortBy: 'price', sortOrder: 'asc' });
  const { data: bundleProducts, isLoading: bundleLoading } = useProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });

  const dealCategories = [
    {
      id: 'flash-sale',
      title: 'Flash Sale',
      subtitle: 'Limited time offers',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-500',
      products: flashSaleProducts?.products || [],
      isLoading: flashSaleLoading,
      discount: '50-80%',
      timeLimit: true
    },
    {
      id: 'daily-deals',
      title: 'Deal of the Day',
      subtitle: 'Best prices today',
      icon: Flame,
      gradient: 'from-red-500 to-pink-500',
      products: dailyDealsProducts?.products || [],
      isLoading: dailyDealsLoading,
      discount: '30-60%',
      timeLimit: false
    },
    {
      id: 'clearance',
      title: 'Clearance Sale',
      subtitle: 'Final markdowns',
      icon: Tag,
      gradient: 'from-purple-500 to-indigo-500',
      products: clearanceProducts?.products || [],
      isLoading: clearanceLoading,
      discount: '20-40%',
      timeLimit: false
    },
    {
      id: 'bundle-deals',
      title: 'Bundle Offers',
      subtitle: 'Buy more, save more',
      icon: Gift,
      gradient: 'from-green-500 to-teal-500',
      products: bundleProducts?.products || [],
      isLoading: bundleLoading,
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
          <h1 className="text-4xl font-bold mb-4">Today's Deals</h1>
          <p className="text-xl text-muted-foreground">Don't miss out on these amazing offers!</p>
        </div>

        {/* Flash Sale Banner */}
        <Card className="mb-12 bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Flash Sale</h2>
                <p className="text-lg opacity-90">Limited time offers ending soon!</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Time Remaining</div>
                <div className="flex gap-2">
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-sm">Hours</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-sm">Minutes</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-sm">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Categories */}
        <div className="space-y-12">
          {dealCategories.map((category) => {
            const Icon = category.icon;
            return (
              <section key={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <p className="text-muted-foreground">{category.subtitle}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {category.discount}
                  </Badge>
                </div>

                {category.isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : category.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products available in this category</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Featured Deals */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredDeals.map((deal, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="text-sm">
                      {Math.round(((deal.originalPrice - deal.salePrice) / deal.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
                  <p className="text-muted-foreground mb-4">{deal.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-green-600">${deal.salePrice}</span>
                    <span className="text-lg text-muted-foreground line-through">${deal.originalPrice}</span>
                    <span className="text-sm text-green-600">Save ${deal.saved}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stock: {deal.stock}/{deal.totalStock}</span>
                      <span>{Math.round((deal.stock / deal.totalStock) * 100)}%</span>
                    </div>
                    <Progress value={(deal.stock / deal.totalStock) * 100} className="h-2" />
                  </div>
                  
                  <Button className="w-full">Shop Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Deals;