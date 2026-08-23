function drawHeroTinkerbellSprite(ctx, x, y, wingPhase, headAngle = 0, isPerched = false, sway = 0, isStrutting = false, strutPhase = 0, facingLeft = false, diveAngle = 0, isGreeting = false, now = performance.now()) {
        ctx.save();
        ctx.translate(x + sway, y);

        if (facingLeft) ctx.scale(-1, 1);
        if (diveAngle !== 0) ctx.rotate(diveAngle);

        const baseScale = 0.18;
        ctx.scale(baseScale, baseScale);

        // 1. Radiant Stardust Aura & Solfeggio Halo
        const pulse = 1.0 + Math.sin(wingPhase * 0.5) * 0.12;
        const aura = ctx.createRadialGradient(0, -60, 20, 0, -60, 260 * pulse);
        aura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        aura.addColorStop(0.25, 'rgba(0, 255, 200, 0.65)');
        aura.addColorStop(0.65, 'rgba(157, 78, 221, 0.35)');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(0, -60, 260 * pulse, 0, Math.PI * 2);
        ctx.fill();

        const flap = Math.sin(wingPhase || 0);

        // 2. Animated Flapping Gossamer Wings (Behind Body)
        if (imgAvatarWingLeft.complete && imgAvatarWingLeft.naturalWidth > 0 &&
            imgAvatarWingRight.complete && imgAvatarWingRight.naturalWidth > 0) {
          
          // Left Wing
          ctx.save();
          ctx.translate(-25, -110);
          ctx.scale(0.85 + flap * 0.35, 1.0 + Math.abs(flap) * 0.15);
          ctx.rotate(-0.15 + flap * 0.22);
          ctx.drawImage(imgAvatarWingLeft, -140, -180, 220, 280);
          ctx.restore();

          // Right Wing
          ctx.save();
          ctx.translate(25, -110);
          ctx.scale(0.85 - flap * 0.35, 1.0 + Math.abs(flap) * 0.15);
          ctx.rotate(0.15 - flap * 0.22);
          ctx.drawImage(imgAvatarWingRight, 