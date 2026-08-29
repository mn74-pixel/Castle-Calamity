# Castle Calamity — architektura epok

## Główna zasada

Gra ma jeden wspólny silnik. Epoka nie jest osobną grą ani kopią kodu, lecz
pakietem danych i oprawy podłączanym do tego samego systemu walki.

Wspólny silnik odpowiada za:

- skalowanie telefonu i monitora,
- sterowanie, samouczek i dostępność,
- ekonomię, sztuczną inteligencję i obliczanie walki,
- pociski, efekty, kolizje oraz animacje,
- zapis postępu, ustawień i języka,
- interfejs PL/EN, PWA i działanie offline,
- reguły losowania humoru i treści reklamowych.

Pakiet epoki będzie określał:

- wygląd zamków lub baz,
- tła, pogodę i elementy pola walki,
- zestaw jednostek, ich stroje i animacje,
- broń, pociski, zdolności i dźwięki,
- profil balansu i zachowanie przeciwników,
- własną pulę humoru oraz scenografię poziomów.

## Obecne pakiety

Pakiet `medieval` zawiera pełne 12 poziomów Epoki I. Pakiet `early-modern` jest
aktywny od v6.0 i tworzy pierwszy zamknięty rozdział Epoki II „Proch i
Mechanika”. Odblokowuje się po ukończeniu średniowiecza i zawiera cztery bitwy,
ceglane bastiony, Pikiniera, Muszkietera, Sapera oraz Moździerz.

Oba pakiety korzystają z jednego silnika walki, wspólnego katalogu ulepszeń i
limitu ośmiu kart, ale mają osobne ukończenia, mapy, tła i pulę humoru. Nowe
pociski wykorzystują ten sam system ciągłego wykrywania kolizji: muszkiet leci
prawie prosto, a moździerz korzysta z wysokiego łuku i większego rozrzutu.

## Kolejność rozwoju

1. Stabilny i użyteczny silnik: samouczek, PL/EN, zapis, skalowanie, PWA.
2. Spójna grafika i komplet animacji wszystkich średniowiecznych jednostek.
3. Balans 12 poziomów, bossowie, dźwięk, wydajność i testy urządzeń.
4. Drugi pakiet epoki jako test architektury — ukończony w v6.0.
5. Rozbudowa Epoki II po testach jej czterech pierwszych bitew, bez kopiowania silnika.

## Zasady lokalizacji

- Tekst nie może być wrysowany na stałe w grafikę.
- Nowy komunikat trafia do `content/i18n.js` jednocześnie po polsku i angielsku.
- Pakiety epok używają identyfikatorów tłumaczeń, a nie gotowych napisów.
- Wybrany język jest zapamiętywany na urządzeniu.

## Dalsze możliwe epoki

Po Epokach I i II naturalny rozwój może prowadzić przez przemysł do XX wieku,
współczesności lub absurdalnej przyszłości. Każdy następny pakiet powstanie
dopiero po potwierdzeniu, że poprzedni nie wymaga kopiowania wspólnego silnika.
