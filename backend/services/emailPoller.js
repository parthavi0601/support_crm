const { fetchUnreadEmails, getMessageDetails, markAsRead, parseEmailToTicket } = require('./gmailService');
const Ticket = require('../models/Ticket');
const Activity = require('../models/Activity');

const POLL_INTERVAL_MS = 60 * 1000;

// Only process emails received AFTER the server started (Unix seconds)
const POLL_START_TIME = Math.floor(Date.now() / 1000);

// Track processed message IDs in memory to avoid double-processing on rapid polls
const processedIds = new Set();

const generateTicketId = async () => {
  const lastTicket = await Ticket.findOne({}, {}, { sort: { createdAt: -1 } });
  if (!lastTicket || !lastTicket.ticketId) return 'TKT-001';
  const lastNum = parseInt(lastTicket.ticketId.split('-')[1], 10);
  const nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
  return `TKT-${String(nextNum).padStart(3, '0')}`;
};

async function pollEmails(io) {
  try {
    // Only fetch unread emails received after server startup
    const messages = await fetchUnreadEmails(POLL_START_TIME);

    if (messages.length === 0) return;

    console.log(`[EmailPoller] Found ${messages.length} unread email(s)`);

    for (const msg of messages) {
      if (processedIds.has(msg.id)) continue;

      try {
        const fullMessage = await getMessageDetails(msg.id);
        const { customerName, customerEmail, subject, description } = parseEmailToTicket(fullMessage);

        // Skip if email address is invalid
        if (!customerEmail || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
          console.log(`[EmailPoller] Skipping message ${msg.id}: invalid email`);
          await markAsRead(msg.id);
          processedIds.add(msg.id);
          continue;
        }

        const ticketId = await generateTicketId();

        const newTicket = await Ticket.create({
          ticketId,
          customerName: customerName || 'Unknown Sender',
          customerEmail,
          subject: subject.substring(0, 200),
          description,
          priority: 'Medium',
          assignedTo: 'Unassigned',
        });

        await Activity.create({
          ticketId,
          actionType: 'TICKET_CREATED',
          description: `Ticket auto-created from email (${customerEmail})`,
        });

        await markAsRead(msg.id);
        processedIds.add(msg.id);

        console.log(`[EmailPoller] ✅ Created ticket ${ticketId} from email: "${subject}" by ${customerEmail}`);

        // Emit WebSocket event so frontend can refresh silently
        if (io) {
          io.emit('new_ticket', newTicket);
        }
      } catch (msgError) {
        console.error(`[EmailPoller] ❌ Error processing message ${msg.id}:`, msgError.message);
        // Still mark as read to avoid reprocessing broken emails repeatedly
        try { await markAsRead(msg.id); } catch (_) { }
        processedIds.add(msg.id);
      }
    }
  } catch (error) {
    // Don't crash the server if Gmail is temporarily unavailable
    if (error.message.includes('not configured')) {
      // Gmail not set up yet — silently skip
      return;
    }
    console.error('[EmailPoller] Poll error:', error.message);
  }
}

function startEmailPoller(io) {
  const gmailConfigured =
    process.env.GMAIL_CREDENTIALS &&
    process.env.GMAIL_CREDENTIALS !== 'your_gmail_credentials_json_here' &&
    process.env.GMAIL_REFRESH_TOKEN &&
    process.env.GMAIL_REFRESH_TOKEN !== 'your_gmail_refresh_token_here';

  if (!gmailConfigured) {
    console.log('[EmailPoller] Gmail credentials not configured — email polling disabled.');
    return;
  }

  console.log(`[EmailPoller] 🚀 Started — polling every ${POLL_INTERVAL_MS / 1000}s`);

  // Run once immediately on startup, then on interval
  pollEmails(io);
  setInterval(() => pollEmails(io), POLL_INTERVAL_MS);
}

module.exports = { startEmailPoller };
