import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

export class EnvUtils {
  private static readonly logger = new Logger(EnvUtils.name);

  static get(key: string): string | undefined {
    const value = process.env[key];
    if (!value) {
      this.logger.error(`Environment variable ${key} is not defined`);
    }
    return value;
  }
}
