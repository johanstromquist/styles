/**
 * Assessment Integration & Educational Analytics
 * Tracks student decisions, provides reflection prompts, and generates learning insights
 */

class AssessmentAnalytics {
    constructor() {
        this.decisionJournal = [];
        this.reflectionPoints = [5, 10, 15]; // Years for mandatory reflection
        this.predictionExercises = [];
        this.consistencyTracker = new IdeologicalConsistencyTracker();
        this.crossCuttingAnalyzer = new CrossCuttingThemeAnalyzer();
        this.educatorAnalytics = new EducatorAnalytics();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadExistingData();
        this.initializeReflectionSystem();
    }
    
    setupEventListeners() {
        // Listen for game decisions
        document.addEventListener('decisionMade', (e) => {
            this.logDecision(e.detail);
        });
        
        // Listen for year changes for reflection prompts
        document.addEventListener('yearChanged', (e) => {
            this.checkReflectionPoints(e.detail.year);
        });
        
        // Listen for crisis responses
        document.addEventListener('crisisResolved', (e) => {
            this.analyzeCrisisResponse(e.detail);
        });
        
        // Listen for prediction exercises
        document.addEventListener('predictionMade', (e) => {
            this.recordPrediction(e.detail);
        });
    }
    
    // REQUIRED: Decision Journal System
    logDecision(decisionData) {
        const journalEntry = {
            id: this.generateEntryId(),
            timestamp: new Date().toISOString(),
            year: decisionData.year,
            phase: decisionData.phase,
            domain: decisionData.domain,
            question: decisionData.question,
            choice: decisionData.choice,
            reasoning: decisionData.reasoning || '', // Student-provided reasoning
            context: decisionData.context,
            expectedOutcome: decisionData.expectedOutcome || '',
            actualOutcome: null, // Filled later
            metrics: {
                before: { ...decisionData.metricsBefore },
                after: null // Filled after outcome calculation
            },
            ideologicalAlignment: decisionData.ideologicalAlignment,
            policyEscalation: decisionData.policyEscalation,
            isReflectionPoint: this.reflectionPoints.includes(decisionData.year),
            tags: this.generateDecisionTags(decisionData)
        };
        
        this.decisionJournal.push(journalEntry);
        this.saveDecisionJournal();
        
        // Check for consistency patterns
        this.consistencyTracker.analyzeDecision(journalEntry);
        
        // Analyze cross-cutting themes
        this.crossCuttingAnalyzer.analyzeDecision(journalEntry);
        
        // Update educator analytics
        this.educatorAnalytics.recordDecision(journalEntry);
        
        // Trigger learning moment identification
        this.identifyLearningMoments(journalEntry);
    }
    
    // REQUIRED: Decision reasoning interface
    promptForReasoning(decisionData) {
        return new Promise((resolve) => {
            const modal = this.createReasoningModal(decisionData);
            document.body.appendChild(modal);
            
            const submitBtn = modal.querySelector('#submit-reasoning');
            const skipBtn = modal.querySelector('#skip-reasoning');
            const reasoningText = modal.querySelector('#reasoning-input');
            const predictionText = modal.querySelector('#prediction-input');
            
            submitBtn.addEventListener('click', () => {
                const reasoning = reasoningText.value.trim();
                const prediction = predictionText.value.trim();
                
                decisionData.reasoning = reasoning;
                decisionData.expectedOutcome = prediction;
                
                if (prediction) {
                    this.recordPrediction({
                        decisionId: decisionData.id,
                        prediction: prediction,
                        timestamp: new Date().toISOString()
                    });
                }
                
                document.body.removeChild(modal);
                resolve(decisionData);
            });
            
            skipBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(decisionData);
            });
        });
    }
    
    createReasoningModal(decisionData) {
        const modal = document.createElement('div');
        modal.className = 'reasoning-modal';
        modal.innerHTML = `
            <div class="reasoning-content">
                <h3>Decision Reflection</h3>
                <div class="decision-context">
                    <p><strong>Decision:</strong> ${decisionData.question}</p>
                    <p><strong>Your Choice:</strong> ${decisionData.choice}</p>
                </div>
                
                <div class="reasoning-section">
                    <label for="reasoning-input">Why did you make this choice? (Optional)</label>
                    <textarea id="reasoning-input" placeholder="Explain your reasoning, values, or strategy behind this decision..."></textarea>
                </div>
                
                <div class="prediction-section">
                    <label for="prediction-input">What do you predict will happen? (Optional)</label>
                    <textarea id="prediction-input" placeholder="Predict the outcomes or consequences of your choice..."></textarea>
                </div>
                
                <div class="reasoning-actions">
                    <button id="submit-reasoning" class="primary-button">Save Reflection</button>
                    <button id="skip-reasoning" class="secondary-button">Skip</button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    // REQUIRED: Reflection prompts at years 5, 10, 15
    checkReflectionPoints(year) {
        if (this.reflectionPoints.includes(year)) {
            setTimeout(() => {
                this.showReflectionPrompt(year);
            }, 2000); // Delay to allow year transition to complete
        }
    }
    
    showReflectionPrompt(year) {
        const reflectionData = this.generateReflectionQuestions(year);
        const modal = this.createReflectionModal(year, reflectionData);
        document.body.appendChild(modal);
        
        // Focus management
        const firstInput = modal.querySelector('textarea');
        if (firstInput) firstInput.focus();
        
        // Save reflection responses
        const saveBtn = modal.querySelector('#save-reflection');
        saveBtn.addEventListener('click', () => {
            this.saveReflectionResponses(year, modal);
            document.body.removeChild(modal);
        });
        
        const skipBtn = modal.querySelector('#skip-reflection');
        skipBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    generateReflectionQuestions(year) {
        const recentDecisions = this.getRecentDecisions(year);
        const ideologicalTrends = this.consistencyTracker.getIdeologicalTrends();
        const crossCuttingThemes = this.crossCuttingAnalyzer.getActiveThemes();
        
        const questions = {
            leadership: [
                `Looking back at your first ${year} years as leader, what has been your core governing philosophy?`,
                `How has your leadership style evolved since you began leading Newlandia?`,
                `What values have guided your most important decisions?`
            ],
            consistency: [
                `Have you noticed any patterns in your decision-making? What themes emerge?`,
                `When have you felt most confident in your choices? When have you had doubts?`,
                `How do you balance competing priorities when making difficult decisions?`
            ],
            outcomes: [
                `Which of your policies have had the most positive impact? Why?`,
                `What unintended consequences have surprised you?`,
                `If you could change one major decision, what would it be and why?`
            ],
            ideology: [
                `How would you describe your political ideology based on your actions?`,
                `When have your personal values conflicted with practical governance needs?`,
                `What role should government play in citizens' lives, based on your experience?`
            ],
            realWorld: [
                `What real-world leaders or countries does your Newlandia remind you of?`,
                `How might your approach work differently in today's world?`,
                `What have you learned about the challenges of democratic leadership?`
            ]
        };
        
        // Customize questions based on player's journey
        if (ideologicalTrends.dominant) {
            questions.ideology.push(
                `Your decisions suggest a ${ideologicalTrends.dominant} approach. Do you agree? Why or why not?`
            );
        }
        
        if (crossCuttingThemes.length > 0) {
            questions.realWorld.push(
                `You've shown patterns of ${crossCuttingThemes.join(', ')}. How do these themes appear in current politics?`
            );
        }
        
        return questions;
    }
    
    createReflectionModal(year, questions) {
        const modal = document.createElement('div');
        modal.className = 'reflection-modal';
        modal.innerHTML = `
            <div class="reflection-content">
                <h2>Year ${year} Reflection</h2>
                <p class="reflection-intro">Take a moment to reflect on your leadership journey so far. Your responses will be included in your decision portfolio.</p>
                
                <div class="reflection-categories">
                    ${Object.entries(questions).map(([category, categoryQuestions]) => `
                        <div class="reflection-category">
                            <h3>${this.formatCategoryName(category)}</h3>
                            ${categoryQuestions.slice(0, 2).map((question, index) => `
                                <div class="reflection-question">
                                    <label>${question}</label>
                                    <textarea data-category="${category}" data-index="${index}" 
                                             placeholder="Share your thoughts..."></textarea>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                
                <div class="reflection-actions">
                    <button id="save-reflection" class="primary-button">Save Reflection</button>
                    <button id="skip-reflection" class="secondary-button">Skip for Now</button>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    saveReflectionResponses(year, modal) {
        const responses = {};
        const textareas = modal.querySelectorAll('textarea');
        
        textareas.forEach(textarea => {
            const category = textarea.dataset.category;
            const index = textarea.dataset.index;
            const value = textarea.value.trim();
            
            if (value) {
                if (!responses[category]) responses[category] = {};
                responses[category][index] = value;
            }
        });
        
        const reflectionEntry = {
            year: year,
            timestamp: new Date().toISOString(),
            responses: responses,
            decisionsSummary: this.generateDecisionsSummary(year),
            metricsTrends: this.generateMetricsTrends(year),
            ideologicalProfile: this.consistencyTracker.getCurrentProfile()
        };
        
        this.saveReflection(reflectionEntry);
        
        // Announce completion
        if (window.responsiveManager) {
            window.responsiveManager.announce(`Year ${year} reflection saved to your portfolio.`);
        }
    }
    
    // Prediction exercises system
    recordPrediction(predictionData) {
        const prediction = {
            id: this.generatePredictionId(),
            decisionId: predictionData.decisionId,
            prediction: predictionData.prediction,
            timestamp: predictionData.timestamp,
            accuracy: null, // Calculated later
            actualOutcome: null,
            learningMoment: null
        };
        
        this.predictionExercises.push(prediction);
        this.savePredictionExercises();
    }
    
    evaluatePrediction(decisionId, actualOutcome) {
        const prediction = this.predictionExercises.find(p => p.decisionId === decisionId);
        if (!prediction) return;
        
        prediction.actualOutcome = actualOutcome;
        prediction.accuracy = this.calculatePredictionAccuracy(prediction.prediction, actualOutcome);
        prediction.learningMoment = this.generatePredictionLearningMoment(prediction);
        
        this.savePredictionExercises();
        
        // Show prediction results if accuracy is particularly high or low
        if (prediction.accuracy < 0.3 || prediction.accuracy > 0.8) {
            this.showPredictionFeedback(prediction);
        }
    }
    
    calculatePredictionAccuracy(prediction, actual) {
        // Simple semantic similarity calculation
        const predictionWords = prediction.toLowerCase().split(/\s+/);
        const actualWords = actual.toLowerCase().split(/\s+/);
        
        const commonWords = predictionWords.filter(word => 
            actualWords.some(actualWord => 
                actualWord.includes(word) || word.includes(actualWord)
            )
        );
        
        return commonWords.length / Math.max(predictionWords.length, actualWords.length);
    }
    
    // REQUIRED: Exportable decision portfolio
    exportDecisionPortfolio() {
        const portfolio = {
            metadata: {
                studentId: this.getStudentId(),
                gameVersion: '1.0',
                exportDate: new Date().toISOString(),
                totalDecisions: this.decisionJournal.length,
                gameCompleted: this.isGameCompleted(),
                finalYear: this.getCurrentYear()
            },
            decisionJournal: this.decisionJournal,
            reflections: this.getReflections(),
            predictions: this.predictionExercises,
            analytics: {
                ideologicalProfile: this.consistencyTracker.getFinalProfile(),
                consistencyAnalysis: this.consistencyTracker.getConsistencyReport(),
                crossCuttingThemes: this.crossCuttingAnalyzer.getThemeReport(),
                learningMoments: this.getLearningMoments(),
                performanceMetrics: this.getPerformanceMetrics()
            },
            educationalInsights: this.generateEducationalInsights()
        };
        
        return portfolio;
    }
    
    downloadPortfolio() {
        const portfolio = this.exportDecisionPortfolio();
        const blob = new Blob([JSON.stringify(portfolio, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newlandia-portfolio-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Also generate human-readable report
        this.downloadReadableReport(portfolio);
    }
    
    downloadReadableReport(portfolio) {
        const report = this.generateReadableReport(portfolio);
        const blob = new Blob([report], { type: 'text/plain' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newlandia-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    generateReadableReport(portfolio) {
        return `
NEWLANDIA LEADERSHIP PORTFOLIO
Generated: ${new Date().toLocaleDateString()}
Student ID: ${portfolio.metadata.studentId}
Game Duration: ${portfolio.metadata.finalYear} years
Total Decisions: ${portfolio.metadata.totalDecisions}

EXECUTIVE SUMMARY
${this.generateExecutiveSummary(portfolio)}

IDEOLOGICAL PROFILE
${this.formatIdeologicalProfile(portfolio.analytics.ideologicalProfile)}

DECISION TIMELINE
${this.formatDecisionTimeline(portfolio.decisionJournal)}

REFLECTIONS
${this.formatReflections(portfolio.reflections)}

LEARNING INSIGHTS
${this.formatLearningInsights(portfolio.analytics.learningMoments)}

PERFORMANCE METRICS
${this.formatPerformanceMetrics(portfolio.analytics.performanceMetrics)}

CONSISTENCY ANALYSIS
${this.formatConsistencyAnalysis(portfolio.analytics.consistencyAnalysis)}

CROSS-CUTTING THEMES
${this.formatCrossCuttingThemes(portfolio.analytics.crossCuttingThemes)}

EDUCATIONAL RECOMMENDATIONS
${this.formatEducationalRecommendations(portfolio.educationalInsights)}
        `.trim();
    }
    
    // Learning moment identification
    identifyLearningMoments(decisionEntry) {
        const moments = [];
        
        // Policy escalation moments
        if (decisionEntry.policyEscalation && decisionEntry.policyEscalation.level > 2) {
            moments.push({
                type: 'policy_escalation',
                title: 'Policy Escalation Point',
                description: `Your ${decisionEntry.domain} policies have escalated to level ${decisionEntry.policyEscalation.level}`,
                insight: 'This shows how initial policy choices can lead to more extreme positions over time.',
                year: decisionEntry.year
            });
        }
        
        // Ideological inconsistency moments
        const inconsistency = this.consistencyTracker.checkForInconsistency(decisionEntry);
        if (inconsistency.detected) {
            moments.push({
                type: 'ideological_inconsistency',
                title: 'Ideological Tension',
                description: inconsistency.description,
                insight: 'Real leaders often face conflicts between their ideological beliefs and practical governance needs.',
                year: decisionEntry.year
            });
        }
        
        // Cross-cutting theme emergence
        const themes = this.crossCuttingAnalyzer.detectEmergingThemes(decisionEntry);
        themes.forEach(theme => {
            moments.push({
                type: 'cross_cutting_theme',
                title: `${theme.name} Theme Detected`,
                description: theme.description,
                insight: theme.educationalInsight,
                year: decisionEntry.year
            });
        });
        
        // Save learning moments
        moments.forEach(moment => this.saveLearningMoment(moment));
        
        return moments;
    }
    
    // Utility methods
    generateEntryId() {
        return `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    generatePredictionId() {
        return `prediction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    generateDecisionTags(decisionData) {
        const tags = [];
        
        tags.push(decisionData.domain);
        tags.push(decisionData.phase);
        
        if (decisionData.policyEscalation) {
            tags.push(`escalation_${decisionData.policyEscalation.track}`);
        }
        
        if (decisionData.ideologicalAlignment) {
            Object.entries(decisionData.ideologicalAlignment).forEach(([ideology, strength]) => {
                if (strength > 0.6) {
                    tags.push(`strong_${ideology}`);
                } else if (strength > 0.3) {
                    tags.push(`moderate_${ideology}`);
                }
            });
        }
        
        return tags;
    }
    
    formatCategoryName(category) {
        return category.replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim();
    }
    
    getStudentId() {
        // Generate or retrieve student ID
        let studentId = localStorage.getItem('nationbuilder_student_id');
        if (!studentId) {
            studentId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            localStorage.setItem('nationbuilder_student_id', studentId);
        }
        return studentId;
    }
    
    // Data persistence methods
    saveDecisionJournal() {
        localStorage.setItem('nationbuilder_decision_journal', JSON.stringify(this.decisionJournal));
    }
    
    loadExistingData() {
        const savedJournal = localStorage.getItem('nationbuilder_decision_journal');
        if (savedJournal) {
            this.decisionJournal = JSON.parse(savedJournal);
        }
        
        const savedReflections = localStorage.getItem('nationbuilder_reflections');
        if (savedReflections) {
            this.reflections = JSON.parse(savedReflections);
        }
        
        const savedPredictions = localStorage.getItem('nationbuilder_predictions');
        if (savedPredictions) {
            this.predictionExercises = JSON.parse(savedPredictions);
        }
    }
    
    savePredictionExercises() {
        localStorage.setItem('nationbuilder_predictions', JSON.stringify(this.predictionExercises));
    }
    
    saveReflection(reflection) {
        const reflections = this.getReflections();
        reflections.push(reflection);
        localStorage.setItem('nationbuilder_reflections', JSON.stringify(reflections));
    }
    
    getReflections() {
        const saved = localStorage.getItem('nationbuilder_reflections');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveLearningMoment(moment) {
        const moments = this.getLearningMoments();
        moments.push(moment);
        localStorage.setItem('nationbuilder_learning_moments', JSON.stringify(moments));
    }
    
    getLearningMoments() {
        const saved = localStorage.getItem('nationbuilder_learning_moments');
        return saved ? JSON.parse(saved) : [];
    }
    
    // Public API methods
    getDecisionJournal() {
        return this.decisionJournal;
    }
    
    getAnalyticsSummary() {
        return {
            totalDecisions: this.decisionJournal.length,
            reflectionPoints: this.getReflections().length,
            predictions: this.predictionExercises.length,
            learningMoments: this.getLearningMoments().length,
            ideologicalProfile: this.consistencyTracker.getCurrentProfile(),
            crossCuttingThemes: this.crossCuttingAnalyzer.getActiveThemes()
        };
    }
    
    initializeReflectionSystem() {
        // Set up reflection prompts in UI
        this.addReflectionButton();
        this.addPortfolioExportButton();
    }
    
    addReflectionButton() {
        const nav = document.querySelector('.game-nav');
        if (nav) {
            const reflectionBtn = document.createElement('button');
            reflectionBtn.id = 'reflection-journal';
            reflectionBtn.className = 'nav-btn';
            reflectionBtn.innerHTML = `
                <span class="btn-icon" aria-hidden="true">📝</span>
                <span class="btn-text">Reflection Journal</span>
            `;
            reflectionBtn.setAttribute('aria-label', 'Open reflection journal');
            
            reflectionBtn.addEventListener('click', () => {
                this.showReflectionJournal();
            });
            
            nav.appendChild(reflectionBtn);
        }
    }
    
    addPortfolioExportButton() {
        const nav = document.querySelector('.game-nav');
        if (nav) {
            const exportBtn = document.createElement('button');
            exportBtn.id = 'export-portfolio';
            exportBtn.className = 'nav-btn';
            exportBtn.innerHTML = `
                <span class="btn-icon" aria-hidden="true">📊</span>
                <span class="btn-text">Export Portfolio</span>
            `;
            exportBtn.setAttribute('aria-label', 'Export decision portfolio');
            
            exportBtn.addEventListener('click', () => {
                this.downloadPortfolio();
            });
            
            nav.appendChild(exportBtn);
        }
    }
    
    showReflectionJournal() {
        // Implementation for showing reflection journal interface
        const modal = this.createReflectionJournalModal();
        document.body.appendChild(modal);
    }
    
    createReflectionJournalModal() {
        const modal = document.createElement('div');
        modal.className = 'journal-modal';
        modal.innerHTML = `
            <div class="journal-content">
                <h2>Your Reflection Journal</h2>
                <div class="journal-summary">
                    <p>Decisions Made: ${this.decisionJournal.length}</p>
                    <p>Reflections: ${this.getReflections().length}</p>
                    <p>Learning Moments: ${this.getLearningMoments().length}</p>
                </div>
                <div class="journal-sections">
                    <div class="journal-decisions">
                        <h3>Recent Decisions</h3>
                        ${this.formatRecentDecisions()}
                    </div>
                    <div class="journal-reflections">
                        <h3>Your Reflections</h3>
                        ${this.formatReflectionHistory()}
                    </div>
                </div>
                <div class="journal-actions">
                    <button id="close-journal" class="secondary-button">Close</button>
                    <button id="export-from-journal" class="primary-button">Export Portfolio</button>
                </div>
            </div>
        `;
        
        // Event listeners
        modal.querySelector('#close-journal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#export-from-journal').addEventListener('click', () => {
            this.downloadPortfolio();
            document.body.removeChild(modal);
        });
        
        return modal;
    }
    
    formatRecentDecisions() {
        const recent = this.decisionJournal.slice(-5).reverse();
        return recent.map(decision => `
            <div class="decision-summary">
                <strong>Year ${decision.year}:</strong> ${decision.question}
                <br><em>Choice:</em> ${decision.choice}
                ${decision.reasoning ? `<br><em>Reasoning:</em> ${decision.reasoning}` : ''}
            </div>
        `).join('');
    }
    
    formatReflectionHistory() {
        const reflections = this.getReflections();
        return reflections.map(reflection => `
            <div class="reflection-summary">
                <strong>Year ${reflection.year} Reflection</strong>
                <div class="reflection-responses">
                    ${Object.entries(reflection.responses).map(([category, responses]) => `
                        <div class="category-responses">
                            <em>${this.formatCategoryName(category)}:</em>
                            ${Object.values(responses).map(response => `<p>${response}</p>`).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // Placeholder methods for missing functionality
    getRecentDecisions(year) {
        return this.decisionJournal.filter(d => d.year <= year).slice(-10);
    }
    
    generateDecisionsSummary(year) {
        return `Summary of decisions through year ${year}`;
    }
    
    generateMetricsTrends(year) {
        return `Metrics trends through year ${year}`;
    }
    
    isGameCompleted() {
        return false; // Placeholder
    }
    
    getCurrentYear() {
        return 1; // Placeholder
    }
    
    getPerformanceMetrics() {
        return {}; // Placeholder
    }
    
    generateEducationalInsights() {
        return {
            insights: [
                "Your leadership journey reveals important patterns about governance and ideology.",
                "Consider how your decisions reflect broader political and philosophical themes.",
                "Reflect on how your experience connects to real-world political challenges."
            ]
        };
    }
    
    // Report formatting methods (simplified)
    generateExecutiveSummary(portfolio) {
        return "This portfolio documents your 20-year leadership journey in Newlandia, revealing patterns in decision-making and ideological development.";
    }
    
    formatIdeologicalProfile(profile) {
        if (!profile) return "Ideological profile not available.";
        return Object.entries(profile).map(([ideology, score]) => 
            `${ideology}: ${(score * 100).toFixed(1)}%`
        ).join('\n');
    }
    
    formatDecisionTimeline(journal) {
        return journal.slice(0, 10).map(decision => 
            `Year ${decision.year}: ${decision.question} -> ${decision.choice}`
        ).join('\n');
    }
    
    formatReflections(reflections) {
        return reflections.map(r => 
            `Year ${r.year}: ${Object.keys(r.responses).length} reflection responses`
        ).join('\n');
    }
    
    formatLearningInsights(moments) {
        return moments.map(m => 
            `${m.title}: ${m.insight}`
        ).join('\n');
    }
    
    formatPerformanceMetrics(metrics) {
        return "Performance metrics summary";
    }
    
    formatConsistencyAnalysis(analysis) {
        return "Consistency analysis summary";
    }
    
    formatCrossCuttingThemes(themes) {
        return "Cross-cutting themes analysis";
    }
    
    formatEducationalRecommendations(insights) {
        return insights.insights.join('\n');
    }
}

// Ideological Consistency Tracker
class IdeologicalConsistencyTracker {
    constructor() {
        this.ideologicalHistory = [];
        this.consistencyThreshold = 0.7;
        this.warningThreshold = 0.4;
    }
    
    analyzeDecision(decisionEntry) {
        this.ideologicalHistory.push({
            year: decisionEntry.year,
            domain: decisionEntry.domain,
            alignment: decisionEntry.ideologicalAlignment,
            policyTrack: decisionEntry.policyEscalation?.track
        });
        
        // Check for consistency patterns
        this.updateConsistencyMetrics();
    }
    
    checkForInconsistency(decisionEntry) {
        const recentDecisions = this.ideologicalHistory.slice(-5);
        const currentAlignment = decisionEntry.ideologicalAlignment;
        
        // Calculate deviation from recent pattern
        const avgAlignment = this.calculateAverageAlignment(recentDecisions);
        const deviation = this.calculateDeviation(currentAlignment, avgAlignment);
        
        if (deviation > this.warningThreshold) {
            return {
                detected: true,
                description: `This decision shows different ideological leanings compared to your recent choices.`,
                deviation: deviation,
                suggestion: 'Consider whether this represents a genuine shift in your values or a response to specific circumstances.'
            };
        }
        
        return { detected: false };
    }
    
    calculateAverageAlignment(decisions) {
        const alignments = {};
        const ideologies = ['liberal', 'conservative', 'socialist', 'ecological', 'authoritarian', 'feminist'];
        
        ideologies.forEach(ideology => {
            alignments[ideology] = decisions.reduce((sum, d) => 
                sum + (d.alignment?.[ideology] || 0), 0) / decisions.length;
        });
        
        return alignments;
    }
    
    calculateDeviation(current, average) {
        if (!current || !average) return 0;
        
        const ideologies = Object.keys(average);
        const totalDeviation = ideologies.reduce((sum, ideology) => {
            return sum + Math.abs((current[ideology] || 0) - average[ideology]);
        }, 0);
        
        return totalDeviation / ideologies.length;
    }
    
    updateConsistencyMetrics() {
        // Implementation for updating consistency metrics
    }
    
    getCurrentProfile() {
        if (this.ideologicalHistory.length === 0) return null;
        
        return this.calculateAverageAlignment(this.ideologicalHistory);
    }
    
    getFinalProfile() {
        return this.getCurrentProfile();
    }
    
    getConsistencyReport() {
        return {
            overallConsistency: this.calculateOverallConsistency(),
            domainConsistency: this.calculateDomainConsistency(),
            temporalConsistency: this.calculateTemporalConsistency(),
            insights: this.generateConsistencyInsights()
        };
    }
    
    calculateOverallConsistency() {
        return 0.75; // Placeholder
    }
    
    calculateDomainConsistency() {
        return {}; // Placeholder
    }
    
    calculateTemporalConsistency() {
        return []; // Placeholder
    }
    
    generateConsistencyInsights() {
        return [
            "Your economic policies show strong consistency with liberal principles.",
            "Social policies demonstrate some variation, suggesting pragmatic adaptation.",
            "Environmental decisions align consistently with ecological values."
        ];
    }
    
    getIdeologicalTrends() {
        const profile = this.getCurrentProfile();
        if (!profile) return { dominant: null };
        
        const dominant = Object.entries(profile).reduce((max, [ideology, score]) => 
            score > max.score ? { ideology, score } : max, 
            { ideology: null, score: 0 }
        );
        
        return { dominant: dominant.score > 0.4 ? dominant.ideology : null };
    }
}

// Cross-Cutting Theme Analyzer
class CrossCuttingThemeAnalyzer {
    constructor() {
        this.themes = {
            protectionism: {
                economic: 0,
                cultural: 0,
                environmental: 0,
                authoritarian: 0
            },
            populism: {
                left: 0,
                right: 0,
                democratic: 0
            },
            centralization: 0,
            individualism: 0,
            collectivism: 0,
            traditionalism: 0,
            progressivism: 0
        };
        
        this.themeHistory = [];
    }
    
    analyzeDecision(decisionEntry) {
        const themes = this.detectThemes(decisionEntry);
        this.updateThemeScores(themes);
        this.themeHistory.push({
            year: decisionEntry.year,
            themes: themes
        });
    }
    
    detectThemes(decisionEntry) {
        const themes = {};
        
        // Analyze for protectionism
        if (this.isProtectionistChoice(decisionEntry)) {
            themes.protectionism = this.categorizeProtectionism(decisionEntry);
        }
        
        // Analyze for populism
        if (this.isPopulistChoice(decisionEntry)) {
            themes.populism = this.categorizePopulism(decisionEntry);
        }
        
        // Analyze other themes
        themes.centralization = this.analyzeCentralization(decisionEntry);
        themes.individualism = this.analyzeIndividualism(decisionEntry);
        
        return themes;
    }
    
    isProtectionistChoice(decisionEntry) {
        const protectionistKeywords = [
            'protect', 'preserve', 'defend', 'secure', 'maintain',
            'traditional', 'local', 'domestic', 'national'
        ];
        
        const choiceText = decisionEntry.choice.toLowerCase();
        return protectionistKeywords.some(keyword => choiceText.includes(keyword));
    }
    
    categorizeProtectionism(decisionEntry) {
        const choice = decisionEntry.choice.toLowerCase();
        const domain = decisionEntry.domain.toLowerCase();
        
        if (domain.includes('economic') || choice.includes('trade') || choice.includes('business')) {
            return 'economic';
        } else if (domain.includes('social') || choice.includes('culture') || choice.includes('tradition')) {
            return 'cultural';
        } else if (domain.includes('environmental')) {
            return 'environmental';
        } else if (choice.includes('security') || choice.includes('order')) {
            return 'authoritarian';
        }
        
        return 'general';
    }
    
    isPopulistChoice(decisionEntry) {
        const populistKeywords = [
            'people', 'ordinary', 'common', 'majority', 'popular',
            'elite', 'establishment', 'corrupt', 'special interests'
        ];
        
        const choiceText = decisionEntry.choice.toLowerCase();
        return populistKeywords.some(keyword => choiceText.includes(keyword));
    }
    
    categorizePopulism(decisionEntry) {
        const choice = decisionEntry.choice.toLowerCase();
        
        if (choice.includes('wealth') || choice.includes('rich') || choice.includes('corporation')) {
            return 'left';
        } else if (choice.includes('immigrant') || choice.includes('foreign') || choice.includes('tradition')) {
            return 'right';
        } else {
            return 'democratic';
        }
    }
    
    analyzeCentralization(decisionEntry) {
        const choice = decisionEntry.choice.toLowerCase();
        const centralizingKeywords = ['federal', 'national', 'central', 'unified', 'standardized'];
        const decentralizingKeywords = ['local', 'regional', 'community', 'individual', 'autonomous'];
        
        const centralizing = centralizingKeywords.some(keyword => choice.includes(keyword));
        const decentralizing = decentralizingKeywords.some(keyword => choice.includes(keyword));
        
        if (centralizing && !decentralizing) return 1;
        if (decentralizing && !centralizing) return -1;
        return 0;
    }
    
    analyzeIndividualism(decisionEntry) {
        const choice = decisionEntry.choice.toLowerCase();
        const individualistKeywords = ['individual', 'personal', 'freedom', 'choice', 'liberty'];
        const collectivistKeywords = ['collective', 'community', 'social', 'together', 'shared'];
        
        const individualist = individualistKeywords.some(keyword => choice.includes(keyword));
        const collectivist = collectivistKeywords.some(keyword => choice.includes(keyword));
        
        if (individualist && !collectivist) return 1;
        if (collectivist && !individualist) return -1;
        return 0;
    }
    
    updateThemeScores(themes) {
        // Update theme scores based on detected themes
        Object.entries(themes).forEach(([theme, value]) => {
            if (typeof value === 'object') {
                Object.entries(value).forEach(([subtheme, subvalue]) => {
                    if (this.themes[theme] && typeof this.themes[theme] === 'object') {
                        this.themes[theme][subtheme] = (this.themes[theme][subtheme] || 0) + subvalue;
                    }
                });
            } else if (typeof value === 'number') {
                this.themes[theme] = (this.themes[theme] || 0) + value;
            }
        });
    }
    
    detectEmergingThemes(decisionEntry) {
        const themes = this.detectThemes(decisionEntry);
        const emerging = [];
        
        // Check if any theme has crossed a threshold
        Object.entries(themes).forEach(([theme, value]) => {
            if (this.isEmergingTheme(theme, value)) {
                emerging.push({
                    name: theme,
                    description: this.getThemeDescription(theme, value),
                    educationalInsight: this.getThemeEducationalInsight(theme)
                });
            }
        });
        
        return emerging;
    }
    
    isEmergingTheme(theme, value) {
        // Simple threshold check - could be more sophisticated
        const currentScore = this.themes[theme];
        return (typeof currentScore === 'number' && Math.abs(currentScore) > 3) ||
               (typeof currentScore === 'object' && Object.values(currentScore).some(score => score > 2));
    }
    
    getThemeDescription(theme, value) {
        const descriptions = {
            protectionism: 'You are showing protectionist tendencies in your governance approach.',
            populism: 'Your decisions reflect populist rhetoric and appeal to "the people."',
            centralization: 'You tend to favor centralized government control.',
            individualism: 'Your policies emphasize individual rights and freedoms.'
        };
        
        return descriptions[theme] || `Theme: ${theme}`;
    }
    
    getThemeEducationalInsight(theme) {
        const insights = {
            protectionism: 'Protectionism appears across different ideologies - economic protectionism in socialism, cultural protectionism in conservatism, and environmental protectionism in ecological movements.',
            populism: 'Populist appeals can serve different ideological purposes - left populism targets economic elites, right populism targets cultural elites, and democratic populism emphasizes participation.',
            centralization: 'The tension between centralization and decentralization cuts across ideological lines and reflects fundamental questions about governance scale.',
            individualism: 'The balance between individual and collective good is a core tension in political philosophy that manifests differently across ideologies.'
        };
        
        return insights[theme] || 'This theme reveals important patterns in political thinking.';
    }
    
    getActiveThemes() {
        const active = [];
        
        Object.entries(this.themes).forEach(([theme, score]) => {
            if (typeof score === 'number' && Math.abs(score) > 2) {
                active.push(theme);
            } else if (typeof score === 'object') {
                const maxSubtheme = Object.entries(score).reduce((max, [subtheme, subscore]) => 
                    subscore > max.score ? { subtheme, score: subscore } : max,
                    { subtheme: null, score: 0 }
                );
                if (maxSubtheme.score > 2) {
                    active.push(`${theme}_${maxSubtheme.subtheme}`);
                }
            }
        });
        
        return active;
    }
    
    getThemeReport() {
        return {
            activeThemes: this.getActiveThemes(),
            themeScores: this.themes,
            themeHistory: this.themeHistory,
            insights: this.generateThemeInsights()
        };
    }
    
    generateThemeInsights() {
        const insights = [];
        const active = this.getActiveThemes();
        
        active.forEach(theme => {
            insights.push({
                theme: theme,
                insight: this.getThemeEducationalInsight(theme.split('_')[0]),
                examples: this.getThemeExamples(theme)
            });
        });
        
        return insights;
    }
    
    getThemeExamples(theme) {
        // Return examples of how this theme appears in real-world politics
        const examples = {
            protectionism: [
                'Trade tariffs to protect domestic industries',
                'Immigration restrictions to preserve cultural identity',
                'Environmental regulations to protect natural resources'
            ],
            populism: [
                'Bernie Sanders\' appeal to working class against billionaires',
                'Donald Trump\'s appeal to "forgotten Americans" against elites',
                'Referendums as direct democratic participation'
            ]
        };
        
        return examples[theme.split('_')[0]] || [];
    }
}

// Educator Analytics
class EducatorAnalytics {
    constructor() {
        this.classData = [];
        this.discussionQuestions = [];
        this.comparisonTools = [];
    }
    
    recordDecision(decisionEntry) {
        // Record decision for class-wide analytics
        this.classData.push({
            timestamp: decisionEntry.timestamp,
            decision: decisionEntry,
            anonymizedId: this.anonymizeStudentId(decisionEntry.studentId)
        });
        
        this.generateDiscussionQuestions(decisionEntry);
    }
    
    anonymizeStudentId(studentId) {
        // Simple anonymization - in production would use proper techniques
        return `student_${studentId?.slice(-6) || 'unknown'}`;
    }
    
    generateDiscussionQuestions(decisionEntry) {
        // Generate discussion questions based on student patterns
        const questions = [
            `How might different ideological perspectives approach the ${decisionEntry.domain} challenge differently?`,
            `What are the potential long-term consequences of the policy choices made in this scenario?`,
            `How do you see similar tensions playing out in current political debates?`
        ];
        
        this.discussionQuestions.push(...questions);
    }
    
    getClassAnalytics() {
        return {
            totalStudents: new Set(this.classData.map(d => d.anonymizedId)).size,
            totalDecisions: this.classData.length,
            commonPatterns: this.identifyCommonPatterns(),
            diversityMetrics: this.calculateDiversityMetrics(),
            discussionQuestions: this.discussionQuestions.slice(-10) // Recent questions
        };
    }
    
    identifyCommonPatterns() {
        // Identify common decision patterns across students
        return [];
    }
    
    calculateDiversityMetrics() {
        // Calculate how diverse student approaches are
        return {};
    }
}

// Initialize assessment system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.assessmentAnalytics = new AssessmentAnalytics();
    });
} else {
    window.assessmentAnalytics = new AssessmentAnalytics();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AssessmentAnalytics, IdeologicalConsistencyTracker, CrossCuttingThemeAnalyzer, EducatorAnalytics };
} 