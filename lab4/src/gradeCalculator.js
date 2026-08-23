// gradeCalculator.js
// Calculates student grades and averages

const PASS_MARK = 40;
const LOW_ATTENDANCE_THRESHOLD = 75;
const LOW_ATTENDANCE_PENALTY = 0.1;
const EXTRA_CREDIT_BONUS = 5;

const GRADE_THRESHOLDS = [
    { min: 90, letter: "A" },
    { min: 80, letter: "B" },
    { min: 70, letter: "C" },
    { min: 60, letter: "D" },
    { min: PASS_MARK, letter: "E" }
];

const GRADE_DESCRIPTIONS = {
    A: "Excellent",
    B: "Good",
    C: "Average",
    D: "Below Average",
    E: "Poor"
};

function calcAverage(student) {
    if (!hasScores(student)) {
        return 0;
    }
    const total = sumScores(student.scores);
    return total / student.scores.length;
}

function calc(student) {
    if (!hasScores(student)) {
        return "F";
    }

    let average = calcAverage(student);
    average = applyAttendancePenalty(average, student.attendance);
    average = applyExtraCredit(average, student.hasExtraCredit);

    return letterGradeFor(average);
}

function checkGrade(letter) {
    return GRADE_DESCRIPTIONS[letter] || "Fail";
}

function hasScores(student) {
    return (student?.scores?.length ?? 0) > 0;
}

function sumScores(scores) {
    let total = 0;
    for (const score of scores) {
        total += score;
    }
    return total;
}

function applyAttendancePenalty(average, attendance) {
    if (attendance != null && attendance < LOW_ATTENDANCE_THRESHOLD) {
        return average - average * LOW_ATTENDANCE_PENALTY;
    }
    return average;
}

function applyExtraCredit(average, hasExtraCredit) {
    return hasExtraCredit ? average + EXTRA_CREDIT_BONUS : average;
}

function letterGradeFor(average) {
    const match = GRADE_THRESHOLDS.find((threshold) => average >= threshold.min);
    return match ? match.letter : "F";
}

module.exports = { calc, calcAverage, checkGrade };