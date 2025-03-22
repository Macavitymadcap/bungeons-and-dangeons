import { BaseRepository } from './base.repository';
import {
  WeaponDatabaseRow,
  WeaponEntity,
  WeaponPropertyEntity,
  WeaponPropertyForWeapon,
  WEAPONS,
  WEAPON_PROPERTIES,
} from '../entities/weapon.entity';
import { DbOperationResult } from '../entities/base.entity';
import { WeaponPropertyType } from '../../model/weapon';

/**
 * Repository for weapon entities
 */
export class WeaponRepository extends BaseRepository<WeaponEntity> {
  constructor(dbPath?: string) {
    super('weapons', dbPath);
  }

  protected initDb(): void {
    this.createTables();
    this.insertInitialData();
  }

  protected createTables(): void {
    this.dbContext.execute(`
      CREATE TABLE IF NOT EXISTS weapons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        cost TEXT NOT NULL,
        damageDie TEXT NULL,
        damageType TEXT NULL,
        weight TEXT NULL,
        rangeNormal INTEGER NULL,
        rangeLong INTEGER NULL,
        versatileDamageDie TEXT NULL,
        UNIQUE(name)
      );    
    `);

    this.dbContext.execute(`
      CREATE TABLE IF NOT EXISTS weapon_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        UNIQUE(name)
      );
    `);

    this.dbContext.execute(`
      CREATE TABLE IF NOT EXISTS weapon_property_relations (
        weapon_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        PRIMARY KEY (weapon_id, property_id),
        FOREIGN KEY (weapon_id) REFERENCES weapons(id),
        FOREIGN KEY (property_id) REFERENCES weapon_properties(id)
      );
    `);
  }

  protected insertInitialData(): void {
    // Insert weapon properties first
    WEAPON_PROPERTIES.forEach(property => {
      const existingProperty = this.dbContext.queryOne<WeaponPropertyEntity>(
        'SELECT * FROM weapon_properties WHERE name = $name',
        { $name: property.name },
      );

      if (!existingProperty) {
        this.dbContext.queryOne(
          `INSERT INTO weapon_properties (name, description) 
           VALUES ($name, $description)`,
          {
            $name: property.name,
            $description: property.description,
          },
        );
      }
    });

    // Then insert weapons
    WEAPONS.forEach(weapon => {
      const existingWeapon = this.dbContext.queryOne<WeaponEntity>(
        'SELECT * FROM weapons WHERE name = $name',
        { $name: weapon.name },
      );

      if (!existingWeapon) {
        this.create(weapon);
      }
    });
  }

  /**
   * Create a new weapon entity
   */
  create(weapon: Omit<WeaponEntity, 'id'>): number {
    return this.dbContext.transaction(() => {
      const result = this.dbContext.queryOne<{ id: number }>(
        `INSERT OR IGNORE INTO weapons (
          name, type, cost, damageDie, damageType, weight, 
          rangeNormal, rangeLong, versatileDamageDie
        ) VALUES (
          $name, $type, $cost, $damageDie, $damageType, $weight, 
          $rangeNormal, $rangeLong, $versatileDamageDie
        ) RETURNING id`,
        {
          $name: weapon.name,
          $type: weapon.type,
          $cost: weapon.cost,
          $damageDie: weapon.damageDie || null,
          $damageType: weapon.damageType || null,
          $weight: weapon.weight || null,
          $rangeNormal: weapon.range?.normal || null,
          $rangeLong: weapon.range?.long || null,
          $versatileDamageDie: weapon.versatileDamageDie || null,
        },
      );

      if (result?.id) {
        // Add weapon properties
        for (const property of weapon.properties) {
          const propertyId = this.ensurePropertyExists(property);
          this.createWeaponPropertyRelation(result.id, propertyId);
        }
        return result.id;
      }
      return 0;
    });
  }

  /**
   * Ensure a weapon property exists in the database
   */
  private ensurePropertyExists(name: WeaponPropertyType): number {
    const existingProperty = this.dbContext.queryOne<{ id: number }>(
      'SELECT id FROM weapon_properties WHERE name = $name',
      { $name: name },
    );

    if (existingProperty) {
      return existingProperty.id;
    }

    const description = WEAPON_PROPERTIES.find(
      weaponProperty => weaponProperty.name === name,
    )?.description;

    if (!description) {
      throw new Error(`No description found for weapon property: ${name}`);
    }

    const newProperty = this.dbContext.queryOne<{ id: number }>(
      `INSERT OR IGNORE INTO weapon_properties (name, description)
       VALUES ($name, $description) RETURNING id`,
      { $name: name, $description: description },
    );

    return newProperty?.id || 0;
  }

  /**
   * Create weapon-property relationship
   */
  private createWeaponPropertyRelation(
    weaponId: number,
    propertyId: number,
  ): void {
    this.dbContext.queryOne(
      `INSERT OR IGNORE INTO weapon_property_relations (weapon_id, property_id)
       VALUES ($weapon_id, $property_id)`,
      { $weapon_id: weaponId, $property_id: propertyId },
    );
  }

  /**
   * Read a weapon entity by ID
   */
  read(id: number): WeaponEntity | null {
    const weaponRow = this.dbContext.queryOne<WeaponDatabaseRow>(
      'SELECT * FROM weapons WHERE id = $id',
      { $id: id },
    );

    if (!weaponRow) return null;

    const properties = this.getWeaponPropertiesForWeapon(id);
    return this.combineWeaponRowWithProperties(weaponRow, properties);
  }

  /**
   * Read all weapon entities
   */
  readAll(): WeaponEntity[] {
    const weaponRows = this.dbContext.query<WeaponDatabaseRow>(
      'SELECT * FROM weapons',
    );

    return weaponRows.map(weaponRow => {
      const properties = this.getWeaponPropertiesForWeapon(weaponRow.id);
      return this.combineWeaponRowWithProperties(weaponRow, properties);
    });
  }

  /**
   * Find weapons by name (partial match)
   */
  readByName(name: string): WeaponEntity[] {
    const weaponRows = this.dbContext.query<WeaponDatabaseRow>(
      'SELECT * FROM weapons WHERE name LIKE $name',
      { $name: `%${name}%` },
    );

    const weaponsWithProperties = weaponRows.map(weaponRow => {
      const properties = this.getWeaponPropertiesForWeapon(weaponRow.id);
      return this.combineWeaponRowWithProperties(weaponRow, properties);
    });

    return weaponsWithProperties || [];
  }

  /**
   * Get properties for a weapon
   */
  private getWeaponPropertiesForWeapon(
    weaponId: number,
  ): WeaponPropertyForWeapon[] {
    const properties = this.dbContext.query<WeaponPropertyForWeapon>(
      `SELECT wp.name
       FROM weapon_properties wp
       JOIN weapon_property_relations wpr ON wp.id = wpr.property_id
       WHERE wpr.weapon_id = $weaponId`,
      { $weaponId: weaponId },
    );

    return properties || [];
  }

  /**
   * Combine database row with properties
   */
  private combineWeaponRowWithProperties(
    weaponRow: WeaponDatabaseRow,
    properties: WeaponPropertyForWeapon[],
  ): WeaponEntity {
    const weaponEntity = {
      id: weaponRow.id,
      name: weaponRow.name,
      type: weaponRow.type,
      cost: weaponRow.cost,
      damageDie: weaponRow.damageDie,
      damageType: weaponRow.damageType,
      weight: weaponRow.weight,
      versatileDamageDie: weaponRow.versatileDamageDie,
      properties: properties.map(p => p.name),
    } as WeaponEntity;

    if (weaponRow.rangeNormal != null && weaponRow.rangeLong != null) {
      weaponEntity.range = {
        normal: weaponRow.rangeNormal,
        long: weaponRow.rangeLong,
      };
    }

    return weaponEntity;
  }

  /**
   * Read a weapon property by ID
   */
  readWeaponProperty(id: number): WeaponPropertyEntity | null {
    return this.dbContext.queryOne<WeaponPropertyEntity>(
      'SELECT * FROM weapon_properties WHERE id = $id',
      { $id: id },
    );
  }

  /**
   * Read all weapon properties
   */
  readAllWeaponProperties(): WeaponPropertyEntity[] {
    return this.dbContext.query<WeaponPropertyEntity>(
      'SELECT * FROM weapon_properties',
    );
  }

  /**
   * Find weapon properties by name (partial match)
   */
  readWeaponPropertyByName(name: string): WeaponPropertyEntity[] {
    const weaponProperties = this.dbContext.query<WeaponPropertyEntity>(
      'SELECT * FROM weapon_properties WHERE name LIKE $name',
      { $name: `%${name}%` },
    );

    return weaponProperties || [];
  }

  /**
   * Update a weapon entity
   */
  update(entity: WeaponEntity): DbOperationResult {
    return {
      success: false,
      message: 'Update operation not implemented for weapon entities',
    };
  }

  /**
   * Delete a weapon entity
   */
  delete(id: number): DbOperationResult {
    return {
      success: false,
      message: 'Delete operation not implemented for weapon entities',
    };
  }
}
