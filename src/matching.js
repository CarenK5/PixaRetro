const axios = require('axios');
const { PromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser } = require("langchain/output_parsers");

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const matchingPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert booking platform matcher. Given a client's requirements and a list of photographers, rank the photographers by match quality.

Client Profile:
{clientProfile}

Available Photographers:
{photographers}

Provide a JSON response with:
- ranked_matches: array of {{id, name, matchScore (0-100), reason}}
- recommendations: specific suggestions for the client

Respond ONLY with valid JSON, no markdown or extra text.
`);

async function matchPhotographersToClient(clientProfile, photographers) {
  try {
    if (!process.env.NVIDIA_API_KEY) {
      throw new Error('NVIDIA_API_KEY environment variable is not set');
    }

    const prompt = await matchingPromptTemplate.format({
      clientProfile: JSON.stringify(clientProfile, null, 2),
      photographers: JSON.stringify(photographers, null, 2),
    });

    const response = await axios.post(
      NVIDIA_API_URL,
      {
        model: "z-ai/glm-5.2",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 1,
        top_p: 1,
        max_tokens: 16384,
        seed: 42
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Accept": "application/json"
        }
      }
    );

    const parser = new JsonOutputParser();
    const content = response.data.choices[0].message.content;
    const result = await parser.parse(content);

    return result;
  } catch (error) {
    console.error("Matching error:", error.response?.data || error.message);
    throw error;
  }
}

// Streaming version for real-time responses
async function* matchPhotographersToClientStream(clientProfile, photographers) {
  try {
    if (!process.env.NVIDIA_API_KEY) {
      throw new Error('NVIDIA_API_KEY environment variable is not set');
    }

    const prompt = await matchingPromptTemplate.format({
      clientProfile: JSON.stringify(clientProfile, null, 2),
      photographers: JSON.stringify(photographers, null, 2),
    });

    const response = await axios.post(
      NVIDIA_API_URL,
      {
        model: "z-ai/glm-5.2",
        messages: [
          { role: "user", content: prompt }
        ],
        stream: true,
        temperature: 1,
        top_p: 1,
        max_tokens: 16384,
        seed: 42
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Accept": "application/json"
        },
        responseType: 'stream'
      }
    );

    for await (const chunk of response.data) {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.replace('data: ', '');
          if (data && data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                yield parsed.choices[0].delta.content;
              }
            } catch (e) {
              // Skip parse errors for stream data
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Streaming error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { matchPhotographersToClient, matchPhotographersToClientStream };
