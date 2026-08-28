import request from "supertest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import fs from "fs";
import path from "path";
import { getPool, resetPool } from "../src/database";

let container: StartedPostgreSqlContainer;
let app: import("express").Application;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();

  process.env.PGHOST = container.getHost();
  process.env.PGPORT = String(container.getPort());
  process.env.PGUSER = container.getUsername();
  process.env.PGPASSWORD = container.getPassword();
  process.env.PGDATABASE = container.getDatabase();

  const pool = getPool();
  const schema = fs.readFileSync(path.join(__dirname, "../src/schema.sql"), "utf-8");
  await pool.query(schema);

  // app is imported after env vars are set, so its first getPool() call
  // connects to the Testcontainers database, not a local/default one
  app = require("../app").default;
}, 60000);

afterAll(async () => {
  await resetPool();
  await container.stop();
});

beforeEach(async () => {
  const pool = getPool();
  await pool.query("DELETE FROM students");
});

describe("POST /api/students", () => {
  test("creates a new student", async () => {
    const res = await request(app).post("/api/students").send({
      studentId: "02240354",
      fullName: "Phuntsho Namgyel",
      email: "phuntsho@rub.edu.bt",
      programme: "BE Software Engineering",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("rejects missing fields", async () => {
    const res = await request(app).post("/api/students").send({ studentId: "02240354" });
    expect(res.status).toBe(400);
  });

  test("rejects a duplicate student ID", async () => {
    await request(app).post("/api/students").send({
      studentId: "02240354", fullName: "A", email: "a@rub.edu.bt", programme: "SWE",
    });
    const res = await request(app).post("/api/students").send({
      studentId: "02240354", fullName: "B", email: "b@rub.edu.bt", programme: "SWE",
    });
    expect(res.status).toBe(409);
  });
});

describe("GET /api/students", () => {
  test("returns an empty list when no students exist", async () => {
    const res = await request(app).get("/api/students");
    expect(res.status).toBe(200);
    expect(res.body.students).toEqual([]);
  });

  test("returns all registered students", async () => {
    await request(app).post("/api/students").send({
      studentId: "02240354", fullName: "A", email: "a@rub.edu.bt", programme: "SWE",
    });
    await request(app).post("/api/students").send({
      studentId: "02240355", fullName: "B", email: "b@rub.edu.bt", programme: "SWE",
    });
    const res = await request(app).get("/api/students");
    expect(res.body.students.length).toBe(2);
  });
});

describe("GET /api/students/:studentId", () => {
  test("retrieves an existing student", async () => {
    await request(app).post("/api/students").send({
      studentId: "02240354", fullName: "Phuntsho Namgyel", email: "p@rub.edu.bt", programme: "SWE",
    });
    const res = await request(app).get("/api/students/02240354");
    expect(res.status).toBe(200);
    expect(res.body.student.fullName).toBe("Phuntsho Namgyel");
  });

  test("returns 404 for a non-existent student", async () => {
    const res = await request(app).get("/api/students/00000000");
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/students/:studentId", () => {
  test("updates an existing student", async () => {
    await request(app).post("/api/students").send({
      studentId: "02240354", fullName: "Old Name", email: "old@rub.edu.bt", programme: "SWE",
    });
    const res = await request(app).put("/api/students/02240354").send({ fullName: "New Name" });
    expect(res.status).toBe(200);
    expect(res.body.student.fullName).toBe("New Name");
  });

  test("returns 404 when updating a non-existent student", async () => {
    const res = await request(app).put("/api/students/00000000").send({ fullName: "X" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/students/:studentId", () => {
  test("deletes an existing student", async () => {
    await request(app).post("/api/students").send({
      studentId: "02240354", fullName: "A", email: "a@rub.edu.bt", programme: "SWE",
    });
    const res = await request(app).delete("/api/students/02240354");
    expect(res.status).toBe(200);

    const getRes = await request(app).get("/api/students/02240354");
    expect(getRes.status).toBe(404);
  });

  test("returns 404 when deleting a non-existent student", async () => {
    const res = await request(app).delete("/api/students/00000000");
    expect(res.status).toBe(404);
  });
});