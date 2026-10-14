import { describe, expect, it } from "vitest";
import { bits, calculate, signed } from "./bit";
describe("8-bit lab", () => {
  it("formats bytes", () => expect(bits(5)).toBe("00000101"));
  it("handles two’s complement", () => expect(signed(251)).toBe(-5));
  it("masks NOT to 8 bits", () => expect(calculate(0, 0, "NOT")).toBe(255));
  it("shifts with overflow", () => expect(calculate(128, 0, "SHL")).toBe(0));
  it("calculates XOR", () => expect(calculate(10, 12, "XOR")).toBe(6));
});
