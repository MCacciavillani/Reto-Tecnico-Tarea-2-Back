import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

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
    return await this.prisma.company.findMany();
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
