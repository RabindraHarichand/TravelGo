import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ServiceTypeList } from '../../enum';
import { Type } from 'class-transformer';
import {
  ServiceStatus,
  ServiceStatusList,
} from '../../enum/service-status.enum';

export class CreateServiceDto {
  @IsEnum(ServiceTypeList, {
    message: `Valid service types are ${ServiceTypeList}`,
  })
  public type: string;

  @IsString()
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @IsPositive()
  @Type(() => Number)
  public price: number;

  @IsString()
  @Length(1, 350)
  public description: string;

  @IsEnum(ServiceStatusList, {
    message: `Valid service types are ${ServiceStatusList}`,
  })
  @IsOptional()
  public status: string;
}
