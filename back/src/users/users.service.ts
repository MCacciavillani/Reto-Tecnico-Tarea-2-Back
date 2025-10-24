import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { Payload } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const company = await this.prisma.company.findFirst({
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

  async login(credentials: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload: Payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      messageCount: user.messageCount,
      company: user.companyId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(companyId?: string) {
    return await this.prisma.user.findMany({
      where: companyId ? { companyId } : {},
    });
  }

  async findOne(id: string) {
    return await this.prisma.user.findFirst({
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
