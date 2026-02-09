import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  BarChart3,
  Cloud,
  Globe,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { HERO_TEXT } from "../constants";
import ScrollingText from "./ScrollingText";
import PointCloud from "./PointCloud";

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
          scrub: true,
        },
      });

      // Parallax Effect for Right Column content
      gsap.to(rightColRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Staggered Text Reveal
      tl.fromTo(
        textRefs.current,
        { y: 100, opacity: 0, rotateX: 20 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      tl.fromTo(
        ".hero-decor",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1, ease: "expo.out" },
        "-=0.5",
      );

      tl.fromTo(
        ".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.8",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Micro-interaction: Button Hover
  const handleBtnEnter = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
    gsap.to(e.currentTarget.querySelector(".icon-arrow"), {
      x: 5,
      y: -5,
      duration: 0.3,
    });
  };

  const handleBtnLeave = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(e.currentTarget.querySelector(".icon-arrow"), {
      x: 0,
      y: 0,
      duration: 0.3,
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center px-4 md:px-12 pt-32 overflow-hidden"
    >
      {/* Background Grid */}
      <div
        ref={bgGridRef}
        className="absolute inset-0 z-0 opacity-10 pointer-events-none -top-[20%]"
        style={{
          height: "140%",
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* Main Content Area: Left text + Right point cloud */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          {/* Left: Big Text Block */}
          <div className="flex-shrink-0 z-20">
            <div className="mb-6 font-mono text-yellow-500 tracking-widest text-xs hero-sub">
              // BWOLF.WORK 数据分析平台
            </div>
            <div className="flex flex-col">
              {HERO_TEXT.map((line, index) => (
                <div key={index} className="overflow-hidden">
                  <h1
                    ref={(el) => {
                      textRefs.current[index] = el;
                    }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[1.1] md:leading-[0.9] text-white hover:text-yellow-500 transition-all duration-500 select-none cursor-default"
                  >
                    {line}
                  </h1>
                </div>
              ))}
            </div>
            {/* Scrolling Text below hero text on mobile */}
            <div className="lg:hidden mt-6 hero-sub">
              <ScrollingText />
            </div>
          </div>

          {/* Right: Point Cloud with Scrolling Text overlay */}
          <div
            ref={rightColRef}
            className="hidden lg:flex flex-col items-end flex-shrink-0 hero-sub"
          >
            <div className="relative">
              <div>
                <PointCloud
                  svgPath="/lxm.svg"
                  width={500}
                  height={400}
                  pointSize={1.2}
                  pointColor="#faecde"
                  density={4}
                  animationDuration={3}
                />
              </div>
              <div className="absolute bottom-4 left-0 right-0">
                <ScrollingText />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Elements - Full Width */}
        <div className="w-full max-w-7xl mt-10">
          <div className="hero-decor w-full h-[1px] bg-white/20 origin-left"></div>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="hero-sub flex flex-col md:flex-row gap-8 font-mono text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-yellow-500" />
                <span>面板节点: 在线</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>实时监控: 已启用</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 hero-sub">
              <a
                href="https://grafana.bwolf.work?kiosk"
                className="group relative px-6 py-3 bg-white text-black font-mono font-bold text-xs tracking-wider overflow-hidden flex items-center gap-3 hover:bg-yellow-500 transition-colors"
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                <BarChart3 size={16} />
                <span>监控面板</span>
                <ArrowUpRight className="icon-arrow" size={16} />
              </a>

              <a
                href="https://grafana.bwolf.work/d/bwolf-overview?kiosk"
                className="group relative px-6 py-3 border border-white/20 text-white font-mono font-bold text-xs tracking-wider overflow-hidden flex items-center gap-3 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                <LayoutDashboard size={16} />
                <span>整体监控</span>
                <ArrowUpRight className="icon-arrow" size={16} />
              </a>

              <a
                href="https://wordcloud.bwolf.work/"
                className="group relative px-6 py-3 border border-white/20 text-white font-mono font-bold text-xs tracking-wider overflow-hidden flex items-center gap-3 hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                onMouseEnter={handleBtnEnter}
                onMouseLeave={handleBtnLeave}
              >
                <Cloud size={16} />
                <span>弹幕词云</span>
                <ArrowUpRight className="icon-arrow" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
