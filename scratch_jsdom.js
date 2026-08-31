const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    console.error("PAGE ERROR:", ...arguments);
});
virtualConsole.on("warn", () => {
    console.warn("PAGE WARN:", ...arguments);
});
virtualConsole.on("info", () => {
    console.info("PAGE INFO:", ...arguments);
});
virtualConsole.on("dir", () => {
    console.dir("PAGE DIR:", ...arguments);
});
virtualConsole.on("jsdomError", (e) => {
    console.error("JSDOM ERROR:", e.message, e.stack);
});

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
  url: "http://localhost:8080/",
  runScripts: "dangerously",
  resources: "usable",
  virtualConsole
});
