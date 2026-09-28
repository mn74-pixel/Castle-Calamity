# Osiedle v8.5 — jednostki i zmienne warunki bitwy

## Diagnoza i zmiana

Poprzednia wersja dawała przede wszystkim rytm zakupu dostaw i rzucania
butelkami. Ludzie walczący na środku byli dekoracją bez wpływu na wynik.
Teraz dekoracyjne pary są wyłączone: widoczni bojownicy to kupione jednostki,
które walczą, osłaniają sojuszników i zadają obrażenia przeciwnemu blokowi.
Nie zmieniono zaakceptowanej oprawy architektury.

| Jednostka | Koszt | Od etapu | Rola |
|---|---:|---:|---|
| Dresiarz | 18 | 1 | Wytrzymały front, kontra na rowerzystę |
| Rowerzysta | 28 | 3 | Szybkie natarcie, mocny cios w blok, kontra na odsłoniętą sąsiadkę |
| Sąsiadka | 32 | 5 | Dystans, kapcie spowalniające front, wymaga osłony |

Kontry dają mnożnik 1,4 obrażeń, a nie automatyczne zwycięstwo niezależnie
od sytuacji. Rekrutacja ma wspólną przerwę 2,4 s na stronę, niezależną od
rzutów z balkonu. Nie ma limitu żywych bojowników. Jednostka kończy natarcie
jednym ciosem w bazę i znika, jak mobilne jednostki poprzednich epok.
Dostawcy pozostają niebojową logistyką, nie celem ataków.

## Zmienność etapów

Etapy przechodzą automatycznie co 14 s; finał trwa do rozstrzygnięcia bitwy.
Gracz może wygrać przed finałem. Zasada bieżącej sceny jest stale widoczna
pod linią walki; karta zablokowanej jednostki pokazuje etap odblokowania.

| Etap | Zmiana decyzji |
|---|---|
| 1. Podwórko | Front kontra wsparcie butelkami; dostępny dresiarz |
| 2. Monopolowy | Samodzielna kontrola środkowych 20% mapy przez 5 s daje 6 środków; spór resetuje postęp |
| 3. Ławka | Odblokowanie rowerzysty |
| 4. Zapiekanki | Środek leczy jednostki obu stron po 5 HP/s |
| 5. Trzepak | Odblokowanie sąsiadki |
| 6. Śmietniki | Centralna osłona zmniejsza obrażenia od kapci o połowę |
| 7. Pizza | Zjedzenie pizzy leczy także własną żywą ekipę o 25 HP |
| 8. Noc | Zasięg sąsiadek spada do 72%; szybkie jednostki łatwiej skracają dystans |
| 9. Kebab | Przerwa rekrutacji spada do 1,2 s |
| 10. Patrol | Ostrzeżenie, następnie 3 s zatrzymania walki ulicznej co 14 s; balkon i dostawy nadal działają |
| 11. Zamknięty sklep | Dostawa zapasów daje 40 zamiast 28 środków |
| 12. Express | Ciosy jednostek w bloki są o 35% mocniejsze |

AI dobiera kontrę do widocznych jednostek, respektuje odblokowania, płaci
normalną cenę i zachowuje dostawy oraz rzuty. Nie dostaje darmowych fal
ani ukrytego wzmocnienia po sukcesach gracza.

## Sprawdzenie

- Testy mechanik: odblokowania, koszty, kontry w starciu, przygotowanie
  ataku, pociski, spowolnienie, osłona, leczenie, kontrola środka, patrol,
  natarcia obu stron, brak twardego limitu armii i sprzątanie obiektów.
- Stały krok walki 30 Hz: równoważny wynik przy wejściu 30 i 120 FPS.
- Pełna automatyczna bitwa z mieszaną ekipą: zwycięstwo po około 143 s,
  11 rekrutacji, 7 pokonanych przeciwników, 875 HP własnego bloku.
- Strategia samych butelek nadal wygrywa szybciej, około 109 s, ale zostaje
  z 575 HP. To dwie przykładowe strategie, nie dowód kompletnego balansu.
- Bezczynny gracz przegrywa; pauza blokuje zakupy; wejście w test sceny
  czyści poprzednie jednostki; pizza i Express sprawdzone w głównej grze.
- Rendery walki: 1280×720, 1950×1100, 844×390 i 667×375; obejrzano
  desktop i mały ekran. Test Canvas nie renderuje DOM-owego paska kart.
- Regresje gry, oprawy epok i PWA; nowy moduł trafia do cache v8.5.0,
  a test offline sprawdza jego dostępność.

Nie wykonano rozgrywki dotykowej na fizycznym iPhonie ani odsłuchu na jego
głośniku. Ocena zabawy, tempa odblokowań i czytelności ośmiu kart wymaga
jeszcze próby człowieka; automatyczna symulacja jej nie zastępuje.
