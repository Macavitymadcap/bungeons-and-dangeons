import { BaseRepository } from './base.repository';
import {
  ArmourDescriptionDto,
  ArmourEntity,
  ARMOURS,
} from '../entities/armour.entity';
import { DbOperationResult } from '../entities/base.entity';

/**
 * Repository for armour entities
 */
export class ArmourRepository extends BaseRepository<ArmourEntity> {
  constructor(dbPath?: string) {
    super('armour', dbPath);
  }

  protected initDb(): void {
    this.createTables();
    this.insertInitialData();
  }

  protected createTables(): void {
    this.dbContext.execute(`
      CREATE TABLE IF NOT EXISTS armour (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        cost TEXT NOT NULL,
        armourClass TEXT NOT NULL,
        strength TEXT NULL,
        stealth TEXT NULL,
        weight TEXT NOT NULL
      );
    `);
  }

  protected insertInitialData(): void {
    ARMOURS.forEach(armour => {
      const existingArmour = this.dbContext.queryOne<ArmourEntity>(
        'SELECT * FROM armour WHERE name = $name',
        { $name: armour.name },
      );

      if (!existingArmour) {
        this.create(armour);
      }
    });
  }

  /**
   * Create a new armour entity
   */
  create(entity: Omit<ArmourEntity, 'id'>): number {
    return this.dbContext.transaction(() => {
      const result = this.dbContext.queryOne<{ id: number }>(
        `INSERT INTO armour (
          name, description, type, cost, armourClass, stealth, strength, weight
        ) VALUES (
          $name, $description, $type, $cost, $armourClass, $stealth, $strength, $weight
        ) RETURNING id`,
        {
          $name: entity.name,
          $description: entity.description,
          $type: entity.type,
          $cost: entity.cost,
          $armourClass: entity.armourClass,
          $stealth: entity.stealth || null,
          $strength: entity.strength || null,
          $weight: entity.weight,
        },
      );

      return result?.id || 0;
    });
  }

  /**
   * Read an armour entity by ID
   */
  read(id: number): ArmourEntity | null {
    return this.dbContext.queryOne<ArmourEntity>(
      'SELECT * FROM armour WHERE id = $id',
      { $id: id },
    );
  }

  /**
   * Read all armour entities
   */
  readAll(): ArmourEntity[] {
    return this.dbContext.query<ArmourEntity>('SELECT * FROM armour');
  }

  /**
   * Find armour by name (partial match)
   */
  readByName(name: string): ArmourEntity[] {
    const armours = this.dbContext.query<ArmourEntity>(
      'SELECT * FROM armour WHERE name LIKE $name',
      { $name: `%${name}%` },
    );

    return armours || [];
  }

  /**
   * Get armour description by exact name
   */
  readDescriptionByArmourName(name: string): ArmourDescriptionDto | null {
    const description = this.dbContext.queryOne<ArmourDescriptionDto>(
      'SELECT description FROM armour WHERE name = $name',
      { $name: name },
    );

    return description || null;
  }

  /**
   * Update an armour entity
   */
  update(entity: ArmourEntity): DbOperationResult {
    return {
      success: false,
      message: 'Update operation not implemented for armour entities',
    };
  }

  /**
   * Delete an armour entity
   */
  delete(id: number): DbOperationResult {
    return {
      success: false,
      message: 'Delete operation not implemented for armour entities',
    };
  }
}
