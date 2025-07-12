import { format } from 'date-fns';

interface Photo {
  id: string;
  imageUrl: string;
  note?: string;
  photoDate?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  babyName: string;
}

const PhotoGallery = ({ photos, babyName }: PhotoGalleryProps) => (
  <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
    <h2 className="text-right text-xl font-semibold mb-6">גלריית התמונות</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
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
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PhotoGallery;
