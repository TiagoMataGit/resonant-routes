import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, CalendarDays, Clock, Loader2, Video } from "lucide-react";
import { bookMeeting, getAvailableSlots } from "@/lib/calendar.functions";

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon" }).format(new Date());
}

export function BookingSection() {
  const [date, setDate] = useState(todayISO);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const fetchSlots = useServerFn(getAvailableSlots);
  const book = useServerFn(bookMeeting);

  const slotsQuery = useQuery({
    queryKey: ["slots", date],
    queryFn: () => fetchSlots({ data: { date } }),
  });

  const booking = useMutation({
    mutationFn: () => book({ data: { name, email, start: slot!, notes: notes || undefined } }),
    onSuccess: () => slotsQuery.refetch(),
  });

  const canSubmit = Boolean(slot && name.trim().length > 1 && email.includes("@"));

  return (
    <section id="agendar" className="mx-auto max-w-4xl px-5 py-20">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Agendar uma reunião</h2>
      <p className="mt-3 text-muted-foreground">
        Escolha um horário livre (hora de Lisboa). Recebe o convite por email com link de vídeo.
      </p>

      {booking.isSuccess ? (
        <div className="surface-panel mt-8 rounded-3xl p-8 text-center">
          <CalendarCheck className="mx-auto size-10 text-primary" aria-hidden />
          <h3 className="mt-4 text-xl font-semibold">Reunião marcada</h3>
          <p className="mt-2 text-muted-foreground">{booking.data.when}</p>
          {booking.data.meetLink && (
            <a
              href={booking.data.meetLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Video className="size-4" aria-hidden /> Abrir link da reunião
            </a>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Enviámos o convite para {email}. Até já!
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="surface-panel rounded-3xl p-6">
            <label className="flex items-center gap-2 text-sm font-medium" htmlFor="booking-date">
              <CalendarDays className="size-4 text-primary" aria-hidden /> Dia
            </label>
            <input
              id="booking-date"
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => {
                setDate(e.target.value);
                setSlot(null);
              }}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            />

            <p className="mt-6 flex items-center gap-2 text-sm font-medium">
              <Clock className="size-4 text-primary" aria-hidden /> Horários livres
            </p>
            <div className="mt-3 min-h-24">
              {slotsQuery.isLoading && (
                <p className="text-sm text-muted-foreground">A verificar o calendário…</p>
              )}
              {slotsQuery.isError && (
                <p className="text-sm text-destructive">
                  Não foi possível ler a disponibilidade. Tente outro dia.
                </p>
              )}
              {slotsQuery.data && slotsQuery.data.slots.length === 0 && (
                <p className="text-sm text-muted-foreground">Sem horários livres neste dia.</p>
              )}
              <div className="flex flex-wrap gap-2">
                {slotsQuery.data?.slots.map((s) => (
                  <button
                    key={s.start}
                    type="button"
                    onClick={() => setSlot(s.start)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      slot === s.start
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            className="surface-panel rounded-3xl p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) booking.mutate();
            }}
          >
            <label className="text-sm font-medium" htmlFor="booking-name">
              Nome
            </label>
            <input
              id="booking-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            />

            <label className="mt-4 block text-sm font-medium" htmlFor="booking-email">
              Email
            </label>
            <input
              id="booking-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            />

            <label className="mt-4 block text-sm font-medium" htmlFor="booking-notes">
              O que quer discutir? (opcional)
            </label>
            <textarea
              id="booking-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
            />

            <button
              type="submit"
              disabled={!canSubmit || booking.isPending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {booking.isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {slot ? "Confirmar reunião" : "Escolha um horário"}
            </button>
            {booking.isError && (
              <p className="mt-3 text-sm text-destructive">
                Não foi possível marcar. Escolha outro horário e tente novamente.
              </p>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
