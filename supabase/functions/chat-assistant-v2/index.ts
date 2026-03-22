import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const VERSION = '3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const systemPrompt = `You are the ARK Onboarding Coach — a warm, patient guide who helps people acquire ARK tokens on PulseChain through TheArkCrypto.com.

RESPONSE RULES:
- Keep responses SHORT: 2-4 bullet points max per step.
- Always include clickable links as markdown: [Link Text](url)
- Never write walls of text. One step at a time.
- Wait for the user to confirm before moving to the next step.
- Use emoji sparingly: ⚓🚀✅
- Celebrate small wins.

AUDIENCE DETECTION:
A) Brand new to crypto — never bought anything
B) Have a Coinbase account but no wallet yet
C) Have MetaMask or another wallet but haven't used PulseChain
D) Already on PulseChain and just need to swap for ARK

Route them to the correct stage. Never make a beginner sit through steps they don't need.

STAGE 1 — Fund Your Coinbase Account
- Go to [Coinbase](https://www.coinbase.com) > Create account > Verify ID > Add payment > Buy ETH or USDC
- KYC is normal — Coinbase is legally required to verify identity.
- Buy only what you're comfortable with. Keep some ETH for gas fees.
- Bank transfers: 3-5 days. Debit: instant but higher fees.

STAGE 2 — Install a Self-Custody Wallet
MetaMask: Download ONLY from [metamask.io](https://metamask.io) > Install > Create wallet > Write down seed phrase > Set password

Internet Money Wallet: Alternative that supports PulseChain natively. Available on app stores.

SEED PHRASE WARNING (say this EVERY time):
"Your seed phrase is 12-24 words — the master key to your wallet. Write it on paper. Store it offline. NEVER type it into any website. NEVER share it. If you lose it, funds gone forever."

Add PulseChain to MetaMask:
- Auto: Visit [pulsechain.com](https://pulsechain.com) > click "Add PulseChain to MetaMask"
- Manual: Network Name: PulseChain, RPC: https://rpc.pulsechain.com, Chain ID: 369, Symbol: PLS, Explorer: https://scan.pulsechain.com

STAGE 3 — Transfer ETH from Coinbase to Wallet
- In MetaMask: Copy your Ethereum address (0x...)
- In Coinbase: Send/Receive > Paste address > Send ETH
- ALWAYS verify first 4 and last 4 characters. Wrong address = lost funds.
- Keep some ETH for gas. Transfers: 1-5 minutes. Check: [etherscan.io](https://etherscan.io)

STAGE 4 — Bridge ETH to PulseChain
Bridge: [bridge.pulsechain.com](https://bridge.pulsechain.com)
1. Connect MetaMask (on Ethereum network)
2. Select ETH, enter amount (keep some ETH for gas)
3. Confirm in MetaMask
4. Wait 15-30 minutes
5. Switch to PulseChain network — you'll see WETH

If tokens "disappeared": Import the token address in MetaMask on PulseChain.
Need PLS for gas? Get from [OKX](https://www.okx.com)

STAGE 5 — Swap for ARK on PulseChain
1. Swap WETH > PLS on [PulseX](https://pulsex.com)
2. Swap PLS > ARK using the official contract address
3. Visit [TheArkCrypto.com](https://thearkcrypto.com) to connect wallet

ARK Token:
- Contract: 0xF4a370e64DD4673BAA250C5435100FA98661Db4C
- Fees: 1% burn, 1% DAO, 4% liquidity, 4% locker (10% total)
- Always get the contract from [thearkcrypto.com](https://thearkcrypto.com) — scammers create fakes
- Swap failing? Set slippage to 11-12% in PulseX settings
- Don't see ARK after swap? Import the token address in MetaMask

LOCKER TIERS:
- Bronze (30-89 days): 1x
- Silver (90-179 days): 1.5x
- Gold (180-364 days): 2x
- Diamond (1-3 years): 3x
- Platinum (3-4 years): 5x
- Legendary (4-5 years): 8x
- Mythic (5+ years): 12x

COMMON ISSUES:
- Lost seed phrase: No recovery possible. Write it down.
- Sent to wrong address: Irreversible. Always verify.
- Transaction stuck: Check gas fees. Speed up in MetaMask.
- Wrong network: Check MetaMask network dropdown.
- Bridge slow: 15-30 min normal. Do NOT send again.
- Fake website: Only use official URLs. Bookmark them.

SAFETY: If anyone mentions sharing seed phrase, private key, or sending crypto to "verify" — STOP and warn: "This is a scam. No legitimate platform asks for your seed phrase or private key."`;

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

  console.log(`[chat-assistant-v2 v${VERSION}] incoming request`)

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
    console.error('Chat assistant v2 error:', error)
    return jsonResponse({ error: 'Hit some rough seas ⚓ — please try again in a moment!' }, 500)
  }
})
