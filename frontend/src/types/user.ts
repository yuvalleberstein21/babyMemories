export interface AppUser {
  uid: string;
  fullName: string;
  email: string;
  createdAt?: Date;
}

export interface NewUser {
  fullName: string;
  email: string;
  createdAt?: Date;
}

export interface User {
  uid: string;
  fullName: string;
  email: string;
}
