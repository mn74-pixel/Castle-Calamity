(function(root){
  "use strict";

  /*
    Jedno miejsce do zarządzania humorem i reklamą.
    Wydarzenia bieżące dopisujemy dopiero po krótkiej weryfikacji i akceptacji,
    dzięki czemu nie trzeba grzebać w silniku gry.
  */
  root.CASTLE_CONTENT = {
    version: "2026-08-24-v2",

    timing: {
      firstMin: 32,
      firstMax: 58,
      nextMin: 55,
      nextMax: 105,
      maximumConcurrent: 1,
      abilityGagChance: 0.08
    },

    gags: [
      { id: "crowned-chicken", type: "chicken", enabled: true, weight: 24 },
      { id: "flying-fish-ad", type: "skyfish", enabled: true, weight: 22 },
      { id: "polite-policeman", type: "policeman", enabled: true, weight: 20 },
      { id: "airborne-office", type: "flyingdesk", enabled: true, weight: 17 },
      { id: "runaway-bathtub", type: "bathtub", enabled: true, weight: 17 }
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
