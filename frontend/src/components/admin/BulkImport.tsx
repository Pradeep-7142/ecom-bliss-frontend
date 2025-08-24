import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCreateProduct, useCategories, useBrands } from '@/hooks/useProducts';
import { Download, Upload, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BulkImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const downloadTemplate = () => {
    const categoryNames = categories?.map(cat => cat.name).join(', ') || 'Electronics, Clothing, Home & Kitchen, Fitness, Gaming, Home & Office';
    const brandNames = brands?.map(brand => brand.name).join(', ') || 'AudioTech, FitGear, GamePro, EcoWear, BrewMaster, ChargeTech, LightCraft, SoundWave';
    
    const csvContent = `name,price,originalPrice,discount,description,image,images,category,brand,rating,stock
"Wireless Headphones",199.99,249.99,20,"Premium wireless headphones","https://example.com/image1.jpg","https://example.com/image2.jpg,https://example.com/image3.jpg","Electronics","AudioTech",4.5,15
"Smart Watch",299.99,399.99,25,"Advanced smartwatch","https://example.com/watch.jpg","https://example.com/watch2.jpg","Electronics","FitGear",4.8,10

Available categories: ${categoryNames}
Available brands: ${brandNames}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv') {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      setPreview(data);
    };
    reader.readAsText(file);
  };

  const validateProduct = (product: any) => {
    const errors: string[] = [];
    
    if (!product.name) errors.push('Name is required');
    if (!product.price || isNaN(parseFloat(product.price))) errors.push('Valid price is required');
    if (!product.category) errors.push('Category is required');
    if (!product.brand) errors.push('Brand is required');
    if (!product.stock || isNaN(parseInt(product.stock))) errors.push('Valid stock quantity is required');
    if (!product.image) errors.push('Image URL is required');
    
    // Validate category exists in database
    if (product.category && categories) {
      const categoryExists = categories.some(cat => cat.name.toLowerCase() === product.category.toLowerCase());
      if (!categoryExists) {
        errors.push(`Category "${product.category}" not found. Available: ${categories.map(cat => cat.name).join(', ')}`);
      }
    }
    
    // Validate brand exists in database
    if (product.brand && brands) {
      const brandExists = brands.some(brand => brand.name.toLowerCase() === product.brand.toLowerCase());
      if (!brandExists) {
        errors.push(`Brand "${product.brand}" not found. Available: ${brands.map(brand => brand.name).join(', ')}`);
      }
    }
    
    return errors;
  };

  const processProducts = async () => {
    if (!preview.length) return;

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const product of preview) {
      const errors = validateProduct(product);
      
      if (errors.length > 0) {
        errorCount++;
        console.error(`Product "${product.name}" has errors:`, errors);
        continue;
      }

      try {
        const productData = {
          name: product.name,
          price: parseFloat(product.price),
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
          discount: product.discount ? parseFloat(product.discount) : undefined,
          description: product.description || '',
          image: product.image,
          images: product.images ? product.images.split(',').map((url: string) => url.trim()) : [],
          category: product.category,
          brand: product.brand,
          rating: product.rating ? parseFloat(product.rating) : 0,
          stock: parseInt(product.stock),
          isActive: true
        };

        await createProduct.mutateAsync(productData);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to create product "${product.name}":`, error);
      }
    }

    setIsProcessing(false);
    
    toast({
      title: "Bulk import completed",
      description: `Successfully imported ${successCount} products. ${errorCount} failed.`,
      variant: errorCount > 0 ? "destructive" : "default",
    });

    // Reset form
    setFile(null);
    setPreview([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Import Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload a CSV file to add multiple products at once. Download the template below for the correct format.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">Upload CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </div>

        {preview.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Preview ({preview.length} products)
              </h3>
              <Button 
                onClick={processProducts} 
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Import Products'}
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Brand</th>
                    <th className="p-2 text-left">Stock</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((product, index) => {
                    const errors = validateProduct(product);
                    return (
                      <tr key={index} className="border-t">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">${product.price}</td>
                        <td className="p-2">{product.category}</td>
                        <td className="p-2">{product.brand}</td>
                        <td className="p-2">{product.stock}</td>
                        <td className="p-2">
                          {errors.length > 0 ? (
                            <span className="text-red-500 text-xs">
                              {errors.length} error(s)
                            </span>
                          ) : (
                            <span className="text-green-500 text-xs">Valid</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkImport; 