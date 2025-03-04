document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('navMenu');
  const navUl = document.querySelector('#navMenu ul');
  const header = document.querySelector('.header');
  const hamburger = document.getElementById('hamburger');
  let lastScroll = 0;
  let ticking = false;

  // Toggle mobile menu (two-line hamburger -> "X")
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navUl.classList.toggle('active');
    // Toggle body scroll
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Hide header on scroll down (mobile only), show on scroll up
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        // Desktop: Always keep header visible
        // Mobile: Hide on scroll down, show on scroll up
        if (window.innerWidth < 768) {
          if (currentScroll <= 0) {
            // At top of page
            header.classList.remove('hidden');
          } else if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
            // Scroll down -> hide
            header.classList.add('hidden');
          } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
            // Scroll up -> show
            header.classList.remove('hidden');
          }
        } else {
          // Desktop: Ensure header is not hidden
          header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });

  // IntersectionObserver for project cards reveal
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        projectObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '50px'
  });
  // Observe each project card
  document.querySelectorAll('.project-card').forEach(card => {
    projectObserver.observe(card);
  });

  // IntersectionObserver for skills with staggered animation
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = 1;
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        skillsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  // Observe each skill box
  document.querySelectorAll('.skill-box').forEach(box => {
    skillsObserver.observe(box);
  });

  // Smooth scroll for anchor links, close mobile menu if open
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          navUl.classList.remove('active');
          document.body.style.overflow = '';
        }
        // Offset for the fixed header
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // Enhanced form submission with loading animation and feedback
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);

      // Show loading spinner
      submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
      submitButton.disabled = true;
      form.classList.add('submitting');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          submitButton.innerHTML = '<span class="success-icon">✓</span> Message Sent!';
          form.reset();
          form.classList.add('success');
          setTimeout(() => {
            submitButton.innerHTML = 'Send Message';
            submitButton.disabled = false;
            form.classList.remove('submitting', 'success');
          }, 3000);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        // Error
        submitButton.innerHTML = '<span class="error-icon">⚠</span> Error. Try Again';
        submitButton.disabled = false;
        form.classList.remove('submitting');
        form.classList.add('error');
        setTimeout(() => {
          form.classList.remove('error');
        }, 3000);
      }
    });
  }
});
