import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card className={`group relative overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button size="sm" variant="secondary" onClick={handleAddToCart} disabled={isOutOfStock}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/product/${product.id}`;
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Wishlist button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>

          {/* Stock badges */}
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" className="absolute top-2 left-2">
              Low Stock
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category and brand */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="bg-secondary px-2 py-1 rounded-full">{product.category}</span>
            <span>{product.brand}</span>
          </div>

          {/* Product name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
              {product.stock > 0 && (
                <div className="text-xs text-muted-foreground">
                  {product.stock} in stock
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export { ProductCard };
export default ProductCard;