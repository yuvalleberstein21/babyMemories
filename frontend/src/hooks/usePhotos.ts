// hooks/usePhotos.ts
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export function usePhotos(selectedBabyId: string | null, isUploading: boolean) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
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
        })) as any[];

        setPhotos(items);
      } catch (error) {
        console.error('שגיאה בשליפת תמונות:', error);
        toast.error('שגיאה בטעינת התמונות');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedBabyId, isUploading]);

  const handleDeletePhoto = async (photoId: string) => {
    const user = auth.currentUser;
    if (!user || !selectedBabyId) return;

    try {
      await deleteDoc(
        doc(db, 'users', user.uid, 'babies', selectedBabyId, 'photos', photoId)
      );
      toast.success('התמונה נמחקה');
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error('שגיאה במחיקה:', err);
      toast.error('שגיאה במחיקת התמונה');
    }
  };

  const handleEditPhoto = async (
    photoId: string,
    newNote: string,
    newDate: string
  ) => {
    const user = auth.currentUser;
    if (!user || !selectedBabyId) return;

    try {
      const photoDoc = doc(
        db,
        'users',
        user.uid,
        'babies',
        selectedBabyId,
        'photos',
        photoId
      );

      await updateDoc(photoDoc, {
        note: newNote,
        photoDate: newDate,
        month: new Date(newDate).getMonth() + 1,
      });

      toast.success('התמונה עודכנה!');
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, note: newNote, photoDate: newDate } : p
        )
      );
    } catch (err) {
      console.error('שגיאה בעדכון:', err);
      toast.error('שגיאה בעדכון');
    }
  };

  return { photos, isLoading, handleDeletePhoto, handleEditPhoto };
}
