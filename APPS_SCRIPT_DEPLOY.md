**Deploying the Apps Script and Cloudflare checklist**

Steps to deploy Apps Script:

1. Open https://script.google.com and create a new project.
2. Replace `Code.gs` contents with the file `apps_script.gs` from the workspace.
3. Save.
4. Click `Deploy` → `New deployment`.
   - Select `Web app`.
   - For `Description` use: `Zamzama trade inquiry webhook`.
   - `Execute as`: **Me** (your Google account, must be zamzamabiz@gmail.com if you want emails sent from that account).
   - `Who has access`: **Anyone** or **Anyone, even anonymous** (choose anonymous if the site isn't authenticated).
5. Click `Deploy` → Authorize if prompted and grant Gmail/send permissions.
6. Copy the Web app URL and ensure it matches `APP_SCRIPT_URL` in `index.html`.

Cloudflare Email Routing (inbound) checklist:

- In Cloudflare dashboard -> Email -> Email Routing:
  - Create a custom address `contact@zamzamacorporation.com` and forward it to `zamzamabiz@gmail.com`.
  - Cloudflare will create required MX records. Ensure those are published for the domain.

DNS / SPF notes (optional but recommended):
- Add an SPF TXT record allowing Gmail to send: `v=spf1 include:_spf.google.com ~all` (if you're using Google Workspace; for a consumer Gmail account this is optional).
- DKIM signing is only available for Google Workspace; consumer Gmail can't sign as your domain.

Testing & troubleshooting:

1. In browser DevTools -> Network, submit the "Send a Trade Inquiry" form.
   - Check the POST to the Apps Script URL.
   - Expect HTTP 200 and JSON `{"success":true}`.
   - If non-200, open the response body for error text.
2. Check the script logs: script.google.com -> Executions or View -> Logs.
3. Check `zamzamabiz@gmail.com` Sent folder (script sends via GmailApp) and Inbox for forwarded inbound messages.
4. If CORS/preflight fails, ensure the deployment settings allow public access and the Apps Script code has the OPTIONS/doOptions support (present in `apps_script.gs`).

If you want, I can: 
- Add a small debug button to the contact form that sends a test payload and shows response.
- Walk through your Cloudflare Email Routing UI steps interactively.
