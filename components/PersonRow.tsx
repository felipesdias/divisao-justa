import React from 'react';
import { Person } from '../types';

interface PersonRowProps {
  person: Person;
  isDuplicate: boolean;
  isLast: boolean;
  onChange: (id: string, field: 'name' | 'paid' | 'description' | 'weight' | 'pix', value: string | number) => void;
  onRemove: (id: string) => void;
}

const PersonRow: React.FC<PersonRowProps> = ({ person, isDuplicate, isLast, onChange, onRemove }) => {
  return (
    <div className={`group flex flex-col md:flex-row gap-3 items-start md:items-center bg-white p-4 md:py-3 md:px-4 rounded-lg shadow-sm border animate-fade-in hover:shadow-md transition-all relative ${isDuplicate ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'}`}>

      {/* Name Field */}
      <div className="w-full md:flex-[2] min-w-0">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Nome</label>
        <div className="relative">
          <input
            type="text"
            value={person.name}
            onChange={(e) => onChange(person.id, 'name', e.target.value)}
            placeholder="Nome"
            className={`w-full px-3 py-2 bg-slate-50 border text-slate-900 placeholder-slate-400 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-sm ${isDuplicate ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'}`}
          />
          {isDuplicate && (
            <span className="absolute right-3 top-2.5 text-red-500 text-xs font-bold bg-white px-1 rounded">
              !
            </span>
          )}
        </div>
      </div>

      {/* Description Field */}
      <div className="w-full md:flex-[2] min-w-0">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Descrição</label>
        <input
          type="text"
          value={person.description || ''}
          onChange={(e) => onChange(person.id, 'description', e.target.value)}
          placeholder="Ex: Pizza"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm"
        />
      </div>

      {/* PIX Field */}
      <div className="w-full md:flex-[1.5] min-w-0">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">PIX</label>
        <input
          type="text"
          value={person.pix || ''}
          onChange={(e) => onChange(person.id, 'pix', e.target.value)}
          placeholder="Chave PIX"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm"
        />
      </div>

      {/* Weight Field */}
      <div className="w-full md:w-20 flex-none">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Peso</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={person.weight || ''}
          onChange={(e) => onChange(person.id, 'weight', parseFloat(e.target.value) || 0)}
          placeholder="1"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm text-center"
        />
      </div>

      {/* Amount Field */}
      <div className="w-full md:w-32 flex-none relative">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Valor</label>
        <span className="absolute left-3 top-[32px] md:top-2 text-slate-500 font-medium text-sm">R$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={person.paid || ''}
          onChange={(e) => onChange(person.id, 'paid', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-sm text-right"
        />
      </div>

      {/* Actions */}
      <div className="w-full md:w-10 flex-none flex justify-end md:justify-center">
        {!isLast ? (
          <button
            onClick={() => onRemove(person.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remover"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        ) : (
          <div className="w-9 h-9"></div> // Spacer
        )}
      </div>
    </div>
  );
};

export default PersonRow;