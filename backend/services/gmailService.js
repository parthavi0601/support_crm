const { google } = require('googleapis');

/**
 * Creates an authenticated Gmail API client using OAuth2 credentials
 * stored in environment variables.
 */
function createGmailClient() {
  const credentials = JSON.parse(process.env.GMAIL_CREDENTIALS || '{}');
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web || {};

  if (!client_id || !client_secret) {
    throw new Error('GMAIL_CREDENTIALS not configured in .env');
  }

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris?.[0]);

  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error('GMAIL_REFRESH_TOKEN not configured in .env');
  }

  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: 'v1', auth: oAuth2Client });
}

/**
 * Fetches unread emails from the inbox received after the given Unix timestamp.
 * @param {number} afterTimestamp - Unix timestamp in seconds (only fetch emails after this time)
 */
async function fetchUnreadEmails(afterTimestamp) {
  const gmail = createGmailClient();
  const query = afterTimestamp
    ? `is:unread in:inbox after:${afterTimestamp}`
    : 'is:unread in:inbox';

  const response = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 20,
  });
  return response.data.messages || [];
}

/**
 * Fetches the full details of a single message by ID.
 */
async function getMessageDetails(messageId) {
  const gmail = createGmailClient();
  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });
  return response.data;
}

/**
 * Marks a message as read by removing the UNREAD label.
 */
async function markAsRead(messageId) {
  const gmail = createGmailClient();
  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: { removeLabelIds: ['UNREAD'] },
  });
}

/**
 * Extracts a header value from a Gmail message by name.
 */
function getHeader(message, name) {
  const header = message.payload?.headers?.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return header?.value || '';
}

/**
 * Decodes a base64url encoded Gmail message part body.
 */
function decodeBody(data) {
  if (!data) return '';
  const buff = Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  return buff.toString('utf-8');
}

/**
 * Recursively extracts plain text body from a message part.
 */
function extractTextBody(part) {
  if (!part) return '';

  if (part.mimeType === 'text/plain' && part.body?.data) {
    return decodeBody(part.body.data);
  }

  if (part.parts) {
    for (const subPart of part.parts) {
      const text = extractTextBody(subPart);
      if (text) return text;
    }
  }

  // Fallback: decode body directly
  if (part.body?.data) {
    return decodeBody(part.body.data);
  }

  return '';
}

/**
 * Parses a Gmail message into ticket fields.
 * Returns { customerName, customerEmail, subject, description }
 */
function parseEmailToTicket(message) {
  const fromHeader = getHeader(message, 'from');
  const subject = getHeader(message, 'subject') || 'No Subject';

  // Parse "Name <email>" or just "email"
  const fromMatch = fromHeader.match(/^"?([^"<]+)"?\s*<?([^>]+@[^>]+)>?$/);
  const customerName = fromMatch ? fromMatch[1].trim() : fromHeader.split('@')[0];
  const customerEmail = fromMatch ? fromMatch[2].trim().toLowerCase() : fromHeader.trim().toLowerCase();

  const rawBody = extractTextBody(message.payload);

  // Strip excessive whitespace and limit to 2000 chars
  const description = rawBody
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .substring(0, 2000) || `[No body content — email received with subject: "${subject}"]`;

  return { customerName, customerEmail, subject, description };
}

module.exports = {
  fetchUnreadEmails,
  getMessageDetails,
  markAsRead,
  parseEmailToTicket,
};
