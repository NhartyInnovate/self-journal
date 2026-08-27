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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Link to="/admin/orders" className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center text-gray-500 hover:text-[#111111] hover:shadow-sm transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-serif font-bold text-[#111111]">Order Details</h2>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes('error') || message.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-[#70C12E]/10 text-[#70C12E]'}`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow-sm overflow-hidden rounded-3xl border border-[#EAEAEA]">
        <div className="px-8 py-6 flex justify-between items-center border-b border-[#EAEAEA]">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#111111]">Preorder Information</h3>
            <p className="mt-1 text-sm text-gray-500">Personal details and payment status.</p>
          </div>
          {order.payment_status === 'PAID' && order.order_status !== 'READY' && order.order_status !== 'CUSTOMER_NOTIFIED' && (
            <button
              onClick={handleMarkReady}
              disabled={markingReady}
              className="inline-flex items-center px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-[#111111] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111111] disabled:opacity-50 transition-colors"
            >
              {markingReady ? 'Processing...' : 'Mark as Ready'}
            </button>
          )}
        </div>
        <div className="px-8 py-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 mb-1">Customer Name</dt>
              <dd className="text-base font-semibold text-[#111111]">{order.customer_name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 mb-1">Email address</dt>
              <dd className="text-base font-semibold text-[#111111]">{order.customer_email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 mb-1">Total Amount</dt>
              <dd className="text-base font-semibold text-[#111111]">{formatCurrency(order.total_amount, order.currency)} <span className="text-gray-400 font-normal ml-1">({order.quantity} reserved)</span></dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 mb-1">Payment Reference</dt>
              <dd className="text-sm font-mono text-gray-600 bg-gray-50 p-2 rounded-md inline-block">{order.payment_reference}</dd>
            </div>
            
            <div className="sm:col-span-2 border-t border-[#EAEAEA] pt-8 mt-2">
              <dt className="text-sm font-medium text-gray-500 mb-4">Status Overview</dt>
              <dd className="flex flex-col sm:flex-row sm:gap-12 gap-6">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Payment</span>
                  <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${order.payment_status === 'PAID' ? 'bg-[#70C12E]/10 text-[#70C12E]' : 'bg-[#F29F1C]/10 text-[#F29F1C]'}`}>
                    {order.payment_status}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Order</span>
                  <span className="text-base font-semibold text-[#111111]">{order.order_status}</span>
                </div>
              </dd>
            </div>
            
            <div className="sm:col-span-2 border-t border-[#EAEAEA] pt-8 mt-2">
              <dt className="text-sm font-medium text-gray-500 mb-4">Email Notifications Log</dt>
              <dd className="space-y-4">
                <div className="flex items-center text-sm p-3 rounded-xl border border-[#EAEAEA] bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${order.confirmation_email_sent ? 'bg-[#70C12E]/10 text-[#70C12E]' : 'bg-gray-200 text-gray-400'}`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Preorder Confirmation</p>
                    <p className="text-gray-500 text-xs">{order.confirmation_email_sent ? 'Delivered successfully' : 'Pending payment'}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm p-3 rounded-xl border border-[#EAEAEA] bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${order.ready_email_sent ? 'bg-[#70C12E]/10 text-[#70C12E]' : 'bg-gray-200 text-gray-400'}`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Copy Ready Notification</p>
                    <p className="text-gray-500 text-xs">{order.ready_email_sent ? 'Delivered successfully' : 'Pending manual trigger'}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm p-3 rounded-xl border border-[#EAEAEA] bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${order.release_email_sent ? 'bg-[#70C12E]/10 text-[#70C12E]' : 'bg-gray-200 text-gray-400'}`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Official Release Broadcast</p>
                    <p className="text-gray-500 text-xs">{order.release_email_sent ? 'Delivered successfully' : 'Pending cron job'}</p>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
