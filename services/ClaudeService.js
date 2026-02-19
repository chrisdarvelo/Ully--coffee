import Constants from 'expo-constants';

const API_URL = 'https://api.anthropic.com/v1/messages';
const REQUEST_TIMEOUT_MS = 15000;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

class ClaudeService {
  constructor() {
    this.apiKey = Constants.expoConfig?.extra?.claudeApiKey || null;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  /**
   * Validates that a base64 image string doesn't exceed the size cap.
   * Base64 encoding inflates size by ~33%, so we check the decoded size.
   */
  validateImageSize(base64Data) {
    const estimatedBytes = (base64Data.length * 3) / 4;
    if (estimatedBytes > MAX_IMAGE_SIZE_BYTES) {
      throw new Error('Image is too large. Please use an image under 5MB.');
    }
  }

  async sendRequest(messages, maxTokens = 1024, systemPrompt = null) {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured. Set CLAUDE_API_KEY in .env');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages,
    };
    if (systemPrompt) {
      body.system = systemPrompt;
    }

    let response;
    try {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    if (!data?.content?.[0]?.text) {
      throw new Error('Unexpected response from Claude API.');
    }
    return data.content[0].text;
  }

  /**
   * Multi-turn conversation with full message history.
   * @param {Array} messages - Array of { role: 'user'|'assistant', content: string|Array }
   * @param {string} systemPrompt - System prompt for the conversation
   * @param {number} maxTokens - Max response tokens
   */
  async chatWithHistory(messages, systemPrompt, maxTokens = 1024) {
    return this.sendRequest(messages, maxTokens, systemPrompt);
  }

  async diagnoseExtraction(base64Image, machineModel, context) {
    this.validateImageSize(base64Image);
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `You are a professional coffee equipment diagnostic assistant. Analyze this image.

Machine model: ${machineModel}
Context: ${context}

Provide a diagnosis covering:
1. What you observe in the image
2. Potential issues identified
3. Recommended fixes or adjustments
4. Parts that may need replacement (if applicable)

Be specific and actionable. Use professional coffee terminology.`,
          },
        ],
      },
    ];

    return this.sendRequest(messages, 1500);
  }

  async chat(text) {
    const messages = [
      {
        role: 'user',
        content: `You are Ully, a coffee AI. Only answer coffee-related questions (espresso, equipment, grinders, water chemistry, roasting, brewing, latte art, origins, processing, café management, barista techniques, coffee culture). Be direct and practical — no preamble, no background. Non-coffee question? Say: "That's outside my expertise. Ask me anything about coffee."

User: ${text}`,
      },
    ];

    return this.sendRequest(messages, 1024);
  }

  async identifyPart(base64Image) {
    this.validateImageSize(base64Image);
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `You are a coffee equipment parts expert. Identify this part.

Provide:
1. Part name and likely manufacturer/model compatibility
2. What this part does in the machine
3. Signs of wear or damage visible
4. Recommended replacement part numbers if identifiable
5. Where to source this part (common suppliers)

Be as specific as possible about the part identification.`,
          },
        ],
      },
    ];

    return this.sendRequest(messages, 1500);
  }
}

export default new ClaudeService();
