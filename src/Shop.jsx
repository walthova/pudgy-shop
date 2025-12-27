import React, { useState } from 'react';

const IBG_SHOP_CONFIG = {
    storeName: "IBG",
    tagline: "COLLECTION",
    fullBrandName: "Inspired by God",
    currency: "$",
    brandColors: {
        primary: "#0062FF",
        primaryHover: "#004ECC",
        accent: "#FFB800",
        bg: "#F8FAFF",
        text: "#051633"
    }
};

const Shop = ({ onEnterGallery }) => {
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [showAnnouncement, setShowAnnouncement] = useState(true);

    const mockProducts = [
        {
            id: "gid://shopify/Product/1",
            title: "The Holy Hoodie",
            handle: "holy-hoodie",
            category: "wearables",
            price: 135.00,
            images: [{ url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&h=1000&fit=crop" }],
            description: "Cultivated for the future. Premium heavyweight cotton with divine embroidery detail.",
            badge: "Limited Drop",
            variants: [{ id: "gid://shopify/ProductVariant/1", stock: 12 }]
        },
        {
            id: "gid://shopify/Product/2",
            title: "Relic Jacket II",
            handle: "relic-jacket-2",
            category: "relics",
            price: 495.00,
            images: [{ url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&h=1000&fit=crop" }],
            description: "A cultural artifact. Heritage fabrication meets modern gallery design.",
            badge: "The Archive",
            variants: [{ id: "gid://shopify/ProductVariant/2", stock: 5 }]
        },
        {
            id: "gid://shopify/Product/3",
            title: "Sacred Vision Cap",
            handle: "sacred-vision-cap",
            category: "accessories",
            price: 45.00,
            images: [{ url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1000&h=1000&fit=crop" }],
            description: "Structured silhouette with the IBG trinity symbol in gold.",
            badge: "New",
            variants: [{ id: "gid://shopify/ProductVariant/3", stock: 40 }]
        },
        {
            id: "gid://shopify/Product/4",
            title: "Artifact Tote",
            handle: "artifact-tote",
            category: "accessories",
            price: 35.00,
            images: [{ url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&h=1000&fit=crop" }],
            description: "Carry the mission. Heavyweight canvas artifact.",
            badge: null,
            variants: [{ id: "gid://shopify/ProductVariant/4", stock: 100 }]
        }
    ];

    const categories = [
        { id: 'all', name: 'The Collection' },
        { id: 'relics', name: 'Optic Relics' },
        { id: 'wearables', name: 'Wearables' },
        { id: 'accessories', name: 'Artifacts' }
    ];

    const filteredProducts = activeCategory === 'all'
        ? mockProducts
        : mockProducts.filter(p => p.category === activeCategory);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setShowCart(true);
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const IBGLogo = ({ size = "md" }) => {
        const s = size === 'sm' ? 'w-6' : size === 'lg' ? 'w-14' : 'w-10';
        return (
            <div className="flex items-center gap-1.5 group cursor-pointer">
                <div className={`${s} h-1.5 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform`} />
                <div className={`${s} h-1.5 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform`} />
                <div className={`${s} h-1.5 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform`} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F9FBFF] font-['Outfit',sans-serif] text-[#051633] selection:bg-blue-100">
            {showAnnouncement && (
                <div className="bg-blue-600/95 backdrop-blur-md text-white py-3 px-6 text-[0.65rem] font-black uppercase tracking-[0.25em] relative shadow-lg z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <span className="animate-pulse">● MISSION: CULTIVATING CLOTHING FOR THE FUTURE</span>
                        <div className="hidden md:block">WORLDWIDE ACCESS AVAILABLE | LIMITED RELICS REMAIN</div>
                        <button onClick={() => setShowAnnouncement(false)} className="hover:rotate-90 transition-transform">×</button>
                    </div>
                </div>
            )}

            <header className="sticky top-6 z-40 mx-auto max-w-7xl px-4 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-2xl border-2 border-white/50 rounded-[2.5rem] h-20 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.05)] flex items-center justify-between px-10 pointer-events-auto">
                    <div className="flex items-center gap-5">
                        <IBGLogo />
                        <div className="flex flex-col gap-0">
                            <span className="font-black text-2xl tracking-tighter leading-none text-blue-900">IBG.</span>
                            <span className="text-[0.5rem] font-black tracking-[0.4em] text-amber-500 opacity-80 uppercase">{IBG_SHOP_CONFIG.tagline}</span>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-10">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`text-[0.65rem] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-600 ${activeCategory === cat.id ? 'text-blue-600' : 'text-blue-900/40'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-6">
                        <button onClick={() => setShowCart(true)} className="relative p-3.5 bg-blue-50/50 rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 border border-blue-100/50 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-400 text-blue-900 text-[0.6rem] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xl">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <section className="pt-40 pb-24 px-6 text-center">
                <div className="max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-[0.6rem] uppercase tracking-[0.2em] mb-8 border border-blue-100 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                        Pop-Up Exhibition 001
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-blue-900 tracking-tighter mb-10 leading-[0.9]">
                        INSPIRED BY <br />
                        <span className="text-blue-600 bg-gradient-to-b from-blue-600 to-blue-400 bg-clip-text text-transparent italic-none uppercase">THE DIVINE.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-900/50 font-medium max-w-3xl mx-auto mb-16 leading-relaxed">
                        Clothing cultivated for the future. Memory preserved in fabric.
                        Before the 3D Gallery immersion begins, experience the Pop Archive.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <button
                            onClick={onEnterGallery}
                            className="px-12 py-6 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-blue-500 hover:shadow-[0_20px_50px_rgba(0,98,255,0.3)] hover:scale-105 transition-all shadow-2xl uppercase tracking-[0.15em] text-sm"
                        >
                            Enter 3D immersion
                        </button>
                        <button className="px-12 py-6 bg-white text-blue-600 font-black rounded-[2rem] border-2 border-blue-100 hover:border-blue-600 hover:shadow-xl transition-all uppercase tracking-[0.15em] text-sm">
                            Read Our Story
                        </button>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 pb-40">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-[2.5rem] p-5 group cursor-pointer border-4 border-transparent hover:border-blue-600 hover:shadow-[0_20px_60px_-15px_rgba(0,98,255,0.2)] transition-all duration-500 transform hover:-translate-y-3">
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6 bg-blue-50/50">
                                <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-x-5 bottom-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button onClick={() => addToCart(product)} className="w-full py-4 bg-white/90 backdrop-blur-md text-blue-600 font-black rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all uppercase text-xs tracking-widest">
                                        Add to Archive
                                    </button>
                                </div>
                            </div>
                            <div className="px-3">
                                <h3 className="font-bold text-xl text-blue-900 leading-tight group-hover:text-blue-600 transition-colors">{product.title}</h3>
                                <p className="text-xl font-black text-blue-600">${product.price.toFixed(2)}</p>
                                <p className="text-sm text-blue-900/40 font-medium uppercase tracking-widest">{product.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Cart Drawer */}
            {showCart && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-md transition-opacity" onClick={() => setShowCart(false)} />
                    <div className="relative w-full max-w-lg bg-white h-full shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col rounded-l-[3.5rem] border-l-[12px] border-blue-600 p-2">
                        <div className="p-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-4xl font-black text-blue-900 tracking-tighter">Archive.</h2>
                            </div>
                            <button onClick={() => setShowCart(false)} className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:rotate-90">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto px-10 space-y-10 py-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-8 items-center group">
                                    <img src={item.images[0].url} className="w-28 h-28 rounded-[2rem] object-cover shadow-lg border-2 border-white" />
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl text-blue-900">{item.title}</h3>
                                        <p className="font-black text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                                        <div className="flex items-center gap-4 mt-4">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 font-black">-</button>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 font-black">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-10 bg-blue-50/50 rounded-tl-[4rem] border-t-2 border-white text-center">
                            <span className="text-4xl font-black text-blue-900 tracking-tight">${cartTotal.toFixed(2)}</span>
                            <button className="w-full mt-8 py-7 bg-blue-600 text-white font-black rounded-[2.5rem] hover:bg-blue-500 shadow-[0_20px_40px_rgba(0,98,255,0.3)] transition-all uppercase tracking-[0.2em] text-sm">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-white border-t border-blue-50 py-20 text-center">
                <IBGLogo size="lg" />
                <h4 className="font-black text-2xl text-blue-900 tracking-tighter mt-8">INSPIRED BY GOD.</h4>
                <p className="text-[0.6rem] font-black tracking-[0.5em] text-blue-900/30 uppercase mt-2">© 2024 IBG COLLECTION. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

export default Shop;
