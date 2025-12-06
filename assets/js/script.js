/* ============================
   NAVBAR SCROLL BEHAVIOR
============================ */
let lastScroll = 0;
const navbar = document.querySelector(".navbar");
let isScrolling;

window.addEventListener("scroll", () => {
    const current = window.scrollY;

    clearTimeout(isScrolling);

    if (current > lastScroll && current > 80) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    lastScroll = current;

    isScrolling = setTimeout(() => {
        lastScroll = window.scrollY;
    }, 80);
});

window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    const topNav = document.querySelector(".top-nav");

    if (window.scrollY === 0) {
        navbar.classList.remove("scrolled");
        topNav.style.opacity = "1";
        topNav.style.height = "auto";
        topNav.style.pointerEvents = "auto";
        topNav.style.transform = "translateY(0)";
    } else {
        navbar.classList.add("scrolled");
        topNav.style.opacity = "0";
        topNav.style.height = "0";
        topNav.style.pointerEvents = "none";
        topNav.style.transform = "translateY(-20px)";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    (function marqueeFix() {
      const root = document.documentElement;
      const marqueeContent = document.querySelector(".marquee-content");
      if (!marqueeContent || marqueeContent.dataset.initialized === "true") return;
      marqueeContent.dataset.initialized = "true";
      const originalItems = Array.from(marqueeContent.children);
      root.style.setProperty("--marquee-elements", originalItems.length);
      for (let i = 0; i < 5; i++) originalItems.forEach(it => marqueeContent.appendChild(it.cloneNode(true)));
      requestAnimationFrame(() => root.style.setProperty("--marquee-elements", marqueeContent.children.length));
    })();
});

/* ============================
   MARQUEE FIX FOR CLONED ITEMS
============================ */

/* ============================
   PRODUCT SHOWCASE LIGHTBOX
============================ */
document.addEventListener('DOMContentLoaded', function () {
  const productCards = document.querySelectorAll('.product-card');
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-overlay';
  lightboxOverlay.innerHTML = `
    <div class="lightbox-container">
      <img class="lightbox-image" src="" alt="">
      <button class="lightbox-icon lightbox-close" title="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button class="lightbox-icon lightbox-zoom" title="Zoom">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <line x1="13" y1="9" x2="9" y2="13"></line>
        </svg>
      </button>
      <button class="lightbox-icon lightbox-prev" title="Previous">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>
      <button class="lightbox-icon lightbox-next" title="Next">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  let currentIndex = 0;
  let isFullscreen = false;

  let zoomLevel = 1;
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 2.5;

  let isDragging = false;
  let startX, startY;
  let translateX = 0, translateY = 0;
  let velocityX = 0, velocityY = 0;

  const img = () => lightboxOverlay.querySelector('.lightbox-image');

  /* ================= OPEN LIGHTBOX ================= */
  productCards.forEach((card, index) => {
    card.addEventListener('click', function () {
      currentIndex = index;
      const images = card.dataset.images
        ? card.dataset.images.split(',')
        : [card.querySelector('.primary-img').src];
      openLightbox(images[0]);
    });
  });

function openLightbox(src) {
  const image = img();
  image.style.transform = 'scale(1) translate(0,0)';
  image.src = src;
  lightboxOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  resetZoom();
}


  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
    exitFullscreen();
  }

  lightboxOverlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', e => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  /* ================= NAVIGATION ================= */
  function showPrev() {
    currentIndex = (currentIndex - 1 + productCards.length) % productCards.length;
    const images = productCards[currentIndex].dataset.images.split(',');
    openLightbox(images[0]);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % productCards.length;
    const images = productCards[currentIndex].dataset.images.split(',');
    openLightbox(images[0]);
  }

  lightboxOverlay.querySelector('.lightbox-prev').addEventListener('click', showPrev);
  lightboxOverlay.querySelector('.lightbox-next').addEventListener('click', showNext);

  /* ================= ZOOM BUTTON ================= */
  lightboxOverlay.querySelector('.lightbox-zoom').addEventListener('click', () => {
    zoomLevel = zoomLevel === 1 ? 1.8 : 1;
    applyTransform();
  });

  /* ================= SCROLL ZOOM ================= */
  lightboxOverlay.addEventListener('wheel', function (e) {
    if (!lightboxOverlay.classList.contains('active')) return;
    e.preventDefault();

    zoomLevel += e.deltaY < 0 ? 0.15 : -0.15;
    zoomLevel = Math.min(Math.max(zoomLevel, MIN_ZOOM), MAX_ZOOM);
    applyTransform();
  }, { passive: false });

  /* ================= DRAG PAN ================= */
  lightboxOverlay.addEventListener('mousedown', e => {
    if (zoomLevel <= 1) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;

    const x = e.clientX - startX;
    const y = e.clientY - startY;

    velocityX = x - translateX;
    velocityY = y - translateY;

    translateX = x;
    translateY = y;

    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    applyMomentum();
  });

  function applyMomentum() {
    let friction = 0.93;
    function animate() {
      velocityX *= friction;
      velocityY *= friction;

      translateX += velocityX;
      translateY += velocityY;

      applyTransform();

      if (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5) {
        requestAnimationFrame(animate);
      }
    }
    animate();
  }

  /* ================= DOUBLE CLICK AUTO ZOOM ================= */
  let lastTap = 0;
  lightboxOverlay.addEventListener('click', function () {
    const now = new Date().getTime();
    if (now - lastTap < 300) {
      if (zoomLevel === 1) zoomLevel = 2;
      else resetZoom();
      applyTransform();
    }
    lastTap = now;
  });

  /* ================= TRANSFORM ================= */
  function applyTransform() {
    img().style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
  }

  function resetZoom() {
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    velocityX = 0;
    velocityY = 0;
    applyTransform();
  }

  /* ================= FULLSCREEN ================= */
  lightboxOverlay.querySelector('.lightbox-fullscreen').addEventListener('click', () => {
    if (!isFullscreen) {
      lightboxOverlay.requestFullscreen?.();
      isFullscreen = true;
    } else {
      document.exitFullscreen?.();
      isFullscreen = false;
    }
  });

  function exitFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    isFullscreen = false;
  }

  /* ================= KEYBOARD ================= */
  document.addEventListener('keydown', e => {
    if (!lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ================= SWIPE MOBILE ================= */
  let touchStartX = 0;
  lightboxOverlay.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightboxOverlay.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) showNext();
    if (touchEndX - touchStartX > 50) showPrev();
  });
});

const menu = document.getElementById("mobileMenu");
const overlay = document.getElementById("mobileOverlay");
const openBtn = document.getElementById("hamburgerBtn");
const closeBtn = document.getElementById("closeMenuBtn");

// Semua link di mobile menu
const menuLinks = document.querySelectorAll(".mobile-menu a");

openBtn.addEventListener("click", () => {
    menu.classList.add("open");
    overlay.classList.add("active");
    openBtn.style.display = "none";   // sembunyikan hamburger
});

closeBtn.addEventListener("click", () => {
    menu.classList.remove("open");
    overlay.classList.remove("active");
    openBtn.style.display = "flex";   // tampilkan hamburger
});

overlay.addEventListener("click", () => {
    menu.classList.remove("open");
    overlay.classList.remove("active");
    openBtn.style.display = "flex";  
});

// ===== AUTO CLOSE KETIKA MENU DIKLIK =====
menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("open");
        overlay.classList.remove("active");
        openBtn.style.display = "flex";  
    });
});

