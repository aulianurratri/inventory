"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Stok Barang", path: "/admin/stok" },
    { name: "Laporan", path: "/admin/laporan" },
    { name: "Supplier", path: "/admin/supplier" },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-5">
      <h1 className="text-2xl font-bold mb-10">Fairel Inventory</h1>
      <ul>
        {navItems.map((item) => (
          <li key={item.path} className={`mb-4 ${pathname === item.path ? "font-bold" : ""}`}>
            <Link href={item.path} className="hover:text-blue-400">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
