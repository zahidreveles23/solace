export function freeLimit() {
  return Number(process.env.FREE_MESSAGES_PER_DAY || 10);
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function usedToday(session) {
  return session.day === today() ? session.used || 0 : 0;
}
