# Wake-Up — estado atual (28/03/2026)

## O que é este projeto
Página de recrutamento do cliente Rafa Alves — captação de leads via tráfego pago para consultores de proteção de veículos (Salvador, BA).

## Status: PRODUÇÃO ✅
Tudo implantado e funcionando.

## URLs
- **Página:** https://eloquent-axolotl-f95583.netlify.app
- **Domínio:** clubmindrecrutamento.com.br ✅ DNS propagado, SSL provisionado
- **Página de obrigado:** /obrigado.html

## DNS (Hostinger)
- A `@` → `75.2.60.5` (Netlify load balancer) ✅
- CNAME `www` → `eloquent-axolotl-f95583.netlify.app` ✅
- AAAA `@` removido (estava causando redirect para .netlify.app) ✅

## Apps Script — Versão 4 (atual)
- **URL ativa:** https://script.google.com/macros/s/AKfycbwJTAGKQSfQoQN_-Pge5lqbJaQdiyNN2nN_pOqIhQAh6JTzeuLkbZGta0URA09FfSsT/exec
- Conta Google: escrevacertoevendamais@gmail.com
- **Atenção:** cada "Nova implantação" gera URL nova — sempre usar "Gerenciar implantações → lápis → Nova versão" para manter a mesma URL

## Planilha Google Sheets
- ID: `1OqXhDiozaOiLNaSqp9ZzbkJNPNp-yidiOlusRuOAss8`
- Colunas: Data | Nome | E-mail | WhatsApp | Ocupação | Cidade

## Mensagem WhatsApp (pós formulário)
Enviada pelo Apps Script via Evolution API:
```
Olá, [Primeiro Nome]! 👋

Parabéns pelo interesse! Essa busca por algo que realmente pode te levar a um novo patamar de resultado já diz muito sobre você. 🚀

Posso te explicar rapidinho como funciona essa oportunidade?
```

## Fluxo ao preencher o formulário
1. Formulário envia POST para Apps Script
2. Apps Script salva na planilha (6 campos: data, nome, email, whatsapp, ocupacao, cidade)
3. Envia mensagem WhatsApp via Evolution API (instância: `rafa_alves_recrutamento`)
4. Adiciona tag `recrutamento_rafa` → aguarda lead responder para ativar agente n8n
5. Envia webhook n8n → insere lead no Supabase
6. Redireciona para obrigado.html

## Agente n8n
- Só age quando o lead RESPONDE a mensagem (não dispara mensagem inicial)
- Webhook: https://webhook.dev.solucoesdeia.com/webhook/recrutamento-rafa-lead_inserelead
- Tabela Supabase: `rafa_alves_recrutamento_leads`

## Arquivos do projeto
- `site/index.html` — página principal (deploy no Netlify)
- `site/pagina-recrutamento.html` — cópia da página
- `site/obrigado.html` — página pós-formulário
- `apps-script-planilha.gs` — código do Apps Script

## Pendente
- Nenhum pendente no momento ✅
