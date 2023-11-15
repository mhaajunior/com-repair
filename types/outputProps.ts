export interface IssueType {
  id: number;
  name: string;
  surname: string;
  team: number;
  group: number;
  phone: string;
  problem: number;
  detail: string;
  fixResult?: string;
  status: Status;
  createdAt: Date;
  fixStartDate?: Date;
  fixEndDate?: Date;
}

enum Status {
  OPEN,
  ACKNOWLEDGE,
  IN_PROGRESS,
  NOTIFY,
  CANT_FIX,
  CANCELED,
  CLOSED,
}
