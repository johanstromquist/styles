// Comprehensive Scoring and Metrics System
// Tracks 33 national metrics and 6 ideological alignment scores

class ScoringSystem {
    constructor() {
        // Reference to game state for validation and context
        this.gameState = null;
        
        // National metrics (33 total across 6 categories) - all 0-100 scale
        this.metrics = {
            // Economic Metrics (7)
            economicGrowth: 50,
            employmentRate: 50,
            incomeInequality: 50, // 0 = very equal, 100 = very unequal
            publicDebt: 50, // 0 = no debt, 100 = high debt
            inflation: 50, // 0 = deflation, 100 = hyperinflation
            tradeBalance: 50, // 0 = deficit, 100 = surplus
            economicStability: 50,
            
            // Social Metrics (8)
            healthcareAccess: 50,
            educationQuality: 50,
            socialCohesion: 50,
            culturalDiversity: 50,
            crimeRate: 50, // 0 = no crime, 100 = very high crime
            socialMobility: 50,
            religiousSpiritualParticipation: 50,
            careWorkIntegration: 50,
            
            // Governance Metrics (6)
            governanceEffectiveness: 50,
            transparencyAccountability: 50,
            ruleOfLaw: 50,
            politicalStability: 50,
            citizenParticipation: 50,
            informationControl: 50, // 0 = free information, 100 = controlled
            
            // Security Metrics (5)
            nationalSecurity: 50,
            internalStability: 50,
            lawEnforcementEffectiveness: 50,
            conflictResolution: 50,
            borderSecurity: 50,
            
            // Environmental Metrics (4)
            environmentalQuality: 50,
            renewableEnergyAdoption: 50,
            sustainabilityPractices: 50,
            resourceConservation: 50,
            
            // Quality of Life Metrics (3)
            overallHappiness: 50,
            workLifeBalance: 50,
            workerOrganization: 50
        };
        
        // Metric trends tracking (for visualization and analysis)
        this.metricTrends = {};
        this.initializeTrends();
        
        // Ideological alignment scores (hidden from player) - 0-100 scale
        this.ideologyScores = {
            liberal: 0,
            conservative: 0,
            socialist: 0,
            ecological: 0,
            authoritarian: 0,
            feminist: 0
        };
        
        // Ideological consistency tracking
        this.consistencyBonus = 0;
        this.ideologicalConflicts = 0;
        this.dominantIdeology = null;
        
        // Decision impact tracking
        this.totalDecisionImpacts = 0;
        this.strongestImpacts = [];
        this.recentDecisions = [];
        
        // Crisis impact tracking
        this.crisisResponseConsistency = 0;
        this.crisisImpactMultiplier = 1.5; // Crises have 1.5x impact
        
        // Validation and error tracking
        this.isValid = true;
        this.validationErrors = [];
        this.version = '1.0';
    }
    
    // Initialize with game state reference
    async init(gameState) {
        this.gameState = gameState;
        
        // Initialize metric trends with starting values
        this.recordInitialMetrics();
        
        console.log('Scoring system initialized');
    }
    
    // Get current metrics (required by crisis system)
    getCurrentMetrics() {
        return { ...this.metrics };
    }
    
    // Apply metric changes (required by crisis system)
    applyMetricChanges(metricImpacts, source = 'external') {
        const impacts = [];
        
        for (const [metricName, impact] of Object.entries(metricImpacts)) {
            if (this.metrics.hasOwnProperty(metricName)) {
                const oldValue = this.metrics[metricName];
                this.metrics[metricName] = this.clampMetric(this.metrics[metricName] + impact);
                
                // Record trend data
                this.recordMetricChange(metricName, oldValue, this.metrics[metricName], impact, source);
                
                impacts.push({
                    metric: metricName,
                    change: impact,
                    newValue: this.metrics[metricName]
                });
            }
        }
        
        return impacts;
    }
    
    // Initialize trend tracking for all metrics
    initializeTrends() {
        for (const metricName of Object.keys(this.metrics)) {
            this.metricTrends[metricName] = [];
        }
    }
    
    // Record initial metric values
    recordInitialMetrics() {
        const timestamp = this.gameState ? this.gameState.currentYear : 1;
        
        for (const [metricName, value] of Object.entries(this.metrics)) {
            this.metricTrends[metricName].push({
                year: timestamp,
                value: value,
                change: 0,
                source: 'initial'
            });
        }
    }
    
    // Process decision impact on metrics and ideology scores
    async processDecision(choice) {
        try {
            // Validate choice structure
            if (!this.validateChoice(choice)) {
                throw new Error('Invalid choice structure');
            }
            
            const impacts = [];
            
            // Process metric impacts
            if (choice.metricImpacts) {
                for (const [metricName, impact] of Object.entries(choice.metricImpacts)) {
                    if (this.metrics.hasOwnProperty(metricName)) {
                        const oldValue = this.metrics[metricName];
                        this.metrics[metricName] = this.clampMetric(this.metrics[metricName] + impact);
                        
                        // Record trend data
                        this.recordMetricChange(metricName, oldValue, this.metrics[metricName], impact, 'decision');
                        
                        impacts.push({
                            metric: metricName,
                            change: impact,
                            newValue: this.metrics[metricName]
                        });
                    }
                }
            }
            
            // Process ideology impacts
            if (choice.ideologyImpacts) {
                for (const [ideology, impact] of Object.entries(choice.ideologyImpacts)) {
                    if (this.ideologyScores.hasOwnProperty(ideology)) {
                        this.ideologyScores[ideology] = this.clampMetric(this.ideologyScores[ideology] + impact);
                    }
                }
            }
            
            // Calculate consistency bonus/penalty
            this.calculateConsistencyBonus(choice);
            
            // Track decision for recent analysis
            this.trackRecentDecision(choice, impacts);
            
            // Update dominant ideology
            this.updateDominantIdeology();
            
            // Validate state after processing
            this.validateState();
            
            return impacts;
            
        } catch (error) {
            console.error('Failed to process decision:', error);
            throw error;
        }
    }
    
    // Process crisis response with enhanced impact
    async processCrisisResponse(response, crisis) {
        try {
            const impacts = [];
            
            // Process metric impacts with crisis multiplier
            if (response.metricImpacts) {
                for (const [metricName, baseImpact] of Object.entries(response.metricImpacts)) {
                    if (this.metrics.hasOwnProperty(metricName)) {
                        const impact = baseImpact * this.crisisImpactMultiplier;
                        const oldValue = this.metrics[metricName];
                        this.metrics[metricName] = this.clampMetric(this.metrics[metricName] + impact);
                        
                        // Record trend data
                        this.recordMetricChange(metricName, oldValue, this.metrics[metricName], impact, 'crisis');
                        
                        impacts.push({
                            metric: metricName,
                            change: impact,
                            newValue: this.metrics[metricName],
                            type: 'crisis'
                        });
                    }
                }
            }
            
            // Process ideology impacts with crisis multiplier
            if (response.ideologyImpacts) {
                for (const [ideology, baseImpact] of Object.entries(response.ideologyImpacts)) {
                    if (this.ideologyScores.hasOwnProperty(ideology)) {
                        const impact = baseImpact * this.crisisImpactMultiplier;
                        this.ideologyScores[ideology] = this.clampMetric(this.ideologyScores[ideology] + impact);
                    }
                }
            }
            
            // Calculate crisis consistency
            this.calculateCrisisConsistency(response, crisis);
            
            // Validate state after processing
            this.validateState();
            
            return impacts;
            
        } catch (error) {
            console.error('Failed to process crisis response:', error);
            throw error;
        }
    }
    
    // Record metric change with trend data
    recordMetricChange(metricName, oldValue, newValue, change, source) {
        const year = this.gameState ? this.gameState.currentYear : 1;
        
        this.metricTrends[metricName].push({
            year: year,
            value: newValue,
            change: change,
            previousValue: oldValue,
            source: source,
            timestamp: new Date().toISOString()
        });
        
        // Keep trend history manageable (last 25 entries)
        if (this.metricTrends[metricName].length > 25) {
            this.metricTrends[metricName] = this.metricTrends[metricName].slice(-25);
        }
    }
    
    // Calculate consistency bonus based on ideological alignment
    calculateConsistencyBonus(choice) {
        if (!choice.ideologyImpacts) return;
        
        // Find the strongest ideology in this choice
        let strongestIdeology = null;
        let strongestImpact = 0;
        
        for (const [ideology, impact] of Object.entries(choice.ideologyImpacts)) {
            if (Math.abs(impact) > Math.abs(strongestImpact)) {
                strongestIdeology = ideology;
                strongestImpact = impact;
            }
        }
        
        if (!strongestIdeology) return;
        
        // Check consistency with previous decisions
        if (this.dominantIdeology === strongestIdeology && strongestImpact > 0) {
            // Consistent with dominant ideology - bonus
            this.consistencyBonus += 1;
        } else if (this.dominantIdeology && strongestImpact < 0) {
            // Contradicts dominant ideology - penalty
            this.ideologicalConflicts += 1;
        }
    }
    
    // Calculate crisis response consistency
    calculateCrisisConsistency(response, crisis) {
        if (!response.ideologyImpacts || !this.dominantIdeology) return;
        
        // Check if crisis response aligns with dominant ideology
        const dominantIdeologyImpact = response.ideologyImpacts[this.dominantIdeology];
        
        if (dominantIdeologyImpact && dominantIdeologyImpact > 0) {
            this.crisisResponseConsistency += 1;
        } else {
            this.crisisResponseConsistency -= 1;
        }
    }
    
    // Track recent decisions for analysis
    trackRecentDecision(choice, impacts) {
        const decisionRecord = {
            year: this.gameState ? this.gameState.currentYear : 1,
            choice: choice,
            impacts: impacts,
            timestamp: new Date().toISOString()
        };
        
        this.recentDecisions.push(decisionRecord);
        
        // Keep only last 10 decisions
        if (this.recentDecisions.length > 10) {
            this.recentDecisions = this.recentDecisions.slice(-10);
        }
        
        // Track strongest impacts
        for (const impact of impacts) {
            if (Math.abs(impact.change) >= 5) { // Significant impact threshold
                this.strongestImpacts.push({
                    year: decisionRecord.year,
                    metric: impact.metric,
                    change: impact.change,
                    choice: choice.text
                });
            }
        }
        
        // Keep strongest impacts manageable
        if (this.strongestImpacts.length > 50) {
            this.strongestImpacts = this.strongestImpacts.slice(-50);
        }
    }
    
    // Update dominant ideology based on current scores
    updateDominantIdeology() {
        let maxScore = 0;
        let dominant = null;
        
        for (const [ideology, score] of Object.entries(this.ideologyScores)) {
            if (score > maxScore) {
                maxScore = score;
                dominant = ideology;
            }
        }
        
        // Only set as dominant if score is significant (>20)
        this.dominantIdeology = maxScore > 20 ? dominant : null;
    }
    
    // Clamp metric values to 0-100 range
    clampMetric(value) {
        return Math.max(0, Math.min(100, Math.round(value * 100) / 100));
    }
    
    // Get metric trend analysis
    getMetricTrend(metricName, periods = 5) {
        if (!this.metricTrends[metricName] || this.metricTrends[metricName].length < 2) {
            return { trend: 'stable', change: 0, confidence: 'low' };
        }
        
        const recent = this.metricTrends[metricName].slice(-periods);
        const changes = recent.slice(1).map((entry, index) => 
            entry.value - recent[index].value
        );
        
        const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        
        let trend = 'stable';
        if (avgChange > 2) trend = 'improving';
        else if (avgChange < -2) trend = 'declining';
        
        return {
            trend: trend,
            change: avgChange,
            confidence: changes.length >= 3 ? 'high' : 'medium'
        };
    }
    
    // Get current metrics summary
    getMetricsSummary() {
        const summary = {
            economic: {},
            social: {},
            governance: {},
            security: {},
            environmental: {},
            qualityOfLife: {}
        };
        
        // Economic metrics
        summary.economic = {
            economicGrowth: this.metrics.economicGrowth,
            employmentRate: this.metrics.employmentRate,
            incomeInequality: this.metrics.incomeInequality,
            publicDebt: this.metrics.publicDebt,
            inflation: this.metrics.inflation,
            tradeBalance: this.metrics.tradeBalance,
            economicStability: this.metrics.economicStability
        };
        
        // Social metrics
        summary.social = {
            healthcareAccess: this.metrics.healthcareAccess,
            educationQuality: this.metrics.educationQuality,
            socialCohesion: this.metrics.socialCohesion,
            culturalDiversity: this.metrics.culturalDiversity,
            crimeRate: this.metrics.crimeRate,
            socialMobility: this.metrics.socialMobility,
            religiousSpiritualParticipation: this.metrics.religiousSpiritualParticipation,
            careWorkIntegration: this.metrics.careWorkIntegration
        };
        
        // Governance metrics
        summary.governance = {
            governanceEffectiveness: this.metrics.governanceEffectiveness,
            transparencyAccountability: this.metrics.transparencyAccountability,
            ruleOfLaw: this.metrics.ruleOfLaw,
            politicalStability: this.metrics.politicalStability,
            citizenParticipation: this.metrics.citizenParticipation,
            informationControl: this.metrics.informationControl
        };
        
        // Security metrics
        summary.security = {
            nationalSecurity: this.metrics.nationalSecurity,
            internalStability: this.metrics.internalStability,
            lawEnforcementEffectiveness: this.metrics.lawEnforcementEffectiveness,
            conflictResolution: this.metrics.conflictResolution,
            borderSecurity: this.metrics.borderSecurity
        };
        
        // Environmental metrics
        summary.environmental = {
            environmentalQuality: this.metrics.environmentalQuality,
            renewableEnergyAdoption: this.metrics.renewableEnergyAdoption,
            sustainabilityPractices: this.metrics.sustainabilityPractices,
            resourceConservation: this.metrics.resourceConservation
        };
        
        // Quality of life metrics
        summary.qualityOfLife = {
            overallHappiness: this.metrics.overallHappiness,
            workLifeBalance: this.metrics.workLifeBalance,
            workerOrganization: this.metrics.workerOrganization
        };
        
        return summary;
    }
    
    // Get ideological analysis
    getIdeologicalAnalysis() {
        const sorted = Object.entries(this.ideologyScores)
            .sort(([,a], [,b]) => b - a);
        
        const primary = sorted[0];
        const secondary = sorted[1];
        const tertiary = sorted[2];
        
        return {
            dominantIdeology: this.dominantIdeology,
            primaryIdeology: { name: primary[0], score: primary[1] },
            secondaryIdeology: { name: secondary[0], score: secondary[1] },
            tertiaryIdeology: { name: tertiary[0], score: tertiary[1] },
            consistencyBonus: this.consistencyBonus,
            ideologicalConflicts: this.ideologicalConflicts,
            crisisConsistency: this.crisisResponseConsistency,
            allScores: {...this.ideologyScores}
        };
    }
    
    // Generate comprehensive final analysis
    async generateFinalAnalysis() {
        try {
            const metricsSummary = this.getMetricsSummary();
            const ideologyAnalysis = this.getIdeologicalAnalysis();
            
            // Calculate success patterns for different ideologies
            const successPatterns = this.calculateIdeologicalSuccessPatterns();
            
            // Generate metric performance analysis
            const performanceAnalysis = this.generatePerformanceAnalysis();
            
            // Generate trend analysis
            const trendAnalysis = this.generateTrendAnalysis();
            
            // Create reflection questions
            const reflectionQuestions = this.generateReflectionQuestions(ideologyAnalysis);
            
            return {
                ideologyAnalysis: this.formatIdeologyAnalysis(ideologyAnalysis),
                metricsSummary: this.formatMetricsSummary(metricsSummary),
                successPatterns: successPatterns,
                performanceAnalysis: performanceAnalysis,
                trendAnalysis: trendAnalysis,
                reflectionQuestions: reflectionQuestions,
                gameStatistics: this.gameState ? this.gameState.getStatistics() : {},
                strongestImpacts: this.strongestImpacts,
                finalScore: this.calculateFinalScore(ideologyAnalysis, performanceAnalysis)
            };
            
        } catch (error) {
            console.error('Failed to generate final analysis:', error);
            throw error;
        }
    }
    
    // Calculate ideological success patterns
    calculateIdeologicalSuccessPatterns() {
        // Each ideology prioritizes different metrics
        const ideologyPriorities = {
            liberal: ['economicGrowth', 'citizenParticipation', 'ruleOfLaw', 'culturalDiversity', 'socialMobility'],
            conservative: ['economicStability', 'ruleOfLaw', 'internalStability', 'religiousSpiritualParticipation', 'lawEnforcementEffectiveness'],
            socialist: ['incomeInequality', 'healthcareAccess', 'educationQuality', 'workerOrganization', 'socialCohesion'],
            ecological: ['environmentalQuality', 'renewableEnergyAdoption', 'sustainabilityPractices', 'resourceConservation'],
            authoritarian: ['politicalStability', 'nationalSecurity', 'governanceEffectiveness', 'informationControl', 'internalStability'],
            feminist: ['socialMobility', 'careWorkIntegration', 'educationQuality', 'workLifeBalance', 'culturalDiversity']
        };
        
        const patterns = {};
        
        for (const [ideology, priorities] of Object.entries(ideologyPriorities)) {
            let totalScore = 0;
            let count = 0;
            
            for (const metric of priorities) {
                if (this.metrics[metric] !== undefined) {
                    // For negative metrics (inequality, crime, debt), invert the score
                    let score = this.metrics[metric];
                    if (['incomeInequality', 'crimeRate', 'publicDebt', 'informationControl'].includes(metric)) {
                        score = 100 - score;
                    }
                    totalScore += score;
                    count++;
                }
            }
            
            patterns[ideology] = {
                score: count > 0 ? totalScore / count : 0,
                alignment: this.ideologyScores[ideology],
                priorities: priorities
            };
        }
        
        return patterns;
    }
    
    // Generate performance analysis across all metrics
    generatePerformanceAnalysis() {
        const categories = ['economic', 'social', 'governance', 'security', 'environmental', 'qualityOfLife'];
        const analysis = {};
        
        for (const category of categories) {
            const categoryMetrics = this.getCategoryMetrics(category);
            let total = 0;
            let count = 0;
            let best = { metric: '', value: 0 };
            let worst = { metric: '', value: 100 };
            
            for (const [metric, value] of Object.entries(categoryMetrics)) {
                total += value;
                count++;
                
                if (value > best.value) {
                    best = { metric, value };
                }
                if (value < worst.value) {
                    worst = { metric, value };
                }
            }
            
            analysis[category] = {
                averageScore: count > 0 ? total / count : 0,
                bestMetric: best,
                worstMetric: worst,
                trend: this.getCategoryTrend(category)
            };
        }
        
        return analysis;
    }
    
    // Get metrics for a specific category
    getCategoryMetrics(category) {
        const summary = this.getMetricsSummary();
        return summary[category] || {};
    }
    
    // Get trend for a category
    getCategoryTrend(category) {
        const categoryMetrics = this.getCategoryMetrics(category);
        const trends = Object.keys(categoryMetrics).map(metric => 
            this.getMetricTrend(metric)
        );
        
        const avgChange = trends.reduce((sum, trend) => sum + trend.change, 0) / trends.length;
        
        if (avgChange > 1) return 'improving';
        if (avgChange < -1) return 'declining';
        return 'stable';
    }
    
    // Generate trend analysis
    generateTrendAnalysis() {
        const significantTrends = [];
        
        for (const [metricName, value] of Object.entries(this.metrics)) {
            const trend = this.getMetricTrend(metricName);
            
            if (Math.abs(trend.change) > 3) { // Significant change threshold
                significantTrends.push({
                    metric: metricName,
                    trend: trend.trend,
                    change: trend.change,
                    currentValue: value
                });
            }
        }
        
        return {
            significantTrends: significantTrends.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)),
            overallDirection: this.calculateOverallDirection(),
            volatility: this.calculateVolatility()
        };
    }
    
    // Get metric information for dashboard display
    getMetricInfo() {
        return {
            // Economic metrics
            economicGrowth: { name: 'Economic Growth', description: 'The rate of increase in the nation\'s economic output and productivity' },
            economicStability: { name: 'Economic Stability', description: 'The consistency and predictability of economic performance' },
            employmentRate: { name: 'Employment Rate', description: 'The percentage of the working-age population that is employed' },
            incomeInequality: { name: 'Income Inequality', description: 'The gap between the highest and lowest income earners (lower is better)' },
            tradeBalance: { name: 'Trade Balance', description: 'The difference between exports and imports' },
            publicDebt: { name: 'Public Debt', description: 'The total amount of money the government owes (lower is better)' },
            inflation: { name: 'Inflation Control', description: 'The stability of prices and currency value' },
            
            // Social metrics
            healthcareAccess: { name: 'Healthcare Access', description: 'The availability and quality of healthcare services for all citizens' },
            educationQuality: { name: 'Education Quality', description: 'The effectiveness and accessibility of educational institutions' },
            socialCohesion: { name: 'Social Cohesion', description: 'The strength of relationships and unity among different groups in society' },
            culturalDiversity: { name: 'Cultural Diversity', description: 'The acceptance and celebration of different cultures and backgrounds' },
            crimeRate: { name: 'Crime Rate', description: 'The level of criminal activity in society (lower is better)' },
            socialMobility: { name: 'Social Mobility', description: 'The ability of individuals to improve their social and economic status' },
            religiousSpiritualParticipation: { name: 'Religious/Spiritual Participation', description: 'The level of engagement in religious and spiritual activities' },
            careWorkIntegration: { name: 'Care Work Integration', description: 'The recognition and integration of care work in the economy' },
            
            // Governance metrics
            governanceEffectiveness: { name: 'Governance Effectiveness', description: 'The quality and efficiency of government institutions and policies' },
            transparencyAccountability: { name: 'Transparency & Accountability', description: 'The openness of government and responsibility to citizens' },
            ruleOfLaw: { name: 'Rule of Law', description: 'The extent to which laws are fairly and consistently enforced' },
            politicalStability: { name: 'Political Stability', description: 'The consistency and predictability of the political system' },
            citizenParticipation: { name: 'Citizen Participation', description: 'The level of citizen engagement in democratic processes' },
            informationControl: { name: 'Information Control', description: 'The degree of government control over information and media (lower is better for freedom)' },
            
            // Security metrics
            nationalSecurity: { name: 'National Security', description: 'The protection of the nation from external threats' },
            internalStability: { name: 'Internal Stability', description: 'The maintenance of peace and order within the country' },
            lawEnforcementEffectiveness: { name: 'Law Enforcement Effectiveness', description: 'The ability of law enforcement to maintain order and safety' },
            conflictResolution: { name: 'Conflict Resolution', description: 'The effectiveness of systems for resolving disputes peacefully' },
            borderSecurity: { name: 'Border Security', description: 'The control and protection of national borders' },
            
            // Environmental metrics
            environmentalQuality: { name: 'Environmental Quality', description: 'The health and cleanliness of the natural environment' },
            renewableEnergyAdoption: { name: 'Renewable Energy Adoption', description: 'The transition to sustainable energy sources' },
            sustainabilityPractices: { name: 'Sustainability Practices', description: 'The implementation of environmentally sustainable policies' },
            resourceConservation: { name: 'Resource Conservation', description: 'The efficient use and preservation of natural resources' },
            
            // Quality of life metrics
            overallHappiness: { name: 'Overall Happiness', description: 'The general well-being and life satisfaction of citizens' },
            workLifeBalance: { name: 'Work-Life Balance', description: 'The balance between work demands and personal life' },
            workerOrganization: { name: 'Worker Organization', description: 'The strength and effectiveness of labor unions and worker rights' }
        };
    }
    
    // Calculate overall direction of the nation
    calculateOverallDirection() {
        const allTrends = Object.keys(this.metrics).map(metric => 
            this.getMetricTrend(metric).change
        );
        
        const avgChange = allTrends.reduce((sum, change) => sum + change, 0) / allTrends.length;
        
        if (avgChange > 1) return 'improving';
        if (avgChange < -1) return 'declining';
        return 'stable';
    }
    
    // Calculate volatility (how much metrics are changing)
    calculateVolatility() {
        const allTrends = Object.keys(this.metrics).map(metric => 
            Math.abs(this.getMetricTrend(metric).change)
        );
        
        const avgVolatility = allTrends.reduce((sum, change) => sum + change, 0) / allTrends.length;
        
        if (avgVolatility > 3) return 'high';
        if (avgVolatility > 1) return 'moderate';
        return 'low';
    }
    
    // Generate reflection questions based on performance
    generateReflectionQuestions(ideologyAnalysis) {
        const questions = [];
        
        // Add ideology-specific questions
        if (ideologyAnalysis.dominantIdeology) {
            questions.push(`Your governance style aligned most with ${ideologyAnalysis.dominantIdeology} principles. How do you think this ideology shaped your decision-making?`);
        }
        
        // Add performance-based questions
        const performanceAnalysis = this.generatePerformanceAnalysis();
        const bestCategory = Object.entries(performanceAnalysis)
            .sort(([,a], [,b]) => b.averageScore - a.averageScore)[0];
        const worstCategory = Object.entries(performanceAnalysis)
            .sort(([,a], [,b]) => a.averageScore - b.averageScore)[0];
        
        if (bestCategory) {
            questions.push(`Your ${bestCategory[0]} policies performed best. What decisions do you think contributed to this success?`);
        }
        
        if (worstCategory) {
            questions.push(`Your ${worstCategory[0]} policies faced challenges. Looking back, what would you do differently?`);
        }
        
        // Add consistency questions
        if (this.ideologicalConflicts > 3) {
            questions.push('Your decisions showed some ideological inconsistency. In real governance, how might such conflicts arise?');
        }
        
        // Add crisis questions
        if (this.gameState && this.gameState.totalCrises > 0) {
            questions.push('How did crisis situations affect your decision-making? Did you maintain your principles or adapt pragmatically?');
        }
        
        return questions;
    }
    
    // Calculate final score
    calculateFinalScore(ideologyAnalysis, performanceAnalysis) {
        // Base score from metric performance
        const categoryScores = Object.values(performanceAnalysis).map(cat => cat.averageScore);
        const avgMetricScore = categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length;
        
        // Consistency bonus
        const consistencyScore = Math.max(0, this.consistencyBonus - this.ideologicalConflicts) * 2;
        
        // Crisis handling bonus
        const crisisScore = Math.max(0, this.crisisResponseConsistency) * 3;
        
        const finalScore = Math.min(100, avgMetricScore + consistencyScore + crisisScore);
        
        return {
            total: Math.round(finalScore),
            breakdown: {
                metrics: Math.round(avgMetricScore),
                consistency: Math.round(consistencyScore),
                crisisHandling: Math.round(crisisScore)
            }
        };
    }
    
    // Format ideology analysis for display
    formatIdeologyAnalysis(analysis) {
        let html = `<h3>Your Governing Philosophy</h3>`;
        
        if (analysis.dominantIdeology) {
            html += `<p><strong>Primary Alignment:</strong> ${this.capitalizeFirst(analysis.dominantIdeology)} (${analysis.primaryIdeology.score.toFixed(1)} points)</p>`;
        } else {
            html += `<p><strong>Primary Alignment:</strong> Mixed approach - no single ideology dominated</p>`;
        }
        
        html += `<div class="ideology-scores">`;
        for (const [ideology, score] of Object.entries(analysis.allScores)) {
            const percentage = Math.round((score / 100) * 100);
            html += `<div class="ideology-bar">
                <span class="ideology-name">${this.capitalizeFirst(ideology)}</span>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="score-value">${score.toFixed(1)}</span>
            </div>`;
        }
        html += `</div>`;
        
        if (analysis.consistencyBonus > 0) {
            html += `<p><strong>Consistency Bonus:</strong> +${analysis.consistencyBonus} (maintained ideological coherence)</p>`;
        }
        
        if (analysis.ideologicalConflicts > 0) {
            html += `<p><strong>Ideological Conflicts:</strong> ${analysis.ideologicalConflicts} (decisions that contradicted your main approach)</p>`;
        }
        
        return html;
    }
    
    // Format metrics summary for display
    formatMetricsSummary(summary) {
        let html = `<h3>National Performance Summary</h3>`;
        
        const categories = [
            { key: 'economic', name: 'Economic' },
            { key: 'social', name: 'Social' },
            { key: 'governance', name: 'Governance' },
            { key: 'security', name: 'Security' },
            { key: 'environmental', name: 'Environmental' },
            { key: 'qualityOfLife', name: 'Quality of Life' }
        ];
        
        for (const category of categories) {
            const metrics = summary[category.key];
            const avgScore = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.values(metrics).length;
            
            html += `<div class="category-summary">
                <h4>${category.name} (Average: ${avgScore.toFixed(1)})</h4>
                <div class="metrics-grid">`;
            
            for (const [metricName, value] of Object.entries(metrics)) {
                const displayName = this.formatMetricName(metricName);
                const color = this.getMetricColor(value);
                
                html += `<div class="metric-item">
                    <span class="metric-name">${displayName}</span>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: ${value}%; background-color: ${color}"></div>
                    </div>
                    <span class="metric-value">${value.toFixed(1)}</span>
                </div>`;
            }
            
            html += `</div></div>`;
        }
        
        return html;
    }
    
    // Utility functions
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    formatMetricName(metricName) {
        return metricName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    
    getMetricColor(value) {
        if (value >= 75) return '#4CAF50'; // Green
        if (value >= 50) return '#FFC107'; // Yellow
        if (value >= 25) return '#FF9800'; // Orange
        return '#F44336'; // Red
    }
    
    // Validate choice structure
    validateChoice(choice) {
        if (!choice) {
            this.validationErrors.push('Choice is null or undefined');
            return false;
        }
        
        // Basic structure validation
        if (!choice.text && !choice.choiceText) {
            this.validationErrors.push('Choice missing text');
            return false;
        }
        
        return true;
    }
    
    // Validate scoring system state
    validateState() {
        this.validationErrors = [];
        this.isValid = true;
        
        // Check metric bounds
        for (const [metricName, value] of Object.entries(this.metrics)) {
            if (value < 0 || value > 100) {
                this.validationErrors.push(`Metric ${metricName} out of bounds: ${value}`);
                this.isValid = false;
            }
        }
        
        // Check ideology score bounds
        for (const [ideology, score] of Object.entries(this.ideologyScores)) {
            if (score < 0 || score > 100) {
                this.validationErrors.push(`Ideology score ${ideology} out of bounds: ${score}`);
                this.isValid = false;
            }
        }
        
        // Check trend data integrity
        for (const [metricName, trends] of Object.entries(this.metricTrends)) {
            if (!Array.isArray(trends)) {
                this.validationErrors.push(`Invalid trend data for ${metricName}`);
                this.isValid = false;
            }
        }
        
        if (!this.isValid) {
            console.warn('Scoring system validation failed:', this.validationErrors);
        }
        
        return this.isValid;
    }
    
    // Serialize for saving
    serialize() {
        return {
            version: this.version,
            metrics: this.metrics,
            metricTrends: this.metricTrends,
            ideologyScores: this.ideologyScores,
            consistencyBonus: this.consistencyBonus,
            ideologicalConflicts: this.ideologicalConflicts,
            dominantIdeology: this.dominantIdeology,
            totalDecisionImpacts: this.totalDecisionImpacts,
            strongestImpacts: this.strongestImpacts,
            recentDecisions: this.recentDecisions,
            crisisResponseConsistency: this.crisisResponseConsistency,
            timestamp: new Date().toISOString()
        };
    }
    
    // Deserialize from saved data
    deserialize(data) {
        try {
            // Check version compatibility
            if (data.version && data.version !== this.version) {
                console.warn(`Scoring system version mismatch: saved=${data.version}, current=${this.version}`);
            }
            
            // Restore core data
            Object.assign(this, data);
            
            // Ensure required properties exist
            this.validationErrors = [];
            this.isValid = true;
            
            // Validate restored state
            if (!this.validateState()) {
                console.warn('Loaded scoring state is invalid');
                // Could attempt repairs here if needed
            }
            
            console.log('Scoring system state loaded successfully');
            
        } catch (error) {
            console.error('Failed to deserialize scoring system:', error);
            throw new Error('Scoring system deserialization failed');
        }
    }
}

export { ScoringSystem }; 