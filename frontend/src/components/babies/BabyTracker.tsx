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
import PhotoGallery from './PhotoGallery';
import PhotoUploadForm from './PhotoUploadForm';
import MonthlyReminder from './MonthlyReminder';
import BabySelector from './BabySelector';

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
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* תפריט בחירת תינוק */}
      <BabySelector
        babies={babies}
        selectedBabyId={selectedBabyId}
        setSelectedBabyId={setSelectedBabyId}
      />
      {/* כותרת יומן */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          יומן {selectedBaby.name} ❤️
        </h1>
        <p className="text-gray-600">
          נולד/ה ב : {format(new Date(selectedBaby.birthDate), 'dd/MM/yyyy')}
        </p>
      </div>
      {/* העלאת תמונה */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <PhotoUploadForm
          imageFile={imageFile}
          date={date}
          note={note}
          isUploading={isUploading}
          onFileChange={handleFileChange}
          onDateChange={setDate}
          onNoteChange={setNote}
          onSubmit={handleSubmit}
        />
        {/* תזכורת חודשית */}
        <MonthlyReminder babyName={selectedBaby.name} />
      </div>
      {/* גלריית תמונות */}
      <PhotoGallery photos={photos} babyName={selectedBaby.name} />
    </div>
  );
};

export default BabyTracker;
