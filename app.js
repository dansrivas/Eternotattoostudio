/**
 * ETERNO TATTOO STUDIO - MAIN APPLICATION
 * Refactored for maximum performance and fluid UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("Eterno App: Initializing core systems...");

  // --- COTIZADOR SELECTION LOGIC ---
  const methodOptions = document.querySelectorAll('.method-option');
  const quoteSections = document.querySelectorAll('.quote-method-section');
  
  if (methodOptions.length > 0) {
    methodOptions.forEach(option => {
      option.addEventListener('click', () => {
        const target = option.getAttribute('data-target');
        
        // Update UI selection
        methodOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Show target section
        quoteSections.forEach(section => {
          section.style.display = 'none';
          section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`method-${target}`);
        if (targetSection) {
          targetSection.style.display = 'block';
          // Trigger the simulator if selected
          if (target === 'ar') {
            openSimulator();
          }
        }
      });
    });
  }

  // --- DYNAMIC LOADER FOR SIMULATOR ---
  let isSimulatorLoaded = false;
  const simOverlay = document.getElementById('simulator-overlay');

  window.openSimulator = function() {
    if (!simOverlay) return;
    
    // Show overlay immediately (with a loading state if needed)
    simOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (!isSimulatorLoaded) {
      console.log("Loading AR Simulator module...");
      const script = document.createElement('script');
      script.src = 'simulator.js?v=1.0';
      script.onload = () => {
        isSimulatorLoaded = true;
        if (window.initSimulator) {
          window.initSimulator();
        }
      };
      document.head.appendChild(script);
    }
  };

  window.closeSimulator = function() {
    if (!simOverlay) return;
    simOverlay.style.display = 'none';
    document.body.style.overflow = '';
  };

  const btnCloseSim = document.querySelector('.btn-close-immersive');
  if (btnCloseSim) {
    btnCloseSim.addEventListener('click', closeSimulator);
  }

  // Handle the main "Abrir Simulador" button in the Cotizador section
  const btnSelectSimulator = document.getElementById('btn-select-simulator');
  if (btnSelectSimulator) {
    btnSelectSimulator.addEventListener('click', openSimulator);
  }

  // --- GIFT CARD GENERATOR ---
  const canvasGift = document.getElementById('gift-card-canvas');
  if (canvasGift) {
    const ctxGift = canvasGift.getContext('2d');
    const inputName = document.getElementById('card-name');
    const inputAmount = document.getElementById('card-amount');
    const bgThumbnails = document.querySelectorAll('.bg-thumbnail');
    const btnDownloadGift = document.getElementById('download-card');
    
    let currentBg = new Image();
    currentBg.crossOrigin = "anonymous";
    currentBg.src = 'tarjeta_definitiva.webp'; 
    
    currentBg.onload = drawGiftCard;
    
    function drawGiftCard() {
      ctxGift.clearRect(0, 0, canvasGift.width, canvasGift.height);
      ctxGift.drawImage(currentBg, 0, 0, canvasGift.width, canvasGift.height);
      
      // Amount
      ctxGift.fillStyle = '#FABA20';
      ctxGift.font = 'bold 60px sans-serif';
      ctxGift.textAlign = 'right';
      ctxGift.fillText(`$${inputAmount.value || '0'}`, canvasGift.width - 80, 120);
      
      // Name
      ctxGift.fillStyle = '#FFFFFF';
      ctxGift.font = 'italic 45px serif';
      ctxGift.textAlign = 'left';
      ctxGift.fillText(inputName.value || 'Tu Nombre Aquí', 100, canvasGift.width === 1080 ? 820 : 540);
    }
    
    inputName.addEventListener('input', drawGiftCard);
    inputAmount.addEventListener('input', drawGiftCard);
    
    bgThumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        bgThumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        currentBg.src = thumb.getAttribute('data-src');
        currentBg.onload = drawGiftCard;
      });
    });
    
    if (btnDownloadGift) {
      btnDownloadGift.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'tarjeta-regalo-eterno.png';
        link.href = canvasGift.toDataURL('image/png');
        link.click();
      });
    }
  }

  // --- PORTFOLIO GALLERY MODAL LOGIC ---
  const styleTriggers = document.querySelectorAll('.style-trigger');
  const galleryModal = document.getElementById('gallery-modal');
  const closeGallery = document.getElementById('close-gallery');
  const galleryTitle = document.getElementById('gallery-title');
  const gallerySubtitle = document.getElementById('gallery-subtitle');
  const galleryGrid = document.getElementById('gallery-grid');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxTrack = document.getElementById('lightbox-track');
  const lightboxCategory = document.getElementById('lightbox-category');
  const btnLightboxQuote = document.getElementById('btn-lightbox-quote');
  const closeLightbox = document.getElementById('close-lightbox');
  const prevBtn = document.getElementById('prev-img');
  const nextBtn = document.getElementById('next-img');

  let currentGalleryImages = [];
  let currentCategory = "";
  let currentIndex = 0;

  function populateLightboxTrack() {
    if (!lightboxTrack) return;
    lightboxTrack.innerHTML = '';
    currentGalleryImages.forEach((imgSrc, index) => {
      const slide = document.createElement('div');
      slide.className = 'lightbox-slide';
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = `Tatuaje ${index + 1}`;
      img.loading = "lazy";
      slide.appendChild(img);
      lightboxTrack.appendChild(slide);
    });
  }

  function updateLightboxContent() {
    if (!lightboxTrack || !lightboxCategory || !btnLightboxQuote) return;
    const offset = currentIndex * 100;
    lightboxTrack.style.transform = `translateX(-${offset}%)`;
    if (prevBtn) currentIndex === 0 ? prevBtn.classList.add('lightbox-btn--hidden') : prevBtn.classList.remove('lightbox-btn--hidden');
    if (nextBtn) currentIndex === currentGalleryImages.length - 1 ? nextBtn.classList.add('lightbox-btn--hidden') : nextBtn.classList.remove('lightbox-btn--hidden');
    lightboxCategory.textContent = currentCategory.toUpperCase();
    const imgSrc = currentGalleryImages[currentIndex];
    const phone = "526675819798";
    const pageUrl = window.location.href.split('#')[0];
    const fullImgUrl = pageUrl.substring(0, pageUrl.lastIndexOf('/') + 1) + imgSrc;
    const msg = `Hola Eterno, me interesa cotizar un tatuaje de la categoría [${currentCategory}] usando esta imagen de referencia: ${fullImgUrl}`;
    btnLightboxQuote.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  function openLightbox(index, category) {
    currentIndex = index;
    currentCategory = category;
    populateLightboxTrack();
    updateLightboxContent();
    lightboxModal.classList.add('active');
  }

  function closeLightboxFunc() {
    if (!lightboxModal) return;
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
    if (galleryItems && galleryItems[currentIndex]) {
      galleryItems[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    lightboxModal.classList.remove('active');
  }

  if (lightboxModal) {
    closeLightbox.addEventListener('click', closeLightboxFunc);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); if (currentIndex > 0) { currentIndex--; updateLightboxContent(); } });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); if (currentIndex < currentGalleryImages.length - 1) { currentIndex++; updateLightboxContent(); } });
    lightboxModal.addEventListener('click', (e) => { if(e.target === lightboxModal || e.target.id === 'lightbox-content') closeLightboxFunc(); });
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'Escape') closeLightbox.click();
    });
  }

  // --- GALLERY MODAL TRIGGER ---
  if (galleryModal) {
    styleTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const artist = trigger.getAttribute('data-artist');
        const style = trigger.getAttribute('data-style');
        
        // Ensure portfolio data is available
        if (!window.portfolioData) {
           console.warn("Portfolio data not yet loaded. Ensure portfolio-data.js is linked.");
           return;
        }

        const galleryScrollRoot = document.getElementById('gallery-modal-content');
        galleryTitle.textContent = style.toUpperCase();
        gallerySubtitle.textContent = artist;
        galleryGrid.innerHTML = '';
        currentGalleryImages = window.portfolioData[artist]?.[style] || [];

        if (window._galleryObserver) window._galleryObserver.disconnect();
        window._galleryObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target.querySelector('img[data-src]');
              if (img) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.onload = () => { entry.target.classList.remove('loading'); img.style.opacity = '1'; };
              }
              window._galleryObserver.unobserve(entry.target);
            }
          });
        }, { root: galleryScrollRoot, rootMargin: '300px 0px', threshold: 0.01 });

        function createGalleryItem(imgSrc, index, immediate) {
          const item = document.createElement('div');
          item.className = 'gallery-item loading';
          const img = document.createElement('img');
          if (immediate) { img.src = imgSrc; img.onload = () => { item.classList.remove('loading'); img.style.opacity = '1'; }; }
          else { img.dataset.src = imgSrc; }
          img.alt = `${style} ${index + 1}`;
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity 0.35s ease;';
          item.appendChild(img);
          item.addEventListener('click', () => openLightbox(index, style));
          if (!immediate) window._galleryObserver.observe(item);
          return item;
        }

        if (currentGalleryImages.length > 0) {
          const CHUNK = 12;
          const firstBatch = currentGalleryImages.slice(0, CHUNK);
          firstBatch.forEach((src, i) => galleryGrid.appendChild(createGalleryItem(src, i, true)));
          let rendered = CHUNK;
          function renderNextChunk() {
            if (rendered >= currentGalleryImages.length) return;
            const end = Math.min(rendered + CHUNK, currentGalleryImages.length);
            for (let i = rendered; i < end; i++) galleryGrid.appendChild(createGalleryItem(currentGalleryImages[i], i, false));
            rendered = end;
            if (rendered < currentGalleryImages.length) requestAnimationFrame(renderNextChunk);
          }
          requestAnimationFrame(renderNextChunk);
        } else {
          for(let i = 1; i <= 6; i++) galleryGrid.innerHTML += `<div class="gallery-placeholder">Foto PENDIENTE</div>`;
        }

        galleryModal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    closeGallery.addEventListener('click', () => { galleryModal.classList.remove('active'); document.body.classList.remove('modal-open'); });
  }

  // --- SLIDER PAGINATION ---
  function initSliderPagination(sliderId, dotsId) {
    const slider = document.getElementById(sliderId);
    const dotsContainer = document.getElementById(dotsId);
    if (!slider || !dotsContainer) return;
    const items = slider.querySelectorAll('.slider-item');
    if (items.length === 0) return;
    dotsContainer.innerHTML = '';
    items.forEach((item, index) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const centerOffset = item.offsetLeft - slider.offsetLeft - (slider.clientWidth / 2) + (item.clientWidth / 2);
        slider.scrollTo({ left: centerOffset, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');
    const observer = new IntersectionObserver((entries) => {
      const intersecting = entries.filter(e => e.isIntersecting);
      if (intersecting.length > 0) {
        let mainEntry = intersecting[0];
        intersecting.forEach(e => { if (e.intersectionRatio > mainEntry.intersectionRatio) mainEntry = e; });
        const index = Array.from(items).indexOf(mainEntry.target);
        if (index !== -1) { dots.forEach(d => d.classList.remove('active')); if (dots[index]) dots[index].classList.add('active'); }
      }
    }, { root: slider, threshold: 0.1, rootMargin: '0px -40% 0px -40%' });
    items.forEach(item => observer.observe(item));
  }
  initSliderPagination('dans-slider', 'dans-dots');
  initSliderPagination('salem-slider', 'salem-dots');

  // --- MOBILE MENU ---
  const hbMenu = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.navbar__links');
  if (hbMenu && navLinks) {
    hbMenu.addEventListener('click', () => {
      hbMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    document.querySelectorAll('.navbar__links a').forEach(link => {
      link.addEventListener('click', () => { hbMenu.classList.remove('active'); navLinks.classList.remove('active'); document.body.style.overflow = ''; });
    });
  }

  // --- PROMOCIONES MODAL ---
  const promos = {
    'flash': {
      title: '¿Qué es un Flash?',
      detail: 'Los diseños Flash son piezas listas para ser tatuadas. Pueden ser diseños originales creados por nuestros artistas o también diseños seleccionados de internet (ya hechos) que están disponibles para una sesión rápida.',
      requirements: [
        'Diseños del artista o de catálogo (internet)',
        'Listos para tatuar sin modificaciones',
        'Tamaño predeterminado (ajustable levemente)',
        'Precio especial por ser diseño de catálogo'
      ],
      images: ['exampleflash.webp'],
      whatsappMsg: 'Hola Eterno, me interesa saber más sobre los diseños Flash que vi en la web.'
    },
    'trilogia': {
      title: 'Trilogía de Línea',
      price: '$1,000',
      detail: 'Llévate 3 mini tattoos por un precio increíble. Perfecto para esos detalles minimalistas que siempre has querido.',
      requirements: ['3 mini tattoos de hasta 5cm c/u', 'Válido para una sola persona', 'Estilo Fine Line (solo línea)', 'Zonas simples (brazos, piernas, hombros)'],
      images: ['flash1.webp', 'flash1.1.webp'],
      whatsappMsg: 'Hola Eterno, me interesa la promoción Trilogía de Línea ($1,000) que vi en la web.'
    },
    'detalle': {
      title: 'Paquete de Detalle',
      price: '$1,500',
      detail: 'Sube de nivel tus mini tattoos con sombras y texturas detalladas. Ideal para micro-realismo o puntillismo.',
      requirements: ['3 mini tattoos de hasta 5cm c/u', 'Válido para una sola persona', 'Incluye sombras y puntillismo', 'Diseños con mayor complejidad'],
      images: ['flash 2.webp'],
      whatsappMsg: 'Hola Eterno, me interesa la promoción Paquete de Detalle ($1,500) que vi en la web.'
    },
    'gemelas': {
      title: 'Almas Gemelas',
      price: '$1,200',
      detail: 'Comparte la experiencia con alguien especial. Un tatuaje para cada uno con un toque de sombra y detalle.',
      requirements: ['2 personas (1 tatuaje c/u)', 'Diseños de hasta 6cm c/u', 'Incluye sombras y detalles simples', 'Deben acudir juntos a la cita'],
      images: ['flash pareja.webp'],
      whatsappMsg: 'Hola Eterno, me interesa la promoción Almas Gemelas ($1,200) que vi en la web.'
    }
  };

  const promoModal = document.getElementById('promo-modal');
  const promoModalContent = document.getElementById('promo-modal-content');

  window.openPromoModal = function(id) {
    const promo = promos[id];
    if (!promo || !promoModal || !promoModalContent) return;
    let mediaHtml = '';
    if (promo.images && Array.isArray(promo.images)) {
      mediaHtml = `<div style="position: relative; margin: 1.5rem 0;"><div id="promo-carousel-track" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; border-radius: 12px;">${promo.images.map(img => `<div style="flex: 0 0 100%; scroll-snap-align: center; display: flex; align-items: center; justify-content: center; background: #000;"><img src="${img}" alt="${promo.title}" style="width: 100%; height: auto; max-height: 500px; object-fit: contain;"></div>`).join('')}</div>${promo.images.length > 1 ? `<button onclick="scrollPromoCarousel(-1)" style="position: absolute; left: 0.5rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; z-index: 10;"><i data-lucide="chevron-left"></i></button><button onclick="scrollPromoCarousel(1)" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; z-index: 10;"><i data-lucide="chevron-right"></i></button>` : ''}</div>`;
    }
    promoModalContent.innerHTML = `<div style="text-align: center;"><h2 style="font-family: 'Raven Hell Bold'; font-size: 3rem; color: #fff;">${promo.title}</h2>${promo.price ? `<p style="color: #FABA20; font-size: 2rem;">${promo.price}</p>` : ''}<p style="color: #ccc;">${promo.detail}</p></div>${mediaHtml}<div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px;"><h4 style="color: #fff; display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="check-circle" style="color: #FABA20;"></i> Requisitos</h4><ul style="list-style: none; padding: 0;">${promo.requirements.map(req => `<li style="color: #ddd;">• ${req}</li>`).join('')}</ul></div><a href="https://wa.me/526675819798?text=${encodeURIComponent(promo.whatsappMsg)}" target="_blank" style="background: #FABA20; color: #000; font-family: 'Raven Hell Bold'; font-size: 1.5rem; padding: 1rem; border-radius: 12px; text-align: center; text-decoration: none; display: block; margin-top: 1rem;">AGENDAR WHATSAPP</a>`;
    promoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  };

  window.closePromoModal = function() { if (promoModal) { promoModal.style.display = 'none'; document.body.style.overflow = ''; } };
  if (promoModal) promoModal.addEventListener('click', (e) => { if (e.target === promoModal) closePromoModal(); });
  window.scrollPromoCarousel = function(dir) { const track = document.getElementById('promo-carousel-track'); if (track) track.scrollBy({ left: dir * track.offsetWidth, behavior: 'smooth' }); };

  // CLIPBOARD
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    if (!text || btn.classList.contains('copied')) return;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      const label = btn.querySelector('span');
      if (label) label.textContent = "¡Copiado!";
      setTimeout(() => { btn.classList.remove('copied'); if (label) label.textContent = "Copiar número"; }, 1500);
    });
  });

  if (window.lucide) window.lucide.createIcons();
  console.log("Eterno App: Core initialized.");
});
