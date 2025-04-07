/**
 * Studyguide Core - Kärnfunktionalitet för interaktiva studiehandböcker
 * Hanterar navigation, achievement-system och grundläggande studiefunktioner
 */

// Global variable to store the current guide ID
let currentGuideId = null;

// Spårar vilka sektioner som har besökts (per guide)
let visitedSections = {}; // Changed to object to hold multiple guides
let achievementsEarned = {}; // Changed to object to hold multiple guides
let newlyUnlockedAchievementsBatch = []; // Batch for current event (reset per quiz)

// Define Achievement Data
const achievementsData = [
    {
        id: 'explorer',
        name: 'Kunskapssökaren',
        description: 'Besök alla avsnitt i studiehandledningen',
        icon: '🧭',
        secret: false
    },
    {
        id: 'quiz-taker',
        name: 'Testpilot',
        description: 'Genomför ett quizförsök',
        icon: '📝',
        secret: false
    },
    {
        id: 'quiz-master',
        name: 'Quizmästaren',
        description: 'Få 100% rätt på quizet',
        icon: '🏆',
        secret: false
    },
    {
        id: 'speed-demon',
        name: 'Snabbtänkaren',
        description: 'Slutför quizet på under 3 minuter (min 80% rätt)',
        icon: '⚡',
        secret: false
    },
    {
        id: 'lightning',
        name: 'Blixten',
        description: 'Slutför quizet på under 2 minuter (min 80% rätt)',
        icon: '⚡⚡',
        secret: false
    },
    {
        id: 'light-speed',
        name: 'Ljusets hastighet',
        description: 'Slutför quizet på under 1 minut (min 80% rätt)',
        icon: '🚀',
        secret: false
    },
    {
        id: 'perfect-score',
        name: 'Perfekt Poäng',
        description: 'Få maximala 1000 poäng på quizet',
        icon: '💯',
        secret: false
    },
    {
        id: 'the-crazy-banana',
        name: 'The Crazy Banana',
        description: 'Få perfekt poäng (1000p) på Crazy Bananas!-svårighetsgrad.',
        icon: '👑🍌',
        secret: true
    }
    // Add more achievements here later if needed
];

/**
 * Genererar nyckel för localStorage baserat på guideId.
 * @param {string} baseKey - Grundnyckeln (t.ex. 'visitedSections').
 * @returns {string} - Den guide-specifika nyckeln.
 */
function getStorageKey(baseKey) {
    if (!currentGuideId) {
        console.error("Guide ID not set. Cannot generate storage key.");
        return baseKey; // Fallback, men bör inte hända
    }
    return `${currentGuideId}_${baseKey}`;
}

/**
 * Genererar HTML för achievement-listan och infogar den på sidan.
 * @param {string} containerId - ID för containerelementet där listan ska infogas.
 */
function renderAchievements(containerId = 'achievements-list') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Achievement container with ID '${containerId}' not found.`);
        return;
    }

    let achievementsHTML = '';
    achievementsData
        .filter(ach => !ach.secret) // Only render non-secret achievements initially
        .forEach(ach => {
        achievementsHTML += `
            <div class="achievement" id="${ach.id}" data-name="${ach.name}">
                <div class="achievement-icon">${ach.icon}</div>
                <h3>${ach.name}</h3>
                <p>${ach.description}</p>
                <div class="locked-overlay">🔒</div>
            </div>
        `;
    });

    container.innerHTML = achievementsHTML;
    console.log('Achievements rendered into container:', containerId); // DEBUG
}

/**
 * Laddar och visar redan upplåsta prestationer för aktuell guide.
 */
function loadAchievements() {
    const container = document.getElementById('achievements-list');
    if (!container) {
        console.error('Cannot load achievements, container #achievements-list not found.');
        return;
    }

    const currentAchievements = achievementsEarned[currentGuideId] || []; // Hämta för aktuell guide

    currentAchievements.forEach(id => {
        let achievementElement = document.getElementById(id);
        const achievementData = achievementsData.find(ach => ach.id === id);

        // If it's secret and not in DOM, add it now
        if (achievementData && achievementData.secret && !achievementElement) {
             const newElementHTML = `
                <div class="achievement" id="${achievementData.id}" data-name="${achievementData.name}">
                    <div class="achievement-icon">${achievementData.icon}</div>
                    <h3>${achievementData.name}</h3>
                    <p>${achievementData.description}</p>
                    <div class="locked-overlay" style="display: none;">🔒</div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', newElementHTML);
            achievementElement = document.getElementById(id); // Re-fetch the element
            console.log(`Previously unlocked secret achievement ${id} added to DOM on load.`);
        }

        // Apply unlocked style if the element exists (either initially or just added)
        if (achievementElement) {
            const lockOverlay = achievementElement.querySelector('.locked-overlay');
            if (lockOverlay) {
                lockOverlay.style.display = 'none';
            }
            achievementElement.classList.add('unlocked');
        }
    });
}

/**
 * Visar en notifikation när en prestation låses upp
 * @param {string} id - Prestations-ID
 */
function showAchievementNotification(id) {
    const achievement = document.getElementById(id);
    if (!achievement) return;
    
    const name = achievement.getAttribute('data-name');
    const originalIcon = achievement.querySelector('.achievement-icon')?.textContent || '🏆'; // Get icon from original element or default
    
    // --- Create and show the dynamic popup/badge --- 
    const popupElement = document.createElement('div'); // Creates a NEW div
    popupElement.className = 'achievement-popup'; // Assign the CLASS 'achievement-popup' for golden plaque style
    popupElement.innerHTML = `
        <div class="icon">${originalIcon}</div>
        <h3>Prestation upplåst!</h3>
        <p>${name}</p>
    `;
    document.body.appendChild(popupElement); // Adds it to the page body
    
    // Show popup with a slight delay for animation
    setTimeout(() => {
        popupElement.classList.add('show'); // Adds 'show' class to trigger animation
    }, 100);
    
    // Remove popup after 5 seconds
    setTimeout(() => {
        popupElement.classList.remove('show'); // Remove 'show' class to trigger hide animation
        // Wait for animation to finish before removing element
        popupElement.addEventListener('transitionend', () => {
            if (document.body.contains(popupElement)) { // Check if it wasn't already removed
                document.body.removeChild(popupElement); // Removes the element entirely
            }
        }, { once: true }); 
        // Fallback removal in case transitionend doesn't fire (e.g., display:none)
        setTimeout(() => {
             if (document.body.contains(popupElement)) { 
                document.body.removeChild(popupElement); 
            }
        }, 1000); // Should be longer than CSS transition
    }, 5000);
}

/**
 * Visar en notifikation för en batch av upplåsta prestationer.
 * @param {Array<string>} batchIds - En lista med ID:n för nyligen upplåsta prestationer.
 * @param {boolean} isNewOverallBestTime - Om ett nytt bästa tid-rekord sattes.
 * @param {boolean} isNewBestScoreRecord - Om ett nytt bästa poäng-rekord sattes.
 */
function showBatchedAchievementNotifications(batchIds, isNewOverallBestTime = false, isNewBestScoreRecord = false) {
    const hasAchievements = batchIds && batchIds.length > 0;
    const hasNewRecord = isNewOverallBestTime || isNewBestScoreRecord;

    if (!hasAchievements && !hasNewRecord) {
        return; // Inget att visa
    }

    let popupContentHTML = '';
    let achievementCount = 0;

    // --- Del 1: Prestationer ---
    if (hasAchievements) {
        const achievementsToShow = achievementsData.filter(ach => batchIds.includes(ach.id));
        achievementCount = achievementsToShow.length;
        if (achievementCount > 0) {
            if (achievementCount === 1) {
                popupContentHTML += `
                    <div class="icon">${achievementsToShow[0].icon}</div>
                    <h3>Prestation upplåst!</h3>
                    <p>${achievementsToShow[0].name}</p>
                `;
            } else {
                popupContentHTML += `<h3>Prestationer upplåsta!</h3><div class="multi-achievement-list">`;
                achievementsToShow.forEach(ach => {
                    popupContentHTML += `<p><span class="icon">${ach.icon}</span> ${ach.name}</p>`;
                });
                popupContentHTML += `</div>`;
            }
        }
    }

    // --- Del 2: Nya Rekord ---
    if (hasNewRecord) {
        if (hasAchievements) {
            popupContentHTML += '<hr class="popup-divider">'; // Separator
        }
        popupContentHTML += '<div class="new-record-section">';
        popupContentHTML += '<h4>Nytt Rekord!</h4>';
        if (isNewBestScoreRecord) {
            popupContentHTML += '<p><span class="icon">📈</span> Bästa Poäng!</p>';
        }
        if (isNewOverallBestTime) {
            popupContentHTML += '<p><span class="icon">⏱️</span> Snabbaste Tiden!</p>';
        }
        popupContentHTML += '</div>';
    }

    // --- Skapa och visa den dynamiska popupen --- 
    const popupElement = document.createElement('div');
    popupElement.className = 'achievement-popup'; // Använd samma klass för styling
    popupElement.innerHTML = popupContentHTML;
    document.body.appendChild(popupElement);

    // Visa popup med en liten fördröjning för animation
    setTimeout(() => {
        popupElement.classList.add('show');
    }, 100);

    // Ta bort popup - justerad tid
    const baseDuration = 3000;
    const achievementBonusTime = achievementCount * 500;
    const recordBonusTime = hasNewRecord ? 1000 : 0; // Extra tid för rekordsektion
    const displayDuration = baseDuration + achievementBonusTime + recordBonusTime;
    
    setTimeout(() => {
        popupElement.classList.remove('show');
        popupElement.addEventListener('transitionend', () => {
            if (document.body.contains(popupElement)) {
                document.body.removeChild(popupElement);
            }
        }, { once: true });
        setTimeout(() => {
             if (document.body.contains(popupElement)) { 
                document.body.removeChild(popupElement); 
            }
        }, 1000); // Fallback
    }, displayDuration);
}

/**
 * Lås upp prestation om det inte redan är upplåst för aktuell guide.
 * @param {string} id - Prestations-ID
 */
function unlockAchievement(id) {
    // Initialize if guide data doesn't exist
    if (!achievementsEarned[currentGuideId]) {
        achievementsEarned[currentGuideId] = [];
    }

    if (!achievementsEarned[currentGuideId].includes(id)) {
        // Find achievement data
        const achievementData = achievementsData.find(ach => ach.id === id);
        if (!achievementData) {
            console.warn(`Tried to unlock unknown achievement: ${id}`);
            return;
        }

        achievementsEarned[currentGuideId].push(id);
        localStorage.setItem(getStorageKey('achievementsEarned'), JSON.stringify(achievementsEarned[currentGuideId]));
        
        let achievementElement = document.getElementById(id);
        
        // If it's secret and doesn't exist in DOM yet, create and append it
        if (achievementData.secret && !achievementElement) {
            const container = document.getElementById('achievements-list'); // Assuming this ID exists
            if (container) {
                const newElementHTML = `
                    <div class="achievement" id="${achievementData.id}" data-name="${achievementData.name}">
                        <div class="achievement-icon">${achievementData.icon}</div>
                        <h3>${achievementData.name}</h3>
                        <p>${achievementData.description}</p>
                        <div class="locked-overlay" style="display: none;">🔒</div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', newElementHTML);
                achievementElement = document.getElementById(id); // Get the newly added element
                console.log(`Secret achievement ${id} added to DOM.`);
            } else {
                console.error('Cannot add secret achievement, container #achievements-list not found.');
            }
        }
        
        // Apply unlocking styles/animation if element exists (or was just added)
        if (achievementElement) {
            const lockOverlay = achievementElement.querySelector('.locked-overlay');
            if (lockOverlay) {
                lockOverlay.style.display = 'none';
            }
            achievementElement.classList.add('unlocked');
            achievementElement.classList.add('unlocking');
            
            setTimeout(() => {
                achievementElement.classList.remove('unlocking');
            }, 1000);
        } else if (!achievementData.secret) {
             // Log error only if it was NOT a secret achievement that failed to be added
             console.error(`Could not find non-secret achievement element with ID ${id} to unlock.`);
        }
        
        // Add to notification batch
        if (!newlyUnlockedAchievementsBatch.includes(id)) {
             newlyUnlockedAchievementsBatch.push(id);
        }
    }
}

/**
 * Kontrollera om användaren har besökt alla sektioner för aktuell guide och lås upp Explorer-prestationen om så är fallet
 * @param {Array} requiredSections - Lista med obligatoriska sektionsnamn
 */
function checkExplorerAchievement(requiredSections) {
    const currentVisited = visitedSections[currentGuideId] || []; // Hämta för aktuell guide
    const allVisited = requiredSections.every(section => currentVisited.includes(section));

    if (allVisited) {
        unlockAchievement('explorer');
    }
}

/**
 * Function to create SVG dots for vertical timelines
 * Finds all elements with the class '.timeline' and attempts to draw dots.
 */
function createVerticalTimelineDots() {
    console.log('Attempting to create vertical timeline dots...'); // Debug Log
    const timelines = document.querySelectorAll('.timeline'); // Select all vertical timelines by class

    if (timelines.length === 0) {
        console.log('No elements with class ".timeline" found.'); // Debug Log
        return;
    }

    timelines.forEach((timeline, index) => {
        const svg = timeline.querySelector('.timeline-dots-svg');
        const events = timeline.querySelectorAll('.timeline-event');
        console.log(`Processing timeline ${index + 1}: Found SVG? ${!!svg}, Found Events? ${events.length}`); // Debug Log

        if (!svg || events.length < 2) {
            console.log(`Skipping timeline ${index + 1} - SVG container or not enough events found.`);
            return; // Skip this timeline if prerequisites aren't met
        }

        // Clear existing SVG content
        svg.innerHTML = '';

        // Set SVG height dynamically based on the timeline's scroll height
        // Use offsetHeight as a fallback if scrollHeight is 0
        const timelineHeight = timeline.scrollHeight > 0 ? timeline.scrollHeight : timeline.offsetHeight;
        svg.setAttribute('viewBox', `0 0 ${timeline.offsetWidth} ${timelineHeight}`);
        svg.style.height = `${timelineHeight}px`;
        const svgHeight = timelineHeight;
        const svgWidth = timeline.offsetWidth;
        console.log(`Timeline ${index + 1} dimensions: Width=${svgWidth}, Height=${svgHeight}`); // Debug Log

        if (svgHeight <= 0 || svgWidth <= 0) {
             console.log(`Skipping timeline ${index + 1} due to zero dimensions.`);
             return;
        }

        // --- Draw the main vertical line --- 
        /* // Temporarily remove the straight line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const lineX = svgWidth / 2;
        line.setAttribute('x1', lineX);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', lineX);
        line.setAttribute('y2', svgHeight);
        svg.appendChild(line);
        */

        // --- Sine Wave Parameters for Dot Positioning ---
        const waveAmplitude = 10; // Max horizontal deviation (pixels)
        const waveFrequency = 0.03; // Adjust for more/fewer wiggles (radians per pixel)

        // --- Calculate marker positions and draw dots between them --- 
        const markerYPositions = [];
        events.forEach((event, eventIndex) => {
            const markerElement = event; // Use the event element itself for positioning
            const markerStyle = window.getComputedStyle(markerElement, '::after');
            const markerTopOffset = parseFloat(markerStyle.top) || 20; // From CSS

            // Calculate visual height including border
            const markerHeight = parseFloat(markerStyle.height) || 16;
            const markerBorderTop = parseFloat(markerStyle.borderTopWidth) || 4;
            const markerBorderBottom = parseFloat(markerStyle.borderBottomWidth) || 4;
            const visualMarkerHeight = markerHeight + markerBorderTop + markerBorderBottom;

            const markerCenterY = markerElement.offsetTop + markerTopOffset + (visualMarkerHeight / 2);

            markerYPositions.push(markerCenterY);
            console.log(`Timeline ${index + 1}, Event ${eventIndex}: offsetTop=${markerElement.offsetTop}, markerCenterY=${markerCenterY.toFixed(2)}`); // Debug Log
        });

        // Draw dots between markers
        for (let i = 0; i < markerYPositions.length - 1; i++) {
            const yStart = markerYPositions[i];
            const yEnd = markerYPositions[i + 1];
            const distance = yEnd - yStart;
            console.log(`Timeline ${index + 1}, Segment ${i}: yStart=${yStart}, yEnd=${yEnd}, distance=${distance}`); // Debug Log

            if (distance <= 40) continue; // Increase threshold slightly

            const numDots = Math.max(1, Math.floor(distance / 25)); // INCREASED density (smaller divisor = more dots)
            const spacing = distance / (numDots + 1);

            for (let j = 1; j <= numDots; j++) {
                const dotY = yStart + j * spacing;
                // Calculate horizontal position based on sine wave
                const dotX = svgWidth / 2 + waveAmplitude * Math.sin(dotY * waveFrequency);

                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', dotX); // Use calculated X
                dot.setAttribute('cy', dotY);
                dot.setAttribute('class', 'timeline-dot');
                dot.setAttribute('r', '3');
                svg.appendChild(dot);
                console.log(`Timeline ${index + 1}, Segment ${i}, Dot ${j}: Added at x=${dotX.toFixed(2)}, y=${dotY.toFixed(2)}`); // Updated Log
            }
        }
    });
}

/**
 * Initialisera studiehandbok med navigation och sektionshantering
 * @param {Object} options - Konfigurationsalternativ (inklusive guideId)
 */
function initStudyGuide(userConfig) {
    const defaultOptions = {
        guideId: 'default', // Lägg till default guideId
        requiredSections: [],
        sectionQuestions: true
    };

    const config = { ...defaultOptions, ...userConfig };

    if (!config.guideId) {
        console.error("Fatal: guideId must be provided in initStudyGuide options!");
        return;
    }
    currentGuideId = config.guideId; // Sätt global guideId

    // Ladda guide-specifik data från localStorage
    visitedSections[currentGuideId] = JSON.parse(localStorage.getItem(getStorageKey('visitedSections')) || '[]');
    achievementsEarned[currentGuideId] = JSON.parse(localStorage.getItem(getStorageKey('achievementsEarned')) || '[]');

    // Render achievement list first
    renderAchievements(); // Uses default ID 'achievements-list'
    
    // Ladda prestationer och bästa tid
    loadAchievements();
    updateProgressDisplay();
    
    // Rörelser mellan sektioner
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Kontrollera om vi är i ett aktivt quiz och fråga användaren om bekräftelse
            if (window.quizInProgress && this.getAttribute('data-section') !== 'quiz') {
                if (!confirm('Vill du avbryta pågående quiz? Dina svar kommer att förloras.')) {
                    return;
                }
                // Avsluta quizet om användaren lämnar quiz-sektionen
                if (typeof window.endQuiz === 'function') {
                    window.endQuiz();
                }
            }
            
            // Aktiv navigation
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Visa motsvarande sektion
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.classList.remove('active'));
            
            const targetSectionId = this.getAttribute('data-section');
            const targetSectionElement = document.getElementById(targetSectionId);
            if(targetSectionElement) targetSectionElement.classList.add('active', 'animated');
            
            // --- UI Reset Logic for Quiz Section ---
            const quizStart = document.getElementById('quiz-start');
            const quizProgress = document.getElementById('quiz-progress');
            const quizQuestions = document.getElementById('quiz-questions');
            const quizResult = document.getElementById('quiz-result');
            const quizAnswers = document.getElementById('quiz-answers'); // Dynamic answers div

            if (targetSectionId === 'quiz') {
                // When navigating TO the quiz, ensure only start is visible initially
                if(quizStart) quizStart.style.display = 'block';
                if(quizProgress) quizProgress.style.display = 'none';
                if(quizQuestions) quizQuestions.style.display = 'none';
                if(quizResult) quizResult.style.display = 'none';
                if(quizAnswers) quizAnswers.remove(); // Remove dynamically added answers
                
                // Ensure quiz state is reset if navigated away previously
                if (typeof window.endQuiz === 'function') { 
                     window.endQuiz(); // Call endQuiz without showing results to reset state
                }
                
            } else {
                // When navigating AWAY from quiz, hide floating status (already handled below)
            }
            // --- End UI Reset Logic ---
            
            // Registrera besök om inte redan registrerat för denna guide
            if (!visitedSections[currentGuideId]) {
                visitedSections[currentGuideId] = []; // Initialize if needed
            }
            if (!visitedSections[currentGuideId].includes(targetSectionId)) {
                visitedSections[currentGuideId].push(targetSectionId);
                localStorage.setItem(getStorageKey('visitedSections'), JSON.stringify(visitedSections[currentGuideId]));
                
                // Kontrollera Explorer achievement
                checkExplorerAchievement(config.requiredSections);
            }
            
            // Dölj quiz-status om man navigerar bort från quiz
            if (targetSectionId !== 'quiz') {
                const floatingStatus = document.getElementById('quiz-status-floating');
                if (floatingStatus) {
                    floatingStatus.style.display = 'none';
                }
            }
            
            // Ladda sektionsfrågor om aktiverat
            if (config.sectionQuestions && targetSectionId !== 'quiz' && targetSectionId !== 'intro') {
                loadSectionQuestions(targetSectionId);
            }

            // **NEW:** Call dot creation AFTER section is made visible
            // Use a minimal timeout to allow rendering engine to catch up
            setTimeout(createVerticalTimelineDots, 10); 
        });
    });
    
    // Initial setup
    const initialSection = document.querySelector('.section.active');
    if (initialSection) {
         visitedSections[currentGuideId].push(initialSection.id);
         // **NEW:** Call dot creation for initially active section
         setTimeout(createVerticalTimelineDots, 100); // Longer timeout on initial load
    }

    // Koppling av Quiz-startknapp om den finns
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            // Rensa achievement-batch innan quiz startar
            newlyUnlockedAchievementsBatch = [];
            // Call initializeQuiz, passing our results handler and guideId
            if (typeof window.initializeQuiz === 'function') {
                window.initializeQuiz({ 
                    onComplete: displayQuizResults, 
                    guideId: currentGuideId // Skicka med guideId
                }); 
            } else {
                console.error("initializeQuiz function not found!");
            }
        });
    }
}

/**
 * Uppdaterar visningen av bästa tid och bästa resultat på sidan.
 */
function updateProgressDisplay() {
    // --- Best Time Logic (Quiz Section - uses guide-specific key) ---
    const bestTimeDisplayQuiz = document.getElementById('best-time-display');
    const savedBestTime = localStorage.getItem(getStorageKey('bestTime')); // Använd guide-specifik nyckel
    if (bestTimeDisplayQuiz) {
        if (savedBestTime) {
            const minutes = Math.floor(savedBestTime / 60);
            const seconds = savedBestTime % 60;
            bestTimeDisplayQuiz.textContent = `Ditt snabbaste resultat: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            bestTimeDisplayQuiz.textContent = 'Ditt snabbaste resultat: Inte satt än';
        }
    }
    
    // --- Best Score Record Logic (Intro Section - uses guide-specific key) ---
    const bestScoreCorrectEl = document.getElementById('best-score-correct');
    const bestScoreTimeEl = document.getElementById('best-score-time');
    const bestScorePointsEl = document.getElementById('best-score-points');
    
    const savedBestScoreRecord = localStorage.getItem(getStorageKey('bestScoreRecord')); // Använd guide-specifik nyckel
    
    if (savedBestScoreRecord && bestScoreCorrectEl && bestScoreTimeEl && bestScorePointsEl) {
        try {
            const record = JSON.parse(savedBestScoreRecord);
            const correct = record.correct || 0;
            const time = record.time || 0;
            
            // Calculate Score (using the same logic as in interactive-quiz.js)
            const maxScore = 1000;
            const targetTime = 60; // Target time in seconds for max points
            const timePenaltyWeight = 5; 
            const totalQuestions = 15; // Assume standard 15 questions for intro display
            
            const timeOver = Math.max(0, time - targetTime);
            const timePenaltyEquiv = (timeOver / 60) * timePenaltyWeight;
            const effectiveCorrect = Math.max(0, correct - timePenaltyEquiv);
            const score = Math.round(maxScore * (effectiveCorrect / totalQuestions));
            
            // Format Time
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            // Update Elements
            bestScoreCorrectEl.textContent = `${correct} / ${totalQuestions}`;
            bestScoreTimeEl.textContent = formattedTime;
            bestScorePointsEl.textContent = `${score} / ${maxScore}`;
            
        } catch (e) {
            console.error("Error parsing bestScoreRecord:", e);
            // Display default text if parsing fails
            bestScoreCorrectEl.textContent = '--';
            bestScoreTimeEl.textContent = '--:--';
            bestScorePointsEl.textContent = '----';
        }
    } else if (bestScoreCorrectEl && bestScoreTimeEl && bestScorePointsEl) {
        // Display default text if no record or elements not found
        bestScoreCorrectEl.textContent = '--';
        bestScoreTimeEl.textContent = '--:--';
        bestScorePointsEl.textContent = '----';
    }
    
    // Keep the old best-time div update for backward compatibility or if still used elsewhere
    const bestTimeDiv = document.getElementById('best-time'); // This ID seems deprecated/unused in HTML? Keep logic for safety.
     if (bestTimeDiv) {
         if (savedBestTime) { // Use already fetched guide-specific time
             const minutes = Math.floor(savedBestTime / 60);
             const seconds = savedBestTime % 60;
             bestTimeDiv.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
         } else {
             bestTimeDiv.textContent = 'Inte satt än';
         }
     }
}

/**
 * Ladda och visa frågor för en specifik sektion
 * @param {string} sectionId - ID för sektionen
 */
function loadSectionQuestions(sectionId) {
    const questionsContainer = document.getElementById(`${sectionId}-questions`);
    if (!questionsContainer) return;
    
    // Kontrollera om vi har frågor för denna sektion
    if (typeof window.questionsDB !== 'undefined' && window.questionsDB[sectionId]) {
        const questions = window.questionsDB[sectionId];
        
        let html = '';
        questions.forEach((q, i) => {
            html += `
                <div class="question">
                    <h4>${i + 1}. ${q.question}</h4>
                    <div class="options">
                        ${q.options.map((option, j) => `
                            <div class="option" data-question="${i}" data-option="${j}" data-correct="${j === q.correctIndex}" onclick="selectSectionAnswer('${sectionId}', ${i}, ${j}, ${j === q.correctIndex})">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        questionsContainer.innerHTML = html;
    }
}

/**
 * Hanterar val av svar på sektionsfrågor
 * @param {string} section - Sektionsnamn
 * @param {number} questionIndex - Frågans index
 * @param {number} optionIndex - Valt svarsalternativs index
 * @param {boolean} isCorrect - Om valet är korrekt
 */
function selectSectionAnswer(section, questionIndex, optionIndex, isCorrect) {
    const options = document.querySelectorAll(`#${section}-questions .question:nth-child(${questionIndex + 1}) .option`);
    
    options.forEach((option, index) => {
        option.classList.remove('selected', 'correct', 'wrong');
        
        if (index === optionIndex) {
            option.classList.add('selected');
            option.classList.add(isCorrect ? 'correct' : 'wrong');
        } else if (index === window.questionsDB[section][questionIndex].correctIndex && !isCorrect) {
            option.classList.add('correct');
        }
    });
}

/**
 * Display quiz results
 * @param {Object} results - Quiz results object
 */
function displayQuizResults(results) {
    console.log("displayQuizResults (core callback) called with:", results); // DEBUG
    
    // --- Unlock Achievement: Quiz Taker ---
    unlockAchievement('quiz-taker'); // Unlock for simply completing the quiz
    
    // --- Kontrollera prestationer --- 
    const percentage = results.totalQuestions > 0 ? Math.round((results.correctAnswers / results.totalQuestions) * 100) : 0;
    
    // Quizmästaren (100% rätt)
    if (percentage === 100) {
        unlockAchievement('quiz-master');
    }
    
    // Perfekt Poäng (1000p)
    const targetTime = 60; 
    const isPerfectScore = (percentage === 100 && results.timeElapsed <= targetTime);
    if (isPerfectScore) {
        unlockAchievement('perfect-score');
    }
    
    // The Crazy Banana (1000p on Crazy difficulty)
    if (isPerfectScore && results.difficulty === 'crazy') {
        unlockAchievement('the-crazy-banana');
    }

    // Tidsbaserade prestationer (Require >= 80% correct)
    if (results.timeElapsed < 60 && percentage >= 80) { // Under 1 minut AND >= 80%
        unlockAchievement('light-speed');
        unlockAchievement('lightning'); // Om man klarar 1 min, klarar man 2 och 3 också
        unlockAchievement('speed-demon');
    } else if (results.timeElapsed < 120 && percentage >= 80) { // Under 2 minuter AND >= 80%
        unlockAchievement('lightning');
        unlockAchievement('speed-demon');
    } else if (results.timeElapsed < 180 && percentage >= 80) { // Under 3 minuter AND >= 80%
        unlockAchievement('speed-demon');
    }
    
    // Uppdatera bästa tid om det är ett nytt rekord (hanteras redan i endQuiz, men kan dubbelkollas/visas här)
    updateProgressDisplay(); 
    
    // --- Visa alla nyligen upplåsta prestationer från batchen ---
    // Extrahera record-flaggor från resultatobjektet
    const { isNewOverallBestTime, isNewBestScoreRecord } = results;
    showBatchedAchievementNotifications(newlyUnlockedAchievementsBatch, isNewOverallBestTime, isNewBestScoreRecord);
    newlyUnlockedAchievementsBatch = []; // Rensa batchen
}

// Exportera funktioner för global användning
window.initStudyGuide = initStudyGuide;
window.loadSectionQuestions = loadSectionQuestions;
window.selectSectionAnswer = selectSectionAnswer;
window.unlockAchievement = unlockAchievement;
window.updateProgressDisplay = updateProgressDisplay;

// Keep the resize listener
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createVerticalTimelineDots, 250); // Debounce resize event
});
