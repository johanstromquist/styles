// Game Progression and Crisis Timing Logic
// Manages timeline advancement and phase transitions

class TimelineManager {
    constructor() {
        this.gameState = null;
        this.crisisManager = null;
        this.scoringSystem = null;
        this.phases = {
            'foundation': { name: 'Foundation', years: [1, 2, 3], description: 'Building the foundations of your nation' },
            'growth': { name: 'Growth', years: [4, 5, 6, 7, 8, 9, 10], description: 'Expanding and developing your society' },
            'maturity': { name: 'Maturity', years: [11, 12, 13, 14, 15, 16, 17], description: 'Managing a mature and complex nation' },
            'legacy': { name: 'Legacy', years: [18, 19, 20], description: 'Cementing your lasting impact' }
        };
        this.crisisSchedule = [];
        this.lastCrisisYear = 0;
        this.minCrisisInterval = 2; // Minimum years between crises
        this.maxCrisisInterval = 4; // Maximum years between crises
    }
    
    // Initialize timeline manager
    async init(gameState, crisisManager, scoringSystem) {
        this.gameState = gameState;
        this.crisisManager = crisisManager;
        this.scoringSystem = scoringSystem;
        
        // Initialize crisis schedule if not already set
        if (this.gameState.crisisSchedule.length === 0) {
            this.generateCrisisSchedule();
        } else {
            this.crisisSchedule = this.gameState.crisisSchedule;
        }
        
        console.log('Timeline manager initialized');
        this.logCurrentStatus();
    }
    
    // Generate crisis schedule for the entire 20-year timeline
    generateCrisisSchedule() {
        this.crisisSchedule = [];
        
        // Calculate total number of crises (approximately 1 every 2-3 years)
        const totalCrises = Math.floor(20 / 2.5); // About 8 crises over 20 years
        
        // Generate crisis years with some randomness but ensuring good distribution
        const crisisYears = [];
        let currentYear = Math.floor(Math.random() * 3) + 2; // Start between years 2-4
        
        while (currentYear <= 18 && crisisYears.length < totalCrises) {
            crisisYears.push(currentYear);
            // Add 2-4 years for next crisis
            currentYear += this.minCrisisInterval + Math.floor(Math.random() * (this.maxCrisisInterval - this.minCrisisInterval + 1));
        }
        
        // Create crisis schedule with 40% random, 60% consequence-driven distribution
        crisisYears.forEach((year, index) => {
            const isRandom = Math.random() < 0.4; // 40% chance of random crisis
            this.crisisSchedule.push({
                year: year,
                type: isRandom ? 'random' : 'consequence',
                triggered: false,
                phase: this.getPhaseForYear(year)
            });
        });
        
        // Save to game state
        this.gameState.crisisSchedule = this.crisisSchedule;
        
        console.log('Crisis schedule generated:', this.crisisSchedule);
    }
    
    // Advance timeline to next year
    async advanceTimeline() {
        const previousYear = this.gameState.currentYear;
        const previousPhase = this.gameState.currentPhase;
        
        // Advance year
        this.gameState.advanceYear();
        
        console.log(`Timeline advanced from year ${previousYear} to year ${this.gameState.currentYear}`);
        
        // Check for phase transition
        const newPhase = this.getPhaseForYear(this.gameState.currentYear);
        if (newPhase !== previousPhase) {
            await this.handlePhaseTransition(previousPhase, newPhase);
        }
        
        // Check for scheduled crises
        await this.checkForScheduledCrisis();
        
        // Update UI to reflect timeline changes
        this.updateTimelineUI();
        
        // Log timeline status
        this.logCurrentStatus();
        
        return {
            year: this.gameState.currentYear,
            phase: this.gameState.currentPhase,
            phaseChanged: newPhase !== previousPhase
        };
    }
    
    // Handle phase transition
    async handlePhaseTransition(fromPhase, toPhase) {
        console.log(`Phase transition: ${fromPhase} → ${toPhase}`);
        
        this.gameState.currentPhase = toPhase;
        
        // Log phase transition event
        this.gameState.logEvent('phase_transition', {
            fromPhase: fromPhase,
            toPhase: toPhase,
            year: this.gameState.currentYear
        });
        
        // Show phase transition notification
        this.showPhaseTransitionNotification(toPhase);
        
        // Trigger any phase-specific events or adjustments
        await this.handlePhaseSpecificEvents(toPhase);
    }
    
    // Handle phase-specific events
    async handlePhaseSpecificEvents(phase) {
        switch (phase) {
            case 'growth':
                // Growth phase: Increase complexity of decisions
                console.log('Entering Growth phase - decisions become more complex');
                break;
            case 'maturity':
                // Maturity phase: Focus on long-term consequences
                console.log('Entering Maturity phase - long-term consequences become more important');
                break;
            case 'legacy':
                // Legacy phase: Final major decisions
                console.log('Entering Legacy phase - final major decisions shape your lasting impact');
                break;
        }
    }
    
    // Check for scheduled crisis
    async checkForScheduledCrisis() {
        const currentYear = this.gameState.currentYear;
        const scheduledCrisis = this.crisisSchedule.find(c => c.year === currentYear && !c.triggered);
        
        if (scheduledCrisis) {
            console.log(`Scheduled crisis triggered for year ${currentYear}:`, scheduledCrisis);
            
            // Mark crisis as triggered
            scheduledCrisis.triggered = true;
            
            // Trigger crisis through crisis manager
            if (this.crisisManager) {
                await this.crisisManager.triggerScheduledCrisis(scheduledCrisis);
            }
            
            return true;
        }
        
        return false;
    }
    
    // Get phase for a specific year
    getPhaseForYear(year) {
        if (year >= 1 && year <= 3) return 'foundation';
        if (year >= 4 && year <= 10) return 'growth';
        if (year >= 11 && year <= 17) return 'maturity';
        if (year >= 18 && year <= 20) return 'legacy';
        return 'foundation'; // Default fallback
    }
    
    // Get current phase information
    getCurrentPhaseInfo() {
        const currentPhase = this.gameState.currentPhase.toLowerCase();
        return {
            ...this.phases[currentPhase],
            progress: this.getPhaseProgress(),
            remainingYears: this.getRemainingYearsInPhase()
        };
    }
    
    // Get progress within current phase (0-1)
    getPhaseProgress() {
        const phaseInfo = this.phases[this.gameState.currentPhase.toLowerCase()];
        const phaseYears = phaseInfo.years;
        const currentYear = this.gameState.currentYear;
        
        const yearIndex = phaseYears.indexOf(currentYear);
        if (yearIndex === -1) return 0;
        
        return (yearIndex + 1) / phaseYears.length;
    }
    
    // Get remaining years in current phase
    getRemainingYearsInPhase() {
        const phaseInfo = this.phases[this.gameState.currentPhase.toLowerCase()];
        const phaseYears = phaseInfo.years;
        const currentYear = this.gameState.currentYear;
        
        const yearIndex = phaseYears.indexOf(currentYear);
        if (yearIndex === -1) return 0;
        
        return phaseYears.length - yearIndex - 1;
    }
    
    // Get upcoming crises
    getUpcomingCrises(lookAhead = 5) {
        const currentYear = this.gameState.currentYear;
        return this.crisisSchedule.filter(crisis => 
            crisis.year > currentYear && 
            crisis.year <= currentYear + lookAhead &&
            !crisis.triggered
        );
    }
    
    // Show phase transition notification
    showPhaseTransitionNotification(newPhase) {
        const phaseInfo = this.phases[newPhase];
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'phase-transition-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>New Phase: ${phaseInfo.name}</h3>
                <p>${phaseInfo.description}</p>
                <div class="phase-years">Years ${phaseInfo.years[0]}-${phaseInfo.years[phaseInfo.years.length - 1]}</div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            z-index: 1003;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            animation: phaseTransitionFade 4s ease-in-out;
        `;
        
        // Add animation keyframes if not already present
        if (!document.querySelector('#phase-transition-styles')) {
            const style = document.createElement('style');
            style.id = 'phase-transition-styles';
            style.textContent = `
                @keyframes phaseTransitionFade {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    // Update timeline UI elements
    updateTimelineUI() {
        // Update year display
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = this.gameState.currentYear;
        }
        
        // Update phase display
        const phaseElement = document.getElementById('current-phase');
        if (phaseElement) {
            const phaseInfo = this.getCurrentPhaseInfo();
            phaseElement.textContent = phaseInfo.name;
        }
        
        // Update progress bar
        const progressElement = document.getElementById('timeline-progress');
        if (progressElement) {
            const overallProgress = (this.gameState.currentYear - 1) / 19 * 100;
            progressElement.style.width = `${overallProgress}%`;
        }
        
        // Update phase progress
        const phaseProgressElement = document.getElementById('phase-progress');
        if (phaseProgressElement) {
            const phaseProgress = this.getPhaseProgress() * 100;
            phaseProgressElement.style.width = `${phaseProgress}%`;
        }
    }
    
    // Log current timeline status
    logCurrentStatus() {
        const phaseInfo = this.getCurrentPhaseInfo();
        console.log(`Timeline Status - Year: ${this.gameState.currentYear}, Phase: ${phaseInfo.name}, Progress: ${Math.round(phaseInfo.progress * 100)}%`);
        
        const upcomingCrises = this.getUpcomingCrises();
        if (upcomingCrises.length > 0) {
            console.log('Upcoming crises:', upcomingCrises);
        }
    }
    
    // Get timeline statistics
    getTimelineStats() {
        const phaseInfo = this.getCurrentPhaseInfo();
        const totalCrises = this.crisisSchedule.length;
        const triggeredCrises = this.crisisSchedule.filter(c => c.triggered).length;
        const upcomingCrises = this.getUpcomingCrises();
        
        return {
            currentYear: this.gameState.currentYear,
            currentPhase: phaseInfo.name,
            phaseProgress: phaseInfo.progress,
            remainingYears: 20 - this.gameState.currentYear,
            totalCrises: totalCrises,
            triggeredCrises: triggeredCrises,
            upcomingCrises: upcomingCrises.length,
            overallProgress: (this.gameState.currentYear - 1) / 19
        };
    }
    
    // Reset timeline (for new game)
    reset() {
        this.crisisSchedule = [];
        this.lastCrisisYear = 0;
        console.log('Timeline manager reset');
    }
    
    // Cleanup
    destroy() {
        this.gameState = null;
        this.crisisManager = null;
        this.scoringSystem = null;
        this.crisisSchedule = [];
        console.log('Timeline manager destroyed');
    }
}

export { TimelineManager }; 