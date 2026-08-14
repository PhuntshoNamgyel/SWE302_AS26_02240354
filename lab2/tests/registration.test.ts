import { evaluateRegistration, isDuplicateModule } from "../src/registration";

describe("evaluateRegistration (decision table)", () => {
  test("Rule 1: Y, Y, Y -> Registration Allowed", () => {
    const result = evaluateRegistration({ paymentVerified: true, drugTestVerified: true, regPeriodOpen: true });
    expect(result.allowed).toBe(true);
    expect(result.message).toBe("Registration Allowed");
  });

  test("Rule 2: Y, Y, N -> Registration period is closed", () => {
    const result = evaluateRegistration({ paymentVerified: true, drugTestVerified: true, regPeriodOpen: false });
    expect(result.message).toBe("Registration period is closed.");
  });

  test("Rule 3: Y, N, Y -> Drug testing report not verified", () => {
    const result = evaluateRegistration({ paymentVerified: true, drugTestVerified: false, regPeriodOpen: true });
    expect(result.message).toBe("Drug testing report not verified.");
  });

  test("Rule 4: Y, N, N -> Drug testing report not verified (priority)", () => {
    const result = evaluateRegistration({ paymentVerified: true, drugTestVerified: false, regPeriodOpen: false });
    expect(result.message).toBe("Drug testing report not verified.");
  });

  test("Rule 5: N, Y, Y -> Tuition payment not verified", () => {
    const result = evaluateRegistration({ paymentVerified: false, drugTestVerified: true, regPeriodOpen: true });
    expect(result.message).toBe("Tuition payment not verified.");
  });

  test("Rule 8: N, N, N -> Tuition payment not verified (top priority)", () => {
    const result = evaluateRegistration({ paymentVerified: false, drugTestVerified: false, regPeriodOpen: false });
    expect(result.message).toBe("Tuition payment not verified.");
  });
});

describe("isDuplicateModule", () => {
  test("returns true when the module is already registered", () => {
    expect(isDuplicateModule(["SWE302"], "SWE302")).toBe(true);
  });
  test("returns false when the module is not yet registered", () => {
    expect(isDuplicateModule(["SWE302"], "SWE301")).toBe(false);
  });
});