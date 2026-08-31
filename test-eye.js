class MockContext {
  save() {}
  restore() {}
  translate() {}
  beginPath() {}
  moveTo() {}
  bezierCurveTo() {}
  lineTo() {}
  quadraticCurveTo() {}
  closePath() {}
  clip() {}
  createRadialGradient() {
    return {
      addColorStop: () => {}
    };
  }
  fillRect() {}
  fill() {}
  arc() {}
  stroke() {}
  drawImage() {}
  clearRect() {}
  set fillStyle(v) {}
  set strokeStyle(v) {}
  set lineWidth(v) {}
  set shadowColor(v) {}
  set shadowBlur(v) {}
}

const eyeCtx = new MockContext();
const imgPhotorealisticIris = { complete: true, naturalWidth: 100 };

function drawOrganicEye(ctx, cx, cy, r, gazeX, gazeY, blinkPhase, pupilRadius, colors, now, isLocked = false) {
  ctx.save();
  ctx.translate(cx, cy);

  const aw = r * 1.58;
  const ah = r * 0.96;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-aw * 0.50, 0);
  ctx.bezierCurveTo(-aw * 0.32, -ah * 0.60, aw * 0.16, -ah * 0.54, aw * 0.50, -ah * 0.04);
  ctx.bezierCurveTo(aw * 0.22, ah * 0.52, -aw * 0.30, ah * 0.44, -aw * 0.50, 0);
  ctx.closePath();
  ctx.clip();

  const scleraGrad = ctx.createRadialGradient(-r * 0.15, -r * 0.15, 2, 0, 0, r);
  scleraGrad.addColorStop(0, '#FFFFFF');
  scleraGrad.addColorStop(0.55, '#FAF6FE');
  scleraGrad.addColorStop(0.82, '#E8DCF6');
  scleraGrad.addColorStop(1, '#C8ACEC');
  ctx.fillStyle = scleraGrad;
  ctx.fillRect(-aw * 0.65, -ah * 0.65, aw * 1.3, ah * 1.3);

  const irisPulse = 1.0 + Math.sin(now * 0.0032) * 0.08;
  const irisR = r * 0.49 * irisPulse;
  const safeGazeX = Math.max(-0.90, Math.min(0.90, gazeX || 0));
  const safeGazeY = Math.max(-0.85, Math.min(0.85, gazeY || 0));
  const ix = isLocked ? (safeGazeX * r * 0.15) : (safeGazeX * (r * 0.38));
  const iy = isLocked ? (safeGazeY * r * 0.15) : (safeGazeY * (r * 0.30));

  ctx.save();
  ctx.translate(ix, iy);

  const purpleCoronaPulse = 1.0 + Math.sin(now * 0.004) * 0.16;
  const irisCorona = ctx.createRadialGradient(0, 0, irisR * 0.1, 0, 0, irisR * 1.32 * purpleCoronaPulse);
  irisCorona.addColorStop(0, 'rgba(224, 170, 255, 0.95)');
  irisCorona.addColorStop(0.32, 'rgba(199, 125, 255, 0.85)');
  irisCorona.addColorStop(0.68, 'rgba(157, 78, 221, 0.65)');
  irisCorona.addColorStop(0.90, 'rgba(114, 9, 183, 0.35)');
  irisCorona.addColorStop(1, 'transparent');
  ctx.fillStyle = irisCorona;
  ctx.beginPath();
  ctx.arc(0, 0, irisR * 1.32 * purpleCoronaPulse, 0, Math.PI * 2);
  ctx.fill();

  if (imgPhotorealisticIris.complete && imgPhotorealisticIris.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, irisR, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgPhotorealisticIris, -irisR, -irisR, irisR * 2, irisR * 2);

    const irisGlowGrad = ctx.createRadialGradient(0, 0, irisR * 0.1, 0, 0, irisR);
    irisGlowGrad.addColorStop(0, 'rgba(224, 170, 255, 0.60)');
    irisGlowGrad.addColorStop(0.35, 'rgba(199, 125, 255, 0.45)');
    irisGlowGrad.addColorStop(0.70, 'rgba(157, 78, 221, 0.40)');
    irisGlowGrad.addColorStop(1, 'rgba(45, 0, 80, 0.65)');
    ctx.fillStyle = irisGlowGrad;
    ctx.fillRect(-irisR, -irisR, irisR * 2, irisR * 2);
    ctx.restore();
  } else {
    const irisGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, irisR);
    irisGrad.addColorStop(0, '#10002b');
    irisGrad.addColorStop(0.18, '#240046');
    irisGrad.addColorStop(0.38, '#5a189a');
    irisGrad.addColorStop(0.62, '#7b2cbf');
    irisGrad.addColorStop(0.82, '#9d4edd');
    irisGrad.addColorStop(0.94, '#c77dff');
    irisGrad.addColorStop(1, '#10002b');
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(0, 0, irisR, 0, Math.PI * 2);
    ctx.fill();
  }

  const numFibers = 40;
  for (let f = 0; f < numFibers; f++) {
    const fAng = (f / numFibers) * Math.PI * 2 + (now * 0.0004);
    const wave = Math.sin(f * 3.5 + now * 0.002) * (irisR * 0.04);
    const fLen1 = irisR * 0.26;
    const fLen2 = irisR * (0.90 + 0.06 * Math.sin(f * 2.2 + now * 0.002));
    ctx.strokeStyle = (f % 3 === 0) 
      ? 'rgba(255, 215, 0, 0.50)' 
      : (f % 3 === 1 ? 'rgba(0, 255, 200, 0.45)' : 'rgba(224, 170, 255, 0.75)');
    ctx.lineWidth = 0.75;
    const cosA = Math.cos(fAng);
    const sinA = Math.sin(fAng);
    ctx.beginPath();
    ctx.moveTo(cosA * fLen1, sinA * fLen1);
    ctx.lineTo(cosA * fLen2 + (-sinA * wave), sinA * fLen2 + (cosA * wave));
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(199, 125, 255, 0.90)';
  ctx.lineWidth = 1.2;
  ctx.shadowColor = '#C77DFF';
  ctx.shadowBlur = 8 * purpleCoronaPulse;
  ctx.beginPath();
  ctx.arc(0, 0, irisR - 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  const pupilBreath = 1.0 + Math.sin(now * 0.0026) * 0.12;
  const pRad = Math.max(irisR * 0.24, Math.min(irisR * 0.46, (pupilRadius || irisR * 0.32) * pupilBreath));
  
  ctx.fillStyle = 'rgba(114, 9, 183, 0.45)';
  ctx.beginPath();
  ctx.arc(0, 0, pRad + 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#05000a';
  ctx.beginPath();
  ctx.arc(0, 0, pRad, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(-irisR * 0.28, -irisR * 0.28, Math.max(2.2, r * 0.042), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.shadowColor = '#00FFC8';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(irisR * 0.22, irisR * 0.20, Math.max(1.2, r * 0.024), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(224, 170, 255, 0.85)';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(-irisR * 0.15, irisR * 0.26, Math.max(0.8, r * 0.016), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  if (blinkPhase > 0) {
    ctx.fillStyle = '#140026';
    const bh = ah * 0.65 * blinkPhase;

    ctx.beginPath();
    ctx.moveTo(-aw * 0.6, -ah * 0.6);
    ctx.lineTo(aw * 0.6, -ah * 0.6);
    ctx.lineTo(aw * 0.6, -ah * 0.6 + bh);
    ctx.quadraticCurveTo(0, -ah * 0.6 + bh * 1.4, -aw * 0.6, -ah * 0.6 + bh);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-aw * 0.6, ah * 0.6);
    ctx.lineTo(aw * 0.6, ah * 0.6);
    ctx.lineTo(aw * 0.6, ah * 0.6 - bh);
    ctx.quadraticCurveTo(0, ah * 0.6 - bh * 1.4, -aw * 0.6, ah * 0.6 - bh);
    ctx.closePath();
    ctx.fill();

    const llx = -aw * 0.45;
    const lly = -ah * 0.6 + bh;
    const lAng = Math.PI * 0.85;
    const lLen = r * 0.4;
    const lMidX = llx + Math.cos(lAng - 0.2) * (lLen * 0.5);
    const lMidY = lly + Math.sin(lAng - 0.2) * (lLen * 0.5);
    
    ctx.beginPath();
    ctx.moveTo(llx, lly);
    ctx.quadraticCurveTo(lMidX, lMidY, llx + Math.cos(lAng) * lLen, lly + Math.sin(lAng) * lLen);
    ctx.stroke();
  }

  ctx.restore();
}

function updateAndRenderSacredEye(now) {
  const aw = 76;
  const ah = 76;
  const acx = aw * 0.5;
  const acy = ah * 0.5;

  let currentIrisX = 0;
  let currentIrisY = 0;
  let targetIrisX = 0;
  let targetIrisY = 0;
  let blinkProgress = 0;

  eyeCtx.clearRect(0, 0, aw, ah);

  const normGazeX = (currentIrisX / 6.5);
  const normGazeY = (currentIrisY / 6.5);
  const eyeRadius = 31.0;
  const colors = ['#7B2CBF', '#9D4EDD', '#00FFC8'];
  drawOrganicEye(eyeCtx, acx, acy, eyeRadius, normGazeX, normGazeY, blinkProgress, 8.5, colors, now);
}

try {
  updateAndRenderSacredEye(1234.5);
  console.log("SUCCESS");
} catch(e) {
  console.error("ERROR", e);
}
