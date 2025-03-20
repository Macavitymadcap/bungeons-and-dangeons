import { BaseEntity, BaseRepository } from '../base-repository/base-repository';
import {
  ArmourDescription,
  ArmourEntity,
  ARMOURS,
} from './armour-repository.model';

export class ArmourRepository extends BaseRepository<ArmourEntity> {
  protected initDb(): void {
    this.createTables();
    this.insertInitialData();
  }

  protected createTables(): void {
    this.db.exec(`
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
      const existingArmour = this.prepareAndExecuteOne(
        'SELECT * FROM armour WHERE name = $name',
        { $name: armour.name },
      );
      if (!existingArmour) {
        this.create(armour);
      }
    });
  }

  create(entity: Omit<ArmourEntity, 'id'>): number {
    return this.executeInTransaction(() => {
      const result = this.prepareAndExecuteOne(
        `INSERT OR IGNORE INTO armour (
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
      ) as BaseEntity;

      return result.id;
    });
  }

  read(id: number): ArmourEntity | null {
    return this.prepareAndExecuteOne('SELECT * FROM armour WHERE id = $id', {
      $id: id,
    }) as ArmourEntity | null;
  }

  readAll(): ArmourEntity[] {
    return this.prepareAndExecute('SELECT * FROM armour') as ArmourEntity[];
  }

  readByName(name: string): ArmourEntity[] {
    const armours = this.prepareAndExecute(
      'SELECT * FROM armour WHERE name LIKE $name',
      { $name: `%${name}%` },
    ) as ArmourEntity[];

    return armours || [];
  }

  readDescriptionByArmourName(name: string): ArmourDescription | null {
    const description = this.prepareAndExecuteOne(
      'SELECT description FROM armour WHERE name = $name',
      { $name: name },
    ) as ArmourDescription | undefined;

    return description || null;
  }

  update(entity: ArmourEntity): void {
    console.warn('update method not implemented');
  }

  delete(id: number): void {
    console.warn('delete method not implemented');
  }
}
