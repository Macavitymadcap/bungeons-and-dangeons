import { Die } from './dice';
import { Cost, Weight } from './measures';

const WEAPON_TYPES = {
  SIMPLE_MELEE: 'Simple Melee',
  SIMPLE_RANGED: 'Simple Ranged',
  MARTIAL_MELEE: 'Martial Melee',
  MARTIAL_RANGED: 'Martial Ranged',
} as const;

type WeaponType = (typeof WEAPON_TYPES)[keyof typeof WEAPON_TYPES];

const WEAPON_DAMAGE_TYPES = {
  BLUDGEONING: 'bludgeoning',
  PIERCING: 'piercing',
  SLASHING: 'slashing',
} as const;

export type WeaponDamageType =
  (typeof WEAPON_DAMAGE_TYPES)[keyof typeof WEAPON_DAMAGE_TYPES];

export interface WeaponRange {
  normal: number;
  long: number;
}

const WEAPON_PROPERTY_TYPES = {
  AMMUNTION: 'ammunition',
  FINESSE: 'finesse',
  HEAVY: 'heavy',
  LANCE: 'lance',
  LIGHT: 'light',
  LOADING: 'loading',
  NET: 'net',
  RANGE: 'range',
  REACH: 'reach',
  THROWN: 'thrown',
  TWO_HANDED: 'two-handed',
  VERSATILE: 'versatile',
} as const;

export type WeaponPropertyType =
  (typeof WEAPON_PROPERTY_TYPES)[keyof typeof WEAPON_PROPERTY_TYPES];

export type WeaponDamage = `${Die | number}`;

export interface Weapon {
  name: string;
  type: WeaponType;
  cost: Cost;
  damageDie?: WeaponDamage;
  damageType?: WeaponDamageType;
  weight?: Weight;
  range?: WeaponRange;
  versatileDamageDie?: Die;
  properties: WeaponPropertyType[];
}

export type WeaponDieAndDamage = `${WeaponDamage} ${WeaponDamageType} damage`;

type Range = `(range ${number}/${number})`;

export type CombinedWeaponProperty =
  | Omit<Omit<Omit<WeaponPropertyType, 'range'>, 'versatile'>, 'ammunition'>
  | `ammunition ${Range}`
  | `thrown ${Range}`
  | `versatile (${Die})`;

export interface WeaponTableRow {
  name: string;
  type: WeaponType;
  cost: Cost;
  weight: Weight;
  damage: WeaponDieAndDamage | null;
  properties: CombinedWeaponProperty[];
}

export const convertWeaponToWeaponTableRow = (
  weapon: Weapon,
): WeaponTableRow => {
  const damage =
    weapon.damageDie && weapon.damageType
      ? (`${weapon.damageDie} ${weapon.damageType} damage` as WeaponDieAndDamage)
      : null;
  let properties = weapon.properties.toSorted() as string[];

  if (weapon.range && properties.includes('ammunition')) {
    properties = properties.filter(
      property => !property.match(/ammunition|range/),
    );
    properties.unshift(
      `ammunition (range ${weapon.range.normal}/${weapon.range.long})`,
    );
  }

  if (weapon.range && properties.includes('thrown')) {
    properties = properties.filter(property => !property.match(/range|thrown/));
    properties.push(
      `thrown (range ${weapon.range.normal}/${weapon.range.long})`,
    );
    properties.sort();
  }

  if (weapon.versatileDamageDie && properties.includes('versatile')) {
    properties = properties.filter(property => !property.match('versatile'));
    properties.push(`versatile (${weapon.versatileDamageDie})`);
  }

  return {
    name: weapon.name,
    type: weapon.type,
    cost: weapon.cost,
    weight: weapon.weight || null,
    damage: damage,
    properties: properties as CombinedWeaponProperty[],
  } as WeaponTableRow;
};

export interface WeaponProperty {
  name: WeaponPropertyType;
  description: string;
}
