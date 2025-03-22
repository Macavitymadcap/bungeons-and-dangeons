// Export configuration
export * from './config/db-config';

// Export context
export * from './context/db-context';

// Export entity types
export * from './entities/base.entity';
export * from './entities/armour.entity';
export * from './entities/weapon.entity';

// Export repositories
export * from './repositories/base.repository';
export * from './repositories/armour.repository';
export * from './repositories/weapon.repository';

// Export services
export * from './services/armour.service';
export * from './services/weapon.service';
export * from './services/shared-data.service';

// Create and export service instances
import { ArmourService } from './services/armour.service';
import { WeaponService } from './services/weapon.service';
import { SharedDataService } from './services/shared-data.service';
import { DB_CONFIG } from './config/db-config';

// Create and export service instances for application use
export const armourService = new ArmourService(DB_CONFIG.path);
export const weaponService = new WeaponService(DB_CONFIG.path);
export const sharedDataService = new SharedDataService(DB_CONFIG.path);
