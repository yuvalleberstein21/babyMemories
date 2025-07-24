import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { auth, db } from '@/firebase';
import { uploadToCloudinary } from '@/utils/CloudinaryUpload';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useBabies } from '@/hooks/useBabies';
import { usePhotos } from '@/hooks/usePhotos';
import { Loader } from '../ui/Loader';
import BabySelector from './BabySelector';
import PhotoUploadForm from './PhotoUploadForm';
import PhotoGallery from './PhotoGallery';
import MonthlyReminder from './MonthlyReminder';

const MAX_SIZE_MB = 1.5;

const BabyTracker = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isUploading, setIsUploading] = useState(false);

  const {
    babies,
    selectedBabyId,
    setSelectedBabyId,
    handleAddBaby,
    selectedBaby,
  } = useBabies();

  const {
    photos,
    isLoading: isLoadingPhotos,
    handleDeletePhoto,
    handleEditPhoto,
  } = usePhotos(selectedBabyId, isUploading);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isSizeValid = file.size / 1024 / 1024 <= MAX_SIZE_MB;

    if (!isImage) {
      toast.error('נא לבחור קובץ תמונה בלבד');
      return;
    }

    if (!isSizeValid) {
      toast.error('התמונה חורגת מהמגבלה של MB 1.5');
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async () => {
    if (!imageFile || !selectedBabyId) {
      toast.error('בחר תמונה קודם');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error('משתמש לא מחובר');
      return;
    }

    setIsUploading(true);

    const uploadTask = toast.promise(
      (async () => {
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
      })(),
      {
        loading: 'מעלה תמונה...',
        success: 'התמונה נוספה בהצלחה! 🎉',
        error: 'העלאה נכשלה 😢',
      }
    );

    try {
      await uploadTask;
      setImageFile(null);
      setNote('');
      setDate(new Date().toISOString().slice(0, 10));
    } finally {
      setIsUploading(false);
    }
  };

  if (!selectedBaby) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <BabySelector
        babies={babies}
        selectedBabyId={selectedBabyId}
        setSelectedBabyId={setSelectedBabyId}
        onAddBaby={handleAddBaby}
      />

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="text-center mb-8">
          <MonthlyReminder
            babyName={selectedBaby.name}
            babyId={selectedBaby.id}
          />
        </div>
        <PhotoUploadForm
          imageFile={imageFile}
          onFileChange={handleFileChange}
          note={note}
          onNoteChange={(val) => setNote(val)}
          date={date}
          onDateChange={(val) => setDate(val)}
          onSubmit={handleSubmit}
          isUploading={isUploading}
        />
      </div>
      {isLoadingPhotos ? (
        <Loader />
      ) : (
        <PhotoGallery
          babyName={selectedBaby.name}
          photos={photos}
          onDeletePhoto={handleDeletePhoto}
          onEditPhoto={handleEditPhoto}
        />
      )}
    </div>
  );
};

export default BabyTracker;
