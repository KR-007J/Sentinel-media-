import React, { useEffect, useRef } from 'react';

export default function Globe({ threats = [] }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const threatsRef = useRef(threats);

  useEffect(() => {
    threatsRef.current = threats;
  }, [threats]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Scale for high DPI
    const dpr = window.devicePixelRatio || 1;
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      return rect;
    };

    let rect = updateSize();
    let W = rect.width;
    let H = rect.height;
    let cx = W / 2, cy = H / 2;
    let R = Math.min(W, H) * 0.42;
    let rot = 0;

    window.addEventListener('resize', () => {
      rect = updateSize();
      W = rect.width;
      H = rect.height;
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.42;
    });

    // Convert lat/lng to 3D sphere point
    function latLngTo3D(lat, lng, r) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + rot) * (Math.PI / 180);
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
      };
    }

    // Project 3D to 2D
    function project(x, y, z) {
      const fov = 1000;
      const scale = fov / (fov + z);
      return { x: cx + x * scale, y: cy - y * scale, z, visible: z > -R * 0.8 };
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Atmospheric Glow
      const grd = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.8);
      grd.addColorStop(0, 'rgba(6,182,212,0.08)');
      grd.addColorStop(0.5, 'rgba(188,19,254,0.02)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Sphere Base
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      const shadowGrd = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
      shadowGrd.addColorStop(0, '#0f172a');
      shadowGrd.addColorStop(1, '#020617');
      ctx.fillStyle = shadowGrd;
      ctx.fill();

      // Grid Lines
      ctx.strokeStyle = 'rgba(6,182,212,0.1)';
      ctx.lineWidth = 0.5;
      
      // Latitude
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 5) {
          const p = latLngTo3D(lat, lng, R);
          const proj = project(p.x, p.y, p.z);
          if (!proj.visible) continue;
          if (lng === -180) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Longitude
      for (let lng = 0; lng < 360; lng += 20) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const p = latLngTo3D(lat, lng, R);
          const proj = project(p.x, p.y, p.z);
          if (!proj.visible) continue;
          if (lat === -90) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Border Ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6,182,212,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Threats
      threatsRef.current.forEach(threat => {
        const p = latLngTo3D(threat.lat || 0, threat.lng || 0, R);
        const proj = project(p.x, p.y, p.z);
        if (!proj.visible) return;

        const color = threat.severity === 'Critical' ? '#ef4444' 
                    : threat.severity === 'High' ? '#f59e0b' : '#06b6d4';
        const size = threat.severity === 'Critical' ? 5 : 3;

        // Pulse
        const pulse = (Math.sin(Date.now() * 0.005 + (threat.lat || 0)) * 0.5 + 0.5);
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size * (1 + pulse * 2), 0, Math.PI * 2);
        ctx.strokeStyle = color + (Math.floor((1 - pulse) * 255)).toString(16).padStart(2, '0');
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rot += 0.08;
      animRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();
    return () => { 
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      style={{ display: 'block' }}
    />
  );
}

