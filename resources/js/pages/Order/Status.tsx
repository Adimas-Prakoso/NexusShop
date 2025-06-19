import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { 
    FaArrowLeft, 
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner,
    FaInfoCircle,
    FaRedo,
    FaChartLine,
    FaEnvelope,
    FaGlobe,
    FaHashtag,
    FaCalendarAlt,
    FaCreditCard,
    FaExclamationTriangle
} from 'react-icons/fa';

interface Order {
    id: number;
    order_id: string;
    email: string;
    service_name: string;
    target: string;
    quantity: number;
    price: number;
    status: string;
    medanpedia_order_id?: string;
    start_count?: number;
    remains?: number;
    created_at: string;
    updated_at: string;
}

interface Payment {
    id: number;
    payment_id: string;
    payment_method: string;
    amount: number;
    status: string;
    paid_at?: string;
    transaction_id?: string;
}

interface OrderStatusProps {
    order: Order;
    payment: Payment;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order, payment }) => {
    const [orderStatus, setOrderStatus] = useState(order.status);
    const [checking, setChecking] = useState(false);
    const [progress, setProgress] = useState(0);

    // Check order status periodically
    useEffect(() => {
        const checkStatus = async () => {
            setChecking(true);
            try {
                const response = await fetch(`/order/${order.order_id}/check-status`);
                const data = await response.json();
                setOrderStatus(data.order.status);
                
                // Update progress based on status
                updateProgress(data.order.status);
            } catch (error) {
                console.error('Error checking status:', error);
            } finally {
                setChecking(false);
            }
        };

        // Check status every 30 seconds if order is processing
        const interval = orderStatus === 'processing' ? setInterval(checkStatus, 30000) : null;
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [orderStatus, order.order_id]);

    const updateProgress = (status: string) => {
        switch (status) {
            case 'pending':
                setProgress(25);
                break;
            case 'processing':
                setProgress(50);
                break;
            case 'partial':
                setProgress(75);
                break;
            case 'completed':
                setProgress(100);
                break;
            case 'cancelled':
                setProgress(0);
                break;
            default:
                setProgress(25);
        }
    };

    useEffect(() => {
        updateProgress(orderStatus);
    }, [orderStatus]);

    const getStatusIcon = () => {
        switch (orderStatus) {
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            case 'partial':
                return <FaExclamationTriangle className="text-orange-500" />;
            case 'processing':
                return <FaSpinner className="text-blue-500 animate-spin" />;
            case 'pending':
            default:
                return <FaClock className="text-yellow-500" />;
        }
    };

    const getStatusColor = () => {
        switch (orderStatus) {
            case 'completed':
                return 'text-green-500';
            case 'cancelled':
                return 'text-red-500';
            case 'partial':
                return 'text-orange-500';
            case 'processing':
                return 'text-blue-500';
            case 'pending':
            default:
                return 'text-yellow-500';
        }
    };

    const getStatusDescription = () => {
        switch (orderStatus) {
            case 'completed':
                return 'Your order has been completed successfully!';
            case 'cancelled':
                return 'Your order has been cancelled.';
            case 'partial':
                return 'Your order is partially completed.';
            case 'processing':
                return 'Your order is currently being processed.';
            case 'pending':
            default:
                return 'Your order is waiting to be processed.';
        }
    };

    const getPaymentStatusIcon = () => {
        switch (payment.status) {
            case 'paid':
                return <FaCheckCircle className="text-green-500" />;
            case 'failed':
                return <FaTimesCircle className="text-red-500" />;
            case 'pending':
            default:
                return <FaClock className="text-yellow-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const progressSteps = [
        { id: 'payment', label: 'Payment', description: 'Payment confirmation' },
        { id: 'processing', label: 'Processing', description: 'Order being processed' },
        { id: 'delivery', label: 'Delivery', description: 'Service delivery in progress' },
        { id: 'completed', label: 'Completed', description: 'Order completed' }
    ];

    const getCurrentStep = () => {
        switch (orderStatus) {
            case 'pending':
                return 0;
            case 'processing':
                return 1;
            case 'partial':
                return 2;
            case 'completed':
                return 3;
            default:
                return 0;
        }
    };

    return (
        <>
            <Head title={`Order Status - ${order.order_id} - NexusShop`} />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
                {/* Background Effects */}
                <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
                <div className="fixed inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
                
                <div className="relative z-10 container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <Link
                            href="/products"
                            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Back to Products</span>
                        </Link>
                        
                        <div className="text-right">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Order Status
                            </h1>
                            <p className="text-gray-400">Order #{order.order_id}</p>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Status */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2"
                        >
                            {/* Status Overview */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold flex items-center">
                                        {getStatusIcon()}
                                        <span className="ml-2">Current Status</span>
                                    </h2>
                                    
                                    <motion.button
                                        onClick={() => window.location.reload()}
                                        disabled={checking}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
                                    >
                                        {checking ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                <span>Checking...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaRedo />
                                                <span>Refresh</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className={`text-xl font-bold capitalize ${getStatusColor()}`}>
                                            {orderStatus}
                                        </p>
                                        <p className="text-gray-300">{getStatusDescription()}</p>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full">
                                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-2 rounded-full ${
                                                    orderStatus === 'completed' ? 'bg-green-500' :
                                                    orderStatus === 'cancelled' ? 'bg-red-500' :
                                                    orderStatus === 'partial' ? 'bg-orange-500' :
                                                    'bg-blue-500'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Steps */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
                                
                                <div className="space-y-4">
                                    {progressSteps.map((step, index) => (
                                        <div key={step.id} className="flex items-center space-x-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                index <= getCurrentStep() 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-600 text-gray-400'
                                            }`}>
                                                {index <= getCurrentStep() ? (
                                                    <FaCheckCircle className="text-sm" />
                                                ) : (
                                                    <span className="text-xs font-bold">{index + 1}</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <p className={`font-medium ${
                                                    index <= getCurrentStep() ? 'text-white' : 'text-gray-400'
                                                }`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-sm text-gray-400">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Statistics */}
                            {(order.start_count !== null || order.remains !== null) && (
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <FaChartLine className="mr-2 text-blue-400" />
                                        Order Statistics
                                    </h3>
                                    
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-400">{order.quantity.toLocaleString('id-ID')}</p>
                                            <p className="text-gray-300 text-sm">Ordered</p>
                                        </div>
                                        
                                        {order.start_count && (
                                            <div className="text-center p-4 bg-green-900/20 rounded-lg">
                                                <p className="text-2xl font-bold text-green-400">{order.start_count.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-300 text-sm">Start Count</p>
                                            </div>
                                        )}
                                        
                                        {order.remains !== null && (
                                            <div className="text-center p-4 bg-orange-900/20 rounded-lg">
                                                <p className="text-2xl font-bold text-orange-400">{order.remains.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-300 text-sm">Remaining</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Order Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1 space-y-6"
                        >
                            {/* Order Information */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                                
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start space-x-3">
                                        <FaHashtag className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-gray-300">Order ID</p>
                                            <p className="text-white font-medium">{order.order_id}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <FaEnvelope className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-gray-300">Email</p>
                                            <p className="text-white font-medium">{order.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <FaGlobe className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-gray-300">Service</p>
                                            <p className="text-white font-medium">{order.service_name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <FaGlobe className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-gray-300">Target</p>
                                            <p className="text-white font-medium break-all">{order.target}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <FaHashtag className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-gray-300">Quantity</p>
                                            <p className="text-white font-medium">{order.quantity.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3">
                                        <FaCalendarAlt className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-gray-300">Order Date</p>
                                            <p className="text-white font-medium">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>

                                    {order.medanpedia_order_id && (
                                        <div className="flex items-start space-x-3">
                                            <FaHashtag className="text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-gray-300">Provider Order ID</p>
                                                <p className="text-white font-medium">{order.medanpedia_order_id}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FaCreditCard className="mr-2 text-blue-400" />
                                    Payment Details
                                </h3>
                                
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Status:</span>
                                        <div className="flex items-center space-x-1">
                                            {getPaymentStatusIcon()}
                                            <span className={`font-medium capitalize ${
                                                payment.status === 'paid' ? 'text-green-500' :
                                                payment.status === 'failed' ? 'text-red-500' :
                                                'text-yellow-500'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Method:</span>
                                        <span className="text-white font-medium capitalize">
                                            {payment.payment_method.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Amount:</span>
                                        <span className="text-white font-bold">
                                            Rp {payment.amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    
                                    {payment.paid_at && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Paid At:</span>
                                            <span className="text-white font-medium">
                                                {formatDate(payment.paid_at)}
                                            </span>
                                        </div>
                                    )}

                                    {payment.transaction_id && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Transaction ID:</span>
                                            <span className="text-white font-medium text-xs">
                                                {payment.transaction_id}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Support Information */}
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                                    <div className="text-sm text-gray-300">
                                        <p className="font-medium mb-2">Need Help?</p>
                                        <ul className="space-y-1 text-xs">
                                            <li>• Orders typically start within 0-24 hours</li>
                                            <li>• Delivery time varies by service type</li>
                                            <li>• Contact support for any issues</li>
                                            <li>• Refill guarantee available for applicable services</li>
                                        </ul>
                                        
                                        <div className="mt-4">
                                            <Link
                                                href="/products"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                                            >
                                                Order Again
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderStatus;