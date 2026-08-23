        // ─── DYNAMIC SPEECH BUBBLE REAL-TIME POSITION TRACKING ───
        if (activeSpeechBubble.visible) {
          updateBethSpeechBubblePosition();
        }

        // ─── RENDER AVATAR SPRITE / GLINDA ORB ───
        if (heroTinkerbell.state !== 'SPAWNING') {
          // 1. Inside Glinda Starlight Bubble Orb
          if (heroTinkerbell.state === 'ORB_FLOATING') {
            drawCelestialOrb(ctx, heroTinkerbell.x, heroTinkerbell.y, now, 1.0);
          }