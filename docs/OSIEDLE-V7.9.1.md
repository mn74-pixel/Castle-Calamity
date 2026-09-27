# v7.9.1 — Character & Food Interaction Pass

## Postacie
Dostawcy i menele używają tej samej bazowej skali `getUnitDrawSize()/22`, co
utrzymuje ich rozmiar zgodny z poprzednimi epokami. Dostawca ma osobny kierunek
dla drogi do punktu i dla powrotu, dlatego po odebraniu zaopatrzenia obraca się
i idzie twarzą do domu.

Główny bohater pozostaje wyjątkiem: jest około 1.34× większy od standardowej
postaci z kontrolowanym limitem na dużych ekranach. Powiększono też obszar
rysowania fotografii twarzy. Animacja rzutu obejmuje przygotowanie całego ciała,
przeniesienie ciężaru i odrzut.

## Jedzenie
Jedna karta realizuje prosty przepływ:
1. Brak jedzenia → kliknięcie płaci koszt i wysyła dostawcę.
2. Dostawca wraca → magazyn pokazuje 1 sztukę, karta zmienia podpis na ZJEDZ.
3. Kliknięcie ZJEDZ → bez dodatkowego kosztu uruchamia efekt aktualnego posiłku.

Gracz sam wybiera moment jedzenia. AI może nadal zjeść automatycznie przy
niskiej kondycji.

## UI i grafika
Dolny pasek instrukcji został usunięty. Informacje pozostają w kartach i HUD.
Areny dostały mocniejszy gradient nawierzchni, krawężnik, linie perspektywy,
cienie kontaktowe oraz cienie budek i pawilonów.
