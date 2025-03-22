import {
  expect,
  test,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll
} from 'bun:test';
import { WeaponRepository } from './weapon.repository';
import { 
  WeaponEntity, 
  WEAPONS, 
  WEAPON_PROPERTIES 
} from '../entities/weapon.entity';
import { DB_CONFIG } from '../config/db-config';
import { DbContext } from '../context/db-context';
import { WeaponPropertyType } from '../../model/weapon';

describe('WeaponRepository', () => {
  beforeAll(() => {
    (DbContext as any).instance = undefined;
  });
  
  afterAll(() => {
    try {
      const instance = DbContext.getInstance();
      instance.close();
    } catch (error) {
      // Ignore errors if already closed
    }
    (DbContext as any).instance = undefined;
  });
  
  describe('Basic Repository Operations', () => {
    let weaponRepository: WeaponRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponRepository = new WeaponRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        weaponRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });
    
    test('should initialize with correct tables and data', () => {
      // Act
      const allWeapons = weaponRepository.readAll();
      const allProperties = weaponRepository.readAllWeaponProperties();
      
      // Assert
      expect(allWeapons.length).toBe(WEAPONS.length);
      expect(allProperties.length).toBe(WEAPON_PROPERTIES.length);
    });
    
    test('should create a new weapon entity and return its ID', () => {
      // Arrange
      const newWeapon: Omit<WeaponEntity, 'id'> = {
        name: 'Vorpal Sword',
        type: 'Martial Melee',
        cost: '5000 gp',
        damageDie: '1d8',
        damageType: 'slashing',
        weight: '3 lb.',
        versatileDamageDie: '1d10',
        properties: ['versatile', 'finesse']
      };
      
      // Act
      const id = weaponRepository.create(newWeapon);
      
      // Assert
      expect(id).toBeGreaterThan(0);
      
      const createdWeapon = weaponRepository.read(id);
      expect(createdWeapon).not.toBeNull();
      expect(createdWeapon?.name).toBe(newWeapon.name);
      expect(createdWeapon?.properties).toContain('versatile');
      expect(createdWeapon?.properties).toContain('finesse');
    });

    test('should handle weapon with range property', () => {
      // Arrange
      const newWeapon: Omit<WeaponEntity, 'id'> = {
        name: 'Magic Bow',
        type: 'Martial Ranged',
        cost: '1000 gp',
        damageDie: '2d6',
        damageType: 'piercing',
        weight: '2 lb.',
        range: { normal: 150, long: 600 },
        properties: ['ammunition', 'heavy', 'range', 'two-handed']
      };
      
      // Act
      const id = weaponRepository.create(newWeapon);
      const createdWeapon = weaponRepository.read(id) as WeaponEntity;
      
      // Assert
      expect(createdWeapon.range).toBeDefined();
      expect(createdWeapon.range!.normal).toBe(150);
      expect(createdWeapon.range!.long).toBe(600);
      expect(createdWeapon.properties).toContain('ammunition');
      expect(createdWeapon.properties).toContain('range');
    });
  });
  
  describe('Read Operations', () => {
    let weaponRepository: WeaponRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponRepository = new WeaponRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        weaponRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });
    
    test('should return null for non-existent weapon id', () => {
      // Act
      const result = weaponRepository.read(999);
      
      // Assert
      expect(result).toBeNull();
    });
    
    test('should read weapon by ID with correct properties', () => {
      // Arrange
      const weapons = weaponRepository.readAll();
      const longsword = weapons.find(w => w.name === 'Longsword');
      
      // Act
      const result = weaponRepository.read(longsword!.id);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Longsword');
      expect(result!.type).toBe('Martial Melee');
      expect(result!.damageDie).toBe('1d8');
      expect(result!.damageType).toBe('slashing');
      expect(result!.versatileDamageDie).toBe('1d10');
      expect(result!.properties).toContain('versatile');
    });
    
    test('should read all weapon entities', () => {
      // Act
      const result = weaponRepository.readAll();
      
      // Assert
      expect(result.length).toBe(WEAPONS.length);
      
      const weaponTypes = ['Simple Melee', 'Simple Ranged', 'Martial Melee', 'Martial Ranged'];
      weaponTypes.forEach(type => {
        const matchingWeapons = result.filter(w => w.type === type);
        expect(matchingWeapons.length).toBeGreaterThan(0);
      });
    });
    
    test('should find weapons by exact name', () => {
      // Arrange
      const query = 'Dagger';
      
      // Act
      const result = weaponRepository.readByName(query);
      
      // Assert
      expect(result).toBeArrayOfSize(1);
      expect(result[0].name).toBe('Dagger');
    });
    
    test('should find multiple weapons by partial name', () => {
      // Arrange
      const query = 'sword';
      
      // Act
      const result = weaponRepository.readByName(query);
      
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(3);
      expect(result.some(w => w.name === 'Longsword')).toBeTrue();
      expect(result.some(w => w.name === 'Shortsword')).toBeTrue();
      expect(result.some(w => w.name === 'Greatsword')).toBeTrue();
    });
    
    test('should return an empty array for non-existent weapon name', () => {
      // Arrange
      const query = 'lightsaber';
      
      // Act
      const result = weaponRepository.readByName(query);
      
      // Assert
      expect(result).toBeArrayOfSize(0);
    });
    
    test('should read weapon property by ID', () => {
      // Arrange
      const properties = weaponRepository.readAllWeaponProperties();
      const finesse = properties.find(p => p.name === 'finesse');
      
      // Act
      const result = weaponRepository.readWeaponProperty(finesse!.id);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result!.name).toBe('finesse');
      expect(result!.description).toInclude('Strength or Dexterity modifier');
    });
    
    test('should read all weapon properties', () => {
      // Act
      const result = weaponRepository.readAllWeaponProperties();
      
      // Assert
      expect(result.length).toBe(WEAPON_PROPERTIES.length);
      
      const expectedProperties = ['finesse', 'versatile', 'heavy', 'light', 'thrown'];
      expectedProperties.forEach(propName => {
        expect(result.some(p => p.name === propName)).toBeTrue();
      });
    });
    
    test('should find weapon properties by name', () => {
      // Arrange
      const query = 'hand';
      
      // Act
      const result = weaponRepository.readWeaponPropertyByName(query);
      
      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(p => p.name === 'two-handed')).toBeTrue();
    });
  });
  
  describe('Weapon Property Relationships', () => {
    let weaponRepository: WeaponRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponRepository = new WeaponRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        weaponRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });
    
    test('should correctly associate properties with weapons', () => {
      // Arrange
      const newWeapon: Omit<WeaponEntity, 'id'> = {
        name: 'Test Rapier',
        type: 'Martial Melee',
        cost: '25 gp',
        damageDie: '1d8',
        damageType: 'piercing',
        weight: '2 lb.',
        properties: ['finesse', 'light', 'reach']
      };
      
      // Act
      const id = weaponRepository.create(newWeapon);
      const weapon = weaponRepository.read(id);
      
      // Assert
      expect(weapon!.properties).toBeArrayOfSize(3);
      expect(weapon!.properties).toContain('finesse');
      expect(weapon!.properties).toContain('light');
      expect(weapon!.properties).toContain('reach');
    });
    
    test('should handle adding a new property not in initial data', () => {
      // Arrange
      const newWeapon: Omit<WeaponEntity, 'id'> = {
        name: 'Custom Weapon',
        type: 'Martial Melee',
        cost: '100 gp',
        damageDie: '1d10',
        damageType: 'slashing',
        weight: '5 lb.',
        properties: ['finesse', 'reach', 'heavy']
      };
      
      // Act
      const id = weaponRepository.create(newWeapon);
      const weapon = weaponRepository.read(id);
      
      // Assert
      expect(weapon!.properties).toEqual(
        expect.arrayContaining(['finesse', 'reach', 'heavy'])
      );
    });
  });
  
  describe('Update and Delete Operations', () => {
    let weaponRepository: WeaponRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponRepository = new WeaponRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        weaponRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });
    
    test('update should return success false', () => {
      // Act
      const result = weaponRepository.update({
        id: 1,
        name: 'Modified Club',
        type: 'Simple Melee',
        cost: '1 gp',
        damageDie: '1d6',
        damageType: 'bludgeoning',
        weight: '3 lb.',
        properties: ['light']
      });
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('not implemented');
    });
    
    test('delete should return success false', () => {
      // Act
      const result = weaponRepository.delete(1);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('not implemented');
    });
  });

  describe('error handling', () => {
    let weaponRepository: WeaponRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponRepository = new WeaponRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        weaponRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });

    test('should throw error when ensuring property exists with unknown property name', () => {
      // Arrange
      const nonExistentProperty = 'laser' as WeaponPropertyType;
      
      // Act & Assert
      expect(() => {
        // We need to access the private method, so we use type casting
        (weaponRepository as any).ensurePropertyExists(nonExistentProperty);
      }).toThrow(`No description found for weapon property: ${nonExistentProperty}`);
    });
  
    test('should handle null properties when combining weapon with properties', () => {
      // Arrange
      const weaponRow = {
        id: 999,
        name: 'Test Weapon',
        type: 'Simple Melee',
        cost: '1 gp',
        damageDie: '1d6',
        damageType: 'piercing',
        weight: '1 lb.',
        rangeNormal: null,
        rangeLong: null,
        versatileDamageDie: null
      };
      
      // Act
      const result = (weaponRepository as any).combineWeaponRowWithProperties(weaponRow, []);
      
      // Assert
      expect(result.range).toBeUndefined();
      expect(result.properties).toBeArrayOfSize(0);
    });
    
    test('should handle properties correctly when reading a weapon by ID that doesn\'t exist', () => {
      // Act
      const result = weaponRepository.read(999);
      
      // Assert
      expect(result).toBeNull();
    });
  });
});
