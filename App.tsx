import React, { useState, useEffect } from 'react';
import { Person } from './types';
import { calculateSplit } from './utils/splitAlgorithm';
import PersonRow from './components/PersonRow';
import Results from './components/Results';
import AIModal from './components/AIModal';

const LOCAL_STORAGE_KEY = 'split_bill_data';

const createEmptyPerson = (): Person => ({
  id: Math.random().toString(36).substr(2, 9),
  name: '',
  description: '',
  paid: 0,
  weight: 1,
  pix: ''
});

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        // Migration: Ensure weight property exists
        setPeople(loaded.map((p: any) => ({ ...p, weight: p.weight ?? 1 })));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    } else {
      // Initial state with one empty person
      setPeople([createEmptyPerson()]);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever people change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(people));
    }
  }, [people, isLoaded]);

  // Auto-add empty row logic
  useEffect(() => {
    if (!isLoaded) return;

    const lastPerson = people[people.length - 1];

    // Check if the last person is truly empty
    const isLastEmpty = !lastPerson || (
      !lastPerson.name.trim() &&
      !lastPerson.description?.trim() &&
      !lastPerson.pix?.trim() &&
      lastPerson.paid === 0 &&
      (lastPerson.weight === 1 || lastPerson.weight === undefined)
    );

    // If the last person has started typing, add a new empty row
    if (!isLastEmpty) {
      setPeople(prev => [...prev, createEmptyPerson()]);
    }
  }, [people, isLoaded]);

  const updatePerson = (id: string, field: 'name' | 'paid' | 'description' | 'weight' | 'pix', value: string | number) => {
    setPeople(people.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Tem certeza que deseja limpar tudo?")) {
      setPeople([createEmptyPerson()]);
    }
  };

  const handleAIImport = (importedPeople: Person[]) => {
    // Determine if we are starting fresh or merging
    // Check if list is effectively empty (only contains empty rows)
    const isEffectiveEmpty = people.every(p => !p.name.trim() && p.paid === 0);

    let baseList = isEffectiveEmpty ? [] : [...people];

    // Remove any trailing empty rows from baseList before merging to keep it clean
    baseList = baseList.filter(p => p.name.trim() || p.description?.trim() || p.paid > 0);

    // Smart Merge Logic: Combine imported people into the list, merging duplicates
    importedPeople.forEach(imported => {
      const existingIndex = baseList.findIndex(
        p => p.name.trim().toLowerCase() === imported.name.trim().toLowerCase()
      );

      if (existingIndex >= 0) {
        // Merge with existing person
        const existing = baseList[existingIndex];
        // Combine descriptions
        const newDesc = [existing.description, imported.description].filter(Boolean).join(', ');

        baseList[existingIndex] = {
          ...existing,
          paid: existing.paid + imported.paid,
          description: newDesc
        };
      } else {
        // Add new person
        baseList.push({ ...imported, weight: imported.weight ?? 1 });
      }
    });

    // The useEffect will automatically append an empty row after this update because the last one won't be empty
    setPeople(baseList);
  };

  // Check for duplicates within the current list for validation UI
  const getDuplicateIds = (list: Person[]) => {
    const nameCounts: Record<string, number> = {};
    list.forEach(p => {
      const normalized = p.name.trim().toLowerCase();
      if (normalized) {
        nameCounts[normalized] = (nameCounts[normalized] || 0) + 1;
      }
    });

    return new Set(
      list.filter(p => {
        const normalized = p.name.trim().toLowerCase();
        return normalized && nameCounts[normalized] > 1;
      }).map(p => p.id)
    );
  };

  const duplicateIds = getDuplicateIds(people);
  const hasDuplicates = duplicateIds.size > 0;

  // Only calculate result if no duplicates and valid names exist
  const validPeople = people.filter(p => p.name.trim() !== '');
  const splitResult = (!hasDuplicates && validPeople.length > 0)
    ? calculateSplit(validPeople)
    : { total: 0, perPerson: 0, transactions: [] };

  const hasValidPeople = validPeople.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Divisão Justa
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" /></svg>
              IA Mágica
            </button>
            <button
              onClick={clearAll}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent rounded-lg transition-all"
              title="Limpar tudo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 grid gap-8">

        {/* Input Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Pessoas & Gastos</h2>
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
              Importar com IA
            </button>
          </div>

          <div className="space-y-4">
            {people.map((person, index) => (
              <PersonRow
                key={person.id}
                person={person}
                isLast={index === people.length - 1}
                isDuplicate={duplicateIds.has(person.id)}
                onChange={updatePerson}
                onRemove={removePerson}
              />
            ))}
          </div>

          {/* Manual Add Button removed in favor of auto-add logic */}
        </section>

        {/* Results Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Resultado da Divisão</h2>
          {hasDuplicates ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-700 font-bold mb-1">Nomes duplicados encontrados</p>
              <p className="text-red-600 text-sm">Por favor, corrija os nomes repetidos para ver o resultado da divisão.</p>
            </div>
          ) : (
            <Results result={splitResult} hasPeople={hasValidPeople} people={validPeople} />
          )}
        </section>
      </main>

      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onImport={handleAIImport}
      />
    </div>
  );
};

export default App;