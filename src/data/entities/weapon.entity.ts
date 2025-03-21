import { BaseEntity } from './base.entity';
import { Weapon, WeaponProperty, WeaponPropertyType } from '../../model/weapon';

/**
 * Weapon database entity
 */
export interface WeaponEntity extends BaseEntity, Weapon {}

/**
 * Weapon database row format (flattened for database storage)
 */
export interface WeaponDatabaseRow extends BaseEntity, Omit<Weapon, 'range'> {
  rangeNormal: number | null;
  rangeLong: number | null;
}

/**
 * Weapon property entity
 */
export interface WeaponPropertyEntity extends BaseEntity, WeaponProperty {}

/**
 * Simplified weapon property for relationships
 */
export interface WeaponPropertyForWeapon {
  name: WeaponPropertyType;
}

/**
 * Initial data for the weapons table
 */
export const WEAPONS: Weapon[] = [
  {
    name: 'Club',
    type: 'Simple Melee',
    cost: '1 sp',
    damageDie: '1d4',
    damageType: 'bludgeoning',
    weight: '2 lb.',
    properties: ['light'],
  },
  {
    name: 'Dagger',
    type: 'Simple Melee',
    cost: '2 gp',
    damageDie: '1d4',
    damageType: 'piercing',
    weight: '1 lb.',
    range: { normal: 20, long: 60 },
    properties: ['finesse', 'light', 'range', 'thrown'],
  },
  {
    name: 'Greatclub',
    type: 'Simple Melee',
    cost: '2 sp',
    damageDie: '1d8',
    damageType: 'bludgeoning',
    weight: '10 lb.',
    properties: ['two-handed'],
  },
  {
    name: 'Handaxe',
    type: 'Simple Melee',
    cost: '5 gp',
    damageDie: '1d6',
    damageType: 'slashing',
    weight: '2 lb.',
    range: { normal: 20, long: 60 },
    properties: ['light', 'range', 'thrown'],
  },
  {
    name: 'Javelin',
    type: 'Simple Melee',
    cost: '5 sp',
    damageDie: '1d6',
    damageType: 'piercing',
    weight: '2 lb.',
    range: { normal: 30, long: 120 },
    properties: ['range', 'thrown'],
  },
  {
    name: 'Light hammer',
    type: 'Simple Melee',
    cost: '2 gp',
    damageDie: '1d4',
    damageType: 'bludgeoning',
    weight: '2 lb.',
    range: { normal: 20, long: 60 },
    properties: ['light', 'range', 'thrown'],
  },
  {
    name: 'Mace',
    type: 'Simple Melee',
    cost: '5 gp',
    damageDie: '1d6',
    damageType: 'bludgeoning',
    weight: '4 lb.',
    properties: [],
  },
  {
    name: 'Quarterstaff',
    type: 'Simple Melee',
    cost: '2 sp',
    damageDie: '1d6',
    damageType: 'bludgeoning',
    weight: '4 lb.',
    versatileDamageDie: '1d8',
    properties: ['versatile'],
  },
  {
    name: 'Sickle',
    type: 'Simple Melee',
    cost: '1 gp',
    damageDie: '1d4',
    damageType: 'slashing',
    weight: '2 lb.',
    properties: ['light'],
  },
  {
    name: 'Spear',
    type: 'Simple Melee',
    cost: '1 gp',
    damageDie: '1d6',
    damageType: 'piercing',
    weight: '3 lb.',
    range: { normal: 20, long: 60 },
    versatileDamageDie: '1d8',
    properties: ['range', 'thrown', 'versatile'],
  },
  {
    name: 'Light crossbow',
    type: 'Simple Ranged',
    cost: '25 gp',
    damageDie: '1d8',
    damageType: 'piercing',
    weight: '5 lb.',
    range: { normal: 80, long: 320 },
    properties: ['ammunition', 'loading', 'two-handed'],
  },
  {
    name: 'Dart',
    type: 'Simple Ranged',
    cost: '5 cp',
    damageDie: '1d4',
    damageType: 'piercing',
    weight: '1/4 lb.',
    range: { normal: 20, long: 60 },
    properties: ['finesse', 'range', 'thrown'],
  },
  {
    name: 'Shortbow',
    type: 'Simple Ranged',
    cost: '25 gp',
    damageDie: '1d6',
    damageType: 'piercing',
    weight: '2 lb.',
    range: { normal: 80, long: 120 },
    properties: ['ammunition', 'range'],
  },
  {
    name: 'Sling',
    type: 'Simple Ranged',
    cost: '1 sp',
    damageDie: '1d4',
    damageType: 'bludgeoning',
    range: { normal: 30, long: 120 },
    properties: ['ammunition', 'range'],
  },
  {
    name: 'Battleaxe',
    type: 'Martial Melee',
    cost: '10 gp',
    damageDie: '1d8',
    damageType: 'slashing',
    weight: '4 lb.',
    versatileDamageDie: '1d10',
    properties: ['versatile'],
  },
  {
    name: 'Flail',
    type: 'Martial Melee',
    cost: '10 gp',
    damageDie: '1d8',
    damageType: 'bludgeoning',
    weight: '2 lb.',
    properties: [],
  },
  {
    name: 'Glaive',
    type: 'Martial Melee',
    cost: '20 gp',
    damageDie: '1d10',
    damageType: 'slashing',
    weight: '6 lb.',
    properties: ['heavy', 'reach', 'two-handed'],
  },
  {
    name: 'Greataxe',
    type: 'Martial Melee',
    cost: '30 gp',
    damageDie: '1d12',
    damageType: 'slashing',
    weight: '7 lb.',
    properties: ['heavy', 'two-handed'],
  },
  {
    name: 'Greatsword',
    type: 'Martial Melee',
    cost: '50 gp',
    damageDie: '2d6',
    damageType: 'slashing',
    weight: '6 lb.',
    properties: ['heavy', 'two-handed'],
  },
  {
    name: 'Halberd',
    type: 'Martial Melee',
    cost: '20 gp',
    damageDie: '1d10',
    damageType: 'slashing',
    weight: '6 lb.',
    properties: ['heavy', 'reach', 'two-handed'],
  },
  {
    name: 'Lance',
    type: 'Martial Melee',
    cost: '10 gp',
    damageDie: '1d12',
    damageType: 'piercing',
    weight: '6 lb.',
    properties: ['lance', 'reach'],
  },
  {
    name: 'Longsword',
    type: 'Martial Melee',
    cost: '15 gp',
    damageDie: '1d8',
    damageType: 'slashing',
    weight: '3 lb.',
    versatileDamageDie: '1d10',
    properties: ['versatile'],
  },
  {
    name: 'Maul',
    type: 'Martial Melee',
    cost: '10 gp',
    damageDie: '2d6',
    damageType: 'bludgeoning',
    weight: '10 lb.',
    properties: ['heavy', 'two-handed'],
  },
  {
    name: 'Morningstar',
    type: 'Martial Melee',
    cost: '15 gp',
    damageDie: '1d8',
    damageType: 'piercing',
    weight: '4 lb.',
    properties: [],
  },
  {
    name: 'Pike',
    type: 'Martial Melee',
    cost: '5 gp',
    damageDie: '1d10',
    damageType: 'piercing',
    weight: '18 lb.',
    properties: ['heavy', 'reach', 'two-handed'],
  },
  {
    name: 'Rapier',
    type: 'Martial Melee',
    cost: '25 gp',
    damageDie: '1d8',
    damageType: 'piercing',
    weight: '2 lb.',
    properties: ['finesse'],
  },
  {
    name: 'Scimitar',
    type: 'Martial Melee',
    cost: '25 gp',
    damageDie: '1d6',
    damageType: 'slashing',
    weight: '3 lb.',
    properties: ['finesse', 'light'],
  },
  {
    name: 'Shortsword',
    type: 'Martial Melee',
    cost: '10 gp',
    damageDie: '1d6',
    damageType: 'piercing',
    weight: '2 lb.',
    properties: ['finesse', 'light'],
  },
  {
    name: 'Trident',
    type: 'Martial Melee',
    cost: '5 gp',
    damageDie: '1d6',
    damageType: 'piercing',
    weight: '4 lb.',
    range: { normal: 20, long: 60 },
    versatileDamageDie: '1d8',
    properties: ['range', 'thrown', 'versatile'],
  },
  {
    name: 'War pick',
    type: 'Martial Melee',
    cost: '5 gp',
    damageDie: '1d8',
    damageType: 'piercing',
    weight: '2 lb.',
    properties: [],
  },
  {
    name: 'Warhammer',
    type: 'Martial Melee',
    cost: '15 gp',
    damageDie: '1d8',
    damageType: 'bludgeoning',
    weight: '2 lb.',
    versatileDamageDie: '1d10',
    properties: ['versatile'],
  },
  {
    name: 'Whip',
    type: 'Martial Melee',
    cost: '2 gp',
    damageDie: '1d4',
    damageType: 'slashing',
    weight: '3 lb.',
    properties: ['finesse', 'reach'],
  },
  {
    name: 'Blowgun',
    type: 'Martial Ranged',
    cost: '10 gp',
    damageDie: '1',
    damageType: 'piercing',
    weight: '1 lb.',
    range: { normal: 25, long: 100 },
    properties: ['ammunition', 'loading', 'range'],
  },
  {
    name: 'Hand crossbow',
    type: 'Martial Ranged',
    cost: '75 gp',
    damageDie: '1d6',
    damageType: 'piercing',
    weight: '3 lb.',
    range: { normal: 30, long: 120 },
    properties: ['ammunition', 'light', 'loading', 'range'],
  },
  {
    name: 'Heavy crossbow',
    type: 'Martial Ranged',
    cost: '50 gp',
    damageDie: '1d10',
    damageType: 'piercing',
    weight: '18 lb.',
    range: { normal: 100, long: 400 },
    properties: ['ammunition', 'heavy', 'loading', 'range', 'two-handed'],
  },
  {
    name: 'Longbow',
    type: 'Martial Ranged',
    cost: '50 gp',
    damageDie: '1d8',
    damageType: 'piercing',
    weight: '2 lb.',
    range: { normal: 150, long: 600 },
    properties: ['ammunition', 'heavy', 'range', 'two-handed'],
  },
  {
    name: 'Net',
    type: 'Martial Ranged',
    cost: '1 gp',
    weight: '2 lb.',
    range: { normal: 5, long: 15 },
    properties: ['net', 'range', 'thrown'],
  },
];

/**
 * Initial data for the weapon properties table
 */
export const WEAPON_PROPERTIES: WeaponProperty[] = [
  {
    name: 'ammunition',
    description:
      'You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon. Each time you attack with the weapon, you expend one piece of ammunition. Drawing the ammunition from a quiver, case, or other container is part of the attack (you need a free hand to load a one-handed weapon). At the end of the battle,you can recover half your expended ammunition by taking a minute to search the battlefield.\n\tIf you use a weapon that has the ammunition property to make a melee attack, you treat the weapon as an improvised weapon.\n\tA sling must be loaded to deal any damage when used in this way.',
  },
  {
    name: 'finesse',
    description:
      'When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity modifier for the attack and damage rolls. You must use the same modifier for both rolls.',
  },
  {
    name: 'heavy',
    description:
      "Small creatures have disadvantage on attack rolls with heavy weapons. A heavy weapon's size and bulk make it too large for a Small creature to use effectively.",
  },
  {
    name: 'lance',
    description:
      "You have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted.",
  },
  {
    name: 'light',
    description:
      'A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons',
  },
  {
    name: 'loading',
    description:
      'Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction to fire it, regardless of the number of attacks you can normally make.',
  },
  {
    name: 'net',
    description:
      'A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net.\n\tWhen you use an action, bonus action, or reaction to at- tack with a net, you can make only one attack regardless of the number of attacks you can normally make.',
  },
  {
    name: 'range',
    description:
      "A weapon that can be used to make a ranged attack has a range shown in parentheses after the ammunition or thrown property. The range lists two numbers. The first is the weapon's normal range in feet, and the second indicates the weapon's long range. When attacking a target beyond normal range, you have disadvantage on the attack roll. You can't attack a target beyond the weapon's long range.",
  },
  {
    name: 'reach',
    description:
      'This weapon adds 5 feet to your reach when you attack with it, as well as when determining your reach for opportunity attacks with it',
  },
  {
    name: 'thrown',
    description:
      'If a weapon has the thrown property, you can throw the weapon to make a ranged attack. If the weapon is a melee weapon, you use the same ability modifier for that attack roll and damage roll that you would use for a melee attack with the weapon. For example, if you throw a handaxe, you use your Strength, but if you throw a dagger, you can use either your Strength or your Dexterity, since the dagger has the finesse property.',
  },
  {
    name: 'two-handed',
    description: 'This weapon requires two hands when you attack with it.',
  },
  {
    name: 'versatile',
    description:
      'This weapon can be used with one or two hands. A damage value in parentheses appears with the property—the damage when the weapon is used with two hands to make a melee attack.',
  },
];
