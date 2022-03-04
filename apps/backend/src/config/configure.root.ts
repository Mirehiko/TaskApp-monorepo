import { ConfigModule } from '@nestjs/config';

export const configModule = ConfigModule.forRoot({
    // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    envFilePath: '.env',
    // envFilePath: `.${process.env.NODE_ENV.env}`
    // isGlobal: true,
});