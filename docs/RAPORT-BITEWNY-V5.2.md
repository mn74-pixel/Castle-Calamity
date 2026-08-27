# Castle Calamity — raport bitewny i wywiad jednostek v5.2

## Cel etapu

Wersja v5.2 sprawdza, jak gracz naprawdę wykorzystuje maksymalnie osiem kart
dostępnych w danej bitwie. Pomiar działa w tle i nie dodaje kolejnego panelu
podczas walki. Po zakończeniu poziomu gracz widzi jedynie trzy najbardziej
przydatne jednostki.

## Mierzone działania

- liczba wystawień i wydane złoto,
- obrażenia zadane jednostkom,
- obrażenia zadane zamkowi,
- pokonani przeciwnicy,
- leczenie wykonane przez Mnicha,
- złoto dostarczone przez Drwala,
- bloki kamienia i naprawy wykonane przez Kamieniarza.

Obrażenia pocisków zachowują informację o jednostce, która je wystrzeliła.
Dzięki temu lot oszczepu, strzały, bełtu, magii lub kuli armatniej nie zrywa
powiązania z właściwą kartą. Wybuch obszarowy może dopisać wynik kilku trafień
do tej samej jednostki.

## Raport po bitwie

Ekran zwycięstwa lub porażki zawiera trzy kompaktowe karty. Pierwsza otrzymuje
oznaczenie dowódcy bitwy. Zależnie od roli pokazuje ona obrażenia, leczenie,
zarobione złoto albo liczbę dostaw kamienia. Pełna tabela nie jest wyświetlana,
żeby nie zmieniać prostej bitwy w arkusz kalkulacyjny.

## Inteligentna podpowiedź

Wyniki są zapisywane osobno dla każdego poziomu. Jeżeli gracz przegra, najlepsza
jednostka z ostatniej próby może uzupełnić cztery złote rekomendacje przy
powtórce. Podstawowe kontry zaprojektowane dla poziomu nadal mają pierwszeństwo,
a talia nadal zawiera najwyżej osiem kart.

System nie zmienia składu ani tempa AI, HP, obrażeń, kosztów i przychodu złota.
Nie istnieje ukryte dopasowanie trudności do wyników gracza.

## Weryfikacja

- pełna regresja wszystkich 12 poziomów,
- test przypisania walki wręcz i obrażeń zamku,
- test zapisu przegranej i rekomendacji przy powtórce,
- test trzech kart raportu,
- zgodność słowników PL/EN,
- test pamięci PWA offline i numeru cache v5.2.

Zebrane wyniki z prawdziwych rozgrywek posłużą do przyszłej, jawnej korekty
kosztów jednostek. V5.2 celowo nie zmienia ekonomii na podstawie samej symulacji.
