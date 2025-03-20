import {
  expect,
  test,
  describe,
  beforeEach,
  afterEach,
  spyOn,
  Mock,
} from 'bun:test';
import { ArmourRepository } from './armour-repository';
import { ARMOURS, ArmourEntity } from './armour-repository.model';

describe('ArmourRepository', () => {
  let armourRepository: ArmourRepository;
  let warnSpy: Mock<{
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
    (...data: any[]): void;
  }>;

  beforeEach(() => {
    armourRepository = new ArmourRepository(':memory:');
    warnSpy = spyOn(console, 'warn');
  });

  afterEach(() => {
    armourRepository.close();
    warnSpy.mockClear();
  });

  describe('read', () => {
    test('should return the corresponding ArmourEntity given an id', () => {
      // Arrange
      const shieldId = 13;

      // Act
      const result = armourRepository.read(shieldId) as ArmourEntity;
      // Assert
      expect(result.id).toBe(shieldId);
      expect(result.name).toBe('shield');
      expect(result.description).toBe(
        'A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armour Class by 2. You can benefit from only one shield at a time.',
      );
      expect(result.type).toBe('Shield');
      expect(result.cost).toBe('10 gp');
      expect(result.armourClass).toBe('+2');
      expect(result.stealth).toBeNull();
      expect(result.strength).toBeNull();
      expect(result.weight).toBe('6 lb.');
    });
  });

  describe('readAll', () => {
    test('should return an array of ArmourEntity matching the inital Armours array with ids added', () => {
      // Act
      const result = armourRepository.readAll();

      // Assert
      expect(result.length).toBe(ARMOURS.length);

      const expectedArmourEntities = ARMOURS.map((armour, index) => {
        return {
          id: index + 1,
          name: armour.name,
          description: armour.description,
          type: armour.type,
          cost: armour.cost,
          armourClass: armour.armourClass,
          strength: armour.strength || null,
          stealth: armour.stealth || null,
          weight: armour.weight,
        };
      }) as ArmourEntity[];

      expect(result).toEqual(expect.arrayContaining(expectedArmourEntities));
    });
  });

  describe('readByName', () => {
    test('should return the an array containing the padded armour entity when given "padded"', () => {
      // Arrange
      const query = 'padded';

      // Act
      const result = armourRepository.readByName(query)!;

      // Assert
      expect(result).toBeArrayOfSize(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('padded');
      expect(result[0].description).toBe(
        'Padded armour consists of quilted layers of cloth and batting.',
      );
      expect(result[0].type).toBe('Light');
      expect(result[0].cost).toBe('5 gp');
      expect(result[0].armourClass).toBe('11 + Dex modifier');
      expect(result[0].strength).toBeNull();
      expect(result[0].stealth).toBe('Disadvantage');
      expect(result[0].weight).toBe('8 lb.');
    });

    test('should return an array containing the studded leather and leather armour entities when given "leather"', () => {
      // Arrange
      const query = 'leather';

      // Act
      const result = armourRepository.readByName(query)!;

      // Assert
      expect(result).toBeArrayOfSize(2);
      expect(result[0].name).toBe('leather');
      expect(result[1].name).toBe('studded leather');
    });

    test('should return an empty array given the name "vibranium"', () => {
      // Arrange
      const query = 'vibranium';

      // Act
      const result = armourRepository.readByName(query);

      // Assert
      expect(result).toBeEmpty();
    });
  });

  describe('readDescriptionByArmourName', () => {
    test.each(ARMOURS)(
      'given the name of an armour should return the corresponing description',
      armour => {
        // Arrange
        const armourName = armour.name;

        // Act
        const result =
          armourRepository.readDescriptionByArmourName(armourName)!;

        // Assert
        expect(result.description).toBe(armour.description);
      },
    );

    test('should return null given the name of an armour not in the database', () => {
      // Arrange
      const armourName = 'Mithril of Bilbo';

      // Act
      const result = armourRepository.readDescriptionByArmourName(armourName);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    test('should not be implemented and not change the given entity', () => {
      // Arrange
      const chainShirtUpdate: ArmourEntity = {
        id: 5,
        name: 'chain Skirt',
        description: 'A skirt made of chain. Very fetching.',
        type: 'Light',
        cost: '1 cp',
        armourClass: '-2',
        weight: '1 oz.',
      };

      // Act
      armourRepository.update(chainShirtUpdate);

      const chainShirt = armourRepository.read(5) as ArmourEntity;

      // Expect
      expect(warnSpy).toHaveBeenCalledWith('update method not implemented');
      expect(chainShirt.name).toBe('chain shirt');
      expect(chainShirt.description).toBe(
        "Made of interlocking metal rings, a chain shirt is worn between layers of clothing or leather. This armour offers modest protection to the wearer's upper body and allows the sound of the rings rubbing against one another to be muffled by outer layers",
      );
      expect(chainShirt.type).toBe('Medium');
      expect(chainShirt.cost).toBe('50 gp');
      expect(chainShirt.armourClass).toBe('13 + Dex modifier (max 2)');
      expect(chainShirt.weight).toBe('20 lb.');
    });
  });

  describe('delete', () => {
    test('should not be implemented and not delete the given entity', () => {
      // Arrange
      const ringMailId = 9;

      // Act
      armourRepository.delete(1);
      const ringMail = armourRepository.read(ringMailId);

      // Expect
      expect(warnSpy).toHaveBeenCalledWith('delete method not implemented');
      expect(ringMail).not.toBeNull();
    });
  });
});
