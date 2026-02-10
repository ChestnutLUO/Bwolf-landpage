import React, { useState } from "react";
import Loader from "./components/Loader";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#eeeeee] relative selection:bg-yellow-500 selection:text-black">
      <div className="noise-bg"></div>

      {loading && <Loader onComplete={handleLoadingComplete} />}

      {!loading && <Navigation />}

      <div
        className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <main>
          <HeroSection />
        </main>
      </div>
    </div>
  );
};

export default App;
