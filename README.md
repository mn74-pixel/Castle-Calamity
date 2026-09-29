# Castle Calamity

### v8.14.0 — miejsce na sterowanie telefonu i ręczny kadr twarzy

Osiedle rezerwuje 112 px pod polem walki na niskich ekranach. Morale,
kredyty i opis etapu mieszczą się ponad dolnymi przyciskami; wysokość fasad
uwzględnia mniejszą arenę. Historyczne epoki zachowują dotychczasową geometrię.
Testy obejmują 667×375, 844×390, 932×430 i 740×300; rzeczywisty Safari/PWA
pozostaje do ręcznego odbioru (testowy renderer Canvas nie renderuje DOM).

Po wybraniu zdjęcia otwiera się edytor podobny w obsłudze do Slingtoon:
przesuwanie, pinch, suwak, obrót i zatwierdzenie. Automat proponuje tylko
początkowy kadr. PNG ma przezroczysty owal; kolory i proporcje zdjęcia zostają.
Anulowanie zachowuje poprzednią twarz. Wszystko odbywa się lokalnie.
Stare nietrafione wycinki wymagają ponownego wybrania oryginalnego zdjęcia,
ponieważ wcześniejszy zapis nie przechowywał oryginału.

Intro: mandat rozwija się w przesadnie długi paragon, trzepocze podczas pościgu,
a kula przewraca pachołek. Moment przewrócenia wynika z toru kuli, nie z
liczby klatek. Zachowany krótki czas i przycisk pomijania.

### v8.13.0 — dotyk Osiedla, dopracowane intro i audyt mocy

Wejście do Osiedla, wybór segmentów oraz zakupy mają wspólną obsługę
dotknięcia i puszczenia palca. Przesunięcie/anulowanie gestu nie aktywuje
przycisku, a emulowany click nie kupuje drugi raz. Menu nie dziedziczy już
globalnej blokady przewijania dotykowego. Klawiatura i mysz pozostają dostępne.
Automatycznie sprawdzono zdarzenia; odbiór na fizycznym iPhonie jest nadal wymagany.

Intro zachowuje pantomimę, ale dodaje łagodne zbliżenie, trzy plany wzgórz,
perspektywiczny trakt, cienie kontaktowe, nuty, błysk instrumentu i kurz pościgu.
Ruch chmur wynika z czasu sceny; dekoracje są ograniczone liczbowo. Usunięto
liczniki drewna znad drzew w intro. Czas i możliwość pominięcia pozostają bez zmian.

„Menel Marian” nazywa się teraz „Menel”; pozostałe oddziały zostają.
Opisy wszystkich 11 jednostek pokazują rzeczywisty czas odpoczynku i zamachu.
Przewrócony muzyk nie przyspiesza marszu, a przewrócony dozorca nie leczy.
Etapy 6–9 lepiej objaśniają zastosowanie nowych oddziałów; bez inflacji statystyk.

### v8.12.0 — muzyka zakłóca ataki, Bokser i wcześniejszy Marian

Akordeonista nadal kosztuje 30 kredytów, ale ma 130 wytrzymałości i cios 16.
Oprócz premii +20% do marszu sojuszników, muzyka spowalnia odnawianie ataku
rywali w zasięgu 0,13 szerokości areny o 25%. Nie zmienia trwającego zamachu,
nie kumuluje się i nie działa podczas patrolu ani poślizgu grającego.
Fale przy instrumencie i fioletowa nuta przy rywalu pokazują działający efekt.

Menel Marian jest teraz dostępny w etapach 1–4: 20 kredytów, zaczepka 13,
spowolnienie 1,4 s. To wcześniejsza postać Mariana, nie jej duplikat.
Bokser w etapach 6–7 kosztuje 34, ma 150 wytrzymałości i cios 18. Garda
zmniejsza obrażenia od pocisków o 30%, także obszarowych; nie chroni przed
spowolnieniem ani ciosem wręcz. Jest wolniejszy od roweru, ale lepiej znosi
ostrzał. Ma rękawice, opaskę, pas i własną pozycję rąk. AI używa tej samej
gardy i kosztów. Bokser zastępuje kartę rowerzysty na dwa etapy; wcześniej
zrekrutowani rowerzyści zostają. Dostępność piwa nie zmienia się, nadal
maksymalnie osiem kart. Odbiór tempa na fizycznym telefonie pozostaje wymagany.

### v8.11.1 — płynne zatrzymanie i dwuczłonowe nogi

Waga animacji marszu narasta i opada w stałym kroku symulacji, bez zmiany
prędkości jednostek lub timerów ataku. Stopa uniesiona przy zatrzymaniu
łagodnie wraca na podłoże. Patrol oraz poślizg mają pierwszeństwo.
Chodzące postacie, w tym Heniek, używają dwuczłonowej kinematyki nóg
z ograniczeniem zasięgu i zachowaniem długości kończyn. Rowerzysta zachowuje
mechanikę pedałowania. Nie dodano nierównego terenu ani fizycznego rozpędu.
Wersja obejmuje również wszystkie zmiany gradacji z v8.11.0.

### v8.11.0 — ślady awantury i zmęczenie, bez burzenia

Morale 75/50/25% uruchamia kolejne powierzchniowe ślady: zabrudzenia,
odpryski farby, wgnieciony daszek, poluzowaną obejmę i przekrzywioną
skrzynkę kwiatową. Blok zachowuje konstrukcję, drzwi i okna; przy zerze
gospodarz nadal poddaje się z białą flagą. Brak ognia, gruzu i dziur.
Gospodarz dostaje zmęczoną postawę i mimikę oraz cieniowaną koszulę.
Dziesięć oddziałów ma progi przetarć ubrania i zmęczenia twarzy, bez
dodatkowych kar do statystyk. Tempo kroków zależy od faktycznego dystansu,
również przy spowolnieniu i powrocie z kredytami.

Plan rozwoju 2,5D, oddzielający wdrożenie od przyszłego IK, blendowania
i renderów offline: [OSIEDLE-25D-PLAN.md](docs/OSIEDLE-25D-PLAN.md).
Testy ręczne na fizycznym telefonie pozostają wymagane.

### v8.10.0 — Zagrycha, Marian i opcjonalny deszcz

Karta jedzenia ma stały podpis „Zagrycha”. Tło używa niezależnych adresów
mieszkań i zróżnicowanego obłożenia klatek oraz pięter — bez ukośnego wzoru.
Nadal pięć odcieni, ciemne mieszkania i niższy kontrast niż na pierwszym planie.

Marian dołącza w etapach 3–4: 20 kredytów, 120 wytrzymałości, cios 13,
spowolnienie 1,4 s, udźwig rajdu 30. Krótki zasięg i słaby cios wymagają
osłony. Ma kołyszący chód, czapkę, zarost, szalik drużyny i łatany płaszcz.
AI korzysta z niego jako uzupełnienia frontu przeciw szybkim jednostkom.
Karta później ustępuje sąsiadce; istniejące oddziały zostają.

Przycisk DESZCZ przy dolnych kontrolkach włącza opady i trzy widoczne kałuże.
Przejście przez kałużę zatrzymuje oddział na 0,8 s bez obrażeń, z ochroną
przez 8 s przed kolejnym poślizgiem. Obie strony podlegają tym samym zasadom;
powracający z kredytami, wycofani i dostawcy nie przewracają się. Deszcz
domyślnie wyłączony, ustawienie dotyczy bieżącej bitwy. Bez nowych walut,
bez dodatkowej karty i bez rosnącej listy cząstek. Ręczny test telefonu wymagany.

### v8.9.1 — zamieszkane okna i głębia elewacji

Okna obu baz mają niezależne, deterministyczne rytmy (43–114 sekund),
łagodne przejścia, pięć odcieni światła i różne szerokości firanek. Nocą
więcej mieszkań jest rozświetlonych; za dnia dominują odbicia. Odległe
bloki mają statyczny, nieregularny rozkład o mniejszym kontraście.
Światło mieści się we wnękach, bez przebijania przez beton. Cień okapu,
gradient bocznej ściany i przyciemnienie stropu loggii wzmacniają głębię.
Animacja korzysta z czasu gry, nie zegara systemowego; nie rośnie cache
i nie zmienia się stan rozgrywki podczas rysowania. Test na fizycznym
telefonie nadal pozostaje do wykonania.

### v8.9.0 — akordeonista i wózkarz

Dwie nowe role zwiększają katalog Osiedla do dziewięciu oddziałów:
akordeonista (30 kredytów) przyspiesza marsz pobliskich sojuszników o 20%,
bez kumulowania premii. Wózkarz (44 kredyty) wyrzuca paczkę z dystansu:
24 w główny cel przed premią kontr i po 12 w maksymalnie dwa dodatkowe cele.
Nie spowalnia, ma dłuższy zamach i przeładunek, potrzebuje osłony.

Akordeonista dołącza w etapach 7–9, zastępując miejsce karty piwa; wózkarz
zastępuje sąsiadkę od etapu 9. Dozorca zastępuje kartę muzyka od etapu 10.
Wcześniej zrekrutowane postacie zostają. Nadal najwyżej osiem kart, bez limitu
liczby wystawionych oddziałów. AI korzysta z tych samych cen i dostępności.

Własne stroje, miech i klawiatura akordeonu, nutka przy przyspieszonych
sojusznikach, obracające się koła, przestrzenna skrzynia, odrzut i paczka
podczas przeładunku. Wózek zajmuje większy odstęp na swoim pasie. Testy
obejmują zasięgi, sojuszników, brak kumulacji, różne FPS i pełną bitwę.
Ręczny odbiór tempa i animacji na fizycznym telefonie pozostaje wymagany.

### v8.8.2 — objętość ubrań, twarzy i praca całej sylwetki

Pozostałe postacie dostały zaokrąglone kontury kurtek i płaszczy, boczny
światłocień, fałdy materiału oraz modelowane twarze i dłonie. Dalsza ręka
jest rysowana za tułowiem. Chód naprzemiennie odrywa stopy i lekko skręca
tułów; rolki oraz ochraniacze są przypisane do nóg, nie do ruchu kurtki.
Torba sąsiadki podąża za dłonią. Bez zmiany skali postaci, mocy i ekonomii.
To stylizowany efekt objętości w Canvas, nie pełne modele 3D.
Testy automatyczne i podglądy nie zastępują odbioru ruchu na telefonie.

### v8.8.1 — okrągła sylwetka i ciężar ruchu Heńka

Heniek ma własną sylwetkę opartą na krzywych zamiast rozciągniętego tułowia
dresiarza. Zaokrąglona kamizelka ma boczny cień, miękkie światło, wygięty pas
i szwy podążające za brzuchem. Osobna animacja rozdziela stopy, przenoszenie
ciężaru, ugięcie przed ciosem i wychylenie przy trafieniu. Sakiewki i flagi
pozostałych postaci korzystają ze wspólnego rysowania przy dłoni.
Obliczanie pozy jest niezależne od rysowania i nie zmienia stanu walki.
Koszty, moce i rajdy pozostają bez zmian. Odbiór na telefonie nadal ręczny.

### v8.8.0 — rajdy po kredyty i głębsze bryły bloków

Oddział przy obcym bloku zabiera dostępne kredyty zamiast zadawać obrażenia
gospodarzowi. Wraca z sakiewką i dopiero przy własnym budynku oddaje pieniądze.
Udźwig wynosi 150% ceny jednostki, zaokrąglone do całego kredytu; w finale
jest wyższy o 35%. Pusty budżet nie tworzy pieniędzy. Powracający nie walczą,
nie blokują ulicy i kończą służbę po rozliczeniu. AI podlega tym samym regułom.
Gdy bitwa kończy się wcześniej, nierozliczony łup wraca do budżetu źródłowego.
Butelki nadal obniżają morale — warunek zwycięstwa nie został zmieniony.

Bloki otrzymały perspektywiczne ściany boczne, światłocień elewacji, głębsze
ościeża okienne, cienie parapetów i balkonów oraz przestrzenny profil dachu.
To nadal stylizowany Canvas, nie pełny silnik 3D. Architektura mieszkalna,
pozycja bohatera i brak burzenia budynków pozostają bez zmian.

### v8.7.2 — osobowość postaci i spójne detale ruchu

Oddziały mają odrębne fryzury i nakrycia głowy: Heniek zakola i wąsy,
sąsiadka chustę i okulary, dozorca siwe skronie i roboczą czapkę,
rolkarz sportowy kask. Poprawiono światło twarzy, szwy, kieszenie i obuwie.
Rower ma bagażnik, lampę i odblask; obie ręce trzymają kierownicę.
Sąsiadka unosi rękę do rzutu, a kapeć wylatuje z dłoni zamiast ze środka
postaci. Rolki i miotła podążają za kończynami. Bez zmian kosztów i mocy.
Podglądy i testy automatyczne nie zastępują oceny ruchu na fizycznym telefonie.

### v8.7.1 — czytelne role i odrębne stroje

Siedem oddziałów ma osobne stroje i spójny podział na front, szybkie natarcie,
dystans oraz wsparcie. Opisy kart PL/EN podają moc i słabość na podstawie
danych walki. Dozorca pozostaje przy rannym sojuszniku i rusza po uzupełnieniu
wytrzymałości; kij wybiera najbliższy dodatkowy cel. Heniek porusza się ciężej,
rowerzysta szybciej pedałuje, rolkarz ma spokojniejszy rytm odpychania.
Pełny podział: [role oddziałów](docs/OSIEDLE-ROLE.md).

### v8.7.0 — Wielki Heniek rozbija tłok

Nowy ciężki oddział: koszt 54, wytrzymałość 280, uderzenie 44 w główny cel
i 33 w pobliskich przeciwników na sąsiednich pasach. Powolny marsz, zamach
0,55 s i przerwa 2,3 s równoważą siłę obszarową. Szeroka sylwetka, ruch
całego tułowia i krótki krąg pyłu pokazują ciężar uderzenia. Przegrani nadal
odchodzą — bez zabijania i burzenia bloków.

W etapach 10–12 zastępuje kartę dresa z kijem; wcześniej wystawione jednostki
zostają w grze. AI płaci tę samą cenę. Pozostaje najwyżej osiem kart.
Wydanie zawiera także wszystkie poniższe poprawki v8.6.1.

### v8.6.1 — opłacalny rower, dorosła skala i animacje oddziałów

Rowerzysta kosztuje 22 zamiast 28, ma 112 HP i atak 21. Rolkarz kosztuje
30 zamiast 36, ma 125 HP i atak 22. Szybkie oddziały opłacają się do
natarcia i przechwytywania dystansu; front nadal je kontruje, jak w starszych epokach.

Sklep boczny i drzwi są dopasowane do dorosłych postaci. Dostawcy mają skalę
oddziałów, robocze kurtki i czapki; przechodzą za framugę bez kurczenia.
Postacie mają dłuższe nogi, mniejsze głowy, zginane kolana i łokcie,
pedałowanie po okręgu oraz osobny zamach, dokończenie uderzenia i odchylenie
po trafieniu. Testy obejmują kontry obu stron, skuteczność roweru względem
ceny, wejścia w 12 scenach i klatki animacji. Podglądy canvas nie zastępują
odbioru animacji w Safari na fizycznym telefonie.

### v8.6.0 — gradacja oddziałów i działające wejścia do sklepów

Osiedle ma sześć typów bojowników. Dres z kijem zastępuje podstawowego
dresiarza, rolkarz rozwija rolę szybkiego natarcia, a dozorca regeneruje
pobliską ekipę. Karty zależą od etapu: bez przyszłych jednostek i napisów
„dostępne od”. Obowiązuje najwyżej osiem kart, także dla klawiatury i AI.

Dostawy prowadzą do rzeczywistych drzwi bieżącej sceny. Drzwi się otwierają,
dostawca wchodzi, odbiera towar i wraca. Przy ławce czy trzepaku działa mały
sklep boczny, przy zamkniętym sklepie — Express. Zmiana sceny nie usuwa
wejścia podczas przechodzenia przez próg. Patrol nadal uspokaja podwórko.
Szczegóły: [Osiedle v8.6](docs/OSIEDLE-V8.6.md).

### v8.5.1 — bez korków i bez burzenia bloków

Ekipa rozstawia się na trzech pasach podwórka. Jednostki omijają zatrzymanych
sojuszników, zamiast tworzyć jeden szereg za sąsiadką. Nie dodano limitu armii.
Przegrani odchodzą z białą chusteczką; nie padają na ziemię.

Pasek bloku oznacza teraz morale gospodarza. Przy zerze gospodarz osuwa się
za parapet i wystawia białą chusteczkę, a budynek pozostaje nienaruszony.
Wyłączono dla Osiedla pęknięcia, wyburzenie, ruiny i dym; zmieniono też
komunikaty końca bitwy. Historyczne epoki pozostają bez zmian.
Audyt: [Osiedle v8.5.1](docs/OSIEDLE-V8.5.1.md).

### v8.5.0 — Osiedle: ekipy wychodzą na podwórko

Trzy grywalne jednostki: dresiarz trzyma front, rowerzysta szybko naciera na
blok, a sąsiadka rzuca kapciem i spowalnia przeciwnika. Mają własne sylwetki,
animacje, HP i kontry; przeciwnik rekrutuje je za te same środki.
Butelki pozostają wsparciem z balkonu, dostawcy obsługują zapasy.

Etapy trwają po 14 sekund i wprowadzają nowe warunki: kontrolę środka,
leczenie, osłony, nocny zasięg, szybszą rekrutację i przejazd patrolu.
Osiem kart, bez nowej waluty i bez limitu liczby bojowników.
Grafika bloków oraz niezależność rozdziału od kampanii pozostają zachowane.
Szczegóły i ograniczenia odbioru: [Osiedle v8.5](docs/OSIEDLE-V8.5.md).

### v8.4.0 — Osiedle: Polska lat 80. i 90.

Rozdział osiedlowy wraca pod własnym przyciskiem w menu. Zachowuje 12 scen,
dostawy, rzuty, kondycję i mimikę; nie zastępuje czwartej bitwy „Silniki i Radio”.
Nowa oprawa: płaskie bloki z wielkiej płyty, loggie, lastryko, tabliczki
„Słoneczna 7/9”, anteny, pelargonie i animowane pranie. Podwórko otrzymało
kiosk Prasa/Ruch, saturator, malucha, budkę telefoniczną i witryny pawilonów.
W późniejszych scenach pojawiają się video-kasety, gastronomia i nocne światło.

Poprawiono kolejność rysowania ulicy i fasad, celowanie w widoczną twarz,
skalę centralnego obiektu na telefonie oraz ograniczenie pamięci teł.
Detale są stylizowaną interpretacją epoki, nie rekonstrukcją jednego adresu.
Raport i podglądy: [Osiedle v8.4](docs/OSIEDLE-V8.4.md).

### v8.3.1 — wycofanie Osiedla i naprawa importu twarzy

- bonus „Osiedle Wielkiej Awantury” oraz jego osobny edytor postaci zostały całkowicie usunięte z gry i paczki offline,
- poziom 4 „Silniki i Radio” pozostaje właściwym poziomem epoki: „Fort Nieodebranych Meldunków”,
- produkcyjny import twarzy obsługuje zdjęcia do 30 MB, pliki z aparatu bez typu MIME, EXIF/orientację, HEIC/HEIF tam, gdzie dekoduje je przeglądarka, oraz trzy ścieżki awaryjne odczytu,
- selektor zdjęcia korzysta z natywnej etykiety pliku i pokazuje stan przetwarzania albo czytelny błąd,
- przyczyny spadku jakości oraz kryteria następnej przebudowy opisuje `docs/ART-DIRECTION-AUDIT.md`.

### Paczka PWA

Kompletna aplikacja webowa (PWA). Po wgraniu na hosting HTTPS gracze mogą
dodać grę do ekranu głównego telefonu — działa jak natywna aplikacja,
na pełnym ekranie i **offline**.

Rozwój projektu podlega nadrzędnemu kompasowi
`FUN > GAME FEEL > GAMEPLAY > CLARITY > PERFORMANCE > ART > FEATURES`.
Operacyjne kryteria projektowania, audytu i wydania opisuje
`docs/MASTER-ZASADY-PRODUKCJI.md`.

## Nowe rozdziały v7.4.0
- 34 bitwy w sześciu epokach; nowe: **Silniki i Radio** oraz **Wyprawa Orbitalna**,
- osiem nowych jednostek bojowych, rodzime armie, własne bazy i kostiumy pomocników,
- medycy, kontry, artyleria z czterema strzałami i umiarkowana ekonomia,
- zachowane zapisy, zdjęcia, pełny ekran oraz tryb testowania dowolnej bitwy,
- szczegóły: `docs/SZESC-EPOK-V7.4.md`.

## Oprawa epok v7.3.0
- wszystkie 14 bitew epok II–IV: nowe forty, twierdze parowe i cytadele elektryczne,
- odrębne sylwetki budowli, wspólna ze średniowieczem skala i rysunek,
- oryginalne zdjęcie w heraldycznej wnęce każdej bazy,
- nowe warstwy krajobrazu, chmury bez nakładających się obręczy,
- wzmocnione sylwetki, materiały i wyposażenie późniejszych wojsk,
- buforowane budowle z ograniczoną pamięcią; zdjęcia i uszkodzenia na żywo,
- szczegóły: `docs/OPRAWA-EPOK-V7.3.md`.

## Mechanika wprowadzona w v7.0
- jednorazowy mocny cios przy bramie i śmierć zwykłego bojownika; brak kolejki,
- Czarownik dochodzi do bramy przed ostatnim ciosem, zamiast znikać na 3/4 drogi,
- 26 bitew w 4 epokach: Średniowiecze, Proch i Mechanika, Para i Żelazo, Wiek Iskry,
- 8 nowych typów wojsk, odmienne bazy oraz pociski; najwyżej 8 kart na bitwę,
- poprawione efekty audio, limit głosów oraz kompresja sumy,
- szczegóły: `docs/CZTERY-EPOKI-V7.0.md`.

## Poprzedni etap v6.2 (zasada trwałego oblężenia zastąpiona w v7.0)
- trwała walka przy zamku: oddziały nie giną po samym dotarciu do zasięgu,
- wspólna obsługa pocisków przy walce z jednostką i ostrzale muru,
- 18 bitew: 12 średniowiecznych i 6 w epoce Prochu i Mechaniki,
- kanał wymagający ochrony muszkieterów oraz nocna odlewnia artyleryjska,
- szczegóły i ograniczenia testów: `docs/OBLEZENIE-I-KAMPANIA-V6.2.md`.

### Zachowane poprawki v6.1.7
- obniżony dok Deszczu Strzał, Mrozu i Zewu Bitwy w pełnym ekranie,
- czytelna, nieruchoma blokada `2/2` na karcie Drwala po osiągnięciu limitu,
- wspólny stan dostępności dla Drwala i Kamieniarza bez filtrów powodujących miganie Safari,
- bezpieczny dok Deszczu Strzał, Mrozu i Zewu Bitwy w pełnym ekranie telefonu,
- zachowanie wszystkich poznanych zdolności po przejściu z Epoki I do Epoki II,
- prawdziwe przyciski zdolności z pewniejszą obsługą dotyku,
- przycisk pełnego ekranu dostępny zarówno w menu, jak i podczas bitwy,
- natywne wejście i wyjście z pełnego ekranu na zgodnych przeglądarkach oraz ponowne przeliczenie bezpiecznego obszaru po każdej zmianie,
- uruchamianie zainstalowanej PWA poziomo bez paska przeglądarki; na iPhonie Safari przycisk pokazuje krótką instrukcję „Do ekranu początkowego”,
- lokalne wykrywanie największej twarzy na zdjęciu, automatyczne powiększenie i zapis przezroczystego wycięcia 192×192,
- prawdziwe kolory fotografii bez filtra cartoon, kwantyzacji i wysyłania zdjęcia poza urządzenie,
- miękka maska usuwająca otoczenie głowy oraz lokalny tryb zapasowy dla urządzeń bez natywnego wykrywacza twarzy,
- zachowane proporcje twarzy na głównej tarczy zamku, pionowym bannerze i chorągwi,
- menu „Twarze na zamkach” zamiast mylącego opisu herbów; starsze zdjęcie trzeba dodać ponownie, aby otrzymało nowe wycięcie,
- wędkarz z poziomu 1 jest małą półpostacią we wnęce centralnej wieży: najpierw wciąga but, a następnie chowa się pionowo za parapetem bez zanikania,
- całkowicie stabilne karty wyboru wojsk: bez pulsowania jasności, przełączania klas, zapisywania tej samej ceny 60 razy na sekundę ani przesuwania i skalowania kafelka,
- 16 poziomów w dwóch epokach i 18 dostępnych jednostek, nadal najwyżej 8 kart w pojedynczej bitwie,
- brak sztywnego limitu żywych bojowników: można wystawiać kolejne jednostki, dopóki wystarcza drewna; czas potrzebny na zdobycie zasobu naturalnie reguluje tempo armii,
- osobny limit dwóch Drwali i dwóch Kamieniarzy na stronę, aby zaplecze nie tworzyło korków,
- obniżone HP zamków, mnożniki drewna i tempo odrostu drzew od pierwszej bitwy; poziom 1 ma zamki po 950 HP,
- prosty licznik żywej armii `⚔ liczba` przy obu zamkach, bez sztucznego sufitu i bez przygaszania kart,
- mniejszy wspólny budżet cząstek pyłu, iskier, dymu, żaru i wybuchów, szczególnie ważny w poziomie 12,
- samodzielne ceglane forty Epoki II — bez średniowiecznego zamku widocznego pod nową grafiką,
- dwa nowe rzadkie warianty humoru: uciekający sztandar i urzędnik prochowy; nadal najwyżej jeden gag na bitwę,
- wspólną skalę żołnierza dla wszystkich humorystycznych postaci ludzkich na komputerze i telefonie,
- poprawiony widoczny obszar i bezpieczne marginesy dla różnych iPhone’ów, wycięć ekranu oraz zwijanego paska Safari,
- pierwszy poziom z trzema drzewami, limitem trzech odrostów, wolniejszą ekonomią i zamkami o 950 HP,
- liczby HP pod zamkami aktualizowane z tego samego odczytu co szerokość pasków,
- pierwszy zamknięty rozdział Epoki II „Proch i Mechanika”: 4 poziomy, Pikinier, Muszkieter, Saper i Moździerz,
- ceglane bastiony, manufaktury, dym prochowy, fizyka muszkietów i moździerzy oraz osobna pula dyskretnego absurdu Epoki II,
- pełny audyt zasad wszystkich 18 jednostek: bojownicy i artyleria atakują poprawnie, role wsparcia są rozdzielone, a bossowie pozostają poza talią,
- Kamieniarza wykonującego do trzech kursów; każda dostawa natychmiast lekko naprawia mur i pokazuje postęp, a trzeci kurs kończy etap rozbudowy,
- wyraźny błysk zaprawy, rusztowanie, bloki i trzy nity postępu przy zamku zamiast niemal niewidocznego wyniku pracy Kamieniarza,
- nowe pełne sylwetki Czarownika i Kamieniarza oraz zgodne z nimi ikony kart,
- rzadki gag samolotu w poziomach 7–12: spadochroniarz brudzi najbliższego żołnierza bez obrażeń, ląduje, odcina czaszę i ucieka,
- pranie tylko na jednym zamku w poziomie 7; poziom 1 ma teraz wędkarza wyławiającego but,
- Epokę II odblokowywaną po ukończeniu 12 bitew średniowiecza, z własną mapą i osobnym zapisem ukończeń,
- naprawę korka tworzonego przez Drwali przeciwnika przed Golemem, Czarownikiem i kolejnymi jednostkami,
- pociski dystansowe trafiają teraz Drwali i Kamieniarzy zamiast utrzymywać ich jako niezniszczalny cel,
- priorytet prawdziwych jednostek bojowych nad zapleczem oraz krótki zasięg przechwytywania wsparcia przez ciężką piechotę,
- krótki raport po bitwie pokazujący trzy najbardziej przydatne jednostki zamiast kolejnego panelu podczas walki,
- rzeczywisty pomiar obrażeń jednostek i zamku, leczenia Mnicha, złota Drwala oraz dostaw i napraw Kamieniarza,
- zapisywanie skuteczności osobno dla każdego poziomu; po porażce najlepsza sprawdzona jednostka może uzupełnić projektową podpowiedź składu,
- brak ukrytego skalowania przeciwnika na podstawie wyników gracza — dane służą wyłącznie raportowi i wskazówkom,
- maksymalnie 8 kart w jednej bitwie; pełny katalog jednostek rotuje zależnie od zagrożenia i kontr poziomu,
- złote oznaczenie szczególnie przydatnych jednostek bez ukrytej premii do statystyk,
- krótki raport przed Królem Demonów z czterema właściwymi kontrami: Oszczepnikiem, Mnichem, Czarownikiem i Golemem,
- subtelną zmianę sylwetki i detali zamku po poziomie 6 oraz drugi niewielki krok od poziomu 11,
- trzy pojedyncze gagi zamkowe zamiast powtarzanego motywu: pranie na poziomie 7, czajnik na poziomie 9 i przysypiający strażnik na poziomie 11,
- lekki fizyczny odstęp maszerujących jednostek, dzięki któremu postacie nie zlewają się w jeden stos,
- policjanta o tej samej skali bazowej co żołnierze — zarówno podczas bitwy, jak i w intrze,
- zasięg oszczepnika 175 jednostek, czyli nieco większy od zasięgu łucznika 170,
- stałą symulację 60 Hz niezależną od liczby klatek renderowania,
- ciągłe wykrywanie kolizji na całej drodze pocisku, dzięki czemu szybkie strzały, oszczepy i kule nie przeskakują przez cel,
- dokładne całkowanie grawitacji oraz efekty wstrząsu i błysku liczone czasem symulacji,
- lekkie cienie kontaktowe piechoty i cienie pod lecącymi strzałami, bełtami oraz oszczepami,
- odporny tryb offline: dokument gry wraca z pamięci, a brakujący skrypt nie jest zastępowany błędnym HTML-em,
- automatyczny tryb oszczędny dla starszych telefonów: mniejszy bufor Retina, około 30 kl./s i niższa gęstość wyłącznie dekoracyjnych efektów,
- zatrzymanie renderowania i dźwięku po schowaniu aplikacji bez nadrabiania bitwy po powrocie,
- wspólny bufor szumu Web Audio zamiast nowej alokacji pamięci przy każdym huku lub trafieniu,
- opcjonalny samouczek pierwszego poziomu, który można pominąć i uruchomić ponownie,
- przełącznik języka polskiego i angielskiego z zapisem wyboru,
- mapę kampanii w kształcie jednej czytelnej trasy: ukończone, bieżące, zablokowane i bossowskie bitwy są rozróżnione graficznie,
- trwały zapis ukończeń, najlepszych czasów, pieczęci oraz wybranych ulepszeń kampanii,
- trzy pieczęcie ulepszeń za pierwsze ukończenie poziomu — bez ponownego naliczania nagrody za powtarzanie tej samej bitwy,
- proceduralny system audio Web Audio z zapisem głośności i osobną regulacją motywów bossów,
- odrębne, krótkie sygnały łuku, kuszy, oszczepu, armaty, Deszczu Strzał, Mrozu i Zewu Bitwy,
- krótkie motywy wejścia i kolejnych faz Władcy Krwawej Łuny oraz Króla Demonów,
- fundament jednego silnika obsługującego w przyszłości pakiety różnych epok,
- poprawione skalowanie postaci oraz HUD-u na telefonach w poziomie,
- pięć całkowicie przebudowanych sylwetek premium: mnich, Kamieniarz, golem, Czarownik oraz profilowy oszczepnik z pustą dłonią po rzucie,
- wielowarstwowe tła z bardzo wolną paralaksą chmur, wzgórz i gór, mgłą atmosferyczną oraz odległymi ruinami,
- rozbudowane efekty Mrozu i Zewu Bitwy bez zmiany ich balansu,
- przywróconą, lżejszą oprawę Deszczu Strzał z v4.5 — bez szerokich pasów cienia i dodatkowych kręgów,
- trzy progresywne stany uszkodzeń zamku: pęknięcia, wyłomy, osmalenia, rumowisko, odsłonięte belki i zerwany łańcuch,
- osobne efekty lotu i trafienia dla magii, demonicznego ognia, bełtu, oszczepu i kuli armatniej,
- całkowicie nowy zestaw ikon PWA 192/512 px z bezpieczną kompozycją maskowalną,
- zasięg łucznika zwiększony do 170 jednostek i skalowany do wysokości pola bitwy,
- formację łuczników: dwóch pobliskich łuczników aktywuje subtelną aurę, +12% ataku i szybszą salwę,
- zasięg czarownika zwiększony do 180 jednostek,
- przeprojektowanego łucznika ustawionego profilem do celu,
- wysoką, kontrolowaną parabolę kuli armatniej z cieniem, smugą i efektem uderzenia,
- naprawiony pełny rzut oszczepnika: wypuszczenie z dłoni, czytelna smuga i balistyczny lot,
- kamieniarza od poziomu 7: maksymalnie dwóch naraz, do trzech kursów na postać, natychmiastową naprawę po każdej dostawie i trzy wizualne etapy rozbudowy zamku,
- każda ukończona rozbudowa dodaje 7,5% maksymalnego HP zamku (łącznie 22,5%); późniejsze dostawy lekko naprawiają mury,
- krótsze, 13,35-sekundowe intro bez napisów i HUD: policjant wystawia mandat kuli armatniej, po czym regulamin przegrywa,
- pięć doktryn przeciwnika: zrównoważoną, defensywną, agresywną, oblężniczą i chaotyczną,
- umiarkowane kontry jednostek z opisem w podpowiedziach i dyskretnym efektem trafienia,
- dwóch prawdziwych bossów na polu walki: Władcę Krwawej Łuny na poziomie 10 i Króla Demonów na poziomie 12,
- trzy czytelne fazy każdego bossa, osobny pasek HP, zapowiadane ataki i nagrodę za pokonanie,
- Władcę Łuny z aurą, rozkazem, szarżą i jednorazową przerwą na herbatę oraz Króla Demonów z seriami ognia, portalami i teleportem,
- celowany Deszcz Strzał w trzech falach,
- Mróz trwający 3,8 s i obejmujący nowe jednostki wroga,
- dwanaście właściwych gagów poziomów oraz jeden rzadki wariant samolotu — nadal najwyżej jeden podczas bitwy; kartki latającego biurka nie przeskakują między końcami pętli,
- osobny dyskretny absurd scenograficzny na każdym z 12 poziomów,
- latającą rybę z łatwo zmienianym proporcem reklamowym,
- trwały zapis postępu i własnych twarzy zamkowych w pamięci urządzenia.

## Zawartość paczki
| Plik | Rola |
|---|---|
| `index.html` | Silnik, grafika Canvas, poziomy, intro i interfejs |
| `content/gags.js` | Częstotliwość humoru i treść reklamy na rybie |
| `content/i18n.js` | Polskie i angielskie teksty gry |
| `content/eras.js` | Rejestr dwóch aktywnych pakietów epok i warunek odblokowania Epoki II |
| `manifest.json` | Metadane aplikacji: nazwa, ikony, fullscreen i landscape |
| `sw.js` | Service worker i pamięć offline |
| `assets/icons/` | Zwykłe i maskowalne ikony aplikacji |
| `docs/KATALOG-PLIKOW.md` | Mapa paczki i wskazówki, gdzie wprowadzać zmiany |
| `docs/MASTER-ZASADY-PRODUKCJI.md` | Nadrzędny kompas projektu, pięć warstw audytu i bramka każdego wydania |
| `docs/PLAN-DZIALANIA.md` | Etapy dalszego rozwoju gry |
| `docs/AUDYT-V4.4.md` | Wyniki audytu, wykonane poprawki i pozostawione ryzyka |
| `docs/ETAP-BOSSOW-V4.5.md` | Zachowania, balans i testy bossów poziomów 10 i 12 |
| `docs/GRAFIKA-PREMIUM-V4.6.md` | Nowe animacje jednostek, głębia plansz i efekty umiejętności |
| `docs/ZNISZCZENIA-I-POCISKI-V4.7.md` | Progi uszkodzeń zamków, efekty pocisków i nowa ikona PWA |
| `docs/AUDIO-I-KAMPANIA-V4.8.md` | System audio, mapa kampanii i trwały zapis ulepszeń |
| `docs/WYDANIE-PWA-V4.9.md` | Tryb offline, optymalizacja pamięci i starszych telefonów |
| `docs/GRAFIKA-I-FIZYKA-V5.0.md` | Skala policjanta, balans oszczepnika i stabilna fizyka pocisków |
| `docs/ROTACJA-I-ZAMKI-V5.1.md` | Talie do 8 kart, raport Króla Demonów, ewolucja zamków i fizyka szyku |
| `docs/RAPORT-BITEWNY-V5.2.md` | Pomiar skuteczności jednostek, raport po bitwie i adaptacyjne podpowiedzi |
| `docs/NAPRAWA-KORKOW-V5.2.1.md` | Naprawa niezniszczalnych Drwali, priorytetów celu i blokowania szyku |
| `docs/AUDYT-JEDNOSTEK-I-HUMOR-V5.3.md` | Audyt 14 jednostek, czytelny Kamieniarz, nowe sylwetki i gag spadochroniarza |
| `docs/EPOKA-II-I-IPHONE-V6.0.md` | Poprawki iPhone, balans poziomu 1, synchronizacja HP i pierwszy rozdział Epoki II |
| `docs/BALANS-WYDAJNOSC-I-FORTY-V6.1.md` | Limity aktywnej armii, ekonomia, poziom 12, forty Epoki II i skala humoru |
| `docs/POPRAWKA-HUD-WEDKARZ-I-ARMIA-V6.1.2.md` | Nieruchome karty, wędkarz w wieży i armia regulowana zasobami zamiast limitem liczebności |
| `docs/TWARZE-NA-ZAMKACH-V6.1.3.md` | Lokalne wykrywanie, kadrowanie i wyszparowanie prawdziwej twarzy bez cartoon |
| `docs/TRYB-PELNOEKRANOWY-V6.1.4.md` | Przycisk pełnego ekranu, bezpieczny viewport i zachowanie iPhone PWA |
| `docs/POPRAWKA-ZDOLNOSCI-FULLSCREEN-V6.1.5.md` | Widoczny dok zdolności oraz trwałe odblokowanie między epokami |
| `docs/CZYTELNE-KARTY-WSPARCIA-V6.1.7.md` | Obniżony dok zdolności i stabilne oznaczenie limitu Drwali oraz Kamieniarzy |
| `docs/ARCHITEKTURA-EPOK.md` | Zasady wspólnego silnika i przyszłych epok |

## Wdrożenie — GitHub Pages (darmowe, 5 minut)
1. Załóż repo na github.com (np. `castle-calamity`), może być publiczne.
2. Wgraj WSZYSTKIE pliki z tej paczki do głównego katalogu repo.
3. Wejdź do swojego repozytorium, kliknij zakładkę **Settings** w górnym pasku, a potem **Pages** w menu po lewej. Ustaw Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Po ~1 min gra działa pod `https://TWOJA-NAZWA.github.io/castle-calamity/`.

## Wdrożenie — własny hosting (np. funkycats.pl)
Wgraj pliki przez FTP do katalogu, np. `public_html/castle/`.
Wymóg: **HTTPS** (service worker nie działa po HTTP). Certyfikat Let's Encrypt wystarczy.

## Instalacja na telefonie (co zobaczy gracz)
- **Android/Chrome**: otwiera URL → Chrome sam zaproponuje "Dodaj do ekranu głównego" (albo menu ⋮ → Dodaj do ekranu głównego). Ikona zamku pojawia się jak aplikacja.
- **iPhone/Safari**: otwiera URL → przycisk Udostępnij → "Do ekranu początkowego".
- Po instalacji gra uruchamia się **na pełnym ekranie, bez paska przeglądarki, działa bez internetu**.

## Aktualizacja gry
Podmień zmienione pliki na hostingu i zwiększ w `sw.js` wersję cache,
np. `castle-calamity-v6.1.7` → `castle-calamity-v6.2`.
Gracze dostaną nową wersję przy następnym otwarciu z internetem.

## Test lokalny (opcjonalnie)
W katalogu paczki: `python3 -m http.server 8000` → http://localhost:8000
(Service worker działa na localhost bez HTTPS.)

## Następny krok: Google Play
Ta paczka to gotowy fundament pod sklep Google (TWA/Bubblewrap).
Potrzebne: konto Google Play Developer (25$ jednorazowo) + URL z tej paczki.
