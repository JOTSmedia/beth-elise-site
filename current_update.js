            const tinkState = (window.heroTinkerbell && window.heroTinkerbell.state) || '';
            const menuState = (window.heroAeyeMenu && window.heroAeyeMenu.state) || 'IDLE';
            const isHiddenState = (menuState !== 'IDLE' || tinkState.startsWith('MENU_') || tinkState.startsWith('AURA_'));

            // Stuck-state watchdog
            if (isHiddenState) {
              if (hiddenStartTime === 0) hiddenStartTime = now;
              else if (now - hiddenStartTime > 6000) {
                // Recover stuck state
                if (window.heroTinkerbell) window.heroTinkerbell.state = 'ASSISTANT_ACTIVE'; if (typeof window.restoreAeyeHomebase === 'function') window.restoreAeyeHomebase();
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
                  eyeCtx.save(); eyeCtx.setTransform(1, 0, 0, 1, 0, 0); eyeCtx.clearRect(0, 0, eyeCtx.canvas.width, eyeCtx.canvas.height); eyeCtx.restore();
                  drawOrganicEye(eyeCtx, acx, acy, aw * 0.41, 0, 0, 0, 8.5, ['#7B2CBF', '#9D4EDD', '#00FFC8'], now);
                  lastStaticPaint = now;
                }
              } else {
                eyeCtx.save(); eyeCtx.setTransform(1, 0, 0, 1, 0, 0); eyeCtx.clearRect(0, 0, eyeCtx.canvas.width, eyeCtx.canvas.height); eyeCtx.restore();
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
                const eyeRadius = aw * 0.41;
                const colors = ['#7B2CBF', '#9D4EDD', '#00FFC8'];
                drawOrganicEye(eyeCtx, acx, acy, eyeRadius, normGazeX, normGazeY, blinkProgress, 8.5, colors, now);
              }
            }
