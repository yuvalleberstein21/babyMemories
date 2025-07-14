import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import BabySetup from './pages/BabySetup';
import Register from './pages/Register';
import { AuthRedirector } from './components/auth/AuthRedirector';
import { Header } from './components/layout/Header';
import { PrivateRoute } from './components/auth/PrivateRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<AuthRedirector />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/baby-setup"
            element={
              <PrivateRoute>
                <BabySetup />
              </PrivateRoute>
            }
          />
          <Route
            path="/baby-tracker"
            element={
              <PrivateRoute>
                <Index />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
