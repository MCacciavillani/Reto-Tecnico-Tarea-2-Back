import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './create-plan.dto';
import { Status } from '@prisma/client';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  status?: Status;
}
