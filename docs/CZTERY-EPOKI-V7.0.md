# Castle Calamity v7.0 — cztery epoki

## Szturm bramy

Na prośbę Marcina zwykły mobilny bojownik po dojściu do bramy zadaje jeden
cios i ginie. Zasięg broni nie uruchamia już tego zdarzenia: Czarownik musi
dojść do muru. Blokada castleStrikeDone chroni przed podwójnymi obrażeniami.
Efekt trafienia, aktualizacja HP i efekt śmierci pojawiają się razem.
Bossowie zachowują osobną walkę, a artyleria zużywa swoją amunicję.

## Epoka III — Para i Żelazo

Cztery bitwy: Stacja Spóźnionej Pary, Most Tysiąca Nitów, Dolina Ciężkich
Kroków i Fabryka Wolnych Sobót. Nitownik przełamuje mury, Strzelec zwalcza
ciężką piechotę, Strażnik parowy osłania natarcie, Haubica ostrzeliwuje bazę.
Forty mają metalowe płyty, nity, kominy i dachy fabryczne.

## Epoka IV — Wiek Iskry

Cztery bitwy: Przedmieście Wysokiego Napięcia, Aleja Rozładowanych Baterii,
Przekaźnik Nieodebranych Rozkazów i Ministerstwo Krótkich Spięć.
Strażnik cewki osłania Impulsowca, Sanitariusz leczy sąsiednie oddziały,
a Działo indukcyjne strzela szybszym i niższym łukiem niż Haubica.
Bazy mają kopuły, cewki i inną paletę; zachowują personalizację twarzą.

Obie epoki mają własne mapy i lokalizację PL/EN, odblokowują się kolejno.
Nie resetują zdolności ani zapisanych ukończeń poprzednich kampanii.
Nowy moduł content/future-eras.js zawiera dane i rysowanie; walka pozostaje
we wspólnym silniku. Osiem oznacza limit kart, nie liczbę żywych żołnierzy.
Nie dodano walut. Nowe forty rozwijają detale w kolejnych bitwach.

## Dźwięk

- Miecze: spokojniejsze tempo powtórzeń i niższy poziom próbek.
- Muszkiet: osobny trzask, korpus oraz krótki ogon.
- Strzelec, Impulsowiec, metalowy cios i działo indukcyjne: osobne sygnały.
- Szum i wysokość dźwięków mają niewielką wariację.
- Krótkie narastanie obwiedni ogranicza kliknięcia.
- Maksymalnie 48 jednoczesnych warstw, odzyskiwanie budżetu po wybrzmieniu.
- Kompresor sumy ogranicza skoki głośności; węzły są rozłączane po zakończeniu.

Nie przeprowadzono odsłuchu na fizycznym głośniku iPhone'a. Testy audio
sprawdzają konstrukcję, budżet głosów i odtwarzanie procedur, nie subiektywną
jakość dźwięku. Miks pozostaje do oceny na urządzeniu.

## Weryfikacja i ograniczenia

Regresja obejmuje 26 poziomów, 20 mobilnych bojowników, cztery działa,
wsparcie, bossów, nowe pociski i leczenie, przejście między epokami,
blokadę podwójnego trafienia, kolejkę 12 żołnierzy, zapis, PL/EN i PWA.
Nowe bitwy przechodzą 90-sekundowe symulacje. Obrazy kontrolne obejmują
1280×720 i bezpieczny viewport telefonu 844×390.

Symulacje nie zastępują oceny pełnego przejścia kampanii przez człowieka.
FPS, dotyk i miks na fizycznym iPhonie wymagają ręcznej oceny.

Testy repozytorium: npm install, następnie npm test (Node + @napi-rs/canvas).
