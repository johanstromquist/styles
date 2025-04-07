/**
 * Samhällsekonomi Quiz Frågedatabas
 * Innehåller frågor för varje avsnitt i studiehandledningen om samhällsekonomi och ekonomisk politik
 */

// Frågedatabas
window.questionsDB = {
    grundlaggande: [
        {
            question: "Vad innebär begreppet 'knapphet' inom nationalekonomi?",
            options: [
                "Att det finns för få pengar i samhället",
                "Att alla varor är dyra",
                "Att mänskliga behov är obegränsade medan resurserna är begränsade",
                "Att endast rika länder har tillräckligt med resurser",
                "Att det råder brist på specifika lyxvaror",
                "Att teknologisk utveckling har upphört"
            ],
            correctIndex: 2
        },
        {
            question: "Vad mäter Bruttonationalprodukt (BNP)?",
            options: [
                "Den totala statsskulden i ett land",
                "Värdet av alla varor och tjänster som produceras i ett land under ett år",
                "Antalet arbetslösa i ett land",
                "Den genomsnittliga inkomsten per invånare",
                "Värdet av all export från ett land",
                "Den totala mängden pengar i omlopp"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är inflation?",
            options: [
                "En minskning av den allmänna prisnivån",
                "Att värdet på landets valuta ökar kraftigt",
                "En ökning av den allmänna prisnivån över tid, vilket minskar pengars köpkraft",
                "Att räntan på lån sjunker",
                "En ökning av arbetslösheten",
                "Att staten trycker för få sedlar"
            ],
            correctIndex: 2
        },
        {
            question: "Vad beskriver lagen om efterfrågan?",
            options: [
                "Ju högre pris, desto högre efterfrågan",
                "Efterfrågan är alltid konstant oavsett pris",
                "Ju lägre pris, desto högre efterfrågan (allt annat lika)",
                "Företag bestämmer alltid efterfrågan",
                "Efterfrågan påverkas endast av reklam",
                "Ju högre inkomst, desto lägre efterfrågan"
            ],
            correctIndex: 2
        },
        {
            question: "Vad beskriver lagen om utbud?",
            options: [
                "Ju lägre pris, desto högre utbud",
                "Utbudet är alltid konstant oavsett pris",
                "Ju högre pris, desto högre utbud (allt annat lika)",
                "Konsumenter bestämmer alltid utbudet",
                "Utbudet påverkas endast av produktionskostnader",
                "Ju fler företag, desto lägre utbud"
            ],
            correctIndex: 2
        },
        {
            question: "Vad kallas den punkt där utbuds- och efterfrågekurvorna möts?",
            options: [
                "Brytpunkt",
                "Maxpris",
                "Jämviktspris/marknadspris",
                "Produktionsoptimum",
                "Monopolpris",
                "Golvpris"
            ],
            correctIndex: 2
        },
         {
            question: "Vilket av följande är ett exempel på en produktionsfaktor?",
            options: [
                "Konsumenternas preferenser",
                "Färdiga varor i butik",
                "Arbetskraft",
                "Reklamkostnader",
                "Inflationstakten",
                "Bytesbalansen"
            ],
            correctIndex: 2
        },
        {
            question: "Vad menas med alternativkostnad?",
            options: [
                "Kostnaden för att köpa en alternativ produkt",
                "Den totala kostnaden för alla alternativ",
                "Värdet av det näst bästa alternativet som man avstår från när man gör ett val",
                "En extra kostnad som läggs på vid sena betalningar",
                "Kostnaden för att byta leverantör",
                "Alla kostnader utom den direkta produktionskostnaden"
            ],
            correctIndex: 2
        }
    ],
    system: [
        {
            question: "Vad kännetecknar en ren marknadsekonomi?",
            options: [
                "Staten äger alla produktionsmedel",
                "Priser bestäms av statliga planer",
                "Produktion och priser styrs av utbud och efterfrågan på fria marknader",
                "Alla företag är kooperativt ägda",
                "Staten reglerar alla detaljer i produktionen",
                "Handel med utlandet är förbjuden"
            ],
            correctIndex: 2
        },
        {
            question: "Vad kännetecknar en ren planekonomi?",
            options: [
                "Företag konkurrerar fritt om kunder",
                "Staten äger produktionsmedlen och bestämmer vad som ska produceras och till vilka priser",
                "Priser bestäms enbart av konsumenternas efterfrågan",
                "Individuell frihet att starta företag är central",
                "Marknadskrafterna styr resursfördelningen",
                "Ekonomin baseras helt på självförsörjning"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är en blandekonomi?",
            options: [
                "En ekonomi som bara producerar blandade produkter",
                "En ekonomi där endast två företag dominerar marknaden",
                "En ekonomi där staten helt saknar inflytande",
                "Ett ekonomiskt system med inslag av både marknadsekonomi och statlig reglering/intervention",
                "En ekonomi som helt saknar internationell handel",
                "En ekonomi där alla beslut fattas gemensamt i folkomröstningar"
            ],
            correctIndex: 3
        },
        {
            question: "Vilken ekonomisk tänkare förknippas starkt med idén om 'den osynliga handen' i marknadsekonomin?",
            options: [
                "Karl Marx",
                "John Maynard Keynes",
                "Adam Smith",
                "Milton Friedman",
                "Thomas Malthus",
                "David Ricardo"
            ],
            correctIndex: 2
        },
        {
            question: "Vilket problem är vanligt förekommande i planekonomier?",
            options: [
                "Överproduktion av konsumentönskade varor",
                "Bristande effektivitet och resursallokering, ofta brist på varor",
                "För låg sysselsättning på grund av konkurrens",
                "Stora inkomstklyftor mellan individer",
                "För snabb teknologisk utveckling",
                "Instabila priser på grund av marknadsfluktuationer"
            ],
            correctIndex: 1
        },
        {
            question: "Vad menas med 'det ekonomiska kretsloppet'?",
            options: [
                "En beskrivning av hur pengar cirkulerar mellan hushåll, företag, offentlig sektor och finansmarknad",
                "Cykeln av hög- och lågkonjunktur",
                "Processen för hur en produkt utvecklas från idé till färdig vara",
                "Livscykeln för ett genomsnittligt företag",
                "Hur statens budget balanseras varje år",
                "Processen för internationella kapitalflöden"
            ],
            correctIndex: 0
        }
    ],
    mal: [
        {
            question: "Vilket av följande är ett vanligt överordnat mål för ekonomisk politik?",
            options: [
                "Att maximera statens inkomster från böter",
                "Att uppnå högsta möjliga välfärd för medborgarna",
                "Att säkerställa att alla företag går med vinst",
                "Att minimera all internationell handel",
                "Att hålla lönerna så låga som möjligt",
                "Att avskaffa alla former av skatter"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär målet om ekonomisk tillväxt?",
            options: [
                "Att befolkningen ska öka",
                "Att statens budget ska vara i balans",
                "Att värdet av landets totala produktion (BNP) ska öka över tid",
                "Att inflationen ska vara exakt noll",
                "Att alla ska ha samma inkomst",
                "Att exporten ska minska"
            ],
            correctIndex: 2
        },
        {
            question: "Vad innebär målet om låg arbetslöshet (hög sysselsättning)?",
            options: [
                "Att alla ska arbeta deltid",
                "Att så många som möjligt som vill och kan arbeta ska ha ett jobb",
                "Att inga företag får gå i konkurs",
                "Att lönerna ska vara lika för alla jobb",
                "Att endast statliga jobb ska finnas",
                "Att arbetsveckan ska kortas radikalt"
            ],
            correctIndex: 1
        },
        {
            question: "Vad innebär målet om stabilt penningvärde (låg inflation)?",
            options: [
                "Att priserna ska sjunka kraftigt varje år (deflation)",
                "Att priserna ska vara helt oförändrade",
                "Att hålla en låg och stabil inflationstakt för att undvika urholkning av köpkraft och skapa förutsägbarhet",
                "Att värdet på valutan ska fluktuera fritt mot andra valutor",
                "Att Riksbanken ska trycka mer pengar",
                "Att alla priser ska bestämmas av staten"
            ],
            correctIndex: 2
        },
        {
            question: "Vad menas med extern balans (balans i utrikeshandeln)?",
            options: [
                "Att landet inte har någon utlandsskuld",
                "Att export och import är ungefär lika stora över tid",
                "Att landet endast importerar varor",
                "Att landet endast exporterar varor",
                "Att alla handelsavtal omförhandlas varje år",
                "Att landets valuta är starkare än alla andras"
            ],
            correctIndex: 1
        },
        {
            question: "Varför kan det finnas målkonflikter inom ekonomisk politik, t.ex. mellan låg inflation och låg arbetslöshet?",
            options: [
                "Det finns aldrig några målkonflikter",
                "Politiker är oense om målen",
                "Åtgärder för att uppnå ett mål (t.ex. stimulera ekonomin för att minska arbetslösheten) kan försvåra uppnåendet av ett annat mål (t.ex. leda till högre inflation)",
                "Målen är formulerade på ett otydligt sätt",
                "Ekonomiska modeller är alltid perfekta",
                "Utlandet påverkar alltid negativt"
            ],
            correctIndex: 2
        }
    ],
    politik: [
        {
            question: "Vad är finanspolitik?",
            options: [
                "Politik som endast rör finansmarknaden och banker",
                "Politik där staten använder statens budget (skatter och offentliga utgifter) för att påverka ekonomin",
                "Politik som Riksbanken ansvarar för",
                "Politik som reglerar företagens vinstmarginaler",
                "Politik som handlar om internationella handelsavtal",
                "Politik som bestämmer växelkurser"
            ],
            correctIndex: 1
        },
        {
            question: "Vad är penningpolitik?",
            options: [
                "Politik som handlar om att trycka nya sedlar och mynt",
                "Politik som regeringen använder för att sätta skatter",
                "Politik där centralbanken (i Sverige Riksbanken) använder styrräntan och andra verktyg för att påverka inflation och ekonomisk aktivitet",
                "Politik som reglerar lönebildningen på arbetsmarknaden",
                "Politik som styr statens budgetsaldo",
                "Politik som hanterar offentlig upphandling"
            ],
            correctIndex: 2
        },
        {
            question: "Vad är Riksbankens huvudsakliga uppgift i Sverige?",
            options: [
                "Att bestämma skatterna",
                "Att betala ut pensioner",
                "Att upprätthålla ett fast penningvärde (inflationsmålet på 2%)",
                "Att reglera arbetsmarknaden",
                "Att finansiera statens utgifter",
                "Att ge lån till privatpersoner"
            ],
            correctIndex: 2
        },
        {
            question: "Hur kan en sänkning av styrräntan (reporäntan) påverka ekonomin?",
            options: [
                "Den gör det dyrare att låna pengar, vilket dämpar ekonomin",
                "Den har ingen effekt på ekonomin",
                "Den gör det billigare att låna pengar, vilket kan stimulera konsumtion och investeringar",
                "Den leder automatiskt till högre skatter",
                "Den minskar mängden pengar i omlopp",
                "Den stärker värdet på valutan kraftigt"
            ],
            correctIndex: 2
        },
        {
            question: "Hur kan en ökning av offentliga utgifter (t.ex. investeringar i infrastruktur) påverka ekonomin?",
            options: [
                "Den minskar den totala efterfrågan i ekonomin",
                "Den har ingen effekt på sysselsättningen",
                "Den kan öka den totala efterfrågan och stimulera ekonomisk aktivitet och sysselsättning",
                "Den leder alltid till lägre inflation",
                "Den minskar statens budgetunderskott omedelbart",
                "Den tvingar Riksbanken att höja räntan"
            ],
            correctIndex: 2
        },
        {
            question: "Vad menas med en högkonjunktur?",
            options: [
                "En period med hög arbetslöshet och låg tillväxt",
                "En period då priserna sjunker kraftigt (deflation)",
                "En period då den ekonomiska aktiviteten är hög, BNP växer snabbt och arbetslösheten är låg",
                "En period då staten har ett stort budgetunderskott",
                "En period då Riksbanken sänker räntan kraftigt",
                "En period då importen är mycket större än exporten"
            ],
            correctIndex: 2
        },
        {
            question: "Vad menas med en lågkonjunktur?",
            options: [
                "En period med mycket låg inflation eller deflation",
                "En period då den ekonomiska aktiviteten är låg, BNP växer långsamt eller minskar, och arbetslösheten är hög",
                "En period då staten har ett stort budgetöverskott",
                "En period då alla företag går med maximal vinst",
                "En period då Riksbanken höjer räntan kraftigt",
                "En period då exporten är mycket större än importen"
            ],
            correctIndex: 1
        },
        {
            question: "Vilket verktyg används främst av Riksbanken för att styra inflationen?",
            options: [
                "Ändringar i inkomstskatten",
                "Offentliga investeringar",
                "Styrräntan (tidigare reporäntan)",
                "Regleringar av företagspriser",
                "Ändringar i barnbidraget",
                "Arbetsmarknadspolitiska åtgärder"
            ],
            correctIndex: 2
        },
        {
            question: "Vad är syftet med stabiliseringspolitik?",
            options: [
                "Att helt eliminera konjunktursvängningar",
                "Att endast fokusera på långsiktig tillväxt",
                "Att dämpa svängningarna i konjunkturcykeln (både hög- och lågkonjunkturer) med finans- och penningpolitik",
                "Att hålla växelkursen helt fast",
                "Att se till att alla priser är stabila",
                "Att stabilisera befolkningstillväxten"
            ],
            correctIndex: 2
        }
    ]
}; 