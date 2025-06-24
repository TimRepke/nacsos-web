export default function Serializer<T, D>(defaults: D) {
  return {
    read: (u: string): T | D => (u ? (JSON.parse(u) as T) : defaults),
    write: (u: T): string => JSON.stringify(u),
  };
}
