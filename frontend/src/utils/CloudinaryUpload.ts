export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'baby_photos');
  formData.append('folder', 'baby-album');

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dpkjowk3l/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();
  console.log('🔍 Cloudinary response:', data);

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.secure_url) throw new Error('לא התקבלה כתובת תמונה מ-Cloudinary');
  return data.secure_url;
};
