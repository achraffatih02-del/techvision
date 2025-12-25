// js/main.js
class TechVision {
    constructor() {
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.initComponents();
    }

    cacheDOM() {
        this.header = document.querySelector('.header');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.fadeElements = document.querySelectorAll('.fade-in');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.forms = document.querySelectorAll('form');
        this.tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.nav && this.nav.classList.contains('active') && 
                !e.target.closest('.nav') && 
                !e.target.closest('.mobile-menu-btn')) {
                this.closeMobileMenu();
            }
        });

        // Form submission
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e, form));
        });

        // Tooltips
        this.tooltipTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', (e) => this.showTooltip(e));
            trigger.addEventListener('mouseleave', () => this.hideTooltip());
        });
    }

    toggleMobileMenu() {
        this.nav.classList.toggle('active');
        const icon = this.mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = this.nav.classList.contains('active') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        }
    }

    closeMobileMenu() {
        this.nav.classList.remove('active');
        const icon = this.mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    }

    handleScroll() {
        // Header scroll effect
        if (window.scrollY > 100) {
            this.header.classList.add('header-scrolled');
        } else {
            this.header.classList.remove('header-scrolled');
        }

        // Update active nav link based on scroll position
        this.updateActiveNavLink();

        // Trigger fade-in animations
        this.triggerFadeIn();
    }

    handleSmoothScroll(e, anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (this.nav.classList.contains('active')) {
                this.closeMobileMenu();
            }

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Update URL without page reload
            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        }
    }

    updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate stats counter
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                    
                    // Show fade-in elements
                    if (entry.target.classList.contains('fade-in')) {
                        entry.target.classList.add('visible');
                    }
                }
            });
        }, { threshold: 0.1 });

        // Observe elements
        this.statNumbers.forEach(stat => observer.observe(stat));
        this.fadeElements.forEach(element => observer.observe(element));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count') || element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = this.formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = this.formatNumber(Math.floor(current));
            }
        }, 16);
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    }

    triggerFadeIn() {
        this.fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    handleFormSubmit(e, form) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showNotification('Form submitted successfully!', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    showTooltip(e) {
        const tooltipText = e.target.getAttribute('data-tooltip');
        if (!tooltipText) return;

        // Remove existing tooltip
        const existingTooltip = document.querySelector('.custom-tooltip');
        if (existingTooltip) existingTooltip.remove();

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = tooltipText;
        
        // Position tooltip
        const rect = e.target.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(tooltip);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) tooltip.remove();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 300px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: 'var(--success)',
            error: 'var(--danger)',
            warning: 'var(--warning)',
            info: 'var(--primary)'
        };
        return colors[type] || 'var(--primary)';
    }

    initComponents() {
        // Initialize any additional components
        this.initThemeToggle();
        this.initSearch();
        this.initBackToTop();
    }

    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = document.body.classList.contains('light-mode')
                        ? 'fas fa-sun'
                        : 'fas fa-moon';
                }
                this.showNotification('Theme changed successfully!');
            });
        }
    }

    initSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const searchModal = document.querySelector('.search-modal');
        
        if (searchBtn && searchModal) {
            searchBtn.addEventListener('click', () => {
                searchModal.classList.add('active');
                searchModal.querySelector('input').focus();
            });
            
            searchModal.addEventListener('click', (e) => {
                if (e.target === searchModal || e.target.closest('.search-close')) {
                    searchModal.classList.remove('active');
                }
            });
        }
    }

    initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            visibility: hidden;
            transition: var(--transition-base);
        `;
        
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.TechVision = new TechVision();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechVision;
}