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

## Obecny pakiet

Aktywny jest wyłącznie pakiet `medieval`. Jego rejestr znajduje się w
`content/eras.js`. Najpierw dopracowujemy go jako wzorzec jakości całej gry.

## Kolejność rozwoju

1. Stabilny i użyteczny silnik: samouczek, PL/EN, zapis, skalowanie, PWA.
2. Spójna grafika i komplet animacji wszystkich średniowiecznych jednostek.
3. Balans 12 poziomów, bossowie, dźwięk, wydajność i testy urządzeń.
4. Dopiero po zamknięciu fundamentu — drugi pakiet epoki jako test architektury.
5. Kolejne epoki po potwierdzeniu, że nie wymagają kopiowania silnika.

## Zasady lokalizacji

- Tekst nie może być wrysowany na stałe w grafikę.
- Nowy komunikat trafia do `content/i18n.js` jednocześnie po polsku i angielsku.
- Pakiety epok używają identyfikatorów tłumaczeń, a nie gotowych napisów.
- Wybrany język jest zapamiętywany na urządzeniu.

## Możliwe epoki — dopiero później

Kolejność nie jest jeszcze zatwierdzona. Naturalny rozwój może prowadzić od
średniowiecza przez epokę prochu i przemysłu do XX wieku, współczesności lub
absurdalnej przyszłości. O wyborze zdecydujemy po ukończeniu silnika i testach
grywalności pierwszej kampanii.
