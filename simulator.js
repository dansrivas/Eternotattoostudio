/**
 * ETERNO TATTOO STUDIO - AR SIMULATOR MODULE
 * Loaded dynamically to improve initial page load speed.
 */

window.initSimulator = function() {
  const canvas = document.getElementById('ar-canvas');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  if (!canvas || !canvasWrapper) return;

  console.log("AR Simulator Module: Initializing...");
  
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  let bgImg = null;
  let fgImg = null;
  let fgCanvas = document.createElement('canvas'); 
  let fgCtx = fgCanvas.getContext('2d', { willReadFrequently: true });
  
  let bgScale = 1; 
  let bgX = 0; let bgY = 0; let bgAngle = 0;
  let bgOffsetX = 0; let bgOffsetY = 0;
  let bgBaseScale = 1; 
  let bgInitialized = false; 
  
  let fgPos = { x: 50, y: 50, width: 150, height: 150, angle: 0 };
  
  let isDragging = false;
  let isErasing = false;
  let dragOffset = { x: 0, y: 0 };
  let undoStack = []; 
  
  let initialPinchDistance = null;
  let initialPinchAngle = 0;
  let initialPinchCenter = { x: 0, y: 0 };
  let initialFgWidth = null;
  let initialFgHeight = null;
  let initialFgAngle = 0;
  let initialFgCenter = { x: 0, y: 0 };
  let initialBgScale = 1;
  
  let isMultiply = false;
  let isFlipped = false;
  let isEraserMode = false;
  let brushSize = 25;
  
  const btnBlend = document.getElementById('btn-blend');
  const btnFlipFg = document.getElementById('btn-flip-fg');
  const btnEraser = document.getElementById('btn-eraser');
  const btnUndo = document.getElementById('btn-undo');
  const btnClear = document.getElementById('btn-clear-canvas');
  const btnDownload = document.getElementById('btn-download');
  const btnWhatsappAr = document.getElementById('btn-whatsapp-ar');
  const eraserCursor = document.getElementById('eraser-cursor');
  const btnRotateBg = document.getElementById('btn-rotate-bg');

  let currentSimStep = 1;
  const simPanes = document.querySelectorAll('.sim-pane');
  const simInds = document.querySelectorAll('.sim-step-indicator');

  function updateSimUI() {
    simPanes.forEach((pane, idx) => {
      pane.style.display = (idx + 1 === currentSimStep) ? 'block' : 'none';
      pane.classList.toggle('active', idx + 1 === currentSimStep);
    });

    simInds.forEach((ind, idx) => {
      const indicatorNum = idx + 1;
      let isActive = false;
      let isCompleted = false;

      if (indicatorNum === 1) { 
        isActive = (currentSimStep === 1 || currentSimStep === 2);
        isCompleted = (currentSimStep > 2);
      } else if (indicatorNum === 2) { 
        isActive = (currentSimStep === 3 || currentSimStep === 4);
        isCompleted = (currentSimStep > 4);
      } else if (indicatorNum === 3) { 
        isActive = (currentSimStep === 5);
      }

      ind.classList.toggle('active', isActive);
      ind.classList.toggle('completed', isCompleted);
    });

    if (currentSimStep >= 1) {
      resizeCanvas();
    }
  }

  const btnStep3 = document.getElementById('btn-to-step-3');
  const btnStep4 = document.getElementById('btn-to-step-4');
  const btnStep5 = document.getElementById('btn-to-step-5');
  const btnBacks = document.querySelectorAll('.btn-go-back');

  if (btnStep3) btnStep3.addEventListener('click', () => { currentSimStep = 3; updateSimUI(); });
  if (btnStep4) btnStep4.addEventListener('click', () => { currentSimStep = 4; updateSimUI(); });
  if (btnStep5) btnStep5.addEventListener('click', () => { currentSimStep = 5; updateSimUI(); });

  btnBacks.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-target'));
      if (target === 1) {
        bgImg = null;
        const upBg = document.getElementById('upload-bg');
        if(upBg) upBg.value = '';
      }
      if (target <= 2) {
        fgImg = null;
        const upFg = document.getElementById('upload-fg');
        if(upFg) upFg.value = '';
      }
      currentSimStep = target;
      updateSimUI();
      draw();
    });
  });

  function resizeCanvas() {
    canvas.width = canvasWrapper.clientWidth;
    canvas.height = canvasWrapper.clientHeight;
    draw();
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function initTattooLayer() {
    if(!fgImg) return;
    const maxDim = 800;
    let scale = 1;
    if (fgImg.width > maxDim || fgImg.height > maxDim) {
       scale = Math.min(maxDim / fgImg.width, maxDim / fgImg.height);
    }
    fgCanvas.width = fgImg.width * scale;
    fgCanvas.height = fgImg.height * scale;
    fgCtx.clearRect(0,0, fgCanvas.width, fgCanvas.height);
    fgCtx.drawImage(fgImg, 0, 0, fgCanvas.width, fgCanvas.height);
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    let bgRect = { x: 0, y: 0, w: 0, h: 0 };

    if(bgImg) {
      if (!bgInitialized) {
        if (bgAngle % 180 !== 0) {
          bgBaseScale = Math.min(canvas.width / bgImg.height, canvas.height / bgImg.width);
        } else {
          bgBaseScale = Math.min(canvas.width / bgImg.width, canvas.height / bgImg.height);
        }
        bgScale = bgBaseScale;
        bgOffsetX = 0; bgOffsetY = 0; bgInitialized = true;
      }
      const drawW = bgImg.width * bgScale;
      const drawH = bgImg.height * bgScale;
      bgX = (canvas.width / 2) - (drawW / 2) + bgOffsetX;
      bgY = (canvas.height / 2) - (drawH / 2) + bgOffsetY;
      bgRect = { x: bgX, y: bgY, w: drawW, h: drawH };
      ctx.save();
      ctx.translate(bgX + drawW/2, bgY + drawH/2);
      ctx.rotate(bgAngle * Math.PI / 180);
      ctx.drawImage(bgImg, -drawW/2, -drawH/2, drawW, drawH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#111'; ctx.fillRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = '#444'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('1. Sube tu foto (Piel)', canvas.width/2, canvas.height/2 - 20);
      ctx.fillText('2. Sube el diseño (Tatuaje)', canvas.width/2, canvas.height/2 + 20);
    }
    
    if(fgImg) {
      ctx.save();
      if (bgImg) {
        ctx.beginPath();
        if (bgAngle % 180 !== 0) { ctx.rect(bgX + (bgRect.w - bgRect.h)/2, bgY + (bgRect.h - bgRect.w)/2, bgRect.h, bgRect.w); }
        else { ctx.rect(bgX, bgY, bgRect.w, bgRect.h); }
        ctx.clip();
      }
      if(isMultiply) ctx.globalCompositeOperation = 'multiply';
      ctx.translate(fgPos.x + fgPos.width/2, fgPos.y + fgPos.height/2);
      ctx.rotate(fgPos.angle * Math.PI / 180);
      if(isFlipped) ctx.scale(-1, 1);
      ctx.drawImage(fgCanvas, -fgPos.width/2, -fgPos.height/2, fgPos.width, fgPos.height);
      ctx.restore();
    }
  }

  function saveUndoState() {
    if(!fgImg) return;
    undoStack.push(fgCtx.getImageData(0, 0, fgCanvas.width, fgCanvas.height));
    if(undoStack.length > 10) undoStack.shift();
    if(btnUndo) btnUndo.disabled = false;
  }

  document.getElementById('upload-bg').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const img = new Image();
      img.onload = () => { bgImg = img; currentSimStep = 2; bgScale = 1; bgOffsetX = 0; bgOffsetY = 0; bgInitialized = false; updateSimUI(); draw(); };
      img.src = URL.createObjectURL(file);
    }
  });

  document.getElementById('upload-fg').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const img = new Image();
      img.onload = () => { fgImg = img; fgPos.width = 180; fgPos.height = 180 * (img.height / img.width); fgPos.x = (canvas.width / 2) - (fgPos.width / 2); fgPos.y = (canvas.height / 2) - (fgPos.height / 2); initTattooLayer(); currentSimStep = 4; updateSimUI(); draw(); };
      img.src = URL.createObjectURL(file);
    }
  });

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if(e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleStart(e) {
    if (e.touches && e.touches.length === 2) {
      if (e.cancelable) e.preventDefault();
      isDragging = false; isErasing = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.hypot(dx, dy);
      initialPinchAngle = Math.atan2(dy, dx);
      if (currentSimStep === 2 && bgImg) { initialBgScale = bgScale; return; }
      initialFgWidth = fgPos.width; initialFgHeight = fgPos.height; initialFgAngle = fgPos.angle;
      initialPinchCenter = { x: (e.touches[0].clientX + e.touches[1].clientX)/2, y: (e.touches[0].clientY + e.touches[1].clientY)/2 };
      initialFgCenter = { x: fgPos.x + fgPos.width/2, y: fgPos.y + fgPos.height/2 };
      return;
    }
    const pos = getPos(e);
    if(isEraserMode && fgImg && currentSimStep === 4) { saveUndoState(); isErasing = true; eraseAt(pos); }
    else if(currentSimStep === 2 && bgImg) { isDragging = true; dragOffset.x = pos.x - bgOffsetX; dragOffset.y = pos.y - bgOffsetY; }
    else if(currentSimStep === 4 && fgImg && pos.x > fgPos.x && pos.x < fgPos.x + fgPos.width && pos.y > fgPos.y && pos.y < fgPos.y + fgPos.height) { isDragging = true; dragOffset.x = pos.x - fgPos.x; dragOffset.y = pos.y - fgPos.y; }
  }

  function handleMove(e) {
    if (e.touches && e.touches.length === 2 && initialPinchDistance) {
      if (e.cancelable) e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / initialPinchDistance;
      if (currentSimStep === 2 && bgImg) { bgScale = initialBgScale * scale; bgScale = Math.max(bgScale, 0.1); draw(); return; }
      if (currentSimStep === 4 && fgImg) {
        const currentAngle = Math.atan2(dy, dx);
        const angleDiff = (currentAngle - initialPinchAngle) * (180 / Math.PI);
        const currentCenter = { x: (e.touches[0].clientX + e.touches[1].clientX)/2, y: (e.touches[0].clientY + e.touches[1].clientY)/2 };
        fgPos.width = initialFgWidth * scale; fgPos.height = initialFgHeight * scale; fgPos.angle = initialFgAngle + angleDiff;
        const newCenterX = initialFgCenter.x + (currentCenter.x - initialPinchCenter.x);
        const newCenterY = initialFgCenter.y + (currentCenter.y - initialPinchCenter.y);
        fgPos.x = newCenterX - fgPos.width/2; fgPos.y = newCenterY - fgPos.height/2;
        draw();
      }
      return;
    }
    const pos = getPos(e);
    if (isEraserMode) { eraserCursor.style.display = 'block'; eraserCursor.style.left = e.clientX + 'px'; eraserCursor.style.top = e.clientY + 'px'; eraserCursor.style.width = eraserCursor.style.height = (brushSize*2) + 'px'; }
    else { eraserCursor.style.display = 'none'; }
    if(isErasing) eraseAt(pos);
    else if(isDragging) {
      if (currentSimStep === 2) { bgOffsetX = pos.x - dragOffset.x; bgOffsetY = pos.y - dragOffset.y; }
      else { fgPos.x = pos.x - dragOffset.x; fgPos.y = pos.y - dragOffset.y; }
      draw();
    }
  }

  function handleEnd() { isDragging = false; isErasing = false; initialPinchDistance = null; }

  function eraseAt(pos) {
    if(!fgImg) return;
    const centerX = fgPos.x + fgPos.width/2; const centerY = fgPos.y + fgPos.height/2;
    let dx = pos.x - centerX; let dy = pos.y - centerY;
    const angleRad = -fgPos.angle * Math.PI / 180;
    let rx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    let ry = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
    if (isFlipped) rx = -rx;
    rx += fgPos.width/2; ry += fgPos.height/2;
    const localX = rx * (fgCanvas.width / fgPos.width); const localY = ry * (fgCanvas.height / fgPos.height);
    const localBrush = brushSize * (fgCanvas.width / fgPos.width);
    fgCtx.save(); fgCtx.globalCompositeOperation = 'destination-out'; fgCtx.beginPath(); fgCtx.arc(localX, localY, localBrush, 0, Math.PI * 2); fgCtx.fill(); fgCtx.restore();
    draw();
  }

  canvas.addEventListener('mousedown', handleStart); canvas.addEventListener('mousemove', handleMove); canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mouseleave', () => { handleEnd(); eraserCursor.style.display = 'none'; });
  canvas.addEventListener('touchstart', handleStart, {passive:false}); canvas.addEventListener('touchmove', handleMove, {passive:false}); canvas.addEventListener('touchend', handleEnd);

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05;
    if (currentSimStep === 2 && bgImg) { bgScale *= scaleFactor; bgScale = Math.max(bgScale, 0.05); draw(); }
    else if (currentSimStep === 4 && fgImg) {
      const oldW = fgPos.width; const oldH = fgPos.height;
      fgPos.width *= scaleFactor; fgPos.height *= scaleFactor;
      fgPos.x -= (fgPos.width - oldW) / 2; fgPos.y -= (fgPos.height - oldH) / 2;
      draw();
    }
  }, {passive:false});

  if (btnRotateBg) btnRotateBg.addEventListener('click', () => { bgAngle = (bgAngle + 90) % 360; bgScale = 1; bgOffsetX = 0; bgOffsetY = 0; bgInitialized = false; draw(); });
  if(btnUndo) btnUndo.addEventListener('click', () => { if(undoStack.length > 0) { const previousState = undoStack.pop(); fgCtx.putImageData(previousState, 0, 0); draw(); if(undoStack.length === 0) btnUndo.disabled = true; } });
  if (btnBlend) btnBlend.addEventListener('click', () => { isMultiply = !isMultiply; btnBlend.classList.toggle('active'); draw(); });
  if (btnFlipFg) btnFlipFg.addEventListener('click', () => { isFlipped = !isFlipped; draw(); });
  if (btnEraser) btnEraser.addEventListener('click', () => { isEraserMode = !isEraserMode; btnEraser.classList.toggle('active'); if(isEraserMode) canvas.classList.add('eraser-mode'); else { canvas.classList.remove('eraser-mode'); if (eraserCursor) eraserCursor.style.display = 'none'; } });

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      bgImg = null; fgImg = null; bgAngle = 0; fgPos.angle = 0; bgInitialized = false;
      const upBg = document.getElementById('upload-bg'); const upFg = document.getElementById('upload-fg');
      if(upBg) upBg.value = ''; if(upFg) upFg.value = '';
      isMultiply = false; isFlipped = false; isEraserMode = false; undoStack = [];
      if(btnUndo) btnUndo.disabled = true;
      if(btnBlend) btnBlend.classList.remove('active'); if(btnEraser) btnEraser.classList.remove('active');
      canvas.classList.remove('eraser-mode'); if(eraserCursor) eraserCursor.style.display = 'none';
      currentSimStep = 1; updateSimUI(); draw();
    });
  }

  if (btnDownload) btnDownload.addEventListener('click', () => { const link = document.createElement('a'); link.download = 'eterno-tatuaje-simulador.png'; link.href = canvas.toDataURL('image/png'); link.click(); });

  if(btnWhatsappAr) {
    btnWhatsappAr.addEventListener('click', async () => {
      const simNotesInput = document.getElementById('sim-notes');
      const clientNotes = simNotesInput ? simNotesInput.value.trim() : '';
      const notesText = clientNotes ? `\n\nNotas del cliente: "${clientNotes}"` : '';
      if (navigator.share) {
        try {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], 'simulacion-eterno.png', { type: 'image/png' });
          await navigator.share({ title: 'Simulación Eterno Tattoo', text: `Hola Eterno, probé tu simulador y me encantó cómo se me vería este diseño. Te envío la foto para cotizar.${notesText}`, files: [file] });
          return;
        } catch (error) {}
      }
      const link = document.createElement('a'); link.download = 'eterno-tatuaje-simulador.png'; link.href = canvas.toDataURL('image/png'); link.click();
      setTimeout(() => { const phone = "526675819798"; const msg = `Hola Eterno, probé tu simulador. Te envío la foto que guardé para pedir cotización.${notesText}`; const encodedMsg = encodeURIComponent(msg); window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank'); }, 500);
    });
  }

  // Initial UI Update
  updateSimUI();
};
