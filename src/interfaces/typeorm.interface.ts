export const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
export type ORDER = (typeof ORDER)[keyof typeof ORDER];

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: ORDER;
}

export interface MatchingOptions {
  ignoreCase?: boolean;
  contains?: boolean;
}
