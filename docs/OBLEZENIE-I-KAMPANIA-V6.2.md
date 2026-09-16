# Trwałe oblężenie i kampania v6.2

## Naprawa przyczyny

Wspólna funkcja `strikeAndDie` zabijała każdego zwykłego bojownika po jednym
ataku zamku. Czarownik osiągał ten próg wcześniej przez swój duży zasięg.
Usunięto tę funkcję. Stan `siege` teraz wykonuje powtarzane ataki, używa
wspólnego czasu przeładowania i wspólnej balistyki. Jednostka może nadal
zginąć od obrażeń. Napotkany przeciwnik przerywa ostrzał muru.

## Dalsza Epoka II

- Bitwa 5: Kanał Zgubionych Rozkazów. Kawaleria i saperzy nacierają na
  osłonę pikinierów; muszkieterzy i mnich korzystają z chronionego frontu.
- Bitwa 6: Odlewnia Ostatniego Guzika. Artyleria i obrona wymagają wyboru
  między szybkim przełamaniem a własnym ostrzałem.
- Dwie palety tła, sześć punktów mapy, nazwy PL/EN i drobne żarty fortów.
- HP nowych murów nie przewyższa bitwy 4. Ekonomia nadal reguluje napływ
  oddziałów, bez twardego limitu liczby żołnierzy. Maksymalnie osiem kart.
- Trzecia epoka nie jest jeszcze dodana. Najpierw ocena tempa nowych bitew.

## Weryfikacja

Automatyczna regresja obejmuje 14 mobilnych bojowników, artylerię i wsparcie,
18 poziomów, obydwu bossów, stany kart, HP, zapis, PL/EN, bezpieczne viewporty
iPhone i PWA offline. Każdy mobilny bojownik dociera do zasięgu zamku,
zadaje obrażenia i nie ginie od samego dotarcia. Nowe plansze wyrenderowano
na komputer i telefon. Symulacje nie są pomiarem FPS rzeczywistego iPhone'a.

Do ręcznej oceny pozostają tempo pełnej bitwy, dotyk i miks audio na telefonie.
