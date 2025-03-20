import { expect, test, describe, beforeEach, afterEach } from 'bun:test';
import { BaseRepository, BaseEntity } from './base-repository';

interface TestEntity extends BaseEntity {
  name: string;
  value: number;
}

class TestRepository extends BaseRepository<TestEntity> {
  protected initDb(): void {
    this.createTables();
    this.insertInitialData();
  }

  protected createTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS test_entities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        value INTEGER NOT NULL
      );
    `);
  }

  protected insertInitialData(): void {}

  create(entity: Omit<TestEntity, 'id'>): number {
    return this.executeInTransaction(() => {
      const result = this.prepareAndExecuteOne(
        'INSERT INTO test_entities (name, value) VALUES ($name, $value) RETURNING id',
        { $name: entity.name, $value: entity.value },
      ) as BaseEntity;
      return result.id;
    });
  }

  read(id: number): TestEntity | null {
    return this.prepareAndExecuteOne(
      'SELECT * FROM test_entities WHERE id = $id',
      { $id: id },
    ) as TestEntity | null;
  }

  readAll(): TestEntity[] {
    return this.prepareAndExecute(
      'SELECT * FROM test_entities',
    ) as TestEntity[];
  }

  update(entity: TestEntity): void {
    this.executeInTransaction(() => {
      this.prepareAndExecuteOne(
        'UPDATE test_entities SET name = $name, value = $value WHERE id = $id',
        { $id: entity.id, $name: entity.name, $value: entity.value },
      );
    });
  }

  delete(id: number): void {
    this.executeInTransaction(() => {
      this.prepareAndExecuteOne('DELETE FROM test_entities WHERE id = $id', {
        $id: id,
      });
    });
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository(':memory:');
  });

  afterEach(() => {
    repository.close();
  });

  describe('create', () => {
    test('should create entity and reurn the id', () => {
      // Arrange
      const entity = { name: 'Test', value: 42 };

      // Act
      const result = repository.create(entity);

      // Assert
      expect(result).toBe(1);
    });
  });

  describe('read', () => {
    test('should should return the expected entity given the corresponding id', () => {
      // Arrange
      const entity = { name: 'Testing', value: 69 };
      const id = repository.create(entity);

      // Act
      const result = repository.read(id) as TestEntity;

      expect(result.id).toBe(1);
      expect(result.name).toBe(entity.name);
      expect(result.value).toBe(entity.value);
    });
  });

  describe('readAll', () => {
    test('should return an array of all entities in the database', () => {
      // Arrange
      const entities = [
        { name: 'foo', value: 420 },
        { name: 'bar', value: 666 },
        { name: 'foobar', value: 999 },
      ];

      entities.forEach(entity => repository.create(entity));

      // Act
      const result = repository.readAll();

      // Assert
      expect(result.length).toBe(3);

      const expectedEntities = entities.map((entity, index) => {
        return { id: index + 1, ...entity };
      });

      expect(result).toEqual(expect.arrayContaining(expectedEntities));
    });
  });

  describe('update', () => {
    test('should update an entity with the given properties', () => {
      // Arrange
      const id = repository.create({ name: 'Test', value: 42 });
      const entity = repository.read(id) as TestEntity;

      // Act
      repository.update({ ...entity, name: 'Updated', value: 100 });
      const updated = repository.read(id);

      // Assert
      expect(updated?.name).toBe('Updated');
      expect(updated?.value).toBe(100);
    });
  });

  describe('delete', () => {
    test('should delete an entity', () => {
      // Arrange
      const id = repository.create({ name: 'Test', value: 42 });

      // Act
      repository.delete(id);
      const entity = repository.read(id);

      // Assert
      expect(entity).toBeNull();
    });
  });
});
