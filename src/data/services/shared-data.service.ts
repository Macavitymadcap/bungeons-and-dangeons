import { ArmourService } from './armour.service';
import { WeaponService } from './weapon.service';
import { Armour } from '../../model/armour';
import { Weapon, WeaponTableRow } from '../../model/weapon';

/**
 * Service that coordinates operations across multiple repositories
 */
export class SharedDataService {
  private armourService: ArmourService;
  private weaponService: WeaponService;
  
  constructor(dbPath?: string) {
    this.armourService = new ArmourService(dbPath);
    this.weaponService = new WeaponService(dbPath);
  }
  
  /**
   * Search for equipment by name (weapons and armour)
   */
  public searchEquipmentByName(name: string): {
    armour: Armour[];
    weapons: Weapon[];
  } {
    const armour = this.armourService.searchArmourByName(name);
    const weapons = this.weaponService.searchWeaponsByName(name);
    
    return { armour, weapons };
  }
  
  /**
   * Get data for tabs view
   */
  public getTabData(tab: string): {
    armourData?: Armour[];
    weaponData?: WeaponTableRow[];
  } {
    switch (tab.toLowerCase()) {
      case 'armour':
        return {
          armourData: this.armourService.getAllArmour(),
        };
      case 'weapons':
        return {
          weaponData: this.weaponService.getAllWeaponsForTable(),
        };
      default:
        return {};
    }
  }
  
  /**
   * Get all equipment grouped by type
   */
  public getAllEquipmentByType(): {
    armourByType: Record<string, Armour[]>;
    weaponsByType: Record<string, Weapon[]>;
  } {
    const armourByType = this.armourService.getArmourByType();
    const weaponsByType = this.weaponService.getWeaponsByType();
    
    return {
      armourByType,
      weaponsByType
    };
  }
  
  /**
   * Get all equipment costs for budget planning
   */
  public getEquipmentCosts(): {
    armourCosts: { name: string; cost: string }[];
    weaponCosts: { name: string; cost: string }[];
  } {
    const armourCosts = this.armourService.getAllArmour()
      .map(a => ({ name: a.name, cost: a.cost }));
      
    const weaponCosts = this.weaponService.getAllWeapons()
      .map(w => ({ name: w.name, cost: w.cost }));
      
    return {
      armourCosts,
      weaponCosts
    };
  }
  
  /**
   * Close all database connections
   */
  public close(): void {
    this.armourService.close();
    this.weaponService.close();
  }
}
