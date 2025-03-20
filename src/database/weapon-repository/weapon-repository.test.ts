import {
  expect,
  test,
  describe,
  beforeEach,
  afterEach,
  spyOn,
  Mock,
} from 'bun:test';
import { WeaponRepository } from './weapon-repository';
import {
  WEAPON_PROPERTIES,
  WeaponDamage,
  WeaponDamageType,
  WeaponEntity,
  WeaponPropertyEntity,
  WeaponPropertyType,
  WEAPONS,
} from './weapon-repository.model';
import { Die, Weight } from '../../model/measures';

describe('WeaponRepository', () => {
  let weaponRepository: WeaponRepository;
  let warnSpy: Mock<{
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
    (...data: any[]): void;
  }>;

  beforeEach(() => {
    weaponRepository = new WeaponRepository(':memory:');
    warnSpy = spyOn(console, 'warn');
  });

  afterEach(() => {
    weaponRepository.close();
    warnSpy.mockClear();
  });

  describe('read', () => {
    test('should return the corresponding WeaponEntity given an id', () => {
      // Arrange
      const maceId = 7;

      // Act
      const result = weaponRepository.read(maceId) as WeaponEntity;

      // Assert
      expect(result.name).toBe('Mace');
      expect(result.type).toBe('Simple Melee');
      expect(result.cost).toBe('5 gp');
      expect(result.damageDie).toBe('1d6');
      expect(result.damageType).toBe('bludgeoning');
      expect(result.weight).toBe('4 lb.');
      expect(result.range).not.toBeDefined();
      expect(result.versatileDamageDie).toBeNull();
      expect(result.properties).toBeEmpty();
    });

    test('should return the expected array of properties for a weapon with properties', () => {
      // Arrange
      const glaiveId = 17;

      // Act
      const result = weaponRepository.read(glaiveId) as WeaponEntity;

      // Assert
      const expectedProperties: WeaponPropertyType[] = [
        'heavy',
        'reach',
        'two-handed',
      ];

      expect(result.name).toBe('Glaive');
      expect(result.type).toBe('Martial Melee');
      expect(result.cost).toBe('20 gp');
      expect(result.damageDie).toBe('1d10');
      expect(result.damageType).toBe('slashing');
      expect(result.weight).toBe('6 lb.');
      expect(result.range).not.toBeDefined();
      expect(result.versatileDamageDie).toBeNull();
      expect(result.properties).toEqual(
        expect.arrayContaining(expectedProperties),
      );
    });

    test('should return the expected range and property "thrown" given the id of a thrown weapon', () => {
      // Arrange
      const daggerId = 2;

      // Act
      const result = weaponRepository.read(daggerId) as WeaponEntity;

      // Assert
      const expectedProperties: WeaponPropertyType[] = [
        'finesse',
        'light',
        'range',
        'thrown',
      ];

      expect(result.name).toBe('Dagger');
      expect(result.type).toBe('Simple Melee');
      expect(result.cost).toBe('2 gp');
      expect(result.damageDie).toBe('1d4');
      expect(result.damageType).toBe('piercing');
      expect(result.weight).toBe('1 lb.');
      expect(result.range).toBeDefined();
      expect(result.range!.normal).toBe(20);
      expect(result.range!.long).toBe(60);
      expect(result.versatileDamageDie).toBeNull();
      expect(result.properties).toEqual(
        expect.arrayContaining(expectedProperties),
      );
    });

    test('should return the exected versatileDamageDie and the property "versatile" given an entity hat has the "versatile" property', () => {
      // Arrange
      const longswordId = 22;

      // Act
      const result = weaponRepository.read(longswordId) as WeaponEntity;

      // Assert
      expect(result.name).toBe('Longsword');
      expect(result.type).toBe('Martial Melee');
      expect(result.cost).toBe('15 gp');
      expect(result.damageDie).toBe('1d8');
      expect(result.damageType).toBe('slashing');
      expect(result.weight).toBe('3 lb.');
      expect(result.range).not.toBeDefined();
      expect(result.versatileDamageDie).toBe('1d10');
      expect(result.properties).toEqual(['versatile']);
    });
  });

  describe('readAll', () => {
    test('should return an array of WeaponEntity consisiting of the initial Weapon array with added ids', () => {
      // Act
      const result = weaponRepository.readAll();

      // Assert
      expect(result.length).toBe(WEAPONS.length);

      // Check each weapon from the source data exists in the result
      WEAPONS.forEach((expectedWeapon, index) => {
        const actualWeapon = result.find(
          w => w.name === expectedWeapon.name,
        ) as WeaponEntity;
        expect(actualWeapon).toBeDefined();

        // Check each property matches
        expect(actualWeapon!.type).toBe(expectedWeapon.type);
        expect(actualWeapon!.cost).toBe(expectedWeapon.cost);
        expect(actualWeapon!.damageDie).toBe(
          (expectedWeapon.damageDie || null) as WeaponDamage,
        );
        expect(actualWeapon!.damageType).toBe(
          (expectedWeapon.damageType || null) as WeaponDamageType,
        );
        expect(actualWeapon!.weight).toBe(
          (expectedWeapon.weight || null) as Weight,
        );
        expect(actualWeapon!.versatileDamageDie).toBe(
          (expectedWeapon.versatileDamageDie || null) as Die,
        );

        // Check range if it exists
        if (expectedWeapon.range) {
          expect(actualWeapon!.range).toBeDefined();
          expect(actualWeapon!.range!.normal).toBe(expectedWeapon.range.normal);
          expect(actualWeapon!.range!.long).toBe(expectedWeapon.range.long);
        } else {
          expect(actualWeapon!.range).toBeUndefined();
        }

        // Check properties array (order doesn't matter)
        expect(actualWeapon!.properties.sort()).toEqual(
          expectedWeapon.properties.sort(),
        );
      });
    });
  });

  describe('readByName', () => {
    test('should return an array of the 5 bowed weapons when given the name "bow"', () => {
      // Arrange
      const query = 'bow';

      // Act
      const result = weaponRepository.readByName(query);

      // Assert
      expect(result).toBeArrayOfSize(5);

      const expectedWeaponNames = [
        'Shortbow',
        'Longbow',
        'Light crossbow',
        'Heavy crossbow',
        'Hand crossbow',
      ];
      const weaponNames = result.map(weapon => weapon.name);

      expect(weaponNames).toEqual(expect.arrayContaining(expectedWeaponNames));
    });

    test('should return an empty array when given the name "death ray"', () => {
      // Arrange
      const query = 'death ray';

      // Act
      const result = weaponRepository.readByName(query);

      // Assert
      expect(result).toBeEmpty();
    });
  });

  describe('readWeaponProperty', () => {
    test('should return the expeted WeaponPropertyEntity when given the corresponding id', () => {
      // Arrange
      const lancePropertyId = 11;

      // Act
      const result = weaponRepository.readWeaponProperty(
        lancePropertyId,
      ) as WeaponPropertyEntity;

      // Assert
      expect(result.name).toBe('lance');

      const expectedDescription = WEAPON_PROPERTIES.find(
        property => property.name === 'lance',
      )!.description;

      expect(result.description).toBe(expectedDescription);
    });
  });

  describe('readAllWeaponProperties', () => {
    test('should return an array of WeaponPropertyEntity containing all the initial weapon properties', () => {
      // Act
      const result = weaponRepository.readAllWeaponProperties();

      // Assert
      expect(result).toBeArrayOfSize(WEAPON_PROPERTIES.length);
    });
  });

  describe('readWeaponPropertyByName', () => {
    test('should return an array containg the two-handed WeaponPropertyEntity when given the name "hand"', () => {
      // Arrange
      const query = 'hand';

      // Act
      const result = weaponRepository.readWeaponPropertyByName(query);

      // Assert
      expect(result).toBeArrayOfSize(1);
      expect(result[0].id).toBe(5);
      expect(result[0].name).toBe('two-handed');
      expect(result[0].description).toBe(
        'This weapon requires two hands when you attack with it.',
      );
    });
  });

  describe('update', () => {
    test('should not be implemented and not change the given entity', () => {
      // Arrange
      const quartersaffUpdate: WeaponEntity = {
        id: 8,
        name: 'EighthStaff',
        type: 'Simple Ranged',
        cost: '1 cp',
        damageDie: '100d12',
        damageType: 'piercing',
        versatileDamageDie: '200d12',
        range: { normal: -800, long: 2 },
        properties: ['ammunition'],
        weight: '1 oz.',
      };

      // Act
      weaponRepository.update(quartersaffUpdate);

      const quarterstaff = weaponRepository.read(8) as WeaponEntity;

      // Expect
      expect(warnSpy).toHaveBeenCalledWith('update method not implemented');
      expect(quarterstaff.name).toBe('Quarterstaff');
      expect(quarterstaff.type).toBe('Simple Melee');
      expect(quarterstaff.cost).toBe('2 sp');
      expect(quarterstaff.damageDie).toBe('1d6');
      expect(quarterstaff.damageType).toBe('bludgeoning');
      expect(quarterstaff.weight).toBe('4 lb.');
      expect(quarterstaff.versatileDamageDie).toBe('1d8');
      expect(quarterstaff.range).not.toBeDefined();
      expect(quarterstaff.properties).toEqual(
        expect.arrayContaining(['versatile']),
      );
    });
  });

  describe('delete', () => {
    test('should not be implemented and not delete the given entity', () => {
      // Arrange
      const sickleId = 10;

      // Act
      weaponRepository.delete(sickleId);
      const sickle = weaponRepository.read(sickleId);

      // Expect
      expect(warnSpy).toHaveBeenCalledWith('delete method not implemented');
      expect(sickle).not.toBeNull();
    });
  });
});
