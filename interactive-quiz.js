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
    questionsCount: 15,
    guideId: 'default' // Add default guideId
};

/**
 * Genererar nyckel för localStorage baserat på guideId.
 * @param {string} baseKey - Grundnyckeln (t.ex. 'bestTime').
 * @returns {string} - Den guide-specifika nyckeln.
 */
function getQuizStorageKey(baseKey) {
    const guideId = quizConfig.guideId || 'default'; // Use guideId from config
    return `${guideId}_${baseKey}`;
}

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
    
    // Kontrollera att guideId finns
    if (!quizConfig.guideId) {
        console.error("Fatal: guideId missing in quiz configuration!");
        quizConfig.guideId = 'default'; // Fallback
    }
    
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
    console.log('startQuiz called'); // DEBUG LOG
    
    // --- Read Difficulty Setting ---
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || 'normal';
    console.log('Difficulty selected:', difficulty); // DEBUG LOG
    quizConfig.difficulty = difficulty; // Store difficulty in config
    // --- End Read Difficulty ---

    // Reset quiz variables
    const rawQuestions = getRandomQuestions(quizConfig.questionsCount);
    quizQuestions = processQuestionsForDifficulty(rawQuestions, difficulty);
    console.log('Processed questions for quiz:', quizQuestions); // DEBUG LOG
    
    if (!quizQuestions || quizQuestions.length === 0) {
        console.error('No questions found!');
        return;
    }
    
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
        
        // --- Check for New Records ---
        let isNewOverallBestTime = false;
        let isNewBestScoreRecord = false;

        // Overall Best Time
        const storageBestTimeKey = getQuizStorageKey('bestTime');
        const currentBestTime = localStorage.getItem(storageBestTimeKey);
        if (!currentBestTime || timeElapsed < parseInt(currentBestTime)) {
            if (answeredQuestions === totalQuestions) { // Only count completed quizzes for best time
                localStorage.setItem(storageBestTimeKey, timeElapsed);
                isNewOverallBestTime = true;
                // Update display immediately if possible (function might be in other file)
                if (typeof window.updateProgressDisplay === 'function') {
                    window.updateProgressDisplay(); // Trigger update in core
                }
            }
        }

        // Best Score Record (Highest correct, tie-break with time)
        const storageBestScoreKey = getQuizStorageKey('bestScoreRecord');
        const currentBestScoreRecord = JSON.parse(localStorage.getItem(storageBestScoreKey) || 'null');
        if (!currentBestScoreRecord || 
            correctAnswers > currentBestScoreRecord.correct || 
            (correctAnswers === currentBestScoreRecord.correct && timeElapsed < currentBestScoreRecord.time))
        {
             if (answeredQuestions === totalQuestions) { // Only count completed quizzes
                localStorage.setItem(storageBestScoreKey, JSON.stringify({ correct: correctAnswers, time: timeElapsed }));
                isNewBestScoreRecord = true;
                // Update display immediately if possible
                if (typeof window.updateProgressDisplay === 'function') {
                    window.updateProgressDisplay(); // Trigger update in core
                }
            }
        }
        // --- End Check for New Records ---
        
        // Call the internal function to render the results UI
        renderQuizResults({ correctAnswers, totalQuestions, timeElapsed });
        
        // Call the external onComplete callback if provided (for achievements etc.)
        if (typeof quizConfig.onComplete === 'function') {
            quizConfig.onComplete({
                correctAnswers,
                totalQuestions,
                answeredQuestions,
                timeElapsed,
                isNewOverallBestTime,
                isNewBestScoreRecord,
                difficulty: quizConfig.difficulty
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
    console.log(`selectQuizAnswer called - Q:${questionIndex}, Option:${optionIndex}`); // Log entry
    
    quizAnswers[questionIndex] = {
        selected: optionIndex,
        correct: isCorrect
    };
    
    // 1. Find all options for the current question
    const options = document.querySelectorAll(`.option[data-question="${questionIndex}"]`);
    console.log(`Found ${options.length} options for Q:${questionIndex}`); // Log found options
    
    // 2. Remove 'selected' from all of them
    options.forEach(option => {
        option.classList.remove('selected');
    });

    // 3. Add 'selected' to the clicked option
    if (options[optionIndex]) { // Check if the target element exists
        console.log('Target option element:', options[optionIndex]); // Log target element
        options[optionIndex].classList.add('selected'); 
        console.log('Classes after adding selected:', options[optionIndex].classList); // Log classes after adding
    } else {
        console.error(`Error: Could not find option element at index ${optionIndex} for question ${questionIndex}`); // Log error if target not found
    }
    
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
 * Preprocessar frågor baserat på vald svårighetsgrad.
 * Normal: Använder de första 4 alternativen.
 * Crazy: Väljer 3 slumpmässiga felaktiga svar + det korrekta, och blandar ordningen.
 * @param {Array} rawQuestions - Lista med råa frågor från databasen (med 6 alternativ).
 * @param {string} difficulty - Vald svårighetsgrad ('normal' or 'crazy').
 * @returns {Array} - Lista med processade frågor redo för rendering (med 4 alternativ).
 */
function processQuestionsForDifficulty(rawQuestions, difficulty) {
    console.log(`Processing ${rawQuestions.length} questions for difficulty: ${difficulty}`);
    return rawQuestions.map(q => {
        if (difficulty === 'crazy') {
            // --- Crazy Bananas Logic ---
            const correctOptionIndex = q.correctIndex;
            const correctOption = q.options[correctOptionIndex];
            
            // Get all incorrect options
            const incorrectOptions = q.options.filter((opt, index) => index !== correctOptionIndex);
            
            // Shuffle incorrect options
            const shuffledIncorrect = [...incorrectOptions].sort(() => 0.5 - Math.random());
            
            // Select 3 incorrect options
            const selectedIncorrect = shuffledIncorrect.slice(0, 3);
            
            // Combine correct + 3 incorrect
            const finalOptions = [correctOption, ...selectedIncorrect];
            
            // Shuffle the final 4 options
            const shuffledFinalOptions = [...finalOptions].sort(() => 0.5 - Math.random());
            
            // Find the new index of the correct option
            const newCorrectIndex = shuffledFinalOptions.findIndex(opt => opt === correctOption);
            
            // Return the processed question object
            return {
                ...q, // Keep original question text, section etc.
                options: shuffledFinalOptions,
                correctIndex: newCorrectIndex
            };
        } else {
            // --- Normal Logic ---
            // Return question with only the first 4 options
            return {
                ...q,
                options: q.options.slice(0, 4)
                // correctIndex remains the same relative to the first 4
            };
        }
    });
}

/**
 * Renderar HTML för quizets resultatskärm
 * @param {object} results - Resultatobjekt ({ correctAnswers, totalQuestions, timeElapsed })
 */
function renderQuizResults(results) {
    console.log("renderQuizResults called with:", results); // DEBUG
    
    // Dölj frågor och progress
    const questionsContainer = document.getElementById(quizConfig.questionsContainerId); // Use config value
    if (questionsContainer) questionsContainer.style.display = 'none';
    const progressContainer = document.getElementById('quiz-progress'); // Assuming fixed ID
    if (progressContainer) progressContainer.style.display = 'none';

    // Hämta resultat-container
    const resultContainer = document.getElementById('quiz-result'); // Assuming fixed ID
    if (!resultContainer) {
        console.error("Result container #quiz-result not found!");
        return;
    }

    // Beräkna procentandel och tid
    const percentage = results.totalQuestions > 0 ? Math.round((results.correctAnswers / results.totalQuestions) * 100) : 0;
    const minutes = Math.floor(results.timeElapsed / 60);
    const seconds = results.timeElapsed % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // --- Calculate Score --- 
    const maxScore = 1000;
    const targetTime = 60; // Target time in seconds for max points
    const timePenaltyWeight = 5; // How many points (out of maxScore/total) are lost per 60 seconds over targetTime
    const totalQuestions = results.totalQuestions > 0 ? results.totalQuestions : 1; // Avoid division by zero

    const timeOver = Math.max(0, results.timeElapsed - targetTime);
    const timePenaltyEquiv = (timeOver / 60) * timePenaltyWeight;
    const effectiveCorrect = Math.max(0, results.correctAnswers - timePenaltyEquiv);
    const score = Math.round(maxScore * (effectiveCorrect / totalQuestions));
    // --- End Calculate Score ---

    // Generera HTML för resultat
    resultContainer.innerHTML = `
        <h3>Quiz Resultat</h3>
        <p><strong>Rätt svar:</strong> ${results.correctAnswers} / ${totalQuestions} (${percentage}%)</p>
        <p><strong>Din tid:</strong> ${formattedTime}</p>
        <p class="quiz-score"><strong>Poäng:</strong> ${score} / ${maxScore}</p>
        <div class="result-actions">
            <button id="show-answers-btn">Visa svar</button>
            <button id="restart-quiz-btn">Försök igen</button>
        </div>
        <div id="quiz-answer-feedback" style="display: none; margin-top: 20px;"></div>
    `;

    // Visa resultat-container
    resultContainer.style.display = 'block';

    // Add celebration class if max score achieved
    if (score === maxScore) {
        resultContainer.classList.add('max-score-celebration');
    } else {
        resultContainer.classList.remove('max-score-celebration'); // Remove if not max score
    }

    // Lägg till event listeners för knappar
    const showAnswersBtn = document.getElementById('show-answers-btn');
    if (showAnswersBtn && typeof window.showQuizAnswers === 'function') {
        showAnswersBtn.addEventListener('click', showQuizAnswers); // Call function in this file
    }
    
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    if (restartQuizBtn) {
        // Change listener to reset UI to start screen
        restartQuizBtn.addEventListener('click', () => {
            const resultContainer = document.getElementById('quiz-result');
            const questionsContainer = document.getElementById(quizConfig.questionsContainerId);
            const startContainer = document.getElementById('quiz-start');
            const answersContainer = document.getElementById('quiz-answers'); // Get answers container too

            if(resultContainer) resultContainer.style.display = 'none';
            if(questionsContainer) questionsContainer.style.display = 'none';
            if(startContainer) startContainer.style.display = 'block';
            
            // Remove the answers container if it exists (was created dynamically)
            if (answersContainer) {
                answersContainer.remove();
            }
            
            // Reset quiz state if needed (though starting a new one will do this anyway)
            window.quizInProgress = false;
            clearInterval(quizTimerInterval);
        }); 
    }
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
