# Castle Calamity v6.1.1 — stabilny HUD i wędkarz

## Cel poprawki

Usunąć dwa męczące problemy pierwszego poziomu bez zmiany balansu walki:
zbyt dominującą postać wędkarza oraz drżenie kafelków wyboru wojsk.

## Wędkarz poziomu 1

- stoi na bocznym tarasie zamku zamiast pod murem i poza główną drogą jednostek,
- korzysta z 90% skali żołnierza,
- od 12. sekundy zwija linkę, podnosi but i odchodzi w stronę wieży,
- znika najpóźniej około 16. sekundy,
- pozostaje wyłącznie niebojowym, jednorazowym elementem scenografii.

## Stabilizacja kart jednostek

Źródłem optycznego drżenia były dwa niezależne mechanizmy: ponowne zapisywanie
tej samej ceny do DOM przy każdym odświeżeniu HUD-u oraz przesuwanie lub
skalowanie całego kafelka w stanach `hover` i `active`. Safari na części
iPhone'ów przerysowywało wtedy cały przewijany pasek.

W v6.1.1:

- cena jest zapisywana tylko po rzeczywistej zmianie,
- klasa niedostępności zmienia się tylko po zmianie stanu,
- kafelek ma stałą pozycję podczas najechania i dotyku,
- na urządzeniach z myszką zmienia się jedynie obramowanie ikony,
- pozioma obsługa dotykowa paska jest jawnie ograniczona do przewijania.

## Kontrola jakości

- pełna regresja 16 poziomów i zasad 18 jednostek,
- osobne kadry wędkarza 1280×720 oraz 844×390,
- test proporcji 90% i położenia nad poziomem gruntu,
- test usunięcia postaci po 16 sekundach,
- test statyczny zabezpieczeń przed aktualizacją DOM w każdej klatce,
- test instalacji, aktualizacji i startu PWA bez internetu.
