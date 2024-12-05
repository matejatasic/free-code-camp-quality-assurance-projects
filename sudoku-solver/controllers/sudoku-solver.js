class SudokuSolver {
    rows = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I"
    ]
    rowIndexes = {
        "A": 0,
        "B": 9,
        "C": 18,
        "D": 27,
        "E": 36,
        "F": 45,
        "G": 54,
        "H": 63,
        "I": 72
    }
    regionColumnIndexes = {
        1: [0, 1, 2, 9, 10, 11, 18, 19, 20],
        2: [3, 4, 5, 12, 13, 14, 21, 22, 23],
        3: [6, 7, 8, 15, 16, 17, 24, 25, 26],
        4: [27, 28, 29, 36, 37, 38, 45, 46, 47],
        5: [30, 31, 32, 39, 40, 41, 48, 49, 50],
        6: [33, 34, 35, 42, 43, 44, 51, 52, 53],
        7: [54, 55, 56, 63, 64, 65, 72, 73, 74],
        8: [57, 58, 59, 66, 67, 68, 75, 76, 77],
        9: [60, 61, 62, 69, 70, 71, 78, 79, 80]
    }
    validationError = "";

    validateValue(value) {
        const valueRegex = /^[1-9]$/;

        if(!valueRegex.test(value)) {
            return false;
        }

        return true;
    }

    validateCoordinates(coordinates) {
        const coordinatesRegex = /^([A-Ia-i])([1-9])$/;

        if(!coordinatesRegex.test(coordinates)) {
            return false;
        }

        return true;
    }

    splitCoordinates(coordinate) {
        const coordinatesRegex = /^([A-Ia-i])([1-9])$/;

        let match = coordinate.match(coordinatesRegex);
        const row = match[1].toUpperCase();
        const column = match[2];

        return [row, column]
    }

    validate(puzzleString) {
        if (puzzleString.length !== 81) {
            this.validationError = "Expected puzzle to be 81 characters long";
            return false;
        }

        const singleDigitRegex = /^\d$/;

        for (let i = 0; i < 81; i++) {
            let character = puzzleString[i];

            if (character !== "." && !singleDigitRegex.test(character)) {
                this.validationError = "Invalid characters in puzzle";
                return false;
            }
        }

        return true;
    }

    checkRowPlacement(puzzleString, row, column, value) {
        if (!this.checkIsRowValid(row)) {
            return false;
        }

        const rowStartingIndex = this.rowIndexes[row.toUpperCase()];
        const rowEndingIndex = rowStartingIndex + 9;
        const columnInteger = parseInt(column);

        for (let i = rowStartingIndex; i < rowEndingIndex; i++) {
            const character = puzzleString[i];

            if (character == value) {
                if (i + 1 === rowStartingIndex + columnInteger) {
                    continue;
                }

                return false;
            }
        }

        return true;
    }

    checkColPlacement(puzzleString, row, column, value) {
        if (!this.checkIsRowValid(row)) {
            return false;
        }

        if (!this.checkIsColumnValid(column)) {
            return false;
        }

        const rowIndex = this.rows.indexOf(row);
        
        for (let i = column - 1, currentRowIndex = 0; i < 81; i += 9, currentRowIndex += 1) {
            const character = puzzleString[i];

            if (character == value) {
                if (currentRowIndex === rowIndex) {
                    continue;
                }

                return false;
            }
        }

        return true;
    }

    checkRegionPlacement(puzzleString, row, column, value) {
        if (!this.checkIsRowValid(row)) {
            return false;
        }

        if (!this.checkIsColumnValid(column)) {
            return false;
        }

        const region = this.getRegion(row, column);
        const regionIndexes = this.regionColumnIndexes[region];
        const rowStartingIndex = this.rowIndexes[row.toUpperCase()];
        const columnInteger = parseInt(column);

        for (let index of regionIndexes) {
            const character = puzzleString[index];
            
            if (character == value) {
                if (index + 1 === rowStartingIndex + columnInteger) {
                    continue;
                }

                return false;
            }
        }

        return true;
    }

    checkIsRowValid(row) {
        return this.rowIndexes.hasOwnProperty(row.toUpperCase())
    }

    checkIsColumnValid(column) {
        return column > 0 && column < 10;
    }

    getRegion(row, column) {
        row = row.toUpperCase()
        const firstThreeRows = ["A", "B", "C"];
        const secondThreeRows = ["D", "E", "F"];
        const thirdThreeRows = ["G", "H", "I"];

        if (firstThreeRows.includes(row)) {
            if (column < 4) {
                return 1;
            }
            if (column < 7) {
                return 2;
            }

            return 3;
        }

        if (secondThreeRows.includes(row)) {
            if (column < 4) {
                return 4;
            }
            if (column < 7) {
                return 5;
            }

            return 6;
        }

        if (thirdThreeRows.includes(row)) {
            if (column < 4) {
                return 7;
            }
            if (column < 7) {
                return 8;
            }

            return 9;
        }
    }

    solve(puzzleString) {
        const puzzleArray = puzzleString.split("");

        const findEmptyPosition = (puzzleArray) => {
            for (let i = 0; i < 81; i++) {
                if (puzzleArray[i] === ".") {
                    return i;
                }
            }
            return -1;
        };

        const indexToRowCol = (index) => {
            const rowIndex = Math.floor(index / 9);
            const colIndex = index % 9;
            const row = "ABCDEFGHI"[rowIndex];
            const column = colIndex + 1;

            return { row, column };
        };

        const solveRecursive = () => {
            const emptyIndex = findEmptyPosition(puzzleArray);
            if (emptyIndex === -1) {
                return true;
            }

            const { row, column } = indexToRowCol(emptyIndex);

            for (let num = 1; num <= 9; num++) {
                const value = num.toString();

                if (
                    this.checkRowPlacement(puzzleArray.join(""), row, column, value) &&
                    this.checkColPlacement(puzzleArray.join(""), row, column, value) &&
                    this.checkRegionPlacement(puzzleArray.join(""), row, column, value)
                ) {
                    puzzleArray[emptyIndex] = value;

                    if (solveRecursive()) {
                        return true;
                    }

                    puzzleArray[emptyIndex] = ".";
                }
            }

            return false;
        };

        if (solveRecursive()) {
            return puzzleArray.join("");
        } else {
            return false;
        }
    }
}

module.exports = SudokuSolver;