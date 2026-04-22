// =============================================
// GOOGLE APPS SCRIPT — Mesa dos Donos
// Salva os cadastros do formulário na planilha
// =============================================
//
// COMO CONFIGURAR:
// 1. Abra o Google Sheets e crie uma planilha chamada "Cadastros Mesa dos Donos"
// 2. Na aba da planilha, vá em Extensões > Apps Script
// 3. Cole todo esse código e salve (Ctrl+S)
// 4. Clique em "Implantações" > "Nova implantação"
// 5. Tipo: "Aplicativo da Web"
// 6. Executar como: "Eu"
// 7. Quem tem acesso: "Qualquer pessoa"
// 8. Clique em "Implantar" e copie a URL gerada
// 9. Cole essa URL no campo GOOGLE_SCRIPT_URL do arquivo HTML do site
// =============================================

const SHEET_NAME = 'Cadastros'; // nome da aba na planilha

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Cria a aba se não existir
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Cria cabeçalho se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora',
        'Nome',
        'WhatsApp',
        'E-mail',
        'Instagram / Site',
        'Segmento',
        'Status'
      ]);

      // Formata o cabeçalho
      const header = sheet.getRange(1, 1, 1, 7);
      header.setFontWeight('bold');
      header.setBackground('#C9A84C');
      header.setFontColor('#000000');
    }

    // Parseia os dados recebidos
    const data = JSON.parse(e.postData.contents);

    // Adiciona a nova linha
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('pt-BR'),
      data.nome || '',
      data.whatsapp || '',
      data.email || '',
      data.instagram || '',
      data.segmento || '',
      'Pendente' // Status inicial — mude para "Aprovado" quando enviar o link
    ]);

    // Retorna sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste — execute manualmente para verificar se está funcionando
function testar() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString('pt-BR'),
        nome: 'João Teste',
        whatsapp: '(11) 99999-9999',
        email: 'joao@teste.com',
        instagram: '@joaoteste',
        segmento: 'Varejo / Comércio'
      })
    }
  };
  const resultado = doPost(fakeEvent);
  Logger.log(resultado.getContent());
}
