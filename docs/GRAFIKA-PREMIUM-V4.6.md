# Castle Calamity — grafika premium v4.6

## Cel etapu

Etap poprawia czytelność i jakość obrazu bez dokładania kolejnego panelu,
waluty ani obowiązku zarządzania. Mechanika walki z v4.5 pozostaje stabilna.

## Jednostki

### Mnich

- pełna sylwetka habitu z osobno poruszającymi się stopami i fałdami,
- kaptur, twarz, sznur i paciorki zamiast płaskich nakładek,
- unoszony kostur, kręgi i światło tylko w chwili skutecznego leczenia.

### Golem

- asymetryczny tułów złożony z głazów, widoczne pęknięcia i żar run,
- niezależne kamienne nogi przenoszące masę podczas chodu,
- artykułowane barki, przedramiona i oburęczne uderzenie.

### Oszczepnik

- profilowa sylwetka z okiem, nosem oraz hełmem skierowanym do celu,
- osobny krok lewej i prawej nogi,
- oszczep znika z ręki dokładnie podczas lotu pocisku; pozostaje pusta,
  wyprostowana dłoń, po czym broń wraca dopiero przy przeładowaniu.

## Plansze

- trzy prędkości i wysokości delikatnego dryfu chmur,
- wolna paralaksa gór, środkowych i bliskich wzgórz,
- odległe, półprzezroczyste strażnice oraz pas mgły atmosferycznej,
- przesunięcia mają kilka pikseli i nie wpływają na pozycję jednostek,
  zamków, pocisków ani celów dotykowych.

## Umiejętności

- **Deszcz Strzał:** trzy wizualne fale cienia, strefa trafienia oraz kręgi uderzeń,
- **Mróz:** rozszerzająca się fala po gruncie, odłamki lodu i bryły obejmujące jednostki,
- **Zew Bitwy:** pierścień rozchodzący się od armii, znak sztandaru oraz kierunkowe iskry aury.

Nie zmieniono: 30 strzał w trzech falach, Mrozu 3,8 s, czasu Zewu Bitwy,
obrażeń, kosztów, zasięgów ani częstotliwości humoru.

## Weryfikacja

Automatyczny audyt v4.6 obejmuje:

- pełne testy regresji v4.5: samouczek, PL/EN, armatę, balistykę, kamieniarza,
  profile AI, gagi, bossów i 60-sekundowe symulacje poziomów 1, 7, 10 i 12,
- render nowych sylwetek przy 1280×720 oraz 844×390,
- osobne rendery Deszczu Strzał, Mrozu i Zewu Bitwy,
- reprezentatywne plansze dzienną, nocną, śnieżną i krwawego księżyca,
- potwierdzenie niezmienionej skali: 46 px na desktopie i 25 px na telefonie.

Wynik: `QA V4.6 COMPLETE` bez błędów stanu i wartości `NaN`.
