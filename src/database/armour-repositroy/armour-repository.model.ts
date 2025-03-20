import { BaseEntity } from '../base-repository/base-repository';
import { Armour } from '../../model/armour';

export interface ArmourEntity extends Armour, BaseEntity {}

export interface ArmourDescription {
  description: string;
}

export const ARMOURS: Armour[] = [
  {
    name: 'padded',
    description:
      'Padded armour consists of quilted layers of cloth and batting.',
    type: 'Light',
    cost: '5 gp',
    armourClass: '11 + Dex modifier',
    stealth: 'Disadvantage',
    weight: '8 lb.',
  },
  {
    name: 'leather',
    description:
      'The breastplate and shoulder protectors of this armour are made of leather that has been stiffened by being boiled in oil. The rest of the armour is made of softer and more flexible materials.',
    type: 'Light',
    cost: '10 gp',
    armourClass: '11 + Dex modifier',
    weight: '10 lb.',
  },
  {
    name: 'studded leather',
    description:
      'Made from tough but flexible leather, studded leather is reinforced with close-set rivets or spikes.',
    type: 'Light',
    cost: '45 gp',
    armourClass: '12 + Dex modifier',
    weight: '13 lb.',
  },
  {
    name: 'hide',
    description:
      'This crude armour consists of thick furs and pelts. It is commonly worn by barbarian tribes, evil humanoids, and other folk who lack access to the tools and materials needed to create better armour.',
    type: 'Medium',
    cost: '10 gp',
    armourClass: '12 + Dex modifier (max 2)',
    weight: '12 lb.',
  },
  {
    name: 'chain shirt',
    description:
      "Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. This armour offers modest protection to the wearer's upper body and allows the sound of the rings rubbing against one another to be muffled by outer layers",
    type: 'Medium',
    cost: '50 gp',
    armourClass: '13 + Dex modifier (max 2)',
    weight: '20 lb.',
  },
  {
    name: 'scale mail',
    description:
      'be muffled by outer layers. Scale Mail. This armour consists of a coat and leggings (and perhaps a separate skirt) of leather covered with overlapping pieces of metal, much like the scales of a fish. The suit includes gauntlets.',
    type: 'Medium',
    cost: '50 gp',
    armourClass: '14 + Dex modifier (max 2)',
    stealth: 'Disadvantage',
    weight: '45 lb.',
  },
  {
    name: 'breastplate',
    description:
      "This armour consists of a fitted metal chest piece worn with supple leather. Although it leaves the legs and arms relatively unprotected, this armour provides good protection for the wearer's vital organs while leaving the wearer relatively unencumbered.",
    type: 'Medium',
    cost: '400 gp',
    armourClass: '14 + Dex modifier (max 2)',
    weight: '20 lb.',
  },
  {
    name: 'half plate',
    description:
      "Half plate consists of shaped metal plates that cover most of the wearer's body. It does not include leg protection beyond simple greaves that are attached with leather straps.",
    type: 'Medium',
    cost: '750 gp',
    armourClass: '15 + Dex modifier (max 2)',
    stealth: 'Disadvantage',
    weight: '45 lb.',
  },
  {
    name: 'ring mail',
    description:
      "This armour is leather armour with heavy rings sewn into it. The rings help reinforce the armour against blows from swords and axes. Ring mail is inferior to chain mail, and it's usually worn only by those who can't afford better armour.",
    type: 'Heavy',
    cost: '30 gp',
    armourClass: '14',
    stealth: 'Disadvantage',
    weight: '40 lb.',
  },
  {
    name: 'chain mail',
    description:
      'Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.',
    type: 'Heavy',
    cost: '75 gp',
    armourClass: '16',
    strength: 'Str 13',
    stealth: 'Disadvantage',
    weight: '55 lb.',
  },
  {
    name: 'splint',
    description:
      'This armour is made of narrow vertical strips of metal riveted to a backing of leather that is worn over cloth padding. Flexible chain mail protects the joints.',
    type: 'Heavy',
    cost: '200 gp',
    armourClass: '17',
    strength: 'Str 15',
    stealth: 'Disadvantage',
    weight: '60 lb.',
  },
  {
    name: 'plate',
    description:
      'Plate consists of shaped, interlocking metal plates to cover the entire body. A suit of plate includes gauntlets, heavy leather boots, a visored helmet, and thick layers of padding underneath the armour. Buckles and straps distribute the weight over the body.',
    type: 'Heavy',
    cost: '1500 gp',
    armourClass: '17',
    strength: 'Str 15',
    stealth: 'Disadvantage',
    weight: '65 lb.',
  },
  {
    name: 'shield',
    description:
      'A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armour Class by 2. You can benefit from only one shield at a time.',
    type: 'Shield',
    cost: '10 gp',
    armourClass: '+2',
    weight: '6 lb.',
  },
];
