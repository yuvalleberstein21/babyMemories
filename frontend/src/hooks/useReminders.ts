import { useEffect, useState } from 'react';
import { Reminder } from '@/types/reminder';
import { auth } from '@/firebase';
import { getReminders, createReminder } from '@/services/ReminderService';
import { currentDateString } from '@/utils/currentDate';

export const useReminders = (babyId: string) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndInitReminder = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setIsLoading(true);
      try {
        const data = await getReminders(user.uid);
        setReminders(data);

        // בדיקה אם קיימת תזכורת עבור התינוק הזה
        const hasReminder = data.some((reminder) => reminder.babyId === babyId);

        if (!hasReminder) {
          const newReminder = await createReminder(
            user.uid,
            babyId,
            currentDateString() // למשל: '2025-07-15'
          );
          setReminders((prev) => [...prev, newReminder]);
        }
      } catch (error) {
        console.error('שגיאה בשליפת/יצירת תזכורות:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (babyId) fetchAndInitReminder();
  }, [babyId]);

  return { reminders, isLoading };
};
