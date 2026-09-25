# Oprawa epok II–IV — v7.3.0

Zrzut użytkownika pokazał brak spójności z pierwszą epoką: płaskie biurowe bryły, powielone okna, doklejony portret i mało kontrastowe tła. Ten etap zastępuje architekturę wszystkich 14 późniejszych bitew, zamiast dokładać kolejną nakładkę.

## Kierunek artystyczny

Wspólny ciemny kontur, światło z góry i lewej, chłodne cienie oraz rozpoznawalny kolor drużyny. Sylwetka i duże płaszczyzny są ważniejsze niż ornament.

- **II — fort artyleryjski:** jasny kamień, dachy, blanki, wystające wieże i sklepiona brama.
- **III — twierdza przemysłowa:** wieża zegarowa, komin, zaokrąglony nitowany kocioł, mosiężne rury i wrota.
- **IV — cytadela elektryczna:** srebrzysty kamień, patynowane dachy, kopuła i smukłe cewki.
- Kolejne poziomy dodają małe proporce, osłony i stanowiska dział, bez zwiększania obszaru zajmowanego przez budowlę.
- Zdjęcia obu graczy pozostają oryginalne, zachowują proporcje i są osadzone we wnęce heraldycznej wszystkich epok.
- Późniejsze wojska mają mocniejsze ramiona, płaszcze, zróżnicowane nakrycia głowy, wyposażenie i cieniowanie materiałów.
- Nowe pejzaże z łagodnymi warstwami wzgórz, zabudową na horyzoncie i wiaduktem w wybranych bitwach. Chmury składają się z jednej sylwetki zamiast nakładających się przezroczystych elips; skalują się do telefonu.

## Technika i walidacja

Architektura i krajobraz są wydzielone do `content/era-art-v73.js`. Szczegóły budowli są renderowane do bufora; maksymalnie cztery bufory (około 9 MB surowych pikseli). Portrety, flagi, uszkodzenia i zawalenie są rysowane na bieżąco. Nazwy modułów są nowe, aby wcześniejszy service worker nie połączył nowego HTML ze starym modułem.

`npm test`: symulacje wszystkich epok, zasady jednostek i szturmu, obaj bossowie, brak limitu liczby żołnierzy, dostępność kart, portrety obu stron w każdej epoce, telefon i pełny ekran, audio, zapis kampanii i PWA offline. Osobny test oprawy sprawdza 14 późniejszych bitew, skalowanie, ponowne użycie buforów, żywe uszkodzenia, zawalenie i usuwanie starych buforów.

Kontrola wizualna: kadry desktop 1280×720 i iPhone 844×390 z bezpiecznymi marginesami oraz zestawienie jednostek. Mechanika, koszty, tempo bitew i limity robotników pozostają bez zmian.
