(function(root){
  "use strict";

  /*
    Rejestr pakietów epok. Silnik pozostaje wspólny; pakiet określa wygląd,
    dostępne jednostki, pociski, dźwięki i pulę humoru. Wersja v6.1 udostępnia
    pełne średniowiecze oraz pierwszy zamknięty rozdział Epoki II.
  */
  root.CASTLE_ERAS = {
    active: "medieval",
    next: "early-modern",
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
        balanceProfile: "campaign-v1",
        campaign: {
          titleKey: "campaign.era",
          levelIds: [1,2,3,4,5,6,7,8,9,10,11,12],
          /* Punkty tworzą jedną drogę w kształcie litery S. Ten sam ekran
             przyjmie później inne mapy bez zmian w silniku. */
          mapPoints: [
            [6.5,23],[23.5,23],[40.5,23],[57.5,23],[74.5,23],[91.5,23],
            [91.5,76],[74.5,76],[57.5,76],[40.5,76],[23.5,76],[6.5,76]
          ]
        }
      },

      /* Pierwszy zamknięty rozdział Epoki II. Odblokowuje się po pełnej
         kampanii średniowiecznej i korzysta z tego samego silnika oraz zapisu. */
      "early-modern": {
        id: "early-modern",
        enabled: true,
        unlockAfter: { eraId: "medieval", completedLevels: 12 },
        levelIds: [1,2,3,4],
        sceneSet: "early-modern-frontier",
        castleStyle: "brick-bastion",
        unitSet: "powder-and-pikes",
        projectileSet: "muskets-mortars-machines",
        humorPool: "early-modern-absurd",
        balanceProfile: "campaign-v2",
        campaign: {
          titleKey: "campaign.era2",
          levelIds: [1,2,3,4],
          mapPoints: [[12,28],[37,70],[63,28],[88,70]]
        }
      }
    }
  };
})(window);
