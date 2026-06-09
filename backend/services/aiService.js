const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a concise 2-3 sentence summary of the ticket.
 */
async function generateSummary(subject, description) {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a concise customer support analyst. Given a ticket subject and description, write a 2-3 sentence plain-English summary of the issue. Be factual and objective. Do not use bullet points.',
      },
      {
        role: 'user',
        content: `Subject: ${subject}\n\nDescription: ${description}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.3,
  });
  return completion.choices[0].message.content.trim();
}

/**
 * Suggests a priority level with a short reason.
 */
async function suggestPriority(subject, description) {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a support ticket triage expert. Analyze the ticket and respond ONLY with valid JSON in this exact format:
{
  "priority": "Low" | "Medium" | "High" | "Critical",
  "reason": "One sentence explaining why."
}
Priority guide:
- Critical: System down, data loss, security breach, payment failure
- High: Major feature broken, significant business impact
- Medium: Partial functionality issue, workaround exists
- Low: Minor bug, cosmetic issue, general question`,
      },
      {
        role: 'user',
        content: `Subject: ${subject}\n\nDescription: ${description}`,
      },
    ],
    max_tokens: 100,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content);
}

/**
 * Suggests a professional response to send to the customer.
 */
async function suggestResponse(subject, description, notes = []) {
  const notesText =
    notes.length > 0
      ? `\n\nAgent notes so far:\n${notes.map((n) => `- ${n.noteText}`).join('\n')}`
      : '';

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional customer support agent. Write a warm, empathetic and helpful response to the customer. Keep it concise (3-5 sentences). Start with acknowledging their issue. Do not use placeholders like [Agent Name] — sign off as "The Support Team".',
      },
      {
        role: 'user',
        content: `Subject: ${subject}\n\nCustomer description: ${description}${notesText}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.5,
  });
  return completion.choices[0].message.content.trim();
}

/**
 * Categorizes the ticket into a support category.
 */
async function categorizeTicket(subject, description) {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a support ticket classifier. Respond ONLY with valid JSON in this format:
{
  "category": "string",
  "confidence": "High" | "Medium" | "Low"
}
Choose the best category from: Billing & Payments, Technical Issue, Account & Access, Product Feedback, Feature Request, Bug Report, Onboarding, Refund Request, Security, General Inquiry.`,
      },
      {
        role: 'user',
        content: `Subject: ${subject}\n\nDescription: ${description}`,
      },
    ],
    max_tokens: 60,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content);
}

module.exports = {
  generateSummary,
  suggestPriority,
  suggestResponse,
  categorizeTicket,
};
