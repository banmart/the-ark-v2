
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY')

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, chatHistory = [] } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured')
    }

    // Build conversation context with ARK-specific system prompt
    const systemPrompt = `You are ARK Assistant, an AI helper specialized in ARK tokens, cryptocurrency bridges, and Coinbase integration. You are knowledgeable, friendly, and focused on helping users navigate the ARK ecosystem.

ARK TOKEN KNOWLEDGE:
- ARK is built on the PulseChain network with innovative tokenomics
- Contract Address: 0xACC15eF8fa2e702d0138c3662A9E7d696f40F021
- Four Core Pillars: Scarcity (burns on transactions), Rewards (reflections for holders), Community (strong united believers), Security (audited & transparent)

LOCKER SYSTEM TIERS:
- Bronze (30-89 days): 1x multiplier ⛵
- Silver (90-179 days): 1.5x multiplier 🛡️
- Gold (180-364 days): 2x multiplier 👑
- Plus additional legendary tiers for longer locks

BRIDGE & COINBASE GUIDANCE:
- Help users understand how to bridge tokens between networks
- Guide through Coinbase integration and listing processes
- Explain wallet connections and security best practices

PERSONALITY:
- Use maritime/nautical themes (ARK = ship saving people from market chaos)
- Be encouraging and supportive of the community
- Use emojis appropriately but not excessively
- Keep responses concise but informative
- Always prioritize user safety and security

Respond helpfully to questions about ARK tokens, tokenomics, bridges, Coinbase, and general crypto onboarding. If asked about topics outside your expertise, politely redirect to ARK-related topics.`;

    // Prepare messages for Gemini
    const messages = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      }
    ];

    // Add chat history context
    chatHistory.slice(-6).forEach((msg: ChatMessage) => {
      messages.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('No response generated from Gemini')
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Chat assistant error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process chat message',
        response: 'Sorry, I encountered an error. Please try again in a moment. ⚓'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
