export default function Serializer<T>() {
  return {
    read: (u: string): T => (u ? JSON.parse(u) : undefined),
    write: (u: T): string => JSON.stringify(u),
  };
}
