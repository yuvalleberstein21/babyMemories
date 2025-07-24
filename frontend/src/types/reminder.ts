export interface Reminder {
  id: string;
  babyId: string;
  lastReminderDate: string; // תאריך בפורמט ISO
  nextReminderDate?: string; // אופציונלי – תאריך עתידי
  createdAt?: Date;
}
