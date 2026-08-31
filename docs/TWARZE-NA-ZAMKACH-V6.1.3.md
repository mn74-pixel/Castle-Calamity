# Castle Calamity v6.1.3 — prawdziwe twarze na zamkach

## Założenie

Gracz może dodać zdjęcie swoje i przeciwnika. Gra ma pokazać rozpoznawalną,
prawdziwą twarz na zamku, a nie cały przypadkowy kadr i nie wersję cartoon.
Przetwarzanie pozostaje lokalne w przeglądarce.

## Przepływ

1. Zdjęcie jest wczytywane z urządzenia bez przesyłania do serwera.
2. Gra próbuje znaleźć do sześciu twarzy i wybiera największą, z lekką
   preferencją dla osoby znajdującej się bliżej środka kadru.
3. Gdy natywny wykrywacz nie jest dostępny, lokalny skaner szuka spójnego
   obszaru twarzy; ostatecznym zabezpieczeniem jest powiększony kadr portretowy.
4. Twarz jest powiększana do 192×192 px i otrzymuje miękką owalną maskę alfa.
5. Wynik jest zapisywany jako PNG i pozostaje w pamięci urządzenia.

## Ochrona wyglądu

- brak kwantyzacji RGB, posterizacji i filtra cartoon,
- brak rozciągania obrazu do pionowego lub poziomego prostokąta,
- jeden wspólny renderer zachowujący proporcje na tarczy, bannerze i fladze,
- przezroczystość odsłania barwę drużyny zamiast prostokątnego tła zdjęcia,
- starsze zapisane obrazy nadal się wyświetlają, ale nowe wycięcie wymaga
  ponownego dodania oryginalnego zdjęcia.

## Weryfikacja

- syntetyczny portret sprawdza wykrycie twarzy bez sieci,
- narożniki wynikowego PNG są przezroczyste, środek pozostaje w pełni kryjący,
- piksele zachowują pierwotny kolor bez cartoon,
- test statyczny potwierdza użycie PNG, maski alfa i ścieżki FaceDetector,
- pełna regresja obejmuje 16 poziomów, 18 jednostek i cztery profile iPhone,
- test PWA potwierdza instalację i start bez internetu.
