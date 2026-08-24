import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [markingReady, setMarkingReady] = useState(false);
  const [message, setMessage] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleMarkReady = async () => {
    if (!confirm('Are you sure you want to mark this preorder as READY? This will trigger an email notification to the customer.')) return;
    
    setMarkingReady(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/orders/ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Order successfully marked as READY and email sent.');
        fetchOrder();
      } else {
        setMessage(data.error || 'Failed to mark as ready');
      }
    } catch (err) {
      setMessage('A network error occurred');
    } finally {
      setMarkingReady(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Link to="/admin/orders" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
      </div>

      {message && (
        <div className="p-4 rounded-md bg-blue-50 text-blue-800">
          {message}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Preorder Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and payment status.</p>
          </div>
          {order.payment_status === 'PAID' && order.order_status !== 'READY' && order.order_status !== 'CUSTOMER_NOTIFIED' && (
            <button
              onClick={handleMarkReady}
              disabled={markingReady}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {markingReady ? 'Processing...' : 'Mark as Ready'}
            </button>
          )}
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.customer_name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.customer_email}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(order.total_amount, order.currency)} ({order.quantity} reserved)</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Payment Reference</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono text-xs">{order.payment_reference}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-32 text-gray-500">Payment:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.payment_status}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-32 text-gray-500">Order:</span>
                  <span className="font-semibold">{order.order_status}</span>
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email Notifications</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className={`w-4 h-4 mr-2 ${order.confirmation_email_sent ? 'text-green-500' : 'text-gray-300'}`} />
                  Confirmation Email: {order.confirmation_email_sent ? 'Sent' : 'Pending'}
                </div>
                <div className="flex items-center text-sm">
                  <Mail className={`w-4 h-4 mr-2 ${order.ready_email_sent ? 'text-green-500' : 'text-gray-300'}`} />
                  Copy Ready Email: {order.ready_email_sent ? 'Sent' : 'Pending'}
                </div>
                <div className="flex items-center text-sm">
                  <Mail className={`w-4 h-4 mr-2 ${order.release_email_sent ? 'text-green-500' : 'text-gray-300'}`} />
                  Release Email: {order.release_email_sent ? 'Sent' : 'Pending'}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
