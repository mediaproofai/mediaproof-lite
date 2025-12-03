import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Shield, Upload, FileSearch, AlertTriangle, Lock, Globe, Activity, Zap, CheckCircle, X, CreditCard, LayoutGrid, Award } from 'lucide-react';

// --- CONFIGURATION (FILL THESE IN) ---
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dphicbaf2/auto/upload";
const UPLOAD_PRESET = "fhnvskdnf"; 
const ORCHESTRATOR_URL = "https://mediaproofai.mediaproofai.workers.dev/"; // Your Vercel URL
const PAYPAL_ME_LINK = "https://paypal.me/yourusername"; // Your PayPal Link

const ADMIN_EMAIL = "mediaproofai@gmail.com";
const MAX_FREE_DAILY = 2;

// --- 3D HERO COMPONENT (Google-Style Abstract Geometry) ---
const Hero3D = () => {
    const mountRef = useRef(null);
    useEffect(() => {
        if (!mountRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(400, 400);
        mountRef.current.appendChild(renderer.domElement);
        
        // Abstract "Data Crystal"
        const geometry = new THREE.IcosahedronGeometry(1.4, 0);
        const material = new THREE.MeshNormalMaterial({ wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Core Glow
        const innerGeo = new THREE.IcosahedronGeometry(0.8, 2);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.3 });
        const innerSphere = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerSphere);

        camera.position.z = 3.5;

        // Animation Loop
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.003;
            innerSphere.rotation.x -= 0.005;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);
    return <div ref={mountRef} className="opacity-80 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />;
};

// --- PRICING MODAL (Tiers + PayPal) ---
const PricingModal = ({ onClose, onUpgrade }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f0f13] border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Upgrade Plan</h2>
                    <p className="text-slate-400 text-sm">Unlock enterprise forensic capabilities.</p>
                </div>
                <button onClick={onClose}><X className="text-slate-500 hover:text-white" /></button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Tier 1 */}
                <div className="p-6 rounded-xl border border-white/5 bg-white/5 hover:border-accent-blue/50 transition-colors">
                    <h3 className="text-lg font-semibold text-white">Individual</h3>
                    <div className="text-3xl font-bold my-2">$19<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                    <ul className="text-sm text-slate-400 space-y-3 mb-6">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> 20 Checks / Day</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> Basic Reports</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> Priority Support</li>
                    </ul>
                    <a href={PAYPAL_ME_LINK + "/19"} target="_blank" className="block text-center w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                        Choose Individual
                    </a>
                </div>

                {/* Tier 2 (Highlighted) */}
                <div className="p-6 rounded-xl border border-accent-blue/50 bg-accent-blue/5 relative">
                    <div className="absolute top-0 right-0 bg-accent-blue text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                    <h3 className="text-lg font-semibold text-white">Professional</h3>
                    <div className="text-3xl font-bold my-2">$49<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                    <ul className="text-sm text-slate-400 space-y-3 mb-6">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> 50 Checks / Day</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> Deep Forensic Analysis</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> API Access</li>
                    </ul>
                    <a href={PAYPAL_ME_LINK + "/49"} target="_blank" className="block text-center w-full py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        Choose Professional
                    </a>
                </div>

                {/* Tier 3 */}
                <div className="p-6 rounded-xl border border-accent-purple/30 bg-accent-purple/5">
                    <h3 className="text-lg font-semibold text-white">Unlimited</h3>
                    <div className="text-3xl font-bold my-2">$99<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                    <ul className="text-sm text-slate-400 space-y-3 mb-6">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> Unlimited Checks</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> Dedicated Server</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-accent-teal"/> White Label Reports</li>
                    </ul>
                    <a href={PAYPAL_ME_LINK + "/99"} target="_blank" className="block text-center w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                        Contact Sales
                    </a>
                </div>
            </div>
        </motion.div>
    </div>
);

// --- NAVBAR COMPONENT ---
const Navbar = ({ user, onLogin, onOpenPricing }) => (
    <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-bg-deep/80 backdrop-blur-md h-[var(--nav-height)]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Shield size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight leading-none">MediaProof</h1>
                    <span className="text-[10px] text-accent-blue font-mono uppercase tracking-widest">Enterprise</span>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
                {user ? (
                    <>
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                            <span className="text-slate-400 text-xs">CREDITS</span>
                            <span className={`text-accent-teal font-mono ${user.email === ADMIN_EMAIL ? 'text-lg' : ''}`}>
                                {user.email === ADMIN_EMAIL ? '∞' : user.credits}
                            </span>
                        </div>
                        {user.email === ADMIN_EMAIL && (
                            <span className="text-[10px] bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded border border-accent-purple/20">ADMIN</span>
                        )}
                        <button onClick={onOpenPricing} className="text-slate-400 hover:text-white transition-colors">Upgrade</button>
                    </>
                ) : (
                    <button onClick={onLogin} className="glass-btn px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Sign In
                    </button>
                )}
            </div>
        </div>
    </nav>
);

// --- MAIN APP ---
const App = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('landing'); // landing | scanning | results
    const [showPricing, setShowPricing] = useState(false);
    const [file, setFile] = useState(null);
    const [report, setReport] = useState(null);
    const [scanLog, setScanLog] = useState([]);

    // 1. Auth & Daily Limit Logic
    useEffect(() => {
        const stored = localStorage.getItem('mediaproof_user');
        if (stored) checkDailyReset(JSON.parse(stored));
    }, []);

    const checkDailyReset = (userData) => {
        const lastLogin = new Date(userData.lastLogin).toDateString();
        const today = new Date().toDateString();
        let updated = { ...userData };
        
        // Reset credits if new day
        if (lastLogin !== today) {
            updated.credits = MAX_FREE_DAILY;
            updated.lastLogin = new Date().toISOString();
            localStorage.setItem('mediaproof_user', JSON.stringify(updated));
        }
        setUser(updated);
    };

    const handleLogin = () => {
        const email = prompt("Enter your email to sign in:");
        if (!email) return;
        
        // Check if admin
        const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        
        const newUser = {
            email: email,
            credits: isAdmin ? 999999 : MAX_FREE_DAILY,
            lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('mediaproof_user', JSON.stringify(newUser));
        setUser(newUser);
    };

    // 2. Upload Logic (Cloudinary -> Backend)
    const handleUpload = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!user) {
            alert("Please sign in to run a scan.");
            handleLogin();
            return;
        }

        if (user.credits <= 0 && user.email !== ADMIN_EMAIL) {
            setShowPricing(true);
            return;
        }

        setFile(selectedFile);
        setView('scanning');
        setScanLog(["Initializing secure environment...", "Allocating neural engines..."]);

        try {
            // A. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', UPLOAD_PRESET);

            const cloudRes = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
            const cloudData = await cloudRes.json();
            
            if (!cloudData.secure_url) throw new Error("Upload failed. Check Cloudinary keys.");

            setScanLog(prev => [...prev, "Upload complete. Hashing file...", "Sending to Orchestrator..."]);

            // B. Call Your Backend
            const backendRes = await fetch(ORCHESTRATOR_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaUrl: cloudData.secure_url,
                    type: selectedFile.type.startsWith('image') ? 'image' : selectedFile.type.startsWith('audio') ? 'audio' : 'video'
                })
            });

            const analysisResult = await backendRes.json();
            setReport(analysisResult);

            // C. Deduct Credit
            if (user.email !== ADMIN_EMAIL) {
                const updated = { ...user, credits: user.credits - 1 };
                setUser(updated);
                localStorage.setItem('mediaproof_user', JSON.stringify(updated));
            }

            // Fake delay for effect if backend is too fast
            setTimeout(() => setView('results'), 1500);

        } catch (error) {
            console.error(error);
            setScanLog(prev => [...prev, "ERROR: Analysis failed. " + error.message]);
            alert("Scan failed. See console for details.");
            setView('landing');
        }
    };

    return (
        <div className="min-h-screen pt-[var(--nav-height)] relative">
            <div className="cinematic-grain"></div>
            <div className="aurora-bg"></div>

            <Navbar user={user} onLogin={handleLogin} onOpenPricing={() => setShowPricing(true)} />
            
            {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}

            <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[85vh]">
                <AnimatePresence mode="wait">
                    
                    {/* --- VIEW: LANDING --- */}
                    {view === 'landing' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center max-w-5xl w-full"
                        >
                            <div className="flex justify-center mb-8 relative z-10">
                                <Hero3D />
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 relative z-20">
                                Verify Reality.
                            </h1>
                            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed relative z-20">
                                The industry standard for automated media forensics. 
                                Detect deepfakes, recover metadata, and verify origin in milliseconds.
                            </p>

                            <div className="relative group max-w-xl mx-auto z-30">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                <label className="relative flex flex-col items-center justify-center h-48 bg-[#0f0f13]/90 rounded-2xl border border-white/10 cursor-pointer overflow-hidden backdrop-blur-xl hover:border-accent-blue/50 transition-colors">
                                    <div className="scanline"></div>
                                    <Upload className="w-10 h-10 text-slate-500 mb-4 group-hover:text-accent-blue transition-colors" />
                                    <span className="text-sm font-medium text-slate-300">Drop media to analyze</span>
                                    <span className="text-xs text-slate-500 mt-2 font-mono">JPG • PNG • MP4 • WAV</span>
                                    <input type="file" className="hidden" onChange={handleUpload} />
                                </label>
                            </div>

                            {/* Ads Placeholder */}
                            <div className="mt-16 w-full max-w-3xl mx-auto h-24 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest bg-black/20">
                                Sponsor Slot
                            </div>
                        </motion.div>
                    )}

                    {/* --- VIEW: SCANNING --- */}
                    {view === 'scanning' && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-full max-w-md text-center"
                        >
                            <Activity className="w-12 h-12 text-accent-blue mx-auto mb-6 animate-pulse" />
                            <h2 className="text-xl font-mono text-accent-blue mb-6">ANALYZING ARTIFACTS...</h2>
                            <div className="space-y-2 text-left font-mono text-xs text-slate-400 bg-black/40 p-4 rounded-lg border border-white/10 h-48 overflow-y-auto no-scrollbar">
                                {scanLog.map((log, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                        <span className="text-accent-teal">root@mediaproof:~$</span> {log}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* --- VIEW: RESULTS --- */}
                    {view === 'results' && report && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6"
                        >
                            {/* Score Card */}
                            <div className="md:col-span-2 md:row-span-2 glass-panel p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                                <div className={`absolute top-0 right-0 p-8 opacity-10 ${report.risk?.globalScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                    <Shield size={200} />
                                </div>
                                <div>
                                    <div className="text-xs font-mono text-slate-500 uppercase mb-2">Global Trust Score</div>
                                    <div className={`text-8xl font-bold tracking-tighter text-glow ${report.risk?.globalScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                        {100 - (report.risk?.globalScore || 0)}
                                    </div>
                                    <div className="text-xl text-slate-400 mt-2">/ 100</div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Executive Summary</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{report.risk?.executiveSummary || "Analysis complete."}</p>
                                </div>
                                <button onClick={() => setView('landing')} className="mt-8 w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors z-10">
                                    Run Another Scan
                                </button>
                            </div>

                            {/* Metadata Card */}
                            <div className="glass-panel p-6 rounded-2xl md:col-span-2">
                                <div className="flex items-center gap-2 mb-4 text-accent-purple">
                                    <FileSearch size={18} />
                                    <h3 className="font-bold uppercase text-xs tracking-wider">File Forensics</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
                                    <div className="p-3 bg-white/5 rounded">
                                        <div className="text-[10px] text-slate-500 mb-1">TYPE</div>
                                        <div className="text-white">{file?.type}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded">
                                        <div className="text-[10px] text-slate-500 mb-1">SIZE</div>
                                        <div className="text-white">{(file?.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded col-span-2">
                                        <div className="text-[10px] text-slate-500 mb-1">SOFTWARE SIGNATURE</div>
                                        <div className="text-white truncate">{report.details?.metadata?.deviceFingerprint?.software || "None Detected"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* OSINT Card */}
                            <div className="glass-panel p-6 rounded-2xl md:col-span-2">
                                <div className="flex items-center gap-2 mb-4 text-accent-teal">
                                    <Globe size={18} />
                                    <h3 className="font-bold uppercase text-xs tracking-wider">Web Footprint</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl font-bold text-white">
                                        {report.details?.internet?.footprintAnalysis?.totalMatches || 0}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        matches found across the<br/>open internet.
                                    </div>
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
