const { calc, calcAverage, checkGrade } = require("./gradeCalculator");

describe("calcAverage", () => {
    test("returns 0 when student is null", () => {
        expect(calcAverage(null)).toBe(0);
    });

    test("returns 0 when scores are missing", () => {
        expect(calcAverage({})).toBe(0);
    });

    test("returns 0 when scores array is empty", () => {
        expect(calcAverage({ scores: [] })).toBe(0);
    });

    test("calculates the correct average", () => {
        expect(calcAverage({ scores: [80, 90, 70] })).toBe(80);
    });
});

describe("calc", () => {
    test("returns F when student is null", () => {
        expect(calc(null)).toBe("F");
    });

    test("returns F when scores are missing", () => {
        expect(calc({})).toBe("F");
    });

    test("returns A for a high average with no penalties", () => {
        expect(calc({ scores: [95, 92, 98], attendance: 90 })).toBe("A");
    });

    test("returns B for a good average", () => {
        expect(calc({ scores: [85, 80, 82], attendance: 90 })).toBe("B");
    });

    test("applies attendance penalty when attendance is low", () => {
        // average 80, attendance 60 (<75) applies 10% penalty -> 72 -> C
        expect(calc({ scores: [80, 80, 80], attendance: 60 })).toBe("C");
    });

    test("does not apply penalty when attendance is 75 or above", () => {
        expect(calc({ scores: [80, 80, 80], attendance: 75 })).toBe("B");
    });

    test("applies extra credit bonus", () => {
        // average 55 + 5 extra credit = 60 -> D
        expect(calc({ scores: [55, 55, 55], hasExtraCredit: true })).toBe("D");
    });

    test("returns F for a low average with no extra credit", () => {
        expect(calc({ scores: [20, 25, 30] })).toBe("F");
    });

    test("returns E for a passing but low average", () => {
        expect(calc({ scores: [45, 40, 42] })).toBe("E");
    });
});

describe("checkGrade", () => {
    test("returns correct descriptions for known grades", () => {
        expect(checkGrade("A")).toBe("Excellent");
        expect(checkGrade("B")).toBe("Good");
        expect(checkGrade("C")).toBe("Average");
        expect(checkGrade("D")).toBe("Below Average");
        expect(checkGrade("E")).toBe("Poor");
    });

    test("returns Fail for unknown or F grade", () => {
        expect(checkGrade("F")).toBe("Fail");
        expect(checkGrade("Z")).toBe("Fail");
    });
});