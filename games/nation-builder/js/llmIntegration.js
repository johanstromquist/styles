// AI-Powered Reflection and Analysis
// Optional LLM integration for enhanced educational features

class LLMIntegration {
    constructor() {
        this.gameState = null;
        this.scoringSystem = null;
        this.endGameAnalysis = null;
        
        // API Configuration
        this.apiKey = null;
        this.provider = 'openai'; // 'openai', 'anthropic', 'local'
        this.enabled = false;
        this.consentGiven = false;
        
        // Rate limiting and usage tracking
        this.requestCount = 0;
        this.maxRequests = 50; // Per session
        this.lastRequestTime = 0;
        this.minRequestInterval = 2000; // 2 seconds between requests
        
        // Privacy and safety
        this.dataAnonymized = true;
        this.contentFiltered = true;
        
        // Fallback content
        this.fallbackContent = this.initializeFallbackContent();
        
        // Provider configurations
        this.providerConfigs = {
            openai: {
                apiUrl: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                maxTokens: 500,
                temperature: 0.7
            },
            anthropic: {
                apiUrl: 'https://api.anthropic.com/v1/messages',
                model: 'claude-3-haiku-20240307',
                maxTokens: 500,
                temperature: 0.7
            },
            local: {
                apiUrl: 'http://localhost:11434/api/generate',
                model: 'llama2',
                maxTokens: 500,
                temperature: 0.7
            }
        };
    }
    
    // Initialize LLM integration
    async init(gameState, scoringSystem = null, endGameAnalysis = null) {
        this.gameState = gameState;
        this.scoringSystem = scoringSystem;
        this.endGameAnalysis = endGameAnalysis;
        
        // Check for saved API key (with user consent)
        this.loadSavedConfiguration();
        
        console.log('LLM integration initialized (optional - requires API key)');
    }
    
    // Load saved configuration
    loadSavedConfiguration() {
        try {
            const saved = localStorage.getItem('nationBuilderLLMConfig');
            if (saved) {
                const config = JSON.parse(saved);
                if (config.consentGiven && config.apiKey) {
                    this.apiKey = config.apiKey;
                    this.provider = config.provider || 'openai';
                    this.consentGiven = config.consentGiven;
                    this.enabled = true;
                    console.log(`LLM features restored (${this.provider})`);
                }
            }
        } catch (error) {
            console.warn('Failed to load LLM configuration:', error);
        }
    }
    
    // Save configuration
    saveConfiguration() {
        try {
            const config = {
                apiKey: this.apiKey,
                provider: this.provider,
                consentGiven: this.consentGiven
            };
            localStorage.setItem('nationBuilderLLMConfig', JSON.stringify(config));
        } catch (error) {
            console.warn('Failed to save LLM configuration:', error);
        }
    }
    
    // Check if LLM features are available
    isEnabled() {
        return this.enabled && this.apiKey && this.consentGiven;
    }
    
    // Get current status
    getStatus() {
        return {
            enabled: this.isEnabled(),
            provider: this.provider,
            requestCount: this.requestCount,
            maxRequests: this.maxRequests,
            hasApiKey: !!this.apiKey,
            consentGiven: this.consentGiven
        };
    }
    
    // Configure LLM provider and API key
    async configure(apiKey, provider = 'openai', userConsent = false) {
        if (!userConsent) {
            throw new Error('User consent required for LLM features');
        }
        
        if (!apiKey || apiKey.trim().length === 0) {
            throw new Error('Valid API key required');
        }
        
        if (!this.providerConfigs[provider]) {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        
        // Test the API key
        const isValid = await this.testApiKey(apiKey, provider);
        if (!isValid) {
            throw new Error('Invalid API key or provider configuration');
        }
        
        this.apiKey = apiKey;
        this.provider = provider;
        this.consentGiven = userConsent;
        this.enabled = true;
        this.requestCount = 0;
        
        // Save configuration
        this.saveConfiguration();
        
        console.log(`LLM features enabled with ${provider}`);
        return true;
    }
    
    // Test API key validity
    async testApiKey(apiKey, provider) {
        try {
            const testPrompt = "Hello, this is a test. Please respond with 'OK'.";
            const response = await this.makeAPIRequest(testPrompt, apiKey, provider, true);
            return response && response.length > 0;
        } catch (error) {
            console.warn('API key test failed:', error.message);
            return false;
        }
    }
    
    // Disable LLM features
    disable() {
        this.enabled = false;
        this.apiKey = null;
        this.consentGiven = false;
        
        // Clear saved configuration
        localStorage.removeItem('nationBuilderLLMConfig');
        
        console.log('LLM features disabled');
    }
    
    // Generate AI-powered reflection questions
    async generatePersonalizedReflections(analysisData) {
        if (!this.isEnabled()) {
            return this.getFallbackReflections(analysisData);
        }
        
        try {
            const prompt = this.buildReflectionPrompt(analysisData);
            const response = await this.makeAPIRequest(prompt);
            
            if (response) {
                return this.parseReflectionResponse(response);
            }
        } catch (error) {
            console.warn('Failed to generate AI reflections:', error);
        }
        
        // Fallback to static content
        return this.getFallbackReflections(analysisData);
    }
    
    // Generate "what if" scenario analysis
    async generateWhatIfAnalysis(decisionData) {
        if (!this.isEnabled()) {
            return this.getFallbackWhatIf(decisionData);
        }
        
        try {
            const prompt = this.buildWhatIfPrompt(decisionData);
            const response = await this.makeAPIRequest(prompt);
            
            if (response) {
                return this.parseWhatIfResponse(response);
            }
        } catch (error) {
            console.warn('Failed to generate what-if analysis:', error);
        }
        
        return this.getFallbackWhatIf(decisionData);
    }
    
    // Generate real-world connections
    async generateRealWorldConnections(ideologyProfile) {
        if (!this.isEnabled()) {
            return this.getFallbackRealWorld(ideologyProfile);
        }
        
        try {
            const prompt = this.buildRealWorldPrompt(ideologyProfile);
            const response = await this.makeAPIRequest(prompt);
            
            if (response) {
                return this.parseRealWorldResponse(response);
            }
        } catch (error) {
            console.warn('Failed to generate real-world connections:', error);
        }
        
        return this.getFallbackRealWorld(ideologyProfile);
    }
    
    // Generate ideological pattern explanations
    async generateIdeologyExplanation(profile) {
        if (!this.isEnabled()) {
            return this.getFallbackIdeologyExplanation(profile);
        }
        
        try {
            const prompt = this.buildIdeologyExplanationPrompt(profile);
            const response = await this.makeAPIRequest(prompt);
            
            if (response) {
                return this.parseIdeologyExplanation(response);
            }
        } catch (error) {
            console.warn('Failed to generate ideology explanation:', error);
        }
        
        return this.getFallbackIdeologyExplanation(profile);
    }
    
    // Build reflection prompt
    buildReflectionPrompt(analysisData) {
        const anonymizedData = this.anonymizeData(analysisData);
        
        return `As an educational assistant, generate 3-4 thoughtful reflection questions for a student who completed a governance simulation. 

Student's leadership profile:
- Dominant approach: ${anonymizedData.dominantIdeology}
- Key strengths: ${anonymizedData.strengths.join(', ')}
- Main challenges: ${anonymizedData.challenges.join(', ')}

Generate questions that:
1. Encourage deep reflection on leadership choices
2. Connect to real-world governance
3. Promote critical thinking about trade-offs
4. Are appropriate for educational discussion

Format as a numbered list. Keep questions concise and thought-provoking.`;
    }
    
    // Build what-if prompt
    buildWhatIfPrompt(decisionData) {
        const anonymizedData = this.anonymizeData(decisionData);
        
        return `Analyze alternative approaches to governance decisions in an educational simulation.

Decision context: ${anonymizedData.context}
Chosen approach: ${anonymizedData.choice}
Outcomes: ${anonymizedData.outcomes}

Provide 2-3 alternative approaches that represent different ideological perspectives, explaining:
1. How each alternative might have been implemented
2. Likely different outcomes
3. Trade-offs involved

Keep analysis educational and balanced. Format as clear alternatives with brief explanations.`;
    }
    
    // Build real-world connections prompt
    buildRealWorldPrompt(ideologyProfile) {
        const anonymizedData = this.anonymizeData(ideologyProfile);
        
        return `Connect a student's governance simulation results to real-world examples for educational purposes.

Leadership approach: ${anonymizedData.dominantIdeology} (${anonymizedData.percentage}%)
Key characteristics: ${anonymizedData.characteristics}

Provide 2-3 real-world examples of:
1. Countries or leaders with similar approaches
2. Current events that reflect these governance styles
3. Historical examples of these ideological approaches

Keep examples educational, balanced, and appropriate for classroom discussion. Avoid partisan politics.`;
    }
    
    // Build ideology explanation prompt
    buildIdeologyExplanationPrompt(profile) {
        const anonymizedData = this.anonymizeData(profile);
        
        return `Explain a student's ideological profile from a governance simulation in accessible, educational language.

Profile: ${anonymizedData.dominantIdeology} leadership (${anonymizedData.percentage}%)
Balance: ${anonymizedData.isBalanced ? 'Balanced across multiple approaches' : 'Strongly focused approach'}

Provide a clear, educational explanation that:
1. Describes what this ideological approach means
2. Explains the core values and priorities
3. Discusses strengths and potential challenges
4. Connects to broader political theory concepts

Use accessible language appropriate for students. Remain neutral and educational.`;
    }
    
    // Make API request with rate limiting and error handling
    async makeAPIRequest(prompt, apiKey = null, provider = null, isTest = false) {
        // Rate limiting
        if (!isTest && !this.checkRateLimit()) {
            throw new Error('Rate limit exceeded. Please wait before making another request.');
        }
        
        const key = apiKey || this.apiKey;
        const providerType = provider || this.provider;
        const config = this.providerConfigs[providerType];
        
        if (!config) {
            throw new Error(`Invalid provider: ${providerType}`);
        }
        
        // Apply content filtering
        const filteredPrompt = this.filterContent(prompt);
        
        let requestBody;
        let headers;
        
        // Configure request based on provider
        switch (providerType) {
            case 'openai':
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                };
                requestBody = {
                    model: config.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an educational assistant helping students reflect on governance and political science concepts. Provide thoughtful, balanced, and educational responses.'
                        },
                        {
                            role: 'user',
                            content: filteredPrompt
                        }
                    ],
                    max_tokens: config.maxTokens,
                    temperature: config.temperature
                };
                break;
                
            case 'anthropic':
                headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': key,
                    'anthropic-version': '2023-06-01'
                };
                requestBody = {
                    model: config.model,
                    max_tokens: config.maxTokens,
                    messages: [
                        {
                            role: 'user',
                            content: filteredPrompt
                        }
                    ]
                };
                break;
                
            case 'local':
                headers = {
                    'Content-Type': 'application/json'
                };
                requestBody = {
                    model: config.model,
                    prompt: filteredPrompt,
                    stream: false
                };
                break;
                
            default:
                throw new Error(`Unsupported provider: ${providerType}`);
        }
        
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Update rate limiting
        if (!isTest) {
            this.requestCount++;
            this.lastRequestTime = Date.now();
        }
        
        // Extract response based on provider
        switch (providerType) {
            case 'openai':
                return data.choices?.[0]?.message?.content || '';
            case 'anthropic':
                return data.content?.[0]?.text || '';
            case 'local':
                return data.response || '';
            default:
                return '';
        }
    }
    
    // Check rate limiting
    checkRateLimit() {
        if (this.requestCount >= this.maxRequests) {
            return false;
        }
        
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
            return false;
        }
        
        return true;
    }
    
    // Anonymize data for privacy
    anonymizeData(data) {
        if (!this.dataAnonymized) {
            return data;
        }
        
        // Remove any potentially identifying information
        const anonymized = JSON.parse(JSON.stringify(data));
        
        // Replace specific names/places with generic terms
        if (typeof anonymized === 'object') {
            this.recursivelyAnonymize(anonymized);
        }
        
        return anonymized;
    }
    
    // Recursively anonymize object properties
    recursivelyAnonymize(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // Remove any potential identifying information
                obj[key] = obj[key].replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[Name]');
                obj[key] = obj[key].replace(/\b\d{4}\b/g, '[Year]');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.recursivelyAnonymize(obj[key]);
            }
        }
    }
    
    // Filter content for safety
    filterContent(content) {
        if (!this.contentFiltered) {
            return content;
        }
        
        // Basic content filtering for educational appropriateness
        const inappropriate = [
            'violence', 'hate', 'discrimination', 'extremism'
        ];
        
        let filtered = content;
        inappropriate.forEach(word => {
            const regex = new RegExp(word, 'gi');
            filtered = filtered.replace(regex, '[filtered]');
        });
        
        return filtered;
    }
    
    // Parse reflection response
    parseReflectionResponse(response) {
        try {
            const lines = response.split('\n').filter(line => line.trim());
            const questions = lines
                .filter(line => /^\d+\./.test(line.trim()))
                .map(line => line.replace(/^\d+\.\s*/, '').trim())
                .filter(q => q.length > 0);
            
            return {
                type: 'ai_generated',
                questions: questions.slice(0, 4), // Limit to 4 questions
                source: this.provider
            };
        } catch (error) {
            console.warn('Failed to parse reflection response:', error);
            return this.getFallbackReflections();
        }
    }
    
    // Parse what-if response
    parseWhatIfResponse(response) {
        try {
            const alternatives = response.split(/\d+\./).slice(1).map(alt => alt.trim());
            return {
                type: 'ai_generated',
                alternatives: alternatives.slice(0, 3),
                source: this.provider
            };
        } catch (error) {
            console.warn('Failed to parse what-if response:', error);
            return this.getFallbackWhatIf();
        }
    }
    
    // Parse real-world response
    parseRealWorldResponse(response) {
        try {
            const examples = response.split(/\d+\./).slice(1).map(ex => ex.trim());
            return {
                type: 'ai_generated',
                examples: examples.slice(0, 3),
                source: this.provider
            };
        } catch (error) {
            console.warn('Failed to parse real-world response:', error);
            return this.getFallbackRealWorld();
        }
    }
    
    // Parse ideology explanation
    parseIdeologyExplanation(response) {
        return {
            type: 'ai_generated',
            explanation: response.trim(),
            source: this.provider
        };
    }
    
    // Initialize fallback content
    initializeFallbackContent() {
        return {
            reflections: [
                "How did your personal values influence your policy decisions?",
                "What trade-offs between competing priorities did you find most challenging?",
                "How might your approach compare to current political leaders?",
                "What did you learn about the complexity of governance?"
            ],
            whatIf: [
                "Alternative approaches might have prioritized different values",
                "Different ideological frameworks could have led to different outcomes",
                "Consider how historical context might have influenced your choices"
            ],
            realWorld: [
                "Many countries face similar governance challenges",
                "Current events often reflect the same ideological tensions",
                "Historical examples can provide insight into different approaches"
            ],
            ideologyExplanations: {
                liberal: "Liberal governance emphasizes individual freedoms, democratic participation, and progressive social policies.",
                conservative: "Conservative governance focuses on traditional values, institutional stability, and gradual change.",
                socialist: "Socialist governance prioritizes economic equality, collective welfare, and social justice.",
                ecological: "Ecological governance emphasizes environmental protection, sustainability, and long-term thinking.",
                authoritarian: "Authoritarian governance focuses on strong state control, order, and centralized decision-making.",
                feminist: "Feminist governance emphasizes gender equality, social justice, and inclusive policies."
            }
        };
    }
    
    // Fallback methods
    getFallbackReflections(analysisData = null) {
        return {
            type: 'static',
            questions: this.fallbackContent.reflections,
            source: 'built_in'
        };
    }
    
    getFallbackWhatIf(decisionData = null) {
        return {
            type: 'static',
            alternatives: this.fallbackContent.whatIf,
            source: 'built_in'
        };
    }
    
    getFallbackRealWorld(ideologyProfile = null) {
        return {
            type: 'static',
            examples: this.fallbackContent.realWorld,
            source: 'built_in'
        };
    }
    
    getFallbackIdeologyExplanation(profile) {
        const ideology = profile?.dominantIdeology || 'liberal';
        return {
            type: 'static',
            explanation: this.fallbackContent.ideologyExplanations[ideology] || 
                        this.fallbackContent.ideologyExplanations.liberal,
            source: 'built_in'
        };
    }
    
    // Get usage statistics
    getUsageStats() {
        return {
            requestCount: this.requestCount,
            maxRequests: this.maxRequests,
            remainingRequests: Math.max(0, this.maxRequests - this.requestCount),
            provider: this.provider,
            enabled: this.isEnabled()
        };
    }
    
    // Reset usage statistics
    resetUsageStats() {
        this.requestCount = 0;
        this.lastRequestTime = 0;
    }
}

export { LLMIntegration }; 