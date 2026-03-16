import { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { searchAPI } from '@/services/api';
import type { SearchParams, Product } from '@/services/api';
import { Badge } from '@/components/ui/badge';

interface ProductSearchFilterProps {
  onResultsChange: (products: Product[], total: number) => void;
}

const ProductSearchFilter = ({ onResultsChange }: ProductSearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [productType, setProductType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    performSearch();
  }, [searchQuery, productType, minPrice, maxPrice, sortBy, sortOrder]);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (productType) count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    setActiveFilters(count);
  }, [productType, minPrice, maxPrice]);

  const performSearch = async () => {
    try {
      setLoading(true);
      
      const params: SearchParams = {
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (searchQuery) params.q = searchQuery;
      if (productType) params.product_type = productType;
      if (minPrice) params.min_price = parseFloat(minPrice);
      if (maxPrice) params.max_price = parseFloat(maxPrice);

      const results = await searchAPI.searchProducts(params);
      onResultsChange(results.products, results.total);
    } catch (error) {
      console.error('Search failed:', error);
      onResultsChange([], 0);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setProductType('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasAnyFilters = searchQuery || productType || minPrice || maxPrice;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 cyber-input"
          />
          {searchQuery && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Sheet (Mobile) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilters > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant="default">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
              <SheetDescription>
                Refine your search with filters
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="sop">SOP</SelectItem>
                    <SelectItem value="toolkit">Toolkit</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {hasAnyFilters && (
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort Select */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="created_at">Date Added</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:flex items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Product Type</Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All types</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="sop">SOP</SelectItem>
                <SelectItem value="toolkit">Toolkit</SelectItem>
                <SelectItem value="checklist">Checklist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Min Price</Label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Max Price</Label>
            <Input
              type="number"
              placeholder="No limit"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {hasAnyFilters && (
          <Button onClick={clearFilters} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasAnyFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}
          {productType && (
            <Badge variant="secondary" className="gap-1">
              Type: {productType}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setProductType('')}
              />
            </Badge>
          )}
          {minPrice && (
            <Badge variant="secondary" className="gap-1">
              Min: ${minPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setMinPrice('')}
              />
            </Badge>
          )}
          {maxPrice && (
            <Badge variant="secondary" className="gap-1">
              Max: ${maxPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setMaxPrice('')}
              />
            </Badge>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default ProductSearchFilter;
