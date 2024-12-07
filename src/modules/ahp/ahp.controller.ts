import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AhpService } from './domain/services/ahp.service';
import { RatingsInputDto } from './domain/dto/rating-input.dto';
import { RatingService } from './domain/services/rating.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository } from '../user/domain/repository/user.repository';
import { User } from '../user/domain/entities/user.entity';

@Controller('ahp')
export class AhpController {
  constructor(
    private readonly ahpService: AhpService,
    private readonly ratingService: RatingService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get('criteria')
  getCriteria() {
    return this.ahpService.getCriteria();
  }

  @Get('locations')
  getLocations() {
    return this.ahpService.getLocations();
  }

  @Post('rate')
  rateCriteria(@Body() body: { pair: string; score: number }) {
    return this.ahpService.rateCriteria(body.pair, body.score);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('rate-multiple')
  async rateMultipleCriteria(@Body() body: RatingsInputDto, @Request() req) {
    const { ratings } = body;

    const currentUser: User = await this.userRepository.findById(
      req.user.userId,
    );

    // Validate that there are at least 4 pairwise comparisons
    if (!ratings || ratings.length < 4) {
      throw new Error('At least 4 pairwise comparisons are required.');
    }

    if (!ratings || ratings.length < 4) {
      throw new BadRequestException(
        'At least 4 pairwise comparisons are required.',
      );
    }

    // Process the ratings and save them to the database
    await this.ratingService.saveRatings(ratings, currentUser);

    // Call the method to calculate the best location based on these ratings
    const bestLocation =
      await this.ratingService.calculateBestLocation(currentUser);
    return bestLocation;
  }

  @Get('best-location')
  async getBestLocation() {
    return this.ahpService.calculateBestLocation();
  }
}
