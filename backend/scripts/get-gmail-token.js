/**
 * Gmail OAuth2 Token Generator
 * 
 * Run this ONCE locally to get your refresh token for Gmail API access.
 * 
 * Prerequisites:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project (or use existing)
 * 3. Enable "Gmail API" (APIs & Services > Library)
 * 4. Create OAuth 2.0 credentials:
 *    - APIs & Services > Credentials > Create Credentials > OAuth client ID
 *    - Application type: Desktop app
 *    - Download the JSON file
 * 5. Paste the contents of the downloaded JSON into GMAIL_CREDENTIALS in .env
 * 6. Run: node scripts/get-gmail-token.js
 * 7. Authorize in the browser, copy the code back to terminal
 * 8. Copy the refresh_token printed to your terminal into GMAIL_REFRESH_TOKEN in .env
 * 9. Also add both vars to Render's environment variables dashboard
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { google } = require('googleapis');
const readline = require('readline');

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
];

async function main() {
  const credentialsJson = process.env.GMAIL_CREDENTIALS;
  if (!credentialsJson || credentialsJson === 'your_gmail_credentials_json_here') {
    console.error('❌ GMAIL_CREDENTIALS not set in backend/.env');
    console.error('   Paste the contents of your Google Cloud OAuth2 JSON credentials file as the value.');
    process.exit(1);
  }

  const credentials = JSON.parse(credentialsJson);
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent to always get refresh_token
  });

  console.log('\n🔑 Gmail OAuth Setup\n');
  console.log('1. Open this URL in your browser (signed in as vidyag2504@gmail.com):');
  console.log('\n' + authUrl + '\n');
  console.log('2. Authorize the app and copy the authorization code from the redirect URL.\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('3. Paste the authorization code here: ', async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code.trim());
      console.log('\n✅ Success! Add this to your backend/.env and Render environment variables:\n');
      console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log('\n🎉 Email integration is ready! Restart your backend server.\n');
    } catch (err) {
      console.error('❌ Error getting token:', err.message);
    }
  });
}

main();
