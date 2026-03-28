---
name: project_recrutamento
description: Página de recrutamento de consultores para Rafael Alves — formulário + WhatsApp automático
type: project
---

Página criada para Rafael Alves recrutar consultores via tráfego pago (campanha em Salvador, BA).

**Arquivos locais (Downloads):**
- `pagina-recrutamento.html` — landing page completa (dark theme, layout igual ao site solucoesdeia.com)
- `apps-script-planilha.gs` — backend Google Apps Script (salva planilha + envia WhatsApp + adiciona tag n8n)
- `depoimento_rafa_alves.mp4` — vídeo de depoimento disponível (ainda não inserido na página)

**Fluxo ao preencher o formulário:**
1. Usuário preenche: nome, WhatsApp, ocupação atual, cidade de atuação
2. Apps Script salva na planilha com data dd/mm/aaaa
3. Apps Script envia mensagem automática no WhatsApp do lead via Evolution API
4. Apps Script adiciona tag `recrutamento_rafa` no contato → ativa fluxo n8n (fluxo ainda a ser enviado pelo Rafael)

**Mensagem enviada ao lead:**
> Olá, *[nome]*! 👋
> Parabéns pelo interesse! Essa busca por algo que realmente pode te levar a um novo patamar de resultado já diz muito sobre você. 🚀
> Posso te explicar rapidinho como funciona essa oportunidade?

**Pendente:**
- Implantar apps-script-planilha.gs como Web App e colar URL no HTML (variável `APPS_SCRIPT_URL`)
- Hospedar página online (opções: Netlify, Vercel, Lovable)
- Receber fluxo n8n do Rafael para configurar o `labelId` correto da tag
- Decidir se insere vídeo de depoimento na página

**Why:** Rafael quer qualificar leads antes de atender no WhatsApp, evitar curiosos e só ativar a IA para quem veio do formulário.
**How to apply:** Ao retomar esse projeto, verificar se o Apps Script já foi implantado e se a página já está hospedada.
