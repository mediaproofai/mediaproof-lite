import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Shield, Upload, FileSearch, AlertTriangle, Lock, Globe, Activity, Zap, CheckCircle, X, CreditCard, LayoutGrid, Award, PlayCircle, History, Clock } from 'lucide-react';

// --- CONFIGURATION (UPDATE THESE!) ---
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dphicbaf2/auto/upload"; 
const UPLOAD_PRESET = "fhnvskdnf"; 
const ORCHESTRATOR_URL = "https://mediaproofai.mediaproofai.workers.dev/"; // Your Backend URL
const ADMIN_EMAIL = "mediaproofai@gmail.com";

// --- PAYPAL LINKS (Create these in PayPal and paste here) ---
const LINKS = {
    BASIC: "https://paypal.me/mediaproofai/2.99",
    PRO: "https://paypal.me/mediaproofai/3.99",
    BUSINESS: "https://paypal.me/mediaproofai/6.99"
};

// --- PLAN DEFINITIONS ---
const PLANS = {
    FREE: { name: "Starter", limit: 2, speed: 4000, features: ["image"], history: false },
    BASIC: { name: "Essential", limit: 10, speed: 2000, features: ["image"], history: false },
    PRO: { name: "Pro", limit: 25, speed: 1000, features: ["image", "video", "audio"], history: true },
    BUSINESS: { name: "Unlimited", limit: 9999, speed: 500, features: ["image", "video", "audio"], history: true }
};

// --- 3D HERO COMPONENT ---
const Hero3D = () => {
    const mountRef = useRef(null);
    useEffect(() => {
        if (!mountRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(400, 400);
        mountRef.current.appendChild(renderer.domElement);
        
        const geometry = new THREE.IcosahedronGeometry(1.4, 0);
        const material = new THREE.MeshNormalMaterial({ wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        const innerGeo = new THREE.IcosahedronGeometry(0.8, 2);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.3 });
        const innerSphere = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerSphere);

        camera.position.z = 3.5;

        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.003;
            innerSphere.rotation.x -= 0.005;
            renderer.render(scene, camera);
        };
        animate();
        return () => { cancelAnimationFrame(frameId); mountRef.current?.removeChild(renderer.domElement); };
    }, []);
    return <div ref={mountRef} className="opacity-80 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />;
};

// --- PRICING MODAL ---
const PricingModal = ({ onClose, currentPlan }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f0f13] border border-white/10 rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Choose Your Level</h2>
                    <p className="text-slate-400 text-sm">Unlock faster speeds, video tools, and history.</p>
                </div>
                <button onClick={onClose}><X className="text-slate-500 hover:text-white" /></button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* BASIC */}
                <div className="p-5 rounded-xl border border-white/5 bg-white/5 hover:border-accent-teal/50 transition-colors">
                    <h3 className="text-lg font-bold text-white">Essential</h3>
                    <div className="text-3xl font-bold my-2 text-accent-teal">$2.99<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                    <ul className="text-sm text-slate-400 space-y-2 mb-6">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-teal"/> 10 Checks / Day</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-teal"/> No Watermark</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-teal"/> 2x Faster Speed</li>
                    </ul>
                    <a href={LINKS.BASIC} target="_blank" className="block text-center w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                        Select Essential
                    </a>
                </div>

                {/* PRO */}
                <div className="p-5 rounded-xl border border-accent-blue bg-accent-blue/10 relative transform scale-105 shadow-xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 bg-accent-blue text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
                    <h3 className="text-lg font-bold text-white">Pro</h3>
                    <div className="text-3xl font-bold my-2 text-accent-blue">$3.99<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                    <ul className="text-sm text-slate-300 space-y-2 mb-6">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-blue"/> 25 Checks / Day</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-blue"/> Video & Audio Tools</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-blue"/> 30-Day History</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-blue"/> 4x Faster Results</li>
                    </ul>
                    <a href={LINKS.PRO} target="_blank" className="block text-center w-full py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium transition-colors">
                        Select Pro
                    </a>
                </div>

                {/* UNLIMITED */}
                <div className="p-5 rounded-xl border border-accent-purple/30 bg-accent-purple/5">
                    <h3 className="text-lg font-bold text-white">Unlimited</h3>
                    <div className="text-3xl font-bold my-2 text-accent-purple">$6.99<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                    <ul className="text-sm text-slate-400 space-y-2 mb-6">
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-purple"/> Unlimited Checks</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-purple"/> Instant Processing</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-purple"/> 3 Team Members</li>
                        <li className="flex gap-2"><CheckCircle size={14} className="text-accent-purple"/> Priority Support</li>
                    </ul>
                    <a href={LINKS.BUSINESS} target="_blank" className="block text-center w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                        Go Unlimited
                    </a>
                </div>
            </div>
        </motion.div>
    </div>
);

// --- NAVBAR ---
const Navbar = ({ user, onLogin, onOpenPricing, onViewHistory }) => (
    <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-bg-deep/90 backdrop-blur-md h-[var(--nav-height)]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-3" onClick={() => window.location.reload()}>
                <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center shadow-lg cursor-pointer">
                    <Shield size={18} className="text-white" />
                </div>
                <div className="cursor-pointer">
                    <h1 className="font-bold text-lg tracking-tight leading-none">MediaProof</h1>
                    <span className="text-[10px] text-accent-blue font-mono uppercase tracking-widest">Enterprise</span>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
                {user ? (
                    <>
                        {user.planKey !== 'FREE' && user.planKey !== 'BASIC' && (
                            <button onClick={onViewHistory} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                <History size={14} /> History
                            </button>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10" onClick={onOpenPricing}>
                            <span className={`text-[10px] font-bold uppercase ${
                                user.planKey === 'BUSINESS' ? 'text-accent-purple' : 
                                user.planKey === 'PRO' ? 'text-accent-blue' : 'text-slate-400'
                            }`}>
                                {user.plan.name}
                            </span>
                            <span className="text-white/20">|</span>
                            <span className="text-accent-teal font-mono">
                                {user.email === ADMIN_EMAIL ? '∞' : user.credits} left
                            </span>
                        </div>
                        <button onClick={onOpenPricing} className="text-slate-400 hover:text-white transition-colors text-xs uppercase tracking-wide">
                            Upgrade
                        </button>
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
    const [view, setView] = useState('landing'); // landing | scanning | results | history
    const [showPricing, setShowPricing] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const [file, setFile] = useState(null);
    const [report, setReport] = useState(null);
    const [scanLog, setScanLog] = useState([]);
    const [history, setHistory] = useState([]);

    // 1. Auth & Plan Logic
    useEffect(() => {
        const stored = localStorage.getItem('mediaproof_user');
        const storedHistory = localStorage.getItem('mediaproof_history');
        if (stored) checkDailyReset(JSON.parse(stored));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
    }, []);

    const checkDailyReset = (userData) => {
        const lastLogin = new Date(userData.lastLogin).toDateString();
        const today = new Date().toDateString();
        let updated = { ...userData };
        const planDetails = PLANS[userData.planKey || 'FREE'];

        // Assign plan object for easy access
        updated.plan = planDetails;

        if (lastLogin !== today) {
            updated.credits = userData.email === ADMIN_EMAIL ? 999999 : planDetails.limit;
            updated.lastLogin = new Date().toISOString();
            localStorage.setItem('mediaproof_user', JSON.stringify(updated));
        }
        setUser(updated);
    };

    const handleLogin = () => {
        const email = prompt("Enter email to sign in:");
        if (!email) return;
        
        // --- ADMIN BYPASS ---
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            const adminUser = {
                email,
                planKey: 'BUSINESS',
                plan: PLANS.BUSINESS,
                credits: 999999,
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem('mediaproof_user', JSON.stringify(adminUser));
            setUser(adminUser);
            return;
        }

        // --- SIMULATED PLAN SELECTION (For Demo Purposes) ---
        // In a real app, you'd fetch this from your database/Stripe
        const planInput = prompt("Demo: Enter plan level (free, basic, pro, business):", "free");
        const key = planInput ? planInput.toUpperCase() : 'FREE';
        const selectedPlan = PLANS[key] || PLANS.FREE;

        const newUser = {
            email,
            planKey: key,
            plan: selectedPlan,
            credits: selectedPlan.limit,
            lastLogin: new Date().toISOString()
        };
        localStorage.setItem('mediaproof_user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const watchAd = () => {
        setShowAd(true);
        // Simulate 5 second ad
        setTimeout(() => {
            setShowAd(false);
            const updated = { ...user, credits: user.credits + 1 };
            setUser(updated);
            localStorage.setItem('mediaproof_user', JSON.stringify(updated));
            alert("Thanks for watching! +1 Credit added.");
        }, 5000);
    };

    // 2. Upload & Scan Logic
    const handleUpload = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!user) {
            alert("Please sign in first.");
            handleLogin();
            return;
        }

        // A. Check Credits
        if (user.credits <= 0 && user.email !== ADMIN_EMAIL) {
            if (user.planKey === 'FREE') {
                if (confirm("Daily limit reached. Watch a short ad for 1 more credit?")) {
                    watchAd();
                }
            } else {
                setShowPricing(true);
            }
            return;
        }

        // B. Check Feature Access (Video/Audio Lock)
        const isImage = selectedFile.type.startsWith('image');
        if (!isImage && !user.plan.features.includes('video')) {
            alert(`Upgrade to PRO to scan ${selectedFile.type.split('/')[0]} files.`);
            setShowPricing(true);
            return;
        }

        setFile(selectedFile);
        setView('scanning');
        setScanLog(["Initializing secure environment...", `Plan detected: ${user.plan.name}`, "Allocating resources..."]);

        try {
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            const cloudRes = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
            const cloudData = await cloudRes.json();
            
            if (!cloudData.secure_url) throw new Error("Upload error");

            setScanLog(prev => [...prev, "Upload complete. Hashing...", "Sending to Neural Engine..."]);

            // Call Backend
            const backendRes = await fetch(ORCHESTRATOR_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaUrl: cloudData.secure_url,
                    type: isImage ? 'image' : selectedFile.type.startsWith('audio') ? 'audio' : 'video'
                })
            });

            const result = await backendRes.json();
            setReport(result);

            // Save to History (If Pro/Business)
            if (user.plan.history) {
                const newHistoryItem = { 
                    id: Date.now(), 
                    name: selectedFile.name, 
                    score: result.risk?.globalScore || 0,
                    date: new Date().toLocaleDateString() 
                };
                const updatedHistory = [newHistoryItem, ...history].slice(0, 50); // Keep last 50
                setHistory(updatedHistory);
                localStorage.setItem('mediaproof_history', JSON.stringify(updatedHistory));
            }

            // Deduct Credit
            if (user.email !== ADMIN_EMAIL) {
                const updated = { ...user, credits: user.credits - 1 };
                setUser(updated);
                localStorage.setItem('mediaproof_user', JSON.stringify(updated));
            }

            // Processing Speed Simulation based on Plan
            setTimeout(() => setView('results'), user.plan.speed);

        } catch (error) {
            console.error(error);
            alert("Scan failed. " + error.message);
            setView('landing');
        }
    };

    return (
        <div className="min-h-screen pt-[var(--nav-height)] relative font-sans">
            <div className="cinematic-grain"></div>
            <div className="aurora-bg"></div>

            <Navbar 
                user={user} 
                onLogin={handleLogin} 
                onOpenPricing={() => setShowPricing(true)} 
                onViewHistory={() => setView('history')}
            />
            
            {showPricing && <PricingModal onClose={() => setShowPricing(false)} currentPlan={user?.planKey} />}
            
            {/* Ad Modal */}
            {showAd && (
                <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center">
                    <div className="text-white text-2xl font-mono animate-pulse mb-4">PLAYING ADVERTISEMENT...</div>
                    <div className="w-64 h-2 bg-gray-800 rounded overflow-hidden">
                        <motion.div initial={{width: 0}} animate={{width: "100%"}} transition={{duration: 5}} className="h-full bg-accent-teal"/>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[85vh]">
                <AnimatePresence mode="wait">
                    
                    {/* --- VIEW: LANDING --- */}
                    {view === 'landing' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full max-w-4xl">
                            <div className="flex justify-center mb-6"><Hero3D /></div>
                            
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 relative z-20">
                                Verify Reality.
                            </h1>
                            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto z-20 relative">
                                Automated media forensics for the AI age. <br/>
                                <span className="text-accent-blue">{user ? `Current Plan: ${user.plan.name}` : "Start for free."}</span>
                            </p>

                            <div className="relative group max-w-xl mx-auto z-30">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                <label className="relative flex flex-col items-center justify-center h-48 bg-[#0f0f13]/90 rounded-2xl border border-white/10 cursor-pointer overflow-hidden backdrop-blur-xl hover:border-accent-blue/50 transition-colors">
                                    <Upload className="w-10 h-10 text-slate-500 mb-4 group-hover:text-accent-blue transition-colors" />
                                    <span className="text-sm font-medium text-slate-300">Drop media to analyze</span>
                                    <span className="text-xs text-slate-500 mt-2 font-mono">
                                        {user?.planKey === 'FREE' || user?.planKey === 'BASIC' ? 'Images Only (Upgrade for Video)' : 'JPG • PNG • MP4 • WAV'}
                                    </span>
                                    <input type="file" className="hidden" onChange={handleUpload} />
                                </label>
                            </div>
                        </motion.div>
                    )}

                    {/* --- VIEW: SCANNING --- */}
                    {view === 'scanning' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md text-center">
                            <Activity className="w-12 h-12 text-accent-blue mx-auto mb-6 animate-pulse" />
                            <h2 className="text-xl font-mono text-accent-blue mb-6">PROCESSING...</h2>
                            <div className="space-y-2 text-left font-mono text-xs text-slate-400 bg-black/40 p-4 rounded-lg border border-white/10 h-48 overflow-y-auto no-scrollbar">
                                {scanLog.map((log, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                        <span className="text-accent-teal">{'>'}</span> {log}
                                    </motion.div>
                                ))}
                            </div>
                            {user.planKey === 'FREE' && (
                                <p className="text-xs text-slate-500 mt-4 animate-pulse">Upgrading to Basic removes wait times...</p>
                            )}
                        </motion.div>
                    )}

                    {/* --- VIEW: RESULTS --- */}
                    {view === 'results' && report && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Watermark for Free Plan */}
                            {(user.planKey === 'FREE') && (
                                <div className="fixed bottom-4 right-4 text-white/10 text-4xl font-black pointer-events-none z-50 -rotate-12">
                                    MEDIAPROOF FREE
                                </div>
                            )}

                            <div className="md:col-span-2 md:row-span-2 glass-panel p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                                <div className={`absolute top-0 right-0 p-8 opacity-10 ${report.risk?.globalScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                    <Shield size={200} />
                                </div>
                                <div>
                                    <div className="text-xs font-mono text-slate-500 uppercase mb-2">Global Trust Score</div>
                                    <div className={`text-8xl font-bold tracking-tighter text-glow ${report.risk?.globalScore > 50 ? 'text-red-500' : 'text-green-500'}`}>
                                        {100 - (report.risk?.globalScore || 0)}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Executive Summary</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{report.risk?.executiveSummary || "Analysis complete."}</p>
                                </div>
                                <button onClick={() => setView('landing')} className="mt-8 w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors z-10">
                                    New Scan
                                </button>
                            </div>

                            <div className="glass-panel p-6 rounded-2xl md:col-span-2">
                                <div className="flex items-center gap-2 mb-4 text-accent-purple">
                                    <FileSearch size={18} />
                                    <h3 className="font-bold uppercase text-xs tracking-wider">File Metadata</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
                                    <div className="p-3 bg-white/5 rounded">
                                        <div className="text-[10px] text-slate-500 mb-1">TYPE</div>
                                        <div className="text-white">{file?.type}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded col-span-2">
                                        <div className="text-[10px] text-slate-500 mb-1">SOFTWARE TRACE</div>
                                        <div className="text-white truncate">{report.details?.metadata?.deviceFingerprint?.software || "None Detected"}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- VIEW: HISTORY (Pro Only) --- */}
                    {view === 'history' && (
                        <div className="w-full max-w-4xl">
                            <div className="flex items-center gap-2 mb-6">
                                <button onClick={() => setView('landing')} className="text-slate-500 hover:text-white"><X/></button>
                                <h2 className="text-2xl font-bold">Case History</h2>
                            </div>
                            <div className="glass-panel rounded-2xl overflow-hidden">
                                {history.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">No scans recorded yet.</div>
                                ) : (
                                    history.map((item) => (
                                        <div key={item.id} className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${item.score > 50 ? 'bg-red-500' : 'bg-green-500'}`} />
                                                <span className="text-sm font-medium text-white">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-6 text-xs text-slate-500">
                                                <span>{item.date}</span>
                                                <span className="font-mono">{100 - item.score}/100</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
