// hooks/useBabies.ts
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export function useBabies() {
  const [babies, setBabies] = useState<
    { id: string; name: string; birthDate: string }[]
  >([]);
  const [selectedBabyId, setSelectedBabyId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }

      const babiesRef = collection(db, 'users', user.uid, 'babies');

      try {
        const snap = await getDocs(babiesRef);
        if (snap.empty) {
          navigate('/baby-setup');
          return;
        }

        const babyList = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { name: string; birthDate: string }),
        }));

        setBabies(babyList);
        setSelectedBabyId(babyList[0].id);
      } catch (err) {
        console.error('שגיאה בשליפת תינוקות:', err);
        toast.error('שגיאה בהצגת תינוקות');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAddBaby = async (babyName: string, birthDate: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('לא מחובר');
      return;
    }

    try {
      const docRef = await toast.promise(
        addDoc(collection(db, 'users', user.uid, 'babies'), {
          name: babyName,
          birthDate,
          createdAt: serverTimestamp(),
        }),
        {
          loading: 'מוסיף תינוק...',
          success: 'תינוק נוסף בהצלחה!',
          error: 'שגיאה בהוספה',
        }
      );

      const newBaby = { id: docRef.id, name: babyName, birthDate };
      setBabies((prev) => [...prev, newBaby]);
      setSelectedBabyId(newBaby.id);
    } catch (err) {
      console.error('שגיאה בהוספה:', err);
      toast.error('שגיאה בהוספה תינוק');
    }
  };

  return {
    babies,
    selectedBabyId,
    setSelectedBabyId,
    handleAddBaby,
    selectedBaby: babies.find((b) => b.id === selectedBabyId),
  };
}
