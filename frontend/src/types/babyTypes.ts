interface BabyPhoto {
  id: string;
  url: string;
  month: number;
  uploadDate: Date;
  babyName: string;
}

export interface BabyData {
  name: string;
  birthDate: Date;
  photos: BabyPhoto[];
}
