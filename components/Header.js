import { FaArrowLeft } from 'react-icons/fa';

export default function Header({ title, showBack, onBack }) {
  return (
    <header className="bg-white dark:bg-gray-900 rounded-xl shadow-md px-6 py-4 flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center text-indigo-600 dark:text-indigo-300 font-medium hover:text-indigo-800 transition duration-200"
          >
            <FaArrowLeft className="mr-2" />
            <span className="hidden sm:inline">Kembali</span>
          </button>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
