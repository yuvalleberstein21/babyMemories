import LoginForm from '@/components/LoginForm';
import { auth } from '@/firebase';
import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log('משתמש מחובר:', user.email, user.uid);
    }
  }, []);
  return <LoginForm />;
};

export default Login;
