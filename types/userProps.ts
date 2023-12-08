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
