# Castle Calamity — audyt v4.4

## Wynik

Wersja v4.3 nie miała błędu blokującego i przechodziła dotychczasowy zestaw
testów. Audyt wykazał jednak cztery problemy projektowe, które ograniczały
czytelność i dalszy rozwój:

1. Intro trwało 18,6 sekundy, czyli zbyt długo przy kolejnych uruchomieniach.
2. Intro zawierało nieaktywny szkic rozbudowanej animacji psa oraz zbyt wiele
   równoległych pomysłów komediowych.
3. Zamek w intro rysował elementy HUD, a niepełny stan sceny mógł pokazać `NaN`.
4. AI korzystało głównie ze sztywnej kolejki, a dawna przewaga poziomu `tier`
   była silna, mało czytelna i nie tworzyła prawdziwych kontr jednostek.

## Poprawki wykonane w v4.4

- Intro skrócono do 13,35 sekundy.
- Nowa sekwencja jest pantomimą bez dialogów, tytułu na obrazie, winiety i HUD.
- Policjant zatrzymuje kulę armatnią, wystawia jej mandat, po czym zostaje przez
  nią przegoniony przez cały ekran. W tle saksofonista wybiera trójkąt muzyczny.
- Przycisk pominięcia pozostaje dostępny.
- Każdy poziom otrzymał jedną z doktryn AI: zrównoważoną, defensywną,
  agresywną, oblężniczą albo chaotyczną.
- AI analizuje prosty skład armii gracza i reaguje na nadmiar jednostek
  dystansowych, ciężkich lub piechoty.
- Wprowadzono umiarkowane kontry jednostek. Ich efekt jest widoczny przez
  turkusowo-złote iskry, a opis znajduje się w podpowiedzi karty.
- Zmniejszono wpływ samego numeru `tier`, aby właściwy dobór jednostki był
  ważniejszy od ukrytej klasy jakości.

## Kontrola regresji

Automatycznie sprawdzono:

- składnię i uruchomienie silnika,
- skalowanie 1280×720 i 844×390,
- samouczek PL/EN,
- armatę, łuk, oszczep, Deszcz Strzał i Mróz,
- Kamieniarza, limit dwóch pracowników i pełny cykl dostawy,
- wszystkie 12 gagów oraz ich przejście przez cały ekran,
- trzy reprezentatywne kontry,
- wybór jednostek przez profile AI,
- długość intro i brak tekstu rysowanego na canvasie.

## Ryzyka pozostawione do testu gracza

- Dokładne tempo i skuteczność doktryn AI wymagają kilku pełnych bitew, ponieważ
  odczucie trudności zależy od sposobu kupowania jednostek przez gracza.
- Role kontr są opisane w podpowiedziach na komputerze; na telefonie warto w
  przyszłości dodać krótką kartę pomocy dostępną na żądanie.
- Rdzeń pozostaje w jednym dużym `index.html`. Jest stabilny, lecz po zamknięciu
  balansu powinien zostać podzielony na silnik, renderowanie i dane.
- Test PWA offline oraz instalacji nadal wymaga ręcznego sprawdzenia na iPhonie
  i Androidzie po publikacji na HTTPS.

## Następny zalecany etap

Unikalne zachowania bossów poziomów 10 i 12, a następnie ekran krótkiej pomocy
z relacjami kontr na telefonie. Nie należy jeszcze rozpoczynać nowej epoki.
