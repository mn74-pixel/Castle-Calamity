# Castle Calamity — naprawa blokowania szyku v5.2.1

## Przyczyna

Czarownik oraz inne jednostki dystansowe mogły wybrać Drwala jako cel, ale
kolizja zwykłego pocisku jednocześnie wykluczała Drwali. Pocisk przelatywał,
cel pozostawał żywy, a kolejne jednostki ustawiały się za zatrzymanym frontem.

## Poprawki

- zwykłe pociski i wybuchy mogą trafić Drwala oraz Kamieniarza,
- jednostka bojowa ma pierwszeństwo przed jednostką zaplecza, nawet gdy Drwal
  stoi nieco bliżej,
- Czarownik walczący z Drwalem zmienia cel, jeżeli pojawi się prawdziwe
  zagrożenie bojowe,
- Golem nie ściga Drwala przez dużą część mapy; atakuje zaplecze dopiero, gdy
  znajdzie się ono blisko jego drogi,
- po usunięciu blokady front wraca do marszu, a oddziały z tyłu nie pozostają
  w trwałej kolejce.

## Test regresji

Automatyczny scenariusz ustawia Golema, Czarownika i Wojownika przeciw czterem
Drwalom. Sprawdza trafienie magicznego pocisku, wybór Wojownika przed bliższym
Drwalem, usunięcie całej serii jednostek wsparcia i wznowienie ruchu szyku.
Następnie uruchamiana jest pełna regresja wszystkich 12 poziomów i PWA offline.
