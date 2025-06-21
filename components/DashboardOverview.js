'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DashboardOverview() {
  const [barang, setBarang] = useState([]);
  const [totalStok, setTotalStok] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchStats = async () => {
    const barangSnapshot = await getDocs(collection(db, 'barang'));
    const barangList = barangSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBarang(barangList);

    const total = barangList.reduce((acc, item) => acc + (item.stok || 0), 0);
    setTotalStok(total);

    const supplierSnapshot = await getDocs(collection(db, 'suppliers'));
    setSupplierCount(supplierSnapshot.docs.length);
  };

  const fetchChartData = async (filterDate = null) => {
    try {
      let barangRef = collection(db, 'barang');

      if (filterDate instanceof Date && !isNaN(filterDate)) {
        const start = new Date(filterDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filterDate);
        end.setHours(23, 59, 59, 999);

        barangRef = query(
          barangRef,
          where('tanggalInput', '>=', Timestamp.fromDate(start)),
          where('tanggalInput', '<=', Timestamp.fromDate(end))
        );
      }

      const snapshot = await getDocs(barangRef);
      const items = snapshot.docs.map(doc => doc.data());

      const grouped = {};
      items.forEach(item => {
        const key = item.kategori || item.nama || 'Lainnya';
        grouped[key] = (grouped[key] || 0) + Number(item.stok);
      });

      const formattedData = Object.keys(grouped).map(kategori => ({
        kategori,
        stok: grouped[kategori],
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error('Gagal mengambil data chart:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchChartData(new Date());
  }, []);

  const handleSearch = () => {
    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      fetchChartData(new Date(selectedDate));
    }
  };

  const handleReset = () => {
    const today = new Date();
    setSelectedDate(today);
    fetchChartData(today);
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-8 py-6 bg-gray-50 rounded-3xl shadow-lg">
      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-indigo-100 text-indigo-800 p-5 rounded-2xl shadow w-full">
          <h3 className="text-lg font-semibold mb-1">Total Barang</h3>
          <p className="text-3xl font-bold">{barang.length}</p>
        </div>

        <div className="bg-pink-100 text-pink-800 p-5 rounded-2xl shadow w-full">
          <h3 className="text-lg font-semibold mb-1">Supplier Aktif</h3>
          <p className="text-3xl font-bold">{supplierCount}</p>
          <p className="text-sm text-gray-600 mt-1">Jumlah total supplier terdaftar</p>
        </div>

        <div className="bg-blue-100 text-blue-800 p-5 rounded-2xl shadow w-full">
          <h3 className="text-lg font-semibold mb-1">Total Stok Barang</h3>
          <p className="text-3xl font-bold">{totalStok.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Grafik dan Filter */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd MMMM yyyy"
            placeholderText="Pilih Tanggal"
            className="border rounded-xl px-4 py-2 w-full sm:w-auto"
          />
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition w-full sm:w-auto"
            >
              🔍 Cari
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-300 text-black px-4 py-2 rounded-xl hover:bg-gray-400 transition w-full sm:w-auto"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        <div className="w-full h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="kategori" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stok" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 italic mt-10">
              Tidak ada data untuk ditampilkan.
            </p>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .print-area, .print-area * {
            visibility: visible;
          }

          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px;
          }

          .no-print {
            display: none !important;
          }

          table {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
