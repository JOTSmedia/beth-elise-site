        // ─── RENDER RETURNING EMPTY BUBBLE ORB (Ascending to Distant Star) ───
        if (returningBubbleOrb.active) {
          returningBubbleOrb.progress += dt / 3.2;
          const op = Math.min(1, returningBubbleOrb.progress);
          const easeOp = op * op * (3 - 2 * op);
          const swoopX = Math.sin(op * Math.PI) * (w * 0.05);

          returningBubbleOrb.x = (1 - easeOp) * returningBubbleOrb.startX + easeOp * returningBubbleOrb.targetX + swoopX;
          returningBubbleOrb.y = (1 - easeOp) * returningBubbleOrb.startY + easeOp * returningBubbleOrb.targetY;

          const orbScale = Math.max(0.04, 1.0 - op * 0.88);
          const orbAlpha = Math.max(0, 1.0 - op * 0.95);
          drawEmptyCelestialBubbleOrb(ctx, returningBubbleOrb.x, returningBubbleOrb.y, 56 * orbScale, now, orbAlpha);

          if (Math.random() > 0.35) {
            emitPixieDust(returningBubbleOrb.x, returningBubbleOrb.y, 1, ['#C77DFF', '#FFD700', '#00FFC8', '#FFF']);
          }

          if (op >= 1) {
            returningBubbleOrb.active = false;
          }
        }

        // ─── RENDER AVATAR SPRITE / GLINDA ORB ───
        if (heroTinkerbell.state !== 'SPAWNING') {
          // 1. Inside Glinda Starlight Bubble Orb
          if (heroTinkerbell.state === 'ORB_FLOATING') {
            drawCelestialOrb(ctx, heroTinkerbell.x, heroTinkerbell.y, now, 1.0);
          }
          // 2. Flying down onto Crescent Moon Crest — Wings unfurled
          else if (heroTinkerbell.state === 'FLYING_TO_LOGO') {
            drawHeroTinkerbellSprite(
              ctx,
              heroTinkerbell.x,
              heroTinkerbell.y,
              heroTinkerbell.wingPhase,
              heroTinkerbell.headAngle,
              false,
              0,
              heroTinkerbell.isStrutting,
              heroTinkerbell.strutPhase || 0,
              heroTinkerbell.facingLeft,
              heroTinkerbell.diveAngle || 0,
              false,
              now
            );
          }
          // 3. Fully Materialized 3D Badass Fairy Avatar
          else {