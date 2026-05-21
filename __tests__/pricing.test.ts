import {
  PRICING,
  listPrice,
  expectedSpend,
} from "../lib/pricing";

describe("pricing system", () => {
  test("Cursor Pro price is correct", () => {
    expect(
      listPrice("cursor", "pro")
    ).toBe(20);
  });

  test("Windsurf Pro price is correct", () => {
    expect(
      listPrice("windsurf", "pro")
    ).toBe(15);
  });

  test("Enterprise pricing returns null", () => {
    expect(
      listPrice(
        "cursor",
        "enterprise"
      )
    ).toBeNull();
  });

  test("Unknown plans return null", () => {
    expect(
      listPrice(
        "cursor",
        "invalid-plan"
      )
    ).toBeNull();
  });

  test("expectedSpend calculates correctly", () => {
    expect(
      expectedSpend(
        "cursor",
        "pro",
        3
      )
    ).toBe(60);
  });

  test("expectedSpend returns 0 for custom pricing", () => {
    expect(
      expectedSpend(
        "chatgpt",
        "enterprise",
        10
      )
    ).toBe(0);
  });

  test("No pricing values are undefined", () => {
    Object.values(PRICING).forEach(
      (tool) => {
        Object.values(tool).forEach(
          (price) => {
            expect(price).not.toBeUndefined();
          }
        );
      }
    );
  });
});