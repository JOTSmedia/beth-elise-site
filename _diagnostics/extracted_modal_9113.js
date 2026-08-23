        // 10. COMPANION RACE TO MENU: AVATAR BETH & LIVING aEYE
        else if (heroTinkerbell.state === 'MENU_TAKEOFF') {
          heroTinkerbell.progress += dt / 0.82;
          heroTinkerbell.wingPhase += dt * 32.0;
          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);

          // Target for Avatar Beth: Top-right corner of the aEYE assistant modal menu
          let menuCornerX = w * 0.5 + 240;
          let menuCornerY = Math.max(40, h * 0.22);
          const modalCard = document.querySelector('.assistant-modal-card');
          if (modalCard) {
            const mRect = modalCard.getBoundingClientRect();
            if (mRect.width > 0) {
              menuCornerX = mRect.right - 18;
              menuCornerY = mRect.top + 16;
            }
          }

          const arc = Math.sin(p * Math.PI) * (-50);
          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * menuCornerX;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * menuCornerY + arc;
          heroTinkerbell.facingLeft = true;
          heroTinkerbell.alpha = 1; // REAPPEAR!
          heroTinkerbell.diveAngle = -0.25 * (1 - p);

          // Sparkling glitter trail behind Beth's flight
          for (let t = 0; t < 3; t++) {
            emitPixieDust(
              heroTinkerbell.x + (Math.random() - 0.5) * 12,
              heroTinkerbell.y + 4 + (Math.random() - 0.5) * 12,
              2,
              ['#FFD700', '#00FFC8', '#FFFFFF', '#C77DFF']
            );
          }

          if (p >= 1) {
            heroTinkerbell.state = 'MENU_PERCHED';
            heroTinkerbell.x = menuCornerX;
            heroTinkerbell.y = menuCornerY;
            heroTinkerbell.diveAngle = 0;
            emitPixieDust(menuCornerX, menuCornerY, 25, ['#00FFC8', '#FFD700', '#FFFFFF']);
          }
        }

        // 11. HOVER AT TOP CORNER OF MODAL MENU — "HOW MAY WE HELP YOU?"
        else if (heroTinkerbell.state === 'MENU_PERCHED') {
          let menuCornerX = w * 0.5 + 240;
          let menuCornerY = Math.max(40, h * 0.22);
          const modalCard = document.querySelector('.assistant-modal-card');
          if (modalCard) {
            const mRect = modalCard.getBoundingClientRect();
            if (mRect.width > 0) {
              menuCornerX = mRect.right - 18;
              menuCornerY = mRect.top + 16;
            }
          }

          heroTinkerbell.x = menuCornerX;
          heroTinkerbell.y = menuCornerY + Math.sin(now * 0.005) * 3.5;
          heroTinkerbell.wingPhase += dt * 14.0;
          heroTinkerbell.bodySway = Math.sin(now * 0.004) * 1.8;
          heroTinkerbell.facingLeft = true;
          heroTinkerbell.diveAngle = 0;
          heroTinkerbell.alpha = 1;

          if (!heroTinkerbell.menuBubbleShown) {
            heroTinkerbell.menuBubbleShown = true;
            showBethSpeechBubble("How may we help you?", heroTinkerbell.x, heroTinkerbell.y, 'side-left');
          }

          if (Math.random() > 0.75) {
            emitPixieDust(
              heroTinkerbell.x + (Math.random() - 0.5) * 18,
              heroTinkerbell.y + (Math.random() - 0.5) * 18,
              1,
              ['#FFD700', '#00FFC8', '#FFF']
            );
          }
        }

        // 12. DIVE BACK DOWN TO aEYE WITH GLITTER TRAIL & SPLASH EFFECT (THEN DISAPPEAR)
        else if (heroTinkerbell.state === 'MENU_DIVE_BACK') {
          heroTinkerbell.progress += dt / 0.85;
          heroTinkerbell.wingPhase += dt * 34.0;
          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);

          let targetAeyeX = aeyeX;
          let targetAeyeY = aeyeY;
          if (aeyeWidget) {
            const aeRect = aeyeWidget.getBoundingClientRect();
            if (aeRect.width > 0) {
              targetAeyeX = aeRect.left + aeRect.width * 0.5;
              targetAeyeY = aeRect.top + aeRect.height * 0.5;
            }
          }

          const arc = Math.sin(p * Math.PI) * 60;
          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * targetAeyeX;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * targetAeyeY + arc;
          heroTinkerbell.diveAngle = p * Math.PI * 2.0;
          heroTinkerbell.facingLeft = false;

          // Rich ribbon glitter trail
          for (let t = 0; t < 4; t++) {
            emitPixieDust(
              heroTinkerbell.x + (Math.random() - 0.5) * 14,
              heroTinkerbell.y + 4 + (Math.random() - 0.5) * 14,
              2,
              ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF', '#E0AAFF']
            );
          }

          // Shrink into center of aEYE circle on final 20%
          if (p > 0.8) {
            heroTinkerbell.alpha = Math.max(0, (1 - p) / 0.2);
          }

          if (p >= 1) {
            // Dive into aEYE with explosive splash effect and DISAPPEAR!
            heroTinkerbell.state = 'ASSISTANT_ACTIVE';
            heroTinkerbell.x = targetAeyeX;
            heroTinkerbell.y = targetAeyeY;
            heroTinkerbell.alpha = 0; // DISAPPEARED inside aEYE until summoned again!
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.splashTime = 0; // Trigger 3 expanding shockwave rings and core flash
            emitPixieDust(targetAeyeX, targetAeyeY, 60, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF', '#9D4EDD']);

            if (aeyeWidget) {
              aeyeWidget.classList.remove('aeye-splash-active');
              void aeyeWidget.offsetWidth;
              aeyeWidget.classList.add('aeye-splash-active');
            }

            if (window.celestialAudio) window.celestialAudio.playChime(963, 1.2);
          }
        }

        // ─── LIVING aEYE MENU RACE UPDATE LOOP ───
        if (heroAeyeMenu.state === 'MENU_TAKEOFF') {
          heroAeyeMenu.progress += dt / 0.78;
          const p = Math.min(1, heroAeyeMenu.progress);
          const easeP = p * p * (3 - 2 * p);

          const arc = Math.sin(p * Math.PI) * (-60);
          heroAeyeMenu.x = (1 - easeP) * heroAeyeMenu.startX + easeP * heroAeyeMenu.targetX;
          heroAeyeMenu.y = (1 - easeP) * heroAeyeMenu.startY + easeP * heroAeyeMenu.targetY + arc;
          heroAeyeMenu.alpha = 1;

          if (Math.random() > 0.3) {
            emitPixieDust(
              heroAeyeMenu.x + (Math.random() - 0.5) * 10,
              heroAeyeMenu.y + (Math.random() - 0.5) * 10,
              2,
              ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF']
            );
          }

          if (p >= 1) {
            heroAeyeMenu.state = 'MENU_PERCHED';
            heroAeyeMenu.x = heroAeyeMenu.targetX;
            heroAeyeMenu.y = heroAeyeMenu.targetY;
            emitPixieDust(heroAeyeMenu.x, heroAeyeMenu.y, 25, ['#00FFC8', '#FFD700', '#FFFFFF']);
          }
        }
        else if (heroAeyeMenu.state === 'MENU_PERCHED') {
          const eyeOrb = document.getElementById('assistant-modal-icon-orb');
          if (eyeOrb) {
            const oRect = eyeOrb.getBoundingClientRect();
            if (oRect.width > 0) {
              heroAeyeMenu.x = oRect.left + oRect.width * 0.5;
              heroAeyeMenu.y = oRect.top + oRect.height * 0.5;
            }
          }
          heroAeyeMenu.alpha = 1;
          heroAeyeMenu.gazeX = Math.sin(now * 0.002) * 4;
          heroAeyeMenu.gazeY = Math.cos(now * 0.0018) * 3;
          if (now > heroAeyeMenu.nextBlinkTime) {
            const bElapsed = (now - heroAeyeMenu.nextBlinkTime) / 220;
            if (bElapsed < 0.5) heroAeyeMenu.blinkPhase = bElapsed * 2;
            else if (bElapsed < 1.0) heroAeyeMenu.blinkPhase = (1 - bElapsed) * 2;
            else {
              heroAeyeMenu.blinkPhase = 0;
              heroAeyeMenu.nextBlinkTime = now + 2800 + Math.random() * 2400;
            }
          }
        }
        else if (heroAeyeMenu.state === 'MENU_DIVE_BACK') {
          heroAeyeMenu.progress += dt / 0.65;
          const p = Math.min(1, heroAeyeMenu.progress);
          const easeP = p * p * (3 - 2 * p);

          let targetAeyeX = aeyeX;
          let targetAeyeY = aeyeY;
          if (aeyeWidget) {
            const aeRect = aeyeWidget.getBoundingClientRect();
            if (aeRect.width > 0) {
              targetAeyeX = aeRect.left + aeRect.width * 0.5;
              targetAeyeY = aeRect.top + aeRect.height * 0.5;
            }
          }

          const arc = Math.sin(p * Math.PI) * 40;
          heroAeyeMenu.x = (1 - easeP) * heroAeyeMenu.startX + easeP * targetAeyeX;
          heroAeyeMenu.y = (1 - easeP) * heroAeyeMenu.startY + easeP * targetAeyeY + arc;
          heroAeyeMenu.alpha = 1;

          if (Math.random() > 0.4) {
            emitPixieDust(heroAeyeMenu.x, heroAeyeMenu.y, 2, ['#00FFC8', '#FFD700', '#FFFFFF']);
          }

          if (p >= 1) {
            heroAeyeMenu.state = 'IDLE';
            heroAeyeMenu.alpha = 0;
            heroAeyeMenu.x = targetAeyeX;
            heroAeyeMenu.y = targetAeyeY;
            emitPixieDust(targetAeyeX, targetAeyeY, 20, ['#00FFC8', '#FFD700', '#FFFFFF']);
          }
        }