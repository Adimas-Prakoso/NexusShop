import { Globe, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const languages = [
        {
            code: 'en' as const,
            name: t('common.english'),
            flag: '🇺🇸'
        },
        {
            code: 'id' as const,
            name: t('common.indonesian'),
            flag: '🇮🇩'
        }
    ];

    const currentLanguage = languages.find(lang => lang.code === language);

    // Update dropdown position when opened
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8, // 8px gap
                left: rect.right + window.scrollX - 180, // Align to right edge, 180px is min-width
                width: Math.max(rect.width, 180)
            });
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = () => {
            setIsOpen(false);
        };

        // Add small delay to avoid immediate closing
        const timer = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 10);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    // Dropdown content component
    const DropdownContent = () => (
        <div 
            className="fixed bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl overflow-hidden shadow-xl shadow-purple-500/20 min-w-[180px] z-[9999]"
            style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => {
                        setLanguage(lang.code);
                        setIsOpen(false);
                    }}
                    className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors",
                        language === lang.code ? "bg-blue-500/20 text-blue-400" : "text-white"
                    )}
                >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1 font-medium">{lang.name}</span>
                    {language === lang.code && (
                        <Check className="w-4 h-4 text-blue-400" />
                    )}
                </button>
            ))}
        </div>
    );

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors backdrop-blur-sm"
            >
                <Globe className="w-4 h-4 text-white" />
                <span className="text-white text-sm">{currentLanguage?.flag}</span>
                <span className="text-white text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
            </button>

            {/* Render dropdown using portal to avoid z-index issues */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <DropdownContent />,
                document.body
            )}
        </div>
    );
}
