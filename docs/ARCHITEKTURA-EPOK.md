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

## Obecny pakiet i następny krok

Aktywny jest wyłącznie pakiet `medieval`. Jego rejestr znajduje się w
`content/eras.js`. Wersja v5.3 zamyka jego audyt jako wzorca jakości całej gry.

W rejestrze istnieje już wyłączony pakiet `early-modern` — Epoka II „Proch i
Mechanika”. Nie ma jeszcze poziomów i nie jest widoczny dla gracza. Jego
zadaniem jest ustalenie granicy danych przed pracą nad v6.0: odblokowanie po 12
bitwach, forty bastionowe, piki, muszkiety, moździerze i maszyny zachowają ten
sam silnik walki, zapis, limit ośmiu kart oraz zasady rzadkiego humoru.

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

## Dalsze możliwe epoki

Po Epokach I i II naturalny rozwój może prowadzić przez przemysł do XX wieku,
współczesności lub absurdalnej przyszłości. Każdy następny pakiet powstanie
dopiero po potwierdzeniu, że poprzedni nie wymaga kopiowania wspólnego silnika.
