    function drawOrganicEye(ctx, cx, cy, r, gazeX, gazeY, blinkPhase, pupilRadius, colors, now, isLocked = false) {
      ctx.save();
      ctx.translate(cx, cy);

      const aw = r * 1.58;
      const ah = r * 0.96;

      // 1. Sclera with soft 3D Spherical Volumetric Gradients
      const scleraGrad = ctx.createRadialGradient(-r * 0.15, -r * 0.15, 2, 0, 0, r);
      scleraGrad.addColorStop(0, '#FFFFFF');
      scleraGrad.addColorStop(0.55, '#FAF6FE');
      scleraGrad.addColorStop(0.82, '#E8DCF6');
      scleraGrad.addColorStop(1, '#C8ACEC');
      ctx.fillStyle = scleraGrad;
      ctx.fillRect(-aw * 0.65, -ah * 0.65, aw * 1.3, ah * 1.3);

      // 3. Iris (Vibrant, Breathing & Glowing Purple Stroma)
      const irisPulse = 1.0 + Math.sin(now * 0.0032) * 0.08;
      const irisR = r * 0.49 * irisPulse;
      const safeGazeX = Math.max(-0.90, Math.min(0.90, gazeX || 0));
      const safeGazeY = Math.max(-0.85, Math.min(0.85, gazeY || 0));
      const ix = isLocked ? (safeGazeX * r * 0.15) : (safeGazeX * (r * 0.38));
      const iy = isLocked ? (safeGazeY * r * 0.15) : (safeGazeY * (r * 0.30));

      ctx.save();
      ctx.translate(ix, iy);

      // 3a. Electric Amethyst Volumetric Corona Plasma Glow behind Iris
      const purpleCoronaPulse = 1.0 + Math.sin(now * 0.004) * 0.16;
      const irisCorona = ctx.createRadialGradient(0, 0, irisR * 0.1, 0, 0, irisR * 1.32 * purpleCoronaPulse);
      irisCorona.addColorStop(0, 'rgba(224, 170, 255, 0.95)');   // Starlight Lavender
      irisCorona.addColorStop(0.32, 'rgba(199, 125, 255, 0.85)'); // Electric Neon Violet
      irisCorona.addColorStop(0.68, 'rgba(157, 78, 221, 0.65)');  // Deep Amethyst
      irisCorona.addColorStop(0.90, 'rgba(114, 9, 183, 0.35)');   // Royal Ultraviolet
      irisCorona.addColorStop(1, 'transparent');
      ctx.fillStyle = irisCorona;
      ctx.beginPath();
      ctx.arc(0, 0, irisR * 1.32 * purpleCoronaPulse, 0, Math.PI * 2);
      ctx.fill();

      // 3b. High-Res Iris Core + Luminous Screen Blend
      if (imgPhotorealisticIris.complete && imgPhotorealisticIris.naturalWidth > 0) {
        ctx.save();
        // REMOVED NESTED CLIP that crashes Safari WebKit rendering engine
        ctx.drawImage(imgPhotorealisticIris, -irisR, -irisR, irisR * 2, irisR * 2);

        // Vibrant Purple Luminescence Enhancer: intensifies rich saturated purple & violet depth
        const irisGlowGrad = ctx.createRadialGradient(0, 0, irisR * 0.1, 0, 0, irisR);
        irisGlowGrad.addColorStop(0, 'rgba(224, 170, 255, 0.60)');
        irisGlowGrad.addColorStop(0.35, 'rgba(199, 125, 255, 0.45)');
        irisGlowGrad.addColorStop(0.70, 'rgba(157, 78, 221, 0.40)');
        irisGlowGrad.addColorStop(1, 'transparent'); // Fade to transparent at edge to avoid square bounds
        ctx.fillStyle = irisGlowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, irisR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const irisGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, irisR);
        irisGrad.addColorStop(0, '#10002b');
        irisGrad.addColorStop(0.18, '#240046');
        irisGrad.addColorStop(0.38, '#5a189a');
        irisGrad.addColorStop(0.62, '#7b2cbf');
        irisGrad.addColorStop(0.82, '#9d4edd');
        irisGrad.addColorStop(0.94, '#c77dff');
        irisGrad.addColorStop(1, '#10002b');
        ctx.fillStyle = irisGrad;
        ctx.beginPath();
        ctx.arc(0, 0, irisR, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3c. Radiating Crystalline Collagen Fibers (Electric Violet & Celestial Cyan)
      const numFibers = 40;
      for (let f = 0; f < numFibers; f++) {
        const fAng = (f / numFibers) * Math.PI * 2 + (now * 0.0004);
        const wave = Math.sin(f * 3.5 + now * 0.002) * (irisR * 0.04);
        const fLen1 = irisR * 0.26;
        const fLen2 = irisR * (0.90 + 0.06 * Math.sin(f * 2.2 + now * 0.002));
        ctx.strokeStyle = (f % 3 === 0) 
          ? 'rgba(255, 215, 0, 0.50)' 
          : (f % 3 === 1 ? 'rgba(0, 255, 200, 0.45)' : 'rgba(224, 170, 255, 0.75)');
        ctx.lineWidth = 0.75;
        const cosA = Math.cos(fAng);
        const sinA = Math.sin(fAng);
        ctx.beginPath();
        ctx.moveTo(cosA * fLen1, sinA * fLen1);
        ctx.lineTo(cosA * fLen2 + (-sinA * wave), sinA * fLen2 + (cosA * wave));
        ctx.stroke();
      }

      

      // 3d. Luminous Purple Limbal Ring with Pulsing Glow
      ctx.strokeStyle = 'rgba(199, 125, 255, 0.90)';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#C77DFF';
      ctx.shadowBlur = 8 * purpleCoronaPulse;
      ctx.beginPath();
      ctx.arc(0, 0, irisR - 0.5, 0, Math.PI * 2);
      ctx.stroke();
