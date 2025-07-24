import { db } from '@/firebase';
import { Reminder } from '@/types/reminder';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  DocumentData,
} from 'firebase/firestore';

export const createReminder = async (
  userId: string,
  babyId: string,
  lastReminderDate: string
): Promise<Reminder> => {
  const ref = collection(db, 'users', userId, 'reminders');

  const newReminder: Omit<Reminder, 'id'> = {
    babyId,
    lastReminderDate,
    createdAt: serverTimestamp() as any,
  };

  const docRef = await addDoc(ref, newReminder);
  return {
    id: docRef.id,
    ...newReminder,
  } as Reminder;
};

export const getReminders = async (userId: string): Promise<Reminder[]> => {
  const ref = collection(db, 'users', userId, 'reminders');
  const q = query(ref, orderBy('lastReminderDate', 'desc'));

  const snap = await getDocs(q);

  const reminders: Reminder[] = snap.docs.map((doc) => {
    const data = doc.data() as DocumentData;

    return {
      id: doc.id,
      babyId: data.babyId,
      lastReminderDate: data.lastReminderDate,
      createdAt: (data.createdAt?.toDate?.() ?? null) as Date | undefined,
    };
  });

  return reminders;
};
