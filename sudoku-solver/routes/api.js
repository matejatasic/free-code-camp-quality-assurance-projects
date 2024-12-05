"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {

    let solver = new SudokuSolver();

    app.route("/api/check")
        .post((request, response) => {
            const { puzzle, coordinate, value } = request.body;
        
            if (puzzle === undefined | coordinate === undefined | value === undefined ) {
                return response.json({ error: "Required field(s) missing" });
            }

            if (!solver.validate(puzzle)) {
                return response.json({ error: solver.validationError });
            }

            if (!solver.validateValue(value)) {
                return response.json({ error: "Invalid value" });
            }

            if (!solver.validateCoordinates(coordinate)) {
                return response.json({ error: "Invalid coordinate" });   
            }

            const [row, column] = solver.splitCoordinates(coordinate);

            const isValidRowPlacement = solver.checkRowPlacement(puzzle, row, column, value);
            const isValidColumnPlacement = solver.checkColPlacement(puzzle, row, column, value);
            const isValidRegionPlacement = solver.checkRegionPlacement(puzzle, row, column, value);

            let conflicts = [];

            if (!isValidRowPlacement) {
                conflicts.push("row");
            }
            if (!isValidColumnPlacement) {
                conflicts.push("column");
            }
            if (!isValidRegionPlacement) {
                conflicts.push("region");
            }

            if (conflicts.length > 0) {
                return response.json({ valid: false, conflict: conflicts })
            }

            return response.json({ valid: true });
        });

    app.route("/api/solve")
        .post((request, response) => {
            const { puzzle } = request.body;

            if (!puzzle) {
                return response.send({error: "Required field missing"});
            }


            if (!solver.validate(puzzle)) {
                return response.send({error: solver.validationError});
            }

            const solution = solver.solve(puzzle);

            if (!solution) {
                return response.send({error: "Puzzle cannot be solved"})
            }

            return response.send({"solution": solution});
        });
};