# Castle Calamity — paczka PWA

Kompletna aplikacja webowa (PWA). Po wgraniu na hosting HTTPS gracze mogą
dodać grę do ekranu głównego telefonu — działa jak natywna aplikacja,
na pełnym ekranie i **offline**.

## Co zawiera wersja v4.1
- 12 poziomów i 13 dostępnych jednostek,
- opcjonalny samouczek pierwszego poziomu, który można pominąć i uruchomić ponownie,
- przełącznik języka polskiego i angielskiego z zapisem wyboru,
- fundament jednego silnika obsługującego w przyszłości pakiety różnych epok,
- poprawione skalowanie postaci oraz HUD-u na telefonach w poziomie,
- zasięg łucznika zwiększony do 150 jednostek,
- zasięg czarownika zwiększony do 180 jednostek,
- przeprojektowanego łucznika ustawionego profilem do celu,
- niski, czytelny tor kuli armatniej z cieniem, smugą i efektem uderzenia,
- celowany Deszcz Strzał w trzech falach,
- Mróz trwający 3,8 s i obejmujący nowe jednostki wroga,
- intro bez bocznej winiety i napisów fabularnych, z policjantem zabezpieczającym saksofon stożkiem drogowym,
- pięć rzadkich, losowych gagów wizualnych, które przechodzą przez cały ekran,
- osobny dyskretny absurd scenograficzny na każdym z 12 poziomów,
- latającą rybę z łatwo zmienianym proporcem reklamowym,
- trwały zapis postępu i własnych herbów w pamięci urządzenia.

## Zawartość paczki
| Plik | Rola |
|---|---|
| `index.html` | Silnik, grafika Canvas, poziomy, intro i interfejs |
| `content/gags.js` | Częstotliwość humoru i treść reklamy na rybie |
| `content/i18n.js` | Polskie i angielskie teksty gry |
| `content/eras.js` | Rejestr pakietów epok; obecnie średniowiecze |
| `manifest.json` | Metadane aplikacji: nazwa, ikony, fullscreen i landscape |
| `sw.js` | Service worker i pamięć offline |
| `assets/icons/` | Zwykłe i maskowalne ikony aplikacji |
| `docs/KATALOG-PLIKOW.md` | Mapa paczki i wskazówki, gdzie wprowadzać zmiany |
| `docs/PLAN-DZIALANIA.md` | Etapy dalszego rozwoju gry |
| `docs/ARCHITEKTURA-EPOK.md` | Zasady wspólnego silnika i przyszłych epok |

## Wdrożenie — GitHub Pages (darmowe, 5 minut)
1. Załóż repo na github.com (np. `castle-calamity`), może być publiczne.
2. Wgraj WSZYSTKIE pliki z tej paczki do głównego katalogu repo.
3. Wejdź do swojego repozytorium, kliknij zakładkę **Settings** w górnym pasku, a potem **Pages** w menu po lewej. Ustaw Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Po ~1 min gra działa pod `https://TWOJA-NAZWA.github.io/castle-calamity/`.

## Wdrożenie — własny hosting (np. funkycats.pl)
Wgraj pliki przez FTP do katalogu, np. `public_html/castle/`.
Wymóg: **HTTPS** (service worker nie działa po HTTP). Certyfikat Let's Encrypt wystarczy.

## Instalacja na telefonie (co zobaczy gracz)
- **Android/Chrome**: otwiera URL → Chrome sam zaproponuje "Dodaj do ekranu głównego" (albo menu ⋮ → Dodaj do ekranu głównego). Ikona zamku pojawia się jak aplikacja.
- **iPhone/Safari**: otwiera URL → przycisk Udostępnij → "Do ekranu początkowego".
- Po instalacji gra uruchamia się **na pełnym ekranie, bez paska przeglądarki, działa bez internetu**.

## Aktualizacja gry
Podmień zmienione pliki na hostingu i zwiększ w `sw.js` wersję cache,
np. `castle-calamity-v4.1` → `castle-calamity-v4.2`.
Gracze dostaną nową wersję przy następnym otwarciu z internetem.

## Test lokalny (opcjonalnie)
W katalogu paczki: `python3 -m http.server 8000` → http://localhost:8000
(Service worker działa na localhost bez HTTPS.)

## Następny krok: Google Play
Ta paczka to gotowy fundament pod sklep Google (TWA/Bubblewrap).
Potrzebne: konto Google Play Developer (25$ jednorazowo) + URL z tej paczki.
