export interface Person {
  id: string;
  name: string;
  description?: string;
  paid: number;
  weight: number;
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface SplitResult {
  total: number;
  perPerson: number;
  transactions: Transaction[];
}

export enum ParsingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}