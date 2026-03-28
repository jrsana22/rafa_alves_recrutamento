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
var N8N_WEBHOOK  = 'https://webhook.dev.solucoesdeia.com/webhook/recrutamento-rafa-lead_inserelead';

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    // ── Salva na planilha ──
    var planilha = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Cria cabeçalhos se a planilha estiver vazia
    if (planilha.getLastRow() === 0) {
      planilha.appendRow(['Data', 'Nome Completo', 'WhatsApp', 'Ocupação', 'Cidade']);
      planilha.getRange(1, 1, 1, 5).setFontWeight('bold');
    }

    // Formata data dd/mm/aaaa (fuso de Brasília)
    var agora = new Date();
    var tz = 'America/Bahia';
    var dataFormatada = Utilities.formatDate(agora, tz, 'dd/MM/yyyy');

    planilha.appendRow([
      dataFormatada,
      dados.nome,
      dados.whatsapp,
      dados.ocupacao,
      dados.cidade
    ]);

    // ── Envia mensagem WhatsApp via Evolution API ──
    var mensagem =
      'Primeiramente parabéns pela atitude e decisão em participar do nosso processo de seleção para novos empreendedores.';

    var payload = JSON.stringify({ number: dados.whatsapp, text: mensagem });
    var opcoes = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'apikey': EVO_APIKEY },
      payload: payload,
      muteHttpExceptions: true
    };

    UrlFetchApp.fetch(EVO_URL + '/message/sendText/' + EVO_INSTANCE, opcoes);

    // ── Adiciona tag para ativar fluxo n8n ──
    var tagPayload = JSON.stringify({
      number: dados.whatsapp,
      labelId: 'recrutamento_rafa',
      action: 'add'
    });
    var tagOpcoes = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'apikey': EVO_APIKEY },
      payload: tagPayload,
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(EVO_URL + '/chat/handleLabel/' + EVO_INSTANCE, tagOpcoes);

    // ── Registra lead no Supabase via n8n ──
    var supabasePayload = JSON.stringify({ whatsapp: dados.whatsapp, nome: dados.nome });
    var supabaseOpcoes = {
      method: 'post',
      contentType: 'application/json',
      payload: supabasePayload,
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(N8N_WEBHOOK, supabaseOpcoes);

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
