import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import * as fse from 'fs-extra';

// Custom plugin to copy manifest.json to the right location
const manifestCopy = (): Plugin => {
  return {
    name: 'manifest-copy',
    writeBundle: async () => {
      await fse.copy(
        resolve(__dirname, 'public/build/.vite/manifest.json'),
        resolve(__dirname, 'public/build/manifest.json'),
        { overwrite: true }
      );
      console.log('\n✓ Manifest.json copied to public/build/');
    }
  };
};

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        manifestCopy(),
    ],
    esbuild: {
        jsx: 'automatic',
        drop: ['console', 'debugger'], // Remove console logs in production
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
    },
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        manifest: true,
        chunkSizeWarningLimit: 1000, // Increase threshold to 1MB
        minify: 'terser', // Use terser for better minification
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            input: {
                app: 'resources/js/app.tsx',
                css: 'resources/css/app.css'
            },
            output: {
                manualChunks: {
                    // Vendor chunk for React and core dependencies
                    vendor: ['react', 'react-dom'],
                    
                    // Three.js and related 3D libraries (heavy chunk)
                    'three': [
                        'three',
                        'three/examples/jsm/loaders/GLTFLoader.js',
                        'three/examples/jsm/controls/OrbitControls.js'
                    ],
                    
                    // UI library chunk for Radix UI components
                    'ui-lib': [
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-collapsible',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-navigation-menu',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-toggle',
                        '@radix-ui/react-toggle-group',
                        '@radix-ui/react-tooltip',
                        '@headlessui/react'
                    ],
                    
                    // Animation libraries
                    'animation': ['framer-motion'],
                    
                    // Icons and utilities
                    'utils': [
                        'lucide-react',
                        'react-icons',
                        'react-icons/fa',
                        'react-icons/md',
                        'react-icons/gi',
                        'clsx',
                        'tailwind-merge',
                        'class-variance-authority'
                    ],
                    
                    // Inertia.js
                    'inertia': ['@inertiajs/react']
                },
                // Ensure consistent chunk naming
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@inertiajs/react',
            'lucide-react',
            'clsx',
            'tailwind-merge'
        ],
        exclude: ['three'] // Exclude three.js from pre-bundling as it's heavy
    }
});
