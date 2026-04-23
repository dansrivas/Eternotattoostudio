/**
 * ETERNO TATTOO STUDIO - MAIN APPLICATION
 * Fixed Version: Restored original Gift Card & Menu logic with performance optimizations.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("Eterno App: Initializing core systems...");

  // --- MOBILE MENU ---
  const hbMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.navbar__links');
  const navLinkItems = document.querySelectorAll('.navbar__links a');

  if (hbMenu && navLinks) {
    hbMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      hbMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        hbMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hbMenu.contains(e.target) && navLinks.classList.contains('active')) {
        hbMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- DYNAMIC LOADER FOR SIMULATOR ---
  let isSimulatorLoaded = false;
  const simOverlay = document.getElementById('simulator-overlay');
  const btnSelectSimulator = document.getElementById('btn-select-simulator');

  window.openSimulator = function() {
    if (!simOverlay) return;
    simOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (!isSimulatorLoaded) {
      console.log("Loading AR Simulator module...");
      const script = document.createElement('script');
      script.src = 'simulator.js?v=1.1';
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

  if (btnSelectSimulator) {
    btnSelectSimulator.addEventListener('click', openSimulator);
  }

  const btnCloseSim = document.getElementById('btn-close-sim');
  if (btnCloseSim) {
    btnCloseSim.addEventListener('click', closeSimulator);
  }

  // --- GIFT CARD LOGIC (RESTORED) ---
  const gcInputPara = document.getElementById('gc-input-para');
  const gcInputDe = document.getElementById('gc-input-de');
  const gcInputMonto = document.getElementById('gc-input-monto');
  const gcInputPhone = document.getElementById('gc-input-phone');
  const gcHideAmount = document.getElementById('gc-hide-amount');
  const btnGcSiguiente = document.getElementById('btn-gc-siguiente');
  
  const step2 = document.getElementById('giftcard-step-2');
  const formArea = document.querySelector('.gift-form');
  const howToArea = document.querySelector('.giftcard-how-to');
  const generatedImgContainer = document.getElementById('generated-gc-image');

  function updatePreview() {
    const para = document.getElementById('gcp-preview-para');
    const de = document.getElementById('gcp-preview-de');
    const monto = document.getElementById('gcp-preview-monto');
    const codigo = document.getElementById('gcp-preview-codigo');

    if(para) para.textContent = gcInputPara.value.toUpperCase();
    if(de) de.textContent = gcInputDe.value.toUpperCase();
    
    if(monto) {
      if (gcHideAmount && gcHideAmount.checked) {
        monto.textContent = "DISEÑO SELECCIONADO";
        monto.style.fontSize = "1.8cqi";
      } else {
        monto.textContent = gcInputMonto.value ? `$${gcInputMonto.value} MXN` : "$0 MXN";
        monto.style.fontSize = "2.6cqi";
      }
    }
    
    if(codigo) {
      const phone = gcInputPhone.value || "0000";
      codigo.textContent = phone.slice(-4);
    }
  }

  if(gcInputPara) gcInputPara.addEventListener('input', updatePreview);
  if(gcInputDe) gcInputDe.addEventListener('input', updatePreview);
  if(gcInputMonto) gcInputMonto.addEventListener('input', updatePreview);
  if(gcInputPhone) gcInputPhone.addEventListener('input', updatePreview);
  if(gcHideAmount) gcHideAmount.addEventListener('change', updatePreview);

  if (btnGcSiguiente) {
    btnGcSiguiente.addEventListener('click', async () => {
      if (!gcInputPara.value || !gcInputDe.value || !gcInputMonto.value || !gcInputPhone.value) {
        alert("Por favor llena todos los campos para generar tu tarjeta.");
        return;
      }

      // Sync capture area
      document.getElementById('gcp-capture-para').textContent = gcInputPara.value.toUpperCase();
      document.getElementById('gcp-capture-de').textContent = gcInputDe.value.toUpperCase();
      const capMonto = document.getElementById('gcp-capture-monto');
      if (gcHideAmount && gcHideAmount.checked) {
        capMonto.textContent = "DISEÑO SELECCIONADO";
        capMonto.style.fontSize = "20px";
      } else {
        capMonto.textContent = `$${gcInputMonto.value} MXN`;
        capMonto.style.fontSize = "28px";
      }
      document.getElementById('gcp-capture-codigo').textContent = gcInputPhone.value.slice(-4);

      btnGcSiguiente.textContent = "GENERANDO...";
      btnGcSiguiente.disabled = true;

      try {
        const captureArea = document.getElementById('gift-card-capture');
        const canvas = await html2canvas(captureArea, {
          backgroundColor: null,
          scale: 2,
          useCORS: true
        });

        const dataUrl = canvas.toDataURL('image/png');
        generatedImgContainer.innerHTML = `<img src="${dataUrl}" style="width:100%; max-width:500px; border-radius:12px; border:1px solid #333;">`;
        
        // Switch steps
        if(formArea) formArea.style.display = 'none';
        if(howToArea) howToArea.style.display = 'none';
        document.getElementById('gcp-wrapper').style.display = 'none';
        if(step2) step2.style.display = 'block';

        // Update WhatsApp Links
        const phoneStudio = "526675819798";
        const msgStudio = `Hola Eterno, acabo de generar una tarjeta de regalo para ${gcInputPara.value} por el monto de $${gcInputMonto.value}. Adjunto el comprobante de pago para activarla.`;
        document.getElementById('btn-gc-whatsapp-studio').href = `https://wa.me/${phoneStudio}?text=${encodeURIComponent(msgStudio)}`;

        const msgFriend = `¡Hola ${gcInputPara.value}! Tengo una sorpresa para ti. Te regalo este tatuaje en Eterno Tattoo Studio. ¡Espero que te guste!`;
        document.getElementById('btn-gc-whatsapp-friend').href = `https://wa.me/${gcInputPhone.value}?text=${encodeURIComponent(msgFriend)}`;

        // Download button
        document.getElementById('btn-gc-download').onclick = () => {
          const link = document.createElement('a');
          link.download = `tarjeta-eterno-${gcInputPara.value}.png`;
          link.href = dataUrl;
          link.click();
        };

      } catch (err) {
        console.error("Error generating card:", err);
        alert("Hubo un error al generar la imagen. Intenta de nuevo.");
      } finally {
        btnGcSiguiente.textContent = "GENERAR TARJETA Y CONTINUAR";
        btnGcSiguiente.disabled = false;
      }
    });
  }

  const btnGcBack = document.getElementById('btn-gc-back');
  if (btnGcBack) {
    btnGcBack.addEventListener('click', () => {
      if(step2) step2.style.display = 'none';
      if(formArea) formArea.style.display = 'block';
      if(howToArea) howToArea.style.display = 'block';
      document.getElementById('gcp-wrapper').style.display = 'block';
    });
  }

  // --- PORTFOLIO GALLERY ---
  const styleTriggers = document.querySelectorAll('.style-trigger');
  const galleryModal = document.getElementById('gallery-modal');
  const closeGallery = document.getElementById('close-gallery');
  const galleryGrid = document.getElementById('gallery-grid');

  if (galleryModal) {
    styleTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const artist = trigger.getAttribute('data-artist');
        const style = trigger.getAttribute('data-style');
        
        if (!window.portfolioData) {
          alert("Cargando datos del portafolio... intenta en un segundo.");
          return;
        }

        document.getElementById('gallery-title').textContent = style.toUpperCase();
        document.getElementById('gallery-subtitle').textContent = artist;
        galleryGrid.innerHTML = '';
        const images = window.portfolioData[artist]?.[style] || [];

        images.forEach((src, idx) => {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          item.innerHTML = `<img src="${src}" loading="lazy">`;
          item.onclick = () => openLightbox(idx, style, images);
          galleryGrid.appendChild(item);
        });

        galleryModal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    if(closeGallery) closeGallery.onclick = () => {
      galleryModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    };
  }

  // --- LIGHTBOX ---
  const lightbox = document.getElementById('lightbox-modal');
  let currentImages = [];
  let currentIdx = 0;

  function openLightbox(idx, cat, imgs) {
    currentImages = imgs;
    currentIdx = idx;
    updateLightbox();
    if(lightbox) lightbox.classList.add('active');
  }

  function updateLightbox() {
    const track = document.getElementById('lightbox-track');
    if(!track) return;
    track.innerHTML = `<div class="lightbox-slide"><img src="${currentImages[currentIdx]}"></div>`;
    document.getElementById('lightbox-category').textContent = "ESTILO";
    
    const phone = "526675819798";
    const msg = `Hola Eterno, me interesa este trabajo de tu portafolio: ${window.location.origin}/${currentImages[currentIdx]}`;
    document.getElementById('btn-lightbox-quote').href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  document.getElementById('close-lightbox').onclick = () => lightbox.classList.remove('active');
  document.getElementById('prev-img').onclick = () => { if(currentIdx > 0) { currentIdx--; updateLightbox(); } };
  document.getElementById('next-img').onclick = () => { if(currentIdx < currentImages.length-1) { currentIdx++; updateLightbox(); } };

  // --- PROMOCIONES ---
  const promos = {
    'flash': {
      title: '¿Qué es un Flash?',
      detail: 'Diseños listos para tatuar de nuestros artistas o catálogo de internet.',
      requirements: ['Diseños originales o internet', 'Precio especial', 'Sin cambios'],
      images: ['exampleflash.webp'],
      whatsappMsg: 'Me interesa un Flash.'
    },
    'trilogia': {
      title: 'Trilogía de Línea',
      price: '$1,000',
      detail: '3 mini tattoos por un precio increíble.',
      requirements: ['Hasta 5cm', 'Estilo Fine Line'],
      images: ['flash1.webp', 'flash1.1.webp'],
      whatsappMsg: 'Me interesa la Trilogía.'
    },
    'detalle': {
      title: 'Paquete de Detalle',
      price: '$1,500',
      detail: '3 mini tattoos con sombras y textura.',
      requirements: ['Hasta 5cm', 'Incluye sombras'],
      images: ['flash 2.webp'],
      whatsappMsg: 'Me interesa el Paquete Detalle.'
    },
    'gemelas': {
      title: 'Almas Gemelas',
      price: '$1,200',
      detail: 'Un tatuaje para cada uno compartiendo la experiencia.',
      requirements: ['2 personas', 'Hasta 6cm'],
      images: ['flash pareja.webp'],
      whatsappMsg: 'Me interesa Almas Gemelas.'
    }
  };

  window.openPromoModal = function(id) {
    const promo = promos[id];
    const modal = document.getElementById('promo-modal');
    const content = document.getElementById('promo-modal-content');
    if(!promo || !modal) return;

    content.innerHTML = `
      <h2 style="color:#fff; font-family:'Raven Hell Bold'; font-size:2.5rem;">${promo.title}</h2>
      ${promo.price ? `<p style="color:#FABA20; font-size:1.5rem;">${promo.price}</p>` : ''}
      <p style="color:#ccc;">${promo.detail}</p>
      <div style="display:flex; overflow-x:auto; gap:10px; margin:1rem 0;">
        ${promo.images.map(img => `<img src="${img}" style="height:250px; border-radius:8px;">`).join('')}
      </div>
      <ul style="color:#ddd; text-align:left;">${promo.requirements.map(r => `<li>• ${r}</li>`).join('')}</ul>
      <a href="https://wa.me/526675819798?text=${encodeURIComponent(promo.whatsappMsg)}" target="_blank" class="btn btn--dans" style="display:block; text-align:center; margin-top:1rem;">AGENDAR</a>
    `;
    modal.style.display = 'flex';
  };

  window.closePromoModal = () => document.getElementById('promo-modal').style.display = 'none';

  // CLIPBOARD
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if(!btn) return;
    navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(() => {
      const span = btn.querySelector('span');
      if(span) { span.textContent = "¡Copiado!"; setTimeout(() => span.textContent = "Copiar número", 1500); }
    });
  });

  if (window.lucide) window.lucide.createIcons();
});
