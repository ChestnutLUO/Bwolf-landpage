import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { svgToPoints, normalizePoints } from '../utils/svgToPoints';

interface PointCloudProps {
  svgPath: string;
  width?: number;
  height?: number;
  pointSize?: number;
  pointColor?: string;
  density?: number;
  animationDuration?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

const PointCloud: React.FC<PointCloudProps> = ({
  svgPath,
  width = 800,
  height = 600,
  pointSize = 2,
  pointColor = '#ffffff',
  density = 50,
  animationDuration = 2,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadAndConvert = async () => {
      try {
        let svgString: string;

        if (svgPath.startsWith('<svg')) {
          svgString = svgPath;
        } else {
          const response = await fetch(svgPath);
          svgString = await response.text();
        }

        console.log('SVG loaded, converting to points...');
        const pathPoints = svgToPoints(svgString, density);
        console.log(`Found ${pathPoints.length} paths`);

        // Flatten all points first
        const allPoints: { x: number; y: number }[] = [];
        pathPoints.forEach((points) => {
          allPoints.push(...points);
        });

        console.log(`Total points before normalization: ${allPoints.length}`);

        // Normalize all points together to maintain spatial relationships
        const normalizedPoints = normalizePoints(allPoints, width, height);
        console.log(`Total points after normalization: ${normalizedPoints.length}`);

        // Initialize particles
        particlesRef.current = normalizedPoints.map((point) => ({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: point.x,
          targetY: point.y,
        }));

        setIsLoaded(true);

        // Animate each particle individually
        particlesRef.current.forEach((particle, index) => {
          gsap.to(particle, {
            x: particle.targetX,
            y: particle.targetY,
            duration: animationDuration,
            ease: 'power2.out',
            delay: index * 0.0005,
          });
        });

        // Start render loop
        startAnimation();
      } catch (error) {
        console.error('Failed to load SVG:', error);
      }
    };

    loadAndConvert();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [svgPath, width, height, density, animationDuration]);

  const startAnimation = () => {
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = pointColor;

      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pointSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default PointCloud;
