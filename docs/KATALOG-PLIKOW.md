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
│   └── gags.js
└── docs/
    ├── KATALOG-PLIKOW.md
    └── PLAN-DZIALANIA.md
```

## Rola plików

| Plik | Zawartość | Kiedy zmieniać |
|---|---|---|
| `index.html` | Silnik gry, grafika Canvas, jednostki, poziomy, intro i interfejs | Przy zmianach mechaniki lub grafiki |
| `content/gags.js` | Częstotliwość humoru, lista gagów i treść reklamy na latającej rybie | Przy bieżących żartach i zmianie partnera reklamowego |
| `manifest.json` | Nazwa PWA, tryb pełnoekranowy, orientacja i ścieżki ikon | Przy zmianie nazwy lub ikon |
| `sw.js` | Pliki działające offline i numer pamięci podręcznej | Przy każdej opublikowanej wersji |
| `assets/icons/` | Ikony aplikacji na telefon i komputer | Przy nowej identyfikacji wizualnej |
| `README.md` | Instrukcja uruchomienia i publikacji | Przy zmianie sposobu wdrażania |
| `docs/PLAN-DZIALANIA.md` | Kolejność dalszego rozwoju i kryteria odbioru | Po każdej większej decyzji projektowej |

## Najprostsze bieżące zmiany

- Reklama na rybie: edytuj `flyingFishAd` w `content/gags.js`.
- Rzadziej lub częściej: edytuj `timing.nextMin` i `timing.nextMax`.
- Rzadki gag przy Deszczu Strzał: edytuj `timing.abilityGagChance` (obecnie `0.12`, czyli 12%).
- Włączenie/wyłączenie gagu: zmień pole `enabled` przy wybranym wpisie.
- Nowy żart bieżący: najpierw dodaj zatwierdzony wpis do `topicalGags`, wraz z datą wygaśnięcia i notatką o źródle, a potem dołącz jego prostą animację w `index.html`.

## Ważne przy publikacji

Na GitHub należy wgrać całą strukturę z zachowaniem folderów. Po aktualizacji trzeba zwiększyć numer `CACHE` w `sw.js`, inaczej telefon może nadal pokazywać starszą wersję.

Rdzeń gry pozostaje obecnie w jednym `index.html`, ponieważ jego przedwczesne rozdzielenie zwiększa ryzyko nowych błędów. Rozdzielenie silnika, renderowania i danych jest zaplanowane po zamknięciu balansu podstawowych mechanik.
