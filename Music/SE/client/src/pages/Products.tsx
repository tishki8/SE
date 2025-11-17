import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '@/lib/api';
import { Filter } from 'lucide-react';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books'];

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  rating?: number;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
 // FIX (previously /api/products)

        const params: string[] = [];

        if (selectedCategory && selectedCategory !== 'All') {
          params.push(`category=${encodeURIComponent(selectedCategory)}`);
        }

        const search = searchParams.get('search');
        if (search) {
          params.push(`search=${encodeURIComponent(search)}`);
        }

        if (params.length > 0) {
          url += '?' + params.join('&');
        }

        const response = await api.get(url);

        // FIX: map backend DB fields to frontend Product interface
        setProducts(
          (response.data || []).map((p: any) => ({
            id: p.uniq_id,
            name: p.product_name,
            price: p.discounted_price,
            image: p.image ? (() => {
              try {
                return JSON.parse(p.image)[0]; // first image
              } catch {
                return null;
              }
            })() : null,
            category: p.main_category,
            rating: p.product_rating || 0
          }))
        );
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <Card className={`md:w-64 p-4 h-fit ${showFilters ? 'block' : 'hidden md:block'}`}>
            <h2 className="font-semibold mb-4 text-lg">Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </Card>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse bg-muted" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
