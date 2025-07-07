import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const addBabyEntry = async ({
  userId,
  imageUrl,
  month,
  note,
}: {
  userId: string;
  imageUrl: string;
  month: number;
  note?: string;
}) => {
  const docRef = await addDoc(collection(db, 'babyEntries'), {
    userId,
    imageUrl,
    month,
    note: note || '',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};
