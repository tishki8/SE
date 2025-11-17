import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {orderId && (
            <p className="text-lg font-semibold mb-8">
              Order ID: <span className="text-primary">{orderId}</span>
            </p>
          )}

          <div className="bg-muted p-6 rounded-lg mb-8">
            <h2 className="font-semibold mb-2">What's Next?</h2>
            <p className="text-sm text-muted-foreground">
              You will receive a confirmation email shortly. You can track your order from the Orders page.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/orders')} size="lg">
              View Orders
            </Button>
            <Button onClick={() => navigate('/products')} variant="outline" size="lg">
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
