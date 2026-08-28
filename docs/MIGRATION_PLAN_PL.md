# Plan technologiczny SlingToon

## Etap 1 — PWA / GitHub Pages

Cel: możliwie szybko sprawdzić, czy `Sling → Bang → Śmiech → Again` daje satysfakcję bez tarcia instalacyjnego.

- HTML5 Canvas do renderowania gry,
- modułowa logika fizyki w JavaScript,
- responsywne sterowanie Pointer Events,
- lokalne wczytywanie twarzy,
- działanie offline przez service worker,
- automatyczna publikacja na GitHub Pages.

## Etap 2A — opakowanie natywne

Jeżeli zakres PWA pozostanie wystarczający, wersję webową można opakować przez Capacitor. Zachowujemy kod rozgrywki i renderowania, dodając natywne mosty dla haptics, zakupów, udostępniania i sklepów.

## Etap 2B — silnik gry

Jeżeli kolejne światy, złożona fizyka lub efekty przekroczą komfortowy zakres Canvas/PWA, warstwa wykonawcza zostanie przeniesiona do Godota. Zachowujemy:

- zasady i balans,
- format danych poziomów,
- assety SVG/PNG,
- teksty, osobowości i strukturę reakcji,
- testowe wektory strzałów i oczekiwane wyniki.

Do ponownego napisania pozostaje wtedy renderer, integracja wejścia i implementacja modelu fizyki w języku silnika. Dlatego model gry już teraz jest oddzielony od DOM i Canvas.

## Kryteria decyzji o migracji

Migracja ma sens dopiero, gdy wystąpi co najmniej jeden z warunków:

1. rdzeń rozgrywki przeszedł test retencji i chcemy wydania sklepowego,
2. potrzebujemy natywnych płatności, Game Center/Play Games lub rozbudowanych haptics,
3. liczba aktywnych ciał i efektów powoduje spadki płynności na urządzeniach docelowych,
4. produkcja poziomów wymaga wizualnego edytora scen.

PWA nie jest ślepą uliczką. Jest najtańszym etapem walidacji przed kosztowniejszą produkcją natywną.
