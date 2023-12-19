import { ObjectMap } from "./issue";

export interface UserProps {
  key: number;
  id: string;
  email: string;
  name: string;
  surname: string;
  createdAt: string;
  role: ObjectMap;
}

export interface TeamProps {
  id: number;
  label: string;
  abb: string;
}

export interface GroupProps {
  id: number;
  label: string;
  teamId: number;
}
