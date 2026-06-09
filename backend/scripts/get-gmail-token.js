
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
