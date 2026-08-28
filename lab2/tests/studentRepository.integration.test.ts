import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import fs from "fs";
import path from "path";
import { getPool, resetPool } from "../src/database";
import {
  createStudent,
  getStudentById,
  listStudents,
  updateStudent,
  deleteStudent,
  DuplicateStudentError,
  StudentNotFoundError,
} from "../src/studentRepository";

let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  // Starts a real, temporary PostgreSQL container just for this test run
  container = await new PostgreSqlContainer("postgres:16-alpine").start();

  // Point our connection pool at the container instead of a real server
  process.env.PGHOST = container.getHost();
  process.env.PGPORT = String(container.getPort());
  process.env.PGUSER = container.getUsername();
  process.env.PGPASSWORD = container.getPassword();
  process.env.PGDATABASE = container.getDatabase();

  const pool = getPool();
  const schema = fs.readFileSync(path.join(__dirname, "../src/schema.sql"), "utf-8");
  await pool.query(schema);
}, 60000);

afterAll(async () => {
  await resetPool();
  await container.stop();
});

beforeEach(async () => {
  // Clears the table before every test so tests don't affect each other
  const pool = getPool();
  await pool.query("DELETE FROM students");
});

describe("createStudent", () => {
  test("creates a new student record", async () => {
    const student = await createStudent({
      studentId: "02240354",
      fullName: "Phuntsho Namgyel",
      email: "phuntsho@rub.edu.bt",
      programme: "BE Software Engineering",
    });
    expect(student.studentId).toBe("02240354");
  });

  test("rejects a duplicate student ID", async () => {
    await createStudent({ studentId: "02240354", fullName: "A", email: "a@rub.edu.bt", programme: "SWE" });
    await expect(
      createStudent({ studentId: "02240354", fullName: "B", email: "b@rub.edu.bt", programme: "SWE" })
    ).rejects.toThrow(DuplicateStudentError);
  });
});

describe("getStudentById", () => {
  test("retrieves an existing student", async () => {
    await createStudent({ studentId: "02240354", fullName: "Phuntsho Namgyel", email: "p@rub.edu.bt", programme: "SWE" });
    const student = await getStudentById("02240354");
    expect(student.fullName).toBe("Phuntsho Namgyel");
  });

  test("throws for a non-existent student", async () => {
    await expect(getStudentById("00000000")).rejects.toThrow(StudentNotFoundError);
  });
});

describe("listStudents", () => {
  test("returns all registered students", async () => {
    await createStudent({ studentId: "02240354", fullName: "A", email: "a@rub.edu.bt", programme: "SWE" });
    await createStudent({ studentId: "02240355", fullName: "B", email: "b@rub.edu.bt", programme: "SWE" });
    const students = await listStudents();
    expect(students.length).toBe(2);
  });

  test("returns an empty list when no students exist", async () => {
    const students = await listStudents();
    expect(students).toEqual([]);
  });
});

describe("updateStudent", () => {
  test("updates an existing student's information", async () => {
    await createStudent({ studentId: "02240354", fullName: "Old Name", email: "old@rub.edu.bt", programme: "SWE" });
    const updated = await updateStudent("02240354", { fullName: "New Name" });
    expect(updated.fullName).toBe("New Name");
    expect(updated.email).toBe("old@rub.edu.bt");
  });

  test("throws when updating a non-existent student", async () => {
    await expect(updateStudent("00000000", { fullName: "X" })).rejects.toThrow(StudentNotFoundError);
  });
});

describe("deleteStudent", () => {
  test("deletes an existing student", async () => {
    await createStudent({ studentId: "02240354", fullName: "A", email: "a@rub.edu.bt", programme: "SWE" });
    await deleteStudent("02240354");
    await expect(getStudentById("02240354")).rejects.toThrow(StudentNotFoundError);
  });

  test("throws when deleting a non-existent student", async () => {
    await expect(deleteStudent("00000000")).rejects.toThrow(StudentNotFoundError);
  });
});