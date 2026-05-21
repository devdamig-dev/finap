"use client";

import { useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { answerHouseholdQuestion } from "@/lib/ai/recommendations";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

const examples = [
  "¿Llegamos bien a fin de mes?",
  "¿Dónde podemos ahorrar?",
  "¿Qué gastos subieron más?",
  "¿Cuáles son los próximos vencimientos?",
  "Armame un plan para ahorrar este mes",
  "¿Qué tareas del hogar están atrasadas?",
];

export function AIChatMock() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hola 👋 Soy tu copiloto del hogar. Puedo ayudarte con finanzas, vencimientos, tareas y objetivos. Probá una pregunta o tipeá la tuya.",
    },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function send(question: string) {
    const q = question.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", content: answerHouseholdQuestion(q) }]);
    }, 350);
    setTimeout(() => inputRef.current?.focus(), 400);
  }

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Preguntale a tu hogar
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Respuestas simuladas en base a tus datos. Pronto vamos a conectar IA real.
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-thin space-y-3 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2 max-w-[90%]",
              m.role === "user" ? "ml-auto flex-row-reverse" : "",
            )}
          >
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                m.role === "user" ? "bg-secondary" : "bg-primary text-primary-foreground",
              )}
            >
              {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            </div>
            <div
              className={cn(
                "rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted rounded-tl-sm",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {messages.length <= 1 && (
          <div className="pt-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">
              Probá preguntando
            </p>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => send(ex)}
                  className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-muted transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Preguntá algo a tu hogar…"
          />
          <Button type="submit" size="icon" aria-label="Enviar">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
