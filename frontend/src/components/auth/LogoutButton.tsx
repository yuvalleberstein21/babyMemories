import { auth } from '@/firebase';
import { logout } from '@/services/AuthService';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('שגיאה בהתנתקות:', error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <button
      className="w-32 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
      onClick={handleLogout}
    >
      התנתקות
    </button>
  );
};

export default LogoutButton;
