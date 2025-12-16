import { Person, Transaction, SplitResult } from '../types';

export const calculateSplit = (people: Person[]): SplitResult => {
  const total = people.reduce((sum, p) => sum + p.paid, 0);
  const totalWeight = people.reduce((sum, p) => sum + (p.weight || 1), 0);

  // Avoid division by zero
  if (people.length === 0 || totalWeight === 0) {
    return { total: 0, perPerson: 0, transactions: [] };
  }

  // Cost per unit of weight
  const costPerUnitWeight = total / totalWeight;
  const perPerson = costPerUnitWeight;

  // Calculate initial balances: how much each person paid minus their fair share (weight * costPerUnit).
  // Positive balance = they are owed money.
  // Negative balance = they owe money.
  const balances = people.map(p => {
    const fairShare = (p.weight || 1) * costPerUnitWeight;
    return {
      ...p,
      balance: p.paid - fairShare
    };
  }).filter(p => Math.abs(p.balance) > 0.009); // Filter out settled people (floating point tolerance)

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