# Osiedle v8.6 — talie etapów i zaopatrzenie

## Gradacja

| Etapy | Skład bojowy |
|---|---|
| 1–2 | Dresiarz |
| 3–4 | Dresiarz, rowerzysta |
| 5 | Dresiarz, rowerzysta, sąsiadka |
| 6–7 | Dres z kijem, rowerzysta, sąsiadka |
| 8–9 | Dres z kijem, rolkarz, sąsiadka |
| 10–12 | Dres z kijem, rolkarz, sąsiadka, dozorca |

Dres z kijem kosztuje 32 środki i szerokim zamachem może objąć drugiego
bliskiego rywala za połowę bazowej siły. Rolkarz kosztuje 36, porusza się
szybciej od roweru i zachowuje 85% prędkości podczas spowolnienia.
Dozorca kosztuje 42, ma słaby atak i regeneruje żywych sojuszników w pobliżu
o 4 punkty na sekundę. Nakładające się aury nie sumują regeneracji.
Zielony plus pokazuje faktyczne odzyskiwanie kondycji.

Starsze jednostki już na planszy pozostają aktywne po zmianie talii. Nowych
rekrutuje się tylko z aktualnego składu. AI respektuje ten sam skład i ceny.
Niedostępne karty nie istnieją w pasku, a numeracja klawiatury odpowiada
widocznym kartom. Jedzenie pojawia się w etapie 4; od etapu 10 piwo ustępuje
miejsca dozorcy, więc pozostaje osiem kart: wino, wódka, jedzenie, dostawca
i cztery role bojowe. Trzy pasy, omijanie i niekrwawy finał pozostają.

## Sklepy i przejścia

Przyczyna starego błędu: dostawcy kierowali się zawsze do 35% lub 65%
szerokości ekranu. Ich ruch nie znał ani położenia drzwi, ani sceny.

Teraz jedna definicja wejścia zasila render drzwi oraz trasę dostawcy:

- kioski Ruch, monopolowy, zapiekanki, pizza i kebab mają używane wejścia;
- sceny bez sklepu mają mniejszy boczny pawilon zaopatrzenia;
- zamknięty monopolowy pozostaje zamknięty, dostawy obsługuje boczny Express;
- finałowy Express stoi zaparkowany; używane są jego drzwi ładunkowe.

Cykl: podejście → wejście → pobyt w środku → wyjście → powrót.
Drzwi otwierają się przed dojściem do progu, postać jest przycinana otworem
wejścia i znika dopiero wewnątrz. Powraca z towarem, a wypłata jest dopiero
po ukończeniu kursu. Fazy sumują się do dotychczasowego czasu dostawy.

Zmiana sceny czeka na zakończenie rozpoczętego przejścia przez drzwi.
W tym czasie nowi przybysze nie zaczynają kolejnego wejścia. Dzięki temu
opóźnienie nie rośnie bez końca. Dostawcy w drodze dostają nowy cel od
swojej aktualnej pozycji; powracający kontynuują drogę do własnego bloku.
Zakupy w trakcie pauzy nadal są blokowane. Patrol zachowuje swoje przerwy.

## Testy i ograniczenia

- Sześć jednostek, gradacja 12 talii, ceny i zamiana kart; zachowanie już
  istniejących oddziałów po wycofaniu ich karty.
- Szerszy zamach, odporność rolkarza, regeneracja tylko własnych żywych
  jednostek i brak sumowania aur.
- Karty DOM odpowiadają talii; skróty mają ciągłą numerację, brak zapowiedzi
  niedostępnych kart; wszystkie talie mieszczą się w ośmiu kartach.
- Dostawy obu stron w 12 scenach: pozycja w otworze wejścia, otwarcie drzwi,
  ukończenie kursu i nagroda; przekierowanie oraz odroczenie zmiany sceny.
- Pełne automatyczne bitwy, regresje korków, poddania, dawnych epok i PWA.
- Rendery nowych jednostek i wejść na desktopie oraz w poziomych rozmiarach
  telefonów. Nie przeprowadzono testu dotyku na fizycznym iPhonie;
  render Canvas nie pokazuje DOM-owego paska kart.

Wersja aplikacji, skryptów i cache PWA: 8.6.0.
