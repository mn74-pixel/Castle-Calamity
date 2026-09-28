# Changelog

## 8.4.0 — powrót osiedlowego rozdziału

- przywrócono 12 scen Osiedla jako rozdział dostępny bezpośrednio z menu; historyczna kampania i naprawiony importer zdjęć są zachowane,
- przebudowano fasady: wielka płyta, loggie, klatki schodowe, emaliowane adresy, lastryko, piwnice, anteny i pelargonie,
- dodano kiosk Prasa/Ruch, saturator, malucha, budkę telefoniczną, witryny i video-kasety oraz animowane pranie,
- ulica jest teraz rysowana przed bazami; nie zakrywa ich wejść, a punkt trafienia odpowiada widocznej głowie,
- ograniczono skalę centralnych obiektów na wąskich ekranach, liczbę postaci tła i cache scen,
- sprawdzono pełną bitwę, zachowanie zapisu kampanii i rendery czterech wielkości ekranu.

## 8.3.1 — wycofanie Osiedla i naprawa twarzy

- usunięto cały bonus „Osiedle Wielkiej Awantury”, Menele Studio, renderer, wejścia testowe i zasób z cache PWA,
- pozostawiono „Fort Nieodebranych Meldunków” jako pełny czwarty poziom epoki „Silniki i Radio”,
- naprawiono produkcyjny import twarzy: limit 30 MB, akceptacja zdjęć bez MIME, poprawna orientacja, `createImageBitmap`, Object URL i FileReader fallback,
- zastąpiono programowe otwieranie ukrytego pola natywnymi etykietami pliku oraz dodano widoczny status operacji,
- testy sprawdzają teraz reguły kodu używanego w grze, a nie wyłącznie osobnego modułu demonstracyjnego,
- dodano audyt art direction i bramkę jakości dla przyszłej przebudowy późniejszych epok.

## 8.3.0 — osobne Osiedle i animacje reakcji

- przywrócono „Fort Nieodebranych Meldunków” jako czwarty poziom sekcji „Silniki i Radio”,
- przeniesiono Osiedle do izolowanego trybu bonusowego, który nie zapisuje postępu kampanii,
- dodano fazy picia, uśmiechu, skupienia, zamachu, trafienia, grymasu i odrzutu całej sylwetki,
- rozbudowano efekty uderzeń, nocne oświetlenie, odbicia i dynamiczne detale ulicy,
- dopracowano okna, wejścia, domofony, przewody, cienie bloków i ubiór postaci,
- dodano testy rozdzielenia poziomu epoki od bonusu oraz osobne rendery ekspresji.

## 8.2.6 — twarze i poprawna okluzja miejskiej sceny

- usunięto przenikanie słońca i księżyca przez bloki mieszkalne,
- zastąpiono przezroczystość brył pełnym kolorem oraz kontrolowaną mgłą planów,
- dodano wspólny renderer detali twarzy dla mieszkańców, dostawców i uczestników bójki,
- dodano oczy, brwi, nosy, usta, uszy, policzki i warianty ekspresji czytelne w skali rozgrywki.

## 8.2.5 — poprawka publikacji i wysokich ekranów

- dodano cache-busting dla skryptów i service workera oraz wyłączono dopasowanie cache ignorujące query string,
- poprawiono skalowanie baz, landmarków, ulicy i bloków tła na wysokich ekranach desktopowych,
- przeniesiono panel kondycji poza pole landmarku,
- dodano test i render dużego widoku 1950×1100.

## 8.2.4 — pozioma bryła i polish landmarków

- spłaszczono sylwetkę bocznych baz do jednej szerokiej bryły współczesnego bloku,
- wtopiono klatkę schodową w fasadę i przeniesiono szyldy budynków z dachu na elewację,
- rozbudowano loggię bohatera, skrzydła mieszkalne oraz niskie instalacje dachowe,
- dodano trzy odrębne rytmy fasad w tle zamiast jednolitej siatki okien,
- wzmocniono modelowanie, kontur i detale najważniejszych landmarków.

## 8.2.3 — współczesna architektura Osiedla

- zastąpiono wieżowy układ baz szerokimi blokami mieszkalnymi ze skrzydłami, klatką schodową, wejściem i loggią,
- dodano współczesny rytm okien, płaskie dachy, balustrady, wentylację, anteny i urządzenia techniczne,
- przebudowano trzy plany tła z nieregularnych bloków, pawilonów usługowych, drzew, lamp i parkingu,
- powiększono i nazwano dominujące landmarki wszystkich etapów przy zachowaniu skali oraz czytelności Epoki I,
- zaktualizowano kontrakty testowe gramatyki bazy, landmarków, stylu i cache PWA.

## 8.0.0 — ART RESET Osiedla

- przebudowano renderer Osiedla według jakościowego wzorca wcześniejszych epok,
- statyczne tła aren są renderowane do cache’owanych sprite’ów i ponownie używane między klatkami,
- dodano system warstwowych materiałów: beton/panele, witryny szklane, rolety metalowe, markizy, gradientowe bryły i kontrolowane cienie,
- tła mają trzy warstwy miejskiej głębi, haze, drzewa, lampy i rozbudowane sylwety budynków,
- pawilony i budki otrzymały szkło, światło, markizy i realniejsze cienie,
- samochody zostały przebudowane z prostych prostokątów na pełniejsze bryły z szybami, kołami i modelowanym lakierem,
- dostawcy i menele mają pełne sylwetki dorosłych zamiast linii kończyn, a główny bohater otrzymał osobny shading premium,
- zachowano wydajność przez ograniczony cache scen i brak losowych alokacji materiałów na każdą klatkę.


## 7.9.2 — skala dorosłych, chwianie zamiast dymu i detal aren

- powiększono chodzących dostawców oraz dorosłych NPC o 28%, aby nie wyglądali jak dzieci przy większym bohaterze,
- główny bohater dostał jeszcze większą skalę i twarz, przy zachowaniu limitu na dużych ekranach,
- poziom osłabienia jest liczony z HP i steruje chwianiem całego ciała, ugięciem kolan oraz bobem,
- w Osiedlu wyłączono render dymu, pyłu i żaru jako wskaźników przegranej,
- uderzenia butelek nadal mają szkło i pierścień trafienia, więc feedback nie znika,
- dodano dodatkowe detale środowiska: kałuże, graffiti, pachołki, śmieci, pęknięcia asfaltu i poświaty neonów,
- poprawiono skalę i chód postaci kolejki przy Monopolowym.


## 7.9.1 — postacie, jedzenie i czytelność aren

- usunięto dolny pasek tekstowy z instrukcją Osiedla,
- karta Jedzenie ma teraz dwa stany: zamówienie przy pustym zapasie oraz ZJEDZ po dostawie,
- ręczne zjedzenie nie pobiera ponownie środków i natychmiast uruchamia efekt aktualnego posiłku,
- dostawcy obracają sylwetkę przy powrocie, więc nie chodzą już wspak,
- chód dostał krok, unoszenie stóp, cień kontaktowy i profilową głowę zwróconą w kierunku ruchu,
- postacie tła korzystają bezpośrednio z tej samej skali bazowej co wcześniejsze epoki,
- główny bohater jest większy, ma czytelniejszą twarz, przygotowanie do rzutu i odrzut po wypuszczeniu butelki,
- areny otrzymały mocniejszą perspektywę podłoża, krawężnik, cienie i głębsze osadzenie pawilonów oraz obiektów.


## 7.9.0 — 12 osobnych aren + Menele Studio

- usunięto założenie, że każda scena Osiedla musi być tym samym blokiem z innymi dekoracjami,
- powstało 12 odrębnych typów aren: balkony, sklep, plac z ławką, budka zapiekanek, trzepak/garáže, śmietnik, pizza, nocna brama, kebab, parking, zamknięty pasaż i Nocny Express,
- każda arena ma osobny renderer tła, centrum sceny oraz struktur gracza i przeciwnika, przy zachowaniu wspólnego modelu HP i rzutu,
- bohater gracza i przeciwnika wychodzą z balkonów na ulicę w scenach bez bloku, więc trajektorie butelek odpowiadają faktycznej pozycji postaci,
- dodano Menele Studio z dwoma slotami: imię, twarz i cztery archetypy sylwetki,
- personalizowane twarze są wycinane i zapisywane lokalnie; nie są wysyłane z urządzenia,
- tryb TEST zachowuje blokadę wybranej areny i nadal umożliwia bezpośrednie sprawdzenie 1/12–12/12.


## 7.8.0 — pełny polish Osiedla

- nadano wszystkim 12 segmentom własne rekwizyty, paletę, tempo, krótką wskazówkę i rozpoznawalny hook,
- rozdzielono cztery rodzaje jedzenia mechanicznie: zapiekanka, ogórek, pizza i kebab nie są już wariantami tej samej regeneracji,
- AI planuje dostawy, posiłki i wybór trunku na podstawie zapasu, kondycji i środków,
- po segmentach żywnościowych naturalna regeneracja jest wolniejsza, więc jedzenie rzeczywiście podtrzymuje ofensywę,
- dodano komunikaty kontekstowe, serię trafień, pierścienie uderzenia oraz czytelniejsze stany zablokowanych kart,
- rozbudowano scenografię o budki jedzenia, trzepak, śmietniki, nocne okna, patrol, zamkniętą roletę i finałowy samochód Nocnego Expressu,
- testy tworzą render referencyjny każdego z 12 segmentów i kontrolują unikalność scenografii oraz efektów jedzenia.


## 7.6.0 — Osiem segmentów Osiedla Wielkiej Awantury

- rozbudowano specjalną bitwę V.4 z jednej sceny do ośmiu kolejnych mini-poziomów bez zmiany numeracji kampanii,
- każdy segment ma własny detal osiedla, tempo dostaw i narastający rytm kontrataku,
- od trzeciego segmentu pojawiają się zróżnicowane pary osiedlowych awanturników z krótką, komiczną animacją bójki,
- awanturnicy pozostają warstwą humorystyczną: nie zadają obrażeń, nie blokują dostawców i nie zasłaniają sterowania,
- zachowano obie wgrane twarze, mechanikę butelek, pełny ekran, offline i zgodność istniejących zapisów,
- zwiększono wytrzymałość obu bloków, aby normalna rozgrywka miała czas pokazać końcowe segmenty.


## 0.7.0 — Mobile Fit + Safari Face Studio

- dopasowano całą planszę, pasek misji i sterowanie do jednego poziomego ekranu telefonu,
- dodano osobny zwarty układ dla niskich viewportów Safari z uwzględnieniem bezpiecznych krawędzi i dynamicznego paska adresu,
- Face Studio otwiera się teraz od razu po stuknięciu ikony twarzy, przed wyborem zdjęcia,
- dodano wyraźny przycisk `Wybierz zdjęcie`, pusty ekran startowy i możliwość ponownego wskazania tego samego pliku,
- wczytywanie zdjęć używa oszczędniejszego Blob URL z awaryjnym Data URL dla starszego Safari,
- błędne zdjęcie nie zamyka już edytora, lecz pozostawia czytelny komunikat i możliwość ponownego wyboru,
- podbito wersję cache oraz dodano wersjonowane adresy CSS/JS, aby iPhone nie uruchamiał starego interfejsu 0.5,
- uproszczono instrukcję publikacji przez `main / (root)`, zgodną z aktualnym ustawieniem repozytorium.

## 0.6.0 — Face Studio

- zastąpiono automatyczne, środkowe kadrowanie pełnym lokalnym edytorem twarzy,
- dodano przesuwanie zdjęcia palcem lub myszą, pinch-to-zoom, suwak i obrót o 90°,
- poprawiono obsługę zdjęć z aparatu, formatów z pustym MIME oraz komunikaty błędów,
- usunięto stałe cartoonowe oczy i usta nakładane na prawdziwą twarz,
- reakcje avatara są teraz rysowane wokół zdjęcia, dzięki czemu twarz pozostaje czytelna,
- dodano możliwość ponownej edycji, wymiany i usunięcia zdjęcia w tej samej sesji,
- rozszerzono cache offline, walidację i testy o Face Studio.

## 0.5.0 — GitHub PWA

- usunięto zależność od JUCE, Projucera i Xcode podczas testów,
- przepisano model fizyki do niezależnego modułu JavaScript,
- dodano renderer HTML5 Canvas z wektorową sceną Morning Mayhem,
- zachowano Quick Sling, One Move, cztery osobowości i lokalne zdjęcie twarzy,
- What If powtarza pozycję, wektor i ustawienie trampoliny z poprzedniego strzału,
- dodano proceduralne dźwięki, impact callouts, trail, camera shake i confetti,
- dodano manifest PWA, tryb offline oraz instalację na ekranie początkowym,
- dodano walidację, sześć testów modelu i automatyczną publikację GitHub Pages,
- przygotowano jawny plan późniejszego opakowania natywnego lub migracji do Godota.

## 0.4.0 — JUCE Pro Art

- źródłowa wersja scenografii, kierunku graficznego i modelu użyta jako podstawa migracji.
