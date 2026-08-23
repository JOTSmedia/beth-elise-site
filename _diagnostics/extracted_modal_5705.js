        // 9. ASSISTANT HOVERING
        else if (heroTinkerbell.state === 'ASSISTANT_DIVED' || heroTinkerbell.state === 'ASSISTANT_ACTIVE') {
          heroTinkerbell.state = 'ASSISTANT_ACTIVE';
          heroTinkerbell.x = aeyeX;
          heroTinkerbell.y = aeyeY;
          heroTinkerbell.wingPhase += dt * 7.0;
          heroTinkerbell.bodySway = Math.sin(now * 0.003) * 1.0;
          heroTinkerbell.diveAngle = 0;
          heroTinkerbell.isStrutting = false;

          if (Math.random() > 0.88) {
            emitPixieDust(aeyeX + (Math.random() - 0.5) * 20, aeyeY + (Math.random() - 0.5) * 20, 1, ['#00FFC8', '#FFD700', '#FFF']);
          }
        }

        // 10. FLY OUT & DRAG MODAL CORNER (When aEYE is clicked)
        else if (heroTinkerbell.state === 'MENU_TAKEOFF') {
          heroTinkerbell.progress += dt / 0.85;
          heroTinkerbell.wingPhase += dt * 32.0;
          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);

          // Target: Top corner of the aEYE assistant modal menu
          let menuCornerX = w * 0.5 + 240;
          let menuCornerY = Math.max(40, h * 0.22);
          const modalCard = document.querySelector('.assistant-modal-card');
          if (modalCard && heroAvatarCanvas) {
            const mRect = modalCard.getBoundingClientRect();
            const cRect = heroAvatarCanvas.getBoundingClientRect();
            if (mRect.width > 0) {
              menuCornerX = mRect.right - cRect.left - 18;
              menuCornerY = mRect.top - cRect.top + 16;
            }
          }

          const arc = Math.sin(p * Math.PI) * (-50);
          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * menuCornerX;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * menuCornerY + arc;
          heroTinkerbell.facingLeft = true;
          heroTinkerbell.alpha = 1;
          heroTinkerbell.diveAngle = -0.25 * (1 - p);

          // Sparkling glitter trail behind her flight
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

        // 11. HOVER AT TOP CORNER OF MODAL MENU (Until button clicked or closed)
        else if (heroTinkerbell.state === 'MENU_PERCHED') {
          let menuCornerX = w * 0.5 + 240;
          let menuCornerY = Math.max(40, h * 0.22);
          const modalCard = document.querySelector('.assistant-modal-card');
          if (modalCard && heroAvatarCanvas) {
            const mRect = modalCard.getBoundingClientRect();
            const cRect = heroAvatarCanvas.getBoundingClientRect();
            if (mRect.width > 0) {
              menuCornerX = mRect.right - cRect.left - 18;
              menuCornerY = mRect.top - cRect.top + 16;
            }
          }

          heroTinkerbell.x = menuCornerX;
          heroTinkerbell.y = menuCornerY + Math.sin(now * 0.005) * 3.5;
          heroTinkerbell.wingPhase += dt * 14.0;
          heroTinkerbell.bodySway = Math.sin(now * 0.004) * 1.8;
          heroTinkerbell.facingLeft = true;
          heroTinkerbell.diveAngle = 0;
          heroTinkerbell.alpha = 1;

          if (Math.random() > 0.75) {
            emitPixieDust(
              heroTinkerbell.x + (Math.random() - 0.5) * 18,
              heroTinkerbell.y + (Math.random() - 0.5) * 18,
              1,
              ['#FFD700', '#00FFC8', '#FFF']
            );
          }
        }

        // 12. DIVE BACK DOWN TO aEYE WITH GLITTER TRAIL & SPLASH EFFECT
        else if (heroTinkerbell.state === 'MENU_DIVE_BACK') {
          heroTinkerbell.progress += dt / 0.85;
          heroTinkerbell.wingPhase += dt * 34.0;
          const p = Math.min(1, heroTinkerbell.progress);
          const easeP = p * p * (3 - 2 * p);

          const arc = Math.sin(p * Math.PI) * 60;
          heroTinkerbell.x = (1 - easeP) * heroTinkerbell.startX + easeP * aeyeX;
          heroTinkerbell.y = (1 - easeP) * heroTinkerbell.startY + easeP * aeyeY + arc;
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

          if (p >= 1) {
            // Dive into aEYE with explosive splash effect!
            heroTinkerbell.state = 'ASSISTANT_ACTIVE';
            heroTinkerbell.x = aeyeX;
            heroTinkerbell.y = aeyeY;
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.splashTime = 0; // Trigger 3 expanding shockwave rings and core flash
            emitPixieDust(aeyeX, aeyeY, 60, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF', '#9D4EDD']);

            if (aeyeWidget) {
              aeyeWidget.classList.remove('aeye-splash-active');
              void aeyeWidget.offsetWidth;
              aeyeWidget.classList.add('aeye-splash-active');
            }

            if (window.celestialAudio) window.celestialAudio.playChime(963, 1.2);
          }
        }