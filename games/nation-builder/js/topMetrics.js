/**
 * Top Metrics Bar for Nation Builder
 * Handles the streamlined display of key national indicators
 */

class TopMetrics {
    constructor() {
        this.metrics = {
            economy: { 
                value: 50, 
                trend: 'stable', 
                label: 'Economy',
                icon: '💰',
                tooltip: 'Economic Health: GDP growth, employment, inflation control'
            },
            society: { 
                value: 50, 
                trend: 'stable', 
                label: 'Society',
                icon: '👥',
                tooltip: 'Social Wellbeing: Education, healthcare, quality of life'
            },
            environment: { 
                value: 50, 
                trend: 'stable', 
                label: 'Environment',
                icon: '🌱',
                tooltip: 'Environmental Quality: Air/water quality, sustainability'
            },
            security: { 
                value: 50, 
                trend: 'stable', 
                label: 'Security',
                icon: '🛡️',
                tooltip: 'Security & Stability: Crime rates, border security, internal stability'
            },
            governance: { 
                value: 50, 
                trend: 'stable', 
                label: 'Governance',
                icon: '🏛️',
                tooltip: 'Government Effectiveness: Corruption control, rule of law, efficiency'
            },
            happiness: { 
                value: 50, 
                trend: 'stable', 
                label: 'Happiness',
                icon: '😊',
                tooltip: 'Citizen Satisfaction: Overall happiness and life satisfaction'
            }
        };
        
        this.gameState = null;
        this.updateInterval = null;
        this.animationQueue = [];
        this.isInitialized = false;
        
        // Historical data tracking for sparklines
        this.metricHistory = {
            economy: [],
            society: [],
            environment: [],
            security: [],
            governance: [],
            happiness: []
        };
    }

    init(gameState) {
        this.gameState = gameState;
        this.setupEventListeners();
        this.updateAllMetrics();
        this.startAnimationLoop();
        this.isInitialized = true;
        console.log('Top metrics system initialized');
    }

    setupEventListeners() {
        // Setup hover tooltips for each metric with improved persistence
        Object.keys(this.metrics).forEach(metricKey => {
            const indicator = document.getElementById(`${metricKey}-indicator`);
            if (indicator) {
                let hoverTimeout;
                let isTooltipVisible = false;
                
                indicator.addEventListener('mouseenter', (e) => {
                    clearTimeout(hoverTimeout);
                    isTooltipVisible = true;
                    this.showDetailedTooltip(metricKey);
                });
                
                indicator.addEventListener('mousemove', (e) => {
                    clearTimeout(hoverTimeout);
                    if (isTooltipVisible) {
                        this.updateTooltipPosition(e, metricKey);
                    }
                });
                
                indicator.addEventListener('mouseleave', (e) => {
                    // Add delay before hiding to allow movement within the indicator
                    hoverTimeout = setTimeout(() => {
                        const tooltip = document.querySelector('.detailed-metric-tooltip');
                        // Only hide if tooltip isn't being hovered
                        if (tooltip && !tooltip.matches(':hover')) {
                            isTooltipVisible = false;
                            this.hideDetailedTooltip();
                        }
                    }, 150);
                });
                
                indicator.addEventListener('click', () => {
                    this.expandMetricDetails(metricKey);
                });
            }
        });
        
        // Also handle tooltip hover to keep it visible
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.detailed-metric-tooltip')) {
                // Don't hide tooltip when hovering over it
                const tooltips = document.querySelectorAll('.detailed-metric-tooltip');
                tooltips.forEach(tooltip => {
                    tooltip.addEventListener('mouseleave', () => {
                        setTimeout(() => this.hideDetailedTooltip(), 150);
                    });
                });
            }
        });
    }

    updateMetric(metricKey, newValue, newTrend = null) {
        if (!this.metrics[metricKey]) return;
        
        const oldValue = this.metrics[metricKey].value;
        const oldTrend = this.metrics[metricKey].trend;
        
        this.metrics[metricKey].value = Math.max(0, Math.min(100, newValue));
        
        // Add to historical data for sparklines (keep last 20 values)
        this.metricHistory[metricKey].push(newValue);
        if (this.metricHistory[metricKey].length > 20) {
            this.metricHistory[metricKey].shift();
        }
        
        if (newTrend) {
            this.metrics[metricKey].trend = newTrend;
        } else {
            // Auto-calculate trend based on value change
            if (newValue > oldValue + 2) {
                this.metrics[metricKey].trend = 'positive';
            } else if (newValue < oldValue - 2) {
                this.metrics[metricKey].trend = 'negative';
            } else {
                this.metrics[metricKey].trend = 'stable';
            }
        }
        
        this.updateMetricDisplay(metricKey);
        this.animateMetricChange(metricKey, oldValue, newValue);
        
        console.log(`Top metric updated: ${metricKey} ${oldValue} → ${newValue} (${this.metrics[metricKey].trend})`);
    }

    updateMetricDisplay(metricKey) {
        const metric = this.metrics[metricKey];
        
        // Update value
        const valueElement = document.getElementById(`${metricKey}-value`);
        if (valueElement) {
            valueElement.textContent = Math.round(metric.value);
            
            // Update value styling based on performance
            valueElement.className = 'metric-value';
            if (metric.value >= 80) {
                valueElement.classList.add('excellent');
            } else if (metric.value >= 65) {
                valueElement.classList.add('good');
            } else if (metric.value >= 40) {
                valueElement.classList.add('fair');
            } else {
                valueElement.classList.add('poor');
            }
        }
        
        // Update trend
        const trendElement = document.getElementById(`${metricKey}-trend`);
        if (trendElement) {
            trendElement.className = 'metric-trend';
            trendElement.classList.add(metric.trend);
            
            switch (metric.trend) {
                case 'positive':
                    trendElement.textContent = '↗️';
                    break;
                case 'negative':
                    trendElement.textContent = '↘️';
                    break;
                default:
                    trendElement.textContent = '➡️';
            }
        }
    }

    updateAllMetrics() {
        Object.keys(this.metrics).forEach(metricKey => {
            this.updateMetricDisplay(metricKey);
        });
    }

    animateMetricChange(metricKey, oldValue, newValue) {
        const indicator = document.getElementById(`${metricKey}-indicator`);
        if (!indicator) return;
        
        // Add to animation queue
        this.animationQueue.push({
            type: 'metric-change',
            element: indicator,
            metricKey: metricKey,
            oldValue: oldValue,
            newValue: newValue,
            startTime: Date.now()
        });
        
        // Immediate visual feedback
        indicator.style.transform = 'scale(1.05)';
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
        }, 300);
        
        // Pulsing animation for significant changes
        if (Math.abs(newValue - oldValue) > 10) {
            indicator.classList.add('significant-change');
            setTimeout(() => {
                indicator.classList.remove('significant-change');
            }, 2000);
        }
    }

    showDetailedTooltip(metricKey) {
        const metric = this.metrics[metricKey];
        const indicator = document.getElementById(`${metricKey}-indicator`);
        if (!indicator) return;
        
        // Reuse existing tooltip or create new one
        let tooltip = this.tooltipElement;
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'detailed-metric-tooltip';
            document.body.appendChild(tooltip);
            this.tooltipElement = tooltip; // Cache the tooltip element
        }
        
        // Get breakdown data (this would come from the actual scoring system)
        const breakdown = this.getMetricBreakdown(metricKey);
        
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-icon">${metric.icon}</span>
                <span class="tooltip-title">${metric.label}</span>
                <span class="tooltip-value">${Math.round(metric.value)}/100</span>
            </div>
            <div class="tooltip-description">
                ${metric.tooltip}
            </div>
            <div class="tooltip-breakdown">
                <h4>Key Components:</h4>
                ${breakdown.map(item => `
                    <div class="breakdown-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-value">${item.value}/100</span>
                    </div>
                `).join('')}
            </div>
            <div class="tooltip-sparkline">
                <h4>Recent Trend:</h4>
                <div class="sparkline-container">
                    ${this.generateSparkline(metricKey)}
                </div>
            </div>
            <div class="tooltip-trend">
                <span class="trend-label">Recent trend:</span>
                <span class="trend-indicator ${metric.trend}">${this.getTrendText(metric.trend)}</span>
            </div>
        `;
        
        // Position tooltip
        const rect = indicator.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';
        tooltip.style.zIndex = '10000';
        tooltip.style.display = 'block';
        
        // Animate in
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        }, 10);
    }

    updateTooltipPosition(event, metricKey) {
        const tooltip = this.tooltipElement;
        if (!tooltip || tooltip.style.display === 'none') return;
        
        const indicator = document.getElementById(`${metricKey}-indicator`);
        if (!indicator) return;
        
        // Keep tooltip positioned relative to the indicator, not the mouse
        const rect = indicator.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';
    }

    hideDetailedTooltip() {
        const tooltip = this.tooltipElement;
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 200);
        }
    }

    expandMetricDetails(metricKey) {
        // This would open a detailed view of the metric
        console.log(`Expanding details for ${metricKey}`);
        
        // Show a modal or expand section with detailed metric information
        this.showMetricModal(metricKey);
    }

    showMetricModal(metricKey) {
        const metric = this.metrics[metricKey];
        
        // Create modal
        let modal = document.querySelector('.metric-detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'metric-detail-modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${metric.icon} ${metric.label} Details</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="current-status">
                        <div class="status-indicator ${this.getPerformanceClass(metric.value)}">
                            ${Math.round(metric.value)}/100
                        </div>
                        <div class="status-description">
                            ${this.getPerformanceDescription(metricKey, metric.value)}
                        </div>
                    </div>
                    <div class="metric-history">
                        <h3>Recent Changes</h3>
                        <div class="history-chart">
                            <!-- Historical data would go here -->
                            <p>Historical trend data would be displayed here</p>
                        </div>
                    </div>
                    <div class="improvement-suggestions">
                        <h3>How to Improve</h3>
                        ${this.getImprovementSuggestions(metricKey).map(suggestion => `
                            <div class="suggestion">
                                <strong>${suggestion.action}:</strong> ${suggestion.description}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    getMetricBreakdown(metricKey) {
        // This would return actual metric breakdown from the scoring system
        // For now, return mock data
        const breakdowns = {
            economy: [
                { name: 'GDP Growth', value: 52 },
                { name: 'Employment Rate', value: 48 },
                { name: 'Inflation Control', value: 50 }
            ],
            society: [
                { name: 'Education Quality', value: 55 },
                { name: 'Healthcare Access', value: 45 },
                { name: 'Social Mobility', value: 50 }
            ],
            environment: [
                { name: 'Air Quality', value: 48 },
                { name: 'Water Quality', value: 52 },
                { name: 'Sustainability', value: 50 }
            ],
            security: [
                { name: 'Crime Rate', value: 53 },
                { name: 'Border Security', value: 47 },
                { name: 'Internal Stability', value: 50 }
            ],
            governance: [
                { name: 'Corruption Control', value: 51 },
                { name: 'Rule of Law', value: 49 },
                { name: 'Government Efficiency', value: 50 }
            ],
            happiness: [
                { name: 'Life Satisfaction', value: 50 },
                { name: 'Work-Life Balance', value: 48 },
                { name: 'Community Cohesion', value: 52 }
            ]
        };
        
        return breakdowns[metricKey] || [];
    }

    getTrendText(trend) {
        switch (trend) {
            case 'positive':
                return 'Improving';
            case 'negative':
                return 'Declining';
            default:
                return 'Stable';
        }
    }

    getPerformanceClass(value) {
        if (value >= 80) return 'excellent';
        if (value >= 65) return 'good';
        if (value >= 40) return 'fair';
        return 'poor';
    }

    getPerformanceDescription(metricKey, value) {
        const level = this.getPerformanceClass(value);
        const descriptions = {
            economy: {
                excellent: 'Your economy is thriving with strong growth and low unemployment.',
                good: 'Economic indicators are positive with room for improvement.',
                fair: 'Economic performance is adequate but faces some challenges.',
                poor: 'The economy is struggling and needs immediate attention.'
            },
            society: {
                excellent: 'Citizens enjoy high quality education, healthcare, and social services.',
                good: 'Social systems are functioning well with some areas for enhancement.',
                fair: 'Basic social needs are met but inequality persists.',
                poor: 'Social systems are under strain and need significant investment.'
            }
            // Add more descriptions for other metrics...
        };
        
        return descriptions[metricKey]?.[level] || `${metricKey} is performing at ${level} level.`;
    }

    getImprovementSuggestions(metricKey) {
        const suggestions = {
            economy: [
                { action: 'Increase Infrastructure Spending', description: 'Boost economic growth through infrastructure investments' },
                { action: 'Education Investment', description: 'Improve workforce skills for long-term growth' }
            ],
            society: [
                { action: 'Healthcare Reform', description: 'Improve access and quality of healthcare services' },
                { action: 'Social Programs', description: 'Expand social safety nets for vulnerable populations' }
            ]
            // Add more suggestions for other metrics...
        };
        
        return suggestions[metricKey] || [];
    }

    startAnimationLoop() {
        // Process animation queue
        this.updateInterval = setInterval(() => {
            this.processAnimationQueue();
        }, 16); // 60 FPS
    }

    processAnimationQueue() {
        const now = Date.now();
        this.animationQueue = this.animationQueue.filter(animation => {
            const elapsed = now - animation.startTime;
            if (elapsed > 2000) return false; // Remove after 2 seconds
            
            // Process animation
            if (animation.type === 'metric-change') {
                // Add any ongoing animation effects here
            }
            
            return true;
        });
    }

    // Method to be called by external systems to update metrics
    updateFromGameState(gameState) {
        if (!gameState || !this.isInitialized) return;
        
        // This would extract relevant metrics from the game state
        // For now, we'll use mock data
        this.gameState = gameState;
    }

    generateSparkline(metricKey) {
        const history = this.metricHistory[metricKey];
        if (!history || history.length < 2) {
            return '<span class="no-data">Not enough data</span>';
        }
        
        const width = 100;
        const height = 30;
        const padding = 2;
        
        const min = Math.min(...history);
        const max = Math.max(...history);
        const range = max - min || 1; // Avoid division by zero
        
        // Generate SVG path
        const points = history.map((value, index) => {
            const x = padding + (index / (history.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((value - min) / range) * (height - 2 * padding);
            return `${x},${y}`;
        }).join(' ');
        
        // Determine color based on recent trend
        const recentValues = history.slice(-3);
        const isImproving = recentValues[recentValues.length - 1] > recentValues[0];
        const color = isImproving ? '#27ae60' : '#e74c3c';
        
        return `
            <svg width="${width}" height="${height}" class="sparkline-svg">
                <polyline 
                    points="${points}" 
                    fill="none" 
                    stroke="${color}" 
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <circle 
                    cx="${padding + ((history.length - 1) / (history.length - 1)) * (width - 2 * padding)}"
                    cy="${height - padding - ((history[history.length - 1] - min) / range) * (height - 2 * padding)}"
                    r="2"
                    fill="${color}"
                />
            </svg>
        `;
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Clean up cached tooltip element
        if (this.tooltipElement && this.tooltipElement.parentNode) {
            this.tooltipElement.parentNode.removeChild(this.tooltipElement);
            this.tooltipElement = null;
        }
        
        const modal = document.querySelector('.metric-detail-modal');
        if (modal) modal.remove();
        
        console.log('Top metrics system destroyed');
    }
}

// Export for use in main game
export { TopMetrics }; 