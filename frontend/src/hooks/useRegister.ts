import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '@/services/AuthService';
import { firebaseAuthErrors } from '@/utils/firebaseErrors';
import { User } from 'firebase/auth';

export const useRegister = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user: User = await register(fullName, email, password);
      if (user) {
        toast.success('נרשמת בהצלחה!');
        navigate('/');
      }
    } catch (err: any) {
      const message = firebaseAuthErrors[err.code] || 'אירעה שגיאה, נסה שוב';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleRegister,
  };
};
