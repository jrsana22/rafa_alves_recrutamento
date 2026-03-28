# Wake-Up — estado atual (28/03/2026)

## O que é este projeto
Página de recrutamento do cliente Rafa Alves — captação de leads via tráfego pago para consultores de proteção de veículos (Salvador, BA).

## Status: PRODUÇÃO ✅
Tudo implantado e funcionando.

## URLs
- **Página:** https://eloquent-axolotl-f95583.netlify.app
- **Domínio:** clubmindrecrutamento.com.br (redirect para Netlify, pode levar até 1h para propagar)
- **Página de obrigado:** /obrigado.html

## Apps Script
- **URL:** https://script.google.com/macros/s/AKfycby6CLRLzUu3wp2lxkYkjcQpswO0IXeJ3A13lqvKFd6ga2VmtPJxEoZmS8O9BE_5Z1dZ/exec
- Conta Google: escrevacertoevendamais@gmail.com

## Fluxo ao preencher o formulário
1. Salva na planilha Google Sheets (ID: `1OqXhDiozaOiLNaSqp9ZzbkJNPNp-yidiOlusRuOAss8`)
2. Envia WhatsApp automático via Evolution API (`rafa_alves_recrutamento`)
3. Adiciona tag `recrutamento_rafa`
4. Registra lead no Supabase via webhook n8n
5. Redireciona para obrigado.html

## n8n
- Webhook Supabase: https://webhook.dev.solucoesdeia.com/webhook/recrutamento-rafa-lead_inserelead
- Fluxo: RAFA ALVES - RECRUTAMENTO
- Tabela Supabase: `rafa_alves_recrutamento_leads` (campos: remotejid, nome_associado)

## Pendente
- Verificar se redirect do domínio propagou (aguardar até 1h)
- Testar formulário completo em produção
