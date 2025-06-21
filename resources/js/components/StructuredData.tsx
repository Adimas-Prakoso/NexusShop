import React from 'react';
import { Head } from '@inertiajs/react';

interface StructuredDataProps {
    type: 'Organization' | 'WebSite' | 'Service' | 'FAQPage' | 'BreadcrumbList' | 'Product';
    data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data
    };

    return (
        <Head>
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Head>
    );
};

// Predefined structured data components
export const OrganizationData: React.FC<{ language?: 'en' | 'id' }> = ({ language = 'en' }) => {
    const data = {
        name: 'NexusShop',
        url: 'https://nexusshop.store',
        logo: 'https://nexusshop.store/logo.png',
        description: language === 'en' 
            ? 'Your ultimate digital top-up platform for games, mobile credit, internet packages, and digital vouchers.'
            : 'Platform top-up digital terlengkap untuk game, pulsa, paket internet, dan voucher digital.',
        foundingDate: '2023',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-812-9141-0009',
            contactType: 'customer service',
            availableLanguage: ['English', 'Indonesian']
        },
        sameAs: [
            'https://facebook.com/nexusshop',
            'https://twitter.com/nexusshop',
            'https://instagram.com/nexusshop'
        ]
    };

    return <StructuredData type="Organization" data={data} />;
};

export const WebSiteData: React.FC<{ language?: 'en' | 'id' }> = ({ language = 'en' }) => {
    const data = {
        name: 'NexusShop',
        url: 'https://nexusshop.store',
        description: language === 'en'
            ? 'Digital top-up platform for games, mobile credit, and internet packages.'
            : 'Platform top-up digital untuk game, pulsa, dan paket internet.',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://nexusshop.store/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    };

    return <StructuredData type="WebSite" data={data} />;
};

export const ServiceData: React.FC<{ language?: 'en' | 'id' }> = ({ language = 'en' }) => {
    const data = {
        serviceType: language === 'en' ? 'Digital Top-Up Services' : 'Layanan Top-Up Digital',
        provider: {
            '@type': 'Organization',
            name: 'NexusShop'
        },
        areaServed: 'Global',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: language === 'en' ? 'Digital Top-Up Services' : 'Layanan Top-Up Digital',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: language === 'en' ? 'Game Credits Top-Up' : 'Top-Up Kredit Game'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: language === 'en' ? 'Mobile Credit Top-Up' : 'Top-Up Pulsa'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: language === 'en' ? 'Internet Package Top-Up' : 'Top-Up Paket Internet'
                    }
                }
            ]
        }
    };

    return <StructuredData type="Service" data={data} />;
};

export const FAQData: React.FC<{ language?: 'en' | 'id' }> = ({ language = 'en' }) => {
    const faqs = language === 'en' ? [
        {
            question: 'How fast is the top-up process?',
            answer: 'Our top-up process is instant. Most transactions are completed within seconds.'
        },
        {
            question: 'Is NexusShop secure?',
            answer: 'Yes, we use end-to-end encryption to ensure your data and money are always protected.'
        },
        {
            question: 'What games do you support?',
            answer: 'We support 500+ games including Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact, Call of Duty Mobile, and many more.'
        },
        {
            question: 'Do you offer 24/7 support?',
            answer: 'Yes, we provide round-the-clock customer support to help you with any top-up needs or issues.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept various payment methods including bank transfer, e-wallets, credit cards, and digital payments.'
        }
    ] : [
        {
            question: 'Seberapa cepat proses top-up?',
            answer: 'Proses top-up kami instan. Sebagian besar transaksi selesai dalam hitungan detik.'
        },
        {
            question: 'Apakah NexusShop aman?',
            answer: 'Ya, kami menggunakan enkripsi end-to-end untuk memastikan data dan uang Anda selalu terlindungi.'
        },
        {
            question: 'Game apa saja yang didukung?',
            answer: 'Kami mendukung 500+ game termasuk Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact, Call of Duty Mobile, dan banyak lagi.'
        },
        {
            question: 'Apakah Anda menawarkan dukungan 24/7?',
            answer: 'Ya, kami menyediakan dukungan pelanggan 24/7 untuk membantu Anda dengan kebutuhan top-up atau masalah apa pun.'
        },
        {
            question: 'Metode pembayaran apa yang Anda terima?',
            answer: 'Kami menerima berbagai metode pembayaran termasuk transfer bank, e-wallet, kartu kredit, dan pembayaran digital.'
        }
    ];

    const data = {
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };

    return <StructuredData type="FAQPage" data={data} />;
};

export const BreadcrumbData: React.FC<{ items: Array<{ name: string; url: string }> }> = ({ items }) => {
    const data = {
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://nexusshop.store${item.url}`
        }))
    };

    return <StructuredData type="BreadcrumbList" data={data} />;
};

export default StructuredData; 