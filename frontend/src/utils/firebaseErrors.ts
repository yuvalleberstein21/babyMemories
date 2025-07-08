export const firebaseAuthErrors: Record<string, string> = {
  // שגיאות הרשמה
  'auth/email-already-in-use': 'האימייל כבר בשימוש',
  'auth/invalid-email': 'כתובת אימייל לא תקינה',
  'auth/weak-password': 'הסיסמה חלשה מדי (לפחות 6 תווים)',

  // שגיאות התחברות
  'auth/user-not-found': 'משתמש לא נמצא',
  'auth/wrong-password': 'סיסמה שגויה',
  'auth/too-many-requests': 'נחסמת זמנית עקב ניסיונות שגויים רבים',
  'auth/invalid-credential': 'פרטי ההתחברות שגויים',
};
