const fs = require('fs');
let code = fs.readFileSync('/Users/bethrooney/Desktop/JOTS.MEDIA_AG/clients/bethElisePsychic_v50/js/main.js', 'utf8');
const domMock = `
const window = { 
  innerWidth: 1440, 
  innerHeight: 900, 
  devicePixelRatio: 2, 
  addEventListener: () => {}, removeEventListener: () => {},  
  matchMedia: () => ({ matches: false, addEventListener: () => {} }), 
  location: { pathname: '/' }, 
  scrollTo: () => {}, 
  scrollY: 0 
};
const history = { scrollRestoration: 'auto' };
const navigator = { userAgent: '' };

const createMockElement = (tag) => ({
  style: { setProperty: () => {} },
  classList: { add:()=>{}, remove:()=>{}, contains:()=>false, toggle:()=>false },
  getContext: () => ({ scale: ()=>{}, translate: ()=>{}, setTransform: ()=>{}, rotate: ()=>{}, getImageData: ()=>({data:[]}), putImageData: ()=>{}, ellipse: ()=>{}, lineTo: ()=>{}, quadraticCurveTo: ()=>{}, rect: ()=>{}, clearRect: ()=>{}, fillRect: ()=>{}, createRadialGradient: ()=>({addColorStop:()=>{}}), beginPath: ()=>{}, arc: ()=>{}, fill: ()=>{}, save: ()=>{}, restore: ()=>{}, clip: ()=>{}, bezierCurveTo: ()=>{}, moveTo: ()=>{}, closePath: ()=>{}, strokeStyle: '', shadowColor: '', lineWidth: 0, shadowBlur: 0, stroke: ()=>{}, drawImage: ()=>{}, globalCompositeOperation: '', globalAlpha: 1, createLinearGradient: ()=>({addColorStop:()=>{}}) }),
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 76, height: 76, right: 76, bottom: 76 }),
  offsetWidth: 76, 
  offsetHeight: 76,
  addEventListener: () => {}, removeEventListener: () => {}, 
  querySelector: () => createMockElement(),
  querySelectorAll: () => [],
  appendChild: () => {}, setAttribute: () => {}
});

const document = { 
  getElementById: (id) => createMockElement(id),
  createElement: (tag) => createMockElement(tag), createTextNode: () => ({}),
  querySelector: () => createMockElement(),
  querySelectorAll: () => [],
  addEventListener: (event, cb) => { if(event === 'DOMContentLoaded') cb(); }, removeEventListener: () => {},
  hidden: false,
  body: createMockElement('body')
};

const Image = class { constructor() { this.complete = true; this.naturalWidth = 100; } };
const performance = { now: () => Date.now() };
let frameCount = 0; const requestAnimationFrame = (cb) => { 
  // Call once immediately to simulate one frame
  if(frameCount++<5) setTimeout(() => cb(Date.now()), 0); 
};
const localStorage = { getItem: () => null, setItem: () => {} };
const Math = global.Math;
const console = { log: ()=>{}, error: (e)=>{ global.console.error(e); }, warn: (e)=>{ global.console.warn(e); }, assert: global.console.assert };

`;
try {
  eval(domMock + code);
  global.console.log("SUCCESS: No evaluation errors.");
} catch (e) {
  global.console.error("EVAL ERROR:", e);
}
setTimeout(() => {
  global.console.log("State of heroTinkerbell:", global.window.heroTinkerbell);
}, 200);
