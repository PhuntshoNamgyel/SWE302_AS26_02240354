import { validateStudentId, validatePassword, validateScreenshot, validateTransactionNumber } from "../src/validators";

describe("validateStudentId (R1, R2)", () => {
  test("accepts a valid 8-digit numeric ID", () => {
    expect(validateStudentId("02240354").valid).toBe(true);
  });
  test("rejects an empty ID", () => {
    expect(validateStudentId("").valid).toBe(false);
  });
  test("rejects an ID that is too short (7 digits)", () => {
    expect(validateStudentId("2240354").valid).toBe(false);
  });
  test("rejects an ID that is too long (9 digits)", () => {
    expect(validateStudentId("022403541").valid).toBe(false);
  });
  test("rejects an ID containing letters", () => {
    expect(validateStudentId("0224035A").valid).toBe(false);
  });
});

describe("validatePassword (R3, R4)", () => {
  test("accepts a valid password", () => {
    expect(validatePassword("Pema1234").valid).toBe(true);
  });
  test("rejects an empty password", () => {
    expect(validatePassword("").valid).toBe(false);
  });
  test("rejects a password below 8 characters", () => {
    expect(validatePassword("Pem1").valid).toBe(false);
  });
  test("rejects a password above 12 characters", () => {
    expect(validatePassword("Panipuri12345").valid).toBe(false);
  });
  test("rejects a password missing an uppercase letter", () => {
    expect(validatePassword("pema1234").valid).toBe(false);
  });
  test("rejects a password missing a lowercase letter", () => {
    expect(validatePassword("PHUNTSHO1").valid).toBe(false);
  });
  test("rejects a password missing a number", () => {
    expect(validatePassword("Panipuri").valid).toBe(false);
  });
  test("accepts a password at the lower boundary (8 chars)", () => {
    expect(validatePassword("Pass123A").valid).toBe(true);
  });
  test("accepts a password at the upper boundary (12 chars)", () => {
    expect(validatePassword("Password123A").valid).toBe(true);
  });
  test("rejects a password just above the upper boundary (13 chars)", () => {
    expect(validatePassword("Password1234A").valid).toBe(false);
  });
});

describe("validateScreenshot (R6)", () => {
  test("accepts a .jpg file", () => {
    expect(validateScreenshot("fees.jpg").valid).toBe(true);
  });
  test("accepts a .png file", () => {
    expect(validateScreenshot("fees.png").valid).toBe(true);
  });
  test("rejects a .pdf file", () => {
    expect(validateScreenshot("fees.pdf").valid).toBe(false);
  });
  test("rejects a missing file", () => {
    expect(validateScreenshot("").valid).toBe(false);
  });
  test("rejects a filename with no extension", () => {
    expect(validateScreenshot("receipt").valid).toBe(false);
  });
});

describe("validateTransactionNumber (R7)", () => {
  test("accepts the correct format", () => {
    expect(validateTransactionNumber("123-123456789").valid).toBe(true);
  });
  test("rejects an empty value", () => {
    expect(validateTransactionNumber("").valid).toBe(false);
  });
  test("rejects a value missing the hyphen", () => {
    expect(validateTransactionNumber("123123456789").valid).toBe(false);
  });
  test("rejects a value with the wrong segment length", () => {
    expect(validateTransactionNumber("12-123456789").valid).toBe(false);
  });
});