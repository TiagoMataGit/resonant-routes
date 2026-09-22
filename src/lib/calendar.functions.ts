import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

export const TIME_ZONE = "Europe/Lisbon";
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;
const SLOT_MINUTES = 30;

function gatewayHeaders() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_CALENDAR_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Google Calendar is not configured for this project.");
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connectionKey,
    "Content-Type": "application/json",
  };
}

/** Offset in minutes of Europe/Lisbon at a given UTC instant. */
function zoneOffsetMinutes(instant: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "longOffset",
  }).formatToParts(new Date(instant));
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

/** Build a UTC Date from a local Lisbon date + time. */
function fromLocal(dateISO: string, hour: number, minute: number): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  const guess = Date.UTC(y!, (m ?? 1) - 1, d!, hour, minute);
  const offset = zoneOffsetMinutes(guess);
  return new Date(guess - offset * 60_000);
}

function localHHMM(date: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

const DateInput = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

export const getAvailableSlots = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DateInput.parse(input))
  .handler(async ({ data }) => {
    const dayStart = fromLocal(data.date, WORK_START_HOUR, 0);
    const dayEnd = fromLocal(data.date, WORK_END_HOUR, 0);

    const res = await fetch(`${GATEWAY}/freeBusy`, {
      method: "POST",
      headers: gatewayHeaders(),
      body: JSON.stringify({
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        timeZone: TIME_ZONE,
        items: [{ id: "primary" }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Calendar freeBusy failed [${res.status}]: ${body}`);
      throw new Error(`Não foi possível ler a disponibilidade (${res.status}).`);
    }
    const json = (await res.json()) as {
      calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
    };
    const busy = (Object.values(json.calendars ?? {})[0]?.busy ?? []).map((b) => ({
      start: new Date(b.start).getTime(),
      end: new Date(b.end).getTime(),
    }));

    const slots: { start: string; label: string }[] = [];
    const now = Date.now();
    for (
      let t = dayStart.getTime();
      t + SLOT_MINUTES * 60_000 <= dayEnd.getTime();
      t += SLOT_MINUTES * 60_000
    ) {
      const end = t + SLOT_MINUTES * 60_000;
      if (t <= now) continue;
      const overlaps = busy.some((b) => t < b.end && end > b.start);
      if (overlaps) continue;
      slots.push({ start: new Date(t).toISOString(), label: localHHMM(new Date(t)) });
    }
    return { slots, timeZone: TIME_ZONE };
  });

const BookingInput = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  start: z.string().min(10),
  notes: z.string().max(1000).optional(),
});

export const bookMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BookingInput.parse(input))
  .handler(async ({ data }) => {
    const start = new Date(data.start);
    if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
      throw new Error("Escolha um horário futuro válido.");
    }
    const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);

    const res = await fetch(
      `${GATEWAY}/calendars/primary/events?sendUpdates=all&conferenceDataVersion=1`,
      {
        method: "POST",
        headers: gatewayHeaders(),
        body: JSON.stringify({
          summary: `Reunião Resonance — ${data.name}`,
          description: data.notes
            ? `Marcado pela landing page.\n\nNotas: ${data.notes}`
            : "Marcado pela landing page.",
          start: { dateTime: start.toISOString(), timeZone: TIME_ZONE },
          end: { dateTime: end.toISOString(), timeZone: TIME_ZONE },
          attendees: [{ email: data.email, displayName: data.name }],
          conferenceData: {
            createRequest: {
              requestId: `resonance-${start.getTime()}-${Math.random().toString(36).slice(2, 10)}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`Calendar event creation failed [${res.status}]: ${body}`);
      throw new Error(`Não foi possível criar a reunião (${res.status}).`);
    }
    const event = (await res.json()) as { hangoutLink?: string; htmlLink?: string };
    return {
      ok: true as const,
      when: `${new Intl.DateTimeFormat("pt-PT", {
        timeZone: TIME_ZONE,
        dateStyle: "full",
        timeStyle: "short",
      }).format(start)}`,
      meetLink: event.hangoutLink ?? null,
    };
  });
