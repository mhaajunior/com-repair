export interface Issue {
  key: number;
  id: number;
  sender: string;
  workGroup: string;
  problem: string;
  phone: string;
  detail: string;
  fixResult: string | null;
  status: StatusMap;
  createdAt: string;
  officer: string | null;
}

export interface StatusMap {
  value: string;
  label: string;
  color: string;
}

export interface SearchIssueParams {
  id?: number;
  fullname?: string;
  userId?: string;
  rangeDate?: any;
}

export interface CountIssue {
  ALL: number;
  OPEN?: number;
  ACKNOWLEDGE?: number;
  IN_PROGRESS?: number;
  NOTIFY?: number;
  CANT_FIX?: number;
  CANCELED?: number;
  CLOSED?: number;
}
