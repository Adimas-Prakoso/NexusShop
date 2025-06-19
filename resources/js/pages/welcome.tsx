import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion } from 'framer-motion';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react'; // Add this import for SEO meta tags
import { 
    FaBolt, 
    FaLock, 
    FaTrophy, 
    FaGamepad, 
    FaFire, 
    FaBomb, 
    FaCrosshairs,
    FaCreditCard,
    FaEdit,
    FaBullseye,
    FaRocket,
    FaStar // Add this import for the star rating
} from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import { GiPistolGun, GiSwordAltar } from 'react-icons/gi';

interface LoadingProgressEvent {
  loaded: number;
  total: number;
}

// Language translations
const translations = {
    en: {
        navbar: {
            brand: "NexusShop",
            home: "Home",
            features: "Features",
            pricing: "Services",
            contact: "Contact",
            login: "Login"
        },
        hero: {
            title: "NexusShop",
            subtitle: "Your Ultimate Digital Top-Up Platform for Games, Mobile Credit, Internet & More",
            getStarted: "Get Started",
            learnMore: "Learn More",
            topup: "Topup Now" // Add this for English
        },
        features: {
            title: "Comprehensive Top-Up Services",
            subtitle: "Everything you need for digital payments and top-ups in one place",
            items: [
                {
                    title: "Instant Top-ups",
                    description: "Top up games, mobile credit, internet packages instantly with multiple payment methods."
                },
                {
                    title: "Secure Transactions",
                    description: "End-to-end encryption ensures your data and money are always protected with every transaction."
                },
                {
                    title: "24/7 Support",
                    description: "Round-the-clock customer support to help you with any top-up needs or issues."
                }
            ]
        },
        services: {
            title: "Top-Up Services",
            subtitle: "Choose from our wide range of digital top-up services",
            items: [
                { name: "Game Credits", description: "Mobile Legends, PUBG, Free Fire, Genshin Impact & more", popular: false },
                { name: "Mobile Credit", description: "All operators: Telkomsel, Indosat, XL, Tri, Smartfren", popular: true },
                { name: "Internet Packages", description: "Data packages for all major providers", popular: false },
                { name: "Digital Vouchers", description: "Google Play, App Store, Steam, Netflix & more", popular: false }
            ],
            features: ["Instant delivery", "Best prices", "24/7 support"],
            button: "Top-up Now"
        },
        testimonials: {
            title: "What Our Customers Say",
            subtitle: "Join millions of satisfied customers using our top-up platform",
            items: [
                {
                    name: "Alex Johnson",
                    role: "Mobile Gamer",
                    quote: "The fastest and most reliable top-up service! My game credits are delivered instantly every time."
                },
                {
                    name: "Sarah Miller",
                    role: "Content Creator",
                    quote: "I use NexusShop for all my digital needs - from mobile credit to streaming vouchers. Excellent service!"
                },
                {
                    name: "Michael Chen",
                    role: "Business Owner",
                    quote: "Perfect for managing team mobile credits and internet packages. Bulk top-ups made easy!"
                }
            ]
        },
        stats: {
            title: "Trusted by Millions",
            items: [
                { number: "2M+", label: "Happy Customers" },
                { number: "50M+", label: "Transactions Completed" },
                { number: "500+", label: "Games & Services" },
                { number: "24/7", label: "Customer Support" }
            ]
        },
        popularGames: {
            title: "Most Popular Games",
            subtitle: "Top-up your favorite games instantly",
            games: [
                { name: "Mobile Legends", discount: "5% OFF", icon: FaGamepad, image: "/assets/images/mlbb.png" },
                { name: "PUBG Mobile", discount: "10% OFF", icon: GiPistolGun, image: "/assets/images/pubg-mobile.png" },
                { name: "Free Fire", discount: "8% OFF", icon: FaFire, image: "/assets/images/free-fire.png" },
                { name: "Genshin Impact", discount: "12% OFF", icon: GiSwordAltar, image: "/assets/images/genshin-impact.webp" },
                { name: "Call of Duty", discount: "7% OFF", icon: FaBomb, image: "/assets/images/call-of-duty.jpg" },
                { name: "Valorant", discount: "15% OFF", icon: FaCrosshairs, image: "/assets/images/valorant.png" }
            ]
        },
        howItWorks: {
            title: "How It Works",
            subtitle: "Simple steps to top-up your account",
            steps: [
                { title: "Choose Service", description: "Select your game or service", icon: FaBullseye },
                { title: "Enter Details", description: "Input your game ID or phone number", icon: FaEdit },
                { title: "Make Payment", description: "Pay with your preferred method", icon: FaCreditCard },
                { title: "Get Credits", description: "Receive your top-up instantly", icon: FaBolt }
            ]
        },
        contact: {
            title: "Get in Touch",
            subtitle: "We're here to help with all your top-up needs",
            form: {
                name: "Full Name",
                email: "Email Address",
                subject: "Subject",
                message: "Your Message",
                button: "Send Message"
            },
            info: [
                { icon: MdEmail, title: "Email Us", value: "support@nexusshop.com" },
                { icon: MdPhone, title: "Call Us", value: "+62-(812)-9141-0009" }
            ]
        },
        footer: {
            brand: "NexusShop",
            description: "Your trusted partner for all digital top-up services including games, mobile credit, internet packages, and digital vouchers.",
            products: {
                title: "Services",
                items: [
                    { name: "Game Top-Up", link: "#" },
                    { name: "Mobile Credit", link: "#" },
                    { name: "Internet Packages", link: "#" },
                    { name: "Digital Vouchers", link: "#" }
                ]
            },
            company: {
                title: "Company",
                items: [
                    { name: "About Us", link: "#" },
                    { name: "Careers", link: "#" },
                    { name: "Blog", link: "#" },
                    { name: "Press", link: "#" }
                ]
            },
            support: {
                title: "Support",
                items: [
                    { name: "Help Center", link: "#" },
                    { name: "Contact Us", link: "#" },
                    { name: "Privacy Policy", link: "#" },
                    { name: "Terms of Service", link: "/tos" }
                ]
            },
            copyright: "© 2023 NexusShop. All rights reserved."
        },
        loading: "Loading 3D Assets..."
    },
    id: {
        navbar: {
            brand: "NexusShop",
            home: "Beranda",
            features: "Fitur",
            pricing: "Layanan",
            contact: "Kontak",
            login: "Masuk"
        },
        hero: {
            title: "NexusShop",
            subtitle: "Platform Top-Up Digital Terlengkap untuk Game, Pulsa, Internet & Lainnya",
            getStarted: "Mulai Sekarang",
            learnMore: "Pelajari Lebih Lanjut",
            topup: "Topup Sekarang" // Add this for Indonesian
        },
        features: {
            title: "Layanan Top-Up Lengkap",
            subtitle: "Semua kebutuhan pembayaran dan top-up digital dalam satu tempat",
            items: [
                {
                    title: "Top-Up Instan",
                    description: "Top-up game, pulsa, paket internet secara instan dengan berbagai metode pembayaran."
                },
                {
                    title: "Transaksi Aman",
                    description: "Enkripsi end-to-end memastikan data dan uang Anda selalu terlindungi di setiap transaksi."
                },
                {
                    title: "Dukungan 24/7",
                    description: "Layanan pelanggan 24 jam untuk membantu segala kebutuhan top-up Anda."
                }
            ]
        },
        services: {
            title: "Layanan Top-Up",
            subtitle: "Pilih dari berbagai layanan top-up digital kami",
            items: [
                { name: "Kredit Game", description: "Mobile Legends, PUBG, Free Fire, Genshin Impact & lainnya", popular: false },
                { name: "Pulsa", description: "Semua operator: Telkomsel, Indosat, XL, Tri, Smartfren", popular: true },
                { name: "Paket Internet", description: "Paket data untuk semua provider utama", popular: false },
                { name: "Voucher Digital", description: "Google Play, App Store, Steam, Netflix & lainnya", popular: false }
            ],
            features: ["Pengiriman instan", "Harga terbaik", "Dukungan 24/7"],
            button: "Top-up Sekarang"
        },
        testimonials: {
            title: "Kata Pelanggan Kami",
            subtitle: "Bergabung dengan jutaan pelanggan yang puas menggunakan platform top-up kami",
            items: [
                {
                    name: "Alex Johnson",
                    role: "Gamer Mobile",
                    quote: "Layanan top-up tercepat dan terpercaya! Kredit game saya selalu terkirim instan setiap waktu."
                },
                {
                    name: "Sarah Miller",
                    role: "Content Creator",
                    quote: "Saya menggunakan NexusShop untuk semua kebutuhan digital - dari pulsa hingga voucher streaming. Layanan excellent!"
                },
                {
                    name: "Michael Chen",
                    role: "Pemilik Bisnis",
                    quote: "Sempurna untuk mengelola pulsa tim dan paket internet. Top-up massal jadi mudah!"
                }
            ]
        },
        stats: {
            title: "Dipercaya Jutaan Orang",
            items: [
                { number: "2J+", label: "Pelanggan Puas" },
                { number: "50J+", label: "Transaksi Selesai" },
                { number: "500+", label: "Game & Layanan" },
                { number: "24/7", label: "Dukungan Pelanggan" }
            ]
        },
        popularGames: {
            title: "Game Paling Populer",
            subtitle: "Top-up game favorit Anda secara instan",
            games: [
                { name: "Mobile Legends", discount: "DISKON 5%", icon: FaGamepad, image: "/assets/images/mlbb.png" },
                { name: "PUBG Mobile", discount: "DISKON 10%", icon: GiPistolGun, image: "/assets/images/pubg-mobile.png" },
                { name: "Free Fire", discount: "DISKON 8%", icon: FaFire, image: "/assets/images/free-fire.png" },
                { name: "Genshin Impact", discount: "DISKON 12%", icon: GiSwordAltar, image: "/assets/images/genshin-impact.webp" },
                { name: "Call of Duty", discount: "DISKON 7%", icon: FaBomb, image: "/assets/images/call-of-duty.jpg" },
                { name: "Valorant", discount: "DISKON 15%", icon: FaCrosshairs, image: "/assets/images/valorant.png" }
            ]
        },
        howItWorks: {
            title: "Cara Kerja",
            subtitle: "Langkah mudah untuk top-up akun Anda",
            steps: [
                { title: "Pilih Layanan", description: "Pilih game atau layanan Anda", icon: FaBullseye },
                { title: "Masukkan Detail", description: "Input ID game atau nomor telepon", icon: FaEdit },
                { title: "Lakukan Pembayaran", description: "Bayar dengan metode pilihan Anda", icon: FaCreditCard },
                { title: "Terima Kredit", description: "Dapatkan top-up Anda secara instan", icon: FaBolt }
            ]
        },
        contact: {
            title: "Hubungi Kami",
            subtitle: "Kami siap membantu semua kebutuhan top-up Anda",
            form: {
                name: "Nama Lengkap",
                email: "Alamat Email",
                subject: "Subjek",
                message: "Pesan Anda",
                button: "Kirim Pesan"
            },
            info: [
                { icon: MdEmail, title: "Email Kami", value: "support@nexusshop.com" },
                { icon: MdPhone, title: "Telepon Kami", value: "+62 21 1234-5678" }
            ]
        },
        footer: {
            brand: "NexusShop",
            description: "Mitra terpercaya untuk semua layanan top-up digital termasuk game, pulsa, paket internet, dan voucher digital.",
            products: {
                title: "Layanan",
                items: [
                    { name: "Top-Up Game", link: "#" },
                    { name: "Pulsa", link: "#" },
                    { name: "Paket Internet", link: "#" },
                    { name: "Voucher Digital", link: "#" }
                ]
            },
            company: {
                title: "Perusahaan",
                items: [
                    { name: "Tentang Kami", link: "#" },
                    { name: "Karir", link: "#" },
                    { name: "Blog", link: "#" },
                    { name: "Pers", link: "#" }
                ]
            },
            support: {
                title: "Dukungan",
                items: [
                    { name: "Pusat Bantuan", link: "#" },
                    { name: "Hubungi Kami", link: "#" },
                    { name: "Kebijakan Privasi", link: "#" },
                    { name: "Syarat Layanan", link: "/tos" }
                ]
            },
            copyright: "© 2023 NexusShop. Semua hak dilindungi."
        },
        loading: "Memuat Aset 3D..."
    }
};

const Welcome = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState<'en' | 'id'>('en');
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [imageLoadStates, setImageLoadStates] = useState<{[key: string]: boolean}>({});

    const t = translations[currentLanguage];

    const changeLanguage = (lang: 'en' | 'id') => {
        setCurrentLanguage(lang);
        setIsLanguageMenuOpen(false);
    };

    // SEO data based on current language
    const seoData = {
        en: {
            title: "NexusShop - Digital Top-Up Platform for Games, Mobile Credit & Internet",
            description: "NexusShop is your ultimate digital top-up platform for games like Mobile Legends, PUBG, Free Fire, mobile credit for all operators, internet packages, and digital vouchers. Fast, secure, and reliable service 24/7.",
            keywords: "digital top-up, game credits, mobile credit, internet packages, Mobile Legends, PUBG, Free Fire, Genshin Impact, digital vouchers, online payment, gaming top-up",
            ogTitle: "NexusShop - Fast & Secure Digital Top-Up Services",
            ogDescription: "Top-up games, mobile credit, and internet packages instantly. Trusted by 2M+ customers with 24/7 support.",
            twitterTitle: "NexusShop - Your Digital Top-Up Solution",
            twitterDescription: "Instant top-up for games, mobile credit & internet. Join 2M+ satisfied customers. Fast, secure, reliable.",
        },
        id: {
            title: "NexusShop - Platform Top-Up Digital untuk Game, Pulsa & Internet",
            description: "NexusShop adalah platform top-up digital terlengkap untuk game seperti Mobile Legends, PUBG, Free Fire, pulsa semua operator, paket internet, dan voucher digital. Layanan cepat, aman, dan terpercaya 24/7.",
            keywords: "top-up digital, kredit game, pulsa, paket internet, Mobile Legends, PUBG, Free Fire, Genshin Impact, voucher digital, pembayaran online, top-up gaming",
            ogTitle: "NexusShop - Layanan Top-Up Digital Cepat & Aman",
            ogDescription: "Top-up game, pulsa, dan paket internet secara instan. Dipercaya 2J+ pelanggan dengan dukungan 24/7.",
            twitterTitle: "NexusShop - Solusi Top-Up Digital Anda",
            twitterDescription: "Top-up instan untuk game, pulsa & internet. Bergabung dengan 2J+ pelanggan puas. Cepat, aman, terpercaya.",
        }
    };

    const currentSeo = seoData[currentLanguage];

    // Handle 3D background effect
    useEffect(() => {
        if (!mountRef.current) return;

        // Save the ref value to make it available in cleanup
        const currentMount = mountRef.current;
        
        // Setup scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000918); // Dark space background
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        // Add ambient lighting - dim for space
        const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
        scene.add(ambientLight);

        // Add directional light - like distant sun
        const directionalLight = new THREE.DirectionalLight(0xaaaaff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
        
        // Add a point light - for dramatic effect
        const pointLight = new THREE.PointLight(0x3677ff, 1.5, 20);
        pointLight.position.set(-5, 2, 3);
        scene.add(pointLight);
        
        // Create stars - distant background (keeping some stars for added depth)
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            // Position stars in a sphere around the scene
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
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Load 3D Galaxy Model
        const loader = new GLTFLoader();
        let galaxyModel: THREE.Group;
        
        // Loading indicator
        const loadingElement = document.createElement('div');
        loadingElement.style.position = 'absolute';
        loadingElement.style.top = '50%';
        loadingElement.style.left = '50%';
        loadingElement.style.transform = 'translate(-50%, -50%)';
        loadingElement.style.color = 'white';
        loadingElement.style.fontSize = '20px';
        loadingElement.textContent = 'Loading galaxy...';
        if (currentMount) {
            currentMount.appendChild(loadingElement);
        }

        // Load the Galaxy model
        // Replace '/path/to/galaxy-model.glb' with the actual path to your model
        loader.load(
            '/assets/models/galaxy-model.glb', // Update this path to your model location
            (gltf: GLTF) => {
                galaxyModel = gltf.scene;
                
                // Increase scale to make the galaxy appear larger
                galaxyModel.scale.set(20, 20, 20); // Increased from 5 to 10 for more zoom
                
                // Position the galaxy model slightly closer to the camera
                galaxyModel.position.set(0, 0, -5);
                
                // Add the model to the scene
                scene.add(galaxyModel);
                
                // Remove loading indicator
                if (currentMount && loadingElement.parentNode === currentMount) {
                    currentMount.removeChild(loadingElement);
                }
                
                setIsModelLoaded(true);
            },
            // Progress callback
            (xhr: LoadingProgressEvent) => {
                const progress = (xhr.loaded / xhr.total) * 100;
                if (loadingElement) {
                    loadingElement.textContent = `Loading galaxy... ${Math.round(progress)}%`;
                }
            },
            // Error callback - Fix: Changed type from Error to unknown
            (error: unknown) => {
                console.error('An error happened while loading the model:', error);
                if (loadingElement) {
                    loadingElement.textContent = 'Error loading galaxy model';
                }
            }
        );

        // Position camera - adjust for better view of the galaxy
        camera.position.z = 10; // Reduced from 15 to 10 to get closer
        camera.position.y = 3;  // Reduced from 5 to 3 to center more on the galaxy
        
        // Setup orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; // Disable zoom
        controls.enablePan = false;  // Disable panning
        controls.enableRotate = false; // Disable manual rotation
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.2;
        
        // Disable all user interaction with the 3D scene
        controls.enabled = false;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Rotate galaxy if it's loaded
            if (galaxyModel) {
                galaxyModel.rotation.y += 0.0005;
            }
            
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Scroll effect handler
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            if (currentMount) {
                if (loadingElement.parentNode === currentMount) {
                    currentMount.removeChild(loadingElement);
                }
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="landing-page">
            <Head>
                {/* Basic Meta Tags */}
                <title>{currentSeo.title}</title>
                <meta name="description" content={currentSeo.description} />
                <meta name="keywords" content={currentSeo.keywords} />
                <meta name="author" content="NexusShop" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="canonical" href="https://nexusshop.com" />

                {/* Language and Locale */}
                <meta httpEquiv="content-language" content={currentLanguage === 'en' ? 'en-US' : 'id-ID'} />
                <link rel="alternate" hrefLang="en" href="https://nexusshop.com?lang=en" />
                <link rel="alternate" hrefLang="id" href="https://nexusshop.com?lang=id" />
                <link rel="alternate" hrefLang="x-default" href="https://nexusshop.com" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://nexusshop.com" />
                <meta property="og:title" content={currentSeo.ogTitle} />
                <meta property="og:description" content={currentSeo.ogDescription} />
                <meta property="og:image" content="https://nexusshop.com/images/og-image.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="NexusShop" />
                <meta property="og:locale" content={currentLanguage === 'en' ? 'en_US' : 'id_ID'} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://nexusshop.com" />
                <meta property="twitter:title" content={currentSeo.twitterTitle} />
                <meta property="twitter:description" content={currentSeo.twitterDescription} />
                <meta property="twitter:image" content="https://nexusshop.com/images/twitter-image.jpg" />
                <meta property="twitter:site" content="@NexusShop" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* Additional SEO Meta Tags */}
                <meta name="theme-color" content="#10B981" />
                <meta name="msapplication-TileColor" content="#10B981" />
                <meta name="application-name" content="NexusShop" />
                <meta name="apple-mobile-web-app-title" content="NexusShop" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

                {/* Structured Data - Organization */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "NexusShop",
                        "url": "https://nexusshop.com",
                        "logo": "https://nexusshop.com/images/logo.png",
                        "description": currentSeo.description,
                        "foundingDate": "2023",
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": currentLanguage === 'en' ? "+62-812-9141-0009" : "+62-812-9141-0009",
                            "contactType": "Customer Service",
                            "availableLanguage": ["English", "Indonesian"]
                        },
                        "sameAs": [
                            "https://facebook.com/nexusshop",
                            "https://twitter.com/nexusshop",
                            "https://instagram.com/nexusshop"
                        ]
                    })}
                </script>

                {/* Structured Data - WebSite */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "NexusShop",
                        "url": "https://nexusshop.com",
                        "description": currentSeo.description,
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://nexusshop.com/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>

                {/* Structured Data - Service */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "serviceType": "Digital Top-Up Services",
                        "provider": {
                            "@type": "Organization",
                            "name": "NexusShop"
                        },
                        "areaServed": "Global",
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Digital Top-Up Services",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Game Credits Top-Up"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Mobile Credit Top-Up"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Internet Package Top-Up"
                                    }
                                }
                            ]
                        }
                    })}
                </script>

                {/* Structured Data - FAQ */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": currentLanguage === 'en' ? "How fast is the top-up process?" : "Seberapa cepat proses top-up?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": currentLanguage === 'en' ? "Our top-up process is instant. Most transactions are completed within seconds." : "Proses top-up kami instan. Sebagian besar transaksi selesai dalam hitungan detik."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": currentLanguage === 'en' ? "Is NexusShop secure?" : "Apakah NexusShop aman?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": currentLanguage === 'en' ? "Yes, we use end-to-end encryption to ensure your data and money are always protected." : "Ya, kami menggunakan enkripsi end-to-end untuk memastikan data dan uang Anda selalu terlindungi."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": currentLanguage === 'en' ? "What games do you support?" : "Game apa saja yang didukung?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": currentLanguage === 'en' ? "We support 500+ games including Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact, Call of Duty Mobile, and many more." : "Kami mendukung 500+ game termasuk Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact, Call of Duty Mobile, dan banyak lagi."
                                }
                            }
                        ]
                    })}
                </script>
            </Head>

            {/* Hero Section with 3D Background */}
            <div className="hero-section relative h-screen flex items-center justify-center overflow-hidden">
                {/* 3D Background Canvas */}
                <div 
                    ref={mountRef} 
                    className="absolute inset-0 z-0"
                />
                
                {/* Content Overlay */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                            {t.hero.title}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto drop-shadow-md px-4">
                            {t.hero.subtitle}
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/products"
                                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-4 text-base md:text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30 focus:outline-none"
                                aria-label={currentLanguage === 'en' ? 'Start topping up your games and mobile credit now' : 'Mulai top-up game dan pulsa Anda sekarang'}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    <FaRocket className="mr-3 h-6 w-6 animate-pulse" />
                                    {t.hero.topup}
                                </span>
                                <span className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-700"></span>
                                <span className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-700"></span>
                                <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-[#2e4aff]/20 via-[#a537fd]/20 to-[#2e4aff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                                <span className="absolute h-full w-full animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0_at_50%_50%,rgba(0,0,0,0)_0deg,rgba(255,255,255,0.3)_60deg,rgba(0,0,0,0)_120deg)]"></span>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Model loading indicator */}
                {!isModelLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg mx-4">
                            <p className="text-white text-base sm:text-lg">{t.loading}</p>
                        </div>
                    </div>
                )}

                {/* Sticky Navbar */}
                <nav className={`fixed top-0 left-0 w-full py-4 sm:py-6 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-gray-700/50' 
                        : 'bg-transparent'
                }`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-white text-xl sm:text-2xl font-bold flex items-center space-x-2"
                        >
                            <img 
                                src="/logo.png" 
                                alt="NexusShop Logo" 
                                className="h-8 w-8 sm:h-10 sm:w-10"
                            />
                            <span className="hidden sm:inline">{t.navbar.brand}</span>
                        </motion.div>

                        {/* Desktop Menu */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden lg:flex items-center space-x-6 xl:space-x-8"
                        >
                            {[
                                { key: 'home', label: t.navbar.home },
                                { key: 'features', label: t.navbar.features },
                                { key: 'pricing', label: t.navbar.pricing },
                                { key: 'contact', label: t.navbar.contact }
                            ].map((item) => (
                                <a 
                                    key={item.key} 
                                    className="text-white hover:text-emerald-300 transition-colors text-sm xl:text-base" 
                                    href={`#${item.key}`}
                                >
                                    {item.label}
                                </a>
                            ))}
                            
                            {/* Language Selector */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                                    className="text-white hover:text-emerald-300 transition-colors flex items-center space-x-1 text-sm xl:text-base"
                                >
                                    <span>{currentLanguage.toUpperCase()}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isLanguageMenuOpen && (
                                    <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                                        <button 
                                            onClick={() => changeLanguage('en')}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentLanguage === 'en' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'}`}
                                        >
                                            English
                                        </button>
                                        <button 
                                            onClick={() => changeLanguage('id')}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentLanguage === 'id' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'}`}
                                        >
                                            Bahasa Indonesia
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <button className="bg-white text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors text-sm xl:text-base">
                                {t.navbar.login}
                            </button>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="lg:hidden text-white p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <motion.div 
                        initial={false}
                        animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden overflow-hidden bg-slate-900/95 backdrop-blur-md border-t border-gray-700/50"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-4">
                            {[
                                { key: 'home', label: t.navbar.home },
                                { key: 'features', label: t.navbar.features },
                                { key: 'pricing', label: t.navbar.pricing },
                                { key: 'contact', label: t.navbar.contact }
                            ].map((item) => (
                                <a 
                                    key={item.key} 
                                    className="block text-white hover:text-emerald-300 transition-colors py-2" 
                                    href={`#${item.key}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            
                            {/* Mobile Language Selector */}
                            <div className="border-t border-gray-700/50 pt-4">
                                <p className="text-gray-400 text-sm mb-2">Language:</p>
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={() => {
                                            changeLanguage('en');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`text-sm px-3 py-1 rounded ${currentLanguage === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'}`}
                                    >
                                        English
                                    </button>
                                    <button 
                                        onClick={() => {
                                            changeLanguage('id');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`text-sm px-3 py-1 rounded ${currentLanguage === 'id' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'}`}
                                    >
                                        Bahasa
                                    </button>
                                </div>
                            </div>
                            
                            <button className="w-full bg-white text-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors">
                                {t.navbar.login}
                            </button>
                        </div>
                    </motion.div>
                </nav>

                {/* Scroll indicator */}
                <motion.div 
                    className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t.features.title}</h2>
                        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">{t.features.subtitle}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {t.features.items.map((feature, index) => (
                            <motion.article 
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700 hover:border-emerald-500/30 transition-all"
                            >
                                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 text-emerald-400">
                                    {index === 0 && <FaBolt />}
                                    {index === 1 && <FaLock />}
                                    {index === 2 && <FaTrophy />}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
                                <p className="text-gray-300 text-sm sm:text-base">{feature.description}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 relative overflow-hidden">
                {/* Space particles background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-20 right-20 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
                    <div className="absolute bottom-16 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/4 right-10 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">{t.stats.title}</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {t.stats.items.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-emerald-100 text-xs sm:text-sm lg:text-base">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Games Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-800 via-gray-900 to-slate-900 relative">
                {/* Enhanced nebula-like background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-1/4 left-1/5 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-20 right-1/3 w-16 h-16 bg-cyan-600/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-indigo-600/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.header
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">{t.popularGames.title}</h2>
                        <p className="text-xl text-gray-300">{t.popularGames.subtitle}</p>
                    </motion.header>
                    
                    <div className="w-full">
                        {/* Responsive games grid - adjusts based on screen size */}
                        <div className="w-full pb-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {t.popularGames.games.map((game, index) => (
                                    <motion.article
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="group relative bg-gradient-to-br from-gray-800/60 via-gray-700/50 to-gray-800/60 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border border-gray-600/30 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 w-full"
                                        itemScope
                                        itemType="https://schema.org/Game"
                                    >
                                        {/* Discount Badge - Enhanced positioning at top right */}
                                        <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300 border-2 border-white/20" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                            <span itemProp="priceSpecification" className="drop-shadow-sm text-[10px] sm:text-xs">{game.discount}</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/50 to-orange-400/50 rounded-full blur-sm -z-10"></div>
                                        </div>
                                        
                                        {/* Game Image with enhanced effects */}
                                        <div className="aspect-video sm:aspect-square overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 relative">
                                            <img 
                                                src={game.image} 
                                                alt={`${game.name} game cover`}
                                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
                                                loading="lazy"
                                                onLoad={() => {
                                                    setImageLoadStates(prev => ({ ...prev, [game.name]: true }));
                                                }}
                                                onError={(e) => {
                                                    console.error(`Failed to load image for ${game.name}:`, e);
                                                    // Fallback to first available game image
                                                    (e.target as HTMLImageElement).src = '/assets/images/mlbb.png';
                                                }}
                                            />
                                            {/* Loading skeleton for image */}
                                            {!imageLoadStates[game.name] && (
                                                <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                                                    <div className="text-gray-500 text-2xl">
                                                        <FaGamepad className="animate-bounce" />
                                                    </div>
                                                </div>
                                            )}
                                            {/* Multi-layer overlay effects */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                                            
                                            {/* Shine effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                            
                                            {/* Gaming controller icon overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                                <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                                                    <FaGamepad className="text-white text-2xl animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Enhanced Game Info */}
                                        <div className="p-3 sm:p-4 text-center bg-gradient-to-t from-gray-900/90 via-gray-800/70 to-transparent relative">
                                            <h3 className="text-white font-bold text-xs sm:text-sm group-hover:text-emerald-300 transition-colors duration-300 drop-shadow-sm" itemProp="name">
                                                {game.name}
                                            </h3>
                                            <div className="mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                                                <p className="text-[10px] sm:text-xs text-gray-300">{currentLanguage === 'en' ? 'Available Now' : 'Tersedia Sekarang'}</p>
                                                <div className="flex justify-center items-center mt-1">
                                                    <FaStar className="text-yellow-400 text-xs mr-1" />
                                                    <span className="text-[10px] text-gray-400">4.8</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Enhanced glow effects */}
                                        <div className="absolute inset-0 rounded-2xl ring-2 ring-emerald-500/0 group-hover:ring-emerald-400/50 transition-all duration-500"></div>
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-emerald-500/10 group-hover:via-blue-500/5 group-hover:to-purple-500/10 transition-all duration-500"></div>
                                        
                                        {/* Corner accent lines */}
                                        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-emerald-400/0 group-hover:border-emerald-400/60 rounded-tl-2xl transition-all duration-300"></div>
                                        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-emerald-400/0 group-hover:border-emerald-400/60 rounded-br-2xl transition-all duration-300 delay-100"></div>
                                        
                                        {/* Floating particles effect on hover */}
                                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                                            <div className="absolute bottom-1/3 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="pricing" className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 to-gray-900 relative">
                {/* Starfield background */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        ></div>
                    ))}
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">{t.services.title}</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.services.subtitle}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {t.services.items.map((service, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                className={`relative rounded-2xl overflow-hidden ${service.popular ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gray-700'}`}
                            >
                                {service.popular && (
                                    <div className="absolute top-0 right-0 bg-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                                        POPULAR
                                    </div>
                                )}
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{service.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-200 mb-4 sm:mb-6">{service.description}</p>
                                    <ul className="text-gray-200 space-y-2 mb-4 sm:mb-6">
                                        {t.services.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-sm">
                                                <svg className="h-4 w-4 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`w-full py-2 rounded-lg font-bold text-sm ${service.popular ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'} transition-colors`}>
                                        {t.services.button}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-900 via-slate-900 to-purple-900 relative overflow-hidden">
                {/* Cosmic rays effect */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent transform rotate-12"></div>
                    <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent transform -rotate-12"></div>
                    <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-pink-400/20 to-transparent transform rotate-6"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">{t.howItWorks.title}</h2>
                        <p className="text-xl text-gray-300">{t.howItWorks.subtitle}</p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {t.howItWorks.steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="text-center"
                            >
                                <div className="relative mb-4 sm:mb-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl text-white mx-auto mb-4">
                                        <step.icon />
                                    </div>
                                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs sm:text-sm">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{step.title}</h3>
                                <p className="text-gray-300 text-sm sm:text-base">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-900 via-slate-900 to-gray-900 relative">
                {/* Planet-like background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-tl from-blue-600/15 to-cyan-600/15 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-2xl"></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">{t.testimonials.title}</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.testimonials.subtitle}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {t.testimonials.items.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-gray-800/40 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className="h-5 w-5 text-yellow-400 inline-block" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 italic mb-6 flex-grow">{testimonial.quote}</p>
                                    <div>
                                        <p className="text-white font-bold">{testimonial.name}</p>
                                        <p className="text-emerald-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 sm:py-20 bg-gradient-to-b from-indigo-900 via-slate-900 to-gray-900 relative overflow-hidden">
                {/* Space dust effect */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${1 + Math.random() * 2}s`
                            }}
                        ></div>
                    ))}
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">{t.contact.title}</h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.contact.subtitle}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-700"
                        >
                            <form className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder={t.contact.form.name}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder={t.contact.form.email}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t.contact.form.subject}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        rows={6}
                                        placeholder={t.contact.form.message}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
                                >
                                    {t.contact.form.button}
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 sm:space-y-8"
                        >
                            {t.contact.info.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-start space-x-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-emerald-500/30 transition-all"
                                >
                                    <div className="text-3xl text-emerald-400">
                                        <item.icon />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                                        <p className="text-gray-300">{item.value}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Support Hours */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-6 rounded-xl border border-emerald-500/30"
                            >
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    {currentLanguage === 'en' ? 'Support Hours' : 'Jam Layanan'}
                                </h3>
                                <div className="space-y-2 text-gray-300">
                                    <p>{currentLanguage === 'en' ? 'Monday - Friday: 9:00 AM - 6:00 PM' : 'Senin - Jumat: 09:00 - 18:00'}</p>
                                    <p>{currentLanguage === 'en' ? 'Saturday: 10:00 AM - 4:00 PM' : 'Sabtu: 10:00 - 16:00'}</p>
                                    <p>{currentLanguage === 'en' ? 'Sunday: Closed' : 'Minggu: Tutup'}</p>
                                    <p className="text-emerald-400 font-semibold">
                                        {currentLanguage === 'en' ? 'Emergency Support: 24/7' : 'Dukungan Darurat: 24/7'}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8 sm:py-12 relative overflow-hidden">
                {/* Deep space background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                        ></div>
                    ))}
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">{t.footer.brand}</h3>
                            <p className="text-gray-400">{t.footer.description}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">{t.footer.products.title}</h4>
                            <ul className="space-y-2">
                                {t.footer.products.items.map((item) => (
                                    <li key={item.name}>
                                        <a href={item.link} className="text-gray-400 hover:text-emerald-400 transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">{t.footer.company.title}</h4>
                            <ul className="space-y-2">
                                {t.footer.company.items.map((item) => (
                                    <li key={item.name}>
                                        <a href={item.link} className="text-gray-400 hover:text-emerald-400 transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">{t.footer.support.title}</h4>
                            <ul className="space-y-2">
                                {t.footer.support.items.map((item) => (
                                    <li key={item.name}>
                                        {item.link.startsWith('/') ? (
                                            <Link href={item.link} className="text-gray-400 hover:text-emerald-400 transition-colors">
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <a href={item.link} className="text-gray-400 hover:text-emerald-400 transition-colors">
                                                {item.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-gray-400">{t.footer.copyright}</p>
                        <div className="flex space-x-4 mt-4 sm:mt-0">
                            {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                                <a key={social} href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    <span className="sr-only">{social}</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
