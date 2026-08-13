'use client';

import { useState } from 'react';

export default function ProductFormPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    stockQuantity: '',
    ImageURL: '',
    categoryId: '', 
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/product/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          price: form.price, // Should be string for Prisma Decimal
          stockQuantity: parseInt(form.stockQuantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setSuccessMsg('Product created successfully!');
      setForm({
        name: '',
        description: '',
        price: '',
        sku: '',
        stockQuantity: '',
        ImageURL: '',
        categoryId: '',
      });
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'description', 'price', 'sku', 'stockQuantity', 'ImageURL', 'categoryId'].map(field => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              type={field === 'price' || field === 'stockQuantity' ? 'number' : 'text'}              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required={field !== 'ImageURL'}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {successMsg && <p className="text-green-600 mt-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
    </div>
  );
}
