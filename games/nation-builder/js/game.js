// Core Game Logic and State Management
// Main orchestrator for the Nation Builder educational game

import { QuestionEngine } from './questionEngine.js';
import { ScenarioEngine } from './scenarios.js';
import { CrisisManager } from './crises.js';
import { OutcomeManager } from './outcomes.js';
import { TimelineManager } from './timeline.js';
import { ScoringSystem } from './scoring.js';
import { CitizenStories } from './citizenStories.js';
import { EndGameAnalysis } from './endGameAnalysis.js';
import { LLMIntegration } from './llmIntegration.js';
import { CityVisualization } from './cityVisualization.js';
import { dataManager } from './dataManager.js';
import { performanceOptimizer } from './performanceOptimizer.js';
import { TopMetrics } from './topMetrics.js';
import { BudgetSystem } from './budgetSystem.js';
import { SocietyVisualization } from './societyVisualization.js';

class GameState {
    constructor() {
        // Core game state
        this.currentYear = 1;
        this.currentPhase = 'Foundation'; // Foundation, Growth, Maturity, Legacy
        this.gameStarted = false;
        this.gameCompleted = false;
        this.gameId = this.generateGameId();
        
        // Decision tracking
        this.decisionHistory = [];
        this.totalDecisions = 0;
        this.currentDecisionId = null;
        
        // Phase management based on README specification
        this.phases = {
            'Foundation': { start: 1, end: 3, description: 'Establishing basic systems' },
            'Growth': { start: 4, end: 10, description: 'Implementing and refining policies' },
            'Maturity': { start: 11, end: 17, description: 'Complex policy challenges' },
            'Legacy': { start: 18, end: 20, description: 'Final major decisions and transition' }
        };
        
        // Policy escalation tracks (generic, not ideology-specific)
        this.policyEscalationTracks = {
            state_authority: 0,
            market_freedom: 0,
            wealth_redistribution: 0,
            environmental_protection: 0,
            social_equality: 0,
            traditional_stability: 0
        };
        
        // Crisis system state
        this.lastCrisisYear = 0;
        this.crisisCount = 0;
        this.totalCrises = 0;
        this.crisisHistory = [];
        this.crisisSchedule = []; // Timeline crisis schedule
        
        // Game statistics
        this.startTime = new Date().toISOString();
        this.lastSaved = null;
        this.totalPlayTime = 0;
        this.sessionStartTime = Date.now();
        
        // State validation
        this.version = '1.0';
        this.isValid = true;
        this.validationErrors = [];
        
        // Auto-save settings
        this.autoSaveEnabled = true;
        this.autoSaveInterval = 30000; // 30 seconds
    }
    
    // Generate unique game ID
    generateGameId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Update game phase based on current year
    updatePhase() {
        const oldPhase = this.currentPhase;
        
        for (const [phaseName, phaseData] of Object.entries(this.phases)) {
            if (this.currentYear >= phaseData.start && this.currentYear <= phaseData.end) {
                this.currentPhase = phaseName;
                break;
            }
        }
        
        // Log phase transitions
        if (oldPhase !== this.currentPhase) {
            console.log(`Phase transition: ${oldPhase} → ${this.currentPhase} (Year ${this.currentYear})`);
            this.logEvent('phase_transition', {
                from: oldPhase,
                to: this.currentPhase,
                year: this.currentYear
            });
        }
    }
    
    // Add decision to history with full context and validation
    addDecision(decision) {
        // Validate decision structure
        if (!this.validateDecision(decision)) {
            console.error('Invalid decision structure:', decision);
            return false;
        }
        
        const decisionRecord = {
            id: this.currentDecisionId || `decision_${this.totalDecisions + 1}`,
            year: this.currentYear,
            phase: this.currentPhase,
            decision: decision,
            timestamp: new Date().toISOString(),
            policyTracksBefore: {...this.policyEscalationTracks},
            decisionNumber: this.totalDecisions + 1
        };
        
        this.decisionHistory.push(decisionRecord);
        this.totalDecisions++;
        
        this.logEvent('decision_made', {
            decisionId: decisionRecord.id,
            domain: decision.domain,
            year: this.currentYear
        });
        
        return true;
    }
    
    // Add crisis to history
    addCrisis(crisis, response) {
        const crisisRecord = {
            id: crisis.id,
            year: this.currentYear,
            phase: this.currentPhase,
            crisis: crisis,
            response: response,
            timestamp: new Date().toISOString(),
            type: crisis.source || 'unknown'
        };
        
        this.crisisHistory.push(crisisRecord);
        this.logEvent('crisis_resolved', {
            crisisId: crisis.id,
            responseId: response.id,
            year: this.currentYear
        });
    }
    
    // Advance to next year with validation
    advanceYear() {
        if (this.currentYear >= 20) {
            this.gameCompleted = true;
            this.logEvent('game_completed', { finalYear: this.currentYear });
            return false;
        }
        
        this.currentYear++;
        this.updatePhase();
        this.updatePlayTime();
        
        this.logEvent('year_advanced', { year: this.currentYear, phase: this.currentPhase });
        return true;
    }
    
    // Update total play time
    updatePlayTime() {
        const now = Date.now();
        this.totalPlayTime += now - this.sessionStartTime;
        this.sessionStartTime = now;
    }
    
    // Log game events for analytics
    logEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            year: this.currentYear,
            phase: this.currentPhase,
            data: data
        };
        
        // In a real implementation, this could send to analytics
        console.log('Game Event:', event);
    }
    
    // Validate decision structure
    validateDecision(decision) {
        const requiredFields = ['choiceText'];
        
        for (const field of requiredFields) {
            if (!decision.hasOwnProperty(field)) {
                this.validationErrors.push(`Missing required field: ${field}`);
                return false;
            }
        }
        
        return true;
    }
    
    // Validate game state integrity
    validateState() {
        this.validationErrors = [];
        this.isValid = true;
        
        // Check year bounds
        if (this.currentYear < 1 || this.currentYear > 20) {
            this.validationErrors.push(`Invalid year: ${this.currentYear}`);
            this.isValid = false;
        }
        
        // Check phase consistency
        const expectedPhase = this.getExpectedPhase(this.currentYear);
        if (this.currentPhase !== expectedPhase) {
            this.validationErrors.push(`Phase mismatch: expected ${expectedPhase}, got ${this.currentPhase}`);
            this.isValid = false;
        }
        
        // Check policy track bounds
        for (const [track, value] of Object.entries(this.policyEscalationTracks)) {
            if (value < 0 || value > 100) {
                this.validationErrors.push(`Policy track ${track} out of bounds: ${value}`);
                this.isValid = false;
            }
        }
        
        // Check decision history consistency
        if (this.decisionHistory.length !== this.totalDecisions) {
            this.validationErrors.push(`Decision count mismatch: history=${this.decisionHistory.length}, total=${this.totalDecisions}`);
            this.isValid = false;
        }
        
        // Check crisis timing
        if (this.lastCrisisYear > this.currentYear) {
            this.validationErrors.push(`Last crisis year (${this.lastCrisisYear}) is in the future`);
            this.isValid = false;
        }
        
        if (!this.isValid) {
            console.warn('Game state validation failed:', this.validationErrors);
        }
        
        return this.isValid;
    }
    
    // Get expected phase for a given year
    getExpectedPhase(year) {
        for (const [phaseName, phaseData] of Object.entries(this.phases)) {
            if (year >= phaseData.start && year <= phaseData.end) {
                return phaseName;
            }
        }
        return 'Unknown';
    }
    
    // Repair invalid state where possible
    repairState() {
        let repaired = false;
        
        // Fix year bounds
        if (this.currentYear < 1) {
            this.currentYear = 1;
            repaired = true;
        } else if (this.currentYear > 20) {
            this.currentYear = 20;
            this.gameCompleted = true;
            repaired = true;
        }
        
        // Fix phase consistency
        const expectedPhase = this.getExpectedPhase(this.currentYear);
        if (this.currentPhase !== expectedPhase) {
            this.currentPhase = expectedPhase;
            repaired = true;
        }
        
        // Fix policy track bounds
        for (const [track, value] of Object.entries(this.policyEscalationTracks)) {
            if (value < 0) {
                this.policyEscalationTracks[track] = 0;
                repaired = true;
            } else if (value > 100) {
                this.policyEscalationTracks[track] = 100;
                repaired = true;
            }
        }
        
        // Fix decision count
        if (this.totalDecisions !== this.decisionHistory.length) {
            this.totalDecisions = this.decisionHistory.length;
            repaired = true;
        }
        
        // Fix crisis timing
        if (this.lastCrisisYear > this.currentYear) {
            this.lastCrisisYear = 0;
            repaired = true;
        }
        
        if (repaired) {
            console.log('Game state repaired');
            this.logEvent('state_repaired');
        }
        
        return repaired;
    }
    
    // Get game statistics
    getStatistics() {
        return {
            gameId: this.gameId,
            currentYear: this.currentYear,
            currentPhase: this.currentPhase,
            totalDecisions: this.totalDecisions,
            totalCrises: this.totalCrises,
            totalPlayTime: this.totalPlayTime + (Date.now() - this.sessionStartTime),
            startTime: this.startTime,
            gameCompleted: this.gameCompleted,
            decisionsPerYear: this.totalDecisions / this.currentYear,
            crisesPerYear: this.totalCrises / this.currentYear
        };
    }
    
    // Get policy escalation summary
    getPolicyEscalationSummary() {
        const summary = {};
        for (const [track, value] of Object.entries(this.policyEscalationTracks)) {
            summary[track] = {
                value: value,
                level: this.getPolicyLevel(value),
                trend: this.getPolicyTrend(track)
            };
        }
        return summary;
    }
    
    // Get policy level description
    getPolicyLevel(value) {
        if (value >= 80) return 'Very High';
        if (value >= 60) return 'High';
        if (value >= 40) return 'Moderate';
        if (value >= 20) return 'Low';
        return 'Very Low';
    }
    
    // Get policy trend (simplified)
    getPolicyTrend(track) {
        // In a more sophisticated implementation, this would track changes over time
        return 'stable';
    }
    
    // Serialize state for saving with enhanced error handling
    serialize() {
        try {
            this.updatePlayTime();
            
            const serializedState = {
                version: this.version,
                gameId: this.gameId,
                currentYear: this.currentYear,
                currentPhase: this.currentPhase,
                gameStarted: this.gameStarted,
                gameCompleted: this.gameCompleted,
                decisionHistory: this.decisionHistory,
                totalDecisions: this.totalDecisions,
                policyEscalationTracks: this.policyEscalationTracks,
                lastCrisisYear: this.lastCrisisYear,
                crisisCount: this.crisisCount,
                totalCrises: this.totalCrises,
                crisisHistory: this.crisisHistory,
                startTime: this.startTime,
                totalPlayTime: this.totalPlayTime,
                lastSaved: new Date().toISOString(),
                autoSaveEnabled: this.autoSaveEnabled
            };
            
            // Validate before serializing
            if (!this.validateState()) {
                console.warn('Serializing invalid state');
            }
            
            return serializedState;
        } catch (error) {
            console.error('Failed to serialize game state:', error);
            throw new Error('State serialization failed');
        }
    }
    
    // Restore state from saved data with validation and repair
    deserialize(data) {
        try {
            // Check version compatibility
            if (data.version && data.version !== this.version) {
                console.warn(`Version mismatch: saved=${data.version}, current=${this.version}`);
            }
            
            // Restore core properties
            Object.assign(this, data);
            
            // Ensure required properties exist
            this.gameId = this.gameId || this.generateGameId();
            this.crisisHistory = this.crisisHistory || [];
            this.validationErrors = [];
            this.sessionStartTime = Date.now();
            
            // Update phase consistency
            this.updatePhase();
            
            // Validate and repair if necessary
            if (!this.validateState()) {
                console.log('Loaded state is invalid, attempting repair...');
                this.repairState();
                
                // Re-validate after repair
                if (!this.validateState()) {
                    throw new Error('Unable to repair invalid game state');
                }
            }
            
            this.logEvent('state_loaded', { gameId: this.gameId });
            console.log('Game state successfully loaded and validated');
            
        } catch (error) {
            console.error('Failed to deserialize game state:', error);
            throw new Error('State deserialization failed');
        }
    }
    
    // Create a backup of current state
    createBackup() {
        return JSON.stringify(this.serialize());
    }
    
    // Restore from backup
    restoreFromBackup(backupString) {
        try {
            const backupData = JSON.parse(backupString);
            this.deserialize(backupData);
            return true;
        } catch (error) {
            console.error('Failed to restore from backup:', error);
            return false;
        }
    }
    
    // Reset to initial state
    reset() {
        const newState = new GameState();
        Object.assign(this, newState);
        this.logEvent('game_reset');
    }
}

class NationBuilderGame {
    constructor() {
        this.gameState = new GameState();
        this.questionEngine = null;
        this.scenarioManager = null;
        this.crisisManager = null;
        this.outcomeManager = null;
        this.timelineManager = null;
        this.scoringSystem = null;
        this.citizenStories = null;
        this.endGameAnalysis = null;
        this.llmIntegration = null;
        this.cityVisualization = null;
        
        // New visual interface modules
        this.topMetrics = null;
        this.budgetSystem = null;
        
        // DOM elements
        this.elements = {};
        
        // Event listeners
        this.eventListeners = new Map();
        
        // Auto-save interval
        this.autoSaveInterval = null;
        
        // Error handling
        this.errorCount = 0;
        this.maxErrors = 10;
    }
    
    // Initialize the game with enhanced error handling
    async init() {
        try {
            console.log('Initializing Nation Builder Game...');
            
            // Initialize performance optimizer first
            await performanceOptimizer.initialize();
            
            // Initialize data manager first (REQUIRED per Feature 12)
            await dataManager.initialize();
            
            // Cache DOM elements
            this.cacheElements();
            
            // Initialize game modules
            await this.initializeModules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Setup performance debug panel
            this.setupPerformanceDebug();
            
            // Try to load saved game
            await this.loadGame();
            
            // Set up auto-save
            this.setupAutoSave();
            
            // Update UI
            this.updateUI();
            
            // Validate initial state
            if (!this.gameState.validateState()) {
                console.warn('Initial game state validation failed');
                this.gameState.repairState();
            }
            
            console.log('Game initialization complete');
            
        } catch (error) {
            console.error('Game initialization failed:', error);
            this.handleError('Initialization failed', error);
        }
    }
    
    // Enhanced error handling
    handleError(message, error) {
        this.errorCount++;
        console.error(`Error ${this.errorCount}:`, message, error);
        
        if (this.errorCount >= this.maxErrors) {
            this.showError('Too many errors occurred. The game will reset.');
            this.resetGame();
            return;
        }
        
        this.showError(message + '. The game will continue.');
        
        // Log error for analytics
        this.gameState.logEvent('error_occurred', {
            message: message,
            error: error.message,
            stack: error.stack
        });
    }
    
    // Cache frequently used DOM elements
    cacheElements() {
        this.elements = {
            // Timeline elements
            currentYear: document.getElementById('current-year'),
            currentPhase: document.getElementById('current-phase'),
            timelineProgress: document.getElementById('timeline-progress'),
            
            // Decision interface
            decisionTitle: document.getElementById('decision-title'),
            decisionDescription: document.getElementById('decision-description'),
            decisionContext: document.getElementById('decision-context'),
            choicesContainer: document.getElementById('choices-container'),
            decisionCounter: document.getElementById('decision-counter'),
            
            // Navigation buttons
            saveGame: document.getElementById('save-game'),
            loadGame: document.getElementById('load-game'),
            resetGame: document.getElementById('reset-game'),
            startGame: document.getElementById('start-game'),
            help: document.getElementById('help'),
            
            // Dashboard
            dashboard: document.getElementById('dashboard'),
            
            // Overlays
            crisisOverlay: document.getElementById('crisis-overlay'),
            storyModal: document.getElementById('story-modal'),
            resultsSection: document.getElementById('results-section'),
            loadingOverlay: document.getElementById('loading-overlay')
        };
    }
    
    // Initialize all game modules
    async initializeModules() {
        this.questionEngine = new QuestionEngine();
        this.scenarioManager = new ScenarioEngine();
        this.crisisManager = new CrisisManager();
        this.outcomeManager = new OutcomeManager();
        this.timelineManager = new TimelineManager();
        this.scoringSystem = new ScoringSystem();
        this.citizenStories = new CitizenStories();
        this.endGameAnalysis = new EndGameAnalysis();
        this.llmIntegration = new LLMIntegration();
        this.cityVisualization = new CityVisualization();
        
        // Initialize modules with game state reference
        await Promise.all([
            this.questionEngine.init(this.gameState),
            this.scenarioManager.init(this.gameState),
            this.scoringSystem.init(this.gameState),
            this.outcomeManager.init(this.gameState)
        ]);
        
        // Initialize timeline manager after crisis manager is ready (needs crisis manager reference)
        await this.crisisManager.init(this.gameState, this.scoringSystem);
        await this.timelineManager.init(this.gameState, this.crisisManager, this.scoringSystem);
        
        // Initialize LLM integration after scoring system is ready
        await this.llmIntegration.init(this.gameState, this.scoringSystem, this.endGameAnalysis);
        
        // Initialize citizen stories after scoring system is ready
        await this.citizenStories.init(this.gameState, this.scoringSystem);
        
        // Initialize end game analysis after scoring system is ready
        await this.endGameAnalysis.init(this.gameState, this.scoringSystem);
        
        // Initialize city visualization after scoring system is ready
        await this.cityVisualization.init(this.gameState, this.scoringSystem);
        
        // Initialize new visual interface systems
        this.topMetrics = new TopMetrics();
        this.budgetSystem = new BudgetSystem();
        this.societyVisualization = new SocietyVisualization();
        
        // Initialize the new systems after scoring system is ready
        await this.topMetrics.init(this.gameState);
        await this.budgetSystem.init(this.gameState);
        await this.societyVisualization.init(this.gameState, this.scoringSystem);
        console.log('Society visualization system initialized');
        
        // Connect scoring system to outcome manager
        this.outcomeManager.setScoringSystem(this.scoringSystem);
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Navigation buttons
        this.addEventListener(this.elements.saveGame, 'click', () => this.saveGame());
        this.addEventListener(this.elements.loadGame, 'click', () => this.loadGame());
        this.addEventListener(this.elements.resetGame, 'click', () => this.resetGame());
        this.addEventListener(this.elements.startGame, 'click', () => this.startGame());
        this.addEventListener(this.elements.help, 'click', () => this.showHelp());
        
        // AI Settings button
        const aiSettingsBtn = document.getElementById('ai-settings');
        if (aiSettingsBtn) {
            this.addEventListener(aiSettingsBtn, 'click', () => this.showAISettings());
        }
        
        // Window events
        this.addEventListener(window, 'beforeunload', () => this.saveGame());
        this.addEventListener(window, 'unload', () => this.saveGame());
        
        // Keyboard shortcuts
        this.addEventListener(document, 'keydown', (e) => this.handleKeyboard(e));
        
        // Error handling
        window.addEventListener('error', (e) => {
            this.handleError('JavaScript error', e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError('Unhandled promise rejection', e.reason);
        });
        
        // Setup AI settings modal
        this.setupAISettingsModal();
    }
    
    // Helper to add event listeners with cleanup tracking
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        // Track for cleanup
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler });
    }
    
    // Start a new game with enhanced validation
    async startGame() {
        try {
            this.showLoading('Starting your leadership journey...');
            
            // Create new game state
            this.gameState = new GameState();
            this.gameState.gameStarted = true;
            
            // Validate initial state
            if (!this.gameState.validateState()) {
                throw new Error('Failed to create valid initial game state');
            }
            
            // Reinitialize modules with new state
            await this.initializeModules();
            
            // Update UI
            this.updateUI();
            
            // Generate first decision
            await this.nextDecision();
            
            // Save initial state
            this.saveGame();
            
            this.hideLoading();
            
        } catch (error) {
            this.handleError('Failed to start new game', error);
            this.hideLoading();
        }
    }
    
    // Generate and present next decision
    async nextDecision() {
        try {
            if (this.gameState.gameCompleted) {
                await this.endGame();
                return;
            }
            
            this.showLoading('Preparing your next decision...');
            
            // Check for crisis event first (40% random, 60% consequence-driven)
            const shouldTriggerCrisis = this.crisisManager.shouldTriggerCrisis();
            
            if (shouldTriggerCrisis) {
                const crisis = this.crisisManager.generateCrisis();
                if (crisis) {
                    await this.presentCrisis(crisis);
                } else {
                    // Fallback to regular decision if crisis generation fails
                    const question = await this.questionEngine.generateQuestion();
                    await this.presentDecision(question);
                }
            } else {
                // Generate regular policy decision
                const question = await this.questionEngine.generateQuestion();
                await this.presentDecision(question);
            }
            
            this.hideLoading();
            
        } catch (error) {
            this.handleError('Failed to generate next decision', error);
            this.hideLoading();
        }
    }
    
    // Present a regular policy decision
    async presentDecision(question) {
        this.gameState.currentDecisionId = question.id;
        
        this.elements.decisionTitle.textContent = question.title;
        this.elements.decisionDescription.textContent = question.description;
        
        // Show context if available
        if (question.context) {
            this.elements.decisionContext.innerHTML = question.context;
            this.elements.decisionContext.style.display = 'block';
        } else {
            this.elements.decisionContext.style.display = 'none';
        }
        
        // Clear and populate choices
        this.elements.choicesContainer.innerHTML = '';
        
        question.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.onclick = () => this.makeDecision(choice, question);
            this.elements.choicesContainer.appendChild(button);
        });
        
        // Update decision counter
        this.elements.decisionCounter.textContent = 
            `Year ${this.gameState.currentYear} - Decision ${this.gameState.totalDecisions + 1}`;
    }
    
    // Handle player decision with enhanced validation
    async makeDecision(choice, question) {
        try {
            this.showLoading('Processing your decision...');
            
            // Create decision record
            const decisionData = {
                questionId: question.id,
                choiceId: choice.id,
                choiceText: choice.text,
                domain: question.domain
            };
            
            // Validate and record decision
            if (!this.gameState.addDecision(decisionData)) {
                throw new Error('Failed to record decision');
            }
            
            // Process decision impacts
            await this.scoringSystem.processDecision(choice);
            
            // Update policy escalation tracks
            if (choice.policyImpacts) {
                for (const [track, impact] of Object.entries(choice.policyImpacts)) {
                    if (this.gameState.policyEscalationTracks.hasOwnProperty(track)) {
                        this.gameState.policyEscalationTracks[track] += impact;
                        // Keep tracks bounded 0-100
                        this.gameState.policyEscalationTracks[track] = Math.max(0, 
                            Math.min(100, this.gameState.policyEscalationTracks[track]));
                    }
                }
            }
            
            // Show immediate outcomes
            await this.outcomeManager.showDecisionOutcome(choice, question);
            
            // Show citizen stories periodically
            await this.showCitizenStories();
            
            // Advance timeline
            if (!this.gameState.advanceYear()) {
                // Game completed
                await this.endGame();
                return;
            }
            
            // Update UI
            this.updateUI();
            
            // Update budget system with policy impacts if available
            if (this.budgetSystem && choice.budgetImpacts) {
                this.budgetSystem.adjustBudgetFromPolicy(choice.budgetImpacts);
            }
            
            // Auto-save
            this.saveGame();
            
            // Validate state after decision
            if (!this.gameState.validateState()) {
                console.warn('Game state invalid after decision');
                this.gameState.repairState();
            }
            
            // Generate next decision
            setTimeout(() => this.nextDecision(), 1500);
            
            this.hideLoading();
            
        } catch (error) {
            this.handleError('Failed to process decision', error);
            this.hideLoading();
        }
    }
    
    // Present a crisis event
    async presentCrisis(crisis) {
        // Show crisis overlay
        this.elements.crisisOverlay.style.display = 'flex';
        
        // Populate crisis content
        document.getElementById('crisis-title').textContent = crisis.title;
        document.getElementById('crisis-type').textContent = `${crisis.type.toUpperCase()} CRISIS`;
        document.getElementById('crisis-description').textContent = crisis.description;
        
        // Show context and urgency
        const contextElement = document.getElementById('crisis-context');
        if (crisis.context) {
            contextElement.innerHTML = crisis.context;
            contextElement.style.display = 'block';
        } else {
            contextElement.style.display = 'none';
        }
        
        // Show urgency indicator
        const urgencyElement = document.getElementById('crisis-urgency');
        if (urgencyElement) {
            urgencyElement.textContent = `URGENCY: ${crisis.urgency?.toUpperCase() || 'MEDIUM'}`;
            urgencyElement.className = `urgency-${crisis.urgency || 'medium'}`;
        }
        
        // Clear and populate crisis choices
        const choicesElement = document.getElementById('crisis-choices');
        choicesElement.innerHTML = '';
        
        crisis.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn crisis-choice';
            button.innerHTML = `
                <div class="choice-text">${choice.text}</div>
                <div class="choice-consequence">${choice.consequences}</div>
            `;
            button.onclick = () => this.handleCrisisResponse(choice, crisis, index);
            choicesElement.appendChild(button);
        });
    }
    
    // Handle crisis response with enhanced tracking
    async handleCrisisResponse(choice, crisis, choiceIndex) {
        try {
            // Hide crisis overlay
            this.elements.crisisOverlay.style.display = 'none';
            
            this.showLoading('Resolving crisis...');
            
            // Process crisis response through crisis manager
            const response = this.crisisManager.processCrisisResponse(crisis.id, choiceIndex);
            
            if (!response) {
                throw new Error('Failed to process crisis response');
            }
            
            // Record crisis response as decision
            const crisisDecision = {
                crisisId: crisis.id,
                choiceIndex: choiceIndex,
                choiceText: choice.text,
                type: 'crisis',
                crisisType: crisis.type,
                consequences: choice.consequences
            };
            
            if (!this.gameState.addDecision(crisisDecision)) {
                throw new Error('Failed to record crisis response');
            }
            
            // Add to crisis history
            this.gameState.addCrisis(crisis, response);
            
            // Update crisis tracking
            this.gameState.lastCrisisYear = this.gameState.currentYear;
            this.gameState.crisisCount++;
            this.gameState.totalCrises++;
            
            // Show crisis outcome
            await this.outcomeManager.showCrisisOutcome(response, crisis);
            
            // Continue with regular game flow
            if (!this.gameState.advanceYear()) {
                await this.endGame();
                return;
            }
            
            this.updateUI();
            this.saveGame();
            
            // Validate state after crisis
            if (!this.gameState.validateState()) {
                console.warn('Game state invalid after crisis');
                this.gameState.repairState();
            }
            
            setTimeout(() => this.nextDecision(), 2000);
            
            this.hideLoading();
            
        } catch (error) {
            this.handleError('Failed to process crisis response', error);
            this.hideLoading();
        }
    }
    
    // Update UI elements with enhanced error handling
    updateUI() {
        try {
            // Update timeline
            if (this.elements.currentYear) {
                this.elements.currentYear.textContent = this.gameState.currentYear;
            }
            if (this.elements.currentPhase) {
                this.elements.currentPhase.textContent = this.gameState.currentPhase;
            }
            
            // Update timeline progress (5% per year)
            const progress = (this.gameState.currentYear / 20) * 100;
            if (this.elements.timelineProgress) {
                this.elements.timelineProgress.style.width = `${progress}%`;
            }
            
            // Update new visual interface systems
            if (this.topMetrics && this.scoringSystem) {
                this.updateTopMetricsFromScoring();
            }
            
            // Update dashboard (legacy system)
            if (this.outcomeManager) {
                this.outcomeManager.updateDashboard();
            }
            
            // Update city visualization
            if (this.cityVisualization) {
                this.cityVisualization.updateCity();
            }
            
            // Update society visualization with current ideology analysis
            if (this.societyVisualization && this.scoringSystem) {
                const ideologyAnalysis = this.scoringSystem.getIdeologicalAnalysis();
                this.societyVisualization.updateSociety(this.gameState, ideologyAnalysis);
            }
            
        } catch (error) {
            this.handleError('Failed to update UI', error);
        }
    }

    // Update top metrics with real data from scoring system
    updateTopMetricsFromScoring() {
        if (!this.scoringSystem || !this.topMetrics) return;
        
        try {
            const currentMetrics = this.scoringSystem.getCurrentMetrics();
            
            // Map scoring system metrics to top bar metrics
            const metricMappings = {
                economy: this.calculateEconomicHealth(currentMetrics),
                society: this.calculateSocialWellbeing(currentMetrics),
                environment: this.calculateEnvironmentalQuality(currentMetrics),
                security: this.calculateSecurityStability(currentMetrics),
                governance: this.calculateGovernanceEffectiveness(currentMetrics),
                happiness: this.calculateCitizenHappiness(currentMetrics)
            };
            
            // Update each metric in the top bar
            Object.entries(metricMappings).forEach(([metricKey, value]) => {
                this.topMetrics.updateMetric(metricKey, value);
            });
            
        } catch (error) {
            console.error('Error updating top metrics:', error);
        }
    }

    // Calculate composite economic health score
    calculateEconomicHealth(metrics) {
        const economicMetrics = [
            'economicGrowth',
            'employmentRate', 
            'inflationControl',
            'fiscalStability',
            'tradeBalance'
        ];
        
        let total = 0;
        let count = 0;
        
        economicMetrics.forEach(metric => {
            if (metrics[metric] !== undefined) {
                total += metrics[metric];
                count++;
            }
        });
        
        return count > 0 ? total / count : 50;
    }

    // Calculate composite social wellbeing score
    calculateSocialWellbeing(metrics) {
        const socialMetrics = [
            'educationQuality',
            'healthcareAccess',
            'socialMobility',
            'culturalDiversity',
            'socialCohesion'
        ];
        
        let total = 0;
        let count = 0;
        
        socialMetrics.forEach(metric => {
            if (metrics[metric] !== undefined) {
                total += metrics[metric];
                count++;
            }
        });
        
        return count > 0 ? total / count : 50;
    }

    // Calculate composite environmental quality score
    calculateEnvironmentalQuality(metrics) {
        const envMetrics = [
            'airQuality',
            'waterQuality',
            'sustainabilityPractices',
            'renewableEnergy',
            'conservationEfforts'
        ];
        
        let total = 0;
        let count = 0;
        
        envMetrics.forEach(metric => {
            if (metrics[metric] !== undefined) {
                total += metrics[metric];
                count++;
            }
        });
        
        return count > 0 ? total / count : 50;
    }

    // Calculate composite security & stability score
    calculateSecurityStability(metrics) {
        const securityMetrics = [
            'nationalSecurity',
            'borderSecurity',
            'internalStability',
            'crimeRate',
            'emergencyPreparedness'
        ];
        
        let total = 0;
        let count = 0;
        
        securityMetrics.forEach(metric => {
            if (metrics[metric] !== undefined) {
                // Invert crime rate since lower is better
                const value = metric === 'crimeRate' ? 100 - metrics[metric] : metrics[metric];
                total += value;
                count++;
            }
        });
        
        return count > 0 ? total / count : 50;
    }

    // Calculate composite governance effectiveness score
    calculateGovernanceEffectiveness(metrics) {
        const govMetrics = [
            'governmentEfficiency',
            'transparencyAccountability',
            'ruleOfLaw',
            'corruptionControl',
            'publicTrust'
        ];
        
        let total = 0;
        let count = 0;
        
        govMetrics.forEach(metric => {
            if (metrics[metric] !== undefined) {
                total += metrics[metric];
                count++;
            }
        });
        
        return count > 0 ? total / count : 50;
    }

    // Calculate composite citizen happiness score
    calculateCitizenHappiness(metrics) {
        const happinessMetrics = [
            'citizenSatisfaction',
            'qualityOfLife',
            'workLifeBalance',
            'communityEngagement',
            'mentalHealthSupport'
        ];
        
        let total = 0;
        let count = 0;
        
        happinessMetrics.forEach(metric => {
            if (metrics[metric] !== undefined) {
                total += metrics[metric];
                count++;
            }
        });
        
        return count > 0 ? total / count : 50;
    }
    
    // Show citizen stories using the citizen stories system
    async showCitizenStories() {
        try {
            const stories = await this.citizenStories.getStoriesForCurrentState();
            if (stories && stories.length > 0) {
                await this.citizenStories.presentStories(stories);
            }
        } catch (error) {
            console.error('Error showing citizen stories:', error);
        }
    }
    
    // End game and show results
    async endGame() {
        try {
            this.showLoading('Analyzing your 20-year leadership...');
            
            // Generate comprehensive final analysis
            const analysis = await this.endGameAnalysis.generateFinalAnalysis();
            
            // Show results
            await this.showResults(analysis);
            
            this.hideLoading();
            
        } catch (error) {
            this.handleError('Failed to generate final analysis', error);
            this.hideLoading();
        }
    }
    
    // Show final results with comprehensive analysis
    async showResults(analysis) {
        this.elements.resultsSection.style.display = 'flex';
        
        // Populate ideological analysis
        this.populateIdeologicalAnalysis(analysis.ideologicalProfile);
        
        // Populate metrics summary
        this.populateMetricsSummary(analysis.finalMetrics, analysis.successPatterns);
        
        // Populate reflection questions
        await this.populateReflectionQuestions(analysis.reflectionQuestions);
        
        // Populate learning insights
        this.populateLearningInsights(analysis.keyLearningMoments, analysis.learningInsights);
        
        // Populate country comparisons
        this.populateCountryComparisons(analysis.countryComparisons);
        
        // Set up tab functionality
        this.setupResultsTabs();
        
        // Set up export and replay buttons
        document.getElementById('export-results').onclick = () => this.exportResults(analysis);
        document.getElementById('play-again').onclick = () => {
            this.elements.resultsSection.style.display = 'none';
            this.resetGame();
        };
    }
    
    // Populate ideological analysis section
    populateIdeologicalAnalysis(profile) {
        const container = document.getElementById('ideology-analysis');
        if (!container) return;
        
        container.innerHTML = `
            <div class="ideology-profile">
                <h3>Your Ideological Profile</h3>
                <div class="dominant-ideology">
                    <h4>${profile.dominantIdeology.charAt(0).toUpperCase() + profile.dominantIdeology.slice(1)} Leadership (${profile.dominantPercentage}%)</h4>
                    <p>${profile.ideologyDescription}</p>
                </div>
                
                <div class="ideology-breakdown">
                    <h4>Ideological Alignment Breakdown</h4>
                    <div class="ideology-bars">
                        ${Object.entries(profile.percentages).map(([ideology, percentage]) => `
                            <div class="ideology-bar">
                                <label>${ideology.charAt(0).toUpperCase() + ideology.slice(1)}</label>
                                <div class="bar-container">
                                    <div class="bar-fill" style="width: ${percentage}%"></div>
                                    <span class="percentage">${percentage}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="balance-analysis">
                    <h4>Leadership Balance</h4>
                    <p>${profile.balanceAnalysis.balanceDescription}</p>
                </div>
            </div>
        `;
    }
    
    // Populate metrics summary section
    populateMetricsSummary(metrics, successPatterns) {
        const container = document.getElementById('metrics-summary');
        if (!container) return;
        
        container.innerHTML = `
            <div class="metrics-overview">
                <h3>Final Performance Summary</h3>
                <p class="overall-assessment">${successPatterns.overallAssessment}</p>
                
                <div class="performance-highlights">
                    <div class="strengths">
                        <h4>Strengths</h4>
                        ${successPatterns.strengths.map(strength => `
                            <div class="metric-highlight success">
                                <span class="metric-name">${strength.metric}</span>
                                <span class="metric-value">${strength.value.toFixed(1)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="challenges">
                        <h4>Areas for Improvement</h4>
                        ${successPatterns.challenges.map(challenge => `
                            <div class="metric-highlight challenge">
                                <span class="metric-name">${challenge.metric}</span>
                                <span class="metric-value">${challenge.value.toFixed(1)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Populate reflection questions section
    async populateReflectionQuestions(questions) {
        const container = document.getElementById('reflection-questions');
        if (!container) return;
        
        // Create base HTML structure
        container.innerHTML = `
            <div class="reflection-section">
                <h3>Reflection Questions</h3>
                <p class="reflection-intro">Consider these questions to deepen your understanding of leadership and governance:</p>
                
                <div class="question-categories">
                    ${this.groupQuestionsByCategory(questions).map(category => `
                        <div class="question-category">
                            <h4>${category.name}</h4>
                            <div class="questions-list">
                                ${category.questions.map((q, index) => `
                                    <div class="reflection-question">
                                        <div class="question-number">${index + 1}</div>
                                        <div class="question-content">
                                            <p class="question-text">${q.question}</p>
                                            <div class="question-type">${q.type.replace('_', ' ')}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div id="ai-enhanced-reflections"></div>
            </div>
        `;
        
        // Try to generate AI-enhanced reflection questions
        if (this.llmIntegration && this.llmIntegration.isEnabled()) {
            await this.generateAIReflectionQuestions();
        }
    }
    
    // Generate AI-enhanced reflection questions
    async generateAIReflectionQuestions() {
        const aiContainer = document.getElementById('ai-enhanced-reflections');
        if (!aiContainer) return;
        
        try {
            // Show loading state
            aiContainer.innerHTML = `
                <div class="ai-enhanced-content">
                    <div class="ai-badge">🤖 AI Enhanced</div>
                    <h4>Personalized Reflection Questions</h4>
                    <div class="content-loading">
                        <span>⏳</span>
                        <span>Generating personalized questions based on your leadership journey...</span>
                    </div>
                </div>
            `;
            
            // Get analysis data for AI context
            const analysisData = {
                dominantIdeology: this.scoringSystem.getDominantIdeology(),
                strengths: this.scoringSystem.getTopPerformingMetrics(3),
                challenges: this.scoringSystem.getLowestPerformingMetrics(3),
                keyDecisions: this.gameState.decisionHistory.slice(-5), // Last 5 decisions
                gamePhase: this.gameState.currentPhase
            };
            
            // Generate AI reflections
            const aiReflections = await this.llmIntegration.generatePersonalizedReflections(analysisData);
            
            // Display AI-generated content
            if (aiReflections.type === 'ai_generated' && aiReflections.questions.length > 0) {
                aiContainer.innerHTML = `
                    <div class="ai-enhanced-content">
                        <div class="ai-badge">🤖 AI Enhanced - ${aiReflections.source}</div>
                        <h4>Personalized Reflection Questions</h4>
                        <p>These questions are tailored to your specific leadership journey:</p>
                        <div class="questions-list">
                            ${aiReflections.questions.map((question, index) => `
                                <div class="reflection-question">
                                    <div class="question-number">${index + 1}</div>
                                    <div class="question-content">
                                        <p class="question-text">${question}</p>
                                        <div class="question-type">AI Personalized</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                // Fallback content
                aiContainer.innerHTML = `
                    <div class="ai-enhanced-content">
                        <div class="ai-badge">🤖 AI Enhanced</div>
                        <h4>Additional Reflection Questions</h4>
                        <div class="questions-list">
                            ${aiReflections.questions.map((question, index) => `
                                <div class="reflection-question">
                                    <div class="question-number">${index + 1}</div>
                                    <div class="question-content">
                                        <p class="question-text">${question}</p>
                                        <div class="question-type">Standard</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="fallback-notice">
                            Using standard reflection questions. Enable AI features for personalized content.
                        </div>
                    </div>
                `;
            }
            
        } catch (error) {
            console.warn('Failed to generate AI reflection questions:', error);
            
            // Show error state
            aiContainer.innerHTML = `
                <div class="ai-enhanced-content">
                    <div class="ai-badge">🤖 AI Enhanced</div>
                    <h4>Personalized Reflection Questions</h4>
                    <div class="content-error">
                        Failed to generate personalized questions. Please check your AI configuration.
                    </div>
                </div>
            `;
        }
    }
    
    // Group questions by category
    groupQuestionsByCategory(questions) {
        const categories = {};
        questions.forEach(q => {
            if (!categories[q.category]) {
                categories[q.category] = [];
            }
            categories[q.category].push(q);
        });
        
        return Object.entries(categories).map(([name, questions]) => ({
            name,
            questions
        }));
    }
    
    // Populate learning insights section
    populateLearningInsights(keyMoments, insights) {
        const container = document.getElementById('learning-insights');
        if (!container) return;
        
        container.innerHTML = `
            <div class="learning-section">
                <h3>Key Learning Moments</h3>
                <div class="learning-moments">
                    ${keyMoments.map(moment => `
                        <div class="learning-moment ${moment.type}">
                            <h4>${moment.title}</h4>
                            <p class="moment-description">${moment.description}</p>
                            <p class="moment-insight"><strong>Insight:</strong> ${moment.insight}</p>
                        </div>
                    `).join('')}
                </div>
                
                <h3>Educational Insights</h3>
                <div class="educational-insights">
                    ${insights.map(insight => `
                        <div class="insight-item">
                            <h4>${insight.category}</h4>
                            <p class="insight-text">${insight.insight}</p>
                            <p class="insight-evidence"><em>${insight.evidence}</em></p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Populate country comparisons section
    populateCountryComparisons(comparisons) {
        const container = document.getElementById('country-comparisons');
        if (!container) return;
        
        container.innerHTML = `
            <div class="comparisons-section">
                <h3>Real-World Comparisons</h3>
                <p class="comparisons-intro">Your leadership approach has similarities to these countries:</p>
                
                <div class="country-examples">
                    ${comparisons.map(comparison => `
                        <div class="country-comparison">
                            <h4>${comparison.country}</h4>
                            <p class="country-description">${comparison.description}</p>
                            <p class="relevance"><strong>Relevance:</strong> ${comparison.relevance}</p>
                        </div>
                    `).join('')}
                </div>
                         </div>
         `;
     }
     
     // Set up results tabs functionality
     setupResultsTabs() {
         const tabButtons = document.querySelectorAll('.tab-btn');
         const tabContents = document.querySelectorAll('.tab-content');
         
         tabButtons.forEach(button => {
             button.addEventListener('click', () => {
                 const targetTab = button.getAttribute('data-tab');
                 
                 // Remove active class from all tabs and contents
                 tabButtons.forEach(btn => btn.classList.remove('active'));
                 tabContents.forEach(content => content.classList.remove('active'));
                 
                 // Add active class to clicked tab and corresponding content
                 button.classList.add('active');
                 const targetContent = document.getElementById(`${targetTab}-tab`);
                 if (targetContent) {
                     targetContent.classList.add('active');
                 }
             });
         });
     }
     
     // Enhanced save game with validation and error handling
    saveGame() {
        try {
            // Validate state before saving
            if (!this.gameState.validateState()) {
                console.warn('Attempting to save invalid state');
                this.gameState.repairState();
            }
            
            const saveData = {
                gameState: this.gameState.serialize(),
                metrics: this.scoringSystem.serialize(),
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            // Create backup before saving
            const existingSave = localStorage.getItem('nationBuilderSave');
            if (existingSave) {
                localStorage.setItem('nationBuilderSaveBackup', existingSave);
            }
            
            localStorage.setItem('nationBuilderSave', JSON.stringify(saveData));
            console.log('Game saved successfully');
            
            // Update save timestamp
            this.gameState.lastSaved = new Date().toISOString();
            
            return true;
            
        } catch (error) {
            this.handleError('Failed to save game', error);
            return false;
        }
    }
    
    // Enhanced load game with validation and recovery
    async loadGame() {
        try {
            const saveData = localStorage.getItem('nationBuilderSave');
            if (!saveData) {
                console.log('No saved game found');
                return false;
            }
            
            const parsed = JSON.parse(saveData);
            
            // Check version compatibility
            if (parsed.version && parsed.version !== '1.0') {
                console.warn(`Save version mismatch: ${parsed.version} vs 1.0`);
            }
            
            // Try to load state
            this.gameState.deserialize(parsed.gameState);
            
            // Load metrics if available
            if (parsed.metrics && this.scoringSystem) {
                this.scoringSystem.deserialize(parsed.metrics);
            }
            
            // Reinitialize modules with loaded state
            await this.initializeModules();
            
            // Update UI
            this.updateUI();
            
            console.log('Game loaded successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to load game:', error);
            
            // Try to load from backup
            try {
                const backupData = localStorage.getItem('nationBuilderSaveBackup');
                if (backupData) {
                    console.log('Attempting to load from backup...');
                    const parsed = JSON.parse(backupData);
                    this.gameState.deserialize(parsed.gameState);
                    if (parsed.metrics) {
                        this.scoringSystem.deserialize(parsed.metrics);
                    }
                    await this.initializeModules();
                    this.updateUI();
                    console.log('Game loaded from backup');
                    return true;
                }
            } catch (backupError) {
                console.error('Backup load also failed:', backupError);
            }
            
            this.handleError('Failed to load saved game', error);
            return false;
        }
    }
    
    // Reset game to initial state with confirmation
    resetGame() {
        if (confirm('Are you sure you want to start a new game? This will erase your current progress.')) {
            try {
                // Clear saved data
                localStorage.removeItem('nationBuilderSave');
                localStorage.removeItem('nationBuilderSaveBackup');
                
                // Reset game state
                this.gameState.reset();
                
                // Reinitialize
                this.init();
                
                console.log('Game reset successfully');
                
            } catch (error) {
                this.handleError('Failed to reset game', error);
                // Force reload as fallback
                location.reload();
            }
        }
    }
    
    // Set up enhanced auto-save with error handling
    setupAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        if (this.gameState.autoSaveEnabled) {
            this.autoSaveInterval = setInterval(() => {
                if (this.gameState.gameStarted && !this.gameState.gameCompleted) {
                    this.saveGame();
                }
            }, this.gameState.autoSaveInterval);
            
            console.log(`Auto-save enabled (${this.gameState.autoSaveInterval / 1000}s interval)`);
        }
    }
    
    // Export results with enhanced data
    exportResults(analysis) {
        try {
            const exportData = {
                gameState: this.gameState.serialize(),
                metrics: this.scoringSystem.serialize(),
                analysis: analysis,
                statistics: this.gameState.getStatistics(),
                policyEscalation: this.gameState.getPolicyEscalationSummary(),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], 
                { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `nation-builder-results-${this.gameState.gameId}-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            console.log('Results exported successfully');
            
        } catch (error) {
            this.handleError('Failed to export results', error);
        }
    }
    
    // Show help modal with game state info
    showHelp() {
        const stats = this.gameState.getStatistics();
        const helpText = `Nation Builder Help:

• Lead Newlandia for 20 years through policy decisions
• Your choices shape the nation and reveal your governing philosophy
• Navigate crises that test your principles
• Watch the city evolve based on your decisions
• Your game auto-saves, but you can manually save/load as well

Current Game Status:
• Year: ${stats.currentYear}/20 (${stats.currentPhase} phase)
• Decisions made: ${stats.totalDecisions}
• Crises faced: ${stats.totalCrises}
• Play time: ${Math.round(stats.totalPlayTime / 60000)} minutes

Educational Goal: Experience how different approaches to governance 
create different types of societies.`;
        
        alert(helpText);
    }
    
    // Handle keyboard shortcuts
    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveGame();
                    break;
                case 'r':
                    e.preventDefault();
                    this.resetGame();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showHelp();
                    break;
            }
        }
    }
    
    // Show loading overlay
    showLoading(message = 'Loading...') {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'flex';
            const loadingText = document.getElementById('loading-text');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
    }
    
    // Hide loading overlay
    hideLoading() {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.style.display = 'none';
        }
    }
    
    // Show error message
    showError(message) {
        alert('Error: ' + message);
    }
    
    // Setup AI Settings Modal
    setupAISettingsModal() {
        // Get modal elements
        const modal = document.getElementById('ai-settings-modal');
        const providerSelect = document.getElementById('ai-provider-select');
        const apiKeyInput = document.getElementById('api-key-input');
        const toggleApiKey = document.getElementById('toggle-api-key');
        const consentCheckbox = document.getElementById('ai-consent-checkbox');
        const testConnectionBtn = document.getElementById('test-ai-connection');
        const saveConfigBtn = document.getElementById('save-ai-config');
        const resetUsageBtn = document.getElementById('reset-ai-usage');
        const disableAIBtn = document.getElementById('disable-ai');
        const apiKeyHelp = document.getElementById('api-key-help');
        
        // Update help text based on provider
        if (providerSelect && apiKeyHelp) {
            providerSelect.addEventListener('change', (e) => {
                const provider = e.target.value;
                switch (provider) {
                    case 'openai':
                        apiKeyHelp.innerHTML = 'Get your OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a>';
                        break;
                    case 'anthropic':
                        apiKeyHelp.innerHTML = 'Get your Anthropic API key from <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>';
                        break;
                    case 'local':
                        apiKeyHelp.innerHTML = 'Make sure Ollama is running locally on <a href="http://localhost:11434" target="_blank">localhost:11434</a>';
                        break;
                }
            });
        }
        
        // Toggle API key visibility
        if (toggleApiKey && apiKeyInput) {
            toggleApiKey.addEventListener('click', () => {
                const isPassword = apiKeyInput.type === 'password';
                apiKeyInput.type = isPassword ? 'text' : 'password';
                toggleApiKey.textContent = isPassword ? '🙈' : '👁️';
            });
        }
        
        // Enable/disable buttons based on form state
        const updateButtonStates = () => {
            const hasApiKey = apiKeyInput?.value.trim().length > 0;
            const hasConsent = consentCheckbox?.checked;
            const canTest = hasApiKey;
            const canSave = hasApiKey && hasConsent;
            
            if (testConnectionBtn) testConnectionBtn.disabled = !canTest;
            if (saveConfigBtn) saveConfigBtn.disabled = !canSave;
        };
        
        // Form validation
        if (apiKeyInput) apiKeyInput.addEventListener('input', updateButtonStates);
        if (consentCheckbox) consentCheckbox.addEventListener('change', updateButtonStates);
        
        // Test connection
        if (testConnectionBtn) {
            testConnectionBtn.addEventListener('click', async () => {
                await this.testAIConnection();
            });
        }
        
        // Save configuration
        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', async () => {
                await this.saveAIConfiguration();
            });
        }
        
        // Reset usage counter
        if (resetUsageBtn) {
            resetUsageBtn.addEventListener('click', () => {
                this.llmIntegration.resetUsageStats();
                this.updateAIStatus();
            });
        }
        
        // Disable AI features
        if (disableAIBtn) {
            disableAIBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to disable AI features? This will clear your saved API key.')) {
                    this.llmIntegration.disable();
                    this.updateAIStatus();
                    this.hideAISettings();
                }
            });
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAISettings();
                }
            });
        }
        
        // Initialize button states
        updateButtonStates();
    }
    
    // Show AI Settings Modal
    showAISettings() {
        const modal = document.getElementById('ai-settings-modal');
        if (modal) {
            modal.style.display = 'block';
            this.updateAIStatus();
            this.populateAISettings();
        }
    }
    
    // Hide AI Settings Modal
    hideAISettings() {
        const modal = document.getElementById('ai-settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Update AI status display
    updateAIStatus() {
        const status = this.llmIntegration.getStatus();
        const usageStats = this.llmIntegration.getUsageStats();
        
        // Update status indicator
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.getElementById('ai-status-text');
        
        if (statusDot && statusText) {
            if (status.enabled) {
                statusDot.className = 'status-dot enabled';
                statusText.textContent = `AI features enabled (${status.provider})`;
            } else {
                statusDot.className = 'status-dot disabled';
                statusText.textContent = 'AI features disabled';
            }
        }
        
        // Update usage info
        const usageInfo = document.getElementById('ai-usage-info');
        const usageCount = document.getElementById('ai-usage-count');
        const usageLimit = document.getElementById('ai-usage-limit');
        const providerDisplay = document.getElementById('ai-provider-display');
        
        if (status.enabled && usageInfo) {
            usageInfo.style.display = 'block';
            if (usageCount) usageCount.textContent = usageStats.requestCount;
            if (usageLimit) usageLimit.textContent = usageStats.maxRequests;
            if (providerDisplay) providerDisplay.textContent = status.provider;
        } else if (usageInfo) {
            usageInfo.style.display = 'none';
        }
        
        // Show/hide management section
        const managementSection = document.getElementById('ai-management');
        if (managementSection) {
            managementSection.style.display = status.enabled ? 'block' : 'none';
        }
    }
    
    // Populate AI settings form
    populateAISettings() {
        const status = this.llmIntegration.getStatus();
        const providerSelect = document.getElementById('ai-provider-select');
        const apiKeyInput = document.getElementById('api-key-input');
        const consentCheckbox = document.getElementById('ai-consent-checkbox');
        
        if (status.enabled) {
            if (providerSelect) providerSelect.value = status.provider || 'openai';
            if (consentCheckbox) consentCheckbox.checked = status.consentGiven;
            // Don't populate API key for security
        }
    }
    
    // Test AI connection
    async testAIConnection() {
        const testBtn = document.getElementById('test-ai-connection');
        const resultDiv = document.getElementById('test-result');
        const resultMessage = document.getElementById('result-message');
        const providerSelect = document.getElementById('ai-provider-select');
        const apiKeyInput = document.getElementById('api-key-input');
        
        if (!testBtn || !resultDiv || !resultMessage || !providerSelect || !apiKeyInput) {
            return;
        }
        
        // Show loading state
        testBtn.disabled = true;
        testBtn.querySelector('.button-text').textContent = 'Testing...';
        testBtn.querySelector('.button-spinner').style.display = 'inline';
        
        try {
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value.trim();
            
            const isValid = await this.llmIntegration.testApiKey(apiKey, provider);
            
            resultDiv.style.display = 'block';
            if (isValid) {
                resultDiv.className = 'test-result success';
                resultMessage.textContent = `✅ Connection successful! ${provider} API is working correctly.`;
            } else {
                resultDiv.className = 'test-result error';
                resultMessage.textContent = `❌ Connection failed. Please check your API key and try again.`;
            }
            
        } catch (error) {
            resultDiv.style.display = 'block';
            resultDiv.className = 'test-result error';
            resultMessage.textContent = `❌ Connection error: ${error.message}`;
        } finally {
            // Reset button state
            testBtn.disabled = false;
            testBtn.querySelector('.button-text').textContent = 'Test Connection';
            testBtn.querySelector('.button-spinner').style.display = 'none';
        }
    }
    
    // Save AI configuration
    async saveAIConfiguration() {
        const saveBtn = document.getElementById('save-ai-config');
        const resultDiv = document.getElementById('test-result');
        const resultMessage = document.getElementById('result-message');
        const providerSelect = document.getElementById('ai-provider-select');
        const apiKeyInput = document.getElementById('api-key-input');
        const consentCheckbox = document.getElementById('ai-consent-checkbox');
        
        if (!saveBtn || !providerSelect || !apiKeyInput || !consentCheckbox) {
            return;
        }
        
        // Show loading state
        saveBtn.disabled = true;
        saveBtn.querySelector('.button-text').textContent = 'Enabling...';
        saveBtn.querySelector('.button-spinner').style.display = 'inline';
        
        try {
            const provider = providerSelect.value;
            const apiKey = apiKeyInput.value.trim();
            const consent = consentCheckbox.checked;
            
            await this.llmIntegration.configure(apiKey, provider, consent);
            
            // Update UI
            this.updateAIStatus();
            
            if (resultDiv && resultMessage) {
                resultDiv.style.display = 'block';
                resultDiv.className = 'test-result success';
                resultMessage.textContent = `✅ AI features enabled successfully! You can now enjoy enhanced reflection questions and insights.`;
            }
            
            // Clear API key field for security
            apiKeyInput.value = '';
            
        } catch (error) {
            if (resultDiv && resultMessage) {
                resultDiv.style.display = 'block';
                resultDiv.className = 'test-result error';
                resultMessage.textContent = `❌ Configuration failed: ${error.message}`;
            }
        } finally {
            // Reset button state
            saveBtn.disabled = false;
            saveBtn.querySelector('.button-text').textContent = 'Enable AI Features';
            saveBtn.querySelector('.button-spinner').style.display = 'none';
        }
    }
    
    // Close AI Settings (global function for onclick)
    closeAISettings() {
        this.hideAISettings();
    }
    
    // Setup performance debug panel
    setupPerformanceDebug() {
        // Add debug toggle to navigation (Ctrl+Shift+P)
        this.addEventListener(document, 'keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.togglePerformanceDebug();
            }
        });
        
        // Setup debug panel elements
        const closeDebug = document.getElementById('close-debug');
        const clearCache = document.getElementById('clear-cache');
        const optimizeMemory = document.getElementById('optimize-memory');
        const exportReport = document.getElementById('export-report');
        
        if (closeDebug) {
            this.addEventListener(closeDebug, 'click', () => this.hidePerformanceDebug());
        }
        
        if (clearCache) {
            this.addEventListener(clearCache, 'click', () => this.clearPerformanceCache());
        }
        
        if (optimizeMemory) {
            this.addEventListener(optimizeMemory, 'click', () => this.optimizeMemory());
        }
        
        if (exportReport) {
            this.addEventListener(exportReport, 'click', () => this.exportPerformanceReport());
        }
        
        // Update debug panel every 5 seconds
        this.debugUpdateInterval = setInterval(() => {
            this.updatePerformanceDebug();
        }, 5000);
    }
    
    // Toggle performance debug panel
    togglePerformanceDebug() {
        const debugPanel = document.getElementById('performance-debug');
        if (debugPanel) {
            if (debugPanel.style.display === 'none') {
                this.showPerformanceDebug();
            } else {
                this.hidePerformanceDebug();
            }
        }
    }
    
    // Show performance debug panel
    showPerformanceDebug() {
        const debugPanel = document.getElementById('performance-debug');
        if (debugPanel) {
            debugPanel.style.display = 'block';
            debugPanel.classList.add('fade-in');
            this.updatePerformanceDebug();
            
            // Enable debug mode in optimizer
            performanceOptimizer.enableDebugMode();
        }
    }
    
    // Hide performance debug panel
    hidePerformanceDebug() {
        const debugPanel = document.getElementById('performance-debug');
        if (debugPanel) {
            debugPanel.style.display = 'none';
            debugPanel.classList.remove('fade-in');
            
            // Disable debug mode in optimizer
            performanceOptimizer.disableDebugMode();
        }
    }
    
    // Update performance debug panel with current metrics
    updatePerformanceDebug() {
        const debugPanel = document.getElementById('performance-debug');
        if (!debugPanel || debugPanel.style.display === 'none') {
            return;
        }
        
        const report = performanceOptimizer.getPerformanceReport();
        
        // Update system performance metrics
        this.updateDebugElement('memory-usage', this.formatMemoryUsage(report.data.memoryUsage));
        this.updateDebugElement('dom-nodes', report.data.domNodes.toLocaleString());
        this.updateDebugElement('load-time', `${report.data.loadTime}ms`);
        this.updateDebugElement('fps-counter', `${report.data.fps} fps`);
        
        // Update browser capabilities
        this.updateCapabilityStatus('perf-api-support', report.capabilities.performanceObserver);
        this.updateCapabilityStatus('io-support', report.capabilities.intersectionObserver);
        this.updateCapabilityStatus('storage-support', report.capabilities.localStorage);
        
        // Update optimizations
        this.updateDebugElement('dom-pool-size', report.optimizations.domPoolSize);
        this.updateDebugElement('cached-functions', 
            report.optimizations.throttledFunctions + report.optimizations.debouncedFunctions);
        this.updateDebugElement('error-count', report.errors.length);
    }
    
    // Update debug element text
    updateDebugElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // Update capability status with color coding
    updateCapabilityStatus(id, supported) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = supported ? '✓ Supported' : '✗ Not Supported';
            element.className = `capability-status ${supported ? 'supported' : 'not-supported'}`;
        }
    }
    
    // Format memory usage for display
    formatMemoryUsage(bytes) {
        if (bytes === 0) return '--';
        
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    // Clear performance cache
    clearPerformanceCache() {
        try {
            // Clear browser caches
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            // Clear local storage (except game saves)
            const gameData = localStorage.getItem('nationBuilderSave');
            localStorage.clear();
            if (gameData) {
                localStorage.setItem('nationBuilderSave', gameData);
            }
            
            // Optimize memory in performance optimizer
            performanceOptimizer.optimizeMemoryUsage();
            
            this.showNotification('Performance cache cleared successfully');
            
        } catch (error) {
            console.error('Failed to clear cache:', error);
            this.showError('Failed to clear cache');
        }
    }
    
    // Optimize memory usage
    optimizeMemory() {
        try {
            performanceOptimizer.optimizeMemoryUsage();
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            this.showNotification('Memory optimization completed');
            
        } catch (error) {
            console.error('Failed to optimize memory:', error);
            this.showError('Failed to optimize memory');
        }
    }
    
    // Export performance report
    exportPerformanceReport() {
        try {
            const report = performanceOptimizer.getPerformanceReport();
            const exportData = {
                timestamp: new Date().toISOString(),
                gameState: {
                    year: this.gameState.currentYear,
                    phase: this.gameState.currentPhase,
                    decisions: this.gameState.totalDecisions,
                    crises: this.gameState.totalCrises
                },
                performance: report,
                browser: {
                    userAgent: navigator.userAgent,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nation-builder-performance-${Date.now()}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            this.showNotification('Performance report exported successfully');
            
        } catch (error) {
            console.error('Failed to export report:', error);
            this.showError('Failed to export performance report');
        }
    }
    
    // Show notification message
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(39, 174, 96, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 6px;
            z-index: 1002;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Cleanup with enhanced error handling
    destroy() {
        try {
            // Save final state
            this.saveGame();
            
            // Clear auto-save interval
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
            }
            
            // Clear debug update interval
            if (this.debugUpdateInterval) {
                clearInterval(this.debugUpdateInterval);
            }
            
            // Remove event listeners
            for (const [element, listeners] of this.eventListeners) {
                for (const { event, handler } of listeners) {
                    element.removeEventListener(event, handler);
                }
            }
            this.eventListeners.clear();
            
            // Clean up performance optimizer
            if (performanceOptimizer) {
                performanceOptimizer.destroy();
            }
            
            console.log('Game cleanup completed');
            
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    window.nationBuilderGame = new NationBuilderGame();
    await window.nationBuilderGame.init();
});

// Global functions for HTML onclick handlers
window.closeAISettings = () => {
    if (window.nationBuilderGame) {
        window.nationBuilderGame.hideAISettings();
    }
};

export { NationBuilderGame, GameState }; 