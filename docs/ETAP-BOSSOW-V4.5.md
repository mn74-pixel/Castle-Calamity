# Castle Calamity — etap bossów v4.5

## Cel

Poziomy 10 i 12 miały wcześniej tylko oznaczenie `boss:true` oraz mocniejsze
zamki. W wersji v4.5 otrzymały prawdziwych dowódców walczących na polu bitwy,
odrębne sylwetki, trzy fazy i czytelne zapowiedzi ataków.

## Poziom 10 — Władca Krwawej Łuny

- 1200 HP, walka w zwarciu i 150 złota nagrody.
- Faza 1: delikatna aura pobliskiej armii oraz okresowy rozkaz wzmacniający.
- Faza 2: zapowiadana okręgiem i pasem na ziemi szarża oraz szeroki zamach.
- Faza 3: rozkaz i szarża występują naprzemiennie.
- Przy wejściu w fazę 3 boss robi jedną 2,8-sekundową przerwę na herbatę.
  Żart jest bez napisu i jednocześnie daje graczowi chwilę oddechu.

## Poziom 12 — Król Demonów

- 1700 HP, walka dystansowa i 250 złota nagrody.
- Liczba kul ognia rośnie wraz z fazą: jedna, dwie, następnie trzy.
- Portal ma 1,45 sekundy zapowiedzi i może utrzymywać najwyżej dwóch sług.
- Od fazy 2 boss potrafi zapowiedzieć teleport i odsunąć się w stronę zamku.
- W 30% walk pierwszy portal fazy 3 myli dokumenty i zamiast sługi wypuszcza
  koronowaną kurę przez cały ekran. Zastępuje ona zwykły gag tej bitwy.

## Zasady balansu

- Boss nie ginie automatycznie po dotarciu do zamku; atakuje go cyklicznie.
- Wszystkie specjalne działania mają zapowiedź graficzną.
- Wzmocnienia Władcy są umiarkowane i ograniczone zasięgiem.
- Portal nie może zalać planszy nieskończoną falą przeciwników.
- Bossowie podlegają Mrozowi i normalnym kontrom wynikającym z poziomu jednostki.

## QA

Automatycznie sprawdzono:

- przypisanie właściwego bossa do poziomów 10 i 12,
- wszystkie trzy fazy i jednorazową przerwę na herbatę,
- trzy pociski finałowej fazy Króla Demonów,
- zapowiedź portalu i limit przywołań,
- render 1280×720 oraz 844×390,
- 60 sekund symulacji poziomów 1, 7, 10 i 12 bez `NaN` lub błędu stanu,
- pełną regresję samouczka, jednostek, armaty, gagów, języków i intro.

## Następny etap

Po krótkim teście odczucia trudności przez gracza przechodzimy do grafiki
premium: animacji mnicha, golema i oszczepnika, głębszego tła oraz efektów
czarów. Nowych epok jeszcze nie rozpoczynamy.
