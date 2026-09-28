'use client';
import { useState } from 'react';

export default function TransactionForm({ onTransactionSaved }: { onTransactionSaved: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    try {
      // Mengarah ke endpoint milik Programmer 2
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          nominal: Number(payload.nominal)
        })
      });

      if (!response.ok) {
        if (response.status === 401) window.location.href = '/login'; // Handle sesi berakhir
        throw new Error('Gagal menyimpan transaksi');
      }

      setSuccess('Transaksi berhasil disimpan!');
      e.currentTarget.reset();
      onTransactionSaved(); // Picu penyegaran data dasbor secara asinkron
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white space-y-4">
      <h3 className="font-semibold text-lg">Tambah Transaksi Baru</h3>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Jenis</label>
          <select name="jenis" required className="w-full border p-2 rounded">
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Nominal</label>
          <input type="number" name="nominal" required min="1" className="w-full border p-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Keterangan</label>
        <input type="text" name="keterangan" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm mb-1">Tanggal</label>
        <input type="date" name="tanggal" required className="w-full border p-2 rounded" />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
      </button>
    </form>
  );
}