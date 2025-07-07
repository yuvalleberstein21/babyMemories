import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const addBabyEntry = async ({
  userId,
  imageUrl,
  month,
  note,
  photoDate,
}: {
  userId: string;
  imageUrl: string;
  month: number;
  note?: string;
  photoDate: string; // תאריך בפורמט YYYY-MM-DD
}) => {
  const docRef = await addDoc(collection(db, 'babyEntries'), {
    userId,
    imageUrl,
    month,
    photoDate,
    note: note || '',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};
