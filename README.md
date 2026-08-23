# Castle Calamity — paczka PWA

Kompletna aplikacja webowa (PWA). Po wgraniu na hosting HTTPS gracze mogą
dodać grę do ekranu głównego telefonu — działa jak natywna aplikacja,
na pełnym ekranie i **offline**.

## Co zawiera ta wersja
- 12 poziomów i 13 dostępnych jednostek,
- poprawione skalowanie postaci oraz HUD-u na telefonach w poziomie,
- celowany Deszcz Strzał w trzech falach,
- Mróz trwający 3,8 s i obejmujący nowe jednostki wroga,
- intro bez napisów, nową oprawę menu i rzadkie abstrakcyjne gagi wizualne,
- trwały zapis postępu i własnych herbów w pamięci urządzenia.

## Zawartość paczki
| Plik | Rola |
|---|---|
| index.html | Cała gra (jeden plik) + rejestracja service workera |
| manifest.json | Metadane aplikacji (nazwa, ikony, fullscreen, landscape) |
| sw.js | Service worker — cache offline |
| icon-192.png, icon-512.png | Ikony aplikacji |
| icon-maskable-*.png | Ikony maskowalne (Android adaptive icons) |

## Wdrożenie — GitHub Pages (darmowe, 5 minut)
1. Załóż repo na github.com (np. `castle-calamity`), może być publiczne.
2. Wgraj WSZYSTKIE pliki z tej paczki do głównego katalogu repo.
3. Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Po ~1 min gra działa pod `https://TWOJA-NAZWA.github.io/castle-calamity/`.

## Wdrożenie — własny hosting (np. funkycats.pl)
Wgraj pliki przez FTP do katalogu, np. `public_html/castle/`.
Wymóg: **HTTPS** (service worker nie działa po HTTP). Certyfikat Let's Encrypt wystarczy.

## Instalacja na telefonie (co zobaczy gracz)
- **Android/Chrome**: otwiera URL → Chrome sam zaproponuje "Dodaj do ekranu głównego" (albo menu ⋮ → Dodaj do ekranu głównego). Ikona zamku pojawia się jak aplikacja.
- **iPhone/Safari**: otwiera URL → przycisk Udostępnij → "Do ekranu początkowego".
- Po instalacji gra uruchamia się **na pełnym ekranie, bez paska przeglądarki, działa bez internetu**.

## Aktualizacja gry
Podmień `index.html` na hostingu i zmień w `sw.js` wersję cache:
`const CACHE = "castle-calamity-v3";` (v2 → v3 → v4...).
Gracze dostaną nową wersję przy następnym otwarciu z internetem.

## Test lokalny (opcjonalnie)
W katalogu paczki: `python3 -m http.server 8000` → http://localhost:8000
(Service worker działa na localhost bez HTTPS.)

## Następny krok: Google Play
Ta paczka to gotowy fundament pod sklep Google (TWA/Bubblewrap).
Potrzebne: konto Google Play Developer (25$ jednorazowo) + URL z tej paczki.
