"use client";

import React, { useEffect, useRef } from "react";

interface RippleBackgroundProps {
  className?: string;
  numCircles?: number;
  colors?: string[];
}

export default function RippleBackground({
  className = "",
  numCircles = 5,
  colors = ["#10b981", "#059669", "#047857"],
}: RippleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let circles: Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      opacity: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createCircle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 300 + 200,
        speed: Math.random() * 0.5 + 0.3,
        opacity: 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const init = () => {
      circles = [];
      for (let i = 0; i < numCircles; i++) {
        circles.push(createCircle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach((circle, index) => {
        circle.radius += circle.speed;
        circle.opacity = Math.max(
          0,
          0.6 * (1 - circle.radius / circle.maxRadius)
        );

        if (circle.radius >= circle.maxRadius) {
          circles[index] = createCircle();
        }

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = circle.color;
        ctx.globalAlpha = circle.opacity;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      init();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [numCircles, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
