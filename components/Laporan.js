'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export default function Laporan() {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState('hari');
  const [tanggal, setTanggal] = useState('');
  const laporanRef = useRef(null);

  const today = new Date().toLocaleDateString('id-ID');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let q = collection(db, 'barang');

    if (tanggal) {
      let startDate, endDate;

      if (filterType === 'hari') {
        const input = new Date(tanggal);
        if (isNaN(input)) return;
        startDate = new Date(input.setHours(0, 0, 0, 0));
        endDate = new Date(input.setHours(23, 59, 59, 999));
      } else if (filterType === 'bulan') {
        const [year, month] = tanggal.split('-');
        if (!year || !month) return;
        startDate = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0);
        endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      } else if (filterType === 'tahun') {
        const year = Number(tanggal);
        if (isNaN(year)) return;
        startDate = new Date(year, 0, 1, 0, 0, 0);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      }

      if (startDate && endDate) {
        q = query(
          q,
          where('tanggalInput', '>=', Timestamp.fromDate(startDate)),
          where('tanggalInput', '<=', Timestamp.fromDate(endDate)),
          orderBy('tanggalInput', 'desc')
        );
      }
    } else {
      q = query(q, orderBy('tanggalInput', 'desc'));
    }

    const snapshot = await getDocs(q);
    const barang = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(barang);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handlePrint = () => {
    window.print();
  };

  const getFilterTitle = () => {
    if (!tanggal) return 'Semua Data';

    if (filterType === 'hari') {
      return `Tanggal ${new Date(tanggal).toLocaleDateString('id-ID')}`;
    }

    if (filterType === 'bulan') {
      const [year, month] = tanggal.split('-');
      return `${new Date(`${year}-${month}-01`).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      })}`;
    }

    if (filterType === 'tahun') {
      return `Tahun ${tanggal}`;
    }
  };

  const generateYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-3xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-800">Laporan Barang</h2>
        <p className="text-gray-600 text-sm mt-1">
          Laporan stok barang berdasarkan tanggal input dan dapat dicetak.
        </p>
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6 no-print"
      >
        <div className="w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Filter Waktu</label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setTanggal('');
            }}
            className="w-full border px-4 py-2 rounded-xl mt-1"
          >
            <option value="hari">Per Hari</option>
            <option value="bulan">Per Bulan</option>
            <option value="tahun">Per Tahun</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700">Pilih {filterType}</label>
          {filterType === 'hari' && (
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border px-4 py-2 rounded-xl mt-1"
            />
          )}

          {filterType === 'bulan' && (
            <div className="flex gap-2 mt-1">
              <select
                value={tanggal.split('-')[1] || ''}
                onChange={(e) => {
                  const year = tanggal.split('-')[0] || new Date().getFullYear();
                  setTanggal(`${year}-${e.target.value}`);
                }}
                className="border px-4 py-2 rounded-xl"
              >
                <option value="">Bulan</option>
                {[
                  '01', '02', '03', '04', '05', '06',
                  '07', '08', '09', '10', '11', '12',
                ].map((m, i) => (
                  <option key={m} value={m}>
                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>

              <select
                value={tanggal.split('-')[0] || ''}
                onChange={(e) => {
                  const month = tanggal.split('-')[1] || '01';
                  setTanggal(`${e.target.value}-${month}`);
                }}
                className="border px-4 py-2 rounded-xl"
              >
                <option value="">Tahun</option>
                {generateYearOptions().map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {filterType === 'tahun' && (
            <select
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full border px-4 py-2 rounded-xl mt-1"
            >
              <option value="">Pilih Tahun</option>
              {generateYearOptions().map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl"
          >
            🔍 Cari
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl"
          >
            🖨️ Cetak
          </button>
        </div>
      </form>

      {/* Laporan Table */}
      <div ref={laporanRef} className="print-area">
        <div className="text-center mb-4 print:block hidden">
          <h1 className="text-xl font-bold">Laporan Stok Barang</h1>
          <p className="text-sm">{getFilterTitle()}</p>
          <p className="text-sm">Dicetak: {today}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-xl shadow border border-gray-200 print:text-black">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700 text-left print:bg-white print:text-black">
                <th className="py-3 px-4 border-b whitespace-nowrap">Kode Barang</th>
                <th className="py-3 px-4 border-b whitespace-nowrap">Nama</th>
                <th className="py-3 px-4 border-b whitespace-nowrap">Stok</th>
                <th className="py-3 px-4 border-b whitespace-nowrap">Harga Jual</th>
                <th className="py-3 px-4 border-b whitespace-nowrap">Tanggal Input</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                    <td className="py-2 px-4 border-b whitespace-nowrap">{item.kode}</td>
                    <td className="py-2 px-4 border-b whitespace-nowrap">{item.nama}</td>
                    <td className="py-2 px-4 border-b whitespace-nowrap">{item.stok}</td>
                    <td className="py-2 px-4 border-b whitespace-nowrap">
                      Rp{item.hargaJual?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-4 border-b whitespace-nowrap">
                      {item.tanggalInput?.toDate?.().toLocaleDateString('id-ID') || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 italic">
                    Tidak ada data barang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-right print:block hidden">
          <p>Jatinangor, {today}</p>
          <p style={{ marginTop: '60px' }}><strong>_________________________</strong></p>
          <p><em>Manajer</em></p>
        </div>
      </div>

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
          th, td {
            padding: 8px;
            border: 1px solid #000;
          }
        }
      `}</style>
    </div>
  );
}
