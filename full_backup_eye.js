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
      ctx.shadowBlur = 0;

      // 4. Breathing Obsidian Pupil with Soft Magenta Margin
      const pupilBreath = 1.0 + Math.sin(now * 0.0026) * 0.12;
      const pRad = Math.max(irisR * 0.24, Math.min(irisR * 0.46, (pupilRadius || irisR * 0.32) * pupilBreath));
      
      // Pupil edge purple halo
      ctx.fillStyle = 'rgba(114, 9, 183, 0.45)';
      ctx.beginPath();
      ctx.arc(0, 0, pRad + 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Deep Obsidian Pupil Core
      ctx.fillStyle = '#05000a';
      ctx.beginPath();
      ctx.arc(0, 0, pRad, 0, Math.PI * 2);
      ctx.fill();

      // 5. Triple Diamond Starlight Specular Glints
      // Primary Brilliance Sparkle
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(-irisR * 0.28, -irisR * 0.28, Math.max(2.2, r * 0.042), 0, Math.PI * 2);
      ctx.fill();

      // Secondary Starlight Reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = '#00FFC8';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(irisR * 0.22, irisR * 0.20, Math.max(1.2, r * 0.024), 0, Math.PI * 2);
      ctx.fill();

      // Micro Specular Glint
      ctx.fillStyle = 'rgba(224, 170, 255, 0.85)';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(-irisR * 0.15, irisR * 0.26, Math.max(0.8, r * 0.016), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // end iris translate

      // 6. Smooth Biological Eyelid Blink Cover
      if (blinkPhase > 0) {
        ctx.fillStyle = '#140026';
        const bh = ah * 0.65 * blinkPhase;

        // Upper Eyelid
        ctx.beginPath();
        ctx.moveTo(-aw * 0.6, -ah * 0.6);
        ctx.lineTo(aw * 0.6, -ah * 0.6);
        ctx.lineTo(aw * 0.6, -ah * 0.6 + bh);
        ctx.quadraticCurveTo(0, -ah * 0.6 + bh * 1.4, -aw * 0.6, -ah * 0.6 + bh);
        ctx.closePath();
        ctx.fill();

        // Lower Eyelid
        ctx.beginPath();
        ctx.moveTo(-aw * 0.6, ah * 0.6);
        ctx.lineTo(aw * 0.6, ah * 0.6);
        ctx.lineTo(aw * 0.6, ah * 0.6 - bh);
        ctx.quadraticCurveTo(0, ah * 0.6 - bh * 1.4, -aw * 0.6, ah * 0.6 - bh);
        ctx.closePath();
        ctx.fill();
      }

      // Apply Asymmetric Natural Almond Mask using compositing (Bypasses Safari hardware clip bug)
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.moveTo(-aw * 0.50, 0);
      ctx.bezierCurveTo(-aw * 0.32, -ah * 0.60, aw * 0.16, -ah * 0.54, aw * 0.50, -ah * 0.04);
      ctx.bezierCurveTo(aw * 0.22, ah * 0.52, -aw * 0.30, ah * 0.44, -aw * 0.50, 0);
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      // Removed ctx.restore() because we removed the matching ctx.save() earlier.

      // 7. Gold Almond Eyelid Rim Border
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.88)';
      ctx.lineWidth = Math.max(1.6, r * 0.032);
      ctx.shadowColor = 'rgba(0, 255, 200, 0.75)';
      ctx.shadowBlur = Math.max(4, r * 0.09);
      ctx.beginPath();
      ctx.moveTo(-aw * 0.50, 0);
      ctx.bezierCurveTo(-aw * 0.32, -ah * 0.60, aw * 0.16, -ah * 0.54, aw * 0.50, -ah * 0.04);
      ctx.bezierCurveTo(aw * 0.22, ah * 0.52, -aw * 0.30, ah * 0.44, -aw * 0.50, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 8. PHOTOREALISTIC COUTURE CURVED EYELASHES (Upper & Lower)
      // Upper Lashes: 26 naturally tapered, fanned lashes with root-to-tip curve
      const numUpperLashes = 26;
      ctx.save();
      ctx.lineCap = 'round';
      for (let l = 0; l < numUpperLashes; l++) {
        const t = l / (numUpperLashes - 1);
        const lx = -aw * 0.45 + t * (aw * 0.90);
        const normX = (t - 0.5) * 2;
        const archY = -ah * 0.52 * Math.sqrt(Math.max(0, 1 - normX * normX));
        const ly = blinkPhase > 0.005 ? (archY + blinkPhase * (ah * 0.35)) : archY;

        let lenFactor;
        if (t < 0.25) lenFactor = 0.40 + (t / 0.25) * 0.45;
        else if (t < 0.75) lenFactor = 0.85 + ((t - 0.25) / 0.50) * 0.30;
        else lenFactor = 1.15 - ((t - 0.75) / 0.25) * 0.45;

        const lashLen = (r * 0.38) * lenFactor * (1 - blinkPhase * 0.2);
        const fanAng = -Math.PI * 0.5 + (t - 0.45) * 1.30;
        const curlAng = fanAng + (t < 0.45 ? -0.22 : 0.25);

        const midX = lx + Math.cos(fanAng) * (lashLen * 0.52);
        const midY = ly + Math.sin(fanAng) * (lashLen * 0.52);
        const tipX = lx + Math.cos(curlAng) * lashLen;
        const tipY = ly + Math.sin(curlAng) * lashLen;

        ctx.strokeStyle = l % 2 === 0 ? '#06010D' : '#120320';
        ctx.lineWidth = Math.max(0.7, r * 0.024 * Math.max(0.4, 1 - Math.abs(t - 0.6) * 0.8));
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.stroke();

        // Delicate shimmer tip
        if (l % 4 === 0 && r > 16) {
          ctx.strokeStyle = 'rgba(199, 125, 255, 0.35)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        }
      }

      // Lower Lashes: 14 delicate, fine lower lashes
      const numLowerLashes = 14;
      for (let ll = 0; ll < numLowerLashes; ll++) {
        const lt = ll / (numLowerLashes - 1);
        const llx = -aw * 0.38 + lt * (aw * 0.76);
        const lnormX = (lt - 0.5) * 2;
        const lArchY = ah * 0.45 * Math.sqrt(Math.max(0, 1 - lnormX * lnormX));
        const lly = blinkPhase > 0.005 ? (lArchY - blinkPhase * (ah * 0.20)) : lArchY;
        const lLen = (r * 0.16) * Math.max(0.35, 1 - Math.abs(lt - 0.5) * 0.75);
        const lAng = Math.PI * 0.5 + (lt - 0.5) * 0.70;

        const lMidX = llx + Math.cos(lAng) * (lLen * 0.45);
        const lMidY = lly + Math.sin(lAng) * (lLen * 0.45);
        const lTipX = llx + Math.cos(lAng + (lt - 0.5) * 0.2) * lLen;
        const lTipY = lly + Math.sin(lAng + (lt - 0.5) * 0.2) * lLen;

        ctx.strokeStyle = 'rgba(12, 2, 22, 0.65)';
        ctx.lineWidth = Math.max(0.45, r * 0.012);
        ctx.beginPath();
        ctx.moveTo(llx, lly);
        ctx.quadraticCurveTo(lMidX, lMidY, lTipX, lTipY);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore(); // end eye translate
    }
