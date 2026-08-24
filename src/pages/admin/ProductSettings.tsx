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
        <h2 className="text-2xl font-bold text-gray-900">Product Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage the active preorder product.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.startsWith('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preorder Price ({product.currency})</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₦</span>
              </div>
              <input
                type="number"
                id="price"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                placeholder="2500"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Price should be entered in Naira (e.g., 2500). Kobo conversion is handled automatically.</p>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="preorders_open"
                type="checkbox"
                checked={preordersOpen}
                onChange={(e) => setPreordersOpen(e.target.checked)}
                className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="preorders_open" className="font-medium text-gray-700">Preorders Open</label>
              <p className="text-gray-500">When disabled, no new preorders can be placed. Existing orders are not affected.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-black border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Price History</h3>
        <div className="bg-white shadow overflow-hidden border border-gray-200 sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {history.length === 0 ? (
              <li className="px-4 py-4 sm:px-6 text-sm text-gray-500 text-center">No price history available.</li>
            ) : history.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
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
