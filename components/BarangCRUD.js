'use client';

import { useEffect, useState } from 'react';
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

export default function BarangCRUD({ role = 'staff' }) {
  const [nama, setNama] = useState('');
  const [satuan, setSatuan] = useState('');
  const [stok, setStok] = useState('');
  const [hargaDasar, setHargaDasar] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [gambar, setGambar] = useState(null);
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [tanggalFilter, setTanggalFilter] = useState('');

  const barangRef = collection(db, 'barang');

  const getData = async (tanggal = '') => {
    const snapshot = await getDocs(barangRef);
    let newData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (tanggal) {
      newData = newData.filter(item => {
        const itemDate = item.tanggalInput?.toDate?.().toISOString().slice(0, 10);
        return itemDate === tanggal;
      });
    }

    newData.sort((a, b) => a.tanggalInput?.seconds - b.tanggalInput?.seconds);
    setData(newData);
  };

  useEffect(() => {
    getData(tanggalFilter);
  }, [tanggalFilter]);

  const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file: base64 }),
          });
          const result = await res.json();
          resolve(result.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !satuan || !stok || !hargaDasar || !hargaJual) return;

    const inputData = {
      nama,
      satuan,
      stok: parseInt(stok),
      hargaDasar: parseInt(hargaDasar),
      hargaJual: parseInt(hargaJual),
    };

    let gambarUrl = '';
    if (gambar) {
      try {
        gambarUrl = await uploadToCloudinary(gambar);
      } catch (err) {
        alert('Gagal upload gambar');
        return;
      }
    }

    if (editId) {
      const confirmed = window.confirm("Yakin ingin mengedit data ini?");
      if (!confirmed) return;

      const docRef = doc(db, 'barang', editId);
      const updateData = gambar ? { ...inputData, gambar: gambarUrl } : inputData;
      await updateDoc(docRef, updateData);
      setEditId(null);
      alert('Data berhasil diperbarui!');
    } else {
      const snapshot = await getDocs(barangRef);
      const existing = snapshot.docs.map(doc => doc.data().kode);
      let maxNumber = 0;
      existing.forEach(kode => {
        const num = parseInt(kode?.replace('BRG', ''));
        if (!isNaN(num) && num > maxNumber) maxNumber = num;
      });

      const newKode = `BRG${String(maxNumber + 1).padStart(3, '0')}`;
      const newData = {
        ...inputData,
        kode: newKode,
        tanggalInput: Timestamp.now(),
        gambar: gambarUrl,
      };
      await addDoc(barangRef, newData);
      alert('Data berhasil disimpan!');
    }

    setNama('');
    setSatuan('');
    setStok('');
    setHargaDasar('');
    setHargaJual('');
    setGambar(null);
    getData(tanggalFilter);
  };

  const handleEdit = (item) => {
    setNama(item.nama);
    setSatuan(item.satuan);
    setStok(item.stok);
    setHargaDasar(item.hargaDasar);
    setHargaJual(item.hargaJual);
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmed) return;
    await deleteDoc(doc(db, 'barang', id));
    alert('Data berhasil dihapus!');
    getData(tanggalFilter);
  };

  const filteredData = data.filter(item =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-3xl shadow-lg">
      <div className="mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-800">Kelola Barang</h2>
        <p className="text-gray-600 text-sm mt-1">Tambah, edit, hapus, atau cari data barang.</p>
      </div>

      {role === 'staff' && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
            <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Masukkan nama barang" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Satuan</label>
            <input type="text" value={satuan} onChange={e => setSatuan(e.target.value)} placeholder="Contoh: pcs, kg, liter" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stok</label>
            <input type="number" value={stok} onChange={e => setStok(e.target.value)} placeholder="Jumlah stok" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga Dasar</label>
            <input type="number" value={hargaDasar} onChange={e => setHargaDasar(e.target.value)} placeholder="Harga dasar barang" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga Jual</label>
            <input type="number" value={hargaJual} onChange={e => setHargaJual(e.target.value)} placeholder="Harga jual barang" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gambar</label>
            <input type="file" accept="image/*" onChange={(e) => setGambar(e.target.files[0])} className="mt-1 block w-full text-sm" />
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row md:justify-end gap-2 mt-2">
            {editId ? (
              <>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-all">Update Barang</button>
                <button type="button" onClick={() => {
                  setEditId(null);
                  setNama('');
                  setSatuan('');
                  setStok('');
                  setHargaDasar('');
                  setHargaJual('');
                  setGambar(null);
                }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg transition-all">Batal</button>
              </>
            ) : (
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-all w-full md:w-auto">Simpan Barang</button>
            )}
          </div>
        </form>
      )}

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama barang..." className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 text-sm" />
        <input type="date" value={tanggalFilter} onChange={(e) => setTanggalFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm md:text-base rounded-lg shadow border border-gray-200">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700 text-left">
              <th className="py-2 px-3 border-b">Kode</th>
              <th className="py-2 px-3 border-b">Nama</th>
              <th className="py-2 px-3 border-b">Satuan</th>
              <th className="py-2 px-3 border-b">Stok</th>
              <th className="py-2 px-3 border-b">Harga Dasar</th>
              <th className="py-2 px-3 border-b">Harga Jual</th>
              <th className="py-2 px-3 border-b">Tanggal Input</th>
              <th className="py-2 px-3 border-b">Gambar</th>
              <th className="py-2 px-3 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-3 border-b">{item.kode}</td>
                <td className="py-2 px-3 border-b">{item.nama}</td>
                <td className="py-2 px-3 border-b">{item.satuan}</td>
                <td className="py-2 px-3 border-b">{item.stok}</td>
                <td className="py-2 px-3 border-b">{item.hargaDasar}</td>
                <td className="py-2 px-3 border-b">{item.hargaJual}</td>
                <td className="py-2 px-3 border-b">{item.tanggalInput?.toDate?.().toLocaleDateString('id-ID') || '-'}</td>
                <td className="py-2 px-3 border-b">
                  {item.gambar ? (
                    <img src={item.gambar} alt={item.nama} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-2 px-3 border-b text-center space-x-2">
                  {role === 'staff' && <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:underline text-xs md:text-sm">Edit</button>}
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline text-xs md:text-sm">Hapus</button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">Data tidak ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
