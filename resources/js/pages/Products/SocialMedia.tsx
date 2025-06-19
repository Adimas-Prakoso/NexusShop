import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaArrowLeft, 
    FaSearch, 
    FaShoppingCart, 
    FaClock,
    FaInfoCircle
} from 'react-icons/fa';
import { Link, Head } from '@inertiajs/react';

interface Service {
    id: number;
    name: string;
    type: string;
    category: string;
    price: number;
    min: number;
    max: number;
    description: string;
    refill: number;
    average_time: string;
}

interface SEOData {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    structuredData: {
        '@context': string;
        '@type': string;
        name: string;
        description: string;
        brand: {
            '@type': string;
            name: string;
        };
        category: string;
        offers: {
            '@type': string;
            priceCurrency: string;
            lowPrice: number;
            highPrice: number;
            offerCount: number;
        };
    };
}

interface SocialMediaPageProps {
    category?: string;
    services: Service[];
    categoryTitle: string;
    seo: SEOData;
}

const SocialMediaPage: React.FC<SocialMediaPageProps> = ({ 
    services: initialServices, 
    categoryTitle,
    seo
}) => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<'price' | 'name' | 'rating'>('price');
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

    // Animated background effect
    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.id = 'space-bg';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        
        document.body.appendChild(canvas);
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create stars with different types
        const stars: Array<{
            x: number, 
            y: number, 
            z: number, 
            size: number,
            twinkle: number,
            speed: number,
            type: 'normal' | 'bright' | 'pulse'
        }> = [];
        
        for (let i = 0; i < 300; i++) {
            const starType = i < 250 ? 'normal' : i < 290 ? 'bright' : 'pulse';
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 1000,
                size: Math.random() * (starType === 'bright' ? 3 : starType === 'pulse' ? 4 : 2),
                twinkle: Math.random() * Math.PI * 2,
                speed: starType === 'normal' ? 1 : starType === 'bright' ? 0.5 : 2,
                type: starType
            });
        }
        
        // Create shooting stars occasionally
        const shootingStars: Array<{
            x: number,
            y: number,
            vx: number,
            vy: number,
            life: number,
            maxLife: number
        }> = [];
        
        const animate = () => {
            if (!ctx) return;
            
            // Create space background with gradient
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
            );
            gradient.addColorStop(0, '#0a0a1a');
            gradient.addColorStop(0.5, '#000818');
            gradient.addColorStop(1, '#000510');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add some nebula-like clouds
            ctx.save();
            ctx.globalAlpha = 0.1;
            const time = Date.now() * 0.0001;
            
            // Draw multiple moving nebula clouds
            for (let i = 0; i < 3; i++) {
                const cloudGradient = ctx.createRadialGradient(
                    canvas.width * (0.3 + 0.4 * i) + Math.sin(time + i) * 100,
                    canvas.height * (0.2 + 0.6 * i) + Math.cos(time + i) * 80,
                    0,
                    canvas.width * (0.3 + 0.4 * i) + Math.sin(time + i) * 100,
                    canvas.height * (0.2 + 0.6 * i) + Math.cos(time + i) * 80,
                    200 + Math.sin(time * 2 + i) * 50
                );
                
                if (i === 0) {
                    cloudGradient.addColorStop(0, '#1a1a5a');
                    cloudGradient.addColorStop(1, 'transparent');
                } else if (i === 1) {
                    cloudGradient.addColorStop(0, '#5a1a5a');
                    cloudGradient.addColorStop(1, 'transparent');
                } else {
                    cloudGradient.addColorStop(0, '#1a5a5a');
                    cloudGradient.addColorStop(1, 'transparent');
                }
                
                ctx.fillStyle = cloudGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.restore();
            
            // Draw stars with enhanced effects
            stars.forEach(star => {
                const x = (star.x - canvas.width / 2) * (1000 / star.z) + canvas.width / 2;
                const y = (star.y - canvas.height / 2) * (1000 / star.z) + canvas.height / 2;
                const size = (1 - star.z / 1000) * star.size;
                const alpha = (1 - star.z / 1000);
                
                if (star.type === 'normal') {
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * (0.6 + 0.4 * Math.sin(star.twinkle))})`;
                    ctx.fill();
                } else if (star.type === 'bright') {
                    // Bright stars with glow
                    ctx.save();
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#87ceeb';
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(135, 206, 235, ${alpha})`;
                    ctx.fill();
                    ctx.restore();
                } else if (star.type === 'pulse') {
                    // Pulsing stars with color
                    const pulseAlpha = alpha * (0.3 + 0.7 * Math.sin(star.twinkle));
                    ctx.save();
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#ff6b9d';
                    ctx.beginPath();
                    ctx.arc(x, y, size * (0.5 + 0.5 * Math.sin(star.twinkle)), 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(255, 107, 157, ${pulseAlpha})`;
                    ctx.fill();
                    ctx.restore();
                }
                
                star.twinkle += 0.02;
                star.z -= star.speed;
                if (star.z <= 0) {
                    star.z = 1000;
                    star.x = Math.random() * canvas.width;
                    star.y = Math.random() * canvas.height;
                }
            });
            
            // Occasionally add shooting stars
            if (Math.random() < 0.001) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * 0.5,
                    vx: (Math.random() - 0.5) * 10 + 5,
                    vy: Math.random() * 3 + 2,
                    life: 60,
                    maxLife: 60
                });
            }
            
            // Draw and update shooting stars
            shootingStars.forEach((shootingStar, index) => {
                const alpha = shootingStar.life / shootingStar.maxLife;
                ctx.save();
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(
                    shootingStar.x - shootingStar.vx * 3, 
                    shootingStar.y - shootingStar.vy * 3
                );
                ctx.stroke();
                ctx.restore();
                
                shootingStar.x += shootingStar.vx;
                shootingStar.y += shootingStar.vy;
                shootingStar.life--;
                
                if (shootingStar.life <= 0) {
                    shootingStars.splice(index, 1);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (document.body.contains(canvas)) {
                document.body.removeChild(canvas);
            }
        };
    }, []);

    // Search functionality
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setServices(initialServices);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/services/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setServices(data.services || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter and sort services
    const filteredAndSortedServices = React.useMemo(() => {
        let filtered = services;

        // Apply price filter
        if (priceFilter !== 'all') {
            filtered = filtered.filter(service => {
                if (priceFilter === 'low') return service.price < 1000;
                if (priceFilter === 'medium') return service.price >= 1000 && service.price < 5000;
                if (priceFilter === 'high') return service.price >= 5000;
                return true;
            });
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    }, [services, priceFilter, sortBy]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const ServiceCard = ({ service }: { service: Service }) => (
        <motion.article
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ 
                scale: 1.02, 
                y: -8,
                transition: { duration: 0.2 }
            }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-blue-900/30 relative overflow-hidden"
            itemScope
            itemType="https://schema.org/Product"
        >
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
            
            <div className="flex flex-col h-full relative z-10">
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors" itemProp="name">
                                {service.name}
                            </h3>
                            <p className="text-blue-400 text-sm font-medium mb-2" itemProp="category">
                                {service.category}
                            </p>
                        </div>
                        <div className="text-right" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            <div className="text-emerald-400 font-bold text-xl" itemProp="price" content={service.price.toString()}>
                                {formatPrice(service.price)}
                            </div>
                            <div className="text-gray-400 text-xs">per 1000</div>
                            <meta itemProp="priceCurrency" content="IDR" />
                            <meta itemProp="availability" content="https://schema.org/InStock" />
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Min Order:</span>
                            <span className="text-white">{service.min.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Max Order:</span>
                            <span className="text-white">{service.max.toLocaleString()}</span>
                        </div>
                        {service.refill > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Refill:</span>
                                <span className="text-emerald-400">{service.refill} days</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center text-yellow-400 text-sm mb-2">
                            <FaClock className="mr-1" />
                            <span className="text-gray-300">Process Time:</span>
                        </div>
                        <p className="text-gray-400 text-xs" itemProp="deliveryTime">{service.average_time}</p>
                    </div>

                    {service.description && (
                        <div className="mb-4">
                            <div className="flex items-center text-blue-400 text-sm mb-2">
                                <FaInfoCircle className="mr-1" />
                                <span>Description:</span>
                            </div>
                            <div 
                                className="text-gray-300 text-xs leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: service.description }}
                            />
                        </div>
                    )}
                </div>

                <Link
                    href={`/order/create?service_id=${service.id}&service_name=${encodeURIComponent(service.name)}&price=${service.price}&min=${service.min}&max=${service.max}&type=${encodeURIComponent(service.type)}`}
                >
                    <motion.button
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                        <FaShoppingCart className="relative z-10" />
                        <span className="relative z-10">Order Now</span>
                    </motion.button>
                </Link>
            </div>
        </motion.article>
    );

    // Generate dynamic FAQ structured data for better SEO
    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What are ${categoryTitle.toLowerCase()}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${categoryTitle} are professional social media marketing services that help boost your online presence with high-quality engagement, followers, and interactions.`
                }
            },
            {
                "@type": "Question",
                "name": "How fast is the delivery?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most of our services start within 0-24 hours and are completed based on the quantity ordered. Average completion time varies by service type."
                }
            },
            {
                "@type": "Question",
                "name": "Are the services safe?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, all our services are 100% safe and comply with platform guidelines. We use organic methods and provide refill guarantees where applicable."
                }
            }
        ]
    };

    // Generate breadcrumb structured data
    const breadcrumbStructuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": window.location.origin
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": `${window.location.origin}/products`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": categoryTitle,
                "item": window.location.href
            }
        ]
    };

    return (
        <>
            <Head>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta name="keywords" content={seo.keywords} />
                <link rel="canonical" href={seo.canonical} />
                
                {/* Favicon */}
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="shortcut icon" href="/favicon.ico" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={seo.canonical} />
                <meta property="og:title" content={seo.ogTitle} />
                <meta property="og:description" content={seo.ogDescription} />
                <meta property="og:image" content={seo.ogImage} />
                <meta property="og:site_name" content="NexusShop" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={seo.canonical} />
                <meta property="twitter:title" content={seo.ogTitle} />
                <meta property="twitter:description" content={seo.ogDescription} />
                <meta property="twitter:image" content={seo.ogImage} />
                
                {/* Additional SEO tags */}
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="author" content="NexusShop" />
                <meta name="theme-color" content="#3B82F6" />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(seo.structuredData)}
                </script>
                
                {/* FAQ Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(faqStructuredData)}
                </script>
                
                {/* Breadcrumb Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbStructuredData)}
                </script>
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
            {/* Header */}
            <header className="relative" role="banner">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
                            animate={{
                                y: [0, -100, 0],
                                x: [0, Math.sin(i) * 50, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 8 + i * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            style={{
                                left: `${(i * 5) % 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>
                
                <div className="relative z-10 container mx-auto px-4 py-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <motion.div 
                            className="flex items-center space-x-4"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Link
                                href="/products"
                                className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors duration-300 px-4 py-2 rounded-lg border border-white/20 hover:border-blue-500/50 hover:bg-white/10 backdrop-blur-sm"
                            >
                                <FaArrowLeft />
                                <span>Back to Products</span>
                            </Link>
                        </motion.div>
                        <motion.div 
                            className="text-right"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {categoryTitle}
                            </h1>
                            <p className="text-blue-300 text-lg">
                                {services.length} premium services available
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Search and Filters */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8 relative overflow-hidden"
                        style={{ zIndex: 10 }}
                    >
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ zIndex: 1 }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse pointer-events-none"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative" style={{ zIndex: 15 }}>
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <div className="relative group">
                                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                                        aria-label="Search social media services"
                                        aria-describedby="search-description"
                                    />
                                    <div id="search-description" className="sr-only">
                                        Search through available social media marketing services
                                    </div>
                                    {isLoading && (
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/15"
                                >
                                    <option value="all" className="bg-gray-800">All Prices</option>
                                    <option value="low" className="bg-gray-800">Under Rp 1,000</option>
                                    <option value="medium" className="bg-gray-800">Rp 1,000 - 5,000</option>
                                    <option value="high" className="bg-gray-800">Above Rp 5,000</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'rating')}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/15"
                                >
                                    <option value="price" className="bg-gray-800">Sort by Price</option>
                                    <option value="name" className="bg-gray-800">Sort by Name</option>
                                </select>
                            </div>
                        </div>

                        {/* Services Count Display */}
                        <div className="mt-4 text-center">
                            <div className="text-gray-300 text-sm bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
                                Showing <span className="text-blue-400 font-semibold">{filteredAndSortedServices.length}</span> services
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Services Grid/List */}
            <main role="main" aria-label="Social Media Services">
                <div className="container mx-auto px-4 pb-12">
                {isLoading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="relative inline-block">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-blue-500 opacity-20"></div>
                        </div>
                        <motion.p 
                            className="text-white mt-6 text-lg"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Loading premium services...
                        </motion.p>
                    </motion.div>
                ) : filteredAndSortedServices.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-6">🔍</div>
                        <div className="text-gray-400 text-xl mb-4">No services found</div>
                        <p className="text-gray-500 mb-8">Try adjusting your search or filters</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSearchQuery('');
                                setPriceFilter('all');
                                setServices(initialServices);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            Reset Filters
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredAndSortedServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.4, 
                                    delay: index * 0.05,
                                    type: "spring",
                                    stiffness: 100
                                }}
                            >
                                <ServiceCard service={service} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
            </main>
        </div>
        </>
    );
};

export default SocialMediaPage;
