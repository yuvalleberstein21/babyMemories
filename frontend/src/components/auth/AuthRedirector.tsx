import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../ui/Loader';
import LoginForm from '@/components/auth/LoginForm';

export const AuthRedirector = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkBabies = async () => {
      if (!user) return;

      const babiesRef = collection(db, 'users', user.uid, 'babies');
      const snap = await getDocs(babiesRef);

      if (snap.empty) {
        navigate('/baby-setup');
      } else {
        navigate('/baby-tracker');
      }
    };

    if (user) {
      checkBabies();
    }
  }, [user, navigate]);

  if (checking) return <Loader />;
  if (!user) return <LoginForm />;

  return null;
};
