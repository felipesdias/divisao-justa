import React from 'react';
import { SplitResult, Person } from '../types';

interface ResultsProps {
  result: SplitResult;
  people: Person[];
  hasPeople: boolean;
}

const Results: React.FC<ResultsProps> = ({ result, people, hasPeople }) => {
  if (!hasPeople) {
    return (
      <div className="text-center py-12 px-4 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-50">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p>Adicione pessoas e gastos para ver o resultado.</p>
      </div>
    );
  }

  const handleShareWhatsApp = () => {
    let text = "*🧾 Divisão de Contas*\n\n";

    // 1. Descrição dos gastos
    text += "*🛒 Gastos:*\n";
    const activePeople = people.filter(p => p.name.trim() !== '' && p.paid > 0);

    if (activePeople.length === 0) {
      text += "_Nenhum gasto registrado_\n";
    } else {
      activePeople.forEach(p => {
        const desc = p.description ? ` (${p.description})` : "";
        const weight = p.weight !== 1 ? ` [Peso: ${p.weight}]` : "";
        text += `• ${p.name}${desc}${weight}: R$ ${p.paid.toFixed(2)}\n`;
      });
    }

    // 2. Totais
    text += `\n*💰 Total Geral:* R$ ${result.total.toFixed(2)}`;
    text += `\n*🔢 Média por pessoa:* R$ ${result.perPerson.toFixed(2)}\n\n`;

    // 3. Plano de pagamentos
    text += "*💳 Quem paga quem:*\n";
    if (result.transactions.length === 0) {
      text += "✅ Tudo certo! Ninguém deve nada.";
    } else {
      result.transactions.forEach(tx => {
        const receiver = people.find(p => p.name === tx.to);
        const pixText = receiver?.pix ? `\n    PIX: ${receiver.pix}` : "";

        text += `\n➤ *${tx.from}* paga R$ ${tx.amount.toFixed(2)} para *${tx.to}*${pixText}`;
      });
    }

    text += "\n-------------------\n";
    text += "_Gerado por Divisão Justa_: https://felipesdias.github.io/divisao-justa";

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 1.19 1.83 2.62 1.83 1.35 0 2.61-.72 2.61-2.11 0-1.22-.98-1.79-2.58-2.18l-1.61-.41c-1.95-.49-2.88-1.55-2.88-3.08 0-1.62 1.37-2.8 3.12-3.13V3.69h2.67v1.95c1.28.31 2.45 1.19 2.76 2.97h-2.02c-.25-1.04-1.25-1.57-2.31-1.57-1.31 0-2.38.76-2.38 1.92 0 1.14 1.05 1.63 2.55 2l1.62.4c2.2.55 3.02 1.68 3.02 3.29 0 1.66-1.28 2.9-3.26 3.46z" /></svg>
          </div>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide relative z-10">Total Gasto</p>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-1 relative z-10">
            R$ {result.total.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </div>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide relative z-10">Por Pessoa (Média)</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-900 mt-1 relative z-10">
            R$ {result.perPerson.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Plano de Pagamentos</h3>
            <p className="text-sm text-slate-500">Quem paga quem para equilibrar</p>
          </div>
          {result.transactions.length > 0 && (
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors font-semibold text-sm shadow-sm w-full sm:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
              Compartilhar no WhatsApp
            </button>
          )}
        </div>

        {result.transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <p className="font-medium">Tudo certo! Ninguém deve nada.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {result.transactions.map((tx, idx) => (
              <li key={idx} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 min-w-[40px] rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                    {tx.from.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-800">{tx.from}</span>
                      <span className="text-xs text-slate-500">paga para</span>
                      <span className="font-bold text-slate-800">{tx.to}</span>
                    </div>
                    {people.find(p => p.name === tx.to)?.pix && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          PIX: {people.find(p => p.name === tx.to)?.pix}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center sm:justify-end mt-1 sm:mt-0 pl-[52px] sm:pl-0">
                  <div className="font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm whitespace-nowrap">
                    R$ {tx.amount.toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Results;