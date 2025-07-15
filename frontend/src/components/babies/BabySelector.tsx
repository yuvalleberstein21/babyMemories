import { Plus } from 'lucide-react';
import { useState } from 'react';
import BabySetupForm from './BabySetupForm';
import toast from 'react-hot-toast';

interface BabySelectorProps {
  babies: { id: string; name: string }[];
  selectedBabyId: string | null;
  setSelectedBabyId: (id: string) => void;
  onAddBaby: (babyName: string, birthDate: string) => Promise<void>;
}

const BabySelector = ({
  babies,
  selectedBabyId,
  setSelectedBabyId,
  onAddBaby,
}: BabySelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');

  const handleAddBaby = async () => {
    if (!newBabyName || !newBirthDate) {
      toast.error('נא למלא את כל השדות');
      return;
    }

    await onAddBaby(newBabyName, newBirthDate);
    setNewBabyName('');
    setNewBirthDate('');
    setIsModalOpen(false);
  };

  return (
    <div className="mb-6 text-right">
      <div className="flex items-center justify-end gap-3 mb-4 flex-row-reverse">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-sm text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
        >
          <Plus size={16} />
          הוסף תינוק
        </button>

        {babies.length > 0 && (
          <select
            value={selectedBabyId ?? ''}
            onChange={(e) => setSelectedBabyId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-48 text-right focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            {babies.map((baby) => (
              <option key={baby.id} value={baby.id}>
                {baby.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white flex justify-center items-center rounded-2xl shadow-2xl w-full max-w-sm p-4 sm:p-6 relative max-h-[80vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 left-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
            >
              ✕
            </button>
            <BabySetupForm
              babyName={newBabyName}
              setBabyName={setNewBabyName}
              birthDate={newBirthDate}
              setBirthDate={setNewBirthDate}
              handleSubmit={handleAddBaby}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BabySelector;
