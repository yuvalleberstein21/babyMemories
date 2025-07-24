import { format, isSameDay } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import EditPhotoModal from './EditPhotoModal';

interface Photo {
  id: string;
  imageUrl: string;
  note?: string;
  photoDate: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  babyName: string;
  onDeletePhoto: (photoId: string) => void;
  onEditPhoto: (photoId: string, note: string, photoDate: string) => void;
}

const PhotoGallery = ({
  photos,
  babyName,
  onDeletePhoto,
  onEditPhoto,
}: PhotoGalleryProps) => {
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');

  const photoBeingEdited = photos.find((p) => p.id === editingPhotoId);

  const handleDelete = (photoId: string) => {
    const confirmDelete = window.confirm(
      'האם אתה בטוח שברצונך למחוק את התמונה?'
    );
    if (confirmDelete) {
      onDeletePhoto(photoId);
    }
  };

  const filteredPhotos = useMemo(() => {
    if (!filterDate) return photos;
    return photos.filter((photo) =>
      isSameDay(new Date(photo.photoDate), new Date(filterDate))
    );
  }, [photos, filterDate]);

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 relative">
      {/* סינון לפי תאריך */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md pb-4 mb-4 rounded-xl">
        <h2 className="text-right text-xl font-semibold mb-2">
          גלריית התמונות
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">סנן לפי תאריך:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded-lg px-3 py-1 text-right"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-blue-600 text-sm underline"
            >
              איפוס סינון
            </button>
          )}
        </div>
      </div>

      {/* גלריה */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105">
              <img
                src={photo.imageUrl}
                alt={`${babyName} - חודש ${photo.photoDate}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm">
                    {format(photo.photoDate!, 'dd/MM/yyyy')}
                  </p>
                  <p className="font-semibold">תיאור: {photo.note}</p>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setEditingPhotoId(photo.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                    title="ערוך"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                    title="מחק"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredPhotos.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-8">
            לא נמצאו תמונות בתאריך הנבחר.
          </p>
        )}
      </div>

      {editingPhotoId && photoBeingEdited && (
        <EditPhotoModal
          isOpen={true}
          onClose={() => setEditingPhotoId(null)}
          initialNote={photoBeingEdited.note}
          initialDate={photoBeingEdited.photoDate}
          onSave={(newNote, newDate) =>
            onEditPhoto(photoBeingEdited.id, newNote, newDate)
          }
        />
      )}
    </div>
  );
};

export default PhotoGallery;
