import re

with open('js/main.js', 'r') as f:
    js = f.read()

# 1. Unhandled Promises
js = js.replace('this.ctx.resume();', 'this.ctx.resume().catch(e => console.warn("Audio resume blocked:", e));')

# 2. Missing touchmove events parallel to mousemove
sparkle_listen = r"document\.addEventListener\('mousemove',\s*\(e\)\s*=>\s*\{"
sparkle_touch = """document.addEventListener('mousemove', (e) => {
    handleSparkleMove(e.clientX, e.clientY);
});
document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
        handleSparkleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });
function handleSparkleMove(clientX, clientY) {"""

# Replace the mousemove with handleSparkleMove wrapper
js = re.sub(r"document\.addEventListener\('mousemove',\s*\(e\)\s*=>\s*\{(.*?const\s+now\s*=\s*performance\.now\(\);.*?)\n\s*const\s+x\s*=\s*e\.clientX;(\s*const\s+y\s*=\s*e\.clientY;)",
    r"document.addEventListener('mousemove', (e) => { handleSparkleMove(e.clientX, e.clientY); });\n    document.addEventListener('touchmove', (e) => { if(e.touches && e.touches[0]) handleSparkleMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });\n    function handleSparkleMove(clientX, clientY) {\1\n      const x = clientX;\2", js, flags=re.DOTALL)


# 3. Un-throttled scroll events
# We can use requestAnimationFrame for throttling scroll
js = re.sub(
    r"window\.addEventListener\('scroll',\s*\(\)\s*=>\s*\{\s*nav\?\.classList\.toggle\('scrolled',\s*window\.scrollY\s*>\s*40\);\s*\},(.*?)",
    r"let navScrollTicking = false;\n    window.addEventListener('scroll', () => {\n      if (!navScrollTicking) {\n        window.requestAnimationFrame(() => {\n          nav?.classList.toggle('scrolled', window.scrollY > 40);\n          navScrollTicking = false;\n        });\n        navScrollTicking = true;\n      }\n    },\1",
    js
)

js = re.sub(
    r"window\.addEventListener\('scroll',\s*\(\)\s*=>\s*\{\s*backToTopBtn\.classList\.toggle\('visible',\s*window\.scrollY\s*>\s*400\);\s*\},(.*?)",
    r"let bttScrollTicking = false;\n      window.addEventListener('scroll', () => {\n        if (!bttScrollTicking) {\n          window.requestAnimationFrame(() => {\n            backToTopBtn.classList.toggle('visible', window.scrollY > 400);\n            bttScrollTicking = false;\n          });\n          bttScrollTicking = true;\n        }\n      },\1",
    js
)


# 4. devicePixelRatio issues
js = js.replace('const dpr = window.devicePixelRatio || 1;', 'const dpr = Math.min(window.devicePixelRatio || 1, 2);')
js = re.sub(
    r'fw\s*=\s*footerCanvas\.width\s*=\s*footerCanvas\.offsetWidth\s*\|\|\s*window\.innerWidth;\s*fh\s*=\s*footerCanvas\.height\s*=\s*footerCanvas\.offsetHeight\s*\|\|\s*340;',
    r'const dpr = Math.min(window.devicePixelRatio || 1, 2);\n        fw = footerCanvas.offsetWidth || window.innerWidth;\n        fh = footerCanvas.offsetHeight || 340;\n        footerCanvas.width = fw * dpr;\n        footerCanvas.height = fh * dpr;\n        fCtx.scale(dpr, dpr);',
    js
)


# 5. State mutation bugs
js = js.replace('treePortal.sparks.splice(i, 1);\n              continue;', 'treePortal.sparks.splice(i, 1);\n              i--;\n              continue;')


# 6. Performance issues with 60fps loops on mobile (Sacred Eye)
# We add an intersection observer flag
js = re.sub(
    r'let hiddenStartTime\s*=\s*0;\s*let lastStaticPaint\s*=\s*0;',
    r'let hiddenStartTime = 0;\n        let lastStaticPaint = 0;\n        let eyeIsVisible = false;\n        const eyeObserver = new IntersectionObserver((entries) => { eyeIsVisible = entries[0].isIntersecting; });\n        const eyeCanvasEl = document.getElementById(\'sacred-eye-canvas\');\n        if (eyeCanvasEl) eyeObserver.observe(eyeCanvasEl);',
    js
)
js = js.replace('try {\n            if (!eyeCtx) return;', 'try {\n            if (!eyeCtx || (!eyeIsVisible && window.scrollY > 1500)) return;')

# 7. Fix Polaris overlapping Pill on Mobile
js = re.sub(
    r'const starX = w \* 0\.5;\n\s*const starY = Math\.max\(90, h \* 0\.095\);',
    r'const starX = w * 0.5;\n        const starY = (w < 768) ? Math.max(160, h * 0.15) : Math.max(90, h * 0.095);',
    js
)


with open('js/main.js', 'w') as f:
    f.write(js)
print("JS fixes applied")
