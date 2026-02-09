import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, BarChart3, Cloud, Globe, Zap } from 'lucide-react';
import { HERO_TEXT } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const bgGridRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Parallax Effect for Background
      gsap.to(bgGridRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Parallax Effect for Right Column content (move faster than scroll)
      gsap.to(rightColRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Staggered Text Reveal
      tl.fromTo(textRefs.current, 
        { y: 100, opacity: 0, rotateX: 20 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          stagger: 0.15, 
          duration: 1.2, 
          ease: "power3.out",
          delay: 0.2
        }
      );

      // Decorative elements reveal
      tl.fromTo('.hero-decor', 
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1, ease: "expo.out" },
        "-=0.5"
      );

      tl.fromTo('.hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Micro-interaction: Button Hover
  const handleBtnEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" });
    gsap.to(e.currentTarget.querySelector('.icon-arrow'), { x: 5, y: -5, duration: 0.3 });
  };

  const handleBtnLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(e.currentTarget.querySelector('.icon-arrow'), { x: 0, y: 0, duration: 0.3 });
  };

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col justify-center px-4 md:px-12 pt-20 overflow-hidden">
      
      {/* Background Grid - Parallax Layer */}
      <div 
        ref={bgGridRef}
        className="absolute inset-0 z-0 opacity-10 pointer-events-none -top-[20%]" 
        style={{ 
          height: '140%', // Taller than container for parallax
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}>
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Big Text */}
        <div className="lg:col-span-12 flex flex-col justify-center">
          <div className="mb-4 font-mono text-yellow-500 tracking-widest text-xs hero-sub">
            // BWOLF.WORK 数据分析平台
          </div>
          {HERO_TEXT.map((line, index) => (
            <div key={index} className="overflow-hidden">
              <h1
                ref={(el) => { textRefs.current[index] = el; }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] text-white hover:text-yellow-500 transition-all duration-500 select-none cursor-default"
              >
                {line}
              </h1>
            </div>
          ))}
          
          <div className="hero-decor w-full h-[1px] bg-white mt-8 mb-6 origin-left"></div>

          <div className="hero-sub flex flex-col md:flex-row gap-8 font-mono text-sm text-gray-400">
             <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-yellow-500" />
                <span>狼姐节点: 在线</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>实时监控: 已启用</span>
             </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 hero-sub opacity-0">
            <a
              href="https://bwolf.work"
              className="group relative px-8 py-4 bg-white text-black font-mono font-bold text-sm tracking-wider overflow-hidden flex items-center gap-4 hover:bg-yellow-500 transition-colors"
              onMouseEnter={handleBtnEnter}
              onMouseLeave={handleBtnLeave}
            >
              <div className="relative z-10 flex items-center gap-2">
                <BarChart3 size={18} />
                <span>监控面板</span>
                <ArrowUpRight className="icon-arrow" size={18} />
              </div>
            </a>

            <a
              href="https://wordcloud.bwolf.work/"
              className="group relative px-8 py-4 border border-white/30 text-white font-mono font-bold text-sm tracking-wider overflow-hidden flex items-center gap-4 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
              onMouseEnter={handleBtnEnter}
              onMouseLeave={handleBtnLeave}
            >
              <div className="relative z-10 flex items-center gap-2">
                <Cloud size={18} />
                <span>弹幕词云</span>
                <ArrowUpRight className="icon-arrow" size={18} />
              </div>
            </a>
          </div>
        </div>

      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;