// Citizen Stories & Narrative System
// Generates and presents personal stories showing policy impacts on individual citizens

class CitizenStories {
    constructor() {
        this.gameState = null;
        this.scoringSystem = null;
        this.storyDatabase = new Map();
        this.storyHistory = [];
        this.citizenProfiles = new Map();
        this.lastStoryYear = 0;
        this.storyFrequency = 2; // Show stories every 2 years
    }
    
    // Initialize the citizen stories system
    async init(gameState, scoringSystem) {
        this.gameState = gameState;
        this.scoringSystem = scoringSystem;
        
        // Initialize story database
        this.initializeStoryDatabase();
        
        // Create initial citizen profiles
        this.generateInitialCitizens();
        
        console.log('Citizen Stories system initialized');
    }
    
    // Initialize diverse citizen personas
    generateInitialCitizens() {
        const personas = [
            {
                name: "Maria Gonzalez",
                age: 34,
                occupation: "small business owner",
                location: "downtown district",
                background: "immigrant family",
                avatar: "👩‍💼"
            },
            {
                name: "James Chen",
                age: 28,
                occupation: "software developer",
                location: "tech district",
                background: "young professional",
                avatar: "👨‍💻"
            },
            {
                name: "Sarah Johnson",
                age: 45,
                occupation: "teacher",
                location: "suburban neighborhood",
                background: "middle-class family",
                avatar: "👩‍🏫"
            },
            {
                name: "Robert Williams",
                age: 62,
                occupation: "factory worker",
                location: "industrial district",
                background: "working-class family",
                avatar: "👨‍🏭"
            },
            {
                name: "Amara Okafor",
                age: 29,
                occupation: "nurse",
                location: "medical district",
                background: "healthcare professional",
                avatar: "👩‍⚕️"
            },
            {
                name: "David Kim",
                age: 38,
                occupation: "farmer",
                location: "rural area",
                background: "agricultural community",
                avatar: "👨‍🌾"
            },
            {
                name: "Elena Petrov",
                age: 52,
                occupation: "social worker",
                location: "community center",
                background: "social services",
                avatar: "👩‍💼"
            },
            {
                name: "Marcus Thompson",
                age: 31,
                occupation: "artist",
                location: "arts district",
                background: "creative community",
                avatar: "👨‍🎨"
            }
        ];
        
        personas.forEach(persona => {
            this.citizenProfiles.set(persona.name, {
                ...persona,
                storyHistory: [],
                lastSeenYear: 0
            });
        });
    }
    
    // Initialize story database with pre-written stories
    initializeStoryDatabase() {
        // Economic stories
        this.addStoryToDatabase("economic_growth_positive", {
            category: "economic",
            type: "prosperity",
            triggers: ["economicGrowth > 70"],
            stories: [
                {
                    citizen: "Maria Gonzalez",
                    quote: "My restaurant is busier than ever. We've hired three new employees this year!",
                    policy: "economic development program",
                    impact: "Business expansion and job creation"
                },
                {
                    citizen: "James Chen",
                    quote: "The new tech incentives brought so many opportunities. I got promoted and we're working on exciting projects.",
                    policy: "innovation investment",
                    impact: "Career advancement and innovation"
                }
            ]
        });
        
        this.addStoryToDatabase("economic_struggle", {
            category: "economic",
            type: "struggle",
            triggers: ["economicGrowth < 40"],
            stories: [
                {
                    citizen: "Robert Williams",
                    quote: "The factory cut our hours again. I don't know how we'll make ends meet.",
                    policy: "economic restructuring",
                    impact: "Job insecurity and financial stress"
                }
            ]
        });
        
        // Healthcare stories
        this.addStoryToDatabase("healthcare_access_improved", {
            category: "healthcare",
            type: "access",
            triggers: ["healthcareAccess > 75"],
            stories: [
                {
                    citizen: "Amara Okafor",
                    quote: "We're seeing more patients getting preventive care. It's making a real difference.",
                    policy: "healthcare expansion",
                    impact: "Better health outcomes"
                }
            ]
        });
        
        // Education stories
        this.addStoryToDatabase("education_quality_improved", {
            category: "education",
            type: "opportunity",
            triggers: ["educationQuality > 75"],
            stories: [
                {
                    citizen: "Sarah Johnson",
                    quote: "My students have access to new technology and smaller class sizes. They're really thriving.",
                    policy: "education investment program",
                    impact: "Enhanced learning environment"
                }
            ]
        });
        
        // Environmental stories
        this.addStoryToDatabase("environmental_improvement", {
            category: "environmental",
            type: "improvement",
            triggers: ["environmentalQuality > 70"],
            stories: [
                {
                    citizen: "David Kim",
                    quote: "The air is cleaner, and my crops are doing better. The new regulations are working.",
                    policy: "environmental protection measures",
                    impact: "Improved air quality and agricultural conditions"
                }
            ]
        });
        
        // Social stories
        this.addStoryToDatabase("social_cohesion_improved", {
            category: "social",
            type: "inclusion",
            triggers: ["socialCohesion > 70"],
            stories: [
                {
                    citizen: "Elena Petrov",
                    quote: "The community center brings people together. We're building real connections across differences.",
                    policy: "community building initiative",
                    impact: "Stronger social bonds"
                }
            ]
        });
    }
    
    // Add story to database
    addStoryToDatabase(id, storyData) {
        this.storyDatabase.set(id, storyData);
    }
    
    // Get stories for current game state
    async getStoriesForCurrentState() {
        if (this.gameState.currentYear - this.lastStoryYear < this.storyFrequency) {
            return [];
        }
        
        const stories = this.selectStoriesForCurrentState();
        const selectedStories = this.selectBestStories(stories, 2);
        
        this.lastStoryYear = this.gameState.currentYear;
        this.storyHistory.push(...selectedStories);
        
        return selectedStories;
    }
    
    // Select stories based on current metrics and policies
    selectStoriesForCurrentState() {
        const stories = [];
        const metrics = this.scoringSystem.getCurrentMetrics();
        
        // Check each story in database against current conditions
        for (const [storyId, storyData] of this.storyDatabase) {
            if (this.evaluateStoryTriggers(storyData.triggers, metrics)) {
                const generatedStories = this.generateStoriesFromTemplate(storyData);
                stories.push(...generatedStories);
            }
        }
        
        return stories;
    }
    
    // Evaluate if story triggers match current conditions
    evaluateStoryTriggers(triggers, metrics) {
        return triggers.some(trigger => {
            try {
                // Parse trigger condition (e.g., "economicGrowth > 70")
                const [metric, operator, value] = trigger.split(' ');
                const currentValue = metrics[metric];
                const targetValue = parseFloat(value);
                
                switch (operator) {
                    case '>': return currentValue > targetValue;
                    case '<': return currentValue < targetValue;
                    case '>=': return currentValue >= targetValue;
                    case '<=': return currentValue <= targetValue;
                    case '==': return currentValue === targetValue;
                    default: return false;
                }
            } catch (error) {
                console.error('Error evaluating trigger:', trigger, error);
                return false;
            }
        });
    }
    
    // Generate stories from template data
    generateStoriesFromTemplate(storyData) {
        const stories = [];
        
        storyData.stories.forEach(storyInfo => {
            const citizen = this.citizenProfiles.get(storyInfo.citizen);
            if (!citizen) return;
            
            // Check if this citizen hasn't appeared recently
            if (this.gameState.currentYear - citizen.lastSeenYear < 3) return;
            
            const story = {
                id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                year: this.gameState.currentYear,
                category: storyData.category,
                type: storyData.type,
                citizen: {
                    name: citizen.name,
                    age: citizen.age,
                    occupation: citizen.occupation,
                    location: citizen.location,
                    avatar: citizen.avatar
                },
                title: this.generateStoryTitle(storyData.type, citizen),
                content: this.generateStoryContent(storyInfo, citizen),
                quote: storyInfo.quote,
                policy: storyInfo.policy,
                impact: storyInfo.impact,
                emotionalTone: storyData.type,
                timestamp: new Date().toISOString()
            };
            
            stories.push(story);
            
            // Update citizen profile
            citizen.lastSeenYear = this.gameState.currentYear;
            citizen.storyHistory.push(story.id);
        });
        
        return stories;
    }
    
    // Generate story title based on type and citizen
    generateStoryTitle(type, citizen) {
        const titleTemplates = {
            prosperity: `${citizen.name}: A Success Story`,
            struggle: `${citizen.name}: Facing Challenges`,
            access: `${citizen.name}: New Opportunities`,
            improvement: `${citizen.name}: Positive Changes`,
            inclusion: `${citizen.name}: Finding Belonging`
        };
        
        return titleTemplates[type] || `${citizen.name}: Personal Story`;
    }
    
    // Generate story content
    generateStoryContent(storyInfo, citizen) {
        return `${citizen.name}, a ${citizen.age}-year-old ${citizen.occupation} from ${citizen.location}, shares their experience with recent policy changes. The ${storyInfo.policy} has had a significant impact on their life, resulting in ${storyInfo.impact.toLowerCase()}.`;
    }
    
    // Select best stories to show (avoid repetition, ensure diversity)
    selectBestStories(stories, maxCount) {
        if (stories.length <= maxCount) return stories;
        
        // Prioritize diverse stories
        const diverseStories = [];
        const usedCategories = new Set();
        const usedCitizens = new Set();
        
        // First pass: one story per category and citizen
        for (const story of stories) {
            if (!usedCategories.has(story.category) && !usedCitizens.has(story.citizen.name)) {
                diverseStories.push(story);
                usedCategories.add(story.category);
                usedCitizens.add(story.citizen.name);
                
                if (diverseStories.length >= maxCount) break;
            }
        }
        
        return diverseStories;
    }
    
    // Present stories to the player
    async presentStories(stories) {
        if (!stories || stories.length === 0) return;
        
        for (const story of stories) {
            await this.showSingleStory(story);
        }
    }
    
    // Show a single story with enhanced presentation
    async showSingleStory(story) {
        return new Promise((resolve) => {
            const modal = document.getElementById('story-modal');
            if (!modal) {
                console.error('Story modal not found');
                resolve();
                return;
            }
            
            // Populate story content
            this.populateStoryModal(story);
            
            // Show modal
            modal.style.display = 'flex';
            
            // Set up close handlers
            const closeStory = () => {
                modal.style.display = 'none';
                resolve();
            };
            
            const nextBtn = document.getElementById('next-story');
            const closeBtn = document.getElementById('close-stories');
            const closeX = document.getElementById('close-story');
            
            if (nextBtn) nextBtn.onclick = closeStory;
            if (closeBtn) closeBtn.onclick = closeStory;
            if (closeX) closeX.onclick = closeStory;
            
            // Close on escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleEscape);
                    closeStory();
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }
    
    // Populate story modal with content
    populateStoryModal(story) {
        const profileElement = document.getElementById('citizen-profile');
        const textElement = document.getElementById('story-text');
        
        if (profileElement) {
            profileElement.innerHTML = `
                <div class="citizen-card">
                    <div class="citizen-avatar">${story.citizen.avatar}</div>
                    <div class="citizen-info">
                        <h3>${story.citizen.name}</h3>
                        <p class="citizen-details">${story.citizen.age} years old • ${story.citizen.occupation}</p>
                        <p class="citizen-location">📍 ${story.citizen.location}</p>
                    </div>
                </div>
            `;
        }
        
        if (textElement) {
            textElement.innerHTML = `
                <div class="story-content">
                    <h2 class="story-title">${story.title}</h2>
                    <div class="story-year">Year ${story.year}</div>
                    <div class="story-quote">
                        <span class="quote-mark">"</span>
                        <span class="quote-text">${story.quote}</span>
                        <span class="quote-mark">"</span>
                    </div>
                    <div class="story-context">
                        <p>${story.content}</p>
                    </div>
                    <div class="story-impact">
                        <strong>Impact:</strong> ${story.impact}
                    </div>
                    <div class="story-policy">
                        <em>Related to: ${story.policy}</em>
                    </div>
                </div>
            `;
        }
    }
    
    // Get story statistics for analytics
    getStoryStatistics() {
        return {
            totalStoriesShown: this.storyHistory.length,
            storiesByCategory: this.getStoriesByCategory(),
            storiesByYear: this.getStoriesByYear(),
            citizenAppearances: this.getCitizenAppearances()
        };
    }
    
    // Get stories grouped by category
    getStoriesByCategory() {
        const categories = {};
        this.storyHistory.forEach(story => {
            categories[story.category] = (categories[story.category] || 0) + 1;
        });
        return categories;
    }
    
    // Get stories grouped by year
    getStoriesByYear() {
        const years = {};
        this.storyHistory.forEach(story => {
            years[story.year] = (years[story.year] || 0) + 1;
        });
        return years;
    }
    
    // Get citizen appearance count
    getCitizenAppearances() {
        const appearances = {};
        this.storyHistory.forEach(story => {
            appearances[story.citizen.name] = (appearances[story.citizen.name] || 0) + 1;
        });
        return appearances;
    }
    
    // Reset system for new game
    reset() {
        this.storyHistory = [];
        this.lastStoryYear = 0;
        this.generateInitialCitizens();
    }
}

export { CitizenStories }; 