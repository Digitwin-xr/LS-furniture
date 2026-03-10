'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Enhanced Lazy-Loaded 3D Viewer for Product Cards.
 * Only initializes Three.js and loads the model when in viewport.
 */
interface Product3DViewerProps {
    modelPath: string;
    alt: string;
    onLoad?: () => void;
}

export default function Product3DViewer({ modelPath, alt, onLoad }: Product3DViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // 1. Intersection Observer to detect visibility
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Once loaded, stay loaded
                }
            },
            { rootMargin: '200px' } // Load slightly before coming into view
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // 2. Three.js Initialization (Only when visible)
    useEffect(() => {
        if (!isVisible || !containerRef.current) return;

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
                const THREE = await import('three');
                const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
                const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');

                if (!isMounted || !containerRef.current) return;

                scene = new THREE.Scene();
                scene.background = null;

                const width = containerRef.current.clientWidth;
                const height = containerRef.current.clientHeight;

                camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
                camera.position.set(0, 1.2, 5.5); // Slightly back and up to prevent clipping

                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                });
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Performance cap
                containerRef.current.appendChild(renderer.domElement);

                const ambientLight = new THREE.AmbientLight(0xffffff, 2.0); // Brighter
                scene.add(ambientLight);

                const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
                dirLight.position.set(5, 10, 5);
                scene.add(dirLight);

                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Robust CDN path
                
                const loader = new GLTFLoader();
                loader.setDRACOLoader(dracoLoader);
                
                loader.load(
                    modelPath,
                    (gltf: any) => {
                        if (!isMounted) return;
                        model = gltf.scene;

                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());

                        model.position.sub(center);
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 3.0 / maxDim; // Slightly smaller to prevent clipping
                        model.scale.multiplyScalar(scale);

                        scene.add(model);
                        setIsLoading(false);
                        if (onLoad) onLoad();
                        animate();
                    },
                    undefined,
                    (err: any) => {
                        console.warn('Fallback: Model failed', err);
                        setError(true);
                        setIsLoading(false);
                    }
                );

                const animate = () => {
                    if (!isMounted) return;
                    animationFrameId = requestAnimationFrame(animate);
                    if (model) {
                        model.rotation.y += 0.006;
                    }
                    renderer.render(scene, camera);
                };

                window.addEventListener('resize', handleResize);
            } catch (err) {
                if (isMounted) {
                    setError(true);
                    setIsLoading(false);
                }
            }
        };

        initThree();

        return () => {
            isMounted = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (renderer) {
                renderer.dispose();
                if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                    containerRef.current.removeChild(renderer.domElement);
                }
            }
        };
    }, [isVisible, modelPath]);

    if (error) return null;

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden transition-opacity duration-1000"
            role="img"
            aria-label={`3D visualization of ${alt}`}
        >
            {isLoading && isVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                    <div className="w-5 h-5 border-[1.5px] border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
                </div>
            )}
            {!isVisible && <div className="w-full h-full bg-transparent" />}
        </div>
    );
}
