# Czytelne karty wsparcia v6.1.7

## Cel

Obniżyć dok Deszczu Strzał, Mrozu i Zewu Bitwy oraz jasno pokazać, dlaczego
nie można uruchomić kolejnego Drwala.

## Zmiany

- dok zdolności w pełnym ekranie telefonu jest o 18 px niżej,
- aktywnych może pozostać najwyżej dwóch Drwali na stronę,
- po osiągnięciu limitu karta dostaje nieruchomą nakładkę `🔒 2/2`,
- po zwolnieniu miejsca nakładka znika automatycznie,
- wspólny system pokazuje również limit Kamieniarzy i brak kamieniołomu,
- karta nie zmienia rozmiaru, położenia ani filtra obrazu.

## Regresja

- stan Drwala: dostępny → `2/2` → ponownie dostępny,
- brak wpływu na nieograniczoną liczbę jednostek bojowych,
- stała geometria kart na dotyku i podczas aktualizacji HUD-u,
- kontrola czterech bezpiecznych viewportów iPhone,
- pełne testy 16 poziomów, obu epok, bossów i PWA offline.
