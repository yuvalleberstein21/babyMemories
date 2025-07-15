import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '@/services/AuthService';
import { firebaseAuthErrors } from '@/utils/firebaseErrors';

export const useRegister = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await register(email, password, fullName);
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
