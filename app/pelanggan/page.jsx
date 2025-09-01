"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function PelangganPage() {
  const [pelanggans, setPelanggans] = useState([]);
  const [form, setForm] = useState({ kode:"", nama:"", domisili:"", jenis_kelamin:"PRIA" });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/pelanggans");
    setPelanggans(res.data.data ?? res.data);
  };

  const saveData = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/pelanggans/${editingId}`, form);
    } else {
      await api.post("/pelanggans", form);
    }
    setForm({ kode:"", nama:"", domisili:"", jenis_kelamin:"PRIA" });
    setEditingId(null);
    fetchData();
  };

  const editData = (pelanggan) => {
    setForm({
      kode: pelanggan.kode,
      nama: pelanggan.nama,
      domisili: pelanggan.domisili,
      jenis_kelamin: pelanggan.jenis_kelamin,
    });
    setEditingId(pelanggan.id);
  };

  const deleteData = async (id) => {
    if (!confirm("Yakin hapus data ini?")) return;
    try {
      await api.delete(`/pelanggans/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus");
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Pelanggan</h2>

        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Data Pelanggan" : "Tambah Pelanggan"}
          </h3>
          <form onSubmit={saveData} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Kode"
              value={form.kode}
              onChange={e => setForm({...form, kode: e.target.value})}
            />
            <input
              className="border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Nama"
              value={form.nama}
              onChange={e => setForm({...form, nama: e.target.value})}
            />
            <input
              className="border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Domisili"
              value={form.domisili}
              onChange={e => setForm({...form, domisili: e.target.value})}
            />
            <select
              className="border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-blue-200 focus:outline-none"
              value={form.jenis_kelamin}
              onChange={e => setForm({...form, jenis_kelamin: e.target.value})}
            >
              <option value="PRIA">PRIA</option>
              <option value="WANITA">WANITA</option>
            </select>

            <div className="col-span-1 md:col-span-4 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                {editingId ? "Update" : "Simpan"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ kode:"", nama:"", domisili:"", jenis_kelamin:"PRIA" });
                    setEditingId(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Daftar Pelanggan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-3 font-semibold">Kode</th>
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">Domisili</th>
                  <th className="px-4 py-3 font-semibold">Gender</th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pelanggans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  pelanggans.map((p, i) => (
                    <tr
                      key={p.id}
                      className={i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                    >
                      <td className="px-4 py-2 text-gray-800">{p.kode}</td>
                      <td className="px-4 py-2 text-gray-800">{p.nama}</td>
                      <td className="px-4 py-2 text-gray-800">{p.domisili}</td>
                      <td className="px-4 py-2 text-gray-800">{p.jenis_kelamin}</td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => editData(p)}
                          className="bg-yellow-500  hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteData(p.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
