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
import { ArmourService } from './armour.service';
import { ArmourRepository } from '../repositories/armour.repository';
import { ARMOURS } from '../entities/armour.entity';
import { DB_CONFIG } from '../config/db-config';
import { DbContext } from '../context/db-context';

describe('ArmourService', () => {
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
  
  describe('getAllArmour', () => {
    let armourService: ArmourService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourService = new ArmourService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      armourService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return all armour without IDs', () => {
      // Act
      const result = armourService.getAllArmour();
      
      // Assert
      expect(result.length).toBe(ARMOURS.length);
      expect(result[0]).not.toHaveProperty('id');
      expect(result.map(a => a.name)).toEqual(expect.arrayContaining(ARMOURS.map(a => a.name)));
    });
  });
  
  describe('getArmourById', () => {
    let armourService: ArmourService;
    let repository: ArmourRepository;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourService = new ArmourService(DB_CONFIG.inMemoryPath);
      repository = new ArmourRepository(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      armourService.close();
      repository.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return armour without ID when found', () => {
      // Arrange
      const allArmour = repository.readAll();
      const plateArmour = allArmour.find(a => a.name === 'plate');
      
      // Act
      const result = armourService.getArmourById(plateArmour!.id);
      
      // Assert
      expect(result).not.toBeNull();
      expect(result?.name).toBe('plate');
      expect(result?.type).toBe('Heavy');
      expect(result).not.toHaveProperty('id');
    });
    
    test('should return null when armour not found', () => {
      // Act
      const result = armourService.getArmourById(999);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('searchArmourByName', () => {
    let armourService: ArmourService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourService = new ArmourService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      armourService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return matching armour with exact name', () => {
      // Arrange
      const searchTerm = 'padded';
      
      // Act
      const result = armourService.searchArmourByName(searchTerm);
      
      // Assert
      expect(result).toBeArrayOfSize(1);
      expect(result[0].name).toBe('padded');
      expect(result[0]).not.toHaveProperty('id');
    });
    
    test('should return multiple matching armour with partial name', () => {
      // Arrange
      const searchTerm = 'leather';
      
      // Act
      const result = armourService.searchArmourByName(searchTerm);
      
      // Assert
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.some(a => a.name === 'leather')).toBeTrue();
      expect(result.some(a => a.name === 'studded leather')).toBeTrue();
      result.forEach(armour => {
        expect(armour).not.toHaveProperty('id');
      });
    });
    
    test('should return empty array for non-matching name', () => {
      // Arrange
      const searchTerm = 'nonexistent';
      
      // Act
      const result = armourService.searchArmourByName(searchTerm);
      
      // Assert
      expect(result).toBeArrayOfSize(0);
    });
  });
  
  describe('getArmourDescription', () => {
    let armourService: ArmourService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourService = new ArmourService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      armourService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should return description for existing armour', () => {
      // Arrange
      const armourName = 'plate';
      const expectedDescription = ARMOURS.find(a => a.name === armourName)?.description!;
      
      // Act
      const result = armourService.getArmourDescription(armourName) as string;
      
      // Assert
      expect(result).not.toBeNull();
      expect(result).toBe(expectedDescription);
    });
    
    test('should return null for non-existent armour', () => {
      // Arrange
      const armourName = 'nonexistent';
      
      // Act
      const result = armourService.getArmourDescription(armourName);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('getArmourByType', () => {
    let armourService: ArmourService;
    
    beforeEach(() => {
      (DbContext as any).instance = undefined;
      armourService = new ArmourService(DB_CONFIG.inMemoryPath);
    });
    
    afterEach(() => {
      armourService.close();
      (DbContext as any).instance = undefined;
    });
    
    test('should group armour correctly by type', () => {
      // Act
      const result = armourService.getArmourByType();
      
      // Assert
      expect(Object.keys(result)).toEqual(expect.arrayContaining(['Light', 'Medium', 'Heavy', 'Shield']));
      
      expect(result['Light'].every(a => a.type === 'Light')).toBeTrue();
      expect(result['Medium'].every(a => a.type === 'Medium')).toBeTrue();
      expect(result['Heavy'].every(a => a.type === 'Heavy')).toBeTrue();
      
      Object.values(result).flat().forEach(armour => {
        expect(armour).not.toHaveProperty('id');
      });
    });
    
    test('should have correct counts for each type', () => {
      // Arrange
      const lightCount = ARMOURS.filter(a => a.type === 'Light').length;
      const mediumCount = ARMOURS.filter(a => a.type === 'Medium').length;
      const heavyCount = ARMOURS.filter(a => a.type === 'Heavy').length;
      const shieldCount = ARMOURS.filter(a => a.type === 'Shield').length;
      
      // Act
      const result = armourService.getArmourByType();
      
      // Assert
      expect(result['Light'].length).toBe(lightCount);
      expect(result['Medium'].length).toBe(mediumCount);
      expect(result['Heavy'].length).toBe(heavyCount);
      expect(result['Shield'].length).toBe(shieldCount);
    });
  });
  
  describe('close', () => {
    test('should close the repository', () => {
      // Arrange
      (DbContext as any).instance = undefined;
      const mockRepository = {
        close: mock(() => {})
      };
      
      const armourService = new ArmourService(DB_CONFIG.inMemoryPath);
      (armourService as any).repository = mockRepository;
      
      // Act
      armourService.close();
      
      // Assert
      expect(mockRepository.close).toHaveBeenCalled();
    });
  });
});
