import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const addBabyEntry = async ({
  userId,
  babyId,
  imageUrl,
  month,
  note,
  photoDate,
}: {
  userId: string;
  babyId: string;
  imageUrl: string;
  month: number;
  note?: string;
  photoDate: string; // תאריך בפורמט YYYY-MM-DD
}) => {
  const docRef = await addDoc(
    collection(db, 'users', userId, 'babies', babyId, 'photos'),
    {
      imageUrl,
      month,
      note: note || '',
      photoDate,
      createdAt: serverTimestamp(),
    }
  );
  return docRef.id;
};
