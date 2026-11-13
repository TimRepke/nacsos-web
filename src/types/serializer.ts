export default function Serializer<T, D>(defaults: D) {
  const freshDefaults = (): D => JSON.parse(JSON.stringify(defaults)) as D;
  return {
    read: (u: string): T | D => {
      if (!u) return freshDefaults();
      try {
        return JSON.parse(u) as T;
      } catch {
        // Corrupted stored value — fall back to a fresh copy of the defaults.
        return freshDefaults();
      }
    },
    write: (u: T): string => JSON.stringify(u),
  };
}
