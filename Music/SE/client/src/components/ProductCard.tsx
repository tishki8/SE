import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  price?: number | null;
  image?: string | null;
  category?: string;
  rating?: number | null;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating
}: ProductCardProps) {
  const { addToCart } = useCart();

  // Prevent crash: calculate display price safely
  const displayPrice = price ?? null;
  const priceText = displayPrice ? `₹${displayPrice.toLocaleString()}` : "Price Unavailable";

  // Handle missing images gracefully
  const productImage =
    image && image !== "" ? image : "/placeholder-product.png";

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border hover:border-pink/50">
      <Link to={`/products/${id}`}>
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-light/10 to-pink-light/10 relative">
          <img
            src={productImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </Link>

      <div className="p-4 space-y-2">
        {category && (
          <p className="text-xs font-semibold uppercase tracking-wide bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
            {category}
          </p>
        )}

        <Link to={`/products/${id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 hover:bg-gradient-to-r hover:from-purple hover:to-pink hover:bg-clip-text hover:text-transparent transition-all">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div>
           <p className="text-2xl font-bold bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
  {price ? `₹${Number(price).toLocaleString()}` : "Price Unavailable"}
</p>

            {rating ? (
              <div className="flex items-center mt-1">
                <span className="text-sm font-semibold text-success bg-success/10 px-2 py-0.5 rounded">
                  {rating} ★
                </span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">No ratings</p>
            )}
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            addToCart(id);
          }}
          className="w-full mt-2 bg-gradient-to-r from-purple to-pink hover:from-purple-dark hover:to-pink-dark transition-all shadow-md hover:shadow-lg"
          variant="default"
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
