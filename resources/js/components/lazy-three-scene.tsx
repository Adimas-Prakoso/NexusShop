import { lazy, Suspense } from 'react';

// Lazy load the Three.js scene component
const ThreeScene = lazy(() => import('./three-scene'));

interface LazyThreeSceneProps {
    modelPath?: string;
    enableControls?: boolean;
    loadingText?: string;
    onModelLoad?: (model: unknown) => void;
    onProgress?: (progress: number) => void;
    onError?: (error: unknown) => void;
    sceneOptions?: {
        backgroundColor?: number;
        cameraFov?: number;
        enableLighting?: boolean;
        enableStars?: boolean;
        starCount?: number;
    };
}

export default function LazyThreeScene(props: LazyThreeSceneProps) {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 -z-10 flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Loading 3D Scene...</div>
            </div>
        }>
            <ThreeScene {...props} />
        </Suspense>
    );
}
