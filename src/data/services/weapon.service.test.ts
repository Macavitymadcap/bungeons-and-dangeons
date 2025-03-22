import {
  expect,
  test,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  mock
} from 'bun:test';
import { WeaponService } from './weapon.service';
import { WeaponRepository } from '../repositories/weapon.repository';
import { 
  WeaponEntity, 
  WeaponPropertyEntity, 
  WEAPONS, 
  WEAPON_PROPERTIES 
} from '../entities/weapon.entity';
import { DB_CONFIG } from '../config/db-config';
import { DbContext } from '../context/db-context';
import { Weapon, WeaponTableRow } from '../../model/weapon';

describe('WeaponService', () => {
  beforeAll(() => {
    (DbContext as any).instance = undefined;
  });
  
  afterAll(() => {
    try {
      const instance = DbContext.getInstance();
      instance.close();
    } catch (error) {
      // Handle errors
    }
    (DbContext as any).instance = undefined;
  });
  
  describe('getAllWeapons', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return all weapons without IDs', () => {
      // Act
      const result = weaponService.getAllWeapons();
      
      // Assert
      expect(result.length).toBe(WEAPONS.length);
      expect(result[0]).not.toHaveProperty('id');
      expect(result.map(w => w.name)).toEqual(expect.arrayContaining(WEAPONS.map(w => w.name)));
    });
  });
  
  describe('getAllWeaponsForTable', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return weapons formatted for table display', () => {
      // Act
      const result = weaponService.getAllWeaponsForTable();
      
      // Assert
      expect(result.length).toBe(WEAPONS.length);
      
      expect(result[0]).toHaveProperty('damage');
      expect(result[0]).not.toHaveProperty('id');
      expect(result[0]).not.toHaveProperty('damageDie');
      
      const longsword = result.find(w => w.name === 'Longsword');
      expect(longsword).toBeDefined();
      expect(longsword?.type).toBe('Martial Melee');
      expect(longsword?.damage).toBe('1d8 slashing damage');
      expect(longsword?.properties).toContain('versatile (1d10)');
    });
  });
  
  describe('getWeaponById', () => {
    let weaponService: WeaponService;
    let repository: WeaponRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
      repository = new WeaponRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      repository.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return weapon without ID when found', () => {
      // Arrange
      const allWeapons = repository.readAll();
      const dagger = allWeapons.find(w => w.name === 'Dagger');
      
      // Act
      const result = weaponService.getWeaponById(dagger!.id);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Dagger');
      expect(result?.type).toBe('Simple Melee');
      expect(result?.damageDie).toBe('1d4');
      expect(result?.damageType).toBe('piercing');
      expect(result?.properties).toContain('finesse');
      expect(result?.properties).toContain('light');
      expect(result).not.toHaveProperty('id');
    });
    
    test('should return null when weapon not found', () => {
      // Act
      const result = weaponService.getWeaponById(999);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('searchWeaponsByName', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return matching weapons with exact name', () => {
      // Arrange
      const searchTerm = 'Dagger';
      
      // Act
      const result = weaponService.searchWeaponsByName(searchTerm);
      
      // Assert
      expect(result).toBeArrayOfSize(1);
      expect(result[0].name).toBe('Dagger');
      expect(result[0]).not.toHaveProperty('id');
    });
    
    test('should return multiple matching weapons with partial name', () => {
      // Arrange
      const searchTerm = 'sword';
      
      // Act
      const result = weaponService.searchWeaponsByName(searchTerm);
      
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(3);
      expect(result.some(w => w.name === 'Longsword')).toBeTrue();
      expect(result.some(w => w.name === 'Shortsword')).toBeTrue();
      expect(result.some(w => w.name === 'Greatsword')).toBeTrue();
      
      result.forEach(weapon => {
        expect(weapon).not.toHaveProperty('id');
      });
    });
    
    test('should return empty array for non-matching name', () => {
      // Arrange
      const searchTerm = 'lightsaber';
      
      // Act
      const result = weaponService.searchWeaponsByName(searchTerm);
      
      // Assert
      expect(result).toBeArrayOfSize(0);
    });
  });
  
  describe('getAllWeaponProperties', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return all weapon properties without IDs', () => {
      // Act
      const result = weaponService.getAllWeaponProperties();
      
      // Assert
      expect(result.length).toBe(WEAPON_PROPERTIES.length);
      expect(result[0]).not.toHaveProperty('id');
      
      // Check for some expected properties
      const propertyNames = result.map(p => p.name);
      expect(propertyNames).toContain('finesse');
      expect(propertyNames).toContain('heavy');
      expect(propertyNames).toContain('versatile');
    });
  });
  
  describe('getWeaponPropertyByName', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return property when found', () => {
      // Arrange
      const propertyName = 'finesse';
      const expectedDescription = WEAPON_PROPERTIES.find(p => p.name === propertyName)?.description!;
      
      // Act
      const result = weaponService.getWeaponPropertyByName(propertyName);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result?.name).toBe(propertyName);
      expect(result?.description!).toBe(expectedDescription);
      expect(result).not.toHaveProperty('id');
    });
    
    test('should return null when property not found', () => {
      // Arrange
      const propertyName = 'nonexistent';
      
      // Act
      const result = weaponService.getWeaponPropertyByName(propertyName);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('getWeaponsByType', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should group weapons correctly by type', () => {
      // Act
      const result = weaponService.getWeaponsByType();
      
      // Assert
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining(['Simple Melee', 'Simple Ranged', 'Martial Melee', 'Martial Ranged'])
      );
      
      expect(result['Simple Melee'].every(w => w.type === 'Simple Melee')).toBeTrue();
      expect(result['Martial Ranged'].every(w => w.type === 'Martial Ranged')).toBeTrue();
      
      // Check for no IDs in returned data
      Object.values(result).flat().forEach(weapon => {
        expect(weapon).not.toHaveProperty('id');
      });
    });
    
    test('should have correct counts for each type', () => {
      // Arrange
      const simpleMeleeCount = WEAPONS.filter(w => w.type === 'Simple Melee').length;
      const simpleRangedCount = WEAPONS.filter(w => w.type === 'Simple Ranged').length;
      const martialMeleeCount = WEAPONS.filter(w => w.type === 'Martial Melee').length;
      const martialRangedCount = WEAPONS.filter(w => w.type === 'Martial Ranged').length;
      
      // Act
      const result = weaponService.getWeaponsByType();
      
      // Assert
      expect(result['Simple Melee'].length).toBe(simpleMeleeCount);
      expect(result['Simple Ranged'].length).toBe(simpleRangedCount);
      expect(result['Martial Melee'].length).toBe(martialMeleeCount);
      expect(result['Martial Ranged'].length).toBe(martialRangedCount);
    });
  });
  
  describe('getSimpleWeapons and getMartialWeapons', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('getSimpleWeapons should return only simple weapons', () => {
      // Act
      const result = weaponService.getSimpleWeapons();
      
      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(w => w.type.includes('Simple'))).toBeTrue();
      result.forEach(weapon => {
        expect(weapon).not.toHaveProperty('id');
      });
    });
    
    test('getMartialWeapons should return only martial weapons', () => {
      // Act
      const result = weaponService.getMartialWeapons();
      
      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(w => w.type.includes('Martial'))).toBeTrue();
      result.forEach(weapon => {
        expect(weapon).not.toHaveProperty('id');
      });
    });
  });
  
  describe('getMeleeWeapons and getRangedWeapons', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('getMeleeWeapons should return only melee weapons', () => {
      // Act
      const result = weaponService.getMeleeWeapons();
      
      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(w => w.type.includes('Melee'))).toBeTrue();
      result.forEach(weapon => {
        expect(weapon).not.toHaveProperty('id');
      });
    });
    
    test('getRangedWeapons should return only ranged weapons', () => {
      // Act
      const result = weaponService.getRangedWeapons();
      
      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(w => w.type.includes('Ranged'))).toBeTrue();
      result.forEach(weapon => {
        expect(weapon).not.toHaveProperty('id');
      });
    });
  });
  
  describe('getWeaponsByProperty', () => {
    let weaponService: WeaponService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      weaponService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return weapons with specified property', () => {
      // Arrange
      const propertyName = 'finesse';
      
      // Act
      const result = weaponService.getWeaponsByProperty(propertyName);
      
      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(w => w.properties.includes(propertyName))).toBeTrue();
      result.forEach(weapon => {
        expect(weapon).not.toHaveProperty('id');
      });
    });
    
    test('should return empty array for non-existent property', () => {
      // Arrange
      const propertyName = 'nonexistent';
      
      // Act
      const result = weaponService.getWeaponsByProperty(propertyName);
      
      // Assert
      expect(result).toBeArrayOfSize(0);
    });
  });
  
  describe('close', () => {
    test('should close the repository', () => {
      // Arrange
      (DbContext as any).instance = undefined;
      const mockRepository = {
        close: mock(() => {})
      };
      
      const weaponService = new WeaponService(DB_CONFIG.inMemoryPath);
      (weaponService as any).repository = mockRepository;
      
      // Act
      weaponService.close();
      
      // Assert
      expect(mockRepository.close).toHaveBeenCalled();
    });
  });
});