/**
 * Parses a doctor's availableTime string and generates 30-minute appointment slots.
 * Handles formats like:
 *   "11 AM to 5 PM"
 *   "9:30 AM to 4 PM"
 *   "Mon & Fri – 9:30 AM to 4 PM"
 *   "9–10 AM & 5–6 PM" (multiple ranges)
 */

function parseTimeToMinutes(timeStr: string): number {
  const cleaned = timeStr.trim().toUpperCase();
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!match) return -1;
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3];
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

function extractTimeRanges(availableTime: string): Array<{ start: number; end: number }> {
  if (!availableTime) return [];

  // Remove day prefixes like "Mon & Fri –" or "Tue, Thu, Fri –"
  let cleaned = availableTime.replace(/^[A-Za-z,&\s]+–\s*/, "");

  // Handle multi-range format like "9–10 AM & 5–6 PM"
  // Split on " & " to handle multiple ranges
  const parts = cleaned.split(/\s*&\s*/);
  const ranges: Array<{ start: number; end: number }> = [];

  for (const part of parts) {
    // Try "X AM to Y PM" format
    const toMatch = part.match(/(\d{1,2}(?::\d{2})?)\s*(AM|PM)\s*(?:to|–|-)\s*(\d{1,2}(?::\d{2})?)\s*(AM|PM)/i);
    if (toMatch) {
      const startStr = `${toMatch[1]} ${toMatch[2]}`;
      const endStr = `${toMatch[3]} ${toMatch[4]}`;
      const start = parseTimeToMinutes(startStr);
      const end = parseTimeToMinutes(endStr);
      if (start >= 0 && end >= 0) ranges.push({ start, end });
      continue;
    }

    // Try "9–10 AM" format (same period)
    const sameMatch = part.match(/(\d{1,2}(?::\d{2})?)\s*(?:–|-)\s*(\d{1,2}(?::\d{2})?)\s*(AM|PM)/i);
    if (sameMatch) {
      const startStr = `${sameMatch[1]} ${sameMatch[3]}`;
      const endStr = `${sameMatch[2]} ${sameMatch[3]}`;
      const start = parseTimeToMinutes(startStr);
      const end = parseTimeToMinutes(endStr);
      if (start >= 0 && end >= 0) ranges.push({ start, end });
      continue;
    }
  }

  // Fallback: try the whole string as a single range
  if (ranges.length === 0) {
    const fallback = cleaned.match(/(\d{1,2}(?::\d{2})?)\s*(AM|PM)\s*(?:to|–|-)\s*(\d{1,2}(?::\d{2})?)\s*(AM|PM)/i);
    if (fallback) {
      const start = parseTimeToMinutes(`${fallback[1]} ${fallback[2]}`);
      const end = parseTimeToMinutes(`${fallback[3]} ${fallback[4]}`);
      if (start >= 0 && end >= 0) ranges.push({ start, end });
    }
  }

  return ranges;
}

export function generateSlots(availableTime: string | undefined): string[] {
  if (!availableTime) return [];
  
  const ranges = extractTimeRanges(availableTime);
  const slots: string[] = [];

  for (const { start, end } of ranges) {
    let current = start;
    while (current + 30 <= end) {
      slots.push(minutesToTimeStr(current));
      current += 30;
    }
  }

  return slots;
}
