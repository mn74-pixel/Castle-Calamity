# Zdolności w pełnym ekranie v6.1.5

## Objaw

W późniejszych bitwach pasek Deszczu Strzał, Mrozu i Zewu Bitwy mógł znaleźć
się przy dolnej krawędzi pełnego ekranu. Po przejściu do Epoki II poznane
zdolności dodatkowo znikały, ponieważ ich dostępność była liczona ponownie od
lokalnego poziomu 1 nowej epoki.

## Przyczyna

- `#abBar` nie miał osobnego położenia dla niskiego ekranu w trybie fullscreen,
- `buildAbilityBar()` i `castAbility()` porównywały `minLevel` wyłącznie z
  `LI + 1`, mimo że `LI` zaczyna się od zera w każdej epoce.

## Poprawka

- pełny ekran nadaje kontenerowi gry klasę `fullscreenMode`,
- na telefonie w poziomie pasek zdolności tworzy dok 46 px nad dolną bezpieczną
  krawędzią i pozostaje nad przyciskami pauzy, dźwięku oraz pełnego ekranu,
- odblokowanie jest liczone w ciągłej kampanii; zdolności poznane w Epokę I
  pozostają dostępne w każdej bitwie Epoki II,
- przyciski zdolności są prawdziwymi elementami `button`, co poprawia obsługę
  dotyku i dostępność bez zmiany mechaniki.

## Regresja

- poziomy 1–2: brak przedwczesnych zdolności,
- poziom 3: Deszcz Strzał,
- poziom 4: Deszcz Strzał i Zew Bitwy,
- poziom 5 i dalsze: komplet trzech zdolności,
- wszystkie cztery bitwy Epoki II: komplet trzech zdobytych zdolności,
- sprawdzenie klasy pełnego ekranu i mobilnego bezpiecznego doku,
- pełna regresja 16 poziomów, jednostek, bossów, PWA offline i viewportów iPhone.
