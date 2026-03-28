# Wake-Up — primeira sessão

## O que é este projeto
Página de recrutamento do cliente Rafa Alves — captação de leads via tráfego pago para consultores de proteção de veículos (Salvador, BA).

## O que está em andamento
Página pronta (`pagina-recrutamento.html`). Backend pronto (`apps-script-planilha.gs`).
Aguardando: implantar Apps Script como Web App e hospedar a página online.

## Próximos Passos
1. Implantar `apps-script-planilha.gs` no Google Apps Script e colar a URL gerada no HTML (variável `APPS_SCRIPT_URL`)
2. Hospedar `pagina-recrutamento.html` online (Netlify, Vercel ou Lovable)
3. Receber fluxo n8n do Rafael para configurar o `labelId` correto da tag `recrutamento_rafa`
4. Decidir se insere o vídeo `depoimento_rafa_alves.mp4` na página

## Mensagem enviada ao lead ao preencher o formulário
"Primeiramente parabéns pela atitude e decisão em participar do nosso processo de seleção para novos empreendedores.

Você acabou de preencher um formulário com interesse na vaga em trabalhar com proteção de veículos. Posso te explicar rapidinho sobre a oportunidade que temos aqui?"

## Atenção
- A variável `APPS_SCRIPT_URL` no HTML ainda está com placeholder — não funciona sem isso
- Planilha Google Sheets ID: `1OqXhDiozaOiLNaSqp9ZzbkJNPNp-yidiOlusRuOAss8`
- Evolution API instância: `rafa_alves_recrutamento` | Key: `A1E94F2E18C9-4F0F-B43F-A94103212850`
