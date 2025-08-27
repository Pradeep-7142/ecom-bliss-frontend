import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart, Product } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">
              Start adding products to your wishlist to save them for later.
            </p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>
          <Button variant="outline" onClick={handleClearWishlist}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Wishlist
          </Button>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="relative mb-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Remove from wishlist button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>

                  {/* Discount badge */}
                  {product.discount && product.discount > 0 && (
                    <Badge variant="destructive" className="absolute top-2 left-2">
                      -{product.discount}%
                    </Badge>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {product.brand} • {product.category}
                  </p>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center space-x-2">
                    {product.stock > 0 ? (
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        In Stock ({product.stock})
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 