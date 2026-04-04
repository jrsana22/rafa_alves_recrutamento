/**
 * Google Apps Script — Backend da Página de Recrutamento
 *
 * COMO IMPLANTAR:
 *  1. Acesse https://script.google.com → Novo projeto
 *  2. Cole todo este código
 *  3. Clique em "Implantar" → "Nova implantação"
 *  4. Tipo: App da Web
 *     Executar como: Eu mesmo
 *     Acesso: Qualquer pessoa
 *  5. Copie a URL gerada e cole em pagina-recrutamento.html na variável SHEETS_URL
 */

var SHEET_ID     = '1OqXhDiozaOiLNaSqp9ZzbkJNPNp-yidiOlusRuOAss8';
var EVO_URL      = 'https://painelsana-evolution-api.mofsig.easypanel.host';
var EVO_INSTANCE = 'rafa_alves_recrutamento';
var EVO_APIKEY   = 'A1E94F2E18C9-4F0F-B43F-A94103212850';
var N8N_WEBHOOK_DISPARA = 'https://webhook.dev.solucoesdeia.com/webhook/dispara_rafa_lead';
var RAFA_WHATSAPP = '5571987804910';  // Número do Rafa para disparar mensagens

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    // ── Salva na planilha ──
    var planilha = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Cria cabeçalhos se a planilha estiver vazia
    if (planilha.getLastRow() === 0) {
      planilha.appendRow(['Data', 'Nome Completo', 'E-mail', 'WhatsApp', 'Ocupação', 'Cidade']);
      planilha.getRange(1, 1, 1, 6).setFontWeight('bold');
    }

    // Formata data dd/mm/aaaa (fuso de Brasília)
    var agora = new Date();
    var tz = 'America/Bahia';
    var dataFormatada = Utilities.formatDate(agora, tz, 'dd/MM/yyyy');

    planilha.appendRow([
      dataFormatada,
      dados.nome,
      dados.email,
      dados.whatsapp,
      dados.ocupacao,
      dados.cidade
    ]);

    // ── Envia mensagem WhatsApp via Evolution API (DO RAFA PARA O CLIENTE) ──
    var mensagem =
      'Olá, ' + dados.nome.split(' ')[0] + '! 👋\n\n' +
      'Parabéns pelo interesse! Essa busca por algo que realmente pode te levar a um novo patamar de resultado já diz muito sobre você. 🚀\n\n' +
      'Posso te explicar rapidinho como funciona essa oportunidade?';

    // Envia a mensagem do Rafa para o número do cliente
    var payload = JSON.stringify({
      number: dados.whatsapp,
      text: mensagem
    });
    var opcoes = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'apikey': EVO_APIKEY },
      payload: payload,
      muteHttpExceptions: true
    };

    // Usa a instância "rafa_alves_recrutamento" que já está configurada com o número do Rafa
    UrlFetchApp.fetch(EVO_URL + '/message/sendText/' + EVO_INSTANCE, opcoes);

    // ── Adiciona tag "Lead Consultor - IA" no cliente ──
    var tagClientePayload = JSON.stringify({
      number: dados.whatsapp,
      labelId: '51',  // 51 = Lead Consultor - IA
      action: 'add'
    });
    var tagClienteOpcoes = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'apikey': EVO_APIKEY },
      payload: tagClientePayload,
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(EVO_URL + '/chat/handleLabel/' + EVO_INSTANCE, tagClienteOpcoes);

    // ── Adiciona tag "LEAD CONSULTOR - IA" no número do Rafa ──
    var tagRafaPayload = JSON.stringify({
      number: RAFA_WHATSAPP,
      labelId: 'LEAD CONSULTOR - IA',
      action: 'add'
    });
    var tagRafaOpcoes = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'apikey': EVO_APIKEY },
      payload: tagRafaPayload,
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(EVO_URL + '/chat/handleLabel/' + EVO_INSTANCE, tagRafaOpcoes);

    // ── Dispara webhook n8n para enviar mensagem ──
    var disparaPayload = JSON.stringify({
      whatsapp: dados.whatsapp,
      nome: dados.nome,
      email: dados.email,
      ocupacao: dados.ocupacao,
      cidade: dados.cidade
    });
    var disparaOpcoes = {
      method: 'post',
      contentType: 'application/json',
      payload: disparaPayload,
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(N8N_WEBHOOK_DISPARA, disparaOpcoes);

    return resposta({ status: 'ok' });

  } catch (err) {
    return resposta({ status: 'erro', mensagem: err.toString() });
  }
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
