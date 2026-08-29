# Castle Calamity v6.0 — iPhone i otwarcie Epoki II

## Poprawki zgłoszonych problemów

- Gra mierzy faktycznie widoczny `visualViewport`, jego przesunięcie oraz
  `safe-area-inset-*`. Canvas mieści się między wycięciem ekranu, paskiem
  Safari i wskaźnikiem ekranu głównego.
- Usunięto sztuczny minimalny rozmiar płótna, który mógł być większy od
  widocznej części Safari.
- Poziom 1 ma trzy drzewa i najwyżej trzy odrosty. Oba zamki mają 1400 HP,
  mnożnik złota wynosi 1,55, a AI rozpoczyna kolejną decyzję po 9 sekundach.
- Pasek i liczba HP zamku korzystają z jednego obiektu `castleHealthView`,
  więc po obrażeniach obie wartości zmieniają się w tej samej klatce.

## Pierwszy rozdział Epoki II

Epoka „Proch i Mechanika” odblokowuje się po ukończeniu wszystkich 12 bitew
średniowiecza. Zawiera cztery kompletne poziomy oraz osobną mapę postępu.

| Jednostka | Rola | Najważniejsza cecha |
|---|---|---|
| Pikinier | stabilny front | długa pika i kontra na kawalerię oraz Sapera |
| Muszkieter | daleki dystans | szybki, prawie prosty pocisk i dłuższe przeładowanie |
| Saper | niszczenie zaplecza | mocny atak na artylerię i wysokie obrażenia zamku |
| Moździerz | ciężkie oblężenie | cztery pociski, wysoki łuk i większy obszar trafienia |

Każdy poziom nadal wybiera najwyżej osiem unikalnych kart. Epoka II używa
ceglanych bastionów, manufaktur, kominów, mostów oraz stopniowych, niewielkich
zmian zamku. Mechaniczna kaczka jest osobnym, rzadkim gagiem tej epoki; pranie
pozostaje wyłącznie pojedynczym gagiem średniowiecznego poziomu 7.

Kamieniarz dostępny w czwartej bitwie Epoki II otrzymuje trzy działające
kamieniołomy. Każda dostawa nadal natychmiast lekko naprawia mur, a trzy dostawy
kończą etap rozbudowy.

## Testy

- cztery proporcje iPhone’a, w tym iPhone SE, iPhone 14, iPhone 15 Pro Max i
  Safari z ograniczoną wysokością oraz przesuniętym viewportem,
- synchronizacja liczby i paska HP po kontrolowanym trafieniu,
- limit drzew oraz parametry pierwszego poziomu,
- wszystkie 18 jednostek, ich ataki, pociski, role i odwołania kontr,
- odblokowanie, przełączanie i osobny zapis obu epok,
- cztery talie Epoki II, render telefonu i komputera oraz działanie Kamieniarza,
- pełna regresja 12 poziomów Epoki I, bossów, PL/EN, humoru, audio i PWA offline.

