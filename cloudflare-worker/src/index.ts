/**
 * StrokeSense Cloudflare Edge Proxy
 * Bridges Netlify Frontend to OpenRouter AI with open CORS and SSE streaming
 */

export interface Env {
  OPENROUTER_API_KEY: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Open CORS as specified
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Title, HTTP-Referer',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. Handle Preflight CORS Requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed. Send POST requests.' }), {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json() as any;
      const {
        messages = [],
        model = 'google/gemini-2.0-flash-001',
        temperature = 0.7,
        max_tokens = 1000,
        stream = true,
      } = body;

      const apiKey = env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error: 'Missing OPENROUTER_API_KEY secret in Cloudflare Worker environment.',
          }),
          { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }

      // Forward to OpenRouter
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': request.headers.get('origin') || 'https://strokesense.netlify.app',
          'X-Title': 'StrokeSense AI Platform',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream,
        }),
      });

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        return new Response(errorText, {
          status: openRouterResponse.status,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      // Stream SSE tokens back to the frontend
      return new Response(openRouterResponse.body, {
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || 'Worker Internal Server Error' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
  },
};
