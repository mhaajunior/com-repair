export interface SelectOption {
  label: string;
  value: number | string;
}

export interface SelectOptionWithTeam extends SelectOption {
  teamId: number;
}

export interface UserSelectOption {
  text: string;
  value: string;
}
