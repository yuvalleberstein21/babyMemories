import BabySetupForm from '@/components/babies/BabySetupForm';
import { auth, db } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BabySetup = () => {
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const navigate = useNavigate();

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
      navigate('/baby-tracker'); // מעבר לדף יומן התמונות
    } catch (err) {
      console.error('שגיאה בשמירה', err);
    }
  };
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
