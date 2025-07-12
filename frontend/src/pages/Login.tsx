import LoginForm from '@/components/auth/LoginForm';
import { Loader } from '@/components/ui/Loader';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/baby-tracker');
      } else {
        setIsCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isCheckingAuth) {
    return <Loader />;
  }

  return <LoginForm />;
};

export default Login;
