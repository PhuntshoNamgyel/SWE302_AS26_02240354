export interface StudentResult {
  moduleCode: string;
  moduleTitle: string;
  grade: string;
}

export interface Student {
  password: string;
  paymentVerified: boolean;
  drugTestVerified: boolean;
  regPeriodOpen: boolean;
  registeredModules: string[];
  results: StudentResult[];
}

const initialData: Record<string, Student> = {
  "02240354": {
    password: "Pema1234",
    paymentVerified: false,
    drugTestVerified: false,
    regPeriodOpen: true,
    registeredModules: [],
    results: [
      { moduleCode: "SWE302", moduleTitle: "Software Testing & QA", grade: "A" },
      { moduleCode: "SWE303", moduleTitle: "Software Project Management", grade: "B+" },
    ],
  },
};

export const students: Record<string, Student> = {};

// Restores the in-memory data to its original state.
// Used before each test so tests don't leak state into one another.
export function resetStudents(): void {
  Object.keys(students).forEach((key) => delete students[key]);
  Object.keys(initialData).forEach((key) => {
    students[key] = JSON.parse(JSON.stringify(initialData[key]));
  });
}

resetStudents();