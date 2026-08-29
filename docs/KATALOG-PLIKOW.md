# Castle Calamity — katalog plików

## Struktura paczki

```text
castle-calamity/
├── index.html
├── manifest.json
├── sw.js
├── README.md
├── assets/
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── icon-maskable-192.png
│       ├── icon-maskable-512.png
│       ├── icon-master.svg
│       └── render-icons.js
├── content/
│   ├── eras.js
│   ├── gags.js
│   └── i18n.js
└── docs/
    ├── ARCHITEKTURA-EPOK.md
    ├── AUDYT-V4.4.md
    ├── ETAP-BOSSOW-V4.5.md
    ├── GRAFIKA-PREMIUM-V4.6.md
    ├── ZNISZCZENIA-I-POCISKI-V4.7.md
    ├── AUDIO-I-KAMPANIA-V4.8.md
    ├── WYDANIE-PWA-V4.9.md
    ├── GRAFIKA-I-FIZYKA-V5.0.md
    ├── ROTACJA-I-ZAMKI-V5.1.md
    ├── RAPORT-BITEWNY-V5.2.md
    ├── NAPRAWA-KORKOW-V5.2.1.md
    ├── AUDYT-JEDNOSTEK-I-HUMOR-V5.3.md
    ├── EPOKA-II-I-IPHONE-V6.0.md
    ├── KATALOG-PLIKOW.md
    └── PLAN-DZIALANIA.md
```

## Rola plików

| Plik | Zawartość | Kiedy zmieniać |
|---|---|---|
| `index.html` | Silnik gry, grafika Canvas, jednostki, poziomy, intro i interfejs | Przy zmianach mechaniki lub grafiki |
| `content/gags.js` | Częstotliwość humoru, lista gagów i treść reklamy na latającej rybie | Przy bieżących żartach i zmianie partnera reklamowego |
| `content/i18n.js` | Polskie i angielskie teksty interfejsu, samouczka, jednostek i poziomów | Przy każdym nowym tekście widocznym dla gracza |
| `content/eras.js` | Rejestr aktywnych pakietów średniowiecza i Epoki II | Przy dodawaniu epoki albo zmianie jej zestawów grafiki i balansu |
| `manifest.json` | Nazwa PWA, tryb pełnoekranowy, orientacja i ścieżki ikon | Przy zmianie nazwy lub ikon |
| `sw.js` | Pliki działające offline i numer pamięci podręcznej | Przy każdej opublikowanej wersji |
| `assets/icons/` | Ikony aplikacji na telefon i komputer | Przy nowej identyfikacji wizualnej |
| `assets/icons/icon-master.svg` | Wektorowe źródło wszystkich czterech ikon PWA | Przy zmianie kompozycji ikony |
| `assets/icons/render-icons.js` | Generator wariantów 192/512 oraz maskowalnych | Po zmianie pliku źródłowego SVG |
| `README.md` | Instrukcja uruchomienia i publikacji | Przy zmianie sposobu wdrażania |
| `docs/PLAN-DZIALANIA.md` | Kolejność dalszego rozwoju i kryteria odbioru | Po każdej większej decyzji projektowej |
| `docs/AUDYT-V4.4.md` | Stan techniczny, wykryte problemy, poprawki i ryzyka po audycie v4.4 | Po większym audycie lub przed publikacją |
| `docs/ETAP-BOSSOW-V4.5.md` | Fazy, ataki, balans i testy dwóch końcowych bossów | Przy zmianie zachowań poziomów 10 i 12 |
| `docs/GRAFIKA-PREMIUM-V4.6.md` | Animacje jednostek premium, warstwy tła i efekty umiejętności | Przy zmianie grafiki walki albo efektów czarów |
| `docs/ZNISZCZENIA-I-POCISKI-V4.7.md` | Progi zniszczeń, odrębne efekty trafień i testy ikon PWA | Przy zmianie wyglądu zamków, pocisków lub ikony |
| `docs/AUDIO-I-KAMPANIA-V4.8.md` | Rodziny dźwięków, ustawienia audio, mapa kampanii i trwałe ulepszenia | Przy zmianie dźwięków, nagród lub postępu kampanii |
| `docs/WYDANIE-PWA-V4.9.md` | Odporność offline, automatyczny budżet grafiki oraz testy wydania | Przy zmianie service workera albo optymalizacji urządzeń |
| `docs/GRAFIKA-I-FIZYKA-V5.0.md` | Wspólna skala postaci, zasięg oszczepnika, stały krok symulacji i kolizje ciągłe | Przy zmianie fizyki, balistyki albo czytelności jednostek |
| `docs/ROTACJA-I-ZAMKI-V5.1.md` | Talie do 8 kart, polecane kontry, raport Króla Demonów, ewolucja zamków i fizyka szyku | Przy zmianie składów poziomów, oznaczeń kontr lub wyglądu zamku |
| `docs/RAPORT-BITEWNY-V5.2.md` | Pomiar skuteczności, trzykartowy raport końcowy i podpowiedzi po przegranej | Przy zmianie oceniania jednostek, ekonomii albo rekomendacji |
| `docs/NAPRAWA-KORKOW-V5.2.1.md` | Priorytety celu, trafianie jednostek wsparcia i test odblokowania szyku | Przy zmianie namierzania, kolizji pocisków albo odstępów formacji |
| `docs/AUDYT-JEDNOSTEK-I-HUMOR-V5.3.md` | Zasady wszystkich jednostek, trzy kursy Kamieniarza, nowe sylwetki i gag samolotu | Przed zmianą balansu, mechaniki wsparcia, humoru albo przejściem do Epoki II |
| `docs/EPOKA-II-I-IPHONE-V6.0.md` | Bezpieczny viewport iPhone, balans poziomu 1, synchronizacja HP i cztery bitwy Epoki II | Przy zmianie skalowania iPhone, Epoki II albo nowych jednostek prochowych |
| `docs/ARCHITEKTURA-EPOK.md` | Granica między wspólnym silnikiem a zawartością poszczególnych epok | Przed rozpoczęciem nowej epoki |

## Najprostsze bieżące zmiany

- Reklama na rybie: edytuj `flyingFishAd` w `content/gags.js`.
- Rzadziej lub częściej: edytuj `timing.nextMin` i `timing.nextMax`.
- Rzadki gag przy Deszczu Strzał: edytuj `timing.abilityGagChance` (obecnie `0.08`, czyli 8%).
- Włączenie/wyłączenie gagu: zmień pole `enabled` przy wybranym wpisie.
- Dostępnych jest 12 właściwych gagów poziomów oraz rzadki wariant samolotu na poziomach 7–12; poziom 4 ma rycerza na chmurze, a poziom 5 konserwatora polerującego księżyc.
- Podczas jednej bitwy gag przelotowy pojawia się najwyżej raz.
- Każdy ruchomy gag jest usuwany dopiero po przekroczeniu przeciwnej krawędzi ekranu.
- Stałe absurdy poziomów są rysowane przez `drawLevelAbsurdity()` w `index.html` — jeden motyw dla każdego z 12 poziomów.
- Nowy żart bieżący: najpierw dodaj zatwierdzony wpis do `topicalGags`, wraz z datą wygaśnięcia i notatką o źródle, a potem dołącz jego prostą animację w `index.html`.
- Kamieniarz, kamieniołomy, trzy automatyczne kursy, natychmiastowa naprawa po dostawie i trzy etapy graficznej rozbudowy zamku są częścią wspólnego silnika w `index.html`; w średniowieczu pojawia się od poziomu 7, a w Epocie II tylko na planszy z działającymi złożami.
- System rozbudowy celowo nie ma osobnej waluty ani dodatkowego panelu. Koszt jest płacony w złocie przy zakupie Kamieniarza, a postęp widać bezpośrednio przy zamku.
- Bossowie są częścią wspólnego silnika w `index.html`; zwykłe jednostki nie mogą ich kupić ani wylosować w kolejce AI.
- Pełny katalog ma 18 jednostek dwóch epok, ale każda talia poziomu jest automatycznie ograniczana do 8 unikalnych kart łącznie z zapleczem.
- Pranie, czajnik i przysypiający strażnik są pojedynczymi gagami zamkowymi poziomów 7, 9 i 11; nie należy powielać ich na wszystkich zamkach.
- Statystyki skuteczności są zbierane w `index.html` i zapisywane osobno dla każdego poziomu. Nie wolno używać ich do ukrytego wzmacniania przeciwnika.
- Raport po bitwie pokazuje najwyżej trzy jednostki, nawet jeśli talia poziomu zawiera osiem kart.
- Drwal i Kamieniarz mogą zostać trafieni. Jednostki bojowe mają jednak pierwszeństwo, aby zaplecze nie zatrzymywało natarcia.

## Ważne przy publikacji

Na GitHub należy wgrać całą strukturę z zachowaniem folderów. Po aktualizacji trzeba zwiększyć numer `CACHE` w `sw.js`, inaczej telefon może nadal pokazywać starszą wersję.

Rdzeń gry pozostaje obecnie w jednym `index.html`, ponieważ jego przedwczesne rozdzielenie zwiększa ryzyko nowych błędów. Rozdzielenie silnika, renderowania i danych jest zaplanowane po zamknięciu balansu podstawowych mechanik.
