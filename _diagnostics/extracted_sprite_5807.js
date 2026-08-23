          }
          // 3. AURA Scanner Flying aEYE & Laser Scanner
          else if (heroTinkerbell.state === 'AURA_TAKEOFF' || heroTinkerbell.state === 'AURA_SCANNING' || heroTinkerbell.state === 'AURA_HOVER' || heroTinkerbell.state === 'AURA_DIVE_BACK') {
            const eyeRad = 28 * (heroTinkerbell.scale || 1.0);
            ctx.save();
            ctx.translate(heroTinkerbell.x, heroTinkerbell.y);
            ctx.globalAlpha = heroTinkerbell.alpha || 1;

            // Outer Glow Halo
            const outerGlow = ctx.createRadialGradient(0, 0, eyeRad * 0.5, 0, 0, eyeRad * 1.35);
            outerGlow.addColorStop(0, 'rgba(0, 229, 212, 0.55)');
            outerGlow.addColorStop(0.55, 'rgba(157, 78, 221, 0.40)');
            outerGlow.addColorStop(1, 'transparent');
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(0, 0, eyeRad * 1.35, 0, Math.PI * 2);
            ctx.fill();

            // Golden Sacred Geometry Outer Frame
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = Math.max(1.8, eyeRad * 0.06);
            ctx.shadowColor = '#00FFC8';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, eyeRad * 1.08, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Filigree Ring Dots
            const dotCount = 8;
            for (let i = 0; i < dotCount; i++) {
              const angle = (i / dotCount) * Math.PI * 2 + now * 0.001;
              const dx = Math.cos(angle) * (eyeRad * 1.08);
              const dy = Math.sin(angle) * (eyeRad * 1.08);
              ctx.fillStyle = i % 2 === 0 ? '#00FFC8' : '#FFD700';
              ctx.beginPath();
              ctx.arc(dx, dy, Math.max(1.5, eyeRad * 0.045), 0, Math.PI * 2);
              ctx.fill();
            }

            // Draw Unified Living aEYE
            drawOrganicEye(
              ctx,
              0,
              0,
              eyeRad,
              0,
              0,
              0,
              eyeRad * 0.28,
              ['#7B2CBF', '#9D4EDD', '#00FFC8'],
              now,
              false
            );

            ctx.restore();

            // ─── HIGH-ENERGY LASER SCANNING BEAM (<= 1.0s) ───
            if (heroTinkerbell.state === 'AURA_SCANNING') {
              const scanTime = heroTinkerbell.scanTimer || 0;
              const scanNorm = Math.sin((scanTime / 0.85) * Math.PI * 2);
              const laserY = heroTinkerbell.y + scanNorm * (eyeRad * 1.4);
              const beamHalfW = Math.max(140, eyeRad * 3.5);

              ctx.save();
              // Translucent auric laser curtain
              const laserGrad = ctx.createLinearGradient(0, laserY - 20, 0, laserY + 20);
              laserGrad.addColorStop(0, 'rgba(0, 255, 200, 0)');
              laserGrad.addColorStop(0.5, 'rgba(0, 255, 200, 0.45)');
              laserGrad.addColorStop(1, 'rgba(0, 255, 200, 0)');
              ctx.fillStyle = laserGrad;
              ctx.fillRect(heroTinkerbell.x - beamHalfW, laserY - 20, beamHalfW * 2, 40);

              // Core glowing cyan laser beam
              ctx.strokeStyle = '#00FFC8';
              ctx.lineWidth = 3.5;
              ctx.shadowColor = '#00FFC8';
              ctx.shadowBlur = 20;
              ctx.beginPath();
              ctx.moveTo(heroTinkerbell.x - beamHalfW, laserY);
              ctx.lineTo(heroTinkerbell.x + beamHalfW, laserY);
              ctx.stroke();

              // Hot white/gold central core line
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 1.4;
              ctx.beginPath();
              ctx.moveTo(heroTinkerbell.x - beamHalfW * 0.85, laserY);
              ctx.lineTo(heroTinkerbell.x + beamHalfW * 0.85, laserY);
              ctx.stroke();

              // Laser particle sparkles
              if (Math.random() > 0.3) {
                emitPixieDust(
                  heroTinkerbell.x + (Math.random() - 0.5) * (beamHalfW * 1.8),
                  laserY + (Math.random() - 0.5) * 4,
                  1,
                  ['#00FFC8', '#FFD700', '#FFFFFF']
                );
              }
              ctx.restore();
            }
          }
          // 4. Fully Materialized 3D Badass Fairy Avatar
          else {
            const isPerched = (heroTinkerbell.state === 'PERCHED_LOGO' || heroTinkerbell.state === 'PERCHED_BOOK_BTN' || heroTinkerbell.state === 'PERCHED_ON_AEYE' || heroTinkerbell.state === 'MENU_PERCHED');
            const isGreeting = (heroTinkerbell.state === 'PERCHED_ON_AEYE' || heroTinkerbell.state === 'MENU_PERCHED');
            const spriteAlpha = heroTinkerbell.alpha === undefined ? 1 : heroTinkerbell.alpha;
            if (spriteAlpha > 0.01 && heroTinkerbell.state !== 'ASSISTANT_ACTIVE') {
              const jumpSq = heroTinkerbell.jumpSquash || 1;
              ctx.save();
              ctx.globalAlpha = spriteAlpha;
              if (jumpSq !== 1) {
                // squash on the crouch, stretch through the arc
                ctx.translate(heroTinkerbell.x, heroTinkerbell.y);
                ctx.scale(1 / jumpSq, jumpSq);
                ctx.translate(-heroTinkerbell.x, -heroTinkerbell.y);
              }
              drawHeroTinkerbellSprite(
                ctx,
                heroTinkerbell.x,
                heroTinkerbell.y,
                heroTinkerbell.wingPhase,
                heroTinkerbell.headAngle,
                isPerched,
                heroTinkerbell.bodySway,
                heroTinkerbell.isStrutting,
                heroTinkerbell.strutPhase || 0,
                heroTinkerbell.facingLeft,
                heroTinkerbell.diveAngle || 0,
                isGreeting,
                now
              );
              ctx.restore();
            }
          }