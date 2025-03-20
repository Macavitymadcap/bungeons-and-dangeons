import { ArmourRepository } from './armour-repositroy/armour-repository';
import { WeaponRepository } from './weapon-repository/weapon-repository';

const DATABASE_PATH = 'src/database/database.db';

export const armourRepository = new ArmourRepository(DATABASE_PATH);
export const weaponRepository = new WeaponRepository(DATABASE_PATH);
