import { Module } from '@nestjs/common';
import { TokenService } from "./token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToken } from "./schemas/user-token.entity";


@Module({
  providers: [TokenService],
  imports: [
    TypeOrmModule.forFeature(([UserToken])),
  ],
  exports: [
    TokenService,
  ]
})
export class TokenModule {}
