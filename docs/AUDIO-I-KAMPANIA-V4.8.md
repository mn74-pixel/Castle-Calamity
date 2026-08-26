# Castle Calamity — audio i kampania v4.8

## Cel etapu

Zastąpić techniczny wybór numeru poziomu pierwszą prawdziwą mapą kampanii oraz
dodać czytelne, ale oszczędne audio. Etap nie otwiera jeszcze następnej epoki —
średniowiecze pozostaje wzorcem dla wspólnego silnika.

## System audio

Audio jest generowane w przeglądarce przez Web Audio API. Dzięki temu paczka
pozostaje mała, działa offline i nie wymaga ładowania bibliotek sampli.

Osobne rodziny sygnałów otrzymały:

- łuk — miękki trzask cięciwy i krótki świst,
- kusza — twardszy mechaniczny impuls,
- oszczep — dłuższy ruch powietrza,
- armata — warstwa niskiego tonu i filtrowanego huku,
- Deszcz Strzał — trzy rozdzielone fale zgodne z animacją,
- Mróz — cztery krótkie, szkliste wysokości,
- Zew Bitwy — trzyczęściowy sygnał przypominający róg,
- Władca Krwawej Łuny i Król Demonów — różne motywy wejścia oraz faz.

Powtarzalne odgłosy mają ograniczenia czasowe. Zapobiega to nakładaniu wielu
identycznych dźwięków podczas dużej bitwy. Głośność ogólna i poziom motywów
bossów są regulowane osobno i zapisywane na urządzeniu. Przycisk nuty nadal
natychmiast wycisza całą grę.

## Mapa kampanii

- Dwanaście bitew tworzy jedną trasę w kształcie litery S.
- Ukończony poziom ma zielone oznaczenie i znacznik wyboru.
- Następna dostępna bitwa ma złotą obwódkę.
- Zablokowane poziomy są wygaszone.
- Poziomy 10 i 12 zachowują odrębny wygląd bossowski.
- Pozycje węzłów są danymi pakietu `medieval` w `content/eras.js`, więc kolejna
  epoka może dostać inną mapę bez kopiowania silnika.

## Trwały postęp

Pierwsze zwycięstwo na danym poziomie daje trzy pieczęcie ulepszeń. Powtarzanie
tej samej bitwy nie nalicza nagrody drugi raz. Zapisywane są:

- ukończone poziomy,
- najlepszy czas każdej ukończonej bitwy,
- niewydane pieczęcie,
- wybrane ulepszenia jednostek,
- głośność, poziom motywów i stan wyciszenia.

Dotychczasowy zapis odblokowanych poziomów jest migrowany automatycznie. Gracz
nie traci wcześniejszego postępu ani należnych punktów.

## Audyt v4.8

Automatyczna regresja potwierdza:

- komplet dziewięciu rodzin dźwięków i 32 uruchamiane warstwy testowe,
- osobną szynę głośności motywów,
- 12 punktów mapy aktywnej epoki,
- pojedynczą nagrodę za pierwsze ukończenie,
- powrót pieczęci i ulepszeń z trwałego zapisu,
- brak regresji zasięgów, balistyki, bossów, skalowania, humoru i umiejętności,
- 60 sekund stabilnej symulacji poziomów 1, 7, 10 i 12.

## Następny etap

Przed otwieraniem nowej epoki należy wykonać test PWA offline na rzeczywistym
iPhonie i telefonie z Androidem, sprawdzić miks na głośniku telefonu oraz
zoptymalizować pamięć i płynność na starszych urządzeniach.
