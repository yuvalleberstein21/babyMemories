import { Calendar, Camera, Heart, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Loader } from './ui/Loader';
import { auth } from '@/firebase';
import { uploadToCloudinary } from '@/utils/CloudinaryUpload';
import { addBabyEntry } from '@/services/babyEntriesService';
import { getBabyEntriesByUser } from '@/utils/GetBabyEntries';

const babyData = {
  name: 'ליאו',
  birthDate: new Date(1999, 5, 18),
  photos: [
    {
      id: '1',
      url: 'https://img.mako.co.il/2020/02/26/84728122164728881874577526022020_i.jpg',
      month: 1,
      uploadDate: new Date(2024, 7, 1),
    },
    {
      id: '2',
      url: 'https://media3.reshet.tv/image/upload/t_grid-item-large/v1673876531/uploads/2023/903395620.webp',
      month: 2,
      uploadDate: new Date(2024, 8, 1),
    },
    {
      id: '3',
      url: 'https://media3.reshet.tv/image/upload/t_grid-item-large/v1673876531/uploads/2023/903395620.webp',
      month: 3,
      uploadDate: new Date(2024, 8, 1),
    },
    {
      id: '4',
      url: 'https://media3.reshet.tv/image/upload/t_grid-item-large/v1673876531/uploads/2023/903395620.webp',
      month: 4,
      uploadDate: new Date(2024, 8, 1),
    },
    {
      id: '5',
      url: 'https://media3.reshet.tv/image/upload/t_grid-item-large/v1673876531/uploads/2023/903395620.webp',
      month: 5,
      uploadDate: new Date(2024, 8, 1),
    },
    {
      id: '6',
      url: 'https://media3.reshet.tv/image/upload/t_grid-item-large/v1673876531/uploads/2023/903395620.webp',
      month: 6,
      uploadDate: new Date(2024, 8, 1),
    },
  ],
};

const currentMonth = 3;
const BabyTracker = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [note, setNote] = useState('');

  const [isSetup, setIsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [groupedByMonth, setGroupedByMonth] = useState<Record<number, any[]>>(
    {}
  );

  // if (isLoading) return <Loader />;

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user || !imageFile) return alert('משתמש או קובץ לא קיימים');

    try {
      setIsUploading(true);

      const uploadedImageUrl = await uploadToCloudinary(imageFile);

      const selectedDate = new Date(date);
      const month = selectedDate.getMonth() + 1;

      await addBabyEntry({
        userId: user.uid,
        imageUrl: uploadedImageUrl,
        month,
        note,
        photoDate: date,
      });

      alert('התווסף בהצלחה!');
    } catch (err) {
      console.error('שגיאה בהעלאה:', err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      console.log(user);
      if (!user) return;

      const allEntries = await getBabyEntriesByUser(user.uid);
      setEntries(allEntries);

      // קיבוץ לפי חודש
      const grouped: Record<number, any[]> = {};
      allEntries.forEach((entry) => {
        const month = entry.month || 0;
        if (!grouped[month]) grouped[month] = [];
        grouped[month].push(entry);
      });

      setGroupedByMonth(grouped);
      setIsLoading(false);
    };

    fetchEntries();
  }, []);

  if (isLoading) return <Loader />;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="min-h-screen  from-pink-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            יומן {babyData.name} ❤️
          </h1>
          <p className="text-gray-600">
            נולד ב: {format(babyData.birthDate, 'dd/MM/yyyy')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* העלאת תמונות */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-right">
              <Camera className="w-5 h-5" />
              <h2 className="text-xl font-semibold">
                חודש {new Date(date).getMonth() + 1}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="photos"
                  className="block text-right mb-1 text-gray-700 font-medium"
                >
                  בחרו תמונות
                </label>
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="תצוגה"
                    width={200}
                  />
                )}
                <input
                  id="photos"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full border rounded-lg px-4 py-2 text-right"
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <textarea
                  placeholder="הערה (לא חובה)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">נבחרו 3 תמונות</p>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                >
                  {isUploading ? 'מעלה...' : 'שמור'}
                </button>
              </div>
            </div>
          </div>

          {/* תזכורת חודשית */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 text-right">
              <Calendar className="w-5 h-5" />
              <h2 className="text-xl font-semibold">תזכורת חודשית</h2>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">
                  {currentMonth}
                </span>
              </div>
              <p className="text-gray-600">זה הזמן לצלם את {babyData.name}!</p>
              <p className="text-sm text-gray-500">
                התזכורת הבאה: חודש {currentMonth + 1}
              </p>
            </div>
          </div>
        </div>

        {/* גלריית תמונות */}
        <div className="space-y-8">
          {Object.entries(groupedByMonth).map(([month, photos]) => (
            <div key={month}>
              <h2 className="text-xl font-bold mb-2">חודש {month}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded overflow-hidden shadow bg-white p-2"
                  >
                    <img
                      src={entry.imageUrl}
                      alt={entry.note}
                      className="rounded w-full"
                    />
                    <p className="text-sm mt-1 text-gray-700">{entry.note}</p>
                    <p className="text-xs text-gray-500">
                      {entry.photoDate &&
                        new Date(entry.photoDate).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* {Object.entries(groupedByMonth).map(([month, photos]) => (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <h2 className="text-right text-xl font-semibold mb-6">
              גלריית התמונות
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={month} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105">
                    <img
                      src={photo.url}
                      alt={`${babyData.name} - חודש ${photo.month}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-semibold">חודש {month}</p>
                        <p className="text-sm">
                          {format(photo.uploadDate, 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default BabyTracker;
