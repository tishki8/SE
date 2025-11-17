import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Signup page auto-redirects to home
export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}
