// ============================================================================
// BETH ELISE — PSYCHIC MEDIUM
// AAA Grade Animation Engine: Tinkerbell & Firefly Pixies with Pixie Dust Trails
// 60FPS HTML5 Canvas + High-Frequency Meteors, Auroras, Firefly Swarms & Interactive Parallax
// ============================================================================

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // ─── ENCHANTED PRELOADER DISMISSAL ───
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
      let isDismissed = false;
      const dismissPreloader = () => {
        if (isDismissed) return;
        isDismissed = true;
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
        // Start the celestial woman in the orb descent right as preloader clears
        if (window.triggerHeroDescent) {
          window.triggerHeroDescent();
        }
      };

      setTimeout(dismissPreloader, 1800);
      preloader.addEventListener('click', dismissPreloader);
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
    // HERO ULTRA-SMOOTH 60FPS DUAL-CANVAS ENGINE
    // Canvas 1: Background Auroras, Meteors, Embers, Sky Moon & Pixies (BEHIND content, z-index 1)
    // Canvas 2: Foreground 2.5x Photorealistic Woman Avatar & Moonwalk (IN FRONT of logo, z-index 4)
    // ═══════════════════════════════════════════════
    const heroBgCanvas = document.getElementById('hero-celestial-canvas');
    const heroAvatarCanvas = document.getElementById('hero-avatar-canvas');

    if (heroBgCanvas && heroAvatarCanvas) {
      const bgCtx = heroBgCanvas.getContext('2d', { alpha: true });
      const aCtx = heroAvatarCanvas.getContext('2d', { alpha: true });
      let w, h;
      let isHeroVisible = true;
      let heroAnimId = null;
      const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 };
      const pixies = [];
      const meteors = [];
      const embers = [];
      const pixieDust = [];
      let lastMeteorTime = performance.now();
      let lastBolideTime = performance.now();
      let lastMouseMoveTime = 0;

      function resize() {
        const heroSection = document.querySelector('.hero');
        const heroW = (heroSection && heroSection.offsetWidth) || heroBgCanvas.offsetWidth || window.innerWidth;
        const heroH = (heroSection && heroSection.offsetHeight) || heroBgCanvas.offsetHeight || window.innerHeight;
        w = heroBgCanvas.width = heroAvatarCanvas.width = heroW;
        h = heroBgCanvas.height = heroAvatarCanvas.height = heroH;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      // Pause rendering loop when hero is out of viewport (saves 60% GPU/CPU on scroll)
      if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
          isHeroVisible = entries[0].isIntersecting;
          if (isHeroVisible && !heroAnimId) {
            heroAnimId = requestAnimationFrame(render);
          }
        }, { threshold: 0.05 });
        heroObserver.observe(heroBgCanvas);
      }

      // Track mouse coordinates for pixie attraction & stardust (Throttled)
      window.addEventListener('mousemove', (e) => {
        const now = performance.now();
        const dx = e.clientX - mouse.lastX;
        const dy = e.clientY - mouse.lastY;
        mouse.vx = dx * 0.3 + mouse.vx * 0.7;
        mouse.vy = dy * 0.3 + mouse.vy * 0.7;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.lastX = e.clientX;
        mouse.lastY = e.clientY;

        if (now - lastMouseMoveTime > 80) {
          lastMouseMoveTime = now;
          if (pixieDust.length < 40) {
            emitPixieDust(e.clientX, e.clientY, 2, ['#FFD700', '#00FFC8', '#00E5D4', '#FFF']);
          }
        }
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
      });

      // ─── 1. BACKGROUND TINKERBELL & FIREFLY PIXIE PALETTES ───────
      const pixiePalettes = [
        { core: '#FFFFFF', firefly: '#FFD700', aura: 'rgba(255, 215, 0, 0.85)', wing: 'rgba(255, 245, 180, 0.85)', dust: '#FFD700' },
        { core: '#FFFFFF', firefly: '#00FFC8', aura: 'rgba(0, 255, 200, 0.85)', wing: 'rgba(122, 255, 227, 0.85)', dust: '#00FFC8' },
        { core: '#FFFFFF', firefly: '#00E5D4', aura: 'rgba(0, 229, 212, 0.85)', wing: 'rgba(163, 255, 248, 0.85)', dust: '#38FFF0' },
        { core: '#FFFFFF', firefly: '#C77DFF', aura: 'rgba(199, 125, 255, 0.85)', wing: 'rgba(224, 170, 255, 0.85)', dust: '#E0AAFF' }
      ];

      // Spawn 14 Gentle Background Fairies (Rendered BEHIND logo & hero content)
      for (let i = 0; i < 14; i++) {
        const pal = pixiePalettes[i % pixiePalettes.length];
        pixies.push({
          x: Math.random() * (w || window.innerWidth),
          y: Math.random() * ((h || window.innerHeight) * 0.85),
          z: 0.5 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.7,
          targetX: Math.random() * (w || window.innerWidth),
          targetY: Math.random() * ((h || window.innerHeight) * 0.8),
          hoverTimer: Math.random() * 50,
          changeTimer: Math.random() * 120,
          wingPhase: Math.random() * Math.PI * 2,
          wingSpeed: 0.22 + Math.random() * 0.12, // Gentle wing flutter
          fireflyPulse: Math.random() * Math.PI * 2,
          fireflySpeed: 0.02 + Math.random() * 0.03,
          size: 8 + Math.random() * 8,
          palette: pal
        });
      }

      // ─── 1B. WARM BIOLUMINESCENT GLOWING FIREFLIES ──────────────
      const fireflies = [];
      for (let i = 0; i < 24; i++) {
        fireflies.push({
          x: Math.random() * (w || window.innerWidth),
          y: Math.random() * (h || window.innerHeight),
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.35,
          pulseSpeed: 0.002 + Math.random() * 0.0025,
          pulsePhase: Math.random() * Math.PI * 2,
          seed: Math.random() * 100,
          size: 1.8 + Math.random() * 2.2,
          glowColor: ['#FFE57F', '#FFD700', '#76FF03', '#00FFC8', '#FFF'][Math.floor(Math.random() * 5)]
        });
      }

      // ─── 2. BIOLUMINESCENT RISING EMBERS (Gentle serene drift) ──────────────
      for (let i = 0; i < 35; i++) {
        embers.push({
          x: Math.random() * (w || window.innerWidth),
          y: Math.random() * (h || window.innerHeight),
          radius: 0.8 + Math.random() * 2.0,
          alpha: 0.25 + Math.random() * 0.5,
          twinkleSpeed: 0.015 + Math.random() * 0.025,
          phase: Math.random() * Math.PI * 2,
          vy: -(0.15 + Math.random() * 0.3),
          vx: (Math.random() - 0.5) * 0.15,
          color: ['#FFD700', '#00FFC8', '#00E5D4', '#C77DFF', '#FFFDF5'][Math.floor(Math.random() * 5)]
        });
      }

      function emitPixieDust(x, y, count = 2, colors = ['#FFD700', '#00FFC8', '#FFF']) {
        for (let i = 0; i < count; i++) {
          pixieDust.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 1.4,
            vy: (Math.random() - 0.5) * 1.4 - 0.3,
            life: 1.0,
            decay: 0.020 + Math.random() * 0.025,
            size: 1.8 + Math.random() * 2.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            isDiamond: Math.random() > 0.5
          });
        }
      }

      function triggerMeteor(isBolide = false) {
        if (meteors.length >= 3) return;
        const startX = Math.random() * (w * 0.75);
        const startY = Math.random() * (h * 0.35);
        const angle = (24 + Math.random() * 28) * Math.PI / 180;
        const speed = isBolide ? (8 + Math.random() * 4) : (10 + Math.random() * 5); // Gentle serene speed

        meteors.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: isBolide ? (180 + Math.random() * 100) : (120 + Math.random() * 80),
          life: 1.0,
          decay: isBolide ? 0.012 : 0.018,
          isBolide: isBolide,
          color: isBolide ? '#FFD700' : ['#00FFC8', '#00E5D4', '#FFFFFF', '#38FFF0'][Math.floor(Math.random() * 4)]
        });
      }

      // ─── 3. ULTRA-SMOOTH HARDWARE-ACCELERATED RENDER LOOP ───
      let lastRenderTime = 0;
      function render(now) {
        if (!isHeroVisible) {
          heroAnimId = null;
          lastRenderTime = 0;
          return;
        }

        const dt = (lastRenderTime > 0) ? Math.min(0.05, (now - lastRenderTime) / 1000) : 0.016;
        lastRenderTime = now;

        // Clear both layers
        bgCtx.clearRect(0, 0, w, h);
        aCtx.clearRect(0, 0, w, h);

        // Decay star sparkle burst effect over time
        if (globalStarSparkle > 0) {
          globalStarSparkle *= Math.pow(0.992, dt / 0.016);
          if (globalStarSparkle < 0.01) globalStarSparkle = 0;
        }

        // ═══════════════════════════════════════════════
        // LAYER 1 (BACKGROUND CANVAS — BEHIND CONTENT)
        // ═══════════════════════════════════════════════

        // A. Dynamic Glowing Aurora Waves
        bgCtx.save();
        for (let j = 0; j < 2; j++) {
          bgCtx.beginPath();
          bgCtx.moveTo(0, h * 0.25);
          for (let x = 0; x <= w; x += 45) {
            const y = h * (0.14 + j * 0.08) +
                      Math.sin(x * 0.003 + now * 0.0008 + j) * 35 +
                      Math.sin(x * 0.007 - now * 0.0005) * 15;
            bgCtx.lineTo(x, y);
          }
          bgCtx.lineTo(w, 0);
          bgCtx.lineTo(0, 0);
          bgCtx.closePath();

          const auroraGrad = bgCtx.createLinearGradient(0, 0, w, h * 0.35);
          if (j === 0) {
            auroraGrad.addColorStop(0, 'rgba(0, 229, 212, 0.08)');
            auroraGrad.addColorStop(0.6, 'rgba(0, 255, 200, 0.11)');
            auroraGrad.addColorStop(1, 'transparent');
          } else {
            auroraGrad.addColorStop(0, 'rgba(157, 78, 221, 0.09)');
            auroraGrad.addColorStop(0.6, 'rgba(0, 229, 212, 0.07)');
            auroraGrad.addColorStop(1, 'transparent');
          }
          bgCtx.fillStyle = auroraGrad;
          bgCtx.fill();
        }
        bgCtx.restore();

        // A2. Render Astronomical Real-Time Moon in Sky (Behind logo)
        drawRealtimeSkyMoon(bgCtx, now);

        // B. Gentle Meteors (Occasional shooting stars every 4-8 seconds)
        if (now - lastMeteorTime > 4500 + Math.random() * 3500) {
          triggerMeteor(false);
          lastMeteorTime = now;
        }

        if (now - lastBolideTime > 12000 + Math.random() * 6000) {
          triggerMeteor(true);
          lastBolideTime = now;
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;
          m.life -= m.decay;

          if (m.life <= 0 || m.x > w + 120 || m.y > h + 120) {
            meteors.splice(i, 1);
            continue;
          }

          const tailX = m.x - (m.vx / 14) * m.length;
          const tailY = m.y - (m.vy / 14) * m.length;

          const grad = bgCtx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, '#FFFFFF');
          grad.addColorStop(0.25, m.color);
          grad.addColorStop(0.7, m.isBolide ? 'rgba(255, 69, 0, 0.4)' : 'rgba(0, 229, 212, 0.25)');
          grad.addColorStop(1, 'transparent');

          bgCtx.save();
          bgCtx.beginPath();
          bgCtx.moveTo(m.x, m.y);
          bgCtx.lineTo(tailX, tailY);
          bgCtx.strokeStyle = grad;
          bgCtx.lineWidth = (m.isBolide ? 3.2 : 2.0) * m.life;
          bgCtx.globalAlpha = m.life;
          bgCtx.stroke();

          // Core Head Glow
          bgCtx.beginPath();
          bgCtx.arc(m.x, m.y, (m.isBolide ? 3.0 : 2.0) * m.life, 0, Math.PI * 2);
          bgCtx.fillStyle = '#FFFFFF';
          bgCtx.fill();
          bgCtx.restore();

          if (Math.random() > 0.6) {
            emitPixieDust(m.x, m.y, 1, [m.color, '#FFF']);
          }
        }

        // C. Render Pixie Dust Particles
        for (let i = pixieDust.length - 1; i >= 0; i--) {
          const p = pixieDust[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;

          if (p.life <= 0) {
            pixieDust.splice(i, 1);
            continue;
          }

          bgCtx.save();
          bgCtx.fillStyle = p.color;
          bgCtx.globalAlpha = p.life * 0.88;

          if (p.isDiamond) {
            const s = p.size * p.life;
            bgCtx.beginPath();
            bgCtx.moveTo(p.x, p.y - s * 1.4);
            bgCtx.lineTo(p.x + s * 0.5, p.y);
            bgCtx.lineTo(p.x, p.y + s * 1.4);
            bgCtx.lineTo(p.x - s * 0.5, p.y);
            bgCtx.closePath();
            bgCtx.fill();
          } else {
            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, p.size * p.life * 0.55, 0, Math.PI * 2);
            bgCtx.fill();
          }
          bgCtx.restore();
        }

        // D. Render Rising Embers (Serene gentle drift)
        embers.forEach(e => {
          e.x += e.vx;
          e.y += e.vy;
          e.phase += e.twinkleSpeed;

          if (e.y < -20) e.y = h + 20;
          if (e.x < -20) e.x = w + 20;
          if (e.x > w + 20) e.x = -20;

          const a = e.alpha * (0.6 + Math.sin(e.phase) * 0.4);

          bgCtx.save();
          const g = bgCtx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius * 2.8);
          g.addColorStop(0, e.color);
          g.addColorStop(1, 'transparent');
          bgCtx.fillStyle = g;
          bgCtx.globalAlpha = a;
          bgCtx.beginPath();
          bgCtx.arc(e.x, e.y, e.radius * 2.8, 0, Math.PI * 2);
          bgCtx.fill();

          if (globalStarSparkle > 0.05) {
            bgCtx.fillStyle = '#FFFFFF';
            bgCtx.globalAlpha = a * globalStarSparkle;
            const spr = e.radius * (1.4 + Math.sin(e.phase * 3) * 0.8) * (1 + globalStarSparkle * 1.4);
            bgCtx.beginPath();
            bgCtx.moveTo(e.x, e.y - spr * 2.0);
            bgCtx.lineTo(e.x + spr * 0.25, e.y - spr * 0.25);
            bgCtx.lineTo(e.x + spr * 2.0, e.y);
            bgCtx.lineTo(e.x + spr * 0.25, e.y + spr * 0.25);
            bgCtx.lineTo(e.x, e.y + spr * 2.0);
            bgCtx.lineTo(e.x - spr * 0.25, e.y + spr * 0.25);
            bgCtx.lineTo(e.x - spr * 2.0, e.y);
            bgCtx.lineTo(e.x - spr * 0.25, e.y - spr * 0.25);
            bgCtx.closePath();
            bgCtx.fill();
          }
          bgCtx.restore();
        });

        // D2. Render Warm Glowing Bioluminescent Fireflies
        fireflies.forEach(f => {
          f.x += f.vx + Math.sin(now * 0.0012 + f.seed) * 0.35;
          f.y += f.vy + Math.cos(now * 0.0014 + f.seed) * 0.25;

          if (f.x < -20) f.x = w + 20;
          if (f.x > w + 20) f.x = -20;
          if (f.y < -20) f.y = h + 20;
          if (f.y > h + 20) f.y = -20;

          const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * f.pulseSpeed + f.pulsePhase));
          bgCtx.save();
          // Soft ambient firefly aura
          const fg = bgCtx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 5.5 * glow);
          fg.addColorStop(0, '#FFFFFF');
          fg.addColorStop(0.3, f.glowColor);
          fg.addColorStop(1, 'transparent');
          bgCtx.fillStyle = fg;
          bgCtx.globalAlpha = glow * 0.85;
          bgCtx.beginPath();
          bgCtx.arc(f.x, f.y, f.size * 5.5 * glow, 0, Math.PI * 2);
          bgCtx.fill();

          // Bioluminescent Core Bead
          bgCtx.fillStyle = '#FFFFFF';
          bgCtx.globalAlpha = glow;
          bgCtx.beginPath();
          bgCtx.arc(f.x, f.y, f.size * 0.65, 0, Math.PI * 2);
          bgCtx.fill();
          bgCtx.restore();
        });

        // E. Render Gentle Background Fairies (BEHIND logo)
        pixies.forEach(p => {
          p.changeTimer--;
          if (p.changeTimer <= 0) {
            p.targetX = Math.random() * w;
            p.targetY = Math.random() * (h * 0.8);
            p.changeTimer = 90 + Math.random() * 120;
            if (Math.random() > 0.65) p.hoverTimer = 30 + Math.random() * 30;
          }

          if (p.hoverTimer > 0) {
            p.hoverTimer--;
            p.vx *= 0.94;
            p.vy *= 0.94;
          } else {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            p.vx += (dx / dist) * 0.045;
            p.vy += (dy / dist) * 0.045;

            if (mouse.x > 0) {
              const mdx = mouse.x - p.x;
              const mdy = mouse.y - p.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < 180) {
                const angle = Math.atan2(mdy, mdx) + Math.PI * 0.45;
                p.vx += Math.cos(angle) * 0.25;
                p.vy += Math.sin(angle) * 0.25;
              }
            }

            p.vx = Math.max(-1.1, Math.min(1.1, p.vx * 0.98));
            p.vy = Math.max(-0.9, Math.min(0.9, p.vy * 0.98));
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -30) p.x = w + 30;
          if (p.x > w + 30) p.x = -30;
          if (p.y < -30) p.y = h + 30;
          if (p.y > h + 30) p.y = -30;

          p.wingPhase += p.wingSpeed;
          p.fireflyPulse += p.fireflySpeed;

          if (Math.random() > 0.6) {
            emitPixieDust(p.x, p.y, 1, [p.palette.dust, '#FFFFFF', '#FFF4CC']);
          }

          drawPhotorealisticTinkerbell(bgCtx, p, now);
        });

        // Background Star Sparkles across Constellations
        if (globalStarSparkle > 0.05) {
          drawSkyStarSparkles(bgCtx, now, globalStarSparkle);
        }

        // ═══════════════════════════════════════════════
        // LAYER 2 (FOREGROUND AVATAR CANVAS — IN FRONT OF LOGO)
        // ═══════════════════════════════════════════════
        updateAndRenderHeroTinkerbell(aCtx, now, dt);

        heroAnimId = requestAnimationFrame(render);
      }

      // ─── CONSTELLATION STAR SPARKLE BURST (Triggered when avatar lands on logo) ───
      function drawSkyStarSparkles(ctx, now, intensity) {
        ctx.save();
        const count = Math.floor(12 * intensity);
        for (let i = 0; i < count; i++) {
          const sx = (Math.sin(now * 0.0005 + i * 2.17) * 0.5 + 0.5) * w;
          const sy = (Math.cos(now * 0.0004 + i * 3.41) * 0.5 + 0.5) * (h * 0.65);
          const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(now * 0.003 + i * 1.7));
          const starSize = (2.5 + Math.sin(now * 0.002 + i) * 1.5) * intensity;

          ctx.globalAlpha = twinkle * intensity * 0.85;
          ctx.fillStyle = '#FFFFFF';

          // 4-point diamond star
          ctx.beginPath();
          ctx.moveTo(sx, sy - starSize * 2.2);
          ctx.lineTo(sx + starSize * 0.3, sy);
          ctx.lineTo(sx, sy + starSize * 2.2);
          ctx.lineTo(sx - starSize * 0.3, sy);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(sx - starSize * 2.2, sy);
          ctx.lineTo(sx, sy - starSize * 0.3);
          ctx.lineTo(sx + starSize * 2.2, sy);
          ctx.lineTo(sx, sy + starSize * 0.3);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // ─── ASTRONOMICAL LUNAR PHASE ENGINE (Real-Time Location & Moon Cycle) ───
      window.celestialLocation = {
        name: 'Chapel in the Clouds, Costa Rica',
        lat: 10.00,
        lng: -83.85
      };

      function calculateRealtimeMoon(date = new Date()) {
        const synodicMonth = 29.53058867;
        const refNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
        const diffDays = (date.getTime() - refNewMoon) / (1000 * 60 * 60 * 24);
        const phaseValue = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth;
        const phase = phaseValue / synodicMonth; // 0 to 1
        const illum = 0.5 * (1 - Math.cos(phase * 2 * Math.PI));
        const illumPct = Math.round(illum * 100);

        let name = 'Waxing Crescent';
        let icon = '🌒';

        if (phase < 0.03 || phase > 0.97) {
          name = 'New Moon';
          icon = '🌑';
        } else if (phase < 0.22) {
          name = 'Waxing Crescent';
          icon = '🌒';
        } else if (phase < 0.28) {
          name = 'First Quarter';
          icon = '🌓';
        } else if (phase < 0.47) {
          name = 'Waxing Gibbous';
          icon = '🌔';
        } else if (phase < 0.53) {
          name = 'Full Moon';
          icon = '🌕';
        } else if (phase < 0.72) {
          name = 'Waning Gibbous';
          icon = '🌖';
        } else if (phase < 0.78) {
          name = 'Last Quarter';
          icon = '🌗';
        } else {
          name = 'Waning Crescent';
          icon = '🌘';
        }

        return { phase, illumination: illumPct, name, icon };
      }

      function updateMoonUI() {
        const moon = calculateRealtimeMoon();
        const iconEl = document.getElementById('live-moon-icon');
        const phaseNameEl = document.getElementById('live-moon-phase-name');
        const illumEl = document.getElementById('live-moon-illumination');
        const locNameEl = document.getElementById('hero-loc-name');
        const locCoordsEl = document.getElementById('hero-loc-coords');
        const modalLocNameEl = document.getElementById('loc-modal-current-name');
        const modalLocCoordsEl = document.getElementById('loc-modal-current-coords');

        if (iconEl) iconEl.textContent = moon.icon;
        if (phaseNameEl) phaseNameEl.textContent = moon.name;
        if (illumEl) illumEl.textContent = `${moon.illumination}% Illumination`;
        if (locNameEl) locNameEl.textContent = window.celestialLocation.name;
        if (modalLocNameEl) modalLocNameEl.textContent = `☁️ ${window.celestialLocation.name}`;

        const latStr = `${Math.abs(window.celestialLocation.lat).toFixed(2)}°${window.celestialLocation.lat >= 0 ? 'N' : 'S'}`;
        const lngStr = `${Math.abs(window.celestialLocation.lng).toFixed(2)}°${window.celestialLocation.lng >= 0 ? 'E' : 'W'}`;
        
        if (locCoordsEl) locCoordsEl.textContent = `${latStr}, ${lngStr}`;
        if (modalLocCoordsEl) modalLocCoordsEl.textContent = `${latStr}, ${lngStr} · Real-Time Sky Moon Phase Active`;
      }
      updateMoonUI();

      // Real-time Moon celestial animation coordinates
      let currentMoonX = 0;
      let currentMoonY = 0;
      let currentMoonTilt = 0;
      let moonInitialized = false;

      // ─── DRAW REAL-TIME CELESTIAL MOON IN HERO CANVAS SKY (DYNAMIC LAT/LNG POSITION) ───
      function drawRealtimeSkyMoon(ctx, now) {
        const moon = calculateRealtimeMoon();
        
        // Calculate dynamic astronomical position based on latitude & longitude
        const lat = (window.celestialLocation && typeof window.celestialLocation.lat === 'number') ? window.celestialLocation.lat : 10.0;
        const lng = (window.celestialLocation && typeof window.celestialLocation.lng === 'number') ? window.celestialLocation.lng : -83.85;

        // Latitude maps to altitude (lower altitude at high northern/southern latitudes, higher near equator)
        const latRatio = Math.min(1, Math.max(0, (90 - Math.abs(lat)) / 90));
        const targetMy = Math.max(48, Math.min(h * 0.38, h * 0.08 + (1 - latRatio) * (h * 0.26)));

        // Longitude maps to horizontal position across sky (0.18w to 0.86w)
        const lngRatio = Math.min(1, Math.max(0, (lng + 180) / 360));
        const targetMx = w * (0.18 + lngRatio * 0.68);

        // Crescent angle tilt based on latitude
        const targetTilt = (lat / 90) * (Math.PI * 0.35);

        if (!moonInitialized || currentMoonX === 0) {
          currentMoonX = targetMx;
          currentMoonY = targetMy;
          currentMoonTilt = targetTilt;
          moonInitialized = true;
        } else {
          // Smooth cosmic repositioning animation when location changes
          currentMoonX += (targetMx - currentMoonX) * 0.06;
          currentMoonY += (targetMy - currentMoonY) * 0.06;
          currentMoonTilt += (targetTilt - currentMoonTilt) * 0.06;
        }

        const mx = currentMoonX;
        const my = currentMoonY;
        const r = 26;

        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(currentMoonTilt);

        // Multi-tier Radiance Glow
        const pulse = 1 + Math.sin(now * 0.0015) * 0.06;
        const glowGrad = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 3.2 * pulse);
        glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        glowGrad.addColorStop(0.35, 'rgba(0, 229, 212, 0.45)');
        glowGrad.addColorStop(0.7, 'rgba(157, 78, 221, 0.25)');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 3.2 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Moon Base Disc (Luminous Silver-Pearl)
        const moonBase = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
        moonBase.addColorStop(0, '#FFFFFF');
        moonBase.addColorStop(0.6, '#E2FCF7');
        moonBase.addColorStop(0.9, '#A3FFF8');
        moonBase.addColorStop(1, '#00E5D4');
        ctx.fillStyle = moonBase;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Realistic Astronomical Shadow Overlay based on phase
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.clip();

        const shadowOffset = (moon.phase < 0.5) ? (1 - moon.phase * 2) * (r * 1.8) : -(moon.phase - 0.5) * 2 * (r * 1.8);
        ctx.fillStyle = '#080014';
        ctx.beginPath();
        ctx.arc(shadowOffset, 0, r * 0.98, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Outer Moon Crescent Rim Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // ─── TINKERBELL MULTI-PERCH, THE WORM & MOONWALK STATE MACHINE ───
      // Starts IMMEDIATELY upon page load at the apex star with the woman inside the celestial orb
      const heroTinkerbell = {
        state: 'SPAWNING',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        startX: 0,
        startY: 0,
        targetX: 0,
        targetY: 0,
        progress: 0,
        perchedTime: 0,
        wormTime: 0,
        moonwalkTime: 0,
        wingPhase: 0,
        headAngle: 0,
        bodySway: 0,
        wandSpread: 0,
        isDoingTheWorm: false,
        wormPhase: 0,
        isMoonwalking: false,
        moonwalkPhase: 0,
        facingLeft: false,
        diveAngle: 0,
        portalVortexT: 0,
        nextSpawnTime: 0,
        cycleInterval: 14000
      };

      window.triggerHeroDescent = function() {
        heroTinkerbell.state = 'SPAWNING';
        heroTinkerbell.progress = 0;
        heroTinkerbell.wormTime = 0;
        heroTinkerbell.moonwalkTime = 0;
        heroTinkerbell.perchedTime = 0;
        heroTinkerbell.isDoingTheWorm = false;
        heroTinkerbell.isMoonwalking = false;
        heroTinkerbell.facingLeft = false;
      };

      // Clicking logo also triggers routine
      document.querySelector('.hero__logo-img')?.addEventListener('click', () => {
        window.triggerHeroDescent();
        if (window.celestialAudio) window.celestialAudio.playChime(963, 1.8);
      });

      // ─── STAR SPARKLE BURST CONTROLLER ───
      let globalStarSparkle = 0;

      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {
        // Guiding Celestial Star at sky apex (Source of descent)
        const starX = w * 0.5;
        const starY = Math.max(30, h * 0.06);

        // Target 1: Crescent Moon crest on top of the Logo (responsive)
        let logoMoonX = w * 0.5;
        let logoMoonY = h * 0.33;
        const heroLogo = document.querySelector('.hero__logo-img');
        
        if (heroLogo && heroAvatarCanvas) {
          const rect = heroLogo.getBoundingClientRect();
          const canvasRect = heroAvatarCanvas.getBoundingClientRect();
          if (rect.width > 0) {
            logoMoonX = rect.left + rect.width * 0.5 - canvasRect.left;
            const crestOffset = Math.max(14, rect.height * 0.11);
            logoMoonY = rect.top - canvasRect.top + (rect.height * 0.04) - crestOffset;
          }
        }

        // Target 2: "Intuitive Wisdom & Energy Healing" Tagline Pill Bar (responsive)
        let badgeRightX = w * 0.70;
        let badgeLeftX = w * 0.30;
        let badgeTopY = Math.max(50, h * 0.16);
        const pillBadge = document.querySelector('.hero__tagline-pill');
        if (pillBadge && heroAvatarCanvas) {
          const bRect = pillBadge.getBoundingClientRect();
          const cRect = heroAvatarCanvas.getBoundingClientRect();
          if (bRect.width > 0 && bRect.height > 0) {
            const marginPad = Math.min(24, bRect.width * 0.12);
            badgeRightX = bRect.left + bRect.width - marginPad - cRect.left;
            badgeLeftX = bRect.left + marginPad - cRect.left;
            badgeTopY = bRect.top - cRect.top - 10;
          }
        }

        // Target 3: Celestial Moon Background Portal Disc
        const portalX = w * 0.5;
        const portalY = h * 0.30;

        // Target 4: Lower Right Corner (Help Assistant Landing Node)
        const cornerTargetX = w - 68;
        const cornerTargetY = h - 68;

        // ✦ DRAW PULSING GUIDING CELESTIAL STAR (PORTAL OF ORIGIN) ✦
        ctx.save();
        const isSpawning = (heroTinkerbell.state === 'SPAWNING' || heroTinkerbell.state === 'ORB_FLOATING' || heroTinkerbell.state === 'FLYING_TO_LOGO');
        const starPulse = (isSpawning ? 1.3 : 0.9) + Math.sin(now * 0.003) * 0.2;
        const starRadius = (isSpawning ? 36 : 24) * starPulse;

        // Multi-tier Radiance Glow
        const starGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, starRadius);
        starGrad.addColorStop(0, '#FFFFFF');
        starGrad.addColorStop(0.25, 'rgba(255, 215, 0, 0.95)');
        starGrad.addColorStop(0.55, 'rgba(199, 125, 255, 0.65)');
        starGrad.addColorStop(0.8, 'rgba(0, 229, 212, 0.35)');
        starGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        ctx.arc(starX, starY, starRadius, 0, Math.PI * 2);
        ctx.fill();

        // 12-Point Diamond Cosmic Starflare
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const sr = (isSpawning ? 11 : 7) * starPulse;
        ctx.moveTo(starX, starY - sr * 2.8);
        ctx.lineTo(starX + sr * 0.3, starY - sr * 0.3);
        ctx.lineTo(starX + sr * 2.8, starY);
        ctx.lineTo(starX + sr * 0.3, starY + sr * 0.3);
        ctx.lineTo(starX, starY + sr * 2.8);
        ctx.lineTo(starX - sr * 0.3, starY + sr * 0.3);
        ctx.lineTo(starX - sr * 2.8, starY);
        ctx.lineTo(starX - sr * 0.3, starY - sr * 0.3);
        ctx.closePath();
        ctx.fill();

        // Diagonal Rays
        ctx.beginPath();
        ctx.moveTo(starX + sr * 1.5, starY - sr * 1.5);
        ctx.lineTo(starX + sr * 0.2, starY);
        ctx.lineTo(starX + sr * 1.5, starY + sr * 1.5);
        ctx.lineTo(starX, starY + sr * 0.2);
        ctx.lineTo(starX - sr * 1.5, starY + sr * 1.5);
        ctx.lineTo(starX - sr * 0.2, starY);
        ctx.lineTo(starX - sr * 1.5, starY - sr * 1.5);
        ctx.lineTo(starX, starY - sr * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // ─── STATE MACHINE TRANSITIONS & CHOREOGRAPHY ───
        
        // Target 5: "Book a Reading" hero CTA button (responsive)
        let bookBtnX = w * 0.5;
        let bookBtnY = h * 0.72;
        const bookBtn = document.querySelector('.hero__cta-group .btn-primary');
        if (bookBtn && heroAvatarCanvas) {
          const bbRect = bookBtn.getBoundingClientRect();
          const cRect = heroAvatarCanvas.getBoundingClientRect();
          if (bbRect.width > 0) {
            bookBtnX = bbRect.left + bbRect.width * 0.5 - cRect.left;
            bookBtnY = bbRect.top - cRect.top - 8;
          }
        }

        // Target 6: aEye assistant widget (safely clamped for mobile/tablet portrait)
        let aeyeX = Math.max(40, w - 60);
        let aeyeY = Math.max(40, h - 60);
        const aeyeWidget = document.getElementById('assistant-avatar-btn');
        if (aeyeWidget && heroAvatarCanvas) {
          const aeRect = aeyeWidget.getBoundingClientRect();
          const cRect2 = heroAvatarCanvas.getBoundingClientRect();
          if (aeRect.width > 0) {
            const rawAeX = aeRect.left + aeRect.width * 0.5 - cRect2.left;
            const rawAeY = aeRect.top + aeRect.height * 0.5 - cRect2.top;
            aeyeX = Math.max(36, Math.min(w - 36, rawAeX));
            aeyeY = Math.max(36, Math.min(h - 36, rawAeY));
          }
        }

        // 1. SPAWNING → Begin slow orb descent
        if (heroTinkerbell.state === 'SPAWNING') {
          heroTinkerbell.startX = starX;
          heroTinkerbell.startY = starY;
          heroTinkerbell.x = starX;
          heroTinkerbell.y = starY;
          heroTinkerbell.orbFlightTime = 0;
          heroTinkerbell.state = 'ORB_FLOATING';
          heroTinkerbell.isDoingTheWorm = false;
          heroTinkerbell.isMoonwalking = false;
          heroTinkerbell.facingLeft = false;
          emitPixieDust(starX, starY, 20, ['#FFD700', '#C77DFF', '#FFF', '#9D4EDD', '#00FFC8']);
        }

        // 2. ORB FLOATING — Slow, dreamy descent with gentle drifting (~8.5s)
        else if (heroTinkerbell.state === 'ORB_FLOATING') {
          heroTinkerbell.orbFlightTime += dt;
          const oft = heroTinkerbell.orbFlightTime;
          const orbDuration = 8.5; // Dreamy slow 8.5s starlight descent
          const progress = Math.min(1, oft / orbDuration);

          // Gentle sine-wave celestial drift as it floats down from the star
          const drift = Math.sin(oft * 0.9) * (w * 0.09);
          const gentleBob = Math.sin(oft * 2.0) * 10;
          
          heroTinkerbell.x = starX + drift + (logoMoonX - starX) * (progress * 0.45);
          heroTinkerbell.y = starY + (logoMoonY - starY) * (progress * 0.65) + gentleBob;
          heroTinkerbell.wingPhase += dt * 10.0;

          if (Math.random() > 0.25) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 8, 1, ['#C77DFF', '#FFD700', '#FFFFFF', '#00FFC8']);
          }

          if (oft >= orbDuration) {
            // Transition seamlessly to final descent to logo moon
            heroTinkerbell.state = 'FLYING_TO_LOGO';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.targetX = logoMoonX;
            heroTinkerbell.targetY = logoMoonY;
            heroTinkerbell.progress = 0;
          }
        }
        
        // 3. FLYING TO LOGO MOON (Smooth, seamless arrival onto logo moon ~3.2s)
        else if (heroTinkerbell.state === 'FLYING_TO_LOGO') {
          heroTinkerbell.progress += dt / 3.2;
          heroTinkerbell.wingPhase += dt * 22.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p); // Cubic ease-in-out
          const swoop = Math.sin(p * Math.PI) * (w * 0.035); // Guaranteed 0 at p=0 and 0 at p=1

          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * logoMoonX + swoop;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * logoMoonY;

          if (Math.random() > 0.15) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 10, 2, ['#C77DFF', '#FFD700', '#FFFFFF', '#9D4EDD', '#00FFC8']);
          }

          if (p >= 1) {
            heroTinkerbell.state = 'PERCHED_LOGO';
            heroTinkerbell.x = logoMoonX;
            heroTinkerbell.y = logoMoonY;
            heroTinkerbell.perchedTime = 0;
            globalStarSparkle = 1.0;

            if (heroLogo) heroLogo.classList.add('fairy-moon-glow');
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 14, 28, ['#FFD700', '#FFFFFF', '#FFE57F', '#C77DFF']);
          }
        }
        
        // 4. PERCHED ON LOGO — John Travolta Look-Around (~3.5s)
        else if (heroTinkerbell.state === 'PERCHED_LOGO') {
          heroTinkerbell.perchedTime += dt;
          heroTinkerbell.wingPhase += dt * 8.0;
          const pt = heroTinkerbell.perchedTime;

          heroTinkerbell.x = logoMoonX;
          heroTinkerbell.y = logoMoonY;
          heroTinkerbell.bodySway = Math.sin(pt * 2.0) * 1.2;
          heroTinkerbell.wandSpread = 1.0;
          heroTinkerbell.isMoonwalking = false;
          heroTinkerbell.isDoingTheWorm = false;

          // John Travolta confused look-around sequence
          if (pt < 0.9) {
            heroTinkerbell.headAngle = -0.4; // Look left
          } else if (pt < 1.6) {
            heroTinkerbell.headAngle = 0.0;   // Center
          } else if (pt < 2.3) {
            heroTinkerbell.headAngle = 0.4;  // Look right
          } else if (pt < 2.8) {
            heroTinkerbell.headAngle = -0.2; // Back left confused
          } else {
            heroTinkerbell.headAngle = 0.0;  // Center ready to go
          }

          // Moon glow under feet
          ctx.save();
          const moonGlowPulse = 1.0 + Math.sin(now * 0.004) * 0.15;
          const moonGlowGrad = ctx.createRadialGradient(heroTinkerbell.x, heroTinkerbell.y + 16, 0, heroTinkerbell.x, heroTinkerbell.y + 16, 30 * moonGlowPulse);
          moonGlowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          moonGlowGrad.addColorStop(0.35, 'rgba(255, 215, 0, 0.85)');
          moonGlowGrad.addColorStop(0.65, 'rgba(255, 180, 0, 0.4)');
          moonGlowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = moonGlowGrad;
          ctx.beginPath();
          ctx.arc(heroTinkerbell.x, heroTinkerbell.y + 16, 30 * moonGlowPulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (Math.random() > 0.5) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 20, heroTinkerbell.y + 14, 1, ['#FFD700', '#FFF', '#FFE57F']);
          }

          // Next: Fly down to "Book a Reading" button
          if (pt >= 3.5) {
            heroTinkerbell.state = 'FLYING_TO_BOOK_BTN';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;
            if (heroLogo) heroLogo.classList.remove('fairy-moon-glow');
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 18, ['#FFD700', '#C77DFF', '#FFF', '#00FFC8']);
          }
        }
        
        // 5. FLYING DOWN TO "BOOK A READING" BUTTON (~2.2s)
        else if (heroTinkerbell.state === 'FLYING_TO_BOOK_BTN') {
          heroTinkerbell.progress += dt / 2.2;
          heroTinkerbell.wingPhase += dt * 25.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);
          const swoop = Math.sin(p * Math.PI) * (w * 0.05);

          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * bookBtnX + swoop;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * bookBtnY;
          heroTinkerbell.facingLeft = false;

          if (Math.random() > 0.25) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 8, 2, ['#00FFC8', '#FFD700', '#FFF']);
          }

          if (p >= 1) {
            // Touch the button, sparkle it, then fly back up
            heroTinkerbell.state = 'PERCHED_BOOK_BTN';
            heroTinkerbell.perchedTime = 0;
            heroTinkerbell.x = bookBtnX;
            heroTinkerbell.y = bookBtnY;
            emitPixieDust(bookBtnX, bookBtnY, 22, ['#FFD700', '#00FFC8', '#FFFFFF', '#C77DFF']);
            // Briefly glow the button
            if (bookBtn) {
              bookBtn.style.boxShadow = '0 0 35px rgba(0, 229, 212, 0.9), 0 0 60px rgba(255, 215, 0, 0.7)';
              setTimeout(() => { if (bookBtn) bookBtn.style.boxShadow = ''; }, 2000);
            }
          }
        }

        // 5b. PERCHED ON BOOK BUTTON (brief pause ~1.5s)
        else if (heroTinkerbell.state === 'PERCHED_BOOK_BTN') {
          heroTinkerbell.perchedTime += dt;
          heroTinkerbell.wingPhase += dt * 9.0;
          heroTinkerbell.bodySway = Math.sin(heroTinkerbell.perchedTime * 3) * 1.0;

          if (Math.random() > 0.5) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 15, heroTinkerbell.y + 6, 1, ['#FFD700', '#00FFC8', '#FFF']);
          }

          if (heroTinkerbell.perchedTime >= 1.5) {
            // Fly back up to LEFT side of the pill bar
            heroTinkerbell.state = 'FLYING_TO_BADGE';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.targetX = badgeLeftX;
            heroTinkerbell.targetY = badgeTopY;
            heroTinkerbell.progress = 0;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 15, ['#00FFC8', '#FFD700', '#FFF']);
          }
        }

        // 6. FLYING UP TO LEFT SIDE OF PILL BAR (~2.2s)
        else if (heroTinkerbell.state === 'FLYING_TO_BADGE') {
          heroTinkerbell.progress += dt / 2.2;
          heroTinkerbell.wingPhase += dt * 26.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);
          const swoop = Math.sin(p * Math.PI) * (w * 0.04);

          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * badgeLeftX - swoop;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * badgeTopY;
          heroTinkerbell.facingLeft = false;

          if (Math.random() > 0.25) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 8, 2, ['#00FFC8', '#FFD700', '#FFF', '#C77DFF']);
          }

          if (p >= 1) {
            // Land on LEFT corner of pill bar, start the worm!
            heroTinkerbell.state = 'DOING_THE_WORM';
            heroTinkerbell.x = badgeLeftX;
            heroTinkerbell.y = badgeTopY;
            heroTinkerbell.wormTime = 0;
            heroTinkerbell.facingLeft = false; // Head-first left to right
            heroTinkerbell.isDoingTheWorm = true;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 4, 25, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF']);
          }
        }

        // 7. DOING THE WORM LEFT→RIGHT (head-first, halfway across bar ~3.5s)
        else if (heroTinkerbell.state === 'DOING_THE_WORM') {
          heroTinkerbell.wormTime += dt;
          heroTinkerbell.wingPhase += dt * 24.0;
          const wt = heroTinkerbell.wormTime;
          const totalWormDuration = 3.5; // Slow, dramatic worm (~3.5s)
          const wormProgress = Math.min(1, wt / totalWormDuration);

          // Left to halfway across
          const midX = badgeLeftX + 0.5 * (badgeRightX - badgeLeftX);
          heroTinkerbell.x = badgeLeftX + wormProgress * (midX - badgeLeftX);
          heroTinkerbell.y = badgeTopY;
          heroTinkerbell.isDoingTheWorm = true;
          heroTinkerbell.wormPhase = wt * 12.0;
          heroTinkerbell.facingLeft = false; // Head-first going right
          heroTinkerbell.isMoonwalking = false;

          if (Math.random() > 0.15) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 15, heroTinkerbell.y + 6, 2, ['#FFD700', '#00FFC8', '#FFF', '#FFE57F']);
          }

          if (wt >= totalWormDuration) {
            // Reached halfway! Stand up, turn sideways, moonwalk!
            heroTinkerbell.state = 'MOONWALK_ON_BADGE';
            heroTinkerbell.moonwalkTime = 0;
            heroTinkerbell.isDoingTheWorm = false;
            heroTinkerbell.isMoonwalking = true;
            heroTinkerbell.facingLeft = false; // Profile facing right, sliding right
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 6, 18, ['#FFD700', '#C77DFF', '#FFF', '#00FFC8']);
          }
        }

        // 8. MOONWALKING (profile view) from halfway to right edge (~3.5s)
        else if (heroTinkerbell.state === 'MOONWALK_ON_BADGE') {
          heroTinkerbell.moonwalkTime += dt;
          heroTinkerbell.wingPhase += dt * 12.0;
          const mt = heroTinkerbell.moonwalkTime;
          const totalMoonwalkDuration = 3.5; // Slow moonwalk (~3.5s)
          const mwProgress = Math.min(1, mt / totalMoonwalkDuration);

          // Continue rightward from halfway to right edge
          const midX = badgeLeftX + 0.5 * (badgeRightX - badgeLeftX);
          heroTinkerbell.x = midX + mwProgress * (badgeRightX - midX);
          heroTinkerbell.y = badgeTopY - Math.sin(mwProgress * Math.PI * 3) * 1.5;
          heroTinkerbell.isMoonwalking = true;
          heroTinkerbell.moonwalkPhase = mt * 7.0;
          heroTinkerbell.headAngle = 0.0;
          heroTinkerbell.facingLeft = false; // Profile facing right

          if (Math.random() > 0.25) {
            emitPixieDust(heroTinkerbell.x - 6, heroTinkerbell.y + 10, 1, ['#FFD700', '#FFF', '#00FFC8']);
          }

          if (mt >= totalMoonwalkDuration) {
            // At the right edge! Turn around and olympic dive into aEye!
            heroTinkerbell.state = 'OLYMPIC_DIVE';
            heroTinkerbell.isMoonwalking = false;
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.facingLeft = false;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 22, ['#00FFC8', '#FFD700', '#FFF', '#9D4EDD']);
          }
        }

        // 9. OLYMPIC DIVE — Arc up, flip, and plunge directly into aEye (~2.4s)
        else if (heroTinkerbell.state === 'OLYMPIC_DIVE') {
          heroTinkerbell.progress += dt / 2.4;
          heroTinkerbell.wingPhase += dt * 32.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);

          // Arc: briefly UP (launch), then curve DOWN to aEye
          const launchArc = Math.sin(p * Math.PI) * (-80); // Negative = upward arc
          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * aeyeX;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * aeyeY + launchArc * (1 - p);

          // Rotating somersault dive angle (full rotation)
          heroTinkerbell.diveAngle = p * Math.PI * 2.0;

          // Intense pixie trail
          if (Math.random() > 0.05) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 4, 3, ['#C77DFF', '#00FFC8', '#FFD700', '#FFF']);
          }

          if (p >= 1) {
            // DIRECT HIT on aEye! — Massive splash!
            heroTinkerbell.state = 'ASSISTANT_DIVED';
            // Starburst splash on impact
            emitPixieDust(aeyeX, aeyeY, 60, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF', '#9D4EDD']);
            // Ring of sparks radiating outward
            for (let i = 0; i < 16; i++) {
              const angle = (i / 16) * Math.PI * 2;
              const dist = 30 + Math.random() * 30;
              emitPixieDust(
                aeyeX + Math.cos(angle) * dist,
                aeyeY + Math.sin(angle) * dist,
                5, ['#FFD700', '#00FFC8', '#FFF']
              );
            }
            if (typeof window.activateSacredAssistantWidget === 'function') {
              window.activateSacredAssistantWidget();
            }
          }
        }

        // 10. ASSISTANT DIVED — Avatar absorbed into the All-Seeing Eye
        else if (heroTinkerbell.state === 'ASSISTANT_DIVED') {
          heroTinkerbell.x = aeyeX;
          heroTinkerbell.y = aeyeY;
        }

        // ✦ DRAW AVATAR / CELESTIAL ORB ✦
        if (heroTinkerbell.state !== 'COOLDOWN') {
          const p = heroTinkerbell.progress;

          // 1. Pure Starlight Orb stage (during ORB_FLOATING and early FLYING_TO_LOGO)
          if ((heroTinkerbell.state === 'ORB_FLOATING') || (heroTinkerbell.state === 'FLYING_TO_LOGO' && p < 0.30)) {
            drawCelestialOrb(ctx, heroTinkerbell.x, heroTinkerbell.y, now, 1.0);
          }
          // 2. Smoothly Materializing Morphing stage (Descent 0.30 to 0.85)
          else if (heroTinkerbell.state === 'FLYING_TO_LOGO' && p < 0.85) {
            const morphP = (p - 0.30) / 0.55;
            // Draw diminishing orb
            drawCelestialOrb(ctx, heroTinkerbell.x, heroTinkerbell.y, now, (1.0 - morphP) * 0.9);
            // Draw materializing fairy with smooth alpha
            ctx.save();
            ctx.globalAlpha = Math.min(1, morphP * 1.15);
            drawHeroTinkerbellSprite(
              ctx,
              heroTinkerbell.x,
              heroTinkerbell.y,
              heroTinkerbell.wingPhase,
              heroTinkerbell.headAngle,
              false,
              0,
              0,
              false,
              0,
              false,
              0,
              false
            );
            ctx.restore();
          }
          // 3. Fully Materialized Brunette Jessica Rabbit Avatar with Hyper-Realistic Angel Wings
          else {
            const isPerched = (heroTinkerbell.state === 'PERCHED_LOGO' || heroTinkerbell.state === 'ASSISTANT_ACTIVE');
            drawHeroTinkerbellSprite(
              ctx,
              heroTinkerbell.x,
              heroTinkerbell.y,
              heroTinkerbell.wingPhase,
              heroTinkerbell.headAngle,
              isPerched,
              heroTinkerbell.bodySway,
              heroTinkerbell.wandSpread,
              heroTinkerbell.isMoonwalking,
              heroTinkerbell.moonwalkPhase || 0,
              heroTinkerbell.isDoingTheWorm,
              heroTinkerbell.wormPhase || 0,
              heroTinkerbell.facingLeft
            );
          }
        }
      }

      // ─── RADIANT CELESTIAL STARLIGHT ORB (With Ethereal Woman Avatar Visible Inside) ───
      function drawCelestialOrb(ctx, x, y, now, opacity = 1.0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = opacity;

        const pulse = 1.0 + Math.sin(now * 0.005) * 0.12;
        const r = 24 * pulse;

        // 1. Outer Multi-tier Celestial Aura
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.6);
        g.addColorStop(0, '#FFFFFF');
        g.addColorStop(0.25, 'rgba(255, 215, 0, 0.95)');
        g.addColorStop(0.55, 'rgba(199, 125, 255, 0.7)');
        g.addColorStop(0.85, 'rgba(0, 229, 212, 0.35)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.6, 0, Math.PI * 2);
        ctx.fill();

        // 2. Translucent Glass-Crystalline Orb Sphere
        const orbGlass = ctx.createRadialGradient(-r * 0.35, -r * 0.35, 0, 0, 0, r);
        orbGlass.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        orbGlass.addColorStop(0.45, 'rgba(224, 200, 255, 0.70)');
        orbGlass.addColorStop(0.8, 'rgba(0, 229, 212, 0.45)');
        orbGlass.addColorStop(1, 'rgba(157, 78, 221, 0.85)');
        ctx.fillStyle = orbGlass;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // 3. ✦ ETHEREAL WOMAN AVATAR SILHOUETTE INSIDE THE GLOWING ORB ✦
        ctx.save();
        const innerScale = 0.95 * pulse;
        ctx.scale(innerScale, innerScale);

        // Porcelain face & curls silhouette inside orb
        ctx.fillStyle = '#FDECE0';
        ctx.beginPath();
        ctx.arc(0, -7, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Chocolate curls
        ctx.fillStyle = '#230C03';
        ctx.beginPath();
        ctx.arc(0, -8.5, 4.0, Math.PI * 0.7, Math.PI * 2.3);
        ctx.quadraticCurveTo(5.0, -2, 3.5, 5);
        ctx.quadraticCurveTo(-5.0, -2, 0, -8.5);
        ctx.fill();

        // Corset silhouette
        ctx.fillStyle = '#9D4EDD';
        ctx.beginPath();
        ctx.moveTo(-3.0, -4.5);
        ctx.lineTo(3.0, -4.5);
        ctx.lineTo(2.2, 4.8);
        ctx.lineTo(-2.2, 4.8);
        ctx.closePath();
        ctx.fill();

        // Folded Soft Angel Wings inside Orb
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.ellipse(-5.5, -1, 6.5, 3.5, -Math.PI / 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(5.5, -1, 6.5, 3.5, Math.PI / 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Heart Chakra Starlight Pulse
        ctx.fillStyle = '#00FFC8';
        ctx.beginPath();
        ctx.arc(0, -1.8, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // end inner woman

        // 4. Outer Glass Reflection & Rim Sparkle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        // Crescent Specular Highlight on Orb
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.82, -Math.PI * 0.75, -Math.PI * 0.25);
        ctx.stroke();

        // 8-Point Diamond Starlight Core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const sr = 11 * pulse;
        ctx.moveTo(0, -sr * 2.4);
        ctx.lineTo(sr * 0.35, -sr * 0.35);
        ctx.lineTo(sr * 2.4, 0);
        ctx.lineTo(sr * 0.35, sr * 0.35);
        ctx.lineTo(0, sr * 2.4);
        ctx.lineTo(-sr * 0.35, sr * 0.35);
        ctx.lineTo(-sr * 2.4, 0);
        ctx.lineTo(-sr * 0.35, -sr * 0.35);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // ─── BRUNETTE JESSICA RABBIT PHOTOREALISTIC AVATAR SPRITE RENDERER ───
      // Seductive, Voluptuous Brunette Jessica Rabbit Likeness from User Photo:
      // High-Definition 3.6x Scale, Cascading Mid-Back Chocolate Waves, Halter Corset Gown, Slit Skirt,
      // Stiletto Heels, Sculpted Angel Wings, Dynamic The Worm & Moonwalk Animations
      function drawHeroTinkerbellSprite(ctx, x, y, wingPhase, headAngle = 0, isPerched = false, sway = 0, wandSpread = 0, isMoonwalking = false, moonwalkPhase = 0, isDoingTheWorm = false, wormPhase = 0, facingLeft = false) {
        ctx.save();
        ctx.translate(x + sway, y);

        // Horizontal flip if facing left
        if (facingLeft) {
          ctx.scale(-1, 1);
        }

        // Tinkerbell-sized Scale (1.2x — one third of the original 3.6x)
        const scale = 1.2;
        ctx.scale(scale, scale);

        // ✦ IF DOING THE WORM: RENDER HORIZONTAL UNDULATING DANCE ANIMATION ✦
        if (isDoingTheWorm) {
          ctx.save();
          // Undulating multi-segment spine wave across horizontal bar
          const waveSin1 = Math.sin(wormPhase);
          const waveSin2 = Math.sin(wormPhase - 1.2);
          const waveSin3 = Math.sin(wormPhase - 2.4);

          // Body is positioned horizontally along the bar (y = 0 is bar top)
          const chestY = waveSin1 * 3.5;
          const hipY = -waveSin2 * 4.5;
          const legY = -waveSin3 * 6.5;

          // Ethereal Glow
          const wormAura = ctx.createRadialGradient(0, 0, 0, 0, 0, 24);
          wormAura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          wormAura.addColorStop(0.4, 'rgba(0, 229, 212, 0.6)');
          wormAura.addColorStop(0.8, 'rgba(157, 78, 221, 0.3)');
          wormAura.addColorStop(1, 'transparent');
          ctx.fillStyle = wormAura;
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fill();

          // Angel Wings fluttering along arched back during The Worm
          ctx.save();
          ctx.translate(0, chestY - 4);
          ctx.scale(0.95, 0.95 * Math.sin(wingPhase));
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.ellipse(-5, -6, 14, 7, -Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(5, -6, 14, 7, Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Seductive Metallic Jessica Rabbit Gown
          const dressGrad = ctx.createLinearGradient(-10, -5, 10, 5);
          dressGrad.addColorStop(0, '#1A0033');
          dressGrad.addColorStop(0.35, '#800020'); // Burgundy/ruby metallic sheen
          dressGrad.addColorStop(0.7, '#9D4EDD');
          dressGrad.addColorStop(1, '#C77DFF');

          // Arched Torso Ripple
          ctx.fillStyle = dressGrad;
          ctx.beginPath();
          ctx.moveTo(-6, chestY);
          ctx.quadraticCurveTo(0, hipY - 3, 6, legY);
          ctx.lineTo(6, legY + 3.8);
          ctx.quadraticCurveTo(0, hipY + 1.8, -6, chestY + 3.8);
          ctx.closePath();
          ctx.fill();

          // Slender Legs kicking up in the air
          ctx.fillStyle = '#FDECE0';
          ctx.beginPath();
          ctx.moveTo(6, legY);
          ctx.lineTo(13, legY - 4.0);
          ctx.lineTo(14, legY - 1.8);
          ctx.lineTo(6, legY + 3.2);
          ctx.closePath();
          ctx.fill();

          // Metallic Ruby/Purple Stiletto High Heels kicking up
          ctx.fillStyle = '#9D4EDD';
          ctx.beginPath();
          ctx.moveTo(13, legY - 4.0);
          ctx.lineTo(17.5, legY - 6.0);
          ctx.lineTo(16, legY - 1.8);
          ctx.closePath();
          ctx.fill();
          // Stiletto Heel Spike
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(15, legY - 3.2);
          ctx.lineTo(15, legY + 1.2);
          ctx.stroke();

          // Hands pushing against the bar
          ctx.fillStyle = '#FDECE0';
          ctx.beginPath();
          ctx.arc(-8, 2, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Head & Face tilted with playful smile
          ctx.save();
          ctx.translate(-9, chestY - 2);
          ctx.rotate(-0.35 + waveSin1 * 0.2);

          // Porcelain Face
          ctx.fillStyle = '#FDECE0';
          ctx.beginPath();
          ctx.ellipse(0, 0, 3.0, 3.6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Rosy Cheeks
          ctx.fillStyle = 'rgba(255, 140, 170, 0.55)';
          ctx.beginPath();
          ctx.arc(-1.2, 0.5, 0.9, 0, Math.PI * 2);
          ctx.arc(1.2, 0.5, 0.9, 0, Math.PI * 2);
          ctx.fill();

          // Cat-Eye Makeup & Violet Iris
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(-1.5, -0.2, 0.8, 0.5, 0, 0, Math.PI * 2);
          ctx.ellipse(1.5, -0.2, 0.8, 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#5A2A7A';
          ctx.beginPath();
          ctx.arc(-1.5, -0.2, 0.4, 0, Math.PI * 2);
          ctx.arc(1.5, -0.2, 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Luscious Berry Lips Smiling
          ctx.strokeStyle = '#C74D70';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(0, 1.2, 1.2, 0.2, Math.PI - 0.2);
          ctx.stroke();

          // Voluminous Chocolate Curls Flowing along Back
          ctx.fillStyle = '#230C03';
          ctx.beginPath();
          ctx.arc(0, -1.8, 3.8, Math.PI * 0.7, Math.PI * 2.3);
          ctx.quadraticCurveTo(6.0, 2.0, 3.5, 8.5);
          ctx.quadraticCurveTo(-2.0, 4.0, 0, -1.8);
          ctx.fill();

          // Caramel curl highlights
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.arc(1.8, 3.8, 2.2, 0, Math.PI * 1.5);
          ctx.stroke();

          ctx.restore(); // end worm head
          ctx.restore(); // end worm pose
          ctx.restore(); // end main context
          return;
        }

        // 1. Radiant Multi-Tier Starlight Aura
        const auraRadius = isPerched ? 24 : 28;
        const auraGrad = ctx.createRadialGradient(0, -8, 0, 0, -8, auraRadius);
        auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        auraGrad.addColorStop(0.35, 'rgba(224, 170, 255, 0.75)');
        auraGrad.addColorStop(0.65, 'rgba(255, 215, 0, 0.45)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(0, -8, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. ✦ HYPER-REALISTIC SCULPTED AVIAN ANGEL WINGS ✦
        const wingFlap = Math.sin(wingPhase);
        const wingFlex = isPerched ? (0.88 + Math.sin(wingPhase) * 0.12) : wingFlap;

        function drawRealisticAngelWing(wCtx, side) {
          wCtx.save();
          wCtx.scale(side * wingFlex, 1);

          // Ethereal Feather Backlight Glow
          const wingGlow = wCtx.createRadialGradient(-10, -14, 2, -10, -14, 24);
          wingGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          wingGlow.addColorStop(0.4, 'rgba(255, 245, 200, 0.75)');
          wingGlow.addColorStop(0.75, 'rgba(199, 125, 255, 0.4)');
          wingGlow.addColorStop(1, 'transparent');
          wCtx.fillStyle = wingGlow;
          wCtx.beginPath();
          wCtx.ellipse(-10, -14, 22, 18, -Math.PI / 4, 0, Math.PI * 2);
          wCtx.fill();

          // PRIMARY FLIGHT FEATHERS
          const primaryFeathers = [
            { x1: -2, y1: -10, cx1: -9, cy1: -21, tx: -16, ty: -24, cx2: -13, cy2: -18, tx2: -7, ty2: -13 },
            { x1: -3, y1: -10, cx1: -11, cy1: -18, tx: -19, ty: -19, cx2: -15, cy2: -14, tx2: -8, ty2: -11 },
            { x1: -3, y1: -9,  cx1: -12, cy1: -14, tx: -20, ty: -12, cx2: -14, cy2: -10, tx2: -8, ty2: -8  },
            { x1: -3, y1: -8,  cx1: -12, cy1: -9,  tx: -18, ty: -5,  cx2: -13, cy2: -6,  tx2: -7, ty2: -6  },
            { x1: -2, y1: -7,  cx1: -10, cy1: -5,  tx: -15, ty: 0,   cx2: -11, cy2: -2,  tx2: -5, ty2: -4  },
            { x1: -2, y1: -6,  cx1: -8,  cy1: -2,  tx: -12, ty: 4,   cx2: -8,  cy2: 1,   tx2: -4, ty2: -3  }
          ];

          primaryFeathers.forEach((pf) => {
            wCtx.fillStyle = 'rgba(40, 10, 60, 0.18)';
            wCtx.beginPath();
            wCtx.moveTo(pf.x1 + 0.3, pf.y1 + 0.5);
            wCtx.quadraticCurveTo(pf.cx1 + 0.3, pf.cy1 + 0.5, pf.tx + 0.3, pf.ty + 0.5);
            wCtx.quadraticCurveTo(pf.cx2 + 0.3, pf.cy2 + 0.5, pf.tx2 + 0.3, pf.ty2 + 0.5);
            wCtx.closePath();
            wCtx.fill();

            const fGrad = wCtx.createLinearGradient(pf.x1, pf.y1, pf.tx, pf.ty);
            fGrad.addColorStop(0, '#FFFFFF');
            fGrad.addColorStop(0.35, '#FFFDF8');
            fGrad.addColorStop(0.75, '#F3E8FF');
            fGrad.addColorStop(1, '#D8BCFF');
            wCtx.fillStyle = fGrad;
            wCtx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            wCtx.lineWidth = 0.6;

            wCtx.beginPath();
            wCtx.moveTo(pf.x1, pf.y1);
            wCtx.quadraticCurveTo(pf.cx1, pf.cy1, pf.tx, pf.ty);
            wCtx.quadraticCurveTo(pf.cx2, pf.cy2, pf.tx2, pf.ty2);
            wCtx.closePath();
            wCtx.fill();
            wCtx.stroke();

            wCtx.strokeStyle = '#FFE082';
            wCtx.lineWidth = 0.5;
            wCtx.beginPath();
            wCtx.moveTo(pf.x1, pf.y1);
            wCtx.quadraticCurveTo((pf.x1 + pf.tx) * 0.55, (pf.y1 + pf.ty) * 0.55, pf.tx, pf.ty);
            wCtx.stroke();
          });

          // SECONDARY FEATHERS
          const secondaryFeathers = [
            { x1: -2, y1: -9,  cx1: -6, cy1: -15, tx: -13, ty: -16, cx2: -10, cy2: -12, tx2: -5, ty2: -9 },
            { x1: -3, y1: -8,  cx1: -7, cy1: -12, tx: -14, ty: -11, cx2: -10, cy2: -9,  tx2: -4, ty2: -8 },
            { x1: -3, y1: -7,  cx1: -7, cy1: -9,  tx: -12, ty: -5,  cx2: -8,  cy2: -6,  tx2: -4, ty2: -6 }
          ];

          secondaryFeathers.forEach((sf) => {
            const sGrad = wCtx.createLinearGradient(sf.x1, sf.y1, sf.tx, sf.ty);
            sGrad.addColorStop(0, '#FFFFFF');
            sGrad.addColorStop(0.5, '#FFFBF0');
            sGrad.addColorStop(1, '#EADAFF');
            wCtx.fillStyle = sGrad;
            wCtx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
            wCtx.lineWidth = 0.5;

            wCtx.beginPath();
            wCtx.moveTo(sf.x1, sf.y1);
            wCtx.quadraticCurveTo(sf.cx1, sf.cy1, sf.tx, sf.ty);
            wCtx.quadraticCurveTo(sf.cx2, sf.cy2, sf.tx2, sf.ty2);
            wCtx.closePath();
            wCtx.fill();
            wCtx.stroke();
          });

          // COVERTS
          wCtx.fillStyle = '#FFFFFF';
          wCtx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
          wCtx.lineWidth = 0.45;
          wCtx.beginPath();
          wCtx.ellipse(-4, -10, 5.0, 2.8, -Math.PI / 4, 0, Math.PI * 2);
          wCtx.fill();
          wCtx.stroke();

          wCtx.restore();
        }

        // Draw Wings
        ctx.save();
        drawRealisticAngelWing(ctx, 1);
        drawRealisticAngelWing(ctx, -1);
        ctx.restore();

        // 3. ✦ LUSCIOUS BRUNETTE JESSICA RABBIT HAIR (MID-BACK CASCADE - BACK LAYER) ✦
        ctx.fillStyle = '#230C03';
        const hairWave = Math.sin(wingPhase * 0.35) * 1.0;

        ctx.beginPath();
        ctx.moveTo(-3.5, -17);
        ctx.quadraticCurveTo(-9.0 + hairWave, -11, -8.0 + hairWave, -5.5);
        ctx.quadraticCurveTo(-5.5, -3.8, -2.0, -4.5);
        ctx.quadraticCurveTo(0, -3.5, 2.0, -4.5);
        ctx.quadraticCurveTo(5.0, -3.8, 7.0 + hairWave, -5.5);
        ctx.quadraticCurveTo(8.0 + hairWave, -11, 3.5, -17);
        ctx.closePath();
        ctx.fill();

        // Defined Chestnut & Warm Caramel Curl Waves
        ctx.strokeStyle = '#3F1908';
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.arc(-5.5 + hairWave, -9.5, 2.6, 0, Math.PI * 1.6);
        ctx.arc(-5.8 + hairWave, -5.5, 2.4, 0, Math.PI * 1.5);
        ctx.arc(5.0 + hairWave, -9.5, 2.4, 0, Math.PI * 1.6);
        ctx.stroke();

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-4.0 + hairWave, -13);
        ctx.quadraticCurveTo(-6.5 + hairWave, -8.5, -5.0 + hairWave, -5.0);
        ctx.stroke();

        // 4. Porcelain Neck, Shoulders & Seductive Décolletage
        ctx.fillStyle = '#FDECE0';
        ctx.beginPath();
        ctx.rect(-1.5, -16, 3.0, 5.2);
        ctx.fill();

        // 5. ✦ SEDUCTIVE METALLIC HALTER CORSET DRESS WITH DEEP PLUNGE ✦
        const corsetGrad = ctx.createLinearGradient(-4, -13, 4, 0);
        corsetGrad.addColorStop(0, '#1A0033');
        corsetGrad.addColorStop(0.35, '#800020'); // Signature ruby/burgundy Jessica Rabbit sheen
        corsetGrad.addColorStop(0.75, '#9D4EDD');
        corsetGrad.addColorStop(1, '#C77DFF');
        ctx.fillStyle = corsetGrad;

        // Plunging Sweetheart Bodice
        ctx.beginPath();
        ctx.moveTo(-3.5, -13);
        ctx.quadraticCurveTo(-1.8, -10.8, 0, -11.8);
        ctx.quadraticCurveTo(1.8, -10.8, 3.5, -13);
        ctx.lineTo(2.4, -6);
        ctx.lineTo(-2.4, -6);
        ctx.closePath();
        ctx.fill();

        // Halter Straps around Neck
        ctx.strokeStyle = '#800020';
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(-3.0, -13);
        ctx.lineTo(-1.0, -15.5);
        ctx.moveTo(3.0, -13);
        ctx.lineTo(1.0, -15.5);
        ctx.stroke();

        // Gold Filigree & Center Solfeggio Gem
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(-1.4, -10.5);
        ctx.lineTo(1.4, -7.5);
        ctx.moveTo(1.4, -10.5);
        ctx.lineTo(-1.4, -7.5);
        ctx.stroke();

        ctx.fillStyle = '#00FFC8';
        ctx.beginPath();
        ctx.arc(0, -6.5, 0.7, 0, Math.PI * 2);
        ctx.fill();

        // ✦ HIGH-SLIT SILK WRAP SKIRT (Jessica Rabbit Silhouette) ✦
        ctx.fillStyle = corsetGrad;
        ctx.beginPath();
        ctx.moveTo(-2.4, -6);
        ctx.lineTo(-5.0, 0.5);
        ctx.quadraticCurveTo(-1.6, 2.0, 1.0, -1.0); // High thigh slit
        ctx.lineTo(2.4, -6);
        ctx.closePath();
        ctx.fill();

        // 6. Legs & Seductive Metallic Stiletto High Heels
        if (isMoonwalking) {
          const stepSin = Math.sin(moonwalkPhase);
          ctx.fillStyle = '#FDECE0';

          const leftToePop = stepSin > 0;
          ctx.fillRect(-2.2, 0, 1.5, leftToePop ? 3.5 : 5.0);
          ctx.fillRect(0.7, 0, 1.5, leftToePop ? 5.0 : 3.5);

          // Metallic Ruby/Purple Stilettos
          ctx.fillStyle = '#9D4EDD';
          if (leftToePop) {
            ctx.beginPath();
            ctx.moveTo(-2.4, 3.2);
            ctx.lineTo(-0.7, 3.2);
            ctx.lineTo(-1.0, 6.2);
            ctx.lineTo(-2.9, 6.2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(-2.6, 3.4);
            ctx.lineTo(-2.6, 7.0);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(-2.4, 4.6);
            ctx.lineTo(-0.7, 4.6);
            ctx.lineTo(-1.0, 7.4);
            ctx.lineTo(-2.9, 7.4);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(-2.6, 4.8);
            ctx.lineTo(-2.6, 8.0);
            ctx.stroke();
          }

          if (!leftToePop) {
            ctx.beginPath();
            ctx.moveTo(0.7, 3.2);
            ctx.lineTo(2.4, 3.2);
            ctx.lineTo(2.1, 6.2);
            ctx.lineTo(0.2, 6.2);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(1.1, 3.4);
            ctx.lineTo(1.1, 7.0);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(0.7, 4.6);
            ctx.lineTo(2.4, 4.6);
            ctx.lineTo(2.1, 7.4);
            ctx.lineTo(0.2, 7.4);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(1.1, 4.8);
            ctx.lineTo(1.1, 8.0);
            ctx.stroke();
          }

          // Friction Sparks
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(leftToePop ? -1.0 : 2.1, 7.4, 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else if (isPerched) {
          ctx.fillStyle = '#FDECE0';
          ctx.fillRect(-2.2, 0, 1.5, 4.8);
          ctx.fillRect(0.7, 0, 1.5, 4.8);

          // Metallic Ruby/Purple Stiletto Shoes
          ctx.fillStyle = '#9D4EDD';
          ctx.beginPath();
          ctx.moveTo(-2.4, 4.2);
          ctx.lineTo(-0.7, 4.2);
          ctx.lineTo(-1.0, 7.0);
          ctx.lineTo(-2.9, 7.0);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(-2.6, 4.4);
          ctx.lineTo(-2.6, 7.8);
          ctx.stroke();

          ctx.fillStyle = '#9D4EDD';
          ctx.beginPath();
          ctx.moveTo(0.7, 4.2);
          ctx.lineTo(2.4, 4.2);
          ctx.lineTo(2.1, 7.0);
          ctx.lineTo(0.2, 7.0);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(1.1, 4.4);
          ctx.lineTo(1.1, 7.8);
          ctx.stroke();

          // Heel Sparks
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-2.6, 7.8, 0.6, 0, Math.PI * 2);
          ctx.arc(1.1, 7.8, 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Flight mode pointed stilettos
          ctx.fillStyle = '#FDECE0';
          ctx.beginPath();
          ctx.moveTo(-1.0, 0);
          ctx.lineTo(-2.4, 6.8);
          ctx.lineTo(-0.9, 7.4);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(1.5, 7.4);
          ctx.lineTo(2.7, 6.8);
          ctx.lineTo(1.0, 0);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#9D4EDD';
          ctx.fillRect(-2.5, 6.2, 1.8, 3.0);
          ctx.fillRect(1.2, 6.2, 1.8, 3.0);
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          ctx.moveTo(-2.2, 6.4);
          ctx.lineTo(-2.7, 9.4);
          ctx.moveTo(1.8, 6.4);
          ctx.lineTo(2.3, 9.4);
          ctx.stroke();
        }

        // 7. Head, Sculpted Face, Cat-Eye Eyes & Designer Glasses
        ctx.save();
        ctx.translate(0, -17);
        ctx.rotate(headAngle);

        // Porcelain Face with Contoured Jawline
        ctx.fillStyle = '#FDECE0';
        ctx.beginPath();
        ctx.ellipse(0, 0, 3.2, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rosy Cheeks
        ctx.fillStyle = 'rgba(255, 140, 170, 0.5)';
        ctx.beginPath();
        ctx.arc(-1.7, 0.7, 1.0, 0, Math.PI * 2);
        ctx.arc(1.7, 0.7, 1.0, 0, Math.PI * 2);
        ctx.fill();

        // Sultry Almond Cat-Eye Eyes with Violet Irises
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(-1.9, -0.2, 0.8, 0.5, 0, 0, Math.PI * 2);
        ctx.ellipse(1.9, -0.2, 0.8, 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5A2A7A';
        ctx.beginPath();
        ctx.arc(-1.9, -0.2, 0.4, 0, Math.PI * 2);
        ctx.arc(1.9, -0.2, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Smokey Winged Eyeliner
        ctx.strokeStyle = '#1E0A2D';
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(-2.8, -0.5);
        ctx.lineTo(-1.2, -0.2);
        ctx.moveTo(2.8, -0.5);
        ctx.lineTo(1.2, -0.2);
        ctx.stroke();

        // Luscious Mauve/Berry Gloss Lips
        ctx.strokeStyle = '#C74D70';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 1.3, 1.3, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Designer Cat-Eye Glasses
        ctx.strokeStyle = '#1E0A2D';
        ctx.lineWidth = 0.28;
        ctx.beginPath();
        ctx.moveTo(-0.25, -0.2);
        ctx.quadraticCurveTo(-1.7, -1.5, -3.4, -1.2);
        ctx.quadraticCurveTo(-3.0, 0.9, -1.0, 0.7);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0.25, -0.2);
        ctx.quadraticCurveTo(1.7, -1.5, 3.4, -1.2);
        ctx.quadraticCurveTo(3.0, 0.9, 1.0, 0.7);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 0.22;
        ctx.beginPath();
        ctx.moveTo(-0.25, -0.2);
        ctx.lineTo(0.25, -0.2);
        ctx.stroke();

        // ✦ FRONT VOLUMINOUS CHOCOLATE CURLS & DRAMATIC SIDE-SWEEP (Jessica Rabbit Style) ✦
        ctx.fillStyle = '#230C03';
        ctx.beginPath();
        ctx.moveTo(-3.6, -1.2);
        ctx.quadraticCurveTo(-4.2, -5.0, 0, -5.0);
        ctx.quadraticCurveTo(4.0, -5.0, 3.6, -1.2);
        ctx.quadraticCurveTo(2.0, -3.4, 0, -3.4);
        ctx.quadraticCurveTo(-2.0, -3.4, -3.6, -1.2);
        ctx.closePath();
        ctx.fill();

        // Front Face-Framing Chocolate Ringlets cascading down across chest
        ctx.strokeStyle = '#3F1908';
        ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.moveTo(-3.2, -1.8);
        ctx.bezierCurveTo(-6.0, 1.8, -4.0, 5.0, -5.5, 8.0);
        ctx.moveTo(3.2, -1.8);
        ctx.bezierCurveTo(6.0, 1.8, 4.0, 5.0, 5.5, 8.0);
        ctx.stroke();

        // Rich Warm Honey/Caramel Highlights
        ctx.strokeStyle = '#934914';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-2.2, -3.6);
        ctx.quadraticCurveTo(0, -4.0, 2.2, -3.6);
        ctx.moveTo(-3.4, 0.6);
        ctx.quadraticCurveTo(-5.0, 3.6, -4.5, 7.0);
        ctx.moveTo(3.4, 0.6);
        ctx.quadraticCurveTo(5.0, 3.6, 4.5, 7.0);
        ctx.stroke();

        ctx.restore(); // end head

        // 8. Arms & Glamorous Pose
        ctx.strokeStyle = '#FDECE0';
        ctx.lineWidth = 1.0;
        ctx.lineCap = 'round';

        if (isMoonwalking) {
          ctx.beginPath();
          ctx.moveTo(-2.8, -11);
          ctx.lineTo(-4.2, -7.0);
          ctx.lineTo(-3.0, -3.0);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(2.8, -11);
          ctx.lineTo(7.0, -8.0);
          ctx.lineTo(9.0, -5.0);
          ctx.stroke();

          // Golden Starlight Wand
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(9.0, -5.0);
          ctx.lineTo(13.5, -10.0);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(14.0, -10.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (wandSpread > 0) {
          ctx.beginPath();
          ctx.moveTo(-2.8, -11);
          ctx.lineTo(-6.5, -8.5);
          ctx.lineTo(-8.5, -5.5);
          ctx.stroke();
          ctx.fillStyle = '#FDECE0';
          ctx.beginPath();
          ctx.arc(-8.7, -5.2, 0.7, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(2.8, -11);
          ctx.lineTo(6.5, -8.5);
          ctx.lineTo(8.5, -5.5);
          ctx.stroke();

          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(8.5, -5.2);
          ctx.lineTo(13.0, -10.5);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(13.5, -11.0, 1.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(-2.8, -11);
          ctx.lineTo(-4.8, -5.5);
          ctx.moveTo(2.8, -11);
          ctx.lineTo(4.8, -5.5);
          ctx.stroke();
        }

        ctx.restore();
      }

      heroAnimId = requestAnimationFrame(render);
    }

    // ═══════════════════════════════════════════════
    // HIGH-PERFORMANCE PHOTOREALISTIC TINKERBELL DRAW ENGINE
    // ═══════════════════════════════════════════════
    function drawPhotorealisticTinkerbell(ctx, p, now) {
      ctx.save();
      ctx.translate(p.x, p.y);
      const scale = p.z || 1;
      ctx.scale(scale, scale);
      
      const heading = Math.atan2(p.vy || 0, p.vx || 1);
      ctx.rotate(heading * 0.2);

      const flap = Math.sin(p.wingPhase || 0);
      const pulse = 1 + Math.sin(p.fireflyPulse || 0) * 0.22;
      const s = p.size;

      // 1. Soft Volumetric Stardust Aura
      const aura = ctx.createRadialGradient(0, 0, 1, 0, 0, s * 3.4 * pulse);
      aura.addColorStop(0, p.palette.aura);
      aura.addColorStop(0.45, p.palette.aura.replace(/[\d\.]+\)$/, '0.30)'));
      aura.addColorStop(1, 'transparent');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, s * 3.4 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Photorealistic Gossamer Wings
      function drawWingSide(flip) {
        ctx.save();
        ctx.scale(flip * flap, 1);

        const wg = ctx.createLinearGradient(0, 0, -s * 2.5, -s * 1.5);
        wg.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        wg.addColorStop(0.4, p.palette.wing);
        wg.addColorStop(1, 'rgba(0, 229, 212, 0.25)');

        ctx.fillStyle = wg;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.2);
        ctx.bezierCurveTo(-s * 0.8, -s * 1.4, -s * 2.2, -s * 1.8, -s * 2.4, -s * 0.8);
        ctx.bezierCurveTo(-s * 2.1, s * 0.1, -s * 0.9, s * 0.3, 0, -s * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Lower Wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s * 0.6, s * 0.3, -s * 1.5, s * 1.0, -s * 1.2, s * 1.4);
        ctx.bezierCurveTo(-s * 0.8, s * 1.3, -s * 0.3, s * 0.6, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      drawWingSide(1);
      drawWingSide(-1);

      // 3. Graceful Silhouette
      ctx.fillStyle = '#FFFFFF';

      // Head & Topknot Bun
      ctx.beginPath();
      ctx.arc(0, -s * 0.6, s * 0.22, 0, Math.PI * 2);
      ctx.arc(s * 0.08, -s * 0.85, s * 0.14, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.beginPath();
      ctx.moveTo(-s * 0.18, -s * 0.4);
      ctx.lineTo(s * 0.18, -s * 0.4);
      ctx.lineTo(s * 0.24, s * 0.15);
      ctx.lineTo(0, s * 0.35);
      ctx.lineTo(-s * 0.24, s * 0.15);
      ctx.closePath();
      ctx.fill();

      // Legs
      ctx.beginPath();
      ctx.moveTo(-s * 0.08, s * 0.3);
      ctx.quadraticCurveTo(-s * 0.15, s * 0.7, -s * 0.05, s * 1.05);
      ctx.lineTo(-s * 0.02, s * 1.05);
      ctx.moveTo(s * 0.08, s * 0.3);
      ctx.quadraticCurveTo(s * 0.18, s * 0.75, s * 0.12, s * 1.15);
      ctx.lineTo(s * 0.15, s * 1.15);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Heart Core with Soft Halo
      const heartHalo = ctx.createRadialGradient(0, -s * 0.1, 0, 0, -s * 0.1, s * 0.8);
      heartHalo.addColorStop(0, p.palette.firefly);
      heartHalo.addColorStop(0.5, p.palette.aura);
      heartHalo.addColorStop(1, 'transparent');
      ctx.fillStyle = heartHalo;
      ctx.beginPath();
      ctx.arc(0, -s * 0.1, s * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, -s * 0.1, s * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.restore();
    }

    // ═══════════════════════════════════════════════
    // FOOTER ULTRA-SMOOTH CELESTIAL CANVAS ENGINE
    // ═══════════════════════════════════════════════
    const footerCanvas = document.getElementById('footer-celestial-canvas');
    if (footerCanvas) {
      const fCtx = footerCanvas.getContext('2d', { alpha: true });
      let fw, fh;
      let isFooterVisible = false;
      let footerAnimId = null;
      const fPixies = [];
      const fMeteors = [];
      const fEmbers = [];
      let lastFMeteor = performance.now();

      function fResize() {
        fw = footerCanvas.width = footerCanvas.offsetWidth || window.innerWidth;
        fh = footerCanvas.height = footerCanvas.offsetHeight || 340;
      }
      fResize();
      window.addEventListener('resize', fResize, { passive: true });

      // Pause footer canvas when scrolled away (saves massive GPU on main content)
      if ('IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver((entries) => {
          isFooterVisible = entries[0].isIntersecting;
          if (isFooterVisible && !footerAnimId) {
            footerAnimId = requestAnimationFrame(renderFooter);
          }
        }, { threshold: 0.05 });
        footerObserver.observe(footerCanvas);
      }

      const fPalettes = [
        { core: '#FFFFFF', firefly: '#FFD700', aura: 'rgba(255, 215, 0, 0.85)', wing: 'rgba(255, 245, 180, 0.85)', dust: '#FFD700' },
        { core: '#FFFFFF', firefly: '#00FFC8', aura: 'rgba(0, 255, 200, 0.85)', wing: 'rgba(122, 255, 227, 0.85)', dust: '#00FFC8' },
        { core: '#FFFFFF', firefly: '#00E5D4', aura: 'rgba(0, 229, 212, 0.85)', wing: 'rgba(163, 255, 248, 0.85)', dust: '#38FFF0' },
        { core: '#FFFFFF', firefly: '#C77DFF', aura: 'rgba(199, 125, 255, 0.85)', wing: 'rgba(224, 170, 255, 0.85)', dust: '#E0AAFF' }
      ];

      for (let i = 0; i < 8; i++) {
        fPixies.push({
          x: Math.random() * (fw || window.innerWidth),
          y: Math.random() * (fh || 340),
          vx: (Math.random() - 0.5) * 2.0,
          vy: (Math.random() - 0.5) * 1.5,
          targetX: Math.random() * (fw || window.innerWidth),
          targetY: Math.random() * (fh || 340),
          wingPhase: Math.random() * Math.PI * 2,
          wingSpeed: 0.6 + Math.random() * 0.3,
          fireflyPulse: Math.random() * Math.PI * 2,
          fireflySpeed: 0.05,
          size: 8 + Math.random() * 5,
          palette: fPalettes[i % fPalettes.length],
          z: 0.8 + Math.random() * 0.3
        });
      }

      for (let i = 0; i < 22; i++) {
        fEmbers.push({
          x: Math.random() * (fw || window.innerWidth),
          y: Math.random() * (fh || 340),
          radius: 0.8 + Math.random() * 2.0,
          phase: Math.random() * Math.PI * 2,
          vy: -(0.2 + Math.random() * 0.35),
          vx: (Math.random() - 0.5) * 0.2,
          color: ['#FFD700', '#00FFC8', '#00E5D4', '#C77DFF'][Math.floor(Math.random() * 4)]
        });
      }

      function spawnFMeteor() {
        if (fMeteors.length >= 4) return;
        fMeteors.push({
          x: Math.random() * (fw * 1.2),
          y: -20,
          length: 90 + Math.random() * 120,
          speed: 13 + Math.random() * 16,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
          color: ['#00FFC8', '#FFD700', '#C77DFF', '#FFFFFF'][Math.floor(Math.random() * 4)],
          alpha: 1.0
        });
      }

      function renderFooter(now) {
        if (!fCtx || !isFooterVisible) {
          footerAnimId = null;
          return;
        }
        fCtx.clearRect(0, 0, fw, fh);

        // Meteors
        if (now - lastFMeteor > 1800) {
          spawnFMeteor();
          lastFMeteor = now;
        }

        fCtx.globalCompositeOperation = 'lighter';
        for (let i = fMeteors.length - 1; i >= 0; i--) {
          const m = fMeteors[i];
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.alpha -= 0.026;

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
          fCtx.lineWidth = 2.0;
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

        // Photorealistic Tinkerbell Fairies in Footer
        fPixies.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.wingPhase += p.wingSpeed;
          p.fireflyPulse += p.fireflySpeed;

          if (p.x < 20 || p.x > fw - 20) p.vx *= -1;
          if (p.y < 20 || p.y > fh - 20) p.vy *= -1;

          drawPhotorealisticTinkerbell(fCtx, p, now);
        });

        footerAnimId = requestAnimationFrame(renderFooter);
      }
    }

    // ─── SPARKLE CURSOR TRAIL (GPU-Accelerated & Throttled) ──────
    const sparkleColors = ['#FFD700', '#00FFC8', '#00E5D4', '#38FFF0', '#C77DFF'];
    let lastSparkle = 0;
    let activeSparkleCount = 0;

    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSparkle < 55 || activeSparkleCount >= 18) return;
      lastSparkle = now;
      activeSparkleCount++;

      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      const size = 5 + Math.random() * 8;
      const sx   = (Math.random() - 0.5) * 40;
      const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

      sparkle.style.cssText = `
        left: ${e.clientX + (Math.random() - 0.5) * 14}px;
        top:  ${e.clientY + (Math.random() - 0.5) * 14}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        color: ${color};
        --sx: ${sx}px;
      `;
      document.body.appendChild(sparkle);
      setTimeout(() => {
        sparkle.remove();
        activeSparkleCount--;
      }, 1000);
    }, { passive: true });

    // ─── HOLLYWOOD-GRADE 3D TILT (Zero Layout Thrashing) ───
    let isUserScrolling = false;
    let scrollTimeout = null;

    window.addEventListener('scroll', () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { isUserScrolling = false; }, 80);
    }, { passive: true });

    const tiltCards = document.querySelectorAll('.service-card, .merch-card, .testimonial-card, .notes-step, .pricing-card, .about__image-frame');
    tiltCards.forEach(card => {
      let cachedBounds = null;

      function rotateToMouse(e) {
        if (isUserScrolling || !cachedBounds) return;
        const leftX = e.clientX - cachedBounds.x;
        const topY = e.clientY - cachedBounds.y;
        const center = {
          x: leftX - cachedBounds.width / 2,
          y: topY - cachedBounds.height / 2
        };
        
        card.style.transform = `
          perspective(1000px)
          scale3d(1.02, 1.02, 1.02)
          rotateX(${-center.y / 18}deg)
          rotateY(${center.x / 18}deg)
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
        glare.style.background = `radial-gradient(circle at ${(leftX / cachedBounds.width) * 100}% ${(topY / cachedBounds.height) * 100}%, rgba(255, 255, 255, 0.22) 0%, rgba(0, 229, 212, 0.12) 30%, transparent 65%)`;
      }

      function removeListener() {
        card.style.transform = '';
        cachedBounds = null;
        const glare = card.querySelector('.card-specular-glare');
        if (glare) glare.style.opacity = '0';
      }

      card.addEventListener('mouseenter', () => {
        cachedBounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.1s ease-out';
      }, { passive: true });

      card.addEventListener('mousemove', rotateToMouse, { passive: true });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)';
        removeListener();
      }, { passive: true });
    });

    // ─── MAGNETIC CTA BUTTONS (Cached Bounding Rect) ─────────
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-inquire, .cart-toggle-btn');
    magneticBtns.forEach(btn => {
      let btnRect = null;
      btn.addEventListener('mouseenter', () => {
        btnRect = btn.getBoundingClientRect();
        btn.style.transition = 'transform 0.1s ease-out';
      }, { passive: true });

      btn.addEventListener('mousemove', (e) => {
        if (!btnRect) btnRect = btn.getBoundingClientRect();
        const x = e.clientX - btnRect.left - btnRect.width / 2;
        const y = e.clientY - btnRect.top - btnRect.height / 2;
        btn.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0) scale(1.04)`;
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        btnRect = null;
      }, { passive: true });
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

        // Swap product image if data-img is present
        const newImgSrc = dot.getAttribute('data-img');
        if (newImgSrc) {
          const card = dot.closest('.merch-card, .merch-page-card');
          const img = card?.querySelector('.merch-card__img, .merch-page-card__img');
          if (img) {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '0.4';
            const tempImg = new Image();
            tempImg.onload = () => {
              img.src = newImgSrc;
              img.style.opacity = '1';
            };
            tempImg.onerror = () => {
              img.style.opacity = '1';
            };
            tempImg.src = newImgSrc;
          }
        }
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

    // ─── CELESTIAL WEB AUDIO ENGINE (Crystal Solfeggio Chimes) ────
    class CelestialAudioEngine {
      constructor() {
        this.ctx = null;
        this.enabled = false; // OFF by default as requested by user
        this.currentFreq = 528;
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
      playChime(freq = this.currentFreq, duration = 2.2, force = false) {
        // Only play if enabled or explicitly forced by user action
        if (!this.enabled && !force) return;
        try {
          this.init();
          if (!this.ctx) return;
          if (this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
          const now = this.ctx.currentTime;

          // Fundamental Solfeggio Tone
          const osc1 = this.ctx.createOscillator();
          const gain1 = this.ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(freq, now);
          gain1.gain.setValueAtTime(0.14, now);
          gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
          osc1.connect(gain1);
          gain1.connect(this.ctx.destination);
          osc1.start(now);
          osc1.stop(now + duration);

          // Ethereal Crystal Harmonic Overtone
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(freq * 2, now);
          gain2.gain.setValueAtTime(0.045, now);
          gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.8);
          osc2.connect(gain2);
          gain2.connect(this.ctx.destination);
          osc2.start(now);
          osc2.stop(now + duration * 0.8);
        } catch(e) {}
      }
      playGlissando() {
        if (!this.enabled) return;
        [528, 639, 741, 852, 963].forEach((f, idx) => {
          setTimeout(() => this.playChime(f, 1.8, true), idx * 90);
        });
      }
    }

    window.celestialAudio = new CelestialAudioEngine();

    // ─── GLOBAL INTERACTIVE CLICK CHIME LISTENER ──────
    document.addEventListener('click', (e) => {
      const interactive = e.target.closest('button, a, .merch-card, .service-card, .quiz-btn, .color-dot, .size-pill, .faq-question, .chakra-btn, .sound-modal-freq-card');
      if (interactive && window.celestialAudio.enabled) {
        window.celestialAudio.playChime();
      }
    });

    // ─── CELESTIAL SOUND FREQUENCY SELECTOR POPUP MODAL ─────
    const soundModal = document.getElementById('sound-modal');
    const openSoundModalBtn = document.getElementById('open-sound-modal-btn');
    const openSoundModalMobileBtn = document.getElementById('open-sound-modal-mobile-btn');
    const closeSoundModalBtn = document.getElementById('close-sound-modal-btn');
    const soundMuteToggleBtn = document.getElementById('toggle-sound-mute-btn');
    const testChimeBtn = document.getElementById('test-sound-chime-btn');
    const navFreqLabel = document.getElementById('nav-sound-freq-label');
    const navFreqMobileLabel = document.getElementById('nav-sound-freq-mobile-label');
    const soundModalGrid = document.getElementById('sound-modal-grid');

    const updateAudioUIState = () => {
      const muteIcon = document.getElementById('sound-mute-icon');
      const muteText = document.getElementById('sound-mute-text');
      if (window.celestialAudio.enabled) {
        if (muteIcon) muteIcon.textContent = '🔔';
        if (muteText) muteText.textContent = 'Chimes Active';
        if (navFreqLabel) navFreqLabel.textContent = `${window.celestialAudio.currentFreq} Hz`;
        if (navFreqMobileLabel) navFreqMobileLabel.textContent = `${window.celestialAudio.currentFreq} Hz`;
      } else {
        if (muteIcon) muteIcon.textContent = '🔕';
        if (muteText) muteText.textContent = 'Chimes Off (Click to Enable)';
        if (navFreqLabel) navFreqLabel.textContent = 'Sound';
        if (navFreqMobileLabel) navFreqMobileLabel.textContent = 'Sound (Off)';
      }
    };
    updateAudioUIState();

    const openSoundModal = () => {
      soundModal?.classList.add('active');
    };

    const closeSoundModal = () => {
      soundModal?.classList.remove('active');
    };

    openSoundModalBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openSoundModal();
    });

    openSoundModalMobileBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openSoundModal();
    });

    closeSoundModalBtn?.addEventListener('click', closeSoundModal);

    soundModal?.addEventListener('click', (e) => {
      if (e.target === soundModal) closeSoundModal();
    });

    // Frequency Card Selection (Auto-enables chime)
    soundModalGrid?.querySelectorAll('.sound-modal-freq-card').forEach(card => {
      card.addEventListener('click', () => {
        soundModalGrid.querySelectorAll('.sound-modal-freq-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const freq = parseInt(card.getAttribute('data-freq') || '528', 10);
        window.celestialAudio.currentFreq = freq;
        window.celestialAudio.enabled = true;
        updateAudioUIState();
        window.celestialAudio.playChime(freq);
        showToast(`✨ Solfeggio Tuned to ${freq}Hz (Chimes Active)`);
      });
    });

    // Mute / Unmute Toggle
    soundMuteToggleBtn?.addEventListener('click', () => {
      window.celestialAudio.enabled = !window.celestialAudio.enabled;
      updateAudioUIState();
      if (window.celestialAudio.enabled) {
        window.celestialAudio.playChime();
        showToast('🔔 Chimes Activated');
      } else {
        showToast('🔕 Chimes Muted');
      }
    });

    // Test Chime Button (Auto-enables chime)
    testChimeBtn?.addEventListener('click', () => {
      window.celestialAudio.enabled = true;
      updateAudioUIState();
      window.celestialAudio.playGlissando();
      showToast(`✨ Harmonizing at ${window.celestialAudio.currentFreq}Hz`);
    });

    // ─── INTUITIVE SOUL ALIGNMENT QUIZ ────────────────
    const quizStep1 = document.getElementById('quiz-step-1');
    const quizStep2 = document.getElementById('quiz-step-2');
    const quizResult = document.getElementById('quiz-result');
    const quizResTitle = document.getElementById('quiz-res-title');
    const quizResDesc = document.getElementById('quiz-res-desc');
    const quizResCta = document.getElementById('quiz-res-cta');
    const quizModalityIcon = document.getElementById('quiz-modality-icon');
    const quizModalityName = document.getElementById('quiz-modality-name');
    const quizModalityDesc = document.getElementById('quiz-modality-desc');
    const quizArtifactIcon = document.getElementById('quiz-artifact-icon');
    const quizArtifactName = document.getElementById('quiz-artifact-name');
    const quizArtifactDesc = document.getElementById('quiz-artifact-desc');
    const quizArtifactCta = document.getElementById('quiz-artifact-cta');
    let quizAnswers = {};

    document.querySelectorAll('.quiz-opt-1').forEach(btn => {
      btn.addEventListener('click', () => {
        quizAnswers.need = btn.getAttribute('data-val');
        quizStep1?.classList.remove('active');
        quizStep2?.classList.add('active');
        if (window.celestialAudio && window.celestialAudio.enabled) window.celestialAudio.playChime(639);
      });
    });

    document.querySelectorAll('.quiz-opt-2').forEach(btn => {
      btn.addEventListener('click', () => {
        quizAnswers.style = btn.getAttribute('data-val');
        quizStep2?.classList.remove('active');
        quizResult?.classList.add('active');
        if (window.celestialAudio && window.celestialAudio.enabled) window.celestialAudio.playGlissando();

        // Dynamic Recommendations: Modality + Sacred Store Artifact
        if (quizAnswers.need === 'mediumship') {
          quizResTitle.textContent = '🔮 Evidential Psychic Mediumship & Spirit Connection';
          quizResDesc.textContent = 'Your soul is calling for direct spiritual validation, heartfelt communion with departed loved ones, and divine confirmation of your life path.';
          
          if (quizModalityIcon) quizModalityIcon.textContent = '🔮';
          if (quizModalityName) quizModalityName.textContent = 'Evidential Mediumship Session';
          if (quizModalityDesc) quizModalityDesc.textContent = '1-on-1 private virtual reading bridging the veil to deliver evidential proof, sacred closure, and channeled messages.';
          if (quizResCta) {
            quizResCta.href = '#contact';
            quizResCta.textContent = '✨ Book Psychic Mediumship Session';
          }

          if (quizArtifactIcon) quizArtifactIcon.textContent = '👕';
          if (quizArtifactName) quizArtifactName.textContent = 'The Eye Believe Heavyweight Cotton Tee';
          if (quizArtifactDesc) quizArtifactDesc.textContent = 'Anointed organic heavyweight ritual garment featuring the sacred talisman embroidery ($48).';
          if (quizArtifactCta) {
            quizArtifactCta.href = '#merch';
            quizArtifactCta.setAttribute('data-target-product', 'tee');
          }
        } else if (quizAnswers.need === 'reiki') {
          quizResTitle.textContent = '✋ Restorative Reiki Energy Restructuring';
          quizResDesc.textContent = 'Your energetic field is ready to shed physical fatigue, dissolve energy cords, and restore luminous equilibrium across all 7 chakra centers.';
          
          if (quizModalityIcon) quizModalityIcon.textContent = '✋';
          if (quizModalityName) quizModalityName.textContent = 'Distance Reiki Healing Session';
          if (quizModalityDesc) quizModalityDesc.textContent = 'Multi-dimensional subtle-body purification, chakra cord clearing, and restorative biofield amplification.';
          if (quizResCta) {
            quizResCta.href = '#contact';
            quizResCta.textContent = '🌿 Book Reiki Energy Session';
          }

          if (quizArtifactIcon) quizArtifactIcon.textContent = '🧥';
          if (quizArtifactName) quizArtifactName.textContent = 'The Eye Believe Heavyweight Sweatshirt';
          if (quizArtifactDesc) quizArtifactDesc.textContent = 'Ultra-plush fleece sanctuary layer for post-session integration and daily warmth ($68).';
          if (quizArtifactCta) {
            quizArtifactCta.href = '#merch';
            quizArtifactCta.setAttribute('data-target-product', 'sweatshirt');
          }
        } else if (quizAnswers.need === 'tapping') {
          quizResTitle.textContent = '🌿 Somatic EFT Acupressure Tapping';
          quizResDesc.textContent = 'Rapid nervous system reprogramming to dissolve anxiety loops, release stored cellular tension, and establish sovereign grounded peace.';
          
          if (quizModalityIcon) quizModalityIcon.textContent = '🌿';
          if (quizModalityName) quizModalityName.textContent = 'EFT Tapping Solution Session';
          if (quizModalityDesc) quizModalityDesc.textContent = 'Clinical meridian acupressure protocols to clear chronic anxiety, fear triggers, and emotional overload.';
          if (quizResCta) {
            quizResCta.href = '#contact';
            quizResCta.textContent = '✨ Book EFT Tapping Session';
          }

          if (quizArtifactIcon) quizArtifactIcon.textContent = '🧢';
          if (quizArtifactName) quizArtifactName.textContent = 'The Eye Believe Classic Trucker Hat';
          if (quizArtifactDesc) quizArtifactDesc.textContent = 'Structured mesh crown with raised dimensional third-eye embroidery for outdoor protection ($34).';
          if (quizArtifactCta) {
            quizArtifactCta.href = '#merch';
            quizArtifactCta.setAttribute('data-target-product', 'hat');
          }
        } else {
          quizResTitle.textContent = '💌 Notes by Beth (Handwritten Channeled Letter)';
          quizResDesc.textContent = 'A sacred, tactile love note channeled directly for your soul, sealed in teal wax and infused with high-vibrational crystal blessings.';
          
          if (quizModalityIcon) quizModalityIcon.textContent = '💌';
          if (quizModalityName) quizModalityName.textContent = 'Notes by Beth Soul Letter';
          if (quizModalityDesc) quizModalityDesc.textContent = 'A bespoke physical channeled letter handwritten by Beth Elise on archival deckle-edge parchment ($28).';
          if (quizResCta) {
            quizResCta.href = '#notes';
            quizResCta.textContent = '💌 Order Your Soul Letter ($28)';
          }

          if (quizArtifactIcon) quizArtifactIcon.textContent = '✨';
          if (quizArtifactName) quizArtifactName.textContent = 'The Eye Believe Sacred Merch Collection';
          if (quizArtifactDesc) quizArtifactDesc.textContent = 'Complete your sacred space with physical ritual attire and protective apparel.';
          if (quizArtifactCta) {
            quizArtifactCta.href = '#merch';
            quizArtifactCta.setAttribute('data-target-product', 'all');
          }
        }

        // Scroll smoothly to result
        quizResult?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    // Handle physical artifact CTA click with store card highlight
    quizArtifactCta?.addEventListener('click', (e) => {
      e.preventDefault();
      const merchSection = document.getElementById('merch');
      if (merchSection) {
        merchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('🛍️ Navigated to Sacred Merch Store');
        const cards = merchSection.querySelectorAll('.merch-card');
        cards.forEach(card => {
          card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
          card.style.transform = 'scale(1.04)';
          card.style.boxShadow = '0 0 35px rgba(0, 229, 212, 0.8), 0 0 50px rgba(255, 215, 0, 0.5)';
          setTimeout(() => {
            card.style.transform = '';
            card.style.boxShadow = '';
          }, 2200);
        });
      }
    });

    document.getElementById('quiz-reset-btn')?.addEventListener('click', () => {
      quizResult?.classList.remove('active');
      quizStep1?.classList.add('active');
      quizAnswers = {};
    });

    // ─── BACK TO TOP BUTTON ───────────────────────────
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.celestialAudio.playChime(963, 'sine', 1.5);
      });
    }

    // ─── INTERACTIVE SEVEN CHAKRAS RESONANCE MAP ─────
    const sevenChakrasData = {
      crown: {
        name: 'Crown Chakra (Sahasrara)',
        sanskrit: 'Sahasrara',
        glyph: 'ॐ',
        freq: 963,
        color: '#C77DFF',
        glow: 'rgba(199, 125, 255, 0.6)',
        meta: '963 Hz · Pure Consciousness · Crown of Head',
        desc: 'The sacred portal to divine onepath, angelic guidance, and infinite spiritual illumination. Channeled message from Beth: You are unconditionally held by the cosmos. Release the need to micromanage every step—trust the divine timing currently unfolding in your life.',
        affirmation: '"I am one with divine cosmic light. I know my sacred soul path."'
      },
      thirdeye: {
        name: 'Third Eye Chakra (Ajna)',
        sanskrit: 'Ajna',
        glyph: 'ॐ',
        freq: 852,
        color: '#7289DA',
        glow: 'rgba(67, 97, 238, 0.6)',
        meta: '852 Hz · Light & Clairvoyance · Center of Brow',
        desc: 'Spiritual clairvoyance, prophetic knowing, and heightened intuitive vision. Channeled message from Beth: Your intuitive senses are expanding exponentially. Pay close attention to subtle synchronicities, recurring numbers, and your first immediate gut feelings.',
        affirmation: '"I see beyond the physical illusion. My intuition is crystal clear and trustworthy."'
      },
      throat: {
        name: 'Throat Chakra (Vishuddha)',
        sanskrit: 'Vishuddha',
        glyph: 'हं',
        freq: 741,
        color: '#00E5D4',
        glow: 'rgba(0, 229, 212, 0.6)',
        meta: '741 Hz · Sound & Ether · Vocal Throat Center',
        desc: 'Sovereign authentic expression and speaking your sacred truth without fear. Channeled message from Beth: Unspoken feelings create unnecessary physical neck and throat constriction. Give yourself permission to speak your desires with radiant clarity and compassionate grace.',
        affirmation: '"I speak my sacred truth with courage, loving kindness, and unshakeable poise."'
      },
      heart: {
        name: 'Heart Chakra (Anahata)',
        sanskrit: 'Anahata',
        glyph: 'यं',
        freq: 639,
        color: '#00FFC8',
        glow: 'rgba(0, 255, 200, 0.6)',
        meta: '639 Hz · Sacred Prana & Air · Center of Chest',
        desc: 'Unconditional love, soul-level forgiveness, and profound energetic restoration. Channeled message from Beth: Soften any protective energetic walls around your chest. You are safe to give and receive deep, nurturing love without fear of abandonment.',
        affirmation: '"I open my heart to unconditional love, deep forgiveness, and divine healing."'
      },
      solar: {
        name: 'Solar Plexus (Manipura)',
        sanskrit: 'Manipura',
        glyph: 'रं',
        freq: 528,
        color: '#FFD700',
        glow: 'rgba(255, 215, 0, 0.6)',
        meta: '528 Hz · Fire & Transformation · Upper Abdomen',
        desc: 'Personal sovereignty, gut willpower, and the miraculous 528 Hz transformation frequency. Channeled message from Beth: Step boldly into your self-worth. You already possess the inner strength and wisdom required to manifest your highest soul goals.',
        affirmation: '"I stand sovereign in my divine power. I am worthy, capable, and fearless."'
      },
      sacral: {
        name: 'Sacral Chakra (Svadhisthana)',
        sanskrit: 'Svadhisthana',
        glyph: 'वं',
        freq: 417,
        color: '#FF9E00',
        glow: 'rgba(255, 123, 0, 0.6)',
        meta: '417 Hz · Water & Emotional Flow · Lower Pelvis',
        desc: 'Sensual flow, artistic inspiration, and releasing past stagnation. Channeled message from Beth: Allow your emotions to move like gentle water rather than resisting the tide. Reconnect with playful joy, creativity, and the beautiful sensuousness of being alive.',
        affirmation: '"I feel deep passion, creative flow, and joyful abundance moving through me."'
      },
      root: {
        name: 'Root Chakra (Muladhara)',
        sanskrit: 'Muladhara',
        glyph: 'लं',
        freq: 396,
        color: '#FF5964',
        glow: 'rgba(230, 57, 70, 0.6)',
        meta: '396 Hz · Earth & Ancestral Safety · Base of Spine',
        desc: 'Ancestral grounding, physical safety, and releasing survival anxiety. Channeled message from Beth: You are rooted deeply into Mother Earth. Release fears around lack or instability—the universe is actively orchestrating security and sanctuary around you.',
        affirmation: '"I am safe, grounded, and deeply anchored into the abundant Earth."'
      }
    };

    let activeChakraKey = 'thirdeye';
    const chakraRows = document.querySelectorAll('.chakra-poster-row, .chakra-row');
    const chakraNodeBtns = document.querySelectorAll('.chakra-emblem-btn, .chakra-node-btn');
    const altarBox = document.querySelector('.chakra-poster-canvas, .chakra-poster-altar');
    const readingBox = document.getElementById('chakra-reading-box');
    const resGlyph = document.getElementById('chakra-res-glyph');
    const resTitle = document.getElementById('chakra-res-title');
    const resMeta = document.getElementById('chakra-res-meta');
    const resDesc = document.getElementById('chakra-res-desc');
    const resAffirm = document.getElementById('chakra-res-affirm');
    const resHzBtn = document.getElementById('chakra-res-hz-btn');
    const replayAudioBtn = document.getElementById('chakra-replay-audio-btn');

    function activateChakra(key, playAudio = true) {
      const data = sevenChakrasData[key];
      if (!data) return;
      activeChakraKey = key;

      // Update Hotspot and Row active states
      document.querySelectorAll('.chakra-hotspot-item, .chakra-poster-row, .chakra-row').forEach(el => {
        if (el.getAttribute('data-chakra') === key) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      document.querySelectorAll('.chakra-hotspot-node, .chakra-emblem-btn, .chakra-node-btn').forEach(btn => {
        if (btn.getAttribute('data-chakra') === key) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Altar Reading Card
      if (resTitle) {
        resTitle.textContent = data.name;
        resTitle.style.color = data.color;
      }
      if (resGlyph) {
        resGlyph.textContent = data.glyph;
        resGlyph.style.borderColor = data.color;
        resGlyph.style.boxShadow = `0 0 20px ${data.glow}`;
      }
      if (resMeta) resMeta.textContent = data.meta;
      if (resDesc) resDesc.textContent = data.desc;
      if (resAffirm) resAffirm.textContent = data.affirmation;
      if (resHzBtn) resHzBtn.textContent = `${data.freq} Hz`;

      if (readingBox) {
        readingBox.style.borderColor = data.color;
        readingBox.style.boxShadow = `0 20px 50px rgba(0,0,0,0.6), 0 0 35px ${data.glow}`;
      }

      if (altarBox) {
        altarBox.style.boxShadow = `0 35px 90px rgba(0, 0, 0, 0.8), 0 0 50px ${data.glow}`;
      }

      if (playAudio && window.celestialAudio) {
        window.celestialAudio.enabled = true;
        window.celestialAudio.currentFreq = data.freq;
        window.celestialAudio.init();
        if (window.celestialAudio.ctx && window.celestialAudio.ctx.state === 'suspended') {
          window.celestialAudio.ctx.resume();
        }
        window.celestialAudio.playChime(data.freq, 2.5);
        if (typeof updateAudioUIState === 'function') updateAudioUIState();
        showToast(`✨ ${data.name} Activated · ${data.freq} Hz Tone Playing`);
      }
    }

    // Direct Spinal Hotspot & Item Listeners
    document.querySelectorAll('.chakra-hotspot-item, .chakra-poster-row, .chakra-row').forEach(row => {
      row.addEventListener('click', () => {
        const key = row.getAttribute('data-chakra');
        activateChakra(key, true);
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const key = row.getAttribute('data-chakra');
          activateChakra(key, true);
        }
      });
    });

    document.querySelectorAll('.chakra-hotspot-node, .chakra-emblem-btn, .chakra-node-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-chakra');
        activateChakra(key, true);
      });
    });

    if (replayAudioBtn) {
      replayAudioBtn.addEventListener('click', () => {
        activateChakra(activeChakraKey, true);
      });
    }

    // ─── HERO CELESTIAL LOCATION POP-UP MODAL CONTROLLER ───
    const heroLocBadge = document.getElementById('hero-location-badge');
    const locationModalBackdrop = document.getElementById('location-modal-backdrop');
    const locModalCloseBtn = document.getElementById('loc-modal-close-btn');
    const locCardBtns = document.querySelectorAll('.loc-card-btn');

    function openLocationModal() {
      locationModalBackdrop?.classList.add('open');
      if (window.celestialAudio) window.celestialAudio.playChime(639, 1.0);
    }

    function closeLocationModal() {
      locationModalBackdrop?.classList.remove('open');
    }

    heroLocBadge?.addEventListener('click', (e) => {
      e.stopPropagation();
      openLocationModal();
    });

    locModalCloseBtn?.addEventListener('click', closeLocationModal);

    locationModalBackdrop?.addEventListener('click', (e) => {
      if (e.target === locationModalBackdrop) {
        closeLocationModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && locationModalBackdrop?.classList.contains('open')) {
        closeLocationModal();
      }
    });

    function setCelestialLocation(name, lat, lng, btnEl = null) {
      window.celestialLocation = { name, lat, lng };
      if (typeof updateMoonUI === 'function') updateMoonUI();
      if (typeof emitPixieDust === 'function' && typeof currentMoonX !== 'undefined') {
        emitPixieDust(currentMoonX, currentMoonY, 30, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF']);
      }
      
      locCardBtns.forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');

      if (window.celestialAudio) window.celestialAudio.playChime(528, 1.5);
      showToast(`🌙 Celestial Node Aligned: ${name}`);

      setTimeout(() => {
        closeLocationModal();
      }, 350);
    }

    locCardBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const locKey = btn.getAttribute('data-loc');
        const locName = btn.getAttribute('data-name');
        const latVal = btn.getAttribute('data-lat');
        const lngVal = btn.getAttribute('data-lng');

        if (locKey === 'gps') {
          if ('geolocation' in navigator) {
            showToast('🛰️ Querying live GPS satellites for astronomical coordinates...');
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setCelestialLocation('Your Live GPS Sanctuary', lat, lng, btn);
              },
              (err) => {
                showToast('⚠️ GPS access denied. Reverting to Chapel in the Clouds.');
              },
              { timeout: 8000 }
            );
          } else {
            showToast('⚠️ Geolocation not supported in this browser.');
          }
        } else {
          setCelestialLocation(locName, parseFloat(latVal), parseFloat(lngVal), btn);
        }
      });
    });

    // ─── PRODUCT DETAIL LIGHTBOX MODAL CONTROLLER ─────
    const productModalBackdrop = document.getElementById('product-modal-backdrop');
    const productModalClose = document.getElementById('product-modal-close');
    const modalProductImg = document.getElementById('modal-product-img');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductTag = document.getElementById('modal-product-tag');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductDesc = document.getElementById('modal-product-desc');
    const modalColorSection = document.getElementById('modal-color-section');
    const modalColorLabel = document.getElementById('modal-color-label');
    const modalColorSwatches = document.getElementById('modal-color-swatches');
    const modalSizeSection = document.getElementById('modal-size-section');
    const modalSizeLabel = document.getElementById('modal-size-label');
    const modalSizePills = document.getElementById('modal-size-pills');
    const modalAddCartBtn = document.getElementById('modal-add-cart-btn');

    let activeModalProduct = null;

    window.openProductModalFromCard = function(triggerEl) {
      const card = triggerEl.closest('.merch-card, .merch-page-card');
      if (!card) return;

      const name = card.querySelector('.merch-card__name, .merch-page-card__name')?.textContent?.trim() || 'Sacred Item';
      const tag = card.querySelector('.merch-card__tag, .merch-page-card__tag')?.textContent?.trim() || 'Sacred Offering';
      const price = card.querySelector('.merch-card__price, .merch-page-card__price')?.textContent?.trim() || '$38.00';
      const desc = card.querySelector('.merch-card__desc, .merch-page-card__desc')?.textContent?.trim() || '';
      const img = card.querySelector('img')?.getAttribute('src') || 'images/merch-eye-believe-lavender.jpg';

      // Colors
      const colorDots = Array.from(card.querySelectorAll('.color-dot'));
      const sizePills = Array.from(card.querySelectorAll('.size-pill'));

      activeModalProduct = {
        name,
        price: parseFloat(price.replace(/[^0-9\.]+/g, '')) || 0,
        img,
        selectedColor: colorDots.find(d => d.classList.contains('active'))?.getAttribute('title') || '',
        selectedSize: sizePills.find(s => s.classList.contains('active'))?.textContent?.trim() || ''
      };

      if (modalProductName) modalProductName.textContent = name;
      if (modalProductTag) modalProductTag.textContent = tag;
      if (modalProductPrice) modalProductPrice.textContent = price;
      if (modalProductDesc) modalProductDesc.textContent = desc;
      if (modalProductImg) modalProductImg.src = img;

      // Render Swatches in Modal
      if (modalColorSwatches) {
        if (colorDots.length > 0) {
          modalColorSection.style.display = 'flex';
          modalColorSwatches.innerHTML = colorDots.map(dot => {
            const bg = dot.style.background;
            const title = dot.getAttribute('title') || '';
            const dotImg = dot.getAttribute('data-img') || img;
            const isActive = dot.classList.contains('active') ? 'active' : '';
            return `<span class="color-dot ${isActive}" style="background: ${bg};" title="${title}" data-img="${dotImg}"></span>`;
          }).join('');

          if (modalColorLabel) modalColorLabel.textContent = activeModalProduct.selectedColor || 'Classic';

          // Swatch click inside modal
          modalColorSwatches.querySelectorAll('.color-dot').forEach(swatch => {
            swatch.addEventListener('click', () => {
              modalColorSwatches.querySelectorAll('.color-dot').forEach(s => s.classList.remove('active'));
              swatch.classList.add('active');
              const newTitle = swatch.getAttribute('title') || '';
              const newImg = swatch.getAttribute('data-img');
              if (modalColorLabel) modalColorLabel.textContent = newTitle;
              if (modalProductImg && newImg) modalProductImg.src = newImg;
              activeModalProduct.selectedColor = newTitle;
              activeModalProduct.img = newImg;
            });
          });
        } else {
          modalColorSection.style.display = 'none';
        }
      }

      // Render Sizes in Modal
      if (modalSizePills) {
        if (sizePills.length > 0) {
          modalSizeSection.style.display = 'flex';
          modalSizePills.innerHTML = sizePills.map(pill => {
            const text = pill.textContent.trim();
            const isActive = pill.classList.contains('active') ? 'active' : '';
            return `<span class="size-pill ${isActive}">${text}</span>`;
          }).join('');

          if (modalSizeLabel) modalSizeLabel.textContent = activeModalProduct.selectedSize;

          modalSizePills.querySelectorAll('.size-pill').forEach(pill => {
            pill.addEventListener('click', () => {
              modalSizePills.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
              pill.classList.add('active');
              const newSize = pill.textContent.trim();
              if (modalSizeLabel) modalSizeLabel.textContent = newSize;
              activeModalProduct.selectedSize = newSize;
            });
          });
        } else {
          modalSizeSection.style.display = 'none';
        }
      }

      productModalBackdrop?.classList.add('open');
      if (window.celestialAudio) window.celestialAudio.playChime(741, 1.2);
    };

    // Close modal handlers
    productModalClose?.addEventListener('click', () => {
      productModalBackdrop?.classList.remove('open');
    });

    productModalBackdrop?.addEventListener('click', (e) => {
      if (e.target === productModalBackdrop) {
        productModalBackdrop.classList.remove('open');
      }
    });

    // Add to cart from inside Modal
    modalAddCartBtn?.addEventListener('click', () => {
      if (!activeModalProduct) return;
      let variant = '';
      if (activeModalProduct.selectedSize && activeModalProduct.selectedColor) {
        variant = `${activeModalProduct.selectedColor} · Size ${activeModalProduct.selectedSize}`;
      } else if (activeModalProduct.selectedSize) {
        variant = `Size: ${activeModalProduct.selectedSize}`;
      } else if (activeModalProduct.selectedColor) {
        variant = `Color: ${activeModalProduct.selectedColor}`;
      }

      window.addToSacredCart(
        activeModalProduct.name,
        activeModalProduct.price,
        activeModalProduct.img,
        variant
      );
      productModalBackdrop?.classList.remove('open');
    });

    // Make Card Images and Titles Clickable to Open Modal
    document.querySelectorAll('.merch-card__img, .merch-card__name').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        window.openProductModalFromCard(el);
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.openProductModalFromCard(el);
        }
      });
    });

    // ─── SACRED CART DRAWER CONTROLLER ───
    window.cartState = [];
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-drawer-items');
    const cartSubtotalVal = document.getElementById('cart-subtotal-val');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    const cartToggles = document.querySelectorAll('.cart-toggle-btn');
    const cartBadges = document.querySelectorAll('.cart-badge');

    function openCart() {
      cartDrawer?.classList.add('active');
      cartOverlay?.classList.add('active');
      if (window.celestialAudio) window.celestialAudio.playChime(528, 1.2);
    }

    function closeCart() {
      cartDrawer?.classList.remove('active');
      cartOverlay?.classList.remove('active');
    }

    cartToggles.forEach(btn => btn.addEventListener('click', openCart));
    cartCloseBtn?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    window.addToSacredCart = function(name, price, img, variant = '') {
      const existing = window.cartState.find(item => item.name === name && item.variant === variant);
      if (existing) {
        existing.qty += 1;
      } else {
        window.cartState.push({ name, price, img, variant, qty: 1 });
      }
      updateCartUI();
      openCart();
      showToast(`🛍️ Added ${name} to your Sacred Cart!`);
    };

    function updateCartUI() {
      const totalCount = window.cartState.reduce((sum, item) => sum + item.qty, 0);
      cartBadges.forEach(b => b.textContent = totalCount);

      if (!cartItemsContainer) return;

      if (window.cartState.length === 0) {
        cartItemsContainer.innerHTML = `
          <div style="text-align:center; padding:3rem 1rem; color:var(--cream-dim);">
            <div style="font-size:2.4rem; margin-bottom:0.75rem;">🛍️</div>
            <p style="font-family:var(--font-serif); font-style:italic; font-size:1.1rem; color:var(--gold);">Your sacred shopping bag is empty.</p>
            <p style="font-size:0.88rem; margin-top:0.5rem; opacity:0.8;">Explore our collection of enchanted garments and sacred offerings.</p>
          </div>
        `;
        if (cartSubtotalVal) cartSubtotalVal.textContent = '$0.00';
        return;
      }

      const total = window.cartState.reduce((sum, item) => sum + item.price * item.qty, 0);
      if (cartSubtotalVal) cartSubtotalVal.textContent = `$${total.toFixed(2)}`;

      cartItemsContainer.innerHTML = window.cartState.map((item, idx) => `
        <div class="cart-item-row" style="display:flex; gap:1rem; align-items:center; padding:0.85rem 0; border-bottom:1px solid rgba(255,215,0,0.15);">
          <img src="${item.img}" alt="${item.name}" style="width:64px; height:64px; border-radius:8px; object-fit:cover; border:1px solid rgba(255,215,0,0.25);" />
          <div style="flex:1;">
            <div style="font-family:var(--font-serif); font-weight:600; font-size:0.95rem; color:var(--cream);">${item.name}</div>
            ${item.variant ? `<div style="font-size:0.78rem; color:var(--gold); margin-top:2px;">${item.variant}</div>` : ''}
            <div style="font-size:0.85rem; color:var(--cyan); margin-top:3px;">$${item.price.toFixed(2)} × ${item.qty}</div>
          </div>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <button type="button" onclick="window.updateCartItemQty(${idx}, -1)" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:26px; height:26px; border-radius:4px; cursor:pointer;">-</button>
            <span style="font-size:0.9rem; font-weight:600; min-width:16px; text-align:center;">${item.qty}</span>
            <button type="button" onclick="window.updateCartItemQty(${idx}, 1)" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:26px; height:26px; border-radius:4px; cursor:pointer;">+</button>
            <button type="button" onclick="window.removeCartItem(${idx})" style="background:none; border:none; color:rgba(255,100,100,0.8); cursor:pointer; margin-left:4px;" title="Remove">🗑️</button>
          </div>
        </div>
      `).join('');
    }

    window.updateCartItemQty = function(idx, delta) {
      if (!window.cartState[idx]) return;
      window.cartState[idx].qty += delta;
      if (window.cartState[idx].qty <= 0) {
        window.cartState.splice(idx, 1);
      }
      updateCartUI();
    };

    window.removeCartItem = function(idx) {
      if (!window.cartState[idx]) return;
      window.cartState.splice(idx, 1);
      updateCartUI();
    };

    // ─── CHECKOUT MODAL & ADDRESS HANDLING ──────────
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal-btn');
    const checkoutForm = document.getElementById('checkout-order-form');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');

    // Cart checkout button opens Checkout Modal
    cartCheckoutBtn?.addEventListener('click', () => {
      if (window.cartState.length === 0) {
        showToast('🛍️ Your sacred bag is empty.');
        return;
      }
      const total = window.cartState.reduce((sum, item) => sum + item.price * item.qty, 0);
      if (checkoutTotalPrice) checkoutTotalPrice.textContent = `$${total.toFixed(2)}`;
      
      // Close cart drawer & open checkout modal
      cartDrawer?.classList.remove('active');
      cartOverlay?.classList.remove('active');
      checkoutModal?.classList.add('active');
      if (window.celestialAudio) window.celestialAudio.playChime(639);
    });

    closeCheckoutBtn?.addEventListener('click', () => {
      checkoutModal?.classList.remove('active');
    });

    checkoutModal?.addEventListener('click', (e) => {
      if (e.target === checkoutModal) checkoutModal.classList.remove('active');
    });

    // Toggle Billing Address in Checkout Modal
    const checkoutSameBilling = document.getElementById('checkout-same-billing');
    const checkoutBillingBox = document.getElementById('checkout-billing-box');
    checkoutSameBilling?.addEventListener('change', () => {
      if (checkoutBillingBox) {
        checkoutBillingBox.style.display = checkoutSameBilling.checked ? 'none' : 'block';
      }
    });

    // Toggle Billing Address in Notes by Beth Form
    const noteSameBilling = document.getElementById('note-same-billing');
    const noteBillingBox = document.getElementById('note-billing-box');
    noteSameBilling?.addEventListener('change', () => {
      if (noteBillingBox) {
        noteBillingBox.style.display = noteSameBilling.checked ? 'none' : 'block';
      }
    });

    // Checkout Form Submission
    checkoutForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('checkout-name')?.value.trim();
      const email = document.getElementById('checkout-email')?.value.trim();
      const street = document.getElementById('checkout-street')?.value.trim();
      const town = document.getElementById('checkout-town')?.value.trim();
      const state = document.getElementById('checkout-state')?.value;
      const zip = document.getElementById('checkout-zip')?.value.trim();

      if (!name || !email || !street || !town || !state || !zip) {
        showToast('⚠️ Please complete all required shipping address fields.');
        return;
      }

      if (checkoutSameBilling && !checkoutSameBilling.checked) {
        const bName = document.getElementById('checkout-billing-name')?.value.trim();
        const bStreet = document.getElementById('checkout-billing-street')?.value.trim();
        const bTown = document.getElementById('checkout-billing-town')?.value.trim();
        const bState = document.getElementById('checkout-billing-state')?.value;
        const bZip = document.getElementById('checkout-billing-zip')?.value.trim();
        if (!bName || !bStreet || !bTown || !bState || !bZip) {
          showToast('⚠️ Please complete all required billing address fields.');
          return;
        }
      }

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>✨</span> Processing Sacred Order...';
      }

      setTimeout(() => {
        if (window.celestialAudio) window.celestialAudio.playChime(963, 1.8);
        alert(`🌟 Sacred Order Confirmed!\n\nThank you, ${name}! Your order has been placed and will be lovingly packed and shipped to:\n${street}, ${town}, ${state} ${zip}.\n\nA confirmation has been sent to ${email}.`);
        window.cartState = [];
        updateCartUI();
        checkoutForm.reset();
        if (checkoutBillingBox) checkoutBillingBox.style.display = 'none';
        if (checkoutSameBilling) checkoutSameBilling.checked = true;
        checkoutModal?.classList.remove('active');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '✨ Complete & Confirm Sacred Order';
        }
      }, 1000);
    });

    // Notes by Beth Form Submission with separate address validation
    const notesForm = document.getElementById('notes-order-form');
    notesForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('note-sender-name')?.value.trim();
      const recipientName = document.getElementById('note-recipient-name')?.value.trim();
      const street = document.getElementById('note-street-address')?.value.trim();
      const town = document.getElementById('note-town')?.value.trim();
      const state = document.getElementById('note-state')?.value;
      const zip = document.getElementById('note-zip')?.value.trim();

      if (!senderName || !recipientName || !street || !town || !state || !zip) {
        showToast('⚠️ Please complete all recipient shipping address fields.');
        return;
      }

      if (noteSameBilling && !noteSameBilling.checked) {
        const bName = document.getElementById('note-billing-name')?.value.trim();
        const bStreet = document.getElementById('note-billing-street')?.value.trim();
        const bTown = document.getElementById('note-billing-town')?.value.trim();
        const bState = document.getElementById('note-billing-state')?.value;
        const bZip = document.getElementById('note-billing-zip')?.value.trim();
        if (!bName || !bStreet || !bTown || !bState || !bZip) {
          showToast('⚠️ Please complete all purchaser billing address fields.');
          return;
        }
      }

      const submitBtn = notesForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>✨</span> Channeling & Crafting Sacred Note...';
      }

      setTimeout(() => {
        if (window.celestialAudio) window.celestialAudio.playChime(963, 2.0);
        alert(`🌟 Sacred Love Note Ordered!\n\nThank you, ${senderName}! Beth Elise will personally meditate, channel, and handwrite your sacred letter on deckle parchment, sealed with wax and mailed directly to:\n${recipientName}\n${street}, ${town}, ${state} ${zip}.`);
        notesForm.reset();
        if (noteBillingBox) noteBillingBox.style.display = 'none';
        if (noteSameBilling) noteSameBilling.checked = true;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '✨ Complete & Send Sacred Love Note ($28.00)';
        }
      }, 1200);
    });

    // Global addToCart helper for onclick & event listeners
    window.addToCart = function(btn) {
      const card = btn.closest('.merch-card, .merch-page-card');
      if (!card) return;
      const name = card.querySelector('.merch-card__name, .merch-page-card__name')?.textContent?.trim() || 'Sacred Offering';
      const priceText = card.querySelector('.merch-card__price, .merch-page-card__price')?.textContent?.trim() || '$0';
      const price = parseFloat(priceText.replace(/[^0-9\.]+/g, '')) || 0;
      const img = card.querySelector('img')?.getAttribute('src') || 'images/merch-eye-believe-lavender.jpg';
      const sizeActive = card.querySelector('.size-pill.active')?.textContent?.trim();
      const colorActive = card.querySelector('.color-dot.active')?.getAttribute('title')?.trim();
      
      let variant = '';
      if (sizeActive && colorActive) variant = `${colorActive} · Size ${sizeActive}`;
      else if (sizeActive) variant = `Size: ${sizeActive}`;
      else if (colorActive) variant = `Color: ${colorActive}`;

      window.addToSacredCart(name, price, img, variant);
    };

    // Wire up all "Add to Sacred Cart" buttons
    document.querySelectorAll('.merch-card__btn, .merch-page-card__add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.addToCart(btn);
      });
    });

    updateCartUI();

    // ─── 3D EARTH-ROTATING PHOTOREALISTIC CRYSTAL BALL CANVAS ENGINE ───
    function initOracleRotatingCrystalBall() {
      const canvas = document.getElementById('oracle-crystal-ball-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const cx = cw * 0.5;
      const cy = ch * 0.5; // Perfectly centered spherical orb
      const sphereRadius = 215; // Fills entire containing circle!
      const earthTilt = 23.5 * (Math.PI / 180); // 23.5 deg axial Earth tilt

      // Load Photorealistic Assets
      const imgPano = new Image();
      imgPano.src = 'images/crystal_nebula_panorama.jpg';

      const imgSpec = new Image();
      imgSpec.src = 'images/crystal_glass_specular.png';

      // Generate 3D Spherical Cosmic Features (Constellations & Stardust)
      const celestialPoints = [];
      const numPoints = 280;

      for (let i = 0; i < numPoints; i++) {
        const u = Math.random();
        const v = Math.random();
        const lat = Math.acos(2 * u - 1) - Math.PI / 2;
        const lon = 2 * Math.PI * v;
        const r = sphereRadius * (0.45 + Math.random() * 0.52);
        const size = 1.4 + Math.random() * 3.2;
        const color = ['#FFFFFF', '#00FFC8', '#FFD700', '#C77DFF', '#E0AAFF', '#76FF03'][Math.floor(Math.random() * 6)];
        const isMajorStar = Math.random() > 0.8;
        celestialPoints.push({ lat, lon, r, size, color, isMajorStar });
      }

      let animId = null;

      function renderCrystalBall(now) {
        ctx.clearRect(0, 0, cw, ch);

        // Continuous planetary rotation like Earth
        const rotAngle = (now * 0.00065) % (Math.PI * 2);
        const pulse = 1.0 + Math.sin(now * 0.0025) * 0.12;

        ctx.save();

        // ─── 1. BASE VOLUMETRIC AURA (Transparent Multi-tier Radiant Halo) ───
        const auraGrad = ctx.createRadialGradient(cx, cy, sphereRadius * 0.2, cx, cy, sphereRadius * 1.35 * pulse);
        auraGrad.addColorStop(0, 'rgba(0, 255, 200, 0.45)');
        auraGrad.addColorStop(0.35, 'rgba(157, 78, 221, 0.35)');
        auraGrad.addColorStop(0.7, 'rgba(255, 215, 0, 0.2)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, sphereRadius * 1.35 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // ─── 2. PHOTOREALISTIC ROTATING COSMIC GALAXY SPHERE ───
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
        ctx.clip(); // Constrain internal 3D elements inside sphere

        // Base Deep Cosmos Glass Gradient
        const cosmosGrad = ctx.createRadialGradient(cx, cy - sphereRadius * 0.2, 0, cx, cy, sphereRadius);
        cosmosGrad.addColorStop(0, '#2D0052');
        cosmosGrad.addColorStop(0.4, '#1C0035');
        cosmosGrad.addColorStop(0.8, '#0E001A');
        cosmosGrad.addColorStop(1, '#05000C');
        ctx.fillStyle = cosmosGrad;
        ctx.fillRect(cx - sphereRadius, cy - sphereRadius, sphereRadius * 2, sphereRadius * 2);

        // Draw Photorealistic Rotating Panoramic Nebula Texture
        if (imgPano.complete && imgPano.naturalWidth > 0) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(earthTilt); // 23.5° axial Earth tilt

          const panoW = sphereRadius * 4;
          const panoH = sphereRadius * 2.2;
          const scrollSpeed = 0.035;
          const panoOffset = (now * scrollSpeed) % (panoW * 0.5);

          ctx.globalAlpha = 0.88 * pulse;
          ctx.drawImage(imgPano, -panoW * 0.5 - panoOffset, -panoH * 0.5, panoW, panoH);
          ctx.drawImage(imgPano, -panoW * 0.5 - panoOffset + panoW * 0.5, -panoH * 0.5, panoW, panoH);
          ctx.restore();
        }

        // Pulsing luminous core flare
        const coreNebula = ctx.createRadialGradient(cx + Math.sin(rotAngle) * 22, cy + Math.cos(rotAngle) * 16, 0, cx, cy, sphereRadius * 0.95);
        coreNebula.addColorStop(0, `rgba(255, 255, 255, ${0.92 * pulse})`);
        coreNebula.addColorStop(0.25, `rgba(0, 255, 200, ${0.8 * pulse})`);
        coreNebula.addColorStop(0.55, `rgba(199, 125, 255, ${0.7 * pulse})`);
        coreNebula.addColorStop(0.85, 'rgba(28, 0, 53, 0.4)');
        coreNebula.addColorStop(1, 'transparent');
        ctx.fillStyle = coreNebula;
        ctx.fillRect(cx - sphereRadius, cy - sphereRadius, sphereRadius * 2, sphereRadius * 2);

        // ─── 3. ROTATING 3D CELESTIAL STARDUST PARTICLES ───
        const projectedPoints = [];
        celestialPoints.forEach(pt => {
          const curLon = pt.lon + rotAngle;
          const x3 = pt.r * Math.cos(pt.lat) * Math.sin(curLon);
          const y3 = pt.r * Math.sin(pt.lat) * Math.cos(earthTilt) - pt.r * Math.cos(pt.lat) * Math.cos(curLon) * Math.sin(earthTilt);
          const z3 = pt.r * Math.cos(pt.lat) * Math.cos(curLon) * Math.cos(earthTilt) + pt.r * Math.sin(pt.lat) * Math.sin(earthTilt);

          if (z3 > -sphereRadius * 0.3) {
            projectedPoints.push({
              x: cx + x3,
              y: cy + y3,
              z: z3,
              size: pt.size,
              color: pt.color,
              isMajor: pt.isMajorStar,
              alpha: Math.max(0.2, Math.min(1.0, (z3 + sphereRadius * 0.3) / (sphereRadius * 1.3)))
            });
          }
        });

        projectedPoints.sort((a, b) => a.z - b.z);

        projectedPoints.forEach(p => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;

          if (p.isMajor) {
            const s = p.size * (1.2 + Math.sin(now * 0.003 + p.x) * 0.4);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - s * 2.2);
            ctx.lineTo(p.x + s * 0.3, p.y);
            ctx.lineTo(p.x, p.y + s * 2.2);
            ctx.lineTo(p.x - s * 0.3, p.y);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(p.x - s * 2.2, p.y);
            ctx.lineTo(p.x, p.y - s * 0.3);
            ctx.lineTo(p.x + s * 2.2, p.y);
            ctx.lineTo(p.x, p.y + s * 0.3);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        ctx.restore(); // Exit sphere clipping

        // ─── 4. PHOTOREALISTIC SPECULAR GLASS OVERLAY & FRESNEL RIM GLOW ───
        ctx.save();
        if (imgSpec.complete && imgSpec.naturalWidth > 0) {
          ctx.globalAlpha = 0.88;
          ctx.drawImage(imgSpec, cx - sphereRadius * 1.05, cy - sphereRadius * 1.05, sphereRadius * 2.1, sphereRadius * 2.1);
        }

        // Curved Optical Specular Highlight
        const hlX = cx - sphereRadius * 0.38;
        const hlY = cy - sphereRadius * 0.38;
        const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, sphereRadius * 0.45);
        hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        hlGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.65)');
        hlGrad.addColorStop(0.7, 'rgba(163, 255, 248, 0.25)');
        hlGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = hlGrad;
        ctx.beginPath();
        ctx.ellipse(hlX, hlY, sphereRadius * 0.36, sphereRadius * 0.22, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Secondary bottom specular reflection
        const bhlX = cx + sphereRadius * 0.32;
        const bhlY = cy + sphereRadius * 0.35;
        const bhlGrad = ctx.createRadialGradient(bhlX, bhlY, 0, bhlX, bhlY, sphereRadius * 0.3);
        bhlGrad.addColorStop(0, 'rgba(0, 255, 200, 0.55)');
        bhlGrad.addColorStop(0.6, 'rgba(199, 125, 255, 0.25)');
        bhlGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = bhlGrad;
        ctx.beginPath();
        ctx.ellipse(bhlX, bhlY, sphereRadius * 0.26, sphereRadius * 0.12, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // Fresnel Edge Rim Glow
        const rimGrad = ctx.createRadialGradient(cx, cy, sphereRadius * 0.82, cx, cy, sphereRadius);
        rimGrad.addColorStop(0, 'rgba(0, 229, 212, 0)');
        rimGrad.addColorStop(0.7, 'rgba(0, 255, 200, 0.45)');
        rimGrad.addColorStop(0.95, 'rgba(255, 255, 255, 0.95)');
        rimGrad.addColorStop(1, 'rgba(0, 229, 212, 0.85)');
        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        animId = requestAnimationFrame(renderCrystalBall);
      }

      animId = requestAnimationFrame(renderCrystalBall);
    }

    // Initialize 3D Rotating Crystal Ball
    initOracleRotatingCrystalBall();

    // ─── INTERACTIVE ORACLE CARD PULL WIDGET (Persistent Active Ball) ───
    const oracleCards = [
      { icon: '✦', title: 'The Sacred Glade', text: 'You are held in divine sanctuary. Surrender current worries to spirit; alignment and clarity are blossoming.' },
      { icon: '✧', title: 'Starlight Awakening', text: 'Your intuition is sharper than ever. Trust the quiet nudges and subtle synchronicities appearing in your path.' },
      { icon: '❖', title: 'Pixie Stardust (Joy)', text: 'Lighten your energetic field. Laughter, nature, and playful presence will dissolve heavy emotional blockages.' },
      { icon: '✪', title: 'Usui Healing Touch', text: 'Universal life force energy is recalibrating your chakras. Allow yourself to rest and receive cellular renewal.' },
      { icon: '🔮', title: 'Ancestral Confirmation', text: 'Loved ones in spirit are watching over you with unconditional love. A confirmation sign will arrive soon.' },
      { icon: '🌿', title: 'Somatic Release (EFT)', text: 'Breathe deeply. Release subconscious tension stored in your shoulders and chest. You are safe in this moment.' }
    ];

    const oracleContainer = document.getElementById('daily-oracle-card');
    let oracleFlipped = false;

    function revealDailyOracleCard() {
      const randomCard = oracleCards[Math.floor(Math.random() * oracleCards.length)];
      const iconEl = document.getElementById('oracle-res-icon');
      const titleEl = document.getElementById('oracle-res-title');
      const textEl = document.getElementById('oracle-res-text');

      if (iconEl) iconEl.textContent = randomCard.icon;
      if (titleEl) titleEl.textContent = randomCard.title;
      if (textEl) textEl.textContent = randomCard.text;

      oracleContainer?.classList.add('revealed');
      oracleFlipped = true;
      showToast('✨ Daily Soul Message Channeled!');
      if (window.celestialAudio && window.celestialAudio.enabled) window.celestialAudio.playGlissando();
    }

    oracleContainer?.addEventListener('click', (e) => {
      if (!oracleFlipped) {
        revealDailyOracleCard();
      } else if (e.target.closest('.oracle-redraw-badge')) {
        revealDailyOracleCard();
      } else {
        oracleContainer.classList.remove('revealed');
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

    // ─── PERSISTENT aEYE SACRED GUIDE (Photorealistic Purple Eye + Site Search) ───
    function initSacredAssistant() {
      const widget = document.getElementById('sacred-assistant-widget');
      const avatarBtn = document.getElementById('assistant-avatar-btn');
      const avatarCanvas = document.getElementById('assistant-avatar-canvas');
      const bubble = document.getElementById('assistant-speech-bubble');
      const bubbleText = document.getElementById('assistant-bubble-text');
      const bubbleClose = document.getElementById('assistant-bubble-close');
      const modal = document.getElementById('assistant-modal');
      const closeModalBtn = document.getElementById('close-assistant-modal-btn');
      const modalLinks = document.querySelectorAll('.assistant-link-card');
      const searchInput = document.getElementById('aeye-search-input');

      if (!widget) return;

      // Draw Photorealistic Purple Eye on Avatar Canvas
      if (avatarCanvas) {
        const actx = avatarCanvas.getContext('2d');
        const eyeImg = new Image();
        eyeImg.src = 'images/photorealistic_purple_iris_orb.png';

        let mouseX = 0.5, mouseY = 0.5;
        window.addEventListener('mousemove', (e) => {
          const rect = avatarCanvas.getBoundingClientRect();
          mouseX = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width * 0.5)) / 200));
          mouseY = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height * 0.5)) / 200));
        }, { passive: true });

        function renderAvatar(now) {
          const aw = avatarCanvas.width;
          const ah = avatarCanvas.height;
          const acx = aw * 0.5;
          const acy = ah * 0.5;
          actx.clearRect(0, 0, aw, ah);

          const pulse = 1.0 + Math.sin(now * 0.003) * 0.08;

          // Outer glowing pulse ring
          const ringGrad = actx.createRadialGradient(acx, acy, 22, acx, acy, 36 * pulse);
          ringGrad.addColorStop(0, 'rgba(0, 229, 212, 0.6)');
          ringGrad.addColorStop(0.5, 'rgba(157, 78, 221, 0.4)');
          ringGrad.addColorStop(1, 'transparent');
          actx.fillStyle = ringGrad;
          actx.beginPath();
          actx.arc(acx, acy, 36 * pulse, 0, Math.PI * 2);
          actx.fill();

          // Gold Border Ring
          actx.strokeStyle = 'rgba(255, 215, 0, 0.85)';
          actx.lineWidth = 2.0;
          actx.beginPath();
          actx.arc(acx, acy, 32, 0, Math.PI * 2);
          actx.stroke();

          // Circular Mask for Photorealistic Purple Iris
          actx.save();
          actx.beginPath();
          actx.arc(acx, acy, 30, 0, Math.PI * 2);
          actx.clip();

          // Saccade tracking offset
          const offsetX = mouseX * 4;
          const offsetY = mouseY * 4;

          if (eyeImg.complete && eyeImg.naturalWidth > 0) {
            actx.drawImage(eyeImg, acx - 32 + offsetX, acy - 32 + offsetY, 64, 64);
          } else {
            // Purple gradient fallback
            const irisGrad = actx.createRadialGradient(acx, acy, 0, acx, acy, 30);
            irisGrad.addColorStop(0, '#000000');
            irisGrad.addColorStop(0.4, '#5A189A');
            irisGrad.addColorStop(0.8, '#9D4EDD');
            irisGrad.addColorStop(1, '#00FFC8');
            actx.fillStyle = irisGrad;
            actx.fillRect(0, 0, aw, ah);
          }

          // Specular cornea glint
          actx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          actx.beginPath();
          actx.arc(acx - 8, acy - 8, 3.5, 0, Math.PI * 2);
          actx.fill();

          actx.restore();

          requestAnimationFrame(renderAvatar);
        }
        requestAnimationFrame(renderAvatar);
      }

      // ─── aEye Thought Bubble Tips ───
      const tips = [
        "HI, I'M YOUR <span class=\"aeye-brand\">aEYE</span> ASSISTANT. CLICK ME FOR ANY HELP YOU NEED.",
        '🧘‍♀️ FEELING UNALIGNED? TRY THE SEVEN CHAKRAS RESONANCE MAP — JUST ASK!',
        '👻 BETH ELISE IS APPEARING LIVE AT GHOST KEY WEST! CHECK UPCOMING EVENTS.',
        '💌 ORDER A HANDWRITTEN SOUL LETTER — "NOTES BY BETH" — SEALED WITH LOVE.',
        '🔔 IMMERSE IN 528 HZ SOLFEGGIO BOWLS USING THE SOUND ICON ABOVE.',
        '🔮 ASK ME ANYTHING — I CAN HELP YOU NAVIGATE THIS SACRED SPACE.',
        '✨ YOUR AURA IS LUMINOUS TODAY. READY TO BOOK A READING WITH BETH?'
      ];
      let tipIndex = 0;
      let fadeTimer = null;
      let cycleTimer = null;

      function showThoughtBubble() {
        if (!bubbleText || !bubble) return;
        bubble.classList.remove('hidden', 'fading');
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
        bubbleText.innerHTML = tips[tipIndex];

        // Auto-fade after 8 seconds
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => {
          bubble.classList.add('fading');
          // After fade completes (1.5s), cycle to next tip after 3s pause
          clearTimeout(cycleTimer);
          cycleTimer = setTimeout(() => {
            tipIndex = (tipIndex + 1) % tips.length;
            showThoughtBubble();
          }, 4500); // 1.5s fade + 3s pause
        }, 8000);
      }

      // Dismiss bubble temporarily on close click
      bubbleClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(fadeTimer);
        clearTimeout(cycleTimer);
        bubble.classList.add('hidden');
        // Resume after 30s
        setTimeout(() => {
          tipIndex = (tipIndex + 1) % tips.length;
          showThoughtBubble();
        }, 30000);
      });

      // ─── Global closeAssistantModal ───
      window.closeAssistantModal = function() {
        modal?.classList.remove('active');
      };

      // Open Modal on Avatar Click
      avatarBtn?.addEventListener('click', () => {
        modal?.classList.add('active');
        if (window.celestialAudio) window.celestialAudio.playChime(852, 1.2);
        // Focus search input
        setTimeout(() => searchInput?.focus(), 300);
      });

      // Close Modal via close button
      closeModalBtn?.addEventListener('click', () => {
        window.closeAssistantModal();
      });

      // Close Modal via backdrop click
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) window.closeAssistantModal();
      });

      // Quick links close modal
      modalLinks.forEach(link => {
        link.addEventListener('click', () => {
          window.closeAssistantModal();
        });
      });

      // ─── aEye Site Search ───
      if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            performAeyeSearch(searchInput.value.trim());
          }
        });
      }

      function performAeyeSearch(query) {
        if (!query || query.length < 2) return;
        const lowerQ = query.toLowerCase();
        window.closeAssistantModal();

        // Search section text content for matches
        const sections = document.querySelectorAll('section[id]');
        for (const sec of sections) {
          const textContent = sec.textContent.toLowerCase();
          if (textContent.includes(lowerQ)) {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Brief highlight
            sec.style.transition = 'box-shadow 0.5s ease';
            sec.style.boxShadow = '0 0 40px rgba(0, 229, 212, 0.6), inset 0 0 30px rgba(0, 229, 212, 0.15)';
            setTimeout(() => {
              sec.style.boxShadow = '';
            }, 2500);
            return;
          }
        }
        // No match found — show bubble with feedback
        if (bubbleText && bubble) {
          clearTimeout(fadeTimer);
          clearTimeout(cycleTimer);
          bubble.classList.remove('hidden', 'fading');
          bubble.style.opacity = '1';
          bubbleText.textContent = `👁️ I couldn\'t find "${query}" — try "readings", "chakras", "events", or "merch".`;
          fadeTimer = setTimeout(() => {
            bubble.classList.add('fading');
            cycleTimer = setTimeout(() => {
              tipIndex = (tipIndex + 1) % tips.length;
              showThoughtBubble();
            }, 4500);
          }, 6000);
        }
      }

      // ─── CLICK-OUTSIDE-TO-CLOSE FOR ALL MODALS ───
      // Location Modal
      const locBackdrop = document.getElementById('location-modal-backdrop');
      if (locBackdrop) {
        locBackdrop.addEventListener('click', (e) => {
          if (e.target === locBackdrop) {
            locBackdrop.classList.remove('active');
            locBackdrop.setAttribute('aria-hidden', 'true');
          }
        });
      }

      // Product Detail Modal
      const productBackdrop = document.getElementById('product-modal-backdrop');
      if (productBackdrop) {
        productBackdrop.addEventListener('click', (e) => {
          if (e.target === productBackdrop) {
            productBackdrop.classList.remove('active');
            productBackdrop.setAttribute('aria-hidden', 'true');
          }
        });
      }

      // Sound Frequency Modal
      const soundModal = document.getElementById('sound-modal');
      if (soundModal) {
        soundModal.addEventListener('click', (e) => {
          if (e.target === soundModal) {
            soundModal.classList.remove('active');
          }
        });
      }

      // Testimonial Modal
      const testModal = document.getElementById('testimonial-modal');
      if (testModal) {
        testModal.addEventListener('click', (e) => {
          if (e.target === testModal) {
            testModal.classList.remove('active');
          }
        });
      }

      // Checkout Modal
      const checkoutBackdrop = document.getElementById('checkout-modal-backdrop');
      if (checkoutBackdrop) {
        checkoutBackdrop.addEventListener('click', (e) => {
          if (e.target === checkoutBackdrop) {
            checkoutBackdrop.classList.remove('active');
            checkoutBackdrop.setAttribute('aria-hidden', 'true');
          }
        });
      }

      // ─── SACRED ALL-SEEING AMETHYST EYE ASSISTANT ENGINE ───
      // Photorealistic Living Cosmic Eye that randomly looks around, blinks, and follows cursor
      if (avatarCanvas) {
        const eyeCtx = avatarCanvas.getContext('2d');
        const eyeW = avatarCanvas.width;
        const eyeH = avatarCanvas.height;
        const eyeCenterX = eyeW * 0.5;
        const eyeCenterY = eyeH * 0.5;

        // Eye state variables
        let currentIrisX = 0;
        let currentIrisY = 0;
        let targetIrisX = 0;
        let targetIrisY = 0;
        
        let blinkProgress = 0; // 0 = fully open, 1 = fully closed
        let isBlinking = false;
        let nextBlinkTime = performance.now() + 2500;
        let nextLookShiftTime = performance.now() + 1800;

        let mouseX = -9999;
        let mouseY = -9999;
        let lastMouseMoveTime = 0;

        // Listen for mouse movement across the viewport
        window.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          lastMouseMoveTime = performance.now();
        }, { passive: true });

        function updateAndRenderSacredEye(now) {
          if (!eyeCtx) return;
          eyeCtx.clearRect(0, 0, eyeW, eyeH);

          // 1. Calculate Target Look Direction (Mouse tracking vs Autonomous Look-Around)
          const rect = avatarCanvas.getBoundingClientRect();
          const canvasScreenCenterX = rect.left + rect.width * 0.5;
          const canvasScreenCenterY = rect.top + rect.height * 0.5;

          const timeSinceMouseMove = now - lastMouseMoveTime;
          const isMouseActive = (timeSinceMouseMove < 2200 && mouseX > -100);

          if (isMouseActive) {
            // Track cursor smoothly
            const dx = mouseX - canvasScreenCenterX;
            const dy = mouseY - canvasScreenCenterY;
            const dist = Math.hypot(dx, dy);
            const maxRadius = 7.0; // Maximum iris travel distance within sclera

            if (dist > 0.1) {
              const travel = Math.min(maxRadius, dist * 0.022);
              targetIrisX = (dx / dist) * travel;
              targetIrisY = (dy / dist) * travel;
            }
          } else {
            // Autonomous mystical look-around
            if (now > nextLookShiftTime) {
              const angles = [
                { x: 0, y: 0 },         // Center thoughtful gaze
                { x: -5.5, y: -1.5 },   // Glance left
                { x: 5.5, y: -1.5 },    // Glance right
                { x: 0, y: -4.5 },      // Look upwards
                { x: -3.5, y: 3.0 },    // Glance down-left
                { x: 3.5, y: 3.0 },     // Glance down-right
                { x: 0, y: 0 }          // Return to center
              ];
              const randomChoice = angles[Math.floor(Math.random() * angles.length)];
              targetIrisX = randomChoice.x;
              targetIrisY = randomChoice.y;
              nextLookShiftTime = now + 2400 + Math.random() * 2800;
            }
          }

          // Smooth spring interpolation for organic eye movement
          currentIrisX += (targetIrisX - currentIrisX) * 0.14;
          currentIrisY += (targetIrisY - currentIrisY) * 0.14;

          // 2. Handle Organic Blinking
          if (now > nextBlinkTime && !isBlinking) {
            isBlinking = true;
          }

          if (isBlinking) {
            blinkProgress += 0.18;
            if (blinkProgress >= 1.0) {
              blinkProgress = 1.0;
              isBlinking = false;
              // Schedule next blink in 3.5 - 6.5 seconds with occasional double-blink
              const isDoubleBlink = Math.random() > 0.75;
              nextBlinkTime = now + (isDoubleBlink ? 300 : (3500 + Math.random() * 3000));
            }
          } else if (blinkProgress > 0) {
            blinkProgress -= 0.18;
            if (blinkProgress < 0) blinkProgress = 0;
          }

          // 3. ✦ DRAW CELESTIAL ALL-SEEING AMETHYST EYE ✦
          eyeCtx.save();
          eyeCtx.translate(eyeCenterX, eyeCenterY);

          // Outer Glow Halo
          const outerGlow = eyeCtx.createRadialGradient(0, 0, 16, 0, 0, 36);
          outerGlow.addColorStop(0, 'rgba(0, 229, 212, 0.45)');
          outerGlow.addColorStop(0.55, 'rgba(157, 78, 221, 0.35)');
          outerGlow.addColorStop(1, 'transparent');
          eyeCtx.fillStyle = outerGlow;
          eyeCtx.beginPath();
          eyeCtx.arc(0, 0, 36, 0, Math.PI * 2);
          eyeCtx.fill();

          // Golden Sacred Geometry Outer Frame
          eyeCtx.strokeStyle = '#FFD700';
          eyeCtx.lineWidth = 1.8;
          eyeCtx.shadowColor = '#00FFC8';
          eyeCtx.shadowBlur = 8;
          eyeCtx.beginPath();
          eyeCtx.arc(0, 0, 31, 0, Math.PI * 2);
          eyeCtx.stroke();
          eyeCtx.shadowBlur = 0;

          // Filigree Ring Dots
          const dotCount = 8;
          for (let i = 0; i < dotCount; i++) {
            const angle = (i / dotCount) * Math.PI * 2 + now * 0.001;
            const dx = Math.cos(angle) * 31;
            const dy = Math.sin(angle) * 31;
            eyeCtx.fillStyle = i % 2 === 0 ? '#00FFC8' : '#FFD700';
            eyeCtx.beginPath();
            eyeCtx.arc(dx, dy, 1.4, 0, Math.PI * 2);
            eyeCtx.fill();
          }

          // Almond Eye Clipping Path
          eyeCtx.save();
          eyeCtx.beginPath();
          // Anatomical Almond Contour
          eyeCtx.moveTo(-25, 0);
          eyeCtx.bezierCurveTo(-14, -17, 14, -17, 25, 0);
          eyeCtx.bezierCurveTo(14, 17, -14, 17, -25, 0);
          eyeCtx.closePath();
          eyeCtx.clip();

          // 3a. 3D Spherical Sclera (White of Eye with delicate corner shading)
          const scleraGrad = eyeCtx.createRadialGradient(0, 0, 0, 0, 0, 26);
          scleraGrad.addColorStop(0, '#FFFFFF');
          scleraGrad.addColorStop(0.65, '#FBF8FE');
          scleraGrad.addColorStop(0.9, '#E8DAF7');
          scleraGrad.addColorStop(1, '#D4BCED');
          eyeCtx.fillStyle = scleraGrad;
          eyeCtx.fillRect(-28, -20, 56, 40);

          // Corner Vascular Shading
          const cornerPinkL = eyeCtx.createRadialGradient(-24, 0, 0, -24, 0, 10);
          cornerPinkL.addColorStop(0, 'rgba(235, 140, 170, 0.45)');
          cornerPinkL.addColorStop(1, 'transparent');
          eyeCtx.fillStyle = cornerPinkL;
          eyeCtx.beginPath();
          eyeCtx.arc(-24, 0, 10, 0, Math.PI * 2);
          eyeCtx.fill();

          const cornerPinkR = eyeCtx.createRadialGradient(24, 0, 0, 24, 0, 10);
          cornerPinkR.addColorStop(0, 'rgba(235, 140, 170, 0.45)');
          cornerPinkR.addColorStop(1, 'transparent');
          eyeCtx.fillStyle = cornerPinkR;
          eyeCtx.beginPath();
          eyeCtx.arc(24, 0, 10, 0, Math.PI * 2);
          eyeCtx.fill();

          // 3b. ✦ HIGH-DEFINITION MULTI-LAYER AMETHYST IRIS ✦
          const irisRadius = 14.5;
          const ix = currentIrisX;
          const iy = currentIrisY;

          // Limbal Ring (Dark obsidian-violet border)
          eyeCtx.save();
          eyeCtx.translate(ix, iy);

          const irisGrad = eyeCtx.createRadialGradient(0, 0, 0, 0, 0, irisRadius);
          irisGrad.addColorStop(0, '#10002B');
          irisGrad.addColorStop(0.28, '#240046');
          irisGrad.addColorStop(0.55, '#5A189A');
          irisGrad.addColorStop(0.78, '#9D4EDD');
          irisGrad.addColorStop(0.92, '#C77DFF');
          irisGrad.addColorStop(1, '#10002B'); // Limbal ring
          eyeCtx.fillStyle = irisGrad;
          eyeCtx.beginPath();
          eyeCtx.arc(0, 0, irisRadius, 0, Math.PI * 2);
          eyeCtx.fill();

          // Radiating Amethyst Fibers & Gold Flecks
          eyeCtx.lineWidth = 0.55;
          for (let f = 0; f < 28; f++) {
            const fAngle = (f / 28) * Math.PI * 2;
            const rInner = 4.5 + Math.sin(f * 1.7) * 1.5;
            const rOuter = irisRadius - 1.2;
            
            eyeCtx.strokeStyle = (f % 3 === 0) ? 'rgba(255, 215, 0, 0.75)' : 'rgba(224, 170, 255, 0.65)';
            eyeCtx.beginPath();
            eyeCtx.moveTo(Math.cos(fAngle) * rInner, Math.sin(fAngle) * rInner);
            eyeCtx.lineTo(Math.cos(fAngle) * rOuter, Math.sin(fAngle) * rOuter);
            eyeCtx.stroke();
          }

          // 3c. Obsidian Deep Pupil
          const pupilRadius = 5.0 + Math.sin(now * 0.003) * 0.4;
          eyeCtx.fillStyle = '#080014';
          eyeCtx.beginPath();
          eyeCtx.arc(0, 0, pupilRadius, 0, Math.PI * 2);
          eyeCtx.fill();

          // 3d. Dual Diamond Starlight Specular Glints
          eyeCtx.fillStyle = '#FFFFFF';
          eyeCtx.beginPath();
          eyeCtx.arc(-3.2, -3.2, 1.8, 0, Math.PI * 2);
          eyeCtx.fill();

          eyeCtx.beginPath();
          eyeCtx.arc(2.8, 2.8, 1.0, 0, Math.PI * 2);
          eyeCtx.fill();

          eyeCtx.restore(); // end iris translate

          // 3e. Eyelid Blink Cover
          if (blinkProgress > 0) {
            const eyelidH = 20 * blinkProgress;
            eyeCtx.fillStyle = '#140026';
            
            // Upper Eyelid
            eyeCtx.beginPath();
            eyeCtx.moveTo(-28, -20);
            eyeCtx.lineTo(28, -20);
            eyeCtx.lineTo(28, -20 + eyelidH);
            eyeCtx.quadraticCurveTo(0, -20 + eyelidH * 1.4, -28, -20 + eyelidH);
            eyeCtx.closePath();
            eyeCtx.fill();

            // Lower Eyelid
            eyeCtx.beginPath();
            eyeCtx.moveTo(-28, 20);
            eyeCtx.lineTo(28, 20);
            eyeCtx.lineTo(28, 20 - eyelidH);
            eyeCtx.quadraticCurveTo(0, 20 - eyelidH * 1.4, -28, 20 - eyelidH);
            eyeCtx.closePath();
            eyeCtx.fill();
          }

          eyeCtx.restore(); // end almond clip

          // Almond Gold Eyelid Rim Border
          eyeCtx.strokeStyle = 'rgba(255, 215, 0, 0.9)';
          eyeCtx.lineWidth = 1.6;
          eyeCtx.beginPath();
          eyeCtx.moveTo(-25, 0);
          eyeCtx.bezierCurveTo(-14, -17, 14, -17, 25, 0);
          eyeCtx.bezierCurveTo(14, 17, -14, 17, -25, 0);
          eyeCtx.closePath();
          eyeCtx.stroke();

          eyeCtx.restore(); // end main eye context

          requestAnimationFrame(updateAndRenderSacredEye);
        }

        requestAnimationFrame(updateAndRenderSacredEye);
      }

      // Global activation hook from animation sequence
      window.activateSacredAssistantWidget = function() {
        widget.classList.add('visible');
        avatarBtn?.classList.add('splash-active');
        setTimeout(() => avatarBtn?.classList.remove('splash-active'), 1500);
        
        tipIndex = 0;
        showThoughtBubble();

        if (window.celestialAudio) window.celestialAudio.playChime(963, 1.8);
      };

      // Fallback in case user scrolls past hero immediately
      setTimeout(() => {
        if (!widget.classList.contains('visible')) {
          widget.classList.add('visible');
          tipIndex = 0;
          showThoughtBubble();
        }
      }, 32000);
    }

    // ─── DYNAMIC EXPIRING EVENTS COUNTDOWN & MANAGEMENT ────────
    function initExpiringEvents() {
      const eventCards = document.querySelectorAll('.event-card[data-event-date]');
      
      eventCards.forEach(card => {
        const dateStr = card.getAttribute('data-event-date');
        if (!dateStr) return;

        const eventDate = new Date(dateStr + 'T00:00:00');
        const now = new Date();
        const diffMs = eventDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        const countdownEl = card.querySelector('.event-countdown');
        const pulseBadge = card.querySelector('.event-pulse-badge');

        if (diffDays > 0) {
          if (countdownEl) {
            countdownEl.textContent = `✦ Live Gathering in ${diffDays} Day${diffDays === 1 ? '' : 's'} · Limited Capacity`;
          }
        } else if (diffDays === 0) {
          if (countdownEl) {
            countdownEl.textContent = '✦ Happening Today Live!';
            countdownEl.style.color = '#00FFC8';
          }
          if (pulseBadge) pulseBadge.textContent = '● Live Today';
        } else {
          // Event Expired
          if (countdownEl) {
            countdownEl.textContent = '✦ Past Sacred Event · Archived';
            countdownEl.style.color = 'var(--text-muted)';
          }
          if (pulseBadge) {
            pulseBadge.textContent = 'Archived';
            pulseBadge.style.background = 'rgba(255, 255, 255, 0.15)';
            pulseBadge.style.color = 'var(--text-muted)';
            pulseBadge.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }
          card.classList.add('event-expired');
        }
      });
    }

    // Initialize Sacred Assistant & Expiring Events
    initSacredAssistant();
    initExpiringEvents();

    // Initial check
    updateActiveNav();

  });

})();
