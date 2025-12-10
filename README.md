<div align="center">
  <!-- Você pode substituir essa imagem por um screenshot do seu app depois -->
  <h1>Divisão Justa (Split Bill)</h1>
</div>

Uma aplicação web moderna e inteligente para dividir contas entre amigos de forma justa e descomplicada. Desenvolvida com **React**, **Vite** e **Google Gemini AI**.

## ✨ Funcionalidades

*   **Divisão Simples:** Adicione pessoas, gastos e veja quanto cada um deve pagar ou receber.
*   **IA Mágica:** Cole um texto descrevendo os gastos (ex: copiado do WhatsApp) e a IA organiza tudo automaticamente.
*   **Interface Limpa:** Design responsivo e intuitivo.
*   **Sem Servidor:** Tudo roda no seu navegador. Os dados da IA são processados via chave de API inserida pelo usuário.

## 🚀 Como Rodar Localmente

1.  Clone o repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## 🌐 Deploy no GitHub Pages

Este projeto está pronto para ser hospedado gratuitamente no GitHub Pages. 

👉 **[Clique aqui para ver o guia passo-a-passo de Deploy](DEPLOY.md)**.

Basicamente, você só precisa rodar:

```bash
npm run deploy
```

E configurar o repositório no GitHub para ler a branch `gh-pages`.

## 🤖 Configuração da IA

Para usar a funcionalidade de "Importar com IA", você precisará de uma **API Key do Google Gemini** (gratuita).
A aplicação pedirá a chave quando você tentar usar a função pela primeira vez. A chave fica salva apenas no seu navegador.
