import React, { useEffect, useRef } from 'react';

export default function Globe({ threats = [] }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.38;
    let rot = 0;

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
      const fov = 600;
      const scale = fov / (fov + z);
      return { x: cx + x * scale, y: cy - y * scale, z, visible: z > -R * 0.5 };
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Outer glow
      const grd = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.4);
      grd.addColorStop(0, 'rgba(99,102,241,0.04)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Globe shadow
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      const shadowGrd = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
      shadowGrd.addColorStop(0, 'rgba(99,102,241,0.08)');
      shadowGrd.addColorStop(0.5, 'rgba(10,12,28,0.6)');
      shadowGrd.addColorStop(1, 'rgba(5,6,14,0.9)');
      ctx.fillStyle = shadowGrd;
      ctx.fill();

      // Latitude lines
      ctx.strokeStyle = 'rgba(99,102,241,0.12)';
      ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 3) {
          const p = latLngTo3D(lat, lng, R);
          const proj = project(p.x, p.y, p.z);
          if (!proj.visible) continue;
          if (lng === -180) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = latLngTo3D(lat, lng, R);
          const proj = project(p.x, p.y, p.z);
          if (!proj.visible) continue;
          if (lat === -90) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99,102,241,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Threat points
      threats.forEach(threat => {
        const p = latLngTo3D(threat.lat || 20, threat.lng || 80, R);
        const proj = project(p.x, p.y, p.z);
        if (!proj.visible) return;

        const color = threat.status === 'unauthorized' ? '#f43f5e'
          : threat.status === 'suspicious' ? '#f59e0b' : '#10b981';
        const size = threat.status === 'unauthorized' ? 5 : 4;

        // Pulse ring
        const pulseScale = 1 + (Math.sin(Date.now() * 0.003 + threat.lat) * 0.5 + 0.5) * 1.5;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size * pulseScale, 0, Math.PI * 2);
        ctx.strokeStyle = color + '40';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dot
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color + 'cc';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner bright dot
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });

      // Connection lines between high threats
      const highThreats = threats.filter(t => t.status === 'unauthorized');
      highThreats.forEach((t1, i) => {
        if (i >= highThreats.length - 1) return;
        const t2 = highThreats[i + 1];
        const p1 = latLngTo3D(t1.lat || 20, t1.lng || 80, R);
        const p2 = latLngTo3D(t2.lat || 30, t2.lng || 90, R);
        const proj1 = project(p1.x, p1.y, p1.z);
        const proj2 = project(p2.x, p2.y, p2.z);
        if (!proj1.visible || !proj2.visible) return;
        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.strokeStyle = 'rgba(244,63,94,0.15)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      rot += 0.08;
      animRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [threats]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
