/**
 * Base interface for all database entities
 */
export interface BaseEntity {
  id: number;
}

/**
 * Interface for database operations results
 */
export interface DbOperationResult {
  success: boolean;
  message?: string;
  id?: number;
  affectedRows?: number;
}
