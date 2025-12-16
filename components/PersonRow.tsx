import React from 'react';
import { Person } from '../types';

interface PersonRowProps {
  person: Person;
  isDuplicate: boolean;
  isLast: boolean;
  onChange: (id: string, field: 'name' | 'paid' | 'description' | 'weight', value: string | number) => void;
  onRemove: (id: string) => void;
}

const PersonRow: React.FC<PersonRowProps> = ({ person, isDuplicate, isLast, onChange, onRemove }) => {
  return (
    <div className={`flex flex-col md:flex-row gap-3 items-start md:items-center bg-white p-4 rounded-lg shadow-sm border animate-fade-in hover:shadow-md transition-shadow relative ${isDuplicate ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'}`}>

      {/* Name Field */}
      <div className="flex-1 w-full min-w-[200px]">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Nome</label>
        <div className="relative">
          <input
            type="text"
            value={person.name}
            onChange={(e) => onChange(person.id, 'name', e.target.value)}
            placeholder="Nome (ex: João)"
            className={`w-full px-4 py-2.5 bg-slate-50 border text-slate-900 placeholder-slate-500 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium ${isDuplicate ? 'border-red-400 focus:ring-red-500' : 'border-slate-300'}`}
          />
          {isDuplicate && (
            <span className="absolute right-3 top-2.5 text-red-500 text-xs font-bold bg-white px-1 rounded">
              Já existe
            </span>
          )}
        </div>
      </div>

      {/* Description Field */}
      <div className="flex-[1.5] w-full">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Descrição (Opcional)</label>
        <input
          type="text"
          value={person.description || ''}
          onChange={(e) => onChange(person.id, 'description', e.target.value)}
          placeholder="O que pagou? (ex: Pizza)"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm"
        />
      </div>

      {/* Weight Field */}
      <div className="flex-1 w-full md:w-20 md:max-w-[80px]">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Peso</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={person.weight || ''}
          onChange={(e) => onChange(person.id, 'weight', parseFloat(e.target.value) || 0)}
          placeholder="1"
          title="Peso da divisão (Padrão: 1)"
          className="w-full px-2 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm text-left"
        />
      </div>

      {/* Amount Field */}
      <div className="flex-1 w-full md:w-auto md:max-w-[160px] relative">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 md:hidden">Valor Pago</label>
        <span className="absolute left-3 top-[34px] md:top-3 text-slate-600 font-semibold text-sm">R$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={person.paid || ''}
          onChange={(e) => onChange(person.id, 'paid', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium"
        />
      </div>

      {/* Remove Button - Hidden for the last "placeholder" row */}
      {!isLast && (
        <button
          onClick={() => onRemove(person.id)}
          className="w-full md:w-auto p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 self-end md:self-center flex justify-end md:justify-center"
          title="Remover pessoa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      )}

      {/* Spacer for alignment if button is hidden on desktop */}
      {isLast && (
        <div className="hidden md:block w-[42px]"></div>
      )}
    </div>
  );
};

export default PersonRow;