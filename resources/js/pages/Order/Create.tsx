import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    FaArrowLeft, 
    FaShoppingCart, 
    FaCreditCard,
    FaQrcode,
    FaUniversity,
    FaMobile,
    FaInfoCircle,
    FaEnvelope,
    FaGlobe,
    FaHashtag,
    FaUsers
} from 'react-icons/fa';

interface Service {
    id: number;
    name: string;
    price: number;
    min: number;
    max: number;
    type: string;
}

interface OrderCreateProps {
    service: Service;
}

const OrderCreate: React.FC<OrderCreateProps> = ({ service }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('qris');
    const [totalPrice, setTotalPrice] = useState<number>(0);
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        service_id: service.id,
        service_name: service.name,
        target: '',
        quantity: service.min,
        price: 0,
        payment_method: 'qris',
        comments: '',
        usernames: '',
    });

    // Calculate price based on quantity
    const calculatePrice = (quantity: number) => {
        const price = (quantity / 1000) * service.price;
        setTotalPrice(price);
        setData('price', price);
        setData('quantity', quantity);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value) || service.min;
        calculatePrice(quantity);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/order/store');
    };

    const paymentMethods = [
        { id: 'qris', name: 'QRIS', icon: FaQrcode, description: 'Scan QR code with any e-wallet' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: FaUniversity, description: 'Transfer to virtual account' },
        { id: 'gopay', name: 'GoPay', icon: FaMobile, description: 'Pay with GoPay' },
        { id: 'shopeepay', name: 'ShopeePay', icon: FaMobile, description: 'Pay with ShopeePay' },
        { id: 'dana', name: 'DANA', icon: FaMobile, description: 'Pay with DANA' },
    ];

    React.useEffect(() => {
        calculatePrice(service.min);
    }, []);

    React.useEffect(() => {
        setData('payment_method', selectedPaymentMethod);
    }, [selectedPaymentMethod]);

    return (
        <>
            <Head title={`Order ${service.name} - NexusShop`} />
            
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
                                Create Order
                            </h1>
                            <p className="text-gray-400">Complete your social media boost</p>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Service Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <FaShoppingCart className="mr-2 text-blue-400" />
                                    Service Details
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-gray-300 text-sm">Service Name</label>
                                        <p className="text-white font-medium">{service.name}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-300 text-sm">Price per 1000</label>
                                        <p className="text-white font-medium">Rp {service.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-gray-300 text-sm">Min Order</label>
                                            <p className="text-white font-medium">{service.min.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div>
                                            <label className="text-gray-300 text-sm">Max Order</label>
                                            <p className="text-white font-medium">{service.max.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-300 text-sm">Type</label>
                                        <p className="text-white font-medium capitalize">{service.type}</p>
                                    </div>
                                </div>
                                
                                {/* Price Calculator */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20">
                                    <h3 className="text-lg font-semibold mb-2 text-blue-300">Total Price</h3>
                                    <p className="text-2xl font-bold text-white">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Contact Information */}
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <FaEnvelope className="mr-2 text-blue-400" />
                                        Contact Information
                                    </h2>
                                    
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                                            placeholder="your@email.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <FaGlobe className="mr-2 text-blue-400" />
                                        Order Details
                                    </h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                                Target URL/Username *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.target}
                                                onChange={(e) => setData('target', e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                                                placeholder="https://instagram.com/username or @username"
                                                required
                                            />
                                            {errors.target && (
                                                <p className="mt-1 text-red-400 text-sm">{errors.target}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                min={service.min}
                                                max={service.max}
                                                value={data.quantity}
                                                onChange={handleQuantityChange}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                                                required
                                            />
                                            {errors.quantity && (
                                                <p className="mt-1 text-red-400 text-sm">{errors.quantity}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Optional Fields */}
                                    {service.type === 'Custom Comments' && (
                                        <div className="mt-4">
                                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                                Comments (one per line)
                                            </label>
                                            <textarea
                                                value={data.comments}
                                                onChange={(e) => setData('comments', e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                                                placeholder="Comment 1&#10;Comment 2&#10;Comment 3"
                                            />
                                        </div>
                                    )}

                                    {service.type === 'Mentions Custom List' && (
                                        <div className="mt-4">
                                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                                Usernames (one per line)
                                            </label>
                                            <textarea
                                                value={data.usernames}
                                                onChange={(e) => setData('usernames', e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                                                placeholder="username1&#10;username2&#10;username3"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <FaCreditCard className="mr-2 text-blue-400" />
                                        Payment Method
                                    </h2>
                                    
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {paymentMethods.map((method) => (
                                            <motion.div
                                                key={method.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    selectedPaymentMethod === method.id
                                                        ? 'border-blue-500 bg-blue-900/30'
                                                        : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                                                }`}
                                                onClick={() => setSelectedPaymentMethod(method.id)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <method.icon className={`text-xl ${
                                                        selectedPaymentMethod === method.id ? 'text-blue-400' : 'text-gray-400'
                                                    }`} />
                                                    <div>
                                                        <p className="font-medium">{method.name}</p>
                                                        <p className="text-xs text-gray-400">{method.description}</p>
                                                    </div>
                                                </div>
                                                
                                                {selectedPaymentMethod === method.id && (
                                                    <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={processing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    {processing ? (
                                        <>
                                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart className="relative z-10" />
                                            <span className="relative z-10">
                                                Proceed to Payment - Rp {totalPrice.toLocaleString('id-ID')}
                                            </span>
                                        </>
                                    )}
                                </motion.button>

                                {/* Info */}
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                                        <div className="text-sm text-gray-300">
                                            <p className="font-medium mb-1">Important Information:</p>
                                            <ul className="space-y-1 text-xs">
                                                <li>• Orders will be processed within 0-24 hours after payment confirmation</li>
                                                <li>• Make sure your account/profile is public for better results</li>
                                                <li>• Refill guarantee available for applicable services</li>
                                                <li>• Contact support if you have any questions</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderCreate;