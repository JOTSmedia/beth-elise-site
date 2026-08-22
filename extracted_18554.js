        // Fast Scroll Safety: If hero has been scrolled away during intro, ensure Beth stays on screen and transitions to diving into the aEYE in the corner
        if (!isHeroVisible && (
          heroTinkerbell.state === 'SPAWNING' ||
          heroTinkerbell.state === 'ORB_FLOATING' ||
          heroTinkerbell.state === 'FLYING_TO_LOGO' ||
          heroTinkerbell.state === 'PERCHED_LOGO' ||
          heroTinkerbell.state === 'FLYING_TO_BOOK_BTN' ||
          heroTinkerbell.state === 'PERCHED_BOOK_BTN' ||
          heroTinkerbell.state === 'FLYING_TO_BADGE' ||
          heroTinkerbell.state === 'STRUT_ON_BADGE'
        )) {
          heroTinkerbell.isFastScrolled = true;
          hideBethSpeechBubble();
          heroTinkerbell.state = 'OLYMPIC_DIVE';
          heroTinkerbell.isStrutting = false;
          heroTinkerbell.startX = Math.max(40, Math.min(w - 40, heroTinkerbell.x || (w * 0.5)));
          heroTinkerbell.startY = Math.max(40, Math.min(h * 0.35, heroTinkerbell.y || 80));
          heroTinkerbell.progress = 0;
          heroTinkerbell.diveAngle = 0;
          heroTinkerbell.alpha = 1;
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

            // Activate the logo pulse and radiant celestial gold & sunset amethyst aura glow
            if (heroLogo) heroLogo.classList.add('fairy-moon-glow');
            const heroLogoImgs = document.querySelectorAll('.hero__logo-img, .hero__logo');
            heroLogoImgs.forEach(el => el.classList.add('fairy-moon-glow'));
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 10, 45, ['#FFD700', '#FFE57F', '#FFFFFF', '#FF80DF', '#C77DFF']);
          }
        }
        
        // 4. PERCHED ON TOP OF CRESCENT MOON — "Hi, I'm Beth Elise!" (~3.2s)
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

          // Show speech bubble: "Hi, I'm Beth Elise!"
          if (!heroTinkerbell.logoBubbleShown && pt >= 0.25 && pt < 2.8) {
            heroTinkerbell.logoBubbleShown = true;
            showBethSpeechBubble("Hi, I'm Beth Elise!", heroTinkerbell.x, heroTinkerbell.y - 12, 'top-center');
          }
          if (heroTinkerbell.logoBubbleShown && pt >= 2.8 && !heroTinkerbell.logoBubbleHidden) {
            heroTinkerbell.logoBubbleHidden = true;
            hideBethSpeechBubble();
          }

          if (Math.random() > 0.3) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 24, heroTinkerbell.y + 10, 2, ['#FFD700', '#FFF', '#FFE57F', '#C77DFF']);
          }

          // Next: Fly down to "Book a Reading" CTA button (Revert logo back to original celestial blue)
          if (pt >= 3.2) {
            hideBethSpeechBubble();
            heroTinkerbell.state = 'FLYING_TO_BOOK_BTN';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;

            // Revert logo back to original celestial blue as she departs
            if (heroLogo) heroLogo.classList.remove('fairy-moon-glow');
            const heroLogoImgs = document.querySelectorAll('.hero__logo-img, .hero__logo');
            heroLogoImgs.forEach(el => el.classList.remove('fairy-moon-glow'));

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

        // 5b. PERCHED ON BOOK BUTTON — "Book a reading with me!" (~3.0s)
        else if (heroTinkerbell.state === 'PERCHED_BOOK_BTN') {
          heroTinkerbell.perchedTime += dt;
          heroTinkerbell.wingPhase += dt * 9.0;
          heroTinkerbell.bodySway = Math.sin(heroTinkerbell.perchedTime * 3) * 1.2;

          const pt = heroTinkerbell.perchedTime;

          // Show speech bubble: "Book a reading with me!"
          if (!heroTinkerbell.bookBubbleShown && pt >= 0.25 && pt < 2.6) {
            heroTinkerbell.bookBubbleShown = true;
            showBethSpeechBubble("Book a reading with me!", heroTinkerbell.x, heroTinkerbell.y - 12, 'top-center');
          }
          if (heroTinkerbell.bookBubbleShown && pt >= 2.6 && !heroTinkerbell.bookBubbleHidden) {
            heroTinkerbell.bookBubbleHidden = true;
            hideBethSpeechBubble();
          }

          if (Math.random() > 0.4) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 15, heroTinkerbell.y + 6, 1, ['#FFD700', '#00FFC8', '#FFF']);
          }

          if (pt >= 3.0) {
            hideBethSpeechBubble();
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

            // Switch hero logo back to original celestial blue when she lands for introduction!
            const heroLogoImg = document.querySelector('.hero__logo-img');
            if (heroLogoImg) {
              heroLogoImg.classList.remove('fairy-moon-glow');
            }

            emitPixieDust(hoverPerchX, hoverPerchY, 35, ['#C77DFF', '#00FFC8', '#FFD700', '#FFFFFF']);
            if (window.celestialAudio) window.celestialAudio.playChime(639, 1.0);
          }
        }

        // 9. PERCHED ON TOP OF aEYE (~6.5s)
        // If normal progression: "Nice to meet you, my assistant will take care of you now."
        // If fast scroll progression: "Hi, I'm Beth Elise, welcome to my world!"
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

          if (!heroTinkerbell.greetShown && gt >= SETTLE && gt < GREET_TIME - CLEAR) {
            heroTinkerbell.greetShown = true;
            const greetMsg = heroTinkerbell.isFastScrolled 
              ? "Hi, I'm Beth Elise, welcome to my world!"
              : "Nice to meet you, my assistant will take care of you now.";
            showBethSpeechBubble(greetMsg, heroTinkerbell.x, heroTinkerbell.y - 20, 'top-left');
          }
          if (heroTinkerbell.greetShown && gt >= GREET_TIME - CLEAR && !heroTinkerbell.greetHidden) {
            heroTinkerbell.greetHidden = true;
            hideBethSpeechBubble();
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
            hideBethSpeechBubble();
            // Ready to dive! Launch high leap into the air
            heroTinkerbell.state = 'BETH_HIGH_LEAP';
            heroTinkerbell.jumpTime = 0;
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
          }
        }