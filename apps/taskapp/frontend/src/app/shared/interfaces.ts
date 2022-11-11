export interface User {
  _id?: string;
  email: string;
  password: string;
  role: string;
  name?: string;
  avatar?: string;
  updated?: string;
  registeredIn?: string;
}

export interface Bill {
  _id?: string;
  name: string;
  user: string;
  type: string;
  percent?: number;
  updated?: string;
  opened?: string;
  hasCard?: boolean;
  isTarget?: boolean;
  closed?: string;
  bank?: string;
  balance?: number;
  status?: string;
}

export interface Message {
  message: string;
}

export interface Role {
  _id?: string;
  name: string;
  code_name: string;
  desc: string;
}

export interface Category {
  _id?: string;
  name: string;
  url: string;
}

export interface Operation {
  _id?: string;
  name: string;
  type: string;
  value: number;
  writeOfBill?: string;
  writeToBill?: string;
  category?: string;
  description?: string;
  user?: string;
  date?: string;
}

export interface Card {
  _id?: string;
  name: string;
  type: string;
  user: string;
  bill?: string;
  number?: string;
  hasCard: boolean;
}

export interface Target {
  _id?: string;
  name: string;
  user: string;
  bill: string;
  type: string;
  cover: string;
  status?: string;
  updated?: string;
  reached?: string;
  targetValue: number;
}
