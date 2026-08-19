// ============================================================================
// BETH ELISE — PSYCHIC MEDIUM
// AAA Grade Animation Engine: Tinkerbell & Firefly Pixies with Pixie Dust Trails
// 60FPS HTML5 Canvas + High-Frequency Meteors, Auroras, Firefly Swarms & Interactive Parallax
// ============================================================================

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // ─── ENCHANTED PRELOADER DISMISSAL ───────────────
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
      const dismissPreloader = () => {
        setTimeout(() => {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 800);
        }, 2200); // Extended for easy, comfortable reading
      };

      if (document.readyState === 'complete') {
        dismissPreloader();
      } else {
        window.addEventListener('load', dismissPreloader);
        // Fallback safety timeout
        setTimeout(dismissPreloader, 3200);
      }
    }

    // ─── NAVIGATION ──────────────────────────────────
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile');

    window.addEventListener('scroll', () => {
      nav?.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    hamburger?.addEventListener('click', () => {
      const open = hamburger.classList.toggle('active');
      mobileMenu?.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.nav__mobile a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // ═══════════════════════════════════════════════
    // HERO 60FPS TINKERBELL & FIREFLY PIXIE ENGINE
    // ═══════════════════════════════════════════════
    const heroCanvas = document.getElementById('hero-celestial-canvas');
    if (heroCanvas) {
      const ctx = heroCanvas.getContext('2d');
      let w, h;
      const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 };
      const pixies = [];
      const meteors = [];
      const embers = [];
      const pixieDust = [];
      let lastMeteorTime = performance.now();
      let lastBolideTime = performance.now();

      function resize() {
        w = heroCanvas.width = heroCanvas.offsetWidth || window.innerWidth;
        h = heroCanvas.height = heroCanvas.offsetHeight || window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      // Track mouse coordinates for pixie attraction & stardust
      window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - mouse.lastX;
        const dy = e.clientY - mouse.lastY;
        mouse.vx = dx * 0.3 + mouse.vx * 0.7;
        mouse.vy = dy * 0.3 + mouse.vy * 0.7;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.lastX = e.clientX;
        mouse.lastY = e.clientY;

        // Emit instant pixie dust sparkles on mouse move
        if (Math.random() > 0.35) {
          emitPixieDust(e.clientX, e.clientY, 3, ['#FFD700', '#00FFC8', '#00E5D4', '#FFF']);
        }
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
      });

      // ─── 1. TINKERBELL & FIREFLY PIXIE PALETTES ───────
      const pixiePalettes = [
        // 0: Classic Golden Tinkerbell (Golden Core, Glowing Starlight & Aqua Dust)
        { core: '#FFFFFF', firefly: '#FFD700', aura: 'rgba(255, 215, 0, 0.95)', wing: 'rgba(255, 245, 180, 0.9)', dust: '#FFD700' },
        // 1: Aquamarine Glade Pixie (Electric Aqua & Emerald Firefly)
        { core: '#FFFFFF', firefly: '#00FFC8', aura: 'rgba(0, 255, 200, 0.95)', wing: 'rgba(122, 255, 227, 0.9)', dust: '#00FFC8' },
        // 2: Tiffany Starlight Pixie (Neon Tiffany & Cyan Glow)
        { core: '#FFFFFF', firefly: '#00E5D4', aura: 'rgba(0, 229, 212, 0.95)', wing: 'rgba(163, 255, 248, 0.9)', dust: '#38FFF0' },
        // 3: Violet-Rose Starlight Pixie (Royal Lavender & Soft Violet Firefly)
        { core: '#FFFFFF', firefly: '#C77DFF', aura: 'rgba(199, 125, 255, 0.95)', wing: 'rgba(224, 170, 255, 0.9)', dust: '#E0AAFF' }
      ];

      // Spawn 24 Active Tinkerbell & Firefly Pixies
      for (let i = 0; i < 24; i++) {
        const pal = pixiePalettes[i % pixiePalettes.length];
        pixies.push({
          x: Math.random() * (w || window.innerWidth),
          y: Math.random() * ((h || window.innerHeight) * 0.85),
          z: 0.5 + Math.random() * 0.8,
          vx: (Math.random() - 0.5) * 3.2,
          vy: (Math.random() - 0.5) * 2.5,
          targetX: Math.random() * (w || window.innerWidth),
          targetY: Math.random() * ((h || window.innerHeight) * 0.8),
          hoverTimer: Math.random() * 40,
          changeTimer: Math.random() * 80,
          wingPhase: Math.random() * Math.PI * 2,
          wingSpeed: 0.55 + Math.random() * 0.35, // High-frequency hummingbird flutter
          fireflyPulse: Math.random() * Math.PI * 2,
          fireflySpeed: 0.05 + Math.random() * 0.05,
          size: 10 + Math.random() * 12,
          palette: pal,
          trail: []
        });
      }

      // ─── 2. BIOLUMINESCENT RISING EMBERS ──────────────
      for (let i = 0; i < 65; i++) {
        embers.push({
          x: Math.random() * (w || window.innerWidth),
          y: Math.random() * (h || window.innerHeight),
          radius: 0.8 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.65,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          phase: Math.random() * Math.PI * 2,
          vy: -(0.25 + Math.random() * 0.55),
          vx: (Math.random() - 0.5) * 0.3,
          color: ['#FFD700', '#00FFC8', '#00E5D4', '#C77DFF', '#FFFDF5'][Math.floor(Math.random() * 5)]
        });
      }

      function emitPixieDust(x, y, count = 2, colors = ['#FFD700', '#00FFC8', '#FFF']) {
        for (let i = 0; i < count; i++) {
          pixieDust.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.6,
            vy: (Math.random() - 0.5) * 1.4 + 0.4,
            life: 1.0,
            decay: 0.025 + Math.random() * 0.035,
            size: 1.5 + Math.random() * 3.5,
            isDiamond: Math.random() > 0.4,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }

      function triggerMeteor(isBolide = false) {
        const startX = Math.random() * (w * 0.9);
        const startY = Math.random() * (h * 0.35);
        const angle = (24 + Math.random() * 32) * Math.PI / 180;
        const speed = isBolide ? (18 + Math.random() * 10) : (24 + Math.random() * 16);

        meteors.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: isBolide ? (260 + Math.random() * 220) : (180 + Math.random() * 180),
          life: 1.0,
          decay: isBolide ? 0.015 : 0.024,
          isBolide: isBolide,
          color: isBolide ? '#FFD700' : ['#00FFC8', '#00E5D4', '#FFFFFF', '#38FFF0'][Math.floor(Math.random() * 4)]
        });
      }

      // ─── 3. 60FPS RENDERING LOOP ───────────────────────
      function render(now) {
        ctx.clearRect(0, 0, w, h);

        // A. Dynamic Glowing Aurora Waves in the Night Sky
        ctx.save();
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.moveTo(0, h * 0.25);
          for (let x = 0; x <= w; x += 30) {
            const y = h * (0.12 + j * 0.07) +
                      Math.sin(x * 0.003 + now * 0.0012 + j) * 45 +
                      Math.sin(x * 0.007 - now * 0.0008) * 25;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, 0);
          ctx.lineTo(0, 0);
          ctx.closePath();

          const auroraGrad = ctx.createLinearGradient(0, 0, w, h * 0.4);
          if (j === 0) {
            auroraGrad.addColorStop(0, 'rgba(0, 229, 212, 0.12)');
            auroraGrad.addColorStop(0.5, 'rgba(0, 255, 200, 0.18)');
            auroraGrad.addColorStop(1, 'transparent');
          } else if (j === 1) {
            auroraGrad.addColorStop(0, 'rgba(157, 78, 221, 0.14)');
            auroraGrad.addColorStop(0.6, 'rgba(0, 229, 212, 0.12)');
            auroraGrad.addColorStop(1, 'transparent');
          } else {
            auroraGrad.addColorStop(0, 'rgba(0, 255, 200, 0.15)');
            auroraGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.08)');
            auroraGrad.addColorStop(1, 'transparent');
          }
          ctx.fillStyle = auroraGrad;
          ctx.fill();
        }
        ctx.restore();

        // B. High-Frequency Meteors (Trigger every 700ms - 1.4s)
        if (now - lastMeteorTime > 750 + Math.random() * 650) {
          triggerMeteor(false);
          if (Math.random() > 0.45) {
            setTimeout(() => triggerMeteor(false), 200 + Math.random() * 300);
          }
          lastMeteorTime = now;
        }

        // Fiery Bolides every 4.5s
        if (now - lastBolideTime > 4500 + Math.random() * 2500) {
          triggerMeteor(true);
          lastBolideTime = now;
        }

        // Render Meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;
          m.life -= m.decay;

          if (m.life <= 0 || m.x > w + 120 || m.y > h + 120) {
            meteors.splice(i, 1);
            continue;
          }

          const tailX = m.x - (m.vx / 20) * m.length;
          const tailY = m.y - (m.vy / 20) * m.length;

          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.2, m.color);
          grad.addColorStop(0.7, m.isBolide ? 'rgba(255, 69, 0, 0.6)' : 'rgba(0, 229, 212, 0.4)');
          grad.addColorStop(1, 'transparent');

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = (m.isBolide ? 4.5 : 2.8) * m.life;
          ctx.shadowColor = m.color;
          ctx.shadowBlur = m.isBolide ? 24 : 16;
          ctx.globalAlpha = m.life;
          ctx.stroke();

          // Core Head
          ctx.beginPath();
          ctx.arc(m.x, m.y, (m.isBolide ? 4.0 : 2.8) * m.life, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.restore();

          if (Math.random() > 0.3) {
            emitPixieDust(m.x, m.y, 1, [m.color, '#FFF']);
          }
        }

        // C. Render Sparkling Pixie Dust Particles
        for (let i = pixieDust.length - 1; i >= 0; i--) {
          const p = pixieDust[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;

          if (p.life <= 0) {
            pixieDust.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = p.life * 0.95;

          if (p.isDiamond) {
            // 4-Point Diamond Sparkle Star
            const s = p.size * p.life;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - s * 1.6);
            ctx.lineTo(p.x + s * 0.6, p.y);
            ctx.lineTo(p.x, p.y + s * 1.6);
            ctx.lineTo(p.x - s * 0.6, p.y);
            ctx.closePath();
            ctx.fill();
          } else {
            // Round Glitter Sparkle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // D. Render Rising Bioluminescent Embers
        embers.forEach(e => {
          e.x += e.vx;
          e.y += e.vy;
          e.phase += e.twinkleSpeed;

          if (e.y < -20) e.y = h + 20;
          if (e.x < -20) e.x = w + 20;
          if (e.x > w + 20) e.x = -20;

          const a = e.alpha * (0.6 + Math.sin(e.phase) * 0.4);

          ctx.save();
          const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius * 3.5);
          g.addColorStop(0, e.color);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // E. Render Tinkerbell & Firefly Pixies (Luminous Orbs with Pointed Gossamer Wings & Pixie Dust)
        pixies.forEach(p => {
          p.changeTimer--;
          if (p.changeTimer <= 0) {
            p.targetX = Math.random() * w;
            p.targetY = Math.random() * (h * 0.8);
            p.changeTimer = 60 + Math.random() * 110;
            // Occasional quick hover-flutter pause like a hummingbird
            if (Math.random() > 0.6) p.hoverTimer = 25 + Math.random() * 30;
          }

          if (p.hoverTimer > 0) {
            p.hoverTimer--;
            p.vx *= 0.88;
            p.vy *= 0.88;
          } else {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const speed = (3.0 + Math.sin(now * 0.003 + p.wingPhase) * 1.2) * p.z;

            p.vx += (dx / dist) * 0.14;
            p.vy += (dy / dist) * 0.14;

            // Interactive cursor attraction
            if (mouse.x > 0) {
              const mdx = mouse.x - p.x;
              const mdy = mouse.y - p.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < 220) {
                const angle = Math.atan2(mdy, mdx) + Math.PI * 0.45;
                p.vx += Math.cos(angle) * 0.65;
                p.vy += Math.sin(angle) * 0.65;
              }
            }

            p.vx = Math.max(-speed * 1.4, Math.min(speed * 1.4, p.vx * 0.98));
            p.vy = Math.max(-speed * 1.4, Math.min(speed * 1.4, p.vy * 0.98));
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -60) p.x = w + 40;
          if (p.x > w + 60) p.x = -40;
          if (p.y < -60) p.y = h * 0.8;
          if (p.y > h * 0.85) p.y = -20;

          // High-frequency wing flutter & firefly breathing glow
          p.wingPhase += p.wingSpeed;
          p.fireflyPulse += p.fireflySpeed;
          const wingFlap = Math.sin(p.wingPhase);
          const heading = Math.atan2(p.vy, p.vx);

          // Continuous sparkling pixie dust trail
          if (Math.random() > 0.35) {
            emitPixieDust(p.x, p.y, 1, [p.palette.dust, '#FFFFFF', '#FFF4CC']);
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(p.z, p.z);
          ctx.rotate(heading * 0.3);

          // 1. Firefly Luminous Volumetric Halo (Breathing Sphere)
          const pulse = 1 + Math.sin(p.fireflyPulse) * 0.3;
          const haloRadius = p.size * 2.8 * pulse;
          const auraGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, haloRadius);
          auraGrad.addColorStop(0, p.palette.aura);
          auraGrad.addColorStop(0.35, p.palette.aura.replace(/[\d\.]+\)$/, '0.35)'));
          auraGrad.addColorStop(0.7, p.palette.aura.replace(/[\d\.]+\)$/, '0.1)'));
          auraGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
          ctx.fill();

          // 2. Tinkerbell Tapered Pointed Gossamer Wings
          const ws = p.size * 2.2; // Long elegant pixie wings
          ctx.fillStyle = p.palette.wing;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.88;

          // Upper Left Wing (Tapered pointed fairy wing)
          ctx.save();
          ctx.scale(wingFlap, 1);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-ws * 0.4, -p.size * 0.9, -ws * 0.95, -p.size * 1.1, -ws * 0.9, -p.size * 0.4);
          ctx.bezierCurveTo(-ws * 0.8, -p.size * 0.1, -ws * 0.3, p.size * 0.2, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Lower Left Wing
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-ws * 0.3, p.size * 0.2, -ws * 0.65, p.size * 0.8, -ws * 0.55, p.size * 1.0);
          ctx.bezierCurveTo(-ws * 0.4, p.size * 0.9, -ws * 0.15, p.size * 0.4, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Upper Right Wing (Tapered pointed fairy wing)
          ctx.save();
          ctx.scale(-wingFlap, 1);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-ws * 0.4, -p.size * 0.9, -ws * 0.95, -p.size * 1.1, -ws * 0.9, -p.size * 0.4);
          ctx.bezierCurveTo(-ws * 0.8, -p.size * 0.1, -ws * 0.3, p.size * 0.2, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Lower Right Wing
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-ws * 0.3, p.size * 0.2, -ws * 0.65, p.size * 0.8, -ws * 0.55, p.size * 1.0);
          ctx.bezierCurveTo(-ws * 0.4, p.size * 0.9, -ws * 0.15, p.size * 0.4, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // 3. Glowing Firefly Light Core & Tinkerbell Silhouette
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.3, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.palette.firefly;
          ctx.shadowColor = p.palette.firefly;
          ctx.shadowBlur = 18;
          ctx.fill();

          // Brilliant White-Gold Diamond Heart
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 12;
          ctx.fill();

          // Little Tinkerbell Topknot Light
          ctx.beginPath();
          ctx.arc(0, -p.size * 0.55, p.size * 0.16, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          ctx.restore();
        });

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    }

    // ═══════════════════════════════════════════════
    // FOOTER 60FPS CELESTIAL CANVAS ENGINE
    // ═══════════════════════════════════════════════
    const footerCanvas = document.getElementById('footer-celestial-canvas');
    if (footerCanvas) {
      const fCtx = footerCanvas.getContext('2d');
      let fw, fh;
      const fPixies = [];
      const fMeteors = [];
      const fEmbers = [];
      const fDust = [];
      let lastFMeteor = performance.now();

      function fResize() {
        fw = footerCanvas.width = footerCanvas.offsetWidth || window.innerWidth;
        fh = footerCanvas.height = footerCanvas.offsetHeight || 300;
      }
      fResize();
      window.addEventListener('resize', fResize, { passive: true });

      const fPalettes = [
        { core: '#FFFFFF', firefly: '#FFD700', aura: 'rgba(255, 215, 0, 0.95)', wing: 'rgba(255, 245, 180, 0.9)', dust: '#FFD700' },
        { core: '#FFFFFF', firefly: '#00FFC8', aura: 'rgba(0, 255, 200, 0.95)', wing: 'rgba(122, 255, 227, 0.9)', dust: '#00FFC8' },
        { core: '#FFFFFF', firefly: '#00E5D4', aura: 'rgba(0, 229, 212, 0.95)', wing: 'rgba(163, 255, 248, 0.9)', dust: '#38FFF0' },
        { core: '#FFFFFF', firefly: '#C77DFF', aura: 'rgba(199, 125, 255, 0.95)', wing: 'rgba(224, 170, 255, 0.9)', dust: '#E0AAFF' }
      ];

      for (let i = 0; i < 14; i++) {
        fPixies.push({
          x: Math.random() * (fw || window.innerWidth),
          y: Math.random() * (fh || 300),
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 1.8,
          targetX: Math.random() * (fw || window.innerWidth),
          targetY: Math.random() * (fh || 300),
          wingPhase: Math.random() * Math.PI * 2,
          wingSpeed: 0.6 + Math.random() * 0.3,
          fireflyPulse: Math.random() * Math.PI * 2,
          size: 8 + Math.random() * 8,
          palette: fPalettes[i % fPalettes.length],
          trail: []
        });
      }

      for (let i = 0; i < 40; i++) {
        fEmbers.push({
          x: Math.random() * (fw || window.innerWidth),
          y: Math.random() * (fh || 300),
          radius: 0.8 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          vy: -(0.2 + Math.random() * 0.4),
          vx: (Math.random() - 0.5) * 0.2,
          color: ['#FFD700', '#00FFC8', '#00E5D4', '#C77DFF'][Math.floor(Math.random() * 4)]
        });
      }

      function spawnFMeteor() {
        fMeteors.push({
          x: Math.random() * (fw * 1.2),
          y: -20,
          length: 80 + Math.random() * 120,
          speed: 12 + Math.random() * 16,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
          color: ['#00FFC8', '#FFD700', '#C77DFF', '#FFFFFF'][Math.floor(Math.random() * 4)],
          alpha: 1.0
        });
      }

      function renderFooter(now) {
        if (!fCtx) return;
        fCtx.clearRect(0, 0, fw, fh);

        // Meteors
        if (now - lastFMeteor > 1400) {
          spawnFMeteor();
          lastFMeteor = now;
        }

        fCtx.globalCompositeOperation = 'lighter';
        for (let i = fMeteors.length - 1; i >= 0; i--) {
          const m = fMeteors[i];
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.alpha -= 0.022;

          if (m.alpha <= 0 || m.y > fh + 100) {
            fMeteors.splice(i, 1);
            continue;
          }

          const tx = m.x - Math.cos(m.angle) * m.length;
          const ty = m.y - Math.sin(m.angle) * m.length;
          const grad = fCtx.createLinearGradient(m.x, m.y, tx, ty);
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.3, m.color);
          grad.addColorStop(1, 'transparent');

          fCtx.beginPath();
          fCtx.moveTo(m.x, m.y);
          fCtx.lineTo(tx, ty);
          fCtx.strokeStyle = grad;
          fCtx.lineWidth = 2;
          fCtx.stroke();
        }

        // Embers
        fEmbers.forEach(em => {
          em.y += em.vy;
          em.x += em.vx;
          em.phase += 0.03;
          if (em.y < -10) em.y = fh + 10;
          if (em.x < 0) em.x = fw;
          if (em.x > fw) em.x = 0;

          const a = 0.3 + 0.5 * Math.sin(em.phase);
          fCtx.beginPath();
          fCtx.arc(em.x, em.y, em.radius, 0, Math.PI * 2);
          fCtx.fillStyle = em.color;
          fCtx.globalAlpha = a;
          fCtx.fill();
        });
        fCtx.globalAlpha = 1.0;

        // Pixies
        fPixies.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.wingPhase += p.wingSpeed;
          p.fireflyPulse += 0.06;

          if (p.x < 20 || p.x > fw - 20) p.vx *= -1;
          if (p.y < 20 || p.y > fh - 20) p.vy *= -1;

          fCtx.save();
          fCtx.translate(p.x, p.y);

          // Aura
          const auraGrad = fCtx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
          auraGrad.addColorStop(0, p.palette.aura);
          auraGrad.addColorStop(0.5, p.palette.firefly);
          auraGrad.addColorStop(1, 'transparent');
          fCtx.beginPath();
          fCtx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          fCtx.fillStyle = auraGrad;
          fCtx.fill();

          // Wings
          const wingSpan = Math.abs(Math.sin(p.wingPhase)) * p.size * 1.8;
          fCtx.beginPath();
          fCtx.ellipse(-p.size * 0.4, -p.size * 0.2, wingSpan, p.size * 0.5, -0.4, 0, Math.PI * 2);
          fCtx.ellipse(p.size * 0.4, -p.size * 0.2, wingSpan, p.size * 0.5, 0.4, 0, Math.PI * 2);
          fCtx.fillStyle = p.palette.wing;
          fCtx.fill();

          // Core
          fCtx.beginPath();
          fCtx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          fCtx.fillStyle = '#FFFFFF';
          fCtx.fill();

          fCtx.restore();
        });

        fCtx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(renderFooter);
      }

      requestAnimationFrame(renderFooter);
    }

    // ─── SPARKLE CURSOR TRAIL ────────────────────────
    const sparkleColors = ['#FFD700', '#00FFC8', '#00E5D4', '#38FFF0', '#C77DFF'];
    let lastSparkle = 0;

    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSparkle < 30) return;
      lastSparkle = now;

      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      const size = 5 + Math.random() * 9;
      const sx   = (Math.random() - 0.5) * 45;
      const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

      sparkle.style.cssText = `
        left: ${e.clientX + (Math.random() - 0.5) * 18}px;
        top:  ${e.clientY + (Math.random() - 0.5) * 18}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        color: ${color};
        --sx: ${sx}px;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1200);
    });

    // ─── HOLLYWOOD-GRADE 3D TILT & SPECULAR GLARE ENGINE ─────────
    const tiltCards = document.querySelectorAll('.service-card, .merch-card, .testimonial-card, .notes-step, .pricing-card, .about__image-frame');
    tiltCards.forEach(card => {
      let bounds;
      function rotateToMouse(e) {
        bounds = card.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
          x: leftX - bounds.width / 2,
          y: topY - bounds.height / 2
        };
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
        
        card.style.transform = `
          perspective(1000px)
          scale3d(1.025, 1.025, 1.025)
          rotateX(${-center.y / 14}deg)
          rotateY(${center.x / 14}deg)
        `;
        
        let glare = card.querySelector('.card-specular-glare');
        if (!glare) {
          glare = document.createElement('div');
          glare.className = 'card-specular-glare';
          glare.style.cssText = 'position:absolute; inset:0; border-radius:inherit; pointer-events:none; z-index:5; opacity:0; transition:opacity 0.2s ease;';
          card.style.position = 'relative';
          card.appendChild(glare);
        }
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${(leftX / bounds.width) * 100}% ${(topY / bounds.height) * 100}%, rgba(255, 255, 255, 0.22) 0%, rgba(0, 229, 212, 0.12) 30%, transparent 65%)`;
      }

      function removeListener() {
        card.style.transform = '';
        const glare = card.querySelector('.card-specular-glare');
        if (glare) glare.style.opacity = '0';
      }

      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.1s ease-out';
      });
      card.addEventListener('mousemove', rotateToMouse);
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)';
        removeListener();
      });
    });

    // ─── MAGNETIC CTA BUTTONS ─────────────────────────
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-inquire, .cart-toggle-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      });
      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease-out';
      });
    });

    // ─── INTERSECTION OBSERVER (Fade-in animations) ───
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));

    // ─── PRODUCT OPTIONS (SIZE PILLS & COLOR DOTS) ───
    document.querySelectorAll('.size-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const parent = pill.closest('.option-group');
        parent?.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const parent = dot.closest('.option-group');
        parent?.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });

    // ─── TESTIMONIAL MODAL & 5-STAR PICKER ──────────
    const testModal = document.getElementById('testimonial-modal');
    const openTestModalBtn = document.getElementById('open-testimonial-modal-btn');
    const closeTestModalBtn = document.getElementById('close-testimonial-modal-btn');
    const testForm = document.getElementById('submit-testimonial-form');
    const starPicker = document.getElementById('star-picker');
    let selectedStars = 5;

    openTestModalBtn?.addEventListener('click', () => {
      testModal?.classList.add('active');
    });

    closeTestModalBtn?.addEventListener('click', () => {
      testModal?.classList.remove('active');
    });

    testModal?.addEventListener('click', (e) => {
      if (e.target === testModal) testModal.classList.remove('active');
    });

    // Star Picker Interaction
    starPicker?.querySelectorAll('.star-pick').forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-val'), 10);
        selectedStars = val;
        starPicker.querySelectorAll('.star-pick').forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val'), 10);
          s.classList.toggle('active', sVal <= val);
        });
      });
    });

    // Submit Testimonial Handler
    testForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('review-name')?.value?.trim();
      const service = document.getElementById('review-service')?.value;
      const text = document.getElementById('review-text')?.value?.trim();
      const googleLink = document.getElementById('review-google-link')?.value?.trim();

      if (!name || !service || !text) {
        showToast('✨ Please fill in all required review fields.');
        return;
      }

      const submitBtn = testForm.querySelector('.form__submit');
      if (submitBtn) { submitBtn.textContent = '✨ Saving Your Sacred Story...'; submitBtn.disabled = true; }

      setTimeout(() => {
        testModal?.classList.remove('active');
        showToast('🌟 Thank you! Your testimonial has been received and blessed.');
        testForm.reset();
        if (submitBtn) { submitBtn.textContent = '✨ Submit Testimonial'; submitBtn.disabled = false; }
      }, 900);
    });

    // ─── FILTER BUTTONS (Pages/Testimonials & Pages/Merch) ───
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.merch-filters');
        parent?.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const grid = document.querySelector('.merch-page-grid, .testimonials-page-grid');
        if (!grid) return;

        grid.querySelectorAll('.merch-page-card, .testimonial-page-card').forEach(card => {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            const cat = card.getAttribute('data-category') || '';
            card.style.display = cat.includes(filter) ? '' : 'none';
          }
        });
      });
    });

    // ─── CELESTIAL WEB AUDIO ENGINE (528Hz & Stardust Chimes) ────
    class CelestialAudioEngine {
      constructor() {
        this.ctx = null;
        this.enabled = false;
      }
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      playChime(freq = 528, type = 'sine', duration = 2.2) {
        if (!this.enabled) return;
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
      }
      playGlissando() {
        if (!this.enabled) return;
        [528, 639, 741, 852, 963].forEach((f, idx) => {
          setTimeout(() => this.playChime(f, 'sine', 1.8), idx * 90);
        });
      }
    }

    window.celestialAudio = new CelestialAudioEngine();

    const audioToggleBtns = document.querySelectorAll('.audio-toggle-btn');
    audioToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.celestialAudio.enabled = !window.celestialAudio.enabled;
        audioToggleBtns.forEach(b => {
          b.innerHTML = window.celestialAudio.enabled ? '<span>🔔</span> Chimes Active' : '<span>🔕</span> Sound';
          b.style.borderColor = window.celestialAudio.enabled ? '#00E5D4' : 'var(--gold)';
        });
        if (window.celestialAudio.enabled) {
          window.celestialAudio.playGlissando();
          showToast('🔔 Ethereal 528Hz Chimes Activated');
        } else {
          showToast('🔕 Sound Muted');
        }
      });
    });

    // ─── INTERACTIVE AURA ENERGY FREQUENCY SCANNER ────
    const chakraData = {
      crown: {
        title: 'Crown Chakra (963 Hz) · Pure Divine Light',
        color: '#C77DFF',
        glow: 'rgba(199, 125, 255, 0.4)',
        freq: 963,
        desc: 'Your crown center is opening to higher spiritual downloads and divine connection. Beth senses profound trust in the unseen unfolding for you.'
      },
      thirdeye: {
        title: 'Third Eye Chakra (852 Hz) · Intuitive Wisdom',
        color: '#7B2CBF',
        glow: 'rgba(123, 44, 191, 0.4)',
        freq: 852,
        desc: 'Spiritual clairvoyance and inner knowing are peaking. Pay close attention to your dreams, recurring numbers, and gut instincts today.'
      },
      throat: {
        title: 'Throat Chakra (741 Hz) · Authentic Expression',
        color: '#00E5D4',
        glow: 'rgba(0, 229, 212, 0.4)',
        freq: 741,
        desc: 'Time to speak your sacred truth with courage and grace. Releasing unspoken feelings will instantly dissolve physical throat constriction.'
      },
      heart: {
        title: 'Heart Chakra (639 Hz) · Compassionate Sanctuary',
        color: '#00FFC8',
        glow: 'rgba(0, 255, 200, 0.4)',
        freq: 639,
        desc: 'Unconditional love, forgiveness, and emotional renewal are pouring in. Soften your energetic armor and allow yourself to be nurtured.'
      },
      solar: {
        title: 'Solar Plexus (528 Hz) · Miracles & Sovereign Will',
        color: '#FFD700',
        glow: 'rgba(255, 215, 0, 0.4)',
        freq: 528,
        desc: 'The golden frequency of cellular transformation. Stand sovereign in your power and manifest with unwavering clarity.'
      },
      sacral: {
        title: 'Sacral Chakra (417 Hz) · Creative Flow & Passion',
        color: '#FFA500',
        glow: 'rgba(255, 165, 0, 0.4)',
        freq: 417,
        desc: 'Releasing past emotional stagnation. Embrace joyful play, artistic expression, and the sensuous beauty of everyday life.'
      },
      root: {
        title: 'Root Chakra (396 Hz) · Grounded Earth Sanctuary',
        color: '#FF4D4D',
        glow: 'rgba(255, 77, 77, 0.4)',
        freq: 396,
        desc: 'Releasing fear and survival anxiety. You are anchored deeply into Mother Earth, completely protected and safe.'
      }
    };

    const chakraBtns = document.querySelectorAll('.chakra-btn');
    const auraBox = document.querySelector('.aura-radiance-box');
    const auraTitle = document.getElementById('aura-res-title');
    const auraDesc = document.getElementById('aura-res-desc');

    chakraBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        chakraBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-chakra');
        const data = chakraData[key];
        if (data && auraBox && auraTitle && auraDesc) {
          auraBox.style.borderColor = data.color;
          auraBox.style.boxShadow = `0 20px 60px rgba(0,0,0,0.8), 0 0 50px ${data.glow}`;
          auraTitle.textContent = data.title;
          auraTitle.style.color = data.color;
          auraDesc.textContent = data.desc;
          window.celestialAudio.playChime(data.freq, 'sine', 2.5);
          showToast(`✨ Tuned to ${data.title}`);
        }
      });
    });

    // ─── SHOPPING CART SYSTEM ─────────────────────────
    window.cartState = JSON.parse(localStorage.getItem('beth_elise_cart') || '[]');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-drawer-items');
    const cartBadgeEls = document.querySelectorAll('.cart-badge');
    const cartSubtotalEl = document.getElementById('cart-subtotal-val');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

    function updateCartUI() {
      const totalCount = window.cartState.reduce((sum, item) => sum + item.qty, 0);
      cartBadgeEls.forEach(b => b.textContent = totalCount);

      if (cartItemsContainer) {
        if (window.cartState.length === 0) {
          cartItemsContainer.innerHTML = `
            <div style="text-align:center; padding:3rem 1rem; color:var(--tiffany-pale);">
              <div style="font-size:3rem; margin-bottom:1rem;">🛍️</div>
              <p style="font-size:1.1rem; font-weight:700; color:#FFFFFF; margin-bottom:0.5rem;">Your Sacred Bag is Empty</p>
              <p style="font-size:0.88rem;">Explore our high-vibe collection to add crystals, apparel, and soul notes.</p>
            </div>
          `;
          if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
        } else {
          let subtotal = 0;
          cartItemsContainer.innerHTML = window.cartState.map((item, index) => {
            subtotal += item.price * item.qty;
            return `
              <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item__info">
                  <div class="cart-item__name">${item.name}</div>
                  <div class="cart-item__variant">${item.variant || ''}</div>
                  <div class="cart-item__price">$${item.price.toFixed(2)} × ${item.qty}</div>
                </div>
                <button type="button" class="cart-item__remove" onclick="window.removeCartItem(${index})" aria-label="Remove item">×</button>
              </div>
            `;
          }).join('');
          if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
      }
      localStorage.setItem('beth_elise_cart', JSON.stringify(window.cartState));
    }

    window.addToSacredCart = function(name, price, img, variant = '') {
      const existing = window.cartState.find(item => item.name === name && item.variant === variant);
      if (existing) {
        existing.qty++;
      } else {
        window.cartState.push({ name, price: parseFloat(price), img, variant, qty: 1 });
      }
      updateCartUI();
      cartDrawer?.classList.add('active');
      cartOverlay?.classList.add('active');
      showToast(`✨ Added ${name} to your Sacred Cart!`);
    };

    window.removeCartItem = function(index) {
      window.cartState.splice(index, 1);
      updateCartUI();
    };

    cartToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cartDrawer?.classList.add('active');
        cartOverlay?.classList.add('active');
      });
    });

    cartCloseBtn?.addEventListener('click', () => {
      cartDrawer?.classList.remove('active');
      cartOverlay?.classList.remove('active');
    });

    cartOverlay?.addEventListener('click', () => {
      cartDrawer?.classList.remove('active');
      cartOverlay?.classList.remove('active');
    });

    cartCheckoutBtn?.addEventListener('click', () => {
      if (window.cartState.length === 0) {
        showToast('🛍️ Your sacred cart is empty.');
        return;
      }
      showToast('🌟 Proceeding to Secure Sacred Checkout...');
      setTimeout(() => {
        alert('✨ Sacred Order Placed! Thank you for ordering from Beth Elise. A confirmation has been prepared.');
        window.cartState = [];
        updateCartUI();
        cartDrawer?.classList.remove('active');
        cartOverlay?.classList.remove('active');
      }, 1200);
    });

    // Wire up all "Add to Sacred Cart" buttons
    document.querySelectorAll('.merch-card__btn, .merch-page-card__add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.merch-card, .merch-page-card');
        if (!card) return;
        const name = card.querySelector('.merch-card__name, .merch-page-card__name')?.textContent?.trim();
        const priceText = card.querySelector('.merch-card__price, .merch-page-card__price')?.textContent?.trim() || '$0';
        const price = parseFloat(priceText.replace(/[^0-9\.]+/g, '')) || 0;
        const img = card.querySelector('img')?.getAttribute('src') || 'images/merch-crystals.jpg';
        const sizeActive = card.querySelector('.size-pill.active')?.textContent?.trim();
        const variant = sizeActive ? `Size: ${sizeActive}` : '';

        window.addToSacredCart(name, price, img, variant);
      });
    });

    updateCartUI();

    // ─── INTERACTIVE ORACLE CARD PULL WIDGET ──────────
    const oracleCards = [
      { icon: '🌙', title: 'The Sacred Glade', text: 'You are held in divine sanctuary. Surrender current worries to spirit; alignment and clarity are blossoming.' },
      { icon: '⭐', title: 'Starlight Awakening', text: 'Your intuition is sharper than ever. Trust the quiet nudges and subtle synchronicities appearing in your path.' },
      { icon: '🧚', title: 'Pixie Stardust (Joy)', text: 'Lighten your energetic field. Laughter, nature, and playful presence will dissolve heavy emotional blockages.' },
      { icon: '✋', title: 'Usui Healing Touch', text: 'Universal life force energy is recalibrating your chakras. Allow yourself to rest and receive cellular renewal.' },
      { icon: '🔮', title: 'Ancestral Confirmation', text: 'Loved ones in spirit are watching over you with unconditional love. A confirmation sign will arrive soon.' },
      { icon: '🌿', title: 'Somatic Release (EFT)', text: 'Breathe deeply. Release subconscious tension stored in your shoulders and chest. You are safe in this moment.' }
    ];

    const oracleContainer = document.getElementById('daily-oracle-card');
    let oracleFlipped = false;

    oracleContainer?.addEventListener('click', () => {
      if (!oracleFlipped) {
        const randomCard = oracleCards[Math.floor(Math.random() * oracleCards.length)];
        const iconEl = document.getElementById('oracle-res-icon');
        const titleEl = document.getElementById('oracle-res-title');
        const textEl = document.getElementById('oracle-res-text');

        if (iconEl) iconEl.textContent = randomCard.icon;
        if (titleEl) titleEl.textContent = randomCard.title;
        if (textEl) textEl.textContent = randomCard.text;

        oracleContainer.classList.add('flipped');
        oracleFlipped = true;
        showToast('✨ Daily Soul Message Channeled!');
      } else {
        oracleContainer.classList.remove('flipped');
        oracleFlipped = false;
      }
    });

    // ─── INTERACTIVE APPOINTMENT SCHEDULER (Contact Page) ───
    const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
    let selectedTimeSlot = '';

    timeSlotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeSlotBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTimeSlot = btn.textContent.trim();
      });
    });

    // ─── INQUIRY FORM ────────────────────────────────
    const inquiryForm = document.getElementById('inquiry-form');
    const formSuccess = document.querySelector('.form__success');

    inquiryForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('name')?.value?.trim();
      const email   = document.getElementById('email')?.value?.trim();
      const service = document.getElementById('service')?.value;
      const message = document.getElementById('message')?.value?.trim();

      if (!name || !email || !service || !message) {
        showToast('✨ Please fill in all required fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('💌 Please enter a valid email address.');
        return;
      }

      const btn = inquiryForm.querySelector('.form__submit');
      if (btn) { btn.textContent = '✨ Connecting with Beth Elise...'; btn.disabled = true; }

      setTimeout(() => {
        inquiryForm.style.display = 'none';
        formSuccess?.classList.add('active');
        showToast('🌟 Message sent! Beth Elise will connect within 24–48 hours.');
      }, 1000);
    });

    // ─── NEWSLETTER FORMS ────────────────────────────
    document.querySelectorAll('.newsletter__form, .footer__newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input?.value?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          showToast('💌 Please enter a valid email address.');
          return;
        }
        const btn = form.querySelector('button');
        const orig = btn?.textContent;
        if (btn) btn.textContent = '✓ You\'re in!';
        input.value = '';
        showToast('🌸 Welcome to the circle, dear soul!');
        setTimeout(() => { if (btn && orig) btn.textContent = orig; }, 3500);
      });
    });

    // ─── TOAST NOTIFICATIONS ─────────────────────────
    function showToast(msg) {
      let toast = document.querySelector('.toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // ─── HIGH-PERFORMANCE SMOOTH SCROLL ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 85;
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    // ─── ACTIVE NAV HIGHLIGHT (High-Performance RAF Scroll Spy) ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');
    let scrollTicking = false;

    function updateActiveNav() {
      const sp = window.scrollY + 140;
      let currentSecId = '';

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (sp >= top && sp < top + height) {
          currentSecId = sec.id;
        }
      });

      if (currentSecId) {
        navLinks.forEach(lk => {
          const href = lk.getAttribute('href') || '';
          const matches = href === `#${currentSecId}` || href.endsWith(`#${currentSecId}`);
          lk.classList.toggle('active', matches);
        });
      }
      scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateActiveNav);
        scrollTicking = true;
      }
    }, { passive: true });

    // Initial check
    updateActiveNav();

  });

})();
