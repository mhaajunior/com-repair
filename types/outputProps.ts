export interface Issue {
  key: number;
  id: number;
  sender: string;
  workGroup: string;
  problem: string;
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
