// Policy Scenarios and Planned Options System
// Generates policy scenarios based on current game state and escalation tracks

class ScenarioEngine {
    constructor() {
        this.gameState = null;
        this.questionEngine = null;
        this.scenarioData = null;
        this.activeScenarios = new Map();
        this.completedScenarios = new Set();
        
        // Scenario types
        this.scenarioTypes = [
            'policy_escalation',    // Scenarios triggered by high policy track values
            'cross_domain',         // Scenarios involving multiple domains
            'consequence_chain',    // Scenarios triggered by previous decisions
            'ideological_pressure', // Scenarios from ideological consistency
            'external_pressure'     // Scenarios from external events
        ];
        
        // Scenario complexity levels
        this.complexityLevels = {
            simple: { domains: 1, choices: 3, duration: 1 },
            moderate: { domains: 2, choices: 4, duration: 2 },
            complex: { domains: 3, choices: 5, duration: 3 }
        };
    }
    
    // Initialize scenario engine
    async init(gameState, questionEngine) {
        this.gameState = gameState;
        this.questionEngine = questionEngine;
        await this.loadScenarioData();
        console.log('Scenario engine initialized');
    }
    
    // Load scenario templates
    async loadScenarioData() {
        try {
            // For now, use built-in scenarios
            this.scenarioData = this.getBuiltInScenarios();
            console.log('Scenario data loaded');
        } catch (error) {
            console.error('Failed to load scenario data:', error);
            this.scenarioData = this.getFallbackScenarios();
        }
    }
    
    // Check if any scenarios should be triggered
    checkScenarioTriggers() {
        const triggeredScenarios = [];
        
        // Check policy escalation scenarios
        const escalationScenarios = this.checkPolicyEscalationScenarios();
        triggeredScenarios.push(...escalationScenarios);
        
        // Check cross-domain scenarios
        const crossDomainScenarios = this.checkCrossDomainScenarios();
        triggeredScenarios.push(...crossDomainScenarios);
        
        // Check consequence chain scenarios
        const consequenceScenarios = this.checkConsequenceChainScenarios();
        triggeredScenarios.push(...consequenceScenarios);
        
        // Check ideological pressure scenarios
        const ideologicalScenarios = this.checkIdeologicalPressureScenarios();
        triggeredScenarios.push(...ideologicalScenarios);
        
        return triggeredScenarios;
    }
    
    // Check for policy escalation scenarios
    checkPolicyEscalationScenarios() {
        const scenarios = [];
        const tracks = this.gameState.policyEscalationTracks;
        
        for (const [track, value] of Object.entries(tracks)) {
            // Check for extreme escalation scenarios (80+)
            if (value >= 80 && !this.hasCompletedScenario(`extreme_${track}`)) {
                const scenario = this.createEscalationScenario(track, 'extreme', value);
                if (scenario) scenarios.push(scenario);
            }
            
            // Check for advanced escalation scenarios (60+)
            else if (value >= 60 && !this.hasCompletedScenario(`advanced_${track}`)) {
                const scenario = this.createEscalationScenario(track, 'advanced', value);
                if (scenario) scenarios.push(scenario);
            }
        }
        
        return scenarios;
    }
    
    // Check for cross-domain scenarios
    checkCrossDomainScenarios() {
        const scenarios = [];
        const tracks = this.gameState.policyEscalationTracks;
        
        // Economic-Environmental tension
        if (tracks.market_freedom > 60 && tracks.environmental_protection > 60) {
            if (!this.hasCompletedScenario('market_vs_environment')) {
                scenarios.push(this.createCrossDomainScenario('market_vs_environment'));
            }
        }
        
        // Authority-Equality tension
        if (tracks.state_authority > 60 && tracks.social_equality > 60) {
            if (!this.hasCompletedScenario('authority_vs_equality')) {
                scenarios.push(this.createCrossDomainScenario('authority_vs_equality'));
            }
        }
        
        // Redistribution-Growth tension
        if (tracks.wealth_redistribution > 60 && tracks.market_freedom > 60) {
            if (!this.hasCompletedScenario('redistribution_vs_growth')) {
                scenarios.push(this.createCrossDomainScenario('redistribution_vs_growth'));
            }
        }
        
        // Tradition-Progress tension
        if (tracks.traditional_stability > 60 && tracks.social_equality > 60) {
            if (!this.hasCompletedScenario('tradition_vs_progress')) {
                scenarios.push(this.createCrossDomainScenario('tradition_vs_progress'));
            }
        }
        
        return scenarios;
    }
    
    // Check for consequence chain scenarios
    checkConsequenceChainScenarios() {
        const scenarios = [];
        const recentDecisions = this.gameState.decisionHistory.slice(-5);
        
        // Look for patterns in recent decisions
        const domainCounts = {};
        const policyDirections = {};
        
        for (const decision of recentDecisions) {
            const domain = decision.decision.domain;
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
            
            // Track policy directions
            if (decision.choice.policyImpacts) {
                for (const [track, impact] of Object.entries(decision.choice.policyImpacts)) {
                    policyDirections[track] = (policyDirections[track] || 0) + impact;
                }
            }
        }
        
        // Trigger scenarios for concentrated decision patterns
        for (const [domain, count] of Object.entries(domainCounts)) {
            if (count >= 3 && !this.hasCompletedScenario(`focus_${domain}`)) {
                scenarios.push(this.createConsequenceScenario('domain_focus', domain, count));
            }
        }
        
        return scenarios;
    }
    
    // Check for ideological pressure scenarios
    checkIdeologicalPressureScenarios() {
        const scenarios = [];
        
        // Get ideological alignment from scoring system
        if (this.gameState.scoringSystem) {
            const ideologyScores = this.gameState.scoringSystem.getIdeologyScores();
            
            // Find dominant ideology
            let dominantIdeology = null;
            let maxScore = 0;
            
            for (const [ideology, score] of Object.entries(ideologyScores)) {
                if (score > maxScore) {
                    maxScore = score;
                    dominantIdeology = ideology;
                }
            }
            
            // Trigger pressure scenarios for high ideological alignment
            if (maxScore > 70 && dominantIdeology) {
                if (!this.hasCompletedScenario(`pressure_${dominantIdeology}`)) {
                    scenarios.push(this.createIdeologicalPressureScenario(dominantIdeology, maxScore));
                }
            }
        }
        
        return scenarios;
    }
    
    // Create policy escalation scenario
    createEscalationScenario(track, level, value) {
        const scenarioTemplates = this.scenarioData.escalation[track];
        if (!scenarioTemplates || !scenarioTemplates[level]) return null;
        
        const template = scenarioTemplates[level];
        
        return {
            id: `${level}_${track}_${this.gameState.currentYear}`,
            type: 'policy_escalation',
            title: template.title.replace('{nation}', 'Newlandia'),
            description: template.description.replace('{value}', value),
            context: this.enhanceScenarioContext(template.context, { track, level, value }),
            complexity: level === 'extreme' ? 'complex' : 'moderate',
            domains: template.domains || [this.getTrackPrimaryDomain(track)],
            choices: template.choices.map(choice => ({
                ...choice,
                text: choice.text.replace('{nation}', 'Newlandia')
            })),
            triggers: { track, minValue: value },
            duration: template.duration || 1,
            priority: level === 'extreme' ? 'high' : 'medium'
        };
    }
    
    // Create cross-domain scenario
    createCrossDomainScenario(scenarioType) {
        const template = this.scenarioData.crossDomain[scenarioType];
        if (!template) return null;
        
        return {
            id: `${scenarioType}_${this.gameState.currentYear}`,
            type: 'cross_domain',
            title: template.title.replace('{nation}', 'Newlandia'),
            description: template.description,
            context: this.enhanceScenarioContext(template.context),
            complexity: 'complex',
            domains: template.domains,
            choices: template.choices.map(choice => ({
                ...choice,
                text: choice.text.replace('{nation}', 'Newlandia')
            })),
            triggers: template.triggers,
            duration: template.duration || 2,
            priority: 'high'
        };
    }
    
    // Create consequence chain scenario
    createConsequenceScenario(type, focus, intensity) {
        const template = this.scenarioData.consequences[type];
        if (!template) return null;
        
        return {
            id: `${type}_${focus}_${this.gameState.currentYear}`,
            type: 'consequence_chain',
            title: template.title.replace('{focus}', this.formatDomainName(focus)),
            description: template.description.replace('{intensity}', intensity),
            context: this.enhanceScenarioContext(template.context, { focus, intensity }),
            complexity: intensity >= 4 ? 'complex' : 'moderate',
            domains: [focus],
            choices: template.choices,
            triggers: { type, focus, intensity },
            duration: 1,
            priority: 'medium'
        };
    }
    
    // Create ideological pressure scenario
    createIdeologicalPressureScenario(ideology, score) {
        const template = this.scenarioData.ideological[ideology];
        if (!template) return null;
        
        return {
            id: `pressure_${ideology}_${this.gameState.currentYear}`,
            type: 'ideological_pressure',
            title: template.title.replace('{nation}', 'Newlandia'),
            description: template.description.replace('{score}', Math.round(score)),
            context: this.enhanceScenarioContext(template.context, { ideology, score }),
            complexity: score > 80 ? 'complex' : 'moderate',
            domains: template.domains,
            choices: template.choices.map(choice => ({
                ...choice,
                text: choice.text.replace('{nation}', 'Newlandia')
            })),
            triggers: { ideology, minScore: score },
            duration: template.duration || 2,
            priority: 'high'
        };
    }
    
    // Enhance scenario context with current game state
    enhanceScenarioContext(baseContext, variables = {}) {
        let enhanced = baseContext || '';
        
        // Add current year and phase
        enhanced = enhanced
            .replace('{year}', this.gameState.currentYear)
            .replace('{phase}', this.gameState.currentPhase.toLowerCase())
            .replace('{nation}', 'Newlandia');
        
        // Add variable-specific context
        if (variables.track) {
            const trackValue = this.gameState.policyEscalationTracks[variables.track];
            enhanced += ` Your ${this.formatTrackName(variables.track)} policies have reached ${trackValue}/100.`;
        }
        
        if (variables.ideology) {
            enhanced += ` Your governance style strongly reflects ${variables.ideology} principles.`;
        }
        
        // Add recent crisis context if relevant
        if (this.gameState.crisisHistory && this.gameState.crisisHistory.length > 0) {
            const recentCrisis = this.gameState.crisisHistory[this.gameState.crisisHistory.length - 1];
            if (this.gameState.currentYear - recentCrisis.year <= 2) {
                enhanced += ` The recent ${recentCrisis.crisis.type} crisis continues to influence the situation.`;
            }
        }
        
        return enhanced;
    }
    
    // Get primary domain for a policy track
    getTrackPrimaryDomain(track) {
        const mapping = {
            state_authority: 'governance',
            market_freedom: 'economic',
            wealth_redistribution: 'economic',
            environmental_protection: 'environmental',
            social_equality: 'socialJustice',
            traditional_stability: 'governance'
        };
        return mapping[track] || 'governance';
    }
    
    // Format track name for display
    formatTrackName(track) {
        const names = {
            state_authority: 'state authority',
            market_freedom: 'free market',
            wealth_redistribution: 'wealth redistribution',
            environmental_protection: 'environmental protection',
            social_equality: 'social equality',
            traditional_stability: 'traditional stability'
        };
        return names[track] || track.replace('_', ' ');
    }
    
    // Format domain name for display
    formatDomainName(domain) {
        const names = {
            economic: 'economic policy',
            education: 'education policy',
            healthcare: 'healthcare policy',
            environmental: 'environmental policy',
            socialJustice: 'social justice policy',
            militarySecurity: 'military and security policy',
            governance: 'governance policy'
        };
        return names[domain] || domain;
    }
    
    // Check if scenario has been completed
    hasCompletedScenario(scenarioId) {
        return this.completedScenarios.has(scenarioId);
    }
    
    // Mark scenario as completed
    completeScenario(scenarioId) {
        this.completedScenarios.add(scenarioId);
        this.activeScenarios.delete(scenarioId);
    }
    
    // Get active scenarios
    getActiveScenarios() {
        return Array.from(this.activeScenarios.values());
    }
    
    // Add scenario to active list
    activateScenario(scenario) {
        this.activeScenarios.set(scenario.id, scenario);
    }
    
    // Get scenario statistics
    getScenarioStats() {
        return {
            active: this.activeScenarios.size,
            completed: this.completedScenarios.size,
            totalTriggered: this.activeScenarios.size + this.completedScenarios.size,
            byType: this.getScenariosByType()
        };
    }
    
    // Get scenarios grouped by type
    getScenariosByType() {
        const byType = {};
        
        for (const scenario of this.activeScenarios.values()) {
            byType[scenario.type] = (byType[scenario.type] || 0) + 1;
        }
        
        return byType;
    }
    
    // Built-in scenario templates
    getBuiltInScenarios() {
        return {
            escalation: {
                state_authority: {
                    advanced: {
                        title: "Authoritarian Consolidation in {nation}",
                        description: "Your concentration of state power has reached a critical threshold.",
                        context: "Citizens and opposition groups are responding to your increasing authoritarianism.",
                        domains: ['governance', 'militarySecurity'],
                        choices: [
                            {
                                text: "Accelerate authoritarian consolidation",
                                ideologyAlignment: { "authoritarian": 10 },
                                metricImpacts: { "internalStability": 6, "citizenParticipation": -8 },
                                policyImpacts: { "state_authority": 15, "social_equality": -12 }
                            },
                            {
                                text: "Maintain current authority level",
                                ideologyAlignment: { "authoritarian": 6, "conservative": 4 },
                                metricImpacts: { "internalStability": 2, "politicalStability": 3 },
                                policyImpacts: { "state_authority": 5, "traditional_stability": 8 }
                            }
                        ]
                    }
                }
            },
            crossDomain: {},
            consequences: {},
            ideological: {}
        };
    }
    
    // Fallback scenarios
    getFallbackScenarios() {
        return {
            escalation: {},
            crossDomain: {},
            consequences: {},
            ideological: {}
        };
    }
}

export { ScenarioEngine }; 