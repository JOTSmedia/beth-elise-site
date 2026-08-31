const fs = require('fs');

global.window = {
  innerWidth: 1920,
  innerHeight: 1080,
  preloaderDone: false,
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  listeners: {},
  addEventListener: (type, fn) => {
    window.listeners[type] = window.listeners[type] || [];
    window.listeners[type].push(fn);
  },
  removeEventListener: () => {},
  dispatchEvent: (e) => {
    if (window.listeners[e.type]) {
      window.listeners[e.type].forEach(fn => fn(e));
    }
  },
  location: { reload: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} }
};
global.CustomEvent = class {
  constructor(type) { this.type = type; }
};
global.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
};

const createMockEl = () => ({
  offsetWidth: 1920,
  offsetHeight: 1080,
  width: 1920,
  height: 1080,
  getBoundingClientRect: () => ({ left: 100, top: 100, width: 200, height: 100, right: 300, bottom: 200 }),
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
  style: {},
  appendChild: () => {},
  setAttribute: () => {},
  getAttribute: () => '',
  querySelector: () => createMockEl(),
  querySelectorAll: () => [createMockEl(), createMockEl()],
  getContext: () => ({
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    arcTo: () => {},
    ellipse: () => {},
    quadraticCurveTo: () => {},
    bezierCurveTo: () => {},
    fill: () => {},
    stroke: () => {},
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    drawImage: () => {},
    measureText: () => ({ width: 50 }),
    fillText: () => {},
    clip: () => {},
    scale: () => {},
    translate: () => {},
    rotate: () => {}
  })
});

global.document = {
  readyState: 'complete',
  addEventListener: (type, fn) => {
    window.addEventListener(type, fn);
  },
  removeEventListener: () => {},
  querySelector: () => createMockEl(),
  querySelectorAll: () => [createMockEl(), createMockEl()],
  getElementById: () => createMockEl(),
  createElement: () => createMockEl(),
  body: createMockEl()
};

global.Image = class {
  constructor() {
    this.complete = true;
    this.naturalWidth = 100;
    this.naturalHeight = 100;
  }
};

let rafCallbacks = [];
global.requestAnimationFrame = (fn) => {
  rafCallbacks.push(fn);
  return rafCallbacks.length;
};
let currentTime = 1000;
global.performance = { now: () => currentTime };

const code = fs.readFileSync('js/main.js', 'utf8');
eval(code);

// Trigger DOMContentLoaded
if (window.listeners['DOMContentLoaded']) {
  window.listeners['DOMContentLoaded'].forEach(fn => fn());
}

console.log("DOMContentLoaded triggered. Running initial frames...");
for (let frame = 0; frame < 10; frame++) {
  currentTime += 16.6;
  const cbs = rafCallbacks.slice();
  rafCallbacks = [];
  cbs.forEach(cb => cb(currentTime));
}

console.log("Dispatching preloaderDone...");
window.preloaderDone = true;
window.dispatchEvent(new CustomEvent('preloaderDone'));
if (typeof window.startHeroBethAvatarIntro === 'function') {
  window.startHeroBethAvatarIntro();
}

console.log("Simulating 600 frames (10 seconds) of full avatar choreography...");
for (let frame = 0; frame < 600; frame++) {
  currentTime += 16.6;
  const cbs = rafCallbacks.slice();
  rafCallbacks = [];
  cbs.forEach(cb => cb(currentTime));
}

console.log("SUCCESS: 600 frames executed cleanly with ZERO runtime errors!");
