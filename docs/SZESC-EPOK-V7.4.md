# v7.4 — Silniki i Radio / Wyprawa Orbitalna

Kampania liczy 34 bitwy w sześciu epokach. V odblokowuje się po czterech zwycięstwach w IV, VI po czterech zwycięstwach w V. Wszystkie bitwy są dostępne przez dotychczasowy przycisk TESTY bez zmiany zapisu kampanii.

## Wojska i role

| Epoka | Jednostka | Koszt | Rola |
|---|---|---:|---|
| V | Szturmowiec | 26 | Szybki front, bagnet, kontra na Karabiniera |
| V | Karabinier | 46 | Dystans 185, wsparcie przeciw Szturmowcom |
| V | Medyk polowy | 44 | Automatyczne leczenie 17 HP, zasięg 78 |
| V | Działo polowe | 108 | Cztery strzały, ostrzał budowli i obrażenia obszarowe |
| VI | Strażnik orbitalny | 32 | Wolniejszy, wytrzymały front i osłona piechoty |
| VI | Piechur plazmowy | 49 | Dystans 178, kontra na Strażnika orbitalnego |
| VI | Biotechnik | 46 | Leczenie 16 HP, zasięg 86 |
| VI | Działo szynowe | 116 | Cztery strzały, węższy obszar trafienia, elektryczny pocisk |

Kolejne bitwy uczą frontu i dystansu, następnie ochrony medyka, przełamywania obrony i walki pod ostrzałem. Składy AI i polecenia zmieniają się między bitwami. HP zamków pozostaje umiarkowane, zamiast rosnąć bez końca z numerem epoki.

## Spójność i oprawa

- Nowe talie obu stron zawierają wyłącznie cztery rodzime jednostki bojowe oraz dwóch pomocników ekonomicznych.
- Drwal i Kamieniarz zachowują identyfikatory, ulepszenia i zasady, ale dostają stroje, narzędzia, nazwy oraz identyczne ikony zgodne z epoką. Mnich w II–III jest wizualnie felczerem.
- Usunięto rycerza ze składu AI III i przemysłowe oddziały ze zwykłych składów IV.
- V ma fort radiowy z anteną, radiostacją i stanowiskami artylerii; VI — bazę kolonialną z modułem orbitalnym. Oryginalne zdjęcia pozostają na fasadach.
- Artyleria V–VI stoi na bocznych platformach, zamiast wisieć nad anteną.
- Orbitalne drzewa rosną w biokopułach: nadal dają ten sam zasób, bez kolejnej waluty.
- Gagi: spadochroniarz w wybranych bitwach V, sprzątacz Księżyca w hełmie w wybranych bitwach VI. Nadal najwyżej jeden gag na bitwę.
- Ostrzał i plazma korzystają z istniejących, odrębnych dźwięków karabinu i impulsu; działa z artylerii i cewki. Nie dodano kolejnych ciągłych warstw audio.

## Testy

`npm test`: cały dotychczasowy zestaw, 90-sekundowe symulacje wszystkich ośmiu nowych bitew, ataki i jednorazowy szturm wszystkich 26 mobilnych bojowników, leczenie nowych medyków, amunicja dział, poprawność kontr, lokalizacja PL/EN, jednorodność talii, odblokowanie i przyciski przejścia IV→V→VI, izolacja zapisu w testach, zdjęcia obu stron we wszystkich późniejszych epokach i komplet 13 zasobów offline.

Widoki desktop 1280×720 oraz iPhone 844×390, plus buforowanie budowli dla wszystkich 22 późniejszych poziomów. Do oceny gracza pozostaje subiektywna trudność i tempo nowych kombinacji armii.
