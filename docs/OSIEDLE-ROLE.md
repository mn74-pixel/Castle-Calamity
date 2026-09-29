# Osiedle — role oddziałów, v8.8.0

## Rajdy ekonomiczne

Dojście oddziału do przeciwnego bloku rozpoczyna powrót z kredytami zamiast
obniżać morale. Udźwig: dres 27, rower 33, sąsiadka 48, kij 48, rolkarz 45,
dozorca 63, Heniek 81. Finał zwiększa udźwig o 35% (zaokrąglenie do całości).
Nie można zabrać więcej niż przeciwnik posiada. Środki są odejmowane przy
zabraniu, a dodawane własnej stronie dopiero po powrocie. To jedna istniejąca
waluta, nie nowy zasób. Powracający są poza walką i nie blokują innych.

Wytrzymałość oznacza gotowość do dalszej awantury, nie śmiertelne obrażenia.
Po jej wyczerpaniu postać wraca do domu. Koszty i moce obu stron są identyczne.

| Oddział | Koszt | Zastosowanie i moc | Słabość | Czytelny strój |
| --- | ---: | --- | --- | --- |
| Dresiarz | 18 | Tani front; premia 40% przeciw szybkim | Spowalniający dystans | Dres z kapturem i lampasami |
| Rowerzysta | 22 | Szybki nacisk na okno; premia 40% przeciw dystansowi | Zablokowany front | Jasna kurtka, torba i rower |
| Sąsiadka | 32 | Kapeć spowalnia na 1,3 s; premia 40% przeciw frontowi | Rower i rolkarz | Fioletowa sukienka, fartuch, chusta |
| Dres z kijem | 32 | Front; dodatkowy cios 13 w jednego najbliższego rywala | Dystans | Ciemna kamizelka, jasny kołnierz, kij |
| Rolkarz | 30 | Szybki nacisk; zachowuje 85% szybkości pod spowolnieniem | Ciężki front | Sportowa kurtka, ukośny pas, ochraniacze |
| Dozorca | 42 | +4 wytrzymałości/s pobliskim sojusznikom; czeka za rannym | Słaby samodzielny atak | Zielony płaszcz roboczy, kieszeń, miotła |
| Wielki Heniek | 54 | Cios 44 i dodatkowe 33 w pobliską grupę | Powolny marsz, długi odpoczynek, rozstawiony dystans | Szeroka ciemna kamizelka, pas, wąsy |

Premie dotyczą głównego ciosu. Dodatkowe trafienia obszarowe nie otrzymują
premii kontr. Leczenie dozorcy nie kumuluje się, nie leczy jego samego i nie
przywraca wycofanych postaci. Po podleczaniu ekipy dozorca wznawia marsz;
nie zmienia zasięgu ataku ani nie staje się drugą jednostką dystansową.

Gradacja kart: dres → kij → Heniek oraz rower → rolkarz. Sąsiadka i dozorca
uzupełniają skład; nie dodajemy wszystkich kart naraz. Starsze jednostki
pozostają na planszy po zmianie etapu. Barwy drużyny pozostają na ubraniu,
niezależnie od odmiennej palety stroju.

Parametry mocy są w `roles` w `content/estate-tactics.js`; opisy kart PL/EN
korzystają z tych samych danych co walka. Statystyki bazowe są w `cards`.
Testy sprawdzają kontry, zasięg, sojuszników, wsparcie i całą bitwę. Odbiór
tempa animacji oraz sterowania na fizycznym telefonie pozostaje ręczny.
