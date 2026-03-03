/* 
  Hiskia Prawira Tarigan - Interactive Portfolio Script
  Typing Animation | Scroll Effects | Particles
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Typing Animation ---
    const typingText = document.getElementById('typingText');
    const professions = [
        'Web Developer',
        'Laravel Specialist',
        'Analytical Thinker',
        'System Architect',
        'AI & Blockchain Explorer'
    ];

    let profIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentProf = professions[profIndex];

        if (isDeleting) {
            typingText.textContent = currentProf.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentProf.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentProf.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            profIndex = (profIndex + 1) % professions.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typingText) type();

    // --- Active Link Highlight & Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '12px 40px';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            navbar.style.padding = '20px 40px';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            hamburger.classList.toggle('active');
        });
    }

    // --- Scroll Animations (Progress Bars & Stats) ---
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Progress Bars
                if (entry.target.classList.contains('progress-fill')) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                }

                // Animate Numbers
                if (entry.target.classList.contains('stat-number')) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateNumber(entry.target, target);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.progress-fill, .stat-number').forEach(el => observer.observe(el));

    function animateNumber(element, target) {
        let current = 0;
        const duration = 2000;
        const stepTime = 10;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // --- Particles Movement ---
    const particles = document.querySelectorAll('.particle');
    particles.forEach(p => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = 10 + Math.random() * 20;

        p.style.left = x + 'px';
        p.style.top = y + 'px';

        p.animate([
            { transform: `translate(0, 0)` },
            { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)` }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
    });
});
