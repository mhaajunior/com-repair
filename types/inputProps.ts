export interface OptionProps {
  name: string;
  id: number;
}

export interface SelectOption {
  label: string;
  value: number;
}

export interface SelectOptionWithTeam extends SelectOption {
  teamId: number;
}
