# Castle Calamity — nadrzędne zasady produkcji

Ten dokument jest obowiązującym filtrem decyzyjnym dla każdej kolejnej wersji
gry. Nie jest listą funkcji do mechanicznego odhaczania. Określa, po co dana
zmiana ma istnieć i kiedy wolno uznać ją za gotową.

## Kompas projektu

Każda decyzja jest oceniana w tej kolejności:

**FUN > GAME FEEL > GAMEPLAY > CLARITY > PERFORMANCE > ART > FEATURES**

Jeżeli nowa funkcja pogarsza wcześniejszy punkt tej listy, nie trafia do
wydania. Więcej zawartości nie rekompensuje słabszej zabawy, reakcji gry,
czytelności ani płynności.

## Główna obietnica gry

Castle Calamity ma dawać krótką, czytelną bitwę strategiczną, w której gracz:

1. obserwuje zagrożenie i aktualną sytuację,
2. wydaje drewno na właściwą jednostkę lub czeka na lepszy moment,
3. natychmiast widzi i słyszy skutek decyzji,
4. uczy się kontr, ustawienia oraz tempa ekonomii,
5. po zwycięstwie lub porażce rozumie, co zadziałało i chce spróbować ponownie.

Gra nie może wymagać od gracza pilnowania wielu walut, mikrozarządzania
zapleczem ani czytania ścian tekstu. Czas i drewno pozostają naturalnymi
ograniczeniami rekrutacji. Osiem oznacza najwyżej osiem różnych kart w bitwie,
nie limit żywych bojowników.

## Obowiązkowy przebieg pracy

Każda zmiana przechodzi przez sekwencję:

**SYMPTOM → ROOT CAUSE → FIX → REGRESSION TEST**

Każdy większy etap przechodzi przez:

**BUILD → PLAY → ANALYZE → IMPROVE → SIMPLIFY**

Przed kodowaniem trzeba określić oczekiwany efekt odczuwalny przez gracza.
Po kodowaniu trzeba sprawdzić wpływ na całą bitwę, a nie wyłącznie na nowy
fragment. Pierwsza działająca wersja nie jest automatycznie wersją finalną.

## Pięć warstw audytu

### 1. Gameplay

- każda dostępna karta ma rzeczywistą rolę w danym poziomie,
- żadna jednostka wsparcia nie może na stałe zatrzymać natarcia,
- poziom ma mini-łuk: wprowadzenie, odkrycie, wyzwanie, zwrot i rozwiązanie,
- trudność wynika z nowych kombinacji i zachowań, nie tylko z większego HP,
- gracz nie czeka bez sensownej decyzji i rozumie przyczynę porażki,
- nie ma ukrytego wzmacniania przeciwnika na podstawie wyników gracza.

### 2. Sterowanie i game feel

- każdy ważny dotyk ma natychmiastowy feedback wizualny lub dźwiękowy,
- karty pozostają stabilne: bez drżenia, pulsowania i zmiany położenia,
- ataki mają anticipation, czytelny moment wypuszczenia i impact,
- wstrząs, hit stop, cząstki i ślady są krótkie oraz proporcjonalne do siły,
- efekty nie zasłaniają celu ani ważnej informacji taktycznej.

### 3. Grafika i czytelność

- gracz, wróg, zagrożenie, cel i nagroda są rozpoznawalne w pierwszej chwili,
- tło ma mniejszy kontrast niż elementy rozgrywki,
- postacie zachowują wspólne proporcje, grubość konturu i kierunek światła,
- ludzkie postacie humorystyczne mają skalę żołnierza,
- zamek zmienia się subtelnie wraz z kampanią i wyraźniej między epokami,
- gag jest krótki, rzadki i nigdy nie konkuruje z głównym starciem.

### 4. Audio

- ważny input, trafienie, nagroda i zmiana fazy mają odrębny sygnał,
- powtarzane efekty korzystają z niewielkiej wariacji wysokości i czasu,
- najważniejsze dźwięki walki pozostają słyszalne pod muzyką,
- miks jest kontrolowany również na małym głośniku telefonu,
- brak dźwięku nie może odbierać informacji koniecznej do gry.

### 5. Performance i mobile first

- test obejmuje komputer oraz mały i duży iPhone w poziomie,
- HUD omija notch, Dynamic Island, pasek Safari i dolny safe area,
- kontrolki dotykowe nie wymagają precyzji myszy,
- długa bitwa i poziom bossowski nie tworzą nieograniczonej liczby obiektów,
- optymalizacja ogranicza przede wszystkim dekorację, a nie zasady rozgrywki,
- przejście aplikacji do tła nie powoduje nadrabiania symulacji po powrocie,
- PWA uruchamia się offline i poprawnie przelicza pełny ekran.

## Art direction Castle Calamity

- czytelna, lekko teatralna kreskówkowa scenografia z ręcznie budowanymi
  sylwetkami Canvas,
- mocniejszy kontrast i bardziej nasycony kolor na jednostkach niż w tle,
- ciemny, spójny kontur; oświetlenie od góry i lekko z przodu,
- masywne, łatwe do rozpoznania proporcje postaci i broni,
- animacja oparta na ciężarze, łuku ruchu i krótkim overshoocie, nie na
  przypadkowym przesuwaniu całej bryły,
- UI przypomina planszowe karty i nie zmienia geometrii podczas bitwy,
- Epoka II ma własne ceglane forty, dym, mechanikę i paletę; nie może wyglądać
  jak średniowieczny zamek z przyklejonym dodatkiem.

## Zasady humoru

- najwyżej jeden główny gag ruchomy w bitwie,
- gag ma pełny początek, puentę i zakończenie bez teleportowania lub zanikania,
- pranie jest pojedynczym żartem jednego zamku, a nie stałym motywem,
- absurd nie zadaje przypadkowych obrażeń ani nie zmienia wyniku bitwy,
- żarty tła pojawiają się rzadko i nie zasłaniają jednostek, HP ani przycisków,
- postać humorystyczna może zostać krócej na ekranie, jeśli odciąga uwagę.

## Zero placebo

Nie dodajemy przycisków, parametrów, walut, efektów ani ulepszeń, których wpływu
gracz nie potrafi zauważyć. Każda mechanika musi mieć:

- jasny cel,
- natychmiastowy feedback,
- konsekwencję,
- nagrodę albo koszt decyzji,
- możliwość nauczenia się czegoś przy kolejnej próbie.

Jeżeli prostsze rozwiązanie daje ten sam efekt, wybieramy prostsze.

## Architektura i jakość kodu

- nowa zawartość epok powinna być danymi lub małym, jasno nazwanym modułem,
- bossowie, jednostki i gag nie mogą powielać całej pętli gry,
- nie dopisujemy kolejnych wyjątków do wadliwego systemu; najpierw izolujemy
  źródło problemu i przebudowujemy jego granicę,
- działającego systemu nie refaktoryzujemy bez testu zachowania przed zmianą,
- stan bitwy, renderowanie i interfejs nie powinny potajemnie zmieniać swoich
  danych nawzajem,
- każda wersja aktualizuje cache PWA dopiero wtedy, gdy zawiera zmianę gry lub
  zasobów aplikacji.

Obecny duży plik `index.html` pozostaje ryzykiem technicznym. Dalsza rozbudowa
nie może zwiększać tego ryzyka bez końca. Systemy będą wydzielane etapami,
zaczynając od statycznych danych epok i poziomów, zawsze przy zachowaniu pełnej
regresji. Nie wykonujemy jednorazowego, ryzykownego przepisywania całej gry.

## Bramka wydania

Wersja może zostać opublikowana tylko wtedy, gdy spełnia wszystkie punkty:

| Warstwa | Minimalny dowód odbioru |
|---|---|
| Fun | pełna próba poziomu i brak fragmentu wymagającego bezczynnego czekania |
| Game feel | dotyk, rekrutacja, atak, trafienie i nagroda mają czytelny feedback |
| Gameplay | wszystkie karty poziomu działają i nie powstaje trwały korek |
| Clarity | HP, zasoby, cele i przyciski są zgodne z rzeczywistym stanem |
| Performance | długa symulacja, boss i tryb oszczędny pozostają stabilne |
| Mobile | mały i duży iPhone mieszczą HUD z uwzględnieniem safe area |
| Audio | nowe zdarzenie nie zagłusza ataków, ostrzeżeń ani UI |
| PWA | start online, start offline, aktualizacja cache i pełny ekran przechodzą test |
| Regression | kampania, obie epoki, PL/EN, zapis i wcześniejsze poprawki nadal działają |

Automatyczne testy są konieczne, ale nie zastępują krótkiej gry na prawdziwym
telefonie. Element zależny od dotyku, miksu lub odczucia tempa pozostaje
oznaczony jako wymagający testu ręcznego, dopóki taki test się nie odbędzie.

## Najbliższy kierunek

Rozwój Epoki II będzie realizowany jako pełne mini-łuki poziomów, nie jako
prosta inflacja statystyk. Najpierw powstaną kombinacje wykorzystujące znane
piki, muszkiety, saperów i moździerze oraz czytelniejsze warianty fortów.
Nowa jednostka lub system pojawi się dopiero wtedy, gdy istniejący zestaw nie
potrafi dostarczyć potrzebnej decyzji, zwrotu albo kontrgry.
