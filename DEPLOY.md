# 🚀 Como hospedar no GitHub Pages

Este projeto já está configurado para ser hospedado facilmente no GitHub Pages usando o pacote `gh-pages`.

## Passos para Deploy

1.  **Instale as dependências** (caso ainda não tenha feito):
    ```bash
    npm install
    ```

2.  **Execute o comando de deploy**:
    ```bash
    npm run deploy
    ```
    Isso irá automaticamente:
    *   Construir o projeto (`npm run build`)
    *   Criar uma branch chamada `gh-pages` com o conteúdo da pasta `dist`
    *   Enviar essa branch para o GitHub

## Configuração no GitHub

Após rodar o comando acima pela primeira vez:

1.  Vá até a página do seu repositório no GitHub.
2.  Clique em **Settings** (Configurações).
3.  No menu lateral esquerdo, clique em **Pages**.
4.  Em **Build and deployment** > **Source**, selecione **Deploy from a branch**.
5.  Em **Branch**, selecione `gh-pages` e a pasta `/ (root)`.
6.  Clique em **Save**.

Em instantes, o GitHub irá fornecer o link do seu site (algo como `https://seu-usuario.github.io/divisao-justa/`).

## ⚠️ Nota Importante sobre a IA (Gemini API)

Para que a funcionalidade "Importar com IA" funcione:
*   O usuário precisará inserir sua própria chave de API ao clicar no botão "Importar com IA".
*   A chave fica salva apenas no navegador do usuário (`localStorage`).
*   **Não** commite arquivos `.env` com sua chave pessoal. O botão de deploy é seguro pois o projeto pede a chave na interface se ela não existir.
