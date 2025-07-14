import { auth } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from '../ui/Loader';

type Props = {
  children: ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) return <Loader />;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
};
