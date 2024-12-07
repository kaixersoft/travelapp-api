import { IsString, Matches, IsInt, Min, Max } from 'class-validator';

export class RatingDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/, {
    message: 'pair must be in the format "criteria1Id-criteria2Id"',
  })
  pair: string;

  @IsInt()
  @Min(1, { message: 'score must be at least 1' })
  @Max(9, { message: 'score must not exceed 9' })
  score: number;
}
