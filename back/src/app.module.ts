import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [PrismaModule, UsersModule, CompaniesModule, PlansModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
