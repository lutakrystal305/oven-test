import { IsDate, IsDateString } from 'class-validator';

export class QueryDateDTO {
  @IsDateString()
  date_key_start: Date;

  @IsDateString()
  date_key_end: Date;
}
