import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Navigation: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    console.log('Navigation mounted');
    console.log('navRef.current:', navRef.current);

    // 暂时禁用动画进行调试
    // if (navRef.current) {
    //   gsap.fromTo(navRef.current,
    //     {
    //       y: -50,
    //       opacity: 0
    //     },
    //     {
    //       y: 0,
    //       opacity: 1,
    //       duration: 1,
    //       delay: 0.5,
    //       ease: "power3.out"
    //     }
    //   );
    // }
  }, []);

  const links = [
    { name: '监控面板', href: 'https://bwolf.work' },
    { name: '弹幕词云', href: 'https://wordcloud.bwolf.work/' },
    { name: '直播间', href: 'https://live.bilibili.com/8432038' },
    { name: '关于', href: 'https://github.com/digbywolf' }
  ];

  const handleLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Underline animation
    gsap.to(e.currentTarget.querySelector('.nav-line'), {
      width: '100%',
      duration: 0.4,
      ease: "expo.out"
    });
    // Text glitch shift
    gsap.to(e.currentTarget.querySelector('.nav-text'), {
      x: 2,
      color: '#EAB308',
      duration: 0.2
    });
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget.querySelector('.nav-line'), {
      width: '0%',
      duration: 0.4,
      ease: "expo.out"
    });
    gsap.to(e.currentTarget.querySelector('.nav-text'), {
      x: 0,
      color: 'white',
      duration: 0.2
    });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center text-white bg-black/30 backdrop-blur-sm"
      style={{ opacity: 1 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 group cursor-pointer">
        <img
          src="/logo.svg"
          alt="BWOLF"
          className="h-10 w-auto transition-all duration-300 group-hover:scale-110"
          onError={(e) => {
            console.error('Logo failed to load');
            e.currentTarget.style.display = 'none';
          }}
          onLoad={() => console.log('Logo loaded successfully')}
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
            <span className="opacity-50 mr-2 text-xs">0{i+1}.</span>
            <span className="nav-text inline-block transition-colors">
              {link.name}
            </span>
            <span className="nav-line absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-500"></span>
          </a>
        ))}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden font-mono text-xs cursor-pointer hover:text-yellow-500 transition-colors">
        [MENU]
      </div>
    </nav>
  );
};

export default Navigation;