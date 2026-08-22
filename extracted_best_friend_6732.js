          if (p >= 1) {
            // Initialize Jeopardy / Wheel of Fortune Letter Board for "I'M YOUR NEW BEST FRIEND!"
            const CATWALK_TEXT = "I'M YOUR NEW BEST FRIEND!";
            const chars = CATWALK_TEXT.split('');
            const totalChars = chars.length;
            // The letters span strictly from badgeLeftX + 6 to badgeRightX - 38 so Beth has 52px of clear stage room on the right
            const letterSpanStart = badgeLeftX + 6;
            const letterSpanEnd = badgeRightX - 38;
            heroTinkerbell.catwalkLetters = chars.map((ch, idx) => {
              const lx = letterSpanStart + (idx / (totalChars - 1)) * (letterSpanEnd - letterSpanStart);
              const ly = badgeTopY - 26;
              return {
                char: ch,
                x: lx,
                y: ly,
                isSpace: ch === ' ',
                revealed: false,
                revealTime: 0
              };
            });
            heroTinkerbell.catwalkLettersFade = 1.0;

            // Land on LEFT corner of pill bar and begin confident CATWALK STRUT!
            heroTinkerbell.state = 'STRUT_ON_BADGE';
            heroTinkerbell.x = badgeLeftX;
            heroTinkerbell.y = badgeTopY;
            heroTinkerbell.strutTime = 0;
            heroTinkerbell.facingLeft = false;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y + 4, 25, ['#00FFC8', '#FFD700', '#FFFFFF', '#C77DFF']);
          }
        }

        // 7. CONFIDENT BADASS CATWALK STRUT WITH JEOPARDY LETTER TOUCHES (~4.2s)
        else if (heroTinkerbell.state === 'STRUT_ON_BADGE') {
          heroTinkerbell.strutTime += dt;
          heroTinkerbell.wingPhase += dt * 14.0;
          const st = heroTinkerbell.strutTime;
          const totalStrutDuration = 4.2;
          const strutProgress = Math.min(1, st / totalStrutDuration);

          // Confident walk from left to right endpoint past the letters
          const walkStartX = badgeLeftX;
          const walkEndX = badgeRightX + 14;
          heroTinkerbell.x = walkStartX + strutProgress * (walkEndX - walkStartX);
          heroTinkerbell.y = badgeTopY - Math.abs(Math.sin(st * 6.5)) * 3.2; // High-fashion strut bounce
          heroTinkerbell.bodySway = Math.sin(st * 6.5) * 3.0; // Confident hip sway
          heroTinkerbell.isStrutting = true;
          heroTinkerbell.strutPhase = st * 6.5;
          heroTinkerbell.facingLeft = true;

          // Leading reach point for Jeopardy letter touching
          const touchX = heroTinkerbell.x + 8;

          // Check and touch/reveal each letter like Jeopardy / Wheel of Fortune!
          if (heroTinkerbell.catwalkLetters) {
            for (let i = 0; i < heroTinkerbell.catwalkLetters.length; i++) {
              const l = heroTinkerbell.catwalkLetters[i];
              if (!l.revealed && touchX >= l.x) {
                l.revealed = true;
                l.revealTime = now;
                
                // Sparkle burst at touched letter
                if (!l.isSpace) {
                  emitPixieDust(l.x, l.y, 6, ['#FFD700', '#00FFC8', '#FFFFFF', '#FFE57F']);
                  if (window.celestialAudio) {
                    window.celestialAudio.playChime(640 + i * 22, 0.25);
                  }
                }
              }
            }
          }

          // Glowing footsteps
          if (Math.random() > 0.2) {
            emitPixieDust(heroTinkerbell.x - 4, heroTinkerbell.y + 12, 1, ['#FFD700', '#00FFC8', '#FFF', '#E0AAFF']);
          }

          if (st >= totalStrutDuration) {
            // Reached right edge stage area! Ensure all letters are 100% revealed
            if (heroTinkerbell.catwalkLetters) {
              heroTinkerbell.catwalkLetters.forEach((l) => {
                if (!l.revealed) {
                  l.revealed = true;
                  l.revealTime = now;
                }
              });
            }

            // Transition to VANNA WHITE presentation turnaround pose (standing to the right of all letters)!
            heroTinkerbell.state = 'PAUSE_ON_BADGE_EDGE';
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.edgePauseTime = 0;
            heroTinkerbell.x = badgeRightX + 14;
            heroTinkerbell.y = badgeTopY;
            heroTinkerbell.facingLeft = true; // Turn back towards letters
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 35, ['#FFD700', '#00FFC8', '#FFFFFF', '#C77DFF']);
            if (window.celestialAudio) window.celestialAudio.playChime(852, 1.2);
          }
        }

        // 7b. VANNA WHITE PRESENTATION POSE & TURNAROUND BEFORE DIVE (~3.5s)
        else if (heroTinkerbell.state === 'PAUSE_ON_BADGE_EDGE') {
          heroTinkerbell.edgePauseTime += dt;
          heroTinkerbell.wingPhase += dt * 10.0;
          heroTinkerbell.isStrutting = false;
          heroTinkerbell.diveAngle = 0;

          const pt = heroTinkerbell.edgePauseTime;
          const EDGE_PAUSE_DURATION = 3.5;

          // Firmly stationed to the right of all letter tiles
          heroTinkerbell.x = badgeRightX + 14;
          heroTinkerbell.y = badgeTopY;

          // Phase 1 (0 to 2.8s): Facing left towards the revealed board in Vanna White presentation pose
          if (pt < 2.8) {
            heroTinkerbell.facingLeft = true;
            heroTinkerbell.bodySway = Math.sin(pt * 2.8) * 1.6;
            heroTinkerbell.headAngle = -0.22; // Looking gracefully towards the letters
            heroTinkerbell.jumpSquash = 1.0;
          }
          // Phase 2 (2.8 to 3.5s): Turn back around facing forward/right and prep dive crouch!
          else {
            heroTinkerbell.facingLeft = false;
            heroTinkerbell.headAngle = 0;
            const prepP = (pt - 2.8) / 0.7;
            heroTinkerbell.jumpSquash = 1 + Math.sin(prepP * Math.PI) * 0.14; // squash crouch
            heroTinkerbell.y = badgeTopY + Math.sin(prepP * Math.PI) * 6;
          }

          if (Math.random() > 0.35) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 18, heroTinkerbell.y + 6, 1, ['#FFD700', '#00FFC8', '#FFF', '#C77DFF']);
          }

          if (pt >= EDGE_PAUSE_DURATION) {
            // Turn and launch into Olympic somersault dive down to the aEye area!
            heroTinkerbell.state = 'OLYMPIC_DIVE';
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.facingLeft = false;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 35, ['#00FFC8', '#FFD700', '#FFF', '#9D4EDD']);
          }
        }