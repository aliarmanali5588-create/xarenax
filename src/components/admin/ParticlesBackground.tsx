import { useEffect, useRef } from "react";
import { colorSchemes, ParticleConfig } from "./ParticleSettings";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

interface ParticlesBackgroundProps {
  config: ParticleConfig;
  onFpsUpdate?: (fps: number, particleCount: number) => void;
}

const ParticlesBackground = ({ config, onFpsUpdate }: ParticlesBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!config.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Create particles based on config
    const particles: Particle[] = [];
    const colors = colorSchemes[config.colorScheme].colors;

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < config.count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * config.particleSize + 1,
          speedX: (Math.random() - 0.5) * 0.5 * config.speed,
          speedY: (Math.random() - 0.5) * 0.5 * config.speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    createParticles();

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      // FPS calculation
      frameCountRef.current++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      if (deltaTime >= 1000) {
        fpsRef.current = Math.round((frameCountRef.current * 1000) / deltaTime);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
        
        // Report FPS to parent component
        if (onFpsUpdate) {
          onFpsUpdate(fpsRef.current, particles.length);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      // Draw connections (subtle)
      ctx.globalAlpha = 0.05;
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 215, 0, 0.1)";
            ctx.lineWidth = 0.3;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config]);

  if (!config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
};

export default ParticlesBackground;
