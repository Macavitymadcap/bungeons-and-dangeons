import { DbContext } from '../context/db-context';
import { BaseEntity, DbOperationResult } from '../entities/base.entity';

/**
 * Base Repository class that provides common CRUD operations
 * for all entities.
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected dbContext: DbContext;
  protected tableName: string;
  
  constructor(tableName: string, dbPath?: string) {
    this.tableName = tableName;
    this.dbContext = DbContext.getInstance(dbPath);
    this.initDb();
  }
  
  /**
   * Initialize the database - create tables and seed initial data
   */
  protected abstract initDb(): void;
  
  /**
   * Create database tables
   */
  protected abstract createTables(): void;
  
  /**
   * Insert initial seed data
   */
  protected abstract insertInitialData(): void;
  
  /**
   * Create a new entity in the database
   */
  abstract create(entity: Omit<T, 'id'>): number;
  
  /**
   * Read an entity by its ID
   */
  abstract read(id: number): T | null;
  
  /**
   * Read all entities from the table
   */
  abstract readAll(): T[];
  
  /**
   * Update an existing entity
   */
  abstract update(entity: T): DbOperationResult;
  
  /**
   * Delete an entity by its ID
   */
  abstract delete(id: number): DbOperationResult;
  
  /**
   * Close the database connection
   */
  public close(): void {
    this.dbContext.close();
  }
}