import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Type } from '@prisma/client';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto) {
    const plan = await this.prisma.plan.findFirst({
      where: { name: createPlanDto.name },
    });
    if (plan) {
      throw new ConflictException('Plan with this name already exists');
    }
    return await this.prisma.plan.create({
      data: createPlanDto,
    });
  }

  async findAll() {
    return await this.prisma.plan.findMany();
  }

  async findAllActives() {
    return await this.prisma.plan.findMany({
      where: { status: 'ACTIVE' },
      include: { companies: true },
    });
  }

  async asignPlan(id: string, companyId: string) {
    const plan = await this.prisma.plan.findFirst({
      where: { id },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const currentDate = new Date();
    const endDate = new Date();

    if (plan.type === Type.MONTHLY) {
      endDate.setMonth(currentDate.getMonth() + 1);
    } else if (plan.type === Type.YEARLY) {
      endDate.setFullYear(currentDate.getFullYear() + 1);
    } else if (plan.type === Type.CUSTOM) {
      endDate.setDate(currentDate.getDate() + plan.duration!);
    }

    await this.prisma.planHistories.create({
      data: {
        companyId,
        planId: id,
        endDate,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.plan.findFirst({
      where: { id },
    });
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.prisma.plan.findFirst({
      where: { id },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return await this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.plan.delete({
      where: { id },
    });
  }
}
