import Constants from 'expo-constants';

const API_URL = 'https://api.anthropic.com/v1/messages';

class ClaudeService {
  constructor() {
    this.apiKey = Constants.expoConfig?.extra?.claudeApiKey || null;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  async sendRequest(messages, maxTokens = 1024) {
    if (!this.apiKey) {
      throw new Error('Claude API key not configured. Set CLAUDE_API_KEY in .env');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async diagnoseExtraction(base64Image, machineModel, context) {
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
        content: `You are Ully, a friendly and knowledgeable coffee companion AI. You help baristas and coffee enthusiasts with espresso extraction, equipment troubleshooting, grinder calibration, water chemistry, dial-in tips, and anything coffee-related. Keep answers concise and practical. Use professional coffee terminology but explain simply.

User: ${text}`,
      },
    ];

    return this.sendRequest(messages, 1024);
  }

  async identifyPart(base64Image) {
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
