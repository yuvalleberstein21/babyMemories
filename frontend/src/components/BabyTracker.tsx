import { Calendar, Camera, Heart, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Loader } from './ui/Loader';
import { useNavigate } from 'react-router-dom';

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
  const [isSetup, setIsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // if (isLoading) return <Loader />;

  if (!isSetup) {
    return (
      <div className="h-screen from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6">
          {/* Header */}
          <div className="text-center space-y-4 mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              יומן התינוק שלי
            </h2>
            <p className="text-gray-600">בואו נתחיל לתעד את הרגעים המיוחדים</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Baby Name */}
            <div className="space-y-2">
              <label
                htmlFor="babyName"
                className="text-right block font-medium text-gray-700"
              >
                שם התינוק
              </label>
              <input
                id="babyName"
                name="babyName"
                placeholder="הכניסו את שם התינוק"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label
                htmlFor="birthDate"
                className="text-right block font-medium text-gray-700"
              >
                תאריך לידה
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Star className="w-4 h-4" />
              בואו נתחיל!
            </button>
          </form>
        </div>
      </div>
    );
  }
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
                העלאת תמונות - חודש {currentMonth}
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
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full border rounded-lg px-4 py-2 text-right"
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">נבחרו 3 תמונות</p>
                <button className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300">
                  העלה תמונות
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
        {babyData.photos.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <h2 className="text-right text-xl font-semibold mb-6">
              גלריית התמונות
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {babyData.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105">
                    <img
                      src={photo.url}
                      alt={`${babyData.name} - חודש ${photo.month}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-semibold">חודש {photo.month}</p>
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
        )}
      </div>
    </div>
  );
};

export default BabyTracker;
