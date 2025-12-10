import React, { useState, useEffect } from 'react';
import { parseExpensesWithGemini } from '../services/geminiService';
import { Person, ParsingStatus } from '../types';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (people: Person[]) => void;
}

const LOCAL_STORAGE_API_KEY = 'gemini_custom_api_key';

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onImport }) => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<ParsingStatus>(ParsingStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // API Key management logic
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [tempKeyInput, setTempKeyInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setInputText('');
      setStatus(ParsingStatus.IDLE);
      setErrorMsg(null);

      // Check for API Key
      const envKey = process.env.API_KEY;
      const storedKey = localStorage.getItem(LOCAL_STORAGE_API_KEY);

      if (envKey) {
        setNeedsApiKey(false);
      } else if (storedKey) {
        setCustomApiKey(storedKey);
        setNeedsApiKey(false);
      } else {
        setNeedsApiKey(true);
      }
    }
  }, [isOpen]);

  const handleSaveKey = () => {
    if (!tempKeyInput.trim()) return;
    localStorage.setItem(LOCAL_STORAGE_API_KEY, tempKeyInput.trim());
    setCustomApiKey(tempKeyInput.trim());
    setNeedsApiKey(false);
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setStatus(ParsingStatus.LOADING);
    setErrorMsg(null);
    
    try {
      const result = await parseExpensesWithGemini(inputText, customApiKey);
      if (result.length === 0) {
        throw new Error("Nenhuma pessoa ou valor identificado.");
      }
      onImport(result);
      setStatus(ParsingStatus.SUCCESS);
      setTimeout(() => {
        onClose();
        setInputText('');
        setStatus(ParsingStatus.IDLE);
      }, 500);
    } catch (error: any) {
      setStatus(ParsingStatus.ERROR);
      setErrorMsg(error.message || "Erro desconhecido");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-5">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            Importar com IA
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            {needsApiKey 
              ? "Configuração necessária para continuar." 
              : "Cole uma lista ou descreva os gastos e deixe a mágica acontecer."}
          </p>
        </div>
        
        <div className="p-6">
          {needsApiKey ? (
            /* API KEY INPUT VIEW */
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Insira sua API Key do Gemini
                </label>
                <input
                  type="password"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="Cole sua chave aqui..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                />
                <p className="mt-2 text-sm text-slate-600">
                  Para utilizar a inteligência artificial, você precisa de uma chave gratuita do Google.
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mt-1 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
                  >
                    Obter chave API aqui 
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold border border-transparent"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveKey}
                  disabled={!tempKeyInput.trim()}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-sm"
                >
                  Salvar e Continuar
                </button>
              </div>
            </div>
          ) : (
            /* TEXT INPUT VIEW (EXISTING) */
            <>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Descreva os gastos
              </label>
              <textarea
                className="w-full h-36 p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none mb-4 text-base leading-relaxed"
                placeholder="Ex: Eu paguei 50 reais no uber, a Maria pagou 120 no jantar e o João deu 30 reais na bebida."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={status === ParsingStatus.LOADING}
              />
              
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-between items-center gap-3">
                 {!process.env.API_KEY && (
                    <button 
                        onClick={() => setNeedsApiKey(true)}
                        className="text-xs text-slate-400 hover:text-indigo-600 hover:underline"
                    >
                        Alterar API Key
                    </button>
                 )}
                 <div className="flex gap-3 ml-auto">
                    <button
                    onClick={onClose}
                    disabled={status === ParsingStatus.LOADING}
                    className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold border border-transparent"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleProcess}
                    disabled={status === ParsingStatus.LOADING || !inputText.trim()}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow"
                    >
                    {status === ParsingStatus.LOADING ? (
                        <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                        </>
                    ) : (
                        'Processar Texto'
                    )}
                    </button>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModal;