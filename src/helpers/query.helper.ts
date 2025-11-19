import {
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
} from 'typeorm';
import { QueryOptions, MatchingOptions } from '../interfaces/typeorm.interface';

export const QueryHelper = {
  async findOptions(
    criteria: object,
    queryOptions?: QueryOptions,
    matchingOptions?: MatchingOptions
  ) {
    const ignoreCase = matchingOptions?.ignoreCase ?? true;
    const contains = matchingOptions?.contains ?? false;

    const where: object[] = [];
    let conditions: object[] = [];

    if (Array.isArray(criteria)) {
      conditions = criteria;
    } else {
      conditions = [criteria];
    }

    for (let i = 0; i < conditions.length; i++) {
      const condition = Object.fromEntries(
        Object.entries(conditions[i]).map(([key, value]) => {
          if (typeof value === 'object' && value['$gte']) {
            return [key, MoreThanOrEqual(value['$gte'])];
          }

          if (typeof value === 'object' && value['$gt']) {
            return [key, MoreThan(value['$gt'])];
          }

          if (typeof value === 'object' && value['$lte']) {
            return [key, LessThanOrEqual(value['$lte'])];
          }

          if (typeof value === 'object' && value['$lt']) {
            return [key, LessThan(value['$lt'])];
          }

          if (typeof value === 'object' && value['$regex']) {
            if (value['$options'] === 'i') {
              return [key, Raw((alias) => `${alias} ~* '${value['$regex']}'`)];
            } else {
              return [key, Raw((alias) => `${alias} ~ '${value['$regex']}'`)];
            }
          }

          if (typeof value === 'object' && value['$ne']) {
            if (Array.isArray(value['$ne'])) {
              return [key, Not(In(value['$ne']))];
            } else {
              if (ignoreCase && typeof value['$ne'] === 'string') {
                if (contains) {
                  return [key, Not(ILike(`%${value['$ne']}%`))];
                } else {
                  return [key, Not(ILike(value['$ne']))];
                }
              }

              if (contains) {
                return [key, Not(`%${value['$ne']}%`)];
              }

              return [key, Not(value['$ne'])];
            }
          }

          if (Array.isArray(value)) {
            return [key, In(value)];
          }

          if (ignoreCase && typeof value === 'string') {
            if (contains) {
              return [key, ILike(`%${value}%`)];
            } else {
              return [key, ILike(value)];
            }
          }

          if (contains) {
            return [key, Like(`%${value}%`)];
          }

          return [key, value];
        })
      );

      where.push(condition);
    }

    const query: {
      where: object;
      take?: number;
      skip?: number;
      order?: object;
    } = {
      where: where,
    };

    if (queryOptions?.limit !== undefined && queryOptions?.limit !== null) {
      query['take'] = queryOptions.limit;
    }

    if (queryOptions?.offset !== undefined && queryOptions?.offset !== null) {
      query['skip'] = queryOptions.offset;
    }

    if (
      queryOptions?.sort &&
      queryOptions?.sort.length !== 0 &&
      queryOptions?.order &&
      queryOptions?.order.length !== 0
    ) {
      query['order'] = { [queryOptions.sort]: queryOptions.order };
    }

    return query;
  },
};
