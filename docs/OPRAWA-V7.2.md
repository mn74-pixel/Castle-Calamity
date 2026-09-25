# v7.2 — spójność wojsk i późniejszych epok

Kierunek: czytelna ilustracja strategiczna, ciemny kontur, światło z góry, stonowane materiały oraz niebieski/czerwony akcent drużyny. Bez dodatkowego blasku i drgania kart.

- Nowe sylwetki 15 pieszych jednostek: Wojownik, Pikinier, Kusznik, Berserker, Templariusz, Drwal; trzech żołnierzy II epoki; sześciu pieszych III–IV epoki. Profil twarzy, modelowane barki, zgięte kończyny, warstwowy strój i broń osadzona przy dłoniach.
- Wspólne rysowanie modeli w bitwie i na kartach, stała poza ikon. Piki mają osobne dopasowanie rozmiaru karty.
- Haubica i działo indukcyjne: laweta, koła ze szprychami, cieniowana lufa, odrzut i odmienne pierścienie.
- Fort II epoki: ceglane spoiny, wnęki, gzymsy, cienie dachów. Bazy III–IV: boczne płaszczyzny, cokół, wnęki okienne, rury i przewody.
- Tła III–IV: dwie warstwy zabudowy, estakada, infrastruktura elektryczna. W późniejszych epokach usunięto średniowieczne wieżyczki z dalekiego planu, a drzewa mają spokojniejszą zieleń.
- Mechanika i statystyki pozostają te same; zmiany dotyczą renderowania.

Weryfikacja: pełne npm test, w tym 26 bitew, jednostki, bossowie, brak kolejek przy bramie, tryb testowy i PWA. Oględziny arkusza postaci oraz kadrów desktop/telefon. tests/art-review.js generuje arkusz postaci. Testy syntetyczne nie zastępują oceny animacji i płynności na fizycznym iPhonie.

Kontrola wdrożenia wykryła mieszanie nowego HTML ze starym skryptem z cache. Moduł grafiki ma teraz wersjonowaną nazwę pliku, którą rozróżniają również poprzednie service workery.
