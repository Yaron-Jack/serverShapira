export type CompostStandName = 'test' |
'hakaveret' |
'food_forest_park_hahurshot' |
'tel_hubez' |
'ginat_hahistadrut' |
'alexander_zaid' |
'de_Modina' |
'shiffer' |
'Burma'

export const standsIdToNameMap: Record<number, CompostStandName> = {
  1: 'test',
  2: 'hakaveret',
  3: 'food_forest_park_hahurshot',
  4: 'tel_hubez',
  5: 'ginat_hahistadrut',
  6: 'alexander_zaid',
  7: 'de_Modina',
  8: 'shiffer',
  9: 'Burma',
};


export const standsNameToIdMap: Record<CompostStandName, number> = {
    test: 1,
    hakaveret: 2,
    food_forest_park_hahurshot:3,
    tel_hubez: 4,
    ginat_hahistadrut: 5,
    alexander_zaid: 6,
    de_Modina: 7,
    shiffer: 8,
    Burma: 9,
  };
  