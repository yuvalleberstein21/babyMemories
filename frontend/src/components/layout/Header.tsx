import LogoutButton from '../auth/LogoutButton';

export const Header = () => (
  <header className="w-full flex justify-between items-center p-4">
    <h1 className="text-xl font-bold">BABIES MEMORIES</h1>
    <LogoutButton />
  </header>
);
