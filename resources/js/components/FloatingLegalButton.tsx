import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingLegalButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-3 min-w-[200px]"
                    >
                        <div className="space-y-2">
                            <Link
                                href="/tos"
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-white text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Terms of Service
                            </Link>
                            <a
                                href="#"
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-white text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors text-white text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Cookie Policy
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FileText className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
