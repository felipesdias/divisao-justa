import { Person, Transaction, SplitResult } from '../types';

export const calculateSplit = (people: Person[]): SplitResult => {
  const total = people.reduce((sum, p) => sum + p.paid, 0);
  const totalShares = people.reduce((sum, p) => sum + (p.quantity || 1), 0);

  // Avoid division by zero
  if (totalShares === 0) {
    return { total: 0, perPerson: 0, transactions: [] };
  }

  const perShare = total / totalShares;
  const perPerson = perShare; // This is technically per unit/share now, but keeping naming for compatibility or simplified display if everyone has 1 share.
  
  // Calculate initial balances: how much each person paid minus the average they SHOULD have paid.
  // Positive balance = they are owed money.
  // Negative balance = they owe money.
  const balances = people.map(p => ({
    ...p,
    balance: p.paid - (perShare * (p.quantity || 1))
  })).filter(p => Math.abs(p.balance) > 0.009); // Filter out settled people (floating point tolerance)

  const transactions: Transaction[] = [];

  // Sort initially
  balances.sort((a, b) => a.balance - b.balance);

  // Greedy approach to minimize transactions
  let i = 0; // Pointer to biggest debtor (most negative)
  let j = balances.length - 1; // Pointer to biggest creditor (most positive)

  while (i < j) {
    const debtor = balances[i];
    const creditor = balances[j];

    // The amount to settle is the minimum of what the debtor owes and what the creditor is owed
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
    
    // Create transaction
    if (amount > 0.009) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: amount
      });
    }

    // Adjust balances
    debtor.balance += amount;
    creditor.balance -= amount;

    // If debtor is settled (close to 0), move pointer
    if (Math.abs(debtor.balance) < 0.009) {
      i++;
    }
    // If creditor is settled (close to 0), move pointer
    if (Math.abs(creditor.balance) < 0.009) {
      j--;
    }
  }

  return {
    total,
    perPerson,
    transactions
  };
};