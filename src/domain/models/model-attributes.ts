/**
 * Represents the model attributes without the id
 */
export type ModelAttributes<T> = Omit<T, 'id'>
