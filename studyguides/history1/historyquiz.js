/**
 * Historiequiz Frågedatabas
 * Innehåller frågor för avsnitten Nationalism, Imperialism och Första Världskriget.
 */

// Frågedatabas
window.questionsDB = {
    nationalism: [
        {
            question: "Vad innebar 'nationalitetstanken' som växte fram under 1800-talet?",
            options: [
                "Att alla folk skulle styras av en gemensam kejsare.",
                "Att varje folk med gemensam kultur borde bilda sin egen nationalstat.",
                "Att kungens makt var viktigare än folkets identitet.",
                "Att alla länder borde dela samma språk och religion.",
                "Att man främst identifierade sig med sin lokala region, inte en nation.",
                "Att ekonomisk utveckling var viktigare än kulturell gemenskap."
            ],
            correctIndex: 1
        },
        {
            question: "Vilken händelse anses ha gett stor impuls till nationalismen i Europa?",
            options: [
                "Industriella revolutionen",
                "Franska revolutionen och Napoleonkrigen",
                "Upptäckten av Amerika",
                "Reformationen",
                "Wienkongressen 1815",
                "Kolonialismens början"
            ],
            correctIndex: 1
        },
        {
            question: "Nationalism kunde vara både enande och splittrande. Vilket är ett exempel på dess splittrande effekt?",
            options: [
                "Enandet av Italien",
                "Enandet av Tyskland",
                "Nationalistiska rörelser inom Österrike-Ungern och Osmanska riket",
                "Skapandet av nationalsånger och flaggor",
                "Garibaldis erövring av Sicilien",
                "Bismarcks 'blod och järn'-politik"
            ],
            correctIndex: 2
        },
        {
            question: "Vem var den drivande kraften bakom Italiens enande genom militär kampanj i södra Italien?",
            options: [
                "Kung Viktor Emanuel II",
                "Greve Camillo di Cavour",
                "Otto von Bismarck",
                "Giuseppe Garibaldi",
                "Napoleon III",
                "Påven Pius IX"
            ],
            correctIndex: 3
        },
        {
            question: "Vilken preussisk statsman använde 'blod och järn' (militär makt och Realpolitik) för att ena Tyskland?",
            options: [
                "Kaiser Wilhelm I",
                "General von Moltke",
                "Otto von Bismarck",
                "Johann Fichte",
                "Kung Ludvig II av Bayern",
                "Klemens von Metternich"
            ],
            correctIndex: 2
        },
        {
            question: "Vilka tre krig iscensatte Bismarck för att uppnå Tysklands enande?",
            options: [
                "Krimkriget, Amerikanska inbördeskriget, Boxarupproret",
                "Opiumkriget, Sepoyupproret, Boerkriget",
                "Kriget mot Danmark (1864), Kriget mot Österrike (1866), Kriget mot Frankrike (1870-71)",
                "Napoleonkrigen, Första världskriget, Andra världskriget",
                "Trettioåriga kriget, Sjuårskriget, Nordiska krigen",
                "Italienska enandekrigen, Balkankrigen, Rysk-japanska kriget"
            ],
            correctIndex: 2
        },
        {
            question: "Varför var det svårt att genomföra principen 'en nation, en stat' i Central- och Östeuropa?",
            options: [
                "Folken där saknade nationalistiska känslor.",
                "De stora imperierna (Österrike-Ungern, Osmanska riket) var för starka.",
                "De etniska grupperna var geografiskt blandade och gränser var svåra att dra.",
                "Nationalismen var bara populär bland bönderna, inte eliten.",
                "Industrialiseringen hade inte nått dit ännu.",
                "De flesta föredrog att leva i mångkulturella imperier."
            ],
            correctIndex: 2
        },
        {
            question: "Vad innebar 'Magyarisering' i den ungerska delen av Österrike-Ungern?",
            options: [
                "Att ge alla minoriteter lika rättigheter.",
                "Att främja tysk kultur och språk.",
                "Att försöka påtvinga ungerskt språk och kultur på minoritetsgrupper.",
                "Att uppmuntra invandring från andra delar av Europa.",
                "Att utveckla industrin i Ungern.",
                "Att stärka banden med Österrike."
            ],
            correctIndex: 2
        },
        {
            question: "Vilket område i Europa kallades 'Europas krutdurk' på grund av nationalistiska spänningar och stormaktsrivalitet?",
            options: [
                "Skandinavien",
                "Brittiska öarna",
                "Italienska halvön",
                "Balkanhalvön",
                "Iberiska halvön",
                "Centraleuropa (Tyskland/Frankrike)"
            ],
            correctIndex: 3
        },
        {
             question: "Vilken fredlig händelse 1905 var ett exempel på nationalism som förändrade kartan i Norden?",
             options: [
                 "Finland blev självständigt från Ryssland.",
                 "Danmark sålde Västindien till USA.",
                 "Sverige och Danmark bildade en försvarsallians.",
                 "Norge upplöste unionen med Sverige och blev självständigt.",
                 "Island fick hemstyre från Danmark.",
                 "Sverige införde allmän rösträtt."
             ],
             correctIndex: 3
        }
    ],
    imperialism: [
        {
            question: "Vad är kärnan i begreppet imperialism?",
            options: [
                "Fredligt kulturutbyte mellan nationer.",
                "Att en starkare nation utökar sin makt och kontroll över andra territorier.",
                "Internationellt samarbete genom organisationer.",
                "Frihandel utan tullar mellan alla länder.",
                "Att länder fokuserar på sin egen inre utveckling.",
                "Vetenskapliga upptäcktsresor till okända områden."
            ],
            correctIndex: 1
        },
        {
            question: "Vilken period kallas ofta 'den nya imperialismens' tidsålder?",
            options: [
                "1500-1700",
                "1700-1800",
                "Cirka 1870-1914",
                "Mellankrigstiden (1919-1939)",
                "Efter andra världskriget (1945-)",
                "Renässansen (1400-1600)"
            ],
            correctIndex: 2
        },
        {
            question: "Vad menas med 'Kapplöpningen om Afrika'?",
            options: [
                "En tävling i att bygga den längsta järnvägen genom Afrika.",
                "En intensiv period då europeiska makter tävlade om att kolonisera så mycket av Afrika som möjligt.",
                "Afrikanska länders kamp för självständighet under 1960-talet.",
                "Vetenskapliga expeditioner för att kartlägga Afrikas floder.",
                "Byggandet av Suezkanalen.",
                "En serie idrottstävlingar mellan europeiska och afrikanska lag."
            ],
            correctIndex: 1
        },
        {
            question: "Vilken belgisk kung styrde Kongofristaten som sin personliga egendom med ökänd brutalitet?",
            options: [
                "Kung Albert I",
                "Kung Leopold I",
                "Kung Leopold II",
                "Kung Baudouin",
                "Otto von Bismarck",
                "Drottning Victoria"
            ],
            correctIndex: 2
        },
         {
            question: "Vilken händelse ledde till att Storbritannien tog direkt kontroll över Indien 1858 (Brittiska Raj)?",
            options: [
                "Öppnandet av Suezkanalen",
                "Sepoyupproret 1857",
                "Opiumkriget mot Kina",
                "Boerkriget i Sydafrika",
                "Wienkongressen",
                "Fransk-indianska kriget"
            ],
            correctIndex: 1
        },
        {
            question: "Hur skiljde sig imperialismen i Kina från den i Indien eller Afrika?",
            options: [
                "Kina koloniserades helt av Storbritannien.",
                "Kina delades upp i 'sfärer av inflytande' av flera makter istället för att bli en enda koloni.",
                "Kina lyckades helt motstå europeiskt inflytande.",
                "Kina blev en japansk koloni.",
                "Européerna var endast intresserade av Kinas religion, inte handel.",
                "Kina industrialiserades snabbt med europeisk hjälp."
            ],
            correctIndex: 1
        },
        {
            question: "Vilket asiatiskt land lyckades undvika att bli koloniserat och blev istället självt en imperialistisk makt efter snabb modernisering?",
            options: [
                "Kina",
                "Indien",
                "Siam (Thailand)",
                "Japan",
                "Korea",
                "Filippinerna"
            ],
            correctIndex: 3
        },
        {
            question: "Vad innebar Monroedoktrinen för Latinamerika?",
            options: [
                "Att europeiska makter uppmuntrades att skaffa nya kolonier där.",
                "Att USA förklarade att europeisk inblandning i Amerika inte skulle tolereras.",
                "Att alla latinamerikanska länder skulle bilda en federation.",
                "Att USA skulle köpa alla europeiska kolonier i regionen.",
                "Att frihandel skulle råda mellan Europa och Latinamerika.",
                "Att Latinamerika skulle isolera sig från resten av världen."
            ],
            correctIndex: 1
        },
        {
            question: "Vilka var de främsta ekonomiska drivkrafterna bakom imperialismen?",
            options: [
                "Önskan att sprida demokrati och mänskliga rättigheter.",
                "Behovet av råvaror till industrin och nya marknader för färdiga varor.",
                "Intresset för främmande kulturer och språk.",
                "Att minska överbefolkningen i Europa.",
                "Att etablera militärbaser för försvar av hemlandet.",
                "Religiös missionsverksamhet."
            ],
            correctIndex: 1
        },
        {
            question: "Vad menas med 'den vite mannens börda'?",
            options: [
                "Den tunga skatt som européer fick betala för sina kolonier.",
                "En sjukdom som européer drabbades av i tropikerna.",
                "Idén att det var européernas (och amerikanernas) plikt att 'civilisera' och styra över andra folk.",
                "Svårigheten att transportera varor från kolonierna.",
                "Det dåliga samvete européer kände över kolonialismen.",
                "Den militära bördan att försvara stora imperier."
            ],
            correctIndex: 2
        }
    ],
    wwi: [
        {
            question: "Vilken händelse utlöste första världskriget sommaren 1914?",
            options: [
                "Tysklands invasion av Belgien",
                "Ryska revolutionen",
                "Mordet på ärkehertig Franz Ferdinand i Sarajevo",
                "Sänkningen av Lusitania",
                "Bildandet av Trippelententen",
                "Italiens anfall mot Österrike-Ungern"
            ],
            correctIndex: 2
        },
        {
            question: "Vilka länder utgjorde kärnan i Centralmakterna vid krigsutbrottet?",
            options: [
                "Tyskland, Frankrike, Ryssland",
                "Storbritannien, Frankrike, Ryssland",
                "Tyskland, Österrike-Ungern, Osmanska riket",
                "USA, Storbritannien, Frankrike",
                "Serbien, Ryssland, Belgien",
                "Italien, Japan, Tyskland"
            ],
            correctIndex: 2 // Initially Germany and Austria-Hungary, Ottomans joined later in 1914, but this is the closest option.
        },
        {
            question: "Vad kännetecknade krigföringen på västfronten under större delen av kriget?",
            options: [
                "Snabba framryckningar med kavalleri",
                "Storskaliga sjöslag",
                "Statiskt skyttegravskrig med enorma förluster",
                "Guerillakrigföring i städerna",
                "Avgörande luftstrider mellan stora bombflygplan",
                "Diplomatiska förhandlingar parallellt med striderna"
            ],
            correctIndex: 2
        },
        {
            question: "Vilken ny vapenteknik tvingade fram skyttegravskriget genom att göra frontalanfall extremt kostsamma?",
            options: [
                "Stridsvagnen",
                "Giftgasen",
                "Ubåten",
                "Kulsprutan",
                "Flygplanet",
                "Långdistansartilleri"
            ],
            correctIndex: 3
        },
        {
            question: "Vilken händelse 1917 anses vara en avgörande vändpunkt som stärkte Ententen (de allierade)?",
            options: [
                "Ryska revolutionen och Rysslands utträde ur kriget",
                "Italiens byte av sida",
                "Osmanska rikets kapitulation",
                "USA:s inträde i kriget",
                "Slaget vid Verdun",
                "Obegränsat ubåtskrig från Tyskland"
            ],
            correctIndex: 3
        },
        {
            question: "Vad innebar Versaillesfreden för Tyskland?",
            options: [
                "Tyskland fick behålla alla sina kolonier.",
                "Tyskland fick dela ansvaret för kriget med Österrike-Ungern.",
                "Tyskland tvingades ta på sig hela skulden för kriget, betala enorma skadestånd och begränsa sin militär.",
                "Tyskland delades upp i flera mindre stater.",
                "Tyskland blev medlem i Nationernas Förbund.",
                "Freden var mycket mild och fokuserade på försoning."
            ],
            correctIndex: 2
        },
        {
            question: "Vilken brittisk ekonom kritiserade Versaillesfreden och menade att de hårda villkoren mot Tyskland skulle leda till framtida problem?",
            options: [
                "Adam Smith",
                "David Lloyd George",
                "Winston Churchill",
                "John Maynard Keynes",
                "Karl Marx",
                "Neville Chamberlain"
            ],
            correctIndex: 3
        },
        {
            question: "Vilka nya stater uppstod i Europa efter första världskrigets och imperiernas fall?",
            options: [
                "Frankrike, Spanien, Portugal",
                "Sverige, Norge, Danmark",
                "Polen, Tjeckoslovakien, Jugoslavien",
                "Belgien, Nederländerna, Luxemburg",
                "Indien, Pakistan, Bangladesh",
                "Egypten, Syrien, Irak"
            ],
            correctIndex: 2
        },
        {
            question: "Vad var 'Spanska sjukan' som drabbade världen 1918-1919?",
            options: [
                "En sjukdom som endast drabbade Spanien.",
                "En typ av matförgiftning orsakad av dålig konservering under kriget.",
                "En extremt dödlig influensapandemi som dödade fler människor än själva kriget.",
                "En psykisk åkomma (shell shock) som drabbade soldater.",
                "En tropisk sjukdom som spreds av kolonialtrupper.",
                "En pestepidemi liknande Digerdöden."
            ],
            correctIndex: 2
        },
        {
             question: "Vilken organisation grundades efter första världskriget med målet att förhindra framtida krig, även om den visade sig vara svag?",
             options: [
                 "Förenta Nationerna (FN)",
                 "Europeiska Unionen (EU)",
                 "NATO",
                 "Nationernas Förbund (NF)",
                 "Röda Korset",
                 "Internationella Domstolen i Haag"
             ],
             correctIndex: 3
        },
         {
            question: "Vad innebar Tysklands 'Schlieffenplanen' i början av kriget?",
            options: [
                "En plan för att snabbt besegra Ryssland först.",
                "En defensiv plan för att försvara Tysklands gränser.",
                "En plan för att snabbt besegra Frankrike genom en kringgående rörelse via Belgien, innan Ryssland hann mobilisera fullt.",
                "En plan för att bygga upp en stark ubåtsflotta.",
                "En plan för att starta en revolution i Storbritannien.",
                "En plan för att få Italien att gå med i kriget på Centralmakternas sida."
            ],
            correctIndex: 2
        },
        {
            question: "Vilket nytt vapen introducerades av britterna 1916 vid slaget vid Somme för att försöka bryta skyttegravsstalmatet?",
            options: [
                "Flygplan med kulsprutor",
                "Giftgas (Klor)",
                "Stridsvagnen ('Tank')",
                "Långdistanskanonen 'Big Bertha'",
                "Elkastare",
                "Handgranater"
            ],
            correctIndex: 2
        }
    ]
}; 