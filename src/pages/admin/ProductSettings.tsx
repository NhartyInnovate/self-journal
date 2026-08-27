import React, { useEffect, useState } from 'react';

export function ProductSettings() {
  const [product, setProduct] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [preordersOpen, setPreordersOpen] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/admin/product');
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        setHistory(data.history || []);
        setName(data.product.name);
        setPrice(data.product.price.toString());
        setPreordersOpen(data.product.preorders_open !== undefined ? data.product.preorders_open : true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const numericPrice = parseInt(price, 10);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setMessage('Error: Price must be a positive integer in Naira.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/product', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: numericPrice,
          preorders_open: preordersOpen
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Settings saved successfully.');
        fetchProduct(); // Refresh history
      } else {
        setMessage(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setMessage('A network error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>No active product found.</div>;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-serif font-bold text-[#111111]">Product Settings</h2>
        <p className="mt-2 text-gray-500">Manage the active preorder product and pricing.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.startsWith('Error') ? 'bg-red-50 text-red-800' : 'bg-[#70C12E]/10 text-[#70C12E]'}`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow-sm border border-[#EAEAEA] rounded-3xl p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#111111] focus:border-[#111111] sm:text-sm transition-colors"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preorder Price ({product.currency})</label>
            <div className="mt-2 relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₦</span>
              </div>
              <input
                type="number"
                id="price"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full pl-9 pr-12 border border-gray-300 rounded-xl py-3 focus:outline-none focus:ring-1 focus:ring-[#111111] focus:border-[#111111] sm:text-sm transition-colors"
                placeholder="2500"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Price should be entered in Naira (e.g., 2500). Kobo conversion is handled automatically.</p>
          </div>

          <div className="flex items-start pt-2">
            <div className="flex items-center h-5">
              <input
                id="preorders_open"
                type="checkbox"
                checked={preordersOpen}
                onChange={(e) => setPreordersOpen(e.target.checked)}
                className="focus:ring-[#111111] h-4 w-4 text-[#111111] border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="preorders_open" className="font-medium text-gray-700 cursor-pointer">Preorders Open</label>
              <p className="text-gray-500">When disabled, no new preorders can be placed. Existing orders are not affected.</p>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#111111] border border-transparent rounded-full shadow-sm py-2.5 px-6 inline-flex justify-center text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111111] disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-serif font-bold text-[#111111] mb-4">Price History</h3>
        <div className="bg-white shadow-sm border border-[#EAEAEA] rounded-3xl overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {history.length === 0 ? (
              <li className="px-6 py-6 text-sm text-gray-500 text-center">No price history available.</li>
            ) : history.map((item) => (
              <li key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="text-sm font-medium text-gray-900">
                  Changed from {formatCurrency(item.old_price, item.currency)} to {formatCurrency(item.new_price, item.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(item.changed_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
