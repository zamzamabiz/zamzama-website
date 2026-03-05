/*
Apps Script: Trade Inquiry handler for Zamzama Corporation
Paste this into your Google Apps Script project and deploy as a Web App (Execute as: Me, Who has access: Anyone).

Behavior:
- Accepts JSON or form POSTs
- Handles OPTIONS for CORS preflight
- Sends email via GmailApp to zamzamabiz@gmail.com
- Uses contact@zamzamacorporation.com as reply-to
- Returns JSON { success: true } on success
*/

function _corsHeaders(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin','*')
    .setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS')
    .setHeader('Access-Control-Allow-Headers','Content-Type');
}

function doOptions(e) {
  return _corsHeaders(ContentService.createTextOutput(JSON.stringify({}))); // empty 200
}

function _parseRequest(e) {
  try {
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      return JSON.parse(e.postData.contents || '{}');
    }
    // form-encoded params
    if (e.parameter && Object.keys(e.parameter).length) return e.parameter;
    // fallback: raw contents
    if (e.postData && e.postData.contents) return JSON.parse(e.postData.contents);
  } catch (err) {
    Logger.log('parse error: ' + err.message);
  }
  return {};
}

function doPost(e) {
  try {
    var body = _parseRequest(e);
    Logger.log('Received payload: %s', JSON.stringify(body));

    var subject = 'New Trade Inquiry — Zamzama Corporation';
    var html = '<h3>New Trade Inquiry Received</h3><table border="0" cellpadding="4">';
    for (var k in body) {
      if (!Object.prototype.hasOwnProperty.call(body, k)) continue;
      html += '<tr><td style="font-weight:600;vertical-align:top;">' + k + '</td><td>' + (body[k] || '') + '</td></tr>';
    }
    html += '</table>';

    // Send email as the account that deploys the script (zamzamabiz@gmail.com)
    GmailApp.sendEmail('zamzamabiz@gmail.com', subject, '', {
      htmlBody: html,
      replyTo: 'contact@zamzamacorporation.com'
    });

    return _corsHeaders(ContentService.createTextOutput(JSON.stringify({ success: true })));
  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return _corsHeaders(ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })));
  }
}
