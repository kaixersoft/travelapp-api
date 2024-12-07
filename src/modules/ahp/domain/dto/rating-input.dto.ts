import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RatingDto } from './ratings.dto';

export class RatingsInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RatingDto)
  ratings: RatingDto[];
}
