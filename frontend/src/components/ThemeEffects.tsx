import React, { useEffect, useRef } from 'react';
import { useAppearance } from '../contexts/AppearanceContext';

interface EffectConfig {
  enabled: boolean;
  startDate: string;
  endDate: string;
}

type EffectsMap = Record<string, EffectConfig>;

function isActiveNow(cfg: EffectConfig): boolean {
  if (!cfg.enabled) return false;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`; // e.g., "2026-06-22"

  if (cfg.startDate && cfg.startDate > todayStr) return false;
  if (cfg.endDate && cfg.endDate < todayStr) return false;
  return true;
}

export function ThemeEffects() {
  const { settings } = useAppearance();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const effects: EffectsMap = React.useMemo(() => {
    try {
      return JSON.parse(settings.theme_effects || '{}');
    } catch {
      return {};
    }
  }, [settings.theme_effects]);

  const activeEffects = Object.entries(effects)
    .filter(([, cfg]) => isActiveNow(cfg))
    .map(([key]) => key);

  useEffect(() => {
    if (activeEffects.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ─── Particle definitions ───
    
    // 1. Snow Particles
    interface SnowFlake {
      x: number;
      y: number;
      radius: number;
      density: number;
      opacity: number;
      swaySpeed: number;
      swayAmplitude: number;
      swayOffset: number;
    }
    let flakes: SnowFlake[] = [];
    if (activeEffects.includes('snow')) {
      flakes = Array.from({ length: 120 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height - height,
        radius: 1 + Math.random() * 4,
        density: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
        swaySpeed: 0.5 + Math.random() * 1.5,
        swayAmplitude: 10 + Math.random() * 25,
        swayOffset: Math.random() * 100,
      }));
    }

    // 2. Confetti Particles
    interface ConfettiPiece {
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      tilt: number;
      tiltSpeed: number;
    }
    const confettiColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B9D', '#C084FC', '#FB923C', '#10B981', '#F59E0B', '#EC4899'];
    let confetti: ConfettiPiece[] = [];
    if (activeEffects.includes('confetti')) {
      confetti = Array.from({ length: 80 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height - height,
        width: 6 + Math.random() * 8,
        height: 10 + Math.random() * 12,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: 2 + Math.random() * 4,
        speedX: -1.5 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: -2 + Math.random() * 4,
        tilt: Math.random() * 10 - 5,
        tiltSpeed: 0.03 + Math.random() * 0.08,
      }));
    }

    // 3. Flower Petals (Hoa Mai & Đào)
    interface Petal {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      angle: number;
      angleSpeed: number;
      tilt: number;
      tiltSpeed: number;
      color: string;
      petalType: 'mai' | 'dao';
    }
    let petals: Petal[] = [];
    if (activeEffects.includes('hoamai')) {
      petals = Array.from({ length: 45 }, () => {
        const isMai = Math.random() > 0.4;
        return {
          x: Math.random() * width,
          y: Math.random() * height - height,
          radius: 6 + Math.random() * 8,
          speedY: 1 + Math.random() * 2.2,
          speedX: -1 + Math.random() * 2,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: -0.02 + Math.random() * 0.04,
          tilt: Math.random() * Math.PI,
          tiltSpeed: 0.02 + Math.random() * 0.05,
          // Mai: Golden/Yellow, Đào: Pink/Rose gradients
          color: isMai 
            ? ['#FBBF24', '#F59E0B', '#F59E0B', '#FEF08A'][Math.floor(Math.random() * 4)]
            : ['#F472B6', '#EC4899', '#F472B6', '#FCE7F3'][Math.floor(Math.random() * 4)],
          petalType: isMai ? 'mai' : 'dao',
        };
      });
    }

    // 4. Fireworks Particles
    interface FireworkSpark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      life: number;
      maxLife: number;
      size: number;
    }
    interface FireworkRocket {
      x: number;
      y: number;
      tx: number;
      ty: number;
      speed: number;
      color: string;
      angle: number;
    }
    let rockets: FireworkRocket[] = [];
    let sparks: FireworkSpark[] = [];
    const fwColors = ['#FF4646', '#FFD700', '#00FF66', '#00E5FF', '#FF00FF', '#FF8800', '#FFFFFF'];

    const spawnRocket = () => {
      const tx = 150 + Math.random() * (width - 300);
      const ty = 80 + Math.random() * (height / 2);
      rockets.push({
        x: tx + (Math.random() * 100 - 50),
        y: height + 10,
        tx,
        ty,
        speed: 4 + Math.random() * 3,
        color: fwColors[Math.floor(Math.random() * fwColors.length)],
        angle: 0,
      });
    };

    let fwTimer = 0;

    // 5. Floating Icons
    interface FloatingBubble {
      x: number;
      y: number;
      size: number;
      color: string;
      symbol: string;
      speedY: number;
      speedX: number;
      swayOffset: number;
      alpha: number;
    }
    let bubbles: FloatingBubble[] = [];
    const bubbleSymbols = ['⭐', '✨', '💎', '🔥', '🎯', '🚀', '💡', '🎁'];
    const bubbleColors = ['rgba(251, 191, 36, 0.7)', 'rgba(96, 165, 250, 0.7)', 'rgba(52, 211, 153, 0.7)', 'rgba(244, 114, 182, 0.7)'];
    if (activeEffects.includes('floating')) {
      bubbles = Array.from({ length: 25 }, () => ({
        x: Math.random() * width,
        y: height + 50 + Math.random() * 200,
        size: 14 + Math.random() * 12,
        color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        symbol: bubbleSymbols[Math.floor(Math.random() * bubbleSymbols.length)],
        speedY: 0.8 + Math.random() * 1.5,
        speedX: -0.5 + Math.random() * 1,
        swayOffset: Math.random() * Math.PI * 2,
        alpha: 0,
      }));
    }

    // ─── Drawing helpers ───

    const drawPetal = (x: number, y: number, r: number, angle: number, tilt: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(Math.sin(tilt), 1);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r, -r, -r * 1.5, r / 2, 0, r * 1.5);
      ctx.bezierCurveTo(r * 1.5, r / 2, r, -r, 0, 0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, r * 1.1);
      ctx.stroke();
      ctx.restore();
    };

    const drawSpark = (spark: FireworkSpark) => {
      ctx.save();
      ctx.globalAlpha = spark.alpha;
      ctx.fillStyle = spark.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const createExplosion = (x: number, y: number, color: string) => {
      const numSparks = 80 + Math.floor(Math.random() * 50);
      for (let i = 0; i < numSparks; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (0.5 + Math.random() * 1.5),
          color,
          alpha: 1,
          life: 0,
          maxLife: 60 + Math.random() * 50,
          size: 1 + Math.random() * 2,
        });
      }
    };

    // ─── Animation loop ───
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // --- 1. Render Snow ---
      if (activeEffects.includes('snow')) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        flakes.forEach(f => {
          f.y += f.density;
          f.swayOffset += f.swaySpeed * 0.015;
          f.x += Math.sin(f.swayOffset) * 0.4;

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
          ctx.fill();

          if (f.y > height) {
            f.y = -10;
            f.x = Math.random() * width;
          }
        });
      }

      // --- 2. Render Confetti ---
      if (activeEffects.includes('confetti')) {
        confetti.forEach(c => {
          c.y += c.speedY;
          c.x += c.speedX;
          c.rotation += c.rotationSpeed;
          c.tilt += c.tiltSpeed;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((c.rotation * Math.PI) / 180);
          ctx.fillStyle = c.color;
          const currentWidth = c.width * Math.cos(c.tilt);
          ctx.fillRect(-currentWidth / 2, -c.height / 2, currentWidth, c.height);
          ctx.restore();

          if (c.y > height) {
            c.y = -15;
            c.x = Math.random() * width;
          }
        });
      }

      // --- 3. Render Flowers (Hoa Mai & Đào) ---
      if (activeEffects.includes('hoamai')) {
        petals.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.angle += p.angleSpeed;
          p.tilt += p.tiltSpeed;

          drawPetal(p.x, p.y, p.radius, p.angle, p.tilt, p.color);

          if (p.y > height) {
            p.y = -15;
            p.x = Math.random() * width;
          }
        });
      }

      // --- 4. Render Fireworks ---
      if (activeEffects.includes('fireworks')) {
        fwTimer++;
        if (fwTimer % 75 === 0 || (rockets.length === 0 && Math.random() < 0.02)) {
          spawnRocket();
        }

        // Update & Draw Rockets
        rockets.forEach((r, idx) => {
          const dx = r.tx - r.x;
          const dy = r.ty - r.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 8) {
            createExplosion(r.x, r.y, r.color);
            rockets.splice(idx, 1);
          } else {
            const angle = Math.atan2(dy, dx);
            r.x += Math.cos(angle) * r.speed;
            r.y += Math.sin(angle) * r.speed;

            // Gradient rocket head & trail
            ctx.save();
            ctx.beginPath();
            ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = r.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = r.color;
            ctx.fill();
            ctx.restore();

            // Trail particle
            if (Math.random() < 0.6) {
              sparks.push({
                x: r.x,
                y: r.y,
                vx: -Math.cos(angle) * 1.5 + (Math.random() * 0.8 - 0.4),
                vy: -Math.sin(angle) * 1.5 + (Math.random() * 0.8 - 0.4) + 1,
                color: '#FFEAAA',
                alpha: 0.8,
                life: 0,
                maxLife: 20 + Math.random() * 15,
                size: 1,
              });
            }
          }
        });

        // Update & Draw Sparks
        sparks.forEach((s, idx) => {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.06; // gravity
          s.vx *= 0.98; // air resistance
          s.vy *= 0.98;
          s.life++;
          s.alpha = 1 - s.life / s.maxLife;

          if (s.life >= s.maxLife) {
            sparks.splice(idx, 1);
          } else {
            drawSpark(s);
          }
        });
      }

      // --- 5. Render Floating Bubbles ---
      if (activeEffects.includes('floating')) {
        bubbles.forEach(b => {
          b.y -= b.speedY;
          b.swayOffset += 0.015;
          b.x += Math.sin(b.swayOffset) * 0.35 + b.speedX;

          if (b.y < height && b.y > 0) {
            b.alpha = Math.min(b.alpha + 0.05, 0.7);
          } else if (b.y <= 0) {
            b.alpha = Math.max(b.alpha - 0.05, 0);
          }

          ctx.save();
          ctx.globalAlpha = b.alpha;
          // Bubble background glow
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.fill();

          // Bubble inner icon text
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `${b.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.symbol, b.x, b.y);
          ctx.restore();

          if (b.y < -b.size * 2) {
            b.y = height + 50 + Math.random() * 200;
            b.x = Math.random() * width;
            b.alpha = 0;
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeEffects]);

  if (activeEffects.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'block',
      }}
    />
  );
}
