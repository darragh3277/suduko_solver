//easy puzzle
let puzzle = [
    [2, 6, 9, 0, 0, 0, 0, 0, 0],
    [0, 8, 1, 7, 0, 3, 0, 0, 4],
    [4, 7, 0, 9, 2, 0, 1, 0, 5],
    [6, 9, 4, 0, 5, 0, 2, 0, 0],
    [0, 0, 2, 3, 9, 0, 5, 4, 0],
    [0, 5, 0, 0, 8, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 2, 4, 0, 9],
    [9, 0, 6, 0, 0, 0, 0, 5, 2],
    [7, 0, 0, 5, 0, 9, 3, 0, 0]
];

//hard puzzle
//does not work for this
let puzzle = [
    [9, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 7],
    [5, 0, 0, 0, 0, 0, 3, 0, 4],
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
            if(this.puzzle[i].indexOf(0) !== -1) return false;
        }
        return true;
    }
    solve() {
        if (this.isComplete()) return true;
        for(let row = 0; row < this.puzzle.length; row++){
            for(let col = 0; col < this.puzzle.length; col++){
                if(this.isEmpty(col, row) === false) continue;
                let poss = this.getPossibilities(col, row);
                if (poss.length === 1) this.insert(col, row, poss[0]);
            }
        }
        this.solve();
    }
    insert(col, row, val) {
        this.puzzle[row][col] = val;
    }
    //if square empty return true;
    isEmpty(x, y) {
        return puzzle[y][x] === 0;
    }
    //if n is in row return false 
    checkFitsRow(row, n) {
        return puzzle[row].indexOf(n) === -1;
    }
    //if n is in col return false 
    checkFitsCol(x, n) {
        for (let i = 0; i < puzzle.length; i++) {
            if (puzzle[i][x] === n) return false;
        }
        return true;
    }
    //if n is in square return false
    checkFitsSquare = (x, y, n) => {
        let xbounds = this.getBounds(x);
        let ybounds = this.getBounds(y);
        for (let i = ybounds[0]; i <= ybounds[1]; i++) {
            let pos = puzzle[i].indexOf(n);
            if (pos >= xbounds[0] && pos <= xbounds[1]) return false;
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
    getPossibilities(x, y) {
        let poss = [];
        for (let i = 1; i <= 9; i++){
            if (this.checkFitsRow(y, i) === false) continue;
            if (this.checkFitsCol(x, i) === false) continue;
            if (this.checkFitsSquare(x, y, i) === false) continue;
            poss.push(i);
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
