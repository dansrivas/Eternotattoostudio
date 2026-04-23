/**
 * ETERNO TATTOO STUDIO - MAIN APPLICATION
 * Error-proof version to ensure mobile compatibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("Eterno App: Initializing core systems...");

  // Helper function to safely add event listeners
  const safeListen = (id, event, callback) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, callback);
  };

  const safeClick = (id, callback) => safeListen(id, 'click', callback);

  // --- MOBILE MENU ---
  const hbMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.navbar__links');

  if (hbMenu && navLinks) {
    const toggleMenu = (e) => {
      if(e) e.preventDefault();
      hbMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    hbMenu.onclick = toggleMenu; // Using onclick for maximum compatibility

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
      script.src = 'simulator.js?v=1.2';
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

  // --- OPEN GIFT CARD MODAL ---
  const openGiftCard = () => {
    const modal = document.getElementById('giftcard-modal');
    if(modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
  
  // Trigger from the section button
  safeClick('giftcard-trigger', openGiftCard);
  
  // Close logic
  safeClick('close-giftcard', () => {
    document.getElementById('giftcard-modal')?.classList.remove('active');
    document.body.style.overflow = '';
  });

  // --- GIFT CARD LOGIC ---
  const btnGcSiguiente = document.getElementById('btn-gc-siguiente');
  if (btnGcSiguiente) {
    const handleGiftCard = async (e) => {
      if(e) e.preventDefault();
      
      const paraInput = document.getElementById('gc-input-para');
      const deInput = document.getElementById('gc-input-de');
      const montoInput = document.getElementById('gc-input-monto');
      const phoneInput = document.getElementById('gc-input-phone');

      if (!paraInput?.value || !deInput?.value || !montoInput?.value || !phoneInput?.value) {
        alert("Por favor llena todos los campos para continuar.");
        return;
      }

      const para = paraInput.value;
      const de = deInput.value;
      const monto = montoInput.value;
      const phone = phoneInput.value;

      // Update capture area
      const capPara = document.getElementById('gcp-capture-para');
      const capDe = document.getElementById('gcp-capture-de');
      const capMonto = document.getElementById('gcp-capture-monto');
      const capCode = document.getElementById('gcp-capture-codigo');
      const hideAmount = document.getElementById('gc-hide-amount')?.checked;

      if(capPara) capPara.textContent = para.toUpperCase();
      if(capDe) capDe.textContent = de.toUpperCase();
      if(capMonto) capMonto.textContent = hideAmount ? "DISEÑO SELECCIONADO" : `$${monto} MXN`;
      if(capCode) capCode.textContent = phone.slice(-4);

      btnGcSiguiente.textContent = "GENERANDO...";
      btnGcSiguiente.disabled = true;
      
      try {
        const captureArea = document.getElementById('gift-card-capture');
        if (!window.html2canvas) {
           alert("Espera un momento a que cargue el sistema de imágenes e intenta de nuevo.");
           return;
        }
        
        const canvas = await html2canvas(captureArea, { 
          scale: 2, 
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        
        const dataUrl = canvas.toDataURL('image/png');
        const imgContainer = document.getElementById('generated-gc-image');
        if(imgContainer) imgContainer.innerHTML = `<img src="${dataUrl}" style="width:100%; max-width:500px; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">`;

        const step2 = document.getElementById('giftcard-step-2');
        const step1 = document.getElementById('giftcard-step-1');
        const preview = document.getElementById('gcp-wrapper');
        
        if(step2) step2.style.display = 'block';
        if(step1) step1.style.display = 'none';
        if(preview) preview.style.display = 'none';

        // Update WhatsApp
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

      } catch (e) {
        console.error("Error generating card:", e);
        alert("Hubo un detalle al generar la imagen. Por favor intenta de nuevo.");
      } finally {
        btnGcSiguiente.textContent = "GENERAR TARJETA Y CONTINUAR";
        btnGcSiguiente.disabled = false;
      }
    };

    btnGcSiguiente.onclick = handleGiftCard;
  }

  safeClick('btn-gc-back', () => {
    document.getElementById('giftcard-step-2').style.display = 'none';
    document.querySelector('.gift-form').style.display = 'block';
    document.querySelector('.giftcard-how-to').style.display = 'block';
    document.getElementById('gcp-wrapper').style.display = 'block';
  });

  // --- PORTFOLIO & LIGHTBOX ---
  const styleTriggers = document.querySelectorAll('.style-trigger');
  styleTriggers.forEach(t => {
    t.onclick = (e) => {
      e.preventDefault();
      const artist = t.getAttribute('data-artist');
      const style = t.getAttribute('data-style');
      if (!window.portfolioData) return alert("Cargando portafolio...");
      
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

  // --- PROMOS ---
  window.openPromoModal = function(id) {
    const modal = document.getElementById('promo-modal');
    if(modal) modal.style.display = 'flex';
  };
  window.closePromoModal = () => document.getElementById('promo-modal').style.display = 'none';

  // --- LUCIDE ---
  if (window.lucide) window.lucide.createIcons();
});
