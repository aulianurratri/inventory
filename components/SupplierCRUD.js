'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SupplierCRUD() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ nama: '', telepon: '', alamat: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.telepon || !form.alamat) return;

    if (editId) {
      const confirmEdit = confirm('Yakin ingin mengedit data ini?');
      if (!confirmEdit) return;
      const supplierRef = doc(db, 'suppliers', editId);
      await updateDoc(supplierRef, form);
      setMessage('Data berhasil diperbarui');
      setEditId(null);
    } else {
      await addDoc(collection(db, 'suppliers'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setMessage('Data berhasil disimpan');
    }
    setForm({ nama: '', telepon: '', alamat: '' });
  };

  const handleEdit = (id) => {
    const data = suppliers.find((s) => s.id === id);
    setForm(data);
    setEditId(id);
  };

  const handleCancelEdit = () => {
    setForm({ nama: '', telepon: '', alamat: '' });
    setEditId(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Yakin ingin menghapus data ini?');
    if (!confirmDelete) return;
    const supplierRef = doc(db, 'suppliers', id);
    await deleteDoc(supplierRef);
    setMessage('Data berhasil dihapus');
  };

  const handleSort = () => {
    setSortAsc(!sortAsc);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setSuppliers(data);
    });
    return () => unsub();
  }, []);

  const filteredSuppliers = suppliers
    .filter((supplier) =>
      supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.telepon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.alamat.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.nama.toLowerCase();
      const nameB = b.nama.toLowerCase();
      if (sortAsc) {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-3xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-800">Manajemen Supplier</h2>
        <p className="text-gray-600 text-sm mt-1">Tambah, edit, atau hapus data supplier.</p>
      </div>

      {message && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded-xl p-3 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Supplier</label>
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            type="text"
            placeholder="Masukkan nama supplier"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
          <input
            name="telepon"
            value={form.telepon}
            onChange={handleChange}
            type="tel"
            placeholder="0812xxxxxxx"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Alamat</label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            placeholder="Alamat lengkap supplier"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          ></textarea>
        </div>
        <div className="md:col-span-2 flex flex-wrap justify-end gap-2 mt-2">
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            {editId ? 'Update Supplier' : 'Simpan Supplier'}
          </button>
        </div>
      </form>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Cari berdasarkan nama, telepon, atau alamat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-1/2"
        />
        <button
          onClick={handleSort}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
        >
          Urutkan Nama: {sortAsc ? 'A-Z' : 'Z-A'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm rounded-lg shadow border border-gray-200">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700 text-left">
              <th className="py-3 px-4 border-b">Nama</th>
              <th className="py-3 px-4 border-b">Telepon</th>
              <th className="py-3 px-4 border-b">Alamat</th>
              <th className="py-3 px-4 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{supplier.nama}</td>
                <td className="py-3 px-4 border-b">{supplier.telepon}</td>
                <td className="py-3 px-4 border-b">{supplier.alamat}</td>
                <td className="py-3 px-4 border-b text-center space-x-2">
                  <button
                    onClick={() => handleEdit(supplier.id)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                  Tidak ada data supplier yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
