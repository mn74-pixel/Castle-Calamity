# Castle Calamity — zniszczenia, pociski i ikony v4.7

## Korekta Deszczu Strzał

Po ocenie wersji v4.6 przywrócono prostszą oprawę z v4.5. Pozostają trzy
fale i 30 strzał, delikatnie zaznaczony obszar oraz rzeczywiste pociski.
Usunięto szerokie pasy cienia i dodatkowe kręgi trafień, które obciążały obraz.

## Progresywne uszkodzenia zamków

Stan muru odpowiada aktualnemu HP:

1. poniżej 75% — pierwsze pęknięcia,
2. poniżej 50% — głębsze rysy, dwa wyłomy i luźne kamienie przy podstawie,
3. poniżej 25% — osmalenia, odsłonięte skrzyżowane belki i zerwany łańcuch.

Każde trafienie otrzymuje krótki błysk dokładnie w miejscu uderzenia. Pierwsze
przekroczenie progu wywołuje osypanie pyłu i krótki wstrząs konstrukcji.
Dotychczasowe dziury po ciężkich trafieniach, pożary i finałowe zawalanie
pozostają aktywne.

## Pociski specjalne

- **Magia:** fioletowy ślad, wirujący łuk runiczny i koncentryczne uderzenie,
- **Demoniczny ogień:** czerwono-fioletowy rdzeń, płomienne ramiona i ciemny dym,
- **Bełt:** krótki srebrny rozbłysk kierunkowy,
- **Oszczep:** metaliczna smuga i płaski obłok pyłu,
- **Kula armatnia:** gorący rdzeń, dym, iskry oraz rozszerzająca się obręcz.

Zmiany są wyłącznie graficzne. Balistyka, obrażenia i zasięgi nie zostały
zmienione.

## Ikona PWA

Nowy znak łączy główny zamek, dwa sztandary, skrzyżowany miecz i pióro.
Koronowany kaczy herold jest małym absurdem, który nie dominuje kompozycji.
Źródłem jest `assets/icons/icon-master.svg`; z niego powstają warianty 192 i
512 px oraz pliki maskowalne. Kompozycja mieści się w bezpiecznej strefie ikon
Androida i iOS, a tło wypełnia cały kwadrat.

## Weryfikacja

Audyt v4.7 obejmuje pełną regresję wcześniejszych funkcji oraz dodatkowo:

- brak szerokich pasów cienia w Deszczu Strzał,
- kolejność progów uszkodzeń 1 → 2 → 3,
- render uszkodzonych zamków na 1280×720 i 844×390,
- obecność pięciu różnych rodzajów efektu trafienia,
- cztery poprawne pliki PNG o wymiarach 192×192 lub 512×512,
- pełne krycie narożników wariantu maskowalnego.

Wynik końcowy: `QA V4.7 COMPLETE`.
