import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
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
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button variant="outline" onClick={handleClearCart}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.product.brand} • {item.product.category}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">
                              ₹{item.product.price.toLocaleString()}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Badge variant="secondary" className="px-3 py-1">
                            {item.quantity}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.product.stock && (
                        <p className="text-sm text-amber-600 mt-2">
                          Maximum available quantity reached
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">₹{getTotalPrice().toLocaleString()}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>

                {/* Continue Shopping */}
                <Button variant="outline" asChild className="w-full">
                  <Link to="/products">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 