import { ConfigService } from '@nestjs/config';

export class Connection {
  getName(): string {
    return 'No Connection';
  }
}

// Class Provider
export class MySQLConnection extends Connection {
  override getName(): string {
    return 'MySQL';
  }
}

// Class Provider
export class MongoDBConnection extends Connection {
  override getName(): string {
    return 'MongoDB';
  }
}

export function createConnection(configService: ConfigService) {
  if (configService.get('DATABASE') === 'mysql') {
    return new MySQLConnection();
  } else {
    return new MongoDBConnection();
  }
}
