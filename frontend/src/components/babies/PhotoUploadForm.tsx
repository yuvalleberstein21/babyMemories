import { Camera } from 'lucide-react';

interface PhotoUploadFormProps {
  imageFile: File | null;
  date: string;
  note: string;
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (val: string) => void;
  onNoteChange: (val: string) => void;
  onSubmit: () => void;
}

const PhotoUploadForm = ({
  imageFile,
  date,
  note,
  isUploading,
  onFileChange,
  onDateChange,
  onNoteChange,
  onSubmit,
}: PhotoUploadFormProps) => {
  return (
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
            <img src={URL.createObjectURL(imageFile)} alt="תצוגה" width={200} />
          )}
          <input
            id="photos"
            type="file"
            onChange={onFileChange}
            accept="image/*"
            className="w-full border rounded-lg px-4 py-2 text-right"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-right mt-4"
          />

          <textarea
            placeholder="הערה (לא חובה)"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-right mt-4"
          />
        </div>

        <div className="text-center space-y-2">
          <button
            onClick={onSubmit}
            disabled={isUploading}
            className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            {isUploading ? 'מעלה...' : 'שמור'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadForm;
