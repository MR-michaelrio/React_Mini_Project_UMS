"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function BarangPage() {
  const [barangs, setBarangs] = useState([]);
  const [form, setForm] = useState({ kode: "", nama: "", kategori: "", harga: 0 });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/barangs");
    setBarangs(res.data.data ?? res.data);
  };

  const saveData = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/barangs/${editingId}`, form);
    } else {
      await api.post("/barangs", form);
    }
    setForm({ kode: "", nama: "", kategori: "", harga: 0 });
    setEditingId(null);
    fetchData();
  };

  const deleteData = async (id) => {
    if (!confirm("Yakin hapus data ini?")) return;
    try {
      await api.delete(`/barangs/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus");
    }
  };

  const editData = (barang) => {
    setForm({
      kode: barang.kode,
      nama: barang.nama,
      kategori: barang.kategori,
      harga: barang.harga,
    });
    setEditingId(barang.id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Barang</h1>

        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Barang" : "Tambah Barang"}
          </h3>
          <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              placeholder="Kode"
              value={form.kode}
              onChange={(e) => setForm({ ...form, kode: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
            <input
              placeholder="Nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
            <input
              placeholder="Kategori"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
            <input
              placeholder="Harga"
              type="number"
              value={form.harga}
              onChange={(e) => setForm({ ...form, harga: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
            <div className="col-span-1 md:col-span-2 flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {editingId ? "Update" : "Simpan"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ kode: "", nama: "", kategori: "", harga: 0 });
                    setEditingId(null);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Daftar Barang</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kode</th>
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Harga</th>
                  <th className="px-4 py-3 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {barangs.map((b, idx) => (
                  <tr key={b.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2 text-gray-800">{b.kode}</td>
                    <td className="px-4 py-2 text-gray-800">{b.nama}</td>
                    <td className="px-4 py-2 text-gray-800">{b.kategori}</td>
                    <td className="px-4 py-2 text-gray-800">{b.harga}</td>
                    <td className="px-4 py-2 text-gray-800 space-x-2 text-center">
                      <button
                        onClick={() => editData(b)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteData(b.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {barangs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      Belum ada data barang.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
