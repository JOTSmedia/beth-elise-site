    function drawOrganicEye(ctx, cx, cy, r, gazeX, gazeY, blinkPhase, pupilRadius, colors, now, isLocked = false) {
      // 3C optimizations: Cache static gradients
      if (!ctx._eyeCache || ctx._eyeCache.r !== r) {
        ctx._eyeCache = { r: r };
        const aw = r * 1.58;
        const ah = r * 0.96;
        
        const scleraGrad = ctx.createRadialGradient(-r * 0.15, -r * 0.15, 2, 0, 0, r);
        scleraGrad.addColorStop(0, '#FFFFFF');
        scleraGrad.addColorStop(0.55, '#FAF6FE');
        scleraGrad.addColorStop(0.85, '#E6D9F2');
        scleraGrad.addColorStop(1, '#D1B8E8');
        ctx._eyeCache.scleraGrad = scleraGrad;

        const irisGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.48);
        irisGrad.addColorStop(0, '#9D4EDD');
        irisGrad.addColorStop(0.5, '#7B2CBF');
        irisGrad.addColorStop(1, '#3C096C');
        ctx._eyeCache.irisGrad = irisGrad;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const hc = navigator.hardwareConcurrency || 4;
        ctx._eyeCache.fibers = (dpr >= 3 || hc <= 4) ? 24 : 40;
        ctx._eyeCache.lashes = (dpr >= 3 || hc <= 4) ? 12 : 18;
      }
      
      const cache = ctx._eyeCache;
      const aw = r * 1.58;
      const ah = r * 0.96;

      ctx.save();
      ctx.translate(cx, cy);
      
      // 1. Asymmetric Natural Almond Eye Outline Clip
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-aw * 0.50, 0);
      ctx.bezierCurveTo(-aw * 0.32, -ah * 0.60, aw * 0.16, -ah * 0.54, aw * 0.50, -ah * 0.04);
      ctx.bezierCurveTo(aw * 0.22, ah * 0.52, -aw * 0.30, ah * 0.44, -aw * 0.50, 0);
      ctx.closePath();
      ctx.clip();

      // 2. Sclera with soft 3D Spherical Volumetric Gradients
      ctx.fillStyle = cache.scleraGrad;
      ctx.fillRect(-aw * 0.65, -ah * 0.65, aw * 1.3, ah * 1.3);

      // Subtle shadow under top eyelid
      const shadowGrad = ctx.createLinearGradient(0, -ah * 0.5, 0, 0);
      shadowGrad.addColorStop(0, 'rgba(20, 0, 40, 0.45)');
      shadowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(-aw * 0.5, -ah * 0.5, aw, ah * 0.6);

      // 3. Translate to Iris Position
      ctx.save();
      ctx.translate(gazeX * r * 0.3, gazeY * r * 0.2);

      // Render Iris
      const irisR = r * 0.48;
      
      // Outer Bio-Luminescent Purple Iris Corona Flare
      const irisCorona = ctx.createRadialGradient(0, 0, irisR * 0.75, 0, 0, irisR * 1.35);
      irisCorona.addColorStop(0, 'rgba(224, 170, 255, 0.95)');
      irisCorona.addColorStop(0.35, 'rgba(199, 125, 255, 0.85)');
      irisCorona.addColorStop(0.70, 'rgba(157, 78, 221, 0.65)');
      irisCorona.addColorStop(0.92, 'rgba(114, 9, 183, 0.35)');
      irisCorona.addColorStop(1, 'transparent');
      ctx.fillStyle = irisCorona;
      ctx.beginPath();
      ctx.arc(0, 0, irisR * 1.35, 0, Math.PI * 2);
      ctx.fill();

      if (typeof imgPhotorealisticIris !== 'undefined' && imgPhotorealisticIris !== null && imgPhotorealisticIris.complete && imgPhotorealisticIris.naturalWidth > 0) {
        ctx.save();
        // REMOVED nested clip to fix Safari rendering dropout
        ctx.drawImage(imgPhotorealisticIris, -irisR * 1.15, -irisR * 1.15, irisR * 2.3, irisR * 2.3);

        const irisGlowGrad = ctx.createRadialGradient(0, 0, irisR * 0.1, 0, 0, irisR);
        irisGlowGrad.addColorStop(0, 'rgba(224, 170, 255, 0.60)');
        irisGlowGrad.addColorStop(0.35, 'rgba(199, 125, 255, 0.45)');
        irisGlowGrad.addColorStop(0.70, 'rgba(157, 78, 221, 0.40)');
        irisGlowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = irisGlowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, irisR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const fallbackGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, irisR);
        fallbackGrad.addColorStop(0, '#06000e');
        fallbackGrad.addColorStop(0.18, '#1e0038');
        fallbackGrad.addColorStop(0.42, '#480ca8');
        fallbackGrad.addColorStop(0.68, '#6a0dad');
        fallbackGrad.addColorStop(0.86, '#8b2fc9');
        fallbackGrad.addColorStop(0.95, '#560bad');
        fallbackGrad.addColorStop(1, '#0e001c');
        ctx.fillStyle = fallbackGrad;
        ctx.beginPath();
        ctx.arc(0, 0, irisR, 0, Math.PI * 2);
        ctx.fill();
      }
