'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight 3D Preview component for hovers/long-press.
 * Uses vanilla Three.js for maximum performance and explicit cleanup.
 */
interface Hover3DPreviewProps {
    modelPath: string;
    alt: string;
}

export default function Hover3DPreview({ modelPath, alt }: Hover3DPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        let isMounted = true;
        let renderer: any;
        let scene: any;
        let camera: any;
        let model: any;
        let animationFrameId: number;

        const handleResize = () => {
            if (!containerRef.current || !renderer || !camera) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        const initThree = async () => {
            try {
                // Dynamic imports to optimize bundle size
                const THREE = await import('three');
                const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

                if (!isMounted || !containerRef.current) return;

                // Scene Setup
                scene = new THREE.Scene();
                scene.background = null;

                const width = containerRef.current.clientWidth;
                const height = containerRef.current.clientHeight;

                camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
                camera.position.set(0, 1, 5);

                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                });
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                containerRef.current.appendChild(renderer.domElement);

                // Basic HDRI-like lighting
                const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
                scene.add(ambientLight);

                const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
                dirLight.position.set(2, 5, 2);
                scene.add(dirLight);

                // Enforce safe absolute model loading pattern.
                // Fetching from Firebase Storage to handle large file sizes.
                const baseUrl = "https://firebasestorage.googleapis.com/v0/b/ls-furniture-d53dd.firebasestorage.app/o/assets%2Fmodels%2F";
                const fileName = modelPath.split('/').pop() || modelPath;
                const safeSrc = `${baseUrl}${encodeURIComponent(fileName)}?alt=media`;

                // Loading
                const loader = new GLTFLoader();
                loader.load(
                    safeSrc,
                    (gltf: any) => {
                        if (!isMounted) return;
                        model = gltf.scene;

                        // Auto-center and Scale logic
                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());

                        model.position.sub(center);

                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 3.5 / maxDim;
                        model.scale.multiplyScalar(scale);

                        scene.add(model);
                        setIsLoading(false);
                        animate();
                    },
                    undefined,
                    (err: any) => {
                        console.warn('Silent fallback: 3D preview failed to load', err);
                        setError(true);
                        setIsLoading(false);
                    }
                );

                const animate = () => {
                    if (!isMounted) return;
                    animationFrameId = requestAnimationFrame(animate);
                    if (model) {
                        model.rotation.y += 0.008;
                    }
                    renderer.render(scene, camera);
                };

                window.addEventListener('resize', handleResize);
            } catch (err) {
                console.warn('Three.js failed to initialize', err);
                if (isMounted) {
                    setError(true);
                    setIsLoading(false);
                }
            }
        };

        const cleanup = () => {
            isMounted = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);

            if (renderer) {
                renderer.dispose();
                if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                    containerRef.current.removeChild(renderer.domElement);
                }
            }

            if (scene) {
                scene.traverse((object: any) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((mat: any) => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                    if (object.texture) object.texture.dispose();
                });
            }
        };

        initThree();

        return cleanup;
    }, [modelPath]);

    if (error) return null;

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden transition-opacity duration-500"
            role="img"
            aria-label={`3D preview of ${alt}`}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10">
                    <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
