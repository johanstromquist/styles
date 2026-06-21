/**
 * Val 2026: Partierna & Partibarometern - Quiz Frågedatabas
 * Innehåller frågor om riksdagspartierna, valmanskapet och valet 2026.
 */

window.questionsDB = {
    valsystemet: [
        {
            question: "Hur många ledamöter väljs till Sveriges riksdag?",
            options: [
                "300",
                "349",
                "375",
                "400"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken spärr måste ett parti klara för att komma in i riksdagen via riksmandaten?",
            options: [
                "2 procent",
                "3 procent",
                "4 procent",
                "5 procent"
            ],
            correctIndex: 2
        },
        {
            question: "När hålls riksdagsvalet 2026?",
            options: [
                "Den andra söndagen i september 2026",
                "Den sista söndagen i oktober 2026",
                "Den första söndagen i september 2026",
                "Den tredje söndagen i oktober 2026"
            ],
            correctIndex: 0
        },
        {
            question: "Vad kallas principen att en statsministerkandidat godkänns så länge ingen absolut majoritet röstar emot?",
            options: [
                "Positiv parlamentarism",
                "Negativ parlamentarism",
                "Konstruktivt misstroendevotum",
                "Konfidensomröstning"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Vad är Tidöavtalet?",
            options: [
                "En koalitionsregering där SD ingår som ministrar",
                "En överenskommelse som lät M, KD och L bilda regering med stöd från SD",
                "Ett avtal mellan S och M om samarbete",
                "En EU-överenskommelse om migration"
            ],
            correctIndex: 1
        },
        {
            question: "Hur många valkretsar finns det i Sverige?",
            options: [
                "21",
                "25",
                "29",
                "32"
            ],
            correctIndex: 2,
            difficulty: "hard"
        }
    ],
    partierna: [
        {
            question: "Vem är partiledare för Socialdemokraterna inför valet 2026?",
            options: [
                "Stefan Löfven",
                "Morgan Johansson",
                "Magdalena Andersson",
                "Mona Sahlin"
            ],
            correctIndex: 2
        },
        {
            question: "Vem leder Moderaterna och är statsminister?",
            options: [
                "Carl Bildt",
                "Fredrik Reinfeldt",
                "Ulf Kristersson",
                "Gunnar Sträng"
            ],
            correctIndex: 2
        },
        {
            question: "Vem är partiledare för Sverigedemokraterna?",
            options: [
                "Mattias Karlsson",
                "Jimmie Åkesson",
                "Richard Jomshof",
                "Oscar Sjöstedt"
            ],
            correctIndex: 1
        },
        {
            question: "Vem är partiledare för Centerpartiet inför 2026 års val?",
            options: [
                "Annie Lööf",
                "Per Ankersjö",
                "Elisabeth Thand Ringqvist",
                "Muharrem Demirok"
            ],
            correctIndex: 2
        },
        {
            question: "Vem är partiledare för Vänsterpartiet?",
            options: [
                "Jonas Sjöstedt",
                "Ulla Andersson",
                "Nooshi Dadgostar",
                "Lars Ohly"
            ],
            correctIndex: 2
        },
        {
            question: "Vem är partiledare för Kristdemokraterna?",
            options: [
                "Stefan Attefall",
                "Ebba Busch",
                "Göran Hägglund",
                "Per Gahrton"
            ],
            correctIndex: 1
        },
        {
            question: "Vilka två talespersoner har Miljöpartiet inför 2026 års val?",
            options: [
                "Gustav Fridolin och Isabella Lövin",
                "Per Bolund och Märta Stenevi",
                "Amanda Lind och Daniel Helldén",
                "Åsa Romson och Mikaela Valtersson"
            ],
            correctIndex: 2
        },
        {
            question: "Vem är partiledare för Liberalerna?",
            options: [
                "Johan Pehrson",
                "Jan Björklund",
                "Birgitta Ohlsson",
                "Simona Mohamsson"
            ],
            correctIndex: 3
        },
        {
            question: "Vilken är Socialdemokraternas partifärg?",
            options: [
                "Blått",
                "Grönt",
                "Rött",
                "Gult"
            ],
            correctIndex: 2
        },
        {
            question: "Vilket parti grundades 1889 och är Sveriges äldsta och största parti?",
            options: [
                "Moderaterna",
                "Socialdemokraterna",
                "Centerpartiet",
                "Liberalerna"
            ],
            correctIndex: 1
        }
    ],
    barometer: [
        {
            question: "Vad är syftet med en 'valkompass' eller partibarometer?",
            options: [
                "Att berätta för väljarna vilket parti de måste rösta på",
                "Att ge ett förenklat verktyg för att jämföra sina åsikter med partiernas ställningstaganden",
                "Att ersätta den officiella vallängden",
                "Att rangordna partiernas popularitet i opinionsundersökningar"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken ideologisk familj tillhör Socialdemokraterna?",
            options: [
                "Liberalism",
                "Socialdemokrati",
                "Konservatism",
                "Socialism"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken ideologisk position har Sverigedemokraterna?",
            options: [
                "Socialliberal mitt",
                "Höger och nationalkonservativ",
                "Socialistisk vänster",
                "Grön mitten"
            ],
            correctIndex: 1
        },
        {
            question: "Vilket block tillhör Centerpartiet och Liberalerna inför valet 2026?",
            options: [
                "Vänster-blocket (röd-grön)",
                "Tidöpartierna / höger-blocket",
                "Mittblocket",
                "De tillhör inget block"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken ideologi är Miljöpartiets bas?",
            options: [
                "Socialdemokrati",
                "Konservatism",
                "Grön politik (ekologism)",
                "Liberalism"
            ],
            correctIndex: 2
        },
        {
            question: "Vilken europeisk partifamilj tillhör Vänsterpartiet?",
            options: [
                "Socialister och Demokrater (S&D)",
                "Renew Europe",
                "Europavänster / GUE-NGL",
                "De gröna / EFA"
            ],
            correctIndex: 2,
            difficulty: "hard"
        },
        {
            question: "Vilken ideologisk beteckning stammar Kristdemokraterna från?",
            options: [
                "Konservativ liberalism",
                "Kristdemokrati",
                "Socialkonservatism",
                "Agrarism"
            ],
            correctIndex: 1
        },
        {
            question: "Vilket parti grundades 1913 som ett bondeparti och kallas fortfarande 'C'?",
            options: [
                "Liberalerna",
                "Moderaterna",
                "Centerpartiet",
                "Kristdemokraterna"
            ],
            correctIndex: 2
        },
        {
            question: "Moderaterna beskrivs som liberalkonservativa. Vad innebär det?",
            options: [
                "De förenar socialliberal välfärdspolitik med stark statlig styrning",
                "De förenar ekonomisk liberalism med konservativa värdegrunder",
                "De är varken liberala eller konservativa",
                "De förespråkar ett radikalt brott med alla traditioner"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Varför är en valkompass/partibarometer en 'förenklad pedagogisk modell'?",
            options: [
                "För att den endast visar de största partierna",
                "För att verklig politik är mer nyanserad än ett enkelt jämförelseverktyg kan visa",
                "För att den inte går att använda på mobil",
                "För att den kostar pengar att använda"
            ],
            correctIndex: 1
        }
    ],
    sakfragor: [
        {
            question: "Vilket problem har dominerat den politiska debatten under Tidöregeringens mandatperiod?",
            options: [
                "Bostadsbrist och hyresreglering",
                "Gängkriminalitet och gängrelaterat våld",
                "Pensioner och äldrevård",
                "Skola och lärarbristen"
            ],
            correctIndex: 1
        },
        {
            question: "Vad handlar den svenska debatten om 'Sverigelöftet' 2026 om?",
            options: [
                "En överenskommelse om att SD ska få ministerposter om Tidöblocket vinner",
                "En ekonomisk satsning på Sverige",
                "Ett nytt försvarsavtal med NATO",
                "En migrationsuppgörelse"
            ],
            correctIndex: 0,
            difficulty: "hard"
        },
        {
            question: "Vilken är S position när det gäller vård och omsorg?",
            options: [
                "Privatisering och valfrihet",
                "Stark offentligfinansierad välfärd och betoning på vård som rättighet",
                "Kommunerna ska ha inga pengar alls",
                "All vård ska drivas av frivilligorganisationer"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är gränsräntan?",
            options: [
                "En typ av migrationsavgift",
                "Den lägsta skattesatsen",
                "Riksbankens styrränta",
                "Andelen migranter man tar emot"
            ],
            correctIndex: 2,
            difficulty: "hard"
        },
        {
            question: "Vilket år gick Sverige med i NATO?",
            options: [
                "2023",
                "2024",
                "2025",
                "Sverige är inte med i NATO"
            ],
            correctIndex: 1
        },
        {
            question: "Vilket parti vill starkast begränsa invandringen till Sverige?",
            options: [
                "Centerpartiet",
                "Miljöpartiet",
                "Vänsterpartiet",
                "Sverigedemokraterna"
            ],
            correctIndex: 3
        },
        {
            question: "Vilket parti är tydligast för en ambitiös klimatpolitik och mot kärnkraft?",
            options: [
                "Sverigedemokraterna",
                "Moderaterna",
                "Miljöpartiet",
                "Kristdemokraterna"
            ],
            correctIndex: 2
        },
        {
            question: "Vad handlar 'gängkriminalitet' om i den svenska debatten?",
            options: [
                "Brott begångna av pensionärer",
                "Organiserade brottsgäng, skjutningar och sprängningar",
                "Trafik- och cykelvägsbrott",
                "Vitkragskriminalitet i finanssektorn"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är Riksbankens styrränta ungefär i mitten av 2026?",
            options: [
                "5,0 procent",
                "3,5 procent",
                "1,75 procent",
                "0,0 procent"
            ],
            correctIndex: 2,
            difficulty: "crazy"
        },
        {
            question: "Vilket parti är mest positivt till privatisering av välfärden (skola, vård, omsorg)?",
            options: [
                "Vänsterpartiet",
                "Miljöpartiet",
                "Socialdemokraterna",
                "Moderaterna"
            ],
            correctIndex: 3
        },
        {
            question: "Vilket block leder i opinionsmätningarna inför valet 2026 (juni 2026)?",
            options: [
                "Tidöblocket (M, KD, L, SD)",
                "Röd-gröna sidan (S, V, MP, C)",
                "Mitten-blocket",
                "Båda blocken är jämna"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Vad är ungefär Socialdemokraternas opinionssiffra i juni 2026?",
            options: [
                "Ca 18 procent",
                "Ca 23 procent",
                "Ca 32 procent",
                "Ca 40 procent"
            ],
            correctIndex: 2,
            difficulty: "crazy"
        },
        {
            question: "Vilket parti riskerar att hamna under riksdagsspärren (4%) inför valet 2026?",
            options: [
                "Moderaterna",
                "Liberalerna",
                "Centerpartiet",
                "Kristdemokraterna"
            ],
            correctIndex: 1,
            difficulty: "crazy"
        },
        {
            question: "Vilket parti höjer typiskt skatterna för att finansiera välfärd och offentliga tjänster?",
            options: [
                "Moderaterna",
                "Sverigedemokraterna",
                "Vänsterpartiet",
                "Liberalerna"
            ],
            correctIndex: 2,
            difficulty: "crazy"
        }
    ]
};
