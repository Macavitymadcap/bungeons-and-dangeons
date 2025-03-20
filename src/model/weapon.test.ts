import { expect, test, describe } from 'bun:test';
import {
  convertWeaponToWeaponTableRow,
  Weapon,
  WeaponTableRow,
} from './weapon';

describe('convertWeaponToWeaponTableRow', () => {
  test('should handle translating the lfat properties name, type, weight and cost', () => {
    // Arrange
    const club: Weapon = {
      name: 'Club',
      type: 'Simple Melee',
      cost: '1 sp',
      damageDie: '1d4',
      damageType: 'bludgeoning',
      weight: '2 lb.',
      properties: ['light'],
    };

    // Act
    const result = convertWeaponToWeaponTableRow(club);

    expect(result.name).toBe(club.name);
    expect(result.type).toBe(club.type);
    expect(result.cost).toBe(club.cost);
    expect(result.weight!).toBe(club.weight!);
  });

  test('should cpmine the weapon damageDie and DamageType into a single string', () => {
    // Arrange
    const maul: Weapon = {
      name: 'Maul',
      type: 'Martial Melee',
      cost: '10 gp',
      damageDie: '2d6',
      damageType: 'bludgeoning',
      weight: '10 lb.',
      properties: ['heavy', 'two-handed'],
    };

    // Act
    const result = convertWeaponToWeaponTableRow(maul);

    // Assert
    expect(result.damage).toBe('2d6 bludgeoning damage');
  });

  test('should assign null to the damage property for a weapon without a damageDie and damageType', () => {
    // Arrange
    const net: Weapon = {
      name: 'Net',
      type: 'Martial Ranged',
      cost: '1 gp',
      weight: '2 lb.',
      range: { normal: 5, long: 15 },
      properties: ['net', 'range', 'thrown'],
    };

    // Act
    const result = convertWeaponToWeaponTableRow(net);

    // Assert
    expect(result.damage).toBeNull();
  });

  test('should return the given weapon properties in alphabetical order', () => {
    // Arrange
    const halberd: Weapon = {
      name: 'Halberd',
      type: 'Martial Melee',
      cost: '20 gp',
      damageDie: '1d10',
      damageType: 'slashing',
      weight: '6 lb.',
      properties: ['reach', 'two-handed', 'heavy'],
    };

    // Act
    const result = convertWeaponToWeaponTableRow(halberd);

    // Assert
    expect(result.properties[0]).toBe('heavy');
    expect(result.properties[1]).toBe('reach');
    expect(result.properties[2]).toBe('two-handed');
  });

  test('should combine the ammuniton PropertyType and range object into a single string given a weapon with both present', () => {
    // Arrange
    const shortbow: Weapon = {
      name: 'Shortbow',
      type: 'Simple Ranged',
      cost: '25 gp',
      damageDie: '1d6',
      damageType: 'piercing',
      weight: '2 lb.',
      range: { normal: 80, long: 120 },
      properties: ['ammunition'],
    };

    // Act
    const result = convertWeaponToWeaponTableRow(shortbow);

    // Assert
    expect(result.properties[0]).toBe('ammunition (range 80/120)');
    expect(result.properties.includes('ammunition')).toBeFalse();
    expect(result.properties.includes('range')).toBeFalse();
  });

  test('should combine the thrown PropertyType and the range object into a single string given a weapon that has both', () => {
    // Arrange
    const lightHammer: Weapon = {
      name: 'Light hammer',
      type: 'Simple Melee',
      cost: '2 gp',
      damageDie: '1d4',
      damageType: 'bludgeoning',
      weight: '2 lb.',
      range: { normal: 20, long: 60 },
      properties: ['light', 'range', 'thrown'],
    };

    // Act
    const result = convertWeaponToWeaponTableRow(lightHammer);

    // Assert
    expect(result.properties).toEqual(
      expect.arrayContaining(['light', 'thrown (range 20/60)']),
    );
  });

  test('should combine the versatile PropertyType and the versatileDamageDie into a single string given a weapon with each', () => {
    // Arrange
    const quarterstaff: Weapon = {
      name: 'Quarterstaff',
      type: 'Simple Melee',
      cost: '2 sp',
      damageDie: '1d6',
      damageType: 'bludgeoning',
      weight: '4 lb.',
      versatileDamageDie: '1d8',
      properties: ['versatile'],
    };

    // Act
    const result = convertWeaponToWeaponTableRow(quarterstaff);

    // Assert
    expect(result.properties[0]).toBe('versatile (1d8)');
  });
});
