import React, { useState } from 'react';
import Shop from './Shop';
import IBG3DGallery from './Gallery';

const App = () => {
  const [view, setView] = useState('shop'); // 'shop' or 'gallery'

  const enterGallery = () => {
    setView('gallery');
  };

  const exitGallery = () => {
    setView('shop');
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {view === 'shop' ? (
        <Shop onEnterGallery={enterGallery} />
      ) : (
        <div className="relative w-full h-screen">
          <IBG3DGallery />

          {/* Exit Button Overlay */}
          <button
            onClick={exitGallery}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-[0.6rem] shadow-2xl"
          >
            Exit immersion
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
