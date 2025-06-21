// app/contact/page.js
"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 sm:p-12 max-w-lg w-full text-center">
        <img
          src="/aulia.jpg" // Ganti dengan path gambar kamu, misalnya: /aulia.jpg
          alt="Foto Profil"
          className="w-32 h-32 mx-auto rounded-full border-4 border-indigo-500 mb-4 object-cover"
        />
        <h1 className="text-3xl font-bold text-indigo-300 mb-2">Aulia Nur Ratri</h1>
        <p className="text-indigo-200 text-sm mb-4">Mahasiswa Sistem Informasi - Ma'soem University</p>

        <div className="text-indigo-100 text-sm space-y-2">
          <p><span className="font-semibold text-white">Email:</span> auliaaratri06@gmail.com</p>
          <p><span className="font-semibold text-white">NIM:</span> 232505016</p>
          <p><span className="font-semibold text-white">Instagram:</span> @auliaaratri_</p>
        </div>

        <div className="mt-6">
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white text-sm font-semibold transition"
          >
            Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
}
