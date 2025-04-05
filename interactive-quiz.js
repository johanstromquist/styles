/**
 * Interactive Quiz - Funktionalitet för interaktiva quiz i studiehandböcker
 * Hanterar quizfrågor, timer, progress och resultat
 */

// Quiz status
window.quizInProgress = false;
let quizStartTime = null;
let quizTimerInterval = null;
let quizQuestions = [];
let quizAnswers = {};
let quizConfig = {
    questionsCount: 15
};

/**
 * Startar quizet med given konfiguration
 * @param {Object} config - Konfigurationsalternativ för quizet
 */
function initializeQuiz(config = {}) {
    quizConfig = {
        questionsContainerId: 'quiz-questions',
        timerElementId: 'quiz-timer', 
        floatingTimerId: 'floating-timer',
        progressBarId: 'quiz-progress-bar',
        floatingProgressBarId: 'floating-progress-bar',
        progressTextId: 'quiz-progress-text',
        floatingStatusId: 'floating-status',
        questionsCount: 15,
        onComplete: null,
        ...config
    };
    
    // Dölj startsida och visa quiz
    const startElement = document.getElementById('quiz-start');
    if (startElement) startElement.style.display = 'none';
    
    const resultElement = document.getElementById('quiz-result');
    if (resultElement) resultElement.style.display = 'none';
    
    const progressElement = document.getElementById('quiz-progress');
    if (progressElement) progressElement.style.display = 'block';
    
    // Visa flytande status
    const floatingStatus = document.getElementById('quiz-status-floating');
    if (floatingStatus) floatingStatus.style.display = 'block';
    
    // Starta quizet
    startQuiz();
}

/**
 * Startar ett nytt quiz
 */
function startQuiz() {
    // Reset quiz variables
    quizQuestions = getRandomQuestions(quizConfig.questionsCount);
    quizAnswers = {};
    quizStartTime = new Date().getTime();
    window.quizInProgress = true;
    
    // Reset timer display
    const timerElement = document.getElementById(quizConfig.timerElementId);
    const floatingTimerElement = document.getElementById(quizConfig.floatingTimerId);
    
    if (timerElement) timerElement.textContent = '0:00';
    if (floatingTimerElement) floatingTimerElement.textContent = '0:00';
    
    // Reset progress
    const progressBar = document.getElementById(quizConfig.progressBarId);
    const floatingProgressBar = document.getElementById(quizConfig.floatingProgressBarId);
    
    if (progressBar) progressBar.style.width = '0%';
    if (floatingProgressBar) floatingProgressBar.style.width = '0%';
    
    // Update progress text
    const progressTextElement = document.getElementById(quizConfig.progressTextId);
    const floatingStatusElement = document.getElementById(quizConfig.floatingStatusId);
    
    if (progressTextElement) progressTextElement.textContent = `0 av ${quizQuestions.length} besvarade`;
    if (floatingStatusElement) floatingStatusElement.textContent = `0/${quizQuestions.length} besvarade`;
    
    // Render questions
    renderQuizQuestions();
    
    // Start the timer
    startTimer();
}

/**
 * Avslutar quizet och visar resultat om nödvändigt
 * @param {boolean} showResults - Om resultatet ska visas
 */
function endQuiz(showResults = false) {
    window.quizInProgress = false;
    clearInterval(quizTimerInterval);
    
    // Hide floating status
    const floatingStatus = document.getElementById('quiz-status-floating');
    if (floatingStatus) floatingStatus.style.display = 'none';
    
    if (showResults) {
        // Calculate results
        const totalQuestions = quizQuestions.length;
        const answeredQuestions = Object.keys(quizAnswers).length;
        const correctAnswers = Object.values(quizAnswers).filter(a => a.correct).length;
        
        // Calculate time
        const endTime = new Date().getTime();
        const timeElapsed = Math.floor((endTime - quizStartTime) / 1000);
        
        // Update best time if this is a new record
        if (answeredQuestions === totalQuestions) {
            const currentBestTime = localStorage.getItem('bestTime');
            if (!currentBestTime || timeElapsed < parseInt(currentBestTime)) {
                localStorage.setItem('bestTime', timeElapsed);
                if (typeof window.updateBestTimeDisplay === 'function') {
                    window.updateBestTimeDisplay();
                }
            }
        }
        
        // Call the onComplete callback if provided
        if (typeof quizConfig.onComplete === 'function') {
            quizConfig.onComplete({
                correctAnswers,
                totalQuestions,
                answeredQuestions,
                timeElapsed
            });
        }
    }
}

/**
 * Renderar quizfrågorna i HTML
 */
function renderQuizQuestions() {
    const questionsContainer = document.getElementById(quizConfig.questionsContainerId);
    if (!questionsContainer) return;
    
    let questionsHTML = '';
    quizQuestions.forEach((q, i) => {
        questionsHTML += `
            <div class="question">
                <h4>${i + 1}. ${q.question}</h4>
                <div class="options">
                    ${q.options.map((option, j) => `
                        <div class="option" data-question="${i}" data-option="${j}" data-correct="${j === q.correctIndex}" onclick="selectQuizAnswer(${i}, ${j}, ${j === q.correctIndex})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    questionsContainer.innerHTML = questionsHTML;
    questionsContainer.style.display = 'block';
}

/**
 * Väljer ett svar i quizet
 * @param {number} questionIndex - Frågans index
 * @param {number} optionIndex - Valt svarsalternativs index
 * @param {boolean} isCorrect - Om valet är korrekt
 */
function selectQuizAnswer(questionIndex, optionIndex, isCorrect) {
    quizAnswers[questionIndex] = {
        selected: optionIndex,
        correct: isCorrect
    };
    
    // Update the selected option's appearance
    const options = document.querySelectorAll(`.option[data-question="${questionIndex}"]`);
    options.forEach(option => {
        option.classList.remove('selected');
    });
    options[optionIndex].classList.add('selected');
    
    updateQuizProgress();
}

/**
 * Uppdaterar visningen av quizets framsteg
 */
function updateQuizProgress() {
    const totalQuestions = quizQuestions.length;
    const answered = Object.keys(quizAnswers).length;
    
    // Update progress bar
    const progressBar = document.getElementById(quizConfig.progressBarId);
    const floatingProgressBar = document.getElementById(quizConfig.floatingProgressBarId);
    const progressPercentage = (answered / totalQuestions) * 100;
    
    if (progressBar) progressBar.style.width = `${progressPercentage}%`;
    if (floatingProgressBar) floatingProgressBar.style.width = `${progressPercentage}%`;
    
    // Update progress text
    const progressTextElement = document.getElementById(quizConfig.progressTextId);
    const floatingStatusElement = document.getElementById(quizConfig.floatingStatusId);
    
    if (progressTextElement) progressTextElement.textContent = `${answered} av ${totalQuestions} besvarade`;
    if (floatingStatusElement) floatingStatusElement.textContent = `${answered}/${totalQuestions} besvarade`;
    
    // Check if quiz is complete
    if (answered === totalQuestions) {
        endQuiz(true);
    }
}

/**
 * Startar en timer för quizet
 */
function startTimer() {
    if (quizTimerInterval) {
        clearInterval(quizTimerInterval);
    }
    
    quizTimerInterval = setInterval(() => {
        if (!window.quizInProgress) return;
        
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - quizStartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        
        const timeDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        const timerElement = document.getElementById(quizConfig.timerElementId);
        const floatingTimerElement = document.getElementById(quizConfig.floatingTimerId);
        
        if (timerElement) timerElement.textContent = timeDisplay;
        if (floatingTimerElement) floatingTimerElement.textContent = timeDisplay;
    }, 500);
}

/**
 * Hämtar slumpmässiga frågor från frågedatabasen
 * @param {number} count - Antal frågor att hämta
 * @returns {Array} - Lista med slumpmässiga frågor
 */
function getRandomQuestions(count = 15) {
    // Kontrollera att frågedatabasen finns tillgänglig
    if (typeof window.questionsDB === 'undefined') {
        console.error('Question database not found!');
        return [];
    }
    
    const allQuestions = [];
    
    // Combine all sections' questions
    Object.keys(window.questionsDB).forEach(section => {
        window.questionsDB[section].forEach(q => {
            allQuestions.push({...q, section});
        });
    });
    
    // Shuffle questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    
    // Return the specified count
    return shuffled.slice(0, count);
}

/**
 * Visar de rätta svaren för quizet
 */
function showQuizAnswers() {
    const quizElement = document.getElementById('quiz');
    if (!quizElement) return;
    
    let answersHTML = '<h3>Rätta svar</h3>';
    
    quizQuestions.forEach((q, i) => {
        const userAnswer = quizAnswers[i] ? quizAnswers[i].selected : null;
        const isCorrect = quizAnswers[i] ? quizAnswers[i].correct : false;
        
        answersHTML += `
            <div class="question">
                <h4>${i + 1}. ${q.question}</h4>
                <div class="options">
                    ${q.options.map((option, j) => `
                        <div class="option ${j === q.correctIndex ? 'correct' : ''} ${j === userAnswer && j !== q.correctIndex ? 'wrong' : ''} ${j === userAnswer ? 'selected' : ''}">
                            ${option} ${j === q.correctIndex ? '✓' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    answersHTML += '<button onclick="document.getElementById(\'quiz-result\').style.display = \'block\'; document.getElementById(\'quiz-answers\').style.display = \'none\';">Tillbaka till resultat</button>';
    
    const answersContainer = document.createElement('div');
    answersContainer.id = 'quiz-answers';
    answersContainer.innerHTML = answersHTML;
    
    document.getElementById('quiz-result').style.display = 'none';
    quizElement.appendChild(answersContainer);
}

// Exportera funktioner för global användning
window.initializeQuiz = initializeQuiz;
window.startQuiz = startQuiz;
window.endQuiz = endQuiz;
window.selectQuizAnswer = selectQuizAnswer;
window.showQuizAnswers = showQuizAnswers;
