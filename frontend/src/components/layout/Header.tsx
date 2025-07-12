import { CameraIcon, StarIcon } from 'lucide-react';
import LogoutButton from '../auth/LogoutButton';

export const Header = () => (
  <header className="w-full lg:bg-transparent md:bg-transparent sm:bg-white px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
    <h1 className="text-xl font-extrabold text-gray-800 flex items-center justify-center">
      <CameraIcon className="w-6 h-6 text-yellow-600 mr-1" />
      <span className="mx-1">BABIES MEMORIES</span>
      <StarIcon className="w-6 h-6 text-yellow-600 ml-1" />
    </h1>

    <div className="flex justify-center sm:justify-end w-full sm:w-auto">
      <LogoutButton />
    </div>
  </header>
);
