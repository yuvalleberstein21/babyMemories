import { useReminders } from '@/hooks/useReminders';
import { currentDateIL } from '@/utils/currentDate';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface Props {
  babyId: string;
  babyName: string;
}
const MonthlyReminder = ({ babyId, babyName }: Props) => {
  const { reminders, isLoading } = useReminders(babyId);
  const currentDate = currentDateIL();

  if (isLoading) return <p>טוען תזכורות...</p>;

  const babyReminder = reminders.find((r) => r.babyId === babyId);

  const lastReminderDate = babyReminder?.lastReminderDate;
  let nextReminderDate = 'לא זמינה';

  if (lastReminderDate) {
    const nextDate = new Date(lastReminderDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextReminderDate = format(nextDate, 'dd/MM/yyyy', { locale: he });
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4 text-right">
        <Calendar className="w-5 h-5" />
        <h2 className="text-xl font-semibold">תזכורת חודשית</h2>
      </div>

      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
          <span className="text-sm font-bold text-white">{currentDate}</span>
        </div>
        <p className="text-gray-600">זה הזמן לצלם את {babyName}!</p>
        <p className="text-sm text-gray-500">
          התזכורת הבאה: {nextReminderDate}
        </p>
      </div>
    </div>
  );
};

export default MonthlyReminder;
