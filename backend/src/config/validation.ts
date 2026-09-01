import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumberString, IsString, IsOptional, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  QA = 'qa',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsNumberString()
  @IsOptional()
  PORT: string;

  @IsString()
  MONGODB_URI: string;

  @IsString()
  JWT_SECRET: string;
}

// Validates required environment variables at boot time so misconfiguration
// fails fast instead of surfacing as a confusing runtime error later.
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Config validation failed: ${errors.map((e) => Object.values(e.constraints || {}).join(', ')).join('; ')}`,
    );
  }
  return validatedConfig;
}
