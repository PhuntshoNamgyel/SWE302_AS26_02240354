export interface RegistrationConditions {
  paymentVerified: boolean;
  drugTestVerified: boolean;
  regPeriodOpen: boolean;
}

export interface RegistrationDecision {
  allowed: boolean;
  message: string;
}

// Section 2: Registration decision table (Activity 3 from Lab 1)
// Priority order when multiple conditions fail: Payment -> Drug Test -> Registration Period
export function evaluateRegistration(conditions: RegistrationConditions): RegistrationDecision {
  const { paymentVerified, drugTestVerified, regPeriodOpen } = conditions;

  if (paymentVerified && drugTestVerified && regPeriodOpen) {
    return { allowed: true, message: "Registration Allowed" };
  }
  if (!paymentVerified) {
    return { allowed: false, message: "Tuition payment not verified." };
  }
  if (!drugTestVerified) {
    return { allowed: false, message: "Drug testing report not verified." };
  }
  return { allowed: false, message: "Registration period is closed." };
}

// Section 2: A student cannot register the same module more than once
export function isDuplicateModule(registeredModules: string[], moduleCode: string): boolean {
  return registeredModules.includes(moduleCode);
}