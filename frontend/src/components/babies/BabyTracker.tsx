import { Calendar, Camera, Heart, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Loader } from '../ui/Loader';
import { auth, db } from '@/firebase';
import { uploadToCloudinary } from '@/utils/CloudinaryUpload';

import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const BabyTracker = () => {
  const [babies, setBabies] = useState<
    { id: string; name: string; birthDate: string }[]
  >([]);
  const [selectedBabyId, setSelectedBabyId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isLoadingGetPhotos, setIsLoadingGetPhotos] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<
    { id: string; imageUrl: string; note?: string; photoDate?: string }[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('❌ אין משתמש');
        navigate('/');
        return;
      }

      console.log('✅ משתמש מחובר:', user.uid);

      const babiesRef = collection(db, 'users', user.uid, 'babies');
      console.log('📁 בודק path:', babiesRef.path);

      try {
        const snap = await getDocs(babiesRef);
        console.log(
          '📦 Found docs:',
          snap.docs.map((doc) => doc.data())
        );

        if (snap.empty) {
          console.log('⚠️ אין תינוקות');
          navigate('/baby-setup');
          return;
        }

        const babyList = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { name: string; birthDate: string }),
        }));

        console.log('👶 תינוקות:', babyList);
        setBabies(babyList);
        setSelectedBabyId(babyList[0].id);
      } catch (err) {
        console.error('שגיאה בשליפה מ־babies:', err);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  //   const currentUser = auth.currentUser;

  //   const fetchBabies = async (user: typeof auth.currentUser) => {
  //     const babiesRef = collection(db, 'users', user!.uid, 'babies');

  //     const snap = await getDocs(babiesRef);

  //     if (snap.empty) {
  //       navigate('/baby-setup');
  //       return;
  //     }

  //     const babyList = snap.docs.map((doc) => ({
  //       id: doc.id,
  //       ...(doc.data() as { name: string; birthDate: string }),
  //     }));

  //     setBabies(babyList);
  //     setSelectedBabyId(babyList[0].id);
  //   };

  //   if (currentUser) {
  //     console.log('👶 משתמש קיים כבר עם currentUser:', currentUser.uid);
  //     fetchBabies(currentUser);
  //   } else {
  //     const unsubscribe = onAuthStateChanged(auth, (user) => {
  //       if (!user) {
  //         navigate('/');
  //         return;
  //       }
  //       console.log('📲 onAuthStateChanged תפס את המשתמש:', user.uid);
  //       fetchBabies(user);
  //     });

  //     return () => unsubscribe();
  //   }
  // }, [navigate]);

  const selectedBaby = babies.find((b) => b.id === selectedBabyId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async () => {
    if (!imageFile || !selectedBabyId) return;

    console.log('🔍 קובץ להעלאה:', imageFile);

    console.log('🔍 סוג קובץ:', imageFile?.type);

    const user = auth.currentUser;
    if (!user) return alert('משתמש לא מחובר');

    setIsUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(imageFile);
      const photoDateObj = new Date(date);
      const month = photoDateObj.getMonth() + 1;

      await addDoc(
        collection(db, 'users', user.uid, 'babies', selectedBabyId, 'photos'),
        {
          imageUrl,
          photoDate: date,
          month,
          note: note || '',
          createdAt: serverTimestamp(),
        }
      );

      alert('התמונה נוספה!');
      setImageFile(null);
      setNote('');
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      console.error('שגיאה בהעלאה:', err);
      alert('העלאה נכשלה');
    } finally {
      setIsUploading(false);
    }
  };

  // Get Photos
  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoadingGetPhotos(true);

      try {
        const user = auth.currentUser;
        if (!user || !selectedBabyId) return;

        const photosRef = collection(
          db,
          'users',
          user.uid,
          'babies',
          selectedBabyId,
          'photos'
        );
        const q = query(photosRef, orderBy('photoDate', 'desc'));
        const snap = await getDocs(q);

        const items = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any;

        setPhotos(items);
      } catch (error) {
        console.error('שגיאה בשליפת תמונות:', error);
      } finally {
        setIsLoadingGetPhotos(false);
      }
    };

    fetchPhotos();
  }, [selectedBabyId, isUploading]);

  if (!selectedBaby) return <Loader />;
  if (isLoadingGetPhotos) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* תפריט בחירת תינוק */}
      {babies.length > 1 && (
        <div className="mb-6 text-right">
          <label className="block mb-1 font-bold text-gray-700">
            בחר תינוק
          </label>
          <select
            value={selectedBabyId ?? ''}
            onChange={(e) => setSelectedBabyId(e.target.value)}
            className="border rounded-lg border-red-400 px-6 py-2"
          >
            {babies.map((baby) => (
              <option key={baby.id} value={baby.id}>
                {baby.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* כותרת יומן */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          יומן {selectedBaby.name} ❤️
        </h1>
        <p className="text-gray-600">
          נולד ב: {format(new Date(selectedBaby.birthDate), 'dd/MM/yyyy')}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* העלאת תמונה */}
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
                בחרו תמונה
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
                onChange={handleFileChange}
                accept="image/*"
                className="w-full border rounded-lg px-4 py-2 text-right"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-right mt-4"
              />

              <textarea
                placeholder="הערה (לא חובה)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-right mt-4"
              />
            </div>

            <div className="text-center space-y-2">
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
              <span className="text-2xl font-bold text-white">Date now</span>
            </div>
            <p className="text-gray-600">
              זה הזמן לצלם את {selectedBaby.name}!
            </p>
            <p className="text-sm text-gray-500">התזכורת הבאה: חודש</p>
          </div>
        </div>

        {/* אפשר להוסיף כאן גלריית תמונות */}
      </div>{' '}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
        <h2 className="text-right text-xl font-semibold mb-6">
          גלריית התמונות
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105">
                <img
                  src={photo.imageUrl}
                  alt={`${selectedBaby.name} - חודש ${photo.photoDate}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm">
                      {format(photo.photoDate, 'dd/MM/yyyy')}
                    </p>
                    <p className="font-semibold">תיאור: {photo.note}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

//   return (
//     <div className="min-h-screen  from-pink-50 via-blue-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             יומן {babyData.name} ❤️
//           </h1>
//           <p className="text-gray-600">
//             נולד ב: {format(babyData.birthDate, 'dd/MM/yyyy')}
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8 mb-8">
//           {/* העלאת תמונות */}
//           <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
//             <div className="flex items-center gap-2 mb-4 text-right">
//               <Camera className="w-5 h-5" />
//               <h2 className="text-xl font-semibold">
//                 חודש {new Date(date).getMonth() + 1}
//               </h2>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="photos"
//                   className="block text-right mb-1 text-gray-700 font-medium"
//                 >
//                   בחרו תמונות
//                 </label>
//                 {imageFile && (
//                   <img
//                     src={URL.createObjectURL(imageFile)}
//                     alt="תצוגה"
//                     width={200}
//                   />
//                 )}
//                 <input
//                   id="photos"
//                   type="file"
//                   multiple
//                   onChange={handleFileChange}
//                   accept="image/*"
//                   className="w-full border rounded-lg px-4 py-2 text-right"
//                 />

//                 <input
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                 />

//                 <textarea
//                   placeholder="הערה (לא חובה)"
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                 />
//               </div>

//               <div className="text-center space-y-2">
//                 <p className="text-sm text-gray-600">נבחרו 3 תמונות</p>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isUploading}
//                   className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
//                 >
//                   {isUploading ? 'מעלה...' : 'שמור'}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* תזכורת חודשית */}
// <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
//   <div className="flex items-center gap-2 mb-4 text-right">
//     <Calendar className="w-5 h-5" />
//     <h2 className="text-xl font-semibold">תזכורת חודשית</h2>
//   </div>

//   <div className="text-center space-y-4">
//     <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
//       <span className="text-2xl font-bold text-white">
//         {currentMonth}
//       </span>
//     </div>
//     <p className="text-gray-600">זה הזמן לצלם את {babyData.name}!</p>
//     <p className="text-sm text-gray-500">
//       התזכורת הבאה: חודש {currentMonth + 1}
//     </p>
//   </div>
// </div>
// </div>

//         {/* גלריית תמונות */}
//         <div className="space-y-8">
//           {Object.entries(groupedByMonth).map(([month, photos]) => (
//             <div key={month}>
//               <h2 className="text-xl font-bold mb-2">חודש {month}</h2>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {photos.map((entry) => (
//                   <div
//                     key={entry.id}
//                     className="rounded overflow-hidden shadow bg-white p-2"
//                   >
//                     <img
//                       src={entry.imageUrl}
//                       alt={entry.note}
//                       className="rounded w-full"
//                     />
//                     <p className="text-sm mt-1 text-gray-700">{entry.note}</p>
//                     <p className="text-xs text-gray-500">
//                       {entry.photoDate &&
//                         new Date(entry.photoDate).toLocaleDateString('he-IL')}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* {Object.entries(groupedByMonth).map(([month, photos]) => (
//           <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
//             <h2 className="text-right text-xl font-semibold mb-6">
//               גלריית התמונות
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {photos.map((photo) => (
//                 <div key={month} className="relative group">
//                   <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105">
//                     <img
//                       src={photo.url}
//                       alt={`${babyData.name} - חודש ${photo.month}`}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="absolute bottom-4 left-4 text-white">
//                         <p className="font-semibold">חודש {month}</p>
//                         <p className="text-sm">
//                           {format(photo.uploadDate, 'dd/MM/yyyy')}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))} */}
//       </div>
//     </div>
//   );
// };

export default BabyTracker;
