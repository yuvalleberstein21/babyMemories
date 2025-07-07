export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'baby_photos'); // שים פה את שם ה-preset
  formData.append('folder', 'baby-album'); // אופציונלי

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dpkjowk3l/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();
  if (!data.secure_url) throw new Error('העלאה נכשלה');
  return data.secure_url;
};
