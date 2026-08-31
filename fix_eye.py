import re

with open('js/main.js', 'r') as f:
    js = f.read()

# We need to replace the iris rendering in drawOrganicEye
# from: // Render Iris ... to: // Render Eyelashes

replacement = """      // Render Iris
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

      // Procedural Iris Fibers (optimized)"""

js = re.sub(r'      // Render Iris.*?(?=      // Procedural Iris Fibers \(optimized\))', replacement, js, flags=re.DOTALL)

with open('js/main.js', 'w') as f:
    f.write(js)

