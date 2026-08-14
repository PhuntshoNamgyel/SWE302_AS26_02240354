export interface ValidationResult {
  valid: boolean;
  reason: string;
}

// R1, R2: Student ID must be present and exactly 8 digits, numeric only
export function validateStudentId(id: string | undefined | null): ValidationResult {
  if (id === undefined || id === null || id === "") {
    return { valid: false, reason: "Student ID is mandatory." };
  }
  if (!/^\d{8}$/.test(id)) {
    return { valid: false, reason: "Student ID must be exactly 8 digits, numeric only." };
  }
  return { valid: true, reason: "Valid Student ID." };
}

// R3, R4: Password must be present, 8-12 chars, with upper, lower, and number
export function validatePassword(pw: string | undefined | null): ValidationResult {
  if (pw === undefined || pw === null || pw === "") {
    return { valid: false, reason: "Password is mandatory." };
  }
  if (pw.length < 8 || pw.length > 12) {
    return { valid: false, reason: "Password must be between 8 and 12 characters." };
  }
  if (!/[A-Z]/.test(pw)) {
    return { valid: false, reason: "Password must include at least one uppercase letter." };
  }
  if (!/[a-z]/.test(pw)) {
    return { valid: false, reason: "Password must include at least one lowercase letter." };
  }
  if (!/[0-9]/.test(pw)) {
    return { valid: false, reason: "Password must include at least one number." };
  }
  return { valid: true, reason: "Valid password." };
}

// R6: Payment screenshot must be present and JPG, JPEG, or PNG
export function validateScreenshot(filename: string | undefined | null): ValidationResult {
  if (!filename) {
    return { valid: false, reason: "Payment screenshot is mandatory." };
  }
  const allowed = [".jpg", ".jpeg", ".png"];
  const dotIndex = filename.lastIndexOf(".");
  const ext = dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
  if (!allowed.includes(ext)) {
    return { valid: false, reason: "Screenshot must be JPG, JPEG, or PNG." };
  }
  return { valid: true, reason: "Valid screenshot." };
}

// R7: Transaction number must be present and match 3 digits - hyphen - 9 digits
export function validateTransactionNumber(txn: string | undefined | null): ValidationResult {
  if (!txn) {
    return { valid: false, reason: "Transaction number is mandatory." };
  }
  if (!/^\d{3}-\d{9}$/.test(txn)) {
    return { valid: false, reason: "Transaction number must be in the format 123-123456789." };
  }
  return { valid: true, reason: "Valid transaction number." };
}