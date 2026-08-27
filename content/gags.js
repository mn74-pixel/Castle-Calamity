(function(root){
  "use strict";

  /*
    Jedno miejsce do zarządzania humorem i reklamą.
    Wydarzenia bieżące dopisujemy dopiero po krótkiej weryfikacji i akceptacji,
    dzięki czemu nie trzeba grzebać w silniku gry.
  */
  root.CASTLE_CONTENT = {
    version: "2026-08-27-v5.3",

    timing: {
      firstMin: 32,
      firstMax: 58,
      nextMin: 55,
      nextMax: 105,
      maximumConcurrent: 1,
      abilityGagChance: 0.08
    },

    /*
      Każdy etap ma własny gag przelotowy. W jednej bitwie uruchamia się on
      najwyżej raz, więc animacja nie zdradza pętli i żart nie męczy gracza.
    */
    gags: [
      { id: "crowned-chicken", type: "chicken", enabled: true, weight: 1, levels: [1] },
      { id: "runaway-bathtub", type: "bathtub", enabled: true, weight: 1, levels: [2] },
      { id: "polite-policeman", type: "policeman", enabled: true, weight: 1, levels: [3] },
      { id: "cloud-knight", type: "cloudknight", enabled: true, weight: 1, levels: [4] },
      { id: "moon-janitor", type: "moonjanitor", enabled: true, weight: 1, levels: [5] },
      { id: "flying-fish-ad", type: "skyfish", enabled: true, weight: 1, levels: [6] },
      { id: "duck-patrol", type: "duckpatrol", enabled: true, weight: 1, levels: [7] },
      { id: "airborne-office", type: "flyingdesk", enabled: true, weight: 1, levels: [8] },
      { id: "fire-marshal", type: "firemarshal", enabled: true, weight: 1, levels: [9] },
      { id: "tea-balloon", type: "teaballoon", enabled: true, weight: 1, levels: [10] },
      { id: "snow-clerk", type: "snowclerk", enabled: true, weight: 1, levels: [11] },
      { id: "vacuum-demon", type: "vacuumdemon", enabled: true, weight: 1, levels: [12] },

      /* Rzadki gag alternatywny późnej kampanii. Występuje obok jednego
         właściwego żartu poziomu, lecz nadal obowiązuje limit jednego gagu
         w całej bitwie. Waga 0,22 daje ok. 18% szansy tylko na poziomach
         7–12, więc spadochroniarz pozostaje niespodzianką. */
      { id: "airdrop-regret", type: "airdrop", enabled: true, weight: 0.22, levels: [7,8,9,10,11,12] }
    ],

    flyingFishAd: {
      enabled: true,
      label: "REKLAMA",
      headline: "MIEJSCE DLA PARTNERA",
      background: "#f4e6bf",
      border: "#7f2635",
      text: "#2a2030"
    },

    /*
      Tu będziemy dopisywać krótkotrwałe gagi związane z wydarzeniami
      z Polski i świata. Wpis z enabled:false jest tylko szablonem.
    */
    topicalGags: [
      {
        id: "topical-template",
        enabled: false,
        type: "banner",
        validFrom: "YYYY-MM-DD",
        validTo: "YYYY-MM-DD",
        sourceNote: "krótki opis zweryfikowanego wydarzenia",
        visualNote: "opis żartu bez używania chronionych postaci lub cytatów"
      }
    ]
  };
})(window);
