import { getPool } from "./database";

export interface Student {
  studentId: string;
  fullName: string;
  email: string;
  programme: string;
}

export class DuplicateStudentError extends Error {
  constructor(studentId: string) {
    super(`Student with ID ${studentId} already exists.`);
    this.name = "DuplicateStudentError";
  }
}

export class StudentNotFoundError extends Error {
  constructor(studentId: string) {
    super(`Student with ID ${studentId} was not found.`);
    this.name = "StudentNotFoundError";
  }
}

// Create / register a student
export async function createStudent(student: Student): Promise<Student> {
  const pool = getPool();

  const existing = await pool.query(
    "SELECT student_id FROM students WHERE student_id = $1",
    [student.studentId]
  );
  if (existing.rows.length > 0) {
    throw new DuplicateStudentError(student.studentId);
  }

  await pool.query(
    "INSERT INTO students (student_id, full_name, email, programme) VALUES ($1, $2, $3, $4)",
    [student.studentId, student.fullName, student.email, student.programme]
  );

  return student;
}

// View / search a single student by ID
export async function getStudentById(studentId: string): Promise<Student> {
  const pool = getPool();
  const result = await pool.query(
    "SELECT student_id, full_name, email, programme FROM students WHERE student_id = $1",
    [studentId]
  );

  if (result.rows.length === 0) {
    throw new StudentNotFoundError(studentId);
  }

  return mapRow(result.rows[0]);
}

// View list of all registered students
export async function listStudents(): Promise<Student[]> {
  const pool = getPool();
  const result = await pool.query(
    "SELECT student_id, full_name, email, programme FROM students ORDER BY student_id"
  );
  return result.rows.map(mapRow);
}

// Update student information
export async function updateStudent(
  studentId: string,
  updates: Partial<Pick<Student, "fullName" | "email" | "programme">>
): Promise<Student> {
  const pool = getPool();

  const existing = await pool.query(
    "SELECT student_id FROM students WHERE student_id = $1",
    [studentId]
  );
  if (existing.rows.length === 0) {
    throw new StudentNotFoundError(studentId);
  }

  await pool.query(
    `UPDATE students
     SET full_name = COALESCE($2, full_name),
         email = COALESCE($3, email),
         programme = COALESCE($4, programme)
     WHERE student_id = $1`,
    [studentId, updates.fullName, updates.email, updates.programme]
  );

  return getStudentById(studentId);
}

// Delete a student record
export async function deleteStudent(studentId: string): Promise<void> {
  const pool = getPool();

  const result = await pool.query(
    "DELETE FROM students WHERE student_id = $1",
    [studentId]
  );

  if (result.rowCount === 0) {
    throw new StudentNotFoundError(studentId);
  }
}

function mapRow(row: any): Student {
  return {
    studentId: row.student_id,
    fullName: row.full_name,
    email: row.email,
    programme: row.programme,
  };
}