import { login, register } from '@/services/AuthService';
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const user = await register(email, password);
      console.log('Registered:', user.user);
    } catch (err) {
      console.error('Register error', err);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      console.log('Logged in:', user.user);
    } catch (err) {
      console.error('Login error', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.36-6.36l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ברוכים הבאים 👶</h2>
          <p className="text-gray-600">הרשמה או התחברות ליומן התינוק שלך</p>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-right font-medium text-gray-700"
            >
              אימייל
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-right font-medium text-gray-700"
            >
              סיסמה
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 text-right"
            />
          </div>

          <button
            type="submit"
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            הרשם
          </button>
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            התחבר
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          אין לך חשבון?{' '}
          <a href="#" className="text-pink-500 hover:underline">
            הרשם כאן
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
