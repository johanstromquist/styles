/**
 * 3D Society Evolution Visualization System
 * Creates dynamic 3D visualization of society that evolves based on political choices
 */

class SocietyVisualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.isInitialized = false;
        
        // Society state
        this.currentTheme = 'balanced';
        this.societyObjects = new Map();
        this.districts = new Map();
        this.landmarks = new Map();
        this.citizens = [];
        
        // Building and door tracking for pathfinding
        this.buildings = [];
        this.doors = [];
        this.crosswalks = [];
        
        // Society themes and their visual characteristics
        this.themes = {
            balanced: {
                name: 'Balanced Society',
                skyColor: 0x87CEEB,
                groundColor: 0x228B22,
                buildingColors: [0x8B7355, 0x4A90E2, 0x27AE60]
            },
            liberal: {
                name: 'Liberal Democracy',
                skyColor: 0x4A90E2,
                groundColor: 0x2ECC71,
                buildingColors: [0x3498DB, 0x1ABC9C, 0xF39C12],
                features: ['diverse_architecture', 'business_districts', 'cultural_centers']
            },
            conservative: {
                name: 'Traditional Values',
                skyColor: 0x8B7355,
                groundColor: 0x8FBC8F,
                buildingColors: [0x8B4513, 0xD2691E, 0x654321],
                features: ['traditional_architecture', 'family_neighborhoods', 'heritage_sites']
            },
            socialist: {
                name: 'Social Equality',
                skyColor: 0xCD5C5C,
                groundColor: 0x32CD32,
                buildingColors: [0xE74C3C, 0xC0392B, 0xA93226],
                features: ['public_housing', 'community_centers', 'worker_cooperatives']
            },
            ecological: {
                name: 'Green Sustainability',
                skyColor: 0x98FB98,
                groundColor: 0x228B22,
                buildingColors: [0x27AE60, 0x2ECC71, 0x58D68D],
                features: ['green_buildings', 'renewable_energy', 'urban_forests']
            },
            authoritarian: {
                name: 'Strong Leadership',
                skyColor: 0x696969,
                groundColor: 0x2F4F4F,
                buildingColors: [0x2C3E50, 0x34495E, 0x5D6D7E],
                features: ['monumental_architecture', 'state_buildings', 'uniform_design']
            },
            feminist: {
                name: 'Inclusive Society',
                skyColor: 0xDDA0DD,
                groundColor: 0x9370DB,
                buildingColors: [0x9B59B6, 0x8E44AD, 0xBB8FCE],
                features: ['inclusive_spaces', 'care_facilities', 'diverse_representation']
            }
        };
        
        // Building types for different districts
        this.buildingTypes = {
            residential: {
                basic: { height: 2, width: 1, depth: 1, color: 0x8B7355 },
                apartment: { height: 4, width: 1.5, depth: 1.5, color: 0x4A90E2 },
                mansion: { height: 3, width: 2, depth: 2, color: 0xD4AF37 }
            },
            commercial: {
                shop: { height: 2, width: 1, depth: 1, color: 0x9B59B6 },
                mall: { height: 3, width: 3, depth: 2, color: 0x1ABC9C },
                market: { height: 1.5, width: 2, depth: 2, color: 0xF39C12 }
            },
            government: {
                city_hall: { height: 4, width: 2, depth: 2, color: 0x34495E },
                parliament: { height: 6, width: 4, depth: 3, color: 0x2980B9 },
                courthouse: { height: 3, width: 2, depth: 2, color: 0x7F8C8D }
            },
            industrial: {
                factory: { height: 3, width: 3, depth: 2, color: 0x95A5A6 },
                clean_tech: { height: 2.5, width: 2, depth: 2, color: 0x27AE60 }
            },
            nature: {
                park: { height: 0.1, width: 3, depth: 3, color: 0x27AE60 },
                forest: { height: 4, width: 2, depth: 2, color: 0x228B22 }
            }
        };
    }

    async init(gameState, scoringSystem) {
        try {
            console.log('Starting society visualization initialization...');
            this.gameState = gameState;
            this.scoringSystem = scoringSystem;
            
            // Find container
            this.container = document.getElementById('society-canvas');
            if (!this.container) {
                console.error('Society canvas container not found');
                return false;
            }

            console.log('Container found:', this.container, 'Size:', this.container.clientWidth, 'x', this.container.clientHeight);

            // Check for WebGL support
            if (!this.checkWebGLSupport()) {
                console.log('WebGL not supported, using 2D fallback');
                this.initFallback2D();
                return false;
            }

            console.log('WebGL supported, initializing Three.js...');
            // Initialize Three.js
            await this.initThreeJS();
            
            // Create initial society
            this.createInitialSociety();
            
            // Mark as initialized BEFORE starting render loop
            this.isInitialized = true;
            
            // Start render loop
            this.startRenderLoop();
            
            // Handle window resize
            window.addEventListener('resize', () => this.handleResize());
            
            console.log('3D Society visualization initialized');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize 3D society visualization:', error);
            this.initFallback2D();
            return false;
        }
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    async initThreeJS() {
        // Import Three.js from CDN
        if (typeof THREE === 'undefined') {
            await this.loadThreeJS();
        }

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.themes.balanced.skyColor);

        // Create camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        // Initial camera position will be set by camera controls
        this.camera.position.set(0, 25, 30);
        this.camera.lookAt(0, 0, 0);
        console.log('Camera positioned at:', this.camera.position);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Clear container and add renderer
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        console.log('Renderer added to container. Canvas size:', this.renderer.domElement.width, 'x', this.renderer.domElement.height);

        // Add lighting
        this.setupLighting();

        // Add camera controls
        this.setupCameraControls();
    }

    async loadThreeJS() {
        return new Promise((resolve, reject) => {
            if (typeof THREE !== 'undefined') {
                console.log('Three.js already loaded');
                resolve();
                return;
            }

            console.log('Loading Three.js from CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                console.log('Three.js loaded successfully');
                resolve();
            };
            script.onerror = (error) => {
                console.error('Failed to load Three.js:', error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        console.log('Lighting setup complete - ambient:', ambientLight.intensity, 'directional:', directionalLight.intensity);
    }

    setupCameraControls() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        // Calculate initial camera control state from current camera position
        const currentPos = this.camera.position;
        const distance = currentPos.length();
        const polarAngle = Math.acos(currentPos.y / distance);
        const azimuthAngle = Math.atan2(currentPos.z, currentPos.x);
        
        // Camera control state
        this.cameraControls = {
            azimuthAngle: azimuthAngle, // Horizontal rotation (around Y-axis)
            polarAngle: polarAngle, // Vertical angle (locked to prevent going under ground)
            distance: distance // Distance from center
        };
        
        console.log('Camera controls initialized - polar angle clamped to prevent underground view');
        
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            this.renderer.domElement.style.cursor = 'grabbing';
        });

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            // Update camera angles
            const oldAzimuth = this.cameraControls.azimuthAngle;
            const oldPolar = this.cameraControls.polarAngle;
            
            this.cameraControls.azimuthAngle -= deltaMove.x * 0.01; // Horizontal rotation (unlimited)
            this.cameraControls.polarAngle += deltaMove.y * 0.01;   // Vertical rotation (limited)
            
            // Limit vertical angle to prevent going underneath
            // 0.2 = looking down, Math.PI/2 = horizontal view, Math.PI/2 - 0.1 = slight upward limit
            this.cameraControls.polarAngle = Math.max(0.2, Math.min(Math.PI/2 - 0.1, this.cameraControls.polarAngle));

            // Update camera position using spherical coordinates
            this.updateCameraPosition();

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
        });

        this.renderer.domElement.addEventListener('mouseleave', () => {
            isDragging = false;
            this.renderer.domElement.style.cursor = 'grab';
        });

        // Set initial cursor
        this.renderer.domElement.style.cursor = 'grab';

        // Zoom with mouse wheel
        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const zoomSpeed = 0.1;
            const zoomDelta = e.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
            this.cameraControls.distance *= zoomDelta;
            
            // Limit zoom range
            this.cameraControls.distance = Math.max(15, Math.min(60, this.cameraControls.distance));
            
            this.updateCameraPosition();
        });
    }

    updateCameraPosition() {
        // Convert spherical coordinates to Cartesian coordinates
        const x = this.cameraControls.distance * Math.sin(this.cameraControls.polarAngle) * Math.cos(this.cameraControls.azimuthAngle);
        const y = this.cameraControls.distance * Math.cos(this.cameraControls.polarAngle);
        const z = this.cameraControls.distance * Math.sin(this.cameraControls.polarAngle) * Math.sin(this.cameraControls.azimuthAngle);
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }

    createInitialSociety() {
        console.log('Creating initial society...');
        
        // Clear existing tracking arrays
        this.buildings = [];
        this.doors = [];
        this.crosswalks = [];
        
        // Create ground
        this.createGround();
        

        
        // Create initial districts
        this.createDistrict('residential', { x: -10, z: -10 }, 3);
        this.createDistrict('commercial', { x: 0, z: -10 }, 2);
        this.createDistrict('government', { x: 0, z: 0 }, 1);
        this.createDistrict('industrial', { x: 10, z: -10 }, 2);
        this.createDistrict('nature', { x: -10, z: 10 }, 2);
        
        // Create road network
        this.createRoadNetwork();
        
        // Add some initial citizens
        this.spawnCitizens(20);
        
        console.log('Initial society created with', this.scene.children.length, 'objects');
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: this.themes[this.currentTheme].groundColor 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        this.societyObjects.set('ground', ground);
    }

    createDistrict(type, position, size) {
        const district = new THREE.Group();
        district.position.set(position.x, 0, position.z);
        
        // Create buildings in this district
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const building = this.createBuilding(type);
                const buildingPos = {
                    x: (i - size/2) * 3 + Math.random() - 0.5,
                    z: (j - size/2) * 3 + Math.random() - 0.5
                };
                building.position.set(buildingPos.x, 0, buildingPos.z);
                
                // Track building position and door location for pathfinding
                const buildingData = building.userData.buildingData;
                let actualWidth = buildingData.width;
                let actualDepth = buildingData.depth;
                
                if (type === 'government') {
                    actualWidth = buildingData.width * 1.2;
                    actualDepth = buildingData.depth * 1.2;
                } else if (type === 'industrial') {
                    actualWidth = buildingData.width * 1.5;
                    actualDepth = buildingData.depth;
                }
                
                const worldPos = {
                    x: position.x + buildingPos.x,
                    z: position.z + buildingPos.z,
                    building: building,
                    districtType: type,
                    width: actualWidth,
                    depth: actualDepth
                };
                this.buildings.push(worldPos);
                
                // Track door position (front face center)
                if (type !== 'nature') {
                    const doorPos = {
                        x: position.x + buildingPos.x,
                        z: position.z + buildingPos.z + actualDepth / 2,
                        building: building,
                        districtType: type
                    };
                    this.doors.push(doorPos);
                }
                
                district.add(building);
            }
        }
        
        this.scene.add(district);
        this.districts.set(type, district);
    }

    createBuilding(districtType) {
        const buildingTypes = this.buildingTypes[districtType];
        const typeKeys = Object.keys(buildingTypes);
        const randomType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
        const buildingData = buildingTypes[randomType];
        
        // Create building group to hold multiple parts
        const buildingGroup = new THREE.Group();
        
        // Create main building structure
        const mainBuilding = this.createBuildingStructure(buildingData, districtType);
        buildingGroup.add(mainBuilding);
        
        // Add building details based on type
        const details = this.createBuildingDetails(buildingData, districtType);
        details.forEach(detail => buildingGroup.add(detail));
        
        // Add outline/wireframe that matches the actual building
        const outline = this.createBuildingOutline(buildingData, districtType);
        buildingGroup.add(outline);
        
        buildingGroup.position.y = 0;
        buildingGroup.castShadow = true;
        buildingGroup.receiveShadow = true;
        
        // Store building data for door tracking
        buildingGroup.userData = {
            buildingData: buildingData,
            districtType: districtType
        };
        
        return buildingGroup;
    }

    createBuildingStructure(buildingData, districtType) {
        // Create more interesting building shapes based on type
        let geometry;
        
        if (districtType === 'residential') {
            // Houses with varied rooflines
            geometry = this.createHouseGeometry(buildingData);
        } else if (districtType === 'commercial') {
            // Taller, more rectangular buildings
            geometry = new THREE.BoxGeometry(
                buildingData.width, 
                buildingData.height, 
                buildingData.depth
            );
        } else if (districtType === 'government') {
            // Wide, imposing buildings
            geometry = new THREE.BoxGeometry(
                buildingData.width * 1.2, 
                buildingData.height * 0.8, 
                buildingData.depth * 1.2
            );
        } else if (districtType === 'industrial') {
            // Long, functional buildings
            geometry = new THREE.BoxGeometry(
                buildingData.width * 1.5, 
                buildingData.height * 0.7, 
                buildingData.depth
            );
        } else {
            // Default box for nature/other
            geometry = new THREE.BoxGeometry(
                buildingData.width, 
                buildingData.height, 
                buildingData.depth
            );
        }
        
        // Create material with theme-appropriate color and texture
        const material = this.createBuildingMaterial(districtType);
        
        const building = new THREE.Mesh(geometry, material);
        // Position building so its bottom sits on the ground
        // Since geometries are centered, we need to lift them by half their height
        let actualHeight = buildingData.height;
        if (districtType === 'government') {
            actualHeight = buildingData.height * 0.8;
        } else if (districtType === 'industrial') {
            actualHeight = buildingData.height * 0.7;
        }
        building.position.y = actualHeight / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        
        return building;
    }

    createHouseGeometry(buildingData) {
        // For now, return a simple box geometry to avoid Three.js group issues
        // We can enhance this later once the basic system is working
        return new THREE.BoxGeometry(
            buildingData.width, 
            buildingData.height, 
            buildingData.depth
        );
    }

    createBuildingMaterial(districtType) {
        // Get theme-appropriate color
        const themeColors = this.themes[this.currentTheme].buildingColors;
        let baseColor = themeColors[Math.floor(Math.random() * themeColors.length)];
        
        // District-specific color adjustments and material properties
        let material;
        
        if (districtType === 'residential') {
            // Warmer, more varied colors for homes
            const residentialColors = [0xF4A460, 0xDEB887, 0xD2B48C, 0xBC8F8F, 0xF5DEB3];
            baseColor = residentialColors[Math.floor(Math.random() * residentialColors.length)];
            material = new THREE.MeshLambertMaterial({ 
                color: baseColor,
                transparent: false
            });
        } else if (districtType === 'commercial') {
            // Modern, sleek colors for businesses
            const commercialColors = [0x708090, 0x2F4F4F, 0x696969, 0x778899, 0x4682B4];
            baseColor = commercialColors[Math.floor(Math.random() * commercialColors.length)];
            material = new THREE.MeshLambertMaterial({ 
                color: baseColor,
                transparent: false
            });
        } else if (districtType === 'government') {
            // Formal, imposing colors for official buildings
            const govColors = [0xF5F5DC, 0xFFFAF0, 0xF0F8FF, 0xFAF0E6];
            baseColor = govColors[Math.floor(Math.random() * govColors.length)];
            material = new THREE.MeshLambertMaterial({ 
                color: baseColor,
                transparent: false
            });
        } else if (districtType === 'industrial') {
            // Utilitarian, darker colors for factories
            const industrialColors = [0x696969, 0x2F4F4F, 0x556B2F, 0x8B4513, 0x654321];
            baseColor = industrialColors[Math.floor(Math.random() * industrialColors.length)];
            material = new THREE.MeshLambertMaterial({ 
                color: baseColor,
                transparent: false
            });
        } else if (districtType === 'nature') {
            // Natural, green colors for parks
            const natureColors = [0x228B22, 0x32CD32, 0x90EE90, 0x98FB98, 0x00FF7F];
            baseColor = natureColors[Math.floor(Math.random() * natureColors.length)];
            material = new THREE.MeshLambertMaterial({ 
                color: baseColor,
                transparent: false
            });
        } else {
            // Default material
            material = new THREE.MeshLambertMaterial({ 
                color: baseColor,
                transparent: false
            });
        }
        
        return material;
    }

    createBuildingDetails(buildingData, districtType) {
        const details = [];
        
        // Calculate actual building dimensions
        let actualWidth = buildingData.width;
        let actualHeight = buildingData.height;
        let actualDepth = buildingData.depth;
        
        if (districtType === 'government') {
            actualWidth = buildingData.width * 1.2;
            actualHeight = buildingData.height * 0.8;
            actualDepth = buildingData.depth * 1.2;
        } else if (districtType === 'industrial') {
            actualWidth = buildingData.width * 1.5;
            actualHeight = buildingData.height * 0.7;
        }
        
        // Add doors to all non-nature buildings
        if (districtType !== 'nature') {
            const door = this.createBuildingDoor(actualWidth, actualHeight, actualDepth, districtType);
            if (door) {
                details.push(door);
            }
        }
        
        // Add windows based on building type
        if (districtType !== 'nature') {
            const windows = this.createBuildingWindows(actualWidth, actualHeight, actualDepth, districtType);
            details.push(...windows);
        }
        
        // Add district-specific architectural features
        if (districtType === 'government' && Math.random() < 0.4) {
            const flagPole = this.createFlagPole(actualWidth, actualHeight);
            if (flagPole) details.push(flagPole);
        } else if (districtType === 'industrial' && Math.random() < 0.3) {
            const smokestack = this.createSmokestack(actualWidth, actualHeight, actualDepth);
            if (smokestack) details.push(smokestack);
        } else if (districtType === 'commercial' && Math.random() < 0.5) {
            const sign = this.createCommercialSign(actualWidth, actualHeight, actualDepth);
            if (sign) details.push(sign);
        } else if (districtType === 'residential' && Math.random() < 0.3) {
            const chimney = this.createChimney(actualWidth, actualHeight, actualDepth);
            if (chimney) details.push(chimney);
        }
        
        return details;
    }

    createBuildingDoor(width, height, depth, districtType) {
        // Create a door on the front face of the building
        const doorWidth = Math.min(0.4, width * 0.3);
        const doorHeight = Math.min(0.8, height * 0.4);
        
        // Door geometry - a simple rectangle
        const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight);
        
        // Door material - darker color for contrast
        let doorColor = 0x8B4513; // Default brown
        if (districtType === 'residential') {
            doorColor = 0x654321; // Dark brown for homes
        } else if (districtType === 'commercial') {
            doorColor = 0x2F4F4F; // Dark gray for businesses
        } else if (districtType === 'government') {
            doorColor = 0x8B0000; // Dark red for official buildings
        } else if (districtType === 'industrial') {
            doorColor = 0x2F2F2F; // Very dark gray for factories
        }
        
        const doorMaterial = new THREE.MeshLambertMaterial({ color: doorColor });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        
        // Position door on the front face, centered horizontally, at ground level
        door.position.set(0, doorHeight / 2, depth / 2 + 0.01);
        
        return door;
    }

    createBuildingWindows(width, height, depth, districtType) {
        const windows = [];
        const windowSize = 0.15;
        const windowColor = 0x87CEEB;
        
        // Different window patterns for different building types
        let windowsPerRow, windowRows;
        
        if (districtType === 'residential') {
            windowsPerRow = Math.min(2, Math.floor(width / 0.8));
            windowRows = Math.min(2, Math.floor(height / 1.5));
        } else if (districtType === 'commercial') {
            windowsPerRow = Math.min(3, Math.floor(width / 0.6));
            windowRows = Math.min(4, Math.floor(height / 1.0));
        } else if (districtType === 'government') {
            windowsPerRow = Math.min(4, Math.floor(width / 0.8));
            windowRows = Math.min(2, Math.floor(height / 1.2));
        } else if (districtType === 'industrial') {
            windowsPerRow = Math.min(2, Math.floor(width / 1.2));
            windowRows = Math.min(2, Math.floor(height / 1.5));
        }
        
        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowsPerRow; col++) {
                const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                const windowMaterial = new THREE.MeshBasicMaterial({ color: windowColor });
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                
                // Position windows on front face
                const x = (col - (windowsPerRow - 1) / 2) * (width / windowsPerRow) * 0.8;
                const y = height * 0.2 + (row + 0.5) * (height * 0.6 / windowRows);
                const z = depth / 2 + 0.01;
                
                window.position.set(x, y, z);
                windows.push(window);
            }
        }
        
        return windows;
    }

    createFlagPole(width, height) {
        const poleGeometry = new THREE.CylinderGeometry(0.02, 0.02, height * 0.6, 4);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(width / 2 + 0.3, height * 0.3, 0);
        return pole;
    }

    createSmokestack(width, height, depth) {
        const stackGeometry = new THREE.CylinderGeometry(0.2, 0.2, height * 0.8, 6);
        const stackMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const stack = new THREE.Mesh(stackGeometry, stackMaterial);
        stack.position.set(
            (Math.random() - 0.5) * width * 0.6,
            height * 0.4,
            (Math.random() - 0.5) * depth * 0.6
        );
        return stack;
    }

    createCommercialSign(width, height, depth) {
        const signGeometry = new THREE.PlaneGeometry(width * 0.8, 0.3);
        const signColors = [0xFF6B6B, 0x4ECDC4, 0xFFD93D, 0x6BCF7F];
        const signColor = signColors[Math.floor(Math.random() * signColors.length)];
        const signMaterial = new THREE.MeshBasicMaterial({ color: signColor });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(0, height + 0.2, depth / 2 + 0.01);
        return sign;
    }

    createChimney(width, height, depth) {
        const chimneyGeometry = new THREE.CylinderGeometry(0.1, 0.1, height * 0.3, 6);
        const chimneyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(
            (Math.random() - 0.5) * width * 0.6,
            height + height * 0.15,
            (Math.random() - 0.5) * depth * 0.6
        );
        return chimney;
    }

    createWindows(buildingData, districtType) {
        const windows = [];
        const windowSize = 0.2;
        const windowColor = 0x87CEEB; // Sky blue for windows
        
        // Calculate number of windows based on building size
        const windowsX = Math.floor(buildingData.width / 1.5);
        const windowsY = Math.floor(buildingData.height / 2);
        
        for (let x = 0; x < windowsX; x++) {
            for (let y = 0; y < windowsY; y++) {
                const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                const windowMaterial = new THREE.MeshBasicMaterial({ color: windowColor });
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                
                // Position windows on front face
                windowMesh.position.set(
                    (x - windowsX/2) * 1.5,
                    (y - windowsY/2) * 2 + buildingData.height / 2,
                    buildingData.depth / 2 + 0.01
                );
                
                windows.push(windowMesh);
            }
        }
        
        return windows;
    }

    createFlagPole(buildingData) {
        if (Math.random() < 0.3) { // 30% chance of flag pole
            const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, buildingData.height * 0.8);
            const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.set(
                buildingData.width / 2 + 0.5,
                buildingData.height * 0.4,
                0
            );
            return pole;
        }
        return null;
    }

    createSmokestack(buildingData) {
        if (Math.random() < 0.4) { // 40% chance of smokestack
            const stackGeometry = new THREE.CylinderGeometry(0.3, 0.3, buildingData.height * 1.2);
            const stackMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
            const stack = new THREE.Mesh(stackGeometry, stackMaterial);
            stack.position.set(
                (Math.random() - 0.5) * buildingData.width,
                buildingData.height * 0.6,
                (Math.random() - 0.5) * buildingData.depth
            );
            return stack;
        }
        return null;
    }

    createSign(buildingData) {
        if (Math.random() < 0.5) { // 50% chance of signage
            const signGeometry = new THREE.PlaneGeometry(buildingData.width * 0.8, 0.5);
            const signMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6B6B });
            const sign = new THREE.Mesh(signGeometry, signMaterial);
            sign.position.set(
                0,
                buildingData.height + 0.3,
                buildingData.depth / 2 + 0.01
            );
            return sign;
        }
        return null;
    }

    createBuildingOutline(buildingData, districtType) {
        // Calculate the actual building dimensions based on district type
        let actualWidth = buildingData.width;
        let actualHeight = buildingData.height;
        let actualDepth = buildingData.depth;
        
        if (districtType === 'government') {
            actualWidth = buildingData.width * 1.2;
            actualHeight = buildingData.height * 0.8;
            actualDepth = buildingData.depth * 1.2;
        } else if (districtType === 'industrial') {
            actualWidth = buildingData.width * 1.5;
            actualHeight = buildingData.height * 0.7;
        }
        
        // Create outline that matches the actual building size
        const outlineGeometry = new THREE.BoxGeometry(
            actualWidth + 0.02, 
            actualHeight + 0.02, 
            actualDepth + 0.02
        );
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        // Position outline to match the building (bottom on ground)
        outline.position.y = actualHeight / 2;
        
        return outline;
    }

    createRoadNetwork() {
        // Create main roads connecting districts
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x404040 }); // Dark gray
        
        // Horizontal main road
        const mainRoadH = new THREE.PlaneGeometry(40, 2);
        const mainRoadHMesh = new THREE.Mesh(mainRoadH, roadMaterial);
        mainRoadHMesh.rotation.x = -Math.PI / 2;
        mainRoadHMesh.position.set(0, 0.01, -5);
        this.scene.add(mainRoadHMesh);
        
        // Vertical main road
        const mainRoadV = new THREE.PlaneGeometry(2, 40);
        const mainRoadVMesh = new THREE.Mesh(mainRoadV, roadMaterial);
        mainRoadVMesh.rotation.x = -Math.PI / 2;
        mainRoadVMesh.position.set(-5, 0.01, 0);
        this.scene.add(mainRoadVMesh);
        
        // Add crosswalks at road intersections
        this.createCrosswalks();
        
        // Add some smaller connecting paths
        this.createPaths();
        
        console.log('Road network created');
    }

    createCrosswalks() {
        const crosswalkMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF }); // White stripes
        
        // Crosswalks properly placed across roads, not in intersection
        const crosswalkPositions = [
            // Crosswalk across horizontal road (north of intersection)
            { x: -6, z: -2, width: 0.3, length: 2 },
            { x: -5.5, z: -2, width: 0.3, length: 2 },
            { x: -4.5, z: -2, width: 0.3, length: 2 },
            { x: -4, z: -2, width: 0.3, length: 2 },
            
            // Crosswalk across horizontal road (south of intersection)
            { x: -6, z: -8, width: 0.3, length: 2 },
            { x: -5.5, z: -8, width: 0.3, length: 2 },
            { x: -4.5, z: -8, width: 0.3, length: 2 },
            { x: -4, z: -8, width: 0.3, length: 2 },
            
            // Crosswalk across vertical road (west of intersection)
            { x: -8, z: -6, width: 2, length: 0.3 },
            { x: -8, z: -5.5, width: 2, length: 0.3 },
            { x: -8, z: -4.5, width: 2, length: 0.3 },
            { x: -8, z: -4, width: 2, length: 0.3 },
            
            // Crosswalk across vertical road (east of intersection)
            { x: -2, z: -6, width: 2, length: 0.3 },
            { x: -2, z: -5.5, width: 2, length: 0.3 },
            { x: -2, z: -4.5, width: 2, length: 0.3 },
            { x: -2, z: -4, width: 2, length: 0.3 },
        ];
        
        crosswalkPositions.forEach(pos => {
            const crosswalkGeometry = new THREE.PlaneGeometry(pos.width, pos.length);
            const crosswalkMesh = new THREE.Mesh(crosswalkGeometry, crosswalkMaterial);
            crosswalkMesh.rotation.x = -Math.PI / 2;
            crosswalkMesh.position.set(pos.x, 0.02, pos.z);
            this.scene.add(crosswalkMesh);
        });
        
        // Store crosswalk areas for citizen pathfinding
        this.crosswalks = [
            { x: -5, z: -2, width: 2, length: 2, direction: 'horizontal' }, // North crosswalk
            { x: -5, z: -8, width: 2, length: 2, direction: 'horizontal' }, // South crosswalk
            { x: -8, z: -5, width: 2, length: 2, direction: 'vertical' },   // West crosswalk
            { x: -2, z: -5, width: 2, length: 2, direction: 'vertical' },   // East crosswalk
        ];
    }

    createPaths() {
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 }); // Brown paths
        
        // Create smaller paths connecting to districts
        const pathPositions = [
            { from: { x: -10, z: -5 }, to: { x: -10, z: -10 } }, // Residential connector
            { from: { x: 0, z: -5 }, to: { x: 0, z: -10 } },    // Commercial connector
            { from: { x: 10, z: -5 }, to: { x: 10, z: -10 } },  // Industrial connector
            { from: { x: -5, z: 0 }, to: { x: -10, z: 10 } },   // Nature connector
        ];
        
        pathPositions.forEach(path => {
            const length = Math.sqrt(
                Math.pow(path.to.x - path.from.x, 2) + 
                Math.pow(path.to.z - path.from.z, 2)
            );
            
            const pathGeometry = new THREE.PlaneGeometry(1, length);
            const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
            pathMesh.rotation.x = -Math.PI / 2;
            
            // Position and rotate path
            const midX = (path.from.x + path.to.x) / 2;
            const midZ = (path.from.z + path.to.z) / 2;
            pathMesh.position.set(midX, 0.005, midZ);
            
            // Rotate to connect points
            const angle = Math.atan2(path.to.z - path.from.z, path.to.x - path.from.x);
            pathMesh.rotation.z = angle;
            
            this.scene.add(pathMesh);
        });
    }

    spawnCitizens(count) {
        for (let i = 0; i < count; i++) {
            const citizen = this.createCitizen();
            this.citizens.push(citizen);
            this.scene.add(citizen);
        }
    }

    createCitizen() {
        // Create a simple but cute humanoid character using basic geometries
        const citizenGroup = new THREE.Group();
        
        // Body colors
        const skinTones = [0xFFDBB3, 0xF1C27D, 0xE0AC69, 0xC68642, 0x8D5524, 0x6F4E37];
        const clothingColors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFECEA8, 0xD63031, 0x6C5CE7];
        
        const skinColor = skinTones[Math.floor(Math.random() * skinTones.length)];
        const clothingColor = clothingColors[Math.floor(Math.random() * clothingColors.length)];
        
        // Create individual meshes instead of complex groups to avoid bounding box issues
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.12, 6, 4);
        const headMaterial = new THREE.MeshLambertMaterial({ color: skinColor });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 0.5, 0);
        citizenGroup.add(head);
        
        // Body (simple cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.3, 6);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: clothingColor });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0.25, 0);
        citizenGroup.add(body);
        
        // Simple legs (just two small cylinders)
        const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 4);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2D3436 });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.04, 0.1, 0);
        citizenGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.04, 0.1, 0);
        citizenGroup.add(rightLeg);
        
        // Position citizens safely on main roads only
        const roadPositions = [
            // Main horizontal road - safe areas
            { x: -15 + Math.random() * 10, z: -5 + (Math.random() - 0.5) * 1 },
            { x: 5 + Math.random() * 10, z: -5 + (Math.random() - 0.5) * 1 },
            // Main vertical road - safe areas
            { x: -5 + (Math.random() - 0.5) * 1, z: -15 + Math.random() * 5 },
            { x: -5 + (Math.random() - 0.5) * 1, z: 5 + Math.random() * 10 },
        ];
        const randomPos = roadPositions[Math.floor(Math.random() * roadPositions.length)];
        
        citizenGroup.position.set(
            randomPos.x,
            0,
            randomPos.z
        );
        
        // Add animation data and pathfinding state
        citizenGroup.userData = {
            speed: 0.01 + Math.random() * 0.02,
            direction: Math.random() * Math.PI * 2,
            walkCycle: Math.random() * Math.PI * 2,
            originalY: citizenGroup.position.y,
            skinColor: skinColor,
            clothingColor: clothingColor,
            // Pathfinding states
            state: 'wandering', // 'wandering', 'heading_to_door', 'entering', 'exiting'
            targetDoor: null,
            stateTimer: 0,
            lastDirectionChange: 0,
            lastBreakout: 0,
            // Position tracking for stuck detection
            positionHistory: [],
            lastPositionCheck: 0
        };
        
        // Slight size variation
        const scale = 0.8 + Math.random() * 0.4;
        citizenGroup.scale.set(scale, scale, scale);
        
        return citizenGroup;
    }

    updateSociety(gameState, ideologyAnalysis) {
        if (!this.isInitialized) return;
        
        try {
            // Determine new theme based on ideology
            const newTheme = this.determineTheme(ideologyAnalysis);
            
            if (newTheme !== this.currentTheme) {
                this.transitionToTheme(newTheme);
            }
            
            // Update citizen behavior
            this.updateCitizens(gameState);
        } catch (error) {
            console.error('Error updating society visualization:', error);
        }
    }

    determineTheme(ideologyAnalysis) {
        if (!ideologyAnalysis || !ideologyAnalysis.allScores) return 'balanced';
        
        const scores = ideologyAnalysis.allScores;
        let dominantIdeology = 'balanced';
        let maxScore = 0;
        
        Object.entries(scores).forEach(([ideology, score]) => {
            if (score > maxScore) {
                maxScore = score;
                dominantIdeology = ideology;
            }
        });
        
        // Only change theme if there's a clear dominant ideology (>40 points)
        return maxScore > 40 ? dominantIdeology : 'balanced';
    }

    transitionToTheme(newTheme) {
        if (!this.themes[newTheme]) return;
        
        console.log(`Society evolving to: ${this.themes[newTheme].name}`);
        
        const theme = this.themes[newTheme];
        this.currentTheme = newTheme;
        
        // Update sky color
        this.scene.background.setHex(theme.skyColor);
        
        // Update ground color
        const ground = this.societyObjects.get('ground');
        if (ground) {
            ground.material.color.setHex(theme.groundColor);
        }
        
        // Update building colors
        this.updateBuildingColors(theme.buildingColors);
        
        // Update society status text
        this.updateSocietyStatus(theme.name);
    }

    updateBuildingColors(themeColors) {
        this.districts.forEach(district => {
            district.children.forEach(building => {
                if (building.material) {
                    const newColor = themeColors[Math.floor(Math.random() * themeColors.length)];
                    building.material.color.setHex(newColor);
                }
            });
        });
    }

    updateCitizens(gameState) {
        this.citizens.forEach(citizen => {
            // Simple movement animation
            citizen.userData.direction += (Math.random() - 0.5) * 0.1;
            citizen.position.x += Math.cos(citizen.userData.direction) * citizen.userData.speed;
            citizen.position.z += Math.sin(citizen.userData.direction) * citizen.userData.speed;
            
            // Keep citizens within bounds
            const bounds = 20;
            if (Math.abs(citizen.position.x) > bounds) {
                citizen.userData.direction = Math.PI - citizen.userData.direction;
            }
            if (Math.abs(citizen.position.z) > bounds) {
                citizen.userData.direction = -citizen.userData.direction;
            }
        });
    }

    updateCitizenAnimations() {
        this.citizens.forEach(citizen => {
            // Update walking cycle
            citizen.userData.walkCycle += citizen.userData.speed * 10;
            citizen.userData.stateTimer++;
            
            // Intelligent pathfinding based on citizen state
            this.updateCitizenPathfinding(citizen);
            
            // Add subtle bobbing motion while walking
            citizen.position.y = citizen.userData.originalY + Math.sin(citizen.userData.walkCycle) * 0.01;
            
            // Rotate citizen to face movement direction
            citizen.rotation.y = citizen.userData.direction + Math.PI / 2;
            
            // Animate legs for walking effect (if this is a humanoid citizen)
            if (citizen.children && citizen.children.length >= 4) {
                const leftLeg = citizen.children[2];  // Third child should be left leg
                const rightLeg = citizen.children[3]; // Fourth child should be right leg
                
                if (leftLeg && rightLeg) {
                    // Simple leg swinging animation
                    leftLeg.rotation.x = Math.sin(citizen.userData.walkCycle) * 0.3;
                    rightLeg.rotation.x = Math.sin(citizen.userData.walkCycle + Math.PI) * 0.3;
                }
            }
            
            // Keep citizens within bounds
            const bounds = 20;
            if (Math.abs(citizen.position.x) > bounds) {
                citizen.userData.direction = Math.PI - citizen.userData.direction;
                citizen.userData.state = 'wandering';
                citizen.userData.targetDoor = null;
            }
            if (Math.abs(citizen.position.z) > bounds) {
                citizen.userData.direction = -citizen.userData.direction;
                citizen.userData.state = 'wandering';
                citizen.userData.targetDoor = null;
            }
        });
    }

    updateCitizenPathfinding(citizen) {
        const userData = citizen.userData;
        
        switch (userData.state) {
            case 'wandering':
                this.handleWanderingState(citizen);
                break;
            case 'heading_to_door':
                this.handleHeadingToDoorState(citizen);
                break;
            case 'entering':
                this.handleEnteringState(citizen);
                break;
            case 'exiting':
                this.handleExitingState(citizen);
                break;
        }
        

    }

    handleWanderingState(citizen) {
        const userData = citizen.userData;
        
        // Check if citizen needs to cross a road and redirect to crosswalk
        const needsCrosswalk = this.checkNeedsCrosswalk(citizen, userData.direction);
        if (needsCrosswalk) {
            const nearestCrosswalk = this.findNearestCrosswalk(citizen.position);
            if (nearestCrosswalk) {
                // Head to crosswalk instead of crossing randomly
                const crosswalkDirection = Math.atan2(
                    nearestCrosswalk.z - citizen.position.z,
                    nearestCrosswalk.x - citizen.position.x
                );
                userData.direction = crosswalkDirection;
            }
        }
        
        // Building avoidance with stuck detection
        const avoidanceForce = this.calculateBuildingAvoidance(citizen.position);
        if (avoidanceForce.x !== 0 || avoidanceForce.z !== 0) {
            // Check if citizen is stuck in a loop (moving in small circles)
            if (this.isStuckInLoop(citizen)) {
                // Break out of loop with random direction
                userData.direction = Math.random() * Math.PI * 2;
                userData.lastBreakout = userData.stateTimer;
                // Move away with extra speed
                citizen.position.x += Math.cos(userData.direction) * userData.speed * 3;
                citizen.position.z += Math.sin(userData.direction) * userData.speed * 3;
                return;
            }
            
            // Normal gentle avoidance
            userData.direction += avoidanceForce.x * 0.1 + avoidanceForce.z * 0.1;
        }
        
        // Random movement with occasional direction changes
        if (userData.stateTimer - userData.lastDirectionChange > 100 + Math.random() * 200) {
            userData.direction += (Math.random() - 0.5) * Math.PI / 3;
            userData.lastDirectionChange = userData.stateTimer;
        }
        
        // Small random direction adjustments to prevent getting stuck
        userData.direction += (Math.random() - 0.5) * 0.05;
        
        // Move in current direction
        citizen.position.x += Math.cos(userData.direction) * userData.speed;
        citizen.position.z += Math.sin(userData.direction) * userData.speed;
        
        // Occasionally decide to visit a building
        if (Math.random() < 0.003 && this.doors.length > 0) {
            const randomDoor = this.doors[Math.floor(Math.random() * this.doors.length)];
            userData.targetDoor = randomDoor;
            userData.state = 'heading_to_door';
        }
    }

    handleHeadingToDoorState(citizen) {
        const userData = citizen.userData;
        
        if (!userData.targetDoor) {
            userData.state = 'wandering';
            return;
        }
        
        // Calculate direction to door
        const doorDirection = Math.atan2(
            userData.targetDoor.z - citizen.position.z,
            userData.targetDoor.x - citizen.position.x
        );
        
        // Move directly towards door (ignore building collision when heading to door)
        userData.direction = doorDirection;
        
        // Move towards door with higher speed to avoid getting stuck
        citizen.position.x += Math.cos(userData.direction) * userData.speed * 1.5;
        citizen.position.z += Math.sin(userData.direction) * userData.speed * 1.5;
        
        // Check if reached door
        const distanceToDoor = this.getDistance2D(citizen.position, userData.targetDoor);
        if (distanceToDoor < 1.2) {
            userData.state = 'entering';
            userData.stateTimer = 0;
            // Move citizen inside the building (behind the door)
            const building = userData.targetDoor.building;
            const buildingData = building.userData.buildingData;
            citizen.position.x = userData.targetDoor.x;
            citizen.position.z = userData.targetDoor.z - buildingData.depth * 0.3; // Move inside

        }
        
        // Give up if taking too long
        if (userData.stateTimer > 800) {
            userData.state = 'wandering';
            userData.targetDoor = null;

        }
    }

    handleEnteringState(citizen) {
        const userData = citizen.userData;
        
        // Stay inside building for a moment
        if (userData.stateTimer > 60 + Math.random() * 120) {
            userData.state = 'exiting';
            userData.stateTimer = 0;

        }
    }

    handleExitingState(citizen) {
        const userData = citizen.userData;
        
        // Move back to the door position
        if (userData.targetDoor) {
            citizen.position.x = userData.targetDoor.x;
            citizen.position.z = userData.targetDoor.z;
            
            // Then move away from the door in a random direction
            userData.direction = Math.random() * Math.PI * 2;
        }
        
        // Move away from building
        citizen.position.x += Math.cos(userData.direction) * userData.speed * 2;
        citizen.position.z += Math.sin(userData.direction) * userData.speed * 2;
        
        // Return to wandering after moving away
        if (userData.stateTimer > 30) {
            userData.state = 'wandering';
            userData.targetDoor = null;
            userData.stateTimer = 0;
        }
    }

    findNearbyBuilding(position) {
        let closestBuilding = null;
        let closestDistance = Infinity;
        
        for (const building of this.buildings) {
            // Check if citizen is within building's rectangular bounds
            const halfWidth = building.width / 2;
            const halfDepth = building.depth / 2;
            
            const dx = Math.abs(position.x - building.x);
            const dz = Math.abs(position.z - building.z);
            
            // If inside building bounds, return immediately
            if (dx < halfWidth + 0.5 && dz < halfDepth + 0.5) {
                return building;
            }
            
            // Otherwise check distance for nearby buildings
            const distance = this.getDistance2D(position, building);
            if (distance < closestDistance && distance < 3) {
                closestDistance = distance;
                closestBuilding = building;
            }
        }
        
        return closestBuilding;
    }

    getDistance2D(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    checkNeedsCrosswalk(citizen, direction) {
        const futureX = citizen.position.x + Math.cos(direction) * 2;
        const futureZ = citizen.position.z + Math.sin(direction) * 2;
        
        // Check if citizen would cross the main horizontal road (z = -5)
        if ((citizen.position.z > -3 && futureZ < -7) || (citizen.position.z < -7 && futureZ > -3)) {
            // Would cross horizontal road, check if not already on crosswalk
            return !this.isOnCrosswalk(citizen.position);
        }
        
        // Check if citizen would cross the main vertical road (x = -5)
        if ((citizen.position.x > -3 && futureX < -7) || (citizen.position.x < -7 && futureX > -3)) {
            // Would cross vertical road, check if not already on crosswalk
            return !this.isOnCrosswalk(citizen.position);
        }
        
        return false;
    }

    isOnCrosswalk(position) {
        for (const crosswalk of this.crosswalks) {
            const dx = Math.abs(position.x - crosswalk.x);
            const dz = Math.abs(position.z - crosswalk.z);
            if (dx < crosswalk.width / 2 && dz < crosswalk.length / 2) {
                return true;
            }
        }
        return false;
    }

    findNearestCrosswalk(position) {
        let nearest = null;
        let nearestDistance = Infinity;
        
        for (const crosswalk of this.crosswalks) {
            const distance = this.getDistance2D(position, crosswalk);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = crosswalk;
            }
        }
        
        return nearest;
    }

    calculateBuildingAvoidance(position) {
        let avoidanceX = 0;
        let avoidanceZ = 0;
        
        for (const building of this.buildings) {
            const dx = position.x - building.x;
            const dz = position.z - building.z;
            
            const halfWidth = building.width / 2;
            const halfDepth = building.depth / 2;
            
            // Check if citizen is near building (within influence zone)
            const influenceZone = 1.2; // Reduced influence zone
            if (Math.abs(dx) < halfWidth + influenceZone && Math.abs(dz) < halfDepth + influenceZone) {
                // Calculate gentle repulsion force
                const distanceFromEdgeX = Math.abs(dx) - halfWidth;
                const distanceFromEdgeZ = Math.abs(dz) - halfDepth;
                
                // Only apply force if close to building
                if (distanceFromEdgeX < influenceZone && distanceFromEdgeX > 0) {
                    const forceStrength = Math.max(0, 1 - distanceFromEdgeX / influenceZone);
                    avoidanceX += Math.sign(dx) * forceStrength * 0.8; // Reduced force strength
                }
                
                if (distanceFromEdgeZ < influenceZone && distanceFromEdgeZ > 0) {
                    const forceStrength = Math.max(0, 1 - distanceFromEdgeZ / influenceZone);
                    avoidanceZ += Math.sign(dz) * forceStrength * 0.8; // Reduced force strength
                }
            }
        }
        
        // Add some randomness to break symmetry and prevent loops
        avoidanceX += (Math.random() - 0.5) * 0.1;
        avoidanceZ += (Math.random() - 0.5) * 0.1;
        
        return { x: avoidanceX, z: avoidanceZ };
    }

    isStuckInLoop(citizen) {
        const userData = citizen.userData;
        
        // Only check every 30 frames to avoid excessive computation
        if (userData.stateTimer - userData.lastPositionCheck < 30) {
            return false;
        }
        
        userData.lastPositionCheck = userData.stateTimer;
        
        // Record current position
        userData.positionHistory.push({
            x: citizen.position.x,
            z: citizen.position.z,
            time: userData.stateTimer
        });
        
        // Keep only recent history (last 5 seconds worth)
        userData.positionHistory = userData.positionHistory.filter(
            pos => userData.stateTimer - pos.time < 150
        );
        
        // Need at least 4 position samples to detect loops
        if (userData.positionHistory.length < 4) {
            return false;
        }
        
        // Check if citizen has been in roughly the same area
        const recent = userData.positionHistory[userData.positionHistory.length - 1];
        const older = userData.positionHistory[0];
        
        const distance = Math.sqrt(
            Math.pow(recent.x - older.x, 2) + Math.pow(recent.z - older.z, 2)
        );
        
        // If citizen hasn't moved much over time, they're probably stuck
        const timeSpan = recent.time - older.time;
        const expectedDistance = userData.speed * timeSpan * 0.5; // Should have moved at least half expected distance
        
        // Don't trigger too frequently
        const timeSinceLastBreakout = userData.stateTimer - (userData.lastBreakout || 0);
        
        return distance < expectedDistance && distance < 2 && timeSinceLastBreakout > 200;
    }

    updateSocietyStatus(themeName) {
        const statusElement = document.querySelector('.society-status');
        if (statusElement) {
            statusElement.textContent = `Society Type: ${themeName}`;
        }
    }

    startRenderLoop() {
        let frameCount = 0;
        const render = () => {
            if (!this.isInitialized) {
                console.warn('Render loop called but not initialized');
                return;
            }
            
            // Update citizens
            this.updateCitizenAnimations();
            
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
            
            // Occasional logging for debugging
            frameCount++;
            if (frameCount === 300) { // Every 5 seconds instead of every second
                console.log('Render loop active - Scene objects:', this.scene.children.length);
                frameCount = 0;
            }
        };
        render();
        console.log('Render loop started');
    }

    handleResize() {
        if (!this.isInitialized) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    initFallback2D() {
        // Fallback 2D visualization for devices without WebGL
        this.container.innerHTML = `
            <div class="society-2d-fallback">
                <div class="society-grid">
                    <div class="district residential">🏘️ Residential</div>
                    <div class="district commercial">🏬 Commercial</div>
                    <div class="district government">🏛️ Government</div>
                    <div class="district industrial">🏭 Industrial</div>
                    <div class="district nature">🌳 Nature</div>
                    <div class="district government">🏛️ Central Plaza</div>
                </div>
                <p class="fallback-notice">3D visualization not available - using simplified view</p>
                <p class="fallback-notice">Your society will still evolve based on your political decisions!</p>
            </div>
        `;
        
        this.isInitialized = true;
        console.log('Society visualization using 2D fallback');
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        this.isInitialized = false;
        console.log('Society visualization destroyed');
    }
}

// Export for use in main game
export { SocietyVisualization }; 