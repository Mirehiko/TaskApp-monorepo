export class BanUserDto {
  readonly userIds: number[];
  readonly reason?: string;
}
