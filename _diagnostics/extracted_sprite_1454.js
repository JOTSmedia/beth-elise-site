          // 3. Fully Materialized 3D Badass Fairy Avatar
          else {
            const isPerched = (heroTinkerbell.state === 'PERCHED_LOGO' || heroTinkerbell.state === 'MENU_PERCHED');
            const isGreeting = (heroTinkerbell.state === 'BETH_GREETING' || heroTinkerbell.state === 'MENU_PERCHED');
            const spriteAlpha = heroTinkerbell.alpha === undefined ? 1 : heroTinkerbell.alpha;
            if (spriteAlpha > 0.01) {
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