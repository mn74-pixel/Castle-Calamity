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
│       └── icon-maskable-512.png
├── content/
│   ├── eras.js
│   ├── gags.js
│   └── i18n.js
└── docs/
    ├── ARCHITEKTURA-EPOK.md
    ├── AUDYT-V4.4.md
    ├── ETAP-BOSSOW-V4.5.md
    ├── KATALOG-PLIKOW.md
    └── PLAN-DZIALANIA.md
```

## Rola plików

| Plik | Zawartość | Kiedy zmieniać |
|---|---|---|
| `index.html` | Silnik gry, grafika Canvas, jednostki, poziomy, intro i interfejs | Przy zmianach mechaniki lub grafiki |
| `content/gags.js` | Częstotliwość humoru, lista gagów i treść reklamy na latającej rybie | Przy bieżących żartach i zmianie partnera reklamowego |
| `content/i18n.js` | Polskie i angielskie teksty interfejsu, samouczka, jednostek i poziomów | Przy każdym nowym tekście widocznym dla gracza |
| `content/eras.js` | Rejestr pakietów epok; obecnie aktywne jest średniowiecze | Przy dodawaniu epoki albo zmianie jej zestawów grafiki i balansu |
| `manifest.json` | Nazwa PWA, tryb pełnoekranowy, orientacja i ścieżki ikon | Przy zmianie nazwy lub ikon |
| `sw.js` | Pliki działające offline i numer pamięci podręcznej | Przy każdej opublikowanej wersji |
| `assets/icons/` | Ikony aplikacji na telefon i komputer | Przy nowej identyfikacji wizualnej |
| `README.md` | Instrukcja uruchomienia i publikacji | Przy zmianie sposobu wdrażania |
| `docs/PLAN-DZIALANIA.md` | Kolejność dalszego rozwoju i kryteria odbioru | Po każdej większej decyzji projektowej |
| `docs/AUDYT-V4.4.md` | Stan techniczny, wykryte problemy, poprawki i ryzyka po audycie v4.4 | Po większym audycie lub przed publikacją |
| `docs/ETAP-BOSSOW-V4.5.md` | Fazy, ataki, balans i testy dwóch końcowych bossów | Przy zmianie zachowań poziomów 10 i 12 |
| `docs/ARCHITEKTURA-EPOK.md` | Granica między wspólnym silnikiem a zawartością poszczególnych epok | Przed rozpoczęciem nowej epoki |

## Najprostsze bieżące zmiany

- Reklama na rybie: edytuj `flyingFishAd` w `content/gags.js`.
- Rzadziej lub częściej: edytuj `timing.nextMin` i `timing.nextMax`.
- Rzadki gag przy Deszczu Strzał: edytuj `timing.abilityGagChance` (obecnie `0.08`, czyli 8%).
- Włączenie/wyłączenie gagu: zmień pole `enabled` przy wybranym wpisie.
- Dostępnych jest 12 ruchomych gagów — po jednym dla każdego poziomu; poziom 4 ma rycerza na chmurze, a poziom 5 konserwatora polerującego księżyc.
- Podczas jednej bitwy gag przelotowy pojawia się najwyżej raz.
- Każdy ruchomy gag jest usuwany dopiero po przekroczeniu przeciwnej krawędzi ekranu.
- Stałe absurdy poziomów są rysowane przez `drawLevelAbsurdity()` w `index.html` — jeden motyw dla każdego z 12 poziomów.
- Nowy żart bieżący: najpierw dodaj zatwierdzony wpis do `topicalGags`, wraz z datą wygaśnięcia i notatką o źródle, a potem dołącz jego prostą animację w `index.html`.
- Kamieniarz, kamieniołomy, automatyczne dostawy i trzy etapy graficznej rozbudowy zamku są częścią wspólnego silnika w `index.html`; jednostka jest dostępna dopiero od poziomu 7.
- System rozbudowy celowo nie ma osobnej waluty ani dodatkowego panelu. Koszt jest płacony w złocie przy zakupie Kamieniarza, a postęp widać bezpośrednio przy zamku.
- Bossowie są częścią wspólnego silnika w `index.html`; zwykłe jednostki nie mogą ich kupić ani wylosować w kolejce AI.

## Ważne przy publikacji

Na GitHub należy wgrać całą strukturę z zachowaniem folderów. Po aktualizacji trzeba zwiększyć numer `CACHE` w `sw.js`, inaczej telefon może nadal pokazywać starszą wersję.

Rdzeń gry pozostaje obecnie w jednym `index.html`, ponieważ jego przedwczesne rozdzielenie zwiększa ryzyko nowych błędów. Rozdzielenie silnika, renderowania i danych jest zaplanowane po zamknięciu balansu podstawowych mechanik.
