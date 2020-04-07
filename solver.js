class Suduko {
    constructor(unsolvedPuzzle) {
        this.unsolvedPuzzle = unsolvedPuzzle;
    }
    getUnsolvedPuzzle() {
        return this.unsolvedPuzzle;
    }
    getSolvedPuzzle() {
        if (this.solvedPuzzle === undefined) {
            //need to clone the array so you don't overwrite original
            this.solvedPuzzle = this.unsolvedPuzzle.map(inner => inner.slice())
            this.solve();
        }
        return this.solvedPuzzle;
    }
    solve() {
        if (this.isComplete()) return; //return when complete
        let inserts = false;
        for (let row = 0; row < this.solvedPuzzle.length; row++) {
            for (let col = 0; col < this.solvedPuzzle.length; col++) {
                if (this.isEmpty(col, row) === false) continue;
                if(this.insertCellValue(col, row) === true) inserts = true;
            }
        }
        //if no values were input in an iteration and puzzle isn't complete
        //algorithm fails
        if (inserts === false) {
            alert("No solution found");
            return;
        }
        this.solve();
    }
    isComplete() {
        for (let i = 0; i < this.solvedPuzzle.length; i++) {
            if (this.solvedPuzzle[i].indexOf(0) !== -1) return false;
        }
        return true;
    }
    insertCellValue(col, row) {
        //first get a list of all possible values for cell
        //if there is only one possible value insert
        //else do a more complex search. 
        //complex checks if value can go elsewhere in col, row or square
        //if value can only go in one cell in col, row or square insert
        let poss = this.getPossInCell(col, row);
        if (poss.length === 1) {
            this.insert(col, row, poss[0]);
            return true;
        } else { 
            for (let i = 0; i < poss.length; i++) {
                if (this.getPossInColForVal(col, poss[i]).length === 1
                    || this.getPossInRowForVal(row, poss[i]).length === 1
                    || this.getPossInSquareForVal(col, row, poss[i]).length === 1) {
                    this.insert(col, row, poss[i]);
                    return true;
                }
            }
        }
    }
    insert(col, row, val) {
        this.solvedPuzzle[row][col] = val;
    }
    //if square empty return true;
    isEmpty(col, row) {
        return this.solvedPuzzle[row][col] === 0;
    }
    //if n is in row return false 
    checkFitsRow(row, val) {
        return this.solvedPuzzle[row].indexOf(val) === -1;
    }
    //if n is in col return false 
    checkFitsCol(col, val) {
        for (let i = 0; i < this.solvedPuzzle.length; i++) {
            if (this.solvedPuzzle[i][col] === val) return false;
        }
        return true;
    }
    //if n is in square return false
    checkFitsSquare = (col, row, val) => {
        let colBounds = this.getBounds(col);
        let rowBounds = this.getBounds(row);
        for (let i = rowBounds[0]; i <= rowBounds[1]; i++) {
            let pos = this.solvedPuzzle[i].indexOf(val);
            if (pos >= colBounds[0] && pos <= colBounds[1]) return false;
        }
        return true;
    }
    //get cords of square
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
        for (let i = 1; i <= this.solvedPuzzle.length; i++) {
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
        for (let i = 0; i < this.solvedPuzzle[row].length; i++) {
            if (this.isEmpty(i, row) === false) continue;
            let cellPoss = this.getPossInCell(i, row);
            if (cellPoss.indexOf(val) !== -1) poss.push([i, row]);
        }
        return poss;
    }
    //get all the possible cells in a col the val can fit
    getPossInColForVal(col, val) {
        let poss = [];
        for (let i = 0; i < this.solvedPuzzle.length; i++) {
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