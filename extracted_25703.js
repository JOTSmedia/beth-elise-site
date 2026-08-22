      // ─── STAR SPARKLE BURST CONTROLLER & CELESTIAL DISTANT STAR ───
      let globalStarSparkle = 0;
      let returningBubbleOrb = { active: false, x: 0, y: 0, startX: 0, startY: 0, targetX: 0, targetY: 0, progress: 0, spawned: false };

      // Photorealistic Distant Pulsing Star in Deep Space Sky
      function drawDistantPulsingStar(ctx, x, y, now) {
        ctx.save();
        ctx.translate(x, y);

        const pulse = 1.0 + Math.sin(now * 0.0035) * 0.28;
        const shimmer = 0.85 + Math.sin(now * 0.008) * 0.15;

        // 1. Celestial Deep Nebula Glow
        const neb = ctx.createRadialGradient(0, 0, 1, 0, 0, 42 * pulse);
        neb.addColorStop(0, 'rgba(255, 255, 255, ' + (0.95 * shimmer) + ')');
        neb.addColorStop(0.2, 'rgba(0, 229, 212, ' + (0.75 * shimmer) + ')');
        neb.addColorStop(0.5, 'rgba(157, 78, 221, ' + (0.45 * shimmer) + ')');
        neb.addColorStop(0.85, 'rgba(255, 215, 0, ' + (0.2 * shimmer) + ')');
        neb.addColorStop(1, 'transparent');
        ctx.fillStyle = neb;
        ctx.beginPath();
        ctx.arc(0, 0, 42 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // 2. 4-Point Photorealistic Diffraction Spikes (Diamond Cross)
        const spikeLen = 28 * pulse * shimmer;
        const spikeWidth = 1.8;
        
        // Horizontal spike
        const hGrad = ctx.createLinearGradient(-spikeLen, 0, spikeLen, 0);
        hGrad.addColorStop(0, 'transparent');
        hGrad.addColorStop(0.5, '#FFFFFF');
        hGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.moveTo(-spikeLen, 0);
        ctx.lineTo(0, -spikeWidth);
        ctx.lineTo(spikeLen, 0);
        ctx.lineTo(0, spikeWidth);
        ctx.closePath();
        ctx.fill();

        // Vertical spike
        const vGrad = ctx.createLinearGradient(0, -spikeLen, 0, spikeLen);
        vGrad.addColorStop(0, 'transparent');
        vGrad.addColorStop(0.5, '#FFFFFF');
        vGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = vGrad;
        ctx.beginPath();
        ctx.moveTo(0, -spikeLen);
        ctx.lineTo(-spikeWidth, 0);
        ctx.lineTo(0, spikeLen);
        ctx.lineTo(spikeWidth, 0);
        ctx.closePath();
        ctx.fill();

        // Diagonal sub-spikes (45 degrees)
        ctx.save();
        ctx.rotate(Math.PI / 4);
        const diagLen = spikeLen * 0.55;
        const dGrad = ctx.createLinearGradient(-diagLen, 0, diagLen, 0);
        dGrad.addColorStop(0, 'transparent');
        dGrad.addColorStop(0.5, 'rgba(0, 255, 200, 0.8)');
        dGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.moveTo(-diagLen, 0);
        ctx.lineTo(0, -1);
        ctx.lineTo(diagLen, 0);
        ctx.lineTo(0, 1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 3. Ultra-Bright Brilliant Star Core
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00FFC8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 2.8 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {
        // Sky apex descent origin: Distant star barely in sight at the top of the space sky
        const starX = w * 0.5;
        const starY = 24;

        // Render Distant Pulsing Star on every frame
        drawDistantPulsingStar(ctx, starX, starY, now);

        // Target 1: Crest on Top of the Crescent Moon in the Logo (responsive)
        let logoMoonX = w * 0.5;
        let logoMoonY = Math.max(60, h * 0.18);
        const heroLogo = document.querySelector('.hero__logo-img');
        
        if (heroLogo) {
          const rect = heroLogo.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            logoMoonX = rect.left + rect.width * 0.495;
            // The top crest of the outer crescent moon rim
            logoMoonY = rect.top + rect.height * 0.045;
          }
        }

        // Target 2: "Intuitive Wisdom & Energy Healing" Tagline Pill Bar (responsive)
        let badgeRightX = w * 0.70;
        let badgeLeftX = w * 0.30;
        let badgeTopY = Math.max(80, h * 0.18);
        const pillBadge = document.querySelector('.hero__tagline-pill');
        if (pillBadge) {
          const bRect = pillBadge.getBoundingClientRect();
          if (bRect.width > 0 && bRect.height > 0) {
            const marginPad = Math.min(28, bRect.width * 0.12);
            badgeRightX = bRect.right - marginPad;
            badgeLeftX = bRect.left + marginPad;
            badgeTopY = bRect.top - 8;
          }
        }

        // Target 3: "Book a Reading" hero CTA button (responsive)
        let bookBtnX = w * 0.5;
        let bookBtnY = h * 0.72;
        const bookBtn = document.querySelector('.hero__cta-group .btn-primary');
        if (bookBtn) {
          const bbRect = bookBtn.getBoundingClientRect();
          if (bbRect.width > 0) {
            bookBtnX = bbRect.left + bbRect.width * 0.5;
            bookBtnY = bbRect.top - 8;
          }
        }

        // Target 4: Lower Right aEYE Help Assistant Landing Node (responsive)
        let aeyeX = Math.max(40, w - 60);
        let aeyeY = Math.max(40, h - 60);
        const aeyeWidget = document.getElementById('assistant-avatar-btn');
        if (aeyeWidget) {
          const aeRect = aeyeWidget.getBoundingClientRect();
          if (aeRect.width > 0) {
            aeyeX = aeRect.left + aeRect.width * 0.5;
            aeyeY = aeRect.top + aeRect.height * 0.5;
          }
        }

        // 1. SPAWNING → Begin Glinda starlight bubble orb descent from distant star
        if (heroTinkerbell.state === 'SPAWNING') {
          heroTinkerbell.startX = starX;
          heroTinkerbell.startY = starY;
          heroTinkerbell.x = starX;
          heroTinkerbell.y = starY;
          heroTinkerbell.orbFlightTime = 0;
          heroTinkerbell.state = 'ORB_FLOATING';
          heroTinkerbell.facingLeft = false;
          returningBubbleOrb.active = false;
          returningBubbleOrb.spawned = false;
          emitPixieDust(starX, starY, 25, ['#FFD700', '#C77DFF', '#FFF', '#9D4EDD', '#00FFC8']);
        }

        // 2. ORB FLOATING — Dreamy Glinda Bubble Orb Descent from Distant Star (~7.5s)
        else if (heroTinkerbell.state === 'ORB_FLOATING') {
          heroTinkerbell.orbFlightTime += dt;
          const oft = heroTinkerbell.orbFlightTime;
          const orbDuration = 7.5;
          const progress = Math.min(1, oft / orbDuration);

          const drift = Math.sin(oft * 0.85) * (w * 0.08);
          const gentleBob = Math.sin(oft * 2.2) * 8;
          
          heroTinkerbell.x = starX + drift + (logoMoonX - starX) * (progress * 0.65);
          heroTinkerbell.y = starY + (logoMoonY - starY) * (progress * 0.80) + gentleBob;
          heroTinkerbell.wingPhase += dt * 12.0;

          if (Math.random() > 0.2) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 10, 2, ['#C77DFF', '#FFD700', '#FFFFFF', '#00FFC8', '#E0AAFF']);
          }

          if (oft >= orbDuration) {
            // Beth exits the orb: Orb returns to the star, Beth flies down onto the moon crest
            heroTinkerbell.state = 'FLYING_TO_LOGO';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.targetX = logoMoonX;
            heroTinkerbell.targetY = logoMoonY;
            heroTinkerbell.progress = 0;

            // Spawn returning empty bubble orb flying back to the distant star
            returningBubbleOrb.active = true;
            returningBubbleOrb.spawned = true;
            returningBubbleOrb.startX = heroTinkerbell.x;
            returningBubbleOrb.startY = heroTinkerbell.y;
            returningBubbleOrb.targetX = starX;
            returningBubbleOrb.targetY = starY;
            returningBubbleOrb.progress = 0;
          }
        }
        
        // 3. ARRIVAL ONTO CRESCENT MOON CREST (~2.4s)
        else if (heroTinkerbell.state === 'FLYING_TO_LOGO') {
          heroTinkerbell.progress += dt / 2.4;
          heroTinkerbell.wingPhase += dt * 26.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);
          const swoop = Math.sin(p * Math.PI) * (w * 0.025);

          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * logoMoonX + swoop;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * logoMoonY;

          if (Math.random() > 0.15) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 10, 2, ['#C77DFF', '#FFD700', '#FFFFFF', '#9D4EDD', '#00FFC8']);
          }

          if (p >= 1) {
            // Land gracefully right on top of the crescent moon crest!
            heroTinkerbell.state = 'PERCHED_LOGO';
            heroTinkerbell.x = logoMoonX;
            heroTinkerbell.y = logoMoonY;
            heroTinkerbell.perchedTime = 0;
            globalStarSparkle = 1.0;

            // Illuminate the entire logo with celestial stardust glow
            if (heroLogo) heroLogo.classList.add('fairy-moon-glow');
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 10, 35, ['#FFD700', '#FFFFFF', '#FFE57F', '#00FFC8', '#C77DFF']);
          }
        }
        
        // 4. PERCHED ON TOP OF CRESCENT MOON — Badass Look-Around (~2.8s)
        else if (heroTinkerbell.state === 'PERCHED_LOGO') {
          heroTinkerbell.perchedTime += dt;
          heroTinkerbell.wingPhase += dt * 8.0;
          const pt = heroTinkerbell.perchedTime;

          heroTinkerbell.x = logoMoonX;
          heroTinkerbell.y = logoMoonY;
          heroTinkerbell.bodySway = Math.sin(pt * 2.0) * 1.5;

          // Confident look-around sequence
          if (pt < 0.7) {
            heroTinkerbell.headAngle = -0.35; // Look left
          } else if (pt < 1.4) {
            heroTinkerbell.headAngle = 0.0;   // Center
          } else if (pt < 2.1) {
            heroTinkerbell.headAngle = 0.35;  // Look right
          } else {
            heroTinkerbell.headAngle = 0.0;  // Confident ready pose
          }

          if (Math.random() > 0.4) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 20, heroTinkerbell.y + 10, 1, ['#FFD700', '#FFF', '#FFE57F']);
          }

          // Next: Fly down to "Book a Reading" CTA button
          if (pt >= 2.8) {
            heroTinkerbell.state = 'FLYING_TO_BOOK_BTN';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 25, ['#FFD700', '#C77DFF', '#FFF', '#00FFC8']);
          }
        }
        
        // 5. FLYING DOWN TO "BOOK A READING" BUTTON (~2.0s)
        else if (heroTinkerbell.state === 'FLYING_TO_BOOK_BTN') {
          heroTinkerbell.progress += dt / 2.0;
          heroTinkerbell.wingPhase += dt * 26.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);
          const swoop = Math.sin(p * Math.PI) * (w * 0.04);

          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * bookBtnX + swoop;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * bookBtnY;
          heroTinkerbell.facingLeft = false;

          if (Math.random() > 0.2) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 8, 2, ['#00FFC8', '#FFD700', '#FFF']);
          }

          if (p >= 1) {
            heroTinkerbell.state = 'PERCHED_BOOK_BTN';
            heroTinkerbell.perchedTime = 0;
            heroTinkerbell.x = bookBtnX;
            heroTinkerbell.y = bookBtnY;
            emitPixieDust(bookBtnX, bookBtnY, 24, ['#FFD700', '#00FFC8', '#FFFFFF', '#C77DFF']);
            if (bookBtn) {
              bookBtn.style.boxShadow = '0 0 35px rgba(0, 229, 212, 0.9), 0 0 60px rgba(255, 215, 0, 0.7)';
              setTimeout(() => { if (bookBtn) bookBtn.style.boxShadow = ''; }, 2000);
            }
          }
        }

        // 5b. PERCHED ON BOOK BUTTON (~1.4s)
        else if (heroTinkerbell.state === 'PERCHED_BOOK_BTN') {
          heroTinkerbell.perchedTime += dt;
          heroTinkerbell.wingPhase += dt * 9.0;
          heroTinkerbell.bodySway = Math.sin(heroTinkerbell.perchedTime * 3) * 1.2;

          if (Math.random() > 0.4) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 15, heroTinkerbell.y + 6, 1, ['#FFD700', '#00FFC8', '#FFF']);
          }

          if (heroTinkerbell.perchedTime >= 1.4) {
            // Fly up to LEFT side of the top badge pill bar
            heroTinkerbell.state = 'FLYING_TO_BADGE';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.targetX = badgeLeftX;
            heroTinkerbell.targetY = badgeTopY;
            heroTinkerbell.progress = 0;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 16, ['#00FFC8', '#FFD700', '#FFF']);
          }
        }

        // 6. FLYING UP TO LEFT SIDE OF PILL BAR (~2.0s)
        else if (heroTinkerbell.state === 'FLYING_TO_BADGE') {
          heroTinkerbell.progress += dt / 2.0;
          heroTinkerbell.wingPhase += dt * 26.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);
          const swoop = Math.sin(p * Math.PI) * (w * 0.035);

          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * badgeLeftX - swoop;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * badgeTopY;
          heroTinkerbell.facingLeft = false;

          if (Math.random() > 0.2) {
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 8, 2, ['#00FFC8', '#FFD700', '#FFF', '#C77DFF']);
          }

          if (p >= 1) {
            // Land on LEFT corner of pill bar and begin confident CATWALK STRUT!
            heroTinkerbell.state = 'STRUT_ON_BADGE';
            heroTinkerbell.x = badgeLeftX;
            heroTinkerbell.y = badgeTopY;
            heroTinkerbell.strutTime = 0;
            heroTinkerbell.facingLeft = false;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 4, 25, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF']);
          }
        }

        // 7. CONFIDENT BADASS CATWALK STRUT ACROSS PILL BAR (~4.0s)
        else if (heroTinkerbell.state === 'STRUT_ON_BADGE') {
          heroTinkerbell.strutTime += dt;
          heroTinkerbell.wingPhase += dt * 14.0;
          const st = heroTinkerbell.strutTime;
          const totalStrutDuration = 4.0;
          const strutProgress = Math.min(1, st / totalStrutDuration);

          // Confident walk from left to right across top bar
          heroTinkerbell.x = badgeLeftX + strutProgress * (badgeRightX - badgeLeftX);
          heroTinkerbell.y = badgeTopY - Math.abs(Math.sin(st * 6.5)) * 3.2; // High-fashion strut bounce
          heroTinkerbell.bodySway = Math.sin(st * 6.5) * 3.0; // Confident hip sway
          heroTinkerbell.isStrutting = true;
          heroTinkerbell.strutPhase = st * 6.5;
          heroTinkerbell.facingLeft = true;

          // Glowing footsteps
          if (Math.random() > 0.2) {
            emitPixieDust(heroTinkerbell.x - 4, heroTinkerbell.y + 12, 1, ['#FFD700', '#00FFC8', '#FFF', '#E0AAFF']);
          }

          if (st >= totalStrutDuration) {
            // Reached right edge! Turn and launch into Olympic somersault dive into aEye area!
            heroTinkerbell.state = 'OLYMPIC_DIVE';
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.facingLeft = false;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 25, ['#00FFC8', '#FFD700', '#FFF', '#9D4EDD']);
          }
        }

        // 8. OLYMPIC DIVE — Acrobatic somersault plunge directly into aEye hover perch (~2.2s)
        else if (heroTinkerbell.state === 'OLYMPIC_DIVE') {
          heroTinkerbell.progress += dt / 2.2;
          heroTinkerbell.wingPhase += dt * 32.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);

          const hoverPerchX = aeyeX;
          const hoverPerchY = aeyeY - 48;

          const launchArc = Math.sin(p * Math.PI) * (-75);
          const diveFromX = heroTinkerbell.x;
          const diveFromY = heroTinkerbell.y;
          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * hoverPerchX;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * hoverPerchY + launchArc * (1 - p);

          // Full rotating somersault angle
          heroTinkerbell.diveAngle = p * Math.PI * 2.0;

          // Streaming ribbon trail
          const TRAIL_STEPS = 5;
          for (let t = 0; t < TRAIL_STEPS; t++) {
            const f = t / TRAIL_STEPS;
            emitPixieDust(
              diveFromX + (heroTinkerbell.x - diveFromX) * f + (Math.random() - 0.5) * 6,
              diveFromY + (heroTinkerbell.y - diveFromY) * f + 4 + (Math.random() - 0.5) * 6,
              2,
              ['#C77DFF', '#00FFC8', '#FFD700', '#FFFFFF', '#E0AAFF']
            );
          }

          if (p >= 1) {
            heroTinkerbell.state = 'PERCHED_ON_AEYE';
            heroTinkerbell.greetTime = 0;
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.alpha = 1;
            heroTinkerbell.x = hoverPerchX;
            heroTinkerbell.y = hoverPerchY;
            heroTinkerbell.facingLeft = false;
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.greetShown = false;
            heroTinkerbell.greetHidden = false;
            emitPixieDust(hoverPerchX, hoverPerchY, 35, ['#C77DFF', '#00FFC8', '#FFD700', '#FFFFFF']);
            if (window.celestialAudio) window.celestialAudio.playChime(639, 1.0);
          }
        }

        // 9. PERCHED ON TOP OF aEYE & INTRODUCING HERSELF (~6.5s)
        else if (heroTinkerbell.state === 'PERCHED_ON_AEYE') {
          heroTinkerbell.greetTime += dt;
          heroTinkerbell.wingPhase += dt * 11.0;
          heroTinkerbell.isStrutting = false;
          heroTinkerbell.diveAngle = 0;
          heroTinkerbell.facingLeft = false;
          heroTinkerbell.alpha = 1;

          // Perched directly on top of the aEYE
          heroTinkerbell.x = aeyeX;
          heroTinkerbell.y = aeyeY - 48;
          heroTinkerbell.bodySway = Math.sin(now * 0.004) * 1.6;

          // Connecting Starlight Aura under boots
          ctx.save();
          const aeyeGlowPulse = 1.0 + Math.sin(now * 0.005) * 0.15;
          const aeyeGlowGrad = ctx.createRadialGradient(heroTinkerbell.x, heroTinkerbell.y + 16, 0, heroTinkerbell.x, heroTinkerbell.y + 16, 28 * aeyeGlowPulse);
          aeyeGlowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          aeyeGlowGrad.addColorStop(0.35, 'rgba(0, 229, 212, 0.8)');
          aeyeGlowGrad.addColorStop(0.7, 'rgba(255, 215, 0, 0.4)');
          aeyeGlowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = aeyeGlowGrad;
          ctx.beginPath();
          ctx.arc(heroTinkerbell.x, heroTinkerbell.y + 16, 28 * aeyeGlowPulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          const SETTLE = 0.35;
          const CLEAR = 0.55;
          const GREET_TIME = 6.5; // Comfortable reading duration
          const gt = heroTinkerbell.greetTime;

          const gEl = document.getElementById('beth-greeting-bubble');
          if (gEl) {
            if (!heroTinkerbell.greetShown && gt >= SETTLE && gt < GREET_TIME - CLEAR) {
              heroTinkerbell.greetShown = true;
              
              const cRect = heroAvatarCanvas.getBoundingClientRect();
              const mouthX = cRect.left + heroTinkerbell.x;
              const mouthY = cRect.top + heroTinkerbell.y - 36;
              
              gEl.hidden = false;
              gEl.style.visibility = 'hidden';
              requestAnimationFrame(() => {
                const r = gEl.getBoundingClientRect();
                // Position safely above and to the left of Beth
                let left = mouthX - r.width - 24;
                let top = mouthY - r.height - 48;
                left = Math.max(16, Math.min(left, window.innerWidth - r.width - 24));
                top = Math.max(16, top);
                gEl.style.left = left + 'px';
                gEl.style.top = top + 'px';
                gEl.style.right = 'auto';
                gEl.style.bottom = 'auto';
                gEl.style.visibility = '';
                gEl.classList.add('is-visible');
              });
            }
            if (heroTinkerbell.greetShown && gt >= GREET_TIME - CLEAR && !heroTinkerbell.greetHidden) {
              heroTinkerbell.greetHidden = true;
              gEl.classList.remove('is-visible');
              setTimeout(() => { gEl.hidden = true; }, 400);
            }
          }

          if (Math.random() > 0.55) {
            emitPixieDust(
              heroTinkerbell.x + (Math.random() - 0.5) * 22,
              heroTinkerbell.y + (Math.random() - 0.5) * 22,
              1,
              ['#C77DFF', '#FFD700', '#FFF']
            );
          }

          if (gt >= GREET_TIME) {
            // Ready to dive! Launch high leap into the air
            heroTinkerbell.state = 'BETH_HIGH_LEAP';
            heroTinkerbell.jumpTime = 0;
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
          }
        }

        // 10. HIGH AIR LEAP & HEADFIRST DIVE INTO aEYE (~1.3s)
        else if (heroTinkerbell.state === 'BETH_HIGH_LEAP') {
          heroTinkerbell.jumpTime += dt;
          heroTinkerbell.isStrutting = false;
          heroTinkerbell.facingLeft = false;

          const CROUCH = 0.28;        // squash crouch before launching
          const FLIGHT = 1.0;         // high air leap + headfirst dive arc
          const jt = heroTinkerbell.jumpTime;

          if (jt < CROUCH) {
            // Dip down and compress, loading spring power into legs
            const c = jt / CROUCH;
            heroTinkerbell.wingPhase += dt * 18.0;
            heroTinkerbell.y = heroTinkerbell.startY + Math.sin(c * Math.PI) * 9;
            heroTinkerbell.jumpSquash = 1 + Math.sin(c * Math.PI) * 0.12;
            heroTinkerbell.alpha = 1;
            heroTinkerbell.diveAngle = 0;
          } else {
            const f = Math.min(1, (jt - CROUCH) / FLIGHT);
            heroTinkerbell.wingPhase += dt * 36.0;
            heroTinkerbell.jumpSquash = 1 - Math.sin(f * Math.PI) * 0.08;   // stretch in the air

            // High air leap arc: launches 160px upward into the sky above the aEYE!
            const launchArc = Math.sin(f * Math.PI) * 160;
            heroTinkerbell.x = aeyeX;
            heroTinkerbell.y = heroTinkerbell.startY + (aeyeY - heroTinkerbell.startY) * f - launchArc;

            // Forward flip into sleek headfirst dive pose straight down into the eye
            heroTinkerbell.diveAngle = f * Math.PI * 1.0;

            // Trailing ribbon stardust off heels
            for (let t = 0; t < 3; t++) {
              emitPixieDust(
                heroTinkerbell.x + (Math.random() - 0.5) * 10,
                heroTinkerbell.y + 6 + (Math.random() - 0.5) * 10,
                2,
                ['#C77DFF', '#FFD700', '#00FFC8', '#FFF']
              );
            }

            // Shrink into eye over final quarter of plunge
            heroTinkerbell.alpha = f > 0.75 ? Math.max(0, (1 - f) / 0.25) : 1;

            if (f >= 1) {
              // Plunge headfirst into center of aEYE — explosive splash and DISAPPEARS inside!
              heroTinkerbell.state = 'ASSISTANT_ACTIVE';
              heroTinkerbell.alpha = 0; // DISAPPEARED until clicked!
              heroTinkerbell.diveAngle = 0;
              heroTinkerbell.splashTime = 0; // Trigger triple expanding shockwave rings and core flash
              emitPixieDust(aeyeX, aeyeY, 60, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF', '#9D4EDD']);
              
              for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                const dist = 35 + Math.random() * 25;
                emitPixieDust(
                  aeyeX + Math.cos(angle) * dist,
                  aeyeY + Math.sin(angle) * dist,
                  2,
                  ['#00FFC8', '#FFD700', '#FFFFFF']
                );
              }

              if (aeyeWidget) {
                aeyeWidget.classList.remove('aeye-splash-active');
                void aeyeWidget.offsetWidth;
                aeyeWidget.classList.add('aeye-splash-active');
              }

              const thoughtBubble = document.getElementById('assistant-speech-bubble');
              const bubbleTxt = document.getElementById('assistant-bubble-text');
              if (thoughtBubble && bubbleTxt) {
                thoughtBubble.classList.remove('hidden', 'fading');
                thoughtBubble.style.opacity = '1';
                bubbleTxt.innerHTML = "HI, I'M YOUR <span class=\"aeye-brand\">aEYE</span> ASSISTANT. CLICK ME FOR ANY HELP YOU NEED.";
                setTimeout(() => {
                  thoughtBubble.classList.add('fading');
                  setTimeout(() => thoughtBubble.classList.add('hidden'), 500);
                }, 6000);
              }

              if (window.celestialAudio) window.celestialAudio.playChime(963, 1.2);
            }
          }
        }