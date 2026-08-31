const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const oldFunc = `        function updateAndRenderSacredEye(now) {
          if (!eyeCtx) return;
          const aw = baseW;
          const ah = baseH;
          const acx = aw * 0.5;
          const acy = ah * 0.5;

          // Hide home base eye when the living aEYE is in flight elsewhere
          const tinkState = (window.heroTinkerbell && window.heroTinkerbell.state) || '';
          const menuState = (window.heroAeyeMenu && window.heroAeyeMenu.state) || 'IDLE';
          const isHiddenState = (menuState !== 'IDLE' || tinkState.startsWith('MENU_') || tinkState.startsWith('AURA_'));

          if (!isHiddenState) {
            eyeCtx.clearRect(0, 0, aw, ah);
            // 1. Mouse Tracking vs Autonomous Look-Around Saccades
          const rect = avatarCanvas.getBoundingClientRect();
          const canvasScreenCenterX = rect.left + rect.width * 0.5;
          const canvasScreenCenterY = rect.top + rect.height * 0.5;
          const timeSinceMouseMove = now - lastMouseMoveTime;
          const isMouseActive = (timeSinceMouseMove < 2500 && mouseX > -100);

          if (isMouseActive) {
            const dx = mouseX - canvasScreenCenterX;
            const dy = mouseY - canvasScreenCenterY;
            const dist = Math.hypot(dx, dy);
            const maxTravel = 6.5;
            if (dist > 0.1) {
              const travel = Math.min(maxTravel, dist * 0.025);
              targetIrisX = (dx / dist) * travel;
              targetIrisY = (dy / dist) * travel;
            }
          } else {
            if (now > nextLookShiftTime) {
              const angles = [
                { x: 0, y: 0 },
                { x: -5.0, y: -1.2 },
                { x: 5.0, y: -1.2 },
                { x: 0, y: -4.0 },
                { x: -3.0, y: 2.5 },
                { x: 3.0, y: 2.5 },
                { x: 0, y: 0 }
              ];
              const choice = angles[Math.floor(Math.random() * angles.length)];
              targetIrisX = choice.x;
              targetIrisY = choice.y;
              nextLookShiftTime = now + 2200 + Math.random() * 2600;
            }
          }

          currentIrisX += (targetIrisX - currentIrisX) * 0.15;
          currentIrisY += (targetIrisY - currentIrisY) * 0.15;

          // 2. Organic Blinking
          if (now > nextBlinkTime && !isBlinking) {
            isBlinking = true;
          }
          if (isBlinking) {
            blinkProgress += 0.20;
            if (blinkProgress >= 1.0) {
              blinkProgress = 1.0;
              isBlinking = false;
              const isDouble = Math.random() > 0.75;
              nextBlinkTime = now + (isDouble ? 280 : (3200 + Math.random() * 2800));
            }
          } else if (blinkProgress > 0) {
            blinkProgress -= 0.20;
            if (blinkProgress < 0) blinkProgress = 0;
          }

          // 3. Render Unified Living Organic aEye (Almond Shape, Gold Rim & Couture Eyelashes)
          const normGazeX = (currentIrisX / 6.5);
          const normGazeY = (currentIrisY / 6.5);
          const eyeRadius = 31.0;
          const colors = ['#7B2CBF', '#9D4EDD', '#00FFC8'];
          drawOrganicEye(eyeCtx, acx, acy, eyeRadius, normGazeX, normGazeY, blinkProgress, 8.5, colors, now);
          } // End if (!isHiddenState)

          requestAnimationFrame(updateAndRenderSacredEye); // Always keep the eye alive — it's a small UI element, not heavy motion
        }`;

const newFunc = `        let hiddenStartTime = 0;
        let lastStaticPaint = 0;

        function updateAndRenderSacredEye(now) {
          try {
            if (!eyeCtx) return;
            const aw = baseW;
            const ah = baseH;
            const acx = aw * 0.5;
            const acy = ah * 0.5;

            // Hide home base eye when the living aEYE is in flight elsewhere
            const tinkState = (window.heroTinkerbell && window.heroTinkerbell.state) || '';
            const menuState = (window.heroAeyeMenu && window.heroAeyeMenu.state) || 'IDLE';
            const isHiddenState = (menuState !== 'IDLE' || tinkState.startsWith('MENU_') || tinkState.startsWith('AURA_'));

            // Stuck-state watchdog
            if (isHiddenState) {
              if (hiddenStartTime === 0) hiddenStartTime = now;
              else if (now - hiddenStartTime > 6000) {
                // Recover stuck state
                if (window.heroTinkerbell) window.heroTinkerbell.state = 'ASSISTANT_ACTIVE';
                if (window.heroAeyeMenu) window.heroAeyeMenu.state = 'IDLE';
                if (typeof window.restoreAeyeHomebase === 'function') window.restoreAeyeHomebase();
                hiddenStartTime = 0;
              }
            } else {
              hiddenStartTime = 0;
            }

            if (!isHiddenState) {
              if (typeof reduceMotion === 'function' && reduceMotion()) {
                // Repaint one static open-eye frame roughly every 2000ms
                if (now - lastStaticPaint > 2000) {
                  eyeCtx.clearRect(0, 0, aw, ah);
                  drawOrganicEye(eyeCtx, acx, acy, 31.0, 0, 0, 0, 8.5, ['#7B2CBF', '#9D4EDD', '#00FFC8'], now);
                  lastStaticPaint = now;
                }
              } else {
                eyeCtx.clearRect(0, 0, aw, ah);
                // 1. Mouse Tracking vs Autonomous Look-Around Saccades
                const rect = avatarCanvas.getBoundingClientRect();
                const canvasScreenCenterX = rect.left + rect.width * 0.5;
                const canvasScreenCenterY = rect.top + rect.height * 0.5;
                const timeSinceMouseMove = now - lastMouseMoveTime;
                const isMouseActive = (timeSinceMouseMove < 2500 && mouseX > -100);

                if (isMouseActive) {
                  const dx = mouseX - canvasScreenCenterX;
                  const dy = mouseY - canvasScreenCenterY;
                  const dist = Math.hypot(dx, dy);
                  const maxTravel = 6.5;
                  if (dist > 0.1) {
                    const travel = Math.min(maxTravel, dist * 0.025);
                    targetIrisX = (dx / dist) * travel;
                    targetIrisY = (dy / dist) * travel;
                  }
                } else {
                  if (now > nextLookShiftTime) {
                    const angles = [
                      { x: 0, y: 0 },
                      { x: -5.0, y: -1.2 },
                      { x: 5.0, y: -1.2 },
                      { x: 0, y: -4.0 },
                      { x: -3.0, y: 2.5 },
                      { x: 3.0, y: 2.5 },
                      { x: 0, y: 0 }
                    ];
                    const choice = angles[Math.floor(Math.random() * angles.length)];
                    targetIrisX = choice.x;
                    targetIrisY = choice.y;
                    nextLookShiftTime = now + 2200 + Math.random() * 2600;
                  }
                }

                currentIrisX += (targetIrisX - currentIrisX) * 0.15;
                currentIrisY += (targetIrisY - currentIrisY) * 0.15;

                // 2. Organic Blinking
                if (now > nextBlinkTime && !isBlinking) {
                  isBlinking = true;
                }
                if (isBlinking) {
                  blinkProgress += 0.20;
                  if (blinkProgress >= 1.0) {
                    blinkProgress = 1.0;
                    isBlinking = false;
                    const isDouble = Math.random() > 0.75;
                    nextBlinkTime = now + (isDouble ? 280 : (3200 + Math.random() * 2800));
                  }
                } else if (blinkProgress > 0) {
                  blinkProgress -= 0.20;
                  if (blinkProgress < 0) blinkProgress = 0;
                }

                // 3. Render Unified Living Organic aEye (Almond Shape, Gold Rim & Couture Eyelashes)
                const normGazeX = (currentIrisX / 6.5);
                const normGazeY = (currentIrisY / 6.5);
                const eyeRadius = 31.0; // PART 3B: we will change this later
                const colors = ['#7B2CBF', '#9D4EDD', '#00FFC8'];
                drawOrganicEye(eyeCtx, acx, acy, eyeRadius, normGazeX, normGazeY, blinkProgress, 8.5, colors, now);
              }
            }
          } catch (e) {
            console.warn("updateAndRenderSacredEye error:", e);
          } finally {
            requestAnimationFrame(updateAndRenderSacredEye);
          }
        }`;

if (code.includes(oldFunc)) {
  fs.writeFileSync('js/main.js', code.replace(oldFunc, newFunc));
  console.log('Sacred Eye updated successfully!');
} else {
  console.log('Could not find oldFunc exactly.');
}
