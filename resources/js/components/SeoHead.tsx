import React from 'react';
import { Head } from '@inertiajs/react';

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonical?: string;
    structuredData?: any;
    language?: 'en' | 'id';
    noIndex?: boolean;
}

const SeoHead: React.FC<SeoHeadProps> = ({
    title = 'NexusShop - Digital Top-Up Platform',
    description = 'NexusShop is your ultimate digital top-up platform for games, mobile credit, internet packages, and digital vouchers. Fast, secure, and reliable service 24/7.',
    keywords = 'digital top-up, game credits, mobile credit, internet packages, Mobile Legends, PUBG, Free Fire, Genshin Impact, digital vouchers, online payment, gaming top-up',
    ogTitle,
    ogDescription,
    ogImage = '/logo.png',
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage = '/logo.png',
    canonical,
    structuredData,
    language = 'en',
    noIndex = false,
}) => {
    const siteUrl = 'https://nexusshop.store';
    const currentUrl = canonical || `${siteUrl}${window.location.pathname}`;
    
    // Use provided values or fallback to defaults
    const finalOgTitle = ogTitle || title;
    const finalOgDescription = ogDescription || description;
    const finalOgUrl = ogUrl || currentUrl;
    const finalTwitterTitle = twitterTitle || title;
    const finalTwitterDescription = twitterDescription || description;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="NexusShop" />
            <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
            <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
            
            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />
            
            {/* Language and Locale */}
            <meta httpEquiv="content-language" content={language === 'en' ? 'en-US' : 'id-ID'} />
            <link rel="alternate" hrefLang="en" href={`${siteUrl}?lang=en`} />
            <link rel="alternate" hrefLang="id" href={`${siteUrl}?lang=id`} />
            <link rel="alternate" hrefLang="x-default" href={siteUrl} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalOgUrl} />
            <meta property="og:title" content={finalOgTitle} />
            <meta property="og:description" content={finalOgDescription} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="NexusShop" />
            <meta property="og:locale" content={language === 'en' ? 'en_US' : 'id_ID'} />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={finalTwitterTitle} />
            <meta name="twitter:description" content={finalTwitterDescription} />
            <meta name="twitter:image" content={`${siteUrl}${twitterImage}`} />
            <meta name="twitter:site" content="@nexusshop" />
            
            {/* Additional SEO Meta Tags */}
            <meta name="theme-color" content="#10b981" />
            <meta name="msapplication-TileColor" content="#10b981" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="NexusShop" />
            
            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Head>
    );
};

export default SeoHead; 