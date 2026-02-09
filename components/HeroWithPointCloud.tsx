import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import PointCloud from "./PointCloud";

/**
 * 在 HeroSection 中集成点云效果的示例
 *
 * 使用场景：
 * 1. 作为背景装饰元素
 * 2. Logo 动画效果
 * 3. 交互式视觉元素
 */

const HeroWithPointCloud: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 点云淡入动画
      gsap.from(".point-cloud-container", {
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 背景网格 */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 点云容器 */}
      <div className="point-cloud-container relative z-10 flex flex-col items-center gap-12">
        {/* 点云效果 */}
        <div className="relative">
          <PointCloud
            svgPath="/lxm.svg"
            width={600}
            height={468}
            pointSize={2}
            pointColor="#faecde"
            density={60}
            animationDuration={3}
            className="drop-shadow-2xl"
          />

          {/* 发光效果 */}
          <div className="absolute inset-0 bg-yellow-500/10 blur-3xl -z-10" />
        </div>

        {/* 文字内容 */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            狼小妹直播监控
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            // 数据可视化 · 实时分析
          </p>
        </div>

        {/* CTA 按钮 */}
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-white text-black font-bold hover:bg-yellow-500 transition-colors">
            开始使用
          </button>
          <button className="px-8 py-3 border border-white/20 text-white hover:border-yellow-500 hover:text-yellow-500 transition-colors">
            了解更多
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroWithPointCloud;
