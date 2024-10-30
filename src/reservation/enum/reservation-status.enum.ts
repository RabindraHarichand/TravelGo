export const enum ReservationStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
}

export const ReservationStatusList: ReservationStatus[] = [
  ReservationStatus.PENDING,
  ReservationStatus.ACTIVE,
  ReservationStatus.CANCELLED,
];
