      // Expose interactive menu fairy flight triggers
      window.triggerFairyMenuTakeoff = function() {
        if (!heroAvatarCanvas) return;
        const aeyeWidget = document.getElementById('assistant-avatar-btn');
        let curAeyeX = Math.max(40, window.innerWidth - 60);
        let curAeyeY = Math.max(40, window.innerHeight - 60);
        if (aeyeWidget) {
          const aeRect = aeyeWidget.getBoundingClientRect();
          if (aeRect.width > 0) {
            curAeyeX = aeRect.left + aeRect.width * 0.5;
            curAeyeY = aeRect.top + aeRect.height * 0.5;
          }
        }

        // 1. Target for Avatar Beth: Top-right corner of menu card
        let menuCornerX = window.innerWidth * 0.5 + 240;
        let menuCornerY = Math.max(40, window.innerHeight * 0.22);
        const modalCard = document.querySelector('.assistant-modal-card');
        if (modalCard) {
          const mRect = modalCard.getBoundingClientRect();
          if (mRect.width > 0) {
            menuCornerX = mRect.right - 18;
            menuCornerY = mRect.top + 16;
          }
        }

        // 2. Target for Living aEYE: Top-center orb dais of menu card
        let menuEyeX = window.innerWidth * 0.5;
        let menuEyeY = Math.max(40, window.innerHeight * 0.20);
        const eyeOrb = document.getElementById('assistant-modal-icon-orb');
        if (eyeOrb) {
          const oRect = eyeOrb.getBoundingClientRect();
          if (oRect.width > 0) {
            menuEyeX = oRect.left + oRect.width * 0.5;
            menuEyeY = oRect.top + oRect.height * 0.5;
          }
        }

        // Setup Avatar Beth flight
        heroTinkerbell.state = 'MENU_TAKEOFF';
        heroTinkerbell.progress = 0;
        heroTinkerbell.startX = curAeyeX;
        heroTinkerbell.startY = curAeyeY;
        heroTinkerbell.x = curAeyeX;
        heroTinkerbell.y = curAeyeY;
        heroTinkerbell.alpha = 1;
        heroTinkerbell.isStrutting = false;
        heroTinkerbell.menuBubbleShown = false;

        // Setup Living aEYE flight (Races alongside Beth to top center!)
        heroAeyeMenu.state = 'MENU_TAKEOFF';
        heroAeyeMenu.progress = 0;
        heroAeyeMenu.startX = curAeyeX;
        heroAeyeMenu.startY = curAeyeY;
        heroAeyeMenu.targetX = menuEyeX;
        heroAeyeMenu.targetY = menuEyeY;
        heroAeyeMenu.x = curAeyeX;
        heroAeyeMenu.y = curAeyeY;
        heroAeyeMenu.alpha = 1;
        heroAeyeMenu.scale = 1.0;

        emitPixieDust(curAeyeX, curAeyeY, 45, ['#FFD700', '#00FFC8', '#FFFFFF', '#C77DFF']);
        if (window.celestialAudio) window.celestialAudio.playChime(741, 1.0);
      };

      window.triggerFairyMenuDiveBack = function() {
        hideBethSpeechBubble();
        if (!heroAvatarCanvas) return;

        // aEye races back to homebase first
        heroAeyeMenu.state = 'MENU_DIVE_BACK';
        heroAeyeMenu.progress = 0;
        heroAeyeMenu.startX = heroAeyeMenu.x || (window.innerWidth * 0.5);
        heroAeyeMenu.startY = heroAeyeMenu.y || (window.innerHeight * 0.20);
        heroAeyeMenu.alpha = 1;

        // Avatar Beth follows and dives down into homebase
        heroTinkerbell.state = 'MENU_DIVE_BACK';
        heroTinkerbell.progress = 0;
        heroTinkerbell.startX = heroTinkerbell.x || (window.innerWidth * 0.5 + 240);
        heroTinkerbell.startY = heroTinkerbell.y || (window.innerHeight * 0.22);
        heroTinkerbell.alpha = 1;
        heroTinkerbell.isStrutting = false;

        emitPixieDust(heroTinkerbell.startX, heroTinkerbell.startY, 25, ['#00FFC8', '#FFD700', '#FFFFFF']);
        if (window.celestialAudio) window.celestialAudio.playChime(852, 1.0);
      };