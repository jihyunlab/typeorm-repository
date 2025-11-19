# @jihyunlab/typeorm-repository

[![Version](https://img.shields.io/npm/v/@jihyunlab/typeorm-repository.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/typeorm-repository?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/@jihyunlab/typeorm-repository.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/typeorm-repository) [![Last commit](https://img.shields.io/github/last-commit/jihyunlab/typeorm-repository.svg?style=flat-square)](https://github.com/jihyunlab/typeorm-repository/graphs/commit-activity) [![License](https://img.shields.io/github/license/jihyunlab/typeorm-repository.svg?style=flat-square)](https://github.com/jihyunlab/typeorm-repository/blob/master/LICENSE) [![Linter](https://img.shields.io/badge/linter-eslint-blue?style=flat-square)](https://eslint.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)\
[![Build](https://github.com/jihyunlab/typeorm-repository/actions/workflows/build.yml/badge.svg)](https://github.com/jihyunlab/typeorm-repository/actions/workflows/build.yml) [![Lint](https://github.com/jihyunlab/typeorm-repository/actions/workflows/lint.yml/badge.svg)](https://github.com/jihyunlab/typeorm-repository/actions/workflows/lint.yml)

@jihyunlab/typeorm-repository was developed to make TypeORM easier and more convenient to use.

## Installation

```bash
npm i @jihyunlab/typeorm-repository
```

## Usage

@jihyunlab/typeorm-repository can be integrated into NestJS.

```
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '@jihyunlab/typeorm-repository';

@Injectable()
export class TypeOrmService {
  private readonly userTypeOrmRepository: TypeOrmRepository;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    this.userTypeOrmRepository = new TypeOrmRepository(this.userRepository);
  }
}
```

Provides a simple method for inserting entities.

```
const result = await this.userTypeOrmRepository.insert({
  name: 'JihyunLab',
  email: 'info@jihyunlab.com',
});
```

Provides a method for retrieving a single entity.

```
const result = await this.userTypeOrmRepository.findOne({
  name: 'JihyunLab',
  email: 'info@jihyunlab.com',
});
```

```
{
  "id": 1,
  "name": "JihyunLab",
  "email": "info@jihyunlab.com",
  "created_at": "2025-11-19T03:33:03.231Z"
}
```

Provides case-sensitivity configuration with a simple mechanism.

```
const result = await this.userTypeOrmRepository.findOne(
  {
    name: 'jihyunlab',
  },
  { ignoreCase: false }
);
```

```
null
```

Provides substring-search functionality with a simple mechanism.

```
const result = await this.userTypeOrmRepository.findOne(
  {
    name: 'Jihyun',
    email: 'INFO@JIHYUNLAB.COM',
  },
  { contains: true }
);
```

```
{
  "id": 1,
  "name": "JihyunLab",
  "email": "info@jihyunlab.com",
  "created_at": "2025-11-19T03:33:03.231Z"
}
```

Provides IN-based search and sorting capabilities.

```
const result = await this.userTypeOrmRepository.find(
  {
    name: ['JihyunLab'],
  },
  { limit: 1, offset: 0, sort: 'created_at', order: ORDER.DESC }
);
```

```
[
  {
    "id": 1,
    "name": "JihyunLab",
    "email": "info@jihyunlab.com",
    "created_at": "2025-11-19T03:33:03.231Z"
  }
]
```

Supports negative conditions such as $ne.

```
const result = await this.userTypeOrmRepository.find(
  {
    name: { $ne: 'JihyunLab' },
  },
  { limit: 1, offset: 0, sort: 'created_at', order: ORDER.DESC }
);
```

```
[]
```

Supports regex-based search using $regex.

```
const result = await this.userTypeOrmRepository.find(
  {
    name: { $regex: '^JIHYUNLAB$', $options: 'i' },
  },
  { limit: 1, offset: 0, sort: 'created_at', order: ORDER.DESC }
);
```

```
[
  {
    "id": 1,
    "name": "JihyunLab",
    "email": "info@jihyunlab.com",
    "created_at": "2025-11-19T03:33:03.231Z"
  }
]
```

Supports comparison operators including $gt, $gte, $lt and $lte.

```
const result = await this.userTypeOrmRepository.find({
  created_at: { $lte: new Date() },
});
```

```
[
  {
    "id": 1,
    "name": "JihyunLab",
    "email": "info@jihyunlab.com",
    "created_at": "2025-11-19T03:33:03.231Z"
  }
]
```

Provides OR-based query functionality by accepting multiple criteria as an array.

```
const result = await this.userTypeOrmRepository.find([
  {
    name: 'JihyunLab',
  },
  {
    email: { $regex: '^info@jihyunlab.com$', $options: 'i' },
  },
]);
```

```
[
  {
    "id": 1,
    "name": "JihyunLab",
    "email": "info@jihyunlab.com",
    "created_at": "2025-11-19T03:33:03.231Z"
  }
]
```

Provides entity update functionality based on the same conditions used for find queries.

```
const result = await this.userTypeOrmRepository.update(
  {
    name: 'Jihyun',
    email: 'INFO@JIHYUNLAB.COM',
  },
  { name: 'JihyunLab', email: 'info@jihyunlab.com' },
  { contains: true }
);
```

```
{
  "generatedMaps": [],
  "raw": [],
  "affected": 1
}
```

Provides entity deletion functionality based on the same conditions used for find queries.

```
const result = await this.userTypeOrmRepository.delete(
  {
    name: 'Jihyun',
    email: 'INFO@JIHYUNLAB.COM',
  },
  { contains: true }
);
```

```
{
  "raw": [],
  "affected": 1
}
```

## Credits

Authored and maintained by JihyunLab <<info@jihyunlab.com>>

## License

Open source [licensed as MIT](https://github.com/jihyunlab/typeorm-repository/blob/master/LICENSE).
