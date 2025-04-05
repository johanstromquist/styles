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
                "Den sociala ställning man har i samhället",
                "Alla aktiviteter man gör på fritiden",
                "Ens biologiska dygnsrytm"
            ],
            correctIndex: 1
        },
        {
            question: "Hur definierar WHO hälsa?",
            options: [
                "Endast frånvaro av sjukdom",
                "Endast mentalt välbefinnande",
                "Ett tillstånd av fullständigt fysiskt, mentalt och socialt välbefinnande och inte enbart frånvaro av sjukdom",
                "Endast god fysik och kondition",
                "Total avsaknad av stress och oro",
                "Förmågan att arbeta produktivt och effektivt"
            ],
            correctIndex: 2
        },
        {
            question: "Vilka utmaningar finns med vetenskapliga studier om hälsa?",
            options: [
                "Det är lätt att isolera effekten av en enskild faktor",
                "Alla människor reagerar exakt likadant på samma åtgärder",
                "Självrapporterad hälsa via enkäter kan vara subjektiv",
                "Det finns inga etiska begränsningar för hälsostudier",
                "Resultaten är alltid enkla och lätta att tolka",
                "Information från sociala medier är oftast tillförlitlig"
            ],
            correctIndex: 2
        },
        {
            question: "Vad kännetecknar bra vetenskapliga studier?",
            options: [
                "De är sponsrade av företag med vinstintresse",
                "De har få deltagare för att kunna kontrollera alla variabler",
                "De har inga etiska godkännanden",
                "De är reproducerbara och har genomgått expertgranskning",
                "De publiceras alltid i populära veckotidningar",
                "Deras resultat kan generaliseras till alla individer globalt"
            ],
            correctIndex: 3
        },
        {
            question: "Vad är 'blå zoner'?",
            options: [
                "Områden med särskilt hög vattenförbrukning",
                "Områden i världen där människor mätbart lever längre",
                "Områden med hög teknologisk utveckling inom sjukvård",
                "Områden med hög förekomst av depression och psykisk ohälsa",
                "Specifika zoner i hjärnan kopplade till långlevnad",
                "Regioner med strikta lagar kring hälsosam livsstil"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är 'infodemi'?",
            options: [
                "En pandemi som endast påverkar hjärnfunktionen",
                "Överflöd av information, både korrekt och felaktig, som gör det svårt att hitta tillförlitliga källor",
                "En sjukdom som endast sprids via digitala enheter",
                "Information som endast finns tillgänglig för medicinska experter",
                "En epidemi av informationssökande beteende",
                "Kritisk granskning av all information man stöter på"
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
                "Att meditera minst en timme dagligen",
                "Att regelbundet ta antidepressiva mediciner",
                "Att ständigt känna sig euforisk och glad",
                "Att ha ett stort socialt nätverk online"
            ],
            correctIndex: 1
        },
        {
            question: "Vilket system aktiveras primärt vid stress?",
            options: [
                "Parasympatiska nervsystemet",
                "Sympatiska nervsystemet",
                "Endokrina systemet (hormonsystemet)",
                "Lymfatiska systemet (immunförsvaret)",
                "Matsmältningssystemet",
                "Muskuloskeletala systemet"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken hjärnstruktur fungerar som hjärnans alarmsystem vid hot?",
            options: [
                "Frontallob",
                "Hippocampus",
                "Amygdala",
                "Cerebellum (lillhjärnan)",
                "Hjärnstammen",
                "Tallkottkörteln (epifysen)"
            ],
            correctIndex: 2
        },
        {
            question: "Vad är kortisol?",
            options: [
                "En signalsubstans som gör oss glada",
                "Ett stresshormon som frisätts från binjurarna",
                "Ett sömnhormon som reglerar dygnsrytmen",
                "En smärtlindrande substans som kroppen producerar",
                "Ett hormon som reglerar blodsockernivån",
                "En signalsubstans som styr muskelkontraktioner"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken del av hjärnan mognar sist och är inte fullt utvecklad förrän runt 25-årsåldern?",
            options: [
                "Frontalloben",
                "Amygdala",
                "Lillhjärnan",
                "Hjärnstammen",
                "Syncentrum (occipitalloben)",
                "Hörselcentrum (temporalloben)"
            ],
            correctIndex: 0
        },
        {
            question: "Vad är en panikattack?",
            options: [
                "Ett livshotande tillstånd där hjärtat stannar",
                "En mild och kortvarig form av nedstämdhet",
                "Den mest intensiva formen av ångest med starka fysiska och psykiska obehagskänslor",
                "En långvarig och kronisk depression",
                "En vanlig biverkning av för mycket koffein",
                "Ett tecken på att man lider av allvarlig sömnbrist"
            ],
            correctIndex: 2
        }
    ],
    somn: [
        {
            question: "Vilka är de tre huvudtyperna av sömn som nämns i materialet?",
            options: [
                "Lätt sömn, djup sömn och komatös sömn",
                "Drömsömn (REM), bassömn och djupsömn",
                "Aktiv sömn, passiv sömn och halvvaken sömn",
                "Alfa-sömn, beta-sömn och delta-sömn",
                "Paradoxal sömn, ortodox sömn och intermediär sömn",
                "Vaken sömn, dåsig sömn och omedveten sömn"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är melatonin?",
            options: [
                "Ett stresshormon som gör oss alerta",
                "Ett sömnhormon som produceras i tallkottkörteln när det blir mörkt",
                "Ett humörhöjande hormon som frisätts vid träning",
                "Ett smärtlindrande hormon som liknar endorfiner",
                "Ett hormon som reglerar hunger och mättnad",
                "En signalsubstans kopplad till inlärning"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken yttre faktor är viktigast för att ställa in vår biologiska klocka (dygnsrytm)?",
            options: [
                "Månens cykler",
                "Lufttemperatur och luftfuktighet",
                "Solljus (växlingen mellan ljus och mörker)",
                "Jordens magnetfält",
                "Regelbundna måltider",
                "Sociala interaktioner och scheman"
            ],
            correctIndex: 2
        },
        {
            question: "Vilken viktig process sker i hjärnan under sömn för att städa bort skadliga proteiner?",
            options: [
                "Ökad produktion av stresshormoner för återhämtning",
                "Tillfällig minskning av hjärnvolymen för att spara energi",
                "Rengöring genom ökat flöde av cerebrospinalvätska (glymfatiska systemet)",
                "Förstärkning av alla nervkopplingar, även oviktiga",
                "Lagring av kortsiktiga minnen i långtidsminnet",
                "Frisättning av tillväxthormon för muskelreparation"
            ],
            correctIndex: 2
        },
        {
            question: "Hur påverkar blått ljus från skärmar sömnen negativt?",
            options: [
                "Det har ingen signifikant påverkan på sömnen",
                "Det ökar kroppens naturliga melatoninproduktion",
                "Det hämmar kroppens melatoninproduktion och gör oss piggare",
                "Det ökar produktionen av lugnande serotonin",
                "Det förbättrar kvaliteten på djupsömnen",
                "Det får oss att somna snabbare men vakna oftare"
            ],
            correctIndex: 2
        },
        {
            question: "Hur många timmars sömn per natt rekommenderas generellt för tonåringar (13-18 år)?",
            options: [
                "Cirka 6 timmar",
                "Cirka 7 timmar",
                "Cirka 8 timmar",
                "Cirka 9 timmar",
                "Minst 10 timmar",
                "Det varierar kraftigt, ingen generell rekommendation finns"
            ],
            correctIndex: 3
        }
    ],
    fysisk: [
        {
            question: "Hur definieras fysisk aktivitet i detta sammanhang?",
            options: [
                "Endast planerad träning på ett gym eller sportanläggning",
                "Endast aktivitet som pågår i minst 30 minuter utan paus",
                "All kroppsrörelse som ökar energiförbrukningen utöver vila",
                "Endast aktivitet som leder till att man blir tydligt andfådd och svettig",
                "Mental ansträngning som problemlösning eller studier",
                "Passiv stretching och rörlighetsövningar"
            ],
            correctIndex: 2
        },
        {
            question: "Hur mycket måttlig fysisk aktivitet rekommenderas minst för vuxna per vecka?",
            options: [
                "30-60 minuter",
                "75-150 minuter",
                "150-300 minuter",
                "300-450 minuter",
                "60 minuter varje dag",
                "Minst 10 000 steg om dagen"
            ],
            correctIndex: 2
        },
        {
            question: "Hur mycket fysisk aktivitet rekommenderas minst för barn och ungdomar dagligen?",
            options: [
                "15 minuter intensiv aktivitet",
                "30 minuter måttlig aktivitet",
                "45 minuter blandad aktivitet",
                "60 minuter måttlig till högintensiv aktivitet",
                "90 minuter lågintensiv aktivitet",
                "Två timmar lek och rörelse"
            ],
            correctIndex: 3
        },
        {
            question: "Vilken kognitiv förmåga verkar förbättras mest av fysisk aktivitet enligt materialet?",
            options: [
                "Långtidsminne för detaljer",
                "Mental bearbetningshastighet",
                "Språklig kreativitet och ordförråd",
                "Matematisk problemlösningsförmåga",
                "Förmågan att läsa och förstå komplexa texter",
                "Visuell igenkänning av ansikten"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken hjärnstruktur, viktig för minne och inlärning, kan öka i volym hos fysiskt aktiva personer?",
            options: [
                "Amygdala",
                "Hippocampus",
                "Tallkottkörtel",
                "Lillhjärnan (Cerebellum)",
                "Frontalloben",
                "Hjärnbalken (Corpus Callosum)"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken av följande är INTE en typisk hälsofördel med regelbunden fysisk aktivitet?",
            options: [
                "Förbättrad kondition och hjärthälsa",
                "Starkare skelett och muskler",
                "Bättre minne och koncentrationsförmåga",
                "Ökad risk för vissa typer av hjärt-kärlsjukdomar",
                "Minskad stresstålighet och sämre humör",
                "Försämrad sömnkvalitet och ökad trötthet"
            ],
            correctIndex: 3
        }
    ],
    droger: [
        {
            question: "Vad är droger enligt definitionen i materialet?",
            options: [
                "Endast olagliga substanser som narkotika",
                "Endast receptbelagda läkemedel med beroendepotential",
                "Ämnen som påverkar det centrala nervsystemet och dess funktion",
                "Endast substanser som man injicerar eller röker",
                "Alla typer av mediciner, inklusive receptfria",
                "Naturligt förekommande ämnen som kaffe och te"
            ],
            correctIndex: 2
        },
        {
            question: "Vad menas med toleransutveckling vid droganvändning?",
            options: [
                "Att kroppen återhämtar sig snabbare från drogens effekter",
                "Att en större mängd av drogen behövs för att uppnå samma effekt",
                "Att användaren blir mer social och utåtriktad av drogen",
                "Att drogen inte längre kan tas upp av kroppens celler",
                "Att drogen ger starkare och mer intensiv effekt över tid",
                "Att man blir helt immun mot drogens negativa biverkningar"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken del av hjärnan är central för upplevelsen av belöning och är starkt påverkad av beroendeframkallande droger?",
            options: [
                "Amygdala (känslocentrum)",
                "Frontalloben (beslutsfattande)",
                "Belöningssystemet (inkl. nucleus accumbens)",
                "Lillhjärnan (motorik och balans)",
                "Hippocampus (minne)",
                "Hypotalamus (hormonreglering)"
            ],
            correctIndex: 2
        },
        {
            question: "Vilken av följande droger klassificeras som centralstimulerande?",
            options: [
                "Alkohol",
                "Heroin (opioid)",
                "Nikotin",
                "GHB",
                "Cannabis",
                "Bensodiazepiner (lugnande)"
            ],
            correctIndex: 2
        },
        {
            question: "Vad innebär abstinens i samband med drogberoende?",
            options: [
                "När man av misstag tar en för stor dos av drogen",
                "De fysiska och psykiska obehag som uppstår när man slutar ta en drog kroppen vant sig vid",
                "Den positiva känslan och ruset man får när drogen tas",
                "När man kombinerar flera olika typer av droger samtidigt",
                "En kraftig allergisk reaktion mot drogen",
                "Ett psykologiskt sug efter drogen utan fysiska symtom"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är en känd negativ konsekvens av långvarig nikotinanvändning (t.ex. rökning)?",
            options: [
                "Minskad risk för lungsjukdomar som KOL",
                "Förbättrad syreupptagningsförmåga i blodet",
                "Ökad risk för hjärt-kärlsjukdomar och cancer",
                "Förbättrad och djupare sömnkvalitet",
                "Förbättrat lukt- och smaksinne",
                "Inga signifikanta långsiktiga hälsorisker"
            ],
            correctIndex: 2
        }
    ]
};
