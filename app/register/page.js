"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nama || !email || !password || !role) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      const newUser = { nama, email, password, role };
      await addDoc(collection(db, "users"), newUser);
      alert("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (error) {
      console.error("Gagal mendaftar:", error);
      alert("Terjadi kesalahan saat mendaftar.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-black p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-indigo-800 mb-6">
          Buat Akun Baru
        </h2>
        <form onSubmit={handleRegister} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition text-sm"
          >
            Daftar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <a href="/login" className="text-indigo-700 hover:underline font-semibold">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
}
