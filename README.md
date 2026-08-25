# Castle Calamity — paczka PWA

Kompletna aplikacja webowa (PWA). Po wgraniu na hosting HTTPS gracze mogą
dodać grę do ekranu głównego telefonu — działa jak natywna aplikacja,
na pełnym ekranie i **offline**.

## Co zawiera wersja v4.6
- 12 poziomów i 14 dostępnych jednostek,
- opcjonalny samouczek pierwszego poziomu, który można pominąć i uruchomić ponownie,
- przełącznik języka polskiego i angielskiego z zapisem wyboru,
- fundament jednego silnika obsługującego w przyszłości pakiety różnych epok,
- poprawione skalowanie postaci oraz HUD-u na telefonach w poziomie,
- trzy całkowicie przebudowane sylwetki premium: mnich z animacją leczenia, ciężki golem z artykułowanymi kończynami oraz profilowy oszczepnik z pustą dłonią po rzucie,
- wielowarstwowe tła z bardzo wolną paralaksą chmur, wzgórz i gór, mgłą atmosferyczną oraz odległymi ruinami,
- rozbudowane efekty Deszczu Strzał, Mrozu i Zewu Bitwy bez zmiany ich balansu,
- zasięg łucznika zwiększony do 170 jednostek i skalowany do wysokości pola bitwy,
- formację łuczników: dwóch pobliskich łuczników aktywuje subtelną aurę, +12% ataku i szybszą salwę,
- zasięg czarownika zwiększony do 180 jednostek,
- przeprojektowanego łucznika ustawionego profilem do celu,
- wysoką, kontrolowaną parabolę kuli armatniej z cieniem, smugą i efektem uderzenia,
- naprawiony pełny rzut oszczepnika: wypuszczenie z dłoni, czytelna smuga i balistyczny lot,
- kamieniarza od poziomu 7: maksymalnie dwóch naraz, automatyczna dostawa i trzy wizualne etapy rozbudowy zamku,
- każda ukończona rozbudowa dodaje 7,5% maksymalnego HP zamku (łącznie 22,5%); późniejsze dostawy lekko naprawiają mury,
- krótsze, 13,35-sekundowe intro bez napisów i HUD: policjant wystawia mandat kuli armatniej, po czym regulamin przegrywa,
- pięć doktryn przeciwnika: zrównoważoną, defensywną, agresywną, oblężniczą i chaotyczną,
- umiarkowane kontry jednostek z opisem w podpowiedziach i dyskretnym efektem trafienia,
- dwóch prawdziwych bossów na polu walki: Władcę Krwawej Łuny na poziomie 10 i Króla Demonów na poziomie 12,
- trzy czytelne fazy każdego bossa, osobny pasek HP, zapowiadane ataki i nagrodę za pokonanie,
- Władcę Łuny z aurą, rozkazem, szarżą i jednorazową przerwą na herbatę oraz Króla Demonów z seriami ognia, portalami i teleportem,
- celowany Deszcz Strzał w trzech falach,
- Mróz trwający 3,8 s i obejmujący nowe jednostki wroga,
- dwanaście rzadkich gagów wizualnych — inny na każdym poziomie i najwyżej jeden podczas bitwy; kartki latającego biurka nie przeskakują już między końcami pętli,
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
| `docs/AUDYT-V4.4.md` | Wyniki audytu, wykonane poprawki i pozostawione ryzyka |
| `docs/ETAP-BOSSOW-V4.5.md` | Zachowania, balans i testy bossów poziomów 10 i 12 |
| `docs/GRAFIKA-PREMIUM-V4.6.md` | Nowe animacje jednostek, głębia plansz i efekty umiejętności |
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
np. `castle-calamity-v4.6` → `castle-calamity-v4.7`.
Gracze dostaną nową wersję przy następnym otwarciu z internetem.

## Test lokalny (opcjonalnie)
W katalogu paczki: `python3 -m http.server 8000` → http://localhost:8000
(Service worker działa na localhost bez HTTPS.)

## Następny krok: Google Play
Ta paczka to gotowy fundament pod sklep Google (TWA/Bubblewrap).
Potrzebne: konto Google Play Developer (25$ jednorazowo) + URL z tej paczki.
