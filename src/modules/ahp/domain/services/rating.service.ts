import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criteria } from 'src/modules/ahp/domain/entities/criteria.entity';
import { Rating } from '../entities/ratings.entity';
import { DOMAIN_DB } from 'src/common/database/connection/postgres.db-connection';
import { Location } from '../entities/location.entity';
import { User } from '../../../user/domain/entities/user.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating, DOMAIN_DB.DB_NAME)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Criteria, DOMAIN_DB.DB_NAME)
    private readonly criteriaRepository: Repository<Criteria>,
    @InjectRepository(Location, DOMAIN_DB.DB_NAME)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // Save ratings from the user
  async saveRatings(ratings: any[], currentUser: Partial<User>): Promise<void> {
    const ratingEntities = await Promise.all(
      ratings.map(async (rating) => {
        const [criteriaCode1, criteriaCode2] = rating.pair.split('-');

        // Find criteria entities by code
        const criteria1 = await this.criteriaRepository.findOne({
          where: { code: criteriaCode1 },
        });
        const criteria2 = await this.criteriaRepository.findOne({
          where: { code: criteriaCode2 },
        });

        if (!criteria1 || !criteria2) {
          throw new Error(
            `One or both criteria with codes ${criteriaCode1} and ${criteriaCode2} not found.`,
          );
        }

        // Create the Rating entity
        const ratingEntity = this.ratingRepository.create({
          pair: rating.pair,
          score: rating.score,
          criteria: criteria1,
          user: currentUser,
        });

        return ratingEntity;
      }),
    );

    // Save all rating entities
    await this.ratingRepository.save(ratingEntities);
  }

  // Calculate best location based on AHP logic
  async calculateBestLocation(currentUser: Partial<User>): Promise<any> {
    const ratings = await this.ratingRepository.find({
      where: { userId: currentUser.id }, // Only consider ratings from the current user
    });

    // Build pairwise matrix from ratings
    const matrix = await this.buildPairwiseMatrix(ratings);

    // Calculate criteria weights using AHP
    const criteriaWeights = this.calculateCriteriaWeights(matrix);

    // Fetch the locations and their corresponding features
    const locations = await this.getLocations();
    const bestLocation = this.calculateBestLocationBasedOnScores(
      locations,
      criteriaWeights,
    );

    return bestLocation;
  }

  // Build pairwise matrix using CriteriaCode
  private async buildPairwiseMatrix(ratings: Rating[]): Promise<number[][]> {
    const criteria = await this.criteriaRepository.find();
    const matrix = [];

    // Initialize matrix with zeros
    for (let i = 0; i < criteria.length; i++) {
      matrix[i] = Array(criteria.length).fill(0);
    }

    // Fill pairwise comparison matrix
    ratings.forEach((rating) => {
      const [criteriaCode1, criteriaCode2] = rating.pair.split('-');
      const idx1 = criteria.findIndex((c) => c.code === criteriaCode1);
      const idx2 = criteria.findIndex((c) => c.code === criteriaCode2);

      matrix[idx1][idx2] = rating.score;
      matrix[idx2][idx1] = 1 / rating.score; // Reciprocal value
    });

    return matrix;
  }

  // Calculate weights using AHP
  private calculateCriteriaWeights(matrix: number[][]): number[] {
    const numCriteria = matrix.length;
    const sums = Array(numCriteria).fill(0);

    // Sum columns
    for (let i = 0; i < numCriteria; i++) {
      for (let j = 0; j < numCriteria; j++) {
        sums[i] += matrix[j][i];
      }
    }

    // Normalize the matrix and calculate weights
    const weights = sums.map((sum) => sum / numCriteria);
    return weights;
  }

  // Fetch all locations and their features (e.g., cost, facilities, etc.)
  private async getLocations(): Promise<Location[]> {
    return await this.locationRepository.find();
  }

  // Calculate best location based on the weighted score
  private calculateBestLocationBasedOnScores(
    locations: Location[],
    criteriaWeights: number[],
  ): Location | null {
    let bestLocation: Location | null = null;
    let bestScore = -Infinity;

    locations.forEach((location) => {
      let score = 0;

      // Apply the weights to the features of the location
      // Assuming features for each criterion are stored as `location.cost`, `location.facilities`, etc.
      score += location.cost * criteriaWeights[0]; // Weighted cost score
      score += location.facilities * criteriaWeights[1]; // Weighted facilities score
      score += location.touristActivities * criteriaWeights[2]; // Weighted tourist activities score
      score += location.accessibility * criteriaWeights[3]; // Weighted accessibility score

      console.log(`Location: ${location.name}, Score: ${score}`);

      if (score > bestScore) {
        bestScore = score;
        bestLocation = location;
      }
    });

    console.log('bestLocation', bestLocation);

    return bestLocation;
  }
}
