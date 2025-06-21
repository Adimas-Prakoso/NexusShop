import React from 'react';
import { Link } from '@inertiajs/react';
import { BreadcrumbData } from './StructuredData';

interface BreadcrumbItem {
    name: string;
    url: string;
    current?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
    // Add home as first item if not present
    const allItems = items[0]?.url === '/' ? items : [
        { name: 'Home', url: '/', current: false },
        ...items
    ];

    return (
        <>
            {/* Structured Data for SEO */}
            <BreadcrumbData items={allItems} />
            
            {/* Visual Breadcrumbs */}
            <nav className={`flex ${className}`} aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                    {allItems.map((item, index) => (
                        <li key={item.url} className="flex items-center">
                            {index > 0 && (
                                <svg className="h-4 w-4 text-gray-400 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            
                            {item.current ? (
                                <span 
                                    className="text-sm font-medium text-gray-500"
                                    aria-current="page"
                                >
                                    {index === 0 ? (
                                        <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    ) : null}
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.url}
                                    className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors duration-200 flex items-center"
                                >
                                    {index === 0 ? (
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    ) : null}
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
};

export default Breadcrumbs; 