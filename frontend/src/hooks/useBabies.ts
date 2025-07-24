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
import { Baby } from '@/types/baby';

export function useBabies() {
  const [babies, setBabies] = useState<Baby[]>([]);
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

        const babyList: Baby[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Baby, 'id'>),
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
      const newBabyData: Omit<Baby, 'id'> = {
        name: babyName,
        birthDate,
        createdAt: serverTimestamp() as any, // אם createdAt הוא Timestamp | string
      };

      const docRef = await toast.promise(
        addDoc(collection(db, 'users', user.uid, 'babies'), newBabyData),
        {
          loading: 'מוסיף תינוק...',
          success: 'תינוק נוסף בהצלחה!',
          error: 'שגיאה בהוספה',
        }
      );

      const newBaby: Baby = { id: docRef.id, ...newBabyData };
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
