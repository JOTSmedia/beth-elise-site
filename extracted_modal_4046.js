    // ─── PERSISTENT aEYE SACRED GUIDE (Unified Continuous aEYE Entity) ───
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

      // Draw the Living aEYE on Home Base Canvas with Lifelike Gaze & Blinks
      if (avatarCanvas) {
        const actx = avatarCanvas.getContext('2d');

        let targetGazeX = 0, targetGazeY = 0;
        let curGazeX = 0, curGazeY = 0;
        let lastSaccadeTime = 0;
        let saccadeOffsetX = 0, saccadeOffsetY = 0;
        let nextBlinkTime = performance.now() + 3000;
        let blinkPhase = 0; // 0 = open, 1 = fully closed

        window.addEventListener('mousemove', (e) => {
          const rect = avatarCanvas.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width * 0.5);
          const dy = e.clientY - (rect.top + rect.height * 0.5);
          const dist = Math.hypot(dx, dy);
          const maxDist = 300;
          const clampedDist = Math.min(1, dist / maxDist);
          targetGazeX = (dx / (dist || 1)) * clampedDist * 7.5;
          targetGazeY = (dy / (dist || 1)) * clampedDist * 6.5;
        }, { passive: true });

        function renderAvatar(now) {
          const aw = avatarCanvas.width;
          const ah = avatarCanvas.height;
          const acx = aw * 0.5;
          const acy = ah * 0.5;
          actx.clearRect(0, 0, aw, ah);

          // Hide static home base when the living aEYE has relocated (in flight / menu / aura scanner)
          if (heroAeyeMenu.state !== 'IDLE' || heroTinkerbell.state === 'MENU_TAKEOFF' || heroTinkerbell.state === 'MENU_PERCHED' || heroTinkerbell.state === 'MENU_DIVE_BACK' || heroTinkerbell.state === 'AURA_TAKEOFF' || heroTinkerbell.state === 'AURA_SCANNING' || heroTinkerbell.state === 'AURA_HOVER' || heroTinkerbell.state === 'AURA_LOCKED' || heroTinkerbell.state === 'AURA_DIVE_BACK') {
            if (!reduceMotion()) requestAnimationFrame(renderAvatar);
            return;
          }

          // Organic Micro-saccades
          if (now - lastSaccadeTime > 2200 + Math.random() * 1800) {
            lastSaccadeTime = now;
            saccadeOffsetX = (Math.random() - 0.5) * 2.8;
            saccadeOffsetY = (Math.random() - 0.5) * 2.2;
          }

          // Smooth gaze easing
          curGazeX += (targetGazeX + saccadeOffsetX - curGazeX) * 0.14;
          curGazeY += (targetGazeY + saccadeOffsetY - curGazeY) * 0.14;

          // Organic Blinking
          if (now > nextBlinkTime) {
            const blinkElapsed = (now - nextBlinkTime) / 220; // 220ms blink duration
            if (blinkElapsed < 0.5) {
              blinkPhase = blinkElapsed * 2; // closing
            } else if (blinkElapsed < 1.0) {
              blinkPhase = (1.0 - blinkElapsed) * 2; // opening
            } else {
              blinkPhase = 0;
              nextBlinkTime = now + 3200 + Math.random() * 2600;
            }
          }

          // 1. Draw the Unified Continuous aEYE Entity (Exact same visual everywhere)
          drawUnifiedAEye(
            actx,
            acx,
            acy,
            30,
            curGazeX,
            curGazeY,
            blinkPhase,
            now
          );

          if (!reduceMotion()) requestAnimationFrame(renderAvatar);
        }
        requestAnimationFrame(renderAvatar);
      }