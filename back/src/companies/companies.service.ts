import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlansService } from 'src/plans/plans.service';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private plansService: PlansService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = await this.prisma.company.findFirst({
      where: { name: createCompanyDto.name },
    });
    if (company) {
      throw new ConflictException('Company with this name already exists');
    }
    return await this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async findAll() {
    return await this.prisma.company.findMany({
      include: { users: true, planHistory: { include: { plan: true } } },
    });
  }

  async findForName(name: string) {
    return await this.prisma.company.findFirst({
      where: { name },
      include: { users: true, planHistory: { include: { plan: true } } },
    });
  }

  async findOne(id: string) {
    return await this.prisma.company.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.prisma.company.findUniqueOrThrow({
      where: { id },
    });
    if (updateCompanyDto.planId) {
      const plan = await this.prisma.plan.findUniqueOrThrow({
        where: { id: updateCompanyDto.planId },
      });
      if (plan.status === 'EXPIRED') {
        throw new ConflictException('Plan is inactive');
      }
      updateCompanyDto.availableMessages = plan.messageLimit;
      await this.plansService.asignPlan(updateCompanyDto.planId, id);
    }
    return await this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.company.delete({
      where: { id },
    });
  }
}
