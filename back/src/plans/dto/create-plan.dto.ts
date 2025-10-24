import { Type } from '@prisma/client';

export class CreatePlanDto {
  name: string;
  price: number;
  description: string;
  type: Type;
  messageLimit: number;
}
