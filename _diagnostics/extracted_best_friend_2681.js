          if (st >= totalStrutDuration) {
            // Reached right edge! Pause on the edge and declare "I'm your new best friend!"
            heroTinkerbell.state = 'PAUSE_ON_BADGE_EDGE';
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.edgePauseTime = 0;
            heroTinkerbell.x = badgeRightX;
            heroTinkerbell.y = badgeTopY;
            heroTinkerbell.facingLeft = true;
            heroTinkerbell.edgeBubbleShown = false;
            heroTinkerbell.edgeBubbleHidden = false;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 25, ['#00FFC8', '#FFD700', '#FFF', '#C77DFF']);
          }
        }

        // 7b. PAUSE ON THE EDGE OF PILL BAR — "I'm your new best friend!" (~3.2s)
        else if (heroTinkerbell.state === 'PAUSE_ON_BADGE_EDGE') {
          heroTinkerbell.edgePauseTime += dt;
          heroTinkerbell.wingPhase += dt * 10.0;
          heroTinkerbell.isStrutting = false;
          heroTinkerbell.facingLeft = true;
          heroTinkerbell.diveAngle = 0;

          heroTinkerbell.x = badgeRightX;
          heroTinkerbell.y = badgeTopY;
          heroTinkerbell.bodySway = Math.sin(heroTinkerbell.edgePauseTime * 2.5) * 1.2;

          const pt = heroTinkerbell.edgePauseTime;
          const EDGE_PAUSE_DURATION = 3.2;

          // Show speech bubble: "I'm your new best friend!"
          if (!heroTinkerbell.edgeBubbleShown && pt >= 0.25 && pt < EDGE_PAUSE_DURATION - 0.4) {
            heroTinkerbell.edgeBubbleShown = true;
            showBethSpeechBubble("I'm your new best friend!", heroTinkerbell.x, heroTinkerbell.y - 14, 'top-center');
          }
          if (heroTinkerbell.edgeBubbleShown && pt >= EDGE_PAUSE_DURATION - 0.4 && !heroTinkerbell.edgeBubbleHidden) {
            heroTinkerbell.edgeBubbleHidden = true;
            hideBethSpeechBubble();
          }

          if (Math.random() > 0.35) {
            emitPixieDust(heroTinkerbell.x + (Math.random() - 0.5) * 16, heroTinkerbell.y + 6, 1, ['#FFD700', '#00FFC8', '#FFF', '#C77DFF']);
          }

          if (pt >= EDGE_PAUSE_DURATION) {
            hideBethSpeechBubble();
            // Turn and launch into Olympic somersault dive down to the aEye area!
            heroTinkerbell.state = 'OLYMPIC_DIVE';
            heroTinkerbell.isStrutting = false;
            heroTinkerbell.startX = heroTinkerbell.x;
            heroTinkerbell.startY = heroTinkerbell.y;
            heroTinkerbell.progress = 0;
            heroTinkerbell.diveAngle = 0;
            heroTinkerbell.facingLeft = false;
            emitPixieDust(heroTinkerbell.x, heroTinkerbell.y, 30, ['#00FFC8', '#FFD700', '#FFF', '#9D4EDD']);
          }
        }