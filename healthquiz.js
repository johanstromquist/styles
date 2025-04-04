// Questions database organized by section
const questionsDB = {
    vetenskap: [
        {
            question: "Vad innebär begreppet livsstil?",
            options: [
                "Vanor och val vi gör, sådant vi själva har möjlighet att förändra och välja",
                "Genetiskt bestämda egenskaper som påverkar vår hälsa",
                "Yttre miljöfaktorer som påverkar vårt dagliga liv",
                "Samhälleliga strukturer som bestämmer våra möjligheter"
            ],
            correct: 0
        },
        {
            question: "Vilken av följande är INTE en gemensam faktor för blå zoner?",
            options: [
                "Närhet till havet",
                "Relativt små och avlägsna platser",
                "Hög teknologisk utveckling",
                "Växtbaserad kost"
            ],
            correct: 2
        },
        {
            question: "Enligt WHO:s definition av hälsa, vad innebär god hälsa?",
            options: [
                "Enbart frånvaro av sjukdom",
                "Främst fysiskt välbefinnande",
                "Ett tillstånd av fullständigt fysiskt, mentalt och socialt välbefinnande",
                "Att kunna prestera maximalt i vardagen"
            ],
            correct: 2
        },
        {
            question: "Vilken är en av utmaningarna med att bedriva vetenskapliga studier kring livsstil och hälsa?",
            options: [
                "Det finns för få människor att studera",
                "Många externa faktorer kan påverka resultaten, vilket gör kontrollerade studier svåra",
                "Det saknas tekniska instrument för att mäta hälsotillstånd",
                "Hälsoeffekter visar sig alltid omedelbart och är lätta att mäta"
            ],
            correct: 1
        },
        {
            question: "Vad är ett kännetecken för högkvalitativa vetenskapliga studier?",
            options: [
                "De kräver ett litet antal deltagare för att vara lätthanterliga",
                "De använder enbart självrapporterade data",
                "De är reproducerbara och kan upprepas med liknande resultat",
                "De genomförs alltid under flera decennier"
            ],
            correct: 2
        },
        {
            question: "Vad betyder begreppet 'infodemi' inom hälsokommunikation?",
            options: [
                "En epidemi av infektionssjukdomar",
                "Ett överflöd av både korrekt och felaktig information som sprids snabbt",
                "En kampanj för att sprida hälsoinformation",
                "En vetenskaplig studie om informationsspridning"
            ],
            correct: 1
        }
    ],
    psykisk: [
        {
            question: "Vilken del av det autonoma nervsystemet aktiveras vid stress?",
            options: [
                "Sympatiska nervsystemet",
                "Parasympatiska nervsystemet",
                "Somatiska nervsystemet",
                "Sensoriska nervsystemet"
            ],
            correct: 0
        },
        {
            question: "Vilka komponenter ingår i stressystemet (HPA-axeln)?",
            options: [
                "Hjärta, Pankreas, Andningsvägar",
                "Hypotalamus, Hypofys, Binjurar",
                "Hjärna, Pankreas, Amygdala",
                "Hjässa, Panna, Ansikte"
            ],
            correct: 1
        },
        {
            question: "Vad är amygdalans huvudfunktion i relation till stressystemet?",
            options: [
                "Att bromsa stressreaktioner",
                "Att producera stresshormoner",
                "Att fungera som hjärnans alarmsystem som kan aktivera stressystemet",
                "Att reglera känslor och impulskontroll"
            ],
            correct: 2
        },
        {
            question: "Vad är skillnaden mellan ångest och ett direkt hot enligt materialet?",
            options: [
                "Ångest är alltid värre än ett direkt hot",
                "Ångest är stress i förväg över något som skulle kunna vara ett hot",
                "Ångest aktiverar ett helt annat system än stressystemet",
                "Ångest påverkar bara det parasympatiska nervsystemet"
            ],
            correct: 1
        },
        {
            question: "Vilket område i hjärnan är särskilt känsligt för långvarig stress och kan krympa vid kronisk stressexponering?",
            options: [
                "Amygdala",
                "Frontallob",
                "Tallkottkörteln",
                "Hippocampus"
            ],
            correct: 3
        },
        {
            question: "Varför är ungdomar extra känsliga för stress och känslomässiga svängningar?",
            options: [
                "De är generellt mer uttröttade än vuxna",
                "Deras kroppar har högre kortisolnivåer",
                "Deras frontallob är inte fullt utvecklad",
                "De har fler nervkopplingar i hjärnan"
            ],
            correct: 2
        }
    ],
    somn: [
        {
            question: "Hur mycket sömn rekommenderas för tonåringar (13-18 år)?",
            options: [
                "6-7 timmar",
                "7-8 timmar",
                "9 timmar",
                "10-11 timmar"
            ],
            correct: 2
        },
        {
            question: "Vilket hormon reglerar dygnsrytmen och gör oss sömniga?",
            options: [
                "Kortisol",
                "Melatonin",
                "Adrenalin",
                "Serotonin"
            ],
            correct: 1
        },
        {
            question: "Varför kan risken för neurodegenerativa sjukdomar som Alzheimers reduceras av god sömn?",
            options: [
                "Under sömnen rengörs hjärnan från skadliga proteiner och slaggprodukter",
                "Sömn har ingen koppling till neurodegenerativa sjukdomar",
                "God sömn förbättrar endast minnet men påverkar inte hjärnans rengöring",
                "Sömn producerar nya hjärnceller som ersätter skadade"
            ],
            correct: 0
        },
        {
            question: "Vilket av följande är INTE en av de tre kritiska processer som sker under sömn?",
            options: [
                "Återhämtning",
                "Städning av slaggprodukter från hjärnan",
                "Ökad produktion av stresshormoner",
                "Bearbeta information och skapa minnen"
            ],
            correct: 2
        },
        {
            question: "Var i hjärnan produceras sömnhormonet melatonin?",
            options: [
                "Hypofysen",
                "Amygdala",
                "Tallkottkörteln (epifysen)",
                "Hypotalamus"
            ],
            correct: 2
        },
        {
            question: "Varför är blått ljus från skärmar särskilt problematiskt för sömnen?",
            options: [
                "Det är mindre skadligt än andra ljustyper",
                "Det hämmar inte melatoninproduktionen",
                "Det påverkar endast små barn negativt",
                "Det hämmar melatoninproduktionen i tallkottkörteln"
            ],
            correct: 3
        }
    ],
    fysisk: [
        {
            question: "Hur många steg per dag tog våra förfäder som levde som jägare-samlare?",
            options: [
                "5 000-8 000 steg",
                "8 000-10 000 steg",
                "10 000-12 000 steg",
                "14 000-18 000 steg"
            ],
            correct: 3
        },
        {
            question: "Hur mycket fysisk aktivitet rekommenderas för barn och ungdomar dagligen?",
            options: [
                "30 minuter",
                "60 minuter (1 timme)",
                "90 minuter",
                "120 minuter (2 timmar)"
            ],
            correct: 1
        },
        {
            question: "Vilken del av hjärnan kan öka i volym hos fysiskt aktiva personer?",
            options: [
                "Amygdala",
                "Frontalloben",
                "Hippocampus",
                "Tallkottkörteln"
            ],
            correct: 2
        },
        {
            question: "Hur mycket kan kreativiteten öka efter fysisk aktivitet enligt studier?",
            options: [
                "20-30%",
                "30-40%",
                "40-50%",
                "50-60%"
            ],
            correct: 3
        },
        {
            question: "Vilken av följande är INTE en hälsofördel med fysisk aktivitet?",
            options: [
                "Förbättrad kondition",
                "Starkare skelett och muskler",
                "Ökad produktion av stresshormoner",
                "Bättre minnesfunktion"
            ],
            correct: 2
        },
        {
            question: "Vad är en rekommenderad aktivitetsnivå för vuxna per vecka?",
            options: [
                "30 minuter aktivitet en gång i veckan",
                "60 minuter måttlig aktivitet per vecka",
                "150-300 minuter måttlig intensitet per vecka",
                "450 minuter intensiv träning per vecka"
            ],
            correct: 2
        }
    ],
    droger: [
        {
            question: "Vilken signalsubstans stimulerar hjärnans belöningscentrum, vilket framkallar välbefinnande?",
            options: [
                "Serotonin",
                "Adrenalin",
                "Dopamin",
                "Endorfin"
            ],
            correct: 2
        },
        {
            question: "Vad innebär toleransutveckling vid droganvändning?",
            options: [
                "Man blir helt immun mot drogens effekter",
                "Större dos krävs för samma effekt",
                "Kroppen blir mer känslig för drogen",
                "Man får färre biverkningar av drogen"
            ],
            correct: 1
        },
        {
            question: "Vilken av följande kategoriseras som en centralstimulerande drog?",
            options: [
                "Alkohol",
                "Cannabis",
                "GHB",
                "Kokain"
            ],
            correct: 3
        },
        {
            question: "Vad är abstinens inom drogberoende?",
            options: [
                "Ett ökat sug efter drogen",
                "Total avsaknad av droger i blodet",
                "Obehag som uppstår när man slutar ta en drog",
                "Den njutbara känslan när drogen verkar"
            ],
            correct: 2
        },
        {
            question: "Hur påverkar droger synapserna i hjärnan?",
            options: [
                "De förbättrar alltid signalöverföringen",
                "De blockerar alltid signalöverföringen helt",
                "De kan störa normal signalöverföring på flera olika sätt",
                "De påverkar bara motoriska nervceller"
            ],
            correct: 2
        },
        {
            question: "Vilken är en av riskfaktorerna för utveckling av beroende?",
            options: [
                "Hög ålder",
                "Stark frontallob",
                "Låg stressnivå",
                "Tidig debutålder"
            ],
            correct: 3
        }
    ]
};

// Function to render a section's questions
function renderSectionQuestions(sectionId) {
    const questions = questionsDB[sectionId] || [];
    let questionHtml = '';
    
    questions.forEach((q, index) => {
        questionHtml += `
            <div class="question">
                <p>${index + 1}. ${q.question}</p>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <div class="option" data-question="${index}" data-option="${i}" onclick="checkAnswer(this, ${i === q.correct})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    return questionHtml;
}

// Function to get random questions for the quiz
function getRandomQuestions(count = 10) {
    const allQuestions = [];
    
    // Combine all sections' questions
    Object.keys(questionsDB).forEach(section => {
        questionsDB[section].forEach(q => {
            allQuestions.push({...q, section});
        });
    });
    
    // Shuffle questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    
    // Return the specified count or half of all questions, whichever is smaller
    const targetCount = Math.min(count, Math.ceil(allQuestions.length / 2));
    return shuffled.slice(0, targetCount);
}

// Function to check an answer
function checkAnswer(element, isCorrect) {
    // Remove any previous selections in this question group
    const questionOptions = element.parentNode.querySelectorAll('.option');
    questionOptions.forEach(option => {
        option.classList.remove('selected', 'correct', 'wrong');
    });
    
    // Mark this option as selected
    element.classList.add('selected');
    
    // Show correct/wrong feedback
    if (isCorrect) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
        
        // Optionally, highlight the correct answer
        questionOptions.forEach(option => {
            if (option.getAttribute('onclick').includes('true')) {
                option.classList.add('correct');
            }
        });
    }
    
    // Update quiz progress if in quiz mode
    if (window.quizInProgress) {
        updateQuizProgress();
    }
}

// Quiz-specific functions
let quizInProgress = false;
let quizStartTime = 0;
let quizQuestions = [];
let quizAnswers = {};

// Function to start the quiz
function startQuiz() {
    quizInProgress = true;
    quizStartTime = new Date().getTime();
    quizQuestions = getRandomQuestions();
    quizAnswers = {};
    
    // Render the quiz questions
    renderQuiz();
    
    // Start the timer
    updateTimer();
    window.quizTimerInterval = setInterval(updateTimer, 1000);
    
    // Show the quiz container
    document.getElementById('quiz-questions').style.display = 'block';
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
}

// Function to render the quiz
function renderQuiz() {
    const quizContainer = document.getElementById('quiz-questions');
    let quizHTML = '';
    
    quizQuestions.forEach((q, index) => {
        quizHTML += `
            <div class="question">
                <p>${index + 1}. ${q.question}</p>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <div class="option" data-question="${index}" data-option="${i}" onclick="selectQuizAnswer(${index}, ${i}, ${i === q.correct})">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    quizHTML += `
        <button onclick="finishQuiz()">Avsluta quiz</button>
    `;
    
    quizContainer.innerHTML = quizHTML;
    updateQuizProgress();
}

// Function to select a quiz answer
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

// Function to update quiz progress
function updateQuizProgress() {
    const answered = Object.keys(quizAnswers).length;
    const total = quizQuestions.length;
    const correct = Object.values(quizAnswers).filter(a => a.correct).length;
    
    // Update progress bar
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${(answered / total) * 100}%`;
    }
    
    // Update progress text
    const progressText = document.getElementById('quiz-progress-text');
    if (progressText) {
        progressText.textContent = `${answered} av ${total} besvarade (${correct} rätt)`;
    }
}

// Function to update the timer
function updateTimer() {
    if (!quizInProgress) return;
    
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - quizStartTime) / 1000);
    
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    
    const timerElement = document.getElementById('quiz-timer');
    if (timerElement) {
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}

// Function to finish the quiz
function finishQuiz() {
    quizInProgress = false;
    clearInterval(window.quizTimerInterval);
    
    // Calculate results
    const totalQuestions = quizQuestions.length;
    const answered = Object.keys(quizAnswers).length;
    const correct = Object.values(quizAnswers).filter(a => a.correct).length;
    const score = Math.round((correct / totalQuestions) * 100);
    
    // Calculate time bonus
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - quizStartTime) / 1000);
    const timeBonus = Math.max(0, 300 - elapsedSeconds) * 2; // 2 points for each second under 5 minutes
    
    const totalScore = score + timeBonus;
    
    // Display results
    const resultContainer = document.getElementById('quiz-result');
    resultContainer.innerHTML = `
        <h3>Quiz Resultat</h3>
        <p>Du svarade på ${answered} av ${totalQuestions} frågor.</p>
        <p>Rätta svar: ${correct} (${score}%)</p>
        <p>Tid: ${Math.floor(elapsedSeconds / 60)}:${elapsedSeconds % 60 < 10 ? '0' : ''}${elapsedSeconds % 60}</p>
        <p>Tidsbonus: +${timeBonus} poäng</p>
        <p class="result">Din totalpoäng: ${totalScore}</p>
        <button onclick="startQuiz()">Försök igen</button>
        <button onclick="showQuizAnswers()">Visa rätta svar</button>
    `;
    
    document.getElementById('quiz-questions').style.display = 'none';
    document.getElementById('quiz-start').style.display = 'none';
    resultContainer.style.display = 'block';
    
    // Check for achievements
    checkForAchievements(correct, totalQuestions, elapsedSeconds);
}

// Function to show quiz answers
function showQuizAnswers() {
    const resultContainer = document.getElementById('quiz-result');
    let answersHTML = `
        <h3>Dina svar och de rätta svaren</h3>
    `;
    
    quizQuestions.forEach((q, index) => {
        const userAnswer = quizAnswers[index] ? quizAnswers[index].selected : -1;
        const correctAnswer = q.correct;
        
        answersHTML += `
            <div class="question">
                <p>${index + 1}. ${q.question}</p>
                <div class="options">
                    ${q.options.map((option, i) => `
                        <div class="option ${i === correctAnswer ? 'correct' : ''} ${i === userAnswer && i !== correctAnswer ? 'wrong' : ''} ${i === userAnswer ? 'selected' : ''}">
                            ${option} ${i === correctAnswer ? '✓' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    answersHTML += `
        <button onclick="startQuiz()">Försök igen</button>
        <button onclick="document.getElementById('quiz-result').innerHTML = '';">Tillbaka till resultat</button>
    `;
    
    resultContainer.innerHTML = answersHTML;
}

// Function to check for achievements
function checkForAchievements(correct, total, time) {
    // Example achievements
    if (correct === total) {
        unlockAchievement('quiz-master');
    }
    
    if (time < 180) { // Less than 3 minutes
        unlockAchievement('speed-demon');
    }
    
    // Tracking section visits for the explorer achievement is handled elsewhere
}

// Function to unlock an achievement
function unlockAchievement(achievementId) {
    const achievement = document.getElementById(achievementId);
    if (achievement) {
        achievement.classList.add('unlocked');
        const overlay = achievement.querySelector('.locked-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        // Save achievement to localStorage
        const achievements = JSON.parse(localStorage.getItem('achievements') || '{}');
        achievements[achievementId] = true;
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // Show notification
        showNotification(`Prestation upplåst: ${achievement.getAttribute('data-name')}!`);
    }
}

// Function to show a notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Function to initialize the application
function initApp() {
    // Set up navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active navigation
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const sections = document.querySelectorAll('.section');
            sections.forEach(s => s.classList.remove('active'));
            
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active', 'animated');
            
            // Track visit for explorer achievement
            trackSectionVisit(targetSection);
        });
    });
    
    // Render section questions
    Object.keys(questionsDB).forEach(section => {
        const questionsContainer = document.getElementById(`${section}-questions`);
        if (questionsContainer) {
            questionsContainer.innerHTML = renderSectionQuestions(section);
        }
    });
    
    // Load achievements from localStorage
    loadAchievements();
}

// Function to track section visits
function trackSectionVisit(section) {
    const visitedSections = JSON.parse(localStorage.getItem('visitedSections') || '[]');
    if (!visitedSections.includes(section)) {
        visitedSections.push(section);
        localStorage.setItem('visitedSections', JSON.stringify(visitedSections));
        
        // Check for explorer achievement
        const sections = ['vetenskap', 'psykisk', 'somn', 'fysisk', 'droger', 'quiz'];
        if (sections.every(s => visitedSections.includes(s))) {
            unlockAchievement('explorer');
        }
    }
}

// Function to load achievements
function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '{}');
    
    Object.keys(achievements).forEach(id => {
        if (achievements[id]) {
            const achievement = document.getElementById(id);
            if (achievement) {
                achievement.classList.add('unlocked');
                const overlay = achievement.querySelector('.locked-overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }
            }
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
