// ==========================================
// CONFIGURAÇÃO EVOLUTION API
// ==========================================
const EVOLUTION_URL = 'https://painelsana-evolution-api.mofsig.easypanel.host';
const EVOLUTION_INSTANCE = 'rafa_alves_recrutamento';
const EVOLUTION_API_KEY = 'A1E94F2E18C9-4F0F-B43F-A94103212850';

// Seu número de WhatsApp para receber as notificações (sem +)
const SEU_WHATSAPP = '5511999999999'; // Altere para seu número

// ==========================================
// RECEBER DADOS DO FORMULÁRIO
// ==========================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const nome = data.nome || '';
    const email = data.email || '';
    const whatsapp = data.whatsapp || '';
    const ocupacao = data.ocupacao || '';
    const cidade = data.cidade || '';
    const dataAtual = data.data || '';

    // Validar dados
    if (!nome || !email || !whatsapp || !ocupacao || !cidade) {
      return ContentService.createTextOutput('Dados incompletos').setMimeType(ContentService.MimeType.JSON);
    }

    // 1️⃣ SALVAR NA PLANILHA
    salvarNaPlanilha(nome, email, whatsapp, ocupacao, cidade, dataAtual);

    // 2️⃣ ENVIAR MENSAGEM VIA EVOLUTION API
    enviarWhatsApp(nome, email, whatsapp, ocupacao, cidade);

    return ContentService.createTextOutput('Sucesso').setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Erro: ' + err.toString());
    return ContentService.createTextOutput('Erro: ' + err.toString()).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// SALVAR NA PLANILHA
// ==========================================
function salvarNaPlanilha(nome, email, whatsapp, ocupacao, cidade, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0]; // Primeira aba

  // Adicionar dados na próxima linha
  sheet.appendRow([
    new Date(),        // A: Timestamp
    nome,              // B: Nome
    email,             // C: Email
    whatsapp,          // D: WhatsApp
    ocupacao,          // E: Ocupação
    cidade,            // F: Cidade
    data               // G: Data
  ]);

  Logger.log('✅ Salvo na planilha: ' + nome);
}

// ==========================================
// ENVIAR WHATSAPP VIA EVOLUTION API
// ==========================================
function enviarWhatsApp(nome, email, whatsapp, ocupacao, cidade) {
  try {
    // Mensagem para o CLIENTE
    const mensagemCliente = `*🎉 Bem-vindo ao Club Mind!*

Olá *${nome}*! 👋

Recebemos sua inscrição com sucesso!

📋 *Seus dados:*
• Nome: ${nome}
• Email: ${email}
• Ocupação: ${ocupacao}
• Cidade: ${cidade}

Em breve você receberá um contato do nosso time com mais detalhes sobre a oportunidade.

Qualquer dúvida, é só chamar! 💬

_Club Mind - Recrutamento_`;

    // Formatar WhatsApp do cliente
    const whatsappCliente = formatarWhatsApp(whatsapp);

    // Enviar para o cliente
    enviarMensagemEvolution(whatsappCliente, mensagemCliente);
    Logger.log('✅ WhatsApp enviado para cliente: ' + whatsappCliente);

    // Mensagem para VOCÊ (notificação de novo lead)
    const mensagemNotificacao = `*📱 NOVO LEAD RECEBIDO!*

Nome: ${nome}
Email: ${email}
WhatsApp: ${whatsapp}
Ocupação: ${ocupacao}
Cidade: ${cidade}

⏰ ${new Date().toLocaleString('pt-BR')}`;

    // Enviar notificação para você
    enviarMensagemEvolution(SEU_WHATSAPP, mensagemNotificacao);
    Logger.log('✅ Notificação enviada para você');

  } catch (err) {
    Logger.log('❌ Erro ao enviar WhatsApp: ' + err.toString());
  }
}

// ==========================================
// FUNÇÃO PARA ENVIAR MENSAGEM (Evolution API)
// ==========================================
function enviarMensagemEvolution(telefone, mensagem) {
  const url = EVOLUTION_URL + '/message/sendText/' + EVOLUTION_INSTANCE;

  const payload = {
    number: telefone,
    text: mensagem
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 200 || responseCode === 201) {
      Logger.log('✅ Mensagem enviada: ' + telefone);
      return true;
    } else {
      Logger.log('❌ Erro Evolution API: ' + response.getContentText());
      return false;
    }
  } catch (err) {
    Logger.log('❌ Erro fetch: ' + err.toString());
    return false;
  }
}

// ==========================================
// FORMATAR WHATSAPP
// ==========================================
function formatarWhatsApp(whatsapp) {
  // Remove caracteres não numéricos
  let numeros = whatsapp.replace(/\D/g, '');

  // Se não tiver código de país, adiciona 55 (Brasil)
  if (numeros.length === 10 || numeros.length === 11) {
    numeros = '55' + numeros;
  }

  return numeros;
}

// ==========================================
// FUNÇÃO onEdit (JÁ EXISTENTE - MANTER)
// ==========================================
function onEdit(e) {
  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();
  if (row < 2) return;

  let valor = range.getValue();
  if (!valor) return;

  // CPF – coluna C (3)
  if (col === 3) {
    let cpf = valor.toString().replace(/\D/g, '');
    if (cpf.length !== 11) return;
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    SpreadsheetApp.getActive().toast('Formatando...', '', 1);
    range.setValue(cpf);
    return;
  }

  // DATA NASCIMENTO – coluna G (7)
  if (col === 7) {
    let dia, mes, ano;

    if (typeof valor === 'object' && valor instanceof Date) {
      return;
    }

    if (typeof valor === 'string' && valor.includes('/')) {
      const partes = valor.split('/');
      dia = partes[0].padStart(2, '0');
      mes = partes[1].padStart(2, '0');
      ano = partes[2].length === 2
        ? Number(partes[2]) <= 30
          ? '20' + partes[2]
          : '19' + partes[2]
        : partes[2];
    } else {
      const texto = valor.toString().replace(/\D/g, '').padStart(8, '0');
      dia = texto.substring(0, 2);
      mes = texto.substring(2, 4);
      ano = texto.substring(4, 8);
    }

    const data = new Date(ano, mes - 1, dia);
    range.setValue(data);
    range.setNumberFormat('dd/MM/yyyy');
    return;
  }

  // CEP – coluna J (10)
  if (col === 10) {
    let cep = valor.toString().replace(/\D/g, '');
    if (cep.length !== 8) return;
    cep = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    range.setValue(cep);
    return;
  }

  // TELEFONE – coluna K (11)
  if (col === 11) {
    let tel = valor.toString().replace(/\D/g, '');

    if (tel.length === 10) {
      tel = tel.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2.$3');
    } else if (tel.length === 11) {
      tel = tel.replace(/(\d{2})(\d{5})(\d{4})/, '$1-$2.$3');
    } else {
      return;
    }

    range.setValue(tel);
    return;
  }
}
