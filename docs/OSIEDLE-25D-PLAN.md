# Osiedle 2,5D — architektura i odbiór, v8.11.1

## Zakres i stan wdrożenia

Zostajemy przy JavaScript i Canvas 2D. Blok nigdy nie jest burzony. Morale
gospodarza, kondycja potrzebna do rzucania i wytrzymałość oddziałów pozostają
osobnymi wielkościami. Nie dodajemy nowej waluty ani ukrytej kary do statystyk.

Wdrożone: progi wyglądu 75/50/25%, powierzchniowe ślady awantury, pogięty
daszek, poluzowana obejma rury, przekrzywiona skrzynka kwiatowa, zmęczona
twarz i postawa gospodarza, światłocień koszuli, przetarcia ubrań i mimika
wszystkich dziesięciu jednostek. Przy zerowym morale nadal działa wcześniejsze
poddanie i biała flaga. Nie ma pożaru, dziur w konstrukcji ani gruzu.

Naprawione: faza chodu zależy od przebytej drogi. Spowolnienie zmniejsza teraz
także tempo kroków; zablokowana jednostka nie maszeruje w miejscu. Po powrocie
z rajdu wyższe tempo marszu ma odpowiadającą mu szybszą animację.

W v8.11.1 wdrożono wagę lokomocji narastającą i wygaszaną w symulacji oraz
dwuczłonową kinematykę nóg na płaskim podłożu. Stopa opada podczas zatrzymania;
kolano dopasowuje się bez rozciągania kończyn. Rower zachowuje własny układ.

Planowane, NIE wdrożone: pełne mieszanie póz, przyspieszenie fizyczne oddziałów,
kontakt stóp z nierównym terenem, atlasy renderowane z Blendera, adaptacyjny LOD rysunków. Nie nazywamy
gradientów Canvas systemem PBR, a kolejności stanów pełnym grafem animacji.

## Renderowanie

Utrzymujemy rozdział: dalekie bloki, pawilony, konstrukcje baz, okna i ślady,
gospodarze, dostawcy, oddziały, krótkie efekty oraz HUD. Perspektywę budują
boczne płaszczyzny, wnęki, cienie kontaktowe i mniejszy kontrast tła. Geometria
kolizji nie pochodzi z cienia lub dekoracji.

Bryła bloku pozostaje w cache; ślady są oddzielnym przebiegiem renderowania
w lokalnych współrzędnych elewacji. Liczba śladów jest stała, nie przyrasta
z każdym trafieniem. Poziom ich widoczności pochodzi z aktualnego morale.
Nie powstaje nowy sprite cache dla każdej wartości HP. Światła mieszkań,
zmęczenie, pogoda i mimika nie zapisują danych do symulacji podczas rysowania.

Kierunek światła powinien pozostać wspólny: jaśniejszy górny/lewy brzeg,
ciemniejszy bok, mocna okluzja pod daszkiem. Szkło ma odbicie płaską plamą,
beton matowy gradient, metal wąski refleks. Drobna faktura nie może dominować
nad konturem, kolorem drużyny lub oknem gospodarza.

Materiały PBR można wykorzystać offline w Blenderze, a wynik wypalić do
sprite'ów. Renderer Canvas nie odczyta bezpośrednio roughness, metalness,
normal maps ani animowanego szkieletu FBX. Runtime PBR wymagałby innego
renderera; obecny zakres tego nie uzasadnia.

Nie planujemy pełnoekranowego bloom, rozmycia ruchu ani kosztownych filtrów
Canvas w każdej klatce. Palety dnia i nocy pełnią rolę kontrolowanej korekcji
koloru. Ewentualne nowe efekty przechodzą próbę czytelności na małym ekranie.

## Fizyka i ruch

Obowiązuje dotychczasowy krok symulacji 1/30 s. Ruch odbywa się w trzech
pasach; omijanie sojuszników, szerszy wózek, ograniczenia zasięgu i rajdy mają
pierwszeństwo przed wizualnym wygładzaniem. Grafika nigdy nie przesuwa logicznego
celu ani nie skraca drogi do budynku.

Przed wprowadzeniem przyspieszenia trzeba zmierzyć czas dojścia, utrzymanie
kontr oraz czas zwrotu kredytów. Wtedy można zbliżać prędkość do docelowej
z ograniczeniem zmiany na krok, osobno definiując hamowanie. Natychmiastowe
zatrzymanie podczas patrolu i poślizgu pozostaje nadrzędne. Taka zmiana wymaga
nowego testu balansu, dlatego nie jest ukryta w aktualizacji grafiki.

Podłoże obecnie jest płaskie w każdym pasie. Przy przyszłych krawężnikach
powinno dostarczać funkcję wysokości i normalnej. Stopa kontaktowa próbuje
utrzymać punkt oparcia, druga porusza się łukiem. Rozwiązanie dwuczłonowej
nogi musi ograniczać cel do jej zasięgu, z kontrolą ugięcia kolana. IK jest
warstwą wizualną; nie może zmieniać ekonomii lub położenia oddziału.

## Animacja i kod produkcyjny

`CASTLE_ESTATE_TACTICS.condition(hp, max)` jest wspólnym, czystym modelem
progów. Brak max w miniaturze oznacza zdrową postać, nie stan krytyczny.
`animationState(unit)` rozstrzyga konflikt: wycofanie → powrót → poślizg →
trafienie → zamach → wykończenie ciosu → ruch → spoczynek. Priorytet stosuje
się do poślizgu i reakcji portretu. Animacje sprzętu zachowują istniejące
uchwyty: kierownica roweru, rękojeść wózka i miech akordeonu.

Przykład bezpośredniego odczytu z wdrożonego API:

```js
const visuals = window.CASTLE_ESTATE_TACTICS;
const condition = visuals.condition(unit.hp, unit.max);
const state = visuals.animationState(unit);
// stage: 0 — świeży, 1/2/3 — rosnące zmęczenie, 4 — wycofany.
// Wynik jest opisem wyglądu, nie modyfikatorem obrażeń lub szybkości.
```

Dalsze mieszanie póz należy liczyć w symulacji, a nie w funkcji rysującej.
Przejścia lokomocji mogą być łagodne; faza wypuszczenia pocisku i faktyczne
trafienie muszą pozostać związane z istniejącymi timerami walki. Każda klatka
powinna zachowywać sylwetkę konkretnej roli, zamiast deformować wszystkie
postacie identycznym efektem.

## Gotowe zasoby

- [Kenney](https://kenney.nl/support): zasoby z katalogu assetów są CC0.
  Przydatne do prototypowania rekwizytów i interfejsu; wymagają dopasowania
  do polskiego osiedla, epoki, palety i skali gry.
- [Poly Haven](https://polyhaven.com/license): modele, tekstury i HDRI CC0.
  Materiały betonu i metalu mogą pomóc w renderach offline. Fotorealistyczna
  faktura wymaga uproszczenia przed użyciem w stylizowanej grze.
- [Mixamo](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html): postacie
  i animacje mogą być używane royalty-free w projektach. Potencjalne źródło
  bazowego chodu do retargetowania i renderu offline, nie biblioteka Canvas.

Nie pobrano ani nie dołączono nowych zasobów. Każdy przyszły import powinien
mieć zapisany adres źródła i warunki wykorzystania. Nie sprzedajemy ani nie
publikujemy osobno cudzej biblioteki animacji.

## Wydajność i odbiór

Przyszły LOD ogranicza dekorację, nie jednostki: mniej fałd, refleksów i
kropli, bez usuwania sylwetek, pasków lub informacji o celu. Atlasy powinny
mieć budżet pamięci; sama tekstura RGBA 2048×2048 zajmuje około 16 MiB przed
dodatkowymi kopiami. Nie obiecujemy stałych 60 FPS bez pomiaru urządzenia.

Automatyczne testy obejmują granice progów, wszystkie jednostki, obie bazy,
dzień i noc, brak mutacji w renderze, stałą konstrukcję, limit cache,
niezależność symulacji od FPS, mokrą i suchą pełną bitwę oraz PWA offline.
Wygenerowane podglądy obejmują mały ekran. Dotyk, płynność Safari, zużycie
energii i subiektywna czytelność wymagają jeszcze fizycznego telefonu.
