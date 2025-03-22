import {
  expect,
  test,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll
} from 'bun:test';
import { ArmourRepository } from './armour.repository';
import { ArmourEntity, ARMOURS } from '../entities/armour.entity';
import { DB_CONFIG } from '../config/db-config';
import { DbContext } from '../context/db-context';

describe('ArmourRepository', () => {
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
    let armourRepository: ArmourRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourRepository = new ArmourRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        armourRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });
    
    test('should initialize with correct table and data', () => {
      // Act
      const allArmour = armourRepository.readAll();
      
      // Assert
      expect(allArmour.length).toBe(ARMOURS.length);
    });
    
    test('should create a new armour entity and return its ID', () => {
      // Arrange
      const newArmour: Omit<ArmourEntity, 'id'> = {
        name: 'elven chainmail',
        description: 'A magical chainmail made by elves.',
        type: 'Medium' as const,
        cost: '1000 gp',
        armourClass: '15 + Dex modifier (max 2)',
        weight: '15 lb.',
      };
      
      // Act
      const id = armourRepository.create(newArmour);
      
      // Assert
      expect(id).toBeGreaterThan(0);
      
      const createdArmour = armourRepository.read(id);
      expect(createdArmour).not.toBeNull();
      expect(createdArmour?.name).toBe(newArmour.name);
      expect(createdArmour?.description).toBe(newArmour.description);
    });
    
    test('should handle optional properties correctly', () => {
      // Arrange
      const newArmour: Omit<ArmourEntity, 'id'> = {
        name: 'mithril plate',
        description: 'Incredibly light plate armour made of mithril.',
        type: 'Heavy' as const,
        cost: '5000 gp',
        armourClass: '18',
        weight: '25 lb.',
        strength: 'Str 13',
        stealth: 'Disadvantage' as const,
      };
      
      // Act
      const id = armourRepository.create(newArmour);
      const createdArmour = armourRepository.read(id) as ArmourEntity;
      
      // Assert
      expect(createdArmour.strength).toBe('Str 13');
      expect(createdArmour.stealth).toBe('Disadvantage');
    });
  });
  
  describe('Read Operations', () => {
    let armourRepository: ArmourRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourRepository = new ArmourRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        armourRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });
    
    test('should return null for non-existent id', () => {
      // Act
      const result = armourRepository.read(999);
      
      // Assert
      expect(result).toBeNull();
    });
    
    test('should read all armour entities', () => {
      // Act
      const result = armourRepository.readAll();
      
      // Assert
      expect(result.length).toBe(ARMOURS.length);
      
      const armourTypes = ['Light', 'Medium', 'Heavy', 'Shield'];
      armourTypes.forEach(type => {
        const matchingArmour = result.filter(a => a.type === type);
        expect(matchingArmour.length).toBeGreaterThan(0);
      });
    });
    
    test('should find armour by exact name', () => {
      // Arrange
      const query = 'padded';
      
      // Act
      const result = armourRepository.readByName(query);
      
      // Assert
      expect(result).toBeArrayOfSize(1);
      expect(result[0].name).toBe('padded');
    });
    
    test('should find multiple armour by partial name', () => {
      // Arrange
      const query = 'leather';
      
      // Act
      const result = armourRepository.readByName(query);
      
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(a => a.name === 'leather')).toBeTrue();
      expect(result.some(a => a.name === 'studded leather')).toBeTrue();
    });
    
    test('should return an empty array for non-existent name', () => {
      // Arrange
      const query = 'vibranium';
      
      // Act
      const result = armourRepository.readByName(query);
      
      // Assert
      expect(result).toBeArrayOfSize(0);
    });
    
    test('should return armour description by name', () => {
      // Arrange
      const armour = ARMOURS[0];
      
      // Act
      const result = armourRepository.readDescriptionByArmourName(armour.name);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result?.description).toBe(armour.description);
    });
    
    test('should return null for non-existent armour description', () => {
      // Act
      const result = armourRepository.readDescriptionByArmourName('Mithril of Bilbo');
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('Update and Delete Operations', () => {
    let armourRepository: ArmourRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourRepository = new ArmourRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      try {
        armourRepository.close();
      } catch (error) {
        // Ignore errors if already closed
      }
      (DbContext as any).instance = undefined;
    });
    
    test('update should return success false', () => {
      // Act
      const result = armourRepository.update({
        id: 1,
        name: 'test',
        description: 'test',
        type: 'Light' as const,
        cost: '0 gp',
        armourClass: '10',
        weight: '0 lb.',
      });
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('not implemented');
    });
    
    test('delete should return success false', () => {
      // Act
      const result = armourRepository.delete(1);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('not implemented');
    });
  });
});