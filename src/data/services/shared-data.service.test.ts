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
import { SharedDataService } from './shared-data.service';
import { Armour } from '../../model/armour';
import { Weapon, WeaponTableRow } from '../../model/weapon';
import { DB_CONFIG } from '../config/db-config';
import { DbContext } from '../context/db-context';

describe('SharedDataService', () => {
  let sharedDataService: SharedDataService;
  let mockArmourService: { 
    getAllArmour: () => Armour[];
    searchArmourByName: (name: string) => Armour[];
    getArmourByType: () => Record<string, Armour[]>;
    close: () => void;
  };
  let mockWeaponService: {
    getAllWeapons: () => Weapon[];
    getAllWeaponsForTable: () => WeaponTableRow[];
    searchWeaponsByName: (name: string) => Weapon[];
    getWeaponsByType: () => Record<string, Weapon[]>;
    close: () => void;
  };

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
  
  beforeEach(() => {
    const mockArmour: Armour[] = [
      {
        name: 'leather',
        description: 'Leather armor description',
        type: 'Light',
        cost: '10 gp',
        armourClass: '11 + Dex modifier',
        weight: '10 lb.'
      },
      {
        name: 'chain mail',
        description: 'Chain mail description',
        type: 'Heavy',
        cost: '75 gp',
        armourClass: '16',
        strength: 'Str 13',
        stealth: 'Disadvantage',
        weight: '55 lb.'
      }
    ];
    
    const mockWeapons: Weapon[] = [
      {
        name: 'Longsword',
        type: 'Martial Melee',
        cost: '15 gp',
        damageDie: '1d8',
        damageType: 'slashing',
        weight: '3 lb.',
        versatileDamageDie: '1d10',
        properties: ['versatile']
      },
      {
        name: 'Shortbow',
        type: 'Simple Ranged',
        cost: '25 gp',
        damageDie: '1d6',
        damageType: 'piercing',
        weight: '2 lb.',
        range: { normal: 80, long: 320 },
        properties: ['ammunition', 'range']
      }
    ];
    
    const mockWeaponTableRows: WeaponTableRow[] = [
      {
        name: 'Longsword',
        type: 'Martial Melee',
        cost: '15 gp',
        weight: '3 lb.',
        damage: '1d8 slashing damage',
        properties: ['versatile (1d10)']
      },
      {
        name: 'Shortbow',
        type: 'Simple Ranged',
        cost: '25 gp',
        weight: '2 lb.',
        damage: '1d6 piercing damage',
        properties: ['ammunition (range 80/320)']
      }
    ];
    
    mockArmourService = {
      getAllArmour: mock(() => [...mockArmour]),
      searchArmourByName: mock((name: string) => 
        mockArmour.filter(a => a.name.includes(name))
      ),
      getArmourByType: mock(() => ({
        'Light': [mockArmour[0]],
        'Heavy': [mockArmour[1]]
      })),
      close: mock(() => {})
    };
    
    mockWeaponService = {
      getAllWeapons: mock(() => [...mockWeapons]),
      getAllWeaponsForTable: mock(() => [...mockWeaponTableRows]),
      searchWeaponsByName: mock((name: string) => 
        mockWeapons.filter(w => w.name.includes(name))
      ),
      getWeaponsByType: mock(() => ({
        'Martial Melee': [mockWeapons[0]],
        'Simple Ranged': [mockWeapons[1]]
      })),
      close: mock(() => {})
    };
    
    sharedDataService = new SharedDataService(DB_CONFIG.inMemoryPath);
    (sharedDataService as any).armourService = mockArmourService;
    (sharedDataService as any).weaponService = mockWeaponService;
  });
  
  afterEach(() => {
    try {
      sharedDataService.close();
    } catch (error) {
      // Ignore errors if already closed
    }
    (DbContext as any).instance = undefined;
  });
  
  describe('searchEquipmentByName', () => {
    test('should return matching armour and weapons for the given name', () => {
      // Arrange
      const searchTerm = 'sword';
      
      // Act
      const result = sharedDataService.searchEquipmentByName(searchTerm);
      
      // Assert
      expect(mockArmourService.searchArmourByName).toHaveBeenCalledWith(searchTerm);
      expect(mockWeaponService.searchWeaponsByName).toHaveBeenCalledWith(searchTerm);
      expect(result).toHaveProperty('armour');
      expect(result).toHaveProperty('weapons');
    });
    
    test('should return empty arrays when no matches are found', () => {
      // Arrange
      const searchTerm = 'nonexistent';
      (mockArmourService.searchArmourByName as any).mockReturnValue([]);
      (mockWeaponService.searchWeaponsByName as any).mockReturnValue([]);
      
      // Act
      const result = sharedDataService.searchEquipmentByName(searchTerm);
      
      // Assert
      expect(result.armour).toBeArrayOfSize(0);
      expect(result.weapons).toBeArrayOfSize(0);
    });
  });
  
  describe('getTabData', () => {
    test('should return armour data when tab is "armour"', () => {
      // Act
      const result = sharedDataService.getTabData('armour');
      
      // Assert
      expect(mockArmourService.getAllArmour).toHaveBeenCalled();
      expect(result).toHaveProperty('armourData');
      expect(result.armourData).toBeDefined();
      expect(result.weaponData).toBeUndefined();
    });
    
    test('should return weapon data when tab is "weapons"', () => {
      // Act
      const result = sharedDataService.getTabData('weapons');
      
      // Assert
      expect(mockWeaponService.getAllWeaponsForTable).toHaveBeenCalled();
      expect(result).toHaveProperty('weaponData');
      expect(result.weaponData).toBeDefined();
      expect(result.armourData).toBeUndefined();
    });
    
    test('should return empty object for unknown tab', () => {
      // Act
      const result = sharedDataService.getTabData('unknown');
      
      // Assert
      expect(result).toEqual({});
    });
    
    test('should be case insensitive for tab names', () => {
      // Act
      const result = sharedDataService.getTabData('ArMoUr');
      
      // Assert
      expect(mockArmourService.getAllArmour).toHaveBeenCalled();
      expect(result).toHaveProperty('armourData');
    });
  });
  
  describe('getAllEquipmentByType', () => {
    test('should return both armour and weapons grouped by type', () => {
      // Act
      const result = sharedDataService.getAllEquipmentByType();
      
      // Assert
      expect(mockArmourService.getArmourByType).toHaveBeenCalled();
      expect(mockWeaponService.getWeaponsByType).toHaveBeenCalled();
      expect(result).toHaveProperty('armourByType');
      expect(result).toHaveProperty('weaponsByType');
      
      expect(result.armourByType).toHaveProperty('Light');
      expect(result.armourByType).toHaveProperty('Heavy');
      expect(result.weaponsByType).toHaveProperty('Martial Melee');
      expect(result.weaponsByType).toHaveProperty('Simple Ranged');
    });
  });
  
  describe('getEquipmentCosts', () => {
    test('should return cost information for all equipment', () => {
      // Act
      const result = sharedDataService.getEquipmentCosts();
      
      // Assert
      expect(mockArmourService.getAllArmour).toHaveBeenCalled();
      expect(mockWeaponService.getAllWeapons).toHaveBeenCalled();
      expect(result).toHaveProperty('armourCosts');
      expect(result).toHaveProperty('weaponCosts');
      
      expect(result.armourCosts).toBeArrayOfSize(2);
      expect(result.weaponCosts).toBeArrayOfSize(2);
      
      expect(result.armourCosts[0]).toHaveProperty('name');
      expect(result.armourCosts[0]).toHaveProperty('cost');
      expect(result.weaponCosts[0]).toHaveProperty('name');
      expect(result.weaponCosts[0]).toHaveProperty('cost');
    });
  });
  
  describe('close', () => {
    test('should close both services', () => {
      // Act
      sharedDataService.close();
      
      // Assert
      expect(mockArmourService.close).toHaveBeenCalled();
      expect(mockWeaponService.close).toHaveBeenCalled();
    });
  });
});