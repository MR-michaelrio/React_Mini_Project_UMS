"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function PenjualanPage() {
  const [penjualans, setPenjualans] = useState([]);
  const [pelanggans, setPelanggans] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [nota, setNota] = useState("");
  const [tgl, setTgl] = useState("");
  const [kodePelanggan, setKodePelanggan] = useState("");
  const [items, setItems] = useState([{ kode_barang: "", qty: 1 }]);
  const [hydrated, setHydrated] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const resPenjualan = await api.get("/penjualans");
    setPenjualans(resPenjualan.data.data ?? resPenjualan.data);

    const resPelanggan = await api.get("/pelanggans");
    setPelanggans(resPelanggan.data.data ?? resPelanggan.data);

    const resBarang = await api.get("/barangs");
    setBarangs(resBarang.data.data ?? resBarang.data);
  };

  const saveData = async (e) => {
    e.preventDefault();
    const payload = { nota, tgl, kode_pelanggan: kodePelanggan, items };
    try {
      if (editingId) {
        await api.put(`/penjualans/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/penjualans", payload);
      }
      setNota("");
      setTgl("");
      setKodePelanggan("");
      setItems([{ kode_barang: "", qty: 1 }]);
      fetchData();
    } catch (err) {
      console.error("Error response:", err.response?.data);
      alert("Gagal simpan: " + JSON.stringify(err.response?.data?.errors));
    }
  };

  const editData = (p) => {
    setEditingId(p.id);
    setNota(p.nota);
    setTgl(p.tgl);
    setKodePelanggan(p.pelanggan?.kode ?? "");
    setItems(
      p.items?.map((it) => ({
        kode_barang: it.barang?.kode ?? "",
        qty: it.qty,
      })) ?? [{ kode_barang: "", qty: 1 }]
    );
  };

  const deleteData = async (id) => {
    if (!confirm("Yakin hapus data ini?")) return;
    try {
      await api.delete(`/penjualans/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus");
    }
  };

  useEffect(() => {
    setHydrated(true);
    fetchData();
  }, []);
  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Penjualan</h1>
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Data Penjualan" : "Penjualan"}
          </h3>
          <form
            onSubmit={saveData}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full focus:ring focus:ring-blue-200"
              />
              <input
                type="date"
                value={tgl}
                onChange={(e) => setTgl(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full focus:ring focus:ring-blue-200"
              />
              <select
                value={kodePelanggan}
                onChange={(e) => setKodePelanggan(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full focus:ring focus:ring-blue-200"
              >
                <option value="">-- pilih pelanggan --</option>
                {pelanggans.map((p) => (
                  <option key={p.id} value={p.kode}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <select
                    value={it.kode_barang}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].kode_barang = e.target.value;
                      setItems(newItems);
                    }}
                    className="border px-3 py-2 rounded-lg flex-1"
                  >
                    <option value="">-- pilih barang --</option>
                    {barangs.map((b) => (
                      <option key={b.id} value={b.kode}>
                        {b.nama}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].qty = parseInt(e.target.value) || 1;
                      setItems(newItems);
                    }}
                    className="border px-3 py-2 rounded-lg w-20"
                  />

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = items.filter((_, i) => i !== idx);
                        setItems(newItems);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setItems([...items, { kode_barang: "", qty: 1 }])
                }
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                + Barang
              </button>
            </div>

            <div className="space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                {editingId ? "Update" : "Simpan"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNota("");
                    setTgl("");
                    setKodePelanggan("");
                    setItems([{ kode_barang: "", qty: 1 }]);
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Daftar Penjualan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-3 font-semibold">Nota</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Pelanggan</th>
                  <th className="px-4 py-3 font-semibold">Subtotal</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {penjualans.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">{p.nota}</td>
                    <td className="px-4 py-2 text-gray-800">{p.tgl}</td>
                    <td className="px-4 py-2 text-gray-800">
                      {p.pelanggan?.nama}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {p.subtotal}
                    </td>
                    <td className="px-4 py-2 text-gray-800 text-center space-x-2">
                      <button
                        onClick={() => editData(p)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
