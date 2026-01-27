/**
 * Upplysningen Quiz Frågedatabas
 * Innehåller frågor för varje avsnitt i studiehandledningen om upplysningen.
 */

window.questionsDB = {
    vaggan: [
        {
            question: "I vilket land började upplysningen?",
            options: [
                "Frankrike",
                "England",
                "Tyskland",
                "Sverige"
            ],
            correctIndex: 1
        },
        {
            question: "Vad menade John Locke med 'tabula rasa'?",
            options: [
                "Att människor föds med medfödda idéer",
                "Att människor föds som oskrivna blad",
                "Att kunskap kommer från Gud",
                "Att förnuftet är medfött"
            ],
            correctIndex: 1
        },
        {
            question: "Vilka naturliga rättigheter talade John Locke om?",
            options: [
                "Rätten till mat och dryck",
                "Rätten till liv, frihet och egendom",
                "Rätten till adelskap",
                "Rätten till evig lycka"
            ],
            correctIndex: 1
        },
        {
            question: "Vad upptäckte Isaac Newton?",
            options: [
                "Elektricitet",
                "Tyngdlagen (gravitationen)",
                "Evolutionsteorin",
                "Penicillin"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är empirism?",
            options: [
                "Att kunskap kommer från religiös uppenbarelse",
                "Att kunskap tillägnas genom sinnesintryck och erfarenhet",
                "Att allt är förutbestämt",
                "Att förnuftet ensamt ger kunskap"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken händelse 1688 var viktig för upplysningens framväxt i England?",
            options: [
                "Franska revolutionen",
                "Den ärorika revolutionen",
                "Amerikanska frihetskriget",
                "Napoleonkrigen"
            ],
            correctIndex: 1,
            difficulty: "hard"
        }
    ],
    frankrike: [
        {
            question: "Varför var Frankrike ett 'slagfält' för upplysningens idéer?",
            options: [
                "Där rådde total yttrandefrihet",
                "Där låg makten hos kungen och kyrkan kontrollerade tankelivet",
                "Där fanns inget intresse för filosofi",
                "Där var alla redan upplysningsanhängare"
            ],
            correctIndex: 1
        },
        {
            question: "Vad menade Rousseau med 'Tillbaka till naturen'?",
            options: [
                "Att människor skulle flytta till skogen",
                "Att naturen var ren och civilisationen hade korrumperat människan",
                "Att man skulle studera biologi",
                "Att städer var farliga"
            ],
            correctIndex: 1
        },
        {
            question: "Vad handlar Rousseaus roman Émile om?",
            options: [
                "En politisk revolution",
                "Hur barn ska uppfostras genom erfarenhet och natur",
                "En kärlekshistoria",
                "Kritik av kyrkan"
            ],
            correctIndex: 1
        },
        {
            question: "Vem skrev 'Till försvar för kvinnans rättigheter'?",
            options: [
                "Voltaire",
                "Rousseau",
                "Mary Wollstonecraft",
                "Anna Maria Lenngren"
            ],
            correctIndex: 2
        },
        {
            question: "Vad var Mary Wollstonecrafts huvudargument?",
            options: [
                "Att kvinnor är biologiskt överlägsna män",
                "Att kvinnor borde hållas borta från utbildning",
                "Att om alla föds som oskrivna blad borde kvinnor ha samma möjligheter",
                "Att upplysningen var meningslös"
            ],
            correctIndex: 2
        },
        {
            question: "Vad var Encyklopedin?",
            options: [
                "En religiös skrift",
                "Ett stort uppslagsverk med upplysningens idéer",
                "En roman av Voltaire",
                "En svensk tidning"
            ],
            correctIndex: 1
        },
        {
            question: "Vilka gav ut Encyklopedin?",
            options: [
                "Voltaire och Rousseau",
                "Diderot och d'Alembert",
                "Newton och Locke",
                "Linné och Bellman"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Vad hände med Mary Wollstonecrafts dotter?",
            options: [
                "Hon blev drottning av England",
                "Hon skrev romanen Frankenstein",
                "Hon blev filosof som sin mor",
                "Hon dog ung"
            ],
            correctIndex: 1,
            difficulty: "hard"
        }
    ],
    romanen: [
        {
            question: "Vem skrev romanen Robinson Crusoe?",
            options: [
                "Jonathan Swift",
                "Daniel Defoe",
                "Samuel Richardson",
                "Voltaire"
            ],
            correctIndex: 1
        },
        {
            question: "Varför anses Robinson Crusoe vara en typisk 'upplysningsman'?",
            options: [
                "Han var djupt religiös",
                "Han löste problem genom förnuft och erfarenhet",
                "Han litade på traditioner",
                "Han var pessimistisk"
            ],
            correctIndex: 1
        },
        {
            question: "Vad handlar Jonathan Swifts 'Gullivers resor' om?",
            options: [
                "En kärlekshistoria",
                "En satir som kritiserar samhället",
                "En vetenskaplig avhandling",
                "En religiös text"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är satir?",
            options: [
                "En kärleksdikt",
                "En vetenskaplig metod",
                "Litterär kritik genom ironi och överdrift",
                "En religiös text"
            ],
            correctIndex: 2
        },
        {
            question: "Vad var speciellt med Samuel Richardsons roman Pamela?",
            options: [
                "Den var skriven helt på latin",
                "Den bestod av brev och visade karaktärens inre tankar",
                "Den handlade om kungar och hjältar",
                "Den var förbjuden i hela Europa"
            ],
            correctIndex: 1
        },
        {
            question: "Vad föreslog Jonathan Swift i 'Ett anspråkslöst förslag'?",
            options: [
                "Att man skulle äta de fattigas barn (som satir)",
                "Att man skulle avskaffa monarkin",
                "Att man skulle bygga fler skolor",
                "Att man skulle förbjuda romaner"
            ],
            correctIndex: 0,
            difficulty: "hard"
        }
    ],
    voltaire: [
        {
            question: "Vad kritiserade Voltaire framför allt?",
            options: [
                "Vetenskapen",
                "Religiös intolerans och fanatism",
                "Konst och litteratur",
                "Handel och ekonomi"
            ],
            correctIndex: 1
        },
        {
            question: "Vad handlar Voltaires roman Candide om?",
            options: [
                "En kärlekshistoria",
                "En satir över filosofisk optimism",
                "En vetenskaplig upptäckt",
                "Livet vid hovet"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken händelse inspirerade Voltaire att skriva Candide?",
            options: [
                "Franska revolutionen",
                "Jordbävningen i Lissabon 1755",
                "Amerikanska frihetskriget",
                "Napoleons krig"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär deism?",
            options: [
                "Att förneka Guds existens helt",
                "Att Gud skapade världen men inte längre ingriper",
                "Att följa kyrkans alla läror exakt",
                "Att dyrka flera gudar"
            ],
            correctIndex: 1
        },
        {
            question: "Vad menade Voltaire med 'Écrasez l'Infâme'?",
            options: [
                "Krossa alla böcker",
                "Krossa religiös fanatism och vidskepelse",
                "Krossa alla kungar",
                "Krossa all konst"
            ],
            correctIndex: 1
        },
        {
            question: "Vem var Jean Calas och varför engagerade sig Voltaire i hans fall?",
            options: [
                "En filosof som Voltaire beundrade",
                "En protestant som avrättades orättvist på religiösa grunder",
                "En vetenskapsman som gjorde viktiga upptäckter",
                "En författare som skrev satir"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Vad är teodicéproblemet?",
            options: [
                "Hur kan en god och allsmäktig Gud tillåta ondska?",
                "Varför finns det olika religioner?",
                "Hur uppstod universum?",
                "Vad händer efter döden?"
            ],
            correctIndex: 0,
            difficulty: "hard"
        }
    ],
    sverige: [
        {
            question: "Vilken svensk kung var känd för sin kulturella hov och intresse för teater?",
            options: [
                "Karl XII",
                "Gustav II Adolf",
                "Gustav III",
                "Oscar I"
            ],
            correctIndex: 2
        },
        {
            question: "Vad är Carl von Linné mest känd för?",
            options: [
                "Sina romaner",
                "Att ha systematiserat växt- och djurriket",
                "Sina politiska skrifter",
                "Sina religiösa texter"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är Carl Michael Bellman mest känd för?",
            options: [
                "Sina vetenskapliga upptäckter",
                "Sina epistlar och sånger om Stockholmslivet",
                "Sina politiska skrifter",
                "Sina religiösa texter"
            ],
            correctIndex: 1
        },
        {
            question: "Varför skrev Anna Maria Lenngren under pseudonym?",
            options: [
                "Hon var brottsling",
                "Som kvinna ansågs det opassande att vara öppet satirisk",
                "Hon var rädd för kritik",
                "Det var lag på att använda pseudonym"
            ],
            correctIndex: 1
        },
        {
            question: "Vad heter Bellmans mest kända verk?",
            options: [
                "Candide",
                "Fredmans epistlar",
                "Émile",
                "Skaldeförsök"
            ],
            correctIndex: 1
        },
        {
            question: "Vem var Ulla Winblad?",
            options: [
                "En drottning",
                "En karaktär i Bellmans visor",
                "En vetenskapskvinna",
                "Lenngrens dotter"
            ],
            correctIndex: 1,
            difficulty: "hard"
        }
    ],
    arvet: [
        {
            question: "Vilken revolution påverkades starkt av upplysningens idéer?",
            options: [
                "Den industriella revolutionen",
                "Den franska revolutionen",
                "Den ryska revolutionen",
                "Den gröna revolutionen"
            ],
            correctIndex: 1
        },
        {
            question: "Vad var en stor begränsning med upplysningens frihetslöften?",
            options: [
                "De gällde bara för adeln",
                "De exkluderade ofta kvinnor och koloniserade folk",
                "De var bara teoretiska",
                "De gällde bara i Frankrike"
            ],
            correctIndex: 1
        },
        {
            question: "Vilka moderna idéer har sina rötter i upplysningen?",
            options: [
                "Monarki och envälde",
                "Demokrati och mänskliga rättigheter",
                "Feodalism och livegna",
                "Religiös auktoritet"
            ],
            correctIndex: 1
        },
        {
            question: "Vad var FN:s deklaration om mänskliga rättigheter (1948) inspirerad av?",
            options: [
                "Medeltida kyrkolag",
                "Upplysningens idéer om naturliga rättigheter",
                "Romarrikets lagar",
                "Kinesisk filosofi"
            ],
            correctIndex: 1,
            difficulty: "hard"
        }
    ]
};
