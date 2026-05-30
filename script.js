/* =============================================
   AURELIA — Wedding Invitation Script
   ============================================= */

// =============================================
// LOADING SCREEN
// =============================================

window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-screen');

  // Extract guest name from URL query param
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to') || params.get('nama') || params.get('guest');
  if (guest) {
    const el = document.getElementById('guest-name');
    if (el) el.textContent = decodeURIComponent(guest);
  }

  // Hide loader after animation
  setTimeout(() => {
    loader.classList.add('hide');
    loader.addEventListener('transitionend', () => {
      loader.style.display = 'none';
    }, { once: true });
  }, 2400);
});

// =============================================
// OPEN INVITATION
// =============================================

function openInvitation() {
  const main = document.getElementById('main-content');
  const cover = document.getElementById('cover');
  const btn = document.getElementById('btn-open');

  btn.style.opacity = '0.5';
  btn.style.pointerEvents = 'none';

  setTimeout(() => {
    // Show main
    main.classList.remove('hidden');
    main.style.opacity = '0';

    // Scroll cover out
    cover.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    cover.style.opacity = '0';
    cover.style.transform = 'scale(1.02)';

    setTimeout(() => {
      cover.style.display = 'none';
      main.style.transition = 'opacity 0.6s ease';
      main.style.opacity = '1';

      window.scrollTo({ top: 0, behavior: 'instant' });

      // Init all
      initCountdown();
      initScrollReveal();
      initMusic();
    }, 700);
  }, 100);
}

// =============================================
// COUNTDOWN
// =============================================

function initCountdown() {
  const target = new Date('2026-12-12T08:00:00');

  function tick() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    updateNum('cd-days', pad(days));
    updateNum('cd-hours', pad(hours));
    updateNum('cd-mins', pad(mins));
    updateNum('cd-secs', pad(secs));
  }

  function updateNum(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== val) {
      el.classList.add('flip');
      setTimeout(() => el.classList.remove('flip'), 300);
    }
    el.textContent = val;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

// =============================================
// SCROLL REVEAL (IntersectionObserver)
// =============================================

function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// =============================================
// MUSIC
// =============================================

function initMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-btn');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  if (!audio || !btn) return;

  btn.classList.add('visible');

  // Try autoplay
  const tryPlay = () => {
    audio.volume = 0.6;
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          setPlaying(false);
        });
    }
  };

  tryPlay();

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  function setPlaying(isPlaying) {
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      btn.classList.add('playing');
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      btn.classList.remove('playing');
    }
  }

  // Resume on user interaction if blocked
  document.addEventListener(
    'touchstart',
    () => {
      if (audio.paused) tryPlay();
    },
    { once: true }
  );
}

// =============================================
// SMOOTH PARALLAX (light, CSS transform only)
// =============================================

function initParallax() {
  const cover = document.querySelector('.cover-img');
  if (!cover) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        cover.style.transform = `translateY(${scrollY * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

initParallax();

// =============================================
// LIGHTBOX
// =============================================

document.querySelectorAll('.portrait-img, .gallery-img, .cover-img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(img.src);
  });
});

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});