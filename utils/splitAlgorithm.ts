import { Person, Transaction, SplitResult } from '../types';

export const calculateSplit = (people: Person[]): SplitResult => {
  // 1. Convert everything to cents (integer)
  // safeRound avoids floating point glitches when multiplying by 100
  const toCents = (val: number) => Math.round(val * 100);

  const peopleCents = people.map(p => ({
    ...p,
    paidCents: toCents(p.paid),
    weight: p.weight || 1
  }));

  const totalCents = peopleCents.reduce((sum, p) => sum + p.paidCents, 0);
  const totalWeight = peopleCents.reduce((sum, p) => sum + p.weight, 0);

  // Avoid division by zero
  if (people.length === 0 || totalWeight === 0) {
    return { total: 0, perPerson: 0, transactions: [] };
  }

  // 2. Calculate Fair Share in Cents
  // We need to distribute totalCents among people based on weight.
  // Because integer division truncates, we'll have a remainder TO DISTRIBUTE.

  // Base share per unit of weight (floor calculation)
  const baseCostPerUnitWeight = Math.floor(totalCents / totalWeight);

  // The remainder that couldn't be evenly distributed
  let remainder = totalCents - (baseCostPerUnitWeight * totalWeight);

  // Calculate each person's fair share
  // We distribute the remainder 1 cent at a time to people (often starting from those with higher weights or just 0..n)
  // To be deterministic and "fair", we can distribute to the first N people.

  const peopleWithShare = peopleCents.map(p => {
    let share = baseCostPerUnitWeight * p.weight;
    // Distribute remainder: give 1 cent to this person for each unit of weight until remainder empty?
    // Or just simple round-robin distribution of the remainder cents?
    // Simple round robin is standard for "splitting pennies".
    return {
      ...p,
      fairShareCents: share
    };
  });

  // Distribute the remainder cents one by one
  // We give to people (maybe sort by weight descending first? Or just index order?)
  // Let's stick to index order for stability, but ideally maybe those who paid most or have highest weight.
  // Standard splitwise behavior often random or arbitrary for the last cent.
  for (let i = 0; i < remainder; i++) {
    peopleWithShare[i % peopleWithShare.length].fairShareCents += 1;
  }

  // 3. Calculate Balance
  // Balance = Paid - FairShare
  // Positive = Owed to person
  // Negative = Person owes
  const balances = peopleWithShare.map(p => ({
    ...p,
    balance: p.paidCents - p.fairShareCents
  })).sort((a, b) => a.balance - b.balance);
  // Sorting: Most negative balance (Debtors) first, Most positive balance (Creditors) last

  const transactions: Transaction[] = [];

  let i = 0; // Pointer to biggest debtor
  let j = balances.length - 1; // Pointer to biggest creditor

  while (i < j) {
    const debtor = balances[i];
    const creditor = balances[j];

    // If debtor or creditor is already settled (0 balance), move pointers
    if (debtor.balance === 0) {
      i++;
      continue;
    }
    if (creditor.balance === 0) {
      j--;
      continue;
    }

    // Amount to settle is min(|debtor.balance|, creditor.balance)
    const amountCents = Math.min(Math.abs(debtor.balance), creditor.balance);

    // Create transaction if amount > 0
    if (amountCents > 0) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: amountCents / 100 // Convert back to float for result
      });
    }

    // Adjust balances
    debtor.balance += amountCents;
    creditor.balance -= amountCents;

    // Pointers will be updated at start of next loop check
  }

  return {
    total: totalCents / 100, // Convert back to float
    perPerson: totalCents / totalWeight / 100, // Average cost per unit weight (informative only, might be float)
    transactions
  };
};