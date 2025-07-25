// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

document.addEventListener('mousedown', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursorFollower.style.width = '40px';
    cursorFollower.style.height = '40px';
});

document.addEventListener('mouseup', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorFollower.style.width = '30px';
    cursorFollower.style.height = '30px';
});

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('nav');

if (mobileMenu) {
    let mobileNav = document.querySelector('.mobile-nav');
    
    // Create mobile nav if it doesn't exist
    if (!mobileNav) {
        mobileNav = document.createElement('div');
        mobileNav.classList.add('mobile-nav');
        const navLinks = document.querySelector('.nav-links').cloneNode(true);
        mobileNav.appendChild(navLinks);
        nav.appendChild(mobileNav);
    }
    
    mobileMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenu.contains(e.target) && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
    
    // Close mobile nav when window is resized to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Hero Animations (already done with CSS)
    
    // About Section Animation
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1
    });
    
    // Program Cards Animation
    gsap.from('.program-card', {
        scrollTrigger: {
            trigger: '.programs-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
    });
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / duration * 10; // Update every 10ms
        
        let current = 0;
        const updateCounter = () => {
            if (current < target) {
                current += step;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 10);
            } else {
                counter.textContent = target;
            }
        };
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            onEnter: updateCounter
        });
    });
    
    // Events Animation
    gsap.from('.event-card', {
        scrollTrigger: {
            trigger: '.events-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
    });
    
    // Gallery Animation
    gsap.from('.gallery-item', {
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5
    });
    
    // Testimonial Animation
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '.testimonials-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
    });
    
    // Affiliation Section Animation
    gsap.from('.affiliation-image', {
        scrollTrigger: {
            trigger: '.affiliation-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.affiliation-text', {
        scrollTrigger: {
            trigger: '.affiliation-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        x: 100,
        opacity: 0,
        duration: 1
    });
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other FAQs
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.parentElement.classList.remove('active');
                }
            });
        });
    });
    
    // Add click event to gallery items for lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').getAttribute('src');
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${imgSrc}" alt="Gallery Image">
                </div>
            `;
            document.body.appendChild(lightbox);
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            
            // Close lightbox
            lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            });
            
            // Close lightbox on click outside
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = 'auto';
                }
            });
        });
    });
    
    // Add form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Here you would typically send the form data to the server
                // For demo purposes, show success message
                const formData = new FormData(contactForm);
                
                // Create a success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.textContent = 'Your message has been sent successfully. We will get back to you soon!';
                
                // Replace form with success message
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
            }
        });
    }

    // Gallery Filter Functionality (for gallery.html)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryMainItems = document.querySelectorAll('.gallery-main-item');
    
    if (filterBtns.length > 0 && galleryMainItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryMainItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Lightbox functionality for gallery page
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightboxContainer = document.querySelector('.lightbox-container');
    
    if (galleryImages.length > 0 && lightboxContainer) {
        const lightboxImg = document.querySelector('.lightbox-image');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        let currentIndex = 0;
        let visibleItems = [];
        
        function updateVisibleItems() {
            visibleItems = [];
            galleryMainItems.forEach((item, index) => {
                if (window.getComputedStyle(item).display !== 'none') {
                    visibleItems.push(index);
                }
            });
        }
        
        galleryImages.forEach((item, index) => {
            item.addEventListener('click', function() {
                updateVisibleItems();
                const itemParent = item.closest('.gallery-main-item');
                const itemIndex = Array.from(galleryMainItems).indexOf(itemParent);
                currentIndex = visibleItems.indexOf(itemIndex);
                
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgTitle = this.querySelector('.gallery-info h3')?.textContent || '';
                const imgDesc = this.querySelector('.gallery-info p')?.textContent || '';
                
                lightboxImg.setAttribute('src', imgSrc);
                lightboxCaption.innerHTML = `<h3>${imgTitle}</h3><p>${imgDesc}</p>`;
                lightboxContainer.style.display = 'flex';
                
                setTimeout(() => {
                    lightboxContainer.style.opacity = '1';
                }, 10);
                
                document.body.style.overflow = 'hidden';
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function() {
                lightboxContainer.style.opacity = '0';
                setTimeout(() => {
                    lightboxContainer.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            });
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function() {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = visibleItems.length - 1;
                }
                
                const prevItem = galleryMainItems[visibleItems[currentIndex]];
                const imgSrc = prevItem.querySelector('img').getAttribute('src');
                const imgTitle = prevItem.querySelector('.gallery-info h3')?.textContent || '';
                const imgDesc = prevItem.querySelector('.gallery-info p')?.textContent || '';
                
                lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    lightboxImg.setAttribute('src', imgSrc);
                    lightboxCaption.innerHTML = `<h3>${imgTitle}</h3><p>${imgDesc}</p>`;
                    lightboxImg.style.opacity = '1';
                }, 200);
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', function() {
                if (currentIndex < visibleItems.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                
                const nextItem = galleryMainItems[visibleItems[currentIndex]];
                const imgSrc = nextItem.querySelector('img').getAttribute('src');
                const imgTitle = nextItem.querySelector('.gallery-info h3')?.textContent || '';
                const imgDesc = nextItem.querySelector('.gallery-info p')?.textContent || '';
                
                lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    lightboxImg.setAttribute('src', imgSrc);
                    lightboxCaption.innerHTML = `<h3>${imgTitle}</h3><p>${imgDesc}</p>`;
                    lightboxImg.style.opacity = '1';
                }, 200);
            });
        }
        
        // Video Gallery Play Button
        const videoItems = document.querySelectorAll('.video-item');
        
        videoItems.forEach(item => {
            item.addEventListener('click', function() {
                alert('Video player functionality will be implemented in the future.');
            });
        });
    }
}); 