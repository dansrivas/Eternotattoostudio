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

// --- WIZARD COTIZADOR INTELIGENTE (VENTANA POR VENTANA) ---
  function initQuoteWizard() {
    const zoneDisplay = document.querySelector('#selected-zone-display .highlight');
    const zones = document.querySelectorAll('.zone');
    const flipBtn = document.getElementById('body-flip-btn');
    const bodyFlip = document.getElementById('body-flip');
    const flipLabel = document.getElementById('flip-label');
    
    const btnNext2 = document.getElementById('btn-next-step-2');
    const btnNext3 = document.getElementById('btn-next-step-3');
    const btnBack1 = document.getElementById('btn-back-step-1');
    const btnBack2 = document.getElementById('btn-back-step-2');

    const pane1 = document.getElementById('quote-pane-1');
    const pane2 = document.getElementById('quote-pane-2');
    const pane3 = document.getElementById('quote-pane-3');

    const ind1 = document.getElementById('qp-ind-1');
    const ind2 = document.getElementById('qp-ind-2');
    const ind3 = document.getElementById('qp-ind-3');

    const artistBtns = document.querySelectorAll('.artist-select-btn');

    let selectedZone = '';
    let selectedArtistName = 'Sin preferencia';
    let selectedArtistPhone = '526673276212'; // Número general del estudio para "Sin preferencia"

    // 0. Seleccionar Artista y actualizar su teléfono dinámico
    artistBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        artistBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedArtistName = btn.getAttribute('data-artist') || 'Sin preferencia';
        selectedArtistPhone = btn.getAttribute('data-phone') || '526673276212';
      });
    });

    // 1. Seleccionar Zona
    zones.forEach(zone => {
      zone.addEventListener('click', () => {
        zones.forEach(z => z.classList.remove('selected'));
        zone.classList.add('selected');
        selectedZone = zone.getAttribute('data-zone') || 'Indefinida';
        
        if (zoneDisplay) zoneDisplay.textContent = selectedZone;
        if (btnNext2) btnNext2.disabled = false;
      });
    });

    // Girar Cuerpo
    if (flipBtn && bodyFlip) {
      let isBack = false;
      flipBtn.addEventListener('click', () => {
        isBack = !isBack;
        bodyFlip.classList.toggle('flipped', isBack);
        if (flipLabel) flipLabel.textContent = isBack ? 'Ver frente' : 'Ver espalda';
      });
    }

    // Slider de Tamaño
    const sizeSlider = document.getElementById('size-slider');
    const sizeCmDisplay = document.getElementById('size-cm-display');
    const sizeRefDisplay = document.getElementById('size-ref-display');

    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        let refText = '≈ Tamaño de una moneda';

        if (val > 5 && val <= 10) refText = '≈ Tamaño de una tarjeta';
        else if (val > 10 && val <= 20) refText = '≈ Tamaño de una mano';
        else if (val > 20 && val <= 30) refText = '≈ Tamaño de una hoja';
        else if (val > 30) refText = '≈ Pieza grande / Completa';

        if (sizeCmDisplay) sizeCmDisplay.textContent = `${val} cm`;
        if (sizeRefDisplay) sizeRefDisplay.textContent = refText;
      });
    }

    const ideaTextArea = document.getElementById('idea-description');

    // --- NAVEGACIÓN PASO A PASO ---
    if (btnNext2) {
      btnNext2.addEventListener('click', () => {
        if (!selectedZone) return;
        if (pane1) pane1.style.display = 'none';
        if (pane2) pane2.style.display = 'block';
        if (ind1) { ind1.classList.remove('active'); ind1.classList.add('completed'); }
        if (ind2) ind2.classList.add('active');
      });
    }

    if (btnBack1) {
      btnBack1.addEventListener('click', () => {
        if (pane2) pane2.style.display = 'none';
        if (pane1) pane1.style.display = 'block';
        if (ind2) ind2.classList.remove('active');
        if (ind1) { ind1.classList.remove('completed'); ind1.classList.add('active'); }
      });
    }

    if (btnNext3) {
      btnNext3.addEventListener('click', () => {
        if (pane2) pane2.style.display = 'none';
        if (pane3) pane3.style.display = 'block';
        if (ind2) { ind2.classList.remove('active'); ind2.classList.add('completed'); }
        if (ind3) ind3.classList.add('active');

        // Actualizar resumen
        const summaryArtist = document.getElementById('summary-artist');
        const summaryZone = document.getElementById('summary-zone');
        const summarySize = document.getElementById('summary-size');
        const summaryIdea = document.getElementById('summary-idea');

        if (summaryArtist) summaryArtist.textContent = selectedArtistName;
        if (summaryZone) summaryZone.textContent = selectedZone || 'No elegida';
        if (summarySize) summarySize.textContent = `${sizeSlider ? sizeSlider.value : '5'} cm (${sizeRefDisplay ? sizeRefDisplay.textContent : ''})`;
        if (summaryIdea) {
          summaryIdea.textContent = (ideaTextArea && ideaTextArea.value.trim()) ? ideaTextArea.value.trim() : 'Tengo imagen de referencia para enviar';
        }
      });
    }

    if (btnBack2) {
      btnBack2.addEventListener('click', () => {
        if (pane3) pane3.style.display = 'none';
        if (pane2) pane2.style.display = 'block';
        if (ind3) ind3.classList.remove('active');
        if (ind2) { ind2.classList.remove('completed'); ind2.classList.add('active'); }
      });
    }

    // Envío a WhatsApp con número dinámico según artista
    const btnWhats = document.getElementById('btn-whatsapp');
    if (btnWhats) {
      btnWhats.addEventListener('click', (e) => {
        e.preventDefault();
        const sizeVal = sizeSlider ? sizeSlider.value : '5';
        const ideaText = (ideaTextArea && ideaTextArea.value.trim()) ? ideaTextArea.value.trim() : '';

        let text = `¡Hola! Me gustaría cotizar un tatuaje en Eterno Tattoo Studio.\n\n`;
        text += `🎨 *Artista preferido:* ${selectedArtistName}\n`;
        text += `📍 *Zona:* ${selectedZone}\n`;
        text += `📏 *Tamaño:* ${sizeVal} cm\n`;
        if (ideaText) text += `💡 *Idea:* ${ideaText}\n`;
        else text += `💡 *Idea:* Te enviaré mi imagen de referencia por aquí.\n`;

        window.open(`https://wa.me/${selectedArtistPhone}?text=${encodeURIComponent(text)}`, '_blank');
      });
    }
  }

  // Inicializar cotizador
  initQuoteWizard();

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
        'Tamaño: No mayor a 6 cm',
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
        'Tamaño: No mayor a 6 cm c/u',
        'Misma persona, misma sesión',
        'No incluye sombras ni rellenos sólidos'
      ],
      images: ['flash1.webp', 'flash1.1.webp'],
      whatsappMsg: 'Hola Eterno, me interesa la promoción Trilogía de Línea ($1,000) que vi en la web.'
    },
    'detalle': {
      title: 'Paquete Detalle',
      price: '$1,500',
      detail: '3 Tatuajes Flash con detalles a sombra y puntillismo sencillos.',
      requirements: [
        'Tamaño: No mayor a 6 cm',
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
      detail: 'Comparte la experiencia con alguien especial. Un tatuaje para cada uno con un toque de sombra y detalle. (puede ser para la misma persona también)',
      requirements: [
        '2 personas (1 tatuaje c/u)',
        'Tamaño: No mayor a 6 cm c/u',
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
      track.style.display = 'flex';
      track.style.transition = 'none';
      renderLightboxWindow();
    }
    
    const cat = document.getElementById('lightbox-category');
    if(cat) cat.textContent = currentStyle.toUpperCase();
    updateQuoteBtn();
    
    if(lb) lb.classList.add('active');
  }

  function renderLightboxWindow() {
    const track = document.getElementById('lightbox-track');
    if(!track) return;

    const windowSize = 2;
    const start = Math.max(0, currentGalleryIndex - windowSize);
    const end = Math.min(currentGalleryImages.length - 1, currentGalleryIndex + windowSize);

    track.innerHTML = currentGalleryImages.map((img, idx) => {
      if (idx < start || idx > end) {
        return `<div style="flex: 0 0 100%; width: 100vw;"></div>`;
      }
      return `
        <div style="flex: 0 0 100%; width: 100vw; display: flex; align-items: center; justify-content: center;">
          <img src="${img}" style="max-width: 95%; max-height: 80vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
        </div>
      `;
    }).join('');
    
    updateLightboxPos();
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
      renderLightboxWindow();
      updateQuoteBtn();
    }
  });

  safeClick('next-img', (e) => {
    if(e) e.stopPropagation();
    if(currentGalleryIndex < currentGalleryImages.length - 1) {
      currentGalleryIndex++;
      const track = document.getElementById('lightbox-track');
      if(track) track.style.transition = 'transform 0.3s ease-out';
      renderLightboxWindow();
      updateQuoteBtn();
    }
  });

  // Touch Support for Lightbox
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
      
      const threshold = 60;
      if (diff > threshold && currentGalleryIndex > 0) {
        currentGalleryIndex--;
      } else if (diff < -threshold && currentGalleryIndex < currentGalleryImages.length - 1) {
        currentGalleryIndex++;
      }
      
      renderLightboxWindow();
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