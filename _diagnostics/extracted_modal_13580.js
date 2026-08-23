      for (let i = 0; i < numStars; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distNorm = 0.2 + 0.75 * Math.sqrt(Math.random());
        stars.push({
          x: 0.5 + Math.cos(angle) * (distNorm * 0.45),
          y: 0.5 + Math.sin(angle) * (distNorm * 0.45),
          baseSize: 1.2 + Math.random() * 2.6,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkleSpeed: 0.0018 + Math.random() * 0.0035,
          phase: Math.random() * Math.PI * 2,
          isCross: Math.random() > 0.45,
          vx: (Math.random() - 0.5) * 0.00004,
          vy: (Math.random() - 0.5) * 0.00004,
        });
      }

      let isVisible = true;
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          isVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        obs.observe(canvas);
      }

      function drawStars(now) {
        if (!isVisible) {
          requestAnimationFrame(drawStars);
          return;
        }

        const cssW = canvas.clientWidth || 560;
        const cssH = canvas.clientHeight || 560;
        ctx.clearRect(0, 0, cssW, cssH);

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          
          // Gentle drift
          s.x = (s.x + s.vx + 1) % 1;
          s.y = (s.y + s.vy + 1) % 1;

          const sx = s.x * cssW;
          const sy = s.y * cssH;

          // Twinkle pulse
          const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * s.twinkleSpeed + s.phase));

          // Proximity to mouse/touch interaction
          const dx = sx - mouseX;
          const dy = sy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const prox = Math.max(0, 1 - dist / 90);
          const flareBonus = prox * 1.8;

          const size = s.baseSize * (1 + flareBonus * 0.8) * twinkle;
          const alpha = Math.min(1, (0.3 + 0.7 * twinkle) + prox * 0.4);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8 + flareBonus * 12;

          // Center star orb
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();

          // 4-point cross-glint diamond sparkle for larger stars or hovered stars
          if (s.isCross || prox > 0.2) {
            const armLen = size * (2.8 + flareBonus * 2.0);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = Math.max(0.7, size * 0.28);
            
            // Vertical spike
            ctx.beginPath();
            ctx.moveTo(sx, sy - armLen);
            ctx.lineTo(sx, sy + armLen);
            ctx.stroke();

            // Horizontal spike
            ctx.beginPath();
            ctx.moveTo(sx - armLen, sy);
            ctx.lineTo(sx + armLen, sy);
            ctx.stroke();

            // Tiny central white diamond core
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(sx, sy, size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        requestAnimationFrame(drawStars);
      }

      requestAnimationFrame(drawStars);
    }

    initAuraScanner();
    initAuraStarsCanvas();

    // ─── INTERACTIVE APPOINTMENT SCHEDULER (Contact Page) ───
    const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
    let selectedTimeSlot = '';

    timeSlotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timeSlotBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTimeSlot = btn.textContent.trim();
      });
    });

    // ─── INQUIRY FORM ────────────────────────────────
    const inquiryForm = document.getElementById('inquiry-form');
    const formSuccess = document.querySelector('.form__success');

    inquiryForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('name')?.value?.trim();
      const email   = document.getElementById('email')?.value?.trim();
      const service = document.getElementById('service')?.value;
      const message = document.getElementById('message')?.value?.trim();

      if (!name || !email || !service || !message) {
        showToast('Please fill in all required fields.', 'sparkle');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'letter');
        return;
      }

      const btn = inquiryForm.querySelector('.form__submit');
      if (btn) { setPico(btn, 'sparkle', 'Connecting with Beth Elise...'); btn.disabled = true; }

      setTimeout(() => {
        inquiryForm.style.display = 'none';
        formSuccess?.classList.add('active');
        showToast('Message sent! Beth Elise will connect within 24–48 hours.', 'star');
      }, 1000);
    });

    // ─── NEWSLETTER FORMS ────────────────────────────
    document.querySelectorAll('.newsletter__form, .footer__newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input?.value?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          showToast('Please enter a valid email address.', 'letter');
          return;
        }
        const btn = form.querySelector('button');
        const orig = btn?.textContent;
        if (btn) btn.textContent = '✓ You\'re in!';
        input.value = '';
        showToast('Welcome to the circle, dear soul!', 'blossom');
        setTimeout(() => { if (btn && orig) btn.textContent = orig; }, 3500);
      });
    });

    function setPico(el, icon, text) {
      if (!el) return;
      el.textContent = '';
      const span = document.createElement('span');
      span.className = `pico pico--${icon}${text ? ' pico--inline' : ''}`;
      span.setAttribute('aria-hidden', 'true');
      if (text) span.style.marginRight = '0.4em';
      el.appendChild(span);
      if (text) el.appendChild(document.createTextNode(text));
    }

    // ─── TOAST NOTIFICATIONS ─────────────────────────
    function showToast(msg, icon = 'sparkle') {
      let toast = document.querySelector('.toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = '';
      
      const iconSpan = document.createElement('span');
      iconSpan.className = `pico pico--${icon}`;
      iconSpan.setAttribute('aria-hidden', 'true');
      toast.appendChild(iconSpan);

      const msgSpan = document.createElement('span');
      msgSpan.textContent = ` ${msg} `;
      toast.appendChild(msgSpan);

      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'toast__close';
      closeBtn.setAttribute('aria-label', 'Close notification');
      closeBtn.textContent = '×';
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        toast.classList.remove('show');
        clearTimeout(toast._timer);
      };
      toast.appendChild(closeBtn);

      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // Beth greeting bubble manual close button
    const bethGreetCloseBtn = document.getElementById('beth-greeting-close-btn');
    if (bethGreetCloseBtn) {
      bethGreetCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const gEl = document.getElementById('beth-greeting-bubble');
        if (gEl) {
          gEl.classList.remove('is-visible');
          setTimeout(() => { gEl.hidden = true; }, 300);
        }
      });
    }

    // ─── HIGH-PERFORMANCE SMOOTH SCROLL ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 85;
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      });
    });

    // ─── ACTIVE NAV HIGHLIGHT (High-Performance RAF Scroll Spy) ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');
    let scrollTicking = false;

    function updateActiveNav() {
      const sp = window.scrollY + 140;
      let currentSecId = '';

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (sp >= top && sp < top + height) {
          currentSecId = sec.id;
        }
      });

      if (currentSecId) {
        navLinks.forEach(lk => {
          const href = lk.getAttribute('href') || '';
          const matches = href === `#${currentSecId}` || href.endsWith(`#${currentSecId}`);
          lk.classList.toggle('active', matches);
        });
      }
      scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(updateActiveNav);
        scrollTicking = true;
      }
    }, { passive: true });

    // ─── PERSISTENT aEYE SACRED GUIDE (Unified Continuous aEYE Entity) ───
    function initSacredAssistant() {
      const widget = document.getElementById('sacred-assistant-widget');
      const avatarBtn = document.getElementById('assistant-avatar-btn');
      const avatarCanvas = document.getElementById('assistant-avatar-canvas');
      const bubble = document.getElementById('assistant-speech-bubble');
      const bubbleText = document.getElementById('assistant-bubble-text');
      const bubbleClose = document.getElementById('assistant-bubble-close');
      const modal = document.getElementById('assistant-modal');
      const closeModalBtn = document.getElementById('close-assistant-modal-btn');
      const modalLinks = document.querySelectorAll('.assistant-link-card');
      const searchInput = document.getElementById('aeye-search-input');

      if (!widget) return;

      // Draw the Living aEYE on Home Base Canvas with Lifelike Gaze & Blinks
      if (avatarCanvas) {
        const actx = avatarCanvas.getContext('2d');

        let targetGazeX = 0, targetGazeY = 0;
        let curGazeX = 0, curGazeY = 0;
        let lastSaccadeTime = 0;
        let saccadeOffsetX = 0, saccadeOffsetY = 0;
        let nextBlinkTime = performance.now() + 3000;
        let blinkPhase = 0; // 0 = open, 1 = fully closed

        window.addEventListener('mousemove', (e) => {
          const rect = avatarCanvas.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width * 0.5);
          const dy = e.clientY - (rect.top + rect.height * 0.5);
          const dist = Math.hypot(dx, dy);
          const maxDist = 300;
          const clampedDist = Math.min(1, dist / maxDist);
          targetGazeX = (dx / (dist || 1)) * clampedDist * 7.5;
          targetGazeY = (dy / (dist || 1)) * clampedDist * 6.5;
        }, { passive: true });

        function renderAvatar(now) {
          const aw = avatarCanvas.width;
          const ah = avatarCanvas.height;
          const acx = aw * 0.5;
          const acy = ah * 0.5;
          actx.clearRect(0, 0, aw, ah);

          // Hide static home base when the living aEYE has relocated (in flight / menu / aura scanner)
          if (heroAeyeMenu.state !== 'IDLE' || heroTinkerbell.state === 'MENU_TAKEOFF' || heroTinkerbell.state === 'MENU_PERCHED' || heroTinkerbell.state === 'MENU_DIVE_BACK' || heroTinkerbell.state === 'AURA_TAKEOFF' || heroTinkerbell.state === 'AURA_SCANNING' || heroTinkerbell.state === 'AURA_HOVER' || heroTinkerbell.state === 'AURA_LOCKED' || heroTinkerbell.state === 'AURA_DIVE_BACK') {
            if (!reduceMotion()) requestAnimationFrame(renderAvatar);
            return;
          }

          // Organic Micro-saccades
          if (now - lastSaccadeTime > 2200 + Math.random() * 1800) {
            lastSaccadeTime = now;
            saccadeOffsetX = (Math.random() - 0.5) * 2.8;
            saccadeOffsetY = (Math.random() - 0.5) * 2.2;
          }

          // Smooth gaze easing
          curGazeX += (targetGazeX + saccadeOffsetX - curGazeX) * 0.14;
          curGazeY += (targetGazeY + saccadeOffsetY - curGazeY) * 0.14;

          // Organic Blinking
          if (now > nextBlinkTime) {
            const blinkElapsed = (now - nextBlinkTime) / 220; // 220ms blink duration
            if (blinkElapsed < 0.5) {
              blinkPhase = blinkElapsed * 2; // closing
            } else if (blinkElapsed < 1.0) {
              blinkPhase = (1.0 - blinkElapsed) * 2; // opening
            } else {
              blinkPhase = 0;
              nextBlinkTime = now + 3200 + Math.random() * 2600;
            }
          }

          // 1. Draw the Unified Continuous aEYE Entity (Exact same visual everywhere)
          drawUnifiedAEye(
            actx,
            acx,
            acy,
            30,
            curGazeX,
            curGazeY,
            blinkPhase,
            now
          );

          if (!reduceMotion()) requestAnimationFrame(renderAvatar);
        }
        requestAnimationFrame(renderAvatar);
      }