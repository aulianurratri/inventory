'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaChartPie,
  FaBox,
  FaUserFriends,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

import DashboardOverview from '@/components/DashboardOverview';
import BarangCRUD from '@/components/BarangCRUD';
import SupplierCRUD from '@/components/SupplierCRUD';
import Laporan from '@/components/Laporan';

const sections = {
  dashboard: 'dashboard',
  barang: 'barang',
  supplier: 'supplier',
  laporan: 'laporan',
};

const menuItems = [
  { key: sections.dashboard, label: 'Dashboard', icon: FaChartPie },
  { key: sections.barang, label: 'Barang', icon: FaBox },
  { key: sections.supplier, label: 'Supplier', icon: FaUserFriends },
  { key: sections.laporan, label: 'Laporan', icon: FaFileAlt },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(sections.dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const role = 'admin'; // change to 'staff' for staff dashboard

  const handleLogout = () => {
    router.push('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case sections.dashboard:
        return <DashboardOverview />;
      case sections.barang:
        return <BarangCRUD role={role} />;
      case sections.supplier:
        return <SupplierCRUD />;
      case sections.laporan:
        return <Laporan />;
      default:
        return <div className="text-gray-600">Select menu from sidebar</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-green-200 text-gray-800 relative">
      {/* Hamburger Button (Mobile only) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <FaBars size={20} className="text-indigo-700" />
      </button>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 bg-white/90 backdrop-blur-lg shadow-md border-r border-indigo-300 p-6 flex-col justify-between z-30">
        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Fairelapparel</h2>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === item.key
                    ? 'bg-indigo-300 text-indigo-900 shadow-lg'
                    : 'hover:bg-indigo-100 text-gray-700'
                }`}
              >
                <item.icon className="mr-2 text-indigo-600" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all mt-6"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </aside>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-64 h-full bg-white/90 backdrop-blur-lg shadow-lg z-50 p-6 flex flex-col justify-between md:hidden">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-700">Fairelapparel</h2>
                <button
                  className="text-gray-600"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSection(item.key);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === item.key
                        ? 'bg-indigo-300 text-indigo-900 shadow-lg'
                        : 'hover:bg-indigo-100 text-gray-700'
                    }`}
                  >
                    <item.icon className="mr-2 text-indigo-600" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all mt-6"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-8 pl-14 md:pl-8 h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <span>Inventory System - Fairelapparel</span>
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-indigo-800 mb-4 capitalize">
          {activeSection}
        </h1>
        <div className="bg-white rounded-3xl shadow-xl p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
