document.addEventListener('DOMContentLoaded', () => {
  console.log("Eterno App: DOMContentLoaded triggered");

  // --- COTIZADOR & WHATSAPP ---
  const zones = document.querySelectorAll('.zone');
  const zoneDisplay = document.querySelector('#selected-zone-display .highlight');
  const sizeSlider = document.getElementById('size-slider');
  const sizeDisplay = document.querySelector('#selected-size-display .highlight');
  const btnWhatsapp = document.getElementById('btn-whatsapp');
  
  let selectedZone = "Indefinida";
  let selectedSize = "5 cm";

  // Zone click logic
  zones.forEach(zone => {
    zone.addEventListener('click', () => {
      zones.forEach(z => z.classList.remove('active'));
      zone.classList.add('active');
      selectedZone = zone.getAttribute('data-zone');
      zoneDisplay.textContent = selectedZone;
      updateWhatsAppLink();
    });
  });

  // Body map flip logic
  const flipBtn = document.getElementById('body-flip-btn');
  const flipContainer = document.getElementById('body-flip');
  const flipLabel = document.getElementById('flip-label');
  
  if (flipBtn && flipContainer) {
    flipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      flipContainer.classList.toggle('flipped');
      if (flipContainer.classList.contains('flipped')) {
        flipLabel.textContent = 'Ver frente';
      } else {
        flipLabel.textContent = 'Ver espalda';
      }
    });
  }

  // Size slider logic — cm by cm with references
  const sizeReferences = {
    5:  '≈ Tamaño de una moneda',
    10: '≈ Tamaño de una tarjeta de crédito',
    15: '≈ Tamaño de la palma de la mano',
    20: '≈ Tamaño de un cuaderno',
    25: '≈ Tamaño de una regla escolar',
    30: '≈ Tamaño de una hoja carta',
    35: '≈ Tamaño de un brazo completo',
    40: '≈ Tamaño de media espalda'
  };

  function getReference(val) {
    const num = parseInt(val);
    // Find the nearest 5cm reference below or at this value
    const keys = Object.keys(sizeReferences).map(Number).sort((a,b) => a - b);
    let ref = '';
    for (const k of keys) {
      if (num >= k) ref = sizeReferences[k];
      else break;
    }
    return ref || '';
  }

  if (sizeSlider) {
    sizeSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      const ref = getReference(val);
      selectedSize = `${val} cm`;

      // Update the visual reference display
      const cmDisplay = document.getElementById('size-cm-display');
      const refDisplay = document.getElementById('size-ref-display');
      if (cmDisplay) cmDisplay.textContent = `${val} cm`;
      if (refDisplay) refDisplay.textContent = ref;

      sizeDisplay.textContent = `${val} cm${ref ? ' — ' + ref.replace('≈ ', '') : ''}`;
      updateWhatsAppLink();
    });
  }

  // Custom Idea logic
  const checkIdea = document.getElementById('no-reference-check');
  const textIdea = document.getElementById('idea-description');

  if (checkIdea && textIdea) {
    checkIdea.addEventListener('change', (e) => {
      if (e.target.checked) {
        textIdea.classList.add('active');
        textIdea.disabled = false;
        textIdea.focus();
      } else {
        textIdea.classList.remove('active');
        textIdea.disabled = true;
        textIdea.value = '';
      }
      updateWhatsAppLink();
    });

    textIdea.addEventListener('input', updateWhatsAppLink);
  }

  // WhatsApp link generator
  function updateWhatsAppLink() {
    if (!btnWhatsapp) return;
    const phone = "526675819798";
    
    let referenceText = "[Adjuntaré la foto por este chat]";
    if (checkIdea && checkIdea.checked) {
      if (textIdea.value.trim() !== "") {
        referenceText = `Mi idea es: ${textIdea.value.trim()}`;
      } else {
        referenceText = "[Aún no he escrito mi idea]";
      }
    }

    const msg = `Hola Eterno, me interesa un tatuaje en [${selectedZone}] de [${selectedSize}]. Aquí tienes mi referencia: ${referenceText}. ¿Cuál es el costo estimado?`;
    const encodedMsg = encodeURIComponent(msg);
    btnWhatsapp.href = `https://wa.me/${phone}?text=${encodedMsg}`;
  }
  updateWhatsAppLink();

  // --- GIFT CARD MODAL LOGIC (MOVED TO TOP FOR ROBUSTNESS) ---
  const giftCardTrigger = document.getElementById('giftcard-trigger');
  const giftCardModal = document.getElementById('giftcard-modal');
  const closeGiftCard = document.getElementById('close-giftcard');
  const step1 = document.getElementById('giftcard-step-1');
  const step2 = document.getElementById('giftcard-step-2');
  
  const inPara = document.getElementById('gc-input-para');
  const inDe = document.getElementById('gc-input-de');
  const inMonto = document.getElementById('gc-input-monto');
  const inPhone = document.getElementById('gc-input-phone');
  const inHideAmount = document.getElementById('gc-hide-amount'); 

  const valPara = document.getElementById('gcp-preview-para');
  const valDe = document.getElementById('gcp-preview-de');
  const valMonto = document.getElementById('gcp-preview-monto');
  const valCodigo = document.getElementById('gcp-preview-codigo');
  
  const btnSiguiente = document.getElementById('btn-gc-siguiente');
  const btnBack = document.getElementById('btn-gc-back');
  
  const btnGcWhatsStudio = document.getElementById('btn-gc-whatsapp-studio');
  const btnGcWhatsFriend = document.getElementById('btn-gc-whatsapp-friend');
  const btnGcDownload = document.getElementById('btn-gc-download');
  const generatedGcContainer = document.getElementById('generated-gc-image');

  // --- QUOTE METHOD SELECTOR ---
  const btnSelectSimulator = document.getElementById('btn-select-simulator');
  const viewSimulator = document.getElementById('simulator-overlay');

  // Move overlay to body to escape container constraints
  if (viewSimulator) document.body.appendChild(viewSimulator);

  function openSimulator() {
    viewSimulator.style.display = 'flex';
    document.body.classList.add('sim-active');
    document.body.style.overflow = 'hidden';
    if (typeof resizeCanvas === 'function') setTimeout(resizeCanvas, 80);
  }

  function closeSimulator() {
    viewSimulator.style.display = 'none';
    document.body.classList.remove('sim-active');
    document.body.style.overflow = '';
  }

  if (btnSelectSimulator && viewSimulator) {
    btnSelectSimulator.addEventListener('click', () => {
      openSimulator();
    });

    const btnCloseSim = document.getElementById('btn-close-sim');
    if (btnCloseSim) btnCloseSim.addEventListener('click', closeSimulator);
  }

  // --- AR SIMULATOR GLOBAL REFERENCES (for selector) ---
  const canvas = document.getElementById('ar-canvas');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  let draw = () => {}; // Placeholder for later definition

  let generatedBlob = null;
  let textMessage = "";

  if (giftCardTrigger && giftCardModal) {
    console.log("Gift Card System initialized");
    giftCardTrigger.addEventListener('click', () => {
      console.log("Gift Card Trigger clicked");
      giftCardModal.classList.add('active');
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'none';
      if(inPara && !inPara.value) if (valPara) valPara.textContent = '';
      if(inDe && !inDe.value) if (valDe) valDe.textContent = '';
      if(inMonto && !inMonto.value) if (valMonto) valMonto.textContent = '';
      
      if(valCodigo && (!valCodigo.textContent || valCodigo.textContent === "")) {
        valCodigo.textContent = Math.floor(100000 + Math.random() * 900000).toString();
      }
    });
    
    if (closeGiftCard) {
      closeGiftCard.addEventListener('click', () => {
        giftCardModal.classList.remove('active');
      });
    }

    // Realtime update
    if (inPara && valPara) {
      inPara.addEventListener('input', e => valPara.textContent = e.target.value.toUpperCase() || '');
    }
    if (inDe && valDe) {
      inDe.addEventListener('input', e => valDe.textContent = e.target.value.toUpperCase() || '');
    }

    const updateMontoPreview = () => {
      if (!valMonto) return;
      if (inHideAmount && inHideAmount.checked) {
        valMonto.innerHTML = 'DISEÑO<br>SELECCIONADO';
        valMonto.style.fontSize = '2.2cqi'; 
        valMonto.style.lineHeight = '1';
        valMonto.style.top = '61.0%'; 
        valMonto.style.left = '26.2%';
      } else {
        valMonto.textContent = inMonto && inMonto.value ? `$${inMonto.value}` : '';
        valMonto.style.fontSize = '2.8cqi'; 
        valMonto.style.top = '63.5%';
        valMonto.style.left = '26.7%';
      }
    };

    if (inMonto) inMonto.addEventListener('input', updateMontoPreview);
    if (inHideAmount) inHideAmount.addEventListener('change', updateMontoPreview);

    if (btnSiguiente) {
      btnSiguiente.addEventListener('click', () => {
        const rawPara = inPara ? inPara.value.trim() : '';
        const rawDe = inDe ? inDe.value.trim() : '';
        const rawMonto = inMonto ? inMonto.value.trim() : '';
        const rawPhone = inPhone ? inPhone.value.trim() : '';

        if (!rawPara || !rawDe || !rawMonto || !rawPhone) {
          alert('Por favor completa todos los campos para continuar (incluyendo monto y celular).');
          return;
        }
        if (rawPhone.length < 10) {
          alert('Por favor ingresa un celular válido (mínimo 10 dígitos).');
          return;
        }

        const paraVal = rawPara;
        const deVal = rawDe;
        const montoVal = (inHideAmount && inHideAmount.checked) ? 'un diseño seleccionado' : `$${rawMonto} MXN`;
        const phoneVal = rawPhone;
        
        const pageUrl = window.location.href.split('#')[0]; 
        textMessage = `¡Felicidades ${paraVal}! 🥳\n${deVal} te ha enviado una Tarjeta de Regalo de Eterno Tattoo Studio por ${montoVal}.\n\nVálido para diseño personalizado y sesión de tatuaje. Para canjearla visítanos en:\n📍 Calle Carlos Lineo 2401, Culiacán, Sinaloa.\n\nMás detalle de nuestro trabajo aquí: ${pageUrl}`;
        
        // Generar código único y aplicarlo directamente al elemento visual (ya que el resto se aplica en tiempo real)
        const codeVal = Math.floor(100000 + Math.random() * 900000).toString();
        if (valCodigo) valCodigo.textContent = codeVal;
        
        // Save these globally so they can be accessed by the Whatsapp buttons later
        window.gcGeneratedData = { codeVal, rawMonto, deVal, paraVal, phoneVal, visibleMontoText: montoVal };
        
        btnSiguiente.textContent = 'Generando...';
        btnSiguiente.disabled = true;

        // --- NATIVE CANVAS FLOW (High Fidelity & File Protocol Safe) ---
        const performCapture = async () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 1050;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');

            // 1. Get/Wait for Background Image
            const bgImage = document.getElementById('gc-bg-image');
            if (!bgImage) throw new Error("No se encontró el fondo de la tarjeta.");

            // Wait for fonts to be ready so 'Inter' renders correctly
            if (document.fonts) await document.fonts.ready;

            // 2. Clear and Draw Background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bgImage, 0, 0, 1050, 600);

            // 3. Configure Text Styling
            ctx.fillStyle = "#000000";
            ctx.textBaseline = "top"; // Align to top edge like CSS 'top' property

            // 4. Draw Names (PARA and DE)
            ctx.font = "bold 34px 'Inter', sans-serif";
            ctx.fillText(paraVal.toUpperCase(), 240, 261); // 43.5% of 600
            ctx.fillText(deVal.toUpperCase(), 180, 321); // 53.5% of 600

            // 5. Draw Amount / "Diseño Seleccionado"
            if (inHideAmount && inHideAmount.checked) {
              ctx.font = "normal 28px 'Inter', sans-serif";
              ctx.fillText("DISEÑO", 275, 366); 
              ctx.fillText("SELECCIONADO", 275, 396); 
            } else {
              ctx.font = "normal 34px 'Inter', sans-serif";
              ctx.fillText(`$${rawMonto}`, 280, 381); 
            }

            // 6. Draw Code
            ctx.font = "bold 32px 'Inter', sans-serif";
            ctx.fillText(codeVal, 850, 381);

            // 7. Output Result
            const imgData = canvas.toDataURL('image/png');
            if (generatedGcContainer) {
              generatedGcContainer.innerHTML = `<img src="${imgData}" style="width:100%; max-width:600px; border-radius:8px; display: block; margin: 0 auto;">`;
            }

            canvas.toBlob(blob => {
              generatedBlob = blob;
            }, 'image/png');

            btnSiguiente.textContent = 'GENERAR TARJETA Y CONTINUAR';
            btnSiguiente.disabled = false;

            if (step1) step1.style.display = 'none';
            if (step2) step2.style.display = 'block';

          } catch (err) {
            console.error("Error en Native Canvas Capture:", err);
            alert("Hubo un error al generar la imagen nativa: " + err.message);
            btnSiguiente.textContent = 'GENERAR TARJETA Y CONTINUAR';
            btnSiguiente.disabled = false;
          }
        };

        // Execute capture
        performCapture();
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
      });
    }

    if (btnGcWhatsStudio) {
      btnGcWhatsStudio.addEventListener('click', (e) => {
        e.preventDefault();
        if (!generatedBlob || !window.gcGeneratedData) return alert("Primero debes generar la tarjeta.");
        
        const data = window.gcGeneratedData;
        const studioPhone = "526675819798";
        const msgStudio = `Hola Eterno Tattoo, acabo de pagar una tarjeta de regalo en tu página.\n\nCódigo: *${data.codeVal}*\nMonto: ${data.visibleMontoText}\nDe: ${data.deVal}\nPara: ${data.paraVal}\nMi Celular: ${data.phoneVal}\n\nAquí adjunto mi comprobante y la tarjeta generada para validación.`;
        
        const waUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(msgStudio)}`;
        window.open(waUrl, '_blank');
      });
    }

    if (btnGcWhatsFriend) {
      btnGcWhatsFriend.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!generatedBlob || !window.gcGeneratedData) return alert("Primero debes generar la tarjeta.");

        const data = window.gcGeneratedData;
        const msgFriend = `¡Hola ${data.paraVal}! Te he comprado una Tarjeta de Regalo de Eterno Tattoo Studio por ${data.visibleMontoText}.\n\nTu código oficial es: *${data.codeVal}*\n\nTe envío la imagen adjunta. Mándale mensaje a Eterno para agendar tu cita.\nDe: ${data.deVal}`;

        const file = new File([generatedBlob], 'tarjeta_regalo_eterno.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Tarjeta de Regalo Eterno',
              text: msgFriend
            });
            return;
          } catch (err) {
            console.warn("Share failed, using fallback:", err);
          }
        }

        const downloadUrl = URL.createObjectURL(generatedBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'tarjeta_regalo_eterno.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        alert("Tu navegador no permite adjuntar la imagen:\n\nHEMOS DESCARGADO LA TARJETA. Ahora se abrirá WhatsApp, ADJUNTA la imagen descargada en tu galería.");
        const waUrl = `https://wa.me/?text=${encodeURIComponent(msgFriend)}`;
        window.open(waUrl, '_blank');
      });
    }

    // --- DOWNLOAD BUTTON ---
    if (btnGcDownload) {
      btnGcDownload.addEventListener('click', () => {
        if (!generatedBlob) return alert('Primero genera la tarjeta.');
        const dlUrl = URL.createObjectURL(generatedBlob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = 'tarjeta_regalo_eterno.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(dlUrl);
      });
    }
  }

  // --- LOGO SMOOTH SCROLL ---
  const navLogoLink = document.querySelector('.navbar__logo a');
  if (navLogoLink) {
    navLogoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- AR SIMULATOR (ADVANCED) ---
  if(canvas && canvasWrapper) {
    console.log("AR Simulator initialized");
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  let bgImg = null;
  let fgImg = null;
  let fgCanvas = document.createElement('canvas'); // Dedicated layer for the tattoo
  let fgCtx = fgCanvas.getContext('2d', { willReadFrequently: true });
  let stencilData = null; // Caches the stencil version
  
  let bgScale = 1; 
  let bgX = 0; let bgY = 0; let bgAngle = 0;
  let bgOffsetX = 0; let bgOffsetY = 0; // Manual offsets for panning
  let bgBaseScale = 1; // Used to calculate pinch zoom relative to initial fit
  let bgInitialized = false; // True once the image has been auto-fitted for the first time
  
  let fgPos = { x: 50, y: 50, width: 150, height: 150, angle: 0 };
  
  // State
  let isDragging = false;
  let isErasing = false;
  let dragOffset = { x: 0, y: 0 };
  let undoStack = []; // Stores ImageData of fgCanvas for undo
  
  // Touch Pinch Zoom State
  let initialPinchDistance = null;
  let initialPinchAngle = 0;
  let initialPinchCenter = { x: 0, y: 0 };
  let initialFgWidth = null;
  let initialFgHeight = null;
  let initialFgAngle = 0;
  let initialFgCenter = { x: 0, y: 0 };
  let initialBgScale = 1;
  
  // Tools state
  // Tools state
  let isMultiply = false;
  let isFlipped = false;
  let isEraserMode = false;
  let brushSize = 25;
  
  // UI Elements
  // UI Elements
  const btnBlend = document.getElementById('btn-blend');
  const btnFlipFg = document.getElementById('btn-flip-fg');
  const btnEraser = document.getElementById('btn-eraser');
  const btnUndo = document.getElementById('btn-undo');
  const btnClear = document.getElementById('btn-clear-canvas');
  const btnDownload = document.getElementById('btn-download');
  const btnWhatsappAr = document.getElementById('btn-whatsapp-ar');
  const eraserCursor = document.getElementById('eraser-cursor');
  const btnRotateBg = document.getElementById('btn-rotate-bg');
  const btnToggleFit = document.getElementById('btn-toggle-fit');

  let bgFitMode = 'contain'; 

  // --- LINEAR SIMULATOR STEPS LOGIC ---
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

      if (indicatorNum === 1) { // Piel
        isActive = (currentSimStep === 1 || currentSimStep === 2);
        isCompleted = (currentSimStep > 2);
      } else if (indicatorNum === 2) { // Tatuaje
        isActive = (currentSimStep === 3 || currentSimStep === 4);
        isCompleted = (currentSimStep > 4);
      } else if (indicatorNum === 3) { // Final
        isActive = (currentSimStep === 5);
      }

      ind.classList.toggle('active', isActive);
      ind.classList.toggle('completed', isCompleted);
    });

    if (currentSimStep >= 1) {
      resizeCanvas();
    }
  }

  // Event Listeners for Step Progression
  const fileUploadBg = document.getElementById('upload-bg');
  const fileUploadFg = document.getElementById('upload-fg');
  const btnStep3 = document.getElementById('btn-to-step-3');
  const btnStep4 = document.getElementById('btn-to-step-4');
  const btnStep5 = document.getElementById('btn-to-step-5');
  const btnBacks = document.querySelectorAll('.btn-go-back');

  if (fileUploadBg) {
    fileUploadBg.addEventListener('change', () => {
      // Step 2 is triggered after upload in the actual upload handler below
    });
  }

  if (btnStep3) {
    btnStep3.addEventListener('click', () => {
      currentSimStep = 3;
      updateSimUI();
    });
  }

  if (btnStep4) {
    btnStep4.addEventListener('click', () => {
      currentSimStep = 4;
      updateSimUI();
    });
  }

  if (btnStep5) {
    btnStep5.addEventListener('click', () => {
      currentSimStep = 5;
      updateSimUI();
    });
  }

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
  } );

  updateSimUI(); // Initial step setup

  function resizeCanvas() {
    if (canvas && canvasWrapper) {
      canvas.width = canvasWrapper.clientWidth;
      canvas.height = canvasWrapper.clientHeight;
      if (typeof draw === 'function') draw();
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial call

  // Draw Functions
  function initTattooLayer() {
    if(!fgImg) return;
    // Cap internal resolution to prevent lag on big files
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

  draw = function() {
    if (!ctx) return;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    // Global container for clipping and positioning calculations
    let bgRect = { x: 0, y: 0, w: 0, h: 0 };

    // 1. Draw Background
    if(bgImg) {
      if (!bgInitialized) {
        // Auto-fit the image on first draw after load or reset
        if (bgAngle % 180 !== 0) {
          bgBaseScale = Math.min(canvas.width / bgImg.height, canvas.height / bgImg.width);
        } else {
          bgBaseScale = Math.min(canvas.width / bgImg.width, canvas.height / bgImg.height);
        }
        bgScale = bgBaseScale;
        bgOffsetX = 0;
        bgOffsetY = 0;
        bgInitialized = true;
      }

      const drawW = bgImg.width * bgScale;
      const drawH = bgImg.height * bgScale;
      
      // bgX/bgY are the final drawing coords on canvas
      bgX = (canvas.width / 2) - (drawW / 2) + bgOffsetX;
      bgY = (canvas.height / 2) - (drawH / 2) + bgOffsetY;
      
      bgRect = { x: bgX, y: bgY, w: drawW, h: drawH };

      ctx.save();
      ctx.translate(bgX + drawW/2, bgY + drawH/2);
      ctx.rotate(bgAngle * Math.PI / 180);
      ctx.drawImage(bgImg, -drawW/2, -drawH/2, drawW, drawH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#111';
      ctx.fillRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = '#444';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('1. Sube tu foto (Piel)', canvas.width/2, canvas.height/2 - 20);
      ctx.fillText('2. Sube el diseño (Tatuaje)', canvas.width/2, canvas.height/2 + 20);
    }
    
    // 2. Draw Foreground (Tattoo)
    if(fgImg) {
      ctx.save();

      // Implement Clipping to Skin Area
      if (bgImg) {
        ctx.beginPath();
        // Since we allow rotation of the background, we need to handle the clipping region carefully
        // For simplicity, if we rotate 90/270, width/height swap for the clipping rect
        if (bgAngle % 180 !== 0) {
           ctx.rect(bgX + (bgRect.w - bgRect.h)/2, bgY + (bgRect.h - bgRect.w)/2, bgRect.h, bgRect.w);
        } else {
           ctx.rect(bgX, bgY, bgRect.w, bgRect.h);
        }
        ctx.clip();
      }
      
      if(isMultiply) {
        ctx.globalCompositeOperation = 'multiply';
      }
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

  // --- File Uploads ---
  document.getElementById('upload-bg').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const img = new Image();
      img.onload = () => { 
        bgImg = img; 
        currentSimStep = 2;
        // Reset transforms for new image
        bgScale = 1; bgOffsetX = 0; bgOffsetY = 0; bgInitialized = false;
        updateSimUI();
        draw(); 
      };
      img.src = URL.createObjectURL(file);
    }
  });

  document.getElementById('upload-fg').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
      const img = new Image();
      img.onload = () => { 
        fgImg = img; 
        fgPos.width = 180; 
        fgPos.height = 180 * (img.height / img.width);
        fgPos.x = (canvas.width / 2) - (fgPos.width / 2);
        fgPos.y = (canvas.height / 2) - (fgPos.height / 2);
        initTattooLayer();
        currentSimStep = 4;
        updateSimUI();
        draw(); 
      };
      img.src = URL.createObjectURL(file);
    }
  });

  // --- Interaction Logic ---
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if(e.touches) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleStart(e) {
    // Prevent default on dual touch to avoid accidental browser zooming
    if (e.touches && e.touches.length === 2) {
      if (e.cancelable) e.preventDefault();
      isDragging = false;
      isErasing = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.hypot(dx, dy);
      initialPinchAngle = Math.atan2(dy, dx);
      
      if (currentSimStep === 2 && bgImg) {
        // Pinch Zoom for Background
        initialBgScale = bgScale;
        return;
      }

      initialFgWidth = fgPos.width;
      initialFgHeight = fgPos.height;
      initialFgAngle = fgPos.angle;
      initialPinchCenter = { x: (e.touches[0].clientX + e.touches[1].clientX)/2, y: (e.touches[0].clientY + e.touches[1].clientY)/2 };
      initialFgCenter = { x: fgPos.x + fgPos.width/2, y: fgPos.y + fgPos.height/2 };
      return;
    }

    const pos = getPos(e);
    if(isEraserMode && fgImg && currentSimStep === 4) {
      saveUndoState();
      isErasing = true;
      eraseAt(pos);
    } else if(currentSimStep === 2 && bgImg) {
      // Pan for Background
      isDragging = true;
      dragOffset.x = pos.x - bgOffsetX;
      dragOffset.y = pos.y - bgOffsetY;
    } else if(currentSimStep === 4 && fgImg && pos.x > fgPos.x && pos.x < fgPos.x + fgPos.width && pos.y > fgPos.y && pos.y < fgPos.y + fgPos.height) {
      isDragging = true;
      dragOffset.x = pos.x - fgPos.x;
      dragOffset.y = pos.y - fgPos.y;
    }
  }

  function handleMove(e) {
    if (e.touches && e.touches.length === 2 && initialPinchDistance) {
      if (e.cancelable) e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / initialPinchDistance;
      
      if (currentSimStep === 2 && bgImg) {
        bgScale = initialBgScale * scale;
        // Limit zoom out? Maybe not strictly requested, but good practice
        bgScale = Math.max(bgScale, 0.1); 
        draw();
        return;
      }

      if (currentSimStep === 4 && fgImg) {
        const currentAngle = Math.atan2(dy, dx);
        const angleDiff = (currentAngle - initialPinchAngle) * (180 / Math.PI);
        const currentCenter = { x: (e.touches[0].clientX + e.touches[1].clientX)/2, y: (e.touches[0].clientY + e.touches[1].clientY)/2 };
        
        fgPos.width = initialFgWidth * scale;
        fgPos.height = initialFgHeight * scale;
        fgPos.angle = initialFgAngle + angleDiff;
        
        const newCenterX = initialFgCenter.x + (currentCenter.x - initialPinchCenter.x);
        const newCenterY = initialFgCenter.y + (currentCenter.y - initialPinchCenter.y);
        fgPos.x = newCenterX - fgPos.width/2;
        fgPos.y = newCenterY - fgPos.height/2;
        
        draw();
      }
      return;
    }

    const pos = getPos(e);
    
    // Eraser cursor visuals
    if (isEraserMode) {
      eraserCursor.style.display = 'block';
      eraserCursor.style.left = e.clientX + 'px'; // Document coords slightly off if scrolled, but okay for fixed wrapper
      eraserCursor.style.top = e.clientY + 'px';
      eraserCursor.style.width = eraserCursor.style.height = (brushSize*2) + 'px';
    } else {
      eraserCursor.style.display = 'none';
    }

    if(isErasing) {
      eraseAt(pos);
    } else if(isDragging) {
      if (currentSimStep === 2) {
        bgOffsetX = pos.x - dragOffset.x;
        bgOffsetY = pos.y - dragOffset.y;
      } else {
        fgPos.x = pos.x - dragOffset.x;
        fgPos.y = pos.y - dragOffset.y;
      }
      draw();
    }
  }

  function handleEnd() {
    isDragging = false;
    isErasing = false;
    initialPinchDistance = null;
  }

  function eraseAt(pos) {
    if(!fgImg) return;
    const centerX = fgPos.x + fgPos.width/2;
    const centerY = fgPos.y + fgPos.height/2;
    
    let dx = pos.x - centerX;
    let dy = pos.y - centerY;
    
    // Rotate back to alignment
    const angleRad = -fgPos.angle * Math.PI / 180;
    let rx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    let ry = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
    
    if (isFlipped) rx = -rx;
    
    // Origin at top-left
    rx += fgPos.width/2;
    ry += fgPos.height/2;
    
    // Scale coords to fgCanvas internal resolution
    const localX = rx * (fgCanvas.width / fgPos.width);
    const localY = ry * (fgCanvas.height / fgPos.height);
    const localBrush = brushSize * (fgCanvas.width / fgPos.width);
    
    fgCtx.save();
    fgCtx.globalCompositeOperation = 'destination-out';
    fgCtx.beginPath();
    fgCtx.arc(localX, localY, localBrush, 0, Math.PI * 2);
    fgCtx.fill();
    fgCtx.restore();
    draw();
  }

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mouseleave', () => { handleEnd(); eraserCursor.style.display = 'none'; });

  canvas.addEventListener('touchstart', handleStart, {passive:false});
  canvas.addEventListener('touchmove', handleMove, {passive:false});
  canvas.addEventListener('touchend', handleEnd);

  // Scaling via Mouse Wheel
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05;

    if (currentSimStep === 2 && bgImg) {
      // Zoom the skin photo
      bgScale *= scaleFactor;
      bgScale = Math.max(bgScale, 0.05);
      draw();
    } else if (currentSimStep === 4 && fgImg) {
      // Zoom the tattoo (even if eraser is active)
      const oldW = fgPos.width;
      const oldH = fgPos.height;
      fgPos.width *= scaleFactor;
      fgPos.height *= scaleFactor;
      // Keep centered on scale
      fgPos.x -= (fgPos.width - oldW) / 2;
      fgPos.y -= (fgPos.height - oldH) / 2;
      draw();
    }
  }, {passive:false});

  // --- Buttons Logic ---
  if (btnRotateBg) {
    btnRotateBg.addEventListener('click', () => {
      bgAngle = (bgAngle + 90) % 360;
      // Reset scale to re-fit after rotation
      bgScale = 1; bgOffsetX = 0; bgOffsetY = 0; bgInitialized = false;
      draw();
    });
  }

  if(btnUndo) {
    btnUndo.addEventListener('click', () => {
      if(undoStack.length > 0) {
        const previousState = undoStack.pop();
        fgCtx.putImageData(previousState, 0, 0);
        draw();
        if(undoStack.length === 0) btnUndo.disabled = true;
      }
    });
  }

  if (btnBlend) {
    btnBlend.addEventListener('click', () => {
      isMultiply = !isMultiply;
      btnBlend.classList.toggle('active');
      draw();
    });
  }

  if (btnFlipFg) {
    btnFlipFg.addEventListener('click', () => {
      isFlipped = !isFlipped;
      draw();
    });
  }

  if (btnEraser) {
    btnEraser.addEventListener('click', () => {
      isEraserMode = !isEraserMode;
      btnEraser.classList.toggle('active');
      if(isEraserMode) canvas.classList.add('eraser-mode');
      else {
        canvas.classList.remove('eraser-mode');
        if (eraserCursor) eraserCursor.style.display = 'none';
      }
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      bgImg = null; fgImg = null;
      bgAngle = 0; fgPos.angle = 0;
      bgInitialized = false;
      const upBg = document.getElementById('upload-bg');
      const upFg = document.getElementById('upload-fg');
      if(upBg) upBg.value = '';
      if(upFg) upFg.value = '';
      
      isMultiply = false; isFlipped = false; isEraserMode = false;
      undoStack = [];
      if(btnUndo) btnUndo.disabled = true;
      
      if(btnBlend) btnBlend.classList.remove('active');
      if(btnEraser) btnEraser.classList.remove('active');
      canvas.classList.remove('eraser-mode');
      if(eraserCursor) eraserCursor.style.display = 'none';

      currentSimStep = 1;
      updateSimUI();
      draw();
    });
  }

  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'eterno-tatuaje-simulador.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  if(btnWhatsappAr) {
    btnWhatsappAr.addEventListener('click', async () => {
      const simNotesInput = document.getElementById('sim-notes');
      const clientNotes = simNotesInput ? simNotesInput.value.trim() : '';
      const notesText = clientNotes ? `\n\nNotas del cliente: "${clientNotes}"` : '';

      // Intentar usar Navigator Share (Solo funciona en móvil con archivos si el nav lo soporta)
      if (navigator.share) {
        try {
          // Convertimos el canvas a un objeto File
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], 'simulacion-eterno.png', { type: 'image/png' });
          
          await navigator.share({
            title: 'Simulación Eterno Tattoo',
            text: `Hola Eterno, probé tu simulador y me encantó cómo se me vería este diseño. Te envío la foto para cotizar.${notesText}`,
            files: [file]
          });
          return; // Si funcionó, no hacemos lo demás
        } catch (error) {
          // Si el usuario cancela o hay un error, dejamos que siga el código normal (fallback)
        }
      }
      
      // FALLBACK (Si navegador está en PC o no soporta compartir archivo directo a WhatsApp)
      const link = document.createElement('a');
      link.download = 'eterno-tatuaje-simulador.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setTimeout(() => {
        const phone = "526675819798";
        const msg = `Hola Eterno, probé tu simulador. Te envío la foto que guardé para pedir cotización.${notesText}`;
        const encodedMsg = encodeURIComponent(msg);
        window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
      }, 500);
    });
  }
  } // End of AR Simulator block

  // --- PORTFOLIO GALLERY MODAL LOGIC ---
  const styleTriggers = document.querySelectorAll('.style-trigger');
  const galleryModal = document.getElementById('gallery-modal');
  const closeGallery = document.getElementById('close-gallery');
  const galleryTitle = document.getElementById('gallery-title');
  const gallerySubtitle = document.getElementById('gallery-subtitle');
  const galleryGrid = document.getElementById('gallery-grid');

  // Hardcoded portfolio images dictionary
  const portfolioData = {
    '@dansrivastattoo': {
      'Retratos': [
        'Retratos/1.1.webp',
        'Retratos/1.2.webp',
        'Retratos/1.3.webp',
        'Retratos/2.webp',
        'Retratos/3.webp',
        'Retratos/44444.webp',
        'Retratos/IMG_1518.webp',
        'Retratos/IMG_3058.webp',
        'Retratos/IMG_3405.webp',
        'Retratos/IMG_3546.webp',
        'Retratos/IMG_8620.webp',
        'Retratos/jimmy.webp'
      ],
      'Fullcolor': [
        'fullcolor/4.webp',
        'fullcolor/1.webp', 'fullcolor/3.webp', 'fullcolor/5.webp',
        'fullcolor/6.1.webp', 'fullcolor/6.2.webp', 'fullcolor/6.webp', 'fullcolor/7.webp',
        'fullcolor/IMG_0280.webp', 'fullcolor/IMG_0845.webp', 'fullcolor/IMG_1350.webp',
        'fullcolor/IMG_2672.webp', 'fullcolor/IMG_3717.webp', 'fullcolor/IMG_4202.webp',
        'fullcolor/2.webp',
        'fullcolor/IMG_4984.webp', 'fullcolor/IMG_5360.webp', 'fullcolor/IMG_5429.webp',
        'fullcolor/IMG_5541.webp', 'fullcolor/IMG_5543.webp', 'fullcolor/IMG_5546.webp',
        'fullcolor/IMG_5911.webp', 'fullcolor/IMG_6014.webp', 'fullcolor/IMG_8026.webp',
        'fullcolor/IMG_9270.webp', 'fullcolor/IMG_9478.webp', 'fullcolor/IMG_9838.webp',
        'fullcolor/anme.webp', 'fullcolor/bruj.webp', 'fullcolor/calc.webp', 'fullcolor/cang.webp',
        'fullcolor/chiv.webp', 'fullcolor/dedpol.webp', 'fullcolor/ff7.webp', 'fullcolor/flor.webp',
        'fullcolor/flores.webp', 'fullcolor/fnix.webp', 'fullcolor/jrdn.webp', 'fullcolor/koku.webp',
        'fullcolor/leons.webp', 'fullcolor/mago.webp', 'fullcolor/nar.webp', 'fullcolor/pulp.webp',
        'fullcolor/red.webp', 'fullcolor/rosees.webp', 'fullcolor/rosescarta.webp', 'fullcolor/saw.webp',
        'fullcolor/tot.webp',
        'fullcolor/4444.webp', 'fullcolor/coralillo.webp', 'fullcolor/IMG_0281.webp',
        'fullcolor/IMG_7757.webp', 'fullcolor/oli.webp', 'fullcolor/penultimo.webp',
        'fullcolor/perico.webp', 'fullcolor/snjudas.webp', 'fullcolor/toto3.webp', 'fullcolor/ultimo.webp'
      ],
      'Japonés': [
        'Japones/8.webp', 'Japones/IMG_3471.webp', 'Japones/IMG_3472.webp', 'Japones/IMG_8244.webp',
        'Japones/maori.webp'
      ],
      'Blackwork and blackout': [
        'Blackwork and blackout/1.webp', 'Blackwork and blackout/10.1.webp', 'Blackwork and blackout/10.webp',
        'Blackwork and blackout/11.webp', 'Blackwork and blackout/12.webp', 'Blackwork and blackout/13.webp',
        'Blackwork and blackout/14.1.webp', 'Blackwork and blackout/14.5.webp', 'Blackwork and blackout/14.webp',
        'Blackwork and blackout/15.webp', 'Blackwork and blackout/16.webp', 'Blackwork and blackout/17.webp',
        'Blackwork and blackout/18.webp', 'Blackwork and blackout/19.webp', 'Blackwork and blackout/2.1.webp',
        'Blackwork and blackout/2.webp', 'Blackwork and blackout/20.webp', 'Blackwork and blackout/21.webp',
        'Blackwork and blackout/22.webp', 'Blackwork and blackout/23.webp', 'Blackwork and blackout/24.webp',
        'Blackwork and blackout/25.webp', 'Blackwork and blackout/26.webp', 'Blackwork and blackout/27.webp',
        'Blackwork and blackout/28.webp', 'Blackwork and blackout/3.webp', 'Blackwork and blackout/39.webp',
        'Blackwork and blackout/4.webp', 'Blackwork and blackout/40.webp', 'Blackwork and blackout/41.webp',
        'Blackwork and blackout/42.webp', 'Blackwork and blackout/43.webp', 'Blackwork and blackout/44.webp',
        'Blackwork and blackout/45.webp', 'Blackwork and blackout/46.webp', 'Blackwork and blackout/5.6.webp',
        'Blackwork and blackout/5.webp', 'Blackwork and blackout/6.webp', 'Blackwork and blackout/7.55.webp',
        'Blackwork and blackout/7.8.webp', 'Blackwork and blackout/7.webp', 'Blackwork and blackout/8.3.webp',
        'Blackwork and blackout/9.webp', 'Blackwork and blackout/IMG_0127.webp', 'Blackwork and blackout/IMG_0166.webp',
        'Blackwork and blackout/IMG_0262.webp', 'Blackwork and blackout/IMG_0282(1).webp', 'Blackwork and blackout/IMG_0312.webp',
        'Blackwork and blackout/IMG_0398.webp', 'Blackwork and blackout/IMG_1292.webp', 'Blackwork and blackout/IMG_1363.webp',
        'Blackwork and blackout/IMG_1393.webp', 'Blackwork and blackout/IMG_1552.webp', 'Blackwork and blackout/IMG_1648.webp',
        'Blackwork and blackout/IMG_1695.webp', 'Blackwork and blackout/IMG_1838.webp', 'Blackwork and blackout/IMG_1867.webp',
        'Blackwork and blackout/IMG_1942.webp', 'Blackwork and blackout/IMG_2133.webp', 'Blackwork and blackout/IMG_2134.webp',
        'Blackwork and blackout/IMG_2257.webp', 'Blackwork and blackout/IMG_2308.webp', 'Blackwork and blackout/IMG_2481.webp',
        'Blackwork and blackout/IMG_2531.webp', 'Blackwork and blackout/IMG_2539.webp', 'Blackwork and blackout/IMG_2560.webp',
        'Blackwork and blackout/IMG_2562.webp', 'Blackwork and blackout/IMG_2732.webp', 'Blackwork and blackout/IMG_2734.webp',
        'Blackwork and blackout/IMG_2736.webp', 'Blackwork and blackout/IMG_2741.webp', 'Blackwork and blackout/IMG_2793.webp',
        'Blackwork and blackout/IMG_2977.webp', 'Blackwork and blackout/IMG_3358.webp', 'Blackwork and blackout/IMG_3663.webp',
        'Blackwork and blackout/IMG_4306.webp', 'Blackwork and blackout/IMG_4399.webp', 'Blackwork and blackout/IMG_4594.webp',
        'Blackwork and blackout/IMG_4914.webp', 'Blackwork and blackout/IMG_4926.webp', 'Blackwork and blackout/IMG_4936.webp',
        'Blackwork and blackout/IMG_4954.webp', 'Blackwork and blackout/IMG_5636.webp', 'Blackwork and blackout/IMG_5687.webp',
        'Blackwork and blackout/IMG_6023.webp', 'Blackwork and blackout/IMG_6422.webp', 'Blackwork and blackout/IMG_6439.webp',
        'Blackwork and blackout/IMG_6529.webp', 'Blackwork and blackout/IMG_6603.webp', 'Blackwork and blackout/IMG_6653.webp',
        'Blackwork and blackout/IMG_6699(1).webp', 'Blackwork and blackout/IMG_6769.webp', 'Blackwork and blackout/IMG_6770.webp',
        'Blackwork and blackout/IMG_6837.webp', 'Blackwork and blackout/IMG_6956.webp', 'Blackwork and blackout/IMG_7332.webp',
        'Blackwork and blackout/IMG_7477.webp', 'Blackwork and blackout/IMG_8803.webp', 'Blackwork and blackout/IMG_9137.webp',
        'Blackwork and blackout/IMG_9401.webp', 'Blackwork and blackout/IMG_9891.webp', 'Blackwork and blackout/angel caido.webp',
        'Blackwork and blackout/angel.webp', 'Blackwork and blackout/hanya.webp'
      ],
      'Anime, toons & games': [
        'Anime, toons y games/1_resultado.webp', 'Anime, toons y games/10_resultado.webp', 'Anime, toons y games/11_resultado.webp',
        'Anime, toons y games/12_resultado.webp', 'Anime, toons y games/13_resultado.webp', 'Anime, toons y games/14_resultado.webp',
        'Anime, toons y games/15_resultado.webp', 'Anime, toons y games/16_resultado.webp', 'Anime, toons y games/18_resultado.webp',
        'Anime, toons y games/19_resultado.webp', 'Anime, toons y games/2_resultado.webp', 'Anime, toons y games/20_resultado.webp',
        'Anime, toons y games/21_resultado.webp', 'Anime, toons y games/22_resultado.webp', 'Anime, toons y games/23_resultado.webp',
        'Anime, toons y games/24_resultado.webp', 'Anime, toons y games/26_resultado.webp', 'Anime, toons y games/27_resultado.webp',
        'Anime, toons y games/28_resultado.webp', 'Anime, toons y games/29_resultado.webp', 'Anime, toons y games/3_resultado.webp',
        'Anime, toons y games/30_resultado.webp', 'Anime, toons y games/31_resultado.webp', 'Anime, toons y games/32_resultado.webp',
        'Anime, toons y games/33.5_resultado.webp', 'Anime, toons y games/33_resultado.webp', 'Anime, toons y games/34_resultado.webp',
        'Anime, toons y games/35_resultado.webp', 'Anime, toons y games/4_resultado.webp', 'Anime, toons y games/5_resultado.webp',
        'Anime, toons y games/5D7D6B5B-8F98-46A0-8C49-65272E189614_resultado.webp', 'Anime, toons y games/6_resultado.webp',
        'Anime, toons y games/7_resultado.webp', 'Anime, toons y games/8_resultado.webp', 'Anime, toons y games/9_resultado.webp',
        'Anime, toons y games/IMG_1296_resultado.webp', 'Anime, toons y games/IMG_1333_resultado.webp', 'Anime, toons y games/IMG_2669_resultado.webp',
        'Anime, toons y games/IMG_2807_resultado.webp', 'Anime, toons y games/IMG_2809_resultado.webp', 'Anime, toons y games/IMG_2823(1)_resultado.webp',
        'Anime, toons y games/IMG_2913_resultado.webp', 'Anime, toons y games/IMG_2941_resultado.webp', 'Anime, toons y games/IMG_2948_resultado.webp',
        'Anime, toons y games/IMG_2954_resultado.webp', 'Anime, toons y games/IMG_2973_resultado.webp', 'Anime, toons y games/IMG_3278_resultado.webp',
        'Anime, toons y games/IMG_3868_resultado.webp', 'Anime, toons y games/IMG_3899_resultado.webp', 'Anime, toons y games/IMG_5196_resultado.webp',
        'Anime, toons y games/IMG_5449_resultado.webp', 'Anime, toons y games/IMG_5935_resultado.webp', 'Anime, toons y games/IMG_6174_resultado.webp',
        'Anime, toons y games/IMG_6290_resultado.webp', 'Anime, toons y games/IMG_6297_resultado.webp', 'Anime, toons y games/IMG_6306_resultado.webp',
        'Anime, toons y games/IMG_6656_resultado.webp', 'Anime, toons y games/IMG_7902_resultado.webp', 'Anime, toons y games/IMG_7907_resultado.webp',
        'Anime, toons y games/IMG_8135_resultado.webp', 'Anime, toons y games/IMG_8136_resultado.webp', 'Anime, toons y games/IMG_8147_resultado.webp',
        'Anime, toons y games/IMG_8571_resultado.webp', 'Anime, toons y games/IMG_8692_resultado.webp', 'Anime, toons y games/IMG_8696_resultado.webp',
        'Anime, toons y games/IMG_8977_resultado.webp', 'Anime, toons y games/IMG_9477_resultado.webp', 'Anime, toons y games/IMG_9793_resultado.webp',
        'Anime, toons y games/adri_resultado.webp', 'Anime, toons y games/joker_resultado.webp', 'Anime, toons y games/malef_resultado.webp',
        'Anime, toons y games/mona china_resultado.webp', 'Anime, toons y games/one piece_resultado.webp', 'Anime, toons y games/pikachu_resultado.webp',
        'Anime, toons y games/samurai_resultado.webp', 'Anime, toons y games/sukuna_resultado.webp'
      ],
      'Realismos': [
        'Realismos/1.webp', 'Realismos/1.2.webp', 'Realismos/1.4.webp',
        'Realismos/2.webp', 'Realismos/2.3.webp', 'Realismos/3.webp', 'Realismos/4.webp',
        'Realismos/5.webp', 'Realismos/6.webp', 'Realismos/7.webp', 'Realismos/8.webp',
        'Realismos/9.webp', 'Realismos/10.webp', 'Realismos/11.webp', 'Realismos/12.webp',
        'Realismos/13.webp', 'Realismos/14.webp', 'Realismos/16.webp', 'Realismos/17.webp',
        'Realismos/18.webp', 'Realismos/19.webp', 'Realismos/21.webp', 'Realismos/22.webp',
        'Realismos/23.webp', 'Realismos/24.webp', 'Realismos/25.webp', 'Realismos/26.webp',
        'Realismos/27.webp', 'Realismos/cartas.webp', 'Realismos/cruz.webp',
        'Realismos/IMG_0029.webp', 'Realismos/IMG_0155.webp', 'Realismos/IMG_0278(1).WEBP',
        'Realismos/IMG_0283.webp', 'Realismos/IMG_0615.webp', 'Realismos/IMG_1216.webp',
        'Realismos/IMG_1256.webp', 'Realismos/IMG_1292(1).webp', 'Realismos/IMG_1320.webp',
        'Realismos/IMG_1428.webp', 'Realismos/IMG_1476.webp', 'Realismos/IMG_1560.webp',
        'Realismos/IMG_1698(2).webp', 'Realismos/IMG_2642.webp', 'Realismos/IMG_2893.webp',
        'Realismos/IMG_2933.webp', 'Realismos/IMG_2989.webp', 'Realismos/IMG_3929.webp',
        'Realismos/IMG_5696.webp', 'Realismos/IMG_5708.webp', 'Realismos/IMG_5881.webp',
        'Realismos/IMG_6243.webp', 'Realismos/IMG_6244.webp', 'Realismos/IMG_6510.webp',
        'Realismos/IMG_6735.webp', 'Realismos/IMG_8002.webp', 'Realismos/IMG_8932.webp',
        'Realismos/IMG_9208.webp', 'Realismos/IMG_9447(1).webp', 'Realismos/IMG_9472.webp',
        'Realismos/IMG_0278(1)_1.webp'
      ],
      'Línea fina y Puntillismo': [
        'Línea fina y Puntillismo/1.webp', 'Línea fina y Puntillismo/2.webp', 'Línea fina y Puntillismo/3.webp',
        'Línea fina y Puntillismo/5.webp', 'Línea fina y Puntillismo/5.5.webp', 'Línea fina y Puntillismo/6.webp',
        'Línea fina y Puntillismo/7.webp', 'Línea fina y Puntillismo/8.webp', 'Línea fina y Puntillismo/9.webp',
        'Línea fina y Puntillismo/10.webp', 'Línea fina y Puntillismo/10.1.webp',
        'Línea fina y Puntillismo/11.webp', 'Línea fina y Puntillismo/12.webp', 'Línea fina y Puntillismo/12.webp',
        'Línea fina y Puntillismo/13.webp', 'Línea fina y Puntillismo/14.webp', 'Línea fina y Puntillismo/15.webp',
        'Línea fina y Puntillismo/16.webp', 'Línea fina y Puntillismo/16.5.webp',
        'Línea fina y Puntillismo/17.webp', 'Línea fina y Puntillismo/17.1.webp',
        'Línea fina y Puntillismo/18.webp', 'Línea fina y Puntillismo/19.webp',
        'Línea fina y Puntillismo/20.webp', 'Línea fina y Puntillismo/21.webp',
        'Línea fina y Puntillismo/22.webp', 'Línea fina y Puntillismo/23.webp',
        'Línea fina y Puntillismo/24.webp', 'Línea fina y Puntillismo/25.webp',
        'Línea fina y Puntillismo/26.webp', 'Línea fina y Puntillismo/27.webp',
        'Línea fina y Puntillismo/28.webp', 'Línea fina y Puntillismo/29.webp',
        'Línea fina y Puntillismo/30.webp', 'Línea fina y Puntillismo/31.webp',
        'Línea fina y Puntillismo/32.webp', 'Línea fina y Puntillismo/333.webp',
        'Línea fina y Puntillismo/40.webp', 'Línea fina y Puntillismo/41.webp',
        'Línea fina y Puntillismo/43.webp', 'Línea fina y Puntillismo/44.webp',
        'Línea fina y Puntillismo/IMG_0013.webp', 'Línea fina y Puntillismo/IMG_0018.webp',
        'Línea fina y Puntillismo/IMG_0115.webp', 'Línea fina y Puntillismo/IMG_0116.webp',
        'Línea fina y Puntillismo/IMG_0117.webp', 'Línea fina y Puntillismo/IMG_0118.webp',
        'Línea fina y Puntillismo/IMG_0119.webp', 'Línea fina y Puntillismo/IMG_0120.webp',
        'Línea fina y Puntillismo/IMG_0121.webp', 'Línea fina y Puntillismo/IMG_0122.webp',
        'Línea fina y Puntillismo/IMG_0123.webp', 'Línea fina y Puntillismo/IMG_0124.webp',
        'Línea fina y Puntillismo/IMG_0252.webp', 'Línea fina y Puntillismo/IMG_0387.webp',
        'Línea fina y Puntillismo/IMG_0419.webp', 'Línea fina y Puntillismo/IMG_0470.webp',
        'Línea fina y Puntillismo/IMG_0742.webp', 'Línea fina y Puntillismo/IMG_0826.webp',
        'Línea fina y Puntillismo/IMG_1107.webp', 'Línea fina y Puntillismo/IMG_1136.webp',
        'Línea fina y Puntillismo/IMG_1155.webp', 'Línea fina y Puntillismo/IMG_1156.webp',
        'Línea fina y Puntillismo/IMG_1159.webp', 'Línea fina y Puntillismo/IMG_1162.webp',
        'Línea fina y Puntillismo/IMG_1204.webp', 'Línea fina y Puntillismo/IMG_1293.webp',
        'Línea fina y Puntillismo/IMG_1331.webp', 'Línea fina y Puntillismo/IMG_1388.webp',
        'Línea fina y Puntillismo/IMG_1412.webp', 'Línea fina y Puntillismo/IMG_1450.webp',
        'Línea fina y Puntillismo/IMG_1672.webp', 'Línea fina y Puntillismo/IMG_1696.webp',
        'Línea fina y Puntillismo/IMG_1715.webp', 'Línea fina y Puntillismo/IMG_1752.webp',
        'Línea fina y Puntillismo/IMG_1784.webp', 'Línea fina y Puntillismo/IMG_1850.webp',
        'Línea fina y Puntillismo/IMG_1866.webp', 'Línea fina y Puntillismo/IMG_1886.webp',
        'Línea fina y Puntillismo/IMG_1918.webp', 'Línea fina y Puntillismo/IMG_1983.webp',
        'Línea fina y Puntillismo/IMG_2122.webp', 'Línea fina y Puntillismo/IMG_2211.webp',
        'Línea fina y Puntillismo/IMG_2553.webp', 'Línea fina y Puntillismo/IMG_2597.webp',
        'Línea fina y Puntillismo/IMG_2667.webp', 'Línea fina y Puntillismo/IMG_2721.webp',
        'Línea fina y Puntillismo/IMG_2725.webp', 'Línea fina y Puntillismo/IMG_2727.webp',
        'Línea fina y Puntillismo/IMG_2746.webp', 'Línea fina y Puntillismo/IMG_2778.webp',
        'Línea fina y Puntillismo/IMG_2805.webp', 'Línea fina y Puntillismo/IMG_2875.webp',
        'Línea fina y Puntillismo/IMG_2876.webp', 'Línea fina y Puntillismo/IMG_2880.webp',
        'Línea fina y Puntillismo/IMG_3278(1).webp', 'Línea fina y Puntillismo/IMG_3458.webp',
        'Línea fina y Puntillismo/IMG_3459.webp', 'Línea fina y Puntillismo/IMG_3692.webp',
        'Línea fina y Puntillismo/IMG_4004.webp', 'Línea fina y Puntillismo/IMG_4859.webp',
        'Línea fina y Puntillismo/IMG_4861.webp', 'Línea fina y Puntillismo/IMG_5015.webp',
        'Línea fina y Puntillismo/IMG_5028.webp', 'Línea fina y Puntillismo/IMG_5034.webp',
        'Línea fina y Puntillismo/IMG_5076.webp', 'Línea fina y Puntillismo/IMG_5094.webp',
        'Línea fina y Puntillismo/IMG_5100.webp', 'Línea fina y Puntillismo/IMG_5210.webp',
        'Línea fina y Puntillismo/IMG_5212.webp', 'Línea fina y Puntillismo/IMG_5214.webp',
        'Línea fina y Puntillismo/IMG_5249.webp', 'Línea fina y Puntillismo/IMG_5252.webp',
        'Línea fina y Puntillismo/IMG_5253.webp', 'Línea fina y Puntillismo/IMG_5299.webp',
        'Línea fina y Puntillismo/IMG_5511.webp', 'Línea fina y Puntillismo/IMG_5858.webp',
        'Línea fina y Puntillismo/IMG_6045.webp', 'Línea fina y Puntillismo/IMG_6056.webp',
        'Línea fina y Puntillismo/IMG_6484.webp', 'Línea fina y Puntillismo/IMG_6530.webp',
        'Línea fina y Puntillismo/IMG_6550.webp', 'Línea fina y Puntillismo/IMG_7379.webp',
        'Línea fina y Puntillismo/IMG_7380.webp', 'Línea fina y Puntillismo/IMG_7535.webp',
        'Línea fina y Puntillismo/IMG_7562.webp', 'Línea fina y Puntillismo/IMG_7570.webp',
        'Línea fina y Puntillismo/IMG_7577.webp', 'Línea fina y Puntillismo/IMG_7579.webp',
        'Línea fina y Puntillismo/IMG_7665.webp', 'Línea fina y Puntillismo/IMG_8351.webp',
        'Línea fina y Puntillismo/IMG_8424.webp', 'Línea fina y Puntillismo/IMG_8525(1).webp',
        'Línea fina y Puntillismo/IMG_8526.webp', 'Línea fina y Puntillismo/IMG_8543.webp',
        'Línea fina y Puntillismo/IMG_8567.webp', 'Línea fina y Puntillismo/IMG_8593.webp',
        'Línea fina y Puntillismo/IMG_8595.webp', 'Línea fina y Puntillismo/IMG_8597.webp',
        'Línea fina y Puntillismo/IMG_8600.webp', 'Línea fina y Puntillismo/IMG_8714.webp',
        'Línea fina y Puntillismo/IMG_8762.webp', 'Línea fina y Puntillismo/IMG_8907.webp',
        'Línea fina y Puntillismo/IMG_8932(1).webp', 'Línea fina y Puntillismo/IMG_8973.webp',
        'Línea fina y Puntillismo/IMG_8974.webp', 'Línea fina y Puntillismo/IMG_9115.webp',
        'Línea fina y Puntillismo/IMG_9155.webp', 'Línea fina y Puntillismo/IMG_9159.webp',
        'Línea fina y Puntillismo/IMG_9281.webp', 'Línea fina y Puntillismo/IMG_9298.webp',
        'Línea fina y Puntillismo/IMG_9300.webp', 'Línea fina y Puntillismo/IMG_9383.webp',
        'Línea fina y Puntillismo/IMG_9385.webp', 'Línea fina y Puntillismo/IMG_9488.webp',
        'Línea fina y Puntillismo/IMG_9525.webp', 'Línea fina y Puntillismo/IMG_9527.webp',
        'Línea fina y Puntillismo/IMG_9532.webp', 'Línea fina y Puntillismo/IMG_9537.webp',
        'Línea fina y Puntillismo/IMG_9569.webp', 'Línea fina y Puntillismo/IMG_9662.webp',
        'Línea fina y Puntillismo/IMG_9664(1).webp', 'Línea fina y Puntillismo/IMG_9734(1).webp',
        'Línea fina y Puntillismo/IMG_9887.webp', 'Línea fina y Puntillismo/IMG_9888.webp'
      ],
      'lettering y nombres': [
        'lettering y nombres/1.webp', 'lettering y nombres/2.webp', 'lettering y nombres/2.1.webp',
        'lettering y nombres/3.webp', 'lettering y nombres/4.webp', 'lettering y nombres/5.webp',
        'lettering y nombres/6.webp', 'lettering y nombres/7.webp', 'lettering y nombres/8.webp',
        'lettering y nombres/IMG_0046.webp', 'lettering y nombres/IMG_0102.webp',
        'lettering y nombres/IMG_1386.webp', 'lettering y nombres/IMG_1720.webp',
        'lettering y nombres/IMG_1758.webp', 'lettering y nombres/IMG_1759.webp',
        'lettering y nombres/IMG_2378.webp', 'lettering y nombres/IMG_2528.webp',
        'lettering y nombres/IMG_2595.webp', 'lettering y nombres/IMG_4119.webp',
        'lettering y nombres/IMG_5221.webp', 'lettering y nombres/IMG_5563.webp',
        'lettering y nombres/IMG_5745.webp', 'lettering y nombres/IMG_6561.webp',
        'lettering y nombres/IMG_6637.webp', 'lettering y nombres/IMG_6718.webp',
        'lettering y nombres/IMG_7438.webp', 'lettering y nombres/IMG_7479.webp',
        'lettering y nombres/IMG_8338.webp', 'lettering y nombres/IMG_8777.webp',
        'lettering y nombres/IMG_9044.webp', 'lettering y nombres/IMG_9251.webp',
        'lettering y nombres/IMG_9254.webp', 'lettering y nombres/IMG_9411.webp',
        'lettering y nombres/IMG_9413.webp'
      ]
    }
  };

  // Lógica del Lightbox (Visualizador en pantalla completa)
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCategory = document.getElementById('lightbox-category');
  const btnLightboxQuote = document.getElementById('btn-lightbox-quote');
  const closeLightbox = document.getElementById('close-lightbox');
  const prevBtn = document.getElementById('prev-img');
  const nextBtn = document.getElementById('next-img');

  let currentGalleryImages = [];
  let currentCategory = "";
  let currentIndex = 0;

  function updateLightboxContent() {
    if (!lightboxImg || !lightboxCategory || !btnLightboxQuote) return;
    
    // Update Image
    const imgSrc = currentGalleryImages[currentIndex];
    lightboxImg.src = imgSrc;
    
    // Update Category Text
    lightboxCategory.textContent = currentCategory.toUpperCase();

    // Update WhatsApp Link
    const phone = "526675819798";
    const pageUrl = window.location.href.split('#')[0];
    const fullImgUrl = pageUrl.substring(0, pageUrl.lastIndexOf('/') + 1) + imgSrc;
    const msg = `Hola Eterno, me interesa cotizar un tatuaje de la categoría [${currentCategory}] usando esta imagen de referencia: ${fullImgUrl}`;
    btnLightboxQuote.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  function openLightbox(index, category) {
    currentIndex = index;
    currentCategory = category;
    updateLightboxContent();
    lightboxModal.classList.add('active');
  }

  if (lightboxModal) {
    closeLightbox.addEventListener('click', () => lightboxModal.classList.remove('active'));
    
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
      updateLightboxContent();
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentGalleryImages.length;
      updateLightboxContent();
    });

    lightboxModal.addEventListener('click', (e) => {
      if(e.target === lightboxModal || e.target === document.querySelector('.lightbox-content')) {
        lightboxModal.classList.remove('active');
      }
    });

    // Soporte para flechas del teclado
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'Escape') closeLightbox.click();
    });

    // Soporte para swipe táctil (deslizar con el dedo)
    let lbTouchStartX = 0;
    let lbTouchStartY = 0;
    lightboxModal.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.touches[0].clientX;
      lbTouchStartY = e.touches[0].clientY;
    }, { passive: true });
    lightboxModal.addEventListener('touchend', (e) => {
      const diffX = lbTouchStartX - e.changedTouches[0].clientX;
      const diffY = lbTouchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
        if (diffX > 0) nextBtn.click(); // deslizar izquierda = siguiente
        else prevBtn.click();           // deslizar derecha  = anterior
      }
    }, { passive: true });
  }

  // --- CLIPBOARD COPY BUTTONS ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    if (!text) return;
    const originalHTML = btn.innerHTML;
    const doCopied = () => {
      btn.classList.add('copied');
      btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = originalHTML; }, 1600);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(doCopied).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); doCopied(); } catch(_){}
        document.body.removeChild(ta);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); doCopied(); } catch(_){}
      document.body.removeChild(ta);
    }
  });

  // --- GALLERY MODAL LOGIC (PORTFOLIO) ---
  if (galleryModal) {
    styleTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const artist = trigger.getAttribute('data-artist');
        const style = trigger.getAttribute('data-style');
        const galleryScrollRoot = document.getElementById('gallery-modal-content');
        
        galleryTitle.textContent = style.toUpperCase();
        gallerySubtitle.textContent = artist;
        
        galleryGrid.innerHTML = '';
        currentGalleryImages = portfolioData[artist]?.[style] || [];

        // IntersectionObserver real con el contenedor scrollable como root
        if (window._galleryObserver) window._galleryObserver.disconnect();
        window._galleryObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target.querySelector('img[data-src]');
              if (img) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.onload = () => {
                  entry.target.classList.remove('loading');
                  img.style.opacity = '1';
                };
              }
              window._galleryObserver.unobserve(entry.target);
            }
          });
        }, {
          root: galleryScrollRoot,
          rootMargin: '300px 0px',
          threshold: 0.01
        });

        // Crea un gallery-item (sin bloquear el hilo)
        function createGalleryItem(imgSrc, index, immediate) {
          const item = document.createElement('div');
          item.className = 'gallery-item loading';
          const img = document.createElement('img');
          if (immediate) {
            img.src = imgSrc;
            img.onload = () => { item.classList.remove('loading'); img.style.opacity = '1'; };
          } else {
            img.dataset.src = imgSrc;
          }
          img.alt = `${style} ${index + 1}`;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity 0.35s ease;';
          item.appendChild(img);
          item.addEventListener('click', () => openLightbox(index, style));
          if (!immediate) window._galleryObserver.observe(item);
          return item;
        }

        if (currentGalleryImages.length > 0) {
          const CHUNK = 12;

          // Renderiza las primeras CHUNK imágenes de inmediato
          const firstBatch = currentGalleryImages.slice(0, CHUNK);
          firstBatch.forEach((src, i) => {
            galleryGrid.appendChild(createGalleryItem(src, i, i < CHUNK));
          });

          // Renderiza el resto en bloques usando rAF para no bloquear el hilo
          let rendered = CHUNK;
          function renderNextChunk() {
            if (rendered >= currentGalleryImages.length) return;
            const end = Math.min(rendered + CHUNK, currentGalleryImages.length);
            for (let i = rendered; i < end; i++) {
              galleryGrid.appendChild(createGalleryItem(currentGalleryImages[i], i, false));
            }
            rendered = end;
            if (rendered < currentGalleryImages.length) {
              requestAnimationFrame(renderNextChunk);
            }
          }
          requestAnimationFrame(renderNextChunk);

        } else {
          for(let i = 1; i <= 6; i++) {
            galleryGrid.innerHTML += `<div class="gallery-placeholder">Foto PENDIENTE</div>`;
          }
        }

        galleryModal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    // Lógica de flechas del slider de categorías (movimiento secuencial)
    const sliderArrows = document.querySelectorAll('.slider-arrow');
    sliderArrows.forEach(arrow => {
      arrow.addEventListener('click', () => {
        const targetId = arrow.getAttribute('data-target');
        const slider = document.getElementById(targetId);
        if (slider) {
          const items = slider.querySelectorAll('.slider-item');
          if (items.length === 0) return;

          // Encontrar qué item está más al frente (centrado) actualmente
          const containerCenter = slider.scrollLeft + (slider.clientWidth / 2);
          let targetIndex = 0;
          let minDiff = Infinity;

          items.forEach((item, idx) => {
            const itemCenter = item.offsetLeft - slider.offsetLeft + (item.clientWidth / 2);
            const diff = Math.abs(itemCenter - containerCenter);
            if (diff < minDiff) {
              minDiff = diff;
              targetIndex = idx;
            }
          });

          // Decidir el siguiente índice (uno a la vez)
          if (arrow.classList.contains('slider-arrow--prev')) {
            targetIndex = Math.max(0, targetIndex - 1);
          } else {
            targetIndex = Math.min(items.length - 1, targetIndex + 1);
          }

          // Hacer scroll al item exacto centrado
          const targetItem = items[targetIndex];
          const centerOffset = targetItem.offsetLeft - slider.offsetLeft - (slider.clientWidth / 2) + (targetItem.clientWidth / 2);
          slider.scrollTo({
            left: centerOffset,
            behavior: 'smooth'
          });
        }
      });
    });

    closeGallery.addEventListener('click', () => {
      galleryModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });

    galleryModal.addEventListener('click', (e) => {
      if(e.target === galleryModal) {
        galleryModal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  }

  // --- SLIDER PAGINATION DOTS LOGIC ---
  function initSliderPagination(sliderId, dotsId) {
    const slider = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsId);
    if (!slider || !dotsContainer) return;

    const items = slider.querySelectorAll('.slider-item');
    if (items.length === 0) return;

    // Limpiar contenedor por si se reinicia
    dotsContainer.innerHTML = '';

    // Create dots
    items.forEach((item, index) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const centerOffset = item.offsetLeft - slider.offsetLeft - (slider.clientWidth / 2) + (item.clientWidth / 2);
        slider.scrollTo({
          left: centerOffset,
          behavior: 'smooth'
        });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    // Observer más sensible para detectar el centro del slider
    const observerOptions = {
      root: slider,
      threshold: 0.1, // Baja para que siempre haya algo visible
      rootMargin: '0px -40% 0px -40%' // Foco en el centro vertical (franja del 20%)
    };

    const observer = new IntersectionObserver((entries) => {
      // Filtrar solo los que están entrando
      const intersecting = entries.filter(e => e.isIntersecting);
      if (intersecting.length > 0) {
        // El que tiene mayor ratio de intersección gana
        let mainEntry = intersecting[0];
        intersecting.forEach(e => {
          if (e.intersectionRatio > mainEntry.intersectionRatio) {
            mainEntry = e;
          }
        });

        const index = Array.from(items).indexOf(mainEntry.target);
        if (index !== -1) {
          dots.forEach(d => d.classList.remove('active'));
          if (dots[index]) dots[index].classList.add('active');
        }
      }
    }, observerOptions);

    items.forEach(item => observer.observe(item));


  }

  // Initialize for both artists
  initSliderPagination('dans-slider', 'dans-dots');
  initSliderPagination('salem-slider', 'salem-dots');


  // --- MOBILE HAMBURGER MENU ---
  const hbMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.navbar__links');
  const navLinkItems = document.querySelectorAll('.navbar__links a');

  if (hbMenu && navLinks) {
    hbMenu.addEventListener('click', () => {
      console.log("Hamburger clicked");
      hbMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
      // Prevent body scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        hbMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- MANUAL ANCHOR SCROLL FIXED OFFSET ---
  // Fixes the issue where clicking internal links (#cuidados) hides the navbar on mobile
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80; // 80px matches the navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: 'instant' // 'instant' or 'auto' is more stable than 'smooth' on mobile
        });
      }
    });
  });

  // --- NUCLEAR MOBILE HEADER FIX ---
  // Forces the navbar to stay at the physical top of the visual viewport
  // to prevent it from "hiding" during slow scrolls on mobile devices.
  if (window.visualViewport) {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const glueNavbar = () => {
        // Only apply on mobile-ish screens to be safe
        if (window.innerWidth <= 900) {
          navbar.style.position = 'fixed';
          navbar.style.top = `${window.visualViewport.offsetTop}px`;
        } else {
          navbar.style.top = '0px';
        }
      };
      
      window.visualViewport.addEventListener('scroll', glueNavbar);
      window.visualViewport.addEventListener('resize', glueNavbar);
      window.addEventListener('scroll', glueNavbar);
      
      // Initial call
      glueNavbar();
    }
  }

  console.log("Eterno App: Initialization complete");
});
