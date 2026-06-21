/**
 * Responsive Design and Accessibility Utilities
 * Handles touch interactions, keyboard navigation, and responsive behavior
 */

class ResponsiveManager {
    constructor() {
        this.isTouchDevice = this.detectTouchDevice();
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.isLandscape = window.innerWidth > window.innerHeight;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupTouchInteractions();
        this.setupAccessibilityFeatures();
        this.handleInitialLoad();
    }
    
    detectTouchDevice() {
        return (('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0));
    }
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile-small';
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        if (width <= 1200) return 'desktop-small';
        return 'desktop';
    }
    
    setupEventListeners() {
        // Resize handler with debouncing
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 150);
        });
        
        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Focus management
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
        
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
    
    setupTouchInteractions() {
        if (!this.isTouchDevice) return;
        
        // Add touch-specific classes
        document.body.classList.add('touch-device');
        
        // Handle swipe gestures for city visualization
        const cityContainer = document.querySelector('.city-container');
        if (cityContainer) {
            this.setupSwipeGestures(cityContainer);
        }
        
        // Enhanced touch feedback
        this.setupTouchFeedback();
    }
    
    setupSwipeGestures(element) {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        });
        
        element.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            if (!isScrolling) {
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    // Horizontal swipe
                    e.preventDefault();
                    element.scrollLeft += diffX * 0.5;
                } else {
                    // Vertical swipe - allow default scrolling
                    isScrolling = true;
                }
            }
            
            startX = currentX;
            startY = currentY;
        });
        
        element.addEventListener('touchend', () => {
            startX = 0;
            startY = 0;
            isScrolling = false;
        });
    }
    
    setupTouchFeedback() {
        const interactiveElements = document.querySelectorAll(
            '.nav-btn, .choice-btn, .crisis-choice, .metric-item, .building, .category-toggle'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            });
            
            element.addEventListener('touchcancel', () => {
                element.classList.remove('touch-active');
            });
        });
    }
    
    setupAccessibilityFeatures() {
        // Announce dynamic content changes
        this.createLiveRegion();
        
        // Enhanced focus management for modals
        this.setupModalFocusManagement();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Screen reader announcements
        this.setupScreenReaderAnnouncements();
    }
    
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
    
    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    setupModalFocusManagement() {
        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.crisis-overlay:not([style*="display: none"]), .story-modal:not([style*="display: none"]), .results-section:not([style*="display: none"])');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }
    
    trapFocus(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target.matches('input, textarea, select')) return;
            
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        document.getElementById('save-game')?.click();
                        break;
                    case 'o':
                        e.preventDefault();
                        document.getElementById('load-game')?.click();
                        break;
                    case 'r':
                        e.preventDefault();
                        document.getElementById('reset-game')?.click();
                        break;
                }
            }
            
            // Number keys for quick decision selection
            if (e.key >= '1' && e.key <= '9') {
                const choiceIndex = parseInt(e.key) - 1;
                const choices = document.querySelectorAll('.choice-btn, .crisis-choice');
                if (choices[choiceIndex]) {
                    e.preventDefault();
                    choices[choiceIndex].click();
                }
            }
        });
    }
    
    setupScreenReaderAnnouncements() {
        // Announce year changes
        const yearObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'current-year') {
                    this.announce(`Year ${mutation.target.textContent} has begun`);
                }
            });
        });
        
        const currentYear = document.getElementById('current-year');
        if (currentYear) {
            yearObserver.observe(currentYear, { childList: true, characterData: true });
        }
        
        // Announce phase changes
        const phaseObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'current-phase') {
                    this.announce(`Entering ${mutation.target.textContent} phase`);
                }
            });
        });
        
        const currentPhase = document.getElementById('current-phase');
        if (currentPhase) {
            phaseObserver.observe(currentPhase, { childList: true, characterData: true });
        }
    }
    
    handleKeyboardNavigation(e) {
        // Arrow key navigation for metric categories
        if (e.target.classList.contains('category-toggle')) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const categories = Array.from(document.querySelectorAll('.category-toggle'));
                const currentIndex = categories.indexOf(e.target);
                const nextIndex = e.key === 'ArrowDown' 
                    ? (currentIndex + 1) % categories.length
                    : (currentIndex - 1 + categories.length) % categories.length;
                categories[nextIndex].focus();
            }
        }
        
        // Arrow key navigation for choices
        if (e.target.classList.contains('choice-btn') || e.target.classList.contains('crisis-choice')) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const choices = Array.from(document.querySelectorAll('.choice-btn, .crisis-choice'));
                const currentIndex = choices.indexOf(e.target);
                const nextIndex = e.key === 'ArrowDown' 
                    ? (currentIndex + 1) % choices.length
                    : (currentIndex - 1 + choices.length) % choices.length;
                choices[nextIndex].focus();
            }
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            const closeButtons = document.querySelectorAll('.close-story, .close-modal, .close-crisis');
            closeButtons.forEach(btn => {
                if (btn.offsetParent !== null) { // Check if visible
                    btn.click();
                }
            });
        }
    }
    
    handleFocusIn(e) {
        // Add focus indicator class
        e.target.classList.add('focused');
        
        // Scroll element into view if needed
        if (this.currentBreakpoint === 'mobile' || this.currentBreakpoint === 'mobile-small') {
            setTimeout(() => {
                e.target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'nearest'
                });
            }, 100);
        }
    }
    
    handleFocusOut(e) {
        // Remove focus indicator class
        e.target.classList.remove('focused');
    }
    
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        const wasLandscape = this.isLandscape;
        this.isLandscape = window.innerWidth > window.innerHeight;
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange(newBreakpoint);
        }
        
        if (wasLandscape !== this.isLandscape) {
            this.handleOrientationChange();
        }
        
        // Update timeline progress bar
        this.updateTimelineProgressBar();
    }
    
    handleOrientationChange() {
        // Announce orientation change
        this.announce(`Orientation changed to ${this.isLandscape ? 'landscape' : 'portrait'}`);
        
        // Update layout classes
        document.body.classList.toggle('landscape', this.isLandscape);
        document.body.classList.toggle('portrait', !this.isLandscape);
        
        // Recalculate city visualization if needed
        this.recalculateCityLayout();
    }
    
    onBreakpointChange(breakpoint) {
        // Update body class
        document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
        document.body.classList.add(`breakpoint-${breakpoint}`);
        
        // Announce breakpoint change for development/testing
        if (window.location.search.includes('debug=true')) {
            this.announce(`Breakpoint changed to ${breakpoint}`);
        }
        
        // Adjust UI elements based on breakpoint
        this.adjustUIForBreakpoint(breakpoint);
    }
    
    adjustUIForBreakpoint(breakpoint) {
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) return;
        
        // Remove existing breakpoint classes
        gameContainer.classList.remove('mobile-layout', 'tablet-layout', 'desktop-layout');
        
        // Add appropriate layout class
        switch (breakpoint) {
            case 'mobile-small':
            case 'mobile':
                gameContainer.classList.add('mobile-layout');
                this.optimizeForMobile();
                break;
            case 'tablet':
                gameContainer.classList.add('tablet-layout');
                this.optimizeForTablet();
                break;
            default:
                gameContainer.classList.add('desktop-layout');
                this.optimizeForDesktop();
                break;
        }
    }
    
    optimizeForMobile() {
        // Collapse all metric categories by default on mobile
        const categories = document.querySelectorAll('.metric-category');
        categories.forEach((category, index) => {
            // Keep first category expanded, collapse others
            if (index > 0) {
                category.classList.add('collapsed');
                const toggle = category.querySelector('.category-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        // Reduce animation complexity
        document.body.classList.add('reduced-animations');
    }
    
    optimizeForTablet() {
        // Moderate optimization for tablet
        document.body.classList.remove('reduced-animations');
        
        // Show more content but still be selective
        const categories = document.querySelectorAll('.metric-category');
        categories.forEach((category, index) => {
            if (index < 3) {
                category.classList.remove('collapsed');
                const toggle = category.querySelector('.category-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'true');
                }
            }
        });
    }
    
    optimizeForDesktop() {
        // Full desktop experience
        document.body.classList.remove('reduced-animations');
        
        // Expand all categories
        const categories = document.querySelectorAll('.metric-category');
        categories.forEach(category => {
            category.classList.remove('collapsed');
            const toggle = category.querySelector('.category-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    }
    
    updateTimelineProgressBar() {
        const progressBar = document.getElementById('timeline-progress');
        const timelineBar = document.querySelector('.timeline-bar');
        
        if (progressBar && timelineBar) {
            const currentYear = parseInt(document.getElementById('current-year')?.textContent || '1');
            const progress = ((currentYear - 1) / 19) * 100; // 20 years total
            
            progressBar.style.width = `${progress}%`;
            timelineBar.setAttribute('aria-valuenow', progress.toString());
            
            const description = document.getElementById('timeline-description');
            if (description) {
                description.textContent = `${Math.round(progress)}% complete - Year ${currentYear} of 20`;
            }
        }
    }
    
    recalculateCityLayout() {
        const cityContainer = document.querySelector('.city-container');
        if (cityContainer && this.isTouchDevice) {
            // Reset scroll position on orientation change
            cityContainer.scrollLeft = 0;
            
            // Recalculate building positions if needed
            const buildings = cityContainer.querySelectorAll('.building');
            buildings.forEach(building => {
                // Trigger reflow to recalculate positions
                building.style.transform = 'translateZ(0)';
            });
        }
    }
    
    handleInitialLoad() {
        // Set initial classes
        document.body.classList.add(`breakpoint-${this.currentBreakpoint}`);
        document.body.classList.toggle('landscape', this.isLandscape);
        document.body.classList.toggle('portrait', !this.isLandscape);
        
        if (this.isTouchDevice) {
            document.body.classList.add('touch-device');
        }
        
        // Initial optimization
        this.adjustUIForBreakpoint(this.currentBreakpoint);
        
        // Announce initial state
        this.announce('Nation Builder loaded. Use Tab to navigate, Enter to select.');
    }
    
    // Public methods for other modules to use
    isMobile() {
        return this.currentBreakpoint === 'mobile' || this.currentBreakpoint === 'mobile-small';
    }
    
    isTablet() {
        return this.currentBreakpoint === 'tablet';
    }
    
    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }
}

// Initialize responsive manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.responsiveManager = new ResponsiveManager();
    });
} else {
    window.responsiveManager = new ResponsiveManager();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveManager;
} 