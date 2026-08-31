const fs = require('fs');

const console = { log: ()=>{}, error: (e)=>{ global.console.error(e); }, warn: ()=>{}, assert: global.console.assert };
const window = {
  innerWidth: 1440,
  innerHeight: 900,
  devicePixelRatio: 2,
  addEventListener: () => {},
  removeEventListener: () => {},
  requestAnimationFrame: (cb) => { setTimeout(() => cb(100), 16); return 1; },
  cancelAnimationFrame: () => {},
  location: { hash: '' },
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  document: {},
  scrollTo: () => {}
};
const document = {
  querySelector: () => ({
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100, bottom: 100 }),
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
  }),
  getElementById: (id) => ({
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 1440, height: 900, bottom: 900 }),
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    getContext: () => ({
      clearRect: () => {}, setTransform: () => {}, save: () => {}, restore: () => {},
      beginPath: () => {}, arc: () => {}, fill: () => {}, stroke: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      moveTo: () => {}, lineTo: () => {}, quadraticCurveTo: () => {}, bezierCurveTo: () => {},
      clip: () => {}, rect: () => {}, fillRect: () => {},
      translate: () => {}, scale: () => {}, rotate: () => {},
      drawImage: () => {}
    }),
    width: 1440,
    height: 900
  }),
  createElement: () => ({
    getContext: () => ({}), style: {}, classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}
  }),
  hidden: false,
  body: { style: {} },
  documentElement: { style: {} },
  addEventListener: () => {}
};
window.document = document;
const navigator = { userAgent: 'test' };
const performance = { now: () => Date.now() };
const history = { replaceState: () => {} };

let code = fs.readFileSync('js/main.js', 'utf8');

const injection = `
      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {
        if (!window.__TEST_LOGGED) {
          global.console.log('updateAndRenderHeroTinkerbell is running, state:', heroTinkerbell.state, 'alpha:', heroTinkerbell.alpha);
          window.__TEST_LOGGED = true;
        }
`;

code = code.replace("      function updateAndRenderHeroTinkerbell(ctx, now, dt = 0.016) {", injection);

try {
  eval(code);
  setTimeout(() => {
    // Wait for frames
  }, 200);
} catch (e) {
  global.console.error("ERROR:", e);
}
