import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criteria } from '../entities/criteria.entity';
import { Rating } from '../entities/ratings.entity';
import { Location } from '../entities/location.entity';
import { DOMAIN_DB } from 'src/common/database/connection/postgres.db-connection';

@Injectable()
export class AhpService {
  constructor(
    @InjectRepository(Criteria, DOMAIN_DB.DB_NAME)
    private criteriaRepo: Repository<Criteria>,
    @InjectRepository(Location, DOMAIN_DB.DB_NAME)
    private locationRepo: Repository<Location>,
    @InjectRepository(Rating, DOMAIN_DB.DB_NAME)
    private ratingRepo: Repository<Rating>,
  ) {}

  async getCriteria(): Promise<Criteria[]> {
    return this.criteriaRepo.find();
  }

  async getLocations(): Promise<Location[]> {
    return this.locationRepo.find();
  }

  async rateCriteria(pair: string, score: number): Promise<Rating> {
    const [criteria1Id, criteria2Id] = pair.split('-');
    const criteria1 = await this.criteriaRepo.findOne({
      where: { id: criteria1Id },
    });
    const criteria2 = await this.criteriaRepo.findOne({
      where: { id: criteria2Id },
    });

    if (!criteria1 || !criteria2) throw new Error('Invalid criteria pair');

    const rating = this.ratingRepo.create({ criteria: criteria1, pair, score });
    return this.ratingRepo.save(rating);
  }

  async rateMultipleCriteria(
    ratings: { pair: string; score: number }[],
  ): Promise<Rating[]> {
    const savedRatings: Rating[] = [];

    for (const { pair, score } of ratings) {
      const [criteria1Id, criteria2Id] = pair.split('-');
      const criteria1 = await this.criteriaRepo.findOne({
        where: { id: criteria1Id },
      });
      const criteria2 = await this.criteriaRepo.findOne({
        where: { id: criteria2Id },
      });

      if (!criteria1 || !criteria2)
        throw new Error(`Invalid criteria pair: ${pair}`);

      const rating = this.ratingRepo.create({
        criteria: criteria1,
        pair,
        score,
      });
      const savedRating = await this.ratingRepo.save(rating);
      savedRatings.push(savedRating);
    }

    return savedRatings;
  }

  async calculateBestLocation(): Promise<Location> {
    const criteria = await this.getCriteria();
    const locations = await this.getLocations();

    // Placeholder weights (can use pairwise comparisons)
    const weights = criteria.reduce((acc, c, idx) => {
      acc[c.id] = 1 / (idx + 1); // Example weights
      return acc;
    }, {});

    // Example scores for each location
    const scores = locations.map((location) => {
      let totalScore = 0;
      for (const c of criteria) {
        const locationScore = Math.random(); // Replace with actual user rating
        totalScore += weights[c.id] * locationScore;
      }
      return { location, score: totalScore };
    });

    // Sort locations by score
    scores.sort((a, b) => b.score - a.score);

    return scores[0].location; // Return the best location
  }
}
