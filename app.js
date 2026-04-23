/**
 * ETERNO TATTOO STUDIO - MAIN APPLICATION
 * Final Version: Optimized Performance + Restored Legacy Gift Card Precision.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("Eterno App: Starting core...");

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
      script.src = 'simulator.js?v=1.4';
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

  // --- GIFT CARD MODAL ---
  safeClick('giftcard-trigger', () => {
    const modal = document.getElementById('giftcard-modal');
    if(modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
  safeClick('close-giftcard', () => {
    document.getElementById('giftcard-modal')?.classList.remove('active');
    document.body.style.overflow = '';
  });

  // --- GIFT CARD LIVE PREVIEW & GENERATION ---
  const gcInputPara = document.getElementById('gc-input-para');
  const gcInputDe = document.getElementById('gc-input-de');
  const gcInputMonto = document.getElementById('gc-input-monto');
  const gcInputPhone = document.getElementById('gc-input-phone');
  const gcHideAmount = document.getElementById('gc-hide-amount');

  function updatePreview() {
    const pPara = document.getElementById('gcp-preview-para');
    const pDe = document.getElementById('gcp-preview-de');
    const pMonto = document.getElementById('gcp-preview-monto');
    const pCode = document.getElementById('gcp-preview-codigo');

    if(pPara) pPara.textContent = (gcInputPara?.value || "").toUpperCase();
    if(pDe) pDe.textContent = (gcInputDe?.value || "").toUpperCase();
    if(pMonto) {
      if (gcHideAmount?.checked) {
        pMonto.textContent = "DISEÑO SELECCIONADO";
        pMonto.style.fontSize = "1.8cqi";
      } else {
        pMonto.textContent = gcInputMonto?.value ? `$${gcInputMonto.value} MXN` : "";
        pMonto.style.fontSize = "2.6cqi";
      }
    }
    if(pCode) {
      const ph = gcInputPhone?.value || "";
      pCode.textContent = ph.length >= 4 ? ph.slice(-4) : "";
    }
  }

  [gcInputPara, gcInputDe, gcInputMonto, gcInputPhone, gcHideAmount].forEach(input => {
    if(input) input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', updatePreview);
  });

  const btnGcSiguiente = document.getElementById('btn-gc-siguiente');
  if (btnGcSiguiente) {
    btnGcSiguiente.onclick = async () => {
      if (!gcInputPara?.value || !gcInputDe?.value || !gcInputMonto?.value || !gcInputPhone?.value) {
        alert("Por favor llena todos los campos.");
        return;
      }

      // 1. SYNC CAPTURE AREA (Legacy Precision)
      const cPara = document.getElementById('gcp-capture-para');
      const cDe = document.getElementById('gcp-capture-de');
      const cMonto = document.getElementById('gcp-capture-monto');
      const cCode = document.getElementById('gcp-capture-codigo');

      if(cPara) cPara.textContent = gcInputPara.value.toUpperCase();
      if(cDe) cDe.textContent = gcInputDe.value.toUpperCase();
      if(cMonto) {
        if (gcHideAmount?.checked) {
          cMonto.textContent = "DISEÑO SELECCIONADO";
          cMonto.style.fontSize = "20px";
        } else {
          cMonto.textContent = `$${gcInputMonto.value} MXN`;
          cMonto.style.fontSize = "24px";
        }
      }
      if(cCode) cCode.textContent = gcInputPhone.value.slice(-4);

      btnGcSiguiente.textContent = "GENERANDO...";
      btnGcSiguiente.disabled = true;

      try {
        const captureArea = document.getElementById('gift-card-capture');
        const canvas = await html2canvas(captureArea, { scale: 2, useCORS: true, backgroundColor: null });
        const dataUrl = canvas.toDataURL('image/png');
        
        const imgCont = document.getElementById('generated-gc-image');
        if(imgCont) imgCont.innerHTML = `<img src="${dataUrl}" style="width:100%; max-width:500px; border-radius:12px; box-shadow: 0 15px 40px rgba(0,0,0,0.6);">`;

        // Step transition
        document.getElementById('giftcard-step-2').style.display = 'block';
        document.getElementById('giftcard-step-1').style.display = 'none';
        document.querySelector('.gift-form').style.display = 'none';
        document.querySelector('.giftcard-how-to').style.display = 'none';
        document.getElementById('gcp-wrapper').style.display = 'none';

        // Set up links
        const studioWA = document.getElementById('btn-gc-whatsapp-studio');
        if(studioWA) {
          const msg = `Hola Eterno, envío comprobante de la tarjeta de regalo para ${para} por $${monto}. Quedo atento a la activación.`;
          studioWA.href = `https://wa.me/526675819798?text=${encodeURIComponent(msg)}`;
        }

        // WhatsApp Friend is now generic in HTML, no need to update it here.

        const downloadBtn = document.getElementById('btn-gc-download');
        if(downloadBtn) {
          downloadBtn.onclick = () => {
            const l = document.createElement('a');
            l.download = `tarjeta-eterno-${para}.png`;
            l.href = dataUrl;
            l.click();
          };
        }

      } catch (e) {
        console.error(e);
        alert("Error al generar imagen.");
      } finally {
        btnGcSiguiente.textContent = "GENERAR TARJETA Y CONTINUAR";
        btnGcSiguiente.disabled = false;
      }
    };
  }

  safeClick('btn-gc-finalize', () => {
    const modal = document.getElementById('giftcard-modal');
    if(modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset steps for next time
      setTimeout(() => {
        document.getElementById('giftcard-step-2').style.display = 'none';
        document.getElementById('giftcard-step-1').style.display = 'block';
        document.querySelector('.gift-form').style.display = 'block';
        document.querySelector('.giftcard-how-to').style.display = 'block';
        document.getElementById('gcp-wrapper').style.display = 'block';
      }, 500);
    }
  });

  safeClick('btn-gc-back', () => {
    document.getElementById('giftcard-step-2').style.display = 'none';
    document.getElementById('giftcard-step-1').style.display = 'block';
    document.querySelector('.gift-form').style.display = 'block';
    document.querySelector('.giftcard-how-to').style.display = 'block';
    document.getElementById('gcp-wrapper').style.display = 'block';
  });

  // --- PORTFOLIO & GALLERY ---
  const styleTriggers = document.querySelectorAll('.style-trigger');
  styleTriggers.forEach(t => {
    t.onclick = (e) => {
      e.preventDefault();
      if (!window.portfolioData) return alert("Cargando portafolio...");
      const artist = t.getAttribute('data-artist');
      const style = t.getAttribute('data-style');
      const grid = document.getElementById('gallery-grid');
      const imgs = window.portfolioData[artist]?.[style] || [];
      if(grid) {
        grid.innerHTML = '';
        imgs.forEach((s, i) => {
          const it = document.createElement('div');
          it.className = 'gallery-item';
          it.innerHTML = `<img src="${s}" loading="lazy">`;
          it.onclick = () => {
            const lb = document.getElementById('lightbox-modal');
            const track = document.getElementById('lightbox-track');
            if(track) track.innerHTML = `<img src="${s}">`;
            if(lb) lb.classList.add('active');
          };
          grid.appendChild(it);
        });
      }
      document.getElementById('gallery-modal')?.classList.add('active');
    };
  });

  safeClick('close-gallery', () => document.getElementById('gallery-modal')?.classList.remove('active'));
  safeClick('close-lightbox', () => document.getElementById('lightbox-modal')?.classList.remove('active'));

  // --- PROMOCIONES MODAL ---
  window.openPromoModal = (id) => document.getElementById('promo-modal').style.display = 'flex';
  window.closePromoModal = () => document.getElementById('promo-modal').style.display = 'none';

  // --- COPY CLIPBOARD ---
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.copy-btn');
    if(!b) return;
    navigator.clipboard.writeText(b.getAttribute('data-copy')).then(() => {
      const s = b.querySelector('span');
      if(s) { 
        const t = s.textContent; 
        s.textContent = "¡Copiado!"; 
        setTimeout(() => s.textContent = t, 1500); 
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
});
