// City Visualization and Evolution System
// Manages the visual representation of Newlandia's capital city

class CityVisualization {
    constructor() {
        this.gameState = null;
        this.scoringSystem = null;
        this.cityContainer = null;
        this.buildings = new Map();
        this.cityElements = {
            skyline: null,
            background: null,
            foreground: null,
            effects: null
        };
        this.buildingTypes = this.initializeBuildingTypes();
        this.cityThemes = this.initializeCityThemes();
        this.currentTheme = 'balanced';
        this.animationQueue = [];
        this.isAnimating = false;
    }
    
    // Initialize the city visualization system
    async init(gameState, scoringSystem) {
        this.gameState = gameState;
        this.scoringSystem = scoringSystem;
        this.cityContainer = document.getElementById('city-skyline');
        
        if (!this.cityContainer) {
            console.log('City container not found - using new society visualization interface');
            this.isEnabled = false;
            return false; // Indicate initialization failed gracefully
        }
        
        this.isEnabled = true;
        
        // Initialize city structure
        this.initializeCityStructure();
        
        // Set up initial city state
        this.renderInitialCity();
        
        // Set up resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('City visualization system initialized');
    }
    
    // Initialize building types and their characteristics
    initializeBuildingTypes() {
        return {
            // Residential buildings
            residential: {
                basic: { height: 60, color: '#e67e22', icon: '🏠' },
                liberal: { height: 80, color: '#3498db', icon: '🏢', style: 'modern' },
                conservative: { height: 65, color: '#8b4513', icon: '🏘️', style: 'traditional' },
                socialist: { height: 70, color: '#e74c3c', icon: '🏬', style: 'collective' },
                ecological: { height: 55, color: '#27ae60', icon: '🌱', style: 'green' },
                authoritarian: { height: 90, color: '#2c3e50', icon: '🏛️', style: 'imposing' },
                feminist: { height: 75, color: '#9b59b6', icon: '🏡', style: 'inclusive' }
            },
            
            // Commercial buildings
            commercial: {
                basic: { height: 80, color: '#9b59b6', icon: '🏪' },
                liberal: { height: 100, color: '#1abc9c', icon: '🏬', style: 'corporate' },
                conservative: { height: 75, color: '#d35400', icon: '🏛️', style: 'traditional' },
                socialist: { height: 85, color: '#c0392b', icon: '🏢', style: 'cooperative' },
                ecological: { height: 70, color: '#16a085', icon: '🌿', style: 'sustainable' },
                authoritarian: { height: 95, color: '#34495e', icon: '🏢', style: 'state-controlled' },
                feminist: { height: 90, color: '#8e44ad', icon: '🏬', style: 'equitable' }
            },
            
            // Government buildings
            government: {
                basic: { height: 70, color: '#34495e', icon: '🏛️' },
                liberal: { height: 85, color: '#2980b9', icon: '🏛️', style: 'democratic' },
                conservative: { height: 80, color: '#7f8c8d', icon: '⚖️', style: 'institutional' },
                socialist: { height: 90, color: '#e74c3c', icon: '🏛️', style: 'people-centered' },
                ecological: { height: 75, color: '#27ae60', icon: '🌍', style: 'environmental' },
                authoritarian: { height: 110, color: '#2c3e50', icon: '🏛️', style: 'centralized' },
                feminist: { height: 85, color: '#9b59b6', icon: '🏛️', style: 'representative' }
            },
            
            // Industrial buildings
            industrial: {
                basic: { height: 50, color: '#95a5a6', icon: '🏭' },
                liberal: { height: 60, color: '#7f8c8d', icon: '🏢', style: 'free-market' },
                conservative: { height: 55, color: '#bdc3c7', icon: '🏭', style: 'traditional' },
                socialist: { height: 65, color: '#e74c3c', icon: '⚙️', style: 'worker-owned' },
                ecological: { height: 45, color: '#27ae60', icon: '♻️', style: 'clean-tech' },
                authoritarian: { height: 70, color: '#34495e', icon: '🏭', style: 'state-industrial' },
                feminist: { height: 60, color: '#9b59b6', icon: '🏢', style: 'equitable' }
            },
            
            // Special buildings and landmarks
            landmarks: {
                parliament: { height: 120, color: '#2980b9', icon: '🏛️', name: 'Parliament Building' },
                monument: { height: 100, color: '#34495e', icon: '🗿', name: 'National Monument' },
                university: { height: 90, color: '#8e44ad', icon: '🎓', name: 'National University' },
                hospital: { height: 85, color: '#e74c3c', icon: '🏥', name: 'Central Hospital' },
                park: { height: 30, color: '#27ae60', icon: '🌳', name: 'Central Park' },
                stadium: { height: 75, color: '#f39c12', icon: '🏟️', name: 'National Stadium' },
                cathedral: { height: 110, color: '#8b4513', icon: '⛪', name: 'National Cathedral' },
                museum: { height: 80, color: '#9b59b6', icon: '🏛️', name: 'National Museum' }
            }
        };
    }
    
    // Initialize city themes based on ideological alignment
    initializeCityThemes() {
        return {
            balanced: {
                name: 'Balanced Development',
                skyColor: '#87CEEB',
                groundColor: '#228B22',
                buildingMix: { residential: 0.3, commercial: 0.3, government: 0.2, industrial: 0.2 }
            },
            liberal: {
                name: 'Liberal Democracy',
                skyColor: '#4A90E2',
                groundColor: '#2ECC71',
                buildingMix: { residential: 0.25, commercial: 0.4, government: 0.15, industrial: 0.2 },
                features: ['diverse architecture', 'business districts', 'cultural centers']
            },
            conservative: {
                name: 'Traditional Values',
                skyColor: '#8B7355',
                groundColor: '#8FBC8F',
                buildingMix: { residential: 0.4, commercial: 0.25, government: 0.2, industrial: 0.15 },
                features: ['traditional architecture', 'family neighborhoods', 'heritage sites']
            },
            socialist: {
                name: 'Social Equality',
                skyColor: '#CD5C5C',
                groundColor: '#32CD32',
                buildingMix: { residential: 0.35, commercial: 0.2, government: 0.25, industrial: 0.2 },
                features: ['public housing', 'community centers', 'worker cooperatives']
            },
            ecological: {
                name: 'Green Sustainability',
                skyColor: '#98FB98',
                groundColor: '#228B22',
                buildingMix: { residential: 0.3, commercial: 0.2, government: 0.2, industrial: 0.1, parks: 0.2 },
                features: ['green buildings', 'renewable energy', 'urban forests']
            },
            authoritarian: {
                name: 'Strong Leadership',
                skyColor: '#696969',
                groundColor: '#2F4F4F',
                buildingMix: { residential: 0.25, commercial: 0.2, government: 0.35, industrial: 0.2 },
                features: ['monumental architecture', 'state buildings', 'uniform design']
            },
            feminist: {
                name: 'Inclusive Society',
                skyColor: '#DDA0DD',
                groundColor: '#9370DB',
                buildingMix: { residential: 0.3, commercial: 0.3, government: 0.2, industrial: 0.2 },
                features: ['inclusive spaces', 'care facilities', 'diverse representation']
            }
        };
    }
    
    // Initialize the city structure with zones and layers
    initializeCityStructure() {
        // Clear existing content
        this.cityContainer.innerHTML = '';
        
        // Create city layers
        this.cityElements.background = this.createElement('div', 'city-background');
        this.cityElements.skyline = this.createElement('div', 'city-buildings');
        this.cityElements.foreground = this.createElement('div', 'city-foreground');
        this.cityElements.effects = this.createElement('div', 'city-effects');
        
        // Create building zones
        const zones = ['residential', 'commercial', 'government', 'industrial', 'landmarks'];
        zones.forEach(zoneType => {
            const zone = this.createElement('div', `${zoneType}-zone`);
            zone.setAttribute('data-zone', zoneType);
            this.cityElements.skyline.appendChild(zone);
        });
        
        // Append layers to container
        this.cityContainer.appendChild(this.cityElements.background);
        this.cityContainer.appendChild(this.cityElements.skyline);
        this.cityContainer.appendChild(this.cityElements.foreground);
        this.cityContainer.appendChild(this.cityElements.effects);
        
        // Add environmental elements
        this.addEnvironmentalElements();
    }
    
    // Render the initial city state
    renderInitialCity() {
        // Add basic buildings to each zone
        this.addBuildingToZone('residential', 'basic', 'starter-housing');
        this.addBuildingToZone('commercial', 'basic', 'starter-market');
        this.addBuildingToZone('government', 'basic', 'city-hall');
        this.addBuildingToZone('industrial', 'basic', 'basic-factory');
        
        // Set initial theme
        this.updateCityTheme('balanced');
        
        // Add initial environmental elements
        this.updateEnvironmentalQuality(50);
        
        // Update city info display
        this.updateCityInfo();
    }
    
    // Update city based on current game state and decisions
    async updateCity() {
        if (!this.isEnabled || !this.gameState || !this.scoringSystem) return;
        
        // Determine dominant ideology
        const ideologyAnalysis = this.scoringSystem.getIdeologicalAnalysis();
        const newTheme = this.determineThemeFromIdeology(ideologyAnalysis);
        
        // Update city theme if changed
        if (newTheme !== this.currentTheme) {
            await this.transitionToTheme(newTheme);
        }
        
        // Update buildings based on metrics
        this.updateBuildingsFromMetrics();
        
        // Update environmental elements
        const envQuality = this.scoringSystem.getCurrentMetrics().environmentalQuality;
        this.updateEnvironmentalQuality(envQuality);
        
        // Add special landmarks based on achievements
        this.updateLandmarks();
        
        // Update city activity indicators
        this.updateCityActivity();
        
        // Update city info display
        this.updateCityInfo();
    }
    
    // Determine city theme from ideological analysis
    determineThemeFromIdeology(ideologyAnalysis) {
        if (!ideologyAnalysis.dominantIdeology) return 'balanced';
        
        const dominantScore = ideologyAnalysis.primaryIdeology.score;
        if (dominantScore < 20) return 'balanced';
        
        return ideologyAnalysis.dominantIdeology;
    }
    
    // Transition to a new city theme
    async transitionToTheme(newTheme) {
        if (!this.cityThemes[newTheme]) return;
        
        this.currentTheme = newTheme;
        const theme = this.cityThemes[newTheme];
        
        // Animate background transition
        await this.animateBackgroundTransition(theme);
        
        // Update building styles
        await this.updateBuildingStyles(newTheme);
        
        // Update city layout
        this.updateCityLayout(theme);
        
        console.log(`City evolved to ${theme.name} theme`);
    }
    
    // Update buildings based on current metrics
    updateBuildingsFromMetrics() {
        const metrics = this.scoringSystem.getCurrentMetrics();
        
        // Economic buildings based on economic performance
        if (metrics.economicGrowth > 70) {
            this.addBuildingToZone('commercial', this.currentTheme, 'prosperity-tower');
        }
        
        // Social buildings based on social metrics
        if (metrics.healthcareAccess > 80) {
            this.addLandmark('hospital');
        }
        
        if (metrics.educationQuality > 80) {
            this.addLandmark('university');
        }
        
        // Environmental buildings
        if (metrics.environmentalQuality > 75) {
            this.addLandmark('park');
        }
        
        // Government buildings based on governance
        if (metrics.governanceEffectiveness > 85) {
            this.addLandmark('parliament');
        }
    }
    
    // Add environmental elements to the city
    addEnvironmentalElements() {
        // Add sky gradient
        const sky = this.createElement('div', 'city-sky');
        this.cityElements.background.appendChild(sky);
        
        // Add ground
        const ground = this.createElement('div', 'city-ground');
        this.cityElements.background.appendChild(ground);
        
        // Add atmospheric effects container
        const atmosphere = this.createElement('div', 'city-atmosphere');
        this.cityElements.effects.appendChild(atmosphere);
    }
    
    // Update environmental quality indicators
    updateEnvironmentalQuality(quality) {
        // Check if city elements exist (they may not in the new interface)
        if (!this.cityElements || !this.cityElements.effects) return;
        
        const atmosphere = this.cityElements.effects.querySelector('.city-atmosphere');
        if (!atmosphere) return;
        
        // Clear existing effects
        atmosphere.innerHTML = '';
        
        if (quality > 75) {
            // Clean, clear air
            atmosphere.className = 'city-atmosphere clean';
            this.addWeatherEffect('sunshine');
        } else if (quality > 50) {
            // Moderate air quality
            atmosphere.className = 'city-atmosphere moderate';
        } else if (quality > 25) {
            // Poor air quality
            atmosphere.className = 'city-atmosphere polluted';
            this.addWeatherEffect('smog');
        } else {
            // Very poor air quality
            atmosphere.className = 'city-atmosphere heavily-polluted';
            this.addWeatherEffect('heavy-smog');
        }
    }
    
    // Add weather and atmospheric effects
    addWeatherEffect(effectType) {
        const atmosphere = this.cityElements.effects.querySelector('.city-atmosphere');
        if (!atmosphere) return;
        
        const effect = this.createElement('div', `weather-${effectType}`);
        
        switch (effectType) {
            case 'sunshine':
                effect.innerHTML = '☀️';
                effect.style.cssText = 'position: absolute; top: 20px; right: 30px; font-size: 2rem; animation: glow 2s ease-in-out infinite alternate;';
                break;
            case 'smog':
                effect.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 30%; background: rgba(139, 69, 19, 0.3); animation: drift 10s linear infinite;';
                break;
            case 'heavy-smog':
                effect.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 50%; background: rgba(139, 69, 19, 0.5); animation: drift 8s linear infinite;';
                break;
        }
        
        atmosphere.appendChild(effect);
    }
    
    // Add a building to a specific zone
    addBuildingToZone(zoneType, buildingStyle, buildingId) {
        const zone = this.cityElements.skyline.querySelector(`[data-zone="${zoneType}"]`);
        if (!zone) return;
        
        // Check if building already exists
        if (this.buildings.has(buildingId)) return;
        
        const buildingType = this.buildingTypes[zoneType];
        if (!buildingType || !buildingType[buildingStyle]) return;
        
        const buildingData = buildingType[buildingStyle];
        const building = this.createBuilding(buildingData, buildingId, zoneType);
        
        zone.appendChild(building);
        this.buildings.set(buildingId, { element: building, type: zoneType, style: buildingStyle });
        
        // Animate building appearance
        this.animateBuildingAppearance(building);
    }
    
    // Add a landmark to the city
    addLandmark(landmarkType) {
        const landmarkId = `landmark-${landmarkType}`;
        if (this.buildings.has(landmarkId)) return;
        
        const landmarkData = this.buildingTypes.landmarks[landmarkType];
        if (!landmarkData) return;
        
        const landmarksZone = this.cityElements.skyline.querySelector('[data-zone="landmarks"]');
        if (!landmarksZone) return;
        
        const landmark = this.createBuilding(landmarkData, landmarkId, 'landmarks');
        landmark.classList.add('landmark');
        landmark.title = landmarkData.name;
        
        landmarksZone.appendChild(landmark);
        this.buildings.set(landmarkId, { element: landmark, type: 'landmarks', style: landmarkType });
        
        // Special animation for landmarks
        this.animateLandmarkAppearance(landmark);
    }
    
    // Create a building element
    createBuilding(buildingData, buildingId, zoneType) {
        const building = this.createElement('div', 'building');
        building.id = buildingId;
        building.setAttribute('data-zone', zoneType);
        building.setAttribute('data-building-type', buildingData.style || 'basic');
        
        // Set building dimensions and style
        building.style.height = `${buildingData.height}px`;
        building.style.backgroundColor = buildingData.color;
        building.style.width = '60px';
        building.style.borderRadius = '4px 4px 0 0';
        building.style.position = 'relative';
        building.style.margin = '0 2px';
        building.style.transition = 'all 0.5s ease';
        building.style.cursor = 'pointer';
        
        // Add building icon/symbol
        if (buildingData.icon) {
            const icon = this.createElement('div', 'building-icon');
            icon.innerHTML = buildingData.icon;
            icon.style.cssText = 'position: absolute; top: 10px; left: 50%; transform: translateX(-50%); font-size: 1.5rem;';
            building.appendChild(icon);
        }
        
        // Add building details for tooltips
        building.addEventListener('mouseenter', () => {
            this.showBuildingTooltip(building, buildingData);
        });
        
        building.addEventListener('mouseleave', () => {
            this.hideBuildingTooltip();
        });
        
        return building;
    }
    
    // Animate building appearance
    animateBuildingAppearance(building) {
        building.style.transform = 'scaleY(0)';
        building.style.transformOrigin = 'bottom';
        
        setTimeout(() => {
            building.style.transform = 'scaleY(1)';
        }, 100);
    }
    
    // Animate landmark appearance with special effects
    animateLandmarkAppearance(landmark) {
        landmark.style.transform = 'scale(0)';
        landmark.style.transformOrigin = 'bottom center';
        
        setTimeout(() => {
            landmark.style.transform = 'scale(1)';
            landmark.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
            
            // Add celebration effect
            this.addCelebrationEffect(landmark);
        }, 200);
    }
    
    // Add celebration effect for major achievements
    addCelebrationEffect(element) {
        const celebration = this.createElement('div', 'celebration-effect');
        celebration.innerHTML = '✨🎉✨';
        celebration.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1.5rem;
            animation: celebrate 2s ease-out forwards;
            pointer-events: none;
        `;
        
        element.appendChild(celebration);
        
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.remove();
            }
        }, 2000);
    }
    
    // Update city activity based on metrics
    updateCityActivity() {
        const metrics = this.scoringSystem.getCurrentMetrics();
        
        // Economic activity indicators
        if (metrics.economicGrowth > 60) {
            this.addActivityIndicator('busy-commercial', '💼📈');
        }
        
        // Social activity indicators
        if (metrics.socialCohesion > 70) {
            this.addActivityIndicator('social-activity', '👥🎭');
        }
        
        // Environmental activity
        if (metrics.environmentalQuality > 70) {
            this.addActivityIndicator('green-activity', '🌱♻️');
        }
    }
    
    // Add activity indicators to show city life
    addActivityIndicator(activityType, symbols) {
        const indicator = this.createElement('div', `activity-${activityType}`);
        indicator.innerHTML = symbols;
        indicator.style.cssText = `
            position: absolute;
            top: 20%;
            left: ${Math.random() * 80 + 10}%;
            font-size: 1.2rem;
            animation: float 3s ease-in-out infinite;
            pointer-events: none;
            z-index: 10;
        `;
        
        this.cityElements.foreground.appendChild(indicator);
        
        // Remove after animation
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }
    
    // Show building tooltip
    showBuildingTooltip(building, buildingData) {
        const tooltip = document.getElementById('building-tooltip') || this.createBuildingTooltip();
        
        const rect = building.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.display = 'block';
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${buildingData.name || building.id}</strong>
                <p>Type: ${building.getAttribute('data-zone')}</p>
                <p>Style: ${buildingData.style || 'Basic'}</p>
            </div>
        `;
    }
    
    // Hide building tooltip
    hideBuildingTooltip() {
        const tooltip = document.getElementById('building-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    // Create building tooltip element
    createBuildingTooltip() {
        const tooltip = this.createElement('div', 'building-tooltip');
        tooltip.id = 'building-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            display: none;
            transform: translateX(-50%) translateY(-100%);
            pointer-events: none;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }
    
    // Handle window resize
    handleResize() {
        // Adjust city layout for different screen sizes
        const containerWidth = this.cityContainer.offsetWidth;
        
        if (containerWidth < 768) {
            // Mobile layout adjustments
            this.cityContainer.classList.add('mobile-layout');
        } else {
            this.cityContainer.classList.remove('mobile-layout');
        }
    }
    
    // Utility method to create DOM elements
    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        return element;
    }
    
    // Animate background transition when theme changes
    async animateBackgroundTransition(theme) {
        const sky = this.cityElements.background.querySelector('.city-sky');
        const ground = this.cityElements.background.querySelector('.city-ground');
        
        if (sky) {
            sky.style.transition = 'background 2s ease';
            sky.style.background = `linear-gradient(to bottom, ${theme.skyColor}, rgba(255,255,255,0.1))`;
        }
        
        if (ground) {
            ground.style.transition = 'background 2s ease';
            ground.style.backgroundColor = theme.groundColor;
        }
        
        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Update building styles when theme changes
    async updateBuildingStyles(newTheme) {
        for (const [buildingId, buildingInfo] of this.buildings) {
            if (buildingInfo.type === 'landmarks') continue; // Don't change landmarks
            
            const building = buildingInfo.element;
            const zoneType = buildingInfo.type;
            
            // Get new building style for this theme
            const newBuildingData = this.buildingTypes[zoneType][newTheme];
            if (newBuildingData) {
                // Animate building transformation
                building.style.transition = 'all 1s ease';
                building.style.backgroundColor = newBuildingData.color;
                building.style.height = `${newBuildingData.height}px`;
                
                // Update icon if different
                const icon = building.querySelector('.building-icon');
                if (icon && newBuildingData.icon) {
                    icon.innerHTML = newBuildingData.icon;
                }
                
                // Update building type attribute
                building.setAttribute('data-building-type', newBuildingData.style || newTheme);
                
                // Update building info
                buildingInfo.style = newTheme;
            }
        }
        
        // Wait for building transitions to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Update city layout based on theme
    updateCityLayout(theme) {
        // Adjust zone sizes based on building mix
        const zones = this.cityElements.skyline.querySelectorAll('[data-zone]');
        
        zones.forEach(zone => {
            const zoneType = zone.getAttribute('data-zone');
            const mixRatio = theme.buildingMix[zoneType] || 0.2;
            
            // Adjust zone width based on theme priorities
            zone.style.flex = mixRatio.toString();
        });
    }
    
    // Update city theme
    updateCityTheme(themeName) {
        if (!this.cityThemes[themeName]) return;
        
        this.currentTheme = themeName;
        const theme = this.cityThemes[themeName];
        
        // Update background colors immediately
        const sky = this.cityElements.background.querySelector('.city-sky');
        const ground = this.cityElements.background.querySelector('.city-ground');
        
        if (sky) {
            sky.style.background = `linear-gradient(to bottom, ${theme.skyColor}, rgba(255,255,255,0.1))`;
        }
        
        if (ground) {
            ground.style.backgroundColor = theme.groundColor;
        }
    }
    
    // Update landmarks based on achievements
    updateLandmarks() {
        const metrics = this.scoringSystem.getCurrentMetrics();
        const year = this.gameState.currentYear;
        
        // Add landmarks based on specific achievements
        if (metrics.educationQuality > 80 && year >= 5) {
            this.addLandmark('university');
        }
        
        if (metrics.healthcareAccess > 80 && year >= 3) {
            this.addLandmark('hospital');
        }
        
        if (metrics.environmentalQuality > 75 && year >= 2) {
            this.addLandmark('park');
        }
        
        if (metrics.governanceEffectiveness > 85 && year >= 10) {
            this.addLandmark('parliament');
        }
        
        if (metrics.socialCohesion > 85 && year >= 8) {
            this.addLandmark('stadium');
        }
        
        if (metrics.culturalDiversity > 80 && year >= 6) {
            this.addLandmark('museum');
        }
        
        // Special landmarks for high achievements
        if (year >= 15) {
            if (metrics.overallHappiness > 90) {
                this.addLandmark('monument');
            }
            
            if (metrics.religiousSpiritualParticipation > 70) {
                this.addLandmark('cathedral');
            }
        }
    }
    
    // Update city info display
    updateCityInfo() {
        const cityThemeElement = document.getElementById('city-theme');
        const cityStatsElement = document.getElementById('city-stats');
        
        if (cityThemeElement) {
            const themeName = this.cityThemes[this.currentTheme]?.name || 'Balanced Development';
            cityThemeElement.textContent = themeName;
        }
        
        if (cityStatsElement) {
            const stats = this.getCityStats();
            const buildingText = stats.totalBuildings === 1 ? 'Building' : 'Buildings';
            const landmarkText = stats.landmarks === 1 ? 'Landmark' : 'Landmarks';
            cityStatsElement.textContent = `${stats.totalBuildings} ${buildingText} • ${stats.landmarks} ${landmarkText}`;
        }
    }
    
    // Get current city statistics for display
    getCityStats() {
        return {
            totalBuildings: this.buildings.size,
            theme: this.currentTheme,
            themeName: this.cityThemes[this.currentTheme]?.name || 'Unknown',
            landmarks: Array.from(this.buildings.values()).filter(b => b.type === 'landmarks').length,
            zones: {
                residential: Array.from(this.buildings.values()).filter(b => b.type === 'residential').length,
                commercial: Array.from(this.buildings.values()).filter(b => b.type === 'commercial').length,
                government: Array.from(this.buildings.values()).filter(b => b.type === 'government').length,
                industrial: Array.from(this.buildings.values()).filter(b => b.type === 'industrial').length
            }
        };
    }
}

export { CityVisualization }; 