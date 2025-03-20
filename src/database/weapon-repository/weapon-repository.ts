import { WeaponPropertyType } from '../../model/weapon';
import { BaseRepository, BaseEntity } from '../base-repository/base-repository';
import {
  WeaponEntity,
  WEAPONS,
  WeaponPropertyEntity,
  WEAPON_PROPERTIES,
  WeaponDatabaseRow,
  WeaponPropertyForWeapon,
} from './weapon-repository.model';

export class WeaponRepository extends BaseRepository<WeaponEntity> {
  protected initDb(): void {
    this.createTables();
    this.insertInitialData();
  }

  protected createTables(): void {
    this.db.exec(`
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

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS weapon_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        UNIQUE(name)
      );
    `);

    this.db.exec(`
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
    WEAPONS.forEach(weapon => {
      const exisitingWeapon = this.prepareAndExecuteOne(
        'SELECT * FROM weapons WHERE name = $name',
        { $name: weapon.name },
      );
      if (!exisitingWeapon) {
        this.create(weapon);
      }
    });
  }

  create(weapon: Omit<WeaponEntity, 'id'>): number {
    return this.executeInTransaction(() => {
      const result = this.prepareAndExecuteOne(
        `INSERT OR IGNORE INTO weapons (
          name, type, cost, damageDie, damageType, weight, rangeNormal, rangeLong, versatileDamageDie
        ) VALUES (
          $name, $type, $cost, $damageDie, $damageType, $weight, $rangeNormal, $rangeLong, $versatileDamageDie
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
      ) as BaseEntity;

      for (const property of weapon.properties) {
        const propertyId = this.ensurePropertyExists(property);
        this.createWeaponPropertyRelation(result.id, propertyId);
      }

      return result.id;
    });
  }

  private ensurePropertyExists(name: WeaponPropertyType): number {
    const existingProperty = this.prepareAndExecuteOne(
      'SELECT id FROM weapon_properties WHERE name = $name',
      { $name: name },
    ) as BaseEntity | null;

    if (existingProperty) {
      return existingProperty.id;
    }

    const description = WEAPON_PROPERTIES.find(
      weaponProperty => weaponProperty.name === name,
    )?.description;

    if (!description) {
      throw new Error(`No description found weapon property: ${name}`);
    }

    const newProperty = this.prepareAndExecuteOne(
      `INSERT OR IGNORE INTO weapon_properties (
        name, description
      ) VALUES (
        $name, $description
      ) RETURNING id`,
      { $name: name, $description: description },
    ) as BaseEntity;

    return newProperty.id;
  }

  private createWeaponPropertyRelation(
    weaponId: number,
    propertyId: number,
  ): void {
    this.prepareAndExecuteOne(
      `INSERT OR IGNORE INTO weapon_property_relations (
        weapon_id, property_id
      ) VALUES (
        $weapon_id, $property_id
      )`,
      { $weapon_id: weaponId, $property_id: propertyId },
    );
  }

  read(id: number): WeaponEntity | null {
    const weaponRow = this.prepareAndExecuteOne(
      'SELECT * FROM weapons WHERE id = $id',
      { $id: id },
    ) as WeaponDatabaseRow | null;

    if (!weaponRow) return null;

    const properties = this.getWeaponPropertiesForWeapon(id);

    return this.combineWeaponRowWithProperties(weaponRow, properties);
  }

  readAll(): WeaponEntity[] {
    const weaponRows = this.prepareAndExecute(
      'SELECT * FROM weapons',
    ) as WeaponDatabaseRow[];

    return weaponRows.map(weaponRow => {
      const properties = this.getWeaponPropertiesForWeapon(weaponRow.id);

      return this.combineWeaponRowWithProperties(weaponRow, properties);
    });
  }

  readByName(name: string): WeaponEntity[] {
    const weaponRows = this.prepareAndExecute(
      'SELECT * FROM weapons WHERE name LIKE $name',
      { $name: `%${name}%` },
    ) as WeaponDatabaseRow[];

    const weaponsWithProperties = weaponRows.map(weaponRow => {
      const properties = this.getWeaponPropertiesForWeapon(weaponRow.id);
      return this.combineWeaponRowWithProperties(weaponRow, properties);
    });

    return weaponsWithProperties || [];
  }

  private getWeaponPropertiesForWeapon(
    weaponId: number,
  ): WeaponPropertyForWeapon[] {
    const properties = this.prepareAndExecute(
      `SELECT wp.name
      FROM weapon_properties wp
      JOIN weapon_property_relations wpr ON wp.id = wpr.property_id
      WHERE wpr.weapon_id = $weaponId`,
      { $weaponId: weaponId },
    ) as WeaponPropertyForWeapon[];

    return properties || [];
  }

  private combineWeaponRowWithProperties(
    weaponRow: WeaponDatabaseRow,
    properties: WeaponPropertyForWeapon[],
  ): WeaponEntity {
    const weaponEntity = {
      id: weaponRow.id,
      type: weaponRow.type,
      name: weaponRow.name,
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

  readWeaponProperty(id: number): WeaponPropertyEntity | null {
    return this.prepareAndExecuteOne(
      'SELECT * FROM weapon_properties WHERE id = $id',
      { $id: id },
    ) as WeaponPropertyEntity | null;
  }

  readAllWeaponProperties(): WeaponPropertyEntity[] {
    return this.prepareAndExecute(
      'SELECT * FROM weapon_properties',
    ) as WeaponPropertyEntity[];
  }

  readWeaponPropertyByName(name: string): WeaponPropertyEntity[] {
    const weaponProperies = this.prepareAndExecute(
      'SELECT * FROM weapon_properties WHERE name LIKE $name',
      { $name: `%${name}%` },
    ) as WeaponPropertyEntity[];

    return weaponProperies || [];
  }

  update(entity: WeaponEntity): void {
    console.warn('update method not implemented');
  }

  delete(id: number): void {
    console.warn('delete method not implemented');
  }
}
