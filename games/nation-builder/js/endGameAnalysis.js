// End Game Analysis & Reflection System
// Comprehensive analysis of player's 20-year leadership journey

class EndGameAnalysis {
    constructor() {
        this.gameState = null;
        this.scoringSystem = null;
        this.analysisResults = null;
        this.reflectionQuestions = [];
        this.ideologicalProfile = {};
        this.keyLearningMoments = [];
        this.countryComparisons = [];
    }
    
    // Initialize the end game analysis system
    async init(gameState, scoringSystem) {
        this.gameState = gameState;
        this.scoringSystem = scoringSystem;
        console.log('End Game Analysis system initialized');
    }
    
    // Generate comprehensive final analysis
    async generateFinalAnalysis() {
        try {
            // Calculate ideological alignment
            this.ideologicalProfile = await this.calculateIdeologicalAlignment();
            
            // Generate reflection questions
            this.reflectionQuestions = this.generateReflectionQuestions();
            
            // Identify key learning moments
            this.keyLearningMoments = this.identifyKeyLearningMoments();
            
            // Create country comparisons
            this.countryComparisons = this.generateCountryComparisons();
            
            // Compile final results
            this.analysisResults = {
                ideologicalProfile: this.ideologicalProfile,
                reflectionQuestions: this.reflectionQuestions,
                keyLearningMoments: this.keyLearningMoments,
                countryComparisons: this.countryComparisons,
                finalMetrics: this.scoringSystem.getCurrentMetrics(),
                decisionSummary: this.generateDecisionSummary(),
                successPatterns: this.analyzeSuccessPatterns(),
                learningInsights: this.generateLearningInsights()
            };
            
            return this.analysisResults;
            
        } catch (error) {
            console.error('Error generating final analysis:', error);
            throw error;
        }
    }
    
    // Calculate final ideological alignment percentages
    calculateIdeologicalAlignment() {
        const ideologyScores = this.scoringSystem.getIdeologyScores();
        const total = Object.values(ideologyScores).reduce((sum, score) => sum + score, 0);
        
        // Convert to percentages
        const alignmentPercentages = {};
        for (const [ideology, score] of Object.entries(ideologyScores)) {
            alignmentPercentages[ideology] = total > 0 ? Math.round((score / total) * 100) : 0;
        }
        
        // Find dominant ideology
        const dominantIdeology = Object.entries(alignmentPercentages)
            .reduce((a, b) => alignmentPercentages[a[0]] > alignmentPercentages[b[0]] ? a : b)[0];
        
        return {
            percentages: alignmentPercentages,
            dominantIdeology: dominantIdeology,
            dominantPercentage: alignmentPercentages[dominantIdeology],
            ideologyDescription: this.getIdeologyDescription(dominantIdeology),
            balanceAnalysis: this.analyzeIdeologicalBalance(alignmentPercentages)
        };
    }
    
    // Get description for dominant ideology
    getIdeologyDescription(ideology) {
        const descriptions = {
            liberal: "Your leadership emphasized individual freedoms, market economics, and progressive social policies. You prioritized civil liberties and democratic participation.",
            conservative: "Your leadership focused on traditional values, gradual change, and institutional stability. You emphasized order, security, and cultural continuity.",
            socialist: "Your leadership prioritized economic equality, collective welfare, and social justice. You emphasized redistribution and community solidarity.",
            ecological: "Your leadership prioritized environmental protection, sustainability, and long-term thinking. You emphasized harmony between society and nature.",
            authoritarian: "Your leadership emphasized strong state control, order, and centralized decision-making. You prioritized stability and effective governance.",
            feminist: "Your leadership emphasized gender equality, social justice, and inclusive policies. You prioritized addressing systemic inequalities."
        };
        
        return descriptions[ideology] || "Your leadership showed a unique blend of different ideological approaches.";
    }
    
    // Analyze ideological balance
    analyzeIdeologicalBalance(percentages) {
        const sortedIdeologies = Object.entries(percentages)
            .sort(([,a], [,b]) => b - a);
        
        const topThree = sortedIdeologies.slice(0, 3);
        const isBalanced = topThree[0][1] - topThree[2][1] < 20;
        
        return {
            isBalanced: isBalanced,
            topIdeologies: topThree,
            balanceDescription: isBalanced 
                ? "Your leadership showed a balanced approach, drawing from multiple ideological traditions."
                : `Your leadership was strongly aligned with ${topThree[0][0]} principles.`
        };
    }
    
    // Generate personalized reflection questions
    generateReflectionQuestions() {
        const questions = [];
        
        // Basic reflection questions
        questions.push({
            category: "Leadership Style",
            question: "How would you describe your overall approach to leadership? What principles guided your decision-making?",
            type: "open_ended"
        });
        
        questions.push({
            category: "Policy Priorities",
            question: "Which policy areas did you prioritize most, and why? How did these priorities reflect your values?",
            type: "analytical"
        });
        
        // Ideology-specific questions
        const dominantIdeology = this.ideologicalProfile.dominantIdeology;
        questions.push(...this.getIdeologySpecificQuestions(dominantIdeology));
        
        // Decision-based questions
        questions.push(...this.generateDecisionBasedQuestions());
        
        // What-if scenarios
        questions.push(...this.generateWhatIfQuestions());
        
        // Real-world connections
        questions.push(...this.generateRealWorldQuestions());
        
        return questions;
    }
    
    // Generate ideology-specific reflection questions
    getIdeologySpecificQuestions(ideology) {
        const ideologyQuestions = {
            liberal: [
                {
                    category: "Liberal Values",
                    question: "How did you balance individual freedoms with collective needs? Were there situations where these values conflicted?",
                    type: "analytical"
                },
                {
                    category: "Democratic Governance",
                    question: "How important was citizen participation in your governance approach? What challenges did you face in maintaining democratic principles?",
                    type: "reflective"
                }
            ],
            conservative: [
                {
                    category: "Traditional Values",
                    question: "How did you balance preserving traditions with adapting to changing circumstances? When is change necessary?",
                    type: "analytical"
                },
                {
                    category: "Institutional Stability",
                    question: "How did you maintain social order while addressing citizens' needs for change and progress?",
                    type: "reflective"
                }
            ],
            socialist: [
                {
                    category: "Economic Equality",
                    question: "How did your policies address wealth inequality? What trade-offs did you make between equality and economic growth?",
                    type: "analytical"
                },
                {
                    category: "Collective Welfare",
                    question: "How did you prioritize collective needs over individual interests? When might this approach face challenges?",
                    type: "reflective"
                }
            ],
            ecological: [
                {
                    category: "Environmental Priority",
                    question: "How did you balance environmental protection with economic development? What long-term thinking guided your decisions?",
                    type: "analytical"
                },
                {
                    category: "Sustainability",
                    question: "How did your policies consider future generations? What challenges arise when prioritizing long-term over short-term benefits?",
                    type: "reflective"
                }
            ],
            authoritarian: [
                {
                    category: "Strong Leadership",
                    question: "How did you balance effective governance with citizen participation? When might strong leadership be necessary?",
                    type: "analytical"
                },
                {
                    category: "Order and Stability",
                    question: "How did you maintain social order while addressing diverse citizen needs? What are the trade-offs of centralized control?",
                    type: "reflective"
                }
            ],
            feminist: [
                {
                    category: "Gender Equality",
                    question: "How did your policies address gender inequality and social justice? What systemic changes did you prioritize?",
                    type: "analytical"
                },
                {
                    category: "Inclusive Governance",
                    question: "How did you ensure diverse voices were heard in governance? What challenges exist in creating truly inclusive policies?",
                    type: "reflective"
                }
            ]
        };
        
        return ideologyQuestions[ideology] || [];
    }
    
    // Generate questions based on specific decisions
    generateDecisionBasedQuestions() {
        const questions = [];
        const significantDecisions = this.identifySignificantDecisions();
        
        significantDecisions.forEach(decision => {
            questions.push({
                category: "Decision Analysis",
                question: `In Year ${decision.year}, you chose "${decision.choice}". Looking back, how do you evaluate this decision? Would you choose differently today?`,
                type: "decision_reflection",
                relatedDecision: decision
            });
        });
        
        return questions;
    }
    
    // Generate "what if" scenario questions
    generateWhatIfQuestions() {
        return [
            {
                category: "Alternative Approaches",
                question: "What if you had prioritized economic growth over environmental protection? How might your country look different?",
                type: "what_if"
            },
            {
                category: "Different Values",
                question: "What if you had emphasized traditional values over progressive change? How might this have affected social cohesion?",
                type: "what_if"
            },
            {
                category: "Crisis Management",
                question: "Looking at the crises you faced, what alternative responses might have led to different outcomes?",
                type: "what_if"
            }
        ];
    }
    
    // Generate real-world connection questions
    generateRealWorldQuestions() {
        return [
            {
                category: "Contemporary Politics",
                question: "How do your policy choices compare to current political debates in your country? What similarities and differences do you notice?",
                type: "real_world"
            },
            {
                category: "Historical Examples",
                question: "Can you think of historical leaders or countries that made similar choices to yours? What were the outcomes?",
                type: "real_world"
            },
            {
                category: "Global Challenges",
                question: "How might your approach apply to current global challenges like climate change, inequality, or democratic governance?",
                type: "real_world"
            }
        ];
    }
    
    // Identify key learning moments from the game
    identifyKeyLearningMoments() {
        const moments = [];
        
        // Phase transitions
        moments.push({
            type: "phase_transition",
            year: 4,
            title: "Transition to Growth Phase",
            description: "Moving from establishing basic systems to implementing comprehensive policies",
            insight: "Early decisions create the foundation for later policy development"
        });
        
        // Significant policy shifts
        const policyShifts = this.identifyPolicyShifts();
        moments.push(...policyShifts);
        
        // Crisis responses
        const crisisLearning = this.analyzeCrisisLearning();
        moments.push(...crisisLearning);
        
        // Metric achievements or failures
        const metricMilestones = this.identifyMetricMilestones();
        moments.push(...metricMilestones);
        
        return moments;
    }
    
    // Identify significant policy shifts
    identifyPolicyShifts() {
        const shifts = [];
        const escalationTracks = this.gameState.policyEscalationTracks;
        
        for (const [track, value] of Object.entries(escalationTracks)) {
            if (value > 60) {
                shifts.push({
                    type: "policy_escalation",
                    track: track,
                    value: value,
                    title: `Strong ${track.replace('_', ' ')} Focus`,
                    description: `Your policies strongly emphasized ${track.replace('_', ' ')}`,
                    insight: "Strong policy focus can create significant societal changes"
                });
            }
        }
        
        return shifts;
    }
    
    // Analyze learning from crisis responses
    analyzeCrisisLearning() {
        const learning = [];
        const crises = this.gameState.crisisHistory;
        
        if (crises.length > 0) {
            learning.push({
                type: "crisis_management",
                count: crises.length,
                title: "Crisis Leadership",
                description: `You navigated ${crises.length} major crises during your leadership`,
                insight: "Crisis management reveals leadership priorities under pressure"
            });
        }
        
        return learning;
    }
    
    // Identify metric milestones
    identifyMetricMilestones() {
        const milestones = [];
        const finalMetrics = this.scoringSystem.getCurrentMetrics();
        
        // Find exceptionally high or low metrics
        for (const [metric, value] of Object.entries(finalMetrics)) {
            if (value >= 80) {
                milestones.push({
                    type: "high_achievement",
                    metric: metric,
                    value: value,
                    title: `Excellent ${metric}`,
                    description: `Your policies achieved excellent results in ${metric}`,
                    insight: "High performance metrics reflect successful policy implementation"
                });
            } else if (value <= 30) {
                milestones.push({
                    type: "challenge_area",
                    metric: metric,
                    value: value,
                    title: `Challenge in ${metric}`,
                    description: `${metric} remained a challenging area throughout your leadership`,
                    insight: "Persistent challenges may indicate policy trade-offs or ideological priorities"
                });
            }
        }
        
        return milestones;
    }
    
    // Generate country comparisons
    generateCountryComparisons() {
        const comparisons = [];
        const dominantIdeology = this.ideologicalProfile.dominantIdeology;
        
        const countryExamples = {
            liberal: [
                { name: "Denmark", description: "Strong democratic institutions with market economy and social welfare" },
                { name: "Canada", description: "Liberal democracy with multicultural policies and individual rights focus" }
            ],
            conservative: [
                { name: "Singapore", description: "Stable governance with traditional values and gradual modernization" },
                { name: "Switzerland", description: "Conservative democracy with strong institutions and gradual change" }
            ],
            socialist: [
                { name: "Norway", description: "Social democratic model with wealth redistribution and collective welfare" },
                { name: "Costa Rica", description: "Strong social policies with emphasis on equality and public services" }
            ],
            ecological: [
                { name: "Bhutan", description: "Gross National Happiness model prioritizing environmental sustainability" },
                { name: "New Zealand", description: "Strong environmental policies with long-term sustainability focus" }
            ],
            authoritarian: [
                { name: "South Korea (1960s-80s)", description: "Strong state-led development with centralized governance" },
                { name: "Rwanda (post-1994)", description: "Centralized governance focused on stability and development" }
            ],
            feminist: [
                { name: "Iceland", description: "Leading gender equality policies with inclusive governance" },
                { name: "Rwanda", description: "High female political participation and gender-focused policies" }
            ]
        };
        
        const examples = countryExamples[dominantIdeology] || [];
        examples.forEach(country => {
            comparisons.push({
                country: country.name,
                description: country.description,
                relevance: `Similar to your ${dominantIdeology} approach to governance`
            });
        });
        
        return comparisons;
    }
    
    // Generate decision summary
    generateDecisionSummary() {
        const decisions = this.gameState.decisionHistory;
        const summary = {
            totalDecisions: decisions.length,
            decisionsByPhase: {},
            decisionsByDomain: {},
            significantChoices: this.identifySignificantDecisions()
        };
        
        // Group by phase
        decisions.forEach(decision => {
            const phase = decision.phase;
            summary.decisionsByPhase[phase] = (summary.decisionsByPhase[phase] || 0) + 1;
        });
        
        // Group by domain
        decisions.forEach(decision => {
            const domain = decision.decision.domain || 'General';
            summary.decisionsByDomain[domain] = (summary.decisionsByDomain[domain] || 0) + 1;
        });
        
        return summary;
    }
    
    // Identify significant decisions
    identifySignificantDecisions() {
        // This would analyze decision impacts and identify the most consequential ones
        const decisions = this.gameState.decisionHistory;
        return decisions.slice(-5).map(decision => ({
            year: decision.year,
            choice: decision.decision.choiceText,
            domain: decision.decision.domain,
            significance: "High impact on final outcomes"
        }));
    }
    
    // Analyze success patterns
    analyzeSuccessPatterns() {
        const finalMetrics = this.scoringSystem.getCurrentMetrics();
        const strengths = [];
        const challenges = [];
        
        for (const [metric, value] of Object.entries(finalMetrics)) {
            if (value >= 70) {
                strengths.push({ metric, value, level: 'Strong' });
            } else if (value <= 40) {
                challenges.push({ metric, value, level: 'Needs Improvement' });
            }
        }
        
        return {
            strengths: strengths,
            challenges: challenges,
            overallAssessment: this.generateOverallAssessment(finalMetrics)
        };
    }
    
    // Generate overall assessment
    generateOverallAssessment(metrics) {
        const values = Object.values(metrics);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        if (average >= 70) {
            return "Highly successful leadership with strong performance across most areas";
        } else if (average >= 50) {
            return "Balanced leadership with mixed results across different policy areas";
        } else {
            return "Challenging leadership period with significant areas for improvement";
        }
    }
    
    // Generate learning insights
    generateLearningInsights() {
        return [
            {
                category: "Policy Trade-offs",
                insight: "Every policy decision involves trade-offs between different values and outcomes",
                evidence: "Observed in the balance between economic growth and environmental protection"
            },
            {
                category: "Ideological Consistency",
                insight: "Leadership requires navigating between ideological principles and practical constraints",
                evidence: "Seen in how crisis responses sometimes diverged from normal policy patterns"
            },
            {
                category: "Long-term Thinking",
                insight: "Some policies show benefits only over extended time periods",
                evidence: "Educational and environmental investments compound over multiple years"
            }
        ];
    }
    
    // Export results for sharing
    exportResults() {
        if (!this.analysisResults) {
            throw new Error('No analysis results available for export');
        }
        
        const exportData = {
            gameId: this.gameState.gameId,
            completionDate: new Date().toISOString(),
            playerProfile: this.ideologicalProfile,
            finalMetrics: this.analysisResults.finalMetrics,
            keyInsights: this.analysisResults.learningInsights,
            reflectionQuestions: this.reflectionQuestions,
            gameStatistics: this.gameState.getStatistics()
        };
        
        return exportData;
    }
    
    // Generate educator report
    generateEducatorReport() {
        if (!this.analysisResults) {
            throw new Error('No analysis results available');
        }
        
        return {
            studentProfile: this.ideologicalProfile,
            learningOutcomes: this.keyLearningMoments,
            discussionPrompts: this.generateDiscussionPrompts(),
            assessmentSuggestions: this.generateAssessmentSuggestions(),
            followUpActivities: this.generateFollowUpActivities()
        };
    }
    
    // Generate discussion prompts for classroom use
    generateDiscussionPrompts() {
        return [
            "Compare your leadership approach with classmates. What different strategies emerged?",
            "Discuss the trade-offs you encountered. How did you balance competing priorities?",
            "How do your game choices reflect real-world political debates?",
            "What surprised you most about the consequences of your decisions?"
        ];
    }
    
    // Generate assessment suggestions
    generateAssessmentSuggestions() {
        return [
            "Reflection essay on ideological consistency throughout the game",
            "Analysis of three major decisions and their long-term consequences",
            "Comparison with historical or contemporary political leaders",
            "Proposal for alternative policy approaches based on game learnings"
        ];
    }
    
    // Generate follow-up activities
    generateFollowUpActivities() {
        return [
            "Research real countries that align with your game approach",
            "Debate alternative policy solutions with classmates",
            "Create a policy proposal based on game insights",
            "Interview community leaders about governance challenges"
        ];
    }
    
    // Reset for new analysis
    reset() {
        this.analysisResults = null;
        this.reflectionQuestions = [];
        this.ideologicalProfile = {};
        this.keyLearningMoments = [];
        this.countryComparisons = [];
    }
}

export { EndGameAnalysis }; 