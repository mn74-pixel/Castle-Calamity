# Castle Calamity — wydanie PWA i optymalizacja v4.9

## Cel etapu

Przygotować stabilną paczkę GitHub Pages, która uruchamia się po utracie
internetu i nie przeciąża starszego telefonu. Etap nie zmienia balansu,
ekonomii, liczby jednostek ani zatwierdzonej grafiki na mocniejszym sprzęcie.

## Offline i aktualizacja

- Dziesięć zasobów wymaganych do startu trafia do cache podczas instalacji.
- Nawigacja korzysta z sieci, a bez niej wraca do zapisanego `index.html`.
- Skrypty, słowniki i ikony korzystają najpierw z cache i odświeżają się w tle.
- Brakujący plik JavaScript nie dostaje w odpowiedzi dokumentu HTML.
- Cache ma numer `castle-calamity-v4.9`; starsze wersje są usuwane po aktywacji.
- Manifest ma stabilne ID oraz tryb `standalone` jako bezpieczny fallback.

## Płynność i pamięć

- Canvas nie jest ponownie alokowany, kiedy wymiary i DPR faktycznie się nie zmieniły.
- ResizeObserver jest grupowany do jednej klatki, a kontrola awaryjna działa co 2 s zamiast co 0,5 s.
- Na urządzeniu z małą liczbą rdzeni lub pamięci DPR jest ograniczony do 1,25.
- Tryb oszczędny renderuje w budżecie około 30 kl./s i zmniejsza liczbę gwiazd, śniegu, chmur, smug oraz cząstek.
- Symulacja walki, cooldowny, AI i obrażenia nadal używają czasu rzeczywistego i nie są upraszczane.
- Jeśli urządzenie nie zostało uznane za słabe, ale przez dłuższy czas nie utrzymuje płynności, tryb włącza się automatycznie.
- Schowanie aplikacji zatrzymuje requestAnimationFrame i AudioContext. Powrót zeruje licznik czasu klatki.
- Proceduralne huki współdzielą jeden bufor szumu Web Audio, ograniczając krótkotrwałe alokacje i pracę garbage collectora.

## Wyniki automatycznych testów

- pełna regresja 12 poziomów, obu bossów, balistyki, umiejętności, gagów, kampanii, PL/EN i audio,
- 60-sekundowe symulacje poziomów 1, 7, 10 i 12 bez NaN oraz błędów stanu,
- wymuszony tryb oszczędny: DPR 1,25, budżet 30 ms, 7 chmur i maksymalnie 36 cząstek pyłu,
- potwierdzone ponowne użycie bufora szumu,
- instalacja pełnego app shell, usuwanie starego cache i nawigacja offline,
- kontrola obecności wszystkich czterech ikon z manifestu,
- brak błędnego fallbacku HTML dla nieistniejącego skryptu.

Automatyczny test nie zastępuje końcowej próby dotykowej i odsłuchu na
fizycznym iPhonie oraz telefonie z Androidem. To pozostaje ostatnim punktem
przed opakowaniem gry do sklepów mobilnych.
