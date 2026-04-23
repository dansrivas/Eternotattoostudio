/**
 * ETERNO TATTOO STUDIO - MAIN APPLICATION
 * Restored with Full Gift Card Preview & Interaction Logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("Eterno App: Initializing core systems...");

  const safeListen = (id, event, callback) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, callback);
  };

  const safeClick = (id, callback) => safeListen(id, 'click', callback);

  // --- MOBILE MENU ---
  const hbMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.navbar__links');

  if (hbMenu && navLinks) {
    hbMenu.onclick = (e) => {
      if(e) e.preventDefault();
      hbMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    document.querySelectorAll('.navbar__links a').forEach(link => {
      link.onclick = () => {
        hbMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      };
    });
  }

  // --- DYNAMIC LOADER FOR SIMULATOR ---
  let isSimulatorLoaded = false;
  const simOverlay = document.getElementById('simulator-overlay');

  window.openSimulator = function() {
    if (!simOverlay) return;
    simOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (!isSimulatorLoaded) {
      const script = document.createElement('script');
      script.src = 'simulator.js?v=1.3';
      script.onload = () => {
        isSimulatorLoaded = true;
        if (window.initSimulator) window.initSimulator();
      };
      document.head.appendChild(script);
    }
  };

  window.closeSimulator = function() {
    if (simOverlay) {
      simOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  safeClick('btn-select-simulator', openSimulator);
  safeClick('btn-close-sim', closeSimulator);

  // --- GIFT CARD MODAL OPEN/CLOSE ---
  const openGiftCard = () => {
    const modal = document.getElementById('giftcard-modal');
    if(modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
  safeClick('giftcard-trigger', openGiftCard);
  safeClick('close-giftcard', () => {
    document.getElementById('giftcard-modal')?.classList.remove('active');
    document.body.style.overflow = '';
  });

  // --- GIFT CARD LIVE PREVIEW ---
  const gcInputPara = document.getElementById('gc-input-para');
  const gcInputDe = document.getElementById('gc-input-de');
  const gcInputMonto = document.getElementById('gc-input-monto');
  const gcInputPhone = document.getElementById('gc-input-phone');
  const gcHideAmount = document.getElementById('gc-hide-amount');

  function updatePreview() {
    const paraDisp = document.getElementById('gcp-preview-para');
    const deDisp = document.getElementById('gcp-preview-de');
    const montoDisp = document.getElementById('gcp-preview-monto');
    const codeDisp = document.getElementById('gcp-preview-codigo');

    if(paraDisp) paraDisp.textContent = (gcInputPara?.value || "").toUpperCase();
    if(deDisp) deDisp.textContent = (gcInputDe?.value || "").toUpperCase();
    
    if(montoDisp) {
      if (gcHideAmount?.checked) {
        montoDisp.textContent = "DISEÑO SELECCIONADO";
        montoDisp.style.fontSize = "1.8cqi";
      } else {
        montoDisp.textContent = gcInputMonto?.value ? `$${gcInputMonto.value} MXN` : "";
        montoDisp.style.fontSize = "2.6cqi";
      }
    }
    
    if(codeDisp) {
      const phone = gcInputPhone?.value || "";
      codeDisp.textContent = phone.length >= 4 ? phone.slice(-4) : "";
    }
  }

  if(gcInputPara) gcInputPara.addEventListener('input', updatePreview);
  if(gcInputDe) gcInputDe.addEventListener('input', updatePreview);
  if(gcInputMonto) gcInputMonto.addEventListener('input', updatePreview);
  if(gcInputPhone) gcInputPhone.addEventListener('input', updatePreview);
  if(gcHideAmount) gcHideAmount.addEventListener('change', updatePreview);

  // --- GIFT CARD GENERATION ---
  const btnGcSiguiente = document.getElementById('btn-gc-siguiente');
  if (btnGcSiguiente) {
    btnGcSiguiente.onclick = async () => {
      const para = gcInputPara?.value;
      const de = gcInputDe?.value;
      const monto = gcInputMonto?.value;
      const phone = gcInputPhone?.value;

      if (!para || !de || !monto || !phone) {
        alert("Por favor llena todos los campos para continuar.");
        return;
      }

      // Sync Capture Area
      const capPara = document.getElementById('gcp-capture-para');
      const capDe = document.getElementById('gcp-capture-de');
      const capMonto = document.getElementById('gcp-capture-monto');
      const capCode = document.getElementById('gcp-capture-codigo');

      if(capPara) capPara.textContent = para.toUpperCase();
      if(capDe) capDe.textContent = de.toUpperCase();
      if(capMonto) {
         if (gcHideAmount?.checked) {
           capMonto.textContent = "DISEÑO SELECCIONADO";
           capMonto.style.fontSize = "20px";
         } else {
           capMonto.textContent = `$${monto} MXN`;
           capMonto.style.fontSize = "28px";
         }
      }
      if(capCode) capCode.textContent = phone.slice(-4);

      btnGcSiguiente.textContent = "GENERANDO...";
      btnGcSiguiente.disabled = true;

      try {
        const captureArea = document.getElementById('gift-card-capture');
        if (!window.html2canvas) {
           alert("Cargando motor de imagen... espera 2 segundos.");
           return;
        }

        const canvas = await html2canvas(captureArea, { scale: 2, useCORS: true });
        const dataUrl = canvas.toDataURL('image/png');
        
        const imgContainer = document.getElementById('generated-gc-image');
        if(imgContainer) imgContainer.innerHTML = `<img src="${dataUrl}" style="width:100%; max-width:500px; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">`;

        // UI Switches
        document.getElementById('giftcard-step-2').style.display = 'block';
        document.getElementById('giftcard-step-1').style.display = 'none';
        document.querySelector('.gift-form').style.display = 'none';
        document.querySelector('.giftcard-how-to').style.display = 'none';
        document.getElementById('gcp-wrapper').style.display = 'none';

        // Update Links
        const studioWA = document.getElementById('btn-gc-whatsapp-studio');
        if(studioWA) {
          const msg = `Hola Eterno, activo mi tarjeta para ${para} por $${monto}.`;
          studioWA.href = `https://wa.me/526675819798?text=${encodeURIComponent(msg)}`;
        }

        const downloadBtn = document.getElementById('btn-gc-download');
        if(downloadBtn) {
          downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = `tarjeta-eterno-${para}.png`;
            link.href = dataUrl;
            link.click();
          };
        }

      } catch (err) {
        console.error("Capture Error:", err);
        alert("Error al generar imagen. Revisa tu conexión.");
      } finally {
        btnGcSiguiente.textContent = "GENERAR TARJETA Y CONTINUAR";
        btnGcSiguiente.disabled = false;
      }
    };
  }

  safeClick('btn-gc-back', () => {
    document.getElementById('giftcard-step-2').style.display = 'none';
    document.getElementById('giftcard-step-1').style.display = 'block';
    document.querySelector('.gift-form').style.display = 'block';
    document.querySelector('.giftcard-how-to').style.display = 'block';
    document.getElementById('gcp-wrapper').style.display = 'block';
  });

  // --- PORTFOLIO & LIGHTBOX ---
  const styleTriggers = document.querySelectorAll('.style-trigger');
  styleTriggers.forEach(t => {
    t.onclick = (e) => {
      e.preventDefault();
      if (!window.portfolioData) return alert("Cargando portafolio...");
      const artist = t.getAttribute('data-artist');
      const style = t.getAttribute('data-style');
      const grid = document.getElementById('gallery-grid');
      const images = window.portfolioData[artist]?.[style] || [];
      if(grid) {
        grid.innerHTML = '';
        images.forEach((src, i) => {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          item.innerHTML = `<img src="${src}" loading="lazy">`;
          item.onclick = () => {
            const lb = document.getElementById('lightbox-modal');
            const track = document.getElementById('lightbox-track');
            if(track) track.innerHTML = `<img src="${src}">`;
            if(lb) lb.classList.add('active');
          };
          grid.appendChild(item);
        });
      }
      document.getElementById('gallery-modal')?.classList.add('active');
    };
  });

  safeClick('close-gallery', () => document.getElementById('gallery-modal')?.classList.remove('active'));
  safeClick('close-lightbox', () => document.getElementById('lightbox-modal')?.classList.remove('active'));

  // --- PROMOCIONES ---
  window.openPromoModal = function(id) {
    const modal = document.getElementById('promo-modal');
    if(modal) modal.style.display = 'flex';
  };
  window.closePromoModal = () => document.getElementById('promo-modal').style.display = 'none';

  // --- CLIPBOARD ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if(!btn) return;
    navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(() => {
      const span = btn.querySelector('span');
      if(span) { 
        const oldText = span.textContent;
        span.textContent = "¡Copiado!"; 
        setTimeout(() => span.textContent = oldText, 1500); 
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
});
