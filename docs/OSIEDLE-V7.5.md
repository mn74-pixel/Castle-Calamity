# v7.5 — Osiedle Wielkiej Awantury

Specjalna czwarta bitwa epoki V, bezpośrednio przed Wyprawą Orbitalną.
Zastępuje Fort Nieodebranych Meldunków; kampania nadal ma 34 bitwy,
a istniejące zapisy i odblokowanie epoki VI zachowują zgodność.

## Pętla gry

Zatrudnij dostawcę → odbierz środki za dostawę → wybierz butelkę →
mieszkaniec pije i rzuca → trafienie uszkadza przeciwny blok.

| Karta | Koszt | Skutek | Czas |
| --- | ---: | --- | ---: |
| Piwo | 12 | 65 HP obrażeń | 3,8 s do kolejnego zamówienia |
| Wino | 25 | 150 HP obrażeń | 5,2 s |
| Wódka | 40 | 255 HP obrażeń | 6,6 s |
| Dostawca | 8 | +34 po powrocie ze sklepu | 13 s, maks. 2 w drodze |

Przyciski 1–4 i dotyk. Wspólny czas oczekiwania dla butelek; zatrudnianie
dostawcy jest niezależne. Niedostępne karty są przygaszone i pokazują
przyczynę: środki, czas albo dwóch dostawców. Zegar ekonomii również działa.
Przeciwnik korzysta z tych samych kosztów, obrażeń i czasu animacji.

## Twarze i oprawa

Obie twarze wgrywa się w dotychczasowym panelu w menu. Istniejący lokalny
proces wycinania twarzy zachowuje kolory zdjęcia i przezroczystość;
fotografia jest rysowana na animowanym tułowiu we wnęce balkonu.
Bez zdjęcia pojawia się zastępczy mieszkaniec. Nie ma filtra cartoon.
To integracja istniejącego wycinania Castle Calamity, nie import kodu
z nieudostępnionego repozytorium SlingToon.

Dwie elewacje wielkopłytowe, sklepy Monopolowy, osiedle w tle, dostawcy
ze skrzynkami. Picie, zamach, wypuszczenie butelki i lot mają osobne fazy.
Ubytki tynku zależą od faktycznych HP. Krótkie dźwięki przełykania i szkła
korzystają ze wspólnego ograniczenia głosów i ustawień głośności.
W tym jednym poziomie nie ma zwykłej rekrutacji ani średniowiecznych czarów.

## Architektura i kontrola

`content/osiedle-v75.js` izoluje stan, karty i grafikę przerywnika.
Główna gra zachowuje wynik bitwy, HP, zapis, pełny ekran i pauzę.
Ruch dostawców i trajektorie liczone względem aktualnych wymiarów świata.
Nowy plik modułu i cache PWA v7.5.0 zawierający 14 zasobów.
Poprawiono również pozycję dział nowożytnych/orbitalnych po pierwszym tyknięciu.

Regresja: pobranie kosztu raz, wspólny cooldown, brak przedwczesnego pocisku,
obrażenia po locie, limit i nagroda dostawców, brak środków, pauza,
obie fotografie, AI, brak armii i zaklęć, pełna wygrana oraz odblokowanie VI.
Kontrola obrazu 1280×720 i 844×390 z bezpiecznymi marginesami telefonu.
Istniejące testy jednostek, 34 bitew, kampanii i offline pozostają w zestawie.
