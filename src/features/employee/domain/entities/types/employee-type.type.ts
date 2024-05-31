export enum EmployeeTypeEnum {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
}

export type CreateEmployeeTypePayload = {
  type: string;
};
