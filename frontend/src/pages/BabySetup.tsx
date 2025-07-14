import BabySetupForm from '@/components/babies/BabySetupForm';
import { Loader } from '@/components/ui/Loader';
import { auth, db } from '@/firebase';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BabySetup = () => {
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfUserHasBaby = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const babiesRef = collection(db, 'users', user.uid, 'babies');
      const snap = await getDocs(babiesRef);

      if (!snap.empty) {
        // יש כבר תינוק, ננווט החוצה
        navigate('/baby-tracker');
      } else {
        setChecking(false); // אפשר להציג את הטופס
      }
    };

    checkIfUserHasBaby();
  }, [navigate]);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert('לא מחובר');

    const today = new Date().toISOString().split('T')[0];
    if (birthDate > today) {
      alert('תאריך לידה לא יכול להיות בעתיד');
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'babies'), {
        name: babyName,
        birthDate,
        createdAt: serverTimestamp(),
      });
      navigate('/baby-tracker');
    } catch (err) {
      console.error('שגיאה בשמירה', err);
    }
  };

  if (checking) return <Loader />;
  return (
    <BabySetupForm
      babyName={babyName}
      setBabyName={setBabyName}
      birthDate={birthDate}
      setBirthDate={setBirthDate}
      handleSubmit={handleSubmit}
    />
  );
};

export default BabySetup;
