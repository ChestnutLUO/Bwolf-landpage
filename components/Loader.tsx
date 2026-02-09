import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: onComplete,
          });
        }
      },
    });

    // Simulate loading progress
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment for "hacker" feel
        return Math.min(prev + Math.floor(Math.random() * 5) + 1, 100);
      });
    }, 30);

    // Initial animations
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );

    // Bar expansion linked to simulated progress conceptually,
    // but visually we use GSAP for smooth final transition
    tl.to(
      barRef.current,
      {
        width: "100%",
        duration: 2.5,
        ease: "expo.inOut",
      },
      "<",
    ); // Run at start

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050505] p-8 md:p-12 text-[#eeeeee]"
    >
      {/* Top Left decorative */}
      <div className="flex flex-col items-start space-y-2">
        <img src="/logo.svg" alt="BWOLF" className="h-12 w-auto mb-2" />
        <div className="font-mono text-xs text-gray-500 tracking-widest">
          系统启动序列
          <br />
          V.3.0.1
        </div>
      </div>

      {/* Center - Big Title Reveal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
        <div
          ref={textRef}
          className="flex flex-col items-center md:items-end opacity-0"
        >
          <h1 className="text-4xl md:text-8xl font-bold tracking-tighter uppercase leading-none text-center md:text-right">
            Bwolf.work
            <br />
            <span
              className="text-transparent stroke-white"
              style={{ WebkitTextStroke: "1px white" }}
            >
              LOADING
            </span>
          </h1>
          <div className="h-[1px] w-32 bg-yellow-500 mt-4 self-center md:self-end"></div>
        </div>
      </div>

      {/* Bottom Loading Bar & Percent */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-end font-bold text-6xl md:text-8xl text-yellow-500 leading-none font-mono">
          <span>{percent}%</span>
        </div>
        <div className="flex justify-between text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
          <span>加载模块中</span>
        </div>
        <div className="w-full h-1 bg-gray-800 relative overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-white absolute top-0 left-0 w-0"
          ></div>
        </div>
        <div className="text-[10px] font-mono text-gray-600 mt-2">
          正在初始化核心数据流...
        </div>
      </div>
    </div>
  );
};

export default Loader;
