export type Operation = "NOT" | "AND" | "OR" | "XOR" | "SHL" | "SHR";
export const byte = (n: number) => n & 255;
export const bits = (n: number) => byte(n).toString(2).padStart(8, "0");
export const signed = (n: number) => byte(n) >= 128 ? byte(n) - 256 : byte(n);
export function calculate(a: number, b: number, op: Operation): number {
  switch (op) {
    case "NOT": return byte(~a);
    case "AND": return byte(a & b);
    case "OR": return byte(a | b);
    case "XOR": return byte(a ^ b);
    case "SHL": return byte(a << 1);
    case "SHR": return byte(a >>> 1);
  }
}
