# Tryb pełnoekranowy v6.1.4

## Zakres

Gra ma teraz przycisk `⛶` w menu głównym i w lewym dolnym rogu bitwy. Na przeglądarkach obsługujących Fullscreen API przycisk przełącza cały `appViewport`, a ponowne użycie przywraca zwykły widok.

## iPhone i PWA

Safari na iPhonie nie udostępnia zwykłym elementom strony tego samego pełnego ekranu co przeglądarki desktopowe. W takim przypadku przycisk nie pozostaje martwy: pokazuje instrukcję `Udostępnij → Do ekranu początkowego`. Gra uruchomiona z ikony korzysta z ustawień manifestu `fullscreen` i `landscape` oraz nie pokazuje paska przeglądarki.

## Skalowanie

Po wejściu i wyjściu z pełnego ekranu wykonywane są cztery pomiary viewportu rozłożone w krótkim czasie. Pozwala to uwzględnić opóźnione zwinięcie interfejsu przeglądarki. Canvas nadal odejmuje `safe-area-inset-*`, więc Dynamic Island, zaokrąglenia i dolny wskaźnik iPhone'a nie zasłaniają pola gry.

## Testy

- natywne żądanie wejścia w pełny ekran,
- wyjście z pełnego ekranu,
- instrukcja zapasowa na urządzeniu bez Fullscreen API,
- stan przycisku i `aria-pressed`,
- iPhone SE, iPhone 14, iPhone 15 Pro Max i Safari z rozwiniętym paskiem,
- manifest `fullscreen`, `landscape` i awaryjny `standalone`,
- komplet pamięci offline v6.1.4,
- pełna regresja jednostek, kampanii, bossów, humoru i Epoki II.
