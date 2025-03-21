import { WeaponRepository } from '../repositories/weapon.repository';
import { WeaponEntity, WeaponPropertyEntity } from '../entities/weapon.entity';
import { Weapon, WeaponProperty, WeaponTableRow, convertWeaponToWeaponTableRow } from '../../model/weapon';

/**
 * Service for weapon-related business logic
 */
export class WeaponService {
  private repository: WeaponRepository;
  
  constructor(dbPath?: string) {
    this.repository = new WeaponRepository(dbPath);
  }
  
  /**
   * Get all weapons
   */
  public getAllWeapons(): Weapon[] {
    return this.repository.readAll().map(({ id, ...weapon }) => ({
      ...weapon
    }));
  }
  
  /**
   * Get all weapons formatted for display in tables
   */
  public getAllWeaponsForTable(): WeaponTableRow[] {
    return this.getAllWeapons().map(weapon => 
      convertWeaponToWeaponTableRow(weapon)
    );
  }
  
  /**
   * Get weapon by ID
   */
  public getWeaponById(id: number): Weapon | null {
    const entity = this.repository.read(id);
    if (!entity) return null;
    
    // Remove the ID from the returned object
    const { id: _, ...weapon } = entity;
    return weapon;
  }
  
  /**
   * Search weapons by name
   */
  public searchWeaponsByName(name: string): Weapon[] {
    return this.repository.readByName(name).map(({ id, ...weapon }) => ({
      ...weapon
    }));
  }
  
  /**
   * Get all weapon properties
   */
  public getAllWeaponProperties(): WeaponProperty[] {
    return this.repository.readAllWeaponProperties().map(({ id, ...property }) => ({
      ...property
    }));
  }
  
  /**
   * Get a weapon property by name
   */
  public getWeaponPropertyByName(name: string): WeaponProperty | null {
    const properties = this.repository.readWeaponPropertyByName(name);
    if (!properties || properties.length === 0) return null;
    
    const { id, ...property } = properties[0];
    return property;
  }
  
  /**
   * Get weapons grouped by type
   */
  public getWeaponsByType(): Record<string, Weapon[]> {
    const allWeapons = this.getAllWeapons();
    const groupedByType = allWeapons.reduce((acc, weapon) => {
      const type = weapon.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(weapon);
      return acc;
    }, {} as Record<string, Weapon[]>);
    
    return groupedByType;
  }
  
  /**
   * Get all simple weapons
   */
  public getSimpleWeapons(): Weapon[] {
    return this.getAllWeapons().filter(
      weapon => weapon.type.includes('Simple')
    );
  }
  
  /**
   * Get all martial weapons
   */
  public getMartialWeapons(): Weapon[] {
    return this.getAllWeapons().filter(
      weapon => weapon.type.includes('Martial')
    );
  }
  
  /**
   * Get all melee weapons
   */
  public getMeleeWeapons(): Weapon[] {
    return this.getAllWeapons().filter(
      weapon => weapon.type.includes('Melee')
    );
  }
  
  /**
   * Get all ranged weapons
   */
  public getRangedWeapons(): Weapon[] {
    return this.getAllWeapons().filter(
      weapon => weapon.type.includes('Ranged')
    );
  }
  
  /**
   * Get weapons by property type
   */
  public getWeaponsByProperty(propertyName: string): Weapon[] {
    return this.getAllWeapons().filter(
      weapon => weapon.properties.includes(propertyName as any)
    );
  }
  
  /**
   * Close the database connection
   */
  public close(): void {
    this.repository.close();
  }
}