# v8.0 — ART RESET Osiedla

## Cel
Osiedle ma wyglądać jak pełnoprawny rozdział Castle Calamity, a nie osobny
prototyp. Punktem odniesienia jest jakość renderera wcześniejszych epok:
czytelne sylwetki, warstwowe materiały, kontrolowane światło i stabilny FPS.

## Architektura grafiki
Statyczne tło każdej areny jest malowane przez `paintArenaBackdrop()` i
zapisywane w `ART_CACHE`. Klucz cache zależy od typu areny i rozmiaru
viewportu. Cache ma limit 18 pozycji.

Dzięki temu tło może mieć:
- trzy warstwy zabudowy,
- panelowe elewacje,
- okna i światła,
- haze,
- drzewa i latarnie,
bez ponownego konstruowania tych elementów w każdej klatce.

## Materiały
Wspólne helpery:
- `materialRect` — gradientowa bryła i obrys,
- `panelWall` — wielka płyta i okna,
- `glassPanel` — witryny i odbicia,
- `metalShutter` — zamknięte pasaże,
- `awning` — markizy pawilonów,
- `contactShadow` — osadzenie obiektów na podłożu.

## Postacie
Dostawcy oraz menele są teraz pełnymi dorosłymi sylwetkami. Nogi, buty,
kurtka, szyja i głowa są osobnymi bryłami, a nie zestawem linii.
Główny bohater ma osobny gradient kurtki i mocniejszy cień kontaktowy.

## Zachowane zasady
- 12 unikalnych aren,
- Menele Studio,
- jedzenie i kondycja,
- większa skala dorosłych,
- brak dymu przy przegrywaniu,
- chwianie i uginanie nóg wraz ze spadkiem HP.
