import type { Ability } from "../providers/AuthProvider";

export type APIUser = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  last_activity: string;
  avatar: string | null;
  initials: string;
  phone: string;
  organizations: Array<{ organization__id: number; organization__title: string }>;
  allow_newsletters: boolean;
  date_joined: string;
  permissions?: Ability[];
};
