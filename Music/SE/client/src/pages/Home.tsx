import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '@/lib/api';
import { ShoppingBag, TrendingUp, Award, Truck } from 'lucide-react';

const categories = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
];

const features = [
  { icon: Truck, title: 'Free Delivery', description: 'On orders above ₹500' },
  { icon: Award, title: 'Best Quality', description: 'Assured products' },
  { icon: TrendingUp, title: 'Great Offers', description: 'Unbeatable prices' },
  { icon: ShoppingBag, title: 'Easy Returns', description: '7-day return policy' },
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/api/products?limit=6');
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple via-primary to-pink text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Welcome to EasyKart
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 drop-shadow">
              Your one-stop shop for everything you need
            </p>
            <Button
              onClick={() => navigate('/products')}
              size="lg"
              className="text-lg px-8 bg-white text-purple hover:bg-pink hover:text-white transition-all shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b bg-gradient-to-br from-purple-light/10 to-pink-light/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-block p-4 rounded-full mb-3 ${
                  index % 2 === 0 ? 'bg-purple/10' : 'bg-pink/10'
                } group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-10 w-10 ${
                    index % 2 === 0 ? 'text-purple' : 'text-pink'
                  }`} />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gradient-to-br from-pink-light/5 to-purple-light/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card
                key={category.name}
                className={`cursor-pointer overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 border-2 ${
                  index % 2 === 0 ? 'hover:border-purple' : 'hover:border-pink'
                }`}
                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className={`p-3 text-center ${
                  index % 2 === 0 ? 'bg-purple/5' : 'bg-pink/5'
                }`}>
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 EasyKart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
