import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AudioLines, CalendarDays, MessageCircle, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const SUGGESTIONS = [
  "O que inclui o teste de 3 meses?",
  "Quanto custa o plano Família?",
  "Posso cancelar quando quiser?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open, status]);

  const busy = status === "submitted" || status === "streaming";

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar assistente" : "Abrir assistente"}
        className="glow fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="surface-panel fixed bottom-24 right-5 z-50 flex h-[32rem] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <AudioLines className="size-5 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Assistente Resonance</p>
              <p className="text-xs text-muted-foreground">Responde em segundos</p>
            </div>
          </div>

          <Conversation className="flex-1">
            <ConversationContent className="gap-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Olá! Pergunte-me o que quiser sobre planos, áudio ou downloads.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent
                    variant={message.role === "user" ? "contained" : "flat"}
                    className={
                      message.role === "user" ? "bg-primary text-primary-foreground" : undefined
                    }
                  >
                    {message.parts.map((part, i) =>
                      part.type === "text" ? (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      ) : null,
                    )}
                  </MessageContent>
                </Message>
              ))}

              {status === "submitted" && <Shimmer className="text-sm">A pensar…</Shimmer>}
              {error && (
                <p className="text-sm text-destructive">
                  Não consegui responder agora. Tente novamente dentro de momentos.
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <a
              href="#agendar"
              onClick={() => setOpen(false)}
              className="mb-3 flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-secondary"
            >
              <CalendarDays className="size-4 text-primary" aria-hidden /> Agendar reunião
            </a>
            <PromptInput
              onSubmit={(_, event) => {
                event.preventDefault();
                send(input);
              }}
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua pergunta…"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() || busy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}
