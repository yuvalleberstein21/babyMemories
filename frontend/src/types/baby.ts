export interface Baby {
  id: string;
  name: string;
  birthDate: string; // ISO date string (yyyy-mm-dd)
  createdAt?: Date;
}

export interface NewBaby {
  name: string;
  birthDate: string;
  createdAt?: Date;
}
