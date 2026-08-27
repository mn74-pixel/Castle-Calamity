# Castle Calamity — rotacja jednostek i ewolucja zamków v5.1

## Cel etapu

Zmniejszyć tłok w panelu armii bez usuwania żadnej z czternastu jednostek,
czytelniej podpowiadać kontry oraz pokazać subtelny rozwój zamku w drugiej
połowie kampanii. Zmiany nie dodają nowej waluty ani nowego panelu podczas
walki.

## Talie bitewne

- Jedna bitwa udostępnia najwyżej 8 kart łącznie z Drwalem i Kamieniarzem.
- Pełny katalog 14 jednostek pozostaje w grze; jednostki wracają w innych
  poziomach, zależnie od roli i składu przeciwnika.
- Talia gracza i pula AI są oczyszczane z duplikatów oraz nieprawidłowych
  wpisów. Boss nie może trafić do zwykłej karty ani kolejki.
- Poziomy 7–12 korzystają z rotacji ról: ekonomia, front, dystans, wsparcie,
  kontra na ciężkie jednostki lub oblężenie.
- Polecane jednostki mają małą złotą gwiazdkę. To wyłącznie wskazówka — nie
  zmienia obrażeń ani statystyk.

## Król Demonów

Przed pierwszym wejściem do poziomu 12 pojawia się krótki raport. Pokazuje
trzy główne zagrożenia: serie ognia, portale i trzy kule w ostatniej fazie.
Polecany zestaw to Oszczepnik, Mnich, Czarownik i Golem. Te same cztery karty
są oznaczone gwiazdką podczas bitwy.

## Ewolucja zamku

- Po poziomie 6 sylwetka zamku rośnie tylko nieznacznie: wieża boczna i donżon
  są odrobinę wyższe, a mur otrzymuje dodatkowy blank.
- Od poziomu 7 pojawia się cienki nowy pas kamienia z mosiężnymi kotwami.
- Od poziomu 11 dochodzą dwa małe herby narożne i drugi, równie lekki krok
  sylwetki.
- Rozwój kampanijny jest kosmetyczny i niezależny od trzech etapów rozbudowy
  wykonywanej przez Kamieniarza. Nie dodaje HP.

## Gagi scenograficzne

Pranie nie jest elementem każdego zamku. Trzy drobne gagi występują tylko
w jednej bitwie i po jednej stronie:

- poziom 7: pranie suszące się między wieżą a donżonem gracza,
- poziom 9: parujący czajnik na blankach wroga,
- poziom 11: przysypiający strażnik na zamku gracza.

Bossowskie poziomy 10 i 12 nie otrzymały dodatkowego gagu zamkowego, aby nie
osłabiać czytelności starcia.

## Fizyka szyku

Maszerujące jednostki jednej strony zachowują lekki odstęp. Tylna sylwetka
jest łagodnie odsuwana i wyhamowywana, gdy zaczyna nakładać się na jednostkę
przed nią. System nie dotyczy pracowników, Kamieniarzy, armat ani bossów i nie
zmienia zasięgów czy obrażeń.

## Testy odbiorcze

- wszystkie talie gracza i AI mają 1–8 unikalnych wpisów,
- cztery polecane kontry poziomu 12 należą do jego talii,
- raport Króla Demonów działa po polsku i angielsku,
- odstęp szyku jest stabilny przy stałym kroku 60 Hz,
- osobne rendery poziomów 7, 9 i 11 pokazują trzy różne gagi zamkowe,
- pełna regresja 12 poziomów, bossów, balistyki, audio, kampanii i PWA,
- 60-sekundowe symulacje poziomów 1, 7, 10 i 12 bez NaN.

