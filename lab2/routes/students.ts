import { Router, Request, Response } from "express";
import {
  createStudent,
  getStudentById,
  listStudents,
  updateStudent,
  deleteStudent,
  DuplicateStudentError,
  StudentNotFoundError,
} from "../src/studentRepository";

const router = Router();

// Add / register a student
router.post("/", async (req: Request, res: Response) => {
  const { studentId, fullName, email, programme } = req.body;

  if (!studentId || !fullName || !email || !programme) {
    return res.status(400).json({ success: false, message: "studentId, fullName, email, and programme are all required." });
  }

  try {
    const student = await createStudent({ studentId, fullName, email, programme });
    res.status(201).json({ success: true, student });
  } catch (err) {
    if (err instanceof DuplicateStudentError) {
      return res.status(409).json({ success: false, message: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create student." });
  }
});

// View list of all registered students
router.get("/", async (_req: Request, res: Response) => {
  try {
    const students = await listStudents();
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to list students." });
  }
});

// View / search a student by ID
router.get("/:studentId", async (req: Request, res: Response) => {
  try {
    const student = await getStudentById(req.params.studentId);
    res.json({ success: true, student });
  } catch (err) {
    if (err instanceof StudentNotFoundError) {
      return res.status(404).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to retrieve student." });
  }
});

// Update student information
router.put("/:studentId", async (req: Request, res: Response) => {
  const { fullName, email, programme } = req.body;

  try {
    const student = await updateStudent(req.params.studentId, { fullName, email, programme });
    res.json({ success: true, student });
  } catch (err) {
    if (err instanceof StudentNotFoundError) {
      return res.status(404).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to update student." });
  }
});

// Delete a student record
router.delete("/:studentId", async (req: Request, res: Response) => {
  try {
    await deleteStudent(req.params.studentId);
    res.json({ success: true, message: "Student deleted." });
  } catch (err) {
    if (err instanceof StudentNotFoundError) {
      return res.status(404).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "Failed to delete student." });
  }
});

export default router;