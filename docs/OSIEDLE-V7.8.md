# v7.8 — Polish Pass: Osiedle Wielkiej Awantury

## Kompas
FUN > GAME FEEL > GAMEPLAY > CLARITY > PERFORMANCE > ART > FEATURES.

Wersja 7.8 nie dodaje kolejnych zasobów. Rozwija dokładnie trzy czytelne osie:
**kondycję, puste butelki i jedzenie**, a resztę pokazuje przez animację,
komunikaty i scenografię.

## 12 segmentów
1. Balkonowe otwarcie — spokojny onboarding i balkonowe detale.
2. Kolejka do Monopolowego — nacisk na zapas butelek.
3. Liga Ławkowa — pierwsza bójka w tle.
4. Zapiekanka ratunkowa — tutorial jedzenia.
5. Bitwa o trzepak — ogórek skraca przestój.
6. Śmietnikowy rozejm — dwie bójki i brudniejsza ulica.
7. Pizza na pół — regeneracja kondycji w czasie.
8. Nocna zmiana — nocne okna i wyższe tempo.
9. Kebab ostatniej szansy — niższy koszt kondycji kolejnych trunków.
10. Patrol na sygnale — ruchomy patrol i nocny rytm.
11. Monopolowy zamknięty — zamknięta roleta i większy pakiet dostawy.
12. Finał Wielkiej Płyty — Nocny Express, pełna logistyka i najwyższe tempo.

## Jedzenie
- Zapiekanka: +30 kondycji i lekki bonus regeneracji.
- Ogórek: +22 i skrócenie aktywnego przestoju/cooldownu.
- Pizza: +44 i wyraźna regeneracja przez 8 s.
- Kebab: +58 i 22% niższy koszt kondycji przez 10 s.

Jeśli gracz ma jedzenie w zapasie, a brakuje mu kondycji do wybranego trunku,
kliknięcie trunku automatycznie wykorzystuje posiłek. Nie powstaje dodatkowy
przycisk ani czwarty zasób.

## AI
Przeciwnik sprawdza zapas butelek, środki, kondycję oraz jedzenie. Zamawia
dostawę przed wyczerpaniem, dokupuje jedzenie przy niskiej kondycji i wybiera
Piwo/Wino/Wódkę w zależności od stanu, a nie wyłącznie według ceny.

## Game feel
- krótkie komunikaty przy blokadzie i dostawie,
- licznik kolejnych celnych rzutów jako feedback bez wpływu na ekonomię,
- osobne pierścienie uderzenia i więcej szkła po mocniejszym trafieniu,
- tytuł segmentu przez chwilę pokazuje także jego zasadę,
- niska kondycja zmienia kolor paska bez migającej geometrii HUD.

## QA
- 12 unikalnych props/scenografii,
- 4 różne efekty jedzenia,
- bezpośredni test 1/12–12/12,
- 12 renderów referencyjnych 960×540,
- zachowane 34 bitwy, V→VI, zdjęcia twarzy i PWA offline.
