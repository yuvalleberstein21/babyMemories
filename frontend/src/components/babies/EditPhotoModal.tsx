import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: string;
  initialDate?: string;
  onSave: (updatedNote: string, updatedDate: string) => void;
}

const EditPhotoModal = ({
  isOpen,
  onClose,
  initialNote = '',
  initialDate = '',
  onSave,
}: EditPhotoModalProps) => {
  const [note, setNote] = useState(initialNote);
  const [date, setDate] = useState(initialDate);

  const handleSave = () => {
    onSave(note, date);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            עריכת תמונה
          </Dialog.Title>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">תיאור</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">תאריך</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
              ביטול
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              שמור
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditPhotoModal;
