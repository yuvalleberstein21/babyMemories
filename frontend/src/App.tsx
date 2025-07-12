import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import BabySetup from './pages/BabySetup';
import Register from './pages/Register';
import { AuthRedirector } from './components/auth/AuthRedirector';
import { Header } from './components/layout/Header';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<AuthRedirector />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/baby-setup" element={<BabySetup />} />
          <Route path="/baby-tracker" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
