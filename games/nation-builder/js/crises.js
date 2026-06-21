// Crisis Management System
// Handles both random and consequence-driven crisis events

class CrisisManager {
    constructor() {
        this.gameState = null;
        this.scoringSystem = null;
        this.crisisData = null;
        this.activeCrises = new Map();
        this.crisisHistory = [];
        
        // Crisis distribution (40% random, 60% consequence-driven per README)
        this.randomCrisisChance = 0.4;
        this.consequenceCrisisChance = 0.6;
        
        // Crisis frequency per phase (roughly every 2-3 years)
        this.crisisFrequency = {
            Foundation: 0.3,    // 1-3 years: Lower frequency, simpler crises
            Growth: 0.4,        // 4-10 years: Moderate frequency
            Maturity: 0.5,      // 11-17 years: Higher frequency, complex crises
            Legacy: 0.4         // 18-20 years: Moderate frequency, high stakes
        };
        
        // Crisis intensity levels
        this.intensityLevels = {
            minor: { impactMultiplier: 1.0, duration: 1, urgency: 'low' },
            moderate: { impactMultiplier: 1.5, duration: 2, urgency: 'medium' },
            major: { impactMultiplier: 2.0, duration: 3, urgency: 'high' },
            catastrophic: { impactMultiplier: 3.0, duration: 4, urgency: 'critical' }
        };
        
        // Track crisis triggers for consequence-driven crises
        this.consequenceTriggers = new Map();
        this.lastCrisisYear = 0;
    }
    
    // Initialize crisis manager
    async init(gameState, scoringSystem) {
        this.gameState = gameState;
        this.scoringSystem = scoringSystem;
        await this.loadCrisisData();
        this.initializeConsequenceTriggers();
        console.log('Crisis manager initialized');
    }
    
    // Load crisis data
    async loadCrisisData() {
        try {
            const response = await fetch('data/crises.json');
            this.crisisData = await response.json();
            console.log('Crisis data loaded');
        } catch (error) {
            console.error('Failed to load crisis data:', error);
            this.crisisData = this.getBuiltInCrises();
        }
    }
    
    // Initialize consequence trigger tracking
    initializeConsequenceTriggers() {
        // Set up triggers for each policy track
        for (const track of Object.keys(this.gameState.policyEscalationTracks)) {
            this.consequenceTriggers.set(track, {
                lastValue: 0,
                accumulated: 0,
                threshold: 30 // Minimum change to trigger consequence crisis
            });
        }
    }
    
    // Check if a crisis should occur this year
    shouldTriggerCrisis() {
        const currentYear = this.gameState.currentYear;
        const phase = this.gameState.currentPhase;
        
        // Don't trigger crises too frequently
        if (currentYear - this.lastCrisisYear < 2) {
            return false;
        }
        
        // Check base frequency for phase
        const baseChance = this.crisisFrequency[phase] || 0.3;
        
        // Increase chance based on accumulated tensions
        const tensionMultiplier = this.calculateTensionMultiplier();
        const finalChance = Math.min(baseChance * tensionMultiplier, 0.8);
        
        return Math.random() < finalChance;
    }
    
    // Calculate tension multiplier based on policy conflicts
    calculateTensionMultiplier() {
        const tracks = this.gameState.policyEscalationTracks;
        let tensionScore = 0;
        
        // Check for conflicting high policy tracks
        const conflicts = [
            ['market_freedom', 'wealth_redistribution'],
            ['state_authority', 'social_equality'],
            ['environmental_protection', 'market_freedom'],
            ['traditional_stability', 'social_equality']
        ];
        
        for (const [track1, track2] of conflicts) {
            if (tracks[track1] > 50 && tracks[track2] > 50) {
                tensionScore += (tracks[track1] + tracks[track2]) / 100;
            }
        }
        
        // Check for extreme values in any track
        for (const value of Object.values(tracks)) {
            if (value > 70) {
                tensionScore += (value - 70) / 30;
            }
        }
        
        return 1 + (tensionScore * 0.3); // Max 30% increase per tension point
    }
    
    // Generate a crisis event
    generateCrisis() {
        // Determine if this should be random or consequence-driven
        const isConsequenceDriven = Math.random() < this.consequenceCrisisChance;
        
        let crisis;
        if (isConsequenceDriven) {
            crisis = this.generateConsequenceCrisis();
        }
        
        // Fall back to random crisis if no consequence crisis available
        if (!crisis) {
            crisis = this.generateRandomCrisis();
        }
        
        if (crisis) {
            this.lastCrisisYear = this.gameState.currentYear;
            this.activeCrises.set(crisis.id, crisis);
            
            // Log crisis for history
            this.crisisHistory.push({
                crisis: crisis,
                year: this.gameState.currentYear,
                phase: this.gameState.currentPhase,
                type: isConsequenceDriven ? 'consequence' : 'random'
            });
            
            console.log(`🚨 Crisis triggered: ${crisis.title} (${crisis.type})`);
        }
        
        return crisis;
    }
    
    // Generate consequence-driven crisis
    generateConsequenceCrisis() {
        const tracks = this.gameState.policyEscalationTracks;
        
        // Get metrics safely - use fallback if method doesn't exist
        let metrics = {};
        if (this.scoringSystem && typeof this.scoringSystem.getCurrentMetrics === 'function') {
            metrics = this.scoringSystem.getCurrentMetrics();
        } else {
            // Fallback metrics for testing
            metrics = {
                internalStability: 50,
                nationalSecurity: 50,
                economicStability: 50
            };
        }
        
        // Check for specific consequence triggers
        
        // Economic crises from extreme policies
        if (tracks.market_freedom > 80 || tracks.wealth_redistribution > 80) {
            return this.createEconomicConsequenceCrisis(tracks);
        }
        
        // Social crises from conflicting values
        if (tracks.state_authority > 70 && tracks.social_equality > 50) {
            return this.createSocialConsequenceCrisis(tracks);
        }
        
        // Environmental crises from neglect
        if (tracks.environmental_protection < 30 && this.gameState.currentYear > 10) {
            return this.createEnvironmentalConsequenceCrisis(tracks);
        }
        
        // Political crises from extreme authority
        if (tracks.state_authority > 80) {
            return this.createPoliticalConsequenceCrisis(tracks);
        }
        
        // Security crises from instability
        if (metrics.internalStability < 40 || metrics.nationalSecurity < 40) {
            return this.createSecurityConsequenceCrisis(tracks, metrics);
        }
        
        return null; // No consequence crisis triggered
    }
    
    // Generate random crisis
    generateRandomCrisis() {
        const phase = this.gameState.currentPhase;
        const availableCrises = this.getAvailableCrises(phase);
        
        if (availableCrises.length === 0) {
            return this.createEmergencyCrisis();
        }
        
        // Select random crisis
        const crisisTemplate = availableCrises[Math.floor(Math.random() * availableCrises.length)];
        
        // Determine intensity based on phase and current tensions
        const intensity = this.determineIntensity(phase);
        
        return this.createCrisisFromTemplate(crisisTemplate, intensity, 'random');
    }
    
    // Create economic consequence crisis
    createEconomicConsequenceCrisis(tracks) {
        if (tracks.market_freedom > 80) {
            return {
                id: `market_crash_${this.gameState.currentYear}`,
                type: 'economic',
                subtype: 'market_crash',
                title: "Market Crash in Newlandia",
                description: "Extreme deregulation has led to a massive market crash as speculative bubbles burst across multiple sectors.",
                context: `Your free market policies (${tracks.market_freedom}/100) have created an unstable financial system vulnerable to crashes.`,
                intensity: 'major',
                urgency: 'critical',
                year: this.gameState.currentYear,
                choices: [
                    {
                        text: "Emergency government intervention and market stabilization",
                        ideologyAlignment: { "socialist": 6, "liberal": -3 },
                        metricImpacts: { 
                            "economicStability": 8, 
                            "economicGrowth": -4, 
                            "publicDebt": 6,
                            "employmentRate": 3
                        },
                        policyImpacts: { 
                            "market_freedom": -15, 
                            "state_authority": 10 
                        },
                        consequences: "Government intervention stabilizes markets but reduces economic freedom."
                    },
                    {
                        text: "Let markets self-correct without government interference",
                        ideologyAlignment: { "liberal": 8, "conservative": 4 },
                        metricImpacts: { 
                            "economicStability": -6, 
                            "economicGrowth": -8, 
                            "employmentRate": -6,
                            "incomeInequality": 8
                        },
                        policyImpacts: { 
                            "market_freedom": 5 
                        },
                        consequences: "Market correction is severe but preserves free market principles."
                    },
                    {
                        text: "Targeted support for affected workers and small businesses",
                        ideologyAlignment: { "liberal": 4, "socialist": 4, "feminist": 3 },
                        metricImpacts: { 
                            "economicStability": 3, 
                            "socialCohesion": 4, 
                            "publicDebt": 3,
                            "workLifeBalance": 2
                        },
                        policyImpacts: { 
                            "wealth_redistribution": 8, 
                            "social_equality": 5 
                        },
                        consequences: "Selective support helps vulnerable groups weather the crisis."
                    }
                ],
                consequences: {
                    immediate: "Financial markets are in turmoil and unemployment is rising rapidly.",
                    longTerm: "The response will shape public trust in market mechanisms for years to come."
                },
                triggers: { market_freedom: 80 },
                duration: 3
            };
        }
        
        return null;
    }
    
    // Create social consequence crisis
    createSocialConsequenceCrisis(tracks) {
        return {
            id: `civil_unrest_${this.gameState.currentYear}`,
            type: 'social',
            subtype: 'civil_unrest',
            title: "Civil Unrest and Protests",
            description: "Massive protests erupt as citizens clash over your authoritarian equality enforcement.",
            context: `Your state authority (${tracks.state_authority}/100) and social equality (${tracks.social_equality}/100) policies have created a volatile situation.`,
            intensity: 'major',
            urgency: 'high',
            year: this.gameState.currentYear,
            choices: [
                {
                    text: "Use security forces to suppress protests and maintain order",
                    ideologyAlignment: { "authoritarian": 9, "conservative": 4 },
                    metricImpacts: { 
                        "internalStability": 6, 
                        "citizenParticipation": -8, 
                        "socialCohesion": -5,
                        "lawEnforcementEffectiveness": 4
                    },
                    policyImpacts: { 
                        "state_authority": 12, 
                        "social_equality": -8 
                    },
                    consequences: "Order is restored but at the cost of civil liberties and trust."
                },
                {
                    text: "Negotiate with protest leaders and address grievances",
                    ideologyAlignment: { "liberal": 6, "socialist": 5, "feminist": 4 },
                    metricImpacts: { 
                        "citizenParticipation": 6, 
                        "socialCohesion": 4, 
                        "transparencyAccountability": 3,
                        "conflictResolution": 5
                    },
                    policyImpacts: { 
                        "social_equality": 8, 
                        "state_authority": -5 
                    },
                    consequences: "Dialogue reduces tensions but government authority is questioned."
                }
            ],
            consequences: {
                immediate: "The streets are filled with protesters and counter-protesters.",
                longTerm: "This crisis will define the relationship between state power and citizen rights."
            },
            triggers: { state_authority: 70, social_equality: 50 },
            duration: 2
        };
    }
    
    // Create environmental consequence crisis
    createEnvironmentalConsequenceCrisis(tracks) {
        return {
            id: `environmental_disaster_${this.gameState.currentYear}`,
            type: 'environmental',
            subtype: 'pollution_crisis',
            title: "Environmental Disaster Strikes",
            description: "Years of environmental neglect culminate in a major ecological disaster affecting public health and the economy.",
            context: `Your low environmental protection (${tracks.environmental_protection}/100) has allowed environmental degradation to reach crisis levels.`,
            intensity: 'major',
            urgency: 'critical',
            year: this.gameState.currentYear,
            choices: [
                {
                    text: "Emergency environmental cleanup and strict new regulations",
                    ideologyAlignment: { "ecological": 9, "socialist": 5 },
                    metricImpacts: { 
                        "environmentalQuality": 8, 
                        "healthcareAccess": 4, 
                        "economicGrowth": -6,
                        "sustainabilityPractices": 6
                    },
                    policyImpacts: { 
                        "environmental_protection": 20, 
                        "state_authority": 8 
                    },
                    consequences: "Aggressive action begins to address the crisis but hurts short-term growth."
                }
            ],
            consequences: {
                immediate: "Air and water quality have reached dangerous levels affecting public health.",
                longTerm: "Environmental damage may take decades to reverse if action is not taken now."
            },
            triggers: { environmental_protection: 30 },
            duration: 4
        };
    }
    
    // Create political consequence crisis
    createPoliticalConsequenceCrisis(tracks) {
        return {
            id: `constitutional_crisis_${this.gameState.currentYear}`,
            type: 'political',
            subtype: 'constitutional_crisis',
            title: "Constitutional Crisis Emerges",
            description: "Opposition groups and international observers challenge the legitimacy of your increasingly authoritarian government.",
            context: `Your extreme state authority (${tracks.state_authority}/100) has triggered a constitutional crisis.`,
            intensity: 'catastrophic',
            urgency: 'critical',
            year: this.gameState.currentYear,
            choices: [
                {
                    text: "Declare emergency powers and suspend constitutional protections",
                    ideologyAlignment: { "authoritarian": 10 },
                    metricImpacts: { 
                        "governanceEffectiveness": 6, 
                        "citizenParticipation": -12, 
                        "ruleOfLaw": -8,
                        "internalStability": 4
                    },
                    policyImpacts: { 
                        "state_authority": 20, 
                        "social_equality": -15 
                    },
                    consequences: "Total authoritarian control is achieved but legitimacy is destroyed."
                }
            ],
            consequences: {
                immediate: "Government legitimacy is questioned both domestically and internationally.",
                longTerm: "This crisis will determine whether Newlandia remains on an authoritarian path."
            },
            triggers: { state_authority: 80 },
            duration: 3
        };
    }
    
    // Create security consequence crisis
    createSecurityConsequenceCrisis(tracks, metrics) {
        return {
            id: `security_crisis_${this.gameState.currentYear}`,
            type: 'security',
            subtype: 'internal_instability',
            title: "National Security Crisis",
            description: "Internal instability and weak security have created opportunities for external threats and domestic extremism.",
            context: `Low internal stability (${Math.round(metrics.internalStability || 0)}/100) and security concerns threaten national safety.`,
            intensity: 'major',
            urgency: 'high',
            year: this.gameState.currentYear,
            choices: [
                {
                    text: "Implement martial law and expand security apparatus",
                    ideologyAlignment: { "authoritarian": 9, "conservative": 5 },
                    metricImpacts: { 
                        "nationalSecurity": 8, 
                        "internalStability": 6, 
                        "citizenParticipation": -6,
                        "lawEnforcementEffectiveness": 6
                    },
                    policyImpacts: { 
                        "state_authority": 15, 
                        "social_equality": -8 
                    },
                    consequences: "Security improves but civil liberties are severely restricted."
                }
            ],
            consequences: {
                immediate: "Security threats are escalating and public safety is at risk.",
                longTerm: "The response will shape the balance between security and freedom."
            },
            triggers: { metrics: { internalStability: 40, nationalSecurity: 40 } },
            duration: 2
        };
    }
    
    // Get available crises for current phase
    getAvailableCrises(phase) {
        if (!this.crisisData || !this.crisisData.random) return [];
        
        return this.crisisData.random.filter(crisis => {
            // Check phase requirements
            if (crisis.phases && !crisis.phases.includes(phase)) {
                return false;
            }
            
            // Check year requirements
            if (crisis.minYear && this.gameState.currentYear < crisis.minYear) {
                return false;
            }
            
            if (crisis.maxYear && this.gameState.currentYear > crisis.maxYear) {
                return false;
            }
            
            return true;
        });
    }
    
    // Determine crisis intensity based on phase and tensions
    determineIntensity(phase) {
        const tensionMultiplier = this.calculateTensionMultiplier();
        
        let baseIntensity;
        switch (phase) {
            case 'Foundation':
                baseIntensity = tensionMultiplier > 1.5 ? 'moderate' : 'minor';
                break;
            case 'Growth':
                baseIntensity = tensionMultiplier > 2.0 ? 'major' : 'moderate';
                break;
            case 'Maturity':
                baseIntensity = tensionMultiplier > 2.5 ? 'catastrophic' : 'major';
                break;
            case 'Legacy':
                baseIntensity = tensionMultiplier > 2.0 ? 'catastrophic' : 'major';
                break;
            default:
                baseIntensity = 'moderate';
        }
        
        return baseIntensity;
    }
    
    // Create crisis from template
    createCrisisFromTemplate(template, intensity, source) {
        const intensityData = this.intensityLevels[intensity];
        
        return {
            id: `${template.id}_${this.gameState.currentYear}`,
            type: template.type,
            subtype: template.subtype || template.type,
            title: template.title.replace('{nation}', 'Newlandia'),
            description: template.description.replace('{nation}', 'Newlandia'),
            context: this.enhanceCrisisContext(template.context),
            intensity: intensity,
            urgency: intensityData.urgency,
            year: this.gameState.currentYear,
            choices: template.choices.map(choice => ({
                ...choice,
                text: choice.text.replace('{nation}', 'Newlandia'),
                metricImpacts: this.scaleCrisisImpacts(choice.metricImpacts, intensityData.impactMultiplier)
            })),
            consequences: template.consequences,
            duration: intensityData.duration,
            source: source
        };
    }
    
    // Enhance crisis context with current game state
    enhanceCrisisContext(baseContext) {
        let enhanced = baseContext || '';
        
        // Add current year and phase context
        enhanced = enhanced
            .replace('{year}', this.gameState.currentYear)
            .replace('{phase}', this.gameState.currentPhase.toLowerCase())
            .replace('{nation}', 'Newlandia');
        
        return enhanced;
    }
    
    // Scale crisis impacts based on intensity
    scaleCrisisImpacts(impacts, multiplier) {
        if (!impacts) return {};
        
        const scaled = {};
        for (const [metric, value] of Object.entries(impacts)) {
            scaled[metric] = Math.round(value * multiplier);
        }
        return scaled;
    }
    
    // Create emergency crisis when no others available
    createEmergencyCrisis() {
        return {
            id: `emergency_${this.gameState.currentYear}`,
            type: 'political',
            subtype: 'governance_challenge',
            title: "Unexpected Governance Challenge",
            description: "An unexpected challenge tests your leadership and decision-making abilities.",
            context: "Various factors have combined to create a situation requiring immediate government response.",
            intensity: 'moderate',
            urgency: 'medium',
            year: this.gameState.currentYear,
            choices: [
                {
                    text: "Take decisive government action to address the challenge",
                    ideologyAlignment: { "authoritarian": 5, "conservative": 3 },
                    metricImpacts: { "governanceEffectiveness": 3, "internalStability": 2 },
                    policyImpacts: { "state_authority": 8 },
                    consequences: "Strong leadership resolves the immediate issue."
                },
                {
                    text: "Consult with citizens and experts before deciding",
                    ideologyAlignment: { "liberal": 5, "socialist": 4 },
                    metricImpacts: { "citizenParticipation": 4, "transparencyAccountability": 3 },
                    policyImpacts: { "social_equality": 5 },
                    consequences: "Inclusive approach builds consensus but takes time."
                }
            ],
            consequences: {
                immediate: "The situation requires immediate attention and decision-making.",
                longTerm: "Your response will be remembered as an example of your leadership style."
            },
            duration: 1,
            source: 'emergency'
        };
    }
    
    // Process crisis response
    processCrisisResponse(crisisId, choiceIndex) {
        const crisis = this.activeCrises.get(crisisId);
        if (!crisis || !crisis.choices[choiceIndex]) {
            console.error('Invalid crisis or choice');
            return null;
        }
        
        const choice = crisis.choices[choiceIndex];
        
        // Apply metric impacts
        if (choice.metricImpacts && this.scoringSystem && typeof this.scoringSystem.applyMetricChanges === 'function') {
            this.scoringSystem.applyMetricChanges(choice.metricImpacts, `Crisis: ${crisis.title}`);
        } else if (choice.metricImpacts) {
            console.log('Crisis metric impacts (scoring system not available):', choice.metricImpacts);
        }
        
        // Apply policy impacts
        if (choice.policyImpacts) {
            for (const [track, impact] of Object.entries(choice.policyImpacts)) {
                this.gameState.policyEscalationTracks[track] = Math.max(0, 
                    Math.min(100, this.gameState.policyEscalationTracks[track] + impact)
                );
            }
        }
        
        // Record crisis response
        const response = {
            crisis: crisis,
            choice: choice,
            choiceIndex: choiceIndex,
            year: this.gameState.currentYear,
            consequences: choice.consequences
        };
        
        // Add to game state history
        if (this.gameState.crisisHistory) {
            this.gameState.crisisHistory.push(response);
        }
        
        // Remove from active crises if not ongoing
        if (crisis.duration <= 1) {
            this.activeCrises.delete(crisisId);
        } else {
            crisis.duration--;
        }
        
        console.log(`Crisis response processed: ${crisis.title} - ${choice.text}`);
        return response;
    }
    
    // Get crisis statistics
    getCrisisStats() {
        return {
            total: this.crisisHistory.length,
            active: this.activeCrises.size,
            lastCrisisYear: this.lastCrisisYear
        };
    }
    
    // Get active crises
    getActiveCrises() {
        return Array.from(this.activeCrises.values());
    }
    
    // Reset crisis manager
    reset() {
        this.activeCrises.clear();
        this.crisisHistory = [];
        this.lastCrisisYear = 0;
        this.initializeConsequenceTriggers();
        console.log('Crisis manager reset');
    }
    
    // Built-in crisis data
    getBuiltInCrises() {
        return {
            random: [
                {
                    id: 'natural_disaster',
                    type: 'environmental',
                    subtype: 'natural_disaster',
                    title: 'Natural Disaster Strikes {nation}',
                    description: 'A major natural disaster has struck, requiring immediate government response.',
                    context: 'Emergency services are overwhelmed and citizens look to the government for help.',
                    phases: ['Foundation', 'Growth', 'Maturity', 'Legacy'],
                    choices: [
                        {
                            text: 'Massive government disaster relief and reconstruction',
                            ideologyAlignment: { "socialist": 6, "authoritarian": 4 },
                            metricImpacts: { "internalStability": 4, "publicDebt": 6, "socialCohesion": 3 },
                            policyImpacts: { "state_authority": 8, "wealth_redistribution": 5 },
                            consequences: 'Strong government response builds trust but increases debt.'
                        },
                        {
                            text: 'Coordinate private sector and volunteer relief efforts',
                            ideologyAlignment: { "liberal": 6, "conservative": 4 },
                            metricImpacts: { "socialCohesion": 4, "economicGrowth": 2, "citizenParticipation": 3 },
                            policyImpacts: { "market_freedom": 5, "social_equality": 3 },
                            consequences: 'Market-based response is efficient but coverage may be uneven.'
                        }
                    ],
                    consequences: {
                        immediate: 'The disaster has caused significant damage and disruption.',
                        longTerm: 'Recovery efforts will shape public expectations of government.'
                    }
                }
            ]
        };
    }
}

export { CrisisManager }; 