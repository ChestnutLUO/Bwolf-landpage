import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ScrollingText: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const phrases = [
    { prefix: '专为', text: '同接厨', color: 'text-yellow-500' },
    { prefix: '纵向直播', text: '拉表', color: 'text-cyan-400' },
    { prefix: '横向对比', text: '兄弟们', color: 'text-pink-400' },
    { prefix: '数据看板', text: '纵览全局', color: 'text-green-400' },
    { prefix: '', text: '哈哈大笑', color: 'text-purple-400' }
  ];

  useEffect(() => {
    console.log('ScrollingText mounted');

    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll('.scroll-item');
      console.log('Found scroll items:', items?.length);

      if (!items || items.length === 0) return;

      const tl = gsap.timeline({ repeat: -1 });

      items.forEach((item, i) => {
        tl.fromTo(
          item,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          i * 2.5
        )
          .to(item, { opacity: 1, duration: 1.5 })
          .to(item, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[100px] w-full overflow-visible flex items-center"
      style={{ minWidth: '200px' }}
    >
      {phrases.map((phrase, index) => (
        <div
          key={index}
          className="scroll-item absolute left-0 opacity-0 whitespace-nowrap"
        >
          {phrase.prefix && (
            <span className="text-gray-400 text-2xl md:text-3xl lg:text-4xl mr-3 font-mono">
              {phrase.prefix}
            </span>
          )}
          <span className={`${phrase.color} font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none`}>
            {phrase.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ScrollingText;