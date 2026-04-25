/**
 * ETERNO TATTOO STUDIO - MAIN APPLICATION
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("Eterno App: Initializing...");

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
      script.src = 'simulator.js?v=1.5';
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
      const para = gcInputPara?.value;
      const de = gcInputDe?.value;
      const monto = gcInputMonto?.value;
      const phone = gcInputPhone?.value;

      if (!para || !de || !monto || !phone) {
        alert("Por favor llena todos los campos para continuar.");
        return;
      }
      if (Number(monto) < 500) {
        alert("El monto mínimo para una tarjeta de regalo es de $500 MXN.");
        return;
      }

      const cPara = document.getElementById('gcp-capture-para');
      const cDe = document.getElementById('gcp-capture-de');
      const cMonto = document.getElementById('gcp-capture-monto');
      const cCode = document.getElementById('gcp-capture-codigo');

      if(cPara) cPara.textContent = para.toUpperCase();
      if(cDe) cDe.textContent = de.toUpperCase();
      if(cMonto) {
        if (gcHideAmount?.checked) {
          cMonto.textContent = "DISEÑO SELECCIONADO";
          cMonto.style.fontSize = "20px";
        } else {
          cMonto.textContent = `$${monto} MXN`;
          cMonto.style.fontSize = "24px";
        }
      }
      if(cCode) cCode.textContent = phone.slice(-4);

      btnGcSiguiente.textContent = "GENERANDO...";
      btnGcSiguiente.disabled = true;

      try {
        const captureArea = document.getElementById('gift-card-capture');
        const canvas = await html2canvas(captureArea, { scale: 2, useCORS: true, backgroundColor: null });
        const dataUrl = canvas.toDataURL('image/png');
        
        const imgCont = document.getElementById('generated-gc-image');
        if(imgCont) imgCont.innerHTML = `<img src="${dataUrl}" style="width:100%; max-width:500px; border-radius:12px; box-shadow: 0 15px 40px rgba(0,0,0,0.6);">`;

        const s1 = document.getElementById('giftcard-step-1');
        const s2 = document.getElementById('giftcard-step-2');
        const gform = document.querySelector('.gift-form');
        const ghow = document.querySelector('.giftcard-how-to');
        const gwrap = document.getElementById('gcp-wrapper');
        
        if(s2) s2.style.display = 'block';
        if(s1) s1.style.display = 'none';
        if(gform) gform.style.display = 'none';
        if(ghow) ghow.style.display = 'none';
        if(gwrap) gwrap.style.display = 'none';

        const studioWA = document.getElementById('btn-gc-whatsapp-studio');
        if(studioWA) {
          const msg = `Hola Eterno, envío comprobante de la tarjeta de regalo para ${para} por $${monto}. Quedo atento a la activación.`;
          studioWA.href = `https://wa.me/526675819798?text=${encodeURIComponent(msg)}`;
        }

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

  // --- PROMOCIONES DATA & MODAL ---
  const promos = {
    'flash': {
      title: '¿Qué es un Flash?',
      price: 'Info Esencial',
      detail: 'Diseños originales creados por el artista, listos para ser tatuados. Una forma rápida y profesional de llevar arte único en tu piel.',
      requirements: [
        'Diseños de autor (no se modifican)',
        'Tamaño: No mayor a 5 cm',
        'Precio reducido comparado con piezas personalizadas',
        'Disponibilidad inmediata'
      ],
      image: 'exampleflash.webp',
      whatsappMsg: 'Hola Eterno, me interesa saber más sobre los diseños Flash disponibles.'
    },
    'trilogia': {
      title: 'Trilogía de Línea',
      price: '$1,000',
      detail: 'La promo favorita de todos. Tres tatuajes minimalistas para una sola persona en una misma sesión.',
      requirements: [
        'Solo línea negra',
        'Tamaño: No mayor a 5 cm c/u',
        'Misma persona, misma sesión',
        'No incluye sombras ni rellenos sólidos'
      ],
      images: ['flash1.webp', 'flash1.1.webp'],
      whatsappMsg: 'Hola Eterno, me interesa la promoción Trilogía de Línea ($1,000) que vi en la web.'
    },
    'detalle': {
      title: 'Paquete Detalle',
      price: '$1,500',
      detail: 'Flash con detalles a sombra y puntillismo sencillos. Especializado en piezas con alto nivel de precisión.',
      requirements: [
        'Tamaño: No mayor a 5 cm',
        'Detalles a sombra y puntillismo sencillos',
        'Incluye diseño seleccionado del catálogo',
        'Ideal para antebrazo o pierna'
      ],
      image: 'flash 2.webp',
      whatsappMsg: 'Hola Eterno, me interesa la promoción Paquete de Detalle ($1,500) que vi en la web.'
    },
    'gemelas': {
      title: 'Almas Gemelas',
      price: '$1,200',
      detail: 'Comparte la experiencia con alguien especial. Un tatuaje para cada uno con un toque de sombra y detalle.',
      requirements: [
        '2 personas (1 tatuaje c/u)',
        'Tamaño: No mayor a 5 cm c/u',
        'Incluye sombras y detalles simples',
        'Deben acudir juntos a la cita'
      ],
      image: 'flash pareja.webp',
      whatsappMsg: 'Hola Eterno, me interesa la promoción Almas Gemelas ($1,200) que vi en la web.'
    }
  };

  window.openPromoModal = function(id) {
    const promo = promos[id];
    const modal = document.getElementById('promo-modal');
    const content = document.getElementById('promo-modal-content');
    if (!promo || !modal || !content) return;

    let mediaHtml = '';
    if (promo.images) {
      mediaHtml = `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.5rem;">
        ${promo.images.map(img => `<div style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);"><img src="${img}" style="width:100%; height:auto; display:block;"></div>`).join('')}
      </div>`;
    } else if (promo.image) {
      mediaHtml = `
        <div style="margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
          <img src="${promo.image}" alt="${promo.title}" style="width:100%; height:auto; display:block;">
        </div>
      `;
    }

    content.innerHTML = `
      <div style="text-align: center;">
        ${mediaHtml}
        <h2 style="font-family: 'Raven Hell Bold', sans-serif; color: #FABA20; font-size: 2.2rem; margin-bottom: 0.5rem; text-transform: uppercase;">${promo.title}</h2>
        <p style="color: #fff; font-size: 2.8rem; font-family: 'Bebas Neue', sans-serif; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 1rem;">${promo.price}</p>
        
        <p style="color: #ccc; line-height: 1.6; font-size: 1rem; margin-bottom: 2rem; text-align: left;">
          ${promo.detail}
        </p>

        <div style="text-align: left; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
          <h4 style="color: #FABA20; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 1rem;">REQUISITOS Y DETALLES</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
            ${promo.requirements.map(req => `
              <li style="display: flex; align-items: start; gap: 0.75rem; color: #ddd;">
                <span style="color: #FABA20;">•</span>
                <span>${req}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <a href="https://wa.me/526675819798?text=${encodeURIComponent(promo.whatsappMsg)}" target="_blank" 
           style="display: block; background: #FABA20; color: #000; text-decoration: none; padding: 1.2rem; border-radius: 12px; font-family: 'Raven Hell Bold', sans-serif; font-size: 1.3rem; transition: transform 0.3s ease;">
          AGENDAR POR WHATSAPP
        </a>
      </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  window.closePromoModal = () => {
    document.getElementById('promo-modal').style.display = 'none';
    document.body.style.overflow = '';
  };

  // --- PORTFOLIO & GALLERY ---
  let currentGalleryImages = [];
  let currentGalleryIndex = 0;
  let currentArtist = "";
  let currentStyle = "";

  const styleTriggers = document.querySelectorAll('.style-trigger');
  styleTriggers.forEach(t => {
    t.onclick = (e) => {
      e.preventDefault();
      if (!window.portfolioData) return;
      currentArtist = t.getAttribute('data-artist');
      currentStyle = t.getAttribute('data-style');
      const grid = document.getElementById('gallery-grid');
      currentGalleryImages = window.portfolioData[currentArtist]?.[currentStyle] || [];
      
      const sub = document.getElementById('gallery-subtitle');
      if(sub) sub.textContent = currentStyle.toUpperCase();

      if(grid) {
        grid.innerHTML = '';
        currentGalleryImages.forEach((s, idx) => {
          const it = document.createElement('div');
          it.className = 'gallery-item';
          it.innerHTML = `<img src="${s}" loading="lazy">`;
          it.onclick = () => openLightbox(idx);
          grid.appendChild(it);
        });
      }
      document.getElementById('gallery-modal')?.classList.add('active');
    };
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    const lb = document.getElementById('lightbox-modal');
    const track = document.getElementById('lightbox-track');
    
    if(track) {
      // Create the strip of all images
      track.style.display = 'flex';
      track.style.transition = 'none';
      track.innerHTML = currentGalleryImages.map(img => `
        <div style="flex: 0 0 100%; width: 100vw; display: flex; align-items: center; justify-content: center;">
          <img src="${img}" style="max-width: 95%; max-height: 80vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
        </div>
      `).join('');
      
      updateLightboxPos();
    }
    
    const cat = document.getElementById('lightbox-category');
    if(cat) cat.textContent = currentStyle.toUpperCase();
    updateQuoteBtn();
    
    if(lb) lb.classList.add('active');
  }

  function updateLightboxPos(offset = 0) {
    const track = document.getElementById('lightbox-track');
    if(track) {
      const baseTranslate = -currentGalleryIndex * 100;
      track.style.transform = `translateX(calc(${baseTranslate}% + ${offset}px))`;
    }
  }

  function updateQuoteBtn() {
    const qbtn = document.getElementById('btn-lightbox-quote');
    const imgUrl = currentGalleryImages[currentGalleryIndex];
    if(qbtn && imgUrl) {
      const msg = `Hola, me interesa este tatuaje de estilo ${currentStyle} de ${currentArtist}: ${window.location.origin}/${imgUrl}`;
      qbtn.href = `https://wa.me/526675819798?text=${encodeURIComponent(msg)}`;
    }
  }

  safeClick('prev-img', (e) => {
    if(e) e.stopPropagation();
    if(currentGalleryIndex > 0) {
      currentGalleryIndex--;
      const track = document.getElementById('lightbox-track');
      if(track) track.style.transition = 'transform 0.3s ease-out';
      updateLightboxPos();
      updateQuoteBtn();
    }
  });

  safeClick('next-img', (e) => {
    if(e) e.stopPropagation();
    if(currentGalleryIndex < currentGalleryImages.length - 1) {
      currentGalleryIndex++;
      const track = document.getElementById('lightbox-track');
      if(track) track.style.transition = 'transform 0.3s ease-out';
      updateLightboxPos();
      updateQuoteBtn();
    }
  });

  // Touch Support for Lightbox (Real-time strip following)
  let touchStartX = 0;
  let isDragging = false;
  const lbContent = document.getElementById('lightbox-content');
  const lbTrack = document.getElementById('lightbox-track');

  if(lbContent) {
    lbContent.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      isDragging = true;
      if(lbTrack) lbTrack.style.transition = 'none';
    }, {passive: true});

    lbContent.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX;
      updateLightboxPos(diff);
    }, {passive: true});

    lbContent.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      
      if(lbTrack) lbTrack.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.5, 0.3, 1)';
      
      if (diff > 80 && currentGalleryIndex > 0) {
        currentGalleryIndex--;
      } else if (diff < -80 && currentGalleryIndex < currentGalleryImages.length - 1) {
        currentGalleryIndex++;
      }
      
      updateLightboxPos();
      updateQuoteBtn();
    });
  }

  safeClick('close-gallery', () => document.getElementById('gallery-modal').classList.remove('active'));
  safeClick('close-lightbox', () => document.getElementById('lightbox-modal').classList.remove('active'));

  const lbModal = document.getElementById('lightbox-modal');
  if(lbModal) {
    lbModal.onclick = (e) => {
      if(e.target === lbModal) lbModal.classList.remove('active');
    };
  }

  // --- PREMIUM SLIDER ARROWS ---
  document.querySelectorAll('.slider-arrow').forEach(arrow => {
    arrow.onclick = () => {
      const targetId = arrow.getAttribute('data-target');
      const slider = document.getElementById(targetId);
      if (slider) {
        const scrollAmount = slider.offsetWidth * 0.8;
        slider.scrollBy({
          left: arrow.classList.contains('slider-arrow--next') ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        });
      }
    };
  });

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
