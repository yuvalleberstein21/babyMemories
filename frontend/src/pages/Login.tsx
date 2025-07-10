import LoginForm from '@/components/LoginForm';
import { auth } from '@/firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      navigate('/baby-tracker');
    }
  }, []);
  return <LoginForm />;
};

export default Login;
