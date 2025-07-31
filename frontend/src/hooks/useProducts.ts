import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '@/services/api';
import { Product } from '@/contexts/CartContext';

// Get all products with filters
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productAPI.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get featured products
export const useFeaturedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: () => productAPI.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search products
export const useSearchProducts = (query: string, page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['search-products', query, page, limit],
    queryFn: () => productAPI.searchProducts(query, page, limit),
    enabled: !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get products by category
export const useProductsByCategory = (category: string, params = {}) => {
  return useQuery({
    queryKey: ['products-by-category', category, params],
    queryFn: () => productAPI.getProductsByCategory(category, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get brands
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => productAPI.getBrands(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData: Partial<Product>) => productAPI.createProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      productAPI.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productAPI.deleteProduct(id),
    onSuccess: () => {
      // Invalidate products queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
  });
}; 