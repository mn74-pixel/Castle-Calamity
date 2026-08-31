# Castle Calamity v6.1.2 — HUD, wędkarz i swobodna armia

## Cel poprawki

Usunąć drżenie kafelków, poprawić jednorazową scenkę wędkarza oraz rozdzielić
dwa pojęcia, które wcześniej zostały połączone: liczbę rodzajów jednostek w
talii i liczbę żołnierzy żyjących na polu walki.

## Rekrutacja i ekonomia

- W jednej bitwie pozostaje najwyżej 8 różnych kart dobranych do zagrożenia.
- Nie ma sztywnego limitu liczby żywych bojowników po żadnej stronie.
- Każdy zakup nadal wymaga pełnej ceny w drewnie, dlatego zasób reguluje
  wielkość armii, a czas potrzebny na jego zdobycie reguluje tempo natarcia.
- AI przestrzega tej samej ekonomii i również nie otrzymuje kredytu.
- Drwale i Kamieniarze zachowują osobne limity po dwie postacie na stronę.
  Są to zabezpieczenia zaplecza i ruchu, a nie limit wojska.

## Nieruchome karty jednostek

- Brak zasobów nie przygasza całego kafelka i nie przełącza jego klasy.
- HUD nie zapisuje ponownie niezmienionej ceny w każdej klatce.
- Dotyk, najechanie i wciśnięcie nie przesuwają ani nie skalują karty.
- Próba zakupu bez wymaganej ceny po prostu nie tworzy jednostki i nie
  zaciąga długu.

## Wędkarz poziomu 1

- Jest narysowany jako mała półpostać we wnęce centralnej wieży.
- Kamienny parapet zasłania dolną część ciała, więc postać nie stoi na murze.
- Najpierw podciąga linkę i but do wieży.
- Następnie chowa się pionowo za parapetem, bez zanikania i bocznego odjazdu.
- Pozostaje krótkim elementem scenografii i nie wpływa na walkę.

## Weryfikacja

- test zakupu co najmniej piętnastego bojownika oraz pobrania pełnej ceny,
- test limitu 8 różnych kart i osobnych limitów Drwali,
- test braku klas, transformacji i pulsowania kafelków,
- kadry wędkarza przed schowaniem, w połowie ruchu i po zniknięciu,
- pełna regresja 16 poziomów, 18 jednostek, bossów i czterech profili iPhone,
- wydłużona symulacja poziomu 12 i test PWA offline.
