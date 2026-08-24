(function(root){
  "use strict";

  /*
    Rejestr pakietów epok. Silnik pozostaje wspólny; pakiet określa wygląd,
    dostępne jednostki, pociski, dźwięki i pulę humoru. Na razie aktywny jest
    wyłącznie dopracowywany pakiet średniowieczny.
  */
  root.CASTLE_ERAS = {
    active: "medieval",
    schemaVersion: 1,
    packs: {
      medieval: {
        id: "medieval",
        enabled: true,
        levelIds: [1,2,3,4,5,6,7,8,9,10,11,12],
        sceneSet: "medieval-core",
        castleStyle: "stone-heraldry",
        unitSet: "medieval-army",
        projectileSet: "bows-magic-siege",
        humorPool: "medieval-absurd",
        balanceProfile: "campaign-v1"
      }
    }
  };
})(window);
