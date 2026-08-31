# Castle Calamity v6.1 — balans, wydajność i forty

> Uwaga historyczna: opisany niżej limit ośmiu aktywnych bojowników został
> wycofany w v6.1.2. Aktualnie osiem oznacza wyłącznie liczbę różnych kart
> w talii, a liczebność wojska regulują czas i zdobywane drewno.

## Cel etapu

Etap ogranicza przeciążenie ekranu i długość bitew od pierwszego poziomu,
usuwa zacinanie późnej kampanii oraz nadaje zamkom Epoki II własną sylwetkę.
Zmiany nie zwiększają liczby paneli ani częstotliwości humoru.

## Aktywna armia i zaplecze

- Każda strona może wystawić najwyżej 8 aktywnych bojowników. Limit obejmuje
  piechotę, jednostki dystansowe, Mnicha i artylerię; nie obejmuje bossów.
- Dziewiąta próba zakupu nie pobiera złota. Karta jest przygaszona, a przy
  zamku widać licznik `⚔ obecni/8`.
- Drwale mają osobny limit 2 na stronę. Kamieniarze zachowują limit 2.
- AI przestrzega tych samych limitów i po zablokowanym zakupie może wybrać
  inną dozwoloną rolę.

## Ekonomia i długość bitew

- Poziom 1 ma 3 drzewa, odrost co 28 sekund, mnożnik złota 1,00 i zamki po
  950 HP.
- W poziomach 2–12 liczba drzew nie przekracza 4, a mnożnik złota rośnie
  łagodnie do 1,42.
- HP zamków kampanii średniowiecznej rośnie od 950 do 3400 po stronie gracza
  i 4300 po stronie finałowego przeciwnika. Boss pozostaje osobnym celem.
- Cztery bitwy Epoki II korzystają z tego samego limitu armii i mają zamki
  od 1200 do 2450 HP.

## Wydajność poziomu 12

Wydłużona symulacja 180 sekund kontroluje szczytową liczbę jednostek,
pocisków i efektów. Limit bojowników pozostaje równy 8 na stronę. Dodatkowo
obniżono górne pułapy pyłu, iskier, dymu, żaru i wybuchów. Tryb oszczędny
nadal automatycznie zmniejsza je jeszcze bardziej na słabszym urządzeniu.

## Zamki Epoki II

Fort nie jest już warstwą nałożoną na średniowieczną wieżę. Osobny renderer
rysuje niską ceglaną bryłę z ziemnymi barkami, platformami działowymi,
schodkową bramą, miedzianymi dachami i prostokątną flagą regimentową.
Poziomy 2–4 dodają kolejno ravelin, platformy oraz wieżę warsztatową.
Uszkodzenia, otwory po pociskach i zawalanie pozostają aktywne.

## Humor i skala

- Wszystkie humorystyczne postacie ludzkie korzystają z dokładnie tego samego
  przelicznika wzrostu co wojsko na komputerze i telefonie.
- Dodano uciekający sztandar oraz urzędnika prochowego z beczką dokumentów.
- Nadal może pojawić się najwyżej jeden ruchomy gag w czasie bitwy. Pranie
  pozostaje wyłącznie jednym z wielu pojedynczych elementów scenograficznych.

## Weryfikacja

- cztery profile iPhone wraz z bezpiecznymi marginesami i paskiem Safari,
- pełna regresja 16 poziomów i zasad 18 jednostek,
- test korka Golema i Czarownika na dwóch Drwalach,
- limit 8 bojowników oraz 2 Drwali po obu stronach,
- symulacje 60 sekund wybranych poziomów i 180 sekund poziomu 12,
- render fortów Epoki II na 1280×720 oraz 844×390,
- render nowych gagów i zgodność skali postaci ludzkich z żołnierzem,
- instalacja i start PWA bez internetu z cache v6.1.
