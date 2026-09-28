# Audyt art direction — 28 września 2026

Aktualizacja v8.4.0: na prośbę autora przywrócono rozdział osiedlowy.
Poniższy audyt dokumentuje przyczyny problemów poprzedniej wersji.
Nowy etap prac i granice weryfikacji opisuje [OSIEDLE-V8.4.md](OSIEDLE-V8.4.md).

## Wniosek

Problemem nie był brak kolejnej warstwy detali. Epoka I wygląda spójniej, ponieważ jest ręcznie skomponowanym, sylwetkowym systemem gry. Późniejsze epoki i wycofane Osiedle rosły przez dokładanie elementów do generycznych generatorów. Powstało więcej kresek, lecz słabsza hierarchia, mniej rozpoznawalne bryły i gorsza czytelność w ruchu.

Osiedle zostało usunięte zamiast dalej obniżać jakość całości. Następna duża przebudowa grafiki powinna zacząć się od jednego kompletnego poziomu referencyjnego i zostać zatwierdzona na realnym ekranie gry przed rozszerzeniem na pozostałe poziomy.

## Dlaczego Epoka I działa lepiej

| Obszar | Epoka I | Późniejsze epoki / usunięte Osiedle |
| --- | --- | --- |
| Sylwetka | Duże, natychmiast rozpoznawalne masy | Wspólny szablon z wymienianymi detalami |
| Hierarchia | Baza, jednostka i pocisk mają wyraźne role | Detale fasad i tła walczą z jednostkami |
| Kontrast | Ograniczona paleta i mocne kontury | Dużo podobnych półtonów i materiałów |
| Kompozycja | Elementy projektowane pod gameplay | Elementy dodawane lokalnie bez ponownego bilansu całego kadru |
| Animacja | Czytelna poza i timing | Więcej mikro-ruchów, ale słabsze klatki kluczowe |
| Test jakości | Gra i czytelność sceny | Głównie obecność elementów i różnice bufora PNG |

## Przyczyny techniczne

### 1. Jeden renderer próbował udawać kilka kierunków artystycznych

`content/era-art-v73.js` ma jeden główny generator budowli i jeden generator tła dla wielu późniejszych poziomów. Parametry zmieniają kolory, dachy i ozdoby, ale nie tworzą pełnej, własnej gramatyki sylwetki każdej epoki. To daje warianty jednego obiektu zamiast kolejnych jakościowo lepszych światów.

### 2. Monolityczny główny plik utrudnia kontrolę

Większość renderowania, interfejsu, mechaniki i importu twarzy znajduje się w `index.html`. Zmiana jednego systemu łatwo tworzy regresję w innym, a porównanie oddzielnych warstw kompozycji jest trudne. Kod artystyczny powinien być dzielony według epoki i odpowiedzialności: tło, baza, jednostki, efekty oraz UI.

### 3. Testy mierzyły różność, nie jakość

`tests/era-art.test.js` potwierdza, że obrazy nie są identyczne, renderują się w dwóch skalach i korzystają z cache. Nie potwierdza czytelności sylwetki, kontrastu, braku kolizji UI ani poziomu wykonania. Dwa słabe obrazy mogą bez problemu przejść test „różnią się pikselami”.

### 4. Import twarzy był testowany poza ścieżką produkcyjną

Testy `src/face-studio.js` sprawdzały osobny moduł, podczas gdy uruchomiona gra używała starszej implementacji inline w `index.html`. Produkcja miała niższy limit pliku, wymagała wiarygodnego MIME, czytała tylko przez FileReader i nie pokazywała dobrego statusu błędu. Testy były zielone, ale nie obejmowały kodu klikniętego przez gracza.

W v8.3.1 reguły faktycznie używanego importera są wykonywane przez test gry. Import ma limit 30 MB, rozpoznaje rozszerzenia z aparatu, próbuje `createImageBitmap` z orientacją i bez niej, Object URL, a na końcu Data URL. Natywne etykiety pól plikowych omijają zawodny programowy klik ukrytego inputu w Safari.

### 5. Iteracje nie miały twardej bramki wizualnej

Kolejne zmiany uznawano za poprawę po dodaniu funkcji albo detalu. Nie było obowiązkowego porównania całego kadru z Epoką I na docelowym desktopie i iPhonie. W efekcie lokalnie „bogatsza” grafika stawała się globalnie mniej czytelna.

## Bramka jakości dla następnej epoki

Nowy renderer nie powinien trafić do kampanii, dopóki jeden poziom pionowy nie spełni wszystkich warunków:

1. Własna gramatyka sylwetki epoki — nie przemalowanie wspólnej fortecy.
2. Jedna dominująca baza na stronę i jeden czytelny motyw poziomu.
3. Trzy plany tła różniące się masą, kontrastem i rytmem, bez tapetowej repetycji.
4. Jednostki rozpoznawalne po samej sylwetce przy normalnej skali rozgrywki.
5. Klatki kluczowe animacji czytelne bez mikrodetali: spoczynek, ruch, atak, trafienie i śmierć.
6. UI nie zasłania akcji na 1280×720, 1950×1100 i 844×390 z safe area.
7. Ręczny przegląd pełnych zrzutów obok Epoki I, nie tylko test sygnatury PNG.
8. Screenshot golden dla każdego wspieranego viewportu oraz jawna akceptacja zmian obrazu.
9. Test integracyjny wszystkich funkcji widocznych dla gracza, w tym importu twarzy w kodzie produkcyjnym.
10. Brak rozszerzania na pozostałe poziomy przed zatwierdzeniem pierwszego pionowego wycinka.

## Zalecana kolejność odbudowy

1. Wybrać jedną bitwę Epoki II jako wzorzec i stworzyć trzy czarno-białe warianty sylwetki.
2. Zatwierdzić kompozycję bez tekstur, okien i drobnych rekwizytów.
3. Dodać ograniczoną paletę, kontrolowane światło i materiały.
4. Zbudować odrębne jednostki oraz pięć czytelnych klatek kluczowych.
5. Sprawdzić pełny gameplay na desktopie i telefonie obok tego samego kadru Epoki I.
6. Dopiero po przejściu bramki rozwinąć system na resztę epoki, a później na kolejne epoki.

To jest zmiana procesu, nie kolejny pakiet ozdobników. Celem następnej iteracji musi być lepsza graficzna decyzja w całym kadrze, a nie większa liczba narysowanych elementów.
