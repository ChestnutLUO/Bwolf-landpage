import React, { useState } from 'react';
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setLoading(false);
    // Slight delay to ensure DOM is ready for entrance animations if needed, 
    // though GSAP handles this well.
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#eeeeee] relative selection:bg-yellow-500 selection:text-black">
      <div className="noise-bg"></div>
      
      {/* Loader controls the initial view */}
      {loading && <Loader onComplete={handleLoadingComplete} />}

      {/* Navigation - Always visible after loading */}
      {!loading && <Navigation />}

      {/* Main Content */}
      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <main>
          <HeroSection />
          <Dashboard />
        </main>
      </div>
      
      {/* Fixed bottom left indicator */}
      {!loading && (
         <div className="fixed bottom-8 left-8 z-40 hidden md:block mix-blend-difference">
            <div className="flex flex-col gap-1">
              <div className="w-1 h-12 bg-white mb-2"></div>
              <span className="font-mono text-[10px] tracking-widest writing-mode-vertical rotate-180">
                向下滚动探索
              </span>
            </div>
         </div>
      )}
    </div>
  );
};

export default App;