Rakendus on realiseeritud Clean Architecture põhimõtetele toetudes. 
Rakenduse paigaldamiseks vajalikud sammud:

1. Lae alla rakenduse kood.
2. Avades faili Proovitöö.sln avaneb Visual Studio koos rakenduse backend koodiga.
3. Visual Studios tuleb teha parem klikk WebApp projektile ja valida Set as Startup Project.
4. Nüüd vajutades klaviatuuril F5 hakkab serveri pool rakendusest tööle.
5. Navigeerida terminalis või näiteks VSCodes \Proovitöö\src\Client asukohta.
6. Teha npm install
7. Käivitada rakenduse front-endi pool käsuga npm start.

Rakenduse front-end on kirjutatud reacti raamistikus typescriptis ja backend C#-s. 
Rakendus töötab hästi välja arvatud Open AI kommentaari genereerimine, sest mul endal tellimust ostetud ei ole sinna ja tasuta krediidi jõudsin ära kasutada.
Kui on soov enda Open AI võtmega kommentaari genereerimist testida, siis tuleb WebApp projektis avada appsettings.json fail, read 9-11 uncommentida ja oma võti jutumärkide vahele lisada.

Vastused meilis olevatele küsimustele:

1. Millal peaks kasutama Context API ja millal Reduxit? Mis on nende peamised erinevused?

Ma isiklikult pole Reduxi väga kasutanud, küll aga uurisin selle kohta nüüd. Context API on Ideaalne väiksematele kuni keskmise suuruste rakendustele.
Muutujate seisundeid on parim jagada komponentide sõltuvuse puu raames ja tahetakse hoida lahendust võimalikult kergena (see on reacti sisse ehitatud ehk ei pea extra teeke tõmbama). Ideaalne väiksematele rakendustele.

Redux on keerulisem kui Context API. See on hea keerulisemate ja suuremate lahenduste jaoks, aga saab aidata ka väiksemaid rakendusi, sest ta pakub rohkem kui Context API.
Sinna saab salvestada muutujate seisundeid keskselt ja erinevatest komponentidest, mis ei pea üksteisega kokku puutuma. Redux sammuti pakub näiteks mitut middleware teeki (nt API kutsungite jaoks) ja paremaid dev toolse.

2. Millised on WebSockets, REST API ja GraphQL peamised erinevused ning millal tuleks ühte või teist kasutada?

Tegu on kliendi (brauseri poole) suhtlemise viisidega serveriga. Neid kasutatakse erinevate asjade jaoks. 
REST on arhitektuuri standard ja kasutab põhiliselt nelja erinevat pärimise viisi: GET (andmete vaatamine), POST (andmete töötlemine või salvestamine), PUT (andmete muutmine või uuendamine) ja DELETE (andmete kustutamine).
Hea kui andmed on suuremas osas muutumatud või muudetakse harva, hea cacheda andmeid ja rakendusel on lihtne struktuur. Halb kui andmeid peab tihti muutma või pärima järjest ja API endpointe on palju ja võivad omavahel väga sarnased olla.

GraphQLiga olen mina kõige vähem nendest kokku puutunud, aga selle idee on et serverist päritakse kõike ühe endpointi kaudu ja kliendi pool peab ise spetsifitseerima mida ta kätte tahab saada. 
Hea on seetõttu et kliendi poolelt saab küsida ainult täpselt seda mida sa tahad kätte saada, ning see on mugav nt rakendustes kus olemite seosed on keerulised ja/või palju nestingut. 
Halb seetõttu et raskem debug’ida, cachimine on keerulisem kui RESTiga ja keerulisem teostada hästi.

Websocket on kahesuunaline suhtluskanal kliendi ja serveri vahel. Kanalit kinni ei panda vahepeal ja saab reaalajas andmeid juurde laadida. Olen ise kasutanud seda nt suuremates andmete tabelites kus on võimalus kõik andmed lehele laadida. 
Websocket ongi hea andmete reaalajas juurde laadimiseks või striimimiseks. Halva külje alt ei ole ta cachetav ja ei tööta hästi http-ga.


3. Mis vahe on monoliitsel arhitektuuril ja mikroteenustel? Millal peaks ühte või teist eelistama?

Monoliitne arhitektuur tähendab seda et rakenduse kogu kood on sõltuv üksteisest ja rakendust ehitatakse kui ühtset tervikut. Kõik eri kihid nagu UI, äriloogika ja andmetele juurdepääsu kiht on osa sellest tervikust.
Rakendust arendatakse ja skaleeritakse ühtse tervikuna. Hea seetõttu et arendada on lihtsam ja selle infrastruktuur on lihtsam, testimine on (vähemalt alguses) lihtsam.
Halb on seetõttu et rakenduse skaleerimine on raske ja ei saa skaleerida eri osasid, koodi sõltuvusi on palju ja pikema aja jooksul on raske hooldada seda, aeglasem arendusprotsess suurema tiimi puhul.

Mikroteenused aga tähendavad rakenduse jagamist väiksemateks iseseisvateks juppideks, millest igaüks vastutab mingi funktsiooni või ärilise väljundi eest. Igat juppi saab eraldi arendada ja skaleerida. 
Hea kui rakenduse skaleeritavus on tähtis, tahetakse kasutada eri keeli või tehnoloogiaid samas rakenduses või sama rakendust arendab mitu erinevat tiimi. 
Halb seetõttu et rakendusel on kohe keerulisem infrastruktuur, rakendus on tavaliselt veidi aeglasem, raskem tervet rakendust testida.


4. Kuidas optimeerida Next.js rakenduse jõudlust, kasutades lazy loading'ut ja dynamic imports?

Nendega saab näiteks laadida komponente ja pilte ainult siis kui need renderdatakse (nii lehel kui ka nt kasutaja tegevuse peale avanevaid teateid/modaale). Samuti saab importida teeke dünaamiliselt, alles siis kui neid päriselt vaja on.
Võib kasutada tööriistu et vaadata, mis võtab kõige rohkem jõudlust bundle’s.


5. Kuidas rakendada rate limiting'ut Express.js-is, et kaitsta API-d ülekoormuse ja kuritarvitamise eest?

Peab seadma limiidi mitu päringut saab üks IP aadress mingis ajavahemikus teha. Saab erinevate päringute/url-ide kohta teha erinevad limiidid nt sisse logimisel võiks olla limiit väiksem kui mõnel vähemtähtsamal päringul.
Saab päringute headeritesse panna tokeneid või kasutaja ID-sid suurema kontrolli jaoks. 
