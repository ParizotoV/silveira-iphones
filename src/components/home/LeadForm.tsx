"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappUrls } from "@/lib/whatsapp";

const fieldClass =
  "h-12 w-full rounded-2xl border border-line bg-ink px-4 text-base text-white placeholder:text-muted/60 transition-[border-color,box-shadow] focus:border-electric-soft focus:shadow-[0_0_0_4px_rgba(0,77,208,0.25)] focus:outline-none";

/**
 * Formulário de atendimento personalizado. Não há backend: os dados apenas
 * montam a mensagem que abre a conversa no WhatsApp.
 */
export function LeadForm({ models }: { models: string[] }) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [storage, setStorage] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.open(whatsappUrls.lead({ name, model, storage, message }), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4" aria-describedby="lead-help">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seu nome" htmlFor="lead-name">
          <input id="lead-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos chamar você?" className={fieldClass} />
        </Field>
        <Field label="Modelo de interesse" htmlFor="lead-model">
          <input id="lead-model" name="model" list="lead-models" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex.: iPhone 16 Pro" className={fieldClass} />
          <datalist id="lead-models">
            {models.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>
      </div>
      <Field label="Capacidade desejada" htmlFor="lead-storage">
        <input id="lead-storage" name="storage" value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="Ex.: 256 GB" className={fieldClass} />
      </Field>
      <Field label="Mensagem" htmlFor="lead-message">
        <textarea id="lead-message" name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Conte o que você procura: cor, orçamento, uso…" className={`${fieldClass} h-auto resize-none py-3`} />
      </Field>

      <button
        type="submit"
        className="group/btn relative inline-flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-electric px-8 font-medium text-white shadow-[0_0_0_1px_rgba(77,134,240,0.45),0_12px_40px_-12px_rgba(0,77,208,0.95)] transition-[background-color,box-shadow,transform] duration-300 hover:bg-[#0a5ce8] hover:shadow-[0_0_0_1px_rgba(120,165,255,0.7),0_16px_54px_-10px_rgba(0,77,208,1)] active:scale-[0.98]"
      >
        <WhatsAppIcon className="size-5" />
        Enviar pelo WhatsApp
        <Send className="size-4 opacity-70" aria-hidden />
      </button>
      <p id="lead-help" className="text-xs text-muted">
        Ao enviar, o WhatsApp abre com a mensagem pronta. Nenhum dado é armazenado neste site.
      </p>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm text-white/80">
        {label}
      </label>
      {children}
    </div>
  );
}
