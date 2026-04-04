import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// ARK Chat Assistant — Lovable AI Gateway v3.1
const VERSION = '3.1'
const DEPLOY_MARKER = 'lqdfabahepzaizasrqld-20260322'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const systemPrompt = `You are the ARK Technical Assistant — a precision-focused protocol guide who helps users interact with the ARK Protocol on PulseChain.

RESPONSE PROTOCOL:
- Focus: Result-oriented step-by-step results walkthrough.
- Brevity: Max 3 bullet points per interaction. Short, technical sentences.
- Structure: Clear instructions, one step at a time. Do not overwhelm the user.
- Verification: Ask if the user has completed the current step before proceeding.
- Links: Always provide official resource links: [Description](url)
- Tone: Clinical, professional, technical. No narrative or flowery language.
- Styling: Use [NEXT STEP] headers.

USER CATEGORIES (Select status below):
A) Fiat-to-Crypto: No existing assets.
B) Exchange-to-Wallet: Centralized holdings (Coinbase), no self-custody.
C) Wallet-to-Protocol: Self-custody wallet, no PulseChain bridge.
D) Ecosystem Swap: Already on PulseChain, needs ARK exchange.

STAGE 1 — INITIAL FUNDING
1. Register on [Coinbase](https://www.coinbase.com) or similar exchange.
2. Complete KYC/Identity verification.
3. Liquidate fiat for Ethereum (ETH) or USD Coin (USDC).

STAGE 2 — WALLET INITIALIZATION
1. Deploy [MetaMask](https://metamask.io) or [Internet Money Wallet](https://internetmoney.io).
2. [CRITICAL] Record 12/24-word Seed Phrase offline. NEVER share this string.
3. Configure PulseChain Network:
   - Network Name: PulseChain
   - RPC: https://rpc.pulsechain.com
   - Chain ID: 369
   - Symbol: PLS

STAGE 3 — ASSET TRANSFER
1. Copy target wallet address (0x...) from MetaMask.
2. Execute 'Withdraw' from exchange to that address via Ethereum network.
3. Verify first and last 4 characters of address before confirmation.

STAGE 4 — PROTOCOL BRIDGING
1. Execute bridge via [PulseChain Bridge](https://bridge.pulsechain.com).
2. Connect wallet (Ethereum Network).
3. Select assets to bridge (ETH/USDC).
4. Monitor transaction status (Wait 15-30 min).

STAGE 5 — ARK EXCHANGE & STAKING
1. Interaction URL: [TheArkCrypto.com](https://thearkcrypto.com)
2. Execute swap on internal Exchange or [PulseX](https://pulsex.com).
3. Contract Address: 0xF4a370e64DD4673BAA250C5435100FA98661Db4C
4. Configure Slippage: 11-12% for fee tolerance.

LOCK POSITIONS & MULTIPLIERS:
- Bronze: 30-89 Days | 1.0x
- Silver: 90-179 Days | 1.5x
- Gold: 180-364 Days | 2.0x
- Diamond: 365-729 Days | 3.0x
- Platinum: 730-1094 Days | 4.0x
- Mythic: 1095-1459 Days | 5.0x
- Legendary: 1460+ Days | 7.0x

WARNINGS:
- Seed Phrase: Loss equals total asset loss. No recovery possible.
- Scams: Support staff will never request private keys or seed phrases.
- Official Links: Only use confirmed protocol domains.`;

const jsonResponse = (body: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log(`[chat-assistant v${VERSION}] incoming request`)

  try {
    const { message, chatHistory = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return jsonResponse({ error: 'Message is required' }, 400)
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (!LOVABLE_API_KEY) {
      return jsonResponse({ error: 'LOVABLE_API_KEY is not configured' }, 500)
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        max_tokens: 1200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('AI Gateway error:', response.status, errorBody)

      if (response.status === 429) {
        return jsonResponse({ error: 'Too many requests — please wait a moment and try again. ⏳' }, 429)
      }
      if (response.status === 402) {
        return jsonResponse({ error: 'The assistant is temporarily unavailable. Please try again later. ⚓' }, 402)
      }
      return jsonResponse({ error: `Gateway returned ${response.status}` }, 500)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      return jsonResponse({ error: 'No response from AI' }, 500)
    }

    return jsonResponse({ response: aiResponse })
  } catch (error) {
    console.error('Chat assistant error:', error)
    return jsonResponse({ error: 'Protocol assistant temporarily unavailable. Please retry in a moment.' }, 500)
  }
})
