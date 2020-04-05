//Todo look into combining simple and complex check
//Simple if poss == 1, complex if more than 1

//easy puzzle
// let puzzle = [
//     [2, 6, 9, 0, 0, 0, 0, 0, 0],
//     [0, 8, 1, 7, 0, 3, 0, 0, 4],
//     [4, 7, 0, 9, 2, 0, 1, 0, 5],
//     [6, 9, 4, 0, 5, 0, 2, 0, 0],
//     [0, 0, 2, 3, 9, 0, 5, 4, 0],
//     [0, 5, 0, 0, 8, 0, 0, 0, 0],
//     [0, 0, 5, 0, 0, 2, 4, 0, 9],
//     [9, 0, 6, 0, 0, 0, 0, 5, 2],
//     [7, 0, 0, 5, 0, 9, 3, 0, 0]
// ];

//hard puzzle
// //does not work for this
let puzzle = [
    [9, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 7],
    [5, 0, 0, 0, 0, 3, 0, 0, 4], //[5, 0, 0, 0, 0, 3, 0, 0, 4], to test max stack
    [0, 0, 7, 0, 0, 0, 2, 0, 0],
    [0, 0, 3, 6, 0, 8, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 6, 1, 0],
    [0, 8, 5, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 3, 2, 0, 0, 6, 0],
    [0, 4, 0, 0, 1, 0, 0, 9, 0]
];

class Suduko {
    constructor(puzzle) {
        this.puzzle = puzzle;
    }
    display(target) {
        for (let i = 0; i < puzzle.length; i++) {
            target.innerHTML += puzzle[i] + "<br>";
        }
    }
    isComplete() {
        for (let i = 0; i < this.puzzle.length; i++) {
            if (this.puzzle[i].indexOf(0) !== -1) return false;
        }
        return true;
    }
    solve() {
        if (this.isComplete()) return true;
        let inserts = false;
        for (let row = 0; row < this.puzzle.length; row++) {
            for (let col = 0; col < this.puzzle.length; col++) {
                if (this.isEmpty(col, row) === false) continue;
                let poss = this.getPossInCell(col, row);
                if (poss.length === 1) {
                    this.insert(col, row, poss[0]);
                    inserts = true;
                } else {
                    // if (this.complexCellSolve(col, row) === true){
                    //     inserts = true;
                    // } 
                    for (let i = 0; i < poss.length; i++) {
                        if (this.getPossInColForVal(col, poss[i]).length === 1
                            || this.getPossInRowForVal(row, poss[i]).length === 1
                            || this.getPossInSquareForVal(col, row, poss[i]).length === 1) {
                            this.insert(col, row, poss[i]);
                            inserts = true;
                            break;
                        }
                    }
                }
            }
        }
        if (inserts === false) {
            alert("No solution found");
            return;
        }
        this.solve();
    }
    insert(col, row, val) {
        this.puzzle[row][col] = val;
    }
    //if square empty return true;
    isEmpty(col, row) {
        return puzzle[row][col] === 0;
    }
    //if n is in row return false 
    checkFitsRow(row, val) {
        return puzzle[row].indexOf(val) === -1;
    }
    //if n is in col return false 
    checkFitsCol(col, val) {
        for (let i = 0; i < puzzle.length; i++) {
            if (puzzle[i][col] === val) return false;
        }
        return true;
    }
    //if n is in square return false
    checkFitsSquare = (col, row, val) => {
        let colBounds = this.getBounds(col);
        let rowBounds = this.getBounds(row);
        for (let i = rowBounds[0]; i <= rowBounds[1]; i++) {
            let pos = puzzle[i].indexOf(val);
            if (pos >= colBounds[0] && pos <= colBounds[1]) return false;
        }
        return true;
    }
    getBounds = (val) => {
        let bounds = [3, 5];
        if (val <= 2) {
            bounds = [0, 2];
        }
        if (val > 5) {
            bounds = [6, 8];
        }
        return bounds;
    }
    //get all the possible numbers that can fit in a cell
    getPossInCell(col, row) {
        let poss = [];
        for (let i = 1; i <= this.puzzle.length; i++) {
            if (this.checkFitsRow(row, i) === false) continue;
            if (this.checkFitsCol(col, i) === false) continue;
            if (this.checkFitsSquare(col, row, i) === false) continue;
            poss.push(i);
        }
        return poss;
    }
    //get all the possible cells in a row the val can fit
    getPossInRowForVal(row, val) {
        let poss = [];
        for (let i = 0; i < this.puzzle[row].length; i++) {
            if (this.isEmpty(i, row) === false) continue;
            let cellPoss = this.getPossInCell(i, row);
            if (cellPoss.indexOf(val) !== -1) poss.push([i, row]);
        }
        return poss;
    }
    //get all the possible cells in a col the val can fit
    getPossInColForVal(col, val) {
        let poss = [];
        for (let i = 0; i < this.puzzle.length; i++) {
            if (this.isEmpty(col, i) === false) continue;
            let cellPoss = this.getPossInCell(col, i);
            if (cellPoss.indexOf(val) !== -1) poss.push([col, i]);
        }
        return poss;
    }
    //get all the possible cells in a square the val can fit
    getPossInSquareForVal(col, row, val) {
        let poss = [];
        let colBounds = this.getBounds(col);
        let rowBounds = this.getBounds(row);
        for (let row = rowBounds[0]; row <= rowBounds[1]; row++) {
            for (let col = colBounds[0]; col <= colBounds[1]; col++) {
                if (this.isEmpty(col, row) === false) continue;
                let cellPoss = this.getPossInCell(col, row);
                if (cellPoss.indexOf(val) !== -1) poss.push([col, row]);
            }
        }
        return poss;
    }
}

let suduko = new Suduko(puzzle);
let unsolvedEl = document.getElementById("puzzle");
let solvedEl = document.getElementById("puzzle_solved");
suduko.display(unsolvedEl);
suduko.solve();
suduko.display(solvedEl);