import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion, AnimatePresence } from 'framer-motion';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { 
    FaSearch, 
    FaGamepad, 
    FaFire, 
    FaBomb, 
    FaCrosshairs,
    FaLightbulb,
    FaCreditCard,
    FaGlobe,
    FaShoppingCart,
    FaUsers,
    FaBuilding,
    FaCar,
    FaWater,
    FaHome,
    FaUserShield,
    FaMobileAlt,
    FaWifi,
    FaTv,
    FaGasPump,
    FaReceipt,
    FaStamp,
    FaPlay,
    FaPhone,
    FaChevronLeft,
    FaChevronRight,
    FaStar,
    FaYoutube,
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaTwitter,
    FaWhatsapp,
    FaSpotify,
    FaSoundcloud,
    FaTelegram,
    FaShopify,
    FaPinterest,
    FaLinkedin,
    FaDiscord,
    FaMusic,
    FaVideo,
    FaHeart,
} from 'react-icons/fa';
import { GiPistolGun, GiSwordAltar } from 'react-icons/gi';
import UserDropdown from '@/components/UserDropdown';
import { Button } from '@/components/ui/button';

interface LoadingProgressEvent {
  loaded: number;
  total: number;
}

interface User {
  name: string;
  email: string;
}

interface Props {
  auth: {
    user: User | null;
  };
}

// Language translations
const translations = {
    en: {
        navbar: {
            brand: "NexusShop",
            search: "Search products...",
            login: "Login",
            language: "Language"
        },
        categories: {
            prepaid: {
                title: "Prepaid Services",
                items: [
                    { name: "Prepaid Credit", icon: FaMobileAlt },
                    { name: "Data Package", icon: FaWifi },
                    { name: "PLN Token", icon: FaLightbulb },
                    { name: "E-Money", icon: FaCreditCard },
                    { name: "International E-Money", icon: FaGlobe },
                    { name: "Games", icon: FaGamepad },
                    { name: "Shopping Vouchers", icon: FaShoppingCart },
                    { name: "International Credit", icon: FaPhone },
                    { name: "E-Stamp", icon: FaStamp },
                    { name: "Streaming", icon: FaPlay },
                    { name: "Voice Package", icon: FaPhone }
                ]
            },
            postpaid: {
                title: "Postpaid Services",
                items: [
                    { name: "PLN Postpaid", icon: FaLightbulb },
                    { name: "Postpaid Credit", icon: FaMobileAlt },
                    { name: "Internet", icon: FaWifi },
                    { name: "Television", icon: FaTv },
                    { name: "Gas", icon: FaGasPump },
                    { name: "PDAM", icon: FaWater },
                    { name: "BPJS Health", icon: FaUserShield },
                    { name: "BPJS Employment", icon: FaUsers },
                    { name: "Multifinance", icon: FaBuilding },
                    { name: "PBB", icon: FaHome },
                    { name: "ESAMSAT", icon: FaCar },
                    { name: "E-Money Bills", icon: FaReceipt }
                ]
            },
            socialmedia: {
                title: "Social Media Services",
                items: [
                    { name: "Instagram Followers", icon: FaInstagram },
                    { name: "YouTube Views", icon: FaYoutube },
                    { name: "YouTube Subscribers", icon: FaYoutube },
                    { name: "Website Traffic", icon: FaGlobe },
                    { name: "Facebook Likes", icon: FaFacebook },
                    { name: "TikTok Followers", icon: FaTiktok },
                    { name: "Twitter Followers", icon: FaTwitter },
                    { name: "WhatsApp Views", icon: FaWhatsapp },
                    { name: "Threads Followers", icon: FaHeart },
                    { name: "Spotify Plays", icon: FaSpotify },
                    { name: "SoundCloud Plays", icon: FaSoundcloud },
                    { name: "Telegram Members", icon: FaTelegram },
                    { name: "Snack Video Views", icon: FaVideo },
                    { name: "Shopee Followers", icon: FaShopify },
                    { name: "Quora Followers", icon: FaUsers },
                    { name: "Pinterest Followers", icon: FaPinterest },
                    { name: "LinkedIn Followers", icon: FaLinkedin },
                    { name: "Musical.ly Likes", icon: FaMusic },
                    { name: "Likee App Hearts", icon: FaHeart },
                    { name: "Discord Members", icon: FaDiscord }
                ]
            }
        },
        games: {
            title: "Popular Games",
            subtitle: "Top up your favorite games instantly"
        },
        banner: {
            title: "Special Offers",
            subtitle: "Don't miss out on our amazing deals!"
        },
        loading: "Loading 3D Assets..."
    },
    id: {
        navbar: {
            brand: "NexusShop",
            search: "Cari produk...",
            login: "Masuk",
            language: "Bahasa"
        },
        categories: {
            prepaid: {
                title: "Layanan Prabayar",
                items: [
                    { name: "Pulsa Prabayar", icon: FaMobileAlt },
                    { name: "Paket Data", icon: FaWifi },
                    { name: "Token PLN", icon: FaLightbulb },
                    { name: "E-Money", icon: FaCreditCard },
                    { name: "E-Money Internasional", icon: FaGlobe },
                    { name: "Game", icon: FaGamepad },
                    { name: "Voucher Belanja", icon: FaShoppingCart },
                    { name: "Pulsa Internasional", icon: FaPhone },
                    { name: "E-Meterai", icon: FaStamp },
                    { name: "Streaming", icon: FaPlay },
                    { name: "Paket Bicara", icon: FaPhone }
                ]
            },
            postpaid: {
                title: "Layanan Pascabayar",
                items: [
                    { name: "PLN Pascabayar", icon: FaLightbulb },
                    { name: "Pulsa Pascabayar", icon: FaMobileAlt },
                    { name: "Internet", icon: FaWifi },
                    { name: "Televisi", icon: FaTv },
                    { name: "Gas", icon: FaGasPump },
                    { name: "PDAM", icon: FaWater },
                    { name: "BPJS Kesehatan", icon: FaUserShield },
                    { name: "BPJS Ketenagakerjaan", icon: FaUsers },
                    { name: "Multifinance", icon: FaBuilding },
                    { name: "PBB", icon: FaHome },
                    { name: "ESAMSAT", icon: FaCar },
                    { name: "Tagihan E-Money", icon: FaReceipt }
                ]
            },
            socialmedia: {
                title: "Layanan Media Sosial",
                items: [
                    { name: "Instagram", icon: FaInstagram },
                    { name: "YouTube", icon: FaYoutube },
                    { name: "YouTube", icon: FaYoutube },
                    { name: "Website Traffic", icon: FaGlobe },
                    { name: "Facebook", icon: FaFacebook },
                    { name: "TikTok", icon: FaTiktok },
                    { name: "Twitter", icon: FaTwitter },
                    { name: "WhatsApp", icon: FaWhatsapp },
                    { name: "Threads", icon: FaHeart },
                    { name: "Spotify", icon: FaSpotify },
                    { name: "SoundCloud", icon: FaSoundcloud },
                    { name: "Telegram", icon: FaTelegram },
                    { name: "Snack Video", icon: FaVideo },
                    { name: "Shopee", icon: FaShopify },
                    { name: "Quora", icon: FaUsers },
                    { name: "Pinterest", icon: FaPinterest },
                    { name: "LinkedIn", icon: FaLinkedin },
                    { name: "Musical.ly", icon: FaMusic },
                    { name: "Likee App", icon: FaHeart },
                    { name: "Discord", icon: FaDiscord }
                ]
            }
        },
        games: {
            title: "Game Populer",
            subtitle: "Top-up game favorit Anda secara instan"
        },
        banner: {
            title: "Penawaran Spesial",
            subtitle: "Jangan lewatkan penawaran menarik kami!"
        },
        loading: "Memuat Aset 3D..."
    }
};

// Popular games data
const popularGames = {
    en: [
        { name: "Mobile Legends", discount: "5% OFF", icon: FaGamepad, image: "/assets/images/mlbb.png" },
        { name: "PUBG Mobile", discount: "10% OFF", icon: GiPistolGun, image: "/assets/images/pubg-mobile.png" },
        { name: "Free Fire", discount: "8% OFF", icon: FaFire, image: "/assets/images/free-fire.png" },
        { name: "Genshin Impact", discount: "12% OFF", icon: GiSwordAltar, image: "/assets/images/genshin-impact.webp" },
        { name: "Call of Duty", discount: "7% OFF", icon: FaBomb, image: "/assets/images/call-of-duty.jpg" },
        { name: "Valorant", discount: "15% OFF", icon: FaCrosshairs, image: "/assets/images/valorant.png" }
    ],
    id: [
        { name: "Mobile Legends", discount: "DISKON 5%", icon: FaGamepad, image: "/assets/images/mlbb.png" },
        { name: "PUBG Mobile", discount: "DISKON 10%", icon: GiPistolGun, image: "/assets/images/pubg-mobile.png" },
        { name: "Free Fire", discount: "DISKON 8%", icon: FaFire, image: "/assets/images/free-fire.png" },
        { name: "Genshin Impact", discount: "DISKON 12%", icon: GiSwordAltar, image: "/assets/images/genshin-impact.webp" },
        { name: "Call of Duty", discount: "DISKON 7%", icon: FaBomb, image: "/assets/images/call-of-duty.jpg" },
        { name: "Valorant", discount: "DISKON 15%", icon: FaCrosshairs, image: "/assets/images/valorant.png" }
    ]
};

const Products = ({ auth }: Props) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState<'en' | 'id'>('id');
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategoryTab, setActiveCategoryTab] = useState('prepaid');

    const t = translations[currentLanguage];
    const games = popularGames[currentLanguage];

    const bannerImages = [
        '/assets/banner/1.png',
        '/assets/banner/2.png',
        '/assets/banner/3.png'
    ];

    const changeLanguage = (lang: 'en' | 'id') => {
        setCurrentLanguage(lang);
        setIsLanguageMenuOpen(false);
    };

    const nextBanner = () => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    };

    const prevBanner = () => {
        setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    };

    // Auto-rotate banner
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bannerImages.length]);

    // Handle 3D background effect
    useEffect(() => {
        if (!mountRef.current) return;

        // Ensure body and html have transparent background for this page
        const originalBodyStyle = document.body.style.background;
        const originalHtmlStyle = document.documentElement.style.background;
        
        document.body.style.background = 'transparent';
        document.documentElement.style.background = '#000918';

        const currentMount = mountRef.current;
        
        // Setup scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000918);
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Make sure canvas is completely fixed and non-interactive
        const canvas = renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        canvas.style.userSelect = 'none';
        canvas.style.touchAction = 'none';
        
        currentMount.appendChild(canvas);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xaaaaff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x3677ff, 1.5, 20);
        pointLight.position.set(-5, 2, 3);
        scene.add(pointLight);
        
        // Create stars
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            const radius = 50 + Math.random() * 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starPositions[i + 2] = radius * Math.cos(phi);
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });
        
        const starsObject = new THREE.Points(starGeometry, starMaterial);
        scene.add(starsObject);

        // Load Galaxy Model
        const loader = new GLTFLoader();
        let galaxyModel: THREE.Group;
        
        const loadingElement = document.createElement('div');
        loadingElement.style.position = 'absolute';
        loadingElement.style.top = '50%';
        loadingElement.style.left = '50%';
        loadingElement.style.transform = 'translate(-50%, -50%)';
        loadingElement.style.color = 'white';
        loadingElement.style.fontSize = '20px';
        loadingElement.textContent = t.loading;
        if (currentMount) {
            currentMount.appendChild(loadingElement);
        }

        loader.load(
            '/assets/models/galaxy-model.glb',
            (gltf: GLTF) => {
                galaxyModel = gltf.scene;
                
                galaxyModel.scale.set(20, 20, 20);
                galaxyModel.position.set(0, 0, -5);
                
                scene.add(galaxyModel);
                
                if (currentMount && loadingElement.parentNode === currentMount) {
                    currentMount.removeChild(loadingElement);
                }
            },
            (xhr: LoadingProgressEvent) => {
                const progress = (xhr.loaded / xhr.total) * 100;
                if (loadingElement) {
                    loadingElement.textContent = `${t.loading} ${Math.round(progress)}%`;
                }
            },
            (error: unknown) => {
                console.error('An error happened while loading the model:', error);
                if (loadingElement) {
                    loadingElement.textContent = 'Error loading galaxy model';
                }
            }
        );

        camera.position.z = 10;
        camera.position.y = 3;
        
        // No controls - background is completely static and non-interactive

        const animate = () => {
            requestAnimationFrame(animate);
            
            const time = Date.now() * 0.001;
            
            // Animate galaxy rotation if loaded with floating effect
            if (galaxyModel) {
                galaxyModel.rotation.y += 0.0005;
                galaxyModel.rotation.x += 0.0001;
                galaxyModel.rotation.z += 0.0002;
                
                // Add floating animation
                galaxyModel.position.y = Math.sin(time * 0.3) * 0.5;
                galaxyModel.position.x = Math.cos(time * 0.2) * 0.3;
                
                // Add subtle scale pulsing
                const scale = 20 + Math.sin(time * 0.5) * 0.5;
                galaxyModel.scale.set(scale, scale, scale);
            }
            
            // Animate stars with multiple rotation axes
            if (starsObject) {
                starsObject.rotation.y += 0.0002;
                starsObject.rotation.x += 0.0001;
                starsObject.rotation.z += 0.00005;
            }
            
            // Animate lights for dynamic effect
            pointLight.position.x = Math.sin(time * 0.5) * 10;
            pointLight.position.z = Math.cos(time * 0.5) * 10;
            pointLight.position.y = 2 + Math.sin(time * 0.8) * 1;
            pointLight.intensity = 1.5 + Math.sin(time * 2) * 0.3;
            
            // Animate directional light
            directionalLight.position.x = 5 + Math.sin(time * 0.3) * 2;
            directionalLight.position.z = 5 + Math.cos(time * 0.3) * 2;
            directionalLight.intensity = 1 + Math.sin(time * 1.5) * 0.2;
            
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            // 3D background remains completely fixed - no parallax effects
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            // Restore original background styles
            document.body.style.background = originalBodyStyle;
            document.documentElement.style.background = originalHtmlStyle;
            
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            if (currentMount) {
                if (loadingElement.parentNode === currentMount) {
                    currentMount.removeChild(loadingElement);
                }
                if (canvas.parentNode === currentMount) {
                    currentMount.removeChild(canvas);
                }
            }
        };
    }, [t.loading]);

    // Enhanced transition variants for animations
    const fadeInUp = {
        hidden: { opacity: 0, y: 30, scale: 0.8 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.08,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100
            }
        })
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
                when: "beforeChildren"
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
                when: "afterChildren"
            }
        }
    };

    return (
        <div className="min-h-screen relative bg-transparent overflow-hidden font-sans">
            <Head>
                <title>NexusShop - Products</title>
                <meta name="description" content="Browse our wide range of digital top-up services for games, mobile credit, internet packages, and more." />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>

            {/* 3D Background */}
            <div 
                ref={mountRef} 
                className="fixed inset-0 w-full h-full -z-10"
                style={{ 
                    pointerEvents: 'none',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden'
                }}
            />

            {/* Navbar */}
            <motion.nav 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg shadow-blue-900/20' : 'bg-transparent'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="container mx-auto px-4 py-4 md:py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2 group">
                            <img 
                                src="/logo.png" 
                                alt="NexusShop Logo" 
                                className="h-8 w-8 md:h-10 md:w-10"
                            />
                            <span className="hidden sm:inline bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text group-hover:from-purple-400 group-hover:to-pink-500 transition-all duration-300">{t.navbar.brand}</span>
                        </Link>

                        {/* Search Box - Hidden on very small screens */}
                        <div className="hidden sm:flex flex-1 max-w-md mx-4 md:mx-8">
                            <div className="relative w-full group">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                                <input
                                    type="text"
                                    placeholder={t.navbar.search}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white/15 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Login Button and Language Selector */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                                    >
                                        <FaGlobe className="h-5 w-5" />
                                        <span>{t.navbar.language}</span>
                                    </button>
                                    {isLanguageMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            <div className="py-1" role="menu">
                                                <button
                                                    onClick={() => {
                                                        changeLanguage('en');
                                                        setIsLanguageMenuOpen(false);
                                                    }}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    English
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        changeLanguage('id');
                                                        setIsLanguageMenuOpen(false);
                                                    }}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    Indonesia
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {auth.user ? (
                                    <UserDropdown user={auth.user} />
                                ) : (
                                    <Button asChild>
                                        <Link href="/login">
                                            {t.navbar.login}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Main Content */}
            <div className="pt-18 pb-16">
                <div className="container mx-auto px-4 space-y-16">
                    {/* Banner Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative mt-8 sm:mt-12"
                    >
                        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/30">
                            {/* Aspect ratio container - 2:1 ratio (1000mm x 500mm) */}
                            <div className="relative w-full pb-[50%]">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentBanner}
                                        src={bannerImages[currentBanner]}
                                        alt={`Banner ${currentBanner + 1}`}
                                        className="absolute inset-0 w-full h-full xs:object-contain sm:object-cover"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                        onError={(e) => {
                                            e.currentTarget.src = '/assets/images/placeholder-banner.jpg';
                                        }}
                                    />
                                </AnimatePresence>
                                
                                {/* Banner Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                                
                                {/* Banner Content */}
                                <div className="absolute inset-0 flex items-center justify-start p-8 sm:p-12 md:p-16">
                                    {/* Banner content removed as requested */}
                                </div>
                                
                                {/* Navigation Buttons */}
                                <button 
                                    onClick={prevBanner}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={nextBanner}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 opacity-80 hover:opacity-100 hover:scale-110"
                                >
                                    <FaChevronRight size={20} />
                                </button>
                                
                                {/* Banner Indicators */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                                    {bannerImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentBanner(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === currentBanner 
                                                    ? 'bg-white scale-125' 
                                                    : 'bg-white/50 scale-100 hover:bg-white/70'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Services Section with Tabs */}
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="pt-4"
                    >
                        {/* Tab Navigation - Enhanced Responsive Design */}
                        <div className="flex justify-center mb-8 px-4">
                            <div className="w-full max-w-lg sm:max-w-none sm:w-auto">
                                {/* Mobile Stacked Layout for small screens */}
                                <div className="sm:hidden flex flex-col space-y-2 bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-xl shadow-black/10">
                                    <motion.button
                                        onClick={() => setActiveCategoryTab('prepaid')}
                                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-500 relative overflow-hidden ${
                                            activeCategoryTab === 'prepaid' 
                                                ? 'text-white shadow-lg shadow-blue-700/30' 
                                                : 'text-white/80 hover:text-white hover:bg-white/5'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {activeCategoryTab === 'prepaid' && (
                                            <motion.div
                                                layoutId="activeTabMobile"
                                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center justify-center">
                                            <FaMobileAlt className="mr-2" />
                                            {t.categories.prepaid.title}
                                        </span>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveCategoryTab('postpaid')}
                                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-500 relative overflow-hidden ${
                                            activeCategoryTab === 'postpaid' 
                                                ? 'text-white shadow-lg shadow-emerald-700/30' 
                                                : 'text-white/80 hover:text-white hover:bg-white/5'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {activeCategoryTab === 'postpaid' && (
                                            <motion.div
                                                layoutId="activeTabMobile"
                                                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center justify-center">
                                            <FaCreditCard className="mr-2" />
                                            {t.categories.postpaid.title}
                                        </span>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveCategoryTab('socialmedia')}
                                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-500 relative overflow-hidden ${
                                            activeCategoryTab === 'socialmedia' 
                                                ? 'text-white shadow-lg shadow-pink-700/30' 
                                                : 'text-white/80 hover:text-white hover:bg-white/5'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {activeCategoryTab === 'socialmedia' && (
                                            <motion.div
                                                layoutId="activeTabMobile"
                                                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center justify-center">
                                            <FaHeart className="mr-2" />
                                            {t.categories.socialmedia.title}
                                        </span>
                                    </motion.button>
                                </div>

                                {/* Desktop Horizontal Layout */}
                                <div className="hidden sm:inline-flex bg-white/10 backdrop-blur-lg rounded-full p-1.5 border border-white/20 shadow-xl shadow-black/10">
                                    <motion.button
                                        onClick={() => setActiveCategoryTab('prepaid')}
                                        className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-500 relative overflow-hidden whitespace-nowrap ${
                                            activeCategoryTab === 'prepaid' 
                                                ? 'text-white shadow-lg shadow-blue-700/30' 
                                                : 'text-white/80 hover:text-white'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {activeCategoryTab === 'prepaid' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center">
                                            <FaMobileAlt className="mr-2 text-sm" />
                                            {t.categories.prepaid.title}
                                        </span>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveCategoryTab('postpaid')}
                                        className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-500 relative overflow-hidden whitespace-nowrap ${
                                            activeCategoryTab === 'postpaid' 
                                                ? 'text-white shadow-lg shadow-emerald-700/30' 
                                                : 'text-white/80 hover:text-white'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {activeCategoryTab === 'postpaid' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center">
                                            <FaCreditCard className="mr-2 text-sm" />
                                            {t.categories.postpaid.title}
                                        </span>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveCategoryTab('socialmedia')}
                                        className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-500 relative overflow-hidden whitespace-nowrap ${
                                            activeCategoryTab === 'socialmedia' 
                                                ? 'text-white shadow-lg shadow-pink-700/30' 
                                                : 'text-white/80 hover:text-white'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {activeCategoryTab === 'socialmedia' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center">
                                            <FaHeart className="mr-2 text-sm" />
                                            {t.categories.socialmedia.title}
                                        </span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Prepaid Services Tab */}
                        <AnimatePresence mode="wait">
                            {activeCategoryTab === 'prepaid' && (
                                <motion.div
                                    key="prepaid"
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                                    transition={{ 
                                        duration: 0.6, 
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                        staggerChildren: 0.1 
                                    }}
                                    className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl shadow-blue-900/20"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                        {t.categories.prepaid.title}
                                    </h2>
                                    <motion.div 
                                        className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        {t.categories.prepaid.items.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                custom={index}
                                                variants={fadeInUp}
                                                whileHover={{ scale: 1.05, y: -6, transition: { duration: 0.3 } }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-white/10 hover:border-blue-500/50 transition-all duration-500 cursor-pointer group hover:bg-gradient-to-b hover:from-blue-900/30 hover:to-purple-900/30 shadow-lg shadow-black/5 hover:shadow-blue-900/20 min-h-[120px] flex flex-col"
                                            >
                                                <div className="text-center flex-1 flex flex-col justify-between">
                                                    <div className="mb-2 md:mb-3 flex justify-center flex-shrink-0">
                                                        <div className="p-2.5 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:from-purple-500 group-hover:to-pink-600 transition-all duration-500 shadow-lg shadow-blue-900/30 group-hover:shadow-purple-900/40">
                                                            <item.icon className="text-base md:text-xl text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-center min-h-0">
                                                        <p className="text-white text-xs md:text-sm font-medium leading-tight text-center break-words hyphens-auto overflow-hidden line-clamp-2">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Postpaid Services Tab */}
                        <AnimatePresence mode="wait">
                            {activeCategoryTab === 'postpaid' && (
                                <motion.div
                                    key="postpaid"
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                                    transition={{ 
                                        duration: 0.6, 
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                        staggerChildren: 0.1 
                                    }}
                                    className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl shadow-emerald-900/20"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
                                        {t.categories.postpaid.title}
                                    </h2>
                                    <motion.div 
                                        className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        {t.categories.postpaid.items.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                custom={index}
                                                variants={fadeInUp}
                                                whileHover={{ scale: 1.05, y: -6, transition: { duration: 0.3 } }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer group hover:bg-gradient-to-b hover:from-emerald-900/30 hover:to-teal-900/30 shadow-lg shadow-black/5 hover:shadow-emerald-900/20 min-h-[120px] flex flex-col"
                                            >
                                                <div className="text-center flex-1 flex flex-col justify-between">
                                                    <div className="mb-2 md:mb-3 flex justify-center flex-shrink-0">
                                                        <div className="p-2.5 md:p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl group-hover:from-teal-500 group-hover:to-cyan-600 transition-all duration-500 shadow-lg shadow-emerald-900/30 group-hover:shadow-teal-900/40">
                                                            <item.icon className="text-base md:text-xl text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-center min-h-0">
                                                        <p className="text-white text-xs md:text-sm font-medium leading-tight text-center break-words hyphens-auto overflow-hidden line-clamp-2">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Social Media Services Tab */}
                        <AnimatePresence mode="wait">
                            {activeCategoryTab === 'socialmedia' && (
                                <motion.div
                                    key="socialmedia"
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                                    transition={{ 
                                        duration: 0.6, 
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                        staggerChildren: 0.1 
                                    }}
                                    className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl shadow-pink-900/20"
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
                                        {t.categories.socialmedia.title}
                                    </h2>
                                    <motion.div 
                                        className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        {t.categories.socialmedia.items.map((item, index) => {
                                            // Extract category name for routing
                                            const categorySlug = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                                            
                                            return (
                                                <motion.div
                                                    key={index}
                                                    custom={index}
                                                    variants={fadeInUp}
                                                    whileHover={{ scale: 1.05, y: -6, transition: { duration: 0.3 } }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => window.location.href = `/products/social/${categorySlug}`}
                                                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 md:p-4 border border-white/10 hover:border-pink-500/50 transition-all duration-500 cursor-pointer group hover:bg-gradient-to-b hover:from-pink-900/30 hover:to-purple-900/30 shadow-lg shadow-black/5 hover:shadow-pink-900/20 min-h-[120px] flex flex-col"
                                                >
                                                <div className="text-center flex-1 flex flex-col justify-between">
                                                    <div className="mb-2 md:mb-3 flex justify-center flex-shrink-0">
                                                        <div className="p-2.5 md:p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl group-hover:from-purple-500 group-hover:to-pink-600 transition-all duration-500 shadow-lg shadow-pink-900/30 group-hover:shadow-purple-900/40">
                                                            <item.icon className="text-base md:text-xl text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-center min-h-0">
                                                        <p className="text-white text-xs md:text-sm font-medium leading-tight text-center break-words hyphens-auto overflow-hidden line-clamp-2">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                        })}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>

                    {/* Popular Games */}
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                        className="pt-4"
                    >
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text inline-block">
                                {t.games.title}
                            </h2>
                            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
                                {t.games.subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                            {games.map((game, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={fadeInUp}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-br from-gray-900/70 to-purple-900/30 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group shadow-xl shadow-black/10 hover:shadow-purple-900/30"
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={game.image}
                                            alt={game.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.currentTarget.src = '/assets/images/placeholder-game.jpg';
                                            }}
                                        />
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent opacity-70"></div>
                                        <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-lg shadow-red-900/30 flex items-center">
                                            <FaStar className="mr-1" size={12} />
                                            {game.discount}
                                        </div>
                                    </div>
                                    <div className="p-3 md:p-4">
                                        <h3 className="text-white font-medium text-center text-sm md:text-base">
                                            {game.name}
                                        </h3>
                                        <div className="mt-2 md:mt-3 flex justify-center">
                                            <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-xs md:text-sm font-medium transition-colors shadow-lg shadow-purple-900/30 flex items-center justify-center space-x-2">
                                                <FaGamepad />
                                                <span>Top Up</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                className="py-12 mt-8 border-t border-white/10"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text inline-block">
                            {t.navbar.brand}
                        </h2>
                        <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
                            Your one-stop solution for all digital top-up services, payments, and gaming credits.
                        </p>
                        <div className="flex justify-center items-center space-x-6 mb-6">
                            <Link 
                                href="/tos" 
                                className="text-white/70 hover:text-blue-400 transition-colors text-sm"
                            >
                                Terms of Service
                            </Link>
                            <span className="text-white/30">|</span>
                            <a 
                                href="#" 
                                className="text-white/70 hover:text-blue-400 transition-colors text-sm"
                            >
                                Privacy Policy
                            </a>
                            <span className="text-white/30">|</span>
                            <a 
                                href="#" 
                                className="text-white/70 hover:text-blue-400 transition-colors text-sm"
                            >
                                Contact Us
                            </a>
                        </div>
                        <div className="flex justify-center space-x-4">
                            {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((social, index) => (
                                <a 
                                    key={index}
                                    href="#" 
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                                >
                                    {social[0]}
                                </a>
                            ))}
                        </div>
                        <p className="text-white/60 text-xs mt-8">
                            © 2025 NexusShop. All rights reserved.
                        </p>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

export default Products;
