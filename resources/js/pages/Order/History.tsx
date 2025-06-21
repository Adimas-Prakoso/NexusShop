import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, AlertTriangle } from 'lucide-react';

interface Order {
  id: string;
  product_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  payment_method: string;
}

interface Props {
  orders: Order[];
}

const statusColors = {
  pending: {
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-500/30',
    text: 'text-yellow-300',
    icon: Clock
  },
  completed: {
    bg: 'bg-emerald-900/30',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    icon: ShoppingBag
  },
  failed: {
    bg: 'bg-red-900/30',
    border: 'border-red-500/30',
    text: 'text-red-300',
    icon: AlertTriangle
  },
};

export default function OrderHistory({ orders }: Props) {
  return (
    <>
      <Head title="Purchase History" />
      
      <div className="min-h-screen py-12 bg-[#0a0a0f] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
                  Purchase History
                </h2>
                <p className="mt-2 text-purple-200/70">
                  View all your past orders and their status.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-500/20">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-purple-900/20 text-left text-xs font-medium text-purple-300 uppercase tracking-wider rounded-tl-lg">
                        Order ID
                      </th>
                      <th className="px-6 py-3 bg-purple-900/20 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 bg-purple-900/20 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 bg-purple-900/20 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-purple-900/20 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 bg-purple-900/20 text-left text-xs font-medium text-purple-300 uppercase tracking-wider rounded-tr-lg">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/20">
                    {orders.map((order, index) => {
                      const StatusIcon = statusColors[order.status].icon;
                      return (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-purple-900/5 backdrop-blur-sm hover:bg-purple-900/10 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-100">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                            {order.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                            Rp {order.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={`${statusColors[order.status].bg} ${statusColors[order.status].border} ${statusColors[order.status].text} flex items-center gap-1.5`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                            {order.payment_method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                            {format(new Date(order.created_at), 'dd MMM yyyy HH:mm')}
                          </td>
                        </motion.tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-purple-200/70">
                          <div className="flex flex-col items-center gap-2">
                            <ShoppingBag className="w-8 h-8 text-purple-500/50" />
                            <p>No orders found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
} 