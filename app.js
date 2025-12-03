import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Shield, Upload, FileSearch, CheckCircle, AlertTriangle, Lock, Fingerprint, Zap, Globe, Activity } from 'lucide-react';

// --- MOCK BACKEND & CONFIG ---
const ADMIN_EMAIL = "admin@mediaproof.com"; // Your bypass email
const MAX_FREE_DAILY = 2;

// --- COMPONENTS ---

// 1. 3D HERO (Simple Rotating Mesh)
const Hero3D = () => {
    const mountRef = useRef(null);
    useEffect(() => {
        if (!mountRef.current) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(300, 300);
        mountRef.current.appendChild(renderer.domElement);
        
        // Geometry: Abstract Icosahedron (The "Core")
        const geometry = new THREE.IcosahedronGeometry(1.2, 0);
        const material = new THREE.MeshNormalMaterial({ wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Inner Glow
        const innerGeo = new THREE.IcosahedronGeometry(0.8, 1);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: false, transparent: true, opacity: 0.1 });
        const innerSphere = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerSphere);

        camera.position.z = 3;

        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.005;
            sphere.rotation.y += 0.005;
            innerSphere.rotation.x -= 0.01;
            renderer.render(scene, camera);
        };
        animate();

        return () => mountRef.current?.removeChild(renderer.domElement);
    }, []);

    return <div ref={mountRef} className="opacity-80 hover:opacity-100 transition-opacity duration-500" />;
};

// 2. NAVBAR
const Navbar = ({ user, onLogin }) => (
    <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-bg-deep/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                    <Shield size={16} className="text-white" />
                </div>
                <span className="font-semibold tracking-tight">Mediaproof</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
                {user ? (
                    <>
                        <span className="text-gray-400">Credits: <span className="text-accent-teal">{user.email === ADMIN_EMAIL ? '∞' : user.credits}</span></span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                            {user.email[0].toUpperCase()}
                        </div>
                    </>
                ) : (
                    <button onClick={onLogin} className="glass-btn px-4 py-2 rounded-full text-xs uppercase tracking-wider">
                        Sign In
                    </button>
                )}
            </div>
        </div>
    </nav>
);

// 3. MAIN APP
const App = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('landing'); // landing | scanning | results
    const [file, setFile] = useState(null);
    const [scanProgress, setScanProgress] = useState(0);

    // Initial Load: Check LocalStorage for basic "Auth"
    useEffect(() => {
        const storedUser = localStorage.getItem('mediaproof_user');
        if (storedUser) {
            checkDailyReset(JSON.parse(storedUser));
        }
    }, []);

    // Logic: Daily Limit Reset
    const checkDailyReset = (userData) => {
        const lastLogin = new Date(userData.lastLogin).toDateString();
        const today = new Date().toDateString();
        
        let updatedUser = { ...userData };
        if (lastLogin !== today) {
            updatedUser.credits = MAX_FREE_DAILY;
            updatedUser.lastLogin = new Date().toISOString();
        }
        
        setUser(updatedUser);
        localStorage.setItem('mediaproof_user', JSON.stringify(updatedUser));
    };

    // Action: Login (Mock)
    const handleLogin = () => {
        const email = prompt("Enter email (Use 'admin@mediaproof.com' for unlimited):");
        if (!email) return;
        
        const newUser = {
            email,
            credits: MAX_FREE_DAILY,
            lastLogin: new Date().toISOString()
        };
        checkDailyReset(newUser);
    };

    // Action: Handle Upload
    const handleUpload = (e) => {
        if (!user) {
            alert("Please Sign In first.");
            return handleLogin();
        }

        if (user.credits <= 0 && user.email !== ADMIN_EMAIL) {
            alert("Daily limit reached! Upgrade to Enterprise.");
            return;
        }

        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            startScan();
        }
    };

    // Action: Simulate Scan
    const startScan = () => {
        setView('scanning');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                clearInterval(interval);
                setScanProgress(100);
                setTimeout(() => {
                    completeScan();
                }, 800);
            } else {
                setScanProgress(progress);
            }
        }, 200);
    };

    const completeScan = () => {
        // Deduct Credit
        if (user.email !== ADMIN_EMAIL) {
            const updatedUser = { ...user, credits: user.credits - 1 };
            setUser(updatedUser);
            localStorage.setItem('mediaproof_user', JSON.stringify(updatedUser));
        }
        setView('results');
    };

    return (
        <div className="min-h-screen text-slate-200">
            <div className="cinematic-grain"></div>
            <div className="aurora-bg"></div>
            
            <Navbar user={user} onLogin={handleLogin} />

            <main className="pt-24 px-6 max-w-7xl mx-auto min-h-[80vh] flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    
                    {/* VIEW 1: LANDING / UPLOAD */}
                    {view === 'landing' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center w-full max-w-4xl"
                        >
                            <div className="flex justify-center mb-8"><Hero3D /></div>
                            
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500">
                                Trust, verified.
                            </h1>
                            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                                The enterprise standard for automated media forensics. 
                                Detect deepfakes, recover metadata, and verify origin in milliseconds.
                            </p>

                            <div className="relative group max-w-xl mx-auto">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                <label className="relative flex flex-col items-center justify-center h-48 bg-bg-panel/80 rounded-2xl border border-white/10 cursor-pointer overflow-hidden backdrop-blur-xl">
                                    <div className="scanline"></div>
                                    <Upload className="w-10 h-10 text-slate-500 mb-4 group-hover:text-accent-blue transition-colors" />
                                    <span className="text-sm font-medium text-slate-300">Drop media to analyze</span>
                                    <span className="text-xs text-slate-500 mt-2">JPG, PNG, MP4, WAV</span>
                                    <input type="file" className="hidden" onChange={handleUpload} />
                                </label>
                            </div>

                            <div className="mt-8 flex justify-center gap-8 text-xs text-slate-500 font-mono uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Lock size={12}/> Secure Upload</span>
                                <span className="flex items-center gap-2"><Zap size={12}/> Instant Analysis</span>
                                <span className="flex items-center gap-2"><Globe size={12}/> Global OSINT</span>
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW 2: SCANNING */}
                    {view === 'scanning' && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-full max-w-md text-center"
                        >
                            <Activity className="w-12 h-12 text-accent-blue mx-auto mb-6 animate-pulse" />
                            <h2 className="text-xl font-mono text-accent-blue mb-2">ANALYZING ARTIFACTS...</h2>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                    className="h-full bg-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                                    style={{ width: `${scanProgress}%` }}
                                />
                            </div>
                            <div className="text-xs font-mono text-slate-500 text-left space-y-1">
                                <p className={scanProgress > 20 ? "text-green-400" : "text-slate-600"}>[+] Extracting EXIF headers...</p>
                                <p className={scanProgress > 50 ? "text-green-400" : "text-slate-600"}>[+] Querying Neural Hash DB...</p>
                                <p className={scanProgress > 80 ? "text-green-400" : "text-slate-600"}>[+] Verifying signature integrity...</p>
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW 3: RESULTS DASHBOARD */}
                    {view === 'results' && file && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {/* Card 1: Main Verdict */}
                            <div className="md:col-span-2 glass-panel p-8 rounded-2xl border-t-4 border-red-500/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5"><AlertTriangle size={120} /></div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">High Risk Detected</span>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-2">Manipulation Likely</h2>
                                <p className="text-slate-400 mb-6 max-w-lg">
                                    Deep learning models detected significant inconsistencies in the noise distribution (ELA) and localized blurring suggesting object removal.
                                </p>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-2xl font-bold text-red-400">94%</div>
                                        <div className="text-xs text-slate-500 uppercase">AI Score</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-2xl font-bold text-orange-400">High</div>
                                        <div className="text-xs text-slate-500 uppercase">Tamper Risk</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-2xl font-bold text-slate-200">2</div>
                                        <div className="text-xs text-slate-500 uppercase">Edits Found</div>
                                    </div>
                                </div>
                                <button onClick={() => setView('landing')} className="glass-btn px-6 py-3 rounded-xl text-sm font-medium">
                                    Run Another Scan
                                </button>
                            </div>

                            {/* Card 2: Metadata */}
                            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-accent-purple mb-2">
                                    <FileSearch size={20} />
                                    <h3 className="font-semibold">File DNA</h3>
                                </div>
                                <div className="space-y-3 text-sm font-mono text-slate-400">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Name</span> <span className="text-white truncate max-w-[120px]">{file.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Size</span> <span className="text-white">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Type</span> <span className="text-white uppercase">{file.type.split('/')[1]}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span>Software</span> <span className="text-red-400">Adobe Photoshop 24.1</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card 3: OSINT */}
                            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 md:col-span-3">
                                <div className="flex items-center gap-2 text-accent-teal mb-2">
                                    <Globe size={20} />
                                    <h3 className="font-semibold">Reverse Search Intelligence</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="w-10 h-10 bg-slate-800 rounded bg-cover" style={{backgroundImage: 'url(https://source.unsplash.com/random/100x100?sig=' + i + ')'}}></div>
                                            <div className="overflow-hidden">
                                                <div className="text-xs text-accent-blue font-mono mb-0.5">MATCH FOUND</div>
                                                <div className="text-sm text-slate-300 truncate">social_media_repost_v{i}.jpg</div>
                                                <div className="text-[10px] text-slate-500">First seen: 2 days ago</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
