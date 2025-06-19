import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head, Link } from '@inertiajs/react';
import { 
    FaArrowLeft, 
    FaClock,
    FaQrcode,
    FaUniversity,
    FaMobile,
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner,
    FaInfoCircle,
    FaCopy,
    FaRedo
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
    created_at: string;
}

interface Payment {
    id: number;
    payment_id: string;
    midtrans_order_id: string;
    payment_method: string;
    amount: number;
    status: string;
    qr_code_url?: string;
    va_number?: string;
    expired_at: string;
    midtrans_response?: Record<string, unknown>;
}

interface OrderPaymentProps {
    order: Order;
    payment: Payment;
}

const OrderPayment: React.FC<OrderPaymentProps> = ({ order, payment }) => {
    const [paymentStatus, setPaymentStatus] = useState(payment.status);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isExpired, setIsExpired] = useState(false);
    const [copying, setCopying] = useState(false);
    const [checking, setChecking] = useState(false);

    // Check payment status periodically
    useEffect(() => {
        const checkStatus = async () => {
            setChecking(true);
            try {
                const response = await fetch(`/order/${order.order_id}/check-status`);
                const data = await response.json();
                setPaymentStatus(data.order.payment.status);
                
                if (data.order.payment.status === 'paid') {
                    window.location.href = `/order/${order.order_id}/status`;
                }
            } catch (error) {
                console.error('Error checking status:', error);
            } finally {
                setChecking(false);
            }
        };

        // Check status every 10 seconds if payment is pending
        const interval = paymentStatus === 'pending' ? setInterval(checkStatus, 10000) : null;
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [paymentStatus, order.order_id]);

    // Calculate time remaining
    useEffect(() => {
        const calculateTimeLeft = () => {
            // Check if expired_at exists and is valid
            if (!payment.expired_at) {
                console.log('No expired_at found, setting default 24 hours');
                setTimeLeft('24:00:00');
                setIsExpired(false);
                return;
            }

            try {
                let expiredTime;
                
                // Handle different formats that could come from Laravel/Midtrans
                if (typeof payment.expired_at === 'number') {
                    // Unix timestamp in seconds, convert to milliseconds
                    expiredTime = payment.expired_at * 1000;
                } else if (typeof payment.expired_at === 'string') {
                    // ISO string format from Laravel (e.g., "2024-01-01T12:00:00.000000Z")
                    // Handle both with and without timezone info
                    let dateStr = payment.expired_at;
                    
                    // If no timezone info, assume UTC
                    if (!dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-')) {
                        dateStr = dateStr + 'Z';
                    }
                    
                    expiredTime = new Date(dateStr).getTime();
                    
                    // Check if the date parsing was successful
                    if (isNaN(expiredTime)) {
                        throw new Error('Invalid date format');
                    }
                } else {
                    throw new Error('Invalid expired_at format');
                }

                const now = new Date().getTime();
                const difference = expiredTime - now;

                console.log('Payment expiration calculation:', {
                    expired_at_raw: payment.expired_at,
                    expired_at_type: typeof payment.expired_at,
                    expired_time: new Date(expiredTime).toISOString(),
                    expired_time_local: new Date(expiredTime).toLocaleString(),
                    current_time: new Date(now).toISOString(),
                    current_time_local: new Date(now).toLocaleString(),
                    difference_ms: difference,
                    difference_hours: (difference / (1000 * 60 * 60)).toFixed(2),
                    browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    browser_offset: new Date().getTimezoneOffset()
                });

                if (difference > 0) {
                    const hours = Math.floor(difference / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                    setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                    setIsExpired(false);
                } else {
                    setTimeLeft('00:00:00');
                    setIsExpired(true);
                }
            } catch (error) {
                console.error('Error calculating time left:', error, {
                    expired_at: payment.expired_at,
                    type: typeof payment.expired_at
                });
                // Set default to show payment is still valid instead of expired
                setTimeLeft('23:59:59');
                setIsExpired(false);
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Calculate immediately

        return () => clearInterval(timer);
    }, [payment.expired_at]);

    const copyToClipboard = async (text: string) => {
        setCopying(true);
        try {
            await navigator.clipboard.writeText(text);
            setTimeout(() => setCopying(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            setCopying(false);
        }
    };

    const getPaymentMethodIcon = () => {
        switch (payment.payment_method) {
            case 'qris':
                return FaQrcode;
            case 'bank_transfer':
                return FaUniversity;
            case 'gopay':
            case 'shopeepay':
            case 'dana':
            case 'ovo':
                return FaMobile;
            default:
                return FaQrcode;
        }
    };

    const getPaymentMethodName = () => {
        switch (payment.payment_method) {
            case 'qris':
                return 'QRIS';
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'gopay':
                return 'GoPay';
            case 'shopeepay':
                return 'ShopeePay';
            case 'dana':
                return 'DANA';
            case 'ovo':
                return 'OVO';
            default:
                return payment.payment_method.toUpperCase();
        }
    };

    const getStatusIcon = () => {
        switch (paymentStatus) {
            case 'paid':
                return <FaCheckCircle className="text-green-500" />;
            case 'failed':
            case 'expired':
                return <FaTimesCircle className="text-red-500" />;
            case 'pending':
            default:
                return <FaSpinner className="text-yellow-500 animate-spin" />;
        }
    };

    const getStatusColor = () => {
        switch (paymentStatus) {
            case 'paid':
                return 'text-green-500';
            case 'failed':
            case 'expired':
                return 'text-red-500';
            case 'pending':
            default:
                return 'text-yellow-500';
        }
    };

    const PaymentMethodIcon = getPaymentMethodIcon();

    return (
        <>
            <Head title={`Payment - Order ${order.order_id} - NexusShop`} />
            
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
                                Payment
                            </h1>
                            <p className="text-gray-400">Order #{order.order_id}</p>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Payment Status */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    {getStatusIcon()}
                                    <span className="ml-2">Payment Status</span>
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-gray-300 text-sm">Status</label>
                                        <p className={`font-semibold capitalize ${getStatusColor()}`}>
                                            {paymentStatus}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-300 text-sm">Payment Method</label>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <PaymentMethodIcon className="text-blue-400" />
                                            <span className="font-medium">{getPaymentMethodName()}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-300 text-sm">Amount</label>
                                        <p className="text-white font-bold text-lg">
                                            Rp {payment.amount.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    
                                    {!isExpired && paymentStatus === 'pending' && (
                                        <div>
                                            <label className="text-gray-300 text-sm">Time Remaining</label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <FaClock className="text-yellow-400" />
                                                <span className="font-mono text-yellow-400 font-bold">
                                                    {timeLeft}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    onClick={() => window.location.reload()}
                                    disabled={checking}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    {checking ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            <span>Checking...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaRedo />
                                            <span>Refresh Status</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Service:</span>
                                        <span className="text-white font-medium">{order.service_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Quantity:</span>
                                        <span className="text-white">{order.quantity.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Target:</span>
                                        <span className="text-white truncate ml-2" title={order.target}>
                                            {order.target}
                                        </span>
                                    </div>
                                    <hr className="border-gray-600" />
                                    <div className="flex justify-between font-bold">
                                        <span className="text-gray-300">Total:</span>
                                        <span className="text-white">Rp {order.price.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                <h2 className="text-xl font-semibold mb-6 flex items-center">
                                    <PaymentMethodIcon className="mr-2 text-blue-400" />
                                    Payment Instructions
                                </h2>

                                {paymentStatus === 'pending' && !isExpired && (
                                    <>
                                        {payment.payment_method === 'qris' && (
                                            <div className="text-center">
                                                {payment.qr_code_url ? (
                                                    <div className="bg-white p-6 rounded-xl inline-block mb-6">
                                                        <img 
                                                            src={payment.qr_code_url} 
                                                            alt="QRIS QR Code" 
                                                            className="w-64 h-64 mx-auto"
                                                            onLoad={() => {
                                                                console.log('QR Code loaded successfully:', payment.qr_code_url);
                                                            }}
                                                            onError={(e) => {
                                                                console.error('QR Code failed to load:', payment.qr_code_url);
                                                                e.currentTarget.style.display = 'none';
                                                                // Show error message
                                                                const parentDiv = e.currentTarget.parentNode as HTMLElement;
                                                                if (parentDiv && !parentDiv.querySelector('.qr-error')) {
                                                                    const errorDiv = document.createElement('div');
                                                                    errorDiv.className = 'qr-error text-red-600 text-sm mt-2 p-4 bg-red-50 rounded';
                                                                    errorDiv.innerHTML = `
                                                                        <p class="font-semibold">Failed to load QR code</p>
                                                                        <p class="text-xs mt-1">Please refresh the page or try a different payment method</p>
                                                                        <button onclick="window.location.reload()" class="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                                                                            Refresh Page
                                                                        </button>
                                                                    `;
                                                                    parentDiv.appendChild(errorDiv);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-100 p-6 rounded-xl inline-block mb-6">
                                                        <div className="w-64 h-64 mx-auto flex items-center justify-center bg-gray-200 rounded">
                                                            <div className="text-center">
                                                                <FaSpinner className="animate-spin text-4xl text-gray-400 mb-2 mx-auto" />
                                                                <p className="text-gray-600 mb-2">Generating QR Code...</p>
                                                                <p className="text-xs text-gray-500 mb-3">
                                                                    QR code will appear automatically when ready
                                                                </p>
                                                                <button 
                                                                    onClick={() => window.location.reload()}
                                                                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                                                >
                                                                    Refresh
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">How to Pay with QRIS:</h3>
                                                    <ol className="text-left space-y-2 text-gray-300">
                                                        <li>1. Open your e-wallet app (GoPay, OVO, DANA, ShopeePay, LinkAja, etc.)</li>
                                                        <li>2. Find the "Scan QR" or "QRIS" feature</li>
                                                        <li>3. Scan the QR code above</li>
                                                        <li>4. Confirm the payment amount: Rp {payment.amount.toLocaleString('id-ID')}</li>
                                                        <li>5. Complete the payment using your PIN/biometric</li>
                                                        <li>6. Wait for confirmation (usually instant)</li>
                                                    </ol>
                                                    
                                                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-4">
                                                        <div className="flex items-start space-x-3">
                                                            <FaInfoCircle className="text-green-400 mt-1 flex-shrink-0" />
                                                            <div className="text-sm text-green-300">
                                                                <p className="font-medium mb-1">QRIS Compatible Apps:</p>
                                                                <p className="text-xs">GoPay, OVO, DANA, ShopeePay, LinkAja, Bank Digital (BCA Mobile, Mandiri Online, BNI Mobile, BRI Mobile), and other QRIS-enabled apps</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {payment.payment_method === 'bank_transfer' && (
                                            <div>
                                                {payment.va_number ? (
                                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                                                        <h3 className="text-lg font-semibold mb-4">Virtual Account Number:</h3>
                                                        
                                                        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
                                                            <span className="font-mono text-xl text-white">{payment.va_number}</span>
                                                            <button
                                                                onClick={() => copyToClipboard(payment.va_number!)}
                                                                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                                                            >
                                                                <FaCopy />
                                                                <span>{copying ? 'Copied!' : 'Copy'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                                                        <h3 className="text-lg font-semibold mb-4">Virtual Account Number:</h3>
                                                        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                                                            <FaSpinner className="animate-spin text-2xl text-blue-400 mb-2 mx-auto" />
                                                            <p className="text-gray-300">Generating Virtual Account...</p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">How to Pay via Bank Transfer:</h3>
                                                    <ol className="space-y-2 text-gray-300">
                                                        <li>1. Open your mobile banking or visit ATM</li>
                                                        <li>2. Select "Transfer" or "Transfer to Virtual Account"</li>
                                                        <li>3. Enter the Virtual Account number: <strong>{payment.va_number || 'Generating...'}</strong></li>
                                                        <li>4. Enter the exact amount: Rp {payment.amount.toLocaleString('id-ID')}</li>
                                                        <li>5. Confirm and complete the transfer</li>
                                                        <li>6. Keep your transfer receipt</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        )}

                                        {(payment.payment_method === 'gopay' || payment.payment_method === 'shopeepay' || payment.payment_method === 'dana' || payment.payment_method === 'ovo') && (
                                            <div className="text-center">
                                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
                                                    <h3 className="text-lg font-semibold mb-4">E-Wallet Payment</h3>
                                                    <p className="text-gray-300 mb-4">You will be redirected to {getPaymentMethodName()} to complete your payment.</p>
                                                    <div className="bg-gray-700/50 rounded-lg p-4">
                                                        <FaSpinner className="animate-spin text-2xl text-blue-400 mb-2 mx-auto" />
                                                        <p className="text-gray-300">Preparing payment link...</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">How to Pay with {getPaymentMethodName()}:</h3>
                                                    <ol className="space-y-2 text-gray-300">
                                                        <li>1. Wait for the redirect to {getPaymentMethodName()}</li>
                                                        <li>2. Log in to your {getPaymentMethodName()} account</li>
                                                        <li>3. Confirm the payment amount: Rp {payment.amount.toLocaleString('id-ID')}</li>
                                                        <li>4. Complete the payment</li>
                                                        <li>5. You will be redirected back here</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {paymentStatus === 'paid' && (
                                    <div className="text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                        >
                                            <FaCheckCircle className="text-4xl text-white" />
                                        </motion.div>
                                        
                                        <h3 className="text-2xl font-bold text-green-500 mb-4">Payment Successful!</h3>
                                        <p className="text-gray-300 mb-6">
                                            Your payment has been confirmed. Your order is now being processed.
                                        </p>
                                        
                                        <Link
                                            href={`/order/${order.order_id}/status`}
                                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            View Order Status
                                        </Link>
                                    </div>
                                )}

                                {(paymentStatus === 'failed' || paymentStatus === 'expired') && (
                                    <div className="text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                                        >
                                            <FaTimesCircle className="text-4xl text-white" />
                                        </motion.div>
                                        
                                        <h3 className="text-2xl font-bold text-red-500 mb-4">
                                            {paymentStatus === 'expired' ? 'Payment Expired' : 'Payment Failed'}
                                        </h3>
                                        <p className="text-gray-300 mb-6">
                                            {paymentStatus === 'expired'
                                                ? 'The payment time has expired. Please create a new order.'
                                                : 'There was an issue with your payment. Please try again.'
                                            }
                                        </p>
                                        
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Create New Order
                                        </Link>
                                    </div>
                                )}

                                {/* Important Notes */}
                                <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                                        <div className="text-sm text-gray-300">
                                            <p className="font-medium mb-2">Important Notes:</p>
                                            <ul className="space-y-1 text-xs">
                                                <li>• Payment confirmation is usually instant but may take up to 10 minutes</li>
                                                <li>• Make sure to pay the exact amount shown</li>
                                                <li>• Do not close this page until payment is confirmed</li>
                                                <li>• Contact support if payment is not confirmed after 30 minutes</li>
                                                <li>• Payment link expires in 24 hours</li>
                                            </ul>
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

export default OrderPayment;