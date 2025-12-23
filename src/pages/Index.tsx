import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const defaultRoute = user?.role === 'agent' ? '/dashboard' : '/marketplace';
  return <Navigate to={defaultRoute} replace />;
};

export default Index;
