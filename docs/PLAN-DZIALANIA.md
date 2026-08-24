# Castle Calamity — plan działania

## Priorytet nadrzędny

Najpierw kończymy jeden stabilny, skalowalny i użyteczny silnik oraz pełną
kampanię średniowieczną. Następne epoki będą pakietami danych i grafiki, nie
kopiami projektu. Szczegóły: `ARCHITEKTURA-EPOK.md`.

## Fundament v4.1

Status: **wdrożony do testów**

- opcjonalny czterostopniowy samouczek w prawdziwym poziomie 1,
- przeciwnik nie atakuje podczas objaśnień,
- możliwość pominięcia i ponownego uruchomienia samouczka,
- zapamiętywanie ukończenia samouczka,
- przełącznik PL/EN i zapamiętywanie języka,
- osobne pliki tłumaczeń oraz rejestru epok,
- aktywny wyłącznie pakiet średniowieczny.

## Poprawki v4.2

Status: **wdrożone i sprawdzone automatycznie**

- poziomy 4 i 5 ponownie korzystają z poprawionych łuczników,
- łuk, kusza i oszczep mają celowane tory balistyczne zamiast nurkowania w ziemię,
- przeciwny oszczepnik poprawnie odwraca broń w lewo,
- armata otrzymała wyższą parabolę zależną od dystansu i rozmiaru ekranu,
- zasięg łucznika wzrósł do 170, a dwóch łuczników tworzy formację z aurą,
- każdy poziom ma własny gag przelotowy; w jednej bitwie pojawia się on najwyżej raz,
- poziom 4: rycerz lecący na chmurze, poziom 5: konserwator polerujący księżyc,
- nowe gagi zachowują pełny przebieg od krawędzi do krawędzi bez widocznej pętli.

## Zasady, których trzymamy się od wersji v4.1

1. Humor jest rzadki, losowy i nie może zasłaniać rozgrywki.
2. Każdy obiekt biegnący lub lecący przechodzi przez cały ekran.
3. Żarty bieżące mają datę ważności — po wydarzeniu są wyłączane albo trafiają do archiwum.
4. Humor polityczny dotyczy publicznych wydarzeń i decyzji, a nie cech prywatnych osób lub grup.
5. Nie kopiujemy dialogów, postaci ani scen Monty Pythona czy Lesliego Nielsena; zachowujemy jedynie absurd, kontrast i kamienną powagę.
6. Reklama nie może utrudniać sterowania ani pojawiać się częściej niż inne gagi.

## Etap 1 — stabilizacja i balans

Status: **wersja v4.2 gotowa do testu gracza**

- zasięg łucznika ustawiony na 170 i sprawdzony automatycznie,
- zasięg czarownika ustawiony na 180,
- armata otrzymała kontrolowaną, wysoką parabolę, czytelną kulę, smugę i efekt trafienia,
- sylwetka łucznika została ustawiona profilem do kierunku strzału,
- Deszcz Strzał zachowuje trzy celowane fale, a Mróz trwa 3,8 s,
- skala postaci jest liczona z wysokości ekranu: 46 px przy 1280×720 i 25 px przy 844×390,
- dwanaście ruchomych gagów sprawdzono na pełnym przebiegu od jednej krawędzi do drugiej,
- intro otrzymało nową sekwencję policjanta bez napisów ekranowych i bocznych cieni,
- każdy z 12 poziomów ma własny dyskretny absurd scenograficzny,
- pozostał test odczucia balansu na prawdziwym telefonie i monitorze,
- sprawdzenie, czy wszystkie 13 jednostek ma wyraźną rolę,
- zebranie uwag Marcina po każdej wersji testowej.

Kryterium zakończenia: trzy pełne rozgrywki na telefonie i komputerze bez błędu blokującego.

## Etap 2 — biblioteka humoru i reklama

Status: **pierwsza biblioteka gotowa; kolejne gagi po wspólnej decyzji**

- obecnie działa 12 gagów ruchomych, po jednym dla każdego poziomu i najwyżej jeden podczas bitwy,
- osobna pula żartów z Polski, świata, kultury, muzyki i sportu,
- każdy gag bieżący otrzymuje źródło, datę publikacji i datę wyłączenia,
- przygotować 2–3 formaty reklamowe: proporzec ryby, herb sponsora i dyskretna plansza między poziomami,
- dodać przełącznik całkowitego wyłączenia reklam.

Kryterium zakończenia: każdy poziom ma inny gag, a obiekt zawsze kończy pełną animację.

## Etap 3 — głębsza strategia

- czytelne kontry jednostek,
- profile AI: defensywny, agresywny, oblężniczy i chaotyczny,
- unikalne zachowania bossów,
- korekta ekonomii złota oraz kosztów,
- mierzenie skuteczności jednostek po każdej bitwie.

## Etap 4 — grafika i animacja

- ujednolicić proporcje wszystkich postaci,
- poprawiono sylwetkę łucznika; następne są animacje mnicha, golema i oszczepnika,
- rozbudować tła bez zasłaniania pola walki,
- dopracować zniszczenia zamków i efekty czarów,
- nowe ikony aplikacji zgodne z jakością grafiki w grze.

## Etap 5 — audio i kampania

- osobne dźwięki łuku, kuszy, mrozu i Deszczu Strzał,
- krótkie muzyczne sygnały bossów,
- zapis ulepszeń kampanii,
- ekran mapy i czytelniejszy postęp 12 poziomów.

## Etap 6 — wydanie

- test PWA offline na iPhonie i Androidzie,
- kontrola pamięci oraz płynności na starszych telefonach,
- przygotowanie wersji GitHub Pages,
- później opakowanie do sklepów mobilnych.

## Najbliższa sesja z Marcinem

Potrzebne są trzy decyzje:

1. Czy osoba, która nie zna gry, rozumie cel i sterowanie po samouczku bez dodatkowego tłumaczenia?
2. Czy tor armaty jest czytelny także podczas tłocznej bitwy na prawdziwym telefonie?
3. Czy zasięg czarownika 180 daje przewagę, ale nie dominuje całej walki?
