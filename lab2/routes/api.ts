import { Router, Request, Response } from "express";
import { validateStudentId, validatePassword, validateScreenshot, validateTransactionNumber } from "../src/validators";
import { evaluateRegistration, isDuplicateModule } from "../src/registration";
import { students } from "../src/db";

const router = Router();

// R1-R4: Student Login
router.post("/login", (req: Request, res: Response) => {
  const { studentId, password } = req.body;

  const idCheck = validateStudentId(studentId);
  if (!idCheck.valid) {
    return res.status(400).json({ success: false, message: idCheck.reason });
  }

  const pwCheck = validatePassword(password);
  if (!pwCheck.valid) {
    return res.status(400).json({ success: false, message: pwCheck.reason });
  }

  const student = students[studentId];
  if (!student || student.password !== password) {
    return res.status(401).json({ success: false, message: "Invalid Student ID or Password." });
  }

  res.json({ success: true, message: "Login successful." });
});

// R6-R9: Tuition Payment upload and verification
router.post("/payment/upload", (req: Request, res: Response) => {
  const { studentId, screenshotFilename, transactionNumber } = req.body;

  const student = students[studentId];
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }

  const fileCheck = validateScreenshot(screenshotFilename);
  if (!fileCheck.valid) {
    return res.status(400).json({ success: false, message: fileCheck.reason });
  }

  const txnCheck = validateTransactionNumber(transactionNumber);
  if (!txnCheck.valid) {
    return res.status(400).json({ success: false, message: txnCheck.reason });
  }

  // Simulate the college verifying the payment (R8)
  student.paymentVerified = true;
  res.json({ success: true, message: "Payment verified. Electronic receipt generated." });
});

// Section 2: Student Registration (decision table + duplicate module check)
router.post("/register", (req: Request, res: Response) => {
  const { studentId, moduleCode } = req.body;

  const student = students[studentId];
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }

  const decision = evaluateRegistration({
    paymentVerified: student.paymentVerified,
    drugTestVerified: student.drugTestVerified,
    regPeriodOpen: student.regPeriodOpen,
  });

  if (!decision.allowed) {
    return res.status(400).json({ success: false, message: decision.message });
  }

  if (isDuplicateModule(student.registeredModules, moduleCode)) {
    return res.status(400).json({ success: false, message: "Student already registered for this module." });
  }

  student.registeredModules.push(moduleCode);
  res.json({ success: true, message: `Registered for ${moduleCode} successfully.` });
});

// Section 4: Result Viewing (registered students only)
router.get("/results/:studentId", (req: Request, res: Response) => {
  const student = students[req.params.studentId];
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  if (student.registeredModules.length === 0) {
    return res.status(403).json({ success: false, message: "Only registered students may view results." });
  }
  res.json({ success: true, results: student.results });
});

// Helper endpoint to simulate drug test verification for demo purposes
router.post("/drugtest/verify", (req: Request, res: Response) => {
  const { studentId } = req.body;
  const student = students[studentId];
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  student.drugTestVerified = true;
  res.json({ success: true, message: "Drug testing report verified." });
});

export default router;