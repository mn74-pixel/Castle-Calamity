# Osiedle — role oddziałów, v8.12.0

## Rajdy ekonomiczne

Dojście oddziału do przeciwnego bloku rozpoczyna powrót z kredytami zamiast
obniżać morale. Udźwig: dres 27, rower 33, sąsiadka 48, kij 48, rolkarz 45,
dozorca 63, Heniek 81, akordeonista 45, wózkarz 66, Marian 30, Bokser 51. Finał zwiększa udźwig o 35% (zaokrąglenie do całości).
Nie można zabrać więcej niż przeciwnik posiada. Środki są odejmowane przy
zabraniu, a dodawane własnej stronie dopiero po powrocie. To jedna istniejąca
waluta, nie nowy zasób. Powracający są poza walką i nie blokują innych.

Wytrzymałość oznacza gotowość do dalszej awantury, nie śmiertelne obrażenia.
Po jej wyczerpaniu postać wraca do domu. Koszty i moce obu stron są identyczne.

| Oddział | Koszt | Zastosowanie i moc | Słabość | Czytelny strój |
| --- | ---: | --- | --- | --- |
| Dresiarz | 18 | Tani front; premia 40% przeciw szybkim | Spowalniający dystans | Dres z kapturem i lampasami |
| Menel Marian | 20 | Cios 13, spowolnienie 1,4 s, premia frontu przeciw szybkim | Mały zasięg, słaby cios | Łatany płaszcz, szalik, czapka i zarost |
| Bokser | 34 | Cios 18, 150 wytrzymałości, o 30% mniej obrażeń od pocisków | Ciężki front, krótki zasięg | Rękawice, opaska i szeroki pas |
| Rowerzysta | 22 | Szybki nacisk na okno; premia 40% przeciw dystansowi | Zablokowany front | Jasna kurtka, torba i rower |
| Sąsiadka | 32 | Kapeć spowalnia na 1,3 s; premia 40% przeciw frontowi | Rower i rolkarz | Fioletowa sukienka, fartuch, chusta |
| Dres z kijem | 32 | Front; dodatkowy cios 13 w jednego najbliższego rywala | Dystans | Ciemna kamizelka, jasny kołnierz, kij |
| Rolkarz | 30 | Szybki nacisk; zachowuje 85% szybkości pod spowolnieniem | Ciężki front | Sportowa kurtka, ukośny pas, ochraniacze |
| Dozorca | 42 | +4 wytrzymałości/s pobliskim sojusznikom; czeka za rannym | Słaby samodzielny atak | Zielony płaszcz roboczy, kieszeń, miotła |
| Wielki Heniek | 54 | Cios 44 i dodatkowe 33 w pobliską grupę | Powolny marsz, długi odpoczynek, rozstawiony dystans | Szeroka ciemna kamizelka, pas, wąsy |
| Akordeonista | 30 | Cios 16, 130 wytrzymałości; +20% marszu sojuszników, odnowienie ataku rywali wolniejsze o 25%, bez kumulacji | Potrzebuje osłony | Kapelusz, bordowa kamizelka, akordeon |
| Wózkarz | 44 | Paczka 24 w cel, po 12 w najwyżej dwóch sąsiadów | Długi przeładunek, słaby przeciw szybkim | Ogrodniczki, czapka, wózek ze skrzynią |

Premie dotyczą głównego ciosu. Dodatkowe trafienia obszarowe nie otrzymują
premii kontr. Leczenie dozorcy nie kumuluje się, nie leczy jego samego i nie
przywraca wycofanych postaci. Po podleczaniu ekipy dozorca wznawia marsz;
nie zmienia zasięgu ataku ani nie staje się drugą jednostką dystansową.

Marian jest dodatkową opcją w etapach 1–4; później jego miejsce zajmuje sąsiadka.
Bokser zastępuje rowerzystę w etapach 6–7. Wcześniejsi rowerzyści zostają.
Gradacja kart: dres → kij → Heniek, rower → Bokser → rolkarz, sąsiadka → wózkarz
oraz akordeonista → dozorca. Muzyk pojawia się w etapach 7–9, wózkarz od 9,
dozorca od 10. Muzyk zajmuje miejsce karty piwa od etapu 7, żeby nie przekroczyć
ośmiu kart. Muzyka nie przyspiesza ataków sojuszników, nie leczy i nie działa na samego
grającego ani wracających z rajdu. Starsze jednostki
pozostają na planszy po zmianie etapu. Barwy drużyny pozostają na ubraniu,
niezależnie od odmiennej palety stroju.

Zakłócenie muzyką działa na odliczanie do następnego ataku rywala, nie na
trwający zamach ani lot pocisku. Zasięg 0,13 szerokości areny obejmuje pasy;
kilku grających nie kumuluje efektu. Pole jest próbkowane przed ruchem,
aby kolejność jednostek w tablicy nie zmieniała wyniku. Patrol, wycofanie,
powrót z rajdu i poślizg grającego wyłączają jego zakłócenie.

Parametry mocy są w `roles` w `content/estate-tactics.js`; opisy kart PL/EN
korzystają z tych samych danych co walka. Statystyki bazowe są w `cards`.
Testy sprawdzają kontry, zasięg, sojuszników, wsparcie i całą bitwę. Odbiór
tempa animacji oraz sterowania na fizycznym telefonie pozostaje ręczny.
