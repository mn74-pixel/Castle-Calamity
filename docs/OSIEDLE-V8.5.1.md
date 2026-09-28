# Osiedle v8.5.1 — ruch ekipy i komediowe poddanie

## Przyczyna korka

W wersji 8.5.0 wszyscy poruszali się jednym szeregiem. Sąsiadka zatrzymywała
się 0,155 szerokości mapy od przeciwnika, a dresiarz za nią potrzebował
zbliżyć się na 0,035. Kolizja z sojusznikiem uniemożliwiała dojście do celu.
Więcej dresiarzy powiększało kolejkę zamiast zwiększać aktywny front.

Test ustawiający dresiarza za własną zatrzymaną sąsiadką odtworzył problem
przed poprawką. Teraz przechodzi dla obu stron.

## Reguły ruchu

- Rekrutacja rozkłada jednostki pomiędzy trzy pasy, wybierając mniej zajęty.
- Kolejny rekrut pojawia się za końcem własnego szeregu, nie wewnątrz niego.
- Po 0,45 s blokady przez sojusznika jednostka może wejść na wolny sąsiedni
  pas. Sprawdzana jest obecność obu drużyn; animacja zmiany pasa jest płynna.
- Jednostki wręcz spotykają się na swoim pasie; sąsiadka wspiera wszystkie.
- Przeciwnika na tym samym pasie nie można przeniknąć. Wolny pas pozwala
  oskrzydlić natarcie. Nadal nie ma limitu liczby jednostek.
- Wycofujący się nie blokują drogi, nie atakują i nie wracają do walki
  wskutek leczenia. Wracają poza ekran własną stroną, bez znikającego ciała.

## Lżejszy ton

HP baz jest technicznym nośnikiem morale gospodarza. Wyzerowanie morale
uruchamia osunięcie postaci wewnątrz loggii i białą chusteczkę, nie śmierć
ani upadek z okna. Budynek nie zmienia wyglądu. Trafienia omijają wspólne
efekty uszkadzania zamków; osobno wyłączono generator ognia i ruin oraz
sekwencję wyburzenia. Butelkom towarzyszą krople zamiast ostrych odłamków.
Po rozstrzygnięciu ekipy wracają do domu, a aktywne pociski są usuwane.
Raport mówi o wycofanych, nie zabitych. Zmiany dotyczą tylko Osiedla.

## Weryfikacja i ograniczenia

Testy obejmują omijanie wsparcia po obu stronach, rozstawienie 30 rekrutów
bez nakładania, starcia 12 kontra 12 na czterech etapach, wycofanie, kontry,
stały krok symulacji i pełne bitwy. Nowy test finału wykrył drugi generator
wyburzenia w `castleFX`; został wyłączony dla Osiedla, nie tylko ukryty.
Test obrazu porównuje identyczność budynku przy pełnym i zerowym morale.
Obie strony sprawdzane są pod kątem poddania, braku ruin i efektów zniszczeń.

Porównanie strategii odbywa się dodatkowo w tej samej minucie symulacji:
wyniku obrony nie należy porównywać wyłącznie po końcowym HP bitew o różnej
długości. Strategie z ekipą i z samymi butelkami nadal mogą wygrać.

Rendery obejmują komputer i telefon w poziomie; nie zastępują testu dotyku,
odbioru humoru i tempa na fizycznym telefonie. Regresje historycznych epok
oraz PWA są częścią zestawu testów. Cache i aplikacja mają wersję 8.5.1.
