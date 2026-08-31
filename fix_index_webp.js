const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldBlock = `      criticalAssetUrls.forEach(function(url) {
        var img = new Image();
        img.src = url;
        if (img.decode) {
          img.decode().then(function() {
            window.PRELOADED_ASSETS[url] = img;
          }).catch(function() {
            window.PRELOADED_ASSETS[url] = img;
          });
        } else {
          img.onload = function() {
            window.PRELOADED_ASSETS[url] = img;
          };
        }
      });`;

const newBlock = `      criticalAssetUrls.forEach(function(url) {
        var img = new Image();
        
        function handleLoad() {
          if (img.decode) {
            img.decode().then(function() {
              window.PRELOADED_ASSETS[url] = img;
            }).catch(function() {
              window.PRELOADED_ASSETS[url] = img;
            });
          } else {
            window.PRELOADED_ASSETS[url] = img;
          }
        }
        
        if (url.endsWith('.png')) {
          img.src = url.replace('.png', '.webp');
          img.onload = handleLoad;
          img.onerror = function() {
            if (this.src.indexOf('.webp') !== -1) {
              this.src = url; // fallback to PNG
            } else {
              handleLoad(); // Failed both, but record anyway
            }
          };
        } else {
          img.src = url;
          img.onload = handleLoad;
          img.onerror = handleLoad;
        }
      });`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync('index.html', html);
console.log('WebP fallback added!');
