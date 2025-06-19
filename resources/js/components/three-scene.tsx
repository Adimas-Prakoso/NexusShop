import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ThreeSceneProps {
    modelPath?: string;
    enableControls?: boolean;
    loadingText?: string;
    onModelLoad?: (model: THREE.Group) => void;
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

export default function ThreeScene({
    modelPath = '/assets/models/galaxy-model.glb',
    enableControls = false,
    loadingText = 'Loading...',
    onModelLoad,
    onProgress,
    onError,
    sceneOptions = {}
}: ThreeSceneProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        const {
            backgroundColor = 0x000918,
            cameraFov = 75,
            enableLighting = true,
            enableStars = true,
            starCount = 2000
        } = sceneOptions;

        // Setup scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);
        
        const camera = new THREE.PerspectiveCamera(
            cameraFov, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        const canvas = renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = enableControls ? 'auto' : 'none';
        canvas.style.userSelect = 'none';
        canvas.style.touchAction = 'none';
        
        currentMount.appendChild(canvas);

        // Add lighting
        if (enableLighting) {
            const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xaaaaff, 1);
            directionalLight.position.set(5, 3, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0x3677ff, 1.5, 20);
            pointLight.position.set(-5, 2, 3);
            scene.add(pointLight);
        }
        
        // Create stars
        if (enableStars) {
            const starGeometry = new THREE.BufferGeometry();
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
        }

        // Setup controls if enabled
        let controls: OrbitControls | null = null;
        if (enableControls) {
            controls = new OrbitControls(camera, canvas);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI / 2;
        }

        // Load model if provided
        let galaxyModel: THREE.Group | null = null;
        if (modelPath) {
            const loader = new GLTFLoader();
            
            const loadingElement = document.createElement('div');
            loadingElement.style.position = 'absolute';
            loadingElement.style.top = '50%';
            loadingElement.style.left = '50%';
            loadingElement.style.transform = 'translate(-50%, -50%)';
            loadingElement.style.color = 'white';
            loadingElement.style.fontSize = '20px';
            loadingElement.textContent = loadingText;
            currentMount.appendChild(loadingElement);

            loader.load(
                modelPath,
                (gltf: GLTF) => {
                    galaxyModel = gltf.scene;
                    galaxyModel.scale.set(20, 20, 20);
                    galaxyModel.position.set(0, 0, -5);
                    scene.add(galaxyModel);
                    
                    if (currentMount && loadingElement.parentNode === currentMount) {
                        currentMount.removeChild(loadingElement);
                    }
                    
                    onModelLoad?.(galaxyModel);
                },
                (xhr) => {
                    const progress = (xhr.loaded / xhr.total) * 100;
                    loadingElement.textContent = `${loadingText} ${Math.round(progress)}%`;
                    onProgress?.(progress);
                },
                (error) => {
                    console.error('Error loading 3D model:', error);
                    if (currentMount && loadingElement.parentNode === currentMount) {
                        currentMount.removeChild(loadingElement);
                    }
                    onError?.(error);
                }
            );
        }

        // Set camera position
        camera.position.z = 5;

        // Animation loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            
            if (controls) {
                controls.update();
            }
            
            if (galaxyModel) {
                galaxyModel.rotation.y += 0.001;
                galaxyModel.rotation.x += 0.0005;
            }
            
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

        // Cleanup function
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            
            if (controls) {
                controls.dispose();
            }
            
            if (currentMount && currentMount.contains(canvas)) {
                currentMount.removeChild(canvas);
            }
            
            // Dispose of Three.js objects
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            
            renderer.dispose();
        };
    }, [modelPath, enableControls, loadingText, onModelLoad, onProgress, onError, sceneOptions]);

    return <div ref={mountRef} className="fixed inset-0 -z-10" />;
}
