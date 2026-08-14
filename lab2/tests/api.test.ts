import request from "supertest";
import app from "../app";
import { resetStudents } from "../src/db";

beforeEach(() => {
  resetStudents();
});

describe("POST /api/login (R1-R4)", () => {
  test("logs in with valid credentials", async () => {
    const res = await request(app).post("/api/login").send({ studentId: "02240354", password: "Pema1234" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("rejects a missing Student ID", async () => {
    const res = await request(app).post("/api/login").send({ studentId: "", password: "Pema1234" });
    expect(res.status).toBe(400);
  });

  test("rejects a malformed password", async () => {
    const res = await request(app).post("/api/login").send({ studentId: "02240354", password: "weak" });
    expect(res.status).toBe(400);
  });

  test("rejects a wrong password for a valid-format ID", async () => {
    const res = await request(app).post("/api/login").send({ studentId: "02240354", password: "Wrong123" });
    expect(res.status).toBe(401);
  });

  test("rejects an unknown student", async () => {
    const res = await request(app).post("/api/login").send({ studentId: "99999999", password: "Pema1234" });
    expect(res.status).toBe(401);
  });
});

describe("POST /api/payment/upload (R6-R9)", () => {
  test("accepts a valid screenshot and transaction number", async () => {
    const res = await request(app).post("/api/payment/upload").send({
      studentId: "02240354",
      screenshotFilename: "fees.jpg",
      transactionNumber: "123-123456789",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/receipt/i);
  });

  test("rejects an invalid file type", async () => {
    const res = await request(app).post("/api/payment/upload").send({
      studentId: "02240354",
      screenshotFilename: "fees.pdf",
      transactionNumber: "123-123456789",
    });
    expect(res.status).toBe(400);
  });

  test("rejects a malformed transaction number", async () => {
    const res = await request(app).post("/api/payment/upload").send({
      studentId: "02240354",
      screenshotFilename: "fees.jpg",
      transactionNumber: "123123456789",
    });
    expect(res.status).toBe(400);
  });

  test("rejects an unknown student", async () => {
    const res = await request(app).post("/api/payment/upload").send({
      studentId: "00000000",
      screenshotFilename: "fees.jpg",
      transactionNumber: "123-123456789",
    });
    expect(res.status).toBe(404);
  });
});

describe("POST /api/register (Section 2 - decision table + duplicates)", () => {
  test("rejects registration when payment is not verified", async () => {
    const res = await request(app).post("/api/register").send({ studentId: "02240354", moduleCode: "SWE302" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Tuition payment not verified.");
  });

  test("rejects registration when payment is verified but drug test is not", async () => {
    await request(app).post("/api/payment/upload").send({
      studentId: "02240354",
      screenshotFilename: "fees.jpg",
      transactionNumber: "123-123456789",
    });
    const res = await request(app).post("/api/register").send({ studentId: "02240354", moduleCode: "SWE302" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Drug testing report not verified.");
  });

  test("allows registration when all conditions are satisfied", async () => {
    await request(app).post("/api/payment/upload").send({
      studentId: "02240354",
      screenshotFilename: "fees.jpg",
      transactionNumber: "123-123456789",
    });
    await request(app).post("/api/drugtest/verify").send({ studentId: "02240354" });

    const res = await request(app).post("/api/register").send({ studentId: "02240354", moduleCode: "SWE302" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("blocks duplicate module registration", async () => {
    await request(app).post("/api/payment/upload").send({
      studentId: "02240354",
      screenshotFilename: "fees.jpg",
      transactionNumber: "123-123456789",
    });
    await request(app).post("/api/drugtest/verify").send({ studentId: "02240354" });
    await request(app).post("/api/register").send({ studentId: "02240354", moduleCode: "SWE302" });

    const res = await request(app).post("/api/register").send({ studentId: "02240354", moduleCode: "SWE302" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });

  test("rejects registration for an unknown student", async () => {
    const res = await request(app).post("/api/register").send({ studentId: "00000000", moduleCode: "SWE302" });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/results/:studentId (Section 4)", () => {
  test("denies results for an unregistered student", async () => {
    const res = await request(app).get("/api/results/02240354");
    expect(res.status).toBe(403);
  });

  test("returns results after successful registration", async () => {
    await request(app).post("/api/payment/upload").send({
      studentId: "02240354",
      screenshotFilename: "fees.jpg",
      transactionNumber: "123-123456789",
    });
    await request(app).post("/api/drugtest/verify").send({ studentId: "02240354" });
    await request(app).post("/api/register").send({ studentId: "02240354", moduleCode: "SWE302" });

    const res = await request(app).get("/api/results/02240354");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(0);
  });

  test("rejects an unknown student", async () => {
    const res = await request(app).get("/api/results/00000000");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/drugtest/verify", () => {
  test("verifies drug test for a known student", async () => {
    const res = await request(app).post("/api/drugtest/verify").send({ studentId: "02240354" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("rejects an unknown student", async () => {
    const res = await request(app).post("/api/drugtest/verify").send({ studentId: "00000000" });
    expect(res.status).toBe(404);
  });
});