export interface Reminder {
  id?: string;
  babyId: string;
  userId: string;
  month: number; // 1-12
  year: number; // YYYY
  sentAt?: string; // ISO string – תאריך השליחה בפועל
  method: 'email' | 'in-app';
  status: 'pending' | 'sent' | 'failed';
}
