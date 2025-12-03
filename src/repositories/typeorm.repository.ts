import { Repository } from 'typeorm';
import {
  WriteOptions,
  QueryOptions,
  MatchingOptions,
} from '../interfaces/typeorm.interface';
import { QueryHelper } from '../helpers/query.helper';

export class TypeOrmRepository {
  private readonly repository: Repository<object>;

  constructor(repository: any) {
    this.repository = repository;
  }

  async insert(entity: any, writeOptions?: WriteOptions) {
    const ignoreEmpty = writeOptions?.ignoreEmpty ?? false;

    let entities: any[];

    if (Array.isArray(entity)) {
      entities = entity;
    } else {
      entities = [entity];
    }

    for (let i = 0; i < entities.length; i++) {
      for (const key in entities[i]) {
        if (entities[i][key] === undefined || entities[i][key] === null) {
          delete entities[i][key];
          continue;
        }

        if (
          ignoreEmpty &&
          typeof entities[i][key] === 'string' &&
          entities[i][key].length === 0
        ) {
          delete entities[i][key];
          continue;
        }
      }
    }

    return await this.repository.insert(entities);
  }

  async find(
    criteria: object,
    queryOptions?: QueryOptions,
    matchingOptions?: MatchingOptions
  ) {
    const query = await QueryHelper.findOptions(
      criteria,
      queryOptions,
      matchingOptions
    );

    return await this.repository.find(query);
  }

  async findOne(criteria: object, matchingOptions?: MatchingOptions) {
    const query = await QueryHelper.findOptions(
      criteria,
      undefined,
      matchingOptions
    );

    return await this.repository.findOne(query);
  }

  async update(
    criteria: object,
    entity: any,
    matchingOptions?: MatchingOptions,
    writeOptions?: WriteOptions
  ) {
    const ignoreEmpty = writeOptions?.ignoreEmpty ?? false;

    const findOptions = await QueryHelper.findOptions(
      criteria,
      undefined,
      matchingOptions
    );

    const query = findOptions['where'];

    for (const key in entity) {
      if (entity[key] === undefined || entity[key] === null) {
        delete entity[key];
        continue;
      }

      if (
        ignoreEmpty &&
        typeof entity[key] === 'string' &&
        entity[key].length === 0
      ) {
        delete entity[key];
        continue;
      }
    }

    return await this.repository.update(query, entity);
  }

  async delete(criteria: object, matchingOptions?: MatchingOptions) {
    const findOptions = await QueryHelper.findOptions(
      criteria,
      undefined,
      matchingOptions
    );

    const query = findOptions['where'];

    return await this.repository.delete(query);
  }

  async count(
    criteria: object,
    queryOptions?: QueryOptions,
    matchingOptions?: MatchingOptions
  ) {
    const query = await QueryHelper.findOptions(
      criteria,
      queryOptions,
      matchingOptions
    );

    return await this.repository.count(query);
  }
}
