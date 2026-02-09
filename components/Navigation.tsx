import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { X } from "lucide-react";

const Navigation: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 使用 gsap.context 进行上下文管理
    // 确保在组件卸载/重新挂载时（Strict Mode），动画状态被正确重置
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });
    }, navRef); // Scope 设置为 navRef

    // 清理函数：在组件卸载时还原所有 GSAP 更改，防止样式残留
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // Open Menu Animation
      gsap.to(menuRef.current, {
        x: "0%",
        duration: 0.6,
        ease: "power4.inOut",
      });
      gsap.fromTo(
        menuItemsRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
        },
      );
    } else {
      // Close Menu Animation
      gsap.to(menuRef.current, {
        x: "100%",
        duration: 0.6,
        ease: "power4.inOut",
      });
    }
  }, [isMenuOpen]);

  const links = [
    { name: "监控面板", href: "https://grafana.bwolf.work?kiosk" },
    { name: "弹幕词云", href: "https://wordcloud.bwolf.work/" },
    { name: "直播间", href: "https://live.bilibili.com/8432038" },
  ];

  const handleLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Underline animation
    gsap.to(e.currentTarget.querySelector(".nav-line"), {
      width: "100%",
      duration: 0.4,
      ease: "expo.out",
    });
    // Text glitch shift
    gsap.to(e.currentTarget.querySelector(".nav-text"), {
      x: 2,
      color: "#EAB308",
      duration: 0.2,
    });
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget.querySelector(".nav-line"), {
      width: "0%",
      duration: 0.4,
      ease: "expo.out",
    });
    gsap.to(e.currentTarget.querySelector(".nav-text"), {
      x: 0,
      color: "white",
      duration: 0.2,
    });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center text-white bg-black/30 backdrop-blur-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <img
            src="/logo.svg"
            alt="BWOLF"
            className="h-10 w-auto transition-all duration-300 group-hover:scale-110"
            onError={(e) => {
              console.error("Logo failed to load");
              e.currentTarget.style.display = "none";
            }}
          />
          {/* Fallback text if logo fails */}
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg tracking-tighter">BWOLF</span>
            <span className="text-[10px] font-mono tracking-widest">WORK</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-12">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-sm font-mono tracking-wider relative group py-2"
              onMouseEnter={handleLinkEnter}
              onMouseLeave={handleLinkLeave}
            >
              <span className="opacity-50 mr-2 text-xs">0{i + 1}.</span>
              <span className="nav-text inline-block transition-colors">
                {link.name}
              </span>
              <span className="nav-line absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-500"></span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden font-mono text-xs cursor-pointer hover:text-yellow-500 transition-colors z-50 relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <span className="flex items-center gap-2">
              CLOSE <X size={14} />
            </span>
          ) : (
            "[MENU]"
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-[#050505] z-40 flex flex-col justify-center items-center md:hidden translate-x-full"
      >
        <div className="flex flex-col gap-8 text-center">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              ref={(el) => {
                menuItemsRef.current[i] = el;
              }}
              className="text-3xl font-bold tracking-tighter text-white hover:text-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="block text-xs font-mono text-gray-500 mb-2">
                0{i + 1}
              </span>
              {link.name}
            </a>
          ))}
        </div>

        <div className="absolute bottom-10 text-xs font-mono text-gray-600">
          BWOLF.WORK SYSTEM
        </div>
      </div>
    </>
  );
};

export default Navigation;
