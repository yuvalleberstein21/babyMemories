import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '@/services/AuthService';
import { firebaseAuthErrors } from '@/utils/firebaseErrors';
import { FirebaseError } from 'firebase/app';

export const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      if (user) {
        const name = user.displayName || 'משתמש';
        toast.success(`ברוך הבא, ${name} 👋`);
        navigate('/baby-setup');
      }
    } catch (err: unknown) {
      const error = err as FirebaseError;
      const message = firebaseAuthErrors[error.code] || 'אירעה שגיאה, נסה שוב';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  };
};
