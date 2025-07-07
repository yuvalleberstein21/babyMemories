import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export const getBabyEntriesByUser = async (userId: string) => {
  const q = query(
    collection(db, 'babyEntries'),
    where('userId', '==', userId),
    orderBy('photoDate', 'asc') // ממיין לפי תאריך
  );

  const querySnapshot = await getDocs(q);
  const results: any[] = [];

  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() });
  });

  return results;
};
