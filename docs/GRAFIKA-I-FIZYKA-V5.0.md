# Castle Calamity — grafika i fizyka v5.0

## Cel etapu

Ujednolicić skalę postaci, przywrócić oszczepnikowi pełną rolę jednostki
dystansowej i oddzielić fizykę walki od częstotliwości renderowania. Zmiany
nie dodają nowej waluty ani panelu i zachowują dotychczasowy przebieg kampanii.

## Skala i czytelność

- Policjant używa tej samej bazy 22 px co żołnierze. Jego pełna wysokość jest
  porównywalna z Wojownikiem na monitorze i telefonie.
- Ta sama zasada działa w gagach bitewnych oraz w aktualnym i starszym
  rendererze intro, więc nie występuje już podwójne pomniejszenie.
- Mundur otrzymał naramienniki i guziki, zachowując czytelną sylwetkę w ruchu.
- Zwykła piechota i łucznicy mają lekkie, nierozmyte cienie kontaktowe.
- Strzała, bełt i oszczep mają cień przesuwający się po ziemi pod pociskiem,
  co pozwala łatwiej odczytać wysokość i kierunek łuku.

## Oszczepnik

- Zasięg bazowy wzrósł z 95 do 175 jednostek.
- Łucznik ma 170, więc Oszczepnik nie musi już podchodzić bliżej od niego.
- Oszczep w locie jest dłuższy i skaluje grubość, grot oraz lotki do wysokości
  pola walki. Dotychczasowa animacja pustej dłoni po rzucie pozostaje aktywna.
- Koszt, obrażenia, czas ataku i system kontr nie zostały zmienione.

## Fizyka v5.0

- Symulacja wykonuje stałe kroki 1/60 s, niezależnie od tego, czy urządzenie
  renderuje około 30 czy 60 klatek na sekundę.
- Jedna klatka może nadrobić maksymalnie pięć kroków. Chroni to przed spiralą
  obciążenia po chwilowym zacięciu lub powrocie aplikacji.
- Kolizja pocisku sprawdza cały odcinek od poprzedniej do nowej pozycji.
  Szybki oszczep, bełt albo kula nie może więc przeskoczyć przez wąski cel.
- Trafienie w zamek korzysta z przecięcia odcinka z jego prostokątem, a efekt
  uderzenia pojawia się w rzeczywistym punkcie kontaktu.
- Ruch pionowy zawiera pełny składnik grawitacji `0,5 × g × t²`.
- Czas błysków trafienia i wstrząsu ekranu jest aktualizowany przez symulację,
  a nie przez liczbę narysowanych klatek.

## Testy odbiorcze

- pełna regresja 12 poziomów, bossów, kampanii, PL/EN, audio, PWA i humoru,
- zasięg Oszczepnika 175 oraz porównanie z Łucznikiem 170,
- trzy kroki symulacji dla 0,05 s czasu wejściowego,
- szybki oszczep pokonujący 180 px w 0,1 s nadal trafia jednostkę po drodze,
- porównanie wysokości Policjanta i Wojownika przy 1280×720 oraz 844×390,
- render scen Oszczepnika, Policjanta, intro, umiejętności i obu bossów,
- 60-sekundowe symulacje poziomów 1, 7, 10 i 12 bez wartości NaN.

## Następny punkt planu

Po teście v5.0 na fizycznym telefonie kolejnym etapem jest pomiar skuteczności
jednostek po bitwie i korekta ekonomii złota oraz kosztów. Dane mają pomagać
w balansie, ale nie mogą tworzyć kolejnego panelu zarządzania podczas walki.
