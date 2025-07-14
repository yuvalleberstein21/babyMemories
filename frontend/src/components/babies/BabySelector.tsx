import { Plus } from 'lucide-react';
import { useState } from 'react';
import BabySetupForm from './BabySetupForm';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');

  return (
    <div className="mb-6 text-right">
      <div className="flex items-center justify-between mb-2">
        <label className="font-bold text-gray-700">בחר תינוק</label>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-sm text-blue-600 underline"
        >
          ➕ הוסף תינוק
        </button>
      </div>

      {babies.length > 0 && (
        <select
          value={selectedBabyId ?? ''}
          onChange={(e) => setSelectedBabyId(e.target.value)}
          className="border rounded-lg border-red-400 px-6 py-2 w-full"
        >
          {babies.map((baby) => (
            <option key={baby.id} value={baby.id}>
              {baby.name}
            </option>
          ))}
        </select>
      )}

      {showAddForm && (
        <BabySetupForm
          babyName={newBabyName}
          setBabyName={setNewBabyName}
          birthDate={newBirthDate}
          setBirthDate={setNewBirthDate}
          handleSubmit={async () => {
            if (!newBabyName || !newBirthDate)
              return alert('נא למלא את כל השדות');
            await onAddBaby(newBabyName, newBirthDate);
            setNewBabyName('');
            setNewBirthDate('');
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

export default BabySelector;
