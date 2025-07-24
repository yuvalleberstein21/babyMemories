export const currentDateIL = () => {
  const now = new Date().toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return now;
};

export const currentDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // תוצאה כמו '2025-07-15'
};
