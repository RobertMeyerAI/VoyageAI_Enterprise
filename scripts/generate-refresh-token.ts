
import { google } from 'googleapis';
import { createServer } from 'http';
import { parse } from 'url';
import { config } from 'dotenv';
import open from 'open';

// Load environment variables from .env file
config({ path: '.env' });

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    'Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in your .env file.'
  );
  console.log('Please create OAuth 2.0 credentials in the Google Cloud Console.');
  process.exit(1);
}

// IMPORTANT: This script runs a local server to capture the OAuth callback.
// You MUST add `http://localhost:3000/oauth2callback` as an "Authorized redirect URI"
// in your Google Cloud Console's OAuth 2.0 Client ID settings for this script to work.
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  REDIRECT_URI
);

async function getRefreshToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent screen to ensure a refresh token is issued
  });

  console.log('Authorize this app by visiting this url:\n');
  console.log(authUrl);
  
  // Try to open the URL automatically in the user's browser
  try {
    await open(authUrl);
  } catch (err) {
    console.warn('Could not automatically open browser. Please copy the URL above and paste it into your browser.');
  }

  const server = createServer(async (req, res) => {
    try {
      if (req.url && req.url.indexOf('/oauth2callback') > -1) {
        const qs = new URL(req.url, 'http://localhost:3000').searchParams;
        const code = qs.get('code');

        if (!code) {
          res.end('Authentication failed. No code received.');
          server.close();
          return;
        }
        
        console.log(`\nReceived authorization code. Exchanging for tokens...`);

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const refreshToken = tokens.refresh_token;

        if (refreshToken) {
          res.end('Authentication successful! You can close this tab.');
          console.log('\n---------------------------------\n');
          console.log('SUCCESS! Your refresh token is:\n');
          console.log(refreshToken);
          console.log('\nCopy this token and paste it into your .env file as GMAIL_REFRESH_TOKEN');
          console.log('\n---------------------------------\n');
        } else {
            res.end('Authentication failed. A refresh token was not received. Please try again.');
            console.error('\nError: A refresh token was not provided by Google. This can happen if you have previously authorized this app. Try revoking access in your Google Account settings (https://myaccount.google.com/permissions) and run the script again.');
        }

        server.close();
        process.exit(0);
      }
    } catch (e: any) {
      console.error('Error during authentication:', e.message);
      res.end('An error occurred during authentication. Check the console.');
      server.close();
      process.exit(1);
    }
  }).listen(3000, () => {
    console.log('\nWaiting for authorization... a local server is running on http://localhost:3000');
  });
}

getRefreshToken();
