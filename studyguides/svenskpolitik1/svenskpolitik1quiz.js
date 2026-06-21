/**
 * Svensk Politik: En orientering — Quiz Frågedatabas
 * Innehåller frågor för varje avsnitt i studiehandledningen.
 */

window.questionsDB = {
    demokrati: [
        {
            question: "Vad innebär begreppet 'folksuveränitet'?",
            options: [
                "Att kungen har all makt",
                "Att den politiska makten utgår från folket",
                "Att riksdagen kan stifta vilka lagar som helst",
                "Att domstolarna är statens högsta organ"
            ],
            correctIndex: 1
        },
        {
            question: "Vilket styrelseskick har Sverige?",
            options: [
                "Republik med presidentstyre",
                "Konstitutionell monarki med parlamentarism",
                "Enväldigt kungadöme",
                "Direkt demokrati"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär parlamentarism?",
            options: [
                "Att kungen styr landet",
                "Att domstolarna har högsta makten",
                "Att regeringen måste ha riksdagens förtroende för att kunna styra",
                "Att alla beslut fattas av folkomröstning"
            ],
            correctIndex: 2
        },
        {
            question: "Vad är skillnaden mellan representativ och direkt demokrati?",
            options: [
                "I representativ demokrati väljer folket representanter; i direkt demokrati fattar folket beslut direkt",
                "Representativ demokrati finns bara i monarkier",
                "Direkt demokrati är det samma som parlamentarism",
                "Det finns ingen skillnad"
            ],
            correctIndex: 0
        },
        {
            question: "Vad är statschefens roll i Sverige idag?",
            options: [
                "Att leda regeringen och utse ministrar",
                "Att stifta lagar",
                "En ceremoniell roll utan politisk makt — representativ och symbolisk",
                "Att leda riksdagen"
            ],
            correctIndex: 2
        },
        {
            question: "Vilket parti leder Sverige som statsminister sedan 2022?",
            options: [
                "Socialdemokraterna — Magdalena Andersson",
                "Moderaterna — Ulf Kristersson",
                "Sverigedemokraterna — Jimmie Åkesson",
                "Kristdemokraterna — Ebba Busch"
            ],
            correctIndex: 1,
            difficulty: "hard"
        }
    ],
    grundlagar: [
        {
            question: "Hur många grundlagar har Sverige?",
            options: [
                "En",
                "Två",
                "Tre",
                "Fyra"
            ],
            correctIndex: 3
        },
        {
            question: "Vilken grundlag är den viktigaste och reglerar hur Sverige ska styras?",
            options: [
                "Tryckfrihetsförordningen",
                "Successionsordningen",
                "Regeringsformen",
                "Yttrandefrihetsgrundlagen"
            ],
            correctIndex: 2
        },
        {
            question: "Vad skyddar Tryckfrihetsförordningen?",
            options: [
                "Rätten att bära vapen",
                "Friheten att publicera tryckt material utan censur",
                "Rätten till fri rörlighet",
                "Domstolarnas oberoende"
            ],
            correctIndex: 1
        },
        {
            question: "Vad reglerar Successionsordningen?",
            options: [
                "Hur lagar stiftas",
                "Arvsrätten till den kungliga tronen",
                "Presidentens befogenheter",
                "Kommuners självstyre"
            ],
            correctIndex: 1
        },
        {
            question: "Varför är det svårare att ändra en grundlag jämfört med en vanlig lag?",
            options: [
                "Grundlagar kan aldrig ändras",
                "Grundlagar kräver bara en enkel majoritet",
                "Riksdagen måste rösta igenom ändringen två gånger med ett val emellan",
                "Kungen måste godkänna alla grundlagsändringar"
            ],
            correctIndex: 2
        },
        {
            question: "Vad skyddar Yttrandefrihetsgrundlagen som Tryckfrihetsförordningen inte täcker?",
            options: [
                "Rätten att demonstrera",
                "Yttrandefrihet i radio, tv och digitala medier",
                "Rätten att strejka",
                "Rösträtten"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Vad menas med 'maktdelning' i Sverige?",
            options: [
                "Att makten är uppdelad mellan kung och folkvalda",
                "Att den lagstiftande, verkställande och dömande makten hålls separata",
                "Att Sverige delar makt med EU",
                "Att kommuner och staten delar på skatteintäkterna"
            ],
            correctIndex: 1,
            difficulty: "hard"
        }
    ],
    riksdagen: [
        {
            question: "Hur många ledamöter sitter i Sveriges riksdag?",
            options: [
                "300",
                "349",
                "400",
                "275"
            ],
            correctIndex: 1
        },
        {
            question: "Hur ofta hålls val till riksdagen?",
            options: [
                "Vart tredje år",
                "Vart fjärde år",
                "Vart femte år",
                "Vart sjätte år"
            ],
            correctIndex: 1
        },
        {
            question: "Vad heter riksdagens talman (2026)?",
            options: [
                "Urban Ahlin",
                "Andreas Norlén",
                "Kenneth G Forslund",
                "Ulf Kristersson"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Vad kallas ett lagförslag som kommer från riksdagsledamöter (inte regeringen)?",
            options: [
                "Proposition",
                "Motion",
                "Betänkande",
                "Direktiv"
            ],
            correctIndex: 1
        },
        {
            question: "Vad kallas ett lagförslag som läggs fram av regeringen?",
            options: [
                "Motion",
                "Resolution",
                "Proposition",
                "Interpellation"
            ],
            correctIndex: 2
        },
        {
            question: "Vilket riksdagsutskott granskar hur regeringen följer reglerna?",
            options: [
                "Finansutskottet",
                "Utrikesutskottet",
                "Konstitutionsutskottet (KU)",
                "Arbetsmarknadsutskottet"
            ],
            correctIndex: 2
        },
        {
            question: "Vad innebär en misstroendeförklaring?",
            options: [
                "Riksdagen godkänner en ny lag",
                "Riksdagen röstar bort en minister eller statsministern",
                "Regeringen avskedar riksdagsledamöter",
                "Kungen upplöser riksdagen"
            ],
            correctIndex: 1
        }
    ],
    regeringen: [
        {
            question: "Vem väljer statsministern i Sverige?",
            options: [
                "Kungen",
                "Riksdagen, efter förslag av talmannen",
                "Folket direkt i ett separat val",
                "EU-kommissionen"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär 'regeringsbildning'?",
            options: [
                "Att riksdagen skriver en ny grundlag",
                "Att statsministern förhandlar och utser ett kabinett av ministrar",
                "Att kungen utser sina rådgivare",
                "Att partierna bildar koalitioner inför ett val"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär förbudet mot 'ministerstyre' i Sverige?",
            options: [
                "Att ministrar inte får delta i riksdagsdebatter",
                "Att en minister inte får ge order direkt till en myndighet i enskilda ärenden",
                "Att ministrar inte får byta parti",
                "Att det är förbjudet att ha fler än 20 ministrar"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Hur bildas en ny statsminister i praktiken efter ett val?",
            options: [
                "Talmannen föreslår en kandidat som riksdagen röstar om",
                "Partiledaren med flest röster utses automatiskt",
                "Kungen utser statsministern fritt",
                "EU godkänner den nya regeringen"
            ],
            correctIndex: 0
        },
        {
            question: "Vad är Regeringskansliet?",
            options: [
                "Riksdagens kansli",
                "Den myndighet som hjälper regeringen att bereda och genomföra beslut",
                "Konstitutionsdomstolen",
                "EU:s svenska representation"
            ],
            correctIndex: 1
        },
        {
            question: "Ungefär hur många statliga myndigheter lyder under regeringen i Sverige?",
            options: [
                "Ca 50",
                "Ca 150",
                "Ca 370",
                "Ca 1 000"
            ],
            correctIndex: 2,
            difficulty: "crazy"
        }
    ],
    valsystemet: [
        {
            question: "Vilket valsystem använder Sverige för riksdagsvalet?",
            options: [
                "Majoritetsval (first past the post)",
                "Proportionellt valsystem",
                "Direktval av enskilda kandidater utan partier",
                "Lotteri bland alla medborgare"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär 4 %-spärren?",
            options: [
                "Att ett parti måste ha minst 4 % av ledamöterna för att ställa upp",
                "Att ett parti måste få minst 4 % av alla röster för att komma in i riksdagen",
                "Att ett parti behöver 4 % i personval",
                "Att 4 % av mandaten är reserverade för småpartier"
            ],
            correctIndex: 1
        },
        {
            question: "Hur många av riksdagens 349 mandat är utjämningsmandat?",
            options: [
                "10",
                "25",
                "39",
                "49"
            ],
            correctIndex: 2,
            difficulty: "crazy"
        },
        {
            question: "Vad innebär personval i Sverige?",
            options: [
                "Att man röstar på en person utan partilistor",
                "Att man kan kryssa för en kandidat på partiets lista och flytta upp denne",
                "Att statsministern väljs direkt av folket",
                "Att väljare kan föreslå nya kandidater"
            ],
            correctIndex: 1
        },
        {
            question: "Vilka fyra val hålls i Sverige (två av dem på valdag, ett vart fjärde år, ett vart femte år)?",
            options: [
                "Riksdag, landsting, stad och EU",
                "Riksdag, kommunfullmäktige, regionfullmäktige och EU-parlament",
                "Riksdag, statsminister, talman och EU",
                "Riksdag, kommun, provins och FN"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken dag hålls de svenska riksdags-, region- och kommunvalen?",
            options: [
                "Första söndagen i maj vart fjärde år",
                "Tredje söndagen i september vart fjärde år",
                "Andra söndagen i september vart fjärde år",
                "Sista söndagen i augusti vart fjärde år"
            ],
            correctIndex: 2,
            difficulty: "hard"
        },
        {
            question: "Vad är en valkrets?",
            options: [
                "En krets av valhandläggare",
                "Det geografiska område vars röster räknas ihop för att fördela ett visst antal mandat",
                "Riksdagens fysiska kammare",
                "EU:s valkommitté"
            ],
            correctIndex: 1
        }
    ],
    nivaer: [
        {
            question: "Hur många kommuner finns det i Sverige?",
            options: [
                "100",
                "210",
                "290",
                "350"
            ],
            correctIndex: 2
        },
        {
            question: "Hur många regioner finns det i Sverige?",
            options: [
                "10",
                "15",
                "21",
                "25"
            ],
            correctIndex: 2
        },
        {
            question: "Vad ansvarar regionerna främst för?",
            options: [
                "Skola och barnomsorg",
                "Sjukvård och kollektivtrafik",
                "Polisväsendet",
                "Nationell försvarspolitik"
            ],
            correctIndex: 1
        },
        {
            question: "Vad ansvarar kommunerna för?",
            options: [
                "Försvar och utrikes politik",
                "Skola, äldreomsorg och stadsplanering",
                "Sjukvård och kollektivtrafik",
                "Riksdagsvalet"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär 'kommunalt självstyre' i Sverige?",
            options: [
                "Att kommuner kan stifta lagar som gäller hela landet",
                "Att kommuner har rätt att besluta i lokala angelägenheter och ta ut skatt",
                "Att kommuner kan lämna Sverige",
                "Att kommuner väljer sina egna domstolar"
            ],
            correctIndex: 1
        },
        {
            question: "Hur ofta hålls val till Europaparlamentet?",
            options: [
                "Vart tredje år",
                "Vart fjärde år",
                "Vart femte år",
                "Vart sjätte år"
            ],
            correctIndex: 2
        },
        {
            question: "Vilket organ representerar Sverige i EU:s ministerråd?",
            options: [
                "Riksdagen",
                "Regeringen",
                "Kungen",
                "Europaparlamentarikerna"
            ],
            correctIndex: 1,
            difficulty: "hard"
        }
    ],
    paverkan: [
        {
            question: "Vilket är det vanligaste sättet för medborgare att påverka politiken?",
            options: [
                "Att bilda sin egen stat",
                "Att rösta i allmänna val",
                "Att skriva brev till EU-kommissionen",
                "Att anmäla sig till militären"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är en intresseorganisation?",
            options: [
                "En statlig myndighet",
                "En organisation som samlar personer med gemensamma intressen för att påverka politiken",
                "Ett politiskt parti",
                "En typ av domstol"
            ],
            correctIndex: 1
        },
        {
            question: "Vilken roll spelar medierna i demokratin?",
            options: [
                "De stiftar lagar",
                "De granskar makten och sprider information till medborgarna",
                "De utser statsministern",
                "De administrerar valen"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär 'offentlighetsprincipen' i Sverige?",
            options: [
                "Att alla medborgare måste delta i politiken",
                "Att allmänheten har rätt att ta del av myndigheters handlingar",
                "Att riksdagsdebatter sänds i tv",
                "Att partier måste offentliggöra sina program"
            ],
            correctIndex: 1,
            difficulty: "hard"
        },
        {
            question: "Vad kan medborgare göra förutom att rösta för att påverka politiken?",
            options: [
                "Ingenting — rösträtten är det enda lagliga sättet",
                "Gå med i partier, demonstrera, kontakta politiker, skriva debattartiklar, engagera sig i organisationer",
                "Använda veto mot riksdagsbeslut",
                "Kräva folkomröstning när som helst"
            ],
            correctIndex: 1
        },
        {
            question: "Vad skyddar demonstrationsrätten i Sverige?",
            options: [
                "Rätten att hålla hemliga möten",
                "Rätten att fredligt samlas och manifestera åsikter offentligt",
                "Rätten att kräva att politiker avgår omedelbart",
                "Rätten att blockera riksdagsbyggnaden"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är en 'medborgarförslag' (inom kommunalpolitiken)?",
            options: [
                "Ett förslag från en myndighet",
                "En mekanism där en medborgare lämnar ett förslag direkt till kommunfullmäktige för behandling",
                "En EU-petition",
                "Ett motionsförslag i riksdagen"
            ],
            correctIndex: 1,
            difficulty: "crazy"
        }
    ]
};

/* Totalt: 7 sektioner × 6–7 frågor = 49 frågor
   Svårighetsfördelning:
   - normal (ingen tag eller ej angiven): ca 30 frågor
   - hard: ca 12 frågor
   - crazy: 4 frågor (alla inom "crazy bananas"-läge)
*/
