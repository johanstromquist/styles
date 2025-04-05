/**
 * Hälsoquiz Frågedatabas
 * Innehåller frågor för varje avsnitt i studiehandledningen om livsstil och hälsa
 */

// Frågedatabas
window.questionsDB = {
    vetenskap: [
        {
            question: "Vad menas med livsstil?",
            options: [
                "Enbart genetiska faktorer som påverkar hälsan",
                "Vanor och val vi gör i vardagen som vi kan förändra",
                "Sjukdomar som är direkt nedärvda från våra föräldrar",
                "Den sociala ställning man har i samhället"
            ],
            correctIndex: 1
        },
        {
            question: "Hur definierar WHO hälsa?",
            options: [
                "Endast frånvaro av sjukdom",
                "Endast mentalt välbefinnande",
                "Ett tillstånd av fullständigt fysiskt, mentalt och socialt välbefinnande och inte enbart frånvaro av sjukdom",
                "Endast god fysik och kondition"
            ],
            correctIndex: 2
        },
        {
            question: "Vilka utmaningar finns med vetenskapliga studier om hälsa?",
            options: [
                "Det är lätt att isolera effekten av en enskild faktor",
                "Alla människor reagerar exakt likadant på samma åtgärder",
                "Självrapporterad hälsa via enkäter kan vara subjektiv",
                "Det finns inga etiska begränsningar för hälsostudier"
            ],
            correctIndex: 2
        },
        {
            question: "Vad kännetecknar bra vetenskapliga studier?",
            options: [
                "De är sponsrade av företag med vinstintresse",
                "De har få deltagare för att kunna kontrollera alla variabler",
                "De har inga etiska godkännanden",
                "De är reproducerbara och har genomgått expertgranskning"
            ],
            correctIndex: 3
        },
        {
            question: "Vad är 'blå zoner'?",
            options: [
                "Områden med särskilt hög vattenförbrukning",
                "Områden i världen där människor mätbart lever längre",
                "Områden med hög teknologisk utveckling",
                "Områden med hög förekomst av depression"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är 'infodemi'?",
            options: [
                "En pandemi som endast påverkar hjärnfunktionen",
                "Överflöd av information, både korrekt och felaktig, som gör det svårt att hitta tillförlitliga källor",
                "En sjukdom som endast sprids via datorer",
                "Information som endast finns tillgänglig för medicinska experter"
            ],
            correctIndex: 1
        }
    ],
    psykisk: [
        {
            question: "Vad kännetecknar god psykisk hälsa?",
            options: [
                "Att aldrig känna sig nedstämd",
                "Förmågan att hantera livets upp- och nedgångar",
                "Att meditera dagligen",
                "Att ta antidepressiva mediciner"
            ],
            correctIndex: 1
        },
        {
            question: "Vilket system aktiveras vid stress?",
            options: [
                "Parasympatiska nervsystemet",
                "Sympatiska nervsystemet",
                "Endokrina systemet",
                "Lymfatiska systemet"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken hjärnstruktur fungerar som hjärnans alarmsystem?",
            options: [
                "Frontallob",
                "Hippocampus",
                "Amygdala",
                "Cerebellum"
            ],
            correctIndex: 2
        },
        {
            question: "Vad är kortisol?",
            options: [
                "En signalsubstans som gör oss glada",
                "Ett stresshormon som frisätts från binjurarna",
                "Ett sömnhormon",
                "En smärtlindrande substans"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken del av hjärnan utvecklas sist (runt 25-årsåldern)?",
            options: [
                "Frontalloben",
                "Amygdala",
                "Lillhjärnan",
                "Hjärnstammen"
            ],
            correctIndex: 0
        },
        {
            question: "Vad är en panikattack?",
            options: [
                "Ett livshotande tillstånd där hjärtat stannar",
                "En mild form av nedstämdhet",
                "Den mest intensiva formen av ångest med stark obehagskänsla",
                "En långvarig depression"
            ],
            correctIndex: 2
        }
    ],
    somn: [
        {
            question: "Vilka är de tre huvudtyperna av sömn?",
            options: [
                "Lätt sömn, djup sömn och komatös sömn",
                "Drömsömn (REM), bassömn och djupsömn",
                "Aktiv sömn, passiv sömn och halvvaken sömn",
                "Alfa-sömn, beta-sömn och delta-sömn"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är melatonin?",
            options: [
                "Ett stresshormon",
                "Ett sömnhormon som produceras i tallkottkörteln",
                "Ett humörhöjande hormon",
                "Ett smärtlindrande hormon"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken faktor är viktigast för att ställa in vår biologiska klocka?",
            options: [
                "Månen",
                "Temperatur",
                "Solljus",
                "Magnetfält"
            ],
            correctIndex: 2
        },
        {
            question: "Vilken process sker i hjärnan under sömn som är viktigt för att förhindra neurodegenerativa sjukdomar?",
            options: [
                "Produktion av stresshormoner",
                "Minskning av hjärnvolymen",
                "Rengöring genom ökat flöde av cerebrospinalvätska",
                "Förstärkning av nervkopplingar"
            ],
            correctIndex: 2
        },
        {
            question: "Hur påverkar blått ljus från skärmar sömnen?",
            options: [
                "Det har ingen påverkan på sömnen",
                "Det ökar melatoninproduktionen",
                "Det hämmar melatoninproduktionen",
                "Det ökar produktionen av serotonin"
            ],
            correctIndex: 2
        },
        {
            question: "Hur många timmars sömn rekommenderas för tonåringar (13-18 år)?",
            options: [
                "6 timmar",
                "7 timmar",
                "8 timmar",
                "9 timmar"
            ],
            correctIndex: 3
        }
    ],
    fysisk: [
        {
            question: "Hur definieras fysisk aktivitet?",
            options: [
                "Endast planerad träning på gym",
                "Endast aktivitet som görs under minst 30 minuter",
                "Kroppsrörelse som ökar energiförbrukningen utöver viloförbrukning",
                "Endast aktivitet som gör dig andfådd"
            ],
            correctIndex: 2
        },
        {
            question: "Hur mycket måttlig fysisk aktivitet rekommenderas för vuxna per vecka?",
            options: [
                "30-60 minuter",
                "75-150 minuter",
                "150-300 minuter",
                "300-450 minuter"
            ],
            correctIndex: 2
        },
        {
            question: "Hur mycket fysisk aktivitet rekommenderas för barn och ungdomar dagligen?",
            options: [
                "15 minuter",
                "30 minuter",
                "45 minuter",
                "60 minuter"
            ],
            correctIndex: 3
        },
        {
            question: "Vilken kognitiv förmåga förbättras mest av fysisk aktivitet?",
            options: [
                "Långtidsminne",
                "Mental bearbetningshastighet",
                "Språkförmåga",
                "Matematisk förmåga"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken hjärnstruktur kan öka i volym hos fysiskt aktiva personer?",
            options: [
                "Amygdala",
                "Hippocampus",
                "Tallkottkörtel",
                "Lillhjärnan"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken av följande är INTE en dokumenterad hälsofördel med fysisk aktivitet?",
            options: [
                "Förbättrad kondition",
                "Starkare skelett",
                "Bättre minne och koncentration",
                "Ökad risk för hjärt-kärlsjukdomar"
            ],
            correctIndex: 3
        }
    ],
    droger: [
        {
            question: "Vad är droger?",
            options: [
                "Endast olagliga substanser",
                "Endast receptbelagda läkemedel",
                "Ämnen som påverkar det centrala nervsystemet",
                "Endast substanser som injiceras"
            ],
            correctIndex: 2
        },
        {
            question: "Vad menas med toleransutveckling?",
            options: [
                "Att kroppen läker snabbare efter droganvändning",
                "Att en större mängd av drogen behövs för att uppnå samma effekt",
                "Att användaren blir mer social av drogen",
                "Att drogen inte längre kan tas in i kroppen"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken del av hjärnan är central för drogers belönande effekter?",
            options: [
                "Amygdala",
                "Frontalloben",
                "Belöningssystemet",
                "Lillhjärnan"
            ],
            correctIndex: 2
        },
        {
            question: "Vilken av följande är en centralstimulerande drog?",
            options: [
                "Alkohol",
                "Heroin",
                "Nikotin",
                "GHB"
            ],
            correctIndex: 2
        },
        {
            question: "Vad är abstinens?",
            options: [
                "När man tar en större dos än vanligt",
                "Obehag som uppstår när man slutar ta en drog",
                "Känslan av välbehag när droger tas",
                "När man blandar olika droger"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är en konsekvens av nikotinanvändning?",
            options: [
                "Minskad risk för hjärt-kärlsjukdomar",
                "Förbättrad lungfunktion",
                "Ökad risk för hjärt-kärlsjukdomar",
                "Bättre sömn"
            ],
            correctIndex: 2
        }
    ]
};
