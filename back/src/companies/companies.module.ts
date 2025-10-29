import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { PlansService } from 'src/plans/plans.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PlansService],
})
export class CompaniesModule {}
