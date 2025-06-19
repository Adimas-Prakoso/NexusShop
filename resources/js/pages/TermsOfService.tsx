import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Users, CreditCard, AlertCircle, FileText, Clock } from 'lucide-react';

export default function TermsOfService() {
    return (
        <>
            <Head>
                <title>Terms of Service - NexusShop</title>
                <meta name="description" content="Terms of Service and user agreement for NexusShop digital marketplace" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Header */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Home</span>
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-purple-400" />
                            <span className="text-white font-semibold">NexusShop</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 md:p-12">
                            {/* Title */}
                            <div className="text-center mb-12">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    Terms of Service
                                </h1>
                                <p className="text-white/70 text-lg">
                                    Last updated: {new Date().toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </p>
                            </div>

                            {/* Content */}
                            <div className="prose prose-invert max-w-none">
                                
                                {/* Introduction */}
                                <section className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <FileText className="w-6 h-6 text-purple-400" />
                                        <h2 className="text-2xl font-bold text-white m-0">1. Introduction</h2>
                                    </div>
                                    <p className="text-white/80 leading-relaxed">
                                        Welcome to NexusShop, a digital marketplace for social media services, gaming products, 
                                        and digital solutions. By accessing or using our platform, you agree to be bound by these 
                                        Terms of Service ("Terms"). Please read them carefully.
                                    </p>
                                </section>

                                {/* Services */}
                                <section className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Users className="w-6 h-6 text-purple-400" />
                                        <h2 className="text-2xl font-bold text-white m-0">2. Our Services</h2>
                                    </div>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <p>NexusShop provides the following services:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Social media growth services (followers, likes, views)</li>
                                            <li>Gaming top-up and in-game currency</li>
                                            <li>Digital vouchers and gift cards</li>
                                            <li>Mobile credit and data packages</li>
                                            <li>Digital marketing tools and services</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* User Responsibilities */}
                                <section className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Shield className="w-6 h-6 text-purple-400" />
                                        <h2 className="text-2xl font-bold text-white m-0">3. User Responsibilities</h2>
                                    </div>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <p>By using NexusShop, you agree to:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Provide accurate and complete information</li>
                                            <li>Use services only for lawful purposes</li>
                                            <li>Not engage in fraudulent or deceptive practices</li>
                                            <li>Respect intellectual property rights</li>
                                            <li>Not attempt to harm or disrupt our services</li>
                                            <li>Comply with all applicable laws and regulations</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Payment Terms */}
                                <section className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="w-6 h-6 text-purple-400" />
                                        <h2 className="text-2xl font-bold text-white m-0">4. Payment & Billing</h2>
                                    </div>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>All payments are processed securely through our payment partners</li>
                                            <li>Prices are displayed in Indonesian Rupiah (IDR) unless stated otherwise</li>
                                            <li>Payment must be completed within the specified time limit</li>
                                            <li>Refunds are subject to our refund policy</li>
                                            <li>We reserve the right to modify pricing with notice</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Service Delivery */}
                                <section className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Clock className="w-6 h-6 text-purple-400" />
                                        <h2 className="text-2xl font-bold text-white m-0">5. Service Delivery</h2>
                                    </div>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Digital services are typically delivered automatically</li>
                                            <li>Delivery times may vary based on service type and provider</li>
                                            <li>We are not responsible for delays caused by third-party platforms</li>
                                            <li>Status updates will be provided for all orders</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Prohibited Activities */}
                                <section className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <AlertCircle className="w-6 h-6 text-red-400" />
                                        <h2 className="text-2xl font-bold text-white m-0">6. Prohibited Activities</h2>
                                    </div>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <p>The following activities are strictly prohibited:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>Using our services for illegal activities</li>
                                            <li>Attempting to hack or exploit our systems</li>
                                            <li>Creating fake accounts or impersonating others</li>
                                            <li>Sharing account credentials with third parties</li>
                                            <li>Violating third-party terms of service</li>
                                            <li>Engaging in spam or abusive behavior</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Limitation of Liability */}
                                <section className="mb-10">
                                    <h2 className="text-2xl font-bold text-white mb-6">7. Limitation of Liability</h2>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <p>
                                            NexusShop provides services "as is" without warranties. We are not liable for 
                                            indirect, incidental, or consequential damages. Our total liability is limited 
                                            to the amount paid for the specific service.
                                        </p>
                                    </div>
                                </section>

                                {/* Privacy */}
                                <section className="mb-10">
                                    <h2 className="text-2xl font-bold text-white mb-6">8. Privacy & Data Protection</h2>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <p>
                                            We respect your privacy and protect your personal information in accordance with 
                                            applicable data protection laws. Please refer to our Privacy Policy for detailed 
                                            information about how we collect, use, and protect your data.
                                        </p>
                                    </div>
                                </section>

                                {/* Modifications */}
                                <section className="mb-10">
                                    <h2 className="text-2xl font-bold text-white mb-6">9. Modifications to Terms</h2>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <p>
                                            We reserve the right to modify these Terms at any time. Changes will be effective 
                                            immediately upon posting. Continued use of our services constitutes acceptance of 
                                            the modified Terms.
                                        </p>
                                    </div>
                                </section>

                                {/* Contact */}
                                <section className="mb-10">
                                    <h2 className="text-2xl font-bold text-white mb-6">10. Contact Information</h2>
                                    <div className="text-white/80 leading-relaxed space-y-4">
                                        <p>
                                            If you have any questions about these Terms of Service, please contact us:
                                        </p>
                                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                            <p><strong>Email:</strong> support@nexusshop.store</p>
                                            <p><strong>Website:</strong> https://nexusshop.store</p>
                                            <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (WIB)</p>
                                        </div>
                                    </div>
                                </section>

                            </div>

                            {/* Footer */}
                            <div className="mt-12 pt-8 border-t border-white/20">
                                <div className="text-center">
                                    <p className="text-white/60 mb-4">
                                        By using NexusShop, you acknowledge that you have read, understood, 
                                        and agree to be bound by these Terms of Service.
                                    </p>
                                    <Link 
                                        href="/" 
                                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Return to NexusShop
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
