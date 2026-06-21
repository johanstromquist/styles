// Dynamic Question Generation System
// Generates contextual questions with policy escalation mechanics

class QuestionEngine {
    constructor() {
        this.gameState = null;
        this.questionData = null;
        this.usedQuestions = new Set();
        this.questionHistory = [];
        
        // 7 Decision Domains as specified in README
        this.domains = [
            'economic',
            'education', 
            'healthcare',
            'environmental',
            'socialJustice',
            'militarySecurity',
            'governance'
        ];
        
        // Policy escalation weight increase (0.15 per README)
        this.escalationBonus = 0.15;
        
        // Question generation weights based on policy tracks
        this.domainWeights = {
            economic: 1.0,
            education: 1.0,
            healthcare: 1.0,
            environmental: 1.0,
            socialJustice: 1.0,
            militarySecurity: 1.0,
            governance: 1.0
        };
        
        // Track which advanced questions have been unlocked
        this.unlockedAdvancedQuestions = {
            state_authority: false,
            market_freedom: false,
            wealth_redistribution: false,
            environmental_protection: false,
            social_equality: false,
            traditional_stability: false
        };
        
        // Advanced agenda setting mechanics
        this.agendaInfluences = {
            recentDecisions: new Map(), // Track recent decision patterns
            emergingIssues: new Set(), // Issues that become prominent
            escalationSpirals: new Map(), // Track escalation patterns
            crossDomainEffects: new Map() // Track how decisions in one domain affect others
        };
        
        // Question quality and variety tracking
        this.domainUsageCount = {};
        this.questionTypes = ['basic', 'intermediate', 'advanced', 'crisis_response'];
        this.lastQuestionDomain = null;
        this.consecutiveSameDomain = 0;
        
        // Enhanced escalation phases
        this.escalationPhases = {
            initial: { min: 0, max: 29, label: 'Initial Direction' },
            consolidation: { min: 30, max: 59, label: 'Consolidation' },
            advanced: { min: 60, max: 79, label: 'Advanced Implementation' },
            extreme: { min: 80, max: 100, label: 'Extreme Measures' }
        };
        
        // Initialize domain usage tracking
        this.domains.forEach(domain => {
            this.domainUsageCount[domain] = 0;
        });
    }
    
    // Initialize question engine
    async init(gameState) {
        this.gameState = gameState;
        await this.loadQuestionData();
        this.initializeAgendaSetting();
        console.log('Question engine initialized with enhanced agenda setting');
    }
    
    // Load question data from JSON file
    async loadQuestionData() {
        try {
            const response = await fetch('data/questions.json');
            this.questionData = await response.json();
            console.log('Question data loaded successfully');
        } catch (error) {
            console.error('Failed to load question data:', error);
            // Use fallback questions
            this.questionData = this.getFallbackQuestions();
        }
    }
    
    // Initialize agenda setting system
    initializeAgendaSetting() {
        // Set up tracking for each policy track
        for (const track of Object.keys(this.gameState.policyEscalationTracks)) {
            this.agendaInfluences.escalationSpirals.set(track, {
                momentum: 0,
                lastValue: 0,
                accelerating: false
            });
        }
        
        // Initialize cross-domain effect tracking
        this.domains.forEach(domain => {
            this.agendaInfluences.crossDomainEffects.set(domain, new Set());
        });
    }
    
    // Generate a contextual question based on game state
    async generateQuestion() {
        try {
            // Update agenda influences based on recent game state
            this.updateAgendaInfluences();
            
            // Update domain weights with enhanced agenda setting
            this.updateDomainWeightsAdvanced();
            
            // Check for advanced question unlocks
            this.checkAdvancedUnlocks();
            
            // Select domain using sophisticated agenda setting
            const selectedDomain = this.selectDomainWithAgenda();
            
            // Get available questions for domain and phase
            const availableQuestions = this.getAvailableQuestions(selectedDomain);
            
            if (availableQuestions.length === 0) {
                console.warn(`No available questions for domain: ${selectedDomain}`);
                return this.generateFallbackQuestion(selectedDomain);
            }
            
            // Select specific question with variety considerations
            const questionTemplate = this.selectQuestionWithVariety(availableQuestions, selectedDomain);
            
            // Generate question instance with enhanced context
            const question = this.generateQuestionInstance(questionTemplate);
            
            // Track question usage and patterns
            this.trackQuestionUsage(question, selectedDomain);
            
            // Add to question history for agenda analysis
            this.questionHistory.push({
                id: question.id,
                domain: selectedDomain,
                year: this.gameState.currentYear,
                phase: this.gameState.currentPhase,
                policyTracks: {...this.gameState.policyEscalationTracks}
            });
            
            return question;
            
        } catch (error) {
            console.error('Failed to generate question:', error);
            return this.generateEmergencyFallback();
        }
    }
    
    // Update agenda influences based on recent game state changes
    updateAgendaInfluences() {
        // Track recent decision patterns
        if (this.gameState.decisionHistory.length > 0) {
            const recentDecisions = this.gameState.decisionHistory.slice(-3);
            
            for (const decision of recentDecisions) {
                const domain = decision.decision.domain;
                if (domain) {
                    const count = this.agendaInfluences.recentDecisions.get(domain) || 0;
                    this.agendaInfluences.recentDecisions.set(domain, count + 1);
                }
            }
        }
        
        // Update escalation spirals
        for (const [track, currentValue] of Object.entries(this.gameState.policyEscalationTracks)) {
            const spiral = this.agendaInfluences.escalationSpirals.get(track);
            if (spiral) {
                const change = currentValue - spiral.lastValue;
                spiral.momentum = change;
                spiral.accelerating = change > 5; // Significant change threshold
                spiral.lastValue = currentValue;
            }
        }
        
        // Identify emerging issues based on metric trends
        this.identifyEmergingIssues();
        
        // Update cross-domain effects
        this.updateCrossDomainEffects();
    }
    
    // Identify emerging issues based on metric changes
    identifyEmergingIssues() {
        // This would ideally use the scoring system's trend data
        // For now, we'll use policy track momentum
        
        this.agendaInfluences.emergingIssues.clear();
        
        for (const [track, spiral] of this.agendaInfluences.escalationSpirals) {
            if (spiral.accelerating) {
                // Map policy tracks to relevant domains
                switch (track) {
                    case 'state_authority':
                        this.agendaInfluences.emergingIssues.add('governance');
                        this.agendaInfluences.emergingIssues.add('militarySecurity');
                        break;
                    case 'market_freedom':
                        this.agendaInfluences.emergingIssues.add('economic');
                        break;
                    case 'wealth_redistribution':
                        this.agendaInfluences.emergingIssues.add('economic');
                        this.agendaInfluences.emergingIssues.add('socialJustice');
                        break;
                    case 'environmental_protection':
                        this.agendaInfluences.emergingIssues.add('environmental');
                        break;
                    case 'social_equality':
                        this.agendaInfluences.emergingIssues.add('socialJustice');
                        this.agendaInfluences.emergingIssues.add('education');
                        break;
                    case 'traditional_stability':
                        this.agendaInfluences.emergingIssues.add('governance');
                        this.agendaInfluences.emergingIssues.add('education');
                        break;
                }
            }
        }
    }
    
    // Update cross-domain effects
    updateCrossDomainEffects() {
        // Economic decisions affect other domains
        if (this.gameState.policyEscalationTracks.market_freedom > 50) {
            this.agendaInfluences.crossDomainEffects.get('healthcare').add('privatization_pressure');
            this.agendaInfluences.crossDomainEffects.get('education').add('school_choice_debate');
        }
        
        if (this.gameState.policyEscalationTracks.wealth_redistribution > 50) {
            this.agendaInfluences.crossDomainEffects.get('economic').add('tax_reform_pressure');
            this.agendaInfluences.crossDomainEffects.get('socialJustice').add('inequality_focus');
        }
        
        // Environmental decisions create spillovers
        if (this.gameState.policyEscalationTracks.environmental_protection > 50) {
            this.agendaInfluences.crossDomainEffects.get('economic').add('green_transition');
            this.agendaInfluences.crossDomainEffects.get('militarySecurity').add('climate_security');
        }
        
        // Authority decisions affect civil liberties across domains
        if (this.gameState.policyEscalationTracks.state_authority > 60) {
            this.agendaInfluences.crossDomainEffects.get('education').add('curriculum_control');
            this.agendaInfluences.crossDomainEffects.get('healthcare').add('public_health_authority');
            this.agendaInfluences.crossDomainEffects.get('socialJustice').add('protest_restrictions');
        }
    }
    
    // Enhanced domain weight calculation with agenda setting
    updateDomainWeightsAdvanced() {
        const tracks = this.gameState.policyEscalationTracks;
        
        // Reset to base weights
        for (const domain of this.domains) {
            this.domainWeights[domain] = 1.0;
        }
        
        // Apply escalation bonuses (compound effect for higher values)
        for (const [track, value] of Object.entries(tracks)) {
            if (value > 30) {
                const escalationMultiplier = 1 + (value / 100) * this.escalationBonus;
                
                switch (track) {
                    case 'state_authority':
                        this.domainWeights.governance *= escalationMultiplier;
                        this.domainWeights.militarySecurity *= escalationMultiplier;
                        if (value > 60) {
                            this.domainWeights.education *= 1.1; // Secondary effect
                        }
                        break;
                        
                    case 'market_freedom':
                        this.domainWeights.economic *= escalationMultiplier;
                        if (value > 60) {
                            this.domainWeights.healthcare *= 1.1;
                            this.domainWeights.education *= 1.1;
                        }
                        break;
                        
                    case 'wealth_redistribution':
                        this.domainWeights.economic *= escalationMultiplier;
                        this.domainWeights.socialJustice *= escalationMultiplier;
                        break;
                        
                    case 'environmental_protection':
                        this.domainWeights.environmental *= escalationMultiplier;
                        if (value > 60) {
                            this.domainWeights.economic *= 1.1; // Green economy questions
                        }
                        break;
                        
                    case 'social_equality':
                        this.domainWeights.socialJustice *= escalationMultiplier;
                        this.domainWeights.education *= escalationMultiplier;
                        if (value > 60) {
                            this.domainWeights.healthcare *= 1.1; // Healthcare equity
                        }
                        break;
                        
                    case 'traditional_stability':
                        this.domainWeights.governance *= escalationMultiplier;
                        this.domainWeights.education *= escalationMultiplier;
                        break;
                }
            }
        }
        
        // Apply emerging issues bonuses
        for (const emergingDomain of this.agendaInfluences.emergingIssues) {
            this.domainWeights[emergingDomain] *= 1.3; // Strong boost for emerging issues
        }
        
        // Apply recent decision momentum
        for (const [domain, count] of this.agendaInfluences.recentDecisions) {
            if (count >= 2) {
                // If we've made multiple decisions in a domain, it becomes more prominent
                this.domainWeights[domain] *= 1.2;
            }
        }
        
        // Prevent excessive repetition of same domain
        if (this.consecutiveSameDomain >= 2) {
            this.domainWeights[this.lastQuestionDomain] *= 0.5;
        }
        
        // Balance underused domains
        const avgUsage = Object.values(this.domainUsageCount).reduce((sum, count) => sum + count, 0) / this.domains.length;
        for (const [domain, count] of Object.entries(this.domainUsageCount)) {
            if (count < avgUsage * 0.7) {
                this.domainWeights[domain] *= 1.2; // Boost underused domains
            }
        }
    }
    
    // Select domain with sophisticated agenda setting
    selectDomainWithAgenda() {
        // Calculate total weight
        const totalWeight = Object.values(this.domainWeights).reduce((sum, weight) => sum + weight, 0);
        
        // Apply some randomness but weighted heavily toward agenda
        let random = Math.random() * totalWeight;
        
        // Sort domains by weight (highest first) for logging
        const sortedDomains = Object.entries(this.domainWeights)
            .sort(([,a], [,b]) => b - a);
        
        console.log('Domain weights:', sortedDomains.map(([domain, weight]) => 
            `${domain}: ${weight.toFixed(2)}`).join(', '));
        
        // Select based on weighted random
        for (const [domain, weight] of Object.entries(this.domainWeights)) {
            random -= weight;
            if (random <= 0) {
                return domain;
            }
        }
        
        // Fallback to highest weighted domain
        return sortedDomains[0][0];
    }
    
    // Check if advanced questions should be unlocked
    checkAdvancedUnlocks() {
        const tracks = this.gameState.policyEscalationTracks;
        
        // 3-phase escalation: Initial (30+), Consolidation (60+), Advanced (80+)
        for (const [track, value] of Object.entries(tracks)) {
            if (value >= 80 && !this.unlockedAdvancedQuestions[track]) {
                this.unlockedAdvancedQuestions[track] = true;
                console.log(`🔓 Advanced ${track} questions unlocked (${value}/100)`);
                
                // Log the escalation achievement
                if (this.gameState.logEvent) {
                    this.gameState.logEvent('advanced_questions_unlocked', {
                        track: track,
                        value: value,
                        year: this.gameState.currentYear
                    });
                }
            }
        }
    }
    
    // Get available questions for domain and current game state
    getAvailableQuestions(domain) {
        if (!this.questionData.questionTemplates[domain]) {
            console.warn(`No questions found for domain: ${domain}`);
            return [];
        }
        
        const domainQuestions = this.questionData.questionTemplates[domain].questions;
        const phase = this.gameState.currentPhase;
        const year = this.gameState.currentYear;
        
        const availableQuestions = domainQuestions.filter(question => {
            // Check if already used (with some reuse allowed for variety)
            if (this.usedQuestions.has(question.id)) {
                // Allow reuse of basic questions after 5+ years
                const lastUsed = this.getLastUsedYear(question.id);
                if (question.level === 'basic' && year - lastUsed < 5) {
                    return false;
                }
                // Never reuse advanced questions
                if (question.level === 'advanced') {
                    return false;
                }
            }
            
            // Check phase requirements
            if (question.phases && !question.phases.includes(phase)) {
                return false;
            }
            
            // Check year requirements
            if (question.minYear && year < question.minYear) {
                return false;
            }
            
            if (question.maxYear && year > question.maxYear) {
                return false;
            }
            
            // Check policy track requirements for advanced questions
            if (question.requiredTracks) {
                for (const [track, minValue] of Object.entries(question.requiredTracks)) {
                    if (this.gameState.policyEscalationTracks[track] < minValue) {
                        return false;
                    }
                }
            }
            
            // Check for cross-domain requirements
            if (question.crossDomainRequirements) {
                for (const requirement of question.crossDomainRequirements) {
                    if (!this.agendaInfluences.crossDomainEffects.get(domain)?.has(requirement)) {
                        return false;
                    }
                }
            }
            
            return true;
        });
        
        console.log(`Available questions for ${domain}: ${availableQuestions.length}`);
        return availableQuestions;
    }
    
    // Get the last year a question was used
    getLastUsedYear(questionId) {
        for (let i = this.questionHistory.length - 1; i >= 0; i--) {
            if (this.questionHistory[i].id === questionId) {
                return this.questionHistory[i].year;
            }
        }
        return 0; // Never used
    }
    
    // Select question with variety considerations
    selectQuestionWithVariety(availableQuestions, domain) {
        if (availableQuestions.length === 1) {
            return availableQuestions[0];
        }
        
        // Prioritize by escalation level and question type variety
        const escalationPhase = this.getCurrentEscalationPhase(domain);
        
        // Filter by appropriate level for current escalation
        let preferredQuestions = availableQuestions.filter(q => {
            switch (escalationPhase) {
                case 'initial':
                    return q.level === 'basic';
                case 'consolidation':
                    return q.level === 'basic' || q.level === 'intermediate';
                case 'advanced':
                    return q.level === 'intermediate' || q.level === 'advanced';
                case 'extreme':
                    return q.level === 'advanced';
                default:
                    return true;
            }
        });
        
        // If no preferred questions, use all available
        if (preferredQuestions.length === 0) {
            preferredQuestions = availableQuestions;
        }
        
        // Add some randomness but prefer variety
        const recentQuestionTypes = this.questionHistory.slice(-5).map(q => 
            this.getQuestionById(q.id)?.level || 'basic'
        );
        
        // Prefer question types we haven't used recently
        const varietyQuestions = preferredQuestions.filter(q => 
            !recentQuestionTypes.includes(q.level)
        );
        
        const finalPool = varietyQuestions.length > 0 ? varietyQuestions : preferredQuestions;
        
        // Select randomly from final pool
        return finalPool[Math.floor(Math.random() * finalPool.length)];
    }
    
    // Get current escalation phase for a domain
    getCurrentEscalationPhase(domain) {
        // Find the most relevant policy track for this domain
        let maxTrackValue = 0;
        
        const relevantTracks = this.getDomainRelevantTracks(domain);
        for (const track of relevantTracks) {
            const value = this.gameState.policyEscalationTracks[track];
            if (value > maxTrackValue) {
                maxTrackValue = value;
            }
        }
        
        // Determine phase
        for (const [phase, range] of Object.entries(this.escalationPhases)) {
            if (maxTrackValue >= range.min && maxTrackValue <= range.max) {
                return phase;
            }
        }
        
        return 'initial';
    }
    
    // Get relevant policy tracks for a domain
    getDomainRelevantTracks(domain) {
        const trackMapping = {
            economic: ['market_freedom', 'wealth_redistribution'],
            education: ['social_equality', 'traditional_stability'],
            healthcare: ['social_equality', 'market_freedom'],
            environmental: ['environmental_protection'],
            socialJustice: ['social_equality', 'wealth_redistribution'],
            militarySecurity: ['state_authority'],
            governance: ['state_authority', 'traditional_stability']
        };
        
        return trackMapping[domain] || [];
    }
    
    // Get question by ID
    getQuestionById(questionId) {
        for (const domain of this.domains) {
            if (this.questionData.questionTemplates[domain] && this.questionData.questionTemplates[domain].questions) {
                const question = this.questionData.questionTemplates[domain].questions.find(q => q.id === questionId);
                if (question) return question;
            }
        }
        return null;
    }
    
    // Track question usage and patterns
    trackQuestionUsage(question, domain) {
        // Mark as used
        this.usedQuestions.add(question.id);
        
        // Update domain usage count
        this.domainUsageCount[domain]++;
        
        // Track consecutive same domain
        if (this.lastQuestionDomain === domain) {
            this.consecutiveSameDomain++;
        } else {
            this.consecutiveSameDomain = 1;
            this.lastQuestionDomain = domain;
        }
        
        // Clear recent decisions influence after use
        this.agendaInfluences.recentDecisions.clear();
    }
    
    // Generate question instance with enhanced context
    generateQuestionInstance(template) {
        // Create unique question ID
        const questionId = `${template.id}_${this.gameState.currentYear}_${Date.now()}`;
        
        // Process template text with current context
        const title = this.processTemplate(template.template);
        const description = template.context ? this.processTemplate(template.context.background) : '';
        const context = template.context || null;
        
        // Enhance context with current situation
        const enhancedContext = this.enhanceContext(context, template.domain);
        
        // Process choices
        const processedChoices = template.choices.map((choice, index) => ({
            id: `${questionId}_choice_${index}`,
            text: this.processTemplate(choice.text),
            ideologyAlignment: choice.ideologyAlignment || {},
            metricImpacts: choice.metricImpacts || {},
            policyImpacts: choice.policyImpacts || {},
            description: choice.description ? this.processTemplate(choice.description) : null
        }));
        
        return {
            id: questionId,
            templateId: template.id,
            title: title,
            description: description,
            context: enhancedContext,
            choices: processedChoices,
            domain: template.domain,
            level: template.level || 'basic',
            year: this.gameState.currentYear,
            phase: this.gameState.currentPhase
        };
    }
    
    // Enhance context with current game situation
    enhanceContext(baseContext, domain) {
        let enhanced = baseContext || '';
        
        // Add escalation context
        const escalationPhase = this.getCurrentEscalationPhase(domain);
        const relevantTracks = this.getDomainRelevantTracks(domain);
        
        if (escalationPhase === 'advanced' || escalationPhase === 'extreme') {
            const highestTrack = relevantTracks.reduce((highest, track) => {
                return this.gameState.policyEscalationTracks[track] > this.gameState.policyEscalationTracks[highest] 
                    ? track : highest;
            }, relevantTracks[0]);
            
            if (highestTrack) {
                const trackValue = this.gameState.policyEscalationTracks[highestTrack];
                enhanced += ` Your previous ${this.formatTrackName(highestTrack)} policies (${trackValue}/100) have created momentum for further changes.`;
            }
        }
        
        // Add cross-domain context
        const crossEffects = this.agendaInfluences.crossDomainEffects.get(domain);
        if (crossEffects && crossEffects.size > 0) {
            const effects = Array.from(crossEffects);
            enhanced += ` Recent decisions in other areas have created ${this.formatCrossEffects(effects)}.`;
        }
        
        // Add crisis context if recent crises occurred
        if (this.gameState.crisisHistory && this.gameState.crisisHistory.length > 0) {
            const recentCrisis = this.gameState.crisisHistory[this.gameState.crisisHistory.length - 1];
            if (this.gameState.currentYear - recentCrisis.year <= 2) {
                enhanced += ` The recent ${recentCrisis.crisis.type} crisis continues to influence policy discussions.`;
            }
        }
        
        return enhanced;
    }
    
    // Format policy track names for display
    formatTrackName(track) {
        const names = {
            state_authority: 'state authority',
            market_freedom: 'free market',
            wealth_redistribution: 'wealth redistribution',
            environmental_protection: 'environmental protection',
            social_equality: 'social equality',
            traditional_stability: 'traditional stability'
        };
        return names[track] || track;
    }
    
    // Format cross-domain effects for display
    formatCrossEffects(effects) {
        const descriptions = {
            privatization_pressure: 'pressure for privatization',
            school_choice_debate: 'renewed school choice debates',
            tax_reform_pressure: 'calls for tax reform',
            inequality_focus: 'increased focus on inequality',
            green_transition: 'economic transition pressures',
            climate_security: 'climate security concerns',
            curriculum_control: 'debates over curriculum control',
            public_health_authority: 'questions about health authority',
            protest_restrictions: 'civil liberties concerns'
        };
        
        return effects.map(effect => descriptions[effect] || effect).join(' and ');
    }
    
    // Process template text with current context
    processTemplate(text) {
        if (!text || typeof text !== 'string') return '';
        
        return text
            .replace(/{nation}/g, 'Newlandia')
            .replace(/{year}/g, this.gameState.currentYear.toString())
            .replace(/{phase}/g, this.gameState.currentPhase.toLowerCase())
            .replace(/{leader}/g, 'Leader'); // Could be personalized later
    }
    
    // Generate fallback question when no questions available
    generateFallbackQuestion(domain) {
        console.log(`Generating fallback question for domain: ${domain}`);
        
        const fallbackQuestions = {
            economic: {
                title: "Economic Policy Review",
                description: "Your economic advisors request guidance on current fiscal priorities.",
                choices: [
                    {
                        text: "Focus on economic growth and business development",
                        ideologyAlignment: { liberal: 6, conservative: 3 },
                        metricImpacts: { economicGrowth: 4, employmentRate: 3 },
                        policyImpacts: { market_freedom: 10 }
                    },
                    {
                        text: "Prioritize income equality and worker protections",
                        ideologyAlignment: { socialist: 7, feminist: 4 },
                        metricImpacts: { incomeInequality: -4, socialCohesion: 3 },
                        policyImpacts: { wealth_redistribution: 12 }
                    },
                    {
                        text: "Maintain balanced approach to economic policy",
                        ideologyAlignment: { conservative: 3 },
                        metricImpacts: { economicStability: 3 },
                        policyImpacts: { traditional_stability: 5 }
                    }
                ]
            },
            // Add other domain fallbacks...
        };
        
        const fallback = fallbackQuestions[domain] || fallbackQuestions.economic;
        
        return {
            id: `fallback_${domain}_${this.gameState.currentYear}`,
            templateId: `fallback_${domain}`,
            title: fallback.title,
            description: fallback.description,
            context: "Your advisors await your decision on this important matter.",
            choices: fallback.choices.map((choice, index) => ({
                id: `fallback_${domain}_choice_${index}`,
                ...choice
            })),
            domain: domain,
            level: 'basic',
            year: this.gameState.currentYear,
            phase: this.gameState.currentPhase,
            isFallback: true
        };
    }
    
    // Generate emergency fallback when everything fails
    generateEmergencyFallback() {
        return {
            id: `emergency_${Date.now()}`,
            templateId: 'emergency_fallback',
            title: "Leadership Decision Required",
            description: "A situation has arisen that requires your immediate attention and decision.",
            context: "Your advisors present you with options to address current challenges.",
            choices: [
                {
                    id: 'emergency_choice_1',
                    text: "Take decisive action to address the situation",
                    ideologyAlignment: { authoritarian: 3 },
                    metricImpacts: { governanceEffectiveness: 2 },
                    policyImpacts: { state_authority: 5 }
                },
                {
                    id: 'emergency_choice_2',
                    text: "Consult with experts and stakeholders before deciding",
                    ideologyAlignment: { liberal: 3 },
                    metricImpacts: { citizenParticipation: 2 },
                    policyImpacts: { social_equality: 3 }
                },
                {
                    id: 'emergency_choice_3',
                    text: "Maintain stability and avoid hasty changes",
                    ideologyAlignment: { conservative: 3 },
                    metricImpacts: { politicalStability: 2 },
                    policyImpacts: { traditional_stability: 5 }
                }
            ],
            domain: 'governance',
            level: 'basic',
            year: this.gameState.currentYear,
            phase: this.gameState.currentPhase,
            isEmergency: true
        };
    }
    
    // Get comprehensive question engine statistics
    getQuestionStats() {
        return {
            totalQuestionsGenerated: this.questionHistory.length,
            usedQuestions: this.usedQuestions.size,
            domainUsage: {...this.domainUsageCount},
            currentWeights: {...this.domainWeights},
            unlockedAdvanced: {...this.unlockedAdvancedQuestions},
            escalationPhases: Object.entries(this.gameState.policyEscalationTracks).map(([track, value]) => ({
                track,
                value,
                phase: this.getEscalationPhase(track, value)
            })),
            agendaInfluences: {
                emergingIssues: Array.from(this.agendaInfluences.emergingIssues),
                recentDecisions: Object.fromEntries(this.agendaInfluences.recentDecisions),
                escalationSpirals: Object.fromEntries(
                    Array.from(this.agendaInfluences.escalationSpirals.entries()).map(([track, data]) => [
                        track, { momentum: data.momentum, accelerating: data.accelerating }
                    ])
                )
            }
        };
    }
    
    // Get escalation phase for a specific track
    getEscalationPhase(track, value) {
        for (const [phase, range] of Object.entries(this.escalationPhases)) {
            if (value >= range.min && value <= range.max) {
                return range.label;
            }
        }
        return 'Unknown';
    }
    
    // Reset question engine state
    reset() {
        this.usedQuestions.clear();
        this.questionHistory = [];
        this.domainUsageCount = {};
        this.domains.forEach(domain => {
            this.domainUsageCount[domain] = 0;
        });
        this.lastQuestionDomain = null;
        this.consecutiveSameDomain = 0;
        
        // Reset agenda influences
        this.agendaInfluences.recentDecisions.clear();
        this.agendaInfluences.emergingIssues.clear();
        this.agendaInfluences.escalationSpirals.clear();
        this.agendaInfluences.crossDomainEffects.clear();
        
        // Reset unlocked questions
        for (const track of Object.keys(this.unlockedAdvancedQuestions)) {
            this.unlockedAdvancedQuestions[track] = false;
        }
        
        console.log('Question engine reset');
    }
    
    // Check if a specific question is available
    isQuestionAvailable(questionId) {
        return !this.usedQuestions.has(questionId);
    }
    
    // Get questions by domain (for testing/debugging)
    getQuestionsByDomain(domain) {
        if (!this.questionData.questionTemplates[domain] || !this.questionData.questionTemplates[domain].questions) {
            return [];
        }
        return this.questionData.questionTemplates[domain].questions;
    }
    
    // Get current policy direction summary
    getPolicyDirection() {
        const tracks = this.gameState.policyEscalationTracks;
        const directions = [];
        
        for (const [track, value] of Object.entries(tracks)) {
            if (value > 40) {
                directions.push({
                    track: this.formatTrackName(track),
                    value: value,
                    phase: this.getEscalationPhase(track, value)
                });
            }
        }
        
        return directions.sort((a, b) => b.value - a.value);
    }
    
    // Enhanced fallback questions with more variety
    getFallbackQuestions() {
        return {
            metadata: {
                version: "1.0",
                totalQuestions: 21,
                domains: 7,
                description: "Fallback question templates"
            },
            domains: {
                economic: [
                    {
                        id: "economic_fallback_1",
                        title: "Economic Policy Direction",
                        description: "Your finance minister seeks guidance on economic priorities.",
                        choices: [
                            {
                                text: "Prioritize business growth and free markets",
                                ideologyAlignment: { liberal: 6, conservative: 3 },
                                metricImpacts: { economicGrowth: 4, employmentRate: 3 },
                                policyImpacts: { market_freedom: 10 }
                            },
                            {
                                text: "Focus on reducing inequality through redistribution",
                                ideologyAlignment: { socialist: 7, feminist: 4 },
                                metricImpacts: { incomeInequality: -4, socialCohesion: 3 },
                                policyImpacts: { wealth_redistribution: 12 }
                            },
                            {
                                text: "Maintain balanced approach to economic policy",
                                ideologyAlignment: { conservative: 3 },
                                metricImpacts: { economicStability: 3 },
                                policyImpacts: { traditional_stability: 5 }
                            }
                        ],
                        phases: ["Foundation", "Growth", "Maturity", "Legacy"],
                        level: "basic",
                        domain: "economic"
                    }
                ],
                education: [
                    {
                        id: "education_fallback_1",
                        title: "Education System Review",
                        description: "Your education minister requests direction on school policies.",
                        choices: [
                            {
                                text: "Expand school choice and competition",
                                ideologyAlignment: { liberal: 5, conservative: 4 },
                                metricImpacts: { educationQuality: 3 },
                                policyImpacts: { market_freedom: 8 }
                            },
                            {
                                text: "Strengthen public education with equal access",
                                ideologyAlignment: { socialist: 6, feminist: 5 },
                                metricImpacts: { educationQuality: 4, socialMobility: 3 },
                                policyImpacts: { social_equality: 10 }
                            },
                            {
                                text: "Focus on traditional curriculum and values",
                                ideologyAlignment: { conservative: 7, authoritarian: 3 },
                                metricImpacts: { socialCohesion: 3 },
                                policyImpacts: { traditional_stability: 8 }
                            }
                        ],
                        phases: ["Foundation", "Growth", "Maturity", "Legacy"],
                        level: "basic",
                        domain: "education"
                    }
                ],
                healthcare: [
                    {
                        id: "healthcare_fallback_1",
                        title: "Healthcare Policy Direction",
                        description: "Your health minister seeks guidance on healthcare priorities.",
                        choices: [
                            {
                                text: "Expand universal healthcare coverage",
                                ideologyAlignment: { socialist: 8, feminist: 5 },
                                metricImpacts: { healthcareAccess: 5, socialCohesion: 3 },
                                policyImpacts: { social_equality: 12 }
                            },
                            {
                                text: "Encourage private healthcare competition",
                                ideologyAlignment: { liberal: 6, conservative: 3 },
                                metricImpacts: { healthcareAccess: 2, economicGrowth: 2 },
                                policyImpacts: { market_freedom: 8 }
                            },
                            {
                                text: "Maintain current healthcare system",
                                ideologyAlignment: { conservative: 4 },
                                metricImpacts: { politicalStability: 2 },
                                policyImpacts: { traditional_stability: 5 }
                            }
                        ],
                        phases: ["Foundation", "Growth", "Maturity", "Legacy"],
                        level: "basic",
                        domain: "healthcare"
                    }
                ],
                environmental: [
                    {
                        id: "environmental_fallback_1",
                        title: "Environmental Policy Framework",
                        description: "Your environmental minister proposes new conservation measures.",
                        choices: [
                            {
                                text: "Implement strict environmental regulations",
                                ideologyAlignment: { ecological: 9, socialist: 4 },
                                metricImpacts: { environmentalQuality: 6, sustainabilityPractices: 5 },
                                policyImpacts: { environmental_protection: 15 }
                            },
                            {
                                text: "Balance environmental concerns with economic growth",
                                ideologyAlignment: { liberal: 4, conservative: 5 },
                                metricImpacts: { environmentalQuality: 2, economicGrowth: 2 },
                                policyImpacts: { market_freedom: 5, environmental_protection: 5 }
                            },
                            {
                                text: "Prioritize economic development over environmental concerns",
                                ideologyAlignment: { conservative: 3, authoritarian: 2 },
                                metricImpacts: { economicGrowth: 4, environmentalQuality: -3 },
                                policyImpacts: { market_freedom: 8 }
                            }
                        ],
                        phases: ["Foundation", "Growth", "Maturity", "Legacy"],
                        level: "basic",
                        domain: "environmental"
                    }
                ],
                socialJustice: [
                    {
                        id: "social_justice_fallback_1",
                        title: "Social Equality Initiative",
                        description: "Civil rights groups request government action on equality issues.",
                        choices: [
                            {
                                text: "Launch comprehensive anti-discrimination programs",
                                ideologyAlignment: { feminist: 8, socialist: 6, liberal: 5 },
                                metricImpacts: { socialMobility: 5, culturalDiversity: 4 },
                                policyImpacts: { social_equality: 15 }
                            },
                            {
                                text: "Support voluntary diversity initiatives",
                                ideologyAlignment: { liberal: 4, conservative: 2 },
                                metricImpacts: { culturalDiversity: 2 },
                                policyImpacts: { social_equality: 5 }
                            },
                            {
                                text: "Focus on traditional community values",
                                ideologyAlignment: { conservative: 6, authoritarian: 3 },
                                metricImpacts: { socialCohesion: 3, religiousSpiritualParticipation: 2 },
                                policyImpacts: { traditional_stability: 10 }
                            }
                        ],
                        phases: ["Foundation", "Growth", "Maturity", "Legacy"],
                        level: "basic",
                        domain: "socialJustice"
                    }
                ],
                militarySecurity: [
                    {
                        id: "military_security_fallback_1",
                        title: "National Security Strategy",
                        description: "Your defense minister requests guidance on security priorities.",
                        choices: [
                            {
                                text: "Strengthen military capabilities and defense spending",
                                ideologyAlignment: { authoritarian: 7, conservative: 5 },
                                metricImpacts: { nationalSecurity: 5, borderSecurity: 4 },
                                policyImpacts: { state_authority: 12 }
                            },
                            {
                                text: "Focus on diplomatic solutions and peacekeeping",
                                ideologyAlignment: { liberal: 6, socialist: 4, ecological: 3 },
                                metricImpacts: { conflictResolution: 4, citizenParticipation: 2 },
                                policyImpacts: { social_equality: 8 }
                            },
                            {
                                text: "Maintain current defense posture",
                                ideologyAlignment: { conservative: 4 },
                                metricImpacts: { politicalStability: 2 },
                                policyImpacts: { traditional_stability: 5 }
                            }
                        ],
                        phases: ["Foundation", "Growth", "Maturity", "Legacy"],
                        level: "basic",
                        domain: "militarySecurity"
                    }
                ],
                governance: [
                    {
                        id: "governance_fallback_1",
                        title: "Government Reform Initiative",
                        description: "Your advisors propose reforms to improve government effectiveness.",
                        choices: [
                            {
                                text: "Expand citizen participation and transparency",
                                ideologyAlignment: { liberal: 7, socialist: 5, feminist: 4 },
                                metricImpacts: { citizenParticipation: 5, transparencyAccountability: 4 },
                                policyImpacts: { social_equality: 10 }
                            },
                            {
                                text: "Strengthen executive authority and efficiency",
                                ideologyAlignment: { authoritarian: 8, conservative: 4 },
                                metricImpacts: { governanceEffectiveness: 5, politicalStability: 3 },
                                policyImpacts: { state_authority: 12 }
                            },
                            {
                                text: "Preserve traditional governance structures",
                                ideologyAlignment: { conservative: 6 },
                                metricImpacts: { politicalStability: 4 },
                                policyImpacts: { traditional_stability: 8 }
                            }
                        ],
                        phases: ["Foundation", "Growth", "Maturity", "Legacy"],
                        level: "basic",
                        domain: "governance"
                    }
                ]
            }
        };
    }
}

export { QuestionEngine }; 