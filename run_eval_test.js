const fs = require('fs');
let code = fs.readFileSync('test_actx_draw.js', 'utf8');

const testMain = fs.readFileSync('test_main.js', 'utf8');
const domMock = testMain.split("try {")[0].split("let code =")[1].replace("fs.readFileSync('/Users/bethrooney/Desktop/JOTS.MEDIA_AG/clients/bethElisePsychic_v50/js/main.js', 'utf8');", "");

try {
  eval(domMock + code);
} catch (e) {
  global.console.log(e);
}
