import './simple-lightbox-gallery.css';

export default class LightboxGallery {
  constructor(options = {}) {
    this.options = {
      containerClass: options.containerClass || 'gallery',
      lightboxClass: options.lightboxClass || 'lightbox',
      closeButton: options.closeButton || '×',
      prevButton: options.prevButton || '❮',
      nextButton: options.nextButton || '❯',
      animation: options.animation || 'fade',
      animationSpeed: options.animationSpeed || 300,
      infinite: options.infinite !== undefined ? options.infinite : true,
      showThumbnails: options.showThumbnails !== undefined ? options.showThumbnails : false,
      showCaption: options.showCaption !== undefined ? options.showCaption : true,
      captionPosition: options.captionPosition || 'bottom',
      overlayColor: options.overlayColor || 'rgba(0, 0, 0, 0.9)',
      zoomEnabled: options.zoomEnabled !== undefined ? options.zoomEnabled : true,
      zoomLevel: options.zoomLevel || 1.5,
      fullscreen: options.fullscreen !== undefined ? options.fullscreen : true,
      swipeEnabled: options.swipeEnabled !== undefined ? options.swipeEnabled : true,
      slideshow: options.slideshow !== undefined ? options.slideshow : false,
      slideshowSpeed: options.slideshowSpeed || 3000,
      ariaLabels: {
        gallery: options.ariaLabels?.gallery || 'Image gallery',
        lightbox: options.ariaLabels?.lightbox || 'Image lightbox',
        close: options.ariaLabels?.close || 'Close lightbox',
        next: options.ariaLabels?.next || 'Next image',
        prev: options.ariaLabels?.prev || 'Previous image',
        zoom: options.ariaLabels?.zoom || 'Toggle zoom',
        fullscreen: options.ariaLabels?.fullscreen || 'Toggle fullscreen',
        slideshow: options.ariaLabels?.slideshow || 'Toggle slideshow',
        ...options.ariaLabels
      }
    };

    this.currentImageIndex = 0;
    this.images = [];
    this.isZoomed = false;
    this.slideshowInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.createLightbox();
    this.setupGallery();
    this.setupEventListeners();
    this.setupAccessibility();
  }

  createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = this.options.lightboxClass;
    lightbox.style.backgroundColor = this.options.overlayColor;

    const controls = `
      <button class="close" aria-label="${this.options.ariaLabels.close}">${this.options.closeButton}</button>
      <button class="prev" aria-label="${this.options.ariaLabels.prev}">${this.options.prevButton}</button>
      <button class="next" aria-label="${this.options.ariaLabels.next}">${this.options.nextButton}</button>
      ${this.options.fullscreen ? `<button class="fullscreen" aria-label="${this.options.ariaLabels.fullscreen}">⛶</button>` : ''}
      ${this.options.slideshow ? `<button class="slideshow-toggle" aria-label="${this.options.ariaLabels.slideshow}">▶</button>` : ''}
      ${this.options.zoomEnabled ? `<button class="zoom" aria-label="${this.options.ariaLabels.zoom}">🔍</button>` : ''}
    `;

    const content = `
      <div class="lightbox-content">
        <img src="" alt="" role="img" tabindex="0">
        ${this.options.showCaption ? '<div class="caption" role="text"></div>' : ''}
      </div>
    `;

    lightbox.innerHTML = controls + content;

    if (this.options.showThumbnails) {
      lightbox.innerHTML += '<div class="thumbnails-panel" role="tablist"></div>';
    }

    document.body.appendChild(lightbox);
  }

  setupGallery() {
    const container = document.querySelector(`.${this.options.containerClass}`);
    if (!container) return;

    this.images = Array.from(container.getElementsByTagName('img'));

    this.images.forEach((img, index) => {
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', `Open image ${index + 1}${img.alt ? ': ' + img.alt : ''}`);

      img.addEventListener('click', () => this.openLightbox(index));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(index);
        }
      });
    });

    if (this.options.showThumbnails) {
      this.createThumbnailsPanel();
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    if (this.options.swipeEnabled) {
      const lightbox = document.querySelector(`.${this.options.lightboxClass}`);
      lightbox.addEventListener('touchstart', (e) => this.handleTouchStart(e));
      lightbox.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    this.setupControlListeners();
  }

  setupControlListeners() {
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);

    const controls = {
      '.close': () => this.closeLightbox(),
      '.prev': () => this.prevImage(),
      '.next': () => this.nextImage(),
      '.fullscreen': () => this.toggleFullscreen(),
      '.zoom': () => this.toggleZoom(),
      '.slideshow-toggle': () => this.toggleSlideshow()
    };

    Object.entries(controls).forEach(([selector, handler]) => {
      const element = lightbox.querySelector(selector);
      if (element) {
        element.addEventListener('click', handler);
      }
    });
  }

  setupAccessibility() {
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);

    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', this.options.ariaLabels.lightbox);

    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.className = 'lightbox-announcer';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    Object.assign(liveRegion.style, {
      position: 'absolute',
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: '1px',
      width: '1px',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    });

    document.body.appendChild(liveRegion);
  }

  openLightbox(index) {
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);
    this.currentImageIndex = index;
    this.showImage(index);
    lightbox.style.display = 'flex';
    this.trapFocus();
  }

  closeLightbox() {
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);
    lightbox.style.display = 'none';
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
      this.slideshowInterval = null;
    }
  }

  showImage(index) {
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const caption = lightbox.querySelector('.caption');
    const currentImage = this.images[index];

    if (this.options.animation === 'fade') {
      lightboxImg.style.opacity = 0;
      setTimeout(() => {
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxImg.style.opacity = 1;
      }, this.options.animationSpeed / 2);
    } else {
      lightboxImg.src = currentImage.src;
      lightboxImg.alt = currentImage.alt;
    }

    if (caption && this.options.showCaption) {
      caption.textContent = currentImage.alt;
    }

    this.announceImageChange(index);
    this.updateThumbnails();
  }

  prevImage() {
    if (!this.options.infinite && this.currentImageIndex === 0) return;

    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.showImage(this.currentImageIndex);
  }

  nextImage() {
    if (!this.options.infinite && this.currentImageIndex === this.images.length - 1) return;

    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.showImage(this.currentImageIndex);
  }

  toggleZoom() {
    const lightboxImg = document.querySelector(`.${this.options.lightboxClass} .lightbox-content img`);
    this.isZoomed = !this.isZoomed;

    if (this.isZoomed) {
      lightboxImg.style.transform = `scale(${this.options.zoomLevel})`;
      lightboxImg.style.cursor = 'move';
    } else {
      lightboxImg.style.transform = 'scale(1)';
      lightboxImg.style.cursor = 'default';
    }
  }

  toggleFullscreen() {
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);

    if (!document.fullscreenElement) {
      lightbox.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  toggleSlideshow() {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
      this.slideshowInterval = null;
    } else {
      this.slideshowInterval = setInterval(() => {
        this.nextImage();
      }, this.options.slideshowSpeed);
    }

    const button = document.querySelector(`.${this.options.lightboxClass} .slideshow-toggle`);
    button.textContent = this.slideshowInterval ? '⏸' : '▶';
  }

  handleKeyPress(e) {
    if (!document.querySelector(`.${this.options.lightboxClass}`).style.display === 'flex') return;

    const keyActions = {
      'Escape': () => this.closeLightbox(),
      'ArrowLeft': () => this.prevImage(),
      'ArrowRight': () => this.nextImage(),
      'f': () => this.toggleFullscreen(),
      ' ': (e) => {
        e.preventDefault();
        this.toggleSlideshow();
      },
      'z': () => this.toggleZoom()
    };

    const action = keyActions[e.key];
    if (action) action(e);
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    const difference = this.touchStartX - this.touchEndX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
    }
  }

  createThumbnailsPanel() {
    const panel = document.querySelector(`.${this.options.lightboxClass} .thumbnails-panel`);
    if (!panel) return;

    this.images.forEach((img, index) => {
      const thumb = document.createElement('button');
      thumb.className = 'thumbnail';
      thumb.setAttribute('role', 'tab');
      thumb.setAttribute('aria-label', `View image ${index + 1}`);

      const thumbImg = document.createElement('img');
      thumbImg.src = img.src;
      thumbImg.alt = '';
      thumbImg.setAttribute('loading', 'lazy');

      thumb.appendChild(thumbImg);
      thumb.addEventListener('click', () => this.showImage(index));
      panel.appendChild(thumb);
    });
  }

  updateThumbnails() {
    const thumbnails = document.querySelectorAll(`.${this.options.lightboxClass} .thumbnail`);
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === this.currentImageIndex);
      thumb.setAttribute('aria-selected', index === this.currentImageIndex);
    });
  }

  announceImageChange(index) {
    const announcer = document.querySelector('.lightbox-announcer');
    if (!announcer) return;

    const total = this.images.length;
    const current = index + 1;
    const imageAlt = this.images[index].alt;

    const announcement = `Image ${current} of ${total}${imageAlt ? ': ' + imageAlt : ''}`;
    announcer.textContent = announcement;
  }

  trapFocus() {
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);
    const focusableElements = lightbox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    lightbox.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });

    firstFocusable.focus();
  }

  destroy() {
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeyPress);

    // Clear intervals
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
    }

    // Remove DOM elements
    const lightbox = document.querySelector(`.${this.options.lightboxClass}`);
    const announcer = document.querySelector('.lightbox-announcer');

    if (lightbox) lightbox.remove();
    if (announcer) announcer.remove();
  }
}