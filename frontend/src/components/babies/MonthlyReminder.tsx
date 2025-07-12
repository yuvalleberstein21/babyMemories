import { Calendar } from 'lucide-react';

const MonthlyReminder = ({ babyName }: { babyName: string }) => (
  <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4 text-right">
      <Calendar className="w-5 h-5" />
      <h2 className="text-xl font-semibold">תזכורת חודשית</h2>
    </div>

    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
        <span className="text-2xl font-bold text-white">Date now</span>
      </div>
      <p className="text-gray-600">זה הזמן לצלם את {babyName}!</p>
      <p className="text-sm text-gray-500">התזכורת הבאה: חודש</p>
    </div>
  </div>
);

export default MonthlyReminder;
