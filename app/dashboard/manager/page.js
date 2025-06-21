'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaChartPie,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

import DashboardOverview from '@/components/DashboardOverview';
import Laporan from '@/components/Laporan';

const sections = {
  dashboard: 'dashboard',
  laporan: 'laporan',
};

const menuItems = [
  { key: sections.dashboard, label: 'Dashboard', icon: FaChartPie },
  { key: sections.laporan, label: 'Laporan', icon: FaFileAlt },
];

export default function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState(sections.dashboard);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case sections.dashboard:
        return <DashboardOverview />;
      case sections.laporan:
        return <Laporan />;
      default:
        return <div className="text-gray-600">Pilih menu di sidebar</div>;
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-purple-200 via-blue-200 to-green-200 text-gray-800 overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-white/90 backdrop-blur-lg shadow-md border-r border-indigo-300 p-6 flex-col justify-between">
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

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-64 h-full bg-white/90 backdrop-blur-lg shadow-lg z-50 p-6 flex flex-col justify-between md:hidden transition-transform">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-700">Fairelapparel</h2>
                <button
                  className="text-gray-600"
                  onClick={() => setIsSidebarOpen(false)}
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

      {/* Hamburger Button - Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow-md p-2"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars size={20} className="text-indigo-700" />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pl-14 md:pl-8">
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <span>Inventory System - Fairelapparel</span>
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
            Manager
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4 capitalize">
          {activeSection}
        </h1>
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
