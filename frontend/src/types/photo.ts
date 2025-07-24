export interface Photo {
  id: string;
  imageUrl: string;
  photoDate: string; // תאריך התמונה בפורמט ISO
  month: number; // מספר החודש (1-12)
  note: string;
  createdAt?: Date;
}

export interface NewPhoto {
  imageUrl: string;
  photoDate: string;
  month: number;
  note: string;
  createdAt?: Date;
}
