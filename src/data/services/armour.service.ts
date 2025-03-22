import { ArmourRepository } from '../repositories/armour.repository';
import { ArmourEntity, ArmourDescriptionDto } from '../entities/armour.entity';
import { Armour } from '../../model/armour';

/**
 * Service for armour-related business logic
 */
export class ArmourService {
  private repository: ArmourRepository;

  constructor(dbPath?: string) {
    this.repository = new ArmourRepository(dbPath);
  }

  /**
   * Get all armour data for display
   */
  public getAllArmour(): Armour[] {
    return this.repository.readAll().map(({ id, ...armour }) => ({
      ...armour,
    }));
  }

  /**
   * Get armour by ID
   */
  public getArmourById(id: number): Armour | null {
    const entity = this.repository.read(id);
    if (!entity) return null;

    const { id: _, ...armour } = entity;
    return armour;
  }

  /**
   * Search armour by name
   */
  public searchArmourByName(name: string): Armour[] {
    return this.repository.readByName(name).map(({ id, ...armour }) => ({
      ...armour,
    }));
  }

  /**
   * Get armour description
   */
  public getArmourDescription(name: string): string | null {
    const description = this.repository.readDescriptionByArmourName(name);
    return description?.description || null;
  }

  /**
   * Get armour grouped by type
   */
  public getArmourByType(): Record<string, Armour[]> {
    const allArmour = this.getAllArmour();
    const groupedByType = allArmour.reduce(
      (acc, armour) => {
        const type = armour.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(armour);
        return acc;
      },
      {} as Record<string, Armour[]>,
    );

    return groupedByType;
  }

  /**
   * Close the database connection
   */
  public close(): void {
    this.repository.close();
  }
}
