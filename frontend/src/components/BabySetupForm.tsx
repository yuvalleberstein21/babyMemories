import { Heart, Star } from 'lucide-react';

interface Props {
  babyName: string;
  setBabyName: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  handleSubmit: () => void;
}

const BabySetupForm = ({
  babyName,
  setBabyName,
  birthDate,
  setBirthDate,
  handleSubmit,
}: Props) => {
  return (
    <div className="h-screen from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">יומן התינוק שלי</h2>
          <p className="text-gray-600">בואו נתחיל לתעד את הרגעים המיוחדים</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Baby Name */}
          <div className="space-y-2">
            <label
              htmlFor="babyName"
              className="text-right block font-medium text-gray-700"
            >
              שם התינוק
            </label>
            <input
              name="babyName"
              placeholder="הכניסו את שם התינוק"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label
              htmlFor="birthDate"
              className="text-right block font-medium text-gray-700"
            >
              תאריך לידה
            </label>
            <input
              name="birthDate"
              value={birthDate}
              type="date"
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Star className="w-4 h-4" />
            בואו נתחיל!
          </button>
        </form>
      </div>
    </div>
  );
};

export default BabySetupForm;
