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
            showBethSpeechBubble("How may we help you?", heroTinkerbell.x, heroTinkerbell.y - 14, 'top-left');
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