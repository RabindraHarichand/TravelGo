import { ServiceStatus } from '../enum/service-status.enum';

export class Service {
  id: string;
  type: string;
  price: number;
  description: string;
  name: string;
  status: ServiceStatus;
}
