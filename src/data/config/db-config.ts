/**
 * Database configuration settings
 */
export const DB_CONFIG = {
  path: 'src/data/database.db',
  inMemoryPath: ':memory:',
  options: {
    create: true,
    readonly: false,
  },
};
