import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProduct } from '@/hooks/useProducts';
import { Product } from '@/contexts/CartContext';
import { Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InventoryManagementProps {
  products: Product[];
}

const InventoryManagement = ({ products }: InventoryManagementProps) => {
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({});
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const { toast } = useToast();
  const updateProduct = useUpdateProduct();

  const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const handleStockChange = (productId: string, newStock: number) => {
    setEditingStock(prev => ({
      ...prev,
      [productId]: Math.max(0, newStock)
    }));
  };

  const saveStockChange = async (product: Product) => {
    const newStock = editingStock[product.id];
    if (newStock === undefined || newStock === product.stock) return;

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: { stock: newStock }
      });

      toast({
        title: "Stock updated",
        description: `${product.name} stock updated to ${newStock}`,
      });

      // Remove from editing state
      setEditingStock(prev => {
        const newState = { ...prev };
        delete newState[product.id];
        return newState;
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: { isActive: !product.isActive }
      });

      toast({
        title: "Status updated",
        description: `${product.name} is now ${product.isActive ? 'inactive' : 'active'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.stock > 0).length}
              </div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{lowStockProducts.length} products</strong> have low stock (≤{lowStockThreshold} items).
            Consider restocking these items.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stock Management */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stock Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="threshold">Low Stock Threshold:</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>

            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Current Stock</div>
                      <div className="font-medium">{product.stock}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={editingStock[product.id] ?? product.stock}
                        onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      {editingStock[product.id] !== undefined && editingStock[product.id] !== product.stock && (
                        <Button 
                          size="sm" 
                          onClick={() => saveStockChange(product)}
                          disabled={updateProduct.isPending}
                        >
                          Save
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant={product.stock === 0 ? "destructive" : product.stock <= lowStockThreshold ? "secondary" : "default"}
                      >
                        {product.stock === 0 ? "Out of Stock" : product.stock <= lowStockThreshold ? "Low Stock" : "In Stock"}
                      </Badge>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleProductStatus(product)}
                        disabled={updateProduct.isPending}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement; 