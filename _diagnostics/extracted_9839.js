          // Next: Take off from Crescent Moon crest and fly directly down to the aEYE!
          if (pt >= 3.2) {
            heroTinkerbell.state = 'FLYING_TO_AEYE';
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;
            if (heroLogo) heroLogo.classList.remove('fairy-moon-glow');
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 25, ['#FFD700', '#C77DFF', '#FFF', '#00FFC8']);
          }
        }
        
        // 5. FLYING FROM CRESCENT MOON DOWN TO aEYE (~2.4s)
        else if (heroTinkerbell.state === 'FLYING_TO_AEYE') {
          heroTinkerbell.progress += dt / 2.4;
          heroTinkerbell.wingPhase += dt * 28.0;

          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);
          const swoop = Math.sin(p * Math.PI) * (w * 0.04);

          const targetX = aeyeX;
          const targetY = aeyeY - 48; // Land directly on top of the aEYE

          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * targetX + swoop;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * targetY;
          heroTinkerbell.facingLeft = false;

          // Streaming glitter ribbon trail
          for (let t = 0; t < 3; t++) {
            emitPixieDust(
              heroTinkerbell.x + (Math.random() - 0.5) * 10,
              heroTinkerbell.y + 6 + (Math.random() - 0.5) * 10,
              2,
              ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF']
            );
          }

          if (p >= 1) {
            // Land gracefully right on top of the aEYE!
            heroTinkerbell.state = 'PERCHED_ON_AEYE';
            heroTinkerbell.greetTime = 0;
            heroTinkerbell.x = targetX;
            heroTinkerbell.y = targetY;
            heroTinkerbell.alpha = 1;
            heroTinkerbell.facingLeft = false;
            heroTinkerbell.greetShown = false;
            heroTinkerbell.greetHidden = false;
            emitPixieDust(targetX, targetY, 35, ['#C77DFF', '#00FFC8', '#FFD700', '#FFFFFF']);
            if (window.celestialAudio) window.celestialAudio.playChime(639, 1.0);
          }
        }

        // 6. PERCHED ON TOP OF aEYE & INTRODUCING HERSELF (~6.5s)
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

        // 7. HIGH AIR LEAP & HEADFIRST DIVE INTO aEYE (~1.3s)
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