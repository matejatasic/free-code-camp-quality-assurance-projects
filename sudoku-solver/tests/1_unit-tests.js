const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");
const puzzleStrings = require("../controllers/puzzle-strings.js");

let solver = new Solver();

suite("Unit tests", () => {
    suite("validate tests", () => {
        test("should show as valid a puzzle string of 81 characters", () => {
            assert.isTrue(solver.validate([...puzzleStrings[0][0]]))
        });

        test("should show puzzle string as invalid if it has invalid characters", () => {
            assert.isFalse(solver.validate(puzzleStrings[5][0]))
        });

        test("should show puzzle string as invalid if it has more than 81 charaters", () => {
            assert.isFalse(solver.validate(puzzleStrings[6][0]))
        });
    });

    suite("row placement tests", () => {
        test("should show as valid a placement in a row that does not violate the sudoku rules", () => {
            assert.isTrue(solver.checkRowPlacement(puzzleStrings[1][0], "A", "2", 4));
        });

        test("should show as invalid a placement in a row that violates the sudoku rules", () => {
            assert.isFalse(solver.checkRowPlacement(puzzleStrings[1][0], "A", "2", 9));
        });
    });

    suite("column placement tests", () => {
        test("should show as valid a placement in a column that does not violate the sudoku rules", () => {
            assert.isTrue(solver.checkColPlacement(puzzleStrings[1][0], "C", "9", 4));
        });

        test("should show as invalid a placement in a column that violates the sudoku rules", () => {
            assert.isFalse(solver.checkColPlacement(puzzleStrings[1][0], "C", "9", 9));
        });
    });

    suite("region placement tests", () => {
        test("should show as valid a placement in a region that does not violate the sudoku rules", () => {
            assert.isTrue(solver.checkRegionPlacement(puzzleStrings[1][0], "B", "8", 1));
        });

        test("should show as invalid a placement in a region that violates the sudoku rules", () => {
            assert.isFalse(solver.checkRegionPlacement(puzzleStrings[1][0], "B", "8", 7));
        });
    });

    suite("solve tests", () => {
        test("should return a string when the puzzle is solved", () => {
            assert.isString(solver.solve(puzzleStrings[1][0]));
        });

        test("should return false if puzzle cannot be solved", () => {
            assert.isFalse(solver.solve(puzzleStrings[7][0]));
        });

        test("should return a valid solution", () => {
            const solution = solver.solve(puzzleStrings[1][0]);

            assert.equal(puzzleStrings[1][1], solution);
        })
    });
});