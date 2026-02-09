import React, { useEffect, useRef, useState } from 'react';
import { svgToColoredPoints, normalizeColoredPoints } from '../utils/svgToPoints';

interface PointCloudProps {
  svgPath: string;
  width?: number;
  height?: number;
  pointSize?: number;
  pointColor?: string;
  density?: number;
  animationDuration?: number;
  className?: string;
  mouseRadius?: number;
  mouseForce?: number;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
}

const RETURN_SPEED = 0.05;
const FRICTION = 0.85;

const PointCloud: React.FC<PointCloudProps> = ({
  svgPath,
  width = 800,
  height = 600,
  pointSize = 2,
  pointColor = '#ffffff',
  density = 50,
  animationDuration = 2,
  className = '',
  mouseRadius = 100,
  mouseForce = 6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const entryRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        let svgString: string;
        if (svgPath.startsWith('<svg')) {
          svgString = svgPath;
        } else {
          const res = await fetch(svgPath);
          svgString = await res.text();
        }

        if (!isMounted) return;

        const raw = svgToColoredPoints(svgString, density);
        const pts = normalizeColoredPoints(raw, width, height);

        particlesRef.current = pts.map((p) => {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          return {
            x: rx, y: ry,
            targetX: p.x, targetY: p.y,
            originX: rx, originY: ry,
            vx: 0, vy: 0,
            color: p.color,
          };
        });

        // Drive entry animation via rAF
        const start = performance.now();
        const dur = animationDuration * 1000;
        const tick = (now: number) => {
          if (!isMounted) return;
          const t = Math.min((now - start) / dur, 1);
          entryRef.current = 1 - Math.pow(1 - t, 3);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        render();
      } catch (e) {
        console.error('PointCloud: failed to load SVG', e);
      }
    };

    load();
    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [svgPath, width, height, density, animationDuration]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999 };
  };

  const render = () => {
    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const progress = entryRef.current;
      const r2 = mouseRadius * mouseRadius;

      particlesRef.current.forEach((p) => {
        if (progress < 1) {
          // Entry: lerp from random origin to target
          p.x = p.originX + (p.targetX - p.originX) * progress;
          p.y = p.originY + (p.targetY - p.originY) * progress;
        } else {
          // Physics: mouse repulsion + spring return
          const dx = p.x - mx;
          const dy = p.y - my;
          const d2 = dx * dx + dy * dy;

          if (d2 < r2 && d2 > 0) {
            const dist = Math.sqrt(d2);
            const force = ((mouseRadius - dist) / mouseRadius) * mouseForce;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          p.vx += (p.targetX - p.x) * RETURN_SPEED;
          p.vy += (p.targetY - p.y) * RETURN_SPEED;
          p.vx *= FRICTION;
          p.vy *= FRICTION;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Color & opacity: near mouse → original color + full opacity, far → default + low opacity
        const dxm = p.x - mx;
        const dym = p.y - my;
        const distToMouse = Math.sqrt(dxm * dxm + dym * dym);
        const colorRadius = mouseRadius * 2;

        if (distToMouse < colorRadius) {
          const blend = 1 - distToMouse / colorRadius;
          ctx.globalAlpha = 0.3 + blend * 0.7; // 0.3 → 1.0
          ctx.fillStyle = p.color;
        } else {
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = pointColor;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, pointSize, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default PointCloud;