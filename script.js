/* ============================================
   AESTHETIC INTERIORS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Loading Screen ─────────────────────── */
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2200);
    document.body.style.overflow = 'hidden';
  }

  /* ─── Navbar ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scrolled state
  const handleNavScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── Dark Mode ──────────────────────────── */
  const darkToggle = document.getElementById('dark-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateDarkIcon(theme);
  };

  const updateDarkIcon = (theme) => {
    if (!darkToggle) return;
    const sunIcon = darkToggle.querySelector('.icon-sun');
    const moonIcon = darkToggle.querySelector('.icon-moon');
    if (theme === 'dark') {
      sunIcon && (sunIcon.style.display = 'block');
      moonIcon && (moonIcon.style.display = 'none');
    } else {
      sunIcon && (sunIcon.style.display = 'none');
      moonIcon && (moonIcon.style.display = 'block');
    }
  };

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ─── Hero Parallax ──────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1)`;
      }
    }, { passive: true });
  }

  /* ─── Animated Counters ──────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '+');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  /* ─── Scroll Reveal ──────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter if it's a counter element
        const counter = entry.target.querySelector('[data-count]');
        if (counter && !counter.classList.contains('counted')) {
          counter.classList.add('counted');
          animateCounter(counter);
        }

        // If element itself is a counter
        if (entry.target.hasAttribute('data-count') && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Counter observer
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ─── Gallery Filter ─────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach((item, i) => {
          const cat = item.dataset.category;
          const show = filter === 'all' || cat === filter;

          if (show) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, i * 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ─── Modal ──────────────────────────────── */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const styleCards = document.querySelectorAll('[data-modal]');

  const styleData = {
    modern: {
      title: 'Modern Interior Design',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85',
      desc: 'Modern interior design is characterized by clean lines, open spaces, and a minimalist approach that celebrates function as much as form. The style originated in the early 20th century and has continuously evolved, maintaining its core principles while adapting to new materials and technologies.',
      desc2: 'Key elements include neutral color palettes, natural materials like wood and stone, and carefully curated furniture pieces that serve both aesthetic and functional purposes.',
      features: [
        { title: 'Color Palette', text: 'Whites, grays, and warm neutrals with bold accent colors' },
        { title: 'Materials', text: 'Concrete, steel, glass, and natural wood' },
        { title: 'Furniture', text: 'Clean lines, geometric forms, multi-functional pieces' },
      ]
    },
    minimalist: {
      title: 'Minimalist Design',
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85',
      desc: '"Less is more" is the guiding principle of minimalist design. This approach strips away the unnecessary to reveal the essential beauty of each element. Spaces feel open, calm, and intentional — every object earns its place.',
      desc2: 'Minimalist interiors use a restrained palette, thoughtful lighting, and high-quality materials to create spaces that feel luxurious in their simplicity.',
      features: [
        { title: 'Color Palette', text: 'Monochromatic whites and off-whites' },
        { title: 'Materials', text: 'Natural textures, linen, stone, and blonde wood' },
        { title: 'Furniture', text: 'Simple silhouettes, no ornamentation, quality craftsmanship' },
      ]
    },
    scandinavian: {
      title: 'Scandinavian Style',
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85',
      desc: 'Scandinavian design is rooted in the concept of hygge — a feeling of coziness and wellbeing. Born from long Nordic winters, this style creates warm, inviting spaces that balance functionality with a sense of comfort and warmth.',
      desc2: 'Light woods, cozy textiles, and a soft neutral palette combine to create interiors that feel both airy and intimate. Nature is a constant reference point.',
      features: [
        { title: 'Color Palette', text: 'Soft whites, warm grays, and muted pastels' },
        { title: 'Materials', text: 'Light birch, pine, wool, linen, and sheepskin' },
        { title: 'Furniture', text: 'Functional, thoughtfully crafted, and beautifully simple' },
      ]
    },
    industrial: {
      title: 'Industrial Style',
      img: 'https://images.unsplash.com/photo-1537726235470-8504e3beef77?w=900&q=85',
      desc: 'Industrial design takes its cues from factories and warehouses, celebrating raw, unfinished materials and honest construction. Exposed brick, ductwork, and open ceilings are hallmarks of this bold, urban aesthetic.',
      desc2: 'While the style embraces roughness, it\'s balanced with comfortable furnishings and warm lighting to create spaces that feel edgy yet livable.',
      features: [
        { title: 'Color Palette', text: 'Dark grays, browns, rust, and charcoal' },
        { title: 'Materials', text: 'Exposed brick, raw steel, reclaimed wood, concrete' },
        { title: 'Furniture', text: 'Vintage, repurposed, and utility-inspired pieces' },
      ]
    },
    luxury: {
      title: 'Luxury Interior Design',
      img: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=900&q=85',
      desc: 'Luxury interior design is about creating spaces that feel extraordinary in every sense. It\'s the pursuit of the finest materials, the most skilled craftsmanship, and an obsessive attention to detail that transforms a room into an experience.',
      desc2: 'Gold accents, rich textiles, statement art, and bespoke furniture come together to create environments that whisper exclusivity rather than shout it.',
      features: [
        { title: 'Color Palette', text: 'Deep jewel tones, champagne, ivory, and black' },
        { title: 'Materials', text: 'Marble, velvet, brass, lacquered finishes, silk' },
        { title: 'Furniture', text: 'Custom-made, upholstered statement pieces' },
      ]
    },
    bohemian: {
      title: 'Bohemian Style',
      img: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=900&q=85',
      desc: 'Bohemian design embraces a free-spirited, eclectic approach that values personal expression over convention. It layers patterns, textures, and objects collected from travels and life experiences to create spaces that feel richly personal.',
      desc2: 'Plants, vintage finds, global textiles, and an abundance of color and pattern make bohemian spaces feel warm, alive, and deeply individual.',
      features: [
        { title: 'Color Palette', text: 'Rich jewel tones, earth tones, and vibrant accents' },
        { title: 'Materials', text: 'Rattan, jute, macramé, patterned textiles, plants' },
        { title: 'Furniture', text: 'Eclectic mix of vintage, global, and handcrafted pieces' },
      ]
    }
  };

  const openModal = (key) => {
    const data = styleData[key];
    if (!data || !modalOverlay) return;

    modalOverlay.querySelector('.modal-img').src = data.img;
    modalOverlay.querySelector('.modal-img').alt = data.title;
    modalOverlay.querySelector('.modal-title').textContent = data.title;
    modalOverlay.querySelector('.modal-desc-1').textContent = data.desc;
    modalOverlay.querySelector('.modal-desc-2').textContent = data.desc2;

    const featuresContainer = modalOverlay.querySelector('.modal-features');
    featuresContainer.innerHTML = data.features.map(f => `
      <div class="modal-feature">
        <h4>${f.title}</h4>
        <p>${f.text}</p>
      </div>
    `).join('');

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  styleCards.forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.modal));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ─── Back to Top ────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Contact Form ───────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent ✓</span>';
      btn.style.background = '#5C8F6B';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ─── Smooth Scroll for anchor links ────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Testimonial Carousel ───────────────── */
  const testimonials = [
    {
      text: "Working with Aesthetic Interiors transformed our home completely. Every detail was considered, every material chosen with intention. The result is a space that feels entirely our own.",
      author: "Sarah Mitchell",
      role: "Residential Client",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
    },
    {
      text: "Their ability to translate our vague ideas into something concrete and beautiful was remarkable. They understood our lifestyle and designed around it perfectly.",
      author: "James & Elena Park",
      role: "Homeowners",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
    },
    {
      text: "The attention to detail is extraordinary. From the proportions of the furniture to the quality of light at different times of day — every element was thoughtfully considered.",
      author: "Ariana Voss",
      role: "Commercial Client",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
    }
  ];

  let currentTestimonial = 0;
  const testimonialText = document.querySelector('.testimonial-text');
  const authorName = document.querySelector('.testimonial-author strong');
  const authorRole = document.querySelector('.testimonial-author .author-role');
  const authorAvatar = document.querySelector('.author-avatar');

  const updateTestimonial = () => {
    if (!testimonialText) return;
    const t = testimonials[currentTestimonial];
    testimonialText.style.opacity = '0';
    setTimeout(() => {
      testimonialText.textContent = `"${t.text}"`;
      if (authorName) authorName.textContent = t.author;
      if (authorRole) authorRole.textContent = t.role;
      if (authorAvatar) authorAvatar.src = t.avatar;
      testimonialText.style.opacity = '1';
    }, 400);
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  };

  if (testimonialText) {
    testimonialText.style.transition = 'opacity 0.4s ease';
    setInterval(updateTestimonial, 5000);
  }

});