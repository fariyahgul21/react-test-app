import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import AppRoutes from '@/routes/AppRoutes';

// App = providers + router. Keep this file thin; pages live in src/pages.
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
