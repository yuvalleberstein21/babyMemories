import BabySetupForm from '@/components/BabySetupForm';
import { auth, db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BabySetup = () => {
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert('לא מחובר');

    try {
      await setDoc(doc(db, 'babies', user.uid), {
        name: babyName,
        birthDate,
      });
      navigate('/baby-tracker'); // מעבר לדף יומן התמונות
    } catch (err) {
      console.error('שגיאה בשמירה', err);
    }
  };
  return <BabySetupForm />;
};

export default BabySetup;
