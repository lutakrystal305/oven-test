import { IsString } from 'class-validator';

export class QuerySearchDTO {
  @IsString()
  search_key: string;
}
