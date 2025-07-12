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
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserExists(false);
        setChecking(false);
        return;
      }

      const babiesRef = collection(db, 'users', user.uid, 'babies');
      const snap = await getDocs(babiesRef);

      if (snap.empty) {
        navigate('/baby-setup');
      } else {
        navigate('/baby-tracker');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checking) return <Loader />;
  return <LoginForm />;
};
