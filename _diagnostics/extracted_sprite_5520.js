          // 4. Fully Materialized 3D Badass Fairy Avatar
          else {
            // Render Jeopardy / Wheel of Fortune Floating Letter Board
            drawCatwalkLetterBoard(ctx, heroTinkerbell, now);

            const isPerched = (heroTinkerbell.state === 'PERCHED_LOGO' || heroTinkerbell.state === 'PERCHED_BOOK_BTN' || heroTinkerbell.state === 'PERCHED_ON_AEYE' || heroTinkerbell.state === 'MENU_PERCHED' || heroTinkerbell.state === 'PAUSE_ON_BADGE_EDGE');
            const isGreeting = (heroTinkerbell.state === 'PERCHED_ON_AEYE' || heroTinkerbell.state === 'MENU_PERCHED' || heroTinkerbell.state === 'PAUSE_ON_BADGE_EDGE');
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
        }
      }

      // ─── JEOPARDY / WHEEL OF FORTUNE FLOATING LETTER BOARD RENDERER ───
      function drawCatwalkLetterBoard(ctx, heroTinkerbell, now) {
        if (!heroTinkerbell.catwalkLetters || heroTinkerbell.catwalkLetters.length === 0) return;
        const fadeAlpha = heroTinkerbell.catwalkLettersFade !== undefined ? heroTinkerbell.catwalkLettersFade : 1.0;
        if (fadeAlpha <= 0.005) return;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 12px "Outfit", -apple-system, sans-serif';

        const isVanna = (heroTinkerbell.state === 'PAUSE_ON_BADGE_EDGE');
        const vannaTime = heroTinkerbell.edgePauseTime || 0;

        for (let i = 0; i < heroTinkerbell.catwalkLetters.length; i++) {
          const l = heroTinkerbell.catwalkLetters[i];
          if (!l.revealed || l.isSpace) continue;

          const age = Math.max(0, (now - l.revealTime) / 1000);
          const pop = Math.max(0, 1 - age / 0.28);
          const scaleY = Math.min(1, age * 6.0); // 3D flip over horizontal center

          // Floating wave bob
          const waveBob = Math.sin(now * 0.005 + i * 0.35) * 1.8;
          const px = l.x;
          const py = l.y + waveBob;

          // Shimmer wave during Vanna White presentation pose
          let shimmerGlow = 0;
          if (isVanna && vannaTime > 0.25) {
            const sweep = Math.sin(vannaTime * 4.5 - i * 0.28);
            if (sweep > 0.55) {
              shimmerGlow = (sweep - 0.55) / 0.45;
            }
          }

          ctx.save();
          ctx.translate(px, py);
          ctx.scale(1.0 + pop * 0.35, (1.0 + pop * 0.35) * scaleY);
          ctx.globalAlpha = fadeAlpha * Math.min(1, age * 4.0);

          // 1. Frosted Crystal Jeopardy Tile Background
          const tileW = 14.5;
          const tileH = 19.5;
          const tileGrad = ctx.createLinearGradient(0, -tileH * 0.5, 0, tileH * 0.5);
          if (shimmerGlow > 0) {
            tileGrad.addColorStop(0, `rgba(255, 215, 0, ${0.85 * fadeAlpha})`);
            tileGrad.addColorStop(1, `rgba(0, 229, 212, ${0.75 * fadeAlpha})`);
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 14 + 10 * shimmerGlow;
          } else {
            tileGrad.addColorStop(0, `rgba(32, 10, 58, ${0.92 * fadeAlpha})`);
            tileGrad.addColorStop(1, `rgba(14, 2, 28, ${0.95 * fadeAlpha})`);
            ctx.shadowColor = '#00FFC8';
            ctx.shadowBlur = 9;
          }

          ctx.fillStyle = tileGrad;
          ctx.strokeStyle = shimmerGlow > 0 ? '#FFFFFF' : 'rgba(0, 255, 200, 0.85)';
          ctx.lineWidth = shimmerGlow > 0 ? 1.8 : 1.2;

          // Draw rounded crystal tile
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(-tileW * 0.5, -tileH * 0.5, tileW, tileH, 3.5);
          } else {
            ctx.rect(-tileW * 0.5, -tileH * 0.5, tileW, tileH);
          }
          ctx.fill();
          ctx.stroke();

          // 2. Letter Character
          ctx.shadowBlur = 0;
          if (shimmerGlow > 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = (l.char === '!' || l.char === "'") ? '#00FFC8' : '#FFD700';
          }
          ctx.fillText(l.char, 0, 1);

          // Top glint highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(-tileW * 0.28, -tileH * 0.28, 1.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }

        ctx.restore();
      }

      // Load Photorealistic Assets for Hero Animation.