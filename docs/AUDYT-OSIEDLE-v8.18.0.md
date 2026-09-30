# Osiedle — audyt v8.18.0

## Zakres i rezultat

Kolejny etap: stabilność ruchu, granica walki i rajdu oraz czytelność kontaktu.
Nie dodajemy trzynastego poziomu ani nowej waluty. Bloki nadal nie są burzone.

## Potwierdzone problemy i poprawki

1. **Pusty zamach na wracającego rajdowca.** Lista aktywnych jednostek była
   pobierana na początku kroku, ale jednostka mogła już przejść w powrót.
   Wybór celu i wypuszczenie ataku ponownie sprawdzają jego aktywność.
   Test odtworzył niepoprawny zamach 0,22 s przed poprawką, dla obu stron.
2. **Niewłaściwy sąsiad w kolejce.** `find` wybierał pierwszego sojusznika
   z tablicy. Przy różnych szerokościach wózka i pieszego można było zbliżyć
   się do dalszego kosztem odstępu od bliższego. Wybór jest teraz według
   odległości, bez sortowania i dodatkowej tablicy w każdym kroku ruchu.
   Powracający rajdowcy również nie blokują przejścia w tym samym kroku.
   Test obejmuje obie strony i odwrotną kolejność wpisów.
3. **Jednakowa reakcja na lekkie i ciężkie trafienie.** Siła rzeczywistego
   trafienia steruje ograniczonym odrzutem wizualnym i krótkim akcentem
   kontaktu. Nie zmienia pozycji logicznej, statystyk ani czasu ataku.
   Efekt nie przechowuje cząstek, znika po około 0,17 s i nie jest krwawy.

## Pokrycie automatyczne

- Dwanaście talii etapów: 30 s rekrutowania obu drużyn, następnie 240 s
  rozstrzygnięcia; kontrola skończonych pozycji, zakresu HP, pocisków i
  opróżnienia ulicy. Losowa pogoda z odtwarzalnym ziarnem.
- Zachowanie sumy kredytów przy rajdach; osobny wyjątek dla etapu kontroli
  środka, który zgodnie z zasadami generuje kredyty.
- Wcześniejsze testy kontr, spowolnień, osłony boksera, wsparcia bez
  kumulowania, patrolu, wywrotek, 30/120 FPS i końca bitwy.
- Pełne symulowane bitwy z deszczem, lodem i losową pogodą; dostawy i zmiany
  scenografii bez zgubienia drzwi sklepu; rozmiary telefoniczne HUD.
- Renderowanie reakcji kontaktu nie mutuje stanu gry; arkusz klatek do
  przeglądu. Regresja portretów, historycznych epok oraz cache PWA.

## Ograniczenia i następny odbiór

Próba ze stałym ziarnem kończy się po około 174 s w deszczu, 203 s na lodzie
i 188 s przy losowej pogodzie. Strategia samych butelek również wygrywa
(około 175 s), ale pozostawia 420 morale zamiast 1235 przy mieszanej ekipie.
To sygnał do dalszych prób balansu: oddziały zwiększają bezpieczeństwo,
lecz ta konkretna strategia nie przyspiesza zwycięstwa. Nie wyciągamy
wniosku o optymalnej strategii na podstawie jednego automatycznego gracza.

To nie jest certyfikat braku wszystkich błędów. Symulacje używają konkretnych
strategii i ziaren, nie wszystkich możliwych decyzji gracza. Sprawdzenia PWA
są automatyczne i nie zastępują instalacji offline w Safari.

Do ręcznego odbioru pozostają fizyczny mały i duży iPhone: dotyk, obrót,
powrót z tła, płynność zatłoczonej sceny, miks dźwięku i subiektywne tempo.
Nie wykonano migracji do 3D ani przebudowy całej kampanii. Dalszy priorytet:
czytelność wyboru kontr na małym ekranie, przed dodawaniem kolejnych oddziałów.
