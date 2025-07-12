interface BabySelectorProps {
  babies: { id: string; name: string }[];
  selectedBabyId: string | null;
  setSelectedBabyId: (id: string) => void;
}

const BabySelector = ({
  babies,
  selectedBabyId,
  setSelectedBabyId,
}: BabySelectorProps) => {
  if (babies.length <= 1) return null;

  return (
    <div className="mb-6 text-right">
      <label className="block mb-1 font-bold text-gray-700">בחר תינוק</label>
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
  );
};

export default BabySelector;
