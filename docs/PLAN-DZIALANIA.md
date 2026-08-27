# Castle Calamity — plan działania

## Priorytet nadrzędny

Najpierw kończymy jeden stabilny, skalowalny i użyteczny silnik oraz pełną
kampanię średniowieczną. Następne epoki będą pakietami danych i grafiki, nie
kopiami projektu. Szczegóły: `ARCHITEKTURA-EPOK.md`.

## Fundament v4.1

Status: **wdrożony do testów**

- opcjonalny czterostopniowy samouczek w prawdziwym poziomie 1,
- przeciwnik nie atakuje podczas objaśnień,
- możliwość pominięcia i ponownego uruchomienia samouczka,
- zapamiętywanie ukończenia samouczka,
- przełącznik PL/EN i zapamiętywanie języka,
- osobne pliki tłumaczeń oraz rejestru epok,
- aktywny wyłącznie pakiet średniowieczny.

## Poprawki v4.2

Status: **wdrożone i sprawdzone automatycznie**

- poziomy 4 i 5 ponownie korzystają z poprawionych łuczników,
- łuk, kusza i oszczep mają celowane tory balistyczne zamiast nurkowania w ziemię,
- przeciwny oszczepnik poprawnie odwraca broń w lewo,
- armata otrzymała wyższą parabolę zależną od dystansu i rozmiaru ekranu,
- zasięg łucznika wzrósł do 170, a dwóch łuczników tworzy formację z aurą,
- każdy poziom ma własny gag przelotowy; w jednej bitwie pojawia się on najwyżej raz,
- poziom 4: rycerz lecący na chmurze, poziom 5: konserwator polerujący księżyc,
- nowe gagi zachowują pełny przebieg od krawędzi do krawędzi bez widocznej pętli.

## Następny etap v4.3

Status: **wdrożony i sprawdzony automatycznie**

- oszczepnik faktycznie wypuszcza broń z dłoni; wydłużony oszczep i krótka smuga pokazują cały lot,
- kartki za latającym biurkiem mają ciągły ruch bez modulo, teleportowania i widocznego końca pętli,
- od poziomu 7 dostępny jest Kamieniarz kupowany za złoto,
- maksymalnie dwóch kamieniarzy jednej strony pracuje równocześnie,
- jednostka automatycznie idzie do jednego z trzech kamieniołomów i wraca z blokiem,
- co trzy dostawy zamek przechodzi jeden z trzech widocznych etapów rozbudowy,
- każdy etap daje 7,5% maksymalnego HP; pełna rozbudowa daje 22,5%,
- po trzecim etapie kolejne dostawy wykonują tylko lekką naprawę murów,
- nie dodano osobnego licznika kamienia ani sklepu budowlanego, więc ekonomia pozostaje prosta,
- przeciwnik poznaje Kamieniarza dopiero od poziomu 8, aby poziom 7 był czytelnym wprowadzeniem mechaniki.

## Audyt i etap v4.4

Status: **wdrożony i sprawdzony automatycznie**

- intro skrócono z 18,6 do 13,35 sekundy i usunięto z obrazu HUD oraz napisy,
- nowa pantomima ma jeden główny żart: policjant wystawia mandat kuli armatniej,
  po czym ucieka przed nią przez cały ekran,
- wprowadzono profile AI: zrównoważony, defensywny, agresywny, oblężniczy i chaotyczny,
- AI uwzględnia skład armii gracza oraz unika bezmyślnego powtarzania tej samej jednostki,
- wprowadzono umiarkowane kontry i zmniejszono dominację ukrytego poziomu `tier`,
- relacje kontr opisano w podpowiedziach kart, bez dodawania kolejnego panelu podczas bitwy,
- pełny raport znajduje się w `AUDYT-V4.4.md`.

## Etap bossów v4.5

Status: **wdrożony i sprawdzony automatycznie**

- poziomy 10 i 12 mają prawdziwych bossów poruszających się i walczących na polu bitwy,
- każdy boss ma trzy fazy zależne od własnego HP oraz osobny pasek stanu,
- Władca Krwawej Łuny wzmacnia pobliskich sojuszników, wydaje rozkaz i wykonuje zapowiadaną szarżę,
- w trzeciej fazie Władca robi jedną krótką przerwę na herbatę, która daje graczowi oddech,
- Król Demonów strzela jedną, dwiema lub trzema kulami zależnie od fazy,
- portale Króla są widoczne przed przywołaniem i utrzymują najwyżej dwóch dodatkowych sług,
- od drugiej fazy Król może zapowiedzieć i wykonać krótki teleport w stronę własnego zamku,
- każdy boss daje jednorazową nagrodę; nie znika po dotarciu do zamku gracza,
- szczegóły i zakres testów znajdują się w `ETAP-BOSSOW-V4.5.md`.

## Grafika premium v4.6

Status: **wdrożona i sprawdzona automatycznie oraz na renderach referencyjnych**

- mnich, golem i oszczepnik nie korzystają już z ogólnego korpusu z nałożonym dodatkiem,
- mnich ma pracujący habit, kostur i odrębną pozę aktywnego leczenia,
- golem ma asymetryczne bloki, artykułowane ramiona i nogi, przenoszenie ciężaru oraz uderzenie oburącz,
- oszczepnik idzie profilem, pokazuje kierunek celu i przez moment po rzucie ma wyraźnie pustą dłoń,
- ikony kart tych jednostek korzystają z nowych sylwetek,
- chmury, odległe ruiny, góry i wzgórza tworzą kilka wolno poruszających się planów,
- Deszcz Strzał ma trzy przesuwające się fale cienia i kręgi trafień,
- Mróz ma falę przechodzącą po ziemi, lodowe odłamki i czytelniejszą bryłę lodu na jednostkach,
- Zew Bitwy ma rozszerzający się pierścień, znak sztandaru i subtelną aurę na jednostkach,
- zasięgi, obrażenia, czasy działania i skalowanie z v4.5 pozostały bez zmian,
- szczegóły i zakres testów znajdują się w `GRAFIKA-PREMIUM-V4.6.md`.

## Zniszczenia, pociski i ikony v4.7

Status: **wdrożone i sprawdzone automatycznie oraz na renderach referencyjnych**

- cofnięto nieudaną oprawę Deszczu Strzał z v4.6 do czytelniejszej wersji v4.5,
- zamki przechodzą przez trzy widoczne progi uszkodzeń przed końcowym zawaleniem,
- trafienie zamku ma miejscowy błysk, a przekroczenie progu wywołuje krótki wstrząs konstrukcji,
- magia, demoniczny ogień, bełt, oszczep i kula armatnia mają odrębne efekty lotu oraz uderzenia,
- nowa ikona PWA przedstawia zamek, miecz, pióro i dyskretnie absurdalnego koronowanego kaczego herolda,
- wszystkie cztery pliki ikon są generowane z jednego źródła SVG,
- nie zmieniono obrażeń, zasięgów, kosztów, czasu umiejętności ani częstotliwości humoru,
- szczegóły i testy znajdują się w `ZNISZCZENIA-I-POCISKI-V4.7.md`.

## Audio i kampania v4.8

Status: **wdrożone i sprawdzone automatycznie**

- łuk, kusza, oszczep, armata i trzy umiejętności mają odrębne krótkie sygnały,
- powtarzalne odgłosy są ograniczone czasowo, aby duże starcie nie tworzyło hałasu,
- bossowie mają różne motywy wejścia i kolejnych faz,
- ustawienia głośności, motywów oraz wyciszenia są zapisywane,
- techniczny rząd przycisków zastąpiła graficzna mapa 12 bitew,
- mapa rozróżnia poziomy ukończone, bieżące, zablokowane i bossowskie,
- pierwsze zwycięstwo daje trzy pieczęcie; powtórka nie nalicza nagrody ponownie,
- ukończenia, najlepsze czasy, pieczęcie i wybrane ulepszenia są trwałe,
- istniejący postęp gracza jest automatycznie migrowany,
- szczegóły i testy znajdują się w `AUDIO-I-KAMPANIA-V4.8.md`.

## Wydanie PWA i optymalizacja v4.9

Status: **wdrożone i sprawdzone automatycznie; pozostaje próba na fizycznym iPhonie i Androidzie**

- Service Worker rozróżnia nawigację od skryptów i obrazów, dzięki czemu nie zwraca dokumentu HTML w miejscu brakującego pliku,
- komplet dziesięciu zasobów startowych jest zapisywany przy instalacji i uruchamia grę bez internetu,
- powtarzające się sygnały zmiany rozmiaru nie zerują ponownie tego samego bufora Canvas,
- urządzenie o małej pamięci lub liczbie rdzeni startuje w trybie oszczędnym, a inne przełącza się dopiero po trwałym spadku płynności,
- tryb oszczędny ogranicza DPR do 1,25, renderuje w budżecie około 30 kl./s i redukuje wyłącznie dekoracyjne cząstki,
- schowanie karty zatrzymuje pętlę obrazu i audio; po powrocie bitwa nie nadrabia czasu spędzonego w tle,
- odgłosy szumu korzystają ze współdzielonego AudioBuffer zamiast tworzyć nową tablicę próbek przy każdym trafieniu,
- balans, liczba jednostek, audio, kampania i wygląd na mocniejszym sprzęcie pozostają bez zmian,
- szczegóły i zakres testów znajdują się w `WYDANIE-PWA-V4.9.md`.

## Grafika i fizyka v5.0

Status: **wdrożone i sprawdzone automatycznie**

- policjant korzysta z tej samej skali bazowej co żołnierze w bitwie i obu wariantach intro,
- zasięg oszczepnika wynosi 175, więc nie jest mniejszy od zasięgu łucznika 170,
- pocisk oszczepnika jest dłuższy, ma czytelniejszy grot, lotki, smugę i cień na ziemi,
- piechota otrzymała lekkie cienie kontaktowe, które nie wymagają kosztownego rozmycia,
- logika walki pracuje stałym krokiem 60 Hz, podczas gdy obraz może nadal działać w trybie 30 lub 60 kl./s,
- szybkie pociski sprawdzają cały odcinek ruchu w danym kroku, a nie tylko pozycję końcową,
- grawitacja uwzględnia pełne przesunięcie w kroku, a czas błysków i wstrząsów nie zależy od tempa renderowania,
- szczegóły i testy znajdują się w `GRAFIKA-I-FIZYKA-V5.0.md`.

## Rotacja jednostek i ewolucja zamków v5.1

Status: **wdrożone i sprawdzone automatycznie oraz na renderach referencyjnych**

- pełny katalog 14 jednostek pozostaje w grze, ale jedna bitwa pokazuje najwyżej 8 kart łącznie z zapleczem,
- talie gracza i AI są dobierane do doktryny, ciężaru armii i kontr danego poziomu oraz nie zawierają duplikatów,
- szczególnie przydatne jednostki są oznaczane małą złotą gwiazdką bez ukrytego bonusu do statystyk,
- poziom 12 otrzymał krótki raport o seriach ognia, portalach i trzech kulach Króla Demonów,
- zamek po poziomie 6 zmienia sylwetkę i detale tylko nieznacznie, a od poziomu 11 przechodzi drugi lekki krok,
- pranie występuje wyłącznie jako gag poziomu 7 po stronie gracza; poziomy 9 i 11 mają inne pojedyncze gagi zamkowe,
- maszerujące jednostki zachowują lekki odstęp, dzięki czemu sylwetki nie tworzą jednego stosu,
- szczegóły i testy znajdują się w `ROTACJA-I-ZAMKI-V5.1.md`.

## Raport bitewny i wywiad jednostek v5.2

Status: **wdrożone i sprawdzone automatycznie**

- każda kupiona jednostka gracza ma osobny licznik kosztu i wystawień,
- obrażenia z walki wręcz, pocisków, wybuchów i trafień zamku są przypisywane właściwej jednostce,
- Mnich raportuje leczenie, Drwal dostarczone złoto, a Kamieniarz dostawy i rzeczywistą naprawę murów,
- ekran końca bitwy pokazuje tylko trzy najbardziej przydatne jednostki, aby nie przeciążać gracza tabelą,
- wyniki są zapisywane osobno dla każdego poziomu,
- po przegranej najlepsza sprawdzona jednostka może wejść do czterech złotych rekomendacji przy ponownej próbie,
- dane nie wzmacniają AI, nie zmieniają obrażeń i nie tworzą ukrytego skalowania trudności,
- kosztów jednostek nie zmieniono jeszcze automatycznie; raport daje wiarygodną podstawę do korekty po testach gracza,
- szczegóły i testy znajdują się w `RAPORT-BITEWNY-V5.2.md`.

## Poprawka blokowania szyku v5.2.1

Status: **wdrożona i sprawdzona automatycznie**

- pociski mogą zabijać Drwali i Kamieniarzy, których wcześniej dało się wybrać, ale nie trafić,
- jednostki bojowe mają pierwszeństwo przed zapleczem,
- ciężka piechota nie ściga Drwali daleko od swojej drogi,
- Czarownik porzuca cel pomocniczy, gdy pojawi się przeciwnik bojowy,
- test czterech kolejnych Drwali potwierdza usunięcie blokady i dalszy marsz całego szyku,
- szczegóły znajdują się w `NAPRAWA-KORKOW-V5.2.1.md`.

## Zamknięcie Epoki I v5.3

Status: **wdrożone i sprawdzone automatycznie oraz na renderach referencyjnych**

- sprawdzono statystyki, role, ataki i odwołania kontr wszystkich 14 jednostek,
- każdy z 11 bojowników potrafi zaatakować; Armata strzela, a role Drwala, Kamieniarza i Mnicha pozostają rozdzielone,
- Kamieniarz wykonuje do trzech kursów, a każda dostawa od razu naprawia mur i pokazuje postęp przy zamku,
- jedna postać może ukończyć pełny etap rozbudowy, nadal z limitem dwóch Kamieniarzy naraz i łącznym limitem +22,5% HP,
- Czarownik i Kamieniarz mają nowe pełne sylwetki, animacje oraz odpowiadające im ikony kart,
- dodano lekkie cząstki kroków z limitem trybu oszczędnego,
- samolot i spadochroniarz są rzadkim wariantem poziomów 7–12; cały żart jest niebojowy i nie odbiera HP,
- pranie pozostało wyłącznie na zamku poziomu 7, a poziom 1 otrzymał inny absurd scenograficzny,
- dodano wyłączony fundament Epoki II `early-modern`, bez ujawniania niedokończonej kampanii,
- szczegóły znajdują się w `AUDYT-JEDNOSTEK-I-HUMOR-V5.3.md`.

## Zasady, których trzymamy się od wersji v4.1

1. Humor jest rzadki, losowy i nie może zasłaniać rozgrywki.
2. Każdy obiekt biegnący lub lecący przechodzi przez cały ekran.
3. Żarty bieżące mają datę ważności — po wydarzeniu są wyłączane albo trafiają do archiwum.
4. Humor polityczny dotyczy publicznych wydarzeń i decyzji, a nie cech prywatnych osób lub grup.
5. Nie kopiujemy dialogów, postaci ani scen Monty Pythona czy Lesliego Nielsena; zachowujemy jedynie absurd, kontrast i kamienną powagę.
6. Reklama nie może utrudniać sterowania ani pojawiać się częściej niż inne gagi.

## Etap 1 — stabilizacja i balans

Status: **wersja v5.3 gotowa do końcowego testu Epoki I**

- zasięg łucznika ustawiony na 170 i sprawdzony automatycznie,
- zasięg oszczepnika ustawiony na 175 i sprawdzony względem łucznika,
- zasięg czarownika ustawiony na 180,
- armata otrzymała kontrolowaną, wysoką parabolę, czytelną kulę, smugę i efekt trafienia,
- sylwetka łucznika została ustawiona profilem do kierunku strzału,
- Deszcz Strzał zachowuje trzy celowane fale, a Mróz trwa 3,8 s,
- skala postaci jest liczona z wysokości ekranu: 46 px przy 1280×720 i 25 px przy 844×390,
- dwanaście ruchomych gagów sprawdzono na pełnym przebiegu od jednej krawędzi do drugiej,
- intro otrzymało nową sekwencję policjanta bez napisów ekranowych i bocznych cieni,
- każdy z 12 poziomów ma własny dyskretny absurd scenograficzny,
- pozostał test odczucia balansu na prawdziwym telefonie i monitorze,
- wdrożono rotację maksymalnie 8 kart na bitwę, dzięki czemu wszystkie 14 jednostek ma wyraźniejszą rolę w różnych poziomach,
- zebranie uwag Marcina po każdej wersji testowej.

Kryterium zakończenia: trzy pełne rozgrywki na telefonie i komputerze bez błędu blokującego.

## Etap 2 — biblioteka humoru i reklama

Status: **biblioteka Epoki I gotowa; kolejne gagi trafią już również do Epoki II**

- działa 12 właściwych gagów poziomów oraz jeden rzadki wariant samolotu; nadal najwyżej jeden podczas bitwy,
- osobna pula żartów z Polski, świata, kultury, muzyki i sportu,
- każdy gag bieżący otrzymuje źródło, datę publikacji i datę wyłączenia,
- przygotować 2–3 formaty reklamowe: proporzec ryby, herb sponsora i dyskretna plansza między poziomami,
- dodać przełącznik całkowitego wyłączenia reklam.

Kryterium zakończenia: każdy poziom ma inny gag, a obiekt zawsze kończy pełną animację.

## Etap 3 — głębsza strategia

- wdrożono lekką rozbudowę zamku przez Kamieniarzy od poziomu 7, bez osobnej waluty,
- wdrożono czytelne, umiarkowane kontry jednostek,
- wdrożono profile AI: defensywny, agresywny, oblężniczy i chaotyczny,
- wdrożono unikalne zachowania bossów poziomów 10 i 12,
- wdrożono talie bitewne dobierane do zagrożenia poziomu oraz oznaczenia polecanych kontr,
- wdrożono krótki raport taktyczny przed Królem Demonów,
- korekta ekonomii złota oraz kosztów na podstawie zebranych wyników z prawdziwych rozgrywek,
- wdrożono mierzenie skuteczności jednostek po każdej bitwie i trzykartowe podsumowanie.

## Etap 4 — grafika i animacja

- ujednolicono proporcje kluczowych postaci i zachowano wspólną skalę telefonu oraz komputera,
- policjant ma teraz wysokość odpowiadającą żołnierzom i tę samą zasadę skali w intrze,
- poprawiono sylwetkę łucznika oraz przebudowano animacje mnicha, golema i oszczepnika,
- rozbudowano tła o wolne warstwy głębi bez zasłaniania pola walki,
- dopracowano progresywne zniszczenia zamków i efekty pocisków specjalnych,
- wdrożono stały krok symulacji, ciągłe kolizje pocisków i lekkie cienie kontaktowe,
- wdrożono lekki odstęp szyku dla maszerujących jednostek,
- wdrożono dwa subtelne progi ewolucji zamku oraz trzy niepowtarzane gagi scenograficzne,
- wdrożono nowe ikony aplikacji zgodne z jakością grafiki w grze.
- Czarownik i Kamieniarz otrzymali osobne sylwetki premium, a ruch postaci lekko wzbudza kurz przy podłożu.

## Etap 5 — audio i kampania

- wdrożono osobne dźwięki łuku, kuszy, oszczepu, armaty, mrozu, Deszczu Strzał i Zewu Bitwy,
- wdrożono krótkie muzyczne sygnały bossów i osobną regulację ich poziomu,
- wdrożono trwały zapis ulepszeń, pieczęci, ukończeń i najlepszych czasów,
- wdrożono ekran mapy i czytelniejszy postęp 12 poziomów.

## Etap 6 — wydanie

- automatyczny test PWA offline i kompletności pamięci został wdrożony,
- automatyczny tryb oszczędny pamięci i renderowania został wdrożony,
- wersja GitHub Pages z plikami w katalogu głównym jest przygotowywana dla każdego wydania,
- pozostał końcowy test dotykowy i miksu audio na fizycznym iPhonie oraz Androidzie,
- później opakowanie do sklepów mobilnych.

## Następny etap — v6.0, Epoka II „Proch i Mechanika”

- odblokowanie po ukończeniu 12 poziomów Epoki I,
- nowa mapa i pierwsze poziomy wczesnej nowożytności,
- forty bastionowe oraz stopniowa zmiana architektury zamiast wymiany całej grafiki naraz,
- rdzeń armii oparty na pikach, muszkietach, moździerzach i prostych maszynach,
- maksymalnie osiem kart na bitwę oraz dobór jednostek do zagrożenia poziomu,
- osobna pula rzadkich gagów epoki przy zachowaniu limitu jednego żartu w bitwie.

## Najbliższa sesja z Marcinem

Potrzebne są trzy decyzje:

1. Czy proporcje głośności łuku, armaty, magii i bossów są dobre na głośniku telefonu?
2. Czy mapa kampanii jest czytelna bez instrukcji i nie wymaga przewijania na używanym telefonie?
3. Czy trwałe ulepszenia nie ułatwiają zbyt mocno późniejszych poziomów?
4. Czy po przejściu poziomu 12 przejście do Epoki II powinno nastąpić automatycznie, czy przez osobny przycisk na mapie?
