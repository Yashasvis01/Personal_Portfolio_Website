document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // PRELOADER CONFIGURATION
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
      }
      runScrollReveal();
    }, 400);
  });

  // Fallback trigger if load lags
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      runScrollReveal();
    }
  }, 2500);

  // ==========================================================================
  // CUSTOM HARDWARE CURSOR ENGINE (Disabled on touchscreen inputs)
  // ==========================================================================
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && dot && ring) {
    document.body.classList.add('cursor-active');
    
    document.addEventListener('mousemove', (e) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      
      ring.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 150, fill: 'forwards' });
    });

    const clickables = 'a, button, input, textarea, .filter-btn, .tdot';
    document.querySelectorAll(clickables).forEach(item => {
      item.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%, -50%) scale(1.5)');
      item.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%, -50%) scale(1)');
    });
  }

  // ==========================================================================
  // LIGHT/DARK MODE ALTERNATOR SWITCH
  // ==========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.setAttribute('aria-pressed', currentTheme === 'light');

  themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const targetedTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetedTheme);
    localStorage.setItem('theme', targetedTheme);
    themeToggle.setAttribute('aria-pressed', targetedTheme === 'light');
  });

  // ==========================================================================
  // MOBILE NAVIGATION SLIDEOVER CONTROLLER
  // ==========================================================================
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileNav = () => {
    const activeState = navLinksContainer.classList.toggle('mobile-nav-active');
    hamburger.setAttribute('aria-expanded', activeState);
  };

  hamburger.addEventListener('click', toggleMobileNav);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('mobile-nav-active')) {
        toggleMobileNav();
      }
    });
  });

  // ==========================================================================
  // TYPING EFFECT CORE LOGIC
  // ==========================================================================
  const typedTextEl = document.getElementById('typedText');
  const targetStrings = ["Python Developer", "Frontend Web Developer", "Problem Solver"];
  let stringIdx = 0;
  let charIdx = 0;
  let breakingDown = false;
  let calculationSpeed = 100;

  function runTypingEngine() {
    const textTarget = targetStrings[stringIdx];
    
    if (breakingDown) {
      typedTextEl.textContent = textTarget.substring(0, charIdx - 1);
      charIdx--;
      calculationSpeed = 40;
    } else {
      typedTextEl.textContent = textTarget.substring(0, charIdx + 1);
      charIdx++;
      calculationSpeed = 100;
    }

    if (!breakingDown && charIdx === textTarget.length) {
      calculationSpeed = 2000; // Hold full word
      breakingDown = true;
    } else if (breakingDown && charIdx === 0) {
      breakingDown = false;
      stringIdx = (stringIdx + 1) % targetStrings.length;
      calculationSpeed = 400; // Switch delay
    }

    setTimeout(runTypingEngine, calculationSpeed);
  }

  if (typedTextEl) setTimeout(runTypingEngine, 1000);

  // ==========================================================================
  // INTERSECTION OBSERVER ANIMATION INTERFACES
  // ==========================================================================
  function runScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up');
    const skillBars = document.querySelectorAll('.skill-bar__fill');
    const numericalCounters = document.querySelectorAll('[data-target]');

    const generalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          generalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => generalObserver.observe(el));

    // Skill Bar filling sequence
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const maxWidth = entry.target.getAttribute('data-width');
          entry.target.style.width = maxWidth + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // Dynamic numeric data counter animation
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counterEl = entry.target;
          const endVal = parseInt(counterEl.getAttribute('data-target'), 10);
          let runningVal = 0;
          const trackingDuration = 1500;
          const frameSteps = Math.ceil(trackingDuration / 16);
          const incrementalStep = endVal / frameSteps;

          const updateCounterValue = () => {
            runningVal += incrementalStep;
            if (runningVal >= endVal) {
              counterEl.textContent = endVal;
            } else {
              counterEl.textContent = Math.floor(runningVal);
              requestAnimationFrame(updateCounterValue);
            }
          };
          
          requestAnimationFrame(updateCounterValue);
          metricObserver.unobserve(counterEl);
        }
      });
    }, { threshold: 0.8 });

    numericalCounters.forEach(counter => metricObserver.observe(counter));
  }

  // ==========================================================================
  // WINDOW SCROLL SPY MECHANISM
  // ==========================================================================
  const headerNavbar = document.getElementById('navbar');
  const returnTopBtn = document.getElementById('backToTop');
  const pageProgressBar = document.getElementById('scrollProgress');
  const trackedSections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Progress Indicator Bar calculation
    if (documentHeight > 0) {
      const activeProgressRatio = currentScrollY / documentHeight;
      pageProgressBar.style.transform = `scaleX(${activeProgressRatio})`;
    }

    // Scroll-specific styling variations
    if (currentScrollY > 50) {
      headerNavbar.classList.add('navbar--scrolled');
    } else {
      headerNavbar.classList.remove('navbar--scrolled');
    }

    if (currentScrollY > 500) {
      returnTopBtn.classList.add('show-btn');
    } else {
      returnTopBtn.classList.remove('show-btn');
    }

    // Section Track Navigation updates
    trackedSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const currentId = section.getAttribute('id');

      if (currentScrollY > sectionTop && currentScrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  });

  returnTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================================================
  // PROJECT FILTER ENGINE
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const layoutItems = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active-filter');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active-filter');
      btn.setAttribute('aria-selected', 'true');

      const selectedCriteria = btn.getAttribute('data-filter');

      layoutItems.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (selectedCriteria === 'all' || itemCategory === selectedCriteria) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // TESTIMONIAL SLIDER IMPLEMENTATION
  // ==========================================================================
  const slideTrack = document.getElementById('testimonialTrack');
  const slideItems = document.querySelectorAll('.testimonial-card');
  const backwardControl = document.getElementById('testimonialPrev');
  const forwardControl = document.getElementById('testimonialNext');
  const indicatorDotsWrap = document.getElementById('testimonialDots');
  let currentSlideIndex = 0;

  if (slideTrack && slideItems.length > 0) {
    // Generate navigation dots dynamically
    slideItems.forEach((_, activeIndex) => {
      const individualDot = document.createElement('button');
      individualDot.classList.add('tdot');
      individualDot.setAttribute('aria-label', `Go to slide ${activeIndex + 1}`);
      if (activeIndex === 0) individualDot.classList.add('active-tdot');
      individualDot.addEventListener('click', () => jumpToSlide(activeIndex));
      indicatorDotsWrap.appendChild(individualDot);
    });

    const dotsList = document.querySelectorAll('.tdot');

    const jumpToSlide = (targetIndex) => {
      currentSlideIndex = targetIndex;
      slideTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      dotsList.forEach(d => d.classList.remove('active-tdot'));
      dotsList[currentSlideIndex].classList.add('active-tdot');
    };

    forwardControl.addEventListener('click', () => {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= slideItems.length) nextIndex = 0;
      jumpToSlide(nextIndex);
    });

    backwardControl.addEventListener('click', () => {
      let prevIndex = currentSlideIndex - 1;
      if (prevIndex < 0) prevIndex = slideItems.length - 1;
      jumpToSlide(prevIndex);
    });

    // Auto-advance loop setup
    let autoPlayInterval = setInterval(() => forwardControl.click(), 6000);
    const resetSliderTimer = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => forwardControl.click(), 6000);
    };

    forwardControl.addEventListener('click', resetSliderTimer);
    backwardControl.addEventListener('click', resetSliderTimer);
    dotsList.forEach(d => d.addEventListener('click', resetSliderTimer));
  }

  // ==========================================================================
  // FORM VALIDATION & SIMULATED SUBMISSION ENGINE
  // ==========================================================================
  const inputForm = document.getElementById('contactForm');
  const outputSuccessMsg = document.getElementById('successMessage');

  if (inputForm) {
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let validationStatus = true;
      const formFields = ['name', 'email', 'subject', 'message'];

      formFields.forEach(fieldId => {
        const fieldEl = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}Error`);
        
        if (!fieldEl.value.trim()) {
          errorEl.textContent = 'This field is required.';
          errorEl.style.display = 'block';
          validationStatus = false;
        } else if (fieldId === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldEl.value.trim())) {
          errorEl.textContent = 'Please enter a valid email address.';
          errorEl.style.display = 'block';
          validationStatus = false;
        } else {
          errorEl.style.display = 'none';
          errorEl.textContent = '';
        }
      });

      if (validationStatus) {
        inputForm.classList.add('is-submitting');
        const processingBtn = document.getElementById('submitBtn');
        processingBtn.disabled = true;

        // Simulate API post process delay
        setTimeout(() => {
          inputForm.classList.remove('is-submitting');
          inputForm.reset();
          outputSuccessMsg.style.display = 'block';
          processingBtn.disabled = false;
          
          setTimeout(() => {
            outputSuccessMsg.style.display = 'none';
          }, 6000);
        }, 1500);
      }
    });
  }

  // Set the dynamic content copyright year automatically
  const dynamicYearField = document.getElementById('year');
  if (dynamicYearField) {
    dynamicYearField.textContent = new Date().getFullYear();
  }

  // Ripple component injection logic
  document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function (e) {
      const trackingX = e.clientX - e.target.getBoundingClientRect().left;
      const trackingY = e.clientY - e.target.getBoundingClientRect().top;
      
      const createdRipple = document.createElement('span');
      createdRipple.classList.add('ripple-effect');
      createdRipple.style.left = `${trackingX}px`;
      createdRipple.style.top = `${trackingY}px`;
      
      this.appendChild(createdRipple);
      setTimeout(() => createdRipple.remove(), 600);
    });
  });

});