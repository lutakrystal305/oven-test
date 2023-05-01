/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class TodoPaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 0;
}
