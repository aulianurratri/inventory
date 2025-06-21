'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, 'users'),
        where('email', '==', email),
        where('password', '==', password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        const role = user.role;
        if (role === 'admin') router.push('/dashboard/admin');
        else if (role === 'staff') router.push('/dashboard/staff');
        else if (role === 'manager') router.push('/dashboard/manager');
        else alert('Role tidak dikenali.');
      } else {
        alert('Email atau password salah.');
      }
    } catch (err) {
      console.error('Gagal login:', err);
      alert('Terjadi kesalahan saat login.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-black flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8">
      {/* Kiri - Welcome */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 mb-8 lg:mb-0">
        <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 rounded-3xl shadow-2xl p-8 sm:p-12 text-white text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-2 sm:mb-3 tracking-wide">Selamat</h1>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 sm:mb-8 tracking-wide">Datang</h1>
          <p className="text-base sm:text-xl text-indigo-200 font-light mb-4 sm:mb-6">
            di <span className="font-semibold">Sistem Inventory Fairelapparel</span>
          </p>
          <p className="italic tracking-wide text-indigo-300 text-sm sm:text-base">
            Kelola inventori dengan mudah dan cepat.
          </p>
        </div>
      </div>

      {/* Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 sm:p-12 w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-indigo-400 mb-8 text-center">
            Masuk ke Akun Anda
          </h2>
          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:bg-gray-800 dark:border-indigo-600 dark:text-indigo-200 text-sm transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:bg-gray-800 dark:border-indigo-600 dark:text-indigo-200 text-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold rounded-xl shadow-md hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 transition uppercase tracking-wide text-sm"
            >
              Masuk
            </button>
          </form>

          {/* Link ke Register */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-indigo-700 hover:underline font-semibold">
              Daftar di sini
            </Link>
          </p>

          {/* Link ke Contact Page */}
          <p className="text-center text-sm text-gray-500 mt-3">
            <Link href="/contact" className="text-indigo-500 hover:underline font-medium">
              Lihat Contact / Biodata
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
