/**
 * Studyguide Core - Kärnfunktionalitet för interaktiva studiehandböcker
 * Hanterar navigation, achievement-system och grundläggande studiefunktioner
 */

// Spårar vilka sektioner som har besökts
let visitedSections = JSON.parse(localStorage.getItem('visitedSections') || '[]');
let achievementsEarned = JSON.parse(localStorage.getItem('achievementsEarned') || '[]');

/**
 * Laddar och visar redan upplåsta prestationer
 */
function loadAchievements() {
    achievementsEarned.forEach(id => {
        const achievementElement = document.getElementById(id);
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
    
    // Uppdatera popup-innehållet
    document.getElementById('achievement-name').textContent = name;
    
    // Visa popup
    const popup = document.getElementById('achievement-popup');
    popup.style.display = 'block';
    
    // Ändra popup-ikon baserat på prestationstyp
    const iconElement = popup.querySelector('.icon');
    if (id === 'explorer') {
        iconElement.textContent = '🧭';
    } else if (id === 'quiz-master') {
        iconElement.textContent = '🏆';
    } else if (id === 'speed-demon') {
        iconElement.textContent = '⚡';
    } else if (id === 'lightning') {
        iconElement.textContent = '⚡⚡';
    } else if (id === 'light-speed') {
        iconElement.textContent = '🚀';
    }
    
    // Dölj popup efter 3 sekunder
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
    
    // Visa prestation-badge till höger
    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    badge.innerHTML = `<span class="emoji">${iconElement.textContent}</span>${name}`;
    document.body.appendChild(badge);
    
    // Visa badge med en liten fördröjning för animation
    setTimeout(() => {
        badge.classList.add('show');
    }, 100);
    
    // Ta bort badge efter 5 sekunder
    setTimeout(() => {
        badge.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(badge);
        }, 500);
    }, 5000);
}

/**
 * Lås upp prestation om det inte redan är upplåst
 * @param {string} id - Prestations-ID
 */
function unlockAchievement(id) {
    if (!achievementsEarned.includes(id)) {
        achievementsEarned.push(id);
        localStorage.setItem('achievementsEarned', JSON.stringify(achievementsEarned));
        
        const achievementElement = document.getElementById(id);
        if (achievementElement) {
            const lockOverlay = achievementElement.querySelector('.locked-overlay');
            if (lockOverlay) {
                lockOverlay.style.display = 'none';
            }
            achievementElement.classList.add('unlocked');
            achievementElement.classList.add('unlocking');
            
            // Ta bort animationsklassen efter att animationen slutförts
            setTimeout(() => {
                achievementElement.classList.remove('unlocking');
            }, 1000);
        }
        
        showAchievementNotification(id);
    }
}

/**
 * Kontrollera om användaren har besökt alla sektioner och lås upp Explorer-prestationen om så är fallet
 * @param {Array} requiredSections - Lista med obligatoriska sektionsnamn
 */
function checkExplorerAchievement(requiredSections) {
    const allVisited = requiredSections.every(section => visitedSections.includes(section));
    
    if (allVisited) {
        unlockAchievement('explorer');
    }
}

/**
 * Initialisera studiehandbok med navigation och sektionshantering
 * @param {Object} options - Konfigurationsalternativ
 */
function initStudyGuide(options = {}) {
    const defaultOptions = {
        requiredSections: ['vetenskap', 'psykisk', 'somn', 'fysisk', 'droger'],
        sectionQuestions: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    // Ladda prestationer och bästa tid
    loadAchievements();
    updateBestTimeDisplay();
    
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
            
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active', 'animated');
            
            // Registrera besök om inte redan registrerat
            if (!visitedSections.includes(targetSection)) {
                visitedSections.push(targetSection);
                localStorage.setItem('visitedSections', JSON.stringify(visitedSections));
                
                // Kontrollera Explorer achievement
                checkExplorerAchievement(config.requiredSections);
            }
            
            // Dölj quiz-status om man navigerar bort från quiz
            if (targetSection !== 'quiz') {
                const floatingStatus = document.getElementById('quiz-status-floating');
                if (floatingStatus) {
                    floatingStatus.style.display = 'none';
                }
            }
            
            // Ladda sektionsfrågor om aktiverat
            if (config.sectionQuestions && targetSection !== 'quiz' && targetSection !== 'intro') {
                loadSectionQuestions(targetSection);
            }
        });
    });
    
    // Ladda sektionsfrågor för första aktiva sektionen om det behövs
    const activeSection = document.querySelector('.section.active');
    if (activeSection && config.sectionQuestions && activeSection.id !== 'quiz' && activeSection.id !== 'intro') {
        loadSectionQuestions(activeSection.id);
    }
    
    // Koppling av Quiz-startknapp om den finns
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            if (typeof window.startQuiz === 'function') {
                window.startQuiz();
            }
        });
    }
}

/**
 * Uppdatera visningen av bästa tid
 */
function updateBestTimeDisplay() {
    const bestTime = localStorage.getItem('bestTime');
    if (bestTime) {
        const time = parseInt(bestTime);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        const bestTimeElement = document.getElementById('best-time');
        if (bestTimeElement) {
            bestTimeElement.textContent = formattedTime;
        }
        
        const bestTimeDisplayElement = document.getElementById('best-time-display');
        if (bestTimeDisplayElement) {
            bestTimeDisplayElement.textContent = `Ditt snabbaste resultat: ${formattedTime}`;
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

// Exportera funktioner för global användning
window.initStudyGuide = initStudyGuide;
window.loadSectionQuestions = loadSectionQuestions;
window.selectSectionAnswer = selectSectionAnswer;
window.unlockAchievement = unlockAchievement;
window.updateBestTimeDisplay = updateBestTimeDisplay;
