"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Mini Project</h1>
        <div className="flex gap-6">
          <Link href="/pelanggan" className="text-gray-700 hover:text-blue-600 font-medium">
            Pelanggan
          </Link>
          <Link href="/barang" className="text-gray-700 hover:text-blue-600 font-medium">
            Barang
          </Link>
          <Link href="/penjualan" className="text-gray-700 hover:text-blue-600 font-medium">
            Penjualan
          </Link>
        </div>
      </div>
    </nav>
  );
}
