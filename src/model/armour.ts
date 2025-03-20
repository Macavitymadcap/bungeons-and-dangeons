import { Cost, Weight } from './measures';

const ARMOUR_TYPES = {
  LIGHT: 'Light',
  MEDIUM: 'Medium',
  HEAVY: 'Heavy',
  SHIELD: 'Shield',
} as const;

export type ArmourType = (typeof ARMOUR_TYPES)[keyof typeof ARMOUR_TYPES];

type Stealth = 'Disadvantage';

export interface Armour {
  name: string;
  description: string;
  type: ArmourType;
  cost: Cost;
  armourClass: string;
  strength?: string;
  stealth?: Stealth;
  weight: Weight;
}
