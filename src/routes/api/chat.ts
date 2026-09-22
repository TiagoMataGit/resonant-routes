import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `És o assistente da Resonance, um serviço de streaming de música sem anúncios, com áudio lossless, downloads offline e controlo total da reprodução.

Factos do produto:
- Teste grátis de 3 meses para quem nunca teve Premium; não há cobrança durante o teste.
- Preços depois do teste: Individual 12,99 €/mês, Duo 18,99 €, Família 21,99 € (até 6 pessoas), Estudante 6,99 €.
- Cancelamento online a qualquer momento; playlists e biblioteca mantêm-se se voltar ao plano gratuito.
- Áudio lossless até 24-bit/44.1 kHz, downloads em até 5 dispositivos, funciona no estrangeiro.

Regras:
- Responde em português de Portugal, de forma curta, calorosa e concreta (máx. 4 frases).
- Se a pessoa mostrar interesse, dúvidas sobre planos para equipas/empresas, ou pedir ajuda humana, encaminha-a para marcar uma reunião: diz-lhe para clicar no botão "Agendar reunião" ou usar a secção de marcação da página.
- Não inventes funcionalidades, preços ou datas que não estejam aqui.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("AI is not configured", { status: 500 });
        }
        const { messages } = (await request.json()) as { messages: UIMessage[] };

        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: {
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
        });

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
            },
          },
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
