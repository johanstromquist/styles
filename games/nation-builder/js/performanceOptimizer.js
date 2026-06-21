// Performance Optimization & Monitoring System
// Handles performance optimizations, memory management, and quality assurance

class PerformanceOptimizer {
    constructor() {
        this.initialized = false;
        this.performanceData = {
            startTime: performance.now(),
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0,
            domNodes: 0,
            eventListeners: 0
        };
        
        this.optimizations = {
            domPooling: new Map(),
            lazyLoadQueue: [],
            animationQueue: [],
            throttledFunctions: new Map(),
            debouncedFunctions: new Map()
        };
        
        this.monitoring = {
            enabled: true,
            interval: 5000, // 5 seconds
            intervalId: null,
            metrics: []
        };
        
        this.errorHandling = {
            maxErrors: 50,
            errorCount: 0,
            errorLog: [],
            recoveryStrategies: new Map()
        };
        
        this.debugMode = false;
        this.qualitySettings = {
            animations: true,
            transitions: true,
            effects: true,
            autoSave: true
        };
    }
    
    // Initialize performance optimizer
    async initialize() {
        if (this.initialized) return;
        
        try {
            console.log('Initializing Performance Optimizer...');
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup DOM optimizations
            this.setupDOMOptimizations();
            
            // Setup lazy loading
            this.setupLazyLoading();
            
            // Setup animation optimizations
            this.setupAnimationOptimizations();
            
            // Setup memory management
            this.setupMemoryManagement();
            
            // Setup browser compatibility
            this.setupBrowserCompatibility();
            
            // Start monitoring
            this.startPerformanceMonitoring();
            
            this.initialized = true;
            console.log('Performance Optimizer initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Performance Optimizer:', error);
            throw error;
        }
    }
    
    // Setup comprehensive performance monitoring
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if (performance.timing) {
            const timing = performance.timing;
            this.performanceData.loadTime = timing.loadEventEnd - timing.navigationStart;
        }
        
        // Monitor memory usage if available
        if (performance.memory) {
            this.performanceData.memoryUsage = performance.memory.usedJSHeapSize;
        }
        
        // Monitor DOM complexity
        this.performanceData.domNodes = document.querySelectorAll('*').length;
        
        // Setup performance observer for detailed metrics
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        }
    }
    
    // Setup performance observer for detailed monitoring
    setupPerformanceObserver() {
        try {
            // Monitor navigation timing
            const navObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordPerformanceMetric('navigation', entry);
                }
            });
            navObserver.observe({ entryTypes: ['navigation'] });
            
            // Monitor resource loading
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordPerformanceMetric('resource', entry);
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            
            // Monitor long tasks
            if ('longtask' in PerformanceObserver.supportedEntryTypes) {
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordPerformanceMetric('longtask', entry);
                        this.handleLongTask(entry);
                    }
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            }
            
        } catch (error) {
            console.warn('PerformanceObserver setup failed:', error);
        }
    }
    
    // Record performance metrics
    recordPerformanceMetric(type, entry) {
        const metric = {
            type: type,
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            timestamp: Date.now()
        };
        
        this.monitoring.metrics.push(metric);
        
        // Keep only recent metrics
        if (this.monitoring.metrics.length > 1000) {
            this.monitoring.metrics = this.monitoring.metrics.slice(-500);
        }
        
        // Log significant performance issues
        if (entry.duration > 100) { // Long tasks > 100ms
            console.warn(`Performance issue detected: ${type} - ${entry.name} took ${entry.duration}ms`);
        }
    }
    
    // Handle long tasks that block the main thread
    handleLongTask(entry) {
        console.warn(`Long task detected: ${entry.duration}ms`);
        
        // If multiple long tasks, suggest performance improvements
        const recentLongTasks = this.monitoring.metrics
            .filter(m => m.type === 'longtask' && Date.now() - m.timestamp < 10000)
            .length;
            
        if (recentLongTasks > 3) {
            this.suggestPerformanceImprovements();
        }
    }
    
    // Setup comprehensive error handling
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError('JavaScript Error', event.error, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled Promise Rejection', event.reason);
        });
        
        // Setup recovery strategies
        this.setupRecoveryStrategies();
    }
    
    // Handle errors with recovery strategies
    handleError(type, error, details = {}) {
        this.errorHandling.errorCount++;
        
        const errorRecord = {
            type: type,
            message: error?.message || String(error),
            stack: error?.stack,
            details: details,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.errorHandling.errorLog.push(errorRecord);
        
        // Keep error log manageable
        if (this.errorHandling.errorLog.length > this.errorHandling.maxErrors) {
            this.errorHandling.errorLog = this.errorHandling.errorLog.slice(-25);
        }
        
        // Attempt recovery
        this.attemptErrorRecovery(type, error);
        
        // Log for debugging
        if (this.debugMode) {
            console.error('Error handled by optimizer:', errorRecord);
        }
    }
    
    // Setup error recovery strategies
    setupRecoveryStrategies() {
        this.errorHandling.recoveryStrategies.set('JavaScript Error', () => {
            // Try to reload critical modules
            console.log('Attempting to recover from JavaScript error...');
            return this.reloadCriticalModules();
        });
        
        this.errorHandling.recoveryStrategies.set('Network Error', () => {
            // Retry network requests
            console.log('Attempting to recover from network error...');
            return this.retryFailedRequests();
        });
        
        this.errorHandling.recoveryStrategies.set('Memory Error', () => {
            // Clear caches and optimize memory
            console.log('Attempting to recover from memory error...');
            return this.optimizeMemoryUsage();
        });
    }
    
    // Attempt error recovery
    async attemptErrorRecovery(type, error) {
        const strategy = this.errorHandling.recoveryStrategies.get(type);
        if (strategy) {
            try {
                await strategy();
                console.log(`Recovery successful for ${type}`);
            } catch (recoveryError) {
                console.error(`Recovery failed for ${type}:`, recoveryError);
            }
        }
    }
    
    // Setup DOM optimizations
    setupDOMOptimizations() {
        // Create DOM element pools for reuse
        this.createDOMPools();
        
        // Setup efficient event delegation
        this.setupEventDelegation();
        
        // Setup DOM mutation observer for optimization
        this.setupDOMMutationObserver();
    }
    
    // Create DOM element pools for performance
    createDOMPools() {
        const commonElements = ['div', 'span', 'button', 'p', 'h3', 'ul', 'li'];
        
        for (const tagName of commonElements) {
            this.optimizations.domPooling.set(tagName, []);
        }
    }
    
    // Get or create DOM element from pool
    getDOMElement(tagName, className = '') {
        const pool = this.optimizations.domPooling.get(tagName);
        if (pool && pool.length > 0) {
            const element = pool.pop();
            element.className = className;
            element.textContent = '';
            return element;
        } else {
            const element = document.createElement(tagName);
            element.className = className;
            return element;
        }
    }
    
    // Return DOM element to pool
    returnDOMElement(element) {
        if (!element || !element.tagName) return;
        
        const tagName = element.tagName.toLowerCase();
        const pool = this.optimizations.domPooling.get(tagName);
        
        if (pool && pool.length < 50) { // Limit pool size
            // Clean element
            element.className = '';
            element.textContent = '';
            element.removeAttribute('style');
            
            // Remove from parent
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            
            pool.push(element);
        }
    }
    
    // Setup efficient event delegation
    setupEventDelegation() {
        // Delegate common events to document body
        document.body.addEventListener('click', this.handleDelegatedClick.bind(this));
        document.body.addEventListener('change', this.handleDelegatedChange.bind(this));
        document.body.addEventListener('input', this.throttle(this.handleDelegatedInput.bind(this), 100));
    }
    
    // Handle delegated click events
    handleDelegatedClick(event) {
        const target = event.target;
        
        // Handle button clicks
        if (target.matches('button[data-action]')) {
            const action = target.dataset.action;
            this.dispatchCustomEvent('game-action', { action, target });
        }
        
        // Handle choice selections
        if (target.matches('.choice-button')) {
            this.dispatchCustomEvent('choice-selected', { target });
        }
    }
    
    // Handle delegated change events
    handleDelegatedChange(event) {
        const target = event.target;
        
        if (target.matches('select[data-setting]')) {
            const setting = target.dataset.setting;
            this.dispatchCustomEvent('setting-changed', { setting, value: target.value });
        }
    }
    
    // Handle delegated input events (throttled)
    handleDelegatedInput(event) {
        const target = event.target;
        
        if (target.matches('input[data-filter]')) {
            this.dispatchCustomEvent('filter-changed', { value: target.value });
        }
    }
    
    // Dispatch custom events efficiently
    dispatchCustomEvent(type, detail) {
        const event = new CustomEvent(type, { detail, bubbles: true });
        document.dispatchEvent(event);
    }
    
    // Setup DOM mutation observer
    setupDOMMutationObserver() {
        if (!('MutationObserver' in window)) return;
        
        const observer = new MutationObserver((mutations) => {
            let significantChanges = 0;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    significantChanges += mutation.addedNodes.length + mutation.removedNodes.length;
                }
            }
            
            // If many DOM changes, suggest optimization
            if (significantChanges > 10) {
                this.suggestDOMOptimization();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }
    
    // Setup lazy loading for non-critical assets
    setupLazyLoading() {
        // Setup intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        }
        
        // Setup lazy loading for images
        this.setupLazyImages();
    }
    
    // Setup intersection observer for lazy loading
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    this.loadLazyElement(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            }
        }, {
            rootMargin: '50px' // Load 50px before element comes into view
        });
    }
    
    // Setup lazy loading for images
    setupLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        for (const img of lazyImages) {
            if (this.intersectionObserver) {
                this.intersectionObserver.observe(img);
            } else {
                // Fallback for browsers without IntersectionObserver
                this.loadLazyElement(img);
            }
        }
    }
    
    // Load lazy element
    loadLazyElement(element) {
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }
        
        if (element.dataset.module) {
            this.loadLazyModule(element.dataset.module);
        }
    }
    
    // Load lazy module
    async loadLazyModule(moduleName) {
        try {
            const module = await import(`./${moduleName}.js`);
            console.log(`Lazy loaded module: ${moduleName}`);
            return module;
        } catch (error) {
            console.error(`Failed to lazy load module ${moduleName}:`, error);
        }
    }
    
    // Setup animation optimizations
    setupAnimationOptimizations() {
        // Use requestAnimationFrame for smooth animations
        this.animationFrame = null;
        this.animationCallbacks = [];
        
        // Setup reduced motion support
        this.setupReducedMotionSupport();
    }
    
    // Setup reduced motion support for accessibility
    setupReducedMotionSupport() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        this.updateAnimationSettings(prefersReducedMotion.matches);
        
        prefersReducedMotion.addEventListener('change', (e) => {
            this.updateAnimationSettings(e.matches);
        });
    }
    
    // Update animation settings based on user preferences
    updateAnimationSettings(reduceMotion) {
        this.qualitySettings.animations = !reduceMotion;
        this.qualitySettings.transitions = !reduceMotion;
        this.qualitySettings.effects = !reduceMotion;
        
        document.body.classList.toggle('reduce-motion', reduceMotion);
        
        if (reduceMotion) {
            console.log('Reduced motion mode enabled');
        }
    }
    
    // Optimized animation frame handler
    requestOptimizedAnimation(callback) {
        this.animationCallbacks.push(callback);
        
        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame(() => {
                const callbacks = [...this.animationCallbacks];
                this.animationCallbacks = [];
                this.animationFrame = null;
                
                for (const callback of callbacks) {
                    try {
                        callback();
                    } catch (error) {
                        console.error('Animation callback error:', error);
                    }
                }
            });
        }
    }
    
    // Setup memory management
    setupMemoryManagement() {
        // Monitor memory usage
        if (performance.memory) {
            this.monitorMemoryUsage();
        }
        
        // Setup periodic cleanup
        this.setupPeriodicCleanup();
    }
    
    // Monitor memory usage
    monitorMemoryUsage() {
        setInterval(() => {
            if (performance.memory) {
                const memoryInfo = performance.memory;
                this.performanceData.memoryUsage = memoryInfo.usedJSHeapSize;
                
                // Warn if memory usage is high
                const memoryUsagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
                
                if (memoryUsagePercent > 80) {
                    console.warn(`High memory usage: ${memoryUsagePercent.toFixed(1)}%`);
                    this.optimizeMemoryUsage();
                }
            }
        }, 30000); // Check every 30 seconds
    }
    
    // Optimize memory usage
    optimizeMemoryUsage() {
        // Clear DOM pools
        for (const pool of this.optimizations.domPooling.values()) {
            pool.length = 0;
        }
        
        // Clear performance metrics
        this.monitoring.metrics = this.monitoring.metrics.slice(-100);
        
        // Clear error log
        this.errorHandling.errorLog = this.errorHandling.errorLog.slice(-10);
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        console.log('Memory optimization completed');
    }
    
    // Setup periodic cleanup
    setupPeriodicCleanup() {
        setInterval(() => {
            this.performPeriodicCleanup();
        }, 300000); // Every 5 minutes
    }
    
    // Perform periodic cleanup
    performPeriodicCleanup() {
        // Clean up old performance metrics
        const cutoff = Date.now() - 600000; // 10 minutes ago
        this.monitoring.metrics = this.monitoring.metrics.filter(m => m.timestamp > cutoff);
        
        // Clean up old errors
        this.errorHandling.errorLog = this.errorHandling.errorLog.filter(e => e.timestamp > cutoff);
        
        // Clean up DOM pools
        for (const pool of this.optimizations.domPooling.values()) {
            if (pool.length > 20) {
                pool.length = 10; // Keep only 10 elements
            }
        }
        
        if (this.debugMode) {
            console.log('Periodic cleanup completed');
        }
    }
    
    // Setup browser compatibility
    setupBrowserCompatibility() {
        // Detect browser capabilities
        this.browserCapabilities = this.detectBrowserCapabilities();
        
        // Apply compatibility fixes
        this.applyCompatibilityFixes();
    }
    
    // Detect browser capabilities
    detectBrowserCapabilities() {
        return {
            intersectionObserver: 'IntersectionObserver' in window,
            performanceObserver: 'PerformanceObserver' in window,
            mutationObserver: 'MutationObserver' in window,
            requestAnimationFrame: 'requestAnimationFrame' in window,
            localStorage: 'localStorage' in window && localStorage !== null,
            sessionStorage: 'sessionStorage' in window && sessionStorage !== null,
            webGL: this.detectWebGL(),
            touchSupport: 'ontouchstart' in window,
            deviceOrientation: 'DeviceOrientationEvent' in window
        };
    }
    
    // Detect WebGL support
    detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }
    
    // Apply compatibility fixes
    applyCompatibilityFixes() {
        // Add browser class to body
        document.body.classList.add(this.getBrowserClass());
        
        // Add capability classes
        for (const [capability, supported] of Object.entries(this.browserCapabilities)) {
            document.body.classList.toggle(`supports-${capability}`, supported);
        }
        
        // Apply polyfills if needed
        this.applyPolyfills();
    }
    
    // Get browser class for CSS targeting
    getBrowserClass() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('chrome')) return 'browser-chrome';
        if (userAgent.includes('firefox')) return 'browser-firefox';
        if (userAgent.includes('safari')) return 'browser-safari';
        if (userAgent.includes('edge')) return 'browser-edge';
        
        return 'browser-unknown';
    }
    
    // Apply polyfills for missing features
    applyPolyfills() {
        // RequestAnimationFrame polyfill
        if (!this.browserCapabilities.requestAnimationFrame) {
            window.requestAnimationFrame = (callback) => {
                return setTimeout(callback, 16); // ~60fps
            };
        }
        
        // CustomEvent polyfill
        if (typeof window.CustomEvent !== 'function') {
            window.CustomEvent = function(event, params) {
                params = params || { bubbles: false, cancelable: false, detail: null };
                const evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            };
        }
    }
    
    // Start performance monitoring
    startPerformanceMonitoring() {
        if (!this.monitoring.enabled) return;
        
        this.monitoring.intervalId = setInterval(() => {
            this.collectPerformanceMetrics();
        }, this.monitoring.interval);
    }
    
    // Collect performance metrics
    collectPerformanceMetrics() {
        const metrics = {
            timestamp: Date.now(),
            memory: performance.memory ? performance.memory.usedJSHeapSize : 0,
            domNodes: document.querySelectorAll('*').length,
            eventListeners: this.getEventListenerCount(),
            fps: this.calculateFPS()
        };
        
        this.performanceData = { ...this.performanceData, ...metrics };
        
        if (this.debugMode) {
            console.log('Performance metrics:', metrics);
        }
    }
    
    // Calculate approximate FPS
    calculateFPS() {
        // This is a simplified FPS calculation
        // In a real implementation, you'd track frame times
        return this.qualitySettings.animations ? 60 : 30;
    }
    
    // Get approximate event listener count
    getEventListenerCount() {
        // This is an approximation - actual count is hard to determine
        return document.querySelectorAll('[onclick], [onchange], [oninput]').length;
    }
    
    // Utility functions for performance optimization
    
    // Throttle function execution
    throttle(func, limit) {
        if (this.optimizations.throttledFunctions.has(func)) {
            return this.optimizations.throttledFunctions.get(func);
        }
        
        let inThrottle;
        const throttled = function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
        
        this.optimizations.throttledFunctions.set(func, throttled);
        return throttled;
    }
    
    // Debounce function execution
    debounce(func, delay) {
        if (this.optimizations.debouncedFunctions.has(func)) {
            return this.optimizations.debouncedFunctions.get(func);
        }
        
        let timeoutId;
        const debounced = function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
        
        this.optimizations.debouncedFunctions.set(func, debounced);
        return debounced;
    }
    
    // Suggest performance improvements
    suggestPerformanceImprovements() {
        const suggestions = [];
        
        if (this.performanceData.domNodes > 5000) {
            suggestions.push('Consider reducing DOM complexity');
        }
        
        if (this.performanceData.memoryUsage > 100 * 1024 * 1024) { // 100MB
            suggestions.push('Consider optimizing memory usage');
        }
        
        if (this.monitoring.metrics.filter(m => m.type === 'longtask').length > 5) {
            suggestions.push('Consider breaking up long-running tasks');
        }
        
        if (suggestions.length > 0) {
            console.warn('Performance suggestions:', suggestions);
        }
    }
    
    // Suggest DOM optimization
    suggestDOMOptimization() {
        console.warn('High DOM mutation rate detected. Consider batching DOM updates.');
    }
    
    // Recovery methods (stubs for now)
    async reloadCriticalModules() {
        console.log('Reloading critical modules...');
        // In a real implementation, this would reload essential game modules
    }
    
    async retryFailedRequests() {
        console.log('Retrying failed requests...');
        // In a real implementation, this would retry failed network requests
    }
    
    // Get performance report
    getPerformanceReport() {
        return {
            data: this.performanceData,
            metrics: this.monitoring.metrics.slice(-50), // Last 50 metrics
            errors: this.errorHandling.errorLog.slice(-10), // Last 10 errors
            capabilities: this.browserCapabilities,
            optimizations: {
                domPoolSize: Array.from(this.optimizations.domPooling.values())
                    .reduce((sum, pool) => sum + pool.length, 0),
                throttledFunctions: this.optimizations.throttledFunctions.size,
                debouncedFunctions: this.optimizations.debouncedFunctions.size
            }
        };
    }
    
    // Enable debug mode
    enableDebugMode() {
        this.debugMode = true;
        document.body.classList.add('debug-mode');
        console.log('Debug mode enabled');
    }
    
    // Disable debug mode
    disableDebugMode() {
        this.debugMode = false;
        document.body.classList.remove('debug-mode');
        console.log('Debug mode disabled');
    }
    
    // Clean up optimizer
    destroy() {
        // Stop monitoring
        if (this.monitoring.intervalId) {
            clearInterval(this.monitoring.intervalId);
        }
        
        // Clear caches
        this.optimizations.domPooling.clear();
        this.optimizations.throttledFunctions.clear();
        this.optimizations.debouncedFunctions.clear();
        
        // Disconnect observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        console.log('Performance Optimizer destroyed');
    }
}

// Create singleton instance
const performanceOptimizer = new PerformanceOptimizer();

export { PerformanceOptimizer, performanceOptimizer }; 