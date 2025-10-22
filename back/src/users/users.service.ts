import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const company = await this.prisma.company.findUnique({
      where: {
        id: createUserDto.companyId,
      },
    });
    if (!company) {
      throw new ConflictException('Company with this id does not exist');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(companyId?: string) {
    return await this.prisma.user.findMany({
      where: companyId ? { companyId } : {},
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { newPassword, ...data } = updateUserDto;

    if (updateUserDto.password) {
      if (!newPassword) {
        throw new BadRequestException(
          'If you want to change the password, you must provide both the old and the new one.',
        );
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      data.password = hashedPassword;
    }
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
