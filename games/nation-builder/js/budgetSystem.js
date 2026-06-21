/**
 * Budget Allocation System for Nation Builder
 * Handles interactive budget sliders and resource allocation
 */

class BudgetSystem {
    constructor() {
        this.categories = {
            education: { min: 5, max: 35, default: 20, name: 'Education', icon: '🎓' },
            healthcare: { min: 8, max: 30, default: 18, name: 'Healthcare', icon: '🏥' },
            military: { min: 5, max: 25, default: 15, name: 'Defense', icon: '🛡️' },
            infrastructure: { min: 10, max: 30, default: 20, name: 'Infrastructure', icon: '🏗️' },
            environment: { min: 2, max: 20, default: 12, name: 'Environment', icon: '🌱' },
            social: { min: 5, max: 25, default: 15, name: 'Social Services', icon: '🤝' }
        };
        
        this.currentAllocation = {};
        this.totalBudget = 100; // 100 billion
        this.gameState = null;
        this.isInitialized = false;
        
        // Initialize with default values
        Object.keys(this.categories).forEach(category => {
            this.currentAllocation[category] = this.categories[category].default;
        });
    }

    init(gameState) {
        this.gameState = gameState;
        this.setupEventListeners();
        this.updateAllDisplays();
        this.isInitialized = true;
        console.log('Budget system initialized');
    }

    setupEventListeners() {
        // Slider event listeners
        Object.keys(this.categories).forEach(category => {
            const slider = document.getElementById(`${category}-slider`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this.handleSliderChange(category, parseInt(e.target.value));
                });

                slider.addEventListener('change', (e) => {
                    this.validateBudgetBalance();
                });
            }
        });

        // Button event listeners
        const resetBtn = document.getElementById('reset-budget');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetToDefaults());
        }

        const applyBtn = document.getElementById('apply-budget');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyBudgetChanges());
        }
    }

    handleSliderChange(category, newValue) {
        const oldValue = this.currentAllocation[category];
        this.currentAllocation[category] = newValue;
        
        // Update displays
        this.updateCategoryDisplay(category);
        this.updateBudgetSummary();
        
        // Visual feedback
        this.animateSliderChange(category);
        
        console.log(`Budget allocation changed: ${category} ${oldValue}% → ${newValue}%`);
    }

    updateCategoryDisplay(category) {
        const allocation = this.currentAllocation[category];
        const amount = Math.round((allocation / 100) * this.totalBudget);
        
        // Update percentage display
        const percentElement = document.getElementById(`${category}-percent`);
        if (percentElement) {
            percentElement.textContent = `${allocation}%`;
        }
        
        // Update amount display
        const amountElement = document.getElementById(`${category}-amount`);
        if (amountElement) {
            amountElement.textContent = `$${amount}B`;
        }
        
        // Update slider value
        const slider = document.getElementById(`${category}-slider`);
        if (slider) {
            slider.value = allocation;
        }
    }

    updateBudgetSummary() {
        const totalAllocated = Object.values(this.currentAllocation).reduce((sum, val) => sum + val, 0);
        const budgetStatus = document.querySelector('.budget-status');
        
        if (budgetStatus) {
            budgetStatus.className = 'budget-status';
            
            if (totalAllocated === 100) {
                budgetStatus.textContent = 'Balanced Budget';
                budgetStatus.classList.add('balanced');
            } else if (totalAllocated < 100) {
                const surplus = 100 - totalAllocated;
                budgetStatus.textContent = `Surplus: ${surplus}%`;
                budgetStatus.classList.add('warning');
            } else {
                const deficit = totalAllocated - 100;
                budgetStatus.textContent = `Deficit: ${deficit}%`;
                budgetStatus.classList.add('danger');
            }
        }
        
        // Update total budget display if needed
        const totalBudgetElement = document.querySelector('.total-budget');
        if (totalBudgetElement) {
            totalBudgetElement.innerHTML = `Annual Budget: <strong>$${this.totalBudget}B</strong>`;
        }
    }

    validateBudgetBalance() {
        const totalAllocated = Object.values(this.currentAllocation).reduce((sum, val) => sum + val, 0);
        
        if (totalAllocated > 100) {
            // Budget is over 100%, need to adjust
            this.autoBalanceBudget();
        }
    }

    autoBalanceBudget() {
        const totalAllocated = Object.values(this.currentAllocation).reduce((sum, val) => sum + val, 0);
        
        if (totalAllocated > 100) {
            const excess = totalAllocated - 100;
            const categories = Object.keys(this.currentAllocation);
            
            // Proportionally reduce allocations
            categories.forEach(category => {
                const currentValue = this.currentAllocation[category];
                const reduction = Math.round((currentValue / totalAllocated) * excess);
                const newValue = Math.max(this.categories[category].min, currentValue - reduction);
                
                this.currentAllocation[category] = newValue;
                this.updateCategoryDisplay(category);
            });
            
            this.updateBudgetSummary();
        }
    }

    resetToDefaults() {
        Object.keys(this.categories).forEach(category => {
            this.currentAllocation[category] = this.categories[category].default;
            this.updateCategoryDisplay(category);
        });
        
        this.updateBudgetSummary();
        
        // Visual feedback
        this.showNotification('Budget reset to default allocation');
    }

    applyBudgetChanges() {
        if (!this.gameState) return;
        
        // Apply budget changes to game state and metrics
        this.updateGameMetrics();
        
        // Visual feedback
        this.showNotification('Budget changes applied successfully');
        
        // Log the change
        console.log('Budget allocation applied:', this.currentAllocation);
    }

    updateGameMetrics() {
        if (!this.gameState) return;
        
        // Calculate metric impacts based on budget allocation
        const impacts = this.calculateBudgetImpacts();
        
        // Apply impacts to game metrics (this would integrate with the scoring system)
        Object.entries(impacts).forEach(([metric, impact]) => {
            // This would integrate with the actual scoring system
            console.log(`Budget impact: ${metric} ${impact > 0 ? '+' : ''}${impact}`);
        });
    }

    calculateBudgetImpacts() {
        const impacts = {};
        
        // Education budget impacts
        const education = this.currentAllocation.education;
        impacts.educationQuality = (education - 20) * 2; // Base 20%, 2 points per percent
        impacts.socialMobility = (education - 20) * 1.5;
        
        // Healthcare budget impacts
        const healthcare = this.currentAllocation.healthcare;
        impacts.healthcareAccess = (healthcare - 18) * 2.5;
        impacts.publicHealth = (healthcare - 18) * 2;
        
        // Military budget impacts
        const military = this.currentAllocation.military;
        impacts.nationalSecurity = (military - 15) * 3;
        impacts.borderSecurity = (military - 15) * 2.5;
        
        // Infrastructure budget impacts
        const infrastructure = this.currentAllocation.infrastructure;
        impacts.economicGrowth = (infrastructure - 20) * 1.5;
        impacts.transportationQuality = (infrastructure - 20) * 3;
        
        // Environment budget impacts
        const environment = this.currentAllocation.environment;
        impacts.environmentalQuality = (environment - 12) * 4;
        impacts.sustainabilityPractices = (environment - 12) * 3;
        
        // Social services budget impacts
        const social = this.currentAllocation.social;
        impacts.incomeInequality = -(social - 15) * 2; // Negative because more spending reduces inequality
        impacts.socialCohesion = (social - 15) * 2.5;
        
        return impacts;
    }

    animateSliderChange(category) {
        const categoryElement = document.querySelector(`[data-category="${category}"]`);
        if (categoryElement) {
            categoryElement.style.transform = 'scale(1.02)';
            setTimeout(() => {
                categoryElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    showNotification(message) {
        // Create or update notification
        let notification = document.querySelector('.budget-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'budget-notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateAllDisplays() {
        Object.keys(this.categories).forEach(category => {
            this.updateCategoryDisplay(category);
        });
        this.updateBudgetSummary();
    }

    // Method to automatically adjust budget based on policy decisions
    adjustBudgetFromPolicy(policyImpacts) {
        let changed = false;
        
        Object.entries(policyImpacts).forEach(([category, adjustment]) => {
            if (this.categories[category]) {
                const oldValue = this.currentAllocation[category];
                const newValue = Math.max(
                    this.categories[category].min,
                    Math.min(this.categories[category].max, oldValue + adjustment)
                );
                
                if (newValue !== oldValue) {
                    this.currentAllocation[category] = newValue;
                    changed = true;
                }
            }
        });
        
        if (changed) {
            this.validateBudgetBalance();
            this.updateAllDisplays();
            this.showNotification('Budget automatically adjusted based on policy decisions');
        }
    }

    // Get current budget allocation for external systems
    getCurrentAllocation() {
        return { ...this.currentAllocation };
    }

    // Get budget category info
    getCategoryInfo(category) {
        return this.categories[category];
    }
}

// Export for use in main game
export { BudgetSystem }; 