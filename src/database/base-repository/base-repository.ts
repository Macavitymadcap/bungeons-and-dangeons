import { Database, SQLQueryBindings } from 'bun:sqlite';

export interface BaseEntity {
  id: number;
}

export abstract class BaseRepository<T extends BaseEntity> {
  protected db: Database;

  constructor(path: string) {
    this.db = new Database(path, { create: true });
    this.initDb();
  }

  protected abstract initDb(): void;
  protected abstract createTables(): void;
  protected abstract insertInitialData(): void;

  protected beginTransaction(): void {
    this.db.exec('BEGIN TRANSACTION');
  }

  protected commitTransaction(): void {
    this.db.exec('COMMIT');
  }

  protected rollbackTransaction(): void {
    this.db.exec('ROLLBACK');
  }

  protected executeInTransaction<R>(operation: () => R): R {
    try {
      this.beginTransaction();
      const result = operation();
      this.commitTransaction();
      return result;
    } catch (error) {
      this.rollbackTransaction();
      throw error;
    }
  }

  protected prepareAndExecute(
    sql: string,
    params?: SQLQueryBindings,
  ): unknown[] {
    const statement = this.db.prepare(sql);
    if (params) {
      return statement.all(params);
    }
    return statement.all();
  }

  protected prepareAndExecuteOne(
    sql: string,
    params?: SQLQueryBindings,
  ): unknown {
    const statement = this.db.prepare(sql);
    if (params) {
      return statement.get(params);
    }
    return statement.get();
  }

  abstract create(entity: Omit<T, 'id'>): number;
  abstract read(id: number): T | null;
  abstract readAll(): T[];
  abstract update(entity: T): void;
  abstract delete(id: number): void;

  close(): void {
    this.db.close();
  }
}
