import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    FaShoppingCart, 
    FaEnvelope, 
    FaGlobe, 
    FaArrowLeft,
    FaQrcode,
    FaUniversity,
    FaMobile
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
    const { data, setData, post, errors, processing } = useForm({
        email: '',
        target: '',
        quantity: service.min,
        payment_method: 'qris',
        service_id: service.id,
        service_name: service.name,
        price: service.price,
        min: service.min,
        max: service.max,
        type: service.type,
    });

    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('qris');
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const calculatePrice = React.useCallback((quantity: number) => {
        const price = (quantity / 1000) * service.price;
        setTotalPrice(price);
        setData('quantity', quantity);
    }, [service.price, setData]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= service.min && quantity <= service.max) {
        calculatePrice(quantity);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        post('/order/store', {
            onSuccess: (response) => {
                console.log('Order created successfully, redirecting to payment...');
                
                // Check if we got a fallback response
                if (response && typeof response === 'object' && 'manual_redirect' in response && 'payment_url' in response) {
                    const fallbackResponse = response as { manual_redirect: boolean; payment_url: string };
                    console.log('Manual redirect needed to:', fallbackResponse.payment_url);
                    alert('Order created successfully! Click OK to go to payment page.');
                    window.location.href = fallbackResponse.payment_url;
                }
            },
            onError: (errors) => {
                console.error('Order creation failed:', errors);
                
                // Show error message
                if (errors.payment) {
                    alert('Payment Error: ' + errors.payment);
                } else if (errors.network) {
                    alert('Network Error: Please check your internet connection and try again.');
                } else {
                    alert('An error occurred while processing your order. Please try again.');
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
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
    }, [calculatePrice, service.min]);

    React.useEffect(() => {
        setData('payment_method', selectedPaymentMethod);
    }, [selectedPaymentMethod, setData]);

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
                                                placeholder="https://instagram.com/username"
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
                                                value={data.quantity}
                                                onChange={handleQuantityChange}
                                                min={service.min}
                                                max={service.max}
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                                                required
                                            />
                                            {errors.quantity && (
                                                <p className="mt-1 text-red-400 text-sm">{errors.quantity}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <FaQrcode className="mr-2 text-blue-400" />
                                        Payment Method
                                    </h2>
                                    
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    selectedPaymentMethod === method.id
                                                        ? 'border-blue-500 bg-blue-500/10'
                                                        : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                                                }`}
                                                onClick={() => setSelectedPaymentMethod(method.id)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <method.icon className="text-2xl text-blue-400" />
                                                    <div>
                                                        <h3 className="font-semibold text-white">{method.name}</h3>
                                                        <p className="text-sm text-gray-400">{method.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                    type="submit"
                                        disabled={isSubmitting || processing}
                                        className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105"
                                >
                                        {isSubmitting || processing ? (
                                        <>
                                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                                <FaShoppingCart />
                                                <span>Proceed to Payment - Rp {totalPrice.toLocaleString('id-ID')}</span>
                                        </>
                                    )}
                                    </button>
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