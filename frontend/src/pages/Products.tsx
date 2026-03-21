import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductSearchFilter from '@/components/ProductSearchFilter';
import type { Product } from '@/services/api';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();

  const handleResultsChange = (newProducts: Product[], total: number) => {
    setProducts(newProducts);
    setTotalProducts(total);
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return '🛡️';
      case 'template':
        return '📄';
      case 'toolkit':
        return '🧰';
      case 'sop':
        return '📋';
      case 'checklist':
        return '✅';
      default:
        return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl sm:text-2xl font-bold text-primary">GRC Products</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Professional GRC Templates & Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive compliance frameworks, policy templates, and risk management tools
            to help secure your organization.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <ProductSearchFilter onResultsChange={handleResultsChange} />
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {totalProducts === 0
              ? 'No products found'
              : `Showing ${products.length} of ${totalProducts} ${totalProducts === 1 ? 'product' : 'products'}`}
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="cyber-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="cyber-card group hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{getProductIcon(product.product_type)}</span>
                      <Badge variant="outline" className="capitalize">
                        {product.product_type}
                      </Badge>
                    </div>
                    {product.is_featured && (
                      <Badge className="bg-accent">Featured</Badge>
                    )}
                  </div>

                  {/* Product Image */}
                  {product.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-muted/30">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Product Info */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.short_description || product.description}
                  </p>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          ${product.original_price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Get Now
                    </Button>
                  </div>

                  {/* Stats */}
                  {(product.rating || product.download_count > 0) && (
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          <span>{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {product.download_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{product.download_count} downloads</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Chaitanya Vichare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
